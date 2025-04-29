'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { DraggableWindow } from '../ui/DraggableWindow';
import { Canvas } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls, PerspectiveCamera } from '@react-three/drei';
import { GrandStaff } from './GrandStaff';
import gsap from 'gsap';

interface MIDIOutput {
  send: (data: number[]) => void;
  name: string;
  state: string;
  connection: string;
}

interface WebMidiOutput {
  playNote: (note: number, channel?: number, options?: { velocity?: number }) => void;
  stopNote: (note: number) => void;
  name: string;
  state: string;
  connection: string;
}

interface MIDIKeyboardProps {
  selectedOutput: MIDIOutput | WebMidiOutput | null;
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
}

interface PianoSettings {
  showLabels: boolean;
  showOctaveNumbers: boolean;
  highlightMiddleC: boolean;
}

// Define which white keys have black keys after them (C, D, F, G, A)
const HAS_BLACK_KEY = ['C', 'D', 'F', 'G', 'A'] as const;
type WhiteKeyWithBlack = typeof HAS_BLACK_KEY[number];

// Key dimensions
const WHITE_KEY_WIDTH = 0.95;
const WHITE_KEY_SPACING = 0.05;
const BLACK_KEY_WIDTH = 0.55;
const WHITE_KEY_HEIGHT = 0.25;
const BLACK_KEY_HEIGHT = 0.45;
const WHITE_KEY_LENGTH = 4.0;
const BLACK_KEY_LENGTH = 2.8;
const KEYBOARD_TILT = -Math.PI * 0.05;  // Common tilt for all keys

// Black key offsets from the left edge of their white key
const BLACK_KEY_OFFSETS: Record<WhiteKeyWithBlack, number> = {
  'C': 0.7,  // C# position
  'D': 0.7,  // D# position
  'F': 0.7,  // F# position
  'G': 0.7,  // G# position
  'A': 0.7   // A# position
};

// Generate all 88 keys of a grand piano (A0 to C8)
const generatePianoKeys = () => {
  const keys = [];
  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#'];
  
  // Start from A0 (MIDI note 21)
  let midiNote = 21;  // A0
  let totalKeys = 0;  // Counter to ensure we generate exactly 88 keys
  
  // Generate keys for all octaves (A0 to C8)
  for (let octave = 0; octave <= 8; octave++) {
    // For octave 0, start from A
    // For octave 8, only go up to C
    const startNote = octave === 0 ? 5 : 0;  // 5 is the index of 'A' in noteNames
    const endNote = octave === 8 ? 2 : 7;    // 2 is the index of 'C' in noteNames + 1
    
    for (let i = startNote; i < endNote && totalKeys < 88; i++) {
      const noteIndex = i % 7;
      const noteName = noteNames[noteIndex];
      
      // Add white key
      keys.push({
        note: midiNote,
        name: `${noteName}${octave}`,
        color: 'white',
        label: noteName,
        octave: octave
      });
      totalKeys++;
      midiNote++;
      
      // Add black key if applicable
      if (blackKeys.includes(noteName + '#') && totalKeys < 88) {
        keys.push({
          note: midiNote,
          name: `${noteName}#${octave}`,
          color: 'black',
          label: `${noteName}#`,
          octave: octave
        });
        totalKeys++;
        midiNote++;
      }
    }
  }
  
  return keys;
};

const PIANO_KEYS = generatePianoKeys();

// Create a separate component for individual piano keys
const PianoKey: React.FC<{
  note: number;
  isBlack: boolean;
  position: THREE.Vector3;
  isPressed: boolean;
  onPress: () => void;
  onRelease: () => void;
  isMiddleC: boolean;
}> = React.memo(({ note, isBlack, position, isPressed, onPress, onRelease, isMiddleC }) => {
  console.log(`Rendering key ${note}`);
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => new THREE.BoxGeometry(
    isBlack ? BLACK_KEY_WIDTH : WHITE_KEY_WIDTH,
    isBlack ? BLACK_KEY_HEIGHT : WHITE_KEY_HEIGHT,
    isBlack ? BLACK_KEY_LENGTH : WHITE_KEY_LENGTH
  ), [isBlack]);

  const material = useMemo(() => {
    const mat = new THREE.MeshPhongMaterial({
      color: isBlack ? 0x000000 : 0xffffff,
      emissive: isMiddleC ? 0x2244ff : 0x000000,
      emissiveIntensity: isMiddleC ? 0.3 : 0,
      shininess: isBlack ? 90 : 80,
      specular: isBlack ? 0x444444 : 0x888888,
      flatShading: false
    });
    return mat;
  }, [isBlack, isMiddleC]);

  useEffect(() => {
    if (meshRef.current) {
      if (isPressed) {
        meshRef.current.position.y = position.y - (isBlack ? 0.15 : 0.1);
        material.emissive.setHex(isBlack ? 0x222222 : 0x111111);
        material.color.setHex(isBlack ? 0x333333 : 0xdddddd);
      } else {
        meshRef.current.position.y = position.y;
        material.emissive.setHex(isMiddleC ? 0x2244ff : 0x000000);
        material.color.setHex(isBlack ? 0x000000 : 0xffffff);
      }
    }
  }, [isPressed, position.y, material, isBlack, isMiddleC]);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
      rotation={[KEYBOARD_TILT, 0, 0]}
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerLeave={onRelease}
    />
  );
});

