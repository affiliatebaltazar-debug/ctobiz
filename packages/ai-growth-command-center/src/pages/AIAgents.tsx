import { useState, useEffect, useRef, useMemo } from 'react';
import { aiAgents } from '../agents/definitions';
import { GlassCard } from '@base44/core';
import type { AgentDefinition, AgentCategory, AgentStatus } from '../types';
import type { LucideIcon } from 'lucide-react';
import {
  Brain, Search, BarChart3, Lightbulb, FileText, Video,
  Facebook, Instagram, MessageCircle, Globe, Eye,
  TrendingUp, Link, Twitter, Crosshair, Workflow, FileSpreadsheet,
  Bot, Zap, X, Clock, CheckCircle2, AlertCircle,
  Play, Pause, Activity, ArrowRight, SlidersHorizontal,
} from 'lucide-react';

// ── Icon mapping ──
const iconMap: Record<string, LucideIcon> = {
  Brain, Search, BarChart3, Lightbulb, FileText, Video,
  Facebook, Instagram, Twitter, MessageCircle, Globe, Eye,
  TrendingUp, Link, Crosshair, Workflow, FileSpreadsheet,
  Zap, Bot,
  Spider: Globe, // fallback for Spider icon
};

function getAgentIcon(iconName: string): LucideIcon {
  return iconMap[iconName] ?? Bot;
}

