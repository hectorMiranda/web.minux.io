'use client';

interface KeysProps {
  activeKeys: Set<number>;
  onKeyPress: (note: number) => void;
}

export function Keys({ activeKeys, onKeyPress }: KeysProps) {
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
    <group>
      {/* White keys */}
      {whiteKeyPositions.map((x, i) => (
        <mesh
          key={`white-${i}`}
          position={[x - (whiteKeyPositions.length * whiteKeyWidth) / 2, 0, 0]}
          onClick={() => onKeyPress(36 + i)}
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
          onClick={() => onKeyPress(37 + i)}
        >
          <boxGeometry args={[blackKeyWidth, 0.1, blackKeyLength]} />
          <meshStandardMaterial 
            color={activeKeys.has(37 + i) ? '#4a9eff' : 'black'} 
          />
        </mesh>
      ))}
    </group>
  );
} 