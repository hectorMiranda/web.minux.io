'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Handle storage changes
    const handleStorageChange = (e: StorageEvent) => {
      // If auth storage was changed
      if (e.key === 'auth-storage') {
        try {
          const authData = e.newValue ? JSON.parse(e.newValue) : null;
          if (!authData?.state?.isAuthenticated) {
            router.push('/');
          }
        } catch (error) {
          console.error('Error parsing auth storage:', error);
          router.push('/');
        }
      }
    };

    // Listen for storage events (works across tabs)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  return (
    <AuthProvider>
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0A192F',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            color: '#00FFFF',
          },
        }}
      />
      {children}
    </AuthProvider>
  );
} 