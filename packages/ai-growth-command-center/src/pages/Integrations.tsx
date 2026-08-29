import { GlassCard } from '@base44/core';
import { useState } from 'react';
import {
  Plug, Check, Clock, Settings2, Unlink,
  Bot, Brain, Cpu, Network, Globe,
  MessageCircle, Video, Camera, Search, TrendingUp,
  BarChart3, Database, Cloud,
  Mail, Send, Layers, Workflow, Zap, Link2,
} from 'lucide-react';

// ── Types ──
interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'disconnected';
  icon: typeof Bot;
  iconColor: string;
  iconBg: string;
  lastSync?: string;
  description: string;
}

// ── Category definitions ──
const categories: { name: string; icon: typeof Bot; color: string }[] = [
  { name: 'AI Provideri', icon: Brain, color: 'text-brand-purple-400' },
  { name: 'Društvene mreže', icon: Globe, color: 'text-brand-blue-400' },
  { name: 'Marketing', icon: TrendingUp, color: 'text-emerald-400' },
  { name: 'SEO', icon: Search, color: 'text-amber-400' },
  { name: 'Automatizacija', icon: Workflow, color: 'text-rose-400' },
  { name: 'Pohrana', icon: Cloud, color: 'text-cyan-400' },
  { name: 'Komunikacija', icon: MessageCircle, color: 'text-orange-400' },
];

