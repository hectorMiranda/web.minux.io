'use client';

import { Sliders } from 'lucide-react';

interface MIDISettingsProps {
  midiAccess: WebMidi.MIDIAccess | null;
  selectedOutput: WebMidi.MIDIOutput | null;
  onOutputSelect: (output: WebMidi.MIDIOutput) => void;
  error: string;
}

export const MIDISettings = ({
  midiAccess,
  selectedOutput,
  onOutputSelect,
  error
}: MIDISettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sliders className="w-5 h-5 text-[#00ff88]" />
        <h2 className="text-lg font-semibold">MIDI Settings</h2>
      </div>

      {midiAccess && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-white/70 mb-2">Available MIDI Devices</h3>
            <div className="space-y-2">
              {Array.from(midiAccess.outputs.values()).map((output) => (
                <div 
                  key={output.id}
                  className={`
                    p-3 rounded-lg border transition-colors cursor-pointer
                    ${output.id === selectedOutput?.id 
                      ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                    }
                  `}
                  onClick={() => onOutputSelect(output)}
                >
                  <div className="font-medium">{output.name || 'Unknown Device'}</div>
                  <div className="text-xs text-white/50 mt-1">
                    <div>Manufacturer: {output.manufacturer || 'Unknown'}</div>
                    <div>State: {output.state}</div>
                    <div>Type: {output.type}</div>
                    <div>Version: {output.version}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-white/70 mb-2">MIDI Inputs</h3>
            <div className="space-y-2">
              {Array.from(midiAccess.inputs.values()).map((input) => (
                <div 
                  key={input.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="font-medium">{input.name || 'Unknown Device'}</div>
                  <div className="text-xs text-white/50 mt-1">
                    <div>Manufacturer: {input.manufacturer || 'Unknown'}</div>
                    <div>State: {input.state}</div>
                    <div>Type: {input.type}</div>
                    <div>Version: {input.version}</div>
                  </div>
                </div>
              ))}
              {Array.from(midiAccess.inputs.values()).length === 0 && (
                <div className="text-sm text-white/50 italic">
                  No MIDI input devices detected
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg">
          {error}
        </div>
      )}

      {!midiAccess && !error && (
        <div className="text-white/50 italic">
          Initializing MIDI access...
        </div>
      )}
    </div>
  );
}; 