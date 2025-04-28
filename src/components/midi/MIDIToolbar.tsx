'use client';

import { Music, Play, Piano, Pause, Settings, Terminal, SkipBack } from 'lucide-react';
import { useEffect } from 'react';

interface MIDIToolbarProps {
  onPlayNote: (note: number) => void;
  onPlayMozart: () => void;
  onPauseMozart: () => void;
  onResumeMozart: () => void;
  onStopMozart: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  selectedOutput: WebMidi.MIDIOutput | null;
  midiAccess: WebMidi.MIDIAccess | null;
  onOutputSelect: (output: WebMidi.MIDIOutput) => void;
  onInitializeMIDI: () => void;
  onToggleSettings: () => void;
  onToggleDebug: () => void;
}

export function MIDIToolbar({ 
  onPlayNote, 
  onPlayMozart, 
  onPauseMozart,
  onResumeMozart,
  onStopMozart, 
  isPlaying,
  isPaused,
  selectedOutput,
  midiAccess,
  onOutputSelect,
  onInitializeMIDI,
  onToggleSettings,
  onToggleDebug
}: MIDIToolbarProps) {
  const commonNotes = [
    { note: 60, label: 'C4' },
    { note: 64, label: 'E4' },
    { note: 67, label: 'G4' },
    { note: 72, label: 'C5' },
  ];

  // Auto-select first output if there's only one
  useEffect(() => {
    if (midiAccess && !selectedOutput) {
      const outputs = Array.from(midiAccess.outputs.values());
      if (outputs.length === 1) {
        onOutputSelect(outputs[0]);
      }
    }
  }, [midiAccess, selectedOutput, onOutputSelect]);

  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-[#2D2D2D] border-b border-white/10 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-4">
        {/* MIDI Output Selection */}
        <div className="flex items-center gap-2">
          <Piano className="w-5 h-5 text-[#00ff88]" />
          {!midiAccess ? (
            <button
              onClick={onInitializeMIDI}
              className="bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20 px-4 py-1 rounded-md text-sm flex items-center gap-2"
            >
              Connect MIDI Devices
            </button>
          ) : (
            <select
              className="bg-[#1e3a8a] text-white px-3 py-1 rounded-md border border-white/10 text-sm"
              onChange={(e) => {
                const output = midiAccess?.outputs.get(e.target.value);
                if (output) onOutputSelect(output);
              }}
              value={selectedOutput?.id || ''}
            >
              <option value="">Select MIDI Output</option>
              {Array.from(midiAccess.outputs.values()).map((output) => (
                <option key={output.id} value={output.id}>
                  {output.name || output.id}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="h-6 w-px bg-white/10" />

        {/* Quick Notes */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Quick Notes</span>
          {commonNotes.map((note) => (
            <button
              key={note.note}
              onClick={() => onPlayNote(note.note)}
              disabled={!selectedOutput}
              className={`
                px-3 py-1.5 rounded bg-[#00ff88]/10 hover:bg-[#00ff88]/20 
                text-[#00ff88] text-sm flex items-center gap-2 transition-all 
                hover:scale-105 disabled:opacity-50 disabled:hover:scale-100
                disabled:cursor-not-allowed
              `}
            >
              <Music className="w-4 h-4" />
              {note.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Settings and Debug buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSettings}
            className="p-2 rounded-full bg-[#1e3a8a]/50 hover:bg-[#1e3a8a] text-white/70 hover:text-white transition-all"
            title="MIDI Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleDebug}
            className="p-2 rounded-full bg-[#1e3a8a]/50 hover:bg-[#1e3a8a] text-white/70 hover:text-white transition-all"
            title="Debug Console"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-white/10" />

        {/* Mozart Player */}
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-[#00ff88]" />
          <span className="text-sm font-medium">Mozart - Eine Kleine Nachtmusik</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onStopMozart}
            disabled={!selectedOutput || (!isPlaying && !isPaused)}
            className={`
              p-2 rounded-full bg-[#1e3a8a]/50 hover:bg-[#1e3a8a] text-white/70 hover:text-white transition-all
              ${(!isPlaying && !isPaused) && 'opacity-50 cursor-not-allowed'}
            `}
            title="Stop and Reset"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={isPaused ? onResumeMozart : (isPlaying ? onPauseMozart : onPlayMozart)}
            disabled={!selectedOutput}
            className={`
              px-4 py-1.5 rounded-full flex items-center gap-2 transition-all
              ${isPlaying && !isPaused
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20'}
              ${!selectedOutput && 'opacity-50 cursor-not-allowed'}
              hover:scale-105 disabled:hover:scale-100
            `}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : isPaused ? (
              <>
                <Play className="w-4 h-4" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 