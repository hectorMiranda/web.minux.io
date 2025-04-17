import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system';
export type ColorScheme = 'blue' | 'green' | 'purple' | 'red';

interface ThemeState {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark' as Theme,
      colorScheme: 'green' as ColorScheme,
      setTheme: (theme: Theme) => set({ theme }),
      setColorScheme: (colorScheme: ColorScheme) => set({ colorScheme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 