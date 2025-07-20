'use client';

import { ThemeToggle } from '../ThemeToggle';
import { UserPanel } from '../UserPanel';
import { useSystemInfo } from '@/hooks/useSystemInfo';

export const TopNav = () => {
  const { systemName } = useSystemInfo();

  return (
    <div className="h-14 border-b border-cyan-500/20 px-6 flex items-center justify-between bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-xl shadow-lg shadow-cyan-500/5">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" />
          <div className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {systemName || 'MINUX System'}
          </div>
        </div>
        <div className="h-6 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-md shadow-green-400/50" />
          <span className="text-sm text-slate-300 font-medium">System Online</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="h-6 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
        <UserPanel />
      </div>
    </div>
  );
}; 