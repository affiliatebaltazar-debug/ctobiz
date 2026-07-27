import type { NavItem } from '@base44/core';
import {
  Bot, Target, PenTool, Share2, BarChart3,
  Search, Users, TrendingUp, Zap, Plug, Settings,
} from 'lucide-react';

// ── Navigation Items (eager — needed for sidebar) ──
export const moduleNavItems: NavItem[] = [
  { label: 'AI Agenti', path: '/agenti', icon: Bot },
  { label: 'Inteligencija Kampanja', path: '/kampanje', icon: Target },
  { label: 'Tvornica Sadržaja', path: '/sadrzaj', icon: PenTool },
  { label: 'Social Media Inteligencija', path: '/social', icon: Share2 },
  { label: 'Inteligencija Oglašavanja', path: '/oglasi', icon: BarChart3 },
  { label: 'SEO & Backlink Inteligencija', path: '/seo', icon: Search },
  { label: 'Generiranje Leadova', path: '/leadovi', icon: Users },
  { label: 'Analitika', path: '/analitika', icon: TrendingUp },
  { label: 'Centar Automatizacije', path: '/automatizacija', icon: Zap },
  { label: 'Integracije', path: '/integracije', icon: Plug },
  { label: 'Postavke', path: '/postavke', icon: Settings },
];

// ── Exports ──
export { aiAgents, agentsByCategory } from './agents/definitions';
export * as schema from './db/schema';
export type * from './types';
