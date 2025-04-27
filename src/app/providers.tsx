'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Handle storage changes
    const handleStorageChange = (e: StorageEvent) => {
      // If isAuthenticated was removed or changed
      if (e.key === 'isAuthenticated') {
        if (!e.newValue || e.newValue === 'false') {
          router.push('/');
        }
      }
    };

    // Listen for storage events (works across tabs)
    window.addEventListener('storage', handleStorageChange);

    // Check if already authenticated
    if (!localStorage.getItem('isAuthenticated')) {
      router.push('/');
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  return <>{children}</>;
} 