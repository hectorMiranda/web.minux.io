'use client';

import { useState, useEffect } from 'react';
import { Sliders, Terminal, Piano } from 'lucide-react';

interface MinimizedIconProps {
  title: string;
  type: 'settings' | 'debug' | 'keyboard';
  position: { x: number; y: number };
  onRestore: () => void;
}

export function MinimizedIcon({ title, type, position, onRestore }: MinimizedIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState(position);

  const getIcon = () => {
    switch (type) {
      case 'settings':
        return <Sliders className="w-6 h-6 text-[#00ff88]" />;
      case 'debug':
        return <Terminal className="w-6 h-6 text-[#00ff88]" />;
      case 'keyboard':
        return <Piano className="w-6 h-6 text-[#00ff88]" />;
    }
  };

  return (
    <div
      className={`
        absolute cursor-pointer group
        ${isDragging ? 'z-50' : 'z-10'}
      `}
      style={{
        left: pos.x,
        top: pos.y,
      }}
      onDoubleClick={onRestore}
    >
      <div className="flex flex-col items-center gap-1">
        <div className="w-16 h-16 bg-[#112240] rounded-lg border border-white/10 flex items-center justify-center hover:bg-[#1a2942] transition-colors">
          {getIcon()}
        </div>
        <div className="text-xs text-white/70 text-center px-1 py-0.5 bg-[#112240]/80 rounded whitespace-nowrap">
          {title}
        </div>
      </div>
    </div>
  );
} 