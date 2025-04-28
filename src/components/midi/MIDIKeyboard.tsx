'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface MIDIKeyboardProps {
  selectedOutput: WebMidi.MIDIOutput | null;
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
}

const NOTES = [
  { note: 60, name: 'C4', color: 'white', position: 0 },
  { note: 61, name: 'C#4', color: 'black', position: 0.7 },
  { note: 62, name: 'D4', color: 'white', position: 1 },
  { note: 63, name: 'D#4', color: 'black', position: 1.7 },
  { note: 64, name: 'E4', color: 'white', position: 2 },
  { note: 65, name: 'F4', color: 'white', position: 3 },
  { note: 66, name: 'F#4', color: 'black', position: 3.7 },
  { note: 67, name: 'G4', color: 'white', position: 4 },
  { note: 68, name: 'G#4', color: 'black', position: 4.7 },
  { note: 69, name: 'A4', color: 'white', position: 5 },
  { note: 70, name: 'A#4', color: 'black', position: 5.7 },
  { note: 71, name: 'B4', color: 'white', position: 6 },
  { note: 72, name: 'C5', color: 'white', position: 7 },
];

export function MIDIKeyboard({ selectedOutput, onNoteOn, onNoteOff }: MIDIKeyboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const keysRef = useRef<THREE.Mesh[]>([]);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  const playNote = (note: number) => {
    if (selectedOutput) {
      selectedOutput.send([0x90, note, 0x7f]); // Note On
      onNoteOn(note);
    }
  };

  const stopNote = (note: number) => {
    if (selectedOutput) {
      selectedOutput.send([0x80, note, 0x00]); // Note Off
      onNoteOff(note);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing renderer
    if (rendererRef.current) {
      containerRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a192f);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 8);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create piano keys
    keysRef.current = [];
    NOTES.forEach((noteInfo) => {
      const geometry = noteInfo.color === 'white'
        ? new THREE.BoxGeometry(0.8, 0.2, 3)
        : new THREE.BoxGeometry(0.5, 0.4, 2);

      const material = new THREE.MeshPhongMaterial({
        color: noteInfo.color === 'white' ? 0xffffff : 0x000000,
        emissive: 0x000000
      });

      const key = new THREE.Mesh(geometry, material);
      key.position.x = noteInfo.position - 3.5;
      key.position.y = noteInfo.color === 'black' ? 0.1 : 0;
      key.position.z = noteInfo.color === 'black' ? -0.5 : 0;
      
      // Store note info on the mesh
      (key as any).noteInfo = noteInfo;

      scene.add(key);
      keysRef.current.push(key);
    });

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;

    // Click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(keysRef.current);

      if (intersects.length > 0) {
        const key = intersects[0].object as THREE.Mesh;
        const noteInfo = (key as any).noteInfo;
        if (noteInfo) {
          playNote(noteInfo.note);
          (key.material as THREE.MeshPhongMaterial).emissive.setHex(0x666666);
          setActiveNotes(prev => new Set(prev).add(noteInfo.note));
        }
      }
    };

    const handleMouseUp = () => {
      activeNotes.forEach(note => {
        stopNote(note);
        const key = keysRef.current.find(k => (k as any).noteInfo.note === note);
        if (key) {
          (key.material as THREE.MeshPhongMaterial).emissive.setHex(0x000000);
        }
      });
      setActiveNotes(new Set());
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mouseleave', handleMouseUp);
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('mouseleave', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
    };
  }, [selectedOutput]); // Only recreate when selectedOutput changes

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
    </div>
  );
}

export default MIDIKeyboard; 