'use client';

import { motion } from 'framer-motion';
import { Battery, Wifi, Signal, Clock } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { UserPanel } from '../UserPanel';
import { useSystemInfo } from '@/hooks/useSystemInfo';
import { useState, useEffect } from 'react';

interface TopNavProps {
  onMenuToggle?: () => void;
}

export const TopNav = ({ onMenuToggle }: TopNavProps) => {
  const { systemName } = useSystemInfo();
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel] = useState(87); // Mock battery level
  const [signalStrength] = useState(4); // Mock signal strength

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mobile Top Bar - Palm Pilot/BlackBerry Style */}
      <div className="lg:hidden h-16 bg-gradient-to-r from-slate-950/98 via-slate-900/98 to-slate-950/98 backdrop-blur-xl border-b border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
        {/* Status Bar */}
        <div className="h-6 px-4 flex items-center justify-between text-xs font-mono bg-black/20 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Signal className="w-3 h-3 text-cyan-400" />
              <div className="flex gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-0.5 h-2 rounded-full ${
                      i < signalStrength ? 'bg-cyan-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3 text-green-400" />
              <span className="text-green-400">WIFI</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-cyan-400 font-bold">{currentTime}</div>
            <div className="flex items-center gap-1">
              <Battery className="w-3 h-3 text-green-400" />
              <span className="text-green-400">{batteryLevel}%</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="h-10 px-4 flex items-center relative">
          {/* Left spacer for hamburger button - no need to position it here since MobileNavigation handles it */}
          <div className="w-8 flex-shrink-0" />
          
          {/* System Info - Centered */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-lime-400 to-green-500 animate-pulse shadow-lg shadow-green-400/50" />
              <div className="font-mono text-sm font-bold bg-gradient-to-r from-cyan-400 via-lime-400 to-cyan-400 bg-clip-text text-transparent">
                MINUX.IO
              </div>
            </motion.div>
          </div>

          {/* Action Buttons - Right side, perfectly aligned */}
          <div className="ml-auto flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800/50 border border-cyan-500/30 flex items-center justify-center hover:bg-slate-700/50 transition-colors">
              <ThemeToggle />
            </div>
            
            <div className="w-8 h-8 rounded-lg bg-slate-800/50 border border-cyan-500/30 flex items-center justify-center hover:bg-slate-700/50 transition-colors">
              <UserPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className="hidden lg:block h-14 border-b border-cyan-500/20 px-6 flex items-center justify-between bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-xl shadow-lg shadow-cyan-500/5">
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse flex-shrink-0" />
            <div className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent truncate">
              {systemName || 'MINUX System'}
            </div>
          </div>
          
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-md shadow-green-400/50" />
            <span className="text-sm text-slate-300 font-medium">System Online</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 flex items-center justify-center">
            <ThemeToggle />
          </div>
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
          <div className="w-8 h-8 flex items-center justify-center">
            <UserPanel />
          </div>
        </div>
      </div>
    </>
  );
}; 