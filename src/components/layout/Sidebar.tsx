'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
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
  ChevronLeft,
  ChevronRight,
  Blocks,
  Lock,
  Music,
  Box
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
    icon: 'Settings',
    label: 'Settings',
    href: '/settings',
    description: 'System configuration',
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
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded on desktop
  const { menuItems: savedMenuItems, homePage } = useSettingsStore();
  const [menuItems, setLocalMenuItems] = useState<MenuItem[]>(defaultMenuItems);

  useEffect(() => {
    // Load saved expansion state from localStorage
    const savedExpansionState = localStorage.getItem('sidebar-expanded');
    if (savedExpansionState !== null) {
      setIsExpanded(JSON.parse(savedExpansionState));
    }

    if (savedMenuItems.length > 0) {
      setLocalMenuItems(savedMenuItems);
    }

    if (pathname === '/') {
      router.push(homePage);
    }
  }, [pathname, router, homePage, savedMenuItems]);

  // Save expansion state to localStorage whenever it changes
  const handleToggleExpansion = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    localStorage.setItem('sidebar-expanded', JSON.stringify(newExpanded));
  };

  const getIconComponent = (iconName: IconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(homePage);
  };

  return (
    <>
      <nav 
        className={`relative flex flex-col h-screen transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-72' : 'w-20'
        } border-r border-cyan-500/20 bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/10`}
      >
        {/* Header */}
        <motion.div 
          className="px-4 pt-6 pb-6 border-b border-cyan-500/20"
          animate={{ 
            paddingLeft: isExpanded ? '1rem' : '0.5rem',
            paddingRight: isExpanded ? '1rem' : '0.5rem'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className={`flex items-center ${isExpanded ? 'justify-start pl-2' : 'justify-center'}`}>
            <MinuxLogo size={isExpanded ? "lg" : "md"} showText={isExpanded} />
          </div>
        </motion.div>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-4">
          <div className="space-y-2 px-3">
            {menuItems.filter(item => item.visible && item.enabled).map((item) => {
              const isActive = pathname === item.href;
              const isHome = item.icon === 'Home';
              
              return (
                <Link
                  key={item.href}
                  href={isHome ? homePage : item.href}
                  className="relative block group"
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={isHome ? handleHomeClick : undefined}
                >
                  <motion.div
                    className={`
                      relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
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
                        layoutId="activeIndicator"
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
                        : 'text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-800/50'
                      }
                    `}>
                      {getIconComponent(item.icon)}
                    </div>

                    {/* Label */}
                    {isExpanded && (
                      <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className={`
                          font-medium transition-colors duration-200
                          ${isActive 
                            ? 'text-white' 
                            : 'text-slate-300 group-hover:text-white'
                          }
                        `}>
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-200">
                          {item.description}
                        </div>
                      </motion.div>
                    )}

                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      initial={false}
                    />
                  </motion.div>

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && hoveredItem === item.href && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute left-full ml-4 top-0 z-50 w-56 p-3 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
                    >
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-slate-400 mt-1">{item.description}</div>
                      )}
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Toggle Button */}
        <div className="p-4 border-t border-cyan-500/20">
          <motion.button
            onClick={handleToggleExpansion}
            className={`
              w-full flex items-center justify-center p-3 rounded-xl
              bg-gradient-to-r from-slate-800/50 to-slate-700/50 
              hover:from-cyan-500/10 hover:to-blue-500/10
              border border-slate-700/50 hover:border-cyan-500/30
              transition-all duration-200 group
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-slate-400 group-hover:text-cyan-400"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
            {isExpanded && (
              <motion.span
                className="ml-3 text-sm font-medium text-slate-300 group-hover:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Collapse
              </motion.span>
            )}
          </motion.button>
        </div>
      </nav>
    </>
  );
}; 