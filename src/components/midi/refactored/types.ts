export type PracticeMode = 'free-play' | 'scales' | 'chords' | 'sight-reading' | 'intervals';

export interface DebugMessage {
  timestamp: Date;
  type: 'info' | 'error' | 'midi';
  message: string;
}

export interface MIDINote {
  note: number;
  velocity: number;
  duration: number;
  delay?: number;
}

export interface MozartNote {
  note: number;
  duration: number;
  velocity?: number;
}

export interface MozartPiece {
  id: string;
  title: string;
  tempo: number;  // BPM
  sequence: MozartNote[];
}

export interface ScaleExercise {
  name: string;
  notes: number[];
  root: number;
  type: 'major' | 'minor' | 'pentatonic' | 'blues';
}

export interface ChordExercise {
  name: string;
  notes: number[];
  root: number;
  type: 'major' | 'minor' | 'dominant7' | 'major7' | 'minor7';
}

export interface IntervalExercise {
  rootNote: number;
  intervalSize: number;
  intervalName: string;
}

export interface SightReadingExercise {
  notes: { note: number, duration: number }[];
  currentNote: number;
}

export type Exercise = ScaleExercise | ChordExercise | IntervalExercise | SightReadingExercise;
