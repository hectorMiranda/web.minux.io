import { motion } from 'framer-motion';
import { StatCard } from './StatCard';
import { Cpu, HardDrive as Memory, Network, Shield, Terminal, Clock } from 'lucide-react';

export const Dashboard = () => {
  const currentTime = new Date().toLocaleTimeString();
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-primary"
            >
              System Overview
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mt-1"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">LIVE</span>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-right"
          >
            <div className="text-3xl font-mono text-primary">{currentTime}</div>
            <div className="text-sm text-gray-400">{currentDate}</div>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="CPU Usage"
            value="51%"
            subValue="3.8 GHz | 12 Cores"
            icon={<Cpu className="w-6 h-6" />}
          />
          <StatCard
            title="Memory"
            value="65%"
            subValue="16.4 GB / 24 GB"
            icon={<Memory className="w-6 h-6" />}
            color="secondary"
          />
          <StatCard
            title="Network"
            value="86%"
            subValue="1.2 GB/s | 42ms"
            icon={<Network className="w-6 h-6" />}
            color="accent"
          />
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Security Status</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Firewall</span>
                <span className="text-green-500">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Scan</span>
                <span className="text-gray-300">2 hours ago</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">System Alerts</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-gray-300">Security Scan Complete</p>
                  <p className="text-xs text-gray-500">No threats detected</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 