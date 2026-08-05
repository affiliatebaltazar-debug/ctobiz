import { sqlite } from "../db";
import { getTierLimits, isTier, type Tier } from "./tiers";

// ── Stripe configuration ──
// All functions degrade gracefully: when STRIPE_SECRET_KEY is missing they
// throw StripeNotConfiguredError with the message "Stripe nije konfiguriran",
// which routes translate to a 503 so the rest of the API keeps working.

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const STRIPE_API = "https://api.stripe.com/v1";

export const STRIPE_NOT_CONFIGURED = "Stripe nije konfiguriran";

export class StripeNotConfiguredError extends Error {
  constructor() {
    super(STRIPE_NOT_CONFIGURED);
    this.name = "StripeNotConfiguredError";
  }
}

export function isStripeConfigured(): boolean {
  return Boolean(STRIPE_SECRET_KEY);
}

/** Throw if the Stripe secret key is not set. */
function requireStripe(): void {
  if (!STRIPE_SECRET_KEY) {
    throw new StripeNotConfiguredError();
  }
}

/** Helper for form-encoded POST bodies against the Stripe API. */
async function stripePost(path: string, params: Record<string, string>): Promise<any> {
  requireStripe();
  const body = new URLSearchParams(params);
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error?.message || `Stripe API greška (${res.status})`;
    throw new Error(message);
  }
  return data;
}

/** Stripe customer row shape we persist on the users table. */
interface UserBillingRow {
  id: string;
  email: string;
  stripe_customer_id: string | null;
}

/**
 * Gets (or lazily creates) the Stripe customer for a user and stores the
 * customer id on the users row so we don't create duplicates.
 */
export async function getStripeCustomer(userId: string): Promise<string> {
  requireStripe();

  const user = sqlite
    .query("SELECT id, email, stripe_customer_id FROM users WHERE id = ?")
    .get(userId) as UserBillingRow | undefined;

  if (!user) throw new Error("Korisnik nije pronađen");
  if (user.stripe_customer_id) return user.stripe_customer_id;

  const customer = await stripePost("/customers", {
    email: user.email,
    "metadata[userId]": userId,
  });

  const customerId: string = customer.id;
  sqlite
    .query("UPDATE users SET stripe_customer_id = ? WHERE id = ?")
    .run(customerId, userId);

  return customerId;
}

/**
 * Creates a Stripe Checkout Session for a subscription to the given tier.
 * Prices are inline (price_data from the tier definition) so no pre-created
 * Stripe price ids are required — swap to price ids when real Stripe prices
 * are configured. Returns the hosted checkout URL.
 */
export async function createCheckoutSession(
  userId: string,
  tier: Tier,
  successUrl: string,
  cancelUrl: string,
): Promise<string> {
  requireStripe();

  if (!isTier(tier)) throw new Error("Nepoznat plan pretplate");
  const limits = getTierLimits(tier);

  const customerId = await getStripeCustomer(userId);

  const session = await stripePost("/checkout/sessions", {
    mode: "subscription",
    customer: customerId,
    client_reference_id: userId,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(Math.round(limits.price * 100)),
    "line_items[0][price_data][recurring][interval]": "month",
    "line_items[0][price_data][product_data][name]": `Base44 — ${limits.name} plan`,
    "line_items[0][price_data][product_data][description]":
      `AI Growth Command Center · ${limits.name} pretplata`,
    "subscription_data[metadata][tier]": tier,
    "subscription_data[metadata][userId]": userId,
    "metadata[tier]": tier,
    "metadata[userId]": userId,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session.url as string;
}

/**
 * Verifies a Stripe webhook signature (HMAC-SHA256 over `t.<payload>`).
 * Returns true when the signature is valid and recent (within ±5 min).
 * Throws StripeNotConfiguredError when no webhook secret is set.
 */
export async function verifyWebhook(body: string, signature: string): Promise<boolean> {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new StripeNotConfiguredError();
  }

  const parts = signature.split(",").map((p) => p.trim());
  const timestamp = parts.find((p) => p.startsWith("t="))?.slice(2);
  const v1 = parts.find((p) => p.startsWith("v1="))?.slice(3);

  if (!timestamp || !v1) return false;

  // Reject signatures older than 5 minutes (replay protection)
  const ageSeconds = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(STRIPE_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${body}`),
  );

  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison
  if (expected.length !== v1.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ v1.charCodeAt(i);
  }
  return diff === 0;
}
