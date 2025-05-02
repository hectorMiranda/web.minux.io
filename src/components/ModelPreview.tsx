'use client';

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';
import ThreeRenderer from './ThreeRenderer';
import type { ModelData } from '../lib/storage';

interface ModelPreviewProps {
  model: ModelData;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export default function ModelPreview({ 
  model, 
  isSelected,
  onClick, 
  onDelete 
}: ModelPreviewProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadGeometry = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!model.base64) {
          throw new Error('No model data');
        }

        const base64Data = model.base64.split(',')[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const loader = new STLLoader();
        const geometry = loader.parse(bytes.buffer);
        geometry.computeBoundingSphere();
        
        if (isMounted) {
          setGeometry(geometry);
          setError(null);
        }
      } catch (error) {
        console.error('Error loading preview geometry:', error);
        if (isMounted) {
          setError('Failed to load preview');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadGeometry();

    return () => {
      isMounted = false;
      if (geometry) {
        geometry.dispose();
      }
    };
  }, [model.base64]);

  return (
    <div className="relative group">
      <div 
        className={`aspect-square border rounded-lg overflow-hidden cursor-pointer transition-colors ${
          isSelected ? 'border-primary' : 'border-white/10 hover:border-white/20'
        }`}
        onClick={onClick}
      >
        {error ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-red-500 p-2 text-center">
            {error}
          </div>
        ) : isLoading ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-white/50">
            Loading...
          </div>
        ) : geometry ? (
          <div className="w-full h-full">
            <ThreeRenderer geometry={geometry} isPreview />
          </div>
        ) : null}
      </div>

      <div className="absolute inset-0 flex items-end justify-between p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs font-medium truncate text-white flex-1 mr-2">
          {model.name}
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-white/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 