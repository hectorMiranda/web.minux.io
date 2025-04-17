'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react';

export default function ConsolePage() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    setHistory([
      'Welcome to Minux Console',
      'Type "help" for available commands',
      ''
    ]);
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    let response: string[] = [];
    const cmd = command.toLowerCase().trim();

    switch (cmd) {
      case 'help':
        response = [
          'Available commands:',
          '  help     - Show this help message',
          '  clear    - Clear the terminal',
          '  system   - Show system information',
          '  uptime   - Show system uptime',
          '  date     - Show current date and time',
          '  ls       - List directory contents',
          '  pwd      - Print working directory',
          ''
        ];
        break;
      case 'clear':
        setHistory([]);
        setCommand('');
        return;
      case 'system':
        response = [
          'System Information:',
          '  OS: Raspberry Pi OS',
          '  Kernel: 5.15.0-v8+',
          '  Architecture: arm64',
          '  Memory: 4GB',
          ''
        ];
        break;
      case 'uptime':
        response = ['System uptime: 5 days, 3 hours, 45 minutes', ''];
        break;
      case 'date':
        response = [new Date().toLocaleString(), ''];
        break;
      case 'ls':
        response = [
          'bin/  etc/  home/  lib/  media/',
          'mnt/  opt/  root/  sbin/  usr/',
          ''
        ];
        break;
      case 'pwd':
        response = ['/home/pi', ''];
        break;
      default:
        response = [`Command not found: ${command}`, ''];
    }

    setHistory(prev => [
      ...prev,
      `pi@minux:~$ ${command}`,
      ...response
    ]);
    setCommand('');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      terminalRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="p-6">
      <motion.div 
        ref={terminalRef}
        className={`rounded-xl bg-[#0A192F] border border-white/10 overflow-hidden ${
          isFullscreen ? 'fixed inset-0 rounded-none' : ''
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/5">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setHistory([])}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div 
          className={`font-mono text-sm p-4 space-y-1 ${
            isFullscreen ? 'h-[calc(100vh-48px)]' : 'h-[600px]'
          } overflow-auto`}
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">{line}</div>
          ))}
          <form onSubmit={handleCommand} className="flex items-center">
            <span className="text-primary">pi@minux:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-2"
              autoFocus
            />
          </form>
        </div>
      </motion.div>
    </div>
  );
} 