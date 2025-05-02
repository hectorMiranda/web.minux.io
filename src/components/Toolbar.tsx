'use client';

import React, { useEffect } from 'react';
import { 
  Box,
  Grid,
  Layers,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BoxSelect,
  Package
} from 'lucide-react';

interface ToolbarProps {
  viewMode: 'solid' | 'wireframe' | 'realistic' | 'xray';
  setViewMode: (mode: 'solid' | 'wireframe' | 'realistic' | 'xray') => void;
  currentView: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'iso';
  setCurrentView: (view: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'iso') => void;
}

export default function Toolbar({ 
  viewMode, 
  setViewMode, 
  currentView, 
  setCurrentView 
}: ToolbarProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      switch(e.key.toLowerCase()) {
        case '1': setViewMode('solid'); break;
        case '2': setViewMode('wireframe'); break;
        case '3': setViewMode('realistic'); break;
        case '4': setViewMode('xray'); break;
        case 'f': setCurrentView('front'); break;
        case 'b': setCurrentView('back'); break;
        case 'l': setCurrentView('left'); break;
        case 'r': setCurrentView('right'); break;
        case 't': setCurrentView('top'); break;
        case 'd': setCurrentView('bottom'); break;
        case 'i': setCurrentView('iso'); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setViewMode, setCurrentView]);

  const viewButtons = [
    { mode: 'solid', icon: Box, shortcut: '1', label: 'Solid View' },
    { mode: 'wireframe', icon: Grid, shortcut: '2', label: 'Wireframe View' },
    { mode: 'realistic', icon: Layers, shortcut: '3', label: 'Realistic View' },
    { mode: 'xray', icon: Eye, shortcut: '4', label: 'X-Ray View' },
  ] as const;

  const viewDirections = [
    { view: 'front', icon: ChevronUp, shortcut: 'F', label: 'Front View', rotate: '' },
    { view: 'back', icon: ChevronDown, shortcut: 'B', label: 'Back View', rotate: '' },
    { view: 'left', icon: ChevronLeft, shortcut: 'L', label: 'Left View', rotate: '' },
    { view: 'right', icon: ChevronRight, shortcut: 'R', label: 'Right View', rotate: '' },
    { view: 'top', icon: BoxSelect, shortcut: 'T', label: 'Top View', rotate: 'rotate-180' },
    { view: 'bottom', icon: BoxSelect, shortcut: 'D', label: 'Bottom View', rotate: '' },
    { view: 'iso', icon: Package, shortcut: 'I', label: 'Isometric View', rotate: '' },
  ] as const;

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2 bg-black/20 backdrop-blur-sm rounded-lg p-2 z-10">
      <div className="flex gap-2">
        {viewButtons.map(({ mode, icon: Icon, shortcut, label }) => (
          <button
            key={mode}
            className={`p-2 rounded-md transition-colors group relative ${
              viewMode === mode 
                ? 'bg-white/20 text-white' 
                : 'hover:bg-white/10 text-white/70'
            }`}
            onClick={() => setViewMode(mode)}
          >
            <Icon className="h-4 w-4" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {label} ({shortcut})
            </div>
          </button>
        ))}
      </div>

      <div className="h-px bg-white/10" />

      <div className="grid grid-cols-3 gap-1">
        {viewDirections.map(({ view, icon: Icon, shortcut, label, rotate }) => (
          <button
            key={view}
            className={`p-2 rounded-md transition-colors group relative ${
              currentView === view 
                ? 'bg-white/20 text-white' 
                : 'hover:bg-white/10 text-white/70'
            }`}
            onClick={() => setCurrentView(view)}
          >
            <Icon className={`h-4 w-4 ${rotate}`} />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {label} ({shortcut})
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 