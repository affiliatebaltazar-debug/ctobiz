import { GlassCard } from '@base44/core';
import { useState, useMemo } from 'react';
import {
  Users, Crosshair, ChevronRight, ChevronDown,
  Search, Filter, Sparkles, Zap, Target, TrendingUp,
  Phone, Mail, MapPin, Briefcase, ArrowRight,
  Play, Clock, Globe,
} from 'lucide-react';

// ── Types ──
interface Lead {
  name: string;
  company: string;
  interest: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
  source: string;
  email: string;
  phone: string;
  location: string;
  problemDescription: string;
  recommendedOffer: string;
  notes: string;
  discoveredAt: string;
}

interface LeadDiscovery {
  company: string;
  description: string;
  potencijal: string;
  discoveredAt: string;
}

// ── 15 Croatian leads ──
const leadovi: Lead[] = [
  {
    name: 'Marko Horvat', company: 'TechSolutions d.o.o.', interest: 'AI marketing',
    priority: 'high', status: 'new', source: 'LinkedIn',
    email: 'marko.horvat@techsolutions.hr', phone: '+385 91 234 5678', location: 'Zagreb',
    problemDescription: 'Tvrtka troši €3,500 mjesečno na Google Ads bez jasnog ROAS-a. Nemaju internog stručnjaka za digitalni marketing i kampanje vode samostalno bez optimizacije.',
    recommendedOffer: 'Base44 Pro paket s Google Ads Stručnjakom — potpuna automatizacija kampanja i dnevno izvještavanje.',
    notes: 'Vlasnik, otvoren za demo. Preporučeno od zajedničkog kontakta.',
    discoveredAt: 'Prije 3 sata',
  },
  {
    name: 'Ivana Kovač', company: 'Digitalna Agencija Kovač', interest: 'SEO optimizacija',
    priority: 'critical', status: 'qualified', source: 'Preporuka',
    email: 'ivana@agencija-kovac.hr', phone: '+385 98 765 4321', location: 'Split',
    problemDescription: 'Agencija s 12 klijenata, 3 SEO stručnjaka — preopterećeni ručnim radom. Traže način da skaliraju SEO usluge bez zapošljavanja.',
    recommendedOffer: 'Base44 Agency paket — white-label SEO + Backlink modul. 24 agenta za sve klijente.',
    notes: 'Spremna za sastanak ovaj tjedan. Hitno — konkurencija joj uzima klijente.',
    discoveredAt: 'Prije 1 dan',
  },
  {
    name: 'Petar Novosel', company: 'WebShop HR', interest: 'Google Ads',
    priority: 'medium', status: 'contacted', source: 'Webinar',
    email: 'petar@webshop-hr.hr', phone: '+385 91 111 2222', location: 'Osijek',
    problemDescription: 'Webshop s 500+ proizvoda, koristi samo Shopping kampanje. Želi proširiti na Search i Display, ali nema znanja.',
    recommendedOffer: 'Base44 Pro + Google Ads Intelligence Agent. Integracija s web shopom za dinamičke kampanje.',
    notes: 'Poslan email s prijedlogom. Čeka odgovor.',
    discoveredAt: 'Prije 2 dana',
  },
  {
    name: 'Ana Marić', company: 'Kreativni Studio Marić', interest: 'Sadržaj',
    priority: 'high', status: 'new', source: 'Instagram',
    email: 'ana@kreativni-studio.hr', phone: '+385 92 333 4444', location: 'Rijeka',
    problemDescription: 'Butik kreativni studio, 4 zaposlenika. Proizvode sadržaj za 8 klijenata mjesečno — žele AI asistenciju za brže pisanje i planiranje.',
    recommendedOffer: 'Base44 Starter + Content Factory modul. AI generiranje sadržaja na hrvatskom.',
    notes: 'Mlada poduzetnica, aktivna na Instagramu. Veliki potencijal za preporuke.',
    discoveredAt: 'Prije 4 sata',
  },
  {
    name: 'Tomislav Babić', company: 'Startup Inkubator Osijek', interest: 'Lead Gen',
    priority: 'low', status: 'converted', source: 'Konferencija',
    email: 'tomislav@inkubator-os.hr', phone: '+385 95 555 6666', location: 'Osijek',
    problemDescription: 'Inkubator s 25 startupa — svi trebaju marketing. Tražio je platformu koju može ponuditi svojim članovima.',
    recommendedOffer: 'Base44 Agency — white-label za sve startupove u inkubatoru.',
    notes: 'Potpisan ugovor. Implementacija sljedeći tjedan.',
    discoveredAt: 'Prije 1 tjedan',
  },
  {
    name: 'Maja Župan', company: 'NutriVita d.o.o.', interest: 'Social Media',
    priority: 'high', status: 'new', source: 'Facebook',
    email: 'maja@nutrivita.hr', phone: '+385 91 777 8888', location: 'Zagreb',
    problemDescription: 'Brend zdrave hrane s 15K pratitelja na Instagramu. Objavljuju neredovito, angažman pada. Trebaju plan sadržaja i automatizaciju.',
    recommendedOffer: 'Base44 Pro + Social Media modul s AI planerom sadržaja.',
    notes: 'Vlasnica brenda, vrlo aktivna na društvenim mrežama.',
    discoveredAt: 'Prije 5 sati',
  },
  {
    name: 'Ivan Knežević', company: 'Gradilište.hr', interest: 'SEO',
    priority: 'medium', status: 'contacted', source: 'Google Search',
    email: 'ivan@gradiliste.hr', phone: '+385 98 222 3333', location: 'Varaždin',
    problemDescription: 'Portal za građevinarstvo s 30K mjesečnih posjeta. Organski promet stagnira, žele popraviti SEO za dugoročni rast.',
    recommendedOffer: 'Base44 Pro + SEO & Backlink modul s tehničkim SEO auditiom.',
    notes: 'Poslana ponuda. Čeka se povratna informacija.',
    discoveredAt: 'Prije 3 dana',
  },
  {
    name: 'Sara Blažević', company: 'EventPro agencija', interest: 'Automatizacija',
    priority: 'high', status: 'qualified', source: 'Preporuka',
    email: 'sara@eventpro.hr', phone: '+385 92 444 5555', location: 'Dubrovnik',
    problemDescription: 'Event agencija koja organizira 20+ događaja godišnje. Marketing rade ad-hoc, bez sustava. Žele automatizirati cijeli proces — od najave do follow-upa.',
    recommendedOffer: 'Base44 Pro s Automation Center modulom. Kompletni workflow za event marketing.',
    notes: 'Demo održan prošli tjedan. Jako zainteresirana, traži ponudu.',
    discoveredAt: 'Prije 5 dana',
  },
  {
    name: 'Darko Pavelić', company: 'LogiTrans d.o.o.', interest: 'Oglašavanje',
    priority: 'medium', status: 'new', source: 'LinkedIn',
    email: 'darko@logitrans.hr', phone: '+385 91 888 9999', location: 'Zagreb',
    problemDescription: 'Logistička tvrtka, 50 zaposlenika. Pokušavaju B2B oglase na LinkedInu i Googleu — rezultati su loši (CPL €45+).',
    recommendedOffer: 'Base44 Pro s Google Ads + LinkedIn integracijom. B2B lead gen strategija.',
    notes: 'Direktor logistike. Tehnički orijentiran, voli brojke.',
    discoveredAt: 'Prije 2 sata',
  },
  {
    name: 'Lucija Tomić', company: 'Freelancerica.hr', interest: 'Content + SEO',
    priority: 'low', status: 'rejected', source: 'Email kampanja',
    email: 'lucija@freelancerica.hr', phone: '+385 95 111 0000', location: 'Zadar',
    problemDescription: 'Freelancerica, piše blogove za klijente. Tražila je AI alat za pisanje, ali budžet joj je premalen.',
    recommendedOffer: 'Base44 Starter — €29/mj. Osnovni AI asistent za pisanje.',
    notes: 'Budžet ne dopušta. Pratiti za 6 mjeseci.',
    discoveredAt: 'Prije 2 tjedna',
  },
  {
    name: 'Goran Maletić', company: 'FinTech Solutions', interest: 'Analitika',
    priority: 'critical', status: 'qualified', source: 'Konferencija',
    email: 'goran@fintech-solutions.eu', phone: '+385 91 333 2222', location: 'Zagreb',
    problemDescription: 'Fintech startup s €2M fundingom. Trebaju naprednu analitiku kampanja i AI predikcije za ulazak na 3 nova tržišta (SLO, BiH, SRB).',
    recommendedOffer: 'Base44 Agency + Analytics modul s multi-market campaign intelligence.',
    notes: 'Sastanak zakazan za sutra. Spreman za probni period.',
    discoveredAt: 'Prije 1 dan',
  },
  {
    name: 'Katarina Lisjak', company: 'Modni Atelje Lisjak', interest: 'Instagram Ads',
    priority: 'medium', status: 'new', source: 'Instagram',
    email: 'katarina@atelje-lisjak.hr', phone: '+385 98 555 4444', location: 'Pula',
    problemDescription: 'Modni brend, prodaja preko Instagrama i weba. Koriste boostane objave bez strategije. Žele strukturirane kampanje s mjerljivim ROAS-om.',
    recommendedOffer: 'Base44 Pro + Advertising Intelligence modul (Instagram + Facebook).',
    notes: 'Kreativna direktorica. Vizualno orijentirana.',
    discoveredAt: 'Prije 6 sati',
  },
  {
    name: 'Zoran Dragić', company: 'AutoDijelovi Express', interest: 'Google Shopping',
    priority: 'high', status: 'contacted', source: 'Google Ads',
    email: 'zoran@autodijelovi.hr', phone: '+385 92 777 6666', location: 'Slavonski Brod',
    problemDescription: 'Webshop autodijelova s 5000+ SKU-ova. Google Shopping kampanje su im glavni kanal, ali CPA raste (+22% u 3 mjeseca).',
    recommendedOffer: 'Base44 Pro + Google Ads Intelligence Agent. Optimizacija Shopping feeda i bidding strategije.',
    notes: 'Vlasnik, 15 godina u biznisu. Vjeruje brojkama.',
    discoveredAt: 'Prije 2 dana',
  },
  {
    name: 'Martina Šimić', company: 'EduCentar Šimić', interest: 'Lead Gen',
    priority: 'high', status: 'new', source: 'Facebook',
    email: 'martina@educentar.hr', phone: '+385 91 222 1111', location: 'Šibenik',
    problemDescription: 'Edukativni centar — tečajevi digitalnog marketinga. Imaju 200+ polaznika godišnje, žele skalirati na 500+. Lead gen kroz Meta oglase je ključan.',
    recommendedOffer: 'Base44 Pro + Lead Generation modul s Facebook Lead Ads integracijom.',
    notes: 'Vlasnica, predaje digitalni marketing. Savršen fit za Base44.',
    discoveredAt: 'Prije 8 sati',
  },
  {
    name: 'Nikola Barišić', company: 'GreenTech Hrvatska', interest: 'Sveobuhvatno',
    priority: 'critical', status: 'qualified', source: 'Preporuka',
    email: 'nikola@greentech.hr', phone: '+385 98 111 3333', location: 'Zagreb',
    problemDescription: 'GreenTech startup, 20 zaposlenika, €500K funding. Nemaju marketing odjel — sve rade vanjski suradnici. Traže all-in-one rješenje za content, SEO, oglašavanje i analitiku.',
    recommendedOffer: 'Base44 Agency — puni paket. Svi moduli, 24 AI agenta, white-label za investitore.',
    notes: 'CEO, sutra prezentacija pred boardom. Potencijalno najveći klijent.',
    discoveredAt: 'Prije 12 sati',
  },
];

