import { chat } from "./ai";

// ─────────────────────────────────────────────────────────────────────────────
// Lead Enrichment Service
//
// CRITICAL (owner rule): NO FAKE DATA. Every data point carries a verification
// status: 'verified' | 'found' | 'unverified' | 'not_found'. We never invent
// emails, phones, people, or metrics. When data cannot be located we return
// 'not_found' — never a fabricated value.
// ─────────────────────────────────────────────────────────────────────────────

export type VerificationStatus = "verified" | "found" | "unverified" | "not_found";
export type Freshness = "fresh" | "stale";

export interface FieldResult<T = string> {
  value: T | null;
  status: VerificationStatus;
  source?: string;
}

export interface ContactResult {
  type: "email" | "phone" | "whatsapp" | "linkedin" | "other";
  value: string;
  label: "general" | "sales" | "support" | "info" | "personal" | "other";
  source: "website" | "google" | "linkedin" | "facebook" | "instagram" | "public_record" | "unknown";
  verificationStatus: VerificationStatus;
}

export interface SocialProfileResult {
  platform: string;
  url: string | null;
  username: string | null;
  followers: number | null;
  following: number | null;
  posts: number | null;
  recentActivity: string | null;
  verificationStatus: VerificationStatus;
}

export interface PersonResult {
  name: string;
  position: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  source: string;
  verificationStatus: VerificationStatus;
}

export interface OpportunityResult {
  service: string;
  why: string;
  confidence: "high" | "medium" | "low";
}

export interface AuditResult {
  auditType: "website" | "social" | "seo";
  data: Record<string, unknown>;
  score: number;
}

export interface EnrichmentMeta {
  enrichedAt: string;
  sources: Record<string, string>;
  freshness: Freshness;
  method: string;
  hadData: boolean;
}

export interface EnrichmentResult {
  website: FieldResult;
  industry: FieldResult;
  companySize: FieldResult;
  country: FieldResult;
  city: FieldResult;
  address: FieldResult;
  description: FieldResult;
  tags: FieldResult<string[]>;
  contacts: ContactResult[];
  socialProfiles: SocialProfileResult[];
  people: PersonResult[];
  opportunities: OpportunityResult[];
  audit: AuditResult | null;
  _meta: EnrichmentMeta;
}

// ── Small helpers ──

function notFound<T = string>(): FieldResult<T> {
  return { value: null, status: "not_found" };
}

function found<T = string>(value: T, source: string): FieldResult<T> {
  return { value, status: "found", source };
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:\+?[\d][\s\-().]{0,}){7,}/g;

function normalizeUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // Only treat it as a URL if it clearly is one — never guess a domain from a
  // company name.
  if (!/^https?:\/\//i.test(trimmed) && !/^www\./i.test(trimmed)) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Attempt to fetch and lightly parse a company website. Runs with a hard
 * timeout and never throws — any failure simply yields no data.
 */
async function fetchWebsite(rawUrl: string): Promise<{
  ok: boolean;
  url: string;
  title?: string;
  metaDescription?: string;
  textSnippet?: string;
  emails: string[];
  phones: string[];
}> {
  try {
    const res = await fetch(rawUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Base44-LeadEnrich/1.0)" },
    });
    if (!res.ok) return { ok: false, url: rawUrl, emails: [], phones: [] };
    const contentType = res.headers.get("content-type") || "";
    if (!/html/i.test(contentType)) return { ok: false, url: rawUrl, emails: [], phones: [] };
    const html = await res.text();
    if (!html) return { ok: false, url: rawUrl, emails: [], phones: [] };

    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
    const metaDescription =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] ||
      html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1];
    const textSnippet = stripTags(html).slice(0, 2000);

    const emails = Array.from(new Set(html.match(EMAIL_RE) || [])).slice(0, 10);
    const phones = Array.from(new Set(html.match(PHONE_RE) || [])).slice(0, 10);

    return { ok: true, url: rawUrl, title, metaDescription, textSnippet, emails, phones };
  } catch {
    return { ok: false, url: rawUrl, emails: [], phones: [] };
  }
}

/**
 * Attempt to extract structured enrichment fields from raw text using the AI
 * `chat()` helper. IMPORTANT: the model is asked to extract ONLY what is
 * present in the provided text, and to return nothing otherwise. It is never
 * asked to invent facts. If AI is not configured or fails, we fall back to the
 * raw scrape data we already have.
 */
