'use client';

import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Music, Settings, Terminal, Play, Pause, Info, Maximize, Layers } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Define note names for display
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_COLORS = {
  C: '#ff4d4d',
  'C#': '#ff9e4d',
  D: '#ffef4d',
  'D#': '#4dff6d',
  E: '#4dffef',
  F: '#4d97ff',
  'F#': '#8a4dff',
  G: '#e54dff',
  'G#': '#ff4db1',
  A: '#ff4d4d',
  'A#': '#ff9e4d',
  B: '#ffef4d'
};

interface MIDIKeyboardProps {
  selectedOutput: WebMidi.MIDIOutput | null;
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
  activeNotes?: Set<number>;
  showDebug?: boolean;
  exerciseMode?: string;
  expectedNotes?: number[];
}

// Helper function to create text sprite for clef symbols
function createTextSprite(text: string, size: number, color: THREE.Color) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;

  if (context) {
    context.font = '200px serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = color.getStyle();
    context.fillText(text, 128, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(size, size, 1);
  return sprite;
}

// Helper function to create note labels
function createNoteLabel(note: number, position: THREE.Vector3, scene: THREE.Scene) {
  const noteIndex = note % 12;
  const octave = Math.floor(note / 12) - 1;
  const noteName = NOTE_NAMES[noteIndex];
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 128;
  canvas.height = 128;

  if (context) {
    context.fillStyle = '#ffffff';
    context.font = 'bold 72px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`${noteName}${octave}`, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.4, 0.4, 1);
  sprite.position.copy(position);
  sprite.position.y += 0.1;
  sprite.position.z -= 0.2;
  sprite.userData = { type: 'noteLabel', note };
  scene.add(sprite);
  return sprite;
}

export default function MIDIKeyboard({
  selectedOutput,
  onNoteOn,
  onNoteOff,
  activeNotes = new Set<number>(),
  showDebug = false,
  exerciseMode,
  expectedNotes = []
}: MIDIKeyboardProps) {
  // Settings state with localStorage persistence
  const [showNoteNames, setShowNoteNames] = useLocalStorage('midiKeyboard.showNoteNames', true);
  const [showFingerNumbers, setShowFingerNumbers] = useLocalStorage('midiKeyboard.showFingerNumbers', false);
  const [keyboardView, setKeyboardView] = useLocalStorage('midiKeyboard.view', 'perspective');

  // UI state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [highlightedKeys, setHighlightedKeys] = useState<Set<number>>(new Set());
  const [noteLabelSprites, setNoteLabelSprites] = useState<THREE.Sprite[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const whiteKeysRef = useRef<THREE.Mesh[]>([]);
  const blackKeysRef = useRef<THREE.Mesh[]>([]);
  const staffGroupRef = useRef<THREE.Group | null>(null);
  
  // Get the note name and octave from MIDI note number
  const getNoteInfo = (midiNote: number) => {
    const noteIndex = midiNote % 12;
    const octave = Math.floor(midiNote / 12) - 1;
    return {
      name: NOTE_NAMES[noteIndex],
      octave,
      displayName: `${NOTE_NAMES[noteIndex]}${octave}`,
      color: NOTE_COLORS[NOTE_NAMES[noteIndex] as keyof typeof NOTE_COLORS]
    };
  };

  // Handle key press with animation
  const handleKeyPress = (note: number) => {
    const isActive = activeNotes.has(note);
    
    if (isActive) {
      onNoteOff(note);
    } else {
      onNoteOn(note, 100);
      
      // Animate key press
      animateKeyPress(note, !isActive);
    }
  };

  // Animate key press
  const animateKeyPress = (note: number, isDown: boolean) => {
    const isBlackKey = [1, 3, 6, 8, 10].includes(note % 12);
    const keyIndex = isBlackKey 
      ? blackKeysRef.current.findIndex(key => key.userData.note === note)
      : whiteKeysRef.current.findIndex(key => key.userData.note === note);
    
    const keyToAnimate = isBlackKey 
      ? blackKeysRef.current[keyIndex]
      : whiteKeysRef.current[keyIndex];
      
    if (keyToAnimate) {
      // Save original position
      const originalY = keyToAnimate.userData.originalY || keyToAnimate.position.y;
      
      if (!keyToAnimate.userData.originalY) {
        keyToAnimate.userData.originalY = originalY;
      }
      
      // Move down or reset
      if (isDown) {
        keyToAnimate.position.y = originalY - 0.05;
      } else {
        keyToAnimate.position.y = originalY;
      }
    }
  };

  // Initialize Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing canvases to prevent duplicates
    const existingCanvases = containerRef.current.querySelectorAll('canvas');
    existingCanvases.forEach(canvas => {
      canvas.remove();
    });
    
    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#121212'); // Darker background for better contrast

    // Define key dimensions
    const whiteKeyWidth = 0.23;
    const whiteKeyLength = 1;
    const blackKeyWidth = 0.16;
    const blackKeyLength = 0.7;

    // Calculate the width of the keyboard to ensure it's fully visible
    const totalWhiteKeys = 52;
    const totalWidth = totalWhiteKeys * whiteKeyWidth;

    // Setup camera - adjusted for better view
    const camera = new THREE.PerspectiveCamera(
      45, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    cameraRef.current = camera;
    
    // Position camera based on view preference
    if (keyboardView === 'top') {
      camera.position.set(0, 10, 0.1);
    } else if (keyboardView === 'side') {
      camera.position.set(10, 0.1, 0.1);
    } else {
      camera.position.set(0, 2, 12);
    }
    camera.lookAt(0, 0, 0);

    // Setup renderer with better quality settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    // Add orbit controls with improved settings
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.minPolarAngle = Math.PI / 6; // Allow more top-down view
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableDamping = true; // Smoother camera movement
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controls.update();

    // Add enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4d97ff, 0.5);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Create enhanced staff with grand staff and note markers
    const staffPosition = new THREE.Vector3(0, 4, -2);
    const staffRotation = new THREE.Euler(-0.1, 0, 0);
    const staffGroup = new THREE.Group();
    staffGroup.position.copy(staffPosition);
    staffGroup.rotation.copy(staffRotation);
    staffGroupRef.current = staffGroup;

    // Add semi-transparent background panel for the staff
    const bgGeometry = new THREE.PlaneGeometry(14, 5); // Taller to accommodate both staves
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a1a1a,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const background = new THREE.Mesh(bgGeometry, bgMaterial);
    background.position.z = -0.1;
    staffGroup.add(background);

    // Helper function to create staff lines
    const createStaffLines = (yOffset: number, color: number) => {
      for (let i = 0; i < 5; i++) {
        const geometry = new THREE.PlaneGeometry(14, 0.02);
        const material = new THREE.MeshBasicMaterial({ 
          color, 
          opacity: 0.7, 
          transparent: true 
        });
        const line = new THREE.Mesh(geometry, material);
        line.position.y = yOffset - (i * 0.2);
        staffGroup.add(line);
      }
    };

    // Create treble staff
    createStaffLines(0.8, 0xdddddd);
    
    // Create bass staff
    createStaffLines(-0.4, 0xdddddd);
    
    // Add middle C line
    const middleCGeometry = new THREE.PlaneGeometry(1, 0.02);
    const middleCMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x4d97ff, 
      opacity: 0.8, 
      transparent: true 
    });
    const middleCLine = new THREE.Mesh(middleCGeometry, middleCMaterial);
    middleCLine.position.set(0, 0.2, 0); // Position for middle C
    middleCLine.position.x = -6; // Align with clef
    staffGroup.add(middleCLine);
    
    // Add "C4" label for middle C
    const middleCLabelSprite = createTextSprite("C4", 0.5, new THREE.Color(0x4d97ff));
    middleCLabelSprite.position.set(-5.5, 0.2, 0.1);
    staffGroup.add(middleCLabelSprite);

    // Add clef symbols with higher quality
    const trebleClef = createTextSprite('𝄞', 1.4, new THREE.Color(0xdddddd));
    trebleClef.position.set(-6, 0.6, 0.1);
    staffGroup.add(trebleClef);

    const bassClef = createTextSprite('𝄢', 1.4, new THREE.Color(0xdddddd));
    bassClef.position.set(-6, -0.8, 0.1);
    staffGroup.add(bassClef);

    scene.add(staffGroup);

    // Create piano group to offset the keyboard
    const pianoGroup = new THREE.Group();
    pianoGroup.position.set(-2, 0, 0); // Adjust position to center the keyboard
    scene.add(pianoGroup);

    // Create materials with improved appearance
    const whiteMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xfafafa,
      metalness: 0.1,
      roughness: 0.8
    });
    
    const blackMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111,
      metalness: 0.2,
      roughness: 0.6
    });

    // Create white keys with subtle bevels
    const whiteKeyGeometry = new THREE.BoxGeometry(whiteKeyWidth * 0.95, 0.1, whiteKeyLength);
    const whiteKeyPositions = Array.from({ length: 52 }, (_, i) => i * whiteKeyWidth);
    
    whiteKeyPositions.forEach((x, i) => {
      const key = new THREE.Mesh(whiteKeyGeometry, whiteMaterial.clone());
      key.position.set(x - (whiteKeyPositions.length * whiteKeyWidth) / 2, 0, 0);
      key.receiveShadow = true;
      key.castShadow = true;
      
      // Calculate the MIDI note number (C2 starts at 36)
      const midiNote = 36 + i;
      key.userData = { 
        note: midiNote, 
        type: 'white',
        originalY: key.position.y
      };
      
      pianoGroup.add(key);
      whiteKeysRef.current.push(key);
      
      // Add note labels if enabled
      if (showNoteNames) {
        const noteInfo = getNoteInfo(midiNote);
        const isMiddleC = noteInfo.displayName === 'C4';
        
        // Only show some note labels to avoid clutter
        if (noteInfo.name === 'C' || isMiddleC) {
          const labelSprite = createNoteLabel(midiNote, key.position.clone(), pianoGroup);
          noteLabelSprites.push(labelSprite);
        }
      }
    });

    // Create black keys with subtle shine
    const blackKeyGeometry = new THREE.BoxGeometry(blackKeyWidth, 0.12, blackKeyLength);
    const blackKeyPattern = [1, 1, 0, 1, 1, 1, 0]; // 1 for black key, 0 for gap
    
    let blackKeyIndex = 0;
    whiteKeyPositions.forEach((x, i) => {
      if (blackKeyPattern[i % 7]) {
        const key = new THREE.Mesh(blackKeyGeometry, blackMaterial.clone());
        key.position.set(
          x + (whiteKeyWidth / 2) - (whiteKeyPositions.length * whiteKeyWidth) / 2,
          0.05,
          -(whiteKeyLength - blackKeyLength) / 2
        );
        key.receiveShadow = true;
        key.castShadow = true;
        
        // Calculate the MIDI note number
        const midiNote = 37 + blackKeyIndex;
        key.userData = { 
          note: midiNote, 
          type: 'black',
          originalY: key.position.y
        };
        
        pianoGroup.add(key);
        blackKeysRef.current.push(key);
        blackKeyIndex++;
      }
    });

    // Responsive handling
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Handle mouse clicks with proper release
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current || !camera || !scene) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      const allKeys = [...whiteKeysRef.current, ...blackKeysRef.current];
      const intersects = raycaster.intersectObjects(allKeys, false);
      
      if (intersects.length > 0) {
        const keyMesh = intersects[0].object as THREE.Mesh;
        const note = keyMesh.userData.note as number;
        
        // If note is already active, turn it off, otherwise turn it on
        if (activeNotes.has(note)) {
          onNoteOff(note);
        } else {
          onNoteOn(note, 100);
          
          // Automatically release the note after a short delay for UI clicks
          setTimeout(() => {
            onNoteOff(note);
          }, 300);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      requestAnimationFrame(animate);
      
      // Update key appearance and position based on active state
      whiteKeysRef.current.forEach(key => {
        const material = key.material as THREE.MeshStandardMaterial;
        const note = key.userData.note as number;
        const isActive = activeNotes.has(note);
        
        // Update key position
        const originalY = key.userData.originalY || 0;
        key.position.y = isActive ? originalY - 0.05 : originalY;
        
        // Update key color based on active state
        if (isActive) {
          // Get note color based on note name
          const noteInfo = getNoteInfo(note);
          material.color.set(noteInfo.color);
          material.emissive.set(noteInfo.color);
          material.emissiveIntensity = 0.5;
        } else if (expectedNotes.includes(note)) {
          // Highlight expected notes in exercise mode
          material.color.set(0x66aaff);
          material.emissive.set(0x66aaff);
          material.emissiveIntensity = 0.3;
        } else if (highlightedKeys.has(note)) {
          // Highlighted keys (for scales, chords)
          material.color.set(0x66ffaa);
          material.emissive.set(0x66ffaa);
          material.emissiveIntensity = 0.2;
        } else {
          // Default state
          material.color.set(0xfafafa);
          material.emissive.set(0x000000);
          material.emissiveIntensity = 0;
        }
      });
      
      blackKeysRef.current.forEach(key => {
        const material = key.material as THREE.MeshStandardMaterial;
        const note = key.userData.note as number;
        
        if (activeNotes.has(note)) {
          const noteInfo = getNoteInfo(note);
          material.color.set(noteInfo.color);
          material.emissive.set(noteInfo.color);
          material.emissiveIntensity = 0.5;
        } else if (expectedNotes.includes(note)) {
          material.color.set(0x66aaff);
          material.emissive.set(0x66aaff);
          material.emissiveIntensity = 0.3;
        } else if (highlightedKeys.has(note)) {
          material.color.set(0x66ffaa);
          material.emissive.set(0x66ffaa);
          material.emissiveIntensity = 0.2;
        } else {
          material.color.set(0x111111);
          material.emissive.set(0x000000);
          material.emissiveIntensity = 0;
        }
      });
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      
      scene.clear();
      renderer.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      whiteKeysRef.current = [];
      blackKeysRef.current = [];
      setNoteLabelSprites([]);
    };
  }, [keyboardView, showNoteNames, showFingerNumbers, activeNotes, expectedNotes]);

  // Method to highlight keys (for scales, chords, etc.)
  const highlightKeys = (notes: number[]) => {
    setHighlightedKeys(new Set(notes));
  };

  // Clear highlighted keys
  const clearHighlightedKeys = () => {
    setHighlightedKeys(new Set());
  };

  return (
    <div className="relative w-full h-full">
      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="absolute top-16 right-4 bg-[#1a1a1a] border border-white/10 rounded-md p-4 z-20 shadow-xl">
          <h3 className="text-white text-sm font-medium mb-3">Keyboard Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white/70 text-sm">Show Note Names</label>
              <input 
                type="checkbox" 
                checked={showNoteNames}
                onChange={(e) => setShowNoteNames(e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-white/70 text-sm">Show Finger Numbers</label>
              <input 
                type="checkbox" 
                checked={showFingerNumbers}
                onChange={(e) => setShowFingerNumbers(e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-white/70 text-sm block">Keyboard View</label>
              <select
                value={keyboardView}
                onChange={(e) => setKeyboardView(e.target.value)}
                className="w-full bg-[#323232] text-white text-sm p-1 rounded border border-white/10"
              >
                <option value="perspective">Default View</option>
                <option value="top">Top-Down View</option>
                <option value="side">Side View</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="mt-4 px-3 py-1.5 w-full rounded bg-white/10 hover:bg-white/20 text-white text-sm"
          >
            Close
          </button>
        </div>
      )}

      {/* View Controls */}
      <div className="absolute top-4 right-4 flex gap-1 z-10">
        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        
        {/* View Toggle Buttons */}
        <div className="flex gap-1 bg-white/5 backdrop-blur-sm p-1 rounded-lg">
          <button
            onClick={() => {
              setKeyboardView('perspective');
              if (cameraRef.current) {
                cameraRef.current.position.set(0, 2, 12);
                cameraRef.current.lookAt(0, 0, 0);
                if (controlsRef.current) {
                  controlsRef.current.update();
                }
              }
            }}
            className={`p-2 rounded-full hover:bg-white/10 
              ${keyboardView === 'perspective' ? 'bg-white/20 text-white' : 'text-white/50'}`}
            title="Default View"
          >
            <Layers className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => {
              setKeyboardView('top');
              if (cameraRef.current) {
                cameraRef.current.position.set(0, 10, 0.1);
                cameraRef.current.lookAt(0, 0, 0);
                if (controlsRef.current) {
                  controlsRef.current.update();
                }
              }
            }}
            className={`p-2 rounded-full hover:bg-white/10 
              ${keyboardView === 'top' ? 'bg-white/20 text-white' : 'text-white/50'}`}
            title="Top View"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
        
        {/* Debug Console Toggle */}
        {showDebug && (
          <button
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70"
            title="Debug Console"
          >
            <Terminal className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Active Note Display */}
      <div className="absolute top-4 left-4 z-10">
        {Array.from(activeNotes).map(note => {
          const noteInfo = getNoteInfo(note);
          return (
            <div 
              key={note} 
              className="inline-block px-3 py-1.5 rounded mr-2 mb-2 text-white text-sm"
              style={{ 
                backgroundColor: `${noteInfo.color}40`,
                color: noteInfo.color,
                border: `1px solid ${noteInfo.color}60`
              }}
            >
              {noteInfo.displayName}
            </div>
          );
        })}
      </div>

      {/* Exercise Mode Display */}
      {exerciseMode && (
        <div className="absolute top-16 left-4 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg z-10">
          <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
            {exerciseMode} Mode
          </div>
          <div className="flex items-center gap-1">
            {expectedNotes.map(note => {
              const noteInfo = getNoteInfo(note);
              return (
                <div 
                  key={note} 
                  className="inline-block px-2 py-1 rounded text-white text-xs"
                  style={{ 
                    backgroundColor: `${noteInfo.color}40`,
                    color: noteInfo.color,
                    border: `1px solid ${noteInfo.color}60`
                  }}
                >
                  {noteInfo.displayName}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3D Keyboard container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center" 
        style={{ background: 'radial-gradient(circle, #1a1a1a 0%, #101010 100%)' }}
      />

      {/* Info Button */}
      <div className="absolute bottom-4 right-4 z-10">
        <button
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50"
          title="Keyboard Information"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 