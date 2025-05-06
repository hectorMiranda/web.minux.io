'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

interface ThreeSceneProps {
  activeKeys: Set<number>;
  onKeyPress: (note: number) => void;
}

function Keys({ activeKeys, onKeyPress }: ThreeSceneProps) {
  const whiteKeyWidth = 0.23;
  const whiteKeyLength = 1;
  const blackKeyWidth = 0.16;
  const blackKeyLength = 0.7;

  const whiteKeyPositions = Array.from({ length: 52 }, (_, i) => i * whiteKeyWidth);
  const blackKeyPattern = [1, 1, 0, 1, 1, 1, 0]; // 1 for black key, 0 for gap
  
  // Map white keys to MIDI notes (starting from C2 = 36)
  const whiteKeyToMidi = (index: number) => 36 + index;

  // Create array of positions for black keys
  const blackKeyPositions = [];
  let blackKeyIndex = 0;
  
  for (let i = 0; i < whiteKeyPositions.length; i++) {
    if (blackKeyPattern[i % 7]) {
      blackKeyPositions.push({
        position: whiteKeyPositions[i],
        midiNote: whiteKeyToMidi(i) + 1, // The black key is 1 semitone above its white key
        index: blackKeyIndex++
      });
    }
  }

  return (
    <group>
      {whiteKeyPositions.map((x, i) => (
        <mesh
          key={`white-${i}`}
          position={[x - (whiteKeyPositions.length * whiteKeyWidth) / 2, 0, 0]}
          onClick={() => onKeyPress(whiteKeyToMidi(i))}
        >
          <boxGeometry args={[whiteKeyWidth * 0.95, 0.1, whiteKeyLength]} />
          <meshStandardMaterial color={activeKeys.has(whiteKeyToMidi(i)) ? '#4a9eff' : 'white'} />
        </mesh>
      ))}

      {blackKeyPositions.map((keyInfo) => (
        <mesh
          key={`black-${keyInfo.index}`}
          position={[
            keyInfo.position + (whiteKeyWidth / 2) - (whiteKeyPositions.length * whiteKeyWidth) / 2,
            0.05,
            -(whiteKeyLength - blackKeyLength) / 2
          ]}
          onClick={() => onKeyPress(keyInfo.midiNote)}
        >
          <boxGeometry args={[blackKeyWidth, 0.1, blackKeyLength]} />
          <meshStandardMaterial color={activeKeys.has(keyInfo.midiNote) ? '#4a9eff' : 'black'} />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeScene({ activeKeys, onKeyPress }: ThreeSceneProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Keys activeKeys={activeKeys} onKeyPress={onKeyPress} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
} 