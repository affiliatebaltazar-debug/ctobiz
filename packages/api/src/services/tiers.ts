import { aiAgents } from "../data/agents";

// ── Subscription tiers ──
// Prices are €/month placeholders — real prices come from Stripe
// (price_data is built from these in the Stripe checkout service).

export type Tier = "starter" | "pro" | "agency";
export type AnalyticsLevel = "basic" | "advanced";

export interface TierLimits {
  name: string;
  price: number; // €/month — placeholder, real price comes from Stripe
  agents: number;
  campaigns: number | "unlimited";
  analytics: AnalyticsLevel;
  automations?: boolean;
  whitelabel?: boolean;
  multiClient?: boolean;
}

export const SUBSCRIPTION_TIERS: Record<Tier, TierLimits> = {
  starter: {
    name: "Starter",
    price: 29, // €/month — placeholder, real price comes from Stripe
    agents: 5,
    campaigns: 1,
    analytics: "basic",
  },
  pro: {
    name: "Pro",
    price: 99,
    agents: 24,
    campaigns: 10,
    analytics: "advanced",
    automations: true,
  },
  agency: {
    name: "Agency",
    price: 299,
    agents: 24,
    campaigns: "unlimited",
    analytics: "advanced",
    automations: true,
    whitelabel: true,
    multiClient: true,
  },
};

/** Default tier applied to new users / downgrades. */
export const DEFAULT_TIER: Tier = "starter";

/** Ordered agent IDs — the first N (per tier `agents` limit) are available at that tier. */
const AGENT_IDS = aiAgents.map((a) => a.id).sort();

/** True if the string is a known tier key. */
export function isTier(value: unknown): value is Tier {
  return typeof value === "string" && value in SUBSCRIPTION_TIERS;
}

/**
 * Returns the limits for a tier. Unknown tiers fall back to starter
 * so a bad value never escalates a user's access.
 */
export function getTierLimits(tier: string | undefined | null): TierLimits {
  return SUBSCRIPTION_TIERS[(tier as Tier) ?? DEFAULT_TIER] ?? SUBSCRIPTION_TIERS[DEFAULT_TIER];
}

/**
 * Checks whether the user can create another campaign at their tier.
 * `currentCount` is the number of campaigns they already have.
 */
export function canCreateCampaign(userTier: string | undefined | null, currentCount: number): boolean {
  const limits = getTierLimits(userTier);
  if (limits.campaigns === "unlimited") return true;
  return currentCount < limits.campaigns;
}

/**
 * Checks whether an agent is available at the given tier.
 * Pro/Agency unlock all agents; Starter gets the first N agents.
 */
export function canRunAgent(userTier: string | undefined | null, agentId: string): boolean {
  const limits = getTierLimits(userTier);
  // 24+ means "all agents available" — both Pro and Agency define 24.
  if (limits.agents >= AGENT_IDS.length) return true;
  return AGENT_IDS.slice(0, limits.agents).includes(agentId);
}
