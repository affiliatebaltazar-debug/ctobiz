import { GlassCard } from '@base44/core';
import { useState } from 'react';
import {
  Share2, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Eye, MessageCircle, Heart, Users, Activity, BarChart3,
  Zap, Sparkles, Search, Target, ExternalLink,
  Facebook, Instagram, Twitter, Youtube, MessageCircle as MessageCircleIcon,
} from 'lucide-react';

// ── Types ──
interface PlatformData {
  id: string;
  name: string;
  icon: typeof Facebook;
  iconColor: string;
  bgColor: string;
  followers: number;
  engagementRate: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  postsThisWeek: number;
  avgReach: number;
  avgLikes: number;
  avgComments: number;
  topContent: string;
  bestTime: string;
}

interface TrendingTopic {
  topic: string;
  platform: string;
  engagement: string;
  growth: string;
  relevance: string;
}

interface Competitor {
  name: string;
  platform: string;
  recentActivity: string;
  engagement: string;
  followers: string;
  trend: 'up' | 'down';
}

interface AIRecommendation {
  agent: string;
  text: string;
  platform: string;
  priority: string;
}

// ── Platform data ──
const platformsData: PlatformData[] = [
  {
    id: 'facebook', name: 'Facebook', icon: Facebook, iconColor: 'text-blue-400', bgColor: 'bg-blue-500/20',
    followers: 12400, engagementRate: 3.2, trend: 'up', trendValue: '+0.4%',
    postsThisWeek: 7, avgReach: 8500, avgLikes: 320, avgComments: 48,
    topContent: 'Video post "Kako uštedjeti na marketingu" — 12.4K doseg',
    bestTime: 'Srijeda 18:00',
  },
  {
    id: 'instagram', name: 'Instagram', icon: Instagram, iconColor: 'text-pink-400', bgColor: 'bg-pink-500/20',
    followers: 8700, engagementRate: 4.8, trend: 'up', trendValue: '+0.7%',
    postsThisWeek: 5, avgReach: 6200, avgLikes: 410, avgComments: 67,
    topContent: 'Reels "Dan u životu marketing tima" — 18.2K pregleda',
    bestTime: 'Četvrtak 20:00',
  },
  {
    id: 'x', name: 'X', icon: Twitter, iconColor: 'text-zinc-200', bgColor: 'bg-zinc-500/20',
    followers: 3200, engagementRate: 2.1, trend: 'down', trendValue: '-0.2%',
    postsThisWeek: 12, avgReach: 2800, avgLikes: 45, avgComments: 18,
    topContent: 'Thread o AI marketingu — 5.6K impresija',
    bestTime: 'Utorak 12:00',
  },
  {
    id: 'reddit', name: 'Reddit', icon: MessageCircleIcon, iconColor: 'text-orange-400', bgColor: 'bg-orange-500/20',
    followers: 1800, engagementRate: 5.5, trend: 'up', trendValue: '+1.2%',
    postsThisWeek: 3, avgReach: 4500, avgLikes: 210, avgComments: 89,
    topContent: 'AMA sesija — 12.3K pregleda, 340 komentara',
    bestTime: 'Ponedjeljak 10:00',
  },
  {
    id: 'tiktok', name: 'TikTok', icon: Youtube, iconColor: 'text-rose-400', bgColor: 'bg-rose-500/20',
    followers: 15200, engagementRate: 7.2, trend: 'up', trendValue: '+2.1%',
    postsThisWeek: 4, avgReach: 22400, avgLikes: 1800, avgComments: 145,
    topContent: 'Tutorial "AI agenti za marketing" — 89K pregleda',
    bestTime: 'Petak 19:00',
  },
  {
    id: 'youtube', name: 'YouTube', icon: Youtube, iconColor: 'text-red-400', bgColor: 'bg-red-500/20',
    followers: 4800, engagementRate: 3.9, trend: 'stable', trendValue: '0.0%',
    postsThisWeek: 2, avgReach: 3100, avgLikes: 180, avgComments: 32,
    topContent: 'Vodič kroz Base44 platformu — 4.2K pregleda',
    bestTime: 'Nedjelja 11:00',
  },
];

