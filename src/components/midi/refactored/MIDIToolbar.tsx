import React from 'react';
import { 
  Music, 
  Settings, 
  Terminal, 
  Keyboard, 
  BookOpen, 
  RotateCw, 
  HelpCircle 
} from 'lucide-react';
import MIDISettings from './MIDISettings';

interface MIDIToolbarProps {
  midiAccess: WebMidi.MIDIAccess | null;
  selectedInput: WebMidi.MIDIInput | null;
  selectedOutput: WebMidi.MIDIOutput | null;
  onInputSelect: (input: WebMidi.MIDIInput) => void;
  onOutputSelect: (output: WebMidi.MIDIOutput) => void;
  onRefreshDevices: () => void;
  onToggleSettings: () => void;
  onToggleDebug: () => void;
  onToggleExercises: () => void;
  onToggleHelp: () => void;
  showExercises: boolean;
  showDebug: boolean;
  title?: string;
}

export function MIDIToolbar({
  midiAccess,
  selectedInput,
  selectedOutput,
  onInputSelect,
  onOutputSelect,
  onRefreshDevices,
  onToggleSettings,
  onToggleDebug,
  onToggleExercises,
  onToggleHelp,
  showExercises,
  showDebug,
  title = 'MIDI Piano'
}: MIDIToolbarProps) {
  return (
    <div className="h-12 bg-[#121212] border-b border-white/10 px-4 flex items-center justify-between">
      {/* Left side - Title and MIDI connection */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-[#4d97ff]" />
          <h1 className="text-white font-medium">{title}</h1>
        </div>
        
        {midiAccess && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${selectedInput ? 'bg-green-500' : 'bg-red-500'}`} />
              <select
                className="bg-[#1e293b] text-white text-sm px-3 py-1 rounded-md border border-[#334155] min-w-[120px]"
                onChange={(e) => {
                  const input = Array.from(midiAccess.inputs.values())
                    .find(input => input.id === e.target.value);
                  if (input) onInputSelect(input);
                }}
                value={selectedInput?.id || ''}
              >
                <option value="">Input Device</option>
                {Array.from(midiAccess.inputs.values()).map((input) => (
                  <option key={input.id} value={input.id}>
                    {input.name || input.id}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="h-4 w-px bg-[#334155] mx-1" />
            
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${selectedOutput ? 'bg-green-500' : 'bg-red-500'}`} />
              <select
                className="bg-[#1e293b] text-white text-sm px-3 py-1 rounded-md border border-[#334155] min-w-[120px]"
                onChange={(e) => {
                  const output = Array.from(midiAccess.outputs.values())
                    .find(output => output.id === e.target.value);
                  if (output) onOutputSelect(output);
                }}
                value={selectedOutput?.id || ''}
              >
                <option value="">Output Device</option>
                {Array.from(midiAccess.outputs.values()).map((output) => (
                  <option key={output.id} value={output.id}>
                    {output.name || output.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        <button
          onClick={onRefreshDevices}
          className="p-1.5 rounded text-white/60 hover:bg-white/5 hover:text-white/90 transition-colors"
          title="Refresh MIDI Devices"
        >
          <RotateCw size={16} />
        </button>
      </div>
      
      {/* Right side - Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleExercises}
          className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
            showExercises 
              ? 'bg-[#4d97ff]/20 text-[#4d97ff]' 
              : 'text-white/60 hover:bg-white/5 hover:text-white/90'
          }`}
          title="Practice Exercises"
        >
          <BookOpen size={16} />
          <span className="text-sm">Exercises</span>
        </button>
        
        <div className="h-6 w-px bg-white/10 mx-1"></div>
        
        <button
          onClick={onToggleSettings}
          className="p-1.5 rounded text-white/60 hover:bg-white/5 hover:text-white/90 transition-colors"
          title="Keyboard Settings"
        >
          <Keyboard size={16} />
        </button>
        
        <button
          onClick={onToggleDebug}
          className={`p-1.5 rounded transition-colors ${
            showDebug 
              ? 'text-[#4d97ff]' 
              : 'text-white/60 hover:bg-white/5 hover:text-white/90'
          }`}
          title="Debug Console"
        >
          <Terminal size={16} />
        </button>
        
        <button
          onClick={onToggleHelp}
          className="p-1.5 rounded text-white/60 hover:bg-white/5 hover:text-white/90 transition-colors"
          title="Help & Documentation"
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </div>
  );
}

export default MIDIToolbar;
