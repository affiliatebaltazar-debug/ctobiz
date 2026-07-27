import { GlassCard, KPICard } from '@base44/core';
import { useState } from 'react';
import {
  Target, TrendingUp, DollarSign, Eye, Plus,
  BarChart3, ArrowRight, Edit, Activity,
  Zap, Sparkles, AlertCircle, CheckCircle2,
  Clock, PauseCircle, PlayCircle, FileEdit,
  Facebook, Instagram, Youtube, MessageCircle,
  Globe, Twitter,
} from 'lucide-react';

// ── Types ──
type CampaignPlatform = 'Facebook' | 'Instagram' | 'Google Ads' | 'TikTok' | 'X' | 'YouTube';
type CampaignStatus = 'active' | 'paused' | 'draft' | 'completed';

interface Campaign {
  id: string;
  name: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
}

// ── Platform config ──
const platformConfig: Record<CampaignPlatform, { icon: typeof Facebook; color: string; bg: string }> = {
  'Facebook':    { icon: Facebook,    color: 'text-blue-400', bg: 'bg-blue-500/20' },
  'Instagram':   { icon: Instagram,   color: 'text-pink-400', bg: 'bg-pink-500/20' },
  'Google Ads':  { icon: Globe,       color: 'text-amber-400', bg: 'bg-amber-500/20' },
  'TikTok':      { icon: Youtube,     color: 'text-rose-400', bg: 'bg-rose-500/20' },
  'X':           { icon: Twitter,     color: 'text-zinc-200', bg: 'bg-zinc-500/20' },
  'YouTube':     { icon: Youtube,     color: 'text-red-400', bg: 'bg-red-500/20' },
};

