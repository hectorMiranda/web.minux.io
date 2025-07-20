'use client';

import { motion } from 'framer-motion';
import { Terminal, Smartphone, Monitor, Zap } from 'lucide-react';

export const MobileWelcomeScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-sm w-full"
      >
        {/* Mobile Device Frame */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-2 shadow-2xl">
          {/* Screen */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden">
            {/* Status Bar */}
            <div className="h-6 px-4 flex items-center justify-between text-xs font-mono bg-black/20 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-green-400 rounded-sm" />
                <span className="text-green-400">WIFI</span>
              </div>
              <div className="text-cyan-400 font-bold">12:34</div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">87%</span>
                <div className="w-6 h-3 border border-green-400 rounded-sm">
                  <div className="w-5 h-2 bg-green-400 rounded-sm m-0.5" />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="h-10 px-4 flex items-center justify-between border-b border-cyan-500/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                <span className="font-mono text-sm font-bold text-cyan-400">MINUX-OS</span>
              </div>
              <div className="flex gap-1">
                <div className="w-6 h-6 rounded bg-slate-800 border border-cyan-500/30" />
                <div className="w-6 h-6 rounded bg-slate-800 border border-cyan-500/30" />
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-lime-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  Mobile Optimized!
                </h1>
                <p className="text-xs text-slate-400 mb-4">
                  Palm Pilot meets modern design
                </p>
              </motion.div>

              {/* Feature Cards */}
              <div className="space-y-2">
                {[
                  { icon: Terminal, label: 'Console', desc: 'Full terminal access' },
                  { icon: Monitor, label: 'Dashboard', desc: 'System overview' },
                  { icon: Smartphone, label: 'Mobile First', desc: 'Touch optimized' },
                  { icon: Zap, label: 'Performance', desc: 'Lightning fast' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3 p-2 bg-slate-800/30 border border-slate-700/50 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <item.icon className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-300">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                    <div className="w-2 h-2 border border-slate-600 rounded" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center pt-4"
              >
                <div className="text-xs text-slate-500 font-mono">
                  © 2025 MINUX SYSTEMS
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <h2 className="text-xl font-bold text-white mb-2">Retro-Modern Mobile UI</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Inspired by Palm Pilot and BlackBerry design principles, now with modern touch interactions,
            smooth animations, and full scrollability.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-slate-400">Touch Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs text-slate-400">Fully Scrollable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs text-slate-400">Retro Style</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
