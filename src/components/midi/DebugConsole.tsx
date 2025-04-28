'use client';

import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { DebugMessage } from './types';

interface DebugConsoleProps {
  messages: DebugMessage[];
}

export function DebugConsole({ messages }: DebugConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0a192f]/90">
      <div 
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs scrollbar-thin scrollbar-thumb-[#00ff88]/20 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="text-white/30 italic p-2">Waiting for MIDI events...</div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`p-2 rounded ${
                msg.type === 'error' ? 'bg-red-900/20 text-red-400' :
                msg.type === 'midi' ? 'bg-[#00ff88]/10 text-[#00ff88]' :
                'bg-white/5 text-white/70'
              }`}
            >
              <span className="text-white/50 mr-2">
                {msg.timestamp.toLocaleTimeString()}
              </span>
              {msg.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DebugConsole; 