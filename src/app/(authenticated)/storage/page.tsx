'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileContent } from '@/components/FileContent';
import { FSNViewer } from '@/components/FSNViewer';
import { View, ViewIcon } from 'lucide-react';

export default function StoragePage() {
  const [is3DView, setIs3DView] = useState(false);
  const [storageItems, setStorageItems] = useState<Array<{name: string; content: string; size: string}>>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const items = Object.entries(localStorage).map(([key, value]) => ({
        name: key,
        content: value,
        size: `${new Blob([value]).size}`
      }));
      setStorageItems(items);
    }
  }, []);

  const handleDeleteItem = useCallback((itemName: string) => {
    localStorage.removeItem(itemName);
    setStorageItems(prev => prev.filter(item => item.name !== itemName));
  }, []);

  const handleUpdateItem = useCallback((itemName: string, newContent: string) => {
    localStorage.setItem(itemName, newContent);
    setStorageItems(prev => prev.map(item => 
      item.name === itemName 
        ? { ...item, content: newContent, size: `${new Blob([newContent]).size}` }
        : item
    ));
  }, []);

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">Storage Management</h1>
            <p className="text-gray-400">Manage local storage data and monitor storage usage.</p>
          </div>
          <button
            onClick={() => setIs3DView(!is3DView)}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            {is3DView ? <View className="w-4 h-4" /> : <ViewIcon className="w-4 h-4" />}
            {is3DView ? 'Classic View' : '3D View'}
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-primary">Local Storage Explorer</h2>
          <button className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded transition-colors duration-200 flex items-center space-x-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Item</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {is3DView ? (
            <div className="w-[80%] h-[80vh] mx-auto">
              <FSNViewer 
                items={storageItems} 
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {storageItems.map((item) => (
                <FileContent
                  key={item.name}
                  name={item.name}
                  content={item.content}
                  size={item.size}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 