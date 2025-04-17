'use client';

import { motion } from 'framer-motion';
import { HardDrive, Database, FileText, Folder } from 'lucide-react';

export default function StoragePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Storage</h1>
          <p className="text-white/50">Disk usage and management</p>
        </div>
      </div>

      {/* Storage Overview */}
      <motion.div 
        className="p-6 rounded-xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <HardDrive className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Main Storage (mmcblk0)</h2>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-white/50">Used Space</span>
              <span>28.5GB / 64GB</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: '44.5%' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-sm text-white/50">Total Space</span>
              </div>
              <div className="text-2xl font-semibold">64 GB</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white/50">Available</span>
              </div>
              <div className="text-2xl font-semibold">35.5 GB</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Folder className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white/50">Used</span>
              </div>
              <div className="text-2xl font-semibold">28.5 GB</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* File Systems */}
      <motion.div 
        className="p-6 rounded-xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold mb-4">Mounted File Systems</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-white/50 text-sm">
                <th className="text-left pb-3">Device</th>
                <th className="text-left pb-3">Mount Point</th>
                <th className="text-left pb-3">Type</th>
                <th className="text-left pb-3">Size</th>
                <th className="text-left pb-3">Used</th>
                <th className="text-left pb-3">Available</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { device: '/dev/mmcblk0p1', mount: '/', type: 'ext4', size: '64G', used: '28.5G', avail: '35.5G' },
                { device: '/dev/mmcblk0p2', mount: '/boot', type: 'vfat', size: '256M', used: '48M', avail: '208M' },
                { device: 'tmpfs', mount: '/tmp', type: 'tmpfs', size: '2G', used: '24M', avail: '1.98G' },
                { device: '/dev/sda1', mount: '/media/usb', type: 'ext4', size: '32G', used: '12G', avail: '20G' }
              ].map((fs, index) => (
                <tr key={index} className="border-t border-white/10">
                  <td className="py-3">{fs.device}</td>
                  <td className="py-3">{fs.mount}</td>
                  <td className="py-3">{fs.type}</td>
                  <td className="py-3">{fs.size}</td>
                  <td className="py-3">{fs.used}</td>
                  <td className="py-3">{fs.avail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Storage Health */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Storage Health</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/50">Temperature</span>
              <span>42°C</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/50">Power On Hours</span>
              <span>2160</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/50">Start/Stop Count</span>
              <span>245</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-white/50">Health Status</span>
              <span className="text-green-400">Good</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">I/O Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/50">Read Speed</span>
              <span>85 MB/s</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/50">Write Speed</span>
              <span>45 MB/s</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="text-white/50">Read Operations</span>
              <span>1.2M</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-white/50">Write Operations</span>
              <span>850K</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 