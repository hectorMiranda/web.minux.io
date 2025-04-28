'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-ignore
import WebMidi, { Output } from 'webmidi';
import { DraggableWindow } from '../ui/DraggableWindow';

interface MIDIKeyboardProps {
  selectedOutput: Output | null;
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
}

interface PianoSettings {
  showLabels: boolean;
  showOctaveNumbers: boolean;
  highlightMiddleC: boolean;
}

interface NoteInfo {
  midiNumber: number;
  name: string;
  label: string;
  octave: number;
  color: 'white' | 'black';
}

interface Note {
  midiNumber: number;
}

interface ExtendedMesh extends THREE.Mesh {
  originalY?: number;
  userData: {
    note: number;
  };
}

// Generate all 88 keys of a grand piano (A0 to C8)
const generatePianoKeys = () => {
  const keys = [];
  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#'];
  
  // Start from A0 (MIDI note 21)
  let noteNumber = 21;
  
  // Generate keys for all octaves
  for (let octave = 0; octave <= 8; octave++) {
    const startNote = octave === 0 ? 5 : 0; // Start from A for octave 0
    const endNote = octave === 8 ? 0 : 7; // End at C for octave 8
    
    for (let i = startNote; i < endNote; i++) {
      const noteName = noteNames[i % 7];
      const fullNoteName = `${noteName}${octave}`;
      
      // Add white key
      keys.push({
        note: noteNumber,
        name: fullNoteName,
        color: 'white',
        label: noteName,
        octave: octave
      });
      noteNumber++;
      
      // Add black key if applicable
      if (blackKeys.includes(noteName + '#')) {
        keys.push({
          note: noteNumber,
          name: `${noteName}#${octave}`,
          color: 'black',
          label: `${noteName}#`,
          octave: octave
        });
        noteNumber++;
      }
    }
  }
  
  return keys;
};

const PIANO_KEYS = generatePianoKeys();

