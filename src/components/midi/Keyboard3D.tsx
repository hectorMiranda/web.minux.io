'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

export default function Keyboard3D() {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());

  const handleKeyPress = (note: number) => {
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(note)) {
        newSet.delete(note);
      } else {
        newSet.add(note);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full h-full">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white/50">Loading 3D keyboard...</div>
        </div>
      }>
        <Scene activeKeys={activeKeys} onKeyPress={handleKeyPress} />
      </Suspense>
    </div>
  );
} 