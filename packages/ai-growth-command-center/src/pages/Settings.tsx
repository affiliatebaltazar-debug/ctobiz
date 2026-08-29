import { GlassCard } from '@base44/core';
import { useState } from 'react';
import {
  User, Bot, Shield, CreditCard, Bell,
  Settings, Globe, Key, Clock, ShieldCheck,
  Save, Zap, Mail, Send, Eye, EyeOff, AlertCircle,
  CheckCircle2, ArrowUpRight, ChevronDown, Smartphone,
  Target, LogIn, Trash2, RefreshCw,
} from 'lucide-react';

// ── Types ──
type SettingsTab = 'profil' | 'ai' | 'sigurnost' | 'pretplata' | 'notifikacije';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  masked: boolean;
}

interface SecurityEvent {
  action: string;
  detail: string;
  timestamp: string;
  ip: string;
  icon: typeof LogIn;
  iconColor: string;
}

interface BillingEntry {
  datum: string;
  opis: string;
  iznos: string;
  status: 'Plaćeno' | 'Na čekanju' | 'Odbijeno';
}

// ── Tab config ──
const tabs: { key: SettingsTab; label: string; icon: typeof Settings }[] = [
  { key: 'profil', label: 'Profil', icon: User },
  { key: 'ai', label: 'AI Postavke', icon: Bot },
  { key: 'sigurnost', label: 'Sigurnost', icon: Shield },
  { key: 'pretplata', label: 'Pretplata', icon: CreditCard },
  { key: 'notifikacije', label: 'Notifikacije', icon: Bell },
];

// ── Data ──
const apiKeys: ApiKey[] = [];

const securityEvents: SecurityEvent[] = [];

const billingHistory: BillingEntry[] = [];

