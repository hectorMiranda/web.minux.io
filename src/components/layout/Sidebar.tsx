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
  Shield,
  Users,
  LogOut,
  Menu
} from 'lucide-react';

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  href: string;
  description?: string;
}

const menuItems: MenuItem[] = [
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
    icon: <Terminal className="w-5 h-5" />,
    label: 'Console',
    href: '/console',
    description: 'System terminal access',
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
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="w-64 border-r border-white/10 h-screen overflow-y-auto py-4">
      <div className="px-3 mb-8">
        <div className="text-xl font-bold px-3">Minux</div>
        <div className="text-sm text-white/50 px-3">Raspberry Pi Control</div>
      </div>

      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative block"
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div className={`${isActive ? 'text-primary' : 'text-white/50'}`}>
                  {item.icon}
                </div>
                <span className={isActive ? 'font-medium' : ''}>
                  {item.label}
                </span>
              </div>
              {hoveredItem === item.href && item.description && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-full ml-2 top-0 z-50 w-48 p-2 rounded-lg bg-[#0A192F] border border-white/10 shadow-lg"
                >
                  <div className="text-sm">{item.description}</div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}; 