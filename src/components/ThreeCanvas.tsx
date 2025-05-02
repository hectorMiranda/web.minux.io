'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

interface ThreeCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
}

export default function ThreeCanvas({ children, cameraPosition = [5, 5, 5] }: ThreeCanvasProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 2]}
        camera={{
          fov: 45,
          position: cameraPosition,
        }}
        gl={{
          antialias: true,
          outputColorSpace: 'srgb',
        }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
} 