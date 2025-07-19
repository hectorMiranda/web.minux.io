'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Layers, Star, Github, LogIn, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShowAuth: () => void;
}

export function MobileMenu({ isOpen, onClose, onShowAuth }: MobileMenuProps) {
  const { user, isAuthenticated, signOut } = useAuthStore();

  const menuItems = [
    { label: 'Home', href: '#', icon: Home },
    { label: 'Features', href: '#features', icon: Layers },
    { label: 'Ecosystem', href: '#ecosystem', icon: Star },
    { label: 'GitHub', href: 'https://github.com/hectorMiranda', icon: Github, external: true },
  ];

  const handleLinkClick = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank');
    } else {
      if (href.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-l border-white/10 z-50 md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <div>
                    <span className="text-xl font-mono font-bold text-white">MINUX</span>
                    <div className="text-xs text-cyan-400">v2.0</div>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* Navigation */}
              <div className="flex-1 p-6">
                <nav className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.label}
                        onClick={() => handleLinkClick(item.href, item.external)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                          <Icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                          {item.label}
                        </span>
                        {item.external && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </nav>
              </div>

              {/* Auth Section */}
              <div className="p-6 border-t border-white/10">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">{user?.email}</div>
                        <div className="text-cyan-400 text-sm">Authenticated</div>
                      </div>
                    </div>

                    {/* Sign Out Button */}
                    <motion.button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30 transition-all"
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => {
                      onShowAuth();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg"
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
