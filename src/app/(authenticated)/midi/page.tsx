'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DraggableWindow } from '@/components/ui/DraggableWindow';
import { DebugMessage } from '@/components/midi/types';
import { MIDIToolbar } from '@/components/midi/MIDIToolbar';
import { MIDISettings } from '@/components/midi/MIDISettings';
import { MozartSequencer } from '@/components/midi/MozartSequencer';
import { MozartPiece } from '@/data/mozartPieces';

// Dynamically import components that use browser APIs with ssr: false
const MIDIKeyboard = dynamic(() => import('@/components/midi/MIDIKeyboard'), {
  ssr: false,
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
  const [windowWidth, setWindowWidth] = useState(0);
  const mozartSequencerRef = useRef<MozartSequencer | null>(null);

  // Initialize window width on client side
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        selectedOutput,
        handleNoteOn,
        handleNoteOff
      );
      if (selectedPiece) {
        mozartSequencerRef.current.setPiece(selectedPiece);
      }
    } else {
      mozartSequencerRef.current = null;
    }
  }, [selectedOutput, handleNoteOn, handleNoteOff]);

  const handleSelectPiece = useCallback((piece: MozartPiece) => {
    setSelectedPiece(piece);
    addDebugMessage(`Selected piece: ${piece.title}`, 'info');
    if (mozartSequencerRef.current) {
      mozartSequencerRef.current.setPiece(piece);
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
    <div className="relative flex flex-col h-full bg-[#0a192f] text-gray-300">
      {/* Toolbar with Mozart player */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 gap-4 mt-12">
        {/* Grid Background */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, #00ff88 1px, transparent 1px),
              linear-gradient(to bottom, #00ff88 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* MIDI Keyboard */}
        <div className="flex-1 rounded-lg overflow-hidden">
          <MIDIKeyboard
            selectedOutput={selectedOutput}
            onNoteOn={handleNoteOn}
            onNoteOff={handleNoteOff}
          />
        </div>

        {/* Floating Windows */}
        {showSettings && (
          <DraggableWindow
            title="MIDI Settings"
            defaultPosition={{ x: 20, y: 60 }}
            onClose={() => setShowSettings(false)}
            type="settings"
          >
            <MIDISettings
              midiAccess={midiAccess}
              selectedOutput={selectedOutput}
              onOutputSelect={handleOutputSelect}
              error={error}
            />
          </DraggableWindow>
        )}

        {showDebug && (
          <DraggableWindow
            title="Debug Console"
            defaultPosition={{ x: window.innerWidth - 420, y: 60 }}
            onClose={() => setShowDebug(false)}
            type="default"
          >
            <DebugConsole messages={debugMessages} />
          </DraggableWindow>
        )}
      </div>
    </div>
  );
} 