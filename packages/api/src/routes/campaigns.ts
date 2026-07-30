import { Hono } from "hono";

const campaignsRoute = new Hono();

// Mock campaign data
const mockCampaigns = [
  {
    id: "camp-001",
    name: "Ljetna akcija 2026",
    platform: "Facebook",
    objective: "Prodaja",
    budget: 5000,
    targetAudience: { age: "25-45", interests: ["moda", "lifestyle"] },
    keywords: ["ljeto", "akcija", "popust"],
    status: "active",
    results: { impressions: 125000, clicks: 3200, conversions: 145 },
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-07-20T14:30:00Z",
  },
  {
    id: "camp-002",
    name: "Brend awareness Q3",
    platform: "Instagram",
    objective: "Svijest o brendu",
    budget: 3500,
    targetAudience: { age: "18-35", interests: ["tehnologija", "gaming"] },
    keywords: ["brand", "tech", "inovacija"],
    status: "draft",
    results: null,
    createdAt: "2026-07-01T08:00:00Z",
    updatedAt: "2026-07-19T09:15:00Z",
  },
  {
    id: "camp-003",
    name: "Google Search kampanja",
    platform: "Google Ads",
    objective: "Lead generacija",
    budget: 8000,
    targetAudience: { keywords: ["marketing automatizacija", "AI alati"] },
    keywords: ["marketing", "automatizacija", "AI"],
    status: "active",
    results: { impressions: 89000, clicks: 4100, conversions: 320 },
    createdAt: "2026-05-20T12:00:00Z",
    updatedAt: "2026-07-21T16:45:00Z",
  },
];

// GET / — list all campaigns
campaignsRoute.get("/", (c) => {
  const status = c.req.query("status");
  let filtered = mockCampaigns;
  if (status) {
    filtered = mockCampaigns.filter((c) => c.status === status);
  }
  return c.json({ campaigns: filtered, total: filtered.length });
});

// POST / — create campaign
campaignsRoute.post("/", async (c) => {
  const body = await c.req.json();
  const newCampaign = {
    id: `camp-${Date.now()}`,
    name: body.name || "Nova kampanja",
    platform: body.platform || "Facebook",
    objective: body.objective || "Prodaja",
    budget: body.budget || 0,
    targetAudience: body.targetAudience || null,
    keywords: body.keywords || [],
    status: "draft",
    results: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return c.json(newCampaign, 201);
});

// GET /:id — get campaign details
campaignsRoute.get("/:id", (c) => {
  const id = c.req.param("id");
  const campaign = mockCampaigns.find((c) => c.id === id);
  if (!campaign) {
    return c.json({ error: "Campaign not found" }, 404);
  }
  return c.json(campaign);
});

export default campaignsRoute;
