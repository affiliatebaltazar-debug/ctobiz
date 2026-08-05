import { Hono } from "hono";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";
import { authMiddleware, type AuthUser } from "../middleware/auth";
import { checkCampaignLimit } from "../middleware/tiers";

const campaignsRoute = new Hono();

// Mock campaign data (fallback when the DB is empty)
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

/** Serializes a DB row to the API shape. */
function toApiCampaign(row: typeof schema.marketingCampaigns.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    platform: row.platform,
    objective: row.objective,
    budget: row.budget,
    targetAudience: row.targetAudience ? JSON.parse(row.targetAudience) : null,
    keywords: row.keywords ? JSON.parse(row.keywords) : [],
    status: row.status,
    results: row.results ? JSON.parse(row.results) : null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// GET / — list all campaigns (DB first, mock fallback)
campaignsRoute.get("/", (c) => {
  const status = c.req.query("status");

  try {
    const rows = status
      ? db.select().from(schema.marketingCampaigns).where(eq(schema.marketingCampaigns.status, status as any)).all()
      : db.select().from(schema.marketingCampaigns).all();

    if (rows.length > 0) {
      return c.json({ campaigns: rows.map(toApiCampaign), total: rows.length });
    }
  } catch {
    // DB empty or unavailable — fall back to mock data
  }

  let filtered = mockCampaigns;
  if (status) {
    filtered = mockCampaigns.filter((c) => c.status === status);
  }
  return c.json({ campaigns: filtered, total: filtered.length });
});

// POST / — create campaign (auth required; tier campaign limit enforced)
campaignsRoute.post("/", authMiddleware, checkCampaignLimit, async (c) => {
  const user = c.get("user") as AuthUser;
  const body = await c.req.json();

  const id = `camp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();

  const campaign = {
    id,
    name: body.name || "Nova kampanja",
    platform: body.platform || "Facebook",
    objective: body.objective || "Prodaja",
    budget: body.budget || 0,
    targetAudience: body.targetAudience ? JSON.stringify(body.targetAudience) : null,
    keywords: body.keywords ? JSON.stringify(body.keywords) : null,
    status: "draft" as const,
    results: null,
    createdAt: now,
    updatedAt: now,
  };

  try {
    db.insert(schema.marketingCampaigns).values(campaign).run();
  } catch (err) {
    console.error("Insert campaign error:", err);
  }

  return c.json(
    {
      id,
      name: campaign.name,
      platform: campaign.platform,
      objective: campaign.objective,
      budget: campaign.budget,
      targetAudience: body.targetAudience || null,
      keywords: body.keywords || [],
      status: "draft",
      results: null,
      createdAt: now,
      updatedAt: now,
      createdBy: user.id,
    },
    201,
  );
});

// GET /:id — get campaign details
campaignsRoute.get("/:id", (c) => {
  const id = c.req.param("id");

  try {
    const row = db.select().from(schema.marketingCampaigns).where(eq(schema.marketingCampaigns.id, id)).get();
    if (row) return c.json(toApiCampaign(row));
  } catch {
    // fall through to mock
  }

  const campaign = mockCampaigns.find((c) => c.id === id);
  if (!campaign) {
    return c.json({ error: "Campaign not found" }, 404);
  }
  return c.json(campaign);
});

export default campaignsRoute;
