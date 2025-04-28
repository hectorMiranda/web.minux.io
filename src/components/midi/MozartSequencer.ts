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

  constructor(
    output: WebMidi.MIDIOutput,
    onNoteOn: (note: number) => void,
    onNoteOff: (note: number) => void
  ) {
    this.output = output;
    this.onNoteOn = onNoteOn;
    this.onNoteOff = onNoteOff;
  }

  async play() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.isPaused = false;
    this.startTime = Date.now() - this.pauseTime;
    
    // If we're resuming from a pause, continue from the current note
    if (this.currentNoteIndex > 0) {
      await this.playFromIndex(this.currentNoteIndex);
    } else {
      // Start from the beginning
      this.currentNoteIndex = 0;
      await this.playFromIndex(0);
    }
  }

  private async playFromIndex(startIndex: number) {
    this.currentNoteIndex = startIndex;
    
    for (let i = startIndex; i < MOZART_SEQUENCE.length; i++) {
      if (!this.isPlaying) break;
      
      // If paused, stop the current note and wait
      if (this.isPaused) {
        if (this.currentNote !== null) {
          this.output.send([0x80, this.currentNote, 0x00]); // Note Off
          this.onNoteOff(this.currentNote);
          this.currentNote = null;
        }
        this.pauseTime = Date.now() - this.startTime;
        return;
      }
      
      const { note, duration } = MOZART_SEQUENCE[i];
      this.currentNote = note;
      this.currentNoteIndex = i;
      
      // Play note
      this.output.send([0x90, note, 0x7f]); // Note On
      this.onNoteOn(note);

      // Wait for duration
      await new Promise<void>((resolve) => {
        this.currentTimeout = setTimeout(() => {
          // Stop note
          this.output.send([0x80, note, 0x00]); // Note Off
          this.onNoteOff(note);
          this.currentNote = null;
          resolve();
        }, duration);
      });

      // Small gap between notes
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // If we've reached the end and we're still playing (not paused), loop back to the beginning
    if (this.isPlaying && !this.isPaused) {
      this.currentNoteIndex = 0;
      await this.playFromIndex(0);
    } else {
      this.isPlaying = false;
    }
  }

  pause() {
    if (!this.isPlaying || this.isPaused) return;
    
    this.isPaused = true;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  resume() {
    if (!this.isPlaying || !this.isPaused) return;
    
    this.isPaused = false;
    this.playFromIndex(this.currentNoteIndex);
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentNoteIndex = 0;
    this.pauseTime = 0;
    
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    
    // Make sure to stop any currently playing note
    if (this.currentNote !== null) {
      this.output.send([0x80, this.currentNote, 0x00]); // Note Off
      this.onNoteOff(this.currentNote);
      this.currentNote = null;
    }
  }
} 