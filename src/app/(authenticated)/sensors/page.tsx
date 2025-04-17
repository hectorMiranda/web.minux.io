'use client';

import { motion } from 'framer-motion';
import { Thermometer, Zap, Cpu, Fan } from 'lucide-react';

export default function SensorsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sensors</h1>
          <p className="text-white/50">Temperature and voltage monitoring</p>
        </div>
        <motion.div 
          className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Status: Normal
        </motion.div>
      </div>

      {/* Temperature Sensors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'CPU Core', value: '45°C', icon: <Cpu />, threshold: '75°C' },
          { name: 'GPU', value: '42°C', icon: <Thermometer />, threshold: '80°C' },
          { name: 'System', value: '38°C', icon: <Thermometer />, threshold: '60°C' },
          { name: 'Storage', value: '35°C', icon: <Thermometer />, threshold: '55°C' }
        ].map((sensor, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-primary">{sensor.icon}</div>
              <h2 className="font-semibold">{sensor.name}</h2>
            </div>
            <div className="text-3xl font-bold mb-2">{sensor.value}</div>
            <div className="text-sm text-white/50">Threshold: {sensor.threshold}</div>
          </motion.div>
        ))}
      </div>

      {/* Voltage Readings */}
      <motion.div 
        className="p-6 rounded-xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Voltage Readings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'CPU Core', value: '1.2V', min: '1.1V', max: '1.3V' },
            { name: '3.3V Rail', value: '3.31V', min: '3.2V', max: '3.4V' },
            { name: '5V Rail', value: '5.05V', min: '4.9V', max: '5.1V' },
            { name: '12V Rail', value: '12.1V', min: '11.8V', max: '12.2V' }
          ].map((voltage, index) => (
            <div key={index} className="p-4 rounded-lg bg-white/5">
              <div className="text-white/50 mb-2">{voltage.name}</div>
              <div className="text-2xl font-semibold mb-1">{voltage.value}</div>
              <div className="text-sm text-white/50">
                Range: {voltage.min} - {voltage.max}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Fan Speeds */}
      <motion.div 
        className="p-6 rounded-xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Fan className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Fan Speeds</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'CPU Fan', speed: '1200 RPM', percent: 45 },
            { name: 'System Fan', speed: '800 RPM', percent: 30 }
          ].map((fan, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <span>{fan.name}</span>
                <span>{fan.speed}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${fan.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Historical Data */}
      <motion.div 
        className="p-6 rounded-xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold mb-4">Temperature History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-white/50 text-sm">
                <th className="text-left pb-3">Time</th>
                <th className="text-left pb-3">CPU</th>
                <th className="text-left pb-3">GPU</th>
                <th className="text-left pb-3">System</th>
                <th className="text-left pb-3">Storage</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { time: '15:00', cpu: '45°C', gpu: '42°C', sys: '38°C', storage: '35°C' },
                { time: '14:00', cpu: '47°C', gpu: '44°C', sys: '39°C', storage: '36°C' },
                { time: '13:00', cpu: '44°C', gpu: '41°C', sys: '37°C', storage: '35°C' },
                { time: '12:00', cpu: '43°C', gpu: '40°C', sys: '36°C', storage: '34°C' }
              ].map((reading, index) => (
                <tr key={index} className="border-t border-white/10">
                  <td className="py-3">{reading.time}</td>
                  <td className="py-3">{reading.cpu}</td>
                  <td className="py-3">{reading.gpu}</td>
                  <td className="py-3">{reading.sys}</td>
                  <td className="py-3">{reading.storage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
} 