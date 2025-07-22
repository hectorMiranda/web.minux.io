'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConsolePage() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Initial welcome message
    setHistory([
      'Welcome to the Minux Console',
      'Type "help" for available commands',
      ''
    ]);
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    let response: string[] = [];
    const args = command.toLowerCase().trim().split(' ');
    const cmd = args[0];

    switch (cmd) {
      case 'help':
        response = [
          'Available commands:',
          '  help      - Show this help message',
          '  clear     - Clear the terminal',
          '  system    - Show system information',
          '  uptime    - Show system uptime',
          '  date      - Show current date and time',
          '  ls        - List directory contents',
          '  pwd       - Print working directory',
          '  settings  - Navigate to settings page',
          '  storage   - Storage management commands',
          '    storage list     - List all storage items',
          '    storage get      - Get a storage item value',
          '    storage set      - Set a storage item value',
          '    storage remove   - Remove a storage item',
          '    storage clear    - Clear all storage items',
          '    storage viewer   - Open storage management interface',
          ''
        ];
        break;
      case 'storage':
        if (args.length < 2) {
          response = ['Usage: storage [list|get|set|remove|clear|viewer] [key] [value]', ''];
          break;
        }

        const subCommand = args[1];
        switch (subCommand) {
          case 'viewer':
            response = ['Opening storage management interface...', ''];
            setHistory(prev => [
              ...prev,
              `pi@minux:~$ ${command}`,
              ...response
            ]);
            setCommand('');
            router.push('/storage');
            return;

          case 'list':
            try {
              const items = Object.entries(localStorage).map(([key, value]) => ({
                key,
                size: new Blob([value]).size
              }));
              if (items.length === 0) {
                response = ['No items in storage', ''];
              } else {
                response = [
                  'Storage items:',
                  ...items.map(item => `  ${item.key} (${item.size} bytes)`),
                  '',
                  `Total items: ${items.length}`,
                  ''
                ];
              }
            } catch (err) {
              console.error('Storage error:', err);
              response = ['Error accessing storage', ''];
            }
            break;

          case 'get':
            if (args.length < 3) {
              response = ['Usage: storage get <key>', ''];
              break;
            }
            const key = args[2];
            const value = localStorage.getItem(key);
            if (value === null) {
              response = [`Item "${key}" not found`, ''];
            } else {
              try {
                // Try to parse as JSON for better formatting
                const parsed = JSON.parse(value);
                response = [
                  `Value of "${key}":`,
                  JSON.stringify(parsed, null, 2),
                  ''
                ];
              } catch {
                // If not JSON, show as is
                response = [
                  `Value of "${key}":`,
                  value,
                  ''
                ];
              }
            }
            break;

          case 'set':
            if (args.length < 4) {
              response = ['Usage: storage set <key> <value>', ''];
              break;
            }
            const setKey = args[2];
            const setValue = args.slice(3).join(' ');
            try {
              localStorage.setItem(setKey, setValue);
              response = [`Item "${setKey}" set successfully`, ''];
            } catch {
              response = ['Error setting storage item', ''];
            }
            break;

          case 'remove':
            if (args.length < 3) {
              response = ['Usage: storage remove <key>', ''];
              break;
            }
            const removeKey = args[2];
            if (localStorage.getItem(removeKey) === null) {
              response = [`Item "${removeKey}" not found`, ''];
            } else {
              localStorage.removeItem(removeKey);
              response = [`Item "${removeKey}" removed successfully`, ''];
            }
            break;

          case 'clear':
            try {
              localStorage.clear();
              response = ['All storage items cleared', ''];
            } catch {
              response = ['Error clearing storage', ''];
            }
            break;

          default:
            response = [
              'Invalid storage command. Available commands:',
              '  storage list     - List all storage items',
              '  storage get      - Get a storage item value',
              '  storage set      - Set a storage item value',
              '  storage remove   - Remove a storage item',
              '  storage clear    - Clear all storage items',
              '  storage viewer   - Open storage management interface',
              ''
            ];
        }
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
      case 'settings':
        response = ['Navigating to settings page...', ''];
        setHistory(prev => [
          ...prev,
          `pi@minux:~$ ${command}`,
          ...response
        ]);
        setCommand('');
        router.push('/settings');
        return;
      case 'midi':
        response = ['Opening MIDI controller...', ''];
        setHistory(prev => [
          ...prev,
          `pi@minux:~$ ${command}`,
          ...response
        ]);
        setCommand('');
        router.push('/midi');
        return;
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
    <div className="h-full w-full p-3 sm:p-4 lg:p-6">
      <motion.div 
        ref={terminalRef}
        className={`h-full w-full rounded-lg bg-[#0A192F] border border-white/10 overflow-hidden ${
          isFullscreen ? 'fixed inset-0 rounded-none z-50' : ''
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
            isFullscreen ? 'h-[calc(100vh-48px)]' : 'h-[calc(100%-48px)]'
          } overflow-auto scrollbar-hide`}
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