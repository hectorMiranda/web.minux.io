'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface KeyboardSceneProps {
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
}

const KeyboardScene: React.FC<KeyboardSceneProps> = ({
  onNoteOn,
  onNoteOff
}) => {
  const whiteKeys = useRef<Mesh[]>([]);
  const blackKeys = useRef<Mesh[]>([]);
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());

  // Key dimensions
  const whiteKeyWidth = 0.23;
  const whiteKeyLength = 1;
  const blackKeyWidth = 0.16;
  const blackKeyLength = 0.7;

  // Create white keys
  const whiteKeyPositions = Array.from({ length: 52 }, (_, i) => i * whiteKeyWidth);

  // Create black keys
  const blackKeyPattern = [1, 1, 0, 1, 1, 1, 0]; // 1 for black key, 0 for gap
  const blackKeyPositions = whiteKeyPositions.filter((_, i) => blackKeyPattern[i % 7]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* White keys */}
      {whiteKeyPositions.map((x, i) => (
        <mesh
          key={`white-${i}`}
          position={[x - (whiteKeyPositions.length * whiteKeyWidth) / 2, 0, 0]}
          ref={el => {
            if (el) whiteKeys.current[i] = el;
          }}
          onClick={() => {
            const note = 36 + i;
            if (activeKeys.has(note)) {
              onNoteOff(note);
              setActiveKeys(prev => {
                const next = new Set(prev);
                next.delete(note);
                return next;
              });
            } else {
              onNoteOn(note, 100);
              setActiveKeys(prev => new Set(prev).add(note));
            }
          }}
        >
          <boxGeometry args={[whiteKeyWidth * 0.95, 0.1, whiteKeyLength]} />
          <meshStandardMaterial 
            color={activeKeys.has(36 + i) ? '#4a9eff' : 'white'} 
          />
        </mesh>
      ))}

      {/* Black keys */}
      {blackKeyPositions.map((x, i) => (
        <mesh
          key={`black-${i}`}
          position={[
            x + (whiteKeyWidth / 2) - (whiteKeyPositions.length * whiteKeyWidth) / 2,
            0.05,
            -(whiteKeyLength - blackKeyLength) / 2
          ]}
          ref={el => {
            if (el) blackKeys.current[i] = el;
          }}
          onClick={() => {
            const note = 37 + i;
            if (activeKeys.has(note)) {
              onNoteOff(note);
              setActiveKeys(prev => {
                const next = new Set(prev);
                next.delete(note);
                return next;
              });
            } else {
              onNoteOn(note, 100);
              setActiveKeys(prev => new Set(prev).add(note));
            }
          }}
        >
          <boxGeometry args={[blackKeyWidth, 0.1, blackKeyLength]} />
          <meshStandardMaterial 
            color={activeKeys.has(37 + i) ? '#4a9eff' : 'black'} 
          />
        </mesh>
      ))}
    </>
  );
};

export default KeyboardScene; 