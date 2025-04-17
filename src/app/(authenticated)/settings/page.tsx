'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Moon, Sun, Globe, Lock, User, Power } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-white/50">System configuration and preferences</p>
        </div>
      </div>

      {/* System Settings */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* General Settings */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-white/50" />
                <div>
                  <div>System Notifications</div>
                  <div className="text-sm text-white/50">Get notified about system events</div>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-primary' : 'bg-white/10'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-white/50" />
                <div>
                  <div>Dark Mode</div>
                  <div className="text-sm text-white/50">Toggle dark/light theme</div>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-primary' : 'bg-white/10'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-white/50" />
                <div>
                  <div>Auto Updates</div>
                  <div className="text-sm text-white/50">Keep system up to date</div>
                </div>
              </div>
              <button
                onClick={() => setAutoUpdate(!autoUpdate)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  autoUpdate ? 'bg-primary' : 'bg-white/10'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  autoUpdate ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Security Settings</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-white/50" />
                <div className="text-left">
                  <div>Change Password</div>
                  <div className="text-sm text-white/50">Update system access password</div>
                </div>
              </div>
              <div className="text-primary text-sm">Change</div>
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-white/50" />
                <div className="text-left">
                  <div>User Management</div>
                  <div className="text-sm text-white/50">Manage system users</div>
                </div>
              </div>
              <div className="text-primary text-sm">Manage</div>
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-white/50" />
                <div className="text-left">
                  <div>Security Log</div>
                  <div className="text-sm text-white/50">View security events</div>
                </div>
              </div>
              <div className="text-primary text-sm">View</div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* System Actions */}
      <motion.div 
        className="p-6 rounded-xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold mb-4">System Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400">
            <Power className="w-5 h-5" />
            <span>Shutdown</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition-colors text-orange-400">
            <Power className="w-5 h-5" />
            <span>Restart</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary">
            <Power className="w-5 h-5" />
            <span>Sleep</span>
          </button>
        </div>
      </motion.div>

      {/* About System */}
      <motion.div 
        className="p-6 rounded-xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-4">About System</h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="text-white/50">Version</span>
            <span>Minux 1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="text-white/50">Build</span>
            <span>2024.03.20</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="text-white/50">OS Version</span>
            <span>Raspberry Pi OS 11</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-white/50">License</span>
            <span>MIT</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 