PianoKey.displayName = 'PianoKey';

const PianoKeys: React.FC<{
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
  settings: PianoSettings;
}> = ({ onNoteOn, onNoteOff, settings }) => {
  const [pressedNotes, setPressedNotes] = useState<Set<number>>(new Set());
  const keyboardWidth = (52 * (WHITE_KEY_WIDTH + WHITE_KEY_SPACING));
  const keyboardOffset = -keyboardWidth / 2;

  const handleNoteOn = useCallback((note: number) => {
    setPressedNotes(prev => new Set(prev).add(note));
    onNoteOn(note);
  }, [onNoteOn]);

  const handleNoteOff = useCallback((note: number) => {
    setPressedNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
    onNoteOff(note);
  }, [onNoteOff]);

  // Create white keys
  const whiteKeys = useMemo(() => 
    PIANO_KEYS.filter(key => key.color === 'white').map((noteInfo, index) => {
      const position = new THREE.Vector3(
        keyboardOffset + (index * (WHITE_KEY_WIDTH + WHITE_KEY_SPACING)),
        0,
        0
      );

      return (
        <PianoKey
          key={noteInfo.note}
          note={noteInfo.note}
          isBlack={false}
          position={position}
          isPressed={pressedNotes.has(noteInfo.note)}
          onPress={() => handleNoteOn(noteInfo.note)}
          onRelease={() => handleNoteOff(noteInfo.note)}
          isMiddleC={settings.highlightMiddleC && noteInfo.note === 60}
        />
      );
    }), [pressedNotes, handleNoteOn, handleNoteOff, settings.highlightMiddleC, keyboardOffset]);

  // Create black keys
  const blackKeys = useMemo(() => 
    PIANO_KEYS.filter(key => key.color === 'white').map((whiteKey, index) => {
      if (!HAS_BLACK_KEY.includes(whiteKey.label as WhiteKeyWithBlack)) return null;

      const blackKeyNote = PIANO_KEYS.find(
        k => k.color === 'black' && 
            k.octave === whiteKey.octave && 
            k.label === `${whiteKey.label}#`
      );
      
      if (!blackKeyNote) return null;

      const offset = HAS_BLACK_KEY.includes(whiteKey.label as WhiteKeyWithBlack) 
        ? BLACK_KEY_OFFSETS[whiteKey.label as WhiteKeyWithBlack] 
        : 0.7;
      const position = new THREE.Vector3(
        keyboardOffset + (index * (WHITE_KEY_WIDTH + WHITE_KEY_SPACING)) + (WHITE_KEY_WIDTH * offset),
        BLACK_KEY_HEIGHT/2,
        -BLACK_KEY_LENGTH/3
      );

      return (
        <PianoKey
          key={blackKeyNote.note}
          note={blackKeyNote.note}
          isBlack={true}
          position={position}
          isPressed={pressedNotes.has(blackKeyNote.note)}
          onPress={() => handleNoteOn(blackKeyNote.note)}
          onRelease={() => handleNoteOff(blackKeyNote.note)}
          isMiddleC={false}
        />
      );
    }).filter(Boolean), [pressedNotes, handleNoteOn, handleNoteOff, keyboardOffset]);

  return (
    <group>
      {whiteKeys}
      {blackKeys}
    </group>
  );
};

// Type guard to check if the output is a WebMidi.MIDIOutput
function isWebMIDIOutput(output: MIDIOutput | WebMidiOutput | null): output is MIDIOutput {
  return output !== null && 'send' in output && !('playNote' in output);
}

// Type guard to check if the output is a webmidi.Output
function isWebmidiOutput(output: MIDIOutput | WebMidiOutput | null): output is WebMidiOutput {
  return output !== null && 'playNote' in output;
}