// ── Priority / Status config ──
const priorityLabels: Record<string, string> = {
  low: 'Nizak',
  medium: 'Srednji',
  high: 'Visok',
  critical: 'Kritičan',
};

const priorityClasses: Record<string, string> = {
  low: 'text-zinc-400 bg-zinc-400/10',
  medium: 'text-brand-blue-400 bg-brand-blue-400/10',
  high: 'text-amber-400 bg-amber-400/10',
  critical: 'text-red-400 bg-red-400/10',
};

const statusLabels: Record<string, string> = {
  new: 'Novi',
  contacted: 'Kontaktiran',
  qualified: 'Kvalificiran',
  converted: 'Konvertiran',
  rejected: 'Odbijen',
};

const statusColors: Record<string, string> = {
  new: 'text-blue-400 bg-blue-400/10',
  contacted: 'text-amber-400 bg-amber-400/10',
  qualified: 'text-emerald-400 bg-emerald-400/10',
  converted: 'text-brand-purple-400 bg-brand-purple-400/10',
  rejected: 'text-zinc-500 bg-zinc-500/10',
};

// ── AI Lead Hunter discoveries ──
const recentDiscoveries: LeadDiscovery[] = [
  { company: 'CloudHost d.o.o.', description: 'Traže AI marketing rješenje na LinkedInu — objavili natječaj za digitalnu agenciju', potencijal: 'Visok', discoveredAt: 'Prije 10 min' },
  { company: 'BioFit Centar', description: 'Novi fitness studio u Zagrebu — aktivno traže pomoć s Instagram oglasima', potencijal: 'Visok', discoveredAt: 'Prije 25 min' },
  { company: 'Pametne Kuće HR', description: 'Objavili blog post o marketinškim izazovima — spominju potrebu za automatizacijom', potencijal: 'Srednji', discoveredAt: 'Prije 45 min' },
  { company: 'CodeLab Akademija', description: 'IT edukacijska platforma — traže partnere za lead generaciju na Facebook grupama', potencijal: 'Srednji', discoveredAt: 'Prije 1 sat' },
  { company: 'TravelQuest', description: 'Turistička agencija — spominju SEO probleme na X-u, organski promet pao 40%', potencijal: 'Visok', discoveredAt: 'Prije 2 sata' },
];

