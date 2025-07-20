'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  chart?: number[];
  change?: string;
  description?: string;
  subValue?: string;
  color?: 'primary' | 'secondary' | 'accent';
}

export const StatCard = ({ 
  title, 
  value, 
  icon, 
  chart = [], 
  change, 
  description,
  subValue,
  color = 'primary'
}: StatCardProps) => {
  // Only calculate chart values if chart data is provided
  const max = chart.length > 0 ? Math.max(...chart) : 0;
  const min = chart.length > 0 ? Math.min(...chart) : 0;
  const range = max - min || 1; // Prevent division by zero

  return (
    <motion.div 
      className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white/50 truncate">{title}</span>
        <div className={`text-${color}/80 flex-shrink-0`}>{icon}</div>
      </div>
      <div className="text-xl sm:text-2xl font-semibold mb-1 truncate">{value}</div>
      {subValue && <div className="text-xs sm:text-sm text-white/50 mb-2 truncate">{subValue}</div>}
      
      {chart.length > 0 && (
        <div className="flex items-end gap-2 mb-2">
          <div className="flex-1 h-8 sm:h-12 flex items-end gap-1">
            {chart.map((value, index) => {
              const height = ((value - min) / range) * 100;
              return (
                <motion.div
                  key={index}
                  className={`flex-1 bg-${color}/20 rounded-sm`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(15, height)}%` }}
                  transition={{ delay: index * 0.1 }}
                />
              );
            })}
          </div>
          {change && (
            <div className={`text-sm ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {change}
            </div>
          )}
        </div>
      )}
      
      {description && <div className="text-sm text-white/50">{description}</div>}
    </motion.div>
  );
}; 