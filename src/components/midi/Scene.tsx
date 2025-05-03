'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface SceneProps {
  activeKeys: Set<number>;
  onKeyPress: (note: number) => void;
}

function Keys({ activeKeys, onKeyPress }: SceneProps) {
  const whiteKeyWidth = 0.23;
  const whiteKeyLength = 1;
  const blackKeyWidth = 0.16;
  const blackKeyLength = 0.7;

  const whiteKeyPositions = Array.from({ length: 52 }, (_, i) => i * whiteKeyWidth);
  const blackKeyPattern = [1, 1, 0, 1, 1, 1, 0];
  const blackKeyPositions = whiteKeyPositions.filter((_, i) => blackKeyPattern[i % 7]);

  return (
    <group>
      {whiteKeyPositions.map((x, i) => (
        <mesh
          key={`white-${i}`}
          position={[x - (whiteKeyPositions.length * whiteKeyWidth) / 2, 0, 0]}
          onClick={() => onKeyPress(36 + i)}
        >
          <boxGeometry args={[whiteKeyWidth * 0.95, 0.1, whiteKeyLength]} />
          <meshStandardMaterial color={activeKeys.has(36 + i) ? '#4a9eff' : 'white'} />
        </mesh>
      ))}

      {blackKeyPositions.map((x, i) => (
        <mesh
          key={`black-${i}`}
          position={[
            x + (whiteKeyWidth / 2) - (whiteKeyPositions.length * whiteKeyWidth) / 2,
            0.05,
            -(whiteKeyLength - blackKeyLength) / 2
          ]}
          onClick={() => onKeyPress(37 + i)}
        >
          <boxGeometry args={[blackKeyWidth, 0.1, blackKeyLength]} />
          <meshStandardMaterial color={activeKeys.has(37 + i) ? '#4a9eff' : 'black'} />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene({ activeKeys, onKeyPress }: SceneProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Keys activeKeys={activeKeys} onKeyPress={onKeyPress} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
} 