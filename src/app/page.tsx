'use client';

import { useState, useEffect } from 'react';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { PasswordDialog } from '../components/auth/PasswordDialog';
import { Dashboard } from '../components/dashboard/Dashboard';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowPasswordDialog(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthentication = (password: string) => {
    if (password === process.env.NEXT_PUBLIC_SYSTEM_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
    }
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return showPasswordDialog ? (
    <PasswordDialog onAuthenticate={handleAuthentication} />
  ) : null;
}
