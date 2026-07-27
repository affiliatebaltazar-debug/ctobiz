import type { NavItem } from './types';
import {
  LayoutDashboard,
  Bot,
  Target,
  PenTool,
  Share2,
  BarChart3,
  Search,
  Users,
  TrendingUp,
  Zap,
  Plug,
  Settings,
} from 'lucide-react';
import { moduleNavItems } from '@base44/ai-growth-command-center';

export const coreNavItems: NavItem[] = [
  { label: 'Nadzorna ploča', path: '/', icon: LayoutDashboard },
];

export const navItems: NavItem[] = [...coreNavItems, ...moduleNavItems];
