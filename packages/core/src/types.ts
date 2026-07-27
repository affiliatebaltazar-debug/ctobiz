import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface RouteDefinition {
  path: string;
  element: ReactNode;
}

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}
