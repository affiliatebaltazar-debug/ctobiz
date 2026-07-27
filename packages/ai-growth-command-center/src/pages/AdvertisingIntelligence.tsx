import { GlassCard } from '@base44/core';
import { useState } from 'react';
import {
  BarChart3, Globe, DollarSign, TrendingUp, Sparkles,
  Target, AlertCircle, Zap, Search, ArrowUpRight,
} from 'lucide-react';

// ── Types ──
type AdPlatform = 'Google Ads' | 'Facebook Ads' | 'Instagram Ads' | 'TikTok Ads';

interface CampaignRow {
  kampanja: string;
  potrosnja: number;
  impresije: number;
  klikovi: number;
  ctr: number;
  cpc: number;
  konverzije: number;
  cpa: number;
  roas: number;
}

interface KeywordEntry {
  keyword: string;
  volumen: number;
  konkurencija: 'Visoka' | 'Srednja' | 'Niska';
  cpcProcijenjeni: number;
}

// ── Platform config ──
const platformTabs: AdPlatform[] = ['Google Ads', 'Facebook Ads', 'Instagram Ads', 'TikTok Ads'];

const platformIcons: Record<AdPlatform, typeof Globe> = {
  'Google Ads': Globe,
  'Facebook Ads': Globe,
  'Instagram Ads': Globe,
  'TikTok Ads': Globe,
};

const platformColors: Record<AdPlatform, string> = {
  'Google Ads': 'border-amber-400 text-amber-400',
  'Facebook Ads': 'border-blue-400 text-blue-400',
  'Instagram Ads': 'border-pink-400 text-pink-400',
  'TikTok Ads': 'border-rose-400 text-rose-400',
};

// ── Campaign data per platform ──
const campaignsData: Record<AdPlatform, CampaignRow[]> = {
  'Google Ads': [
    { kampanja: 'Search – Brand', potrosnja: 1500, impresije: 124000, klikovi: 3400, ctr: 2.7, cpc: 0.44, konverzije: 187, cpa: 8.02, roas: 4.2 },
    { kampanja: 'Search – Generički', potrosnja: 2200, impresije: 210000, klikovi: 5200, ctr: 2.5, cpc: 0.42, konverzije: 234, cpa: 9.40, roas: 2.8 },
    { kampanja: 'Display – Remarketing', potrosnja: 800, impresije: 480000, klikovi: 8200, ctr: 1.7, cpc: 0.10, konverzije: 112, cpa: 7.14, roas: 5.1 },
    { kampanja: 'Shopping – Proizvodi', potrosnja: 1800, impresije: 95000, klikovi: 2900, ctr: 3.1, cpc: 0.62, konverzije: 156, cpa: 11.54, roas: 3.4 },
    { kampanja: 'Performance Max', potrosnja: 3100, impresije: 340000, klikovi: 7800, ctr: 2.3, cpc: 0.40, konverzije: 298, cpa: 10.40, roas: 3.8 },
  ],
  'Facebook Ads': [
    { kampanja: 'Lead Gen – B2B', potrosnja: 1200, impresije: 89000, klikovi: 4100, ctr: 4.6, cpc: 0.29, konverzije: 145, cpa: 8.28, roas: 3.9 },
    { kampanja: 'Brand Awareness', potrosnja: 900, impresije: 210000, klikovi: 6200, ctr: 2.9, cpc: 0.15, konverzije: 67, cpa: 13.43, roas: 1.6 },
    { kampanja: 'Konverzije – Web', potrosnja: 2100, impresije: 156000, klikovi: 4800, ctr: 3.1, cpc: 0.44, konverzije: 210, cpa: 10.00, roas: 2.9 },
    { kampanja: 'Video Engagement', potrosnja: 600, impresije: 340000, klikovi: 11200, ctr: 3.3, cpc: 0.05, konverzije: 34, cpa: 17.65, roas: 0.8 },
    { kampanja: 'Dinamički proizvodi', potrosnja: 1500, impresije: 78000, klikovi: 3200, ctr: 4.1, cpc: 0.47, konverzije: 198, cpa: 7.58, roas: 4.7 },
  ],
  'Instagram Ads': [
    { kampanja: 'Story Ads – Promocija', potrosnja: 800, impresije: 420000, klikovi: 9800, ctr: 2.3, cpc: 0.08, konverzije: 89, cpa: 8.99, roas: 3.2 },
    { kampanja: 'Reels – Viralni', potrosnja: 1100, impresije: 580000, klikovi: 14200, ctr: 2.4, cpc: 0.08, konverzije: 134, cpa: 8.21, roas: 4.1 },
    { kampanja: 'Feed – Estetski', potrosnja: 950, impresije: 165000, klikovi: 3900, ctr: 2.4, cpc: 0.24, konverzije: 72, cpa: 13.19, roas: 1.3 },
    { kampanja: 'Explore – Doseg', potrosnja: 1300, impresije: 890000, klikovi: 18100, ctr: 2.0, cpc: 0.07, konverzije: 156, cpa: 8.33, roas: 2.7 },
    { kampanja: 'Influencer Boost', potrosnja: 2000, impresije: 310000, klikovi: 7600, ctr: 2.5, cpc: 0.26, konverzije: 203, cpa: 9.85, roas: 3.6 },
  ],
  'TikTok Ads': [
    { kampanja: 'In-Feed – Zabava', potrosnja: 1400, impresije: 720000, klikovi: 24000, ctr: 3.3, cpc: 0.06, konverzije: 178, cpa: 7.87, roas: 4.8 },
    { kampanja: 'TopView – Lansiranje', potrosnja: 2800, impresije: 1200000, klikovi: 31000, ctr: 2.6, cpc: 0.09, konverzije: 245, cpa: 11.43, roas: 3.1 },
    { kampanja: 'Spark Ads – Kreator', potrosnja: 950, impresije: 450000, klikovi: 16800, ctr: 3.7, cpc: 0.06, konverzije: 112, cpa: 8.48, roas: 5.5 },
    { kampanja: 'Hashtag Izazov', potrosnja: 3500, impresije: 2100000, klikovi: 52000, ctr: 2.5, cpc: 0.07, konverzije: 389, cpa: 9.00, roas: 2.9 },
    { kampanja: 'Branded Effect', potrosnja: 1700, impresije: 980000, klikovi: 20000, ctr: 2.0, cpc: 0.09, konverzije: 145, cpa: 11.72, roas: 1.7 },
  ],
};

