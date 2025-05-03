'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

export default function Keyboard3D() {
  return (
    <div className="w-full h-full">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white/50">Loading 3D keyboard...</div>
        </div>
      }>
        <Scene />
      </Suspense>
    </div>
  );
} 