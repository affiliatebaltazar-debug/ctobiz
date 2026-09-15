import { GlassCard } from '@base44/core';
import { useState } from 'react';
import {
  TrendingUp, BarChart3, PieChart, Sparkles,
  Eye, Target, DollarSign, Activity, Globe, Inbox,
} from 'lucide-react';

// ── Types ──
interface PlatformRow {
  platforma: string;
  posjete: number;
  klikovi: number;
  angazman: number;
  konverzije: number;
  prihod: number;
  datum: string;
}

// ── Platform breakdown table (prazno — nema stvarnih podataka dok se ne povežu platforme) ──
const platformTableData: PlatformRow[] = [];

// ── AI insights (prazno — agent za analitiku ih generira iz stvarnih podataka) ──
const aiInsights: { agent: string; text: string; priority: string; icon: any }[] = [];

const priorityConfig: Record<string, string> = {
  'Visok': 'text-red-400 bg-red-400/10 border-red-400/20',
  'Srednji': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Nizak': 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
};

const EMPTY_MSG = 'Još nema podataka — poveži platforme da počneš prikupljati stvarne podatke.';

// ── Helpers ──
function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// ── Honest empty state block (reused inside charts/sections) ──
function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="h-72 flex flex-col items-center justify-center text-center px-6">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-zinc-500" />
      </div>
      <p className="text-sm text-zinc-300 max-w-sm leading-relaxed">{message}</p>
    </div>
  );
}

// ── Component ──
export default function Analytics() {
  const [sortKey, setSortKey] = useState<keyof PlatformRow>('posjete');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedTable = [...platformTableData].sort((a, b) => {
    const val = sortDir === 'asc' ? (a[sortKey] as number) - (b[sortKey] as number) : (b[sortKey] as number) - (a[sortKey] as number);
    return val;
  });

  function handleSort(key: keyof PlatformRow) {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analitika</h1>
        <p className="text-zinc-400 mt-1">Detaljni uvidi i izvještaji o performansama svih marketinških kanala</p>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center">
              <Eye className="w-4 h-4 text-brand-purple-400" />
            </div>
            <span className="text-sm text-zinc-400">Ukupni promet</span>
          </div>
          <p className="text-2xl font-bold text-white">—</p>
          <p className="text-xs text-zinc-500 mt-1">Čeka prve stvarne podatke</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm text-zinc-400">Stopa konverzije</span>
          </div>
          <p className="text-2xl font-bold text-white">—</p>
          <p className="text-xs text-zinc-500 mt-1">Čeka prve stvarne podatke</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-blue-500/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-brand-blue-400" />
            </div>
            <span className="text-sm text-zinc-400">Ukupni prihod</span>
          </div>
          <p className="text-2xl font-bold text-white">—</p>
          <p className="text-xs text-zinc-500 mt-1">Čeka prve stvarne podatke</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-sm text-zinc-400">ROI</span>
          </div>
          <p className="text-2xl font-bold text-white">—</p>
          <p className="text-xs text-zinc-500 mt-1">Čeka prve stvarne podatke</p>
        </GlassCard>
      </div>

      {/* ── Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Promet kroz vrijeme */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-purple-400" />
              <h2 className="text-lg font-semibold text-white">Promet kroz vrijeme</h2>
            </div>
            <span className="text-xs text-zinc-500">Posljednjih 30 dana</span>
          </div>
          <EmptyState icon={TrendingUp} message={EMPTY_MSG} />
        </GlassCard>

        {/* Bar Chart: Konverzije po platformi */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-blue-400" />
              <h2 className="text-lg font-semibold text-white">Konverzije po platformi</h2>
            </div>
            <span className="text-xs text-zinc-500">Ovaj mjesec</span>
          </div>
          <EmptyState icon={BarChart3} message={EMPTY_MSG} />
        </GlassCard>

        {/* Pie Chart: Izvori prometa */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-brand-purple-400" />
              <h2 className="text-lg font-semibold text-white">Izvori prometa</h2>
            </div>
            <span className="text-xs text-zinc-500">Distribucija ukupnog prometa</span>
          </div>
          <EmptyState icon={PieChart} message={EMPTY_MSG} />
        </GlassCard>
      </div>

      {/* ── Platform Breakdown Table ── */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-blue-400" />
              <h2 className="text-lg font-semibold text-white">Pregled po platformi</h2>
            </div>
            <span className="text-xs text-zinc-500">Klikni na zaglavlje za sortiranje</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {[
                  { key: 'platforma' as keyof PlatformRow, label: 'Platforma', align: 'text-left' },
                  { key: 'posjete' as keyof PlatformRow, label: 'Posjete', align: 'text-right' },
                  { key: 'klikovi' as keyof PlatformRow, label: 'Klikovi', align: 'text-right' },
                  { key: 'angazman' as keyof PlatformRow, label: 'Angažman %', align: 'text-right' },
                  { key: 'konverzije' as keyof PlatformRow, label: 'Konverzije', align: 'text-right' },
                  { key: 'prihod' as keyof PlatformRow, label: 'Prihod', align: 'text-right' },
                  { key: 'datum' as keyof PlatformRow, label: 'Datum', align: 'text-right' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`${col.align} py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors select-none`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && (
                        <span className="text-brand-purple-400">{sortDir === 'desc' ? '↓' : '↑'}</span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedTable.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Inbox className="w-8 h-8 text-zinc-600 mb-3" />
                      <p className="text-sm text-zinc-400 max-w-sm">{EMPTY_MSG}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedTable.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-white text-sm font-medium">{row.platforma}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-zinc-300 text-sm">{formatNum(row.posjete)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-zinc-300 text-sm">{formatNum(row.klikovi)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-emerald-400 text-sm">{row.angazman}%</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-white text-sm font-medium">{formatNum(row.konverzije)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-brand-purple-400 text-sm font-medium">€{row.prihod.toLocaleString('hr')}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-zinc-500 text-xs">{row.datum}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── AI Agent Insights ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Preporuke</h2>
            <p className="text-xs text-zinc-500">Agent za Analitiku kontinuirano analizira podatke</p>
          </div>
        </div>
        <GlassCard className="!p-0 overflow-hidden">
          {aiInsights.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                Još nema AI preporuka — Agent za Analitiku će ih generirati nakon što povežeš izvore podataka.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {aiInsights.map((insight, i) => {
                const Icon = insight.icon;
                return (
                  <div key={i} className="p-4 hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-brand-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{insight.agent}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${priorityConfig[insight.priority]}`}>
                            Prioritet: {insight.priority}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{insight.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
