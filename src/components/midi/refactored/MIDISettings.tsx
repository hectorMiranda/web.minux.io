import React from 'react';

interface MIDISettingsProps {
  midiAccess: WebMidi.MIDIAccess | null;
  selectedInput: WebMidi.MIDIInput | null;
  selectedOutput: WebMidi.MIDIOutput | null;
  onInputSelect: (input: WebMidi.MIDIInput) => void;
  onOutputSelect: (output: WebMidi.MIDIOutput) => void;
}

const MIDISettings: React.FC<MIDISettingsProps> = ({
  midiAccess,
  selectedInput,
  selectedOutput,
  onInputSelect,
  onOutputSelect
}) => {
  return (
    <div>
      {/* MIDI connection status indicators */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-1 ${selectedInput ? 'bg-green-500' : 'bg-red-500'}`} />
          <select
            className="bg-[#1e293b] text-white text-sm px-3 py-1 rounded-md border border-[#334155] min-w-[120px]"
            onChange={(e) => {
              const input = midiAccess?.inputs.get(e.target.value);
              if (input) onInputSelect(input);
            }}
            value={selectedInput?.id || ''}
          >
            <option value="">No Input</option>
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
              const output = midiAccess?.outputs.get(e.target.value);
              if (output) onOutputSelect(output);
            }}
            value={selectedOutput?.id || ''}
          >
            <option value="">No Output</option>
            {Array.from(midiAccess.outputs.values()).map((output) => (
              <option key={output.id} value={output.id}>
                {output.name || output.id}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MIDISettings;
