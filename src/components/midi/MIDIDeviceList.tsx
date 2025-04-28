'use client';

import { useEffect, useState } from 'react';

interface MIDIDeviceListProps {
  midiAccess: WebMidi.MIDIAccess;
  onOutputSelect: (output: WebMidi.MIDIOutput) => void;
}

export function MIDIDeviceList({ midiAccess, onOutputSelect }: MIDIDeviceListProps) {
  const [inputs, setInputs] = useState<WebMidi.MIDIInput[]>([]);
  const [outputs, setOutputs] = useState<WebMidi.MIDIOutput[]>([]);

  useEffect(() => {
    const inputArray = Array.from(midiAccess.inputs.values());
    const outputArray = Array.from(midiAccess.outputs.values());
    setInputs(inputArray);
    setOutputs(outputArray);
  }, [midiAccess]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">MIDI Inputs</h2>
        {inputs.length === 0 ? (
          <p className="text-gray-400">No MIDI inputs detected</p>
        ) : (
          <ul className="space-y-2">
            {inputs.map((input) => (
              <li key={input.id} className="bg-gray-800 p-4 rounded-lg">
                <p className="font-medium">{input.name}</p>
                <p className="text-sm text-gray-400">Manufacturer: {input.manufacturer}</p>
                <p className="text-sm text-gray-400">ID: {input.id}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">MIDI Outputs</h2>
        <select
          className="bg-gray-800 text-white p-2 rounded-lg w-full mb-4"
          onChange={(e) => {
            const output = outputs.find(o => o.id === e.target.value);
            if (output) onOutputSelect(output);
          }}
        >
          <option value="">Select MIDI Output</option>
          {outputs.map((output) => (
            <option key={output.id} value={output.id}>
              {output.name}
            </option>
          ))}
        </select>

        {outputs.length === 0 ? (
          <p className="text-gray-400">No MIDI outputs detected</p>
        ) : (
          <ul className="space-y-2">
            {outputs.map((output) => (
              <li key={output.id} className="bg-gray-800 p-4 rounded-lg">
                <p className="font-medium">{output.name}</p>
                <p className="text-sm text-gray-400">Manufacturer: {output.manufacturer}</p>
                <p className="text-sm text-gray-400">ID: {output.id}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 