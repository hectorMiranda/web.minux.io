'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Blocks,
  Lock
} from 'lucide-react';

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  href: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    icon: <Home className="w-6 h-6" />,
    label: 'Dashboard',
    href: '/dashboard',
    description: 'System overview and status',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    label: 'System',
    href: '/system',
    description: 'CPU, memory, and processes',
  },
  {
    icon: <Thermometer className="w-6 h-6" />,
    label: 'Sensors',
    href: '/sensors',
    description: 'Temperature and voltage monitoring',
  },
  {
    icon: <Network className="w-6 h-6" />,
    label: 'Network',
    href: '/network',
    description: 'Network interfaces and statistics',
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    label: 'Wi-Fi',
    href: '/wifi',
    description: 'Wireless network configuration',
  },
  {
    icon: <HardDrive className="w-6 h-6" />,
    label: 'Storage',
    href: '/storage',
    description: 'Disk usage and management',
  },
  {
    icon: <Terminal className="w-6 h-6" />,
    label: 'Console',
    href: '/console',
    description: 'System terminal access',
  },
  {
    icon: <Gauge className="w-6 h-6" />,
    label: 'Performance',
    href: '/performance',
    description: 'System performance metrics',
  },
  {
    icon: <Settings className="w-6 h-6" />,
    label: 'Settings',
    href: '/settings',
    description: 'System configuration',
  },
  {
    icon: <Power className="w-6 h-6" />,
    label: 'Power',
    href: '/power',
    description: 'Power management and control',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    label: 'Security',
    href: '/security',
    description: 'System security settings',
  },
  {
    icon: <Blocks className="w-6 h-6" />,
    label: 'Blockchain',
    href: '/blockchain',
    description: 'Blockchain-related operations',
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize and set initial state
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsExpanded(!isMobileView);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      className={`relative flex flex-col h-screen transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-72' : 'w-20'
      } border-r border-white/10 overflow-y-auto py-4`}
    >
      {isMobile && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute right-0 top-20 -translate-y-1/2 bg-white/5 p-1 rounded-l-md transition-transform ${
            isExpanded ? 'translate-x-0 rotate-180' : 'translate-x-0'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      <div className="px-4 mb-8">
        <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
          <div className={`font-bold ${isExpanded ? 'text-xl' : 'text-base'}`}>
            Minux
          </div>
          {isExpanded && (
            <div className="text-sm text-white/50 ml-2">
              Pi Control
            </div>
          )}
        </div>
      </div>

      <nav className="space-y-1 px-3">
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
                className={`flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div className={`${isActive ? 'text-primary' : 'text-white/50'} transition-colors flex-shrink-0`}>
                  {item.icon}
                </div>
                {isExpanded && (
                  <span className={`${isActive ? 'font-medium' : ''}`}>
                    {item.label}
                  </span>
                )}
              </div>
              {!isExpanded && hoveredItem === item.href && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-2 top-0 z-50 w-48 p-2 rounded-lg bg-[#0A192F] border border-white/10 shadow-lg"
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
      </nav>
    </div>
  );
}; 