const MIDIKeyboard: React.FC<MIDIKeyboardProps> = ({ selectedOutput, onNoteOn, onNoteOff }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 12, 20]);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0]);
  const [settings, setSettings] = useState<PianoSettings>({
    showLabels: true,
    showOctaveNumbers: true,
    highlightMiddleC: true
  });

  const handleViewChange = useCallback((view: 'default' | 'close' | 'top' | 'side') => {
    const positions = {
      default: { pos: [0, 12, 20] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
      close: { pos: [0, 8, 20] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
      top: { pos: [0, 20, 2] as [number, number, number], target: [0, 0, 0] as [number, number, number] },
      side: { pos: [25, 8, 0] as [number, number, number], target: [0, 0, 0] as [number, number, number] }
    };

    const { pos, target } = positions[view];
    
    gsap.to(cameraPosition, {
      0: pos[0],
      1: pos[1],
      2: pos[2],
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        setCameraPosition([...cameraPosition] as [number, number, number]);
      }
    });

    gsap.to(cameraTarget, {
      0: target[0],
      1: target[1],
      2: target[2],
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        setCameraTarget([...cameraTarget] as [number, number, number]);
      }
    });
  }, [cameraPosition, cameraTarget]);

  // Add logging for selectedOutput changes
  useEffect(() => {
    console.log('Selected MIDI Output:', selectedOutput?.name);
    console.log('MIDI Output state:', selectedOutput?.state);
    console.log('MIDI Output connection:', selectedOutput?.connection);
  }, [selectedOutput]);

  const handleNoteOn = useCallback((note: number) => {
    console.log('Note On:', note);
    if (selectedOutput) {
      try {
        if (isWebMIDIOutput(selectedOutput)) {
          selectedOutput.send([0x90, note, 100]);
        } else if (isWebmidiOutput(selectedOutput)) {
          selectedOutput.playNote(note, 1, { velocity: 100 });
        }
        console.log('MIDI Note On sent:', note);
        onNoteOn(note);
      } catch (error) {
        console.error('Failed to send MIDI Note On:', error);
      }
    } else {
      console.warn('No MIDI output selected');
    }
  }, [selectedOutput, onNoteOn]);

  const handleNoteOff = useCallback((note: number) => {
    console.log('Note Off:', note);
    if (selectedOutput) {
      try {
        if (isWebMIDIOutput(selectedOutput)) {
          selectedOutput.send([0x80, note, 0]);
        } else if (isWebmidiOutput(selectedOutput)) {
          selectedOutput.stopNote(note);
        }
        console.log('MIDI Note Off sent:', note);
        onNoteOff(note);
      } catch (error) {
        console.error('Failed to send MIDI Note Off:', error);
      }
    } else {
      console.warn('No MIDI output selected');
    }
  }, [selectedOutput, onNoteOff]);

  const handleSettingChange = useCallback((setting: keyof PianoSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        shadows
      >
        <color attach="background" args={[0x1a1a1a]} />
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={cameraPosition}
          fov={60}
          near={0.1}
          far={1000}
        />
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={1.0}
          castShadow
        />
        <pointLight 
          position={[0, 10, 5]} 
          intensity={0.8}
        />
        <spotLight
          position={[0, 15, 0]}
          angle={0.6}
          penumbra={0.8}
          intensity={1.0}
          castShadow
        />
        <DreiOrbitControls 
          enableDamping
          dampingFactor={0.05}
          enableZoom
          enablePan
          minDistance={6}
          maxDistance={30}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          target={cameraTarget}
        />
        <group rotation={[0, 0, 0]} position={[0, -2, 0]}>
          <group position={[0, 6, -8]} rotation={[-Math.PI * 0.083, 0, 0]}>
            <GrandStaff width={30} height={15} activeNotes={[]} />
          </group>
          <group rotation={[KEYBOARD_TILT, 0, 0]}>
            <PianoKeys 
              onNoteOn={handleNoteOn}
              onNoteOff={handleNoteOff}
              settings={settings}
            />
          </group>
        </group>
      </Canvas>
      {!selectedOutput && (
        <div className="absolute top-4 left-4 bg-red-900/20 text-red-400 px-4 py-2 rounded-lg">
          Please select a MIDI output device
        </div>
      )}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => handleViewChange('close')}
          className="bg-[#1e3a8a]/50 hover:bg-[#1e3a8a]/70 text-white/70 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          Close
        </button>
        <button
          onClick={() => handleViewChange('top')}
          className="bg-[#1e3a8a]/50 hover:bg-[#1e3a8a]/70 text-white/70 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Top
        </button>
        <button
          onClick={() => handleViewChange('side')}
          className="bg-[#1e3a8a]/50 hover:bg-[#1e3a8a]/70 text-white/70 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          Side
        </button>
        <button
          onClick={() => handleViewChange('default')}
          className="bg-[#1e3a8a]/50 hover:bg-[#1e3a8a]/70 text-white/70 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-[#1e3a8a]/50 hover:bg-[#1e3a8a]/70 text-white/70 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
          </svg>
          Settings
        </button>
      </div>
      {showSettings && (
        <DraggableWindow
          title="Piano Settings"
          defaultPosition={{ x: window.innerWidth - 300, y: 100 }}
          onClose={() => setShowSettings(false)}
        >
          <div className="p-4 space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showLabels}
                onChange={(e) => handleSettingChange('showLabels', e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="text-sm text-gray-300">Show Note Labels</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showOctaveNumbers}
                onChange={(e) => handleSettingChange('showOctaveNumbers', e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="text-sm text-gray-300">Show Octave Numbers</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.highlightMiddleC}
                onChange={(e) => handleSettingChange('highlightMiddleC', e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="text-sm text-gray-300">Highlight Middle C</span>
            </label>
          </div>
        </DraggableWindow>
      )}
    </div>
  );
};

export default MIDIKeyboard; 