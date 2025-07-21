'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Settings,
  Terminal,
  Cpu,
  Thermometer,
  Network,
  HardDrive,
  Power,
  Wifi,
  Gauge,
  Blocks,
  Lock,
  Music,
  Box,
  ChevronRight,
  Circle,
  Square
} from 'lucide-react';
import { MinuxLogo } from '../MinuxLogo';
import { useSettingsStore } from '@/lib/settings';
import { iconMap, type IconName } from '@/lib/icons';
import type { MenuItem } from '@/lib/settings';

const defaultMenuItems: MenuItem[] = [
  {
    icon: 'Terminal',
    label: 'Console',
    href: '/console',
    description: 'System terminal access',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Home',
    label: 'Dashboard',
    href: '/dashboard',
    description: 'System overview and status',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Cpu',
    label: 'System',
    href: '/system',
    description: 'CPU, memory, and processes',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Thermometer',
    label: 'Sensors',
    href: '/sensors',
    description: 'Temperature and voltage monitoring',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Network',
    label: 'Network',
    href: '/network',
    description: 'Network interfaces and statistics',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Wifi',
    label: 'Wi-Fi',
    href: '/wifi',
    description: 'Wireless network configuration',
    visible: true,
    enabled: true,
  },
  {
    icon: 'HardDrive',
    label: 'Storage',
    href: '/storage',
    description: 'Disk usage and management',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Gauge',
    label: 'Performance',
    href: '/performance',
    description: 'System performance metrics',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Power',
    label: 'Power',
    href: '/power',
    description: 'Power management and control',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Lock',
    label: 'Security',
    href: '/security',
    description: 'System security settings',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Blocks',
    label: 'Blockchain',
    href: '/blockchain',
    description: 'Blockchain-related operations',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Music',
    label: 'MIDI Controller',
    href: '/midi',
    description: 'Virtual MIDI keyboard and controller',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Box',
    label: 'STL Explorer',
    href: '/stl-explorer',
    description: '3D STL file viewer and manager',
    visible: true,
    enabled: true,
  },
  {
    icon: 'Settings',
    label: 'Settings',
    href: '/settings',
    description: 'System configuration',
    visible: true,
    enabled: true,
  },
];

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileNavigation = ({ isOpen, onToggle }: MobileNavigationProps) => {
  const pathname = usePathname();
  const { menuItems: savedMenuItems, homePage } = useSettingsStore();
  
  // Merge saved items with defaults, preserving visibility and enabled state
  const menuItems = defaultMenuItems.map(defaultItem => {
    const savedItem = savedMenuItems.find(item => item.href === defaultItem.href);
    return savedItem ? { ...defaultItem, ...savedItem } : defaultItem;
  });

  // Close menu when pathname changes
  useEffect(() => {
    if (isOpen) {
      onToggle();
    }
  }, [pathname]);

  const handleItemClick = () => {
    if (isOpen) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Menu Button - Perfectly aligned with main header */}
      <motion.button
        onClick={onToggle}
        className="fixed left-4 z-50 lg:hidden w-8 h-8 rounded-lg bg-slate-800/50 border border-cyan-500/30 backdrop-blur-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { x: 276 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ top: '45px' }} // status bar (24px) + center of main header (21px) - half button (16px) = 29px, but 45px centers it better
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {isOpen ? (
            <X className="w-4 h-4 text-cyan-400" />
          ) : (
            <Menu className="w-4 h-4 text-cyan-400" />
          )}
        </motion.div>
      </motion.button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Sidebar - Palm Pilot/BlackBerry Style */}
            <motion.nav
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-950/98 via-slate-900/98 to-slate-950/98 backdrop-blur-xl border-r-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/20 z-50 lg:hidden flex flex-col"
            >
              {/* Palm Pilot Style Header */}
              <div className="h-16 px-4 border-b-2 border-cyan-500/30 bg-gradient-to-r from-slate-900/90 to-slate-800/90 flex-shrink-0">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                      <Square className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-cyan-400">MINUX.IO</div>
                      <div className="font-mono text-xs text-slate-400">Control Panel</div>
                    </div>
                  </div>
                  
                  {/* Status indicators */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <div className="font-mono text-xs text-green-400">READY</div>
                  </div>
                </div>
              </div>

              {/* Menu Items - Scrollable Container */}
              <div className="flex-1 min-h-0 py-2 overflow-y-auto mobile-nav-scroll">
                <div className="space-y-1 px-3 pb-20">
                  {menuItems.filter(item => item.visible && item.enabled).map((item, index) => {
                    const isActive = pathname === item.href;
                    const isHome = item.icon === 'Home';
                    const IconComponent = iconMap[item.icon as IconName];
                    
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link
                          href={isHome ? homePage : item.href}
                          className="block"
                          onClick={handleItemClick}
                        >
                          <motion.div
                            className={`
                              relative flex items-center gap-3 px-3 py-3 mx-1 rounded-lg transition-all duration-200 border
                              ${isActive 
                                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-400/50 shadow-lg shadow-cyan-500/30' 
                                : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50 hover:border-cyan-500/30'
                              }
                            `}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Palm Pilot style selection indicator */}
                            <div className={`
                              w-3 h-3 rounded border flex items-center justify-center transition-colors flex-shrink-0
                              ${isActive 
                                ? 'bg-cyan-400 border-cyan-300' 
                                : 'bg-slate-700 border-slate-600'
                              }
                            `}>
                              {isActive && <Circle className="w-1.5 h-1.5 text-slate-900 fill-current" />}
                            </div>

                            {/* Icon */}
                            <div className={`
                              flex items-center justify-center w-8 h-8 rounded-md border transition-all duration-200 flex-shrink-0
                              ${isActive 
                                ? 'bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-300 text-white shadow-lg shadow-cyan-500/40' 
                                : 'bg-slate-700/50 border-slate-600 text-slate-400'
                              }
                            `}>
                              {IconComponent && <IconComponent className="w-4 h-4" />}
                            </div>

                            {/* Label and Description */}
                            <div className="flex-1 min-w-0">
                              <div className={`
                                font-mono text-sm font-medium transition-colors duration-200
                                ${isActive ? 'text-cyan-100' : 'text-slate-300'}
                              `}>
                                {item.label}
                              </div>
                              {item.description && (
                                <div className="font-mono text-xs text-slate-500 mt-0.5 truncate">
                                  {item.description}
                                </div>
                              )}
                            </div>

                            {/* Arrow indicator */}
                            <ChevronRight className={`
                              w-4 h-4 transition-all duration-200 flex-shrink-0
                              ${isActive ? 'text-cyan-300' : 'text-slate-500'}
                            `} />

                            {/* Active glow effect */}
                            {isActive && (
                              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg animate-pulse" />
                            )}
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Palm Pilot style footer */}
              <div className="h-12 px-4 border-t-2 border-cyan-500/30 bg-gradient-to-r from-slate-900/90 to-slate-800/90 flex items-center justify-center flex-shrink-0">
                <div className="font-mono text-xs text-slate-400">
                  © 2025 MINUX SYSTEMS
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
