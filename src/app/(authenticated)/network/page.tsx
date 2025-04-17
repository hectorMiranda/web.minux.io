'use client';

import { motion } from 'framer-motion';
import { Network, ArrowDown, ArrowUp, Activity } from 'lucide-react';

export default function NetworkPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Network</h1>
          <p className="text-white/50">Network interfaces and statistics</p>
        </div>
        <motion.div 
          className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Status: Connected
        </motion.div>
      </div>

      {/* Network Interfaces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="p-6 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Network className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Ethernet (eth0)</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/50">IP Address</span>
              <span>192.168.1.100</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/50">Subnet Mask</span>
              <span>255.255.255.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/50">Gateway</span>
              <span>192.168.1.1</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/50">MAC Address</span>
              <span>00:11:22:33:44:55</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-white/50">Status</span>
              <span className="text-green-400">Connected</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="p-6 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Network Activity</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <ArrowDown className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </div>
              <div className="text-2xl font-semibold">2.5 MB/s</div>
              <div className="text-sm text-white/50">Total: 1.2 GB</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm">Upload</span>
              </div>
              <div className="text-2xl font-semibold">1.2 MB/s</div>
              <div className="text-sm text-white/50">Total: 0.8 GB</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Network Statistics */}
      <motion.div 
        className="p-6 rounded-xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-4">Connection Statistics</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-white/50 text-sm">
                <th className="text-left py-2">Protocol</th>
                <th className="text-left py-2">Local Address</th>
                <th className="text-left py-2">Remote Address</th>
                <th className="text-left py-2">State</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/10">
                <td className="py-2">TCP</td>
                <td className="py-2">192.168.1.100:80</td>
                <td className="py-2">10.0.0.1:443</td>
                <td className="py-2 text-green-400">ESTABLISHED</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-2">UDP</td>
                <td className="py-2">192.168.1.100:53</td>
                <td className="py-2">8.8.8.8:53</td>
                <td className="py-2 text-blue-400">CONNECTED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
} 