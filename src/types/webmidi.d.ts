declare namespace WebMidi {
  interface MIDIAccess {
    inputs: MIDIInputMap;
    outputs: MIDIOutputMap;
    onstatechange: ((this: MIDIAccess, e: MIDIConnectionEvent) => void) | null;
    sysexEnabled: boolean;
  }

  interface MIDIInputMap {
    size: number;
    forEach(callbackfn: (value: MIDIInput, key: string, map: MIDIInputMap) => void, thisArg?: any): void;
    get(key: string): MIDIInput | undefined;
    has(key: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<MIDIInput>;
    entries(): IterableIterator<[string, MIDIInput]>;
    [Symbol.iterator](): IterableIterator<[string, MIDIInput]>;
  }

  interface MIDIOutputMap {
    size: number;
    forEach(callbackfn: (value: MIDIOutput, key: string, map: MIDIOutputMap) => void, thisArg?: any): void;
    get(key: string): MIDIOutput | undefined;
    has(key: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<MIDIOutput>;
    entries(): IterableIterator<[string, MIDIOutput]>;
    [Symbol.iterator](): IterableIterator<[string, MIDIOutput]>;
  }

  interface MIDIInput {
    id: string;
    manufacturer: string;
    name: string;
    type: 'input';
    onmidimessage: ((this: MIDIInput, e: MIDIMessageEvent) => void) | null;
    onstatechange: ((this: MIDIInput, e: MIDIConnectionEvent) => void) | null;
    connection: MIDIPortConnectionState;
    state: MIDIPortDeviceState;
  }

  interface MIDIOutput {
    id: string;
    manufacturer: string;
    name: string;
    type: 'output';
    onstatechange: ((this: MIDIOutput, e: MIDIConnectionEvent) => void) | null;
    connection: MIDIPortConnectionState;
    state: MIDIPortDeviceState;
    send(data: number[] | Uint8Array, timestamp?: number): void;
    clear(): void;
  }

  interface MIDIMessageEvent extends Event {
    data: Uint8Array;
    target: MIDIInput;
    timeStamp: number;
  }

  interface MIDIConnectionEvent extends Event {
    port: MIDIPort;
    target: MIDIAccess;
  }

  interface MIDIPort {
    id: string;
    manufacturer: string;
    name: string;
    type: 'input' | 'output';
    version: string;
    onstatechange: ((this: MIDIPort, e: MIDIConnectionEvent) => void) | null;
    connection: MIDIPortConnectionState;
    state: MIDIPortDeviceState;
  }

  type MIDIPortConnectionState = 'open' | 'closed' | 'pending';
  type MIDIPortDeviceState = 'connected' | 'disconnected';
}

interface Navigator {
  requestMIDIAccess(options?: { sysex: boolean }): Promise<WebMidi.MIDIAccess>;
} 