// ── Integration data ──
// Sve integracije na početku su NEPOVEZANE — ništa nije stvarno spojeno.
// Status se mijenja tek nakon što korisnik stvarno poveže API konektor.
const integrations: Integration[] = [
  // AI Provideri
  { id: 'int-1', name: 'OpenAI', category: 'AI Provideri', status: 'disconnected', icon: Bot, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/20', description: 'GPT modeli — AI modeli za generiranje sadržaja, analitiku i optimizaciju' },
  { id: 'int-2', name: 'Google Gemini', category: 'AI Provideri', status: 'disconnected', icon: Brain, iconColor: 'text-brand-blue-400', iconBg: 'bg-brand-blue-500/20', description: 'Gemini modeli — napredna multimodalna AI obrada za slike i tekst' },
  { id: 'int-3', name: 'Groq', category: 'AI Provideri', status: 'disconnected', icon: Cpu, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/20', description: 'Ultra-brza AI inferencija — Llama modeli na Groq infrastrukturi' },
  { id: 'int-4', name: 'OpenRouter', category: 'AI Provideri', status: 'disconnected', icon: Network, iconColor: 'text-zinc-400', iconBg: 'bg-zinc-500/20', description: 'Pristup preko 200 AI modela kroz jedan API — Claude, Llama, Mixtral i drugi' },

  // Društvene mreže
  { id: 'int-5', name: 'Facebook', category: 'Društvene mreže', status: 'disconnected', icon: Globe, iconColor: 'text-blue-400', iconBg: 'bg-blue-500/20', description: 'Facebook Pages, Ads i Insights API — objavljivanje, oglašavanje i analitika' },
  { id: 'int-6', name: 'Instagram', category: 'Društvene mreže', status: 'disconnected', icon: Camera, iconColor: 'text-pink-400', iconBg: 'bg-pink-500/20', description: 'Instagram Graph API — objave, priče, reelovi i Instagram oglasi' },
  { id: 'int-7', name: 'TikTok', category: 'Društvene mreže', status: 'disconnected', icon: Video, iconColor: 'text-zinc-400', iconBg: 'bg-zinc-500/20', description: 'TikTok for Business API — video sadržaj, oglasi i analitika publike' },
  { id: 'int-8', name: 'X (Twitter)', category: 'Društvene mreže', status: 'disconnected', icon: Globe, iconColor: 'text-zinc-300', iconBg: 'bg-zinc-600/30', description: 'X API v2 — objave, analitika, praćenje trendova i angažmana' },
  { id: 'int-9', name: 'Reddit', category: 'Društvene mreže', status: 'disconnected', icon: MessageCircle, iconColor: 'text-orange-400', iconBg: 'bg-orange-500/20', description: 'Reddit API — praćenje subreddita, analiza sentimenta, lead discovery' },
  { id: 'int-10', name: 'YouTube', category: 'Društvene mreže', status: 'disconnected', icon: Video, iconColor: 'text-red-400', iconBg: 'bg-red-500/20', description: 'YouTube Data API v3 — video analitika, komentari, optimizacija SEO naslova' },

  // Marketing
  { id: 'int-11', name: 'Google Ads', category: 'Marketing', status: 'disconnected', icon: TrendingUp, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/20', description: 'Google Ads API — upravljanje kampanjama, ključnim riječima i budžetima' },
  { id: 'int-12', name: 'Google Analytics', category: 'Marketing', status: 'disconnected', icon: BarChart3, iconColor: 'text-orange-400', iconBg: 'bg-orange-500/20', description: 'Google Analytics 4 — promet, konverzije, atribucija i ponašanje korisnika' },
  { id: 'int-13', name: 'Google Search Console', category: 'Marketing', status: 'disconnected', icon: Search, iconColor: 'text-brand-blue-400', iconBg: 'bg-brand-blue-500/20', description: 'Search Console API — pozicije ključnih riječi, CTR, indeksiranje i tehnički SEO' },

  // SEO
  { id: 'int-14', name: 'Ahrefs', category: 'SEO', status: 'disconnected', icon: Search, iconColor: 'text-blue-400', iconBg: 'bg-blue-500/20', description: 'Ahrefs API — backlink profil, analiza konkurencije, keyword research i rank tracking' },
  { id: 'int-15', name: 'Semrush', category: 'SEO', status: 'disconnected', icon: TrendingUp, iconColor: 'text-zinc-400', iconBg: 'bg-zinc-500/20', description: 'Semrush API — SEO audit, pozicije, promet konkurencije i content gap analiza' },
  { id: 'int-16', name: 'Moz', category: 'SEO', status: 'disconnected', icon: BarChart3, iconColor: 'text-zinc-400', iconBg: 'bg-zinc-500/20', description: 'Moz API — DA/PA metrike, spam score, link building prilike i lokalni SEO' },

  // Automatizacija
  { id: 'int-17', name: 'Make.com', category: 'Automatizacija', status: 'disconnected', icon: Workflow, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/20', description: 'Make (Integromat) — vizualna automatizacija s 1500+ konektora za napredne scenarije' },
  { id: 'int-18', name: 'n8n', category: 'Automatizacija', status: 'disconnected', icon: Layers, iconColor: 'text-zinc-400', iconBg: 'bg-zinc-500/20', description: 'n8n — open-source automatizacija s vlastitim hostingom i prilagodljivim nodovima' },
  { id: 'int-19', name: 'Zapier', category: 'Automatizacija', status: 'disconnected', icon: Zap, iconColor: 'text-zinc-400', iconBg: 'bg-zinc-500/20', description: 'Zapier — 5000+ aplikacija, trigeri i akcije za automatizaciju bez koda' },

  // Pohrana
  { id: 'int-20', name: 'Google Drive', category: 'Pohrana', status: 'disconnected', icon: Cloud, iconColor: 'text-yellow-400', iconBg: 'bg-yellow-500/20', description: 'Google Drive API — spremanje izvještaja, kreativa, export podataka u Sheets' },
  { id: 'int-21', name: 'Dropbox', category: 'Pohrana', status: 'disconnected', icon: Database, iconColor: 'text-zinc-400', iconBg: 'bg-zinc-500/20', description: 'Dropbox API — cloud pohrana za velike datoteke, kreative i video materijale' },
  { id: 'int-22', name: 'Cloudinary', category: 'Pohrana', status: 'disconnected', icon: Camera, iconColor: 'text-sky-400', iconBg: 'bg-sky-500/20', description: 'Cloudinary API — optimizacija slika i videa, transformacije i CDN dostava' },

  // Komunikacija
  { id: 'int-23', name: 'Telegram Bot', category: 'Komunikacija', status: 'disconnected', icon: Send, iconColor: 'text-sky-400', iconBg: 'bg-sky-500/20', description: 'Telegram Bot API — instant obavijesti o leadovima, kampanjama, greškama i izvještajima' },
  { id: 'int-24', name: 'Email', category: 'Komunikacija', status: 'disconnected', icon: Mail, iconColor: 'text-brand-purple-400', iconBg: 'bg-brand-purple-500/20', description: 'SMTP/Email API — automatski emailovi, newsletteri, follow-up sekvence i izvještaji' },
];

// ── Component ──
export default function Integrations() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Sve');
  const [integrationStates, setIntegrationStates] = useState(integrations);

  const filteredIntegrations = selectedCategory === 'Sve'
    ? integrationStates
    : integrationStates.filter((i) => i.category === selectedCategory);

  const connectedCount = integrationStates.filter((i) => i.status === 'connected').length;
  const disconnectedCount = integrationStates.filter((i) => i.status === 'disconnected').length;

  function handleConnect(id: string) {
    setIntegrationStates((prev) =>
      prev.map((int) =>
        int.id === id
          ? { ...int, status: 'connected' as const }
          : int
      )
    );
  }

  function handleDisconnect(id: string) {
    setIntegrationStates((prev) =>
      prev.map((int) =>
        int.id === id
          ? { ...int, status: 'disconnected' as const }
          : int
      )
    );
  }

  const categoryInfo = categories.find((c) => c.name === selectedCategory);

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Integracije</h1>
        <p className="text-zinc-400 mt-1">Povežite svoje marketinške platforme i alate s Base44 za maksimalnu automatizaciju</p>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center">
              <Plug className="w-4 h-4 text-brand-purple-400" />
            </div>
            <span className="text-sm text-zinc-400">Ukupno integracija</span>
          </div>
          <p className="text-2xl font-bold text-white">{integrationStates.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Dostupnih API konektora</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm text-zinc-400">Povezano</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{connectedCount}</p>
          <p className="text-xs text-zinc-500 mt-1">
            {connectedCount === 0 ? 'Ništa nije povezano' : `${((connectedCount / integrationStates.length) * 100).toFixed(0)}% od ukupnog broja`}
          </p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-500/20 flex items-center justify-center">
              <Unlink className="w-4 h-4 text-zinc-400" />
            </div>
            <span className="text-sm text-zinc-400">Nepovezano</span>
          </div>
          <p className="text-2xl font-bold text-zinc-400">{disconnectedCount}</p>
          <p className="text-xs text-zinc-500 mt-1">Čeka povezivanje</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-blue-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-brand-blue-400" />
            </div>
            <span className="text-sm text-zinc-400">Posljednja sinkronizacija</span>
          </div>
          <p className="text-lg font-bold text-zinc-500">Nije dostupno</p>
          <p className="text-xs text-zinc-500 mt-1">Nema povezanih integracija</p>
        </GlassCard>
      </div>

      {/* ── Category Filter ── */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedCategory('Sve')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
            selectedCategory === 'Sve'
              ? 'border-brand-purple-400/40 text-brand-purple-400 bg-brand-purple-500/10'
              : 'border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          Sve ({integrationStates.length})
        </button>
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          const count = integrationStates.filter((i) => i.category === cat.name).length;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
                selectedCategory === cat.name
                  ? 'border-current/40 bg-white/5'
                  : 'border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
              style={selectedCategory === cat.name ? { color: cat.color.replace('text-', '#'), borderColor: cat.color.replace('text-', '#') + '66' } : {}}
            >
              <CatIcon className="w-3.5 h-3.5" />
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Integration Cards Grid ── */}
      {categories.filter((c) => selectedCategory === 'Sve' || c.name === selectedCategory).map((cat) => {
        const catIntegrations = filteredIntegrations.filter((i) => i.category === cat.name);
        if (catIntegrations.length === 0) return null;
        const CatIcon = cat.icon;

        return (
          <section key={cat.name}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center`}>
                <CatIcon className={`w-3.5 h-3.5 ${cat.color}`} />
              </div>
              <h2 className="text-base font-semibold text-white">{cat.name}</h2>
              <span className="text-xs text-zinc-500">({catIntegrations.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
              {catIntegrations.map((int) => {
                const Icon = int.icon;
                const isConnected = int.status === 'connected';

                return (
                  <GlassCard key={int.id} className="flex flex-col">
                    {/* Icon + Name + Status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${int.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${int.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">{int.name}</h3>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 ${
                              isConnected ? 'text-emerald-400' : 'text-zinc-500'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                            {isConnected ? 'Povezano' : 'Nije povezano'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4 flex-1">{int.description}</p>

                    {/* Last sync */}
                    {isConnected && int.lastSync && (
                      <div className="flex items-center gap-1.5 mb-3 text-[11px] text-zinc-500">
                        <Clock className="w-3 h-3" />
                        <span>Zadnja sinkronizacija: {int.lastSync}</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      {isConnected ? (
                        <>
                          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300 hover:text-white transition-all border border-white/10">
                            <Settings2 className="w-3.5 h-3.5" />
                            Konfiguriraj
                          </button>
                          <button
                            onClick={() => handleDisconnect(int.id)}
                            className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-all"
                            title="Prekini vezu"
                          >
                            <Unlink className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConnect(int.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-brand-purple-500/20 to-brand-blue-500/20 hover:from-brand-purple-500/30 hover:to-brand-blue-500/30 text-xs font-medium text-brand-purple-400 transition-all border border-brand-purple-500/30"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          Poveži
                        </button>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
