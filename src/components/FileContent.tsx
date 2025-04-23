'use client';

import React from 'react';
import { JsonViewer } from './JsonViewer';

interface FileContentProps {
  name: string;
  content: string;
  size: string;
}

export function FileContent({ name, content, size }: FileContentProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-primary font-mono">{name}</span>
          <span className="text-gray-500 text-sm">({size})</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-800 rounded">
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-800 rounded">
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="bg-black rounded border border-gray-800">
        <JsonViewer content={content} />
      </div>
    </div>
  );
} 