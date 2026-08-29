import { GlassCard } from '@base44/core';
import { useState } from 'react';
import {
  Zap, Play, Pause, Clock, RotateCcw, CheckCircle2, AlertCircle,
  ArrowUpRight, Sparkles, Settings2, Timer, BellRing,
  TrendingUp, Megaphone, Target, CalendarCheck, FileText,
} from 'lucide-react';

// ── Types ──
interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: 'active' | 'paused';
  icon: typeof Zap;
  lastRun: string | null;
  iconColor: string;
  iconBg: string;
}

interface ActivityLogEntry {
  id: string;
  workflowName: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  trajanje: string;
}

// ── 6 Workflow definitions ──
// Dijelovi su DEFINICIJE automatizacija (naziv, opis, okidač, status konfiguracije).
// lastRun je null jer nijedna automatizacija još nije stvarno izvršena.
const workflows: AutomationWorkflow[] = [
  {
    id: 'wf-1',
    name: 'Jutarnji briefing',
    description: 'AI Direktor Marketinga analizira podatke i kreira dnevni plan — pregled ključnih metrika, prioriteta i preporuka za dan.',
    trigger: 'Svako jutro u 08:00',
    status: 'active',
    icon: Sparkles,
    lastRun: null,
    iconColor: 'text-brand-purple-400',
    iconBg: 'bg-brand-purple-500/20',
  },
  {
    id: 'wf-2',
    name: 'Detekcija trendova',
    description: 'Novi trend se šalje Agentu za Strategiju Sadržaja koji analizira relevantnost i predlaže sadržaj prilagođen hrvatskom tržištu.',
    trigger: 'Novi trend (real-time monitoring)',
    status: 'active',
    icon: TrendingUp,
    lastRun: null,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
  },
  {
    id: 'wf-3',
    name: 'Novo: Lead obavijest',
    description: 'Novi lead se dodaje u CRM i šalje se instant obavijest putem emaila i Telegrama s detaljima leada i preporukom za kontakt.',
    trigger: 'Novi lead otkriven',
    status: 'active',
    icon: Target,
    lastRun: null,
    iconColor: 'text-brand-blue-400',
    iconBg: 'bg-brand-blue-500/20',
  },
  {
    id: 'wf-4',
    name: 'Prilika za kampanju',
    description: 'Obavijest o novoj prilici — kada sustav detektira povoljne uvjete na tržištu (pad CPC-a, niska konkurencija, sezonski trend).',
    trigger: 'Otkrivena prilika na tržištu',
    status: 'paused',
    icon: Megaphone,
    lastRun: null,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
  },
  {
    id: 'wf-5',
    name: 'Optimizacija kampanje',
    description: 'Agent za Optimizaciju kreira plan poboljšanja kada detektira slabe performanse — prilagodba licitacija, publike, kreativa i budžeta.',
    trigger: 'Slaba izvedba kampanje (ROAS < 1.5)',
    status: 'active',
    icon: Settings2,
    lastRun: null,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/20',
  },
  {
    id: 'wf-6',
    name: 'Tjedni izvještaj',
    description: 'Generiranje tjednog marketinškog izvještaja s KPI-evima, trendovima, usporedbom s prošlim tjednom i AI preporukama za sljedeći tjedan.',
    trigger: 'Svaki petak u 17:00',
    status: 'active',
    icon: FileText,
    lastRun: null,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/20',
  },
];

// ── Activity log entries (prazno — nijedna automatizacija još nije izvršena) ──
const activityLog: ActivityLogEntry[] = [];

// ── Status config ──
const statusIconMap: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: AlertCircle,
};

const statusColorMap: Record<string, string> = {
  success: 'text-emerald-400 bg-emerald-400/10',
  warning: 'text-amber-400 bg-amber-400/10',
  error: 'text-red-400 bg-red-400/10',
};

const statusTextMap: Record<string, string> = {
  success: 'Uspješno',
  warning: 'Upozorenje',
  error: 'Greška',
};

