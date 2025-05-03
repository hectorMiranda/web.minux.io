'use client';

import { useEffect, useRef } from 'react';

interface FallbackRendererProps {
  activeKeys: Set<number>;
  onKeyPress: (note: number) => void;
}

export default function FallbackRenderer({ activeKeys, onKeyPress }: FallbackRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw piano keys
      const totalKeys = 52;
      const keyWidth = canvas.width / totalKeys;
      const keyHeight = canvas.height * 0.3;
      const yPosition = canvas.height - keyHeight;

      // White keys
      for (let i = 0; i < totalKeys; i++) {
        const x = i * keyWidth;
        ctx.fillStyle = activeKeys.has(36 + i) ? '#4a9eff' : 'white';
        ctx.fillRect(x, yPosition, keyWidth * 0.9, keyHeight);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x, yPosition, keyWidth * 0.9, keyHeight);
      }

      // Black keys pattern
      const blackKeyPattern = [1, 1, 0, 1, 1, 1, 0]; // 1 for black key, 0 for gap
      const blackKeyWidth = keyWidth * 0.6;
      const blackKeyHeight = keyHeight * 0.6;

      let blackKeyCount = 0;
      for (let i = 0; i < totalKeys; i++) {
        if (blackKeyPattern[i % 7]) {
          const x = (i * keyWidth) + (keyWidth / 2) - (blackKeyWidth / 2);
          ctx.fillStyle = activeKeys.has(37 + blackKeyCount) ? '#4a9eff' : 'black';
          ctx.fillRect(x, yPosition, blackKeyWidth, blackKeyHeight);
          blackKeyCount++;
        }
      }
    };

    // Initial draw
    draw();

    // Redraw when active keys change
    const interval = setInterval(draw, 16); // ~60fps

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateSize);
    };
  }, [activeKeys]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const totalKeys = 52;
    const keyWidth = canvas.width / totalKeys;
    const keyHeight = canvas.height * 0.3;
    const yPosition = canvas.height - keyHeight;

    // Check if clicked on black keys first (they're on top)
    const blackKeyPattern = [1, 1, 0, 1, 1, 1, 0];
    const blackKeyWidth = keyWidth * 0.6;
    const blackKeyHeight = keyHeight * 0.6;

    let blackKeyCount = 0;
    for (let i = 0; i < totalKeys; i++) {
      if (blackKeyPattern[i % 7]) {
        const keyX = (i * keyWidth) + (keyWidth / 2) - (blackKeyWidth / 2);
        if (
          x >= keyX && x <= keyX + blackKeyWidth &&
          y >= yPosition && y <= yPosition + blackKeyHeight
        ) {
          onKeyPress(37 + blackKeyCount);
          return;
        }
        blackKeyCount++;
      }
    }

    // Check if clicked on white keys
    for (let i = 0; i < totalKeys; i++) {
      const keyX = i * keyWidth;
      if (
        x >= keyX && x <= keyX + keyWidth * 0.9 &&
        y >= yPosition && y <= yPosition + keyHeight
      ) {
        onKeyPress(36 + i);
        return;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full h-full"
      style={{ background: '#1a1a1a' }}
    />
  );
} 