// ── Source breakdown data ──
const sourceBreakdown = [
  { source: 'LinkedIn', count: 3, percentage: 20 },
  { source: 'Preporuka', count: 4, percentage: 27 },
  { source: 'Webinar', count: 1, percentage: 7 },
  { source: 'Instagram', count: 2, percentage: 13 },
  { source: 'Facebook', count: 2, percentage: 13 },
  { source: 'Google Search', count: 1, percentage: 7 },
  { source: 'Konferencija', count: 2, percentage: 13 },
  { source: 'Email kampanja', count: 1, percentage: 7 },
  { source: 'Google Ads', count: 1, percentage: 7 },
];

// ── Conversion funnel ──
const conversionFunnel = [
  { stage: 'Novo', count: 7, color: 'bg-blue-400' },
  { stage: 'Kontaktirano', count: 3, color: 'bg-amber-400' },
  { stage: 'Kvalificirano', count: 4, color: 'bg-emerald-400' },
  { stage: 'Konvertirano', count: 1, color: 'bg-brand-purple-400' },
  { stage: 'Odbijeno', count: 1, color: 'bg-zinc-500' },
];

// ── Helpers ──
function sourceColor(source: string): string {
  const colors: Record<string, string> = {
    'LinkedIn': 'text-blue-400 bg-blue-400/10',
    'Preporuka': 'text-emerald-400 bg-emerald-400/10',
    'Webinar': 'text-amber-400 bg-amber-400/10',
    'Instagram': 'text-pink-400 bg-pink-400/10',
    'Facebook': 'text-blue-500 bg-blue-500/10',
    'Google Search': 'text-brand-purple-400 bg-brand-purple-400/10',
    'Konferencija': 'text-orange-400 bg-orange-400/10',
    'Email kampanja': 'text-zinc-400 bg-zinc-400/10',
    'Google Ads': 'text-yellow-400 bg-yellow-400/10',
  };
  return colors[source] || 'text-zinc-400 bg-zinc-400/10';
}