const statusConfig: Record<CampaignStatus, { label: string; cls: string }> = {
  active:    { label: 'Aktivna',    cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  paused:    { label: 'Pauzirana',  cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  draft:     { label: 'U izradi',   cls: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' },
  completed: { label: 'Završena',   cls: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
};

// ── Sample campaigns ──
const sampleCampaigns: Campaign[] = [
  {
    id: 'c1', name: 'Ljetna promocija 2026', platform: 'Facebook',
    status: 'active', budget: 4500, spent: 3200,
    impressions: 142000, clicks: 12400, conversions: 847, roas: 4.2,
  },
  {
    id: 'c2', name: 'Black Friday priprema', platform: 'Google Ads',
    status: 'draft', budget: 8000, spent: 1200,
    impressions: 28000, clicks: 2100, conversions: 98, roas: 2.8,
  },
  {
    id: 'c3', name: 'B2B Lead Gen Q3', platform: 'X',
    status: 'active', budget: 3000, spent: 1850,
    impressions: 56000, clicks: 4800, conversions: 312, roas: 3.1,
  },
  {
    id: 'c4', name: 'Upoznavanje brenda', platform: 'Instagram',
    status: 'paused', budget: 2500, spent: 2100,
    impressions: 198000, clicks: 8900, conversions: 234, roas: 1.9,
  },
  {
    id: 'c5', name: 'Retargeting Q2', platform: 'TikTok',
    status: 'active', budget: 5500, spent: 4100,
    impressions: 320000, clicks: 28000, conversions: 1567, roas: 5.1,
  },
  {
    id: 'c6', name: 'Video kampanja Proizvod X', platform: 'YouTube',
    status: 'completed', budget: 6000, spent: 6000,
    impressions: 445000, clicks: 32100, conversions: 2103, roas: 3.7,
  },
];

// ── AI recommendations ──
const aiRecommendations = [
  {
    agent: 'Agent za Otkrivanje Kampanja',
    icon: Activity,
    text: 'Analiza tržišta pokazuje rast interesa za "održivi proizvodi" (+34% u zadnjih 30 dana). Preporučujemo pokretanje kampanje usmjerene na eko segment s budžetom od €2,000–3,000 na Facebooku i Instagramu.',
    priority: 'Visok',
  },
  {
    agent: 'Agent za Analizu Kampanja',
    icon: BarChart3,
    text: 'Kampanja "Retargeting Q2" na TikToku postiže ROAS od 5.1x — 60% iznad prosjeka. Predlažemo povećanje budžeta za 25% i proširenje na slične publike (Lookalike Audiences).',
    priority: 'Visok',
  },
  {
    agent: 'Agent za Otkrivanje Kampanja',
    icon: Activity,
    text: 'Konkurencija (3 glavna igrača) ulaže u YouTube Shorts oglase s CTR-om iznad 2.8%. Preporučujemo testiranje Shorts formata s budžetom od €1,000 za Q3.',
    priority: 'Srednji',
  },
  {
    agent: 'Agent za Analizu Kampanja',
    icon: BarChart3,
    text: 'Kampanja "Upoznavanje brenda" na Instagramu ima pad angažmana (-18% u zadnja 2 tjedna). Predlažemo osvježavanje kreativa i A/B testiranje novih vizuala prije ponovnog pokretanja.',
    priority: 'Srednji',
  },
  {
    agent: 'AI Direktor Marketinga',
    icon: Zap,
    text: 'Ukupni ROAS portfelja je 3.4x — iznad cilja od 3.0x. Preporučujemo reinvestiranje 15% profita u testiranje novih kanala (Reddit Ads, Pinterest) za diversifikaciju.',
    priority: 'Nizak',
  },
];

const priorityColors: Record<string, string> = {
  'Visok': 'text-red-400 bg-red-400/10',
  'Srednji': 'text-amber-400 bg-amber-400/10',
  'Nizak': 'text-zinc-400 bg-zinc-400/10',
};

// ── Helpers ──
function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function formatEuro(n: number): string {
  return `€${n.toLocaleString('hr')}`;
}

// ── Component ──
export default function CampaignIntelligence() {
  const [campaigns] = useState<Campaign[]>(sampleCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const avgRoas = (campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const activeCount = campaigns.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inteligencija Kampanja</h1>
          <p className="text-zinc-400 mt-1">
            AI-pokretana analiza i upravljanje marketinškim kampanjama — otkrivajte prilike, optimizirajte budžet i pratite rezultate u stvarnom vremenu
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 hover:from-brand-purple-400 hover:to-brand-blue-400 text-white text-sm font-medium transition-all shadow-lg shadow-brand-purple-500/20 whitespace-nowrap">
          <Plus className="w-4 h-4" /> Nova Kampanja
        </button>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Aktivne kampanje" value={activeCount.toString()} change={`od ${campaigns.length} ukupno`} positive icon={Target} />
        <KPICard label="Ukupni budžet" value={formatEuro(totalBudget)} change="+8% ovaj mjesec" positive icon={DollarSign} />
        <KPICard label="Prosječni ROAS" value={`${avgRoas.toFixed(1)}x`} change="+0.3x" positive icon={TrendingUp} />
        <KPICard label="Ukupni doseg" value={formatNumber(totalImpressions)} change="+15% ovaj tjedan" positive icon={Eye} />
      </div>

      {/* ── Campaign Cards ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Kampanje</h2>
          <span className="text-xs text-zinc-500">{campaigns.length} kampanja</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {campaigns.map((campaign) => {
            const plat = platformConfig[campaign.platform];
            const st = statusConfig[campaign.status];
            const PlatIcon = plat.icon;
            const progress = (campaign.spent / campaign.budget) * 100;

            return (
              <GlassCard key={campaign.id} hover className="!p-5">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${plat.bg} flex items-center justify-center flex-shrink-0`}>
                      <PlatIcon className={`w-5 h-5 ${plat.color}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{campaign.name}</h3>
                      <p className="text-xs text-zinc-500">{campaign.platform}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${st.cls}`}>
                    {campaign.status === 'active' && <PlayCircle className="w-3 h-3 mr-1" />}
                    {campaign.status === 'paused' && <PauseCircle className="w-3 h-3 mr-1" />}
                    {campaign.status === 'draft' && <FileEdit className="w-3 h-3 mr-1" />}
                    {campaign.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {st.label}
                  </span>
                </div>

                {/* Budget bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-400">
                      Budžet: <span className="text-white font-medium">{formatEuro(campaign.spent)}</span> / {formatEuro(campaign.budget)}
                    </span>
                    <span className="text-zinc-500">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        progress >= 90 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        progress >= 60 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                        'bg-gradient-to-r from-emerald-500 to-emerald-400'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{formatNumber(campaign.impressions)}</p>
                    <p className="text-[10px] text-zinc-500">Prikazi</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{formatNumber(campaign.clicks)}</p>
                    <p className="text-[10px] text-zinc-500">Klikovi</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{campaign.conversions.toLocaleString('hr')}</p>
                    <p className="text-[10px] text-zinc-500">Konverzije</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-emerald-400">{campaign.roas}x</p>
                    <p className="text-[10px] text-zinc-500">ROAS</p>
                  </div>
                </div>

                {/* Extra stats */}
                <div className="flex items-center gap-4 text-[10px] text-zinc-500 mb-4">
                  <span>CTR: {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%</span>
                  <span>CVR: {((campaign.conversions / campaign.clicks) * 100).toFixed(1)}%</span>
                  <span>CPC: {formatEuro(Math.round(campaign.spent / campaign.clicks))}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors">
                    <Edit className="w-3.5 h-3.5" /> Uredi
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-purple-500/15 hover:bg-brand-purple-500/25 text-brand-purple-400 transition-colors">
                    <BarChart3 className="w-3.5 h-3.5" /> Analitika
                  </button>
                  <button
                    onClick={() => setSelectedCampaign(selectedCampaign?.id === campaign.id ? null : campaign)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors ml-auto"
                  >
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${selectedCampaign?.id === campaign.id ? 'rotate-90' : ''}`} />
                    Detalji
                  </button>
                </div>

                {/* Expanded details */}
                {selectedCampaign?.id === campaign.id && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-in">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-card !p-3 text-center">
                        <p className="text-lg font-bold text-white">{(campaign.conversions / (campaign.clicks || 1) * 100).toFixed(1)}%</p>
                        <p className="text-[10px] text-zinc-500">Stopa konverzije</p>
                      </div>
                      <div className="glass-card !p-3 text-center">
                        <p className="text-lg font-bold text-white">{formatEuro(Math.round(campaign.spent / (campaign.conversions || 1)))}</p>
                        <p className="text-[10px] text-zinc-500">Cijena po konverziji</p>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">
                      <strong className="text-zinc-400">Zadnja optimizacija:</strong> Prije 2 sata (AI agent)
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-lg text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20 transition-colors">
                        Pokreni kampanju
                      </button>
                      <button className="flex-1 py-2 rounded-lg text-xs font-medium bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors">
                        Dupliciraj
                      </button>
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* ── AI Agent Insights ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">AI Preporuke</h2>
        </div>
        <GlassCard className="!p-0 overflow-hidden">
          <div className="divide-y divide-white/5">
            {aiRecommendations.map((rec, i) => {
              const RecIcon = rec.icon;
              return (
                <div key={i} className="p-4 hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <RecIcon className="w-4 h-4 text-brand-purple-400" />
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
              );
            })}
          </div>
          <div className="px-4 py-3 border-t border-white/5 bg-white/[0.02]">
            <button className="flex items-center gap-2 text-xs text-brand-purple-400 hover:text-brand-purple-300 transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              Generiraj više preporuka
            </button>
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