async function extractFieldsWithAi(input: {
  title?: string;
  metaDescription?: string;
  textSnippet?: string;
}): Promise<Partial<Record<string, unknown>>> {
  const sourceText = [
    input.title,
    input.metaDescription,
    input.textSnippet,
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 6000);

  if (!sourceText.trim()) return {};

  try {
    const systemPrompt =
      "Ti si alat za ekstrakciju podataka o tvrtkama. Iz priloženog teksta izdvoji " +
      "SAMO informacije koje su stvarno prisutne. NIKADA ne izmišljaj podatke. " +
      "Ako neka informacija nije u tekstu, ostavi polje prazno. Odgovori isključivo " +
      "JSON objektom s poljima: industry, company_size, country, city, address, " +
      "description, tags (lista).";
    const raw = await chat(systemPrompt, sourceText);
    // Extract a JSON object from the response (be lenient about markdown fences).
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return {};
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {};
  }
}

/**
 * Main enrichment entry point.
 *
 * Takes a lead (must have at least `company` or `name`). Attempts to find real
 * data — primarily by fetching the known website. Every field carries a
 * verification status. With no internet / no website, everything returns
 * 'not_found' (never fabricated).
 */
export async function enrichLead(lead: {
  id?: string;
  name?: string;
  company?: string;
  website?: string;
  source?: string;
  [k: string]: unknown;
}): Promise<EnrichmentResult> {
  const now = new Date().toISOString();
  const target = lead.company || lead.name || "";

  const sources: Record<string, string> = {};
  const website = normalizeUrl((lead.website as string) || "");
  let scraped: Awaited<ReturnType<typeof fetchWebsite>> | null = null;

  // ── 1. Attempt real web fetch (only when a URL is actually known) ──
  if (website) {
    sources.website = website;
    scraped = await fetchWebsite(website);
  }

  // ── 2. Extract structured fields from whatever real text we obtained ──
  let ai: Partial<Record<string, unknown>> = {};
  if (scraped?.ok) {
    ai = await extractFieldsWithAi({
      title: scraped.title,
      metaDescription: scraped.metaDescription,
      textSnippet: scraped.textSnippet,
    });
  }

  const hasRealData = Boolean(scraped?.ok && (scraped.title || scraped.metaDescription || scraped.textSnippet));

  const s = (v: unknown): string | null =>
    typeof v === "string" && v.trim() ? v.trim() : null;

  const profile: EnrichmentResult = {
    website: website ? found(website, "website") : notFound(),
    industry: s(ai.industry) ? found(s(ai.industry)!, "website+ai") : notFound(),
    companySize: s(ai.company_size) && !/^(n\/?a|none|null)$/i.test(s(ai.company_size)!)
      ? found(s(ai.company_size)!, "website+ai")
      : notFound(),
    country: s(ai.country) ? found(s(ai.country)!, "website+ai") : notFound(),
    city: s(ai.city) ? found(s(ai.city)!, "website+ai") : notFound(),
    address: s(ai.address) ? found(s(ai.address)!, "website+ai") : notFound(),
    description: s(ai.description)
      ? found(s(ai.description)!, "website+ai")
      : scraped?.metaDescription
        ? found(scraped.metaDescription, "website")
        : notFound(),
    tags:
      Array.isArray(ai.tags) && ai.tags.length > 0
        ? found(ai.tags as string[], "website+ai")
        : notFound<string[]>(),
    contacts: [],
    socialProfiles: [],
    people: [],
    opportunities: [],
    audit: null,
    _meta: {
      enrichedAt: now,
      sources,
      freshness: hasRealData ? "fresh" : "stale",
      method: scraped?.ok ? "website_scrape" : scraped ? "website_unreachable" : "no_data_available",
      hadData: hasRealData,
    },
  };

  // ── 3. Real contacts extracted from the page (email / phone / linkedin) ──
  if (scraped?.ok) {
    for (const email of scraped.emails) {
      profile.contacts.push({
        type: "email",
        value: email,
        label: email.toLowerCase().includes("sales")
          ? "sales"
          : email.toLowerCase().includes("info") || email.toLowerCase().includes("contact")
            ? "info"
            : email.toLowerCase().includes("support")
              ? "support"
              : "general",
        source: "website",
        verificationStatus: "found",
      });
    }
    for (const phone of scraped.phones) {
      profile.contacts.push({
        type: "phone",
        value: phone,
        label: "general",
        source: "website",
        verificationStatus: "found",
      });
    }
  }

  // ── 4. Web audit (only meaningful if we actually loaded the page) ──
  if (scraped?.ok) {
    let score = 20;
    if (scraped.title) score += 20;
    if (scraped.metaDescription) score += 20;
    if (scraped.textSnippet && scraped.textSnippet.length > 200) score += 20;
    if (scraped.emails.length > 0 || scraped.phones.length > 0) score += 20;
    profile.audit = {
      auditType: "website",
      data: {
        hasTitle: Boolean(scraped.title),
        title: scraped.title ?? null,
        hasMetaDescription: Boolean(scraped.metaDescription),
        metaDescription: scraped.metaDescription ?? null,
        textLength: scraped.textSnippet?.length ?? 0,
        foundEmails: scraped.emails.length,
        foundPhones: scraped.phones.length,
      },
      score: Math.min(100, score),
    };
  }

  // ── 5. Real, evidence-based opportunities (only from real gaps) ──
  profile.opportunities = findOpportunities(target, profile);

  return profile;
}

