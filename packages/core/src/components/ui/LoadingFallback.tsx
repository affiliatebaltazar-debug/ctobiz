import { Bot } from 'lucide-react';

export default function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {/* Animated logo */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 flex items-center justify-center animate-pulse">
          <Bot className="w-8 h-8 text-white" />
        </div>
        {/* Orbiting ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-purple-500/30 animate-spin" style={{ animationDuration: '3s' }} />
      </div>

      {/* Skeleton lines */}
      <div className="space-y-3 w-64">
        <div className="h-4 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="h-4 bg-white/10 rounded-full w-3/4 animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="h-4 bg-white/10 rounded-full w-1/2 animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>

      <p className="text-sm text-zinc-500 mt-6 animate-pulse">Učitavanje...</p>
    </div>
  );
}
