'use client';

import { motion } from 'framer-motion';
import { Cpu, HardDrive, Activity, Clock } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';

export default function PerformancePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Performance Metrics</h1>
          <p className="text-white/50">Real-time system performance monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="CPU Usage"
          value="45%"
          icon={<Cpu className="w-5 h-5" />}
          chart={[30, 45, 35, 40, 38, 42, 45]}
          change="+3%"
          description="4 cores @ 1.5GHz"
        />
        <StatCard
          title="Memory Usage"
          value="2.8GB"
          icon={<HardDrive className="w-5 h-5" />}
          chart={[2.5, 2.6, 2.7, 2.8, 2.7, 2.8, 2.8]}
          change="+0.2GB"
          description="4GB Total"
        />
        <StatCard
          title="Network I/O"
          value="1.2MB/s"
          icon={<Activity className="w-5 h-5" />}
          chart={[0.8, 1.0, 1.1, 1.2, 1.1, 1.2, 1.2]}
          change="+0.1MB/s"
          description="Total bandwidth"
        />
        <StatCard
          title="Process Count"
          value="124"
          icon={<Activity className="w-5 h-5" />}
          chart={[120, 122, 123, 124, 123, 124, 124]}
          change="+2"
          description="Active processes"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Top Processes</h2>
          <div className="space-y-3">
            {[
              { name: 'system', cpu: '12%', memory: '512MB' },
              { name: 'nginx', cpu: '8%', memory: '256MB' },
              { name: 'node', cpu: '6%', memory: '384MB' },
              { name: 'python', cpu: '4%', memory: '128MB' },
              { name: 'redis', cpu: '3%', memory: '96MB' },
            ].map((process, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
              >
                <span className="font-mono">{process.name}</span>
                <div className="flex items-center gap-4 text-sm text-white/50">
                  <span>CPU: {process.cpu}</span>
                  <span>MEM: {process.memory}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">System Load</h2>
          <div className="space-y-3">
            {[
              { time: '1 min', value: '1.25' },
              { time: '5 min', value: '1.15' },
              { time: '15 min', value: '1.05' },
            ].map((load, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
              >
                <span className="text-white/50">{load.time}</span>
                <span className="font-mono">{load.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 