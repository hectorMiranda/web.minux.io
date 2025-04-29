import { MozartPiece, MozartNote } from '../../data/mozartPieces';

interface Note {
  note: number;
  duration: number; // in milliseconds
}

// Eine Kleine Nachtmusik - First movement (Allegro)
const MOZART_SEQUENCE: Note[] = [
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
  { note: 67, duration: 300 }, // G4
  { note: 67, duration: 300 }, // G4
  { note: 67, duration: 300 }, // G4
  { note: 67, duration: 300 }, // G4
  { note: 74, duration: 600 }, // D5
  { note: 72, duration: 600 }, // C5
  { note: 71, duration: 300 }, // B4
  { note: 69, duration: 300 }, // A4
  { note: 67, duration: 600 }, // G4
  
  // Bridge section
  { note: 67, duration: 300 }, // G4
  { note: 67, duration: 300 }, // G4
  { note: 67, duration: 300 }, // G4
  { note: 67, duration: 300 }, // G4
  { note: 74, duration: 600 }, // D5
  { note: 72, duration: 600 }, // C5
  { note: 71, duration: 300 }, // B4
  { note: 69, duration: 300 }, // A4
  { note: 67, duration: 600 }, // G4
  
  // Final section
  { note: 67, duration: 300 }, // G4
  { note: 67, duration: 300 }, // G4
  { note: 67, duration: 300 }, // G4
  { note: 67, duration: 300 }, // G4
  { note: 74, duration: 600 }, // D5
  { note: 72, duration: 600 }, // C5
  { note: 71, duration: 300 }, // B4
  { note: 69, duration: 300 }, // A4
  { note: 67, duration: 600 }, // G4
];

export class MozartSequencer {
  private output: WebMidi.MIDIOutput;
  private onNoteOn: (note: number) => void;
  private onNoteOff: (note: number) => void;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private currentTimeout: NodeJS.Timeout | null = null;
  private currentNoteIndex: number = 0;
  private currentNote: number | null = null;
  private startTime: number = 0;
  private pauseTime: number = 0;
  private currentPiece: MozartPiece | null = null;

  constructor(
    output: WebMidi.MIDIOutput,
    onNoteOn: (note: number) => void,
    onNoteOff: (note: number) => void
  ) {
    this.output = output;
    this.onNoteOn = onNoteOn;
    this.onNoteOff = onNoteOff;
  }

  setPiece(piece: MozartPiece) {
    this.currentPiece = piece;
    this.reset();
  }

  private reset() {
    this.currentNoteIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.startTime = 0;
    this.pauseTime = 0;
    if (this.currentNote !== null) {
      this.output.send([0x80, this.currentNote, 0]);
      this.onNoteOff(this.currentNote);
      this.currentNote = null;
    }
  }

  async play() {
    if (!this.currentPiece) return;
    
    if (this.isPaused) {
      this.resume();
      return;
    }

    this.reset();
    this.isPlaying = true;
    this.startTime = performance.now();

    await this.playNextNote();
  }

  private async playNextNote() {
    if (!this.isPlaying || !this.currentPiece) return;

    const sequence = this.currentPiece.sequence;
    if (this.currentNoteIndex >= sequence.length) {
      this.isPlaying = false;
      return;
    }

    const note = sequence[this.currentNoteIndex];
    
    // Stop previous note if any
    if (this.currentNote !== null) {
      this.output.send([0x80, this.currentNote, 0]);
      this.onNoteOff(this.currentNote);
    }

    // Play current note
    this.currentNote = note.note;
    this.output.send([0x90, note.note, 100]);
    this.onNoteOn(note.note);

    // Schedule next note
    this.currentTimeout = setTimeout(async () => {
      if (this.isPlaying) {  // Only proceed if still playing
        this.currentNoteIndex++;
        await this.playNextNote();
      }
    }, note.duration);
  }

  pause() {
    if (!this.isPlaying) return;
    
    this.isPaused = true;
    this.isPlaying = false;
    this.pauseTime = performance.now();
    
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }

    if (this.currentNote !== null) {
      this.output.send([0x80, this.currentNote, 0]);
      this.onNoteOff(this.currentNote);
      this.currentNote = null;
    }
  }

  resume() {
    if (!this.isPaused || !this.currentPiece) return;
    
    this.isPaused = false;
    this.isPlaying = true;
    
    // Calculate the elapsed time since pause
    const elapsedTime = performance.now() - this.pauseTime;
    
    // Adjust the start time to account for the pause duration
    this.startTime += elapsedTime;
    
    // Continue playing from where we left off
    this.playNextNote();
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }

    if (this.currentNote !== null) {
      this.output.send([0x80, this.currentNote, 0]);
      this.onNoteOff(this.currentNote);
      this.currentNote = null;
    }

    this.reset();
  }

  isCurrentlyPlaying() {
    return this.isPlaying;
  }

  isCurrentlyPaused() {
    return this.isPaused;
  }
} 