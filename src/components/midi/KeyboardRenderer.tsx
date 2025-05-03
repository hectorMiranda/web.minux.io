'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ThreeScene = dynamic(() => import('./ThreeScene'), {
  ssr: false,
  loading: () => <div>Loading 3D scene...</div>
});

interface KeyboardRendererProps {
  activeKeys: Set<number>;
  onKeyPress: (note: number) => void;
}

export default function KeyboardRenderer({ activeKeys, onKeyPress }: KeyboardRendererProps) {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <ThreeScene activeKeys={activeKeys} onKeyPress={onKeyPress} />
      </Suspense>
    </div>
  );
} 