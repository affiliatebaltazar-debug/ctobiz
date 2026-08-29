import { GlassCard } from '@base44/core';
import { useState } from 'react';
import {
  PenTool, Plus, Sparkles, Clock, CheckCircle2, Eye,
  Calendar, ChevronLeft, ChevronRight, Play, Copy,
  Send, FileText, Video, Image, MessageSquare,
  Mail, Film, Hash, TrendingUp, Zap, Camera,
  Monitor, Layers, Edit, ArrowRight, Share2,
} from 'lucide-react';

// ── Types ──
type Platform = 'TikTok' | 'Instagram Reels' | 'YouTube Shorts' | 'Facebook' | 'Blog' | 'Email';
type ContentType = 'Objava' | 'Video' | 'Priča' | 'Oglas' | 'Članak';

interface CalendarEntry {
  dan: string;
  datum: string;
  platforma: Platform;
  tip: ContentType;
  naslov: string;
  status: 'Objavljeno' | 'Zakazano' | 'U izradi' | 'Pregled';
}

interface RecentContent {
  id: string;
  title: string;
  platform: Platform;
  type: ContentType;
  status: string;
  createdAt: string;
  engagement: string;
}

// ── Platform config ──
const platformIcons: Record<string, typeof Film> = {
  'TikTok': Film,
  'Instagram Reels': Camera,
  'YouTube Shorts': Play,
  'Facebook': Share2,
  'Blog': FileText,
  'Email': Mail,
};

const platformColors: Record<string, string> = {
  'TikTok': 'text-rose-400 bg-rose-500/20',
  'Instagram Reels': 'text-pink-400 bg-pink-500/20',
  'YouTube Shorts': 'text-red-400 bg-red-500/20',
  'Facebook': 'text-blue-400 bg-blue-500/20',
  'Blog': 'text-emerald-400 bg-emerald-500/20',
  'Email': 'text-amber-400 bg-amber-500/20',
};

const contentTypeIcons: Record<string, typeof FileText> = {
  'Objava': MessageSquare,
  'Video': Video,
  'Priča': Image,
  'Oglas': Monitor,
  'Članak': FileText,
};

const statusStyles: Record<string, string> = {
  'Objavljeno': 'text-emerald-400 bg-emerald-400/10',
  'Zakazano': 'text-blue-400 bg-blue-400/10',
  'U izradi': 'text-amber-400 bg-amber-400/10',
  'Pregled': 'text-purple-400 bg-purple-400/10',
};

// ── Calendar data (prazno — nijedan sadržaj još nije zakazan) ──
const calendarData: CalendarEntry[] = [];

// ── Recent content (prazno — nijedan sadržaj još nije stvarno kreiran) ──
const recentContent: RecentContent[] = [];

// ── Days of week ──
const dayLabels = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
const dayNames = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];

