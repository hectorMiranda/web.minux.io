'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Lock
} from 'lucide-react';
import { MinuxLogo } from '../MinuxLogo';

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  href: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    icon: <Terminal className="w-5 h-5" />,
    label: 'Console',
    href: '/console',
    description: 'System terminal access',
  },
  {
    icon: <Home className="w-5 h-5" />,
    label: 'Dashboard',
    href: '/dashboard',
    description: 'System overview and status',
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    label: 'System',
    href: '/system',
    description: 'CPU, memory, and processes',
  },
  {
    icon: <Thermometer className="w-5 h-5" />,
    label: 'Sensors',
    href: '/sensors',
    description: 'Temperature and voltage monitoring',
  },
  {
    icon: <Network className="w-5 h-5" />,
    label: 'Network',
    href: '/network',
    description: 'Network interfaces and statistics',
  },
  {
    icon: <Wifi className="w-5 h-5" />,
    label: 'Wi-Fi',
    href: '/wifi',
    description: 'Wireless network configuration',
  },
  {
    icon: <HardDrive className="w-5 h-5" />,
    label: 'Storage',
    href: '/storage',
    description: 'Disk usage and management',
  },
  {
    icon: <Gauge className="w-5 h-5" />,
    label: 'Performance',
    href: '/performance',
    description: 'System performance metrics',
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: 'Settings',
    href: '/settings',
    description: 'System configuration',
  },
  {
    icon: <Power className="w-5 h-5" />,
    label: 'Power',
    href: '/power',
    description: 'Power management and control',
  },
  {
    icon: <Lock className="w-5 h-5" />,
    label: 'Security',
    href: '/security',
    description: 'System security settings',
  },
  {
    icon: <Blocks className="w-5 h-5" />,
    label: 'Blockchain',
    href: '/blockchain',
    description: 'Blockchain-related operations',
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav 
      className={`relative flex flex-col h-screen transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      } border-r border-white/10 bg-[#2D2D2D]`}
    >
      <div className="relative px-3 pt-4 pb-4">
        <div className={`flex items-center ${isExpanded ? 'justify-start pl-1' : 'justify-center'}`}>
          <MinuxLogo size={isExpanded ? "md" : "sm"} showText={isExpanded} />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#2D2D2D] border border-white/10 p-1.5 rounded-full hover:bg-white/5 transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative block group"
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`${isActive ? 'text-primary' : 'text-white/50'} transition-colors flex-shrink-0`}>
                    {item.icon}
                  </div>
                  {isExpanded && (
                    <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </div>
                {!isExpanded && hoveredItem === item.href && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-full ml-2 top-0 z-50 w-48 p-2 rounded-lg bg-[#2D2D2D] border border-white/10 shadow-lg"
                  >
                    <div className="text-sm font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-white/50 mt-1">{item.description}</div>
                    )}
                  </motion.div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}; 