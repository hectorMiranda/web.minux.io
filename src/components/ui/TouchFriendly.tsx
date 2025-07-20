'use client';

import { ReactNode, TouchEvent, MouseEvent } from 'react';
import { motion } from 'framer-motion';

interface TouchFriendlyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const TouchFriendlyButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
  ariaLabel,
  variant = 'primary'
}: TouchFriendlyButtonProps) => {
  const baseClasses = `
    min-h-[44px] min-w-[44px] 
    inline-flex items-center justify-center 
    relative overflow-hidden 
    rounded-xl font-medium 
    transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-950
    active:scale-95
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-blue-600 
      text-white 
      hover:from-cyan-400 hover:to-blue-500 
      shadow-lg shadow-cyan-500/25
      hover:shadow-cyan-500/40
    `,
    secondary: `
      bg-gradient-to-r from-slate-800/50 to-slate-700/50 
      text-slate-300 
      hover:from-cyan-500/10 hover:to-blue-500/10
      border border-slate-700/50 hover:border-cyan-500/30
      hover:text-white
    `,
    ghost: `
      bg-transparent 
      text-slate-400 
      hover:bg-slate-800/50 
      hover:text-cyan-400
    `
  };

  const handleInteraction = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled && onClick) {
      // Add haptic feedback on mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
      onClick();
    }
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={handleInteraction}
      onTouchEnd={handleInteraction}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <span className="relative z-10">
        {children}
      </span>
      
      {/* Ripple effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    </motion.button>
  );
};

interface TouchFriendlyCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const TouchFriendlyCard = ({
  children,
  onClick,
  className = '',
  disabled = false
}: TouchFriendlyCardProps) => {
  const handleInteraction = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    
    if (!disabled && onClick) {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
      onClick();
    }
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl 
        bg-gradient-to-br from-slate-800/50 to-slate-900/50 
        border border-slate-700/50 
        backdrop-blur-sm
        ${onClick ? 'cursor-pointer hover:border-cyan-500/30' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick ? handleInteraction : undefined}
      onTouchEnd={onClick ? handleInteraction : undefined}
      whileHover={onClick && !disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick && !disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
      
      {/* Glow effect */}
      {onClick && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.div>
  );
};
