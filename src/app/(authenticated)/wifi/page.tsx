'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Signal, Lock, RefreshCw } from 'lucide-react';

export default function WifiPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [networks] = useState([
    { ssid: 'Home Network', signal: 90, secured: true, connected: true },
    { ssid: 'Guest Network', signal: 75, secured: true, connected: false },
    { ssid: 'Neighbor WiFi', signal: 60, secured: false, connected: false },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wi-Fi Configuration</h1>
          <p className="text-white/50">Manage wireless network connections</p>
        </div>
        <button
          onClick={() => setIsScanning(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          Scan Networks
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {networks.map((network, index) => (
          <motion.div
            key={network.ssid}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{network.ssid}</div>
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <Signal className="w-4 h-4" />
                    <span>{network.signal}%</span>
                    {network.secured && (
                      <>
                        <span>•</span>
                        <Lock className="w-4 h-4" />
                        <span>Secured</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-lg ${
                  network.connected
                    ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                    : 'bg-primary/20 text-primary border border-primary/20'
                } hover:bg-opacity-30 transition-colors`}
              >
                {network.connected ? 'Connected' : 'Connect'}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 