export interface MozartPiece {
  id: string;
  title: string;
  notes: Array<{
    note: number;
    velocity: number;
    duration: number;
    delay?: number;
  }>;
}

export const MOZART_PIECES: MozartPiece[] = [
  {
    id: 'eine-kleine-1',
    title: 'Eine Kleine Nachtmusik - 1st Movement',
    notes: [
      { note: 60, velocity: 100, duration: 500 },
      { note: 62, velocity: 100, duration: 500, delay: 500 },
      // Add more notes as needed
    ]
  },
  // Add more pieces as needed
]; 