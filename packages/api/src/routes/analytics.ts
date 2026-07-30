import { Hono } from "hono";

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

export default analyticsRoute;