// ── AI Recommendations ──
const aiRecommendations = [
  {
    agent: 'Google Ads Stručnjak',
    text: 'Search kampanja "Generički" ima CPA od €9,40 — 17% iznad cilja. Predlažem dodavanje negativnih ključnih riječi i prilagodbu licitacija za mobilne uređaje (trenutno CTR na mobile: 1.9%, desktop: 3.6%).',
    priority: 'Visok',
  },
  {
    agent: 'Google Ads Stručnjak',
    text: 'Display Remarketing kampanja postiže ROAS 5.1x — preporučujem proširenje publike kroz Similar Audiences i povećanje budžeta za 30% (s €800 na €1,040) za maksimizaciju povrata.',
    priority: 'Visok',
  },
  {
    agent: 'Google Ads Intelligence Agent',
    text: 'Analiza aukcijskih cijena pokazuje da su CPC-ovi za ključne riječi u niši "AI marketing" pale za 12% u zadnjih 14 dana — optimalno vrijeme za agresivnu Search kampanju s fokusom na visoku namjeru kupnje.',
    priority: 'Srednji',
  },
  {
    agent: 'Google Ads Intelligence Agent',
    text: 'Konkurencija (3 glavna oglašivača) povećala je ulaganje u Performance Max kampanje za 40%. Preporučujem testiranje novih asset grupa s video materijalima i proširenje publike na temelju prvih podataka.',
    priority: 'Nizak',
  },
];

const priorityColors: Record<string, string> = {
  'Visok': 'text-red-400 bg-red-400/10',
  'Srednji': 'text-amber-400 bg-amber-400/10',
  'Nizak': 'text-zinc-400 bg-zinc-400/10',
};

// ── Keyword competitor data ──
const competitorKeywords: KeywordEntry[] = [
  { keyword: 'ai marketing alat', volumen: 3200, konkurencija: 'Visoka', cpcProcijenjeni: 1.85 },
  { keyword: 'automatizacija marketinga', volumen: 2100, konkurencija: 'Srednja', cpcProcijenjeni: 2.40 },
  { keyword: 'digitalni marketing hrvatska', volumen: 4800, konkurencija: 'Visoka', cpcProcijenjeni: 1.30 },
  { keyword: 'google ads agencija', volumen: 1800, konkurencija: 'Visoka', cpcProcijenjeni: 3.10 },
  { keyword: 'facebook oglasi cijena', volumen: 2900, konkurencija: 'Niska', cpcProcijenjeni: 0.85 },
];

const konkurencijaColors: Record<string, string> = {
  'Visoka': 'text-red-400 bg-red-400/10',
  'Srednja': 'text-amber-400 bg-amber-400/10',
  'Niska': 'text-emerald-400 bg-emerald-400/10',
};

// ── Helpers ──
function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function roasColor(roas: number): string {
  if (roas >= 3) return 'text-emerald-400';
  if (roas >= 1) return 'text-amber-400';
  return 'text-red-400';
}

