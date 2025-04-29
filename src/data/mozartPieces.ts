export interface MozartNote {
  note: number;
  duration: number;  // in milliseconds
}

export interface MozartPiece {
  id: string;
  title: string;
  tempo: number;  // BPM
  sequence: MozartNote[];
}

export const MOZART_PIECES: MozartPiece[] = [
  {
    id: "eine_kleine",
    title: "Eine Kleine Nachtmusik - 1st Movement",
    tempo: 120,
    sequence: [
      // Main theme
      { note: 67, duration: 300 }, // G4
      { note: 67, duration: 300 }, // G4
      { note: 67, duration: 300 }, // G4
      { note: 67, duration: 300 }, // G4
      { note: 74, duration: 600 }, // D5
      { note: 72, duration: 600 }, // C5
      { note: 71, duration: 300 }, // B4
      { note: 69, duration: 300 }, // A4
      { note: 67, duration: 600 }, // G4
      // Second phrase
      { note: 76, duration: 300 }, // E5
      { note: 76, duration: 300 }, // E5
      { note: 76, duration: 300 }, // E5
      { note: 76, duration: 300 }, // E5
      { note: 77, duration: 600 }, // F5
      { note: 74, duration: 600 }, // D5
      { note: 72, duration: 300 }, // C5
      { note: 71, duration: 300 }, // B4
      { note: 69, duration: 600 }, // A4
    ]
  },
  {
    id: "turkish_march",
    title: "Turkish March (Rondo Alla Turca)",
    tempo: 130,
    sequence: [
      // Main theme
      { note: 76, duration: 200 }, // E5
      { note: 75, duration: 200 }, // Eb5
      { note: 76, duration: 200 }, // E5
      { note: 75, duration: 200 }, // Eb5
      { note: 76, duration: 200 }, // E5
      { note: 71, duration: 200 }, // B4
      { note: 74, duration: 200 }, // D5
      { note: 72, duration: 200 }, // C5
      { note: 69, duration: 400 }, // A4
      // Second part
      { note: 60, duration: 200 }, // C4
      { note: 64, duration: 200 }, // E4
      { note: 69, duration: 200 }, // A4
      { note: 71, duration: 400 }, // B4
      { note: 72, duration: 200 }, // C5
      { note: 74, duration: 400 }, // D5
    ]
  },
  {
    id: "symphony_40",
    title: "Symphony No. 40 - 1st Movement",
    tempo: 120,
    sequence: [
      // Main theme
      { note: 70, duration: 400 }, // Bb4
      { note: 73, duration: 400 }, // Db5
      { note: 71, duration: 200 }, // B4
      { note: 70, duration: 200 }, // Bb4
      { note: 68, duration: 400 }, // Ab4
      { note: 66, duration: 400 }, // Gb4
      { note: 65, duration: 200 }, // F4
      { note: 63, duration: 200 }, // Eb4
      { note: 61, duration: 400 }, // Db4
      // Response
      { note: 70, duration: 400 }, // Bb4
      { note: 73, duration: 400 }, // Db5
      { note: 71, duration: 200 }, // B4
      { note: 70, duration: 200 }, // Bb4
      { note: 75, duration: 400 }, // Eb5
      { note: 73, duration: 400 }, // Db5
    ]
  }
]; 