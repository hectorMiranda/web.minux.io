'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ChevronRight } from 'lucide-react';

interface CommandOutput {
  command: string;
  output?: string;
  isError?: boolean;
}

export function TerminalDemo() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && command.trim()) {
      const newCommand: CommandOutput = { command: command.trim() };
      
      if (command.startsWith('minux:/')) {
        const args = command.split(' ');
        if (args[1] === 'crypto' && args[2] === 'hash') {
          const text = args.slice(3).join(' ');
          const hash = Array.from(text)
            .reduce((acc, char) => acc + char.charCodeAt(0), 0)
            .toString(16);
          newCommand.output = `Hash: 0x${hash}`;
        } else {
          newCommand.output = 'Unknown command';
          newCommand.isError = true;
        }
      } else {
        newCommand.output = 'Command must start with minux:/';
        newCommand.isError = true;
      }
      
      setHistory(prev => [...prev, newCommand]);
      setCommand('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto bg-black/80 backdrop-blur-xl rounded-lg border border-gray-800 overflow-hidden shadow-2xl"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-black/50">
        <Terminal className="w-4 h-4 text-primary" />
        <span className="font-mono text-sm text-gray-400">minux-shell</span>
      </div>
      
      <div className="p-4 space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto">
        {history.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 font-mono text-sm mb-1">
              <ChevronRight className="w-4 h-4 text-primary" />
              <span>{entry.command}</span>
            </div>
            {entry.output && (
              <div className={`pl-6 font-mono text-sm ${entry.isError ? 'text-red-400' : 'text-gray-400'}`}>
                {entry.output}
              </div>
            )}
          </motion.div>
        ))}
        
        <div className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-primary" />
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleCommand}
            placeholder="Try: minux:/ crypto hash hello"
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-gray-300 placeholder-gray-600"
            spellCheck={false}
          />
        </div>
      </div>
    </motion.div>
  );
} 