// ── Component ──
export default function AdvertisingIntelligence() {
  const [activeTab, setActiveTab] = useState<AdPlatform>('Google Ads');

  const currentCampaigns = campaignsData[activeTab];

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Inteligencija Oglašavanja</h1>
        <p className="text-zinc-400 mt-1">Upravljajte i optimizirajte oglasne kampanje</p>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-brand-blue-400" />
            <span className="text-sm text-zinc-400">Google Ads</span>
          </div>
          <p className="text-xl font-bold text-white">2 agenta</p>
          <p className="text-xs text-zinc-500 mt-1">Stručnjak + Intelligence</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-zinc-400">Budžet ovaj mjesec</span>
          </div>
          <p className="text-xl font-bold text-white">€5,900</p>
          <p className="text-xs text-zinc-500 mt-1">Preko svih platformi</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-brand-purple-400" />
            <span className="text-sm text-zinc-400">ROAS prosjek</span>
          </div>
          <p className="text-xl font-bold text-white">3.4x</p>
          <p className="text-xs text-emerald-400 mt-1">↑ 0.6x</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-400">Aktivne kampanje</span>
          </div>
          <p className="text-xl font-bold text-white">4</p>
          <p className="text-xs text-zinc-500 mt-1">Google Ads + Social</p>
        </GlassCard>
      </div>

      {/* ── Google Ads Pregled ── */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-white mb-4">Google Ads — Pregled</h2>
        <p className="text-sm text-zinc-400 mb-4">
          Google Ads Stručnjak i Intelligence Agent rade zajedno na optimizaciji vaših kampanja —
          od odabira ključnih riječi do analize konkurencije i praćenja cijena kroz aukcije.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5">
            <h3 className="text-sm font-medium text-white mb-2">Search Kampanje</h3>
            <div className="text-xs text-zinc-400 space-y-1">
              <p>Impresije: <span className="text-white">124K</span></p>
              <p>Klikovi: <span className="text-white">3,4K</span></p>
              <p>CTR: <span className="text-emerald-400">2.7%</span></p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <h3 className="text-sm font-medium text-white mb-2">Display Kampanje</h3>
            <div className="text-xs text-zinc-400 space-y-1">
              <p>Impresije: <span className="text-white">480K</span></p>
              <p>Klikovi: <span className="text-white">8,2K</span></p>
              <p>CTR: <span className="text-emerald-400">1.7%</span></p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── Platform Tabs & Campaign Table ── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Kampanje po platformi</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {platformTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
                  isActive
                    ? `${platformColors[tab]} bg-white/5 border-current/40`
                    : 'text-zinc-400 border-white/10 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Campaign table */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Kampanja</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Potrošnja</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Impresije</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Klikovi</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">CTR</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">CPC</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Konverzije</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">CPA</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentCampaigns.map((c, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-white text-sm font-medium">{c.kampanja}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-zinc-300 text-sm">€{c.potrosnja.toLocaleString('hr')}</span>
                    </td>
                    <td className="py-3 px-4 text-right hidden sm:table-cell">
                      <span className="text-zinc-300 text-sm">{formatNum(c.impresije)}</span>
                    </td>
                    <td className="py-3 px-4 text-right hidden sm:table-cell">
                      <span className="text-zinc-300 text-sm">{formatNum(c.klikovi)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-emerald-400 text-sm">{c.ctr}%</span>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      <span className="text-zinc-300 text-sm">€{c.cpc.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      <span className="text-white text-sm font-medium">{c.konverzije}</span>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      <span className="text-zinc-300 text-sm">€{c.cpa.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-sm font-bold ${roasColor(c.roas)}`}>{c.roas.toFixed(1)}x</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      {/* ── AI Optimizacija ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">AI Optimizacija</h2>
        </div>
        <GlassCard className="!p-0 overflow-hidden">
          <div className="divide-y divide-white/5">
            {aiRecommendations.map((rec, i) => (
              <div key={i} className="p-4 hover:bg-white/[0.03] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-brand-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{rec.agent}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityColors[rec.priority]}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{rec.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-white/5 bg-white/[0.02]">
            <button className="flex items-center gap-2 text-xs text-brand-purple-400 hover:text-brand-purple-300 transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              Generiraj više preporuka
            </button>
          </div>
        </GlassCard>
      </section>

      {/* ── Analiza ključnih riječi konkurencije ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">Analiza ključnih riječi konkurencije</h2>
        </div>
        <GlassCard className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Ključna riječ</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Volumen</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Konkurencija</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">CPC procijenjeni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {competitorKeywords.map((kw, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-white text-sm font-medium">{kw.keyword}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-zinc-300 text-sm">{formatNum(kw.volumen)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${konkurencijaColors[kw.konkurencija]}`}>
                        {kw.konkurencija}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-white text-sm font-medium">€{kw.cpcProcijenjeni.toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

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
