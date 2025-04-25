'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { SecurityToggle } from '@/components/SecurityToggle';
import { Shield, Lock, Key, Bell } from 'lucide-react';

export default function SecurityPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings]
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold">Security Settings</h1>
      </div>

      <div className="space-y-8">
        {/* Authentication Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-white/50" />
            <h2 className="text-lg font-medium">Authentication</h2>
          </div>
          <div className="space-y-6 p-4 rounded-lg bg-white/5">
            <SecurityToggle
              enabled={settings.twoFactorAuth}
              onChange={() => handleToggle('twoFactorAuth')}
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account by requiring a verification code in addition to your password."
            />
            <SecurityToggle
              enabled={settings.loginNotifications}
              onChange={() => handleToggle('loginNotifications')}
              label="Login Notifications"
              description="Receive notifications when someone logs into your account from a new device or location."
            />
          </div>
        </section>

        {/* Password Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-white/50" />
            <h2 className="text-lg font-medium">Password</h2>
          </div>
          <div className="space-y-4 p-4 rounded-lg bg-white/5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Password Expiry (days)</label>
              <input
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => setSettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                className="w-32 px-3 py-2 rounded-md bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
              />
              <p className="text-sm text-white/50">Set to 0 to never expire</p>
            </div>
          </div>
        </section>

        {/* Session Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-white/50" />
            <h2 className="text-lg font-medium">Session</h2>
          </div>
          <div className="space-y-4 p-4 rounded-lg bg-white/5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className="w-32 px-3 py-2 rounded-md bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                min="5"
              />
              <p className="text-sm text-white/50">Minimum 5 minutes</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 