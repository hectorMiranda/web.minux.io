'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Save, X, Plus } from 'lucide-react';

interface StorageItem {
  key: string;
  value: string;
  size: number;
}

export const LocalStorageExplorer = () => {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    refreshItems();
  }, []);

  const refreshItems = () => {
    const storageItems: StorageItem[] = [];
    let total = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        const size = new Blob([value]).size;
        storageItems.push({ key, value, size });
        total += size;
      }
    }

    setItems(storageItems);
    setTotalSize(total);
  };

  const handleDelete = (key: string) => {
    localStorage.removeItem(key);
    refreshItems();
  };

  const handleEdit = (item: StorageItem) => {
    setEditingKey(item.key);
    setEditValue(item.value);
  };

  const handleSave = () => {
    if (editingKey) {
      localStorage.setItem(editingKey, editValue);
      setEditingKey(null);
      refreshItems();
    }
  };

  const handleAdd = () => {
    if (newKey && newValue) {
      localStorage.setItem(newKey, newValue);
      setNewKey('');
      setNewValue('');
      setIsAdding(false);
      refreshItems();
    }
  };

  return (
    <div className="p-6 bg-[#0A192F] rounded-lg border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Local Storage Explorer</h2>
          <p className="text-sm text-white/50">
            Total Size: {(totalSize / 1024).toFixed(2)} KB
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 bg-white/5 rounded-lg">
          <div className="flex gap-4 mb-2">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Key"
              className="flex-1 px-3 py-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Value"
              className="flex-1 px-3 py-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.key}
            className="p-4 bg-white/5 rounded-lg"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="font-medium mb-1">{item.key}</div>
                {editingKey === item.key ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full h-24 px-3 py-2 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:border-primary"
                  />
                ) : (
                  <div className="text-sm text-white/70 break-all">
                    {item.value}
                  </div>
                )}
                <div className="text-xs text-white/50 mt-2">
                  Size: {(item.size / 1024).toFixed(2)} KB
                </div>
              </div>
              <div className="flex gap-2">
                {editingKey === item.key ? (
                  <>
                    <button
                      onClick={() => setEditingKey(null)}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSave}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors text-primary"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.key)}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 