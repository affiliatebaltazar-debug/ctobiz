import { GlassCard } from '@base44/core';
import { useState } from 'react';
import {
  Search, Link, Globe, TrendingUp, Sparkles, Zap,
  AlertTriangle, CheckCircle2, AlertCircle,
  ExternalLink, ArrowUp, ArrowDown, Minus,
} from 'lucide-react';

// ── Types ──
type TabKey = 'pregled' | 'seo-analiza' | 'backlinkovi';

interface KeywordRanking {
  keyword: string;
  pozicija: number;
  prethodnaPozicija: number;
  volumen: number;
  tezina: string;
}

interface OnPageIssue {
  stranica: string;
  problem: string;
  ozbiljnost: 'Kritično' | 'Visoko' | 'Srednje' | 'Nisko';
}

interface BacklinkEntry {
  izvor: string;
  anchorText: string;
  da: number;
  tip: 'Dofollow' | 'Nofollow';
  status: 'Aktivan' | 'Izgubljen' | 'Novi';
}

interface BacklinkOpportunity {
  izvor: string;
  tema: string;
  da: number;
  potencijal: string;
}

// ── Domain data ──
const domainData = {
  domena: 'base44.ai',
  autoritet: 47,
  kljucneRijeci: 342,
  backlinkovi: 198,
  organskiPromet: 12800,
  promjenaPrometa: '+18%',
};

// ── Keyword rankings ──
const keywordRankings: KeywordRanking[] = [
  { keyword: 'ai marketing alat', pozicija: 4, prethodnaPozicija: 7, volumen: 3200, tezina: 'Visoka' },
  { keyword: 'automatizacija marketinga', pozicija: 8, prethodnaPozicija: 12, volumen: 2100, tezina: 'Srednja' },
  { keyword: 'digitalni marketing hrvatska', pozicija: 12, prethodnaPozicija: 9, volumen: 4800, tezina: 'Visoka' },
  { keyword: 'base44 cijena', pozicija: 2, prethodnaPozicija: 1, volumen: 890, tezina: 'Niska' },
  { keyword: 'ai oglasne kampanje', pozicija: 6, prethodnaPozicija: 14, volumen: 1600, tezina: 'Srednja' },
  { keyword: 'seo optimizacija alat', pozicija: 15, prethodnaPozicija: 22, volumen: 2700, tezina: 'Visoka' },
  { keyword: 'generiranje leadova ai', pozicija: 3, prethodnaPozicija: 5, volumen: 1400, tezina: 'Niska' },
  { keyword: 'content marketing automatizacija', pozicija: 18, prethodnaPozicija: 18, volumen: 980, tezina: 'Srednja' },
];

// ── On-page issues ──
const onPageIssues: OnPageIssue[] = [
  { stranica: '/blog/ai-marketing-vodic', problem: 'Meta description predugačak (178 znakova)', ozbiljnost: 'Srednje' },
  { stranica: '/cijene', problem: 'Nedostaje H1 tag na stranici', ozbiljnost: 'Kritično' },
  { stranica: '/kontakt', problem: 'Slike nemaju alt tekst (4 slike)', ozbiljnost: 'Visoko' },
  { stranica: '/blog/digitalni-marketing-2026', problem: 'Brzina učitavanja: 4.2s (mobitel)', ozbiljnost: 'Kritično' },
  { stranica: '/proizvodi', problem: 'Canonical URL nije postavljen', ozbiljnost: 'Visoko' },
  { stranica: '/o-nama', problem: 'Interni linkovi: samo 2 prema blogu', ozbiljnost: 'Nisko' },
];

// ── SEO agent recommendations ──
const seoRecommendations = [
  {
    agent: 'SEO Stručnjak',
    text: 'Ključna riječ "ai oglasne kampanje" skočila je s 14. na 6. mjesto (+8). Preporučujem objavu dodatnog sadržaja na tu temu (vodič, case study) kako bismo učvrstili poziciju i ciljali na top 3.',
    priority: 'Visok',
  },
  {
    agent: 'SEO Stručnjak',
    text: 'Stranica "/cijene" nema H1 tag — to je kritičan SEO problem. Predlažem hitno dodavanje H1 s primarnom ključnom riječi. Također, brzina učitavanja bloga na mobitelu (4.2s) je iznad Googleovog praga od 2.5s — potrebna optimizacija slika.',
    priority: 'Visok',
  },
  {
    agent: 'SEO Intelligence Agent',
    text: 'Analiza konkurentskih stranica pokazuje da vodeći u niši imaju prosječno 2.4x više internih linkova. Preporučujem strategiju internog povezivanja — povezati svaki blog post s minimalno 3 druge relevantne stranice.',
    priority: 'Srednji',
  },
  {
    agent: 'SEO Intelligence Agent',
    text: 'Volumen pretrage za "ai marketing alat" raste (+22% u 30 dana), a nalazimo se na 4. poziciji. S dodatnom optimizacijom meta opisa i dodavanjem FAQ schema markupa, možemo ciljati poziciju 1-2 unutar 4-6 tjedana.',
    priority: 'Srednji',
  },
];

