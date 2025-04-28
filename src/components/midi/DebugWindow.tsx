'use client';

import { useEffect, useState } from 'react';
import { DraggableWindow } from '@/components/ui/DraggableWindow';
import { DebugConsole } from '@/components/midi/DebugConsole';
import type { DebugMessage } from '@/components/midi/types';

interface DebugWindowProps {
  messages: DebugMessage[];
  onClose: () => void;
  onMinimize?: (position: { x: number; y: number }) => void;
}

export const DebugWindow = ({ messages, onClose, onMinimize }: DebugWindowProps) => {
  const [defaultX, setDefaultX] = useState(20);

  useEffect(() => {
    setDefaultX(window.innerWidth - 420);
  }, []);

  return (
    <DraggableWindow
      title="Debug Console"
      defaultPosition={{ x: defaultX, y: 60 }}
      onClose={onClose}
      onMinimize={onMinimize}
      type="debug"
    >
      <div className="h-64">
        <DebugConsole messages={messages} />
      </div>
    </DraggableWindow>
  );
}; 