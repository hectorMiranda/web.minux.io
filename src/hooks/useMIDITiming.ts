import { useState, useEffect, useCallback } from 'react';

interface TimingOptions {
  bpm: number;
}

export function useMIDITiming(options: TimingOptions = { bpm: 120 }) {
  const { bpm = 120 } = options;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [totalBeats, setTotalBeats] = useState(0);
  
  // Calculate note duration in milliseconds based on BPM
  const getNoteDuration = useCallback((beatValue: number = 1) => {
    // Quarter note duration in ms = (60 seconds / BPM) * 1000
    const quarterNoteMs = (60 / bpm) * 1000;
    return quarterNoteMs * beatValue;
  }, [bpm]);
  
  // Schedule a sequence of notes
  const scheduleNotes = useCallback((
    notes: Array<{ note: number, duration: number, velocity?: number, delay?: number }>,
    onNoteOn: (note: number, velocity: number) => void,
    onNoteOff: (note: number) => void
  ) => {
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentBeat(0);
    setTotalBeats(notes.length);
    
    let cumulativeDelay = 0;
    const timeouts: NodeJS.Timeout[] = [];
    
    notes.forEach((noteData, index) => {
      const velocity = noteData.velocity ?? 100;
      const delay = noteData.delay ?? 0;
      
      // Add delay before playing note
      cumulativeDelay += delay;
      
      // Note on
      const noteOnTimeout = setTimeout(() => {
        onNoteOn(noteData.note, velocity);
        setCurrentBeat(index + 1);
      }, cumulativeDelay);
      
      timeouts.push(noteOnTimeout);
      
      // Note off
      const noteOffTimeout = setTimeout(() => {
        onNoteOff(noteData.note);
        
        // Check if this is the last note
        if (index === notes.length - 1) {
          setIsPlaying(false);
        }
      }, cumulativeDelay + noteData.duration);
      
      timeouts.push(noteOffTimeout);
      
      // Increment cumulative delay for next note
      cumulativeDelay += noteData.duration;
    });
    
    // Return cleanup function to cancel all timeouts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);
  
  // Update BPM calculations when BPM changes
  useEffect(() => {
    // Re-calculate note durations if BPM changes during playback
  }, [bpm]);
  
  return {
    isPlaying,
    isPaused,
    currentBeat,
    totalBeats,
    getNoteDuration,
    scheduleNotes,
    setIsPlaying,
    setIsPaused
  };
}

export default useMIDITiming; 