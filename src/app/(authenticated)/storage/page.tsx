'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileContent } from '@/components/FileContent';
import { FSNViewer } from '@/components/FSNViewer';
import { X, Plus } from 'lucide-react';
import { StorageToolbar } from './components/StorageToolbar';

interface StorageItem {
  name: string;
  content: string;
  size: string;
  position?: { x: number; y: number };
}

interface AddItemModalProps {
  onClose: () => void;
  onAdd: (key: string, value: string) => void;
}

function AddItemModal({ onClose, onAdd }: AddItemModalProps) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError('Key is required');
      return;
    }
    if (localStorage.getItem(key) !== null) {
      setError('Key already exists');
      return;
    }
    onAdd(key, value);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0a192f] rounded-lg border border-primary/20 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20">
          <h3 className="text-lg font-medium text-primary">Add Storage Item</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Key</label>
            <input
              type="text"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError('');
              }}
              className="w-full bg-black/30 border border-primary/20 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
              placeholder="Enter storage key"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Value</label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={5}
              className="w-full bg-black/30 border border-primary/20 rounded px-3 py-2 text-white focus:outline-none focus:border-primary font-mono"
              placeholder="Enter storage value (JSON or plain text)"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-black rounded hover:bg-primary/90 transition-colors"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StoragePage() {
  const [viewMode, setViewMode] = useState<'classic' | '3d'>('classic');
  const [showAddModal, setShowAddModal] = useState(false);
  const [storageItems, setStorageItems] = useState<StorageItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const itemPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const sourcePositionRef = useRef<{ x: number; y: number } | undefined>(undefined);

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
    itemPositionsRef.current.delete(itemName);
  }, []);

  const handleUpdateItem = useCallback((itemName: string, newContent: string) => {
    localStorage.setItem(itemName, newContent);
    setStorageItems(prev => prev.map(item => 
      item.name === itemName 
        ? { ...item, content: newContent, size: `${new Blob([newContent]).size}` }
        : item
    ));
  }, []);

  const handleAddItem = useCallback((key: string, value: string) => {
    localStorage.setItem(key, value);
    setStorageItems(prev => [...prev, {
      name: key,
      content: value,
      size: `${new Blob([value]).size}`
    }]);
  }, []);

  const handleItemClick = useCallback((item: StorageItem, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    sourcePositionRef.current = {
      x: rect.left,
      y: rect.top
    };
    setSelectedItem(item.name);
  }, []);

  const handlePanelClose = useCallback((itemName: string) => {
    setSelectedItem(null);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">Storage Management</h1>
            <p className="text-gray-400">Manage local storage data and monitor storage usage.</p>
          </div>
          <StorageToolbar 
            viewMode={viewMode}
            onViewChange={setViewMode}
            onAddItem={() => setShowAddModal(true)}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {viewMode === '3d' ? (
            <div className="w-full h-[80vh]">
              <FSNViewer 
                items={storageItems} 
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {storageItems.map((item) => (
                  <motion.div
                    key={item.name}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onClick={(e) => handleItemClick(item, e)}
                    className="cursor-pointer"
                  >
                    <FileContent
                      name={item.name}
                      content={item.content}
                      size={item.size}
                      onDelete={handleDeleteItem}
                      onUpdate={handleUpdateItem}
                      position={itemPositionsRef.current.get(item.name)}
                      sourcePosition={sourcePositionRef.current}
                      onClose={() => handlePanelClose(item.name)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AddItemModal
              onClose={() => setShowAddModal(false)}
              onAdd={handleAddItem}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 