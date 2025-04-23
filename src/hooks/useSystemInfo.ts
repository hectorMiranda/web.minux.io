import { useState, useEffect } from 'react';

interface SystemInfo {
  platform: string;
  arch: string;
  hostname: string;
  type: string;
  release: string;
  cpus: number;
  totalMemory: number;
  freeMemory: number;
}

export const useSystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await fetch('/api/system-info');
        if (!response.ok) {
          throw new Error('Failed to fetch system info');
        }
        const data = await response.json();
        setSystemInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch system info');
      }
    };

    fetchSystemInfo();
  }, []);

  const getSystemName = () => {
    if (!systemInfo) return 'Loading...';
    if (error) return 'Error loading system info';
    
    return `${systemInfo.type} ${systemInfo.release} (${systemInfo.arch})`;
  };

  return {
    systemInfo,
    error,
    systemName: getSystemName(),
  };
}; 