'use client';

import { ThemeToggle } from '../ThemeToggle';
import { UserPanel } from '../UserPanel';

export const TopNav = () => {
  return (
    <div className="h-16 border-b border-white/10 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-sm text-white/50">
          Raspberry Pi 4 Model B
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-white/50">System Online</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="h-6 w-px bg-white/10" />
        <UserPanel />
      </div>
    </div>
  );
}; 