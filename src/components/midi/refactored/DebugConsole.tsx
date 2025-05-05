import React, { useRef, useEffect } from 'react';
import { DebugMessage } from './types';
import { Trash2, Download } from 'lucide-react';

interface DebugConsoleProps {
  messages: DebugMessage[];
  onClear: () => void;
}

export function DebugConsole({ messages, onClear }: DebugConsoleProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Export logs to file
  const handleExportLogs = () => {
    const logContent = messages.map(msg => 
      `[${msg.timestamp.toISOString()}] [${msg.type.toUpperCase()}] ${msg.message}`
    ).join('\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `midi-debug-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-[500px] h-[400px] flex flex-col">
      <div className="bg-[#1e1e1e] p-2 flex justify-between items-center border-b border-white/10">
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="p-1.5 rounded text-white/70 hover:bg-white/5 hover:text-white transition-all"
            title="Clear Console"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={handleExportLogs}
            className="p-1.5 rounded text-white/70 hover:bg-white/5 hover:text-white transition-all"
            title="Export Logs"
          >
            <Download size={16} />
          </button>
        </div>
        <div className="text-white/50 text-xs">
          {messages.length} messages
        </div>
      </div>
      
      <div className="flex-1 bg-[#1e1e1e] overflow-y-auto p-2 text-sm font-mono">
        {messages.length === 0 ? (
          <div className="text-white/40 h-full flex items-center justify-center">
            No messages to display
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="py-1 border-b border-white/5 last:border-b-0">
              <div className="flex items-start">
                <span className="text-white/40 mr-2 text-xs">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
                <span className={`mr-2 text-xs px-1.5 py-0.5 rounded ${
                  msg.type === 'error' ? 'bg-red-900/30 text-red-400' :
                  msg.type === 'midi' ? 'bg-blue-900/30 text-blue-400' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {msg.type.toUpperCase()}
                </span>
                <span className={`flex-1 ${
                  msg.type === 'error' ? 'text-red-400' :
                  msg.type === 'midi' ? 'text-blue-400' :
                  'text-white/80'
                }`}>
                  {msg.message}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default DebugConsole;
