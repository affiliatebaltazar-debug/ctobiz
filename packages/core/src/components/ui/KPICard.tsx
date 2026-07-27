import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
}

export default function KPICard({ label, value, change, positive, icon: Icon }: KPICardProps) {
  return (
    <div className="glass-card-hover p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-zinc-400">{label}</span>
        <div className="w-9 h-9 rounded-lg bg-brand-purple-500/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-brand-purple-400" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {change && (
        <span className={`text-xs ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {positive ? '↑' : '↓'} {change}
        </span>
      )}
    </div>
  );
}
