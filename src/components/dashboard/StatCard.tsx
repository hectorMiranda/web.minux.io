import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: ReactNode;
  color?: string;
}

export const StatCard = ({ title, value, subValue, icon, color = 'primary' }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-white/10"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className={`text-3xl font-bold mt-1 text-${color}`}>{value}</h3>
          {subValue && (
            <p className="text-gray-500 text-sm mt-1">{subValue}</p>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}; 