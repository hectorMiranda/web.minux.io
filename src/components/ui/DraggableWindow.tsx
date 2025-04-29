'use client';

import { useEffect, useRef, useState } from 'react';

interface DraggableWindowProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  onClose?: () => void;
  onMinimize?: (position: { x: number; y: number }) => void;
  className?: string;
  type?: string;
}

export function DraggableWindow({
  title,
  children,
  defaultPosition = { x: 100, y: 100 },
  onClose,
  onMinimize,
  className = '',
  type,
}: DraggableWindowProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize(position);
    }
  };

  return (
    <div
      ref={windowRef}
      className={`fixed bg-[#1e293b] border border-[#334155] rounded-lg shadow-lg ${className}`}
      style={{
        left: position.x,
        top: position.y,
        minWidth: '250px',
        zIndex: 1000
      }}
      data-window-type={type}
    >
      <div 
        className="flex items-center justify-between px-4 py-2 bg-[#334155] rounded-t-lg cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-white/90 font-medium">{title}</h3>
        <div className="flex items-center gap-2">
          {onMinimize && (
            <button
              onClick={handleMinimize}
              className="text-white/70 hover:text-white/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="text-white/90">
        {children}
      </div>
    </div>
  );
} 