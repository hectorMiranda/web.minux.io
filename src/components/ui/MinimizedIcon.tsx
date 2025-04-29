'use client';

import React from 'react';

interface MinimizedIconProps {
  icon: React.ReactNode;
  onClick: () => void;
  position: { x: number; y: number };
  title: string;
  className?: string;
}

export const MinimizedIcon: React.FC<MinimizedIconProps> = ({
  icon,
  onClick,
  title,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 bg-[#1e293b] border border-[#334155] rounded-lg cursor-pointer hover:bg-[#334155] ${className}`}
      onClick={onClick}
    >
      {icon}
      <span className="text-white/90">{title}</span>
    </div>
  );
};

export default MinimizedIcon; 