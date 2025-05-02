'use client';

import React from 'react';
import ThreeRenderer from './ThreeRenderer';

interface ModelViewerProps {
  geometry: THREE.BufferGeometry;
}

export default function ModelViewer({ geometry }: ModelViewerProps) {
  return (
    <div className="w-full h-full">
      <ThreeRenderer geometry={geometry} />
    </div>
  );
} 