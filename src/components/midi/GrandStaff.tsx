import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

interface GrandStaffProps {
  width: number;
  height: number;
  activeNotes: number[];
}

// Updated colors for better visibility
const STAFF_LINE_COLOR = 0xcccccc; // Lighter gray for better contrast
const NOTE_COLOR = 0x00ff88; // Bright cyan for notes
const BACKGROUND_COLOR = 0x1a1a1a; // Dark background
const TREBLE_STAFF_Y = 2;
const BASS_STAFF_Y = -2;
const LINE_SPACING = 0.2;

export const GrandStaff: React.FC<GrandStaffProps> = ({ width, height, activeNotes }) => {
  const linesRef = useRef<THREE.Group>(null);
  const notesRef = useRef<THREE.Group>(null);
  
  useThree();

  useEffect(() => {
    if (!linesRef.current) return;

    // Clear existing lines
    while (linesRef.current.children.length) {
      linesRef.current.remove(linesRef.current.children[0]);
    }

    // Add semi-transparent background panel
    const bgGeometry = new THREE.PlaneGeometry(width + 1, height + 1);
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: BACKGROUND_COLOR,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const background = new THREE.Mesh(bgGeometry, bgMaterial);
    background.position.z = -0.1;
    linesRef.current.add(background);

    // Draw treble staff lines with thicker geometry
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.PlaneGeometry(width, 0.02);
      const material = new THREE.MeshBasicMaterial({ color: STAFF_LINE_COLOR });
      const line = new THREE.Mesh(geometry, material);
      line.position.set(0, TREBLE_STAFF_Y + i * LINE_SPACING, 0);
      linesRef.current.add(line);
    }

    // Draw bass staff lines
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.PlaneGeometry(width, 0.02);
      const material = new THREE.MeshBasicMaterial({ color: STAFF_LINE_COLOR });
      const line = new THREE.Mesh(geometry, material);
      line.position.set(0, BASS_STAFF_Y + i * LINE_SPACING, 0);
      linesRef.current.add(line);
    }

    // Add middle C line
    const middleCGeometry = new THREE.PlaneGeometry(width / 2, 0.015);
    const middleCMaterial = new THREE.MeshBasicMaterial({ 
      color: STAFF_LINE_COLOR,
      opacity: 0.7,
      transparent: true
    });
    const middleCLine = new THREE.Mesh(middleCGeometry, middleCMaterial);
    middleCLine.position.set(0, 0, 0);
    linesRef.current.add(middleCLine);

    // Add clef indicators
    const trebleText = createTextSprite('𝄞', 0.8, STAFF_LINE_COLOR);
    trebleText.position.set(-width/2 - 0.5, TREBLE_STAFF_Y + LINE_SPACING * 2, 0);
    linesRef.current.add(trebleText);

    const bassText = createTextSprite('𝄢', 0.8, STAFF_LINE_COLOR);
    bassText.position.set(-width/2 - 0.5, BASS_STAFF_Y + LINE_SPACING * 2, 0);
    linesRef.current.add(bassText);
  }, [width, height]);

  useEffect(() => {
    if (!notesRef.current) return;

    // Clear existing notes
    while (notesRef.current.children.length) {
      notesRef.current.remove(notesRef.current.children[0]);
    }

    // Draw active notes with enhanced visuals
    activeNotes.forEach(midiNote => {
      // Create note head
      const noteGeometry = new THREE.CircleGeometry(0.15, 32);
      const noteMaterial = new THREE.MeshBasicMaterial({ 
        color: NOTE_COLOR,
        transparent: true,
        opacity: 0.9
      });
      const note = new THREE.Mesh(noteGeometry, noteMaterial);
      
      // Position note based on MIDI number
      const position = calculateNotePosition(midiNote);
      note.position.set(-width / 4, position, 0.1); // Slightly in front of staff
      
      notesRef.current?.add(note);

      // Add a glow effect
      const glowGeometry = new THREE.CircleGeometry(0.2, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: NOTE_COLOR,
        transparent: true,
        opacity: 0.3
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(note.position);
      glow.position.z -= 0.01;
      notesRef.current?.add(glow);
    });
  }, [activeNotes, width]);

  return (
    <group>
      <group ref={linesRef} />
      <group ref={notesRef} />
    </group>
  );
};

// Helper function to create text sprites for clefs
function createTextSprite(text: string, size: number, color: number) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;

  if (context) {
    context.font = '200px serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
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

// Helper function to calculate vertical position based on MIDI note number
function calculateNotePosition(midiNote: number): number {
  // Middle C (MIDI note 60) is the reference point
  const normalizedNote = (midiNote - 60) * LINE_SPACING / 2;
  
  // Notes above middle C go to treble staff, below to bass staff
  if (midiNote >= 60) {
    return TREBLE_STAFF_Y + normalizedNote;
  } else {
    return BASS_STAFF_Y + normalizedNote;
  }
}

export default GrandStaff; 