// ── Component ──
export default function ContentFactory() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('TikTok');
  const [selectedType, setSelectedType] = useState<ContentType>('Video');
  const [topic, setTopic] = useState('');
  const [generationNote, setGenerationNote] = useState(false);
  const [activeDay, setActiveDay] = useState(0); // 0 = Monday (Ponedjeljak)

  const handleGenerate = () => {
    // Bez stvarnog AI generiranja ne izmišljamo sadržaj — prikazujemo iskrenu poruku.
    setGenerationNote(true);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tvornica Sadržaja</h1>
          <p className="text-zinc-400 mt-1">
            AI-generirani sadržaj za sve platforme — kreirajte, planirajte i objavljujte na jednom mjestu
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 hover:from-brand-purple-400 hover:to-brand-blue-400 text-white text-sm font-medium transition-all shadow-lg shadow-brand-purple-500/20 whitespace-nowrap">
          <Plus className="w-4 h-4" /> Novi Sadržaj
        </button>
      </div>

      {/* ── Content Creation Form ── */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">Generiraj sadržaj</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Platform selector */}
          <div>
            <label className="block text-xs text-zinc-500 mb-2 font-medium">Platforma</label>
            <div className="flex flex-wrap gap-1.5">
              {(['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Facebook', 'Blog', 'Email'] as Platform[]).map((p) => {
                const Icon = platformIcons[p] || PenTool;
                return (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                      selectedPlatform === p
                        ? `${platformColors[p]} border-current/30`
                        : 'text-zinc-400 border-white/10 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content type */}
          <div>
            <label className="block text-xs text-zinc-500 mb-2 font-medium">Vrsta sadržaja</label>
            <div className="flex flex-wrap gap-1.5">
              {(['Objava', 'Video', 'Priča', 'Oglas', 'Članak'] as ContentType[]).map((t) => {
                const Icon = contentTypeIcons[t] || FileText;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                      selectedType === t
                        ? 'bg-brand-blue-500/20 text-brand-blue-400 border-brand-blue-500/30'
                        : 'text-zinc-400 border-white/10 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Topic input */}
        <div className="mb-4">
          <label className="block text-xs text-zinc-500 mb-2 font-medium">Tema (opcionalno)</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Npr. lansiranje novog proizvoda, ljetna rasprodaja, edukativni sadržaj..."
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-purple-500/50 focus:ring-1 focus:ring-brand-purple-500/20 transition-all"
          />
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 hover:from-brand-purple-400 hover:to-brand-blue-400 text-white text-sm font-medium transition-all shadow-lg shadow-brand-purple-500/20"
        >
          <Sparkles className="w-4 h-4" /> Generiraj sadržaj
        </button>

        {/* Generated output */}
        {generationNote && (
          <div className="mt-5 p-4 rounded-xl bg-white/[0.03] border border-white/10 animate-in">
            <p className="text-sm text-zinc-400">AI generiranje sadržaja trenutno nije dostupno.</p>
            <p className="text-xs text-zinc-500 mt-1">
              Povežite AI API ključ (OpenAI ili OpenRouter) u Postavkama kako biste generirali stvarni sadržaj.
            </p>
          </div>
        )}
      </GlassCard>

      {/* ── Content Calendar ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">Kalendar sadržaja</h2>
          <span className="text-xs text-zinc-500 ml-1">Ovaj tjedan</span>
        </div>

        {/* Day selector */}
        <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
          {dayNames.map((day, i) => {
            const count = calendarData.filter((e) => e.dan === day).length;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(i)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-center transition-all min-w-[90px] ${
                  activeDay === i
                    ? 'bg-brand-purple-500/20 border border-brand-purple-500/30 text-white'
                    : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
                }`}
              >
                <p className="text-xs font-medium">{dayLabels[i]}</p>
                <p className="text-[10px] mt-0.5 text-zinc-500">{count} objave</p>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <GlassCard className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Dan</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Platforma</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Tip</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Naslov</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {calendarData.map((entry, i) => {
                  const PIcon = platformIcons[entry.platforma] || PenTool;
                  const isActive = entry.dan === dayNames[activeDay];
                  return (
                    <tr
                      key={i}
                      className={`hover:bg-white/[0.03] transition-colors ${isActive ? 'bg-white/[0.02]' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <span className="text-white text-sm">{entry.dan}</span>
                          <span className="text-xs text-zinc-500 ml-1.5">{entry.datum}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-lg ${platformColors[entry.platforma]?.split(' ')[1] || 'bg-zinc-500/20'} flex items-center justify-center`}>
                            <PIcon className={`w-3.5 h-3.5 ${platformColors[entry.platforma]?.split(' ')[0] || 'text-zinc-400'}`} />
                          </span>
                          <span className="text-zinc-300 text-sm">{entry.platforma}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className="text-xs text-zinc-400">{entry.tip}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white text-sm">{entry.naslov}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[entry.status]}`}>
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {calendarData.length === 0 && (
              <div className="p-10 text-center">
                <Calendar className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Još nema zakazanog sadržaja.</p>
                <p className="text-xs text-zinc-500 mt-1">Kalendar se puni kada kreirate i zakažete stvarne objave.</p>
              </div>
            )}
          </div>
        </GlassCard>
      </section>

      {/* ── Recent Content ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">Nedavni sadržaj</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentContent.map((item) => {
            const PIcon = platformIcons[item.platform] || PenTool;
            const TIcon = contentTypeIcons[item.type] || FileText;
            const st = statusStyles[item.status] || 'text-zinc-400 bg-zinc-400/10';
            return (
              <GlassCard key={item.id} hover className="!p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg ${platformColors[item.platform]?.split(' ')[1] || 'bg-zinc-500/20'} flex items-center justify-center`}>
                      <PIcon className={`w-4 h-4 ${platformColors[item.platform]?.split(' ')[0] || 'text-zinc-400'}`} />
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full border bg-white/5 text-zinc-400 flex items-center gap-1">
                      <TIcon className="w-3 h-3" /> {item.type}
                    </span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${st}`}>{item.status}</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-zinc-500 mb-3">{item.engagement}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-[10px] text-zinc-500">{item.createdAt}</span>
                  <div className="flex items-center gap-1.5">
                    <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-brand-purple-500/15 text-brand-purple-400 hover:bg-brand-purple-500/25 transition-colors">
                      <Edit className="w-3 h-3" /> Uredi
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors">
                      <Send className="w-3 h-3" /> Koristi
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
          {recentContent.length === 0 && (
            <GlassCard className="!p-8 text-center col-span-full">
              <FileText className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Još nema sadržaja.</p>
              <p className="text-xs text-zinc-500 mt-1">Kreirani i objavljeni sadržaj pojavit će se ovdje.</p>
            </GlassCard>
          )}
        </div>
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