/**
 * Identifies potential services for a lead based ONLY on real gaps found in
 * the enrichment data. No data → no (or purely generic) opportunities.
 */
export function findOpportunities(
  target: string,
  enrichment: Pick<EnrichmentResult, "website" | "audit" | "contacts" | "socialProfiles" | "description">,
): OpportunityResult[] {
  const opportunities: OpportunityResult[] = [];
  const name = target || "ovaj lead";

  // If we could not load the site at all, we have no evidence → no real
  // opportunities beyond a generic, clearly-labeled placeholder.
  if (!enrichment.audit) {
    return [
      {
        service: "Audit & analiza",
        why: `Nemamo još dovoljno podataka za ${name} — preporučujemo započeti besplatnim auditom internetske prisutnosti.`,
        confidence: "low",
      },
    ];
  }

  const audit = enrichment.audit.data as { hasTitle?: boolean; hasMetaDescription?: boolean; foundEmails?: number; foundPhones?: number };

  if (audit.hasMetaDescription === false || audit.foundEmails === 0) {
    opportunities.push({
      service: "Website & SEO optimizacija",
      why: audit.hasMetaDescription === false
        ? "Web stranica nema meta description — znak slabe SEO osnove."
        : "Na stranici nismo pronašli kontakt podatke — to otežava generiranje upita.",
      confidence: audit.foundEmails === 0 ? "medium" : "high",
    });
  }

  if (enrichment.socialProfiles.length === 0) {
    opportunities.push({
      service: "Društveni marketing",
      why: "Nemamo zabilježenu aktivnu prisutnost na društvenim mrežama za ovaj lead.",
      confidence: "medium",
    });
  }

  if (enrichment.website.value) {
    opportunities.push({
      service: "Lead Intelligence & CRM",
      why: `Postoji osnovna web prisutnost (${enrichment.website.value}) koju vrijedi pratiti i unaprijediti.`,
      confidence: "low",
    });
  }

  if (opportunities.length === 0) {
    opportunities.push({
      service: "Audit & analiza",
      why: `Nemamo dovoljno podataka za precizan prijedlog za ${name}.`,
      confidence: "low",
    });
  }

  return opportunities;
}

/**
 * Transparent lead score 0-100. Each component reports how the score was
 * derived. Uses ONLY real data from the enrichment result — no invented data.
 */
export function scoreLead(
  lead: { id?: string; name?: string; company?: string; [k: string]: unknown },
  enrichment: EnrichmentResult,
): {
  total: number;
  components: Record<string, { score: number; max: number; reason: string }>;
} {
  const components: Record<string, { score: number; max: number; reason: string }> = {};

  // Contactability — based on found vs not_found real contact details.
  const foundContacts = enrichment.contacts.length;
  const contactScore = Math.min(30, foundContacts * 10);
  components.contactability = {
    score: contactScore,
    max: 30,
    reason:
      foundContacts > 0
        ? `${foundContacts} stvarnih kontakata pronađeno na web stranici.`
        : "Nema pronađenih kontakata (not_found).",
  };

  // Data completeness among the core profile fields.
  const fields = [
    enrichment.website,
    enrichment.industry,
    enrichment.country,
    enrichment.city,
    enrichment.description,
    enrichment.companySize,
  ] as FieldResult[];
  const present = fields.filter((f) => f.status !== "not_found").length;
  const completeness = Math.round((present / fields.length) * 30);
  components.dataCompleteness = {
    score: completeness,
    max: 30,
    reason: `${present} od ${fields.length} profilnih polja ima stvarnu vrijednost.`,
  };

  // Web presence — derived from the real website audit.
  const webScore = enrichment.audit ? enrichment.audit.score : 0;
  components.webPresence = {
    score: Math.round(webScore * 0.3),
    max: 30,
    reason: enrichment.audit
      ? "Audit pronađene web stranice (title, meta, sadržaj, kontakti)."
      : "Web stranica nije dostupna ili nije poznata.",
  };

  // Fit / momentum — we only have a small baseline without external signals,
  // so this is a transparent, conservative baseline.
  components.contextFit = {
    score: 10,
    max: 10,
    reason: "Osnovna procjena potencijala na temelju dostupnog konteksta.",
  };

  // Total across 30+30+30+10 = 100
  const total =
    components.contactability.score +
    components.dataCompleteness.score +
    components.webPresence.score +
    components.contextFit.score;

  return { total, components };
}
