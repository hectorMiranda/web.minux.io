'use client';

import { Grid3X3, Box, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StorageToolbarProps {
  viewMode: 'classic' | '3d';
  onViewChange: (mode: 'classic' | '3d') => void;
  onAddItem: () => void;
}

export function StorageToolbar({ viewMode, onViewChange, onAddItem }: StorageToolbarProps) {
  return (
    <div className="flex items-center gap-1 bg-[#0A192F] rounded-lg border border-white/10 p-1">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 ${viewMode === 'classic' ? 'bg-primary/20 text-primary' : 'text-white/70'}`}
        onClick={() => onViewChange('classic')}
      >
        <Grid3X3 className="w-4 h-4" />
        <span>Classic</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 ${viewMode === '3d' ? 'bg-primary/20 text-primary' : 'text-white/70'}`}
        onClick={() => onViewChange('3d')}
      >
        <Box className="w-4 h-4" />
        <span>3D View</span>
      </Button>
      <div className="w-px h-6 bg-white/10" />
      <Button
        variant="ghost"
        size="sm"
        className="text-white/70 hover:text-primary hover:bg-primary/20"
        onClick={onAddItem}
      >
        <Plus className="w-4 h-4" />
        <span>Add Item</span>
      </Button>
    </div>
  );
} 