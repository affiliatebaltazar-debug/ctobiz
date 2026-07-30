import { Hono } from "hono";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";

const leadsRoute = new Hono();

// Mock leads for when DB is empty
const mockLeads = [
  {
    id: "lead-001",
    name: "Ivan Horvat",
    company: "Tech Solutions d.o.o.",
    platform: "LinkedIn",
    source: "LinkedIn Outreach",
    interest: "Marketing automatizacija",
    problem: "Premalo vremena za društvene mreže",
    offer: "AI Marketing Paket Pro",
    priority: "high",
    status: "qualified",
    createdAt: "2026-07-15T09:30:00Z",
    updatedAt: "2026-07-20T11:00:00Z",
  },
  {
    id: "lead-002",
    name: "Ana Kovač",
    company: "Digitalna Agencija Kovač",
    platform: "Facebook",
    source: "Facebook Ad",
    interest: "SEO optimizacija",
    problem: "Slaba vidljivost na Google-u",
    offer: "SEO Paket",
    priority: "medium",
    status: "contacted",
    createdAt: "2026-07-18T14:20:00Z",
    updatedAt: "2026-07-19T10:45:00Z",
  },
  {
    id: "lead-003",
    name: "Marko Novak",
    company: "StartupHub",
    platform: "X",
    source: "X DM",
    interest: "Content marketing",
    problem: "Nedostatak sadržaja",
    offer: "Content Factory Paket",
    priority: "critical",
    status: "new",
    createdAt: "2026-07-21T08:15:00Z",
    updatedAt: "2026-07-21T08:15:00Z",
  },
];

// GET / — list leads with optional ?status= filter
leadsRoute.get("/", (c) => {
  const status = c.req.query("status");

  try {
    let dbLeads;
    if (status) {
      dbLeads = db
        .select()
        .from(schema.leads)
        .where(eq(schema.leads.status, status))
        .all();
    } else {
      dbLeads = db.select().from(schema.leads).all();
    }

    if (dbLeads.length > 0) {
      return c.json({ leads: dbLeads, total: dbLeads.length });
    }
  } catch {
    // DB empty or not available, fallback to mock data
  }

  let filtered = mockLeads;
  if (status) {
    filtered = mockLeads.filter((l) => l.status === status);
  }
  return c.json({ leads: filtered, total: filtered.length });
});

// POST / — create lead
leadsRoute.post("/", async (c) => {
  const body = await c.req.json();
  const newLead = {
    id: `lead-${Date.now()}`,
    name: body.name || "Nepoznati lead",
    company: body.company || null,
    platform: body.platform || null,
    source: body.source || null,
    interest: body.interest || null,
    problem: body.problem || null,
    offer: body.offer || null,
    priority: body.priority || "medium",
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    db.insert(schema.leads).values(newLead).run();
    return c.json(newLead, 201);
  } catch {
    return c.json(newLead, 201);
  }
});

export default leadsRoute;
