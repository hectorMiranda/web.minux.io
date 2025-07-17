'use client';

import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export const UserPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      setIsOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <User className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-64 rounded-lg bg-[#0A192F] border border-white/10 shadow-lg z-40"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{user?.email || 'User'}</div>
                    <div className="text-sm text-white/50">Authenticated</div>
                  </div>
                </div>
                <div className="text-xs text-white/30 border-t border-white/10 pt-3 mb-3">
                  Signed in with Firebase Auth
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}; 