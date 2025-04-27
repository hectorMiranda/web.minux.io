'use client';

import React from 'react';
import { JsonViewer } from './JsonViewer';
import { Trash2, Database } from 'lucide-react';

interface FileContentProps {
  name: string;
  content: string;
  size: string;
  onDelete?: (name: string) => void;
}

export function FileContent({ name, content, size, onDelete }: FileContentProps) {
  return (
    <div className="bg-[#0a192f] rounded-lg border border-primary/20 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Database className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-primary font-mono">{name}</div>
            <div className="text-xs text-gray-400">{size} bytes</div>
          </div>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(name)}
            className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="p-4">
        <JsonViewer content={content} />
      </div>
    </div>
  );
} 