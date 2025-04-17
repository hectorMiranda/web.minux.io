'use client';

import { motion } from 'framer-motion';
import { Battery, BatteryCharging, Power, Activity, Clock, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PowerPage() {
  const [powerStats, setPowerStats] = useState({
    cpuPower: 2.5,
    temperature: 45,
    uptime: '5 days 3 hours',
    batteryLevel: 85,
    isCharging: true,
    powerMode: 'Performance'
  });

  // Simulated power consumption data
  const powerData = [
    { time: '12:00', value: 2.3 },
    { time: '13:00', value: 2.8 },
    { time: '14:00', value: 2.5 },
    { time: '15:00', value: 2.9 },
    { time: '16:00', value: 2.4 },
    { time: '17:00', value: 2.6 }
  ];

  const maxPower = Math.max(...powerData.map(d => d.value));
  const chartHeight = 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Power Management</h1>
          <p className="text-white/50">System power consumption and settings</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5">
          <Activity className="w-4 h-4 text-primary" />
          <span>System Active</span>
        </div>
      </div>

      {/* Power Status */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-medium">CPU Power</h3>
          </div>
          <div className="text-3xl font-bold mb-2">{powerStats.cpuPower}W</div>
          <div className="text-sm text-white/50">Current consumption</div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            {powerStats.isCharging ? (
              <BatteryCharging className="w-5 h-5 text-green-400" />
            ) : (
              <Battery className="w-5 h-5 text-primary" />
            )}
            <h3 className="font-medium">Battery</h3>
          </div>
          <div className="text-3xl font-bold mb-2">{powerStats.batteryLevel}%</div>
          <div className="text-sm text-white/50">
            {powerStats.isCharging ? 'Charging' : 'On Battery'}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Uptime</h3>
          </div>
          <div className="text-3xl font-bold mb-2">{powerStats.uptime}</div>
          <div className="text-sm text-white/50">Since last boot</div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Power className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Power Mode</h3>
          </div>
          <div className="text-3xl font-bold mb-2">{powerStats.powerMode}</div>
          <div className="text-sm text-white/50">Current profile</div>
        </div>
      </motion.div>

      {/* Power Consumption Chart */}
      <motion.div 
        className="p-6 rounded-xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold mb-6">Power Consumption</h2>
        <div className="relative h-[200px]">
          <div className="absolute inset-0 flex items-end justify-between">
            {powerData.map((point, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-primary mb-2" />
                <div className="text-xs text-white/50">{point.time}</div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-end justify-between">
            {powerData.map((point, index) => (
              <motion.div
                key={index}
                className="w-8 bg-primary/20 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${(point.value / maxPower) * chartHeight}%` }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Power Actions */}
      <motion.div 
        className="p-6 rounded-xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-6">Power Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <Power className="w-5 h-5 text-primary" />
              <span>Shutdown</span>
            </div>
          </button>
          <button className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-primary" />
              <span>Restart</span>
            </div>
          </button>
          <button className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span>Sleep</span>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
} 