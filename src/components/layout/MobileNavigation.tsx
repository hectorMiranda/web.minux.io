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
  ChevronRight
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
      {/* Mobile Menu Button - Fixed position */}
      <motion.button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-lg shadow-cyan-500/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { x: 260 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-cyan-400" />
          ) : (
            <Menu className="w-6 h-6 text-cyan-400" />
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Sidebar */}
            <motion.nav
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-xl border-r border-cyan-500/30 shadow-2xl shadow-cyan-500/20 z-50 lg:hidden"
            >
              {/* Header with Logo */}
              <div className="p-6 border-b border-cyan-500/20">
                <div className="flex items-center justify-start">
                  <MinuxLogo size="lg" showText={true} />
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-1 px-4">
                  {menuItems.filter(item => item.visible && item.enabled).map((item) => {
                    const isActive = pathname === item.href;
                    const isHome = item.icon === 'Home';
                    const IconComponent = iconMap[item.icon as IconName];
                    
                    return (
                      <Link
                        key={item.href}
                        href={isHome ? homePage : item.href}
                        className="block"
                        onClick={handleItemClick}
                      >
                        <motion.div
                          className={`
                            relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                            ${isActive 
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/20' 
                              : 'hover:bg-slate-800/50 hover:border hover:border-cyan-500/20'
                            }
                          `}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full -translate-y-1/2"
                              layoutId="mobileActiveIndicator"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}

                          {/* Icon */}
                          <div className={`
                            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                            ${isActive 
                              ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/40' 
                              : 'text-slate-400 group-hover:text-cyan-400'
                            }
                          `}>
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                          </div>

                          {/* Label and Description */}
                          <div className="flex-1 min-w-0">
                            <div className={`
                              text-sm font-medium transition-colors duration-200
                              ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                            `}>
                              {item.label}
                            </div>
                            {item.description && (
                              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                {item.description}
                              </div>
                            )}
                          </div>

                          {/* Arrow indicator */}
                          <ChevronRight className={`
                            w-4 h-4 transition-all duration-200
                            ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}
                          `} />
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bottom section */}
              <div className="p-4 border-t border-cyan-500/20">
                <div className="text-xs text-slate-500 text-center">
                  Minux Control Panel
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