// ── Component ──
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profil');
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  // Profile form state
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('hr');
  const [timezone, setTimezone] = useState('Europe/Zagreb');

  // AI settings
  const [aiModel, setAiModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [outputLang, setOutputLang] = useState('hr');
  const [autoRunAgents, setAutoRunAgents] = useState(true);

  // Security settings
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [twoFA, setTwoFA] = useState(false);

  // Notification settings
  const [notifyNewLead, setNotifyNewLead] = useState(true);
  const [notifyCampaignEnd, setNotifyCampaignEnd] = useState(true);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(true);
  const [notifyAgentError, setNotifyAgentError] = useState(true);
  const [notifyTelegram, setNotifyTelegram] = useState(false);
  const [notifyInApp, setNotifyInApp] = useState(true);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleApiKey(id: string) {
    setShowApiKey((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const tabContent = () => {
    switch (activeTab) {
      // ── Tab 1: Profil ──
      case 'profil':
        return (
          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-lg font-semibold text-white mb-4">Podaci o organizaciji</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Naziv organizacije</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-purple-500/50 focus:ring-1 focus:ring-brand-purple-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email adresa</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-purple-500/50 focus:ring-1 focus:ring-brand-purple-500/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Jezik</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple-500/50 appearance-none cursor-pointer"
                    >
                      <option value="hr">Hrvatski</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Vremenska zona</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple-500/50 appearance-none cursor-pointer"
                    >
                      <option value="Europe/Zagreb">Europe/Zagreb (UTC+2)</option>
                      <option value="Europe/Berlin">Europe/Berlin (UTC+2)</option>
                      <option value="Europe/London">Europe/London (UTC+1)</option>
                      <option value="America/New_York">America/New_York (UTC-4)</option>
                    </select>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="text-lg font-semibold text-white mb-4">Informacije o računu</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-zinc-400">ID organizacije</span>
                  <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">—</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-zinc-400">Plan</span>
                  <span className="text-white bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 bg-clip-text text-transparent font-medium">—</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-zinc-400">Kreirano</span>
                  <span className="text-white">—</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-400">Članova tima</span>
                  <span className="text-white">0 / 5</span>
                </div>
              </div>
            </GlassCard>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 hover:from-brand-purple-400 hover:to-brand-blue-400 text-white text-sm font-medium transition-all shadow-lg shadow-brand-purple-500/20"
              >
                {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Spremljeno!' : 'Spremi promjene'}
              </button>
              <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-zinc-400 hover:text-white transition-all border border-white/10">
                <RefreshCw className="w-4 h-4" />
                Resetiraj
              </button>
            </div>
          </div>
        );

      // ── Tab 2: AI Postavke ──
      case 'ai':
        return (
          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-lg font-semibold text-white mb-4">Konfiguracija AI modela</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Zadani AI model</label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple-500/50 appearance-none cursor-pointer"
                  >
                    <option value="gpt-4o">GPT-4o (OpenAI) — Najbolji omjer brzine i kvalitete</option>
                    <option value="gpt-4o-mini">GPT-4o-mini (OpenAI) — Brži, jeftiniji</option>
                    <option value="gemini-pro">Gemini Pro (Google) — Multimodalna podrška</option>
                    <option value="groq-llama">Groq Llama 3.1 70B — Najbrža inferencija</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                    Temperatura: <span className="text-white font-mono">{temperature.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-purple-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-purple-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand-purple-500/30"
                  />
                  <div className="flex justify-between text-xs text-zinc-500 mt-1">
                    <span>0 — Precizno, deterministički</span>
                    <span>2 — Kreativno, varijabilno</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Maksimalni broj tokena</label>
                  <select
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple-500/50 appearance-none cursor-pointer"
                  >
                    <option value={1024}>1,024 — Kratki odgovori</option>
                    <option value={2048}>2,048 — Standardni odgovori</option>
                    <option value={4096}>4,096 — Detaljni odgovori</option>
                    <option value={8192}>8,192 — Dugi sadržaj, izvještaji</option>
                    <option value={16384}>16,384 — Kompletni dokumenti</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Jezik outputa</label>
                  <select
                    value={outputLang}
                    onChange={(e) => setOutputLang(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple-500/50 appearance-none cursor-pointer"
                  >
                    <option value="hr">Hrvatski</option>
                    <option value="en">Engleski</option>
                    <option value="auto">Automatski (prema kontekstu)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <p className="text-sm font-medium text-white">Automatsko pokretanje agenata</p>
                    <p className="text-xs text-zinc-500 mt-0.5">AI agenti će se automatski izvršavati prema rasporedu</p>
                  </div>
                  <button
                    onClick={() => setAutoRunAgents(!autoRunAgents)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      autoRunAgents ? 'bg-emerald-500' : 'bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        autoRunAgents ? 'left-[22px]' : 'left-[2px]'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="text-lg font-semibold text-white mb-4">Ograničenja i kvote</h2>
              <div className="space-y-3">
                {[
                  { label: 'Mjesečni API pozivi', used: 0, total: 10000, color: 'bg-brand-purple-500' },
                  { label: 'Dnevni limit tokena', used: 0, total: 250000, color: 'bg-brand-blue-500' },
                  { label: 'Istovremeni agenti', used: 0, total: 24, color: 'bg-emerald-500' },
                ].map((quota, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-zinc-400">{quota.label}</span>
                      <span className="text-white font-medium">
                        {quota.used.toLocaleString('hr')} / {quota.total.toLocaleString('hr')}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${quota.color}`}
                        style={{ width: `${Math.min((quota.used / quota.total) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 hover:from-brand-purple-400 hover:to-brand-blue-400 text-white text-sm font-medium transition-all shadow-lg shadow-brand-purple-500/20"
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Spremljeno!' : 'Spremi postavke'}
            </button>
          </div>
        );

      // ── Tab 3: Sigurnost ──
      case 'sigurnost':
        return (
          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-lg font-semibold text-white mb-4">API ključevi</h2>
              <div className="space-y-2">
                {apiKeys.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-500">
                    Nije postavljeno — još nema API ključeva.
                  </div>
                ) : (
                apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-white">{key.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded font-mono">
                          {showApiKey[key.id]
                            ? `${key.prefix}••••••••••••••••`
                            : `${key.prefix}••••••••••••••••`}
                        </code>
                        <span className="text-[10px] text-zinc-500">Kreiran: {key.created}</span>
                        <span className="text-[10px] text-zinc-500">•</span>
                        <span className="text-[10px] text-zinc-500">Zadnja upotreba: {key.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-3">
                      <button
                        onClick={() => toggleApiKey(key.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                        title={showApiKey[key.id] ? 'Sakrij ključ' : 'Prikaži ključ'}
                      >
                        {showApiKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all" title="Obriši ključ">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
                )}
              </div>
              <button className="mt-3 flex items-center gap-2 text-xs text-brand-purple-400 hover:text-brand-purple-300 transition-colors">
                <Key className="w-3.5 h-3.5" />
                Generiraj novi API ključ
              </button>
            </GlassCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassCard>
                <h2 className="text-lg font-semibold text-white mb-4">Timeout sesije</h2>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Automatska odjava nakon neaktivnosti</label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-purple-500/50 appearance-none cursor-pointer"
                  >
                    <option value={15}>15 minuta</option>
                    <option value={30}>30 minuta</option>
                    <option value={60}>1 sat</option>
                    <option value={120}>2 sata</option>
                    <option value={480}>8 sati</option>
                  </select>
                </div>
              </GlassCard>

              <GlassCard>
                <h2 className="text-lg font-semibold text-white mb-4">Dvofaktorska autentifikacija</h2>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-white">2FA zaštita</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Dodatni sloj sigurnosti pri prijavi</p>
                  </div>
                  <button
                    onClick={() => setTwoFA(!twoFA)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      twoFA ? 'bg-emerald-500' : 'bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        twoFA ? 'left-[22px]' : 'left-[2px]'
                      }`}
                    />
                  </button>
                </div>
                {twoFA && (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 text-xs text-emerald-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    2FA je aktivna putem authenticator aplikacije
                  </div>
                )}
              </GlassCard>
            </div>

            <GlassCard className="!p-0 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-semibold text-white">Zadnje aktivnosti</h2>
              </div>
              <div className="divide-y divide-white/5">
                {securityEvents.length === 0 ? (
                  <div className="p-6 text-sm text-zinc-500">Nema zabilježenih aktivnosti.</div>
                ) : (
                securityEvents.map((event, i) => {
                  const Icon = event.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 p-4 hover:bg-white/[0.03] transition-colors">
                      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon className={`w-4 h-4 ${event.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{event.action}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{event.detail}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-zinc-500">{event.timestamp}</p>
                        <p className="text-[10px] text-zinc-600 mt-0.5 font-mono">{event.ip}</p>
                      </div>
                    </div>
                  );
                })
                )}
              </div>
            </GlassCard>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 hover:from-brand-purple-400 hover:to-brand-blue-400 text-white text-sm font-medium transition-all shadow-lg shadow-brand-purple-500/20"
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Spremljeno!' : 'Spremi sigurnosne postavke'}
            </button>
          </div>
        );

      // ── Tab 4: Pretplata ──
      case 'pretplata':
        return (
          <div className="space-y-6">
            <GlassCard className="overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-purple-500/20 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Trenutni plan</h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/20 text-zinc-400 mt-2">
                      <Zap className="w-3 h-3" /> Bez aktivne pretplate
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    —<span className="text-sm font-normal text-zinc-400">/mj</span>
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  {[
                    'Pristup svim AI agentima (24 agenta)',
                    'Neograničene kampanje',
                    'Napredna analitika i izvještaji',
                    'Integracija sa svim platformama',
                    'Automatska optimizacija kampanja',
                    '3 korisnička sjedišta',
                    'Email i chat podrška',
                    'AI generiranje sadržaja na hrvatskom',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 hover:from-brand-purple-400 hover:to-brand-blue-400 text-white text-sm font-medium transition-all shadow-lg shadow-brand-purple-500/20">
                  <ArrowUpRight className="w-4 h-4" />
                  Nadogradi plan
                </button>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GlassCard>
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-brand-purple-400" />
                  <span className="text-sm text-zinc-400">Agenti korišteni</span>
                </div>
                <p className="text-2xl font-bold text-white">0 / 24</p>
                <div className="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-brand-purple-500 rounded-full" style={{ width: '0%' }} />
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-zinc-400">Kampanje aktivne</span>
                </div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-zinc-500 mt-1">od neograničeno</p>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-zinc-400">Leadovi generirani</span>
                </div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-zinc-500 mt-1">još nema generiranih leadova</p>
              </GlassCard>
            </div>

            <GlassCard className="!p-0 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-semibold text-white">Povijest naplate</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Datum</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Opis</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Iznos</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {billingHistory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 px-4 text-center text-sm text-zinc-500">
                          Nema zapisa o naplati.
                        </td>
                      </tr>
                    ) : (
                    billingHistory.map((entry, i) => (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-zinc-400 text-sm">{entry.datum}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-white text-sm">{entry.opis}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-white text-sm font-medium">{entry.iznos}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            entry.status === 'Plaćeno'
                              ? 'text-emerald-400 bg-emerald-400/10'
                              : entry.status === 'Na čekanju'
                              ? 'text-amber-400 bg-amber-400/10'
                              : 'text-red-400 bg-red-400/10'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        );

      // ── Tab 5: Notifikacije ──
      case 'notifikacije':
        return (
          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-lg font-semibold text-white mb-4">Email obavijesti</h2>
              <div className="space-y-3">
                {[
                  { key: 'newLead', label: 'Novi lead', description: 'Obavijest kada AI Lovac otkrije novog potencijalnog klijenta', value: notifyNewLead, setter: setNotifyNewLead },
                  { key: 'campaignEnd', label: 'Završena kampanja', description: 'Obavijest kada kampanja dosegne kraj ili budžet', value: notifyCampaignEnd, setter: setNotifyCampaignEnd },
                  { key: 'weeklyReport', label: 'Tjedni izvještaj', description: 'Automatski tjedni izvještaj s ključnim metrikama', value: notifyWeeklyReport, setter: setNotifyWeeklyReport },
                  { key: 'agentError', label: 'Greške agenta', description: 'Hitna obavijest kada AI agent naiđe na grešku', value: notifyAgentError, setter: setNotifyAgentError },
                ].map((notif) => (
                  <div key={notif.key} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <p className="text-sm font-medium text-white">{notif.label}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{notif.description}</p>
                    </div>
                    <button
                      onClick={() => notif.setter(!notif.value)}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                        notif.value ? 'bg-emerald-500' : 'bg-zinc-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          notif.value ? 'left-[22px]' : 'left-[2px]'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassCard>
                <h2 className="text-lg font-semibold text-white mb-4">Telegram obavijesti</h2>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <p className="text-sm font-medium text-white">Telegram Bot</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Instant obavijesti putem Telegram bota</p>
                  </div>
                  <button
                    onClick={() => setNotifyTelegram(!notifyTelegram)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                      notifyTelegram ? 'bg-emerald-500' : 'bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        notifyTelegram ? 'left-[22px]' : 'left-[2px]'
                      }`}
                    />
                  </button>
                </div>
                {!notifyTelegram && (
                  <div className="mt-3 p-3 rounded-lg bg-zinc-500/10 text-xs text-zinc-400 flex items-center gap-2">
                    <Send className="w-4 h-4 flex-shrink-0" />
                    Nije povezano — Telegram bot još nije povezan
                  </div>
                )}
              </GlassCard>

              <GlassCard>
                <h2 className="text-lg font-semibold text-white mb-4">In-app obavijesti</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <p className="text-sm font-medium text-white">In-app notifikacije</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Obavijesti unutar Base44 sučelja</p>
                    </div>
                    <button
                      onClick={() => setNotifyInApp(!notifyInApp)}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                        notifyInApp ? 'bg-emerald-500' : 'bg-zinc-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          notifyInApp ? 'left-[22px]' : 'left-[2px]'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <p className="text-sm font-medium text-white">Zvučna obavijest</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Zvuk kod važnih obavijesti</p>
                    </div>
                    <button className="relative w-11 h-6 rounded-full bg-zinc-600 flex-shrink-0">
                      <span className="absolute top-0.5 left-[2px] w-5 h-5 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 hover:from-brand-purple-400 hover:to-brand-blue-400 text-white text-sm font-medium transition-all shadow-lg shadow-brand-purple-500/20"
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Spremljeno!' : 'Spremi postavke obavijesti'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Postavke</h1>
        <p className="text-zinc-400 mt-1">Upravljajte postavkama platforme, AI konfiguracijom i sigurnošću</p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                isActive
                  ? 'border-brand-purple-400/40 text-brand-purple-400 bg-brand-purple-500/10 shadow-lg shadow-brand-purple-500/10'
                  : 'border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      {tabContent()}
    </div>
  );
}
