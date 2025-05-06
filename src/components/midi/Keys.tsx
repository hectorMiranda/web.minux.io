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
      {/* White keys */}
      {whiteKeyPositions.map((x, i) => (
        <mesh
          key={`white-${i}`}
          position={[x - (whiteKeyPositions.length * whiteKeyWidth) / 2, 0, 0]}
          onClick={() => onKeyPress(whiteKeyToMidi(i))}
        >
          <boxGeometry args={[whiteKeyWidth * 0.95, 0.1, whiteKeyLength]} />
          <meshStandardMaterial 
            color={activeKeys.has(whiteKeyToMidi(i)) ? '#4a9eff' : 'white'} 
          />
        </mesh>
      ))}

      {/* Black keys */}
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
          <meshStandardMaterial 
            color={activeKeys.has(keyInfo.midiNote) ? '#4a9eff' : 'black'} 
          />
        </mesh>
      ))}
    </group>
  );
} 