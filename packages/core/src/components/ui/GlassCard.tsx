import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div className={`${hover ? 'glass-card-hover' : 'glass-card'} p-6 ${className}`}>
      {children}
    </div>
  );
}
