import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MenuItem {
  icon: string;
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

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      menuItems: [
        {
          icon: 'Music',
          label: 'MIDI Controller',
          href: '/midi',
          description: 'Virtual MIDI keyboard and controller',
          visible: false,
          enabled: true,
        },
      ],
      homePage: '/console',
      setMenuItems: (items) => set({ menuItems: items }),
      setHomePage: (page) => set({ homePage: page }),
    }),
    {
      name: 'settings-storage',
    }
  )
); 