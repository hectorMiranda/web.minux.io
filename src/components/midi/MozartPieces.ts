// Each note in a piece contains: note number, velocity, start time (in ms), duration (in ms)
interface MIDINote {
  note: number;
  velocity: number;
  time: number;
  duration: number;
}

interface MozartPiece {
  name: string;
  tempo: number; // BPM
  notes: MIDINote[];
}

export const MOZART_PIECES: MozartPiece[] = [
  {
    name: "Turkish March",
    tempo: 132,
    notes: [
      // Main theme - First measure
      { note: 76, velocity: 100, time: 0, duration: 200 },     // E5
      { note: 75, velocity: 95, time: 200, duration: 200 },    // Eb5
      { note: 76, velocity: 100, time: 400, duration: 200 },   // E5
      { note: 75, velocity: 95, time: 600, duration: 200 },    // Eb5
      { note: 76, velocity: 100, time: 800, duration: 200 },   // E5
      { note: 71, velocity: 90, time: 1000, duration: 200 },   // B4
      { note: 74, velocity: 95, time: 1200, duration: 200 },   // D5
      { note: 72, velocity: 90, time: 1400, duration: 200 },   // C5
      { note: 69, velocity: 85, time: 1600, duration: 400 },   // A4

      // Second measure
      { note: 60, velocity: 85, time: 2000, duration: 200 },   // C4
      { note: 64, velocity: 90, time: 2200, duration: 200 },   // E4
      { note: 69, velocity: 95, time: 2400, duration: 200 },   // A4
      { note: 71, velocity: 100, time: 2600, duration: 800 },  // B4

      // Continue with more detailed measures...
    ]
  },
  {
    name: "Symphony No. 40 in G minor",
    tempo: 120,
    notes: [
      // First theme
      { note: 67, velocity: 100, time: 0, duration: 400 },     // G4
      { note: 65, velocity: 95, time: 400, duration: 200 },    // F4
      { note: 65, velocity: 90, time: 600, duration: 800 },    // F4 (held)
      
      // Response
      { note: 63, velocity: 100, time: 1400, duration: 400 },  // Eb4
      { note: 62, velocity: 95, time: 1800, duration: 200 },   // D4
      { note: 62, velocity: 90, time: 2000, duration: 800 },   // D4 (held)

      // Continue with development...
    ]
  },
  {
    name: "Piano Sonata No. 11 in A major (K. 331)",
    tempo: 108,
    notes: [
      // Theme
      { note: 69, velocity: 90, time: 0, duration: 300 },      // A4
      { note: 71, velocity: 85, time: 300, duration: 300 },    // B4
      { note: 72, velocity: 95, time: 600, duration: 300 },    // C5
      { note: 74, velocity: 100, time: 900, duration: 300 },   // D5
      
      // Variation
      { note: 76, velocity: 100, time: 1200, duration: 150 },  // E5
      { note: 74, velocity: 90, time: 1350, duration: 150 },   // D5
      { note: 72, velocity: 85, time: 1500, duration: 300 },   // C5

      // Continue with variations...
    ]
  }
]; 