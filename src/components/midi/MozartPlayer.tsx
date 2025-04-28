'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { MozartSequencer } from './MozartSequencer';

interface Note {
  note: number;
  duration: number; // in milliseconds
}

// Eine Kleine Nachtmusik main theme
const MOZART_SEQUENCE: Note[] = [
  // Eine Kleine Nachtmusik - First movement theme
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

interface MozartPlayerProps {
  selectedOutput: WebMidi.MIDIOutput | null;
  onPlayNote: (note: number) => void;
  onStopNote: (note: number) => void;
}

export function MozartPlayer({ selectedOutput, onPlayNote, onStopNote }: MozartPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const sequencerRef = useRef<MozartSequencer | null>(null);

  // Initialize or update sequencer when output changes
  useEffect(() => {
    if (selectedOutput) {
      sequencerRef.current = new MozartSequencer(
        selectedOutput,
        onPlayNote,
        onStopNote
      );
    } else {
      sequencerRef.current = null;
    }
  }, [selectedOutput, onPlayNote, onStopNote]);

  const handlePlay = useCallback(async () => {
    if (!sequencerRef.current || !selectedOutput) return;
    
    setIsPlaying(true);
    try {
      await sequencerRef.current.play();
    } finally {
      setIsPlaying(false);
    }
  }, [selectedOutput]);

  const handleStop = useCallback(() => {
    if (!sequencerRef.current) return;
    sequencerRef.current.stop();
    setIsPlaying(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sequencerRef.current) {
        sequencerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={isPlaying ? handleStop : handlePlay}
        disabled={!selectedOutput}
        className={`
          relative px-6 py-2 rounded-full flex items-center gap-2 transition-all
          ${isPlaying 
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
            : 'bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20'}
          ${!selectedOutput && 'opacity-50 cursor-not-allowed'}
          hover:scale-105
        `}
      >
        {isPlaying ? (
          <>
            <Pause className="w-5 h-5" />
            <span>Stop Mozart</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            <span>Play Mozart</span>
          </>
        )}
        
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full bg-[#00ff88] blur-lg transition-opacity ${isPlaying ? 'opacity-20' : 'opacity-0'}`} />
      </button>
    </div>
  );
}

export default MozartPlayer; 