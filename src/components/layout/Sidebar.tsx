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
  Music
} from 'lucide-react';
import { MinuxLogo } from '../MinuxLogo';
import { useSettingsStore } from '@/lib/settings';

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  description?: string;
  visible: boolean;
}

const defaultMenuItems: MenuItem[] = [
  {
    icon: 'Terminal',
    label: 'Console',
    href: '/console',
    description: 'System terminal access',
    visible: true,
  },
  {
    icon: 'Home',
    label: 'Dashboard',
    href: '/dashboard',
    description: 'System overview and status',
    visible: true,
  },
  {
    icon: 'Cpu',
    label: 'System',
    href: '/system',
    description: 'CPU, memory, and processes',
    visible: true,
  },
  {
    icon: 'Thermometer',
    label: 'Sensors',
    href: '/sensors',
    description: 'Temperature and voltage monitoring',
    visible: true,
  },
  {
    icon: 'Network',
    label: 'Network',
    href: '/network',
    description: 'Network interfaces and statistics',
    visible: true,
  },
  {
    icon: 'Wifi',
    label: 'Wi-Fi',
    href: '/wifi',
    description: 'Wireless network configuration',
    visible: true,
  },
  {
    icon: 'HardDrive',
    label: 'Storage',
    href: '/storage',
    description: 'Disk usage and management',
    visible: true,
  },
  {
    icon: 'Gauge',
    label: 'Performance',
    href: '/performance',
    description: 'System performance metrics',
    visible: true,
  },
  {
    icon: 'Settings',
    label: 'Settings',
    href: '/settings',
    description: 'System configuration',
    visible: true,
  },
  {
    icon: 'Power',
    label: 'Power',
    href: '/power',
    description: 'Power management and control',
    visible: true,
  },
  {
    icon: 'Lock',
    label: 'Security',
    href: '/security',
    description: 'System security settings',
    visible: true,
  },
  {
    icon: 'Blocks',
    label: 'Blockchain',
    href: '/blockchain',
    description: 'Blockchain-related operations',
    visible: true,
  },
  {
    icon: 'Music',
    label: 'MIDI Controller',
    href: '/midi',
    description: 'Virtual MIDI keyboard and controller',
    visible: true,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { menuItems: savedMenuItems, homePage } = useSettingsStore();
  const [menuItems, setLocalMenuItems] = useState<MenuItem[]>(defaultMenuItems);

  useEffect(() => {
    if (savedMenuItems.length > 0) {
      setLocalMenuItems(savedMenuItems);
    }

    if (pathname === '/') {
      router.push(homePage);
    }
  }, [pathname, router, homePage, savedMenuItems]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-5 h-5" />;
      case 'Home':
        return <Home className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Thermometer':
        return <Thermometer className="w-5 h-5" />;
      case 'Network':
        return <Network className="w-5 h-5" />;
      case 'Wifi':
        return <Wifi className="w-5 h-5" />;
      case 'HardDrive':
        return <HardDrive className="w-5 h-5" />;
      case 'Gauge':
        return <Gauge className="w-5 h-5" />;
      case 'Settings':
        return <Settings className="w-5 h-5" />;
      case 'Power':
        return <Power className="w-5 h-5" />;
      case 'Lock':
        return <Lock className="w-5 h-5" />;
      case 'Blocks':
        return <Blocks className="w-5 h-5" />;
      case 'Music':
        return <Music className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(homePage);
  };

  return (
    <>
      <nav 
        className={`relative flex flex-col h-screen transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-16'
        } border-r border-white/10 bg-[#2D2D2D]`}
      >
        <div className="px-3 pt-4 pb-4">
          <div className={`flex items-center ${isExpanded ? 'justify-start pl-1' : 'justify-center'}`}>
            <MinuxLogo size={isExpanded ? "md" : "sm"} showText={isExpanded} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="space-y-1 px-2">
            {menuItems.filter(item => item.visible).map((item) => {
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
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`${isActive ? 'text-primary' : 'text-white/50'} transition-colors flex-shrink-0`}>
                      {getIconComponent(item.icon)}
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

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed left-0 top-1/2 -translate-y-1/2 ${
          isExpanded ? 'translate-x-64' : 'translate-x-16'
        } z-50 bg-[#2D2D2D] hover:bg-[#3D3D3D] border border-white/10 transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center p-1 hover:text-primary text-white/70">
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </div>
      </button>
    </>
  );
}; 