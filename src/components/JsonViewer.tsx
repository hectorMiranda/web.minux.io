'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Code, FileText } from 'lucide-react';

interface JsonViewerProps {
  content: string;
}

export function JsonViewer({ content }: JsonViewerProps) {
  const [isJsonView, setIsJsonView] = useState(false);

  // Safely stringify any value
  const safeStringify = useCallback((value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'function') {
      return `[Function: ${value.name || 'anonymous'}]`;
    }
    if (typeof value === 'symbol') {
      return value.toString();
    }
    if (typeof value === 'object') {
      if (value?.$$typeof === Symbol.for('react.element')) {
        return '[React Element]';
      }
      if (Array.isArray(value)) {
        return `[${value.map(v => safeStringify(v)).join(', ')}]`;
      }
      try {
        const obj: Record<string, string> = {};
        for (const [key, val] of Object.entries(value)) {
          if (key !== '_owner' && key !== '_store' && key !== 'ref' && key !== 'key') {
            obj[key] = safeStringify(val);
          }
        }
        return JSON.stringify(obj, null, 2);
      } catch (e) {
        return '[Object]';
      }
    }
    return String(value);
  }, []);

  const renderContent = useCallback((rawContent: any) => {
    // Ensure we're working with a string
    const contentStr = typeof rawContent === 'string' ? rawContent : safeStringify(rawContent);
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(contentStr);
      return {
        isValid: true,
        content: isJsonView ? safeStringify(parsed) : contentStr,
        type: 'json'
      };
    } catch (e) {
      // If it's not JSON, check if it contains React-specific content
      if (typeof contentStr === 'string' && 
          (contentStr.includes('useEffect') || 
           contentStr.includes('useState') || 
           contentStr.includes('React') || 
           contentStr.includes('function'))) {
        // For React content, we'll display it as a string representation
        return {
          isValid: false,
          content: typeof contentStr === 'function' ? '[Function]' : contentStr,
          type: 'react'
        };
      }
      // Otherwise treat as plain text
      return {
        isValid: false,
        content: contentStr,
        type: 'text'
      };
    }
  }, [isJsonView, safeStringify]);

  const { isValid, content: displayContent, type } = renderContent(content);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {type === 'json' ? (
            <Code className="w-4 h-4 text-green-400" />
          ) : type === 'react' ? (
            <Code className="w-4 h-4 text-yellow-400" />
          ) : (
            <FileText className="w-4 h-4 text-blue-400" />
          )}
          <span className={`text-xs ${
            type === 'json' ? 'text-green-400' : 
            type === 'react' ? 'text-yellow-400' : 
            'text-blue-400'
          }`}>
            {type === 'json' ? 'JSON' : 
             type === 'react' ? 'React Content' : 
             'Plain Text'}
          </span>
        </div>
        {type === 'json' && (
          <button
            onClick={() => setIsJsonView(!isJsonView)}
            className="text-xs bg-primary/20 hover:bg-primary/30 text-primary px-2 py-1 rounded"
          >
            {isJsonView ? 'Raw' : 'Formatted'}
          </button>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-black/30 rounded p-3 font-mono text-sm overflow-x-auto"
      >
        <pre className="whitespace-pre-wrap break-all">
          {typeof displayContent === 'function' ? '[Function]' : displayContent}
        </pre>
      </motion.div>
    </div>
  );
} 