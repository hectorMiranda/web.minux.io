'use client';

import React from 'react';
import { FileContent } from '@/components/FileContent';

export default function StoragePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Storage Management</h1>
        <p className="text-gray-400">Manage local storage data and monitor storage usage.</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-primary">Local Storage Explorer</h2>
          <button className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded transition-colors duration-200 flex items-center space-x-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-4">
          {typeof window !== 'undefined' && Object.entries(localStorage).map(([key, value]) => (
            <FileContent
              key={key}
              name={key}
              content={value}
              size={`${new Blob([value]).size} B`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 