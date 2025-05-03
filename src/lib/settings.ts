import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IconName } from './icons';

export interface MenuItem {
  icon: IconName;
  label: string;
  href: string;
  description?: string;
  visible: boolean;
  enabled: boolean;
}

interface SettingsState {
  menuItems: MenuItem[];
  homePage: string;
  setMenuItems: (items: MenuItem[]) => void;
  setHomePage: (page: string) => void;
}

// Function to get all available pages
const getDefaultPages = (): MenuItem[] => {
  return [
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
    }
  ];
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      menuItems: getDefaultPages(), // Initialize with all pages
      homePage: '/console',
      setMenuItems: (items) => {
        // When setting new items, preserve any existing ones and their states
        const currentItems = get().menuItems;
        const mergedItems = items.map(item => ({
          ...getDefaultPages().find(p => p.href === item.href) || item, // Get default if exists
          ...currentItems.find(p => p.href === item.href) || {}, // Preserve existing state
          ...item, // Apply new changes
        }));
        
        // Add any default pages that weren't in the items
        getDefaultPages().forEach(page => {
          if (!mergedItems.some(item => item.href === page.href)) {
            mergedItems.push(page);
          }
        });
        
        set({ menuItems: mergedItems });
      },
      setHomePage: (page) => set({ homePage: page }),
    }),
    {
      name: 'settings-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure all default pages are present
          const defaultPages = getDefaultPages();
          const currentItems = state.menuItems;
          
          const mergedItems = defaultPages.map(defaultPage => ({
            ...defaultPage,
            ...currentItems.find(item => item.href === defaultPage.href)
          }));
          
          state.setMenuItems(mergedItems);
        }
      },
    }
  )
); 