// ── Trending topics ──
const trendingTopics: TrendingTopic[] = [
  {
    topic: '#AIMarketing2026',
    platform: 'X',
    engagement: '45K spominjanja',
    growth: '+230% u 7 dana',
    relevance: 'Visoka — direktno povezano s Base44 uslugama',
  },
  {
    topic: '#DigitalnaTransformacija',
    platform: 'LinkedIn / Facebook',
    engagement: '28K interakcija',
    growth: '+85% u 7 dana',
    relevance: 'Srednja — prilika za pozicioniranje kao lidera',
  },
  {
    topic: '#MaliPoduzetnici',
    platform: 'Instagram / TikTok',
    engagement: '62K pregleda',
    growth: '+120% u 7 dana',
    relevance: 'Visoka — idealna ciljana publika za Base44',
  },
  {
    topic: '#AutomatizacijaMarketinga',
    platform: 'X / Reddit',
    engagement: '18K interakcija',
    growth: '+340% u 7 dana',
    relevance: 'Kritična — savršeno za Base44 pozicioniranje',
  },
  {
    topic: '#ContentCreatorHrvatska',
    platform: 'TikTok / Instagram',
    engagement: '34K pregleda',
    growth: '+65% u 7 dana',
    relevance: 'Visoka — potencijalni korisnici Tvornice Sadržaja',
  },
];

// ── Competitors ──
const competitors: Competitor[] = [
  {
    name: 'MarketIQ', platform: 'Instagram / TikTok',
    recentActivity: 'Objavili seriju Reels videa o AI alatima — visok angažman',
    engagement: '4.2K prosječno', followers: '22K', trend: 'up',
  },
  {
    name: 'AdPulse', platform: 'Facebook / Google Ads',
    recentActivity: 'Pokrenuli webinar seriju o digitalnom marketingu',
    engagement: '1.8K prosječno', followers: '15K', trend: 'up',
  },
  {
    name: 'ContentFlow', platform: 'YouTube / Blog',
    recentActivity: 'Novi video serijal "Marketing Automatizacija 101" — rastući kanal',
    engagement: '2.5K prosječno', followers: '9.8K', trend: 'up',
  },
  {
    name: 'BrandBuilder HR', platform: 'Instagram / Facebook',
    recentActivity: 'Smanjena aktivnost — samo 2 objave u zadnjih mjesec dana',
    engagement: '890 prosječno', followers: '31K', trend: 'down',
  },
  {
    name: 'DigiBoost', platform: 'TikTok / X',
    recentActivity: 'Viralni TikTok video o AI marketingu — 120K pregleda',
    engagement: '6.7K prosječno', followers: '45K', trend: 'up',
  },
];

// ── AI Recommendations ──
const aiRecs: AIRecommendation[] = [
  {
    agent: 'Instagram Intelligence Agent',
    platform: 'Instagram',
    text: 'Analiza pokazuje da Reels s trajanjem 15-30 sekundi imaju 3.2x veći doseg od dužih videa. Preporučujem kreiranje 3 kratka Reelsa ovaj tjedan s fokusom na edukativni sadržaj — idealno vrijeme objave: četvrtak u 20:00.',
    priority: 'Visok',
  },
  {
    agent: 'X Intelligence Agent',
    platform: 'X',
    text: 'Hashtag #AIMarketing2026 je u trendu s 45K spominjanja. Predlažem thread od 5 tweetova s konkretnim primjerima kako Base44 štedi vrijeme — uključiti statistiku i poziv na akciju. Objaviti utorkom u 12:00 za maksimalni doseg.',
    priority: 'Visok',
  },
  {
    agent: 'Reddit Intelligence Agent',
    platform: 'Reddit',
    text: 'Na r/croatia i r/programiranje raste interes za AI alate (+340% u mjesec dana). Preporučujem AMA sesiju o AI marketingu — subredditi s visokim angažmanom i autentičnom publikom spremnom za konverziju.',
    priority: 'Srednji',
  },
  {
    agent: 'Facebook Marketing Stručnjak',
    platform: 'Facebook',
    text: 'Facebook grupe za poduzetnike u Hrvatskoj imaju visoku aktivnost (12 aktivnih grupa s 5K+ članova). Predlažem strategiju objavljivanja korisnih savjeta u grupama — 2-3 puta tjedno bez direktne prodaje, fokus na edukaciju.',
    priority: 'Srednji',
  },
];

const priorityCls: Record<string, string> = {
  'Visok': 'text-red-400 bg-red-400/10',
  'Srednji': 'text-amber-400 bg-amber-400/10',
  'Nizak': 'text-zinc-400 bg-zinc-400/10',
};

