'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DraggableWindow } from '@/components/ui/DraggableWindow';
import { DebugMessage, PracticeMode } from '@/components/midi/refactored/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import ClientOnly from '@/components/midi/ClientOnly';

// Import components with no SSR
const MIDIKeyboard = dynamic(() => import('@/components/midi/refactored/MIDIKeyboard'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/50">Loading MIDI interface...</div>
    </div>
  )
});

const MIDIToolbar = dynamic(() => import('@/components/midi/refactored/MIDIToolbar'), {
  ssr: false,
});

const DebugConsole = dynamic(() => import('@/components/midi/refactored/DebugConsole'), {
  ssr: false,
});

const ExercisePanel = dynamic(() => import('@/components/midi/refactored/ExercisePanel'), {
  ssr: false,
});

export default function MIDIPage() {
  // MIDI state
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [selectedInput, setSelectedInput] = useState<WebMidi.MIDIInput | null>(null);
  const [selectedOutput, setSelectedOutput] = useState<WebMidi.MIDIOutput | null>(null);
  const [error, setError] = useState<string>('');
  
  // UI state with localStorage persistence
  const [showExercises, setShowExercises] = useLocalStorage('midi.showExercises', false);
  const [showDebug, setShowDebug] = useLocalStorage('midi.showDebug', false);
  const [showSettings, setShowSettings] = useLocalStorage('midi.showSettings', false);
  const [showHelp, setShowHelp] = useLocalStorage('midi.showHelp', false);
  
  // Piano state
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [expectedNotes, setExpectedNotes] = useState<number[]>([]);
  const [currentExerciseMode, setCurrentExerciseMode] = useState<PracticeMode | null>(null);
  const [debugMessages, setDebugMessages] = useState<DebugMessage[]>([]);
  
  // Three.js refs and variables for 3D interaction
  const containerRef = useRef<HTMLDivElement>(null);
  const whiteKeysRef = useRef<any[]>([]);
  const blackKeysRef = useRef<any[]>([]);
  const mouse = useRef({ x: 0, y: 0 }).current;
  const raycaster = useRef<any>(null);
  const camera = useRef<any>(null);
  const scene = useRef<any>(null);

  // Initialize Three.js objects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('three').then((THREE) => {
        raycaster.current = new THREE.Raycaster();
      });
    }
  }, []);

  // Note handling functions
  const onNoteOn = useCallback((note: number, velocity: number) => {
    setActiveNotes(prev => new Set([...prev, note]));
    addDebugMessage(`Note ON: ${note} (velocity: ${velocity})`, 'info');
  }, []);

  const onNoteOff = useCallback((note: number) => {
    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
    addDebugMessage(`Note OFF: ${note}`, 'info');
  }, []);

  // Debug message function
  const addDebugMessage = useCallback((message: string, type: 'info' | 'error' | 'midi') => {
    setDebugMessages(prev => [...prev, {
      timestamp: new Date(),
      message,
      type
    }]);
  }, []);

  // MIDI event handlers
  const handleInputSelect = useCallback((input: WebMidi.MIDIInput) => {
    // Disconnect previous input if exists
    if (selectedInput) {
      selectedInput.onmidimessage = null;
    }
    
    setSelectedInput(input);
    addDebugMessage(`Selected input device: ${input.name}`, 'info');
    
    // Add MIDI message handler
    input.onmidimessage = (event) => {
      const data = Array.from(event.data);
      const [status, note, velocity] = data;
      const command = status & 0xF0;
      
      console.log('MIDI Message:', { command, note, velocity }); // Debug logging
      
      // Note on with velocity > 0
      if (command === 0x90 && velocity > 0) {
        handleNoteOn(note, velocity);
      }
      // Note off or note on with 0 velocity (which is equivalent to note off)
      else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
        handleNoteOff(note);
      }
    };
    
  }, [selectedInput, addDebugMessage]);

  const handleOutputSelect = useCallback((output: WebMidi.MIDIOutput) => {
    setSelectedOutput(output);
    addDebugMessage(`Selected output device: ${output.name}`, 'info');
  }, [addDebugMessage]);

  // Note handling
  const handleNoteOn = useCallback((note: number, velocity: number) => {
    console.log('Note On:', note, 'Velocity:', velocity);
    
    // Update active notes
    setActiveNotes(prev => new Set(prev).add(note));
    
    // Send to MIDI output if available
    if (selectedOutput) {
      try {
        selectedOutput.send([0x90, note, velocity]);
        addDebugMessage(`Note On: ${note} (vel: ${velocity})`, 'midi');
      } catch (err) {
        console.error('Failed to send Note On:', err);
        addDebugMessage(`Failed to send Note On: ${err}`, 'error');
      }
    }
  }, [selectedOutput, addDebugMessage]);

  const handleNoteOff = useCallback((note: number) => {
    console.log('Note Off:', note);
    
    // Update active notes - make sure we're creating a new Set to trigger re-render
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
    
    // Send to MIDI output if available
    if (selectedOutput) {
      try {
        selectedOutput.send([0x80, note, 0]);
        addDebugMessage(`Note Off: ${note}`, 'midi');
      } catch (err) {
        console.error('Failed to send Note Off:', err);
        addDebugMessage(`Failed to send Note Off: ${err}`, 'error');
      }
    }
  }, [selectedOutput, addDebugMessage]);

  // Play a note with specified duration
  const playNote = useCallback((note: number, velocity: number, duration: number) => {
    handleNoteOn(note, velocity);
    
    setTimeout(() => {
      handleNoteOff(note);
    }, duration);
  }, [handleNoteOn, handleNoteOff]);

  // Initialize MIDI
  const initializeMIDI = useCallback(async () => {
    try {
      if (navigator.requestMIDIAccess) {
        const access = await navigator.requestMIDIAccess({ sysex: false });
        setMidiAccess(access);
        addDebugMessage('MIDI access granted', 'info');

        // Log available devices
        const inputs = Array.from(access.inputs.values());
        const outputs = Array.from(access.outputs.values());
        
        addDebugMessage(`Found ${inputs.length} input(s) and ${outputs.length} output(s)`, 'info');
        
        inputs.forEach(input => {
          addDebugMessage(`Input: ${input.name || input.id}`, 'info');
        });
        
        outputs.forEach(output => {
          addDebugMessage(`Output: ${output.name || output.id}`, 'info');
        });

        // Auto-select first available devices
        if (!selectedInput && inputs.length > 0) {
          handleInputSelect(inputs[0]);
        }
        
        if (!selectedOutput && outputs.length > 0) {
          handleOutputSelect(outputs[0]);
        }
        
        // Set up state change listener
        access.onstatechange = (event) => {
          const port = event.port as WebMidi.MIDIPort;
          addDebugMessage(`MIDI port ${port.name || port.id} state changed to ${port.state}`, 'info');
          
          // Refresh our device lists when changes occur
          if (port.state === 'disconnected') {
            if (selectedInput && port.id === selectedInput.id) {
              setSelectedInput(null);
              addDebugMessage(`Input ${port.name || port.id} disconnected`, 'error');
            }
            if (selectedOutput && port.id === selectedOutput.id) {
              setSelectedOutput(null);
              addDebugMessage(`Output ${port.name || port.id} disconnected`, 'error');
            }
          }
        };
      } else {
        setError('Web MIDI API is not supported in your browser');
        addDebugMessage('Web MIDI API not supported', 'error');
      }
    } catch (err) {
      console.error('MIDI initialization error:', err);
      setError(`Failed to access MIDI devices: ${err}`);
      addDebugMessage(`MIDI access error: ${err}`, 'error');
    }
  }, [addDebugMessage, handleInputSelect, handleOutputSelect, selectedInput, selectedOutput]);

  // Initialize MIDI on component mount
  useEffect(() => {
    initializeMIDI();
    
    // Cleanup function
    return () => {
      if (selectedInput) {
        selectedInput.onmidimessage = null;
      }
    };
  }, [initializeMIDI]);

  // Toggle visibility states
  const toggleExercises = useCallback(() => {
    setShowExercises(!showExercises);
  }, [showExercises, setShowExercises]);
  
  const toggleDebug = useCallback(() => {
    setShowDebug(!showDebug);
  }, [showDebug, setShowDebug]);
  
  const toggleSettings = useCallback(() => {
    setShowSettings(!showSettings);
  }, [showSettings, setShowSettings]);
  
  const toggleHelp = useCallback(() => {
    setShowHelp(!showHelp);
  }, [showHelp, setShowHelp]);

  // Add debug logging for activeNotes changes
  useEffect(() => {
    console.log('Active notes changed:', Array.from(activeNotes));
  }, [activeNotes]);

  // Fix mouse click handling to ensure keys are properly released
  const handleClick = (event: MouseEvent) => {
    if (!containerRef.current || !camera.current || !scene.current || !raycaster.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;
    
    raycaster.current.setFromCamera(mouse, camera.current);
    
    const allKeys = [...whiteKeysRef.current, ...blackKeysRef.current];
    const intersects = raycaster.current.intersectObjects(allKeys, false);
    
    if (intersects.length > 0) {
      const keyMesh = intersects[0].object as THREE.Mesh;
      const note = keyMesh.userData.note as number;
      
      // Toggle note state - if it's active, turn it off; otherwise turn it on
      if (activeNotes.has(note)) {
        onNoteOff(note); // This will remove it from activeNotes in the parent
      } else {
        onNoteOn(note, 100); // This will add it to activeNotes in the parent
        
        // Auto-release the note after a short delay (for click interactions only)
        setTimeout(() => {
          onNoteOff(note);
        }, 300);
      }
    }
  };

  return (
    <div className="w-full h-full bg-[#121212] overflow-hidden flex flex-col">
      {/* Toolbar */}
      <MIDIToolbar
        midiAccess={midiAccess}
        selectedInput={selectedInput}
        selectedOutput={selectedOutput}
        onInputSelect={handleInputSelect}
        onOutputSelect={handleOutputSelect}
        onRefreshDevices={initializeMIDI}
        onToggleSettings={toggleSettings}
        onToggleDebug={toggleDebug}
        onToggleExercises={toggleExercises}
        onToggleHelp={toggleHelp}
        showExercises={showExercises}
        showDebug={showDebug}
        title="MIDI Piano"
      />
      
      {/* Main content area */}
      <div className="flex-1 relative">
        <ClientOnly>
          <MIDIKeyboard
            selectedOutput={selectedOutput}
            onNoteOn={handleNoteOn}
            onNoteOff={handleNoteOff}
            activeNotes={activeNotes}
            showDebug={showDebug}
            exerciseMode={currentExerciseMode || undefined}
            expectedNotes={expectedNotes}
          />
        </ClientOnly>
        
        {/* Exercise panel */}
        {showExercises && (
          <div className="absolute top-4 left-4 z-10">
            <ExercisePanel
              onExpectedNotesChange={setExpectedNotes}
              onExerciseModeChange={setCurrentExerciseMode}
              onNotePlay={playNote}
              activeNotes={activeNotes}
            />
          </div>
        )}
        
        {/* Settings window */}
        {showSettings && (
          <DraggableWindow
            title="Keyboard Settings"
            defaultPosition={{ x: 100, y: 100 }}
            onClose={toggleSettings}
          >
            <div className="p-4 w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white/70 text-sm">MIDI Status</label>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${midiAccess ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-white/70">
                      {midiAccess ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="border-t border-white/10 pt-3">
                  <h3 className="text-white text-sm font-medium mb-2">Keyboard Information</h3>
                  <div className="text-white/70 text-sm space-y-1">
                    <p>Total white keys: 52</p>
                    <p>Total black keys: 36</p>
                    <p>Range: C2 to C6</p>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-3">
                  <h3 className="text-white text-sm font-medium mb-2">Keyboard Shortcuts</h3>
                  <div className="text-white/70 text-sm space-y-1">
                    <p>Space - Toggle exercises panel</p>
                    <p>D - Toggle debug panel</p>
                    <p>H - Show help</p>
                  </div>
                </div>
              </div>
            </div>
          </DraggableWindow>
        )}
        
        {/* Debug console */}
        {showDebug && (
          <DraggableWindow
            title="Debug Console"
            defaultPosition={{ x: typeof window !== 'undefined' ? window.innerWidth - 520 : 300, y: 100 }}
            onClose={toggleDebug}
          >
            <DebugConsole
              messages={debugMessages}
              onClear={() => setDebugMessages([])}
            />
          </DraggableWindow>
        )}
        
        {/* Help window */}
        {showHelp && (
          <DraggableWindow
            title="Help & Documentation"
            defaultPosition={{ x: typeof window !== 'undefined' ? window.innerWidth / 2 - 250 : 200, y: 100 }}
            onClose={toggleHelp}
          >
            <div className="p-4 w-[500px] max-h-[400px] overflow-y-auto">
              <h2 className="text-lg font-medium mb-3 text-white">MIDI Piano Help</h2>
              
              <div className="space-y-4 text-white/80 text-sm">
                <section>
                  <h3 className="text-white font-medium mb-1">Getting Started</h3>
                  <p>Connect a MIDI keyboard to your computer and refresh the MIDI devices. Select your input and output devices from the toolbar.</p>
                </section>
                
                <section>
                  <h3 className="text-white font-medium mb-1">Practice Modes</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Free Play</strong> - Play anything on the keyboard</li>
                    <li><strong>Scales</strong> - Practice common scales with visual keyboard highlighting</li>
                    <li><strong>Chords</strong> - Practice chord shapes and progressions</li>
                    <li><strong>Intervals</strong> - Improve your ear training with interval recognition</li>
                    <li><strong>Sight Reading</strong> - Practice reading and playing notes</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="text-white font-medium mb-1">Keyboard Views</h3>
                  <p>Change your viewing angle using the view buttons in the top-right corner of the keyboard. You can toggle note labels and finger numbers in the settings.</p>
                </section>
                
                <section>
                  <h3 className="text-white font-medium mb-1">Troubleshooting</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>If your MIDI device isn&apos;t recognized, try refreshing the MIDI devices</li>
                    <li>Make sure your browser supports the Web MIDI API (Chrome recommended)</li>
                    <li>Check the Debug Console for detailed MIDI messages and errors</li>
                  </ul>
                </section>
              </div>
            </div>
          </DraggableWindow>
        )}
      </div>
    </div>
  );
}