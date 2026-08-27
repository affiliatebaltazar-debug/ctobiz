import { Hono } from "hono";
import { sqlite } from "../db";
import { chat } from "../services/ai";
import { optionalAuth } from "../middleware/auth";
import type { AuthUser } from "../middleware/auth";
import { addTimelineEvent } from "./leads";

const leadActionsRoute = new Hono();

// ─────────────────────────────────────────────────────────────────────────────
// Lead Actions — AI-assisted outreach generation.
// CRITICAL (owner rule): AI uses ONLY real, found data about the lead. If there
// is no real data, we return a neutral template — never fabricated facts.
// ─────────────────────────────────────────────────────────────────────────────

function loadLead(id: string): Record<string, unknown> | undefined {
  return sqlite.query("SELECT * FROM leads WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;
}

function loadRealContext(id: string): {
  realFields: Record<string, string>;
  realContacts: Array<{ type: string; value: string; label: string }>;
  realPeople: Array<{ name: string; position: string | null }>;
  realOpportunities: Array<{ service: string; why: string }>;
} {
  const lead = (sqlite.query("SELECT * FROM leads WHERE id = ?").get(id) as Record<string, unknown>) || {};

  const realFields: Record<string, string> = {};
  for (const key of ["company", "name", "website", "industry", "companySize", "country", "city", "description", "interest", "problem"]) {
    const v = lead[key];
    if (v != null && String(v).trim()) realFields[key] = String(v).trim();
  }

  const contacts = (sqlite
    .query(
      `SELECT type, value, label FROM lead_contacts
       WHERE lead_id = ? AND verification_status IN ('found','verified')`,
    )
    .all(id) as Array<{ type: string; value: string; label: string }>) || [];

  const people = (sqlite
    .query(
      `SELECT name, position FROM lead_people
       WHERE lead_id = ? AND verification_status IN ('found','verified')`,
    )
    .all(id) as Array<{ name: string; position: string | null }>) || [];

  const opportunities = (sqlite
    .query("SELECT service, why FROM lead_opportunities WHERE lead_id = ?")
    .all(id) as Array<{ service: string; why: string }>) || [];

  return { realFields, realContacts: contacts, realPeople: people, realOpportunities: opportunities };
}

function hasRealData(ctx: ReturnType<typeof loadRealContext>): boolean {
  return (
    Object.keys(ctx.realFields).length > 0 ||
    ctx.realContacts.length > 0 ||
    ctx.realPeople.length > 0 ||
    ctx.realOpportunities.length > 0
  );
}

function contextSummary(ctx: ReturnType<typeof loadRealContext>): string {
  const parts: string[] = [];
  if (ctx.realFields.company) parts.push(`Tvrtka: ${ctx.realFields.company}`);
  if (ctx.realFields.name) parts.push(`Osoba/lead: ${ctx.realFields.name}`);
  if (ctx.realFields.website) parts.push(`Web: ${ctx.realFields.website}`);
  if (ctx.realFields.industry) parts.push(`Industrija: ${ctx.realFields.industry}`);
  if (ctx.realFields.country) parts.push(`Zemlja: ${ctx.realFields.country}`);
  if (ctx.realFields.city) parts.push(`Grad: ${ctx.realFields.city}`);
  if (ctx.realFields.description) parts.push(`Opis: ${ctx.realFields.description}`);
  if (ctx.realFields.interest) parts.push(`Interes: ${ctx.realFields.interest}`);
  if (ctx.realFields.problem) parts.push(`Problem: ${ctx.realFields.problem}`);
  for (const p of ctx.realPeople) parts.push(`Osoba (${p.position || "nepoznata pozicija"}): ${p.name}`);
  for (const op of ctx.realOpportunities) parts.push(`Potencijalna prilika (${op.service}): ${op.why}`);
  return parts.length ? parts.join("\n") : "Nema dostupnih stvarnih podataka o ovom leadu.";
}

async function runAi(systemPrompt: string, content: string): Promise<string | null> {
  try {
    return await chat(systemPrompt, content);
  } catch {
    return null; // AI not configured or failed → caller falls back to template
  }
}

const NO_DATA_NOTE =
  "\n\n(Napomena: nemamo dovoljno stvarnih podataka o ovom leadu pa je ovo neutralan predložak koji treba personalizirati prije slanja.)";

// ── POST /:id/actions/generate-message ──
leadActionsRoute.post("/:id/actions/generate-message", optionalAuth, async (c) => {
  const id = c.req.param("id") ?? "";
  const lead = loadLead(id);
  if (!lead) return c.json({ error: "Lead nije pronađen." }, 404);

  const body = (await c.req.json().catch(() => ({}))) as { channel?: string };
  const channel = body.channel || "email";
  const validChannels = ["email", "linkedin", "whatsapp", "sms", "instagram"];
  if (!validChannels.includes(channel)) {
    return c.json({ error: `Nevažeći kanal. Dozvoljeno: ${validChannels.join(", ")}` }, 400);
  }

  const ctx = loadRealContext(id);
  const hasData = hasRealData(ctx);

  // Neutral template (used when no real data or no AI).
  const name = (ctx.realFields.name as string) || "korisniče";
  const company = (ctx.realFields.company as string) || "";
  const neutral = `Poštovani/a ${name}${company ? ` iz tvrtke ${company}` : ""},

Želimo vam se obratiti povodom mogućnosti suradnje. Budući da trenutno nemamo dovoljno javno dostupnih podataka o vašoj tvrtki, poslat ćemo vam neutralan, informativan predložak koji se može dodatno personalizirati.

Ako ste zainteresirani za unapređenje vaše marketing prisutnosti ili digitalnog poslovanja, rado bismo se čuli i razgovarali o tome kako vam možemo pomoći. Javite nam se kada vama odgovara.

Srdačan pozdrav,` + `${hasData ? "" : NO_DATA_NOTE}`;

  let message = neutral;

  if (hasData) {
    const aiSystem =
      "Napiši kratku, profesionalnu poruku za one-to-one outreach na hrvatskom jeziku. " +
      "Koristi SAMO podatke navedene u 'STVARNI PODACI'. NIKADA ne izmišljaj imena, pozicije, " +
      "interese ili bilo kakve činjenice. Ako je podataka malo, ostani na neutralnom, općenitom tonu " +
      "bez konkretnih neprovjerenih tvrdnji. Max 100 riječi.";
    const aiMsg = await runAi(aiSystem, `Kanal: ${channel}\nSTVARNI PODACI:\n${contextSummary(ctx)}`);
    if (aiMsg) message = aiMsg;
  }

  return c.json({
    leadId: id,
    channel,
    hasRealData: hasData,
    message,
    basedOn: ctx,
  });
});

// ── POST /:id/actions/generate-outreach — complete one-click package ──
leadActionsRoute.post("/:id/actions/generate-outreach", optionalAuth, async (c) => {
  const id = c.req.param("id") ?? "";
  const lead = loadLead(id);
  if (!lead) return c.json({ error: "Lead nije pronađen." }, 404);

  const ctx = loadRealContext(id);
  const hasData = hasRealData(ctx);
  const name = (ctx.realFields.name as string) || "korisniče";
  const company = (ctx.realFields.company as string) || "";
  const opp = ctx.realOpportunities[0];

  // Build a structured package. AI refines it when real data + AI available,
  // otherwise we produce an honest neutral package.
  let packageResult: Record<string, string>;

  const neutralPackage: Record<string, string> = {
    summary: `Lead: ${ctx.realFields.name || "Nepoznato"}${company ? ` (${company})` : ""}. Javno dostupnih podataka trenutno nedostaje.`,
    opportunity: opp
      ? `${opp.service} — ${opp.why}`
      : "Potencijalna prilika još nije identificirana zbog nedostatka podataka.",
    offer: "Uvodna analiza i personalizirana strategija bez obveze.",
    email1: `Poštovani/a ${name}, želimo vam ponuditi besplatnu uvodnu analizu vaše digitalne prisutnosti. Javite nam se kada vam odgovara.`,
    email2: `Poštovani/a ${name}, šaljemo podsjetnik na našu ponudu besplatne analize. Rado bismo čuli više o vašim ciljevima.`,
    whatsapp: `Pozdrav ${name}! Poslao/la sam vam e-mail s prijedlogom suradnje — javite se kada stignete.`,
    followUp1: "Podsjetnik (dan 3): kratka poruka s ponovnom ponudom analize.",
    followUp2: "Podsjetnik (dan 7): podijelite primjer sličnog uspješnog projekta i ponovno zatražite sastanak.",
    followUp3: "Zadnji pokušaj (dan 14): pitanje jesu li sada u dobrom trenutku za razgovor.",
    cta: "Odgovorite na ovaj e-mail kako bismo dogovorili besplatnu uvodnu analizu.",
  };

  if (hasData) {
    const aiSystem =
      "Generiraj kompletan outreach paket na hrvatskom jeziku za B2B prodaju. Struktura: " +
      "summary, opportunity, offer, email1, email2, whatsapp, followUp1, followUp2, followUp3, cta. " +
      "Koristi SAMO 'STVARNE PODATKE'. NIKADA ne dodaj neprovjerene činjenice, brojke ili imena. " +
      "Odgovori isključivo JSON objektom s tim ključevima.";
    const aiRaw = await runAi(aiSystem, `STVARNI PODACI:\n${contextSummary(ctx)}`);
    if (aiRaw) {
      const m = aiRaw.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          const parsed = JSON.parse(m[0]);
          packageResult = { ...neutralPackage, ...parsed };
          const user = c.get("user") as AuthUser | undefined;
          addTimelineEvent(id, "proposal", "Generiran kompletan outreach paket.", "user", user?.id);
          return c.json({ leadId: id, hasRealData: hasData, ...packageResult, basedOn: ctx });
        } catch {
          // fall through to neutral
        }
      }
    }
  }

  addTimelineEvent(id, "follow_up", "Generiran outreach paket (neutralni predložak).");
  return c.json({ leadId: id, hasRealData: hasData, ...neutralPackage, basedOn: ctx });
});

