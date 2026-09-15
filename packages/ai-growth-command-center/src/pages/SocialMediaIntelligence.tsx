import { GlassCard } from '@base44/core';
import {
  Share2, TrendingUp, Heart, Users, Activity, Sparkles,
  Search,
} from 'lucide-react';

// ── Platform data (prazno — nijedna platforma još nije povezana) ──
const platformsData: { id: string; name: string }[] = [];

// ── Trending topics (prazno — agent ih prati tek nakon povezivanja platformi) ──
const trendingTopics: { topic: string; platform: string; engagement: string; growth: string; relevance: string }[] = [];

// ── Competitors (prazno — konkurenti se prate tek nakon što ih korisnik doda) ──
const competitors: { name: string; platform: string; recentActivity: string; engagement: string; followers: string; trend: 'up' | 'down' }[] = [];

// ── AI Recommendations (prazno — generiraju se iz stvarnih podataka) ──
const aiRecs: { agent: string; text: string; platform: string; priority: string }[] = [];

const priorityCls: Record<string, string> = {
  'Visok': 'text-red-400 bg-red-400/10',
  'Srednji': 'text-amber-400 bg-amber-400/10',
  'Nizak': 'text-zinc-400 bg-zinc-400/10',
};

const EMPTY_MSG = 'Još nema podataka — poveži platforme da počneš prikupljati stvarne podatke.';

// ── Honest empty state block (reused inside sections) ──
function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center px-6">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-zinc-500" />
      </div>
      <p className="text-sm text-zinc-300 max-w-sm leading-relaxed">{message}</p>
    </div>
  );
}

// ── Component ──
export default function SocialMediaIntelligence() {
  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Social Media Inteligencija</h1>
        <p className="text-zinc-400 mt-1">
          Analiza i upravljanje društvenim mrežama — pratite trendove, analizirajte konkurenciju i primajte AI preporuke za svaku platformu
        </p>
      </div>

      {/* ── Stats summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Ukupno pratitelja', value: '—', color: 'text-white', icon: Users },
          { label: 'Prosječni angažman', value: '—', color: 'text-emerald-400', icon: Heart },
          { label: 'Objave ovaj tjedan', value: '—', color: 'text-blue-400', icon: Activity },
          { label: 'Platformi', value: '0', color: 'text-brand-purple-400', icon: Share2 },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-500">{stat.label}</span>
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* ── Platform Overview Grid ── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Pregled platformi</h2>
        <GlassCard className="!p-0 overflow-hidden">
          {platformsData.length === 0 ? (
            <EmptyState icon={Share2} message={EMPTY_MSG} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {platformsData.map((platform) => (
                <div key={platform.id}>
                  <h3 className="font-semibold text-white text-sm">{platform.name}</h3>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </section>

      {/* ── Trending Section ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">U trendu</h2>
        </div>
        <GlassCard className="!p-0 overflow-hidden">
          {trendingTopics.length === 0 ? (
            <EmptyState icon={TrendingUp} message={EMPTY_MSG} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {trendingTopics.map((topic, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-white">{topic.topic}</h3>
                  <p className="text-[10px] text-zinc-500">{topic.platform}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </section>

      {/* ── Competitor Activity ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">Aktivnost konkurencije</h2>
        </div>
        <GlassCard className="!p-0 overflow-hidden">
          {competitors.length === 0 ? (
            <EmptyState icon={Search} message="Još nema podataka o konkurenciji — dodaj konkurente da počnemo pratiti njihovu stvarnu aktivnost." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Konkurent</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Platforma</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Nedavna aktivnost</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Angažman</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Pratitelji</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {competitors.map((comp, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-white font-medium text-sm">{comp.name}</span>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className="text-xs text-zinc-400">{comp.platform}</span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-xs text-zinc-300 line-clamp-1 max-w-[280px]">{comp.recentActivity}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm text-white font-medium">{comp.engagement}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm text-zinc-300">{comp.followers}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                          comp.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {comp.trend === 'up' ? 'Raste' : 'Pada'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </section>

      {/* ── AI Agent Recommendations ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">AI preporuke za društvene mreže</h2>
        </div>
        <GlassCard className="!p-0 overflow-hidden">
          {aiRecs.length === 0 ? (
            <EmptyState icon={Sparkles} message="Još nema AI preporuka — pojavit će se nakon analize stvarnih podataka s povezanih platformi." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {aiRecs.map((rec, i) => (
                <div key={i} className="!p-4">
                  <span className="text-sm font-medium text-white">{rec.agent}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-2 ${priorityCls[rec.priority]}`}>
                    {rec.priority}
                  </span>
                  <span className="text-[10px] text-zinc-500 ml-auto">{rec.platform}</span>
                  <p className="text-sm text-zinc-300 leading-relaxed mt-2">{rec.text}</p>
                </div>
              ))}
            </div>
          )}
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