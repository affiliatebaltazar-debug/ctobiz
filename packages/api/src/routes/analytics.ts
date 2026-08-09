import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { requireTier } from "../middleware/tiers";

const analyticsRoute = new Hono();

// GET /overview — return dashboard KPIs
analyticsRoute.get("/overview", (c) => {
  return c.json({
    totalLeads: 847,
    totalLeadsChange: 12.5,
    activeCampaigns: 12,
    activeCampaignsChange: 8.3,
    contentPublished: 156,
    contentPublishedChange: 24.1,
    conversionRate: 3.2,
    conversionRateChange: -0.8,
    revenue: 45600,
    revenueChange: 18.7,
    // Platform breakdown
    platforms: [
      { name: "Facebook", views: 45200, clicks: 2100, engagement: 3.8, conversions: 89 },
      { name: "Instagram", views: 38400, clicks: 1800, engagement: 5.2, conversions: 67 },
      { name: "X", views: 12100, clicks: 540, engagement: 2.1, conversions: 23 },
      { name: "Reddit", views: 8900, clicks: 320, engagement: 4.5, conversions: 12 },
      { name: "Google Ads", views: 23400, clicks: 3100, engagement: 2.8, conversions: 156 },
      { name: "TikTok", views: 56200, clicks: 890, engagement: 7.2, conversions: 34 },
      { name: "YouTube", views: 18900, clicks: 430, engagement: 3.1, conversions: 28 },
    ],
    // Agent performance
    topAgents: [
      { name: "AI Direktor Marketinga", tasksCompleted: 245, successRate: 98.4 },
      { name: "Google Ads Stručnjak", tasksCompleted: 189, successRate: 96.2 },
      { name: "SEO Stručnjak", tasksCompleted: 167, successRate: 94.8 },
      { name: "Facebook Marketing Stručnjak", tasksCompleted: 156, successRate: 97.1 },
      { name: "Lovac na Leadove", tasksCompleted: 134, successRate: 91.5 },
    ],
    // Recent activity
    recentActivity: [
      {
        type: "campaign_launched",
        message: "Kampanja 'Ljetna akcija 2026' je aktivna",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        type: "lead_captured",
        message: "Novi lead: Marko Novak (StartupHub)",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        type: "content_published",
        message: "Objavljen novi TikTok video — 12K pregleda",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        type: "agent_completed",
        message: "SEO Stručnjak završio audit web stranice",
        timestamp: new Date(Date.now() - 14400000).toISOString(),
      },
      {
        type: "optimization",
        message: "Google Ads kampanja optimizirana — CTR +15%",
        timestamp: new Date(Date.now() - 18000000).toISOString(),
      },
    ],
  });
});

// GET /advanced — advanced analytics (Pro & Agency only)
analyticsRoute.get("/advanced", authMiddleware, requireTier("pro", "agency"), (c) => {
  return c.json({
    level: "advanced",
    // Funnel analysis
    funnel: {
      impressions: 284200,
      clicks: 9180,
      leads: 1247,
      conversions: 389,
      conversionRateByStage: [
        { stage: "Pregledi", value: 284200, rate: 100 },
        { stage: "Klikovi", value: 9180, rate: 3.2 },
        { stage: "Leadovi", value: 1247, rate: 13.6 },
        { stage: "Konverzije", value: 389, rate: 31.2 },
      ],
    },
    // ROAS by channel
    roasByChannel: [
      { channel: "Google Ads", spend: 8400, revenue: 27600, roas: 3.3 },
      { channel: "Facebook", spend: 5200, revenue: 14800, roas: 2.8 },
      { channel: "Instagram", spend: 4600, revenue: 12900, roas: 2.8 },
      { channel: "TikTok", spend: 2900, revenue: 6800, roas: 2.3 },
    ],
    // Cohort retention
    cohortRetention: [
      { cohort: "Siječanj", month1: 62, month2: 48, month3: 41 },
      { cohort: "Veljača", month1: 65, month2: 52, month3: 44 },
      { cohort: "Ožujak", month1: 61, month2: 47, month3: null },
    ],
    // Cost per acquisition trend
    cpaTrend: [
      { month: "Svi", cpa: 21.6 },
      { month: "Lip", cpa: 19.4 },
      { month: "Srp", cpa: 18.2 },
    ],
  });
});

export default analyticsRoute;
