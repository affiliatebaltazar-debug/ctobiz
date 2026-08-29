import { GlassCard } from '@base44/core';
import { useState } from 'react';
import {
  Users, Crosshair,
  Search, Target, TrendingUp,
  Play, Globe, Sparkles,
} from 'lucide-react';

// ── Component ──
export default function LeadGeneration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('svi');
  const [priorityFilter, setPriorityFilter] = useState<string>('svi');

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Generiranje Leadova</h1>
        <p className="text-zinc-400 mt-1">AI agenti aktivno pronalaze i kvalificiraju potencijalne klijente</p>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-brand-purple-400" />
            <span className="text-sm text-zinc-400">Ukupno leadova</span>
          </div>
          <p className="text-2xl font-bold text-white">0</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Crosshair className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-zinc-400">Novih ovaj tjedan</span>
          </div>
          <p className="text-2xl font-bold text-white">0</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-brand-purple-400" />
            <span className="text-sm text-zinc-400">Stopa konverzije</span>
          </div>
          <p className="text-2xl font-bold text-white">0%</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-zinc-400">Lovac na Leadove</span>
          </div>
          <p className="text-2xl font-bold text-zinc-500 mt-2">Nije pokrenut</p>
        </GlassCard>
      </div>

      {/* ── AI Lovac na Leadove ── */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-brand-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Lovac na Leadove</h2>
              <p className="text-xs text-zinc-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                Spremno za skeniranje
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 hover:from-brand-purple-400 hover:to-brand-blue-400 text-white text-sm font-medium transition-all shadow-lg shadow-brand-purple-500/20">
            <Play className="w-4 h-4" /> Pokreni skeniranje
          </button>
        </div>

        <div className="mb-3">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Nedavna otkrića</h3>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-purple-500/10 flex items-center justify-center mx-auto mb-3">
              <Globe className="w-5 h-5 text-brand-purple-400" />
            </div>
            <p className="text-sm text-zinc-400">Još nema otkrića.</p>
            <p className="text-xs text-zinc-500 mt-1">
              Pokreni skeniranje kako bi AI Lovac na Leadove pronašao stvarne potencijalne klijente.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ── Search & Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pretraži leadove po imenu, tvrtki ili interesu..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-purple-500/50 focus:ring-1 focus:ring-brand-purple-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple-500/50 appearance-none cursor-pointer"
          >
            <option value="svi">Svi statusi</option>
            <option value="new">Novi</option>
            <option value="contacted">Kontaktirani</option>
            <option value="qualified">Kvalificirani</option>
            <option value="converted">Konvertirani</option>
            <option value="rejected">Odbijeni</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple-500/50 appearance-none cursor-pointer"
          >
            <option value="svi">Svi prioriteti</option>
            <option value="critical">Kritičan</option>
            <option value="high">Visok</option>
            <option value="medium">Srednji</option>
            <option value="low">Nizak</option>
          </select>
        </div>
      </div>

      {/* ── Lead List ── */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-white mb-4">Nedavni Leadovi</h2>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-brand-purple-500/10 flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5 text-brand-purple-400" />
          </div>
          <p className="text-sm text-zinc-400">Još nema leadova.</p>
          <p className="text-xs text-zinc-500 mt-1">
            Pokreni enrichment agenta da pronađeš stvarne leadove.
          </p>
        </div>
      </GlassCard>

      {/* ── Lead Insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source breakdown */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-brand-purple-400" />
            <h2 className="text-lg font-semibold text-white">Leadovi po izvoru</h2>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-8 text-center">
            <p className="text-sm text-zinc-400">Nema podataka o izvorima.</p>
            <p className="text-xs text-zinc-500 mt-1">Podaci se prikazuju nakon što se pronađu stvarni leadovi.</p>
          </div>
        </GlassCard>

        {/* Conversion funnel */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-brand-purple-400" />
            <h2 className="text-lg font-semibold text-white">Konverzijski lijevak</h2>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-purple-500/10 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-brand-purple-400" />
            </div>
            <p className="text-sm text-zinc-400">Nema podataka o konverzijama.</p>
            <p className="text-xs text-zinc-500 mt-1">Konverzijski lijevak se puni tek kada postoje stvarni leadovi.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
