import GlassCard from '../components/ui/GlassCard';
import KPICard from '../components/ui/KPICard';
import { aiAgents } from '@base44/ai-growth-command-center/agents/definitions';
import type { LucideIcon } from 'lucide-react';
import {
  TrendingUp, Users, Target, Zap, Bot, BarChart3,
  Brain, Search, Lightbulb, FileText, Video,
  Facebook, Instagram, MessageCircle, Globe, Eye,
  LineChart, Link, Twitter, Crosshair, Workflow, FileSpreadsheet,
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';

// ── Icon mapping: string name → LucideIcon ──
const iconMap: Record<string, LucideIcon> = {
  Brain,
  Search,
  BarChart3,
  Lightbulb,
  FileText,
  Video,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Globe,
  Eye,
  LineChart,
  Link,
  Target,
  Users,
  TrendingUp,
  Zap,
  Bot,
  Crosshair,
  Workflow,
  FileSpreadsheet,
};

function getAgentIcon(iconName: string): LucideIcon {
  return iconMap[iconName] ?? Bot;
}

// ── Category badge colors ──
const categoryColors: Record<string, string> = {
  'Upravljanje': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Kampanje': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Sadržaj': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Društvene mreže': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Oglašavanje': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'SEO': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Leadovi': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Analitika': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'Automatizacija': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

// ── Status indicator ──
const statusStyles: Record<string, string> = {
  active: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]',
  idle: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]',
  configuring: 'bg-zinc-500',
};

const statusLabels: Record<string, string> = {
  active: 'Aktivan',
  idle: 'U mirovanju',
  configuring: 'Konfigurira se',
};

// ── Sample chart data ──
const dosegData = [
  { dan: 'Pon', doseg: 12400, angazman: 3200 },
  { dan: 'Uto', doseg: 18700, angazman: 4100 },
  { dan: 'Sri', doseg: 15300, angazman: 3800 },
  { dan: 'Čet', doseg: 22100, angazman: 5600 },
  { dan: 'Pet', doseg: 19800, angazman: 4900 },
  { dan: 'Sub', doseg: 14200, angazman: 3500 },
  { dan: 'Ned', doseg: 16100, angazman: 4200 },
];

const platformData = [
  { platform: 'Facebook', leadovi: 342 },
  { platform: 'Instagram', leadovi: 278 },
  { platform: 'X', leadovi: 156 },
  { platform: 'Reddit', leadovi: 89 },
  { platform: 'Google', leadovi: 203 },
  { platform: 'TikTok', leadovi: 167 },
  { platform: 'YouTube', leadovi: 112 },
];

// ── Custom tooltip style ──
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      {label && <p className="text-zinc-400 mb-1">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {entry.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const kpis = [
    { label: 'Aktivni AI Agenti', value: '24', change: 'Svi dostupni', positive: true, icon: Bot },
    { label: 'Generirani Leadovi', value: '1,247', change: '+12% ovaj tjedan', positive: true, icon: Users },
    { label: 'Aktivne Kampanje', value: '8', change: '+2 nove', positive: true, icon: Target },
    { label: 'Stopa Konverzije', value: '3.8%', change: '+0.5%', positive: true, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Nadzorna ploča</h1>
        <p className="text-zinc-400 mt-1">Dobrodošli u AI Growth Command Center</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* ── Agent Status Grid ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Status Agenta</h2>
          <span className="text-xs text-zinc-500">{aiAgents.length} agenata</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {aiAgents.map((agent) => {
            const AgentIcon = getAgentIcon(agent.icon);
            return (
              <div
                key={agent.id}
                className="glass-card p-3.5 flex flex-col gap-2 transition-all duration-200 hover:bg-white/[0.07] hover:border-brand-purple-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <AgentIcon className="w-4 h-4 text-brand-purple-400" />
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${statusStyles[agent.status] ?? statusStyles.configuring}`}
                    title={statusLabels[agent.status] ?? agent.status}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{agent.name}</p>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border self-start truncate max-w-full ${
                    categoryColors[agent.category] ?? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
                  }`}
                >
                  {agent.category}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity overview */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Aktivnost Agenta</h2>
            <span className="text-xs text-zinc-500">Zadnja 24 sata</span>
          </div>
          <div className="space-y-3">
            {[
              { agent: 'AI Direktor Marketinga', action: 'Analizirao tržišne trendove', time: 'Prije 5 min' },
              { agent: 'Facebook Marketing Stručnjak', action: 'Optimizirao kampanju #12', time: 'Prije 23 min' },
              { agent: 'Lovac na Leadove', action: 'Generirao 47 novih leadova', time: 'Prije 1 sat' },
              { agent: 'SEO Stručnjak', action: 'Analizirao ključne riječi', time: 'Prije 2 sata' },
              { agent: 'Agent za Analitiku', action: 'Generirao tjedni izvještaj', time: 'Prije 3 sata' },
            ].map((item) => (
              <div key={`${item.agent}-${item.time}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-brand-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.agent}</p>
                  <p className="text-xs text-zinc-400 truncate">{item.action}</p>
                </div>
                <span className="text-xs text-zinc-500 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick insights */}
        <div className="space-y-4">
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Brzi Uvid</h2>
            <div className="space-y-3">
              {[
                { label: 'Ukupni doseg', value: '124K', icon: BarChart3 },
                { label: 'Leadovi ovaj mjesec', value: '312', icon: Users },
                { label: 'Aktivni SEO projekti', value: '5', icon: Target },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Base44 aktivna</p>
                <p className="text-xs text-emerald-400">Svi sustavi operativni</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ── Charts Section ── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Pregled Performansi</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line chart: Doseg i Angažman */}
          <GlassCard>
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Doseg i Angažman</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={dosegData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="dan"
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="doseg"
                    name="Doseg"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={{ fill: '#7c3aed', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#7c3aed', stroke: 'rgba(124,58,237,0.3)', strokeWidth: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="angazman"
                    name="Angažman"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#3b82f6', stroke: 'rgba(59,130,246,0.3)', strokeWidth: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-[#7c3aed]" />
                <span className="text-xs text-zinc-400">Doseg</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-[#3b82f6]" />
                <span className="text-xs text-zinc-400">Angažman</span>
              </div>
            </div>
          </GlassCard>

          {/* Bar chart: Leadovi po Platformi */}
          <GlassCard>
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Leadovi po Platformi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="platform"
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={75}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="leadovi"
                    name="Leadovi"
                    radius={[0, 4, 4, 0]}
                    fill="#7c3aed"
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
