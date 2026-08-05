import type { Context, Next } from "hono";
import { sqlite } from "../db";
import type { AuthUser } from "./auth";
import {
  canCreateCampaign,
  canRunAgent,
  getTierLimits,
  isTier,
  type Tier,
} from "../services/tiers";

/** Context variable name used to expose the resolved tier to handlers. */
export const TIER_CONTEXT_KEY = "userTier";

const UPGRADE_MESSAGE =
  "Vaš plan ne podržava ovu funkciju. Nadogradite pretplatu u Postavke → Pretplata.";

/** Reads the current tier directly from the users table (always fresh). */
export function getUserTier(userId: string): Tier {
  const row = sqlite
    .query("SELECT tier FROM users WHERE id = ?")
    .get(userId) as { tier: string } | undefined;
  return row && isTier(row.tier) ? row.tier : "starter";
}

/**
 * Middleware factory — rejects with 403 unless the user's tier is in the
 * allowed list. Requires the auth middleware to have run first.
 *
 *   // Example: only Pro and Agency may run automations
 *   automationRoute.use("*", requireTier("pro", "agency"));
 */
export function requireTier(...tiers: Tier[]) {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as AuthUser | undefined;
    if (!user) {
      return c.json({ error: "Autentifikacija je obavezna." }, 401);
    }

    const tier = getUserTier(user.id);
    if (!tiers.includes(tier)) {
      return c.json({ error: UPGRADE_MESSAGE, code: "TIER_FORBIDDEN", requiredTiers: tiers }, 403);
    }

    c.set(TIER_CONTEXT_KEY, tier);
    await next();
  };
}

/**
 * Middleware for POST /api/v1/campaigns — blocks campaign creation when the
 * user's tier campaign limit is reached (Starter: 1, Pro: 10, Agency: ∞).
 */
export async function checkCampaignLimit(c: Context, next: Next) {
  const user = c.get("user") as AuthUser | undefined;
  if (!user) {
    return c.json({ error: "Autentifikacija je obavezna." }, 401);
  }

  const tier = getUserTier(user.id);
  const limits = getTierLimits(tier);

  // NOTE: marketing_campaigns has no user_id column yet, so the count is
  // global. When campaigns become user-scoped, filter by user_id here.
  const row = sqlite
    .query("SELECT COUNT(*) AS count FROM marketing_campaigns")
    .get() as { count: number };
  const currentCount = row?.count ?? 0;

  if (!canCreateCampaign(tier, currentCount)) {
    const label = limits.campaigns === "unlimited" ? "neograničeno" : String(limits.campaigns);
    return c.json(
      {
        error: `Dosegnuli ste limit kampanja za ${limits.name} plan (${label}). Nadogradite pretplatu.`,
        code: "CAMPAIGN_LIMIT_REACHED",
        limit: limits.campaigns,
        current: currentCount,
      },
      403,
    );
  }

  c.set(TIER_CONTEXT_KEY, tier);
  await next();
}

/**
 * Middleware for POST /api/v1/agents/:id/run — blocks running agents that
 * are not available on the user's tier (Starter gets the first 5 agents,
 * Pro/Agency get all 24). Requires auth middleware to have run first.
 */
export async function checkAgentAccess(c: Context, next: Next) {
  const user = c.get("user") as AuthUser | undefined;
  if (!user) {
    return c.json({ error: "Autentifikacija je obavezna." }, 401);
  }

  const tier = getUserTier(user.id);
  const agentId = c.req.param("id") ?? "";

  if (!canRunAgent(tier, agentId)) {
    return c.json(
      {
        error: `Ovaj agent nije dostupan na ${getTierLimits(tier).name} planu. Nadogradite pretplatu.`,
        code: "AGENT_NOT_AVAILABLE",
        tier,
      },
      403,
    );
  }

  c.set(TIER_CONTEXT_KEY, tier);
  await next();
}
