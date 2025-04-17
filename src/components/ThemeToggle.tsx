'use client';

import React, { useState } from 'react';
import { Moon, Sun, Laptop, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore, Theme, ColorScheme } from '@/lib/theme';

const themes: { value: Theme; label: string; icon: React.ReactElement }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
  { value: 'system', label: 'System', icon: <Laptop className="w-4 h-4" /> },
];

const colorSchemes: { value: ColorScheme; label: string; color: string }[] = [
  { value: 'blue', label: 'Blue', color: '#3B82F6' },
  { value: 'green', label: 'Green', color: '#10B981' },
  { value: 'purple', label: 'Purple', color: '#8B5CF6' },
  { value: 'red', label: 'Red', color: '#EF4444' },
];

export const ThemeToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, colorScheme, setTheme, setColorScheme } = useThemeStore();

  const currentTheme = themes.find(t => t.value === theme);
  const currentColor = colorSchemes.find(c => c.value === colorScheme);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        {currentTheme?.icon}
        <Palette 
          className="w-4 h-4" 
          style={{ color: currentColor?.color }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 rounded-lg bg-[#0A192F] border border-white/10 shadow-lg z-40"
            >
              <div className="p-2">
                <div className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-medium text-white/50">
                    Theme
                  </div>
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => {
                        setTheme(t.value);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                        theme === t.value ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      {t.icon}
                      <span className="text-sm">{t.label}</span>
                    </button>
                  ))}
                </div>
                <div>
                  <div className="px-2 py-1.5 text-xs font-medium text-white/50">
                    Color
                  </div>
                  <div className="grid grid-cols-4 gap-1 px-2">
                    {colorSchemes.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => {
                          setColorScheme(c.value);
                          setIsOpen(false);
                        }}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          colorScheme === c.value ? 'scale-90' : 'hover:scale-95'
                        }`}
                        style={{ backgroundColor: c.color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}; 