// ── Helpers ──
function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ── Component ──
export default function SocialMediaIntelligence() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformData | null>(null);

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
          { label: 'Ukupno pratitelja', value: formatFollowers(platformsData.reduce((s, p) => s + p.followers, 0)), color: 'text-white', icon: Users },
          { label: 'Prosječni angažman', value: `${(platformsData.reduce((s, p) => s + p.engagementRate, 0) / platformsData.length).toFixed(1)}%`, color: 'text-emerald-400', icon: Heart },
          { label: 'Objave ovaj tjedan', value: platformsData.reduce((s, p) => s + p.postsThisWeek, 0).toString(), color: 'text-blue-400', icon: Activity },
          { label: 'Platformi', value: platformsData.length.toString(), color: 'text-brand-purple-400', icon: Share2 },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformsData.map((platform) => {
            const PIcon = platform.icon;
            const TrendIcon = platform.trend === 'up' ? TrendingUp : platform.trend === 'down' ? TrendingDown : Activity;
            const trendColor = platform.trend === 'up' ? 'text-emerald-400' : platform.trend === 'down' ? 'text-red-400' : 'text-zinc-400';

            return (
              <div key={platform.id}>
                <GlassCard
                  hover
                  className={`cursor-pointer transition-all ${selectedPlatform?.id === platform.id ? 'border-brand-purple-500/40 ring-1 ring-brand-purple-500/20' : ''}`}
                  onClick={() => setSelectedPlatform(selectedPlatform?.id === platform.id ? null : platform)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${platform.bgColor} flex items-center justify-center`}>
                        <PIcon className={`w-5 h-5 ${platform.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{platform.name}</h3>
                        <p className="text-xs text-zinc-500">{formatFollowers(platform.followers)} pratitelja</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${trendColor}`}>
                      <TrendIcon className="w-4 h-4" />
                      <span className="text-xs font-medium">{platform.trendValue}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <p className="text-base font-bold text-white">{platform.engagementRate}%</p>
                      <p className="text-[10px] text-zinc-500">Angažman</p>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold text-white">{platform.postsThisWeek}</p>
                      <p className="text-[10px] text-zinc-500">Objave</p>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold text-white">{formatFollowers(platform.avgReach)}</p>
                      <p className="text-[10px] text-zinc-500">Doseg</p>
                    </div>
                  </div>

                  {/* Action hint */}
                  <div className="text-[10px] text-brand-purple-400 flex items-center gap-1 pt-2 border-t border-white/5">
                    <BarChart3 className="w-3 h-3" />
                    Klikni za detaljnu analitiku
                  </div>
                </GlassCard>

                {/* Expanded analytics */}
                {selectedPlatform?.id === platform.id && (
                  <div className="mt-2 p-4 rounded-xl bg-white/[0.04] border border-white/10 animate-in space-y-4">
                    <h4 className="text-sm font-semibold text-white">Detaljna analitika — {platform.name}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-card !p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Heart className="w-3.5 h-3.5 text-pink-400" />
                          <p className="text-lg font-bold text-white">{formatFollowers(platform.avgLikes)}</p>
                        </div>
                        <p className="text-[10px] text-zinc-500">Prosječno lajkova</p>
                      </div>
                      <div className="glass-card !p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                          <p className="text-lg font-bold text-white">{platform.avgComments}</p>
                        </div>
                        <p className="text-[10px] text-zinc-500">Prosječno komentara</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Target className="w-3.5 h-3.5 text-brand-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-zinc-400">Najbolji sadržaj</p>
                          <p className="text-sm text-white">{platform.topContent}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <ClockIcon className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-zinc-400">Optimalno vrijeme objave</p>
                          <p className="text-sm text-white">{platform.bestTime}</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-2 rounded-lg text-xs font-medium bg-brand-purple-500/15 text-brand-purple-400 hover:bg-brand-purple-500/25 transition-colors flex items-center justify-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Otvori punu analitiku
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Trending Section ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">U trendu</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingTopics.map((topic, i) => (
            <GlassCard key={i} hover className="!p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-brand-purple-400" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{topic.topic}</h3>
                    <p className="text-[10px] text-zinc-500">{topic.platform}</p>
                  </div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full text-emerald-400 bg-emerald-400/10 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> {topic.growth}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Angažman</span>
                  <span className="text-white font-medium">{topic.engagement}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Relevantnost</span>
                  <span className="text-zinc-300 text-right max-w-[180px]">{topic.relevance}</span>
                </div>
              </div>
              <button className="w-full py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Iskoristi
              </button>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── Competitor Activity ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">Aktivnost konkurencije</h2>
        </div>
        <GlassCard className="!p-0 overflow-hidden">
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
                  <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider"></th>
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
                        {comp.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {comp.trend === 'up' ? 'Raste' : 'Pada'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5" /> Analiziraj
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      {/* ── AI Agent Recommendations ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-purple-400" />
          <h2 className="text-lg font-semibold text-white">AI preporuke za društvene mreže</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiRecs.map((rec, i) => (
            <GlassCard key={i} hover className="!p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-brand-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-white">{rec.agent}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityCls[rec.priority]}`}>
                      {rec.priority}
                    </span>
                    <span className="text-[10px] text-zinc-500 ml-auto">{rec.platform}</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{rec.text}</p>
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors">
                      <Sparkles className="w-3.5 h-3.5" /> Primijeni preporuku
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
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

// ── Small clock icon component ──
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
