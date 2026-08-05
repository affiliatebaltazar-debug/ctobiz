import { Hono } from "hono";
import { sqlite } from "../db";
import { authMiddleware, type AuthUser } from "../middleware/auth";
import {
  createCheckoutSession,
  isStripeConfigured,
  STRIPE_NOT_CONFIGURED,
  verifyWebhook,
} from "../services/stripe";
import { getTierLimits, isTier, type Tier } from "../services/tiers";

const billingRoute = new Hono();

/**
 * Maps a Stripe subscription status to our internal subscription_status.
 */
function mapStripeStatus(status: string): "active" | "past_due" | "canceled" | "inactive" {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      return "inactive";
  }
}

interface SubscriptionRow {
  tier: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string;
  subscription_current_period_end: string | null;
}

/** Reads the billing columns for a user (defaults to starter/inactive). */
function getSubscriptionRow(userId: string): SubscriptionRow {
  const row = sqlite
    .query(
      `SELECT tier, stripe_customer_id, stripe_subscription_id,
              subscription_status, subscription_current_period_end
       FROM users WHERE id = ?`,
    )
    .get(userId) as SubscriptionRow | undefined;

  return (
    row ?? {
      tier: "starter",
      stripe_customer_id: null,
      stripe_subscription_id: null,
      subscription_status: "inactive",
      subscription_current_period_end: null,
    }
  );
}

// ── POST /api/v1/billing/checkout ──
// Creates a Stripe Checkout Session for the requested tier.
// Returns { url } — the client redirects the browser to Stripe's hosted page.
billingRoute.post("/checkout", authMiddleware, async (c) => {
  const user = c.get("user") as AuthUser;
  let body: { tier?: unknown; successUrl?: unknown; cancelUrl?: unknown };

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Neispravno JSON tijelo." }, 400);
  }

  const { tier, successUrl, cancelUrl } = body;

  if (!isTier(tier)) {
    return c.json({ error: "Nepoznat plan pretplate. Dopušteno: starter, pro, agency." }, 400);
  }
  if (typeof successUrl !== "string" || !successUrl.startsWith("http")) {
    return c.json({ error: "successUrl mora biti važeći HTTP URL." }, 400);
  }
  if (typeof cancelUrl !== "string" || !cancelUrl.startsWith("http")) {
    return c.json({ error: "cancelUrl mora biti važeći HTTP URL." }, 400);
  }

  try {
    const url = await createCheckoutSession(user.id, tier, successUrl, cancelUrl);
    return c.json({ url, tier });
  } catch (err: any) {
    if (err?.message === STRIPE_NOT_CONFIGURED) {
      return c.json({ error: STRIPE_NOT_CONFIGURED }, 503);
    }
    console.error("Create checkout session error:", err);
    return c.json({ error: "Greška pri kreiranju naplate." }, 500);
  }
});

// ── GET /api/v1/billing/subscription ──
// Returns the current user's subscription state + tier limits.
billingRoute.get("/subscription", authMiddleware, (c) => {
  const user = c.get("user") as AuthUser;
  const row = getSubscriptionRow(user.id);
  const tier = isTier(row.tier) ? row.tier : "starter";

  return c.json({
    tier,
    status: row.subscription_status,
    currentPeriodEnd: row.subscription_current_period_end,
    stripeCustomerId: row.stripe_customer_id,
    subscriptionId: row.stripe_subscription_id,
    plan: getTierLimits(tier),
    stripeConfigured: isStripeConfigured(),
  });
});

// ── POST /api/v1/billing/webhook ──
// Stripe calls this with signed events. No auth middleware — the
// stripe-signature header is the authentication.
billingRoute.post("/webhook", async (c) => {
  const signature = c.req.header("stripe-signature");
  if (!signature) {
    return c.json({ error: "Nedostaje Stripe potpis (stripe-signature)." }, 400);
  }

  const rawBody = await c.req.text();

  let event: any;
  try {
    const valid = await verifyWebhook(rawBody, signature);
    if (!valid) {
      return c.json({ error: "Neispravan Stripe potpis." }, 401);
    }
    event = JSON.parse(rawBody);
  } catch (err: any) {
    if (err?.message === STRIPE_NOT_CONFIGURED) {
      return c.json({ error: STRIPE_NOT_CONFIGURED }, 503);
    }
    console.error("Webhook verification error:", err);
    return c.json({ error: "Neispravan Stripe potpis." }, 401);
  }

  try {
    const data = event?.data?.object ?? {};
    switch (event?.type) {
      // Payment succeeded → activate subscription
      case "checkout.session.completed": {
        const userId: string | undefined =
          data.client_reference_id || data.metadata?.userId;
        const tier: Tier = isTier(data.metadata?.tier) ? data.metadata.tier : "starter";
        const subscriptionId: string | null =
          typeof data.subscription === "string" ? data.subscription : null;
        const customerId: string | null =
          typeof data.customer === "string" ? data.customer : null;

        if (userId) {
          sqlite
            .query(
              `UPDATE users
               SET tier = ?, stripe_subscription_id = ?, stripe_customer_id = ?,
                   subscription_status = 'active'
               WHERE id = ?`,
            )
            .run(tier, subscriptionId, customerId, userId);
          console.log(`[billing] checkout completed — user ${userId} → ${tier}`);
        }
        break;
      }

      // Subscription state changed (created, renewed, past_due, canceled…) → mirror status
      case "customer.subscription.updated": {
        const subscriptionId: string | undefined = data.id;
        const status = mapStripeStatus(data.status);
        const periodEnd =
          typeof data.current_period_end === "number"
            ? new Date(data.current_period_end * 1000).toISOString()
            : null;
        const tierFromMetadata: unknown = data.metadata?.tier;

        if (subscriptionId) {
          const tierSql = isTier(tierFromMetadata)
            ? sqlite.query(
                `UPDATE users
                 SET subscription_status = ?, subscription_current_period_end = ?, tier = ?
                 WHERE stripe_subscription_id = ?`,
              )
            : sqlite.query(
                `UPDATE users
                 SET subscription_status = ?, subscription_current_period_end = ?
                 WHERE stripe_subscription_id = ?`,
              );

          tierSql.run(
            ...(isTier(tierFromMetadata)
              ? [status, periodEnd, tierFromMetadata, subscriptionId]
              : [status, periodEnd, subscriptionId]),
          );
          console.log(`[billing] subscription updated — ${subscriptionId} → ${status}`);
        }
        break;
      }

      // Subscription deleted/canceled → downgrade to starter
      case "customer.subscription.deleted": {
        const subscriptionId: string | undefined = data.id;
        if (subscriptionId) {
          sqlite
            .query(
              `UPDATE users
               SET tier = 'starter', subscription_status = 'inactive',
                   stripe_subscription_id = NULL, subscription_current_period_end = NULL
               WHERE stripe_subscription_id = ?`,
            )
            .run(subscriptionId);
          console.log(`[billing] subscription deleted — ${subscriptionId} → starter`);
        }
        break;
      }

      default:
        // Acknowledge other event types (payment_intent.*, invoice.*, …) silently.
        break;
    }

    return c.json({ received: true });
  } catch (err) {
    console.error("Webhook handling error:", err);
    return c.json({ error: "Greška pri obradi webhooka." }, 500);
  }
});

export default billingRoute;
