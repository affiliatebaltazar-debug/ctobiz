import { Hono } from "hono";
import { sqlite } from "../db";
import { enrichLead, scoreLead } from "../services/enrichment";
import { optionalAuth } from "../middleware/auth";
import type { AuthUser } from "../middleware/auth";

const leadsRoute = new Hono();

// ── Timeline event types (must match lead_timeline.event_type enum) ──
export type TimelineEventType =
  | "created"
  | "enriched"
  | "scored"
  | "contacted"
  | "email_sent"
  | "call"
  | "note"
  | "status_change"
  | "follow_up"
  | "proposal"
  | "won"
  | "lost";

export function addTimelineEvent(
  leadId: string,
  eventType: TimelineEventType,
  description: string,
  actor: "system" | "user" = "system",
  userId?: string,
): void {
  try {
    sqlite
      .query(
        `INSERT INTO lead_timeline (id, lead_id, event_type, description, actor, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        crypto.randomUUID(),
        leadId,
        eventType,
        description,
        actor,
        new Date().toISOString(),
      );
  } catch (err) {
    console.error("addTimelineEvent error:", err);
  }
}

// ── DB helpers ──

function getLeadRow(id: string) {
  return sqlite.query("SELECT * FROM leads WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;
}

function parseJson<T = unknown>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw !== "string") return raw as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getRelated<T>(table: string, leadId: string, orderBy = "created_at"): T[] {
  return sqlite
    .query(`SELECT * FROM ${table} WHERE lead_id = ? ORDER BY ${orderBy} DESC`)
    .all(leadId) as T[];
}

/** Build a full enrichment result from stored DB rows (for GET profile). */
function buildStoredScore(lead: Record<string, unknown>) {
  // Recalculate a transparent score from currently stored, real data.
  const contacts = sqlite
    .query("SELECT * FROM lead_contacts WHERE lead_id = ?")
    .all(String(lead.id)) as Array<{ verificationStatus: string; verification_status: string }>;
  const foundContacts = contacts.filter(
    (c) => c.verificationStatus === "found" || c.verification_status === "found",
  ).length;

  const presentFields = [
    lead.website,
    lead.industry,
    lead.country,
    lead.city,
    lead.description,
    lead.companySize,
  ].filter((v) => v != null && v !== "").length;

  const audit = sqlite
    .query("SELECT data, score FROM lead_audit WHERE lead_id = ? AND audit_type = 'website' ORDER BY created_at DESC LIMIT 1")
    .get(String(lead.id)) as { data: string; score: number } | undefined;

  const contactability = Math.min(30, foundContacts * 10);
  const dataCompleteness = Math.round((presentFields / 6) * 30);
  const webPresence = audit ? Math.round((audit.score || 0) * 0.3) : 0;
  const contextFit = 10;
  const total = contactability + dataCompleteness + webPresence + contextFit;

  return {
    total,
    components: {
      contactability: { score: contactability, max: 30, reason: `${foundContacts} pronađenih kontakata.` },
      dataCompleteness: { score: dataCompleteness, max: 30, reason: `${presentFields} od 6 profilnih polja.` },
      webPresence: { score: webPresence, max: 30, reason: audit ? "Web audit obavljen." : "Web stranica nije dostupna." },
      contextFit: { score: contextFit, max: 10, reason: "Osnovna procjena potencijala." },
    },
  };
}

// ── GET / — list leads with optional ?status= filter ──
leadsRoute.get("/", (c) => {
  const status = c.req.query("status");
  if (status) {
    const dbLeads = sqlite
      .query("SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC")
      .all(status);
    return c.json({ leads: dbLeads, total: dbLeads.length });
  }
  const dbLeads = sqlite
    .query("SELECT * FROM leads ORDER BY created_at DESC")
    .all();
  return c.json({ leads: dbLeads, total: dbLeads.length });
});

// ── POST / — create lead ──
leadsRoute.post("/", async (c) => {
  const body = await c.req.json();
  const id = `lead-${Date.now()}`;
  const now = new Date().toISOString();

  const values = {
    id,
    name: body.name || "Nepoznati lead",
    company: body.company || null,
    platform: body.platform || null,
    source: body.source || null,
    interest: body.interest || null,
    problem: body.problem || null,
    offer: body.offer || null,
    priority: body.priority || "medium",
    status: "new",
    website: body.website || null,
    industry: body.industry || null,
    createdAt: now,
    updatedAt: now,
  };

  sqlite
    .query(
      `INSERT INTO leads (id, name, company, platform, source, interest, problem, offer, priority, status, website, industry, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      values.name,
      values.company,
      values.platform,
      values.source,
      values.interest,
      values.problem,
      values.offer,
      values.priority,
      values.status,
      values.website,
      values.industry,
      now,
      now,
    );

  addTimelineEvent(id, "created", `Lead "${values.name}" je kreiran.`);

  return c.json({ ...values }, 201);
});

// ── GET /:id — full lead profile with ALL joined data ──
leadsRoute.get("/:id", (c) => {
  const id = c.req.param("id") ?? "";
  const lead = getLeadRow(id);
  if (!lead) return c.json({ error: "Lead nije pronađen." }, 404);

  const contacts = getRelated("lead_contacts", id).map((r: any) => ({
    ...r,
    verificationStatus: r.verificationStatus ?? r.verification_status ?? "unverified",
  }));
  const socialProfiles = getRelated("lead_social_profiles", id).map((r: any) => ({
    ...r,
    verificationStatus: r.verificationStatus ?? r.verification_status ?? "unverified",
  }));
  const people = getRelated("lead_people", id).map((r: any) => ({
    ...r,
    verificationStatus: r.verificationStatus ?? r.verification_status ?? "unverified",
  }));
  const opportunities = getRelated("lead_opportunities", id);
  const timeline = getRelated("lead_timeline", id).map((r: any) => ({
    ...r,
    eventType: r.eventType ?? r.event_type ?? "note",
  }));
  const notes = getRelated("lead_notes", id).map((r: any) => ({
    ...r,
    userId: r.userId ?? r.user_id ?? null,
  }));
  const auditRows = getRelated("lead_audit", id);

  const score = buildStoredScore(lead);

  const allAudit: Record<string, unknown> = {};
  for (const row of auditRows as any[]) {
    const type = row.auditType ?? row.audit_type ?? "website";
    allAudit[type] = {
      data: parseJson(row.data, null),
      score: row.score ?? 0,
      createdAt: row.createdAt ?? row.created_at,
    };
  }

  const freshness = (lead.dataFreshness as string) || (lead.data_freshness as string) || "stale";

  return c.json({
    lead: {
      ...lead,
      tags: parseJson<string[]>(lead.tags, []),
      dataFreshness: freshness,
    },
    contacts,
    socialProfiles,
    people,
    opportunities,
    timeline,
    notes,
    audit: Object.keys(allAudit).length ? allAudit : null,
    score,
  });
});

// ── POST /:id/enrich — trigger enrichment, store results, return enriched lead ──
leadsRoute.post("/:id/enrich", optionalAuth, async (c) => {
  const id = c.req.param("id") ?? "";
  const lead = getLeadRow(id);
  if (!lead) return c.json({ error: "Lead nije pronađen." }, 404);

  const now = new Date().toISOString();
  const result = await enrichLead(lead);

  // Update lead core fields with real data found (only replace null/empty with found value).
  const updates: [string, string | number | null][] = [];
  const fieldMap: Array<[string, string]> = [
    ["website", "website"],
    ["industry", "industry"],
    ["companySize", "company_size"],
    ["country", "country"],
    ["city", "city"],
    ["address", "address"],
    ["description", "description"],
  ];
  for (const [field, column] of fieldMap) {
    const fieldResult = (result as any)[field] as { value?: string | null; status?: string };
    if (fieldResult?.status === "found" && fieldResult.value) {
      updates.push([column, fieldResult.value]);
    }
  }
  if (result.tags.value && result.tags.status === "found") {
    updates.push(["tags", JSON.stringify(result.tags.value)]);
  }
  updates.push(["last_enriched_at", now]);
  updates.push(["data_freshness", result._meta.hadData ? "fresh" : "stale"]);
  updates.push(["updated_at", now]);

  if (updates.length && updates[updates.length - 1][0] === "updated_at") {
    const setClause = updates.map(([col]) => `${col} = ?`).join(", ");
    sqlite
      .query(`UPDATE leads SET ${setClause} WHERE id = ?`)
      .run(...updates.map(([, v]) => v), id);
  }

  // Store contacts (skip any already stored with same type+value).
  for (const contact of result.contacts) {
    const existing = sqlite
      .query("SELECT id FROM lead_contacts WHERE lead_id = ? AND type = ? AND value = ?")
      .get(id, contact.type, contact.value);
    if (!existing) {
      sqlite
        .query(
          `INSERT INTO lead_contacts (id, lead_id, type, value, label, source, verification_status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(crypto.randomUUID(), id, contact.type, contact.value, contact.label, contact.source, contact.verificationStatus, now, now);
    }
  }

  // Store audit.
  if (result.audit) {
    sqlite
      .query(
        `INSERT INTO lead_audit (id, lead_id, audit_type, data, score, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        crypto.randomUUID(),
        id,
        result.audit.auditType,
        JSON.stringify(result.audit.data),
        result.audit.score,
        now,
        now,
      );
  }

  // Recompute & persist score.
  const scored = scoreLead(lead, result);
  sqlite.query("UPDATE leads SET score = ? WHERE id = ?").run(scored.total, id);

  addTimelineEvent(
    id,
    "enriched",
    result._meta.hadData
      ? `Lead obogaćen podacima sa web stranice (${result._meta.method}).`
      : "Pokušaj obogaćivanja — nema dostupnih podataka (sve not_found).",
  );

  const updated = getLeadRow(id) as Record<string, unknown>;
  return c.json({
    lead: { ...updated, tags: parseJson<string[]>(updated.tags, []) },
    enrichment: result,
    score: scored,
  });
});

// ── POST /:id/score — recalculate lead score from stored data ──
leadsRoute.post("/:id/score", (c) => {
  const id = c.req.param("id") ?? "";
  const lead = getLeadRow(id);
  if (!lead) return c.json({ error: "Lead nije pronađen." }, 404);

  const score = buildStoredScore(lead);
  sqlite.query("UPDATE leads SET score = ?, updated_at = ?").run(
    score.total,
    new Date().toISOString(),
    id,
  );
  addTimelineEvent(id, "scored", `Lead ocijenjen: ${score.total}/100.`);
  return c.json({ leadId: id, score });
});

// ── POST /:id/notes — add note + timeline event ──
leadsRoute.post("/:id/notes", optionalAuth, async (c) => {
  const id = c.req.param("id") ?? "";
  const lead = getLeadRow(id);
  if (!lead) return c.json({ error: "Lead nije pronađen." }, 404);

  const body = await c.req.json();
  if (!body.content || typeof body.content !== "string") {
    return c.json({ error: "Polje 'content' je obavezno." }, 400);
  }
  const user = c.get("user") as AuthUser | undefined;
  const now = new Date().toISOString();
  const noteId = crypto.randomUUID();

  sqlite
    .query(
      `INSERT INTO lead_notes (id, lead_id, user_id, content, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(noteId, id, user?.id ?? null, body.content, now, now);

  addTimelineEvent(id, "note", `Dodana bilješka: ${body.content.slice(0, 80)}${body.content.length > 80 ? "…" : ""}`, "user", user?.id);

  const note = sqlite.query("SELECT * FROM lead_notes WHERE id = ?").get(noteId);
  return c.json({ note }, 201);
});

// ── GET /:id/timeline — get lead timeline ──
leadsRoute.get("/:id/timeline", (c) => {
  const id = c.req.param("id") ?? "";
  const lead = getLeadRow(id);
  if (!lead) return c.json({ error: "Lead nije pronađen." }, 404);

  const timeline = getRelated("lead_timeline", id).map((r: any) => ({
    ...r,
    eventType: r.eventType ?? r.event_type ?? "note",
  }));
  return c.json({ timeline });
});

// ── POST /:id/status — update status + timeline event ──
leadsRoute.post("/:id/status", optionalAuth, async (c) => {
  const id = c.req.param("id") ?? "";
  const lead = getLeadRow(id);
  if (!lead) return c.json({ error: "Lead nije pronađen." }, 404);

  const valid = ["new", "contacted", "qualified", "converted", "rejected"];
  const body = await c.req.json();
  const newStatus = body.status as string;
  if (!valid.includes(newStatus)) {
    return c.json({ error: `Nevažeći status. Dozvoljeno: ${valid.join(", ")}` }, 400);
  }
  const oldStatus = (lead.status as string) || "new";
  const now = new Date().toISOString();

  sqlite
    .query("UPDATE leads SET status = ?, updated_at = ? WHERE id = ?")
    .run(newStatus, now, id);

  addTimelineEvent(id, "status_change", `Status promijenjen: ${oldStatus} → ${newStatus}.`, "user");
  if (newStatus === "contacted") addTimelineEvent(id, "contacted", "Lead kontaktiran.");

  return c.json({ leadId: id, oldStatus, status: newStatus });
});

export default leadsRoute;
