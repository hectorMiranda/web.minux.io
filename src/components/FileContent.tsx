'use client';

import React, { useState, useRef } from 'react';
import { JsonViewer } from './JsonViewer';
import { Trash2, Database } from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';

interface FileContentProps {
  name: string;
  content: string;
  size: string;
  onDelete?: (name: string) => void;
  onUpdate?: (name: string, newContent: string) => void;
  position?: { x: number; y: number };
  onClose?: () => void;
  sourcePosition?: { x: number; y: number };
}

export function FileContent({ 
  name, 
  content, 
  size, 
  onDelete,
  onUpdate,
  position,
  onClose,
  sourcePosition 
}: FileContentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos] = useState(position || { x: 0, y: 0 });
  const constraintsRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMarquee, setIsMarquee] = useState(false);
  const nameRef = useRef<HTMLDivElement>(null);

  // Check if text needs marquee
  React.useEffect(() => {
    if (nameRef.current) {
      setIsMarquee(nameRef.current.scrollWidth > nameRef.current.clientWidth);
    }
  }, [name]);

  return (
    <motion.div
      ref={constraintsRef}
      className="relative"
      initial={sourcePosition ? {
        x: sourcePosition.x,
        y: sourcePosition.y,
        opacity: 0,
        scale: 0.8
      } : {
        opacity: 0,
        scale: 0.8
      }}
      animate={{
        x: pos.x,
        y: pos.y,
        opacity: 1,
        scale: 1
      }}
      exit={sourcePosition ? {
        x: sourcePosition.x,
        y: sourcePosition.y,
        opacity: 0,
        scale: 0.8
      } : {
        opacity: 0,
        scale: 0.8
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="bg-[#0a192f] rounded-lg border border-primary/20 overflow-hidden shadow-lg"
        style={{ width: isDragging ? 'auto' : '100%' }}
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        dragElastic={0.1}
      >
        <div 
          className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/20 cursor-move"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Database className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div 
                ref={nameRef}
                className={`text-primary font-mono max-w-[200px] truncate ${
                  isMarquee && isHovered ? 'animate-marquee' : ''
                }`}
                title={name}
              >
                {name}
              </div>
              <div className="text-xs text-gray-400">{size} bytes</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={() => onDelete(name)}
                className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="p-4">
          <JsonViewer content={content} />
        </div>
      </motion.div>
    </motion.div>
  );
} 