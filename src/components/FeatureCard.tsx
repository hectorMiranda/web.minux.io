'use client';

import { Terminal, Cpu, Package, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: 'terminal' | 'cpu' | 'package';
  color?: string;
}

const iconMap: Record<string, LucideIcon> = {
  terminal: Terminal,
  cpu: Cpu,
  package: Package,
};

export function FeatureCard({ title, description, iconName, color = '#00FF88' }: FeatureCardProps) {
  const Icon = iconMap[iconName];
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative p-8 rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden"
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ background: `linear-gradient(to bottom right, ${color}, transparent)` }}
      />
      
      {/* Glowing orb */}
      <div 
        className="absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />

      <div className="relative">
        <div 
          className="flex items-center justify-center w-12 h-12 rounded-lg mb-6"
          style={{ backgroundColor: `${color}10` }}
        >
          <Icon 
            className="w-6 h-6 transition-transform group-hover:scale-110 duration-500"
            style={{ color }}
          />
        </div>

        <h3 className="text-xl font-mono font-bold mb-4 group-hover:text-white transition-colors">
          {title}
        </h3>

        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
          {description}
        </p>

        {/* Decorative line */}
        <div 
          className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 opacity-20"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
} 