// ── Category config ──
const categoryColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Upravljanje':     { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30', dot: 'bg-purple-400' },
  'Kampanje':        { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  'Sadržaj':         { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  'Društvene mreže': { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30', dot: 'bg-pink-400' },
  'Oglašavanje':     { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  'SEO':             { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  'Leadovi':         { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', dot: 'bg-red-400' },
  'Analitika':       { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30', dot: 'bg-cyan-400' },
  'Automatizacija':  { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30', dot: 'bg-indigo-400' },
};

const allCategories: AgentCategory[] = [
  'Upravljanje', 'Kampanje', 'Sadržaj', 'Društvene mreže',
  'Oglašavanje', 'SEO', 'Leadovi', 'Analitika', 'Automatizacija',
];

// ── Status config ──
const statusConfig: Record<AgentStatus, { label: string; dot: string; badge: string }> = {
  active:      { label: 'Aktivan',      dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]', badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  idle:        { label: 'Neaktivan',    dot: 'bg-zinc-500',                                             badge: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' },
  configuring: { label: 'Konfiguracija',dot: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]',      badge: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
};

// ── Capabilities per category ──
const capabilitiesByCategory: Record<string, string[]> = {
  'Upravljanje': [
    'Donosi strateške marketinške odluke na temelju podataka u stvarnom vremenu',
    'Upravlja marketinškim proračunom i alocira resurse po kanalima',
    'Koordinira tim od 24 specijalizirana AI agenta',
    'Analizira ROI svih marketinških aktivnosti',
    'Optimizira marketinški miks za maksimalne rezultate',
  ],
  'Kampanje': [
    'Otkriva nove prilike za kampanje kroz analizu tržišta',
    'Analizira performanse kampanja u stvarnom vremenu',
    'Provodi A/B testiranje kreativa i publika',
    'Optimizira budžet kampanje za najbolji ROAS',
    'Predviđa rezultate kampanja koristeći prediktivne modele',
  ],
  'Sadržaj': [
    'Kreira sveobuhvatne strategije sadržaja prilagođene publici',
    'Piše profesionalne skripte za video i audio sadržaj',
    'Planira video produkciju od ideje do objave',
    'Optimizira sadržaj za SEO i društvene mreže',
    'Prilagođava ton glasa i stil brendu',
  ],
  'Društvene mreže': [
    'Upravlja objavama na svim glavnim platformama',
    'Analizira angažman publike i optimizira vrijeme objave',
    'Prati trendove i viralne teme u niši',
    'Automatizira raspored objavljivanja',
    'Upravlja zajednicom i odgovara na komentare',
  ],
  'Oglašavanje': [
    'Kreira i optimizira Google Ads kampanje svih vrsta',
    'Istražuje i optimizira ključne riječi za najbolji CPC',
    'Analizira konkurentske oglase i strategije',
    'Upravlja budžetom oglasa u stvarnom vremenu',
    'Provodi A/B testiranje oglasa za maksimalni CTR',
  ],
  'SEO': [
    'Provodi on-page SEO optimizaciju web stranica',
    'Rješava tehničke SEO probleme i poboljšava Core Web Vitals',
    'Istražuje ključne riječi s visokim potencijalom',
    'Gradi i upravlja profilom backlinkova',
    'Prati pozicije na tražilicama i konkurenciju',
  ],
  'Leadovi': [
    'Pronalazi i kvalificira potencijalne klijente kroz više kanala',
    'Automatizira follow-up sekvence za leadove',
    'Segmentira publiku prema ponašanju i interesima',
    'Analizira stopu konverzije kroz funnel',
    'Integrira se s CRM sustavima za seamless prijenos',
  ],
  'Analitika': [
    'Prikuplja podatke iz svih marketinških kanala',
    'Generira detaljne izvještaje s ključnim metrikama',
    'Koristi prediktivnu analitiku za predviđanje trendova',
    'Detektira anomalije u performansama kampanja',
    'Vizualizira podatke za brže donošenje odluka',
  ],
  'Automatizacija': [
    'Automatizira marketinške tijekove rada end-to-end',
    'Planira i raspoređuje zadatke po prioritetu',
    'Šalje notifikacije o ključnim događajima',
    'Integrira različite alate u jedinstveni sustav',
    'Upravlja webhookovima i API pozivima',
  ],
};

// ── Simulated agent metrics ──
function getAgentMetrics(agent: AgentDefinition) {
  // Deterministic but varied metrics based on agent id
  const hash = agent.id.split('-').reduce((acc, s) => acc + (parseInt(s) || 0), 0);
  const taskCount = 12 + (hash * 7) % 60;
  const successRate = 85 + (hash % 14);
  const lastRun = new Date(Date.now() - ((hash * 13) % 1440) * 60 * 1000);

  const times = ['Prije 3 minute', 'Prije 12 minuta', 'Prije 47 minuta', 'Prije 1 sat', 'Prije 2 sata', 'Prije 3 sata', 'Prije 5 sati', 'Prije 8 sati', 'Prije 11 sati', 'Prije 1 dan'];
  const lastRunStr = agent.status === 'active' ? times[hash % times.length] : times[(hash + 5) % times.length];

  return { taskCount, successRate, lastRunStr };
}

// ── Simulated activity log ──
const activityLogTemplates: Record<string, string[]> = {
  'Upravljanje': [
    'Analizirao tržišne trendove za Q3 strategiju',
    'Koordinirao tjedni sastanak agenata',
    'Optimizirao raspodjelu budžeta po kanalima',
    'Pregledao ROI izvještaj za protekli mjesec',
    'Donio odluku o povećanju budžeta za Google Ads',
    'Ažurirao marketinšku strategiju na temelju novih podataka',
  ],
  'Kampanje': [
    'Analizirao Facebook kampanju #12',
    'Pokrenuo A/B test za kampanju #8',
    'Optimizirao targeting za Google Ads kampanju',
    'Otkrio novu priliku za kampanju u niši',
    'Generirao izvještaj performansi kampanja',
  ],
  'Sadržaj': [
    'Generirao sadržaj za Instagram objave',
    'Napisao skriptu za YouTube video',
    'Planirao seriju TikTok videa za sljedeći tjedan',
    'Optimizirao blog članak za SEO',
    'Kreirao strategiju sadržaja za novu kampanju',
  ],
  'Društvene mreže': [
    'Objavio post na Facebook stranici',
    'Analizirao angažman na Instagram Reels',
    'Pratio konkurenciju na X platformi',
    'Odgovorio na komentare na Redditu',
    'Optimizirao vrijeme objave za maksimalni doseg',
  ],
  'Oglašavanje': [
    'Optimizirao Google Ads kampanju #5',
    'Istražio nove ključne riječi za Search kampanju',
    'Analizirao konkurentske Google Ads oglase',
    'Prilagodio budžet za Display kampanju',
    'Pokrenuo novi set oglasa za Shopping kampanju',
  ],
  'SEO': [
    'Istraživanje ključnih riječi za SEO',
    'Analizirao profil backlinkova konkurencije',
    'Optimizirao meta tagove za 12 stranica',
    'Pronašao 8 novih backlink prilika',
    'Popravio tehničke SEO probleme na webu',
  ],
  'Leadovi': [
    'Kvalificirao 23 nova leada',
    'Poslao follow-up email za 15 leadova',
    'Segmentirao bazu leadova po interesima',
    'Analizirao konverzijski funnel',
    'Sinkronizirao leadove s CRM sustavom',
  ],
  'Analitika': [
    'Generirao tjedni izvještaj performansi',
    'Detektirao anomaliju u podacima kampanje #3',
    'Kreirao vizualizaciju dosega po platformama',
    'Analizirao trend konverzija za protekli mjesec',
    'Poslao dnevni izvještaj na email',
  ],
  'Automatizacija': [
    'Automatizirao objavu sadržaja za cijeli tjedan',
    'Pokrenuo workflow za novu kampanju',
    'Poslao notifikaciju o novim leadovima',
    'Integrirao novi API endpoint',
    'Izrada tjednog izvještaja u PDF formatu',
  ],
};

function generateActivityLog(agent: AgentDefinition, count: number) {
  const templates = activityLogTemplates[agent.category] || activityLogTemplates['Upravljanje'];
  const minutes = [3, 12, 35, 60, 125, 180, 240, 420, 540, 720];
  return Array.from({ length: Math.min(count, templates.length) }, (_, i) => ({
    action: templates[i % templates.length],
    time: minutes[i] < 60 ? `Prije ${minutes[i]} min` : `Prije ${Math.floor(minutes[i] / 60)}h`,
    timestamp: new Date(Date.now() - minutes[i] * 60 * 1000).toISOString(),
  }));
}

// ── Task queue data ──
const taskQueueData = [
  { id: 't1', agentId: 'agent-02', agentName: 'Agent za Otkrivanje Kampanja', task: 'Analiza tržišnih trendova za Q4', status: 'in-progress' as const, priority: 'Visok', time: 'U tijeku 8 min' },
  { id: 't2', agentId: 'agent-07', agentName: 'Facebook Marketing Stručnjak', task: 'Optimizacija oglasa za kampanju #15', status: 'pending' as const, priority: 'Visok', time: 'Na čekanju' },
  { id: 't3', agentId: 'agent-17', agentName: 'SEO Stručnjak', task: 'Istraživanje ključnih riječi za blog', status: 'pending' as const, priority: 'Srednji', time: 'Na čekanju' },
  { id: 't4', agentId: 'agent-20', agentName: 'Lovac na Leadove', task: 'Kvalifikacija novih leadova s LinkedIna', status: 'in-progress' as const, priority: 'Visok', time: 'U tijeku 3 min' },
  { id: 't5', agentId: 'agent-05', agentName: 'Agent za Pisanje Skripti', task: 'Generiranje sadržaja za Instagram Reels', status: 'pending' as const, priority: 'Srednji', time: 'Na čekanju' },
  { id: 't6', agentId: 'agent-23', agentName: 'Agent za Automatizaciju', task: 'Izrada tjednog izvještaja za klijenta', status: 'completed' as const, priority: 'Nizak', time: 'Završeno prije 12 min' },
  { id: 't7', agentId: 'agent-21', agentName: 'Agent za Analitiku', task: 'Analiza performansi Google Ads kampanja', status: 'completed' as const, priority: 'Visok', time: 'Završeno prije 45 min' },
  { id: 't8', agentId: 'agent-09', agentName: 'Instagram Marketing Stručnjak', task: 'Praćenje konkurencije na Instagramu', status: 'pending' as const, priority: 'Nizak', time: 'Na čekanju' },
];

const taskStatusConfig = {
  'pending':     { label: 'Na čekanju', icon: Clock,       cls: 'text-amber-400 bg-amber-400/10' },
  'in-progress': { label: 'U tijeku',   icon: Activity,    cls: 'text-blue-400 bg-blue-400/10' },
  'completed':   { label: 'Završeno',   icon: CheckCircle2, cls: 'text-emerald-400 bg-emerald-400/10' },
};

// ── Main component ──
export default function AIAgents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Svi');
  const [selectedStatus, setSelectedStatus] = useState<string>('Svi');
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Close detail panel on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedAgent(null);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (detailRef.current && !detailRef.current.contains(e.target as Node)) {
        setSelectedAgent(null);
      }
    }
    if (selectedAgent) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [selectedAgent]);

  // Filter agents
  const filteredAgents = useMemo(() => {
    return aiAgents.filter((agent) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q
        || agent.name.toLowerCase().includes(q)
        || agent.description.toLowerCase().includes(q)
        || agent.category.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'Svi' || agent.category === selectedCategory;
      const matchesStatus = selectedStatus === 'Svi' || agent.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Group filtered agents by category
  const groupedAgents = useMemo(() => {
    const groups: Record<string, AgentDefinition[]> = {};
    for (const agent of filteredAgents) {
      if (!groups[agent.category]) groups[agent.category] = [];
      groups[agent.category].push(agent);
    }
    return groups;
  }, [filteredAgents]);

  const categoryOrder = selectedCategory === 'Svi' ? allCategories : [selectedCategory as AgentCategory];
  const displayCategories = categoryOrder.filter((c) => groupedAgents[c]?.length);

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">AI Agenti</h1>
        <p className="text-zinc-400 mt-1">
          24 specijalizirana AI agenta za vaš marketing — upravljajte, pokrećite i pratite sve na jednom mjestu
        </p>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Ukupno agenata', value: aiAgents.length, color: 'text-white' },
          { label: 'Aktivnih', value: aiAgents.filter((a) => a.status === 'active').length, color: 'text-emerald-400' },
          { label: 'U konfiguraciji', value: aiAgents.filter((a) => a.status === 'configuring').length, color: 'text-amber-400' },
          { label: 'Neaktivnih', value: aiAgents.filter((a) => a.status === 'idle').length, color: 'text-zinc-400' },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pretraži agente po imenu, opisu ili kategoriji..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-purple-500/50 focus:ring-1 focus:ring-brand-purple-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedCategory('Svi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === 'Svi'
                ? 'bg-brand-purple-500/20 text-brand-purple-400 border border-brand-purple-500/30'
                : 'text-zinc-400 border border-transparent hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            Svi
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                selectedCategory === cat
                  ? `${categoryColors[cat].bg} ${categoryColors[cat].text} ${categoryColors[cat].border}`
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
          <div className="flex items-center gap-1.5">
            {['Svi', 'active', 'idle', 'configuring'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                  selectedStatus === s
                    ? 'bg-white/10 text-white border-white/20'
                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
              >
                {s === 'Svi' ? 'Svi statusi' : statusConfig[s as AgentStatus]?.label ?? s}
              </button>
            ))}
          </div>
          {filteredAgents.length < aiAgents.length && (
            <span className="text-xs text-zinc-500 ml-auto">
              {filteredAgents.length} / {aiAgents.length} agenata
            </span>
          )}
        </div>
      </div>

      {/* ── Agent Grid ── */}
      {displayCategories.length === 0 ? (
        <div className="text-center py-16">
          <Bot className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">Nema agenata koji odgovaraju filterima</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('Svi'); setSelectedStatus('Svi'); }}
            className="mt-2 text-sm text-brand-purple-400 hover:text-brand-purple-300 transition-colors"
          >
            Očisti sve filtere
          </button>
        </div>
      ) : (
        displayCategories.map((category) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${categoryColors[category]?.dot ?? 'bg-zinc-500'}`} />
              <h2 className="text-base font-semibold text-white">{category}</h2>
              <span className="text-xs text-zinc-500">({groupedAgents[category].length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {groupedAgents[category].map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onSelect={() => setSelectedAgent(agent)}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {/* ── Task Queue ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-brand-purple-400" />
          <h2 className="text-base font-semibold text-white">Red čekanja</h2>
          <span className="text-xs text-zinc-500">({taskQueueData.length} zadataka)</span>
        </div>
        <GlassCard className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Agent</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Zadatak</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Prioritet</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Vrijeme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {taskQueueData.map((task) => {
                  const stCfg = taskStatusConfig[task.status];
                  const StatusIcon = stCfg.icon;
                  return (
                    <tr key={task.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-white text-sm font-medium truncate block max-w-[180px]">{task.agentName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-zinc-300 text-sm">{task.task}</span>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${stCfg.cls}`}>
                          <StatusIcon className="w-3 h-3" />
                          {stCfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className={`text-xs font-medium ${
                          task.priority === 'Visok' ? 'text-red-400' :
                          task.priority === 'Srednji' ? 'text-amber-400' :
                          'text-zinc-400'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-xs text-zinc-500">{task.time}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      {/* ── Agent Detail Panel (slide-in from right) ── */}
      {selectedAgent && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          {/* Panel */}
          <div
            ref={detailRef}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-base-800 border-l border-white/10 shadow-2xl z-50 overflow-y-auto animate-slide-in"
          >
            <AgentDetailPanel
              agent={selectedAgent}
              onClose={() => setSelectedAgent(null)}
            />
          </div>
        </>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}

// ── Agent Card ──
function AgentCard({ agent, onSelect }: { agent: AgentDefinition; onSelect: () => void }) {
  const AgentIcon = getAgentIcon(agent.icon);
  const metrics = getAgentMetrics(agent);
  const catColor = categoryColors[agent.category] ?? categoryColors['Upravljanje'];
  const stCfg = statusConfig[agent.status];
  const shortDesc = agent.description.split('.')[0] + '.';

  return (
    <button
      onClick={onSelect}
      className="glass-card-hover p-4 text-left w-full cursor-pointer group relative overflow-hidden"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${catColor.dot.replace('bg-', '') === 'purple-400' ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.04)'}, transparent 70%)`,
        }}
      />

      <div className="relative">
        {/* Top row: icon + name + status */}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl ${catColor.bg} flex items-center justify-center flex-shrink-0`}>
            <AgentIcon className="w-5 h-5 text-white/80" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white truncate">{agent.name}</h3>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${stCfg.dot}`} title={stCfg.label} />
            </div>
            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
              {agent.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 mt-3 line-clamp-2">{shortDesc}</p>

        {/* Performance bar (for active agents) */}
        {agent.status === 'active' && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-zinc-500">Uspješnost</span>
              <span className="text-emerald-400 font-medium">{metrics.successRate}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${metrics.successRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${stCfg.badge}`}>
            {stCfg.label}
          </span>
          <span className="text-[10px] text-zinc-500">
            {metrics.taskCount} zadataka
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Agent Detail Panel ──
function AgentDetailPanel({ agent, onClose }: { agent: AgentDefinition; onClose: () => void }) {
  const AgentIcon = getAgentIcon(agent.icon);
  const metrics = getAgentMetrics(agent);
  const catColor = categoryColors[agent.category] ?? categoryColors['Upravljanje'];
  const stCfg = statusConfig[agent.status];
  const caps = capabilitiesByCategory[agent.category] || capabilitiesByCategory['Upravljanje'];
  const activity = generateActivityLog(agent, 5);

  const [localStatus, setLocalStatus] = useState(agent.status);

  const toggleStatus = () => {
    setLocalStatus((s) => (s === 'active' ? 'idle' : s === 'idle' ? 'active' : 'active'));
  };

  const currentStCfg = statusConfig[localStatus];

  return (
    <div className="p-6">
      {/* Close button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Detalji agenta</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Agent header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-14 h-14 rounded-xl ${catColor.bg} flex items-center justify-center flex-shrink-0`}>
          <AgentIcon className="w-7 h-7 text-white/80" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{agent.name}</h3>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
            {agent.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-300 mb-6 leading-relaxed">{agent.description}</p>

      {/* Status toggle */}
      <div className="glass-card !p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${currentStCfg.dot}`} />
            <span className="text-sm font-medium text-white">{currentStCfg.label}</span>
          </div>
          <button
            onClick={toggleStatus}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              localStatus === 'active'
                ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20 hover:bg-amber-400/20'
                : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20'
            }`}
          >
            {localStatus === 'active' ? (
              <><Pause className="w-3.5 h-3.5" /> Pauziraj</>
            ) : (
              <><Play className="w-3.5 h-3.5" /> Aktiviraj</>
            )}
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <GlassCard className="!p-3 text-center">
          <p className="text-lg font-bold text-white">{metrics.taskCount}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Zadataka</p>
        </GlassCard>
        <GlassCard className="!p-3 text-center">
          <p className="text-lg font-bold text-emerald-400">{metrics.successRate}%</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Uspješnost</p>
        </GlassCard>
        <GlassCard className="!p-3 text-center">
          <p className="text-xs font-bold text-zinc-300 truncate">{metrics.lastRunStr}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Zadnje izvrš.</p>
        </GlassCard>
      </div>

      {/* Capabilities */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3">Mogućnosti</h4>
        <div className="space-y-2">
          {caps.map((cap, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-zinc-300">{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action button */}
      <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 text-white text-sm font-medium hover:from-brand-purple-400 hover:to-brand-blue-400 transition-all flex items-center justify-center gap-2 mb-6">
        <Play className="w-4 h-4" />
        Pokreni zadatak
      </button>

      {/* Activity log */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-zinc-500" />
          Log aktivnosti
        </h4>
        <div className="space-y-0">
          {activity.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-purple-400/60 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300 truncate">{entry.action}</p>
              </div>
              <span className="text-xs text-zinc-500 flex-shrink-0">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
