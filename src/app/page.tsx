'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingCubes } from '../components/LoadingCubes';
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
  }, []);

  const handleLoadingFinish = () => {
    setIsLoading(false);
  };

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

  if (isAuthenticated) {
    return (
      <AppLayout>
        <Dashboard />
      </AppLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingCubes key="loading" onFinish={handleLoadingFinish} />
        ) : (
          <motion.div 
            key="auth-cube"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              duration: 0.8,
              delay: 0.2
            }}
          >
            <AuthCube 
              onCubeClick={handleCubeClick} 
              isDialogOpen={showPasswordDialog}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {showPasswordDialog && (
        <PasswordDialog 
          onAuthenticate={handleAuthentication}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}
