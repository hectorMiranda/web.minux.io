'use client';

import { Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface MinuxLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const MinuxLogo = ({ size = 'md', showText = false }: MinuxLogoProps) => {
  const sizes = {
    sm: {
      container: 'w-6 h-6',
      icon: 'w-3 h-3',
      text: 'text-sm'
    },
    md: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-base'
    },
    lg: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      text: 'text-lg'
    }
  };

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        initial="initial"
        animate="animate"
      >
        <div className={`relative flex items-center justify-center ${sizes[size].container} rounded-lg bg-[#1A1A1A] border border-primary/20 overflow-hidden`}>
          {/* Background Animation */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          
          {/* Main Icon */}
          <motion.div
            className="relative z-10"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Terminal className={`${sizes[size].icon} text-primary`} />
          </motion.div>
        </div>
      </motion.div>

      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span 
            className={`font-bold ${sizes[size].text} bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_100%]`}
            style={{
              animation: 'gradient-x 3s linear infinite',
            }}
          >
            Minux
          </span>
          <span className="text-xs text-white/50">
            Pi Control
          </span>
        </motion.div>
      )}
    </div>
  );
}; 