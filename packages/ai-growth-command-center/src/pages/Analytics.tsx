import { GlassCard } from '@base44/core';
import { useState } from 'react';
import {
  TrendingUp, BarChart3, PieChart, Zap, Sparkles,
  ArrowUpRight, ArrowDown, Eye, MousePointerClick2,
  Users, DollarSign, Activity, Target, Globe, Clock,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

// ── Types ──
interface TrafficDataPoint {
  dan: string;
  organski: number;
  placeni: number;
  drustveni: number;
  direktni: number;
}

interface PlatformConversion {
  platforma: string;
  konverzije: number;
}

interface TrafficSource {
  name: string;
  value: number;
}

interface PlatformRow {
  platforma: string;
  posjete: number;
  klikovi: number;
  angazman: number;
  konverzije: number;
  prihod: number;
  datum: string;
}

// ── 30-day traffic data (Croatian abbreviated dates) ──
const trafficData: TrafficDataPoint[] = [
  { dan: '01.07.', organski: 4200, placeni: 3100, drustveni: 1800, direktni: 1200 },
  { dan: '02.07.', organski: 4350, placeni: 3200, drustveni: 1900, direktni: 1150 },
  { dan: '03.07.', organski: 4100, placeni: 3400, drustveni: 1750, direktni: 1300 },
  { dan: '04.07.', organski: 4500, placeni: 2900, drustveni: 2100, direktni: 1400 },
  { dan: '05.07.', organski: 4800, placeni: 3600, drustveni: 2200, direktni: 1250 },
  { dan: '06.07.', organski: 3900, placeni: 2800, drustveni: 1700, direktni: 1100 },
  { dan: '07.07.', organski: 3700, placeni: 2500, drustveni: 1600, direktni: 1000 },
  { dan: '08.07.', organski: 4600, placeni: 3500, drustveni: 2300, direktni: 1350 },
  { dan: '09.07.', organski: 4900, placeni: 3700, drustveni: 2400, direktni: 1450 },
  { dan: '10.07.', organski: 5100, placeni: 3800, drustveni: 2500, direktni: 1500 },
  { dan: '11.07.', organski: 5200, placeni: 3900, drustveni: 2600, direktni: 1550 },
  { dan: '12.07.', organski: 4400, placeni: 3100, drustveni: 2000, direktni: 1300 },
  { dan: '13.07.', organski: 4100, placeni: 2800, drustveni: 1900, direktni: 1100 },
  { dan: '14.07.', organski: 4000, placeni: 2700, drustveni: 1800, direktni: 1050 },
  { dan: '15.07.', organski: 5300, placeni: 4100, drustveni: 2700, direktni: 1600 },
  { dan: '16.07.', organski: 5400, placeni: 4200, drustveni: 2800, direktni: 1650 },
  { dan: '17.07.', organski: 5000, placeni: 3800, drustveni: 2550, direktni: 1500 },
  { dan: '18.07.', organski: 5500, placeni: 4300, drustveni: 2900, direktni: 1700 },
  { dan: '19.07.', organski: 4700, placeni: 3400, drustveni: 2300, direktni: 1400 },
  { dan: '20.07.', organski: 4300, placeni: 3000, drustveni: 2100, direktni: 1200 },
  { dan: '21.07.', organski: 4200, placeni: 2900, drustveni: 2000, direktni: 1150 },
  { dan: '22.07.', organski: 5600, placeni: 4500, drustveni: 3000, direktni: 1800 },
  { dan: '23.07.', organski: 5800, placeni: 4700, drustveni: 3100, direktni: 1900 },
  { dan: '24.07.', organski: 5400, placeni: 4400, drustveni: 2850, direktni: 1750 },
  { dan: '25.07.', organski: 6000, placeni: 4900, drustveni: 3200, direktni: 2000 },
  { dan: '26.07.', organski: 5100, placeni: 4000, drustveni: 2600, direktni: 1600 },
  { dan: '27.07.', organski: 4600, placeni: 3500, drustveni: 2300, direktni: 1400 },
  { dan: '28.07.', organski: 4400, placeni: 3300, drustveni: 2200, direktni: 1350 },
  { dan: '29.07.', organski: 5900, placeni: 4800, drustveni: 3100, direktni: 1950 },
  { dan: '30.07.', organski: 6100, placeni: 5000, drustveni: 3300, direktni: 2100 },
];

// ── Platform conversion data ──
const conversionData: PlatformConversion[] = [
  { platforma: 'Facebook', konverzije: 1420 },
  { platforma: 'Instagram', konverzije: 1180 },
  { platforma: 'Google Ads', konverzije: 2340 },
  { platforma: 'TikTok', konverzije: 890 },
  { platforma: 'X (Twitter)', konverzije: 345 },
  { platforma: 'YouTube', konverzije: 520 },
];

const platformColors: Record<string, string> = {
  'Facebook': '#3b82f6',
  'Instagram': '#ec4899',
  'Google Ads': '#f59e0b',
  'TikTok': '#f43f5e',
  'X (Twitter)': '#6b7280',
  'YouTube': '#ef4444',
};

// ── Traffic sources ──
const trafficSources: TrafficSource[] = [
  { name: 'Organski', value: 45 },
  { name: 'Plaćeni', value: 30 },
  { name: 'Društvene mreže', value: 15 },
  { name: 'Direktni', value: 7 },
  { name: 'Email', value: 3 },
];

const sourceColors = ['#a78bfa', '#60a5fa', '#f59e0b', '#10b981', '#ec4899'];

// ── Platform breakdown table ──
const platformTableData: PlatformRow[] = [
  { platforma: 'Facebook', posjete: 142000, klikovi: 34000, angazman: 4.8, konverzije: 1420, prihod: 8230, datum: '30.07.2026.' },
  { platforma: 'Instagram', posjete: 118000, klikovi: 28500, angazman: 5.2, konverzije: 1180, prihod: 6840, datum: '30.07.2026.' },
  { platforma: 'Google Ads', posjete: 234000, klikovi: 52000, angazman: 3.1, konverzije: 2340, prihod: 13570, datum: '30.07.2026.' },
  { platforma: 'TikTok', posjete: 89000, klikovi: 22000, angazman: 7.2, konverzije: 890, prihod: 5160, datum: '30.07.2026.' },
  { platforma: 'X (Twitter)', posjete: 34500, klikovi: 8200, angazman: 2.8, konverzije: 345, prihod: 2000, datum: '30.07.2026.' },
  { platforma: 'YouTube', posjete: 52000, klikovi: 12800, angazman: 6.1, konverzije: 520, prihod: 3010, datum: '30.07.2026.' },
  { platforma: 'LinkedIn', posjete: 28000, klikovi: 6500, angazman: 3.4, konverzije: 280, prihod: 1620, datum: '30.07.2026.' },
  { platforma: 'Reddit', posjete: 21000, klikovi: 5100, angazman: 4.2, konverzije: 210, prihod: 1210, datum: '30.07.2026.' },
  { platforma: 'Email', posjete: 19000, klikovi: 7800, angazman: 8.5, konverzije: 380, prihod: 2200, datum: '30.07.2026.' },
  { platforma: 'Organska pretraga', posjete: 212000, klikovi: 45000, angazman: 2.5, konverzije: 1670, prihod: 9680, datum: '30.07.2026.' },
];

// ── AI insights ──
const aiInsights = [
  {
    agent: 'Agent za Analitiku',
    text: 'Promet s društvenih mreža porastao je 24% u zadnjih 7 dana — TikTok i Instagram predvode rast. Preporučujem povećanje budžeta za TikTok kampanje za 20% dok je angažman visok (7.2%).',
    priority: 'Visok',
    icon: TrendingUp,
  },
  {
    agent: 'Agent za Analitiku',
    text: 'Stopa konverzije organskog prometa (2.8%) značajno je ispod plaćenog (3.9%). Predlažem reviziju landing pageova za organski promet — dodavanje social proof elemenata i optimizaciju CTA gumba.',
    priority: 'Srednji',
    icon: Target,
  },
  {
    agent: 'Agent za Analitiku',
    text: 'Email marketing pokazuje najviši angažman (8.5%) ali samo 3% ukupnog prometa. Automatizirana email sekvenca za napuštene košarice mogla bi povećati konverzije za 15-20% u sljedećih 30 dana.',
    priority: 'Visok',
    icon: Zap,
  },
];

const priorityConfig: Record<string, string> = {
  'Visok': 'text-red-400 bg-red-400/10 border-red-400/20',
  'Srednji': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Nizak': 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
};

// ── Helpers ──
function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// ── Custom Tooltip ──
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-zinc-900/95 border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-medium text-zinc-400 mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-zinc-300">{entry.name}:</span>
          <span className="text-white font-medium">{formatNum(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="bg-zinc-900/95 border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-medium text-white">{payload[0].name}</p>
      <p className="text-xs text-zinc-400">{payload[0].value}% ukupnog prometa</p>
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
          <p className="text-2xl font-bold text-white">142,847</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18.3% u odnosu na prošli mjesec
          </p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm text-zinc-400">Stopa konverzije</span>
          </div>
          <p className="text-2xl font-bold text-white">3.86%</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +0.4% u odnosu na prošli mjesec
          </p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-blue-500/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-brand-blue-400" />
            </div>
            <span className="text-sm text-zinc-400">Ukupni prihod</span>
          </div>
          <p className="text-2xl font-bold text-white">€53,520</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +12.7% u odnosu na prošli mjesec
          </p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-sm text-zinc-400">ROI</span>
          </div>
          <p className="text-2xl font-bold text-white">342%</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +28% u odnosu na prošli mjesec
          </p>
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
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="dan"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  interval={4}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatNum(v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  type="monotone"
                  dataKey="organski"
                  name="Organski"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#a78bfa' }}
                />
                <Line
                  type="monotone"
                  dataKey="placeni"
                  name="Plaćeni"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#60a5fa' }}
                />
                <Line
                  type="monotone"
                  dataKey="drustveni"
                  name="Društvene mreže"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#f59e0b' }}
                />
                <Line
                  type="monotone"
                  dataKey="direktni"
                  name="Direktni"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="platforma"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatNum(v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="konverzije" name="Konverzije" radius={[6, 6, 0, 0]}>
                  {conversionData.map((entry, i) => (
                    <Cell key={i} fill={platformColors[entry.platforma] || '#71717a'} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="transparent"
                  >
                    {trafficSources.map((_, i) => (
                      <Cell key={i} fill={sourceColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 px-4">
              {trafficSources.map((source, i) => (
                <div key={source.name} className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sourceColors[i] }}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{source.name}</p>
                    <div className="w-full h-1.5 bg-white/5 rounded-full mt-1">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${source.value}%`,
                          backgroundColor: sourceColors[i],
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-zinc-400 font-medium">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
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
              {sortedTable.map((row, i) => (
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
              ))}
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
