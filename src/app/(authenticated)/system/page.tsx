'use client';

import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive as Memory, Clock } from 'lucide-react';

export default function SystemPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Resources</h1>
          <p className="text-white/50">CPU, memory, and process management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Information */}
        <motion.div 
          className="p-6 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">CPU Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white/50">CPU Usage</span>
                <span>32%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: '32%' }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-white/50 text-sm">Clock Speed</div>
                <div className="text-lg">1.5 GHz</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-white/50 text-sm">Temperature</div>
                <div className="text-lg">45°C</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-white/50 text-sm">Cores</div>
                <div className="text-lg">4</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-white/50 text-sm">Threads</div>
                <div className="text-lg">4</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Memory Usage */}
        <motion.div 
          className="p-6 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Memory className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Memory Usage</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white/50">Memory Usage</span>
                <span>2.4GB / 4GB</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-white/50 text-sm">Used</div>
                <div className="text-lg">2.4 GB</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-white/50 text-sm">Available</div>
                <div className="text-lg">1.6 GB</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-white/50 text-sm">Cached</div>
                <div className="text-lg">512 MB</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-white/50 text-sm">Total</div>
                <div className="text-lg">4 GB</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Process List */}
      <motion.div 
        className="p-6 rounded-xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Active Processes</h2>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm hover:bg-primary/30 transition-colors">
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-white/50 text-sm">
                <th className="text-left pb-3">Process</th>
                <th className="text-left pb-3">PID</th>
                <th className="text-left pb-3">User</th>
                <th className="text-left pb-3">CPU</th>
                <th className="text-left pb-3">Memory</th>
                <th className="text-left pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: 'systemd', pid: 1, user: 'root', cpu: '0.2%', mem: '0.5%', time: '2:30' },
                { name: 'nginx', pid: 245, user: 'www-data', cpu: '0.5%', mem: '1.2%', time: '1:15' },
                { name: 'postgres', pid: 385, user: 'postgres', cpu: '1.2%', mem: '2.5%', time: '3:45' },
                { name: 'node', pid: 892, user: 'node', cpu: '2.5%', mem: '3.8%', time: '0:45' },
                { name: 'redis-server', pid: 456, user: 'redis', cpu: '0.3%', mem: '0.8%', time: '1:30' }
              ].map((process, index) => (
                <tr key={index} className="border-t border-white/10">
                  <td className="py-3">{process.name}</td>
                  <td className="py-3">{process.pid}</td>
                  <td className="py-3">{process.user}</td>
                  <td className="py-3">{process.cpu}</td>
                  <td className="py-3">{process.mem}</td>
                  <td className="py-3">{process.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
} 