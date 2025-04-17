'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Laptop, Palette, Monitor, Power, Wifi, Shield } from 'lucide-react';
import { useThemeStore, Theme, ColorScheme } from '@/lib/theme';

const themes: { value: Theme; label: string; icon: JSX.Element }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="w-5 h-5" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" /> },
  { value: 'system', label: 'System', icon: <Laptop className="w-5 h-5" /> },
];

const colorSchemes: { value: ColorScheme; label: string; color: string }[] = [
  { value: 'blue', label: 'Blue', color: '#3B82F6' },
  { value: 'green', label: 'Green', color: '#10B981' },
  { value: 'purple', label: 'Purple', color: '#8B5CF6' },
  { value: 'red', label: 'Red', color: '#EF4444' },
];

const systemSettings = [
  {
    icon: <Monitor className="w-5 h-5" />,
    label: 'Display',
    description: 'Configure display resolution and settings',
    href: '/settings/display',
  },
  {
    icon: <Power className="w-5 h-5" />,
    label: 'Power Management',
    description: 'Power saving and performance settings',
    href: '/settings/power',
  },
  {
    icon: <Wifi className="w-5 h-5" />,
    label: 'Network',
    description: 'Network and wireless configuration',
    href: '/settings/network',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    label: 'Security',
    description: 'System security and access control',
    href: '/settings/security',
  },
];

export default function SettingsPage() {
  const { theme, colorScheme, setTheme, setColorScheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('appearance')}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeTab === 'appearance'
              ? 'border-primary text-primary'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          Appearance
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 px-1 border-b-2 transition-colors ${
            activeTab === 'system'
              ? 'border-primary text-primary'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          System
        </button>
      </div>

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Theme Selection */}
          <div>
            <h2 className="text-lg font-medium mb-4">Theme</h2>
            <div className="grid grid-cols-3 gap-4">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                    theme === t.value
                      ? 'border-primary bg-primary/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={theme === t.value ? 'text-primary' : ''}>
                    {t.icon}
                  </div>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme Selection */}
          <div>
            <h2 className="text-lg font-medium mb-4">Color Scheme</h2>
            <div className="grid grid-cols-4 gap-4">
              {colorSchemes.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColorScheme(c.value)}
                  className={`group p-4 rounded-lg border transition-all ${
                    colorScheme === c.value
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div
                    className="w-full h-12 rounded-md mb-2 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: c.color }}
                  />
                  <div className="text-sm">{c.label}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* System Settings */}
      {activeTab === 'system' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          {systemSettings.map((setting) => (
            <a
              key={setting.href}
              href={setting.href}
              className="p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-primary">{setting.icon}</div>
                <h3 className="font-medium">{setting.label}</h3>
              </div>
              <p className="text-sm text-white/50">{setting.description}</p>
            </a>
          ))}
        </motion.div>
      )}
    </div>
  );
} 