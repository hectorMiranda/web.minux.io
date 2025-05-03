'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const MIDIContext = createContext<{
  isReady: boolean;
}>({
  isReady: false,
});

export function MIDIProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <MIDIContext.Provider value={{ isReady }}>
      {children}
    </MIDIContext.Provider>
  );
}

export function useMIDI() {
  return useContext(MIDIContext);
} 