// ── Component ──
export default function AutomationCenter() {
  const [workflowStates, setWorkflowStates] = useState(workflows.map((w) => ({ ...w })));

  function toggleStatus(id: string) {
    setWorkflowStates((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: w.status === 'active' ? 'paused' as const : 'active' as const } : w
      )
    );
  }

  function triggerManual(id: string) {
    // Bez stvarnog izvršavanja ne izmišljamo vrijeme završetka — ostaje iskreno prazno.
    setWorkflowStates((prev) =>
      prev.map((w) => (w.id === id ? { ...w, lastRun: null } : w))
    );
  }

  const activeCount = workflowStates.filter((w) => w.status === 'active').length;
  const todayTasks = activityLog.length;

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Centar Automatizacije</h1>
        <p className="text-zinc-400 mt-1">Automatizirajte marketinške tijekove rada i prepustite AI agentima svakodnevne zadatke</p>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm text-zinc-400">Aktivne automatizacije</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeCount}</p>
          <p className="text-xs text-zinc-500 mt-1">od ukupno {workflowStates.length}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-blue-500/20 flex items-center justify-center">
              <Timer className="w-4 h-4 text-brand-blue-400" />
            </div>
            <span className="text-sm text-zinc-400">Zadataka izvršeno</span>
          </div>
          <p className="text-2xl font-bold text-white">{todayTasks}</p>
          <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-zinc-600" /> Nema izvršenih zadataka
          </p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-brand-purple-400" />
            </div>
            <span className="text-sm text-zinc-400">Uspješnost</span>
          </div>
          <p className="text-2xl font-bold text-white">—</p>
          <p className="text-xs text-zinc-500 mt-1">Nema podataka</p>
        </GlassCard>
      </div>

      {/* ── Workflow Cards ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Aktivni tijekovi rada</h2>
          <span className="text-xs text-zinc-500">{workflowStates.length} tijekova</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowStates.map((wf) => {
            const Icon = wf.icon;
            const isActive = wf.status === 'active';
            return (
              <GlassCard key={wf.id} className="flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${wf.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${wf.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{wf.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                          }`}
                        />
                        <span className={`text-[11px] font-medium ${isActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {isActive ? 'Aktivna' : 'Pauzirana'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Toggle button */}
                  <button
                    onClick={() => toggleStatus(wf.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                    }`}
                    title={isActive ? 'Pauziraj' : 'Aktiviraj'}
                  >
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed mb-4 flex-1">{wf.description}</p>

                {/* Trigger */}
                <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <BellRing className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-zinc-500">Okidač</p>
                    <p className="text-xs text-zinc-300 truncate">{wf.trigger}</p>
                  </div>
                </div>

                {/* Last run */}
                <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Zadnje izvršavanje: </span>
                  <span className="text-zinc-400 font-medium">{wf.lastRun ?? 'Još nije pokrenut'}</span>
                </div>

                {/* Action button */}
                <button
                  onClick={() => triggerManual(wf.id)}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-zinc-300 hover:text-white transition-all border border-white/10 hover:border-white/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Pokreni ručno
                </button>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* ── Activity Log: Zadnja izvršavanja ── */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-brand-purple-400" />
              <h2 className="text-lg font-semibold text-white">Zadnja izvršavanja</h2>
            </div>
            <span className="text-xs text-zinc-500">{activityLog.length} unosa</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Tijek rada</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Poruka</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Trajanje</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Vrijeme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activityLog.map((entry) => {
                const StatusIcon = statusIconMap[entry.status];
                return (
                  <tr key={entry.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusColorMap[entry.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusTextMap[entry.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white text-sm font-medium">{entry.workflowName}</span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-zinc-400 text-xs leading-relaxed">{entry.message}</span>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      <span className="text-zinc-500 text-xs">{entry.trajanje}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-zinc-500 text-xs whitespace-nowrap">{entry.timestamp}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {activityLog.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-sm text-zinc-400">Još nema aktivnosti.</p>
              <p className="text-xs text-zinc-500 mt-1">
                Dnevnik izvršavanja se puni tek kada automatizacije stvarno izvrše zadatke.
              </p>
            </div>
          )}
        </div>
      </GlassCard>

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
