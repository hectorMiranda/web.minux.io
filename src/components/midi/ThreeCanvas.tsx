'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useMIDI } from './MIDIProvider';

const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false });

interface ThreeCanvasProps {
  activeKeys: Set<number>;
  onKeyPress: (note: number) => void;
}

export default function ThreeCanvas(props: ThreeCanvasProps) {
  const { isReady } = useMIDI();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isReady || !mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white/50">Loading keyboard...</div>
      </div>
    );
  }

  return <ThreeScene {...props} />;
} 