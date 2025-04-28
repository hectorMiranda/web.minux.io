'use client';

import { useState, useRef, ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, X, Maximize2, Minimize2 } from 'lucide-react';

interface DraggableWindowProps {
  title: string;
  children: ReactNode;
  defaultPosition?: { x: number; y: number };
  onClose?: () => void;
  onMinimize?: (position: { x: number; y: number }) => void;
  type: 'settings' | 'debug' | 'keyboard';
}

export function DraggableWindow({ 
  title, 
  children, 
  defaultPosition = { x: 20, y: 20 },
  onClose,
  onMinimize,
  type
}: DraggableWindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [isMaximized, setIsMaximized] = useState(false);
  const [bounds, setBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateBounds = () => {
      if (typeof window !== 'undefined') {
        setBounds({
          left: 0,
          top: 0,
          right: window.innerWidth - (windowRef.current?.offsetWidth || 0),
          bottom: window.innerHeight - (windowRef.current?.offsetHeight || 0)
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize(position);
    }
  };

  return (
    <motion.div
      ref={windowRef}
      drag={!isMaximized}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={bounds}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        setPosition({ x: info.point.x, y: info.point.y });
      }}
      initial={position}
      animate={isMaximized ? {
        x: 0,
        y: 0,
        width: '100%',
        height: '100%'
      } : {
        x: position.x,
        y: position.y
      }}
      style={{
        position: 'absolute',
        zIndex: isDragging ? 50 : 10,
      }}
      className={`
        bg-[#112240]/90 backdrop-blur-sm rounded-lg border border-white/10
        ${isMaximized ? 'w-full h-full' : 'w-96'}
      `}
    >
      {/* Window Title Bar */}
      <div 
        className="h-8 bg-[#1a2942] rounded-t-lg border-b border-white/10 flex items-center justify-between px-3 cursor-move"
      >
        <span className="text-sm font-medium text-white/70">{title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMinimize}
            className="p-1 hover:bg-white/10 rounded"
          >
            <Minus className="w-3 h-3 text-white/70" />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:bg-white/10 rounded"
          >
            {isMaximized ? (
              <Minimize2 className="w-3 h-3 text-white/70" />
            ) : (
              <Maximize2 className="w-3 h-3 text-white/70" />
            )}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-500/20 rounded group"
            >
              <X className="w-3 h-3 text-white/70 group-hover:text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Window Content */}
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
} 