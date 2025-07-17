'use client';

import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Music, Settings, Terminal, Play, Pause } from 'lucide-react';

interface MIDIKeyboardProps {
  selectedOutput: WebMidi.MIDIOutput | null;
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
}

// Mozart pieces data
const MOZART_PIECES = [
  {
    id: 'eine-kleine-1',
    title: 'Eine Kleine Nachtmusik - 1st Movement',
    notes: [
      { note: 64, velocity: 100, duration: 300 },  // E4
      { note: 62, velocity: 100, duration: 150 },  // D4
      { note: 60, velocity: 100, duration: 150 },  // C4
      { note: 62, velocity: 100, duration: 300 },  // D4
      { note: 64, velocity: 100, duration: 300 },  // E4
      { note: 64, velocity: 100, duration: 300 },  // E4
      { note: 64, velocity: 100, duration: 600 },  // E4
      
      { note: 62, velocity: 100, duration: 300 },  // D4
      { note: 62, velocity: 100, duration: 300 },  // D4
      { note: 62, velocity: 100, duration: 600 },  // D4
      
      { note: 64, velocity: 100, duration: 300 },  // E4
      { note: 67, velocity: 100, duration: 300 },  // G4
      { note: 67, velocity: 100, duration: 600 },  // G4
      
      { note: 64, velocity: 100, duration: 300 },  // E4
      { note: 62, velocity: 100, duration: 150 },  // D4
      { note: 60, velocity: 100, duration: 150 },  // C4
      { note: 62, velocity: 100, duration: 300 },  // D4
      { note: 64, velocity: 100, duration: 300 },  // E4
      { note: 64, velocity: 100, duration: 300 },  // E4
      { note: 64, velocity: 100, duration: 600 },  // E4
      
      { note: 62, velocity: 100, duration: 300 },  // D4
      { note: 62, velocity: 100, duration: 300 },  // D4
      { note: 64, velocity: 100, duration: 300 },  // E4
      { note: 62, velocity: 100, duration: 300 },  // D4
      { note: 60, velocity: 100, duration: 600 },  // C4
    ]
  }
];

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

