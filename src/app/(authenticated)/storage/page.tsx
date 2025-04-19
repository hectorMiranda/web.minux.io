'use client';

import { LocalStorageExplorer } from '@/components/storage/LocalStorageExplorer';

export default function StoragePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Storage Management</h1>
        <p className="text-white/50">
          Manage local storage data and monitor storage usage.
        </p>
      </div>

      <div className="grid gap-6">
        <LocalStorageExplorer />
      </div>
    </div>
  );
} 