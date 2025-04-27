'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Code, FileText } from 'lucide-react';

interface JsonViewerProps {
  content: string;
}

export function JsonViewer({ content }: JsonViewerProps) {
  const [isJsonView, setIsJsonView] = useState(true);

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
      try {
        // First try to parse if it's a JSON string
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            return JSON.stringify(parsed, null, 2);
          } catch {
            // If parsing fails, treat as regular string
            return value;
          }
        }
        
        // Handle regular objects
        if (value?.$$typeof === Symbol.for('react.element')) {
          return '[React Element]';
        }
        if (Array.isArray(value)) {
          return `[${value.map(v => safeStringify(v)).join(', ')}]`;
        }
        
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
    try {
      // Try to parse as JSON first
      let parsed;
      let contentStr = typeof rawContent === 'string' ? rawContent : safeStringify(rawContent);
      
      try {
        parsed = JSON.parse(contentStr);
        return {
          isValid: true,
          content: isJsonView ? JSON.stringify(parsed, null, 2) : contentStr,
          type: 'json'
        };
      } catch {
        // If it's not valid JSON, try to parse it as a string that contains escaped JSON
        try {
          // Remove escaped quotes and try parsing again
          const unescaped = contentStr.replace(/\\"/g, '"');
          parsed = JSON.parse(unescaped);
          return {
            isValid: true,
            content: isJsonView ? JSON.stringify(parsed, null, 2) : contentStr,
            type: 'json'
          };
        } catch {
          // If both attempts fail, handle as non-JSON content
          if (contentStr.includes('useEffect') || 
              contentStr.includes('useState') || 
              contentStr.includes('React') || 
              contentStr.includes('function')) {
            return {
              isValid: false,
              content: typeof contentStr === 'function' ? '[Function]' : contentStr,
              type: 'react'
            };
          }
          return {
            isValid: false,
            content: contentStr,
            type: 'text'
          };
        }
      }
    } catch (e) {
      return {
        isValid: false,
        content: String(rawContent),
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