export default function MIDIKeyboard({
  selectedOutput,
  onNoteOn,
  onNoteOff
}: MIDIKeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(MOZART_PIECES[0]);
  const [midiOutputs, setMidiOutputs] = useState<WebMidi.MIDIOutput[]>([]);
  const [currentMidiOutput, setCurrentMidiOutput] = useState<WebMidi.MIDIOutput | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const whiteKeysRef = useRef<THREE.Mesh[]>([]);
  const blackKeysRef = useRef<THREE.Mesh[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentNoteIndexRef = useRef(0);

  // Initialize MIDI
  useEffect(() => {
    const initMIDI = async () => {
      if (navigator.requestMIDIAccess) {
        try {
          const midiAccess = await navigator.requestMIDIAccess();
          const outputs = Array.from(midiAccess.outputs.values());
          setMidiOutputs(outputs);
          
          if (outputs.length > 0) {
            setCurrentMidiOutput(outputs[0]);
          }
          
          console.log('MIDI outputs:', outputs.map(o => o.name));
          
          // Monitor MIDI connection state changes
          midiAccess.onstatechange = (e) => {
            console.log('MIDI state change:', e);
            setMidiOutputs(Array.from(midiAccess.outputs.values()));
          };
        } catch (err) {
          console.error('Failed to access MIDI devices:', err);
        }
      } else {
        console.warn('WebMIDI is not supported in this browser');
      }
    };
    
    initMIDI();
  }, []);

  // Handle key press with animation
  const handleKeyPress = (note: number) => {
    if (activeKeys.has(note)) {
      if (currentMidiOutput) {
        currentMidiOutput.send([0x80, note, 0x00]); // Note off
      }
      onNoteOff(note);
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    } else {
      if (currentMidiOutput) {
        currentMidiOutput.send([0x90, note, 0x7f]); // Note on, full velocity
      }
      onNoteOn(note, 100);
      setActiveKeys(prev => new Set(prev).add(note));
      
      // Animate key press
      const isBlackKey = [1, 3, 6, 8, 10].includes(note % 12);
      const keyIndex = isBlackKey 
        ? blackKeysRef.current.findIndex(key => key.userData.note === note)
        : whiteKeysRef.current.findIndex(key => key.userData.note === note);
      
      const keyToAnimate = isBlackKey 
        ? blackKeysRef.current[keyIndex]
        : whiteKeysRef.current[keyIndex];
        
      if (keyToAnimate) {
        // Save original position
        const originalY = keyToAnimate.position.y;
        
        // Move down
        keyToAnimate.position.y -= 0.05;
        
        // Animate back up
        setTimeout(() => {
          if (keyToAnimate) {
            keyToAnimate.position.y = originalY;
          }
        }, 150);
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
    scene.background = new THREE.Color('#1a1a1a');

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
    
    // Position camera to show full keyboard
    camera.position.set(0, 2, 12);
    camera.lookAt(0, 0, 0);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
    containerRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.target.set(0, 0, 0);
    controls.update();

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Add staff lines at the top
    const staffPosition = new THREE.Vector3(0, 4, -2);
    const staffRotation = new THREE.Euler(-0.1, 0, 0);
    const staffGroup = new THREE.Group();
    staffGroup.position.copy(staffPosition);
    staffGroup.rotation.copy(staffRotation);

    // Add semi-transparent background panel for the staff
    const bgGeometry = new THREE.PlaneGeometry(14, 3);
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a1a1a,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const background = new THREE.Mesh(bgGeometry, bgMaterial);
    background.position.z = -0.1;
    staffGroup.add(background);

    // Draw staff lines
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.PlaneGeometry(14, 0.02);
      const material = new THREE.MeshBasicMaterial({ color: 0xcccccc, opacity: 0.5, transparent: true });
      const line = new THREE.Mesh(geometry, material);
      line.position.y = 0.8 - (i * 0.2);
      staffGroup.add(line);
    }

    // Draw second staff lines
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.PlaneGeometry(14, 0.02);
      const material = new THREE.MeshBasicMaterial({ color: 0xcccccc, opacity: 0.5, transparent: true });
      const line = new THREE.Mesh(geometry, material);
      line.position.y = -0.4 - (i * 0.2);
      staffGroup.add(line);
    }

    // Add clef symbols
    const trebleClef = createTextSprite('𝄞', 1.2, new THREE.Color(0xcccccc));
    trebleClef.position.set(-6, 0.6, 0.1);
    staffGroup.add(trebleClef);

    const bassClef = createTextSprite('𝄢', 1.2, new THREE.Color(0xcccccc));
    bassClef.position.set(-6, -0.8, 0.1);
    staffGroup.add(bassClef);

    scene.add(staffGroup);

    // Create piano group to offset the keyboard
    const pianoGroup = new THREE.Group();
    pianoGroup.position.set(-2, 0, 0); // Adjust position to center the keyboard
    scene.add(pianoGroup);

    // Create materials
    const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    // Create white keys
    const whiteKeyGeometry = new THREE.BoxGeometry(whiteKeyWidth * 0.95, 0.1, whiteKeyLength);
    const whiteKeyPositions = Array.from({ length: 52 }, (_, i) => i * whiteKeyWidth);
    
    whiteKeyPositions.forEach((x, i) => {
      const key = new THREE.Mesh(whiteKeyGeometry, whiteMaterial.clone());
      key.position.set(x - (whiteKeyPositions.length * whiteKeyWidth) / 2, 0, 0);
      key.userData = { note: 36 + i };
      pianoGroup.add(key);
      whiteKeysRef.current.push(key);
    });

    // Create black keys
    const blackKeyGeometry = new THREE.BoxGeometry(blackKeyWidth, 0.1, blackKeyLength);
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
        key.userData = { note: 37 + blackKeyIndex };
        pianoGroup.add(key);
        blackKeysRef.current.push(key);
        blackKeyIndex++;
      }
    });

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);
    
    // Initial resize to ensure everything fits
    handleResize();

    // Raycaster for mouse clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Handle mouse clicks
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
        handleKeyPress(note);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      requestAnimationFrame(animate);
      
      // Update key colors based on active state
      whiteKeysRef.current.forEach(key => {
        const material = key.material as THREE.MeshStandardMaterial;
        material.color.set(activeKeys.has(key.userData.note) ? 0x4a9eff : 0xffffff);
      });
      
      blackKeysRef.current.forEach(key => {
        const material = key.material as THREE.MeshStandardMaterial;
        material.color.set(activeKeys.has(key.userData.note) ? 0x4a9eff : 0x000000);
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
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      scene.clear();
      renderer.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      whiteKeysRef.current = [];
      blackKeysRef.current = [];
    };
  }, []);

  // Function to play the selected melody
  const playMelody = () => {
    if (!selectedPiece || isPlaying) return;
    
    setIsPlaying(true);
    setIsPaused(false);
    currentNoteIndexRef.current = 0;
    
    const playNote = (index: number) => {
      if (index >= selectedPiece.notes.length) {
        setIsPlaying(false);
        return;
      }
      
      const noteData = selectedPiece.notes[index];
      handleKeyPress(noteData.note);
      
      // Schedule note off
      setTimeout(() => {
        if (activeKeys.has(noteData.note)) {
          handleKeyPress(noteData.note); // Toggle off
        }
      }, noteData.duration);
      
      // Schedule next note
      const nextDelay = noteData.duration;
      timeoutRef.current = setTimeout(() => {
        playNote(index + 1);
      }, nextDelay);
      
      currentNoteIndexRef.current = index + 1;
    };
    
    playNote(0);
  };

  // Function to pause playback
  const pauseMelody = () => {
    if (!isPlaying || isPaused) return;
    
    setIsPaused(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Function to resume playback
  const resumeMelody = () => {
    if (!isPaused) return;
    
    setIsPaused(false);
    
    const currentIndex = currentNoteIndexRef.current;
    if (currentIndex < selectedPiece.notes.length) {
      const playNote = (index: number) => {
        if (index >= selectedPiece.notes.length) {
          setIsPlaying(false);
          return;
        }
        
        const noteData = selectedPiece.notes[index];
        handleKeyPress(noteData.note);
        
        // Schedule note off
        setTimeout(() => {
          if (activeKeys.has(noteData.note)) {
            handleKeyPress(noteData.note); // Toggle off
          }
        }, noteData.duration);
        
        // Schedule next note
        const nextDelay = noteData.duration;
        timeoutRef.current = setTimeout(() => {
          playNote(index + 1);
        }, nextDelay);
        
        currentNoteIndexRef.current = index + 1;
      };
      
      playNote(currentIndex);
    }
  };

  // Function to stop playback
  const stopMelody = () => {
    if (!isPlaying && !isPaused) return;
    
    setIsPlaying(false);
    setIsPaused(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Clear all active keys
    const keysToTurnOff = Array.from(activeKeys);
    keysToTurnOff.forEach(note => {
      if (activeKeys.has(note)) {
        handleKeyPress(note); // Toggle off
      }
    });
    
    currentNoteIndexRef.current = 0;
  };

  return (
    <div className="relative w-full h-full">
      {/* MIDI Status */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
          <div className={`w-2 h-2 rounded-full ${currentMidiOutput ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-white/70">
            {currentMidiOutput ? currentMidiOutput.name : 'No MIDI Output'}
          </span>
        </div>
        
        {midiOutputs.length > 0 && (
          <select 
            className="bg-[#1e3a8a] text-white px-3 py-1 rounded-md border border-white/10 text-sm"
            value={currentMidiOutput?.id || ''}
            onChange={(e) => {
              const output = midiOutputs.find(o => o.id === e.target.value);
              if (output) {
                setCurrentMidiOutput(output);
              }
            }}
          >
            {midiOutputs.map(output => (
              <option key={output.id} value={output.id}>
                {output.name || output.id}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Quick Notes - moved to top */}
      <div className="absolute top-4 flex gap-1 z-10" style={{ left: '390px' }}>
        {['C4', 'E4', 'G4', 'C5'].map((label, i) => {
          const note = 60 + (i === 1 ? 4 : (i === 2 ? 7 : i === 3 ? 12 : 0)); // C4, E4, G4, C5
          return (
            <button
              key={label}
              onClick={() => handleKeyPress(note)}
              className="px-3 py-1.5 rounded bg-[#00ff88]/10 hover:bg-[#00ff88]/20 text-[#00ff88] text-sm flex items-center gap-2"
            >
              <Music className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* View Control Buttons */}
      <div className="absolute top-4 right-4 flex gap-1 bg-white/5 backdrop-blur-sm px-2 py-1 rounded-lg z-10">
        <button
          onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.position.set(0, 2, 12);
              cameraRef.current.lookAt(0, 0, 0);
              if (controlsRef.current) {
                controlsRef.current.update();
              }
            }
          }}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 text-sm"
          title="Reset View"
        >
          Reset
        </button>
        <button
          onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.position.set(0, 10, 0.1);
              cameraRef.current.lookAt(0, 0, 0);
              if (controlsRef.current) {
                controlsRef.current.update();
              }
            }
          }}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 text-sm"
          title="Top View"
        >
          Top
        </button>
        <button
          onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.position.set(10, 0.1, 0.1);
              cameraRef.current.lookAt(0, 0, 0);
              if (controlsRef.current) {
                controlsRef.current.update();
              }
            }
          }}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 text-sm"
          title="Side View"
        >
          Side
        </button>
        <button
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.enabled = !controlsRef.current.enabled;
            }
          }}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 text-sm"
          title="Lock/Unlock Camera"
        >
          Lock
        </button>
        <button
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 text-sm"
          title="Close View Controls"
        >
          Close
        </button>
      </div>

      {/* 3D Keyboard container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center" 
        style={{ background: '#1a1a1a' }}
      />

      {/* Mozart Player Controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 z-10">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-[#00ff88]" />
          <select
            className="bg-[#1e3a8a] text-white px-3 py-1 rounded-md border border-white/10 text-sm min-w-[200px]"
            onChange={(e) => {
              const piece = MOZART_PIECES.find(p => p.id === e.target.value);
              if (piece) {
                stopMelody();
                setSelectedPiece(piece);
              }
            }}
            value={selectedPiece?.id || ''}
            disabled={isPlaying || isPaused}
          >
            {MOZART_PIECES.map((piece) => (
              <option key={piece.id} value={piece.id}>
                {piece.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={stopMelody}
            disabled={!isPlaying && !isPaused}
            className={`p-2 rounded-full bg-[#1e3a8a]/50 hover:bg-[#1e3a8a] text-white/70 hover:text-white transition-all
              ${(!isPlaying && !isPaused) && 'opacity-50 cursor-not-allowed'}`}
            title="Stop and Reset"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="16" height="16" rx="2" />
            </svg>
          </button>
          
          <button
            onClick={isPaused ? resumeMelody : (isPlaying ? pauseMelody : playMelody)}
            className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all
              ${isPlaying && !isPaused
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20'}`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : isPaused ? (
              <>
                <Play className="w-4 h-4" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 