const MIDIKeyboard: React.FC<MIDIKeyboardProps> = ({ selectedOutput, onNoteOn, onNoteOff }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const keysRef = useRef<ExtendedMesh[]>([]);
  const labelsRef = useRef<THREE.Sprite[]>([]);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<PianoSettings>({
    showLabels: true,
    showOctaveNumbers: true,
    highlightMiddleC: true
  });

  const createTextSprite = (text: string, color: string = 'white') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;
    
    canvas.width = 256;  // Larger canvas for sharper text
    canvas.height = 128;
    
    context.fillStyle = 'transparent';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'bold 48px Arial';  // Larger font
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1.5, 0.75, 1);  // Larger sprites
    return sprite;
  };

  const updateLabels = useCallback(() => {
    labelsRef.current.forEach(label => {
      if (label.parent) label.parent.remove(label);
    });
    labelsRef.current = [];

    if (!settings.showLabels || !sceneRef.current) return;

    keysRef.current.forEach((key) => {
      const noteInfo = (key as any).noteInfo;
      if (noteInfo.color === 'white') {
        const labelText = settings.showOctaveNumbers 
          ? `${noteInfo.label}${noteInfo.octave}` 
          : noteInfo.label;
        
        const labelColor = (noteInfo.name === 'C4' && settings.highlightMiddleC) 
          ? '#ff4444' 
          : '#ffffff';

        const label = createTextSprite(labelText, labelColor);
        if (label && sceneRef.current) {
          label.position.copy(key.position);
          label.position.z += 4.5;  // Fixed offset for label position
          label.position.y += 0.3;
          sceneRef.current.add(label);
          labelsRef.current.push(label);
        }
      }
    });
  }, [settings]);

  useEffect(() => {
    console.log('Settings changed:', settings);
    updateLabels();
  }, [settings, updateLabels]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 12, 30);
    camera.lookAt(0, -2, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false
    });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add click event handling
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let activeKey: ExtendedMesh | null = null;

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (cameraRef.current && sceneRef.current) {
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObjects(keysRef.current);

        if (intersects.length > 0) {
          activeKey = intersects[0].object as ExtendedMesh;
          const noteInfo = (activeKey as any).noteInfo;
          if (noteInfo) {
            console.log('Key pressed:', noteInfo);
            playNote({ midiNumber: noteInfo.note });
          }
        }
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      event.preventDefault();
      if (activeKey) {
        const noteInfo = (activeKey as any).noteInfo;
        if (noteInfo) {
          console.log('Key released:', noteInfo);
          stopNote({ midiNumber: noteInfo.note });
        }
        activeKey = null;
      }
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseup', handleMouseUp); // Handle mouse up outside the canvas

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.minDistance = 20;
    controls.maxDistance = 40;
    controls.minPolarAngle = Math.PI / 4;  // Limit minimum angle
    controls.maxPolarAngle = Math.PI / 2;  // Limit maximum angle
    controls.target.set(0, -2, 0);

    // Create piano keys
    keysRef.current = [];
    const whiteKeyWidth = 0.95;  // Slightly wider
    const whiteKeySpacing = 0.05;  // Very small spacing
    const blackKeyWidth = 0.6;  // Thinner black keys
    const blackKeyHeight = 0.5;  // Shorter black keys
    const whiteKeyHeight = 0.25;  // Thinner white keys
    const whiteKeyLength = 5.5;  // Slightly longer
    const blackKeyLength = 3.5;  // Proportional black key length
    const keyboardWidth = (52 * (whiteKeyWidth + whiteKeySpacing));
    const keyboardOffset = -keyboardWidth / 2;

    // Add a base for the piano
    const baseGeometry = new THREE.BoxGeometry(keyboardWidth + 1, 0.5, whiteKeyLength + 1);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x222222,
      shininess: 30
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.25;
    base.position.z = whiteKeyLength/2 - 0.5;
    base.rotation.x = -Math.PI * 0.05;  // Slight tilt
    scene.add(base);

    // Create a group for all piano keys
    const keyGroup = new THREE.Group();
    keyGroup.rotation.x = -Math.PI * 0.05;  // Same tilt as base
    scene.add(keyGroup);

    PIANO_KEYS.forEach((noteInfo, index) => {
      const isBlack = noteInfo.color === 'black';
      const geometry = new THREE.BoxGeometry(
        isBlack ? blackKeyWidth : whiteKeyWidth,
        isBlack ? blackKeyHeight : whiteKeyHeight,
        isBlack ? blackKeyLength : whiteKeyLength
      );

      const material = new THREE.MeshPhongMaterial({
        color: isBlack ? 0x111111 : 0xeeeeee,
        emissive: 0x000000,
        shininess: 40,
        flatShading: false
      });

      // Create mesh with proper typing
      const baseMesh = new THREE.Mesh(geometry, material);
      const key = Object.assign(baseMesh, {
        userData: { note: noteInfo.note },
        originalY: isBlack ? blackKeyHeight/2 : whiteKeyHeight/2
      }) as ExtendedMesh;

      // Position calculation
      const whiteKeyIndex = PIANO_KEYS.filter(
        (k, i) => i < index && k.color === 'white'
      ).length;

      if (isBlack) {
        // Calculate black key position based on the note name
        const noteName = noteInfo.name.charAt(0);
        let offset = 0;
        switch(noteName) {
          case 'C': offset = -0.25; break;
          case 'D': offset = 0.25; break;
          case 'F': offset = -0.25; break;
          case 'G': offset = 0; break;
          case 'A': offset = 0.25; break;
        }
        key.position.x = keyboardOffset + (whiteKeyIndex * (whiteKeyWidth + whiteKeySpacing)) + (whiteKeyWidth * offset);
        key.position.y = blackKeyHeight/2;
        key.position.z = -whiteKeyLength/3;
      } else {
        key.position.x = keyboardOffset + (whiteKeyIndex * (whiteKeyWidth + whiteKeySpacing));
        key.position.y = whiteKeyHeight/2;
        key.position.z = 0;
      }

      (key as any).noteInfo = noteInfo;
      keyGroup.add(key);
      keysRef.current.push(key);
    });

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 15);
    scene.add(directionalLight);

    // Add a point light for better key visibility
    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(0, 15, 10);
    scene.add(pointLight);

    // Add initial labels
    updateLabels();

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current) {
        return requestAnimationFrame(animate);
      }

      const frameId = requestAnimationFrame(animate);
      controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      return frameId;
    };

    // Start animation
    const frameId = animate();

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (rendererRef.current) {
        renderer.domElement.removeEventListener('mousedown', handleMouseDown);
        renderer.domElement.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseup', handleMouseUp);
        rendererRef.current.dispose();
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      }
    };
  }, []);

  const playNote = (note: Note) => {
    if (!selectedOutput) return;
    
    const key = keysRef.current.find((k) => (k as any).noteInfo.note === note.midiNumber);
    if (!key) return;

    // Visual feedback - change material color
    const material = key.material as THREE.MeshPhongMaterial;
    material.emissive = new THREE.Color(0x333333);

    // Animate key press
    const isBlack = (key as any).noteInfo.color === 'black';
    key.position.y = isBlack ? 0.2 : -0.1;

    // Play MIDI note
    selectedOutput.playNote(note.midiNumber, { velocity: 0.7 });
    onNoteOn(note.midiNumber);
  };

  const stopNote = (note: Note) => {
    if (!selectedOutput) return;
    
    const key = keysRef.current.find((k) => (k as any).noteInfo.note === note.midiNumber);
    if (!key) return;

    // Reset material color
    const material = key.material as THREE.MeshPhongMaterial;
    material.emissive = new THREE.Color(0x000000);

    // Reset key position
    const isBlack = (key as any).noteInfo.color === 'black';
    key.position.y = isBlack ? 0.3 : 0;

    // Stop MIDI note
    selectedOutput.stopNote(note.midiNumber);
    onNoteOff(note.midiNumber);
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className="w-full h-full"
      />
      {!selectedOutput && (
        <div className="absolute top-4 left-4 bg-red-900/20 text-red-400 px-4 py-2 rounded-lg">
          Please select a MIDI output device
        </div>
      )}
      <div className="absolute top-4 right-4 flex gap-2">
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
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.showLabels}
                onChange={(e) => {
                  console.log('Changing showLabels to:', e.target.checked);
                  setSettings(prev => ({...prev, showLabels: e.target.checked}));
                }}
                className="form-checkbox"
              />
              <span>Show Note Labels</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.showOctaveNumbers}
                onChange={(e) => {
                  console.log('Changing showOctaveNumbers to:', e.target.checked);
                  setSettings(prev => ({...prev, showOctaveNumbers: e.target.checked}));
                }}
                className="form-checkbox"
              />
              <span>Show Octave Numbers</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.highlightMiddleC}
                onChange={(e) => {
                  console.log('Changing highlightMiddleC to:', e.target.checked);
                  setSettings(prev => ({...prev, highlightMiddleC: e.target.checked}));
                }}
                className="form-checkbox"
              />
              <span>Highlight Middle C</span>
            </label>
          </div>
        </DraggableWindow>
      )}
    </div>
  );
}

export default MIDIKeyboard; 