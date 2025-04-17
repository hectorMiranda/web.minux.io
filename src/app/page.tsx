'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { PasswordDialog } from '../components/auth/PasswordDialog';
import { AuthCube } from '../components/auth/AuthCube';
import { Dashboard } from '../components/dashboard/Dashboard';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuthStore } from '@/lib/auth';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, setAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCubeClick = () => {
    setShowPasswordDialog(true);
  };

  const handleCloseDialog = () => {
    setShowPasswordDialog(false);
  };

  const handleAuthentication = (password: string) => {
    if (password === process.env.NEXT_PUBLIC_SYSTEM_PASSWORD) {
      setAuthenticated(true);
      setShowPasswordDialog(false);
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isAuthenticated) {
    return (
      <AppLayout>
        <Dashboard />
      </AppLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
      <div key="auth-cube-container">
        <AuthCube 
          onCubeClick={handleCubeClick} 
          isDialogOpen={showPasswordDialog}
        />
      </div>
      {showPasswordDialog && (
        <PasswordDialog 
          onAuthenticate={handleAuthentication}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}
