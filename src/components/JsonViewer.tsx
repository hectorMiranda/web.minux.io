'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface JsonViewerProps {
  content: string;
}

type JsonValue = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export function JsonViewer({ content }: JsonViewerProps) {
  const [isJsonView, setIsJsonView] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['root']));

  const isJsonContent = useCallback(() => {
    try {
      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  }, [content]);

  const togglePath = (path: string) => {
    setExpandedPaths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderJsonValue = (value: JsonValue, path: string = 'root', level: number = 0): React.ReactNode => {
    const indent = '  '.repeat(level);
    const isExpanded = expandedPaths.has(path);

    if (Array.isArray(value)) {
      const items = value.map((item, index) => {
        const itemPath = `${path}.${index}`;
        return renderJsonValue(item, itemPath, level + 1);
      });

      return (
        <div className="ml-4">
          <span 
            className="cursor-pointer hover:text-primary-600"
            onClick={() => togglePath(path)}
          >
            {isExpanded ? '▼' : '▶'} [
          </span>
          {isExpanded && (
            <>
              {items}
              <div>{indent}]</div>
            </>
          )}
          {!isExpanded && <span>...]</span>}
        </div>
      );
    } else if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      return (
        <div className="ml-4">
          <span 
            className="cursor-pointer hover:text-primary-600"
            onClick={() => togglePath(path)}
          >
            {isExpanded ? '▼' : '▶'} {'{'}
          </span>
          {isExpanded && (
            <>
              {entries.map(([key, val]) => (
                <div key={key}>
                  {indent}  "{key}": {renderJsonValue(val, `${path}.${key}`, level + 1)}
                </div>
              ))}
              <div>{indent}{'}'}</div>
            </>
          )}
          {!isExpanded && <span>{'...'}</span>}
        </div>
      );
    }

    return (
      <span className={typeof value === 'string' ? 'text-green-400' : 'text-blue-400'}>
        {typeof value === 'string' ? `"${value}"` : String(value)}
      </span>
    );
  };

  if (!isJsonContent()) {
    return (
      <div className="font-mono text-sm whitespace-pre-wrap break-all">
        {content}
      </div>
    );
  }

  return (
    <div className="relative font-mono text-sm">
      <button
        onClick={() => setIsJsonView(!isJsonView)}
        className="absolute top-2 right-2 px-2 py-1 text-xs bg-primary/20 hover:bg-primary/30 text-primary rounded transition-colors duration-200"
      >
        {isJsonView ? 'Raw' : 'JSON'}
      </button>
      <AnimatePresence mode="wait">
        {isJsonView ? (
          <motion.div
            key="json"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-10"
          >
            {renderJsonValue(JSON.parse(content))}
          </motion.div>
        ) : (
          <motion.div
            key="raw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="whitespace-pre-wrap break-all pt-10"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 