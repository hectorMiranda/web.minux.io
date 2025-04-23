'use client';

import { useEffect, useState } from 'react';
import { Activity, Cpu, HardDrive } from 'lucide-react';

interface SystemMetrics {
  cpuUsage: number;
  cpuSpeed: number;
  cpuCores: number;
  memoryUsed: number;
  memoryTotal: number;
  networkSpeed: number;
  networkLatency: number;
}

export default function SystemPage() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    cpuSpeed: 0,
    cpuCores: 0,
    memoryUsed: 0,
    memoryTotal: 0,
    networkSpeed: 0,
    networkLatency: 0
  });

  // Update time every second
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime(); // Initial update
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Measure network latency
  const measureLatency = async () => {
    const start = performance.now();
    try {
      await fetch('/api/system-info');
      return Math.round(performance.now() - start);
    } catch {
      return 0;
    }
  };

  // Fetch system metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [latency, response] = await Promise.all([
          measureLatency(),
          fetch('/api/system-info')
        ]);
        
        const data = await response.json();
        
        // Calculate memory in GB
        const memoryTotal = Math.round(data.totalMemory / (1024 * 1024 * 1024));
        const memoryUsed = Math.round((data.totalMemory - data.freeMemory) / (1024 * 1024 * 1024));
        
        setMetrics({
          cpuUsage: Math.round(data.cpuUsage),
          cpuSpeed: data.cpus[0]?.speed / 1000 || 0,
          cpuCores: data.cpus.length,
          memoryUsed,
          memoryTotal,
          networkSpeed: parseFloat(data.network.speed),
          networkLatency: latency
        });
      } catch (error) {
        console.error('Failed to fetch system metrics:', error);
      }
    };

    // Initial fetch
    fetchMetrics();
    
    // Set up interval for subsequent fetches
    const metricsInterval: NodeJS.Timeout = setInterval(fetchMetrics, 2000);

    // Cleanup
    return () => {
      if (metricsInterval) clearInterval(metricsInterval);
    };
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#00ff94]">System Overview</h1>
        <div className="text-right">
          <div className="text-[#00ff94] text-2xl font-mono" key={currentTime.getTime()}>
            {formatTime(currentTime)}
          </div>
          <div className="text-white/50">{formatDate(currentTime)}</div>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-black/40 rounded-lg p-6 relative">
          <div className="absolute right-6 top-6">
            <Cpu className="w-6 h-6 text-white/30" />
          </div>
          <h2 className="text-white/50 mb-2">CPU Usage</h2>
          <div className="text-4xl mb-2" key={metrics.cpuUsage}>{metrics.cpuUsage}%</div>
          <div className="text-white/50">{metrics.cpuSpeed.toFixed(1)} GHz | {metrics.cpuCores} Cores</div>
        </div>

        <div className="flex-1 bg-black/40 rounded-lg p-6 relative">
          <div className="absolute right-6 top-6">
            <HardDrive className="w-6 h-6 text-white/30" />
          </div>
          <h2 className="text-white/50 mb-2">Memory</h2>
          <div className="text-4xl mb-2" key={metrics.memoryUsed}>
            {Math.round(metrics.memoryUsed / metrics.memoryTotal * 100)}%
          </div>
          <div className="text-white/50">{metrics.memoryUsed} GB / {metrics.memoryTotal} GB</div>
        </div>

        <div className="flex-1 bg-black/40 rounded-lg p-6 relative">
          <div className="absolute right-6 top-6">
            <Activity className="w-6 h-6 text-white/30" />
          </div>
          <h2 className="text-white/50 mb-2">Network</h2>
          <div className="text-4xl mb-2" key={metrics.networkSpeed}>
            {Math.round(metrics.networkSpeed / 1.4 * 100)}%
          </div>
          <div className="text-white/50">{metrics.networkSpeed} MB/s | {metrics.networkLatency}ms</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/40 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Security Status</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/50">Firewall</span>
              <span className="text-[#00ff94]">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50">Last Scan</span>
              <span className="text-white/50">2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="bg-black/40 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">System Alerts</h2>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white/90">Security Scan Complete</span>
              </div>
              <p className="text-white/50 text-sm">No threats detected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 