// ── Backlink data ──
const backlinkStats = {
  ukupno: 198,
  dofollow: 134,
  nofollow: 64,
  noviOvajMjesec: 12,
  izgubljeniOvajMjesec: 3,
};

const backlinkEntries: BacklinkEntry[] = [
  { izvor: 'markething.hr', anchorText: 'Base44 AI marketing platforma', da: 56, tip: 'Dofollow', status: 'Aktivan' },
  { izvor: 'startup-balkan.eu', anchorText: 'AI alati za marketing', da: 42, tip: 'Dofollow', status: 'Aktivan' },
  { izvor: 'digitalninomadi.com', anchorText: 'automatizacija marketinga', da: 38, tip: 'Dofollow', status: 'Novi' },
  { izvor: 'blog.mojwebshop.hr', anchorText: 'kliknite ovdje', da: 22, tip: 'Nofollow', status: 'Aktivan' },
  { izvor: 'poslovni-savjetnik.hr', anchorText: 'Base44 recenzija', da: 51, tip: 'Dofollow', status: 'Izgubljen' },
  { izvor: 'techcrunch.hr', anchorText: 'najbolji AI marketing alati', da: 64, tip: 'Dofollow', status: 'Novi' },
];

const backlinkOpportunities: BacklinkOpportunity[] = [
  { izvor: 'poduzetnik.hr', tema: 'Digitalna transformacija malih poduzeća', da: 48, potencijal: 'Gostujući članak' },
  { izvor: 'ictbusiness.info', tema: 'AI u poslovanju', da: 55, potencijal: 'Intervju s CEO-om' },
  { izvor: 'web.burza', tema: 'Marketing alati za freelancere', da: 41, potencijal: 'Recenzija proizvoda' },
  { izvor: 'digitalni-marketing.com', tema: 'SEO trendovi 2026', da: 59, potencijal: 'Gostujući članak' },
  { izvor: 'studentski.hr', tema: 'AI karijere u marketingu', da: 35, potencijal: 'Sponzorirani sadržaj' },
];

const backlinkAgentRecs = [
  {
    agent: 'Backlink Stručnjak',
    text: 'Izgubljen backlink s poslovni-savjetnik.hr (DA 51) — preporučujem kontaktiranje urednika s novim sadržajem. Također, anchor text "kliknite ovdje" s blog.mojwebshop.hr je nekvalitetan — pitati za promjenu u deskriptivni anchor.',
    priority: 'Visok',
  },
  {
    agent: 'Backlink Crawler',
    text: 'Pronađeno 5 novih prilika za backlinkove u hrvatskom digitalnom ekosustavu. Posebno se ističu poduzetnik.hr (DA 48) i digitalni-marketing.com (DA 59) — obje stranice prihvaćaju gostujuće članke i imaju relevantnu publiku.',
    priority: 'Visok',
  },
];

// ── Config ──
const priorityCls: Record<string, string> = {
  'Visok': 'text-red-400 bg-red-400/10',
  'Srednji': 'text-amber-400 bg-amber-400/10',
  'Nizak': 'text-zinc-400 bg-zinc-400/10',
};

const severityCls: Record<string, string> = {
  'Kritično': 'text-red-400 bg-red-400/10 border-red-400/20',
  'Visoko': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Srednje': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'Nisko': 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
};

const statusCls: Record<string, string> = {
  'Aktivan': 'text-emerald-400 bg-emerald-400/10',
  'Novi': 'text-blue-400 bg-blue-400/10',
  'Izgubljen': 'text-red-400 bg-red-400/10',
};

const tipCls: Record<string, string> = {
  'Dofollow': 'text-emerald-400',
  'Nofollow': 'text-zinc-500',
};

