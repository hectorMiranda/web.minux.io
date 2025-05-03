'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DraggableWindow } from '@/components/ui/DraggableWindow';
import { DebugMessage } from '@/components/midi/types';
import { MIDIToolbar } from '@/components/midi/MIDIToolbar';
import { MIDISettings } from '@/components/midi/MIDISettings';
import { MozartSequencer } from '@/components/midi/MozartSequencer';
import { MozartPiece } from '@/data/mozartPieces';
import { Suspense } from 'react';
import ClientOnly from '@/components/midi/ClientOnly';

// Import MIDIKeyboard with no SSR
const MIDIKeyboard = dynamic(() => import('@/components/midi/MIDIKeyboard'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/50">Loading MIDI interface...</div>
    </div>
  )
});

const DebugConsole = dynamic(() => import('@/components/midi/DebugConsole'), {
  ssr: false,
});

export default function MIDIPage() {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedOutput, setSelectedOutput] = useState<WebMidi.MIDIOutput | null>(null);
  const [debugMessages, setDebugMessages] = useState<DebugMessage[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<MozartPiece | null>(null);
  const mozartSequencerRef = useRef<MozartSequencer | null>(null);

  const addDebugMessage = useCallback((message: string, type: 'info' | 'error' | 'midi' = 'info') => {
    setDebugMessages(prev => [...prev, {
      timestamp: new Date(),
      type,
      message
    }]);
  }, []);

  const handleOutputSelect = useCallback((output: WebMidi.MIDIOutput) => {
    setSelectedOutput(output);
    addDebugMessage(`Selected output device: ${output.name}`, 'info');
  }, [addDebugMessage]);

  const handleNoteOn = useCallback((note: number) => {
    console.log('Sending Note On:', note, 'to output:', selectedOutput?.name);
    if (selectedOutput) {
      try {
        selectedOutput.send([0x90, note, 0x7f]);
        addDebugMessage(`Note On: ${note}`, 'midi');
      } catch (err) {
        console.error('Failed to send Note On:', err);
        addDebugMessage(`Failed to send Note On: ${err}`, 'error');
      }
    } else {
      console.warn('No MIDI output selected for Note On');
    }
  }, [selectedOutput, addDebugMessage]);

  const handleNoteOff = useCallback((note: number) => {
    console.log('Sending Note Off:', note, 'to output:', selectedOutput?.name);
    if (selectedOutput) {
      try {
        selectedOutput.send([0x80, note, 0x00]);
        addDebugMessage(`Note Off: ${note}`, 'midi');
      } catch (err) {
        console.error('Failed to send Note Off:', err);
        addDebugMessage(`Failed to send Note Off: ${err}`, 'error');
      }
    } else {
      console.warn('No MIDI output selected for Note Off');
    }
  }, [selectedOutput, addDebugMessage]);

  // Initialize or update Mozart sequencer when output changes
  useEffect(() => {
    if (selectedOutput) {
      mozartSequencerRef.current = new MozartSequencer(
        [], // Initial empty notes array
        120, // Default tempo of 120 BPM
        handleNoteOn,
        handleNoteOff
      );
      if (selectedPiece) {
        mozartSequencerRef.current.setNotes(selectedPiece.sequence);
      }
    } else {
      mozartSequencerRef.current = null;
    }
  }, [selectedOutput, handleNoteOn, handleNoteOff, selectedPiece]);

  const handleSelectPiece = useCallback((piece: MozartPiece) => {
    setSelectedPiece(piece);
    addDebugMessage(`Selected piece: ${piece.title}`, 'info');
    if (mozartSequencerRef.current) {
      mozartSequencerRef.current.setNotes(piece.sequence);
      // Reset playback state when selecting a new piece
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [addDebugMessage]);

  const handlePlayMozart = useCallback(async () => {
    if (!mozartSequencerRef.current || !selectedOutput || !selectedPiece) {
      addDebugMessage('Cannot play: No MIDI output or piece selected', 'error');
      return;
    }
    
    try {
      setIsPlaying(true);
      setIsPaused(false);
      addDebugMessage(`Started playing: ${selectedPiece.title}`, 'info');
      await mozartSequencerRef.current.play();
      // Only reset states if the piece finished playing naturally
      if (mozartSequencerRef.current.isCurrentlyPlaying()) {
        setIsPlaying(false);
        setIsPaused(false);
      }
    } catch (err) {
      addDebugMessage(`Error playing piece: ${err}`, 'error');
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [selectedOutput, selectedPiece, addDebugMessage]);

  const handlePauseMozart = useCallback(() => {
    if (!mozartSequencerRef.current) return;
    
    mozartSequencerRef.current.pause();
    setIsPaused(true);
    setIsPlaying(false);
    addDebugMessage('Paused playback', 'info');
  }, [addDebugMessage]);

  const handleResumeMozart = useCallback(() => {
    if (!mozartSequencerRef.current) return;
    
    mozartSequencerRef.current.resume();
    setIsPaused(false);
    setIsPlaying(true);
    addDebugMessage('Resumed playback', 'info');
  }, [addDebugMessage]);

  const handleStopMozart = useCallback(() => {
    if (!mozartSequencerRef.current) return;
    
    mozartSequencerRef.current.stop();
    setIsPlaying(false);
    setIsPaused(false);
    addDebugMessage('Stopped playback', 'info');
  }, [addDebugMessage]);

  const initializeMIDI = useCallback(async () => {
    try {
      if (navigator.requestMIDIAccess) {
        const access = await navigator.requestMIDIAccess();
        setMidiAccess(access);
        addDebugMessage('MIDI access granted', 'info');

        // Log available outputs
        const outputs = Array.from(access.outputs.values());
        console.log('Available MIDI outputs:', outputs);
        outputs.forEach(output => {
          console.log(`Output: ${output.name}, ID: ${output.id}, State: ${output.state}, Connection: ${output.connection}`);
        });

        // Auto-select the first available output if none is selected
        if (!selectedOutput) {
          if (outputs.length > 0) {
            console.log('Auto-selecting first output:', outputs[0].name);
            handleOutputSelect(outputs[0]);
          } else {
            console.warn('No MIDI outputs available');
            addDebugMessage('No MIDI outputs found', 'error');
          }
        }
      } else {
        setError('Web MIDI API is not supported in your browser');
        addDebugMessage('Web MIDI API not supported', 'error');
      }
    } catch (err) {
      console.error('MIDI initialization error:', err);
      setError('Failed to access MIDI devices');
      addDebugMessage(`MIDI access error: ${err}`, 'error');
    }
  }, [addDebugMessage, handleOutputSelect, selectedOutput]);

  // Auto-connect to MIDI devices on page load
  useEffect(() => {
    initializeMIDI();
  }, [initializeMIDI]);

  return (
    <div className="w-full h-full bg-[#1a1a1a] overflow-hidden">
      <MIDIToolbar
        onPlayNote={handleNoteOn}
        onPlayMozart={handlePlayMozart}
        onPauseMozart={handlePauseMozart}
        onResumeMozart={handleResumeMozart}
        onStopMozart={handleStopMozart}
        onSelectPiece={handleSelectPiece}
        selectedPiece={selectedPiece}
        isPlaying={isPlaying}
        isPaused={isPaused}
        selectedOutput={selectedOutput}
        midiAccess={midiAccess}
        onOutputSelect={handleOutputSelect}
        onInitializeMIDI={initializeMIDI}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onToggleDebug={() => setShowDebug(!showDebug)}
      />
      
      <div className="w-full h-[calc(100vh-48px)] relative">
        <ClientOnly>
          <MIDIKeyboard
            selectedOutput={selectedOutput}
            onNoteOn={handleNoteOn}
            onNoteOff={handleNoteOff}
          />
        </ClientOnly>
      </div>
      
      {showSettings && (
        <DraggableWindow
          title="MIDI Settings"
          initialPosition={{ x: 100, y: 100 }}
          onClose={() => setShowSettings(false)}
        >
          <MIDISettings 
            midiAccess={midiAccess}
            selectedOutput={selectedOutput}
            onOutputSelect={handleOutputSelect}
          />
        </DraggableWindow>
      )}
      
      {showDebug && (
        <DraggableWindow
          title="Debug Console"
          initialPosition={{ x: 400, y: 100 }}
          onClose={() => setShowDebug(false)}
        >
          <DebugConsole messages={debugMessages} />
        </DraggableWindow>
      )}
      
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 text-white p-4 rounded-md shadow-lg">
          Error: {error}
        </div>
      )}
    </div>
  );
} 