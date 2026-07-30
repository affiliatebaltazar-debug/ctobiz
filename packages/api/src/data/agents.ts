import type { AgentDefinition } from "./types";

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  category: string;
  description: string;
  status: "active" | "idle" | "configuring";
  icon: string;
}

export const aiAgents: AgentDefinition[] = [
  // ── Upravljanje ──
  {
    id: "agent-01",
    name: "AI Direktor Marketinga",
    role: "CMO",
    category: "Upravljanje",
    description:
      "Upravlja cjelokupnom marketinškom strategijom, koordinira ostale agente i donosi ključne odluke na temelju podataka u stvarnom vremenu.",
    status: "active",
    icon: "Brain",
  },

  // ── Kampanje ──
  {
    id: "agent-02",
    name: "Agent za Otkrivanje Kampanja",
    role: "Campaign Discovery Agent",
    category: "Kampanje",
    description:
      "Pretražuje i otkriva nove prilike za kampanje na temelju tržišnih trendova, analize konkurencije i ponašanja publike.",
    status: "active",
    icon: "Search",
  },
  {
    id: "agent-03",
    name: "Agent za Analizu Kampanja",
    role: "Campaign Analysis Agent",
    category: "Kampanje",
    description:
      "Analizira performanse postojećih kampanja, identificira što radi, a što ne, i predlaže optimizacije za bolje rezultate.",
    status: "idle",
    icon: "BarChart3",
  },

  // ── Sadržaj ──
  {
    id: "agent-04",
    name: "Agent za Strategiju Sadržaja",
    role: "Content Strategy Agent",
    category: "Sadržaj",
    description:
      "Razvija sveobuhvatne strategije sadržaja prilagođene ciljanoj publici, platformi i poslovnim ciljevima.",
    status: "active",
    icon: "Lightbulb",
  },
  {
    id: "agent-05",
    name: "Agent za Pisanje Skripti",
    role: "Script Writing Agent",
    category: "Sadržaj",
    description:
      "Piše profesionalne skripte za video sadržaj, uključujući TikTok, YouTube i Instagram Reels — prilagođene glasu brenda.",
    status: "idle",
    icon: "FileText",
  },
  {
    id: "agent-06",
    name: "Agent za Planiranje Videa",
    role: "Video Planning Agent",
    category: "Sadržaj",
    description:
      "Planira video sadržaj od ideje do objave, uključujući storyboard, scenarij i preporuke za snimanje.",
    status: "configuring",
    icon: "Video",
  },

  // ── Društvene mreže ──
  {
    id: "agent-07",
    name: "Facebook Marketing Stručnjak",
    role: "Facebook Marketing Specialist",
    category: "Društvene mreže",
    description:
      "Vodi Facebook marketinške aktivnosti — objave, oglase, angažman zajednice i analizu publike na Facebook platformi.",
    status: "active",
    icon: "Facebook",
  },
  {
    id: "agent-08",
    name: "Facebook Intelligence Crawler",
    role: "Facebook Intelligence Crawler",
    category: "Društvene mreže",
    description:
      "Kontinuirano prati Facebook za relevantne trendove, konkurentske aktivnosti i prilike za angažman u niši.",
    status: "active",
    icon: "Eye",
  },
  {
    id: "agent-09",
    name: "Instagram Marketing Stručnjak",
    role: "Instagram Marketing Specialist",
    category: "Društvene mreže",
    description:
      "Upravlja Instagram prisutnošću — feed objave, Stories, Reels i interakcija s publikom za maksimalni doseg.",
    status: "active",
    icon: "Instagram",
  },
  {
    id: "agent-10",
    name: "Instagram Intelligence Agent",
    role: "Instagram Intelligence Agent",
    category: "Društvene mreže",
    description:
      "Analizira Instagram trendove, hashtagove i ponašanje pratitelja kako bi optimizirao strategiju objavljivanja.",
    status: "idle",
    icon: "Eye",
  },
  {
    id: "agent-11",
    name: "X Marketing Stručnjak",
    role: "X Marketing Specialist",
    category: "Društvene mreže",
    description:
      "Upravlja prisutnošću na X platformi (Twitter) — tweetovi, threadovi, angažman i praćenje trendova u stvarnom vremenu.",
    status: "active",
    icon: "Twitter",
  },
  {
    id: "agent-12",
    name: "X Intelligence Agent",
    role: "X Intelligence Agent",
    category: "Društvene mreže",
    description:
      "Prati X platformu za relevantne razgovore, spominjanja brenda i prilike za uključivanje u viralne teme.",
    status: "idle",
    icon: "Eye",
  },
  {
    id: "agent-13",
    name: "Reddit Marketing Stručnjak",
    role: "Reddit Marketing Specialist",
    category: "Društvene mreže",
    description:
      "Upravlja prisutnošću na Redditu — pronalazi relevantne subreddite, kreira objave i sudjeluje u raspravama autentično.",
    status: "active",
    icon: "MessageCircle",
  },
  {
    id: "agent-14",
    name: "Reddit Intelligence Agent",
    role: "Reddit Intelligence Agent",
    category: "Društvene mreže",
    description:
      "Prati Reddit za spominjanja brenda, trendove u niši i otkriva što zajednica stvarno misli o konkurenciji.",
    status: "configuring",
    icon: "Eye",
  },

  // ── Oglašavanje ──
  {
    id: "agent-15",
    name: "Google Ads Stručnjak",
    role: "Google Ads Specialist",
    category: "Oglašavanje",
    description:
      "Kreira, optimizira i upravlja Google Ads kampanjama — uključujući Search, Display i Shopping kampanje.",
    status: "active",
    icon: "Globe",
  },
  {
    id: "agent-16",
    name: "Google Ads Intelligence Agent",
    role: "Google Ads Intelligence Agent",
    category: "Oglašavanje",
    description:
      "Analizira Google Ads tržište — ključne riječi, konkurentske oglase i trendove cijena kroz Google Ads aukcije.",
    status: "idle",
    icon: "Eye",
  },

  // ── SEO ──
  {
    id: "agent-17",
    name: "SEO Stručnjak",
    role: "SEO Specialist",
    category: "SEO",
    description:
      "Optimizira web stranice za tražilice — on-page SEO, tehnički SEO, istraživanje ključnih riječi i optimizacija sadržaja.",
    status: "active",
    icon: "Search",
  },
  {
    id: "agent-18",
    name: "Backlink Stručnjak",
    role: "Backlink Specialist",
    category: "SEO",
    description:
      "Gradi i upravlja strategijom backlinkova — pronalazi prilike za kvalitetne povratne linkove i prati profil linkova.",
    status: "active",
    icon: "Link",
  },
  {
    id: "agent-19",
    name: "Backlink Intelligence Crawler",
    role: "Backlink Intelligence Crawler",
    category: "SEO",
    description:
      "Kontinuirano pretražuje web za nove backlink prilike, prati konkurentske linkove i otkriva broken link mogućnosti.",
    status: "idle",
    icon: "Spider",
  },

  // ── Leadovi ──
  {
    id: "agent-20",
    name: "Lovac na Leadove",
    role: "Lead Hunter",
    category: "Leadovi",
    description:
      "Aktivno pronalazi i kvalificira potencijalne klijente kroz različite kanale — društvene mreže, web scraping i analitiku.",
    status: "active",
    icon: "Crosshair",
  },

  // ── Analitika ──
  {
    id: "agent-21",
    name: "Agent za Analitiku",
    role: "Analytics Agent",
    category: "Analitika",
    description:
      "Prikuplja i analizira podatke iz svih marketinških kanala, pruža uvide i preporuke temeljene na podacima.",
    status: "active",
    icon: "TrendingUp",
  },
  {
    id: "agent-22",
    name: "Agent za Optimizaciju",
    role: "Optimization Agent",
    category: "Analitika",
    description:
      "Koristi podatke iz analitike za kontinuiranu optimizaciju kampanja, sadržaja i marketinških strategija.",
    status: "idle",
    icon: "Zap",
  },

  // ── Automatizacija ──
  {
    id: "agent-23",
    name: "Agent za Automatizaciju",
    role: "Automation Agent",
    category: "Automatizacija",
    description:
      "Automatizira marketinške tijekove rada — od objave sadržaja do follow-upa leadova i generiranja izvještaja.",
    status: "active",
    icon: "Workflow",
  },
  {
    id: "agent-24",
    name: "Agent za Izvještaje",
    role: "Reporting Agent",
    category: "Automatizacija",
    description:
      "Automatski generira detaljne marketinške izvještaje — dnevne, tjedne i mjesečne — s ključnim metrikama i uvidima.",
    status: "idle",
    icon: "FileSpreadsheet",
  },
];

export const agentsByCategory = aiAgents.reduce(
  (acc, agent) => {
    if (!acc[agent.category]) acc[agent.category] = [];
    acc[agent.category].push(agent);
    return acc;
  },
  {} as Record<string, AgentDefinition[]>,
);