// ── Component ──
export default function LeadGeneration() {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('svi');
  const [priorityFilter, setPriorityFilter] = useState<string>('svi');

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leadovi.filter((lead) => {
      const matchesSearch =
        !searchQuery ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.interest.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'svi' || lead.status === statusFilter;
      const matchesPriority = priorityFilter === 'svi' || lead.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchQuery, statusFilter, priorityFilter]);

  const funnelMax = Math.max(...conversionFunnel.map((f) => f.count), 1);

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
          <p className="text-2xl font-bold text-white">1,247</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Crosshair className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-zinc-400">Novih ovaj tjedan</span>
          </div>
          <p className="text-2xl font-bold text-white">89</p>
          <p className="text-xs text-emerald-400 mt-1">↑ +12%</p>
        </GlassCard>
        <GlassCard>
          <span className="text-sm text-zinc-400">Stopa konverzije</span>
          <p className="text-2xl font-bold text-white mt-2">4.2%</p>
        </GlassCard>
        <GlassCard>
          <span className="text-sm text-zinc-400">Lovac na Leadove</span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">Aktivan</p>
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
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Aktivno skenira
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 hover:from-brand-purple-400 hover:to-brand-blue-400 text-white text-sm font-medium transition-all shadow-lg shadow-brand-purple-500/20">
            <Play className="w-4 h-4" /> Pokreni skeniranje
          </button>
        </div>

        <div className="mb-3">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Nedavna otkrića</h3>
          <div className="space-y-2">
            {recentDiscoveries.map((disc, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-white">{disc.company}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      disc.potencijal === 'Visok' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'
                    }`}>
                      {disc.potencijal}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{disc.description}</p>
                </div>
                <span className="text-[10px] text-zinc-500 flex-shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {disc.discoveredAt}
                </span>
              </div>
            ))}
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
        <h2 className="text-lg font-semibold text-white mb-4">
          Nedavni Leadovi
          <span className="text-sm text-zinc-500 ml-2 font-normal">
            {filteredLeads.length} od {leadovi.length}
          </span>
        </h2>
        <div className="space-y-2">
          {filteredLeads.map((lead) => {
            const isExpanded = selectedLead === lead.name;
            return (
              <div key={lead.name}>
                <div
                  onClick={() => setSelectedLead(isExpanded ? null : lead.name)}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {lead.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{lead.name}</p>
                    <p className="text-xs text-zinc-400">{lead.company} · {lead.interest}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${sourceColor(lead.source)}`}>
                      {lead.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${priorityClasses[lead.priority]}`}>
                      {priorityLabels[lead.priority]}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${statusColors[lead.status]}`}>
                      {statusLabels[lead.status]}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-1 ml-14 p-4 rounded-xl bg-white/[0.04] border border-white/10 animate-in space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Contact info */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Kontakt informacije</h4>
                        <div className="space-y-1.5">
                          <p className="text-sm text-zinc-300 flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-zinc-500" /> {lead.email}
                          </p>
                          <p className="text-sm text-zinc-300 flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-zinc-500" /> {lead.phone}
                          </p>
                          <p className="text-sm text-zinc-300 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {lead.location}
                          </p>
                          <p className="text-sm text-zinc-300 flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-zinc-500" /> {lead.company}
                          </p>
                        </div>
                      </div>

                      {/* Source & timing */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Detalji leada</h4>
                        <div className="space-y-1.5">
                          <p className="text-sm text-zinc-300">
                            <span className="text-zinc-500">Izvor: </span>
                            <span className={`inline-flex px-1.5 py-0.5 rounded-full text-xs ${sourceColor(lead.source)}`}>{lead.source}</span>
                          </p>
                          <p className="text-sm text-zinc-300">
                            <span className="text-zinc-500">Otkrio: </span>AI Lovac na Leadove
                          </p>
                          <p className="text-sm text-zinc-300">
                            <span className="text-zinc-500">Vrijeme: </span>{lead.discoveredAt}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Problem description */}
                    <div>
                      <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Opis problema</h4>
                      <p className="text-sm text-zinc-300 leading-relaxed">{lead.problemDescription}</p>
                    </div>

                    {/* Recommended offer */}
                    <div>
                      <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Preporučena ponuda</h4>
                      <p className="text-sm text-emerald-300 bg-emerald-500/10 p-3 rounded-lg">{lead.recommendedOffer}</p>
                    </div>

                    {/* Notes */}
                    <div>
                      <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Bilješke</h4>
                      <p className="text-sm text-zinc-400">{lead.notes}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-brand-purple-500/15 text-brand-purple-400 hover:bg-brand-purple-500/25 transition-colors">
                        <Mail className="w-3.5 h-3.5" /> Pošalji email
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 text-zinc-300 hover:bg-white/10 transition-colors">
                        <Phone className="w-3.5 h-3.5" /> Nazovi
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 text-zinc-300 hover:bg-white/10 transition-colors ml-auto">
                        <ArrowRight className="w-3.5 h-3.5" /> Promijeni status
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <p className="text-zinc-500 text-sm">Nema leadova koji odgovaraju filterima.</p>
            </div>
          )}
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
          <div className="space-y-3">
            {sourceBreakdown.sort((a, b) => b.count - a.count).map((item) => (
              <div key={item.source} className="flex items-center gap-3">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${sourceColor(item.source)}`}>
                  {item.source}
                </span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-white font-medium w-8 text-right">{item.count}</span>
                <span className="text-xs text-zinc-500 w-10 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Conversion funnel */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-brand-purple-400" />
            <h2 className="text-lg font-semibold text-white">Konverzijski lijevak</h2>
          </div>
          <div className="space-y-4">
            {conversionFunnel.map((stage) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-zinc-400">{stage.stage}</span>
                  <span className="text-white font-bold">{stage.count}</span>
                </div>
                <div className="h-7 bg-white/5 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-lg transition-all flex items-center px-3`}
                    style={{ width: `${(stage.count / funnelMax) * 100}%`, minWidth: stage.count > 0 ? '40px' : '0' }}
                  >
                    <span className="text-xs font-bold text-white drop-shadow-sm">
                      {stage.count}
                    </span>
                  </div>
                </div>
                {stage.stage !== 'Odbijeno' && (
                  <div className="flex justify-center my-1">
                    <ArrowRight className="w-4 h-4 text-zinc-600 rotate-90" />
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-white/5 text-xs text-zinc-500 text-center">
              Ukupna konverzija: {((conversionFunnel.find(f => f.stage === 'Konvertirano')?.count || 0) / leadovi.length * 100).toFixed(1)}%
            </div>
          </div>
        </GlassCard>
      </div>

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
