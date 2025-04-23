import { useState, useEffect } from 'react';

interface SystemInfo {
  platform: string;
  userAgent: string;
  language: string;
  vendor: string;
}

export const useSystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    platform: '',
    userAgent: '',
    language: '',
    vendor: '',
  });

  useEffect(() => {
    const getSystemInfo = () => {
      setSystemInfo({
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
        vendor: navigator.vendor,
      });
    };

    getSystemInfo();
  }, []);

  const getSystemName = () => {
    const { platform, userAgent } = systemInfo;
    
    if (userAgent.includes('Windows')) {
      return 'Windows';
    } else if (userAgent.includes('Mac')) {
      return 'macOS';
    } else if (userAgent.includes('Linux')) {
      return 'Linux';
    } else if (userAgent.includes('Android')) {
      return 'Android';
    } else if (userAgent.includes('iOS')) {
      return 'iOS';
    }
    
    return platform || 'Unknown System';
  };

  return {
    ...systemInfo,
    systemName: getSystemName(),
  };
}; 