// ── POST /:id/actions/ai-recommendation — "what should I do with this lead?" ──
leadActionsRoute.post("/:id/actions/ai-recommendation", optionalAuth, async (c) => {
  const id = c.req.param("id") ?? "";
  const lead = loadLead(id);
  if (!lead) return c.json({ error: "Lead nije pronađen." }, 404);

  const ctx = loadRealContext(id);
  const hasData = hasRealData(ctx);
  const opp = ctx.realOpportunities[0];

  const neutral: ReturnType<typeof buildRecommendation> = {
    bestOffer: opp ? opp.service : "Uvodna besplatna analiza digitalne prisutnosti",
    why: opp ? opp.why : "Nemamo dovoljno podataka za preciznu preporuku, pa preporučujemo neutralan pristup.",
    whoToContact: ctx.realPeople[0]?.name || "Glavna kontakt osoba (nije javno poznata)",
    whichChannel: "email",
    whatToSend: "Kratak, neutralan uvodni e-mail s ponudom besplatne analize.",
    cta: "Odgovorite kako bismo dogovorili kratki uvodni razgovor.",
    whenToFollowUp: "3 dana nakon prvog kontakta.",
    hasRealData: hasData,
  };

  if (!hasData) return c.json({ leadId: id, ...neutral, basedOn: ctx });

  const aiSystem =
    "Analiziraj lead i daj konkretnu preporuku na hrvatskom za 'što napraviti s ovim leadom'. " +
    "Struktura JSON: bestOffer, why, whoToContact, whichChannel, whatToSend, cta, whenToFollowUp. " +
    "Koristi SAMO 'STVARNE PODATKE', NIKADA ne izmišljaj. Odgovori isključivo JSON objektom.";
  const aiRaw = await runAi(aiSystem, `STVARNI PODACI:\n${contextSummary(ctx)}`);
  if (aiRaw) {
    const m = aiRaw.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        const parsed = JSON.parse(m[0]);
        const rec = buildRecommendation({ ...neutral, ...parsed, hasRealData: true });
        return c.json({ leadId: id, ...rec, basedOn: ctx });
      } catch {
        // fall through
      }
    }
  }

  return c.json({ leadId: id, ...neutral, basedOn: ctx });
});

function buildRecommendation(r: {
  bestOffer?: string;
  why?: string;
  whoToContact?: string;
  whichChannel?: string;
  whatToSend?: string;
  cta?: string;
  whenToFollowUp?: string;
  hasRealData?: boolean;
}) {
  return {
    bestOffer: r.bestOffer || null,
    why: r.why || null,
    whoToContact: r.whoToContact || null,
    whichChannel: r.whichChannel || "email",
    whatToSend: r.whatToSend || null,
    cta: r.cta || null,
    whenToFollowUp: r.whenToFollowUp || null,
    hasRealData: Boolean(r.hasRealData),
  };
}

export default leadActionsRoute;