// ── Helpers ──
function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function pozicijaPromjena(trenutna: number, prethodna: number) {
  const diff = prethodna - trenutna;
  if (diff > 0) return { icon: ArrowUp, cls: 'text-emerald-400', text: `↑${diff}` };
  if (diff < 0) return { icon: ArrowDown, cls: 'text-red-400', text: `↓${Math.abs(diff)}` };
  return { icon: Minus, cls: 'text-zinc-400', text: '–' };
}

// ── Component ──
export default function SEOBacklinkIntelligence() {
  const [activeTab, setActiveTab] = useState<TabKey>('pregled');

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">SEO & Backlink Inteligencija</h1>
        <p className="text-zinc-400 mt-1">Optimizirajte web stranice i gradite kvalitetne backlinkove</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-brand-purple-400" />
            <span className="text-sm text-zinc-400">SEO projekti</span>
          </div>
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-xs text-zinc-500 mt-1">Aktivnih web stranica</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Link className="w-4 h-4 text-brand-blue-400" />
            <span className="text-sm text-zinc-400">Backlinkovi</span>
          </div>
          <p className="text-2xl font-bold text-white">342</p>
          <p className="text-xs text-emerald-400 mt-1">↑ 28 ovaj mjesec</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-zinc-400">Prosječna pozicija</span>
          </div>
          <p className="text-2xl font-bold text-white">8.4</p>
          <p className="text-xs text-emerald-400 mt-1">↑ 2.1 pozicije</p>
        </GlassCard>
      </div>

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { key: 'pregled' as TabKey, label: 'Pregled' },
          { key: 'seo-analiza' as TabKey, label: 'SEO Analiza' },
          { key: 'backlinkovi' as TabKey, label: 'Backlinkovi' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              activeTab === tab.key
                ? 'bg-brand-purple-500/20 border-brand-purple-500/30 text-white'
                : 'text-zinc-400 border-white/10 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Pregled Tab ── */}
      {activeTab === 'pregled' && (
        <div className="space-y-6 animate-in">
          {/* Domain card */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Pregled domene</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Domena</p>
                <p className="text-lg font-bold text-white">{domainData.domena}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Autoritet</p>
                <p className="text-lg font-bold text-brand-purple-400">{domainData.autoritet}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Ključne riječi</p>
                <p className="text-lg font-bold text-brand-blue-400">{domainData.kljucneRijeci}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Backlinkovi</p>
                <p className="text-lg font-bold text-emerald-400">{domainData.backlinkovi}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Organski promet</p>
                <p className="text-lg font-bold text-white">{formatNum(domainData.organskiPromet)}</p>
                <p className="text-xs text-emerald-400">{domainData.promjenaPrometa}</p>
              </div>
            </div>
          </GlassCard>

          {/* Aktivni SEO Projekti */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Aktivni SEO Projekti</h2>
            <div className="space-y-3">
              {[
                { site: 'base44.ai', score: 87, keywords: 124, backlinks: 98, ranking: '#4' },
                { site: 'klijent-shop.hr', score: 72, keywords: 89, backlinks: 145, ranking: '#12' },
                { site: 'startup-tech.eu', score: 64, keywords: 56, backlinks: 34, ranking: '#22' },
              ].map((proj) => (
                <div key={proj.site} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-brand-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-brand-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{proj.site}</p>
                    <p className="text-xs text-zinc-500">{proj.keywords} ključnih riječi · {proj.backlinks} backlinkova</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-white">{proj.score}/100</p>
                    <p className="text-xs text-zinc-400">Pozicija {proj.ranking}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Agenti */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Agenti</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-brand-purple-400" />
                  <span className="text-sm font-medium text-white">SEO Stručnjak</span>
                </div>
                <p className="text-xs text-zinc-400">On-page i tehnički SEO, istraživanje ključnih riječi, optimizacija sadržaja.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Link className="w-4 h-4 text-brand-blue-400" />
                  <span className="text-sm font-medium text-white">Backlink Stručnjak</span>
                </div>
                <p className="text-xs text-zinc-400">Strategija izgradnje linkova, pronalaženje prilika, praćenje profila.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-white">Backlink Crawler</span>
                </div>
                <p className="text-xs text-zinc-400">Automatsko pretraživanje weba za backlink prilike i konkurentske linkove.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── SEO Analiza Tab ── */}
      {activeTab === 'seo-analiza' && (
        <div className="space-y-6 animate-in">
          {/* Keyword ranking table */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Pozicije ključnih riječi</h2>
            <GlassCard className="!p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Ključna riječ</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Pozicija</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Volumen</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Težina</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Promjena</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {keywordRankings.map((kw, i) => {
                      const promjena = pozicijaPromjena(kw.pozicija, kw.prethodnaPozicija);
                      const PromIcon = promjena.icon;
                      return (
                        <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-4">
                            <span className="text-white text-sm font-medium">{kw.keyword}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-white text-sm font-bold">{kw.pozicija}.</span>
                          </td>
                          <td className="py-3 px-4 text-right hidden sm:table-cell">
                            <span className="text-zinc-300 text-sm">{formatNum(kw.volumen)}</span>
                          </td>
                          <td className="py-3 px-4 text-right hidden sm:table-cell">
                            <span className="text-xs text-zinc-400">{kw.tezina}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`inline-flex items-center gap-1 text-sm font-medium ${promjena.cls}`}>
                              <PromIcon className="w-3.5 h-3.5" /> {promjena.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </section>

          {/* On-page issues */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Problemi na stranici</h2>
            <GlassCard className="!p-0 overflow-hidden">
              <div className="divide-y divide-white/5">
                {onPageIssues.map((issue, i) => (
                  <div key={i} className="p-4 hover:bg-white/[0.03] transition-colors flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${severityCls[issue.ozbiljnost]}`}>
                      {issue.ozbiljnost === 'Kritično' ? (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{issue.problem}</p>
                      <p className="text-xs text-zinc-500">{issue.stranica}</p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${severityCls[issue.ozbiljnost]}`}>
                      {issue.ozbiljnost}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

          {/* SEO Agent Recommendations */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-purple-400" />
              <h2 className="text-lg font-semibold text-white">SEO preporuke</h2>
            </div>
            <div className="space-y-3">
              {seoRecommendations.map((rec, i) => (
                <GlassCard key={i} hover className="!p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 text-brand-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-medium text-white">{rec.agent}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityCls[rec.priority]}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed">{rec.text}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── Backlinkovi Tab ── */}
      {activeTab === 'backlinkovi' && (
        <div className="space-y-6 animate-in">
          {/* Backlink metrics */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Backlink metrike</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Ukupno</p>
                <p className="text-xl font-bold text-white">{backlinkStats.ukupno}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Dofollow</p>
                <p className="text-xl font-bold text-emerald-400">{backlinkStats.dofollow}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Nofollow</p>
                <p className="text-xl font-bold text-zinc-400">{backlinkStats.nofollow}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Novi (mjesec)</p>
                <p className="text-xl font-bold text-blue-400">+{backlinkStats.noviOvajMjesec}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Izgubljeni (mjesec)</p>
                <p className="text-xl font-bold text-red-400">-{backlinkStats.izgubljeniOvajMjesec}</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-white/5 text-center">
              <p className="text-xs text-zinc-500">Dofollow / Nofollow omjer</p>
              <p className="text-sm font-bold text-white">
                {backlinkStats.dofollow} : {backlinkStats.nofollow} ({((backlinkStats.dofollow / backlinkStats.ukupno) * 100).toFixed(0)}% dofollow)
              </p>
            </div>
          </GlassCard>

          {/* Backlink table */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Backlink profil</h2>
            <GlassCard className="!p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Izvor</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Anchor Text</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">DA</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Tip</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {backlinkEntries.map((bl, i) => (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-white text-sm font-medium">{bl.izvor}</span>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <span className="text-xs text-zinc-400">{bl.anchorText}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-white text-sm font-bold">{bl.da}</span>
                        </td>
                        <td className="py-3 px-4 text-right hidden sm:table-cell">
                          <span className={`text-xs font-medium ${tipCls[bl.tip]}`}>{bl.tip}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusCls[bl.status]}`}>
                            {bl.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </section>

          {/* Backlink opportunities */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Prilike za backlinkove</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {backlinkOpportunities.map((opp, i) => (
                <GlassCard key={i} hover className="!p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <ExternalLink className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{opp.izvor}</p>
                      <p className="text-xs text-zinc-500">DA {opp.da} · {opp.potencijal}</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">{opp.tema}</p>
                  <button className="w-full py-2 rounded-lg text-xs font-medium bg-brand-purple-500/15 text-brand-purple-400 hover:bg-brand-purple-500/25 transition-colors">
                    Iskoristi priliku
                  </button>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Backlink agent recommendations */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-purple-400" />
              <h2 className="text-lg font-semibold text-white">Backlink preporuke</h2>
            </div>
            <div className="space-y-3">
              {backlinkAgentRecs.map((rec, i) => (
                <GlassCard key={i} hover className="!p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 text-brand-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-medium text-white">{rec.agent}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityCls[rec.priority]}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed">{rec.text}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
