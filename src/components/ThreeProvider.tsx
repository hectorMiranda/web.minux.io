'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

export default function ThreeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white/50">Loading 3D viewer...</div>
      </div>
    }>
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        {children}
      </Canvas>
    </Suspense>
  );
} 