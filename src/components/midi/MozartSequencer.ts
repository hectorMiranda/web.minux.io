export interface MozartNote {
  note: number;
  duration: number;
  velocity?: number;
}

export class MozartSequencer {
  private notes: MozartNote[];
  private currentIndex: number;
  private isPlaying: boolean;
  private isPaused: boolean;
  private tempo: number;
  private onNoteOn: (note: number) => void;
  private onNoteOff: (note: number) => void;
  private timeoutId: NodeJS.Timeout | null;

  constructor(
    notes: MozartNote[],
    tempo: number,
    onNoteOn: (note: number) => void,
    onNoteOff: (note: number) => void
  ) {
    this.notes = notes;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.tempo = tempo;
    this.onNoteOn = onNoteOn;
    this.onNoteOff = onNoteOff;
    this.timeoutId = null;
  }

  public async play(): Promise<void> {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.isPaused = false;
    await this.playNextNote();
  }

  public stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentIndex = 0;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  public pause(): void {
    if (!this.isPlaying) return;
    this.isPaused = true;
    this.isPlaying = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  public resume(): void {
    if (!this.isPaused) return;
    this.isPlaying = true;
    this.isPaused = false;
    this.playNextNote();
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  public setNotes(notes: MozartNote[]): void {
    this.stop();
    this.notes = notes;
  }

  private async playNextNote(): Promise<void> {
    if (!this.isPlaying || this.currentIndex >= this.notes.length) {
      this.stop();
      return;
    }

    const note = this.notes[this.currentIndex];
    this.onNoteOn(note.note);
    
    await new Promise<void>(resolve => {
      this.timeoutId = setTimeout(() => {
        this.onNoteOff(note.note);
        this.currentIndex++;
        resolve();
        this.playNextNote();
      }, note.duration * (60000 / (this.tempo * 4))); // Convert duration to milliseconds based on tempo
    });
  }
} 