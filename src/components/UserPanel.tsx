'use client';

import { useState } from 'react';
import { User, LogOut, Settings, Camera, Upload } from 'lucide-react';
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

  const handleProfilePictureUpload = () => {
    // TODO: Implement Firebase Storage upload
    // This would typically involve:
    // 1. Create file input
    // 2. Upload to Firebase Storage
    // 3. Update user profile with photoURL
    // 4. Update auth state
    console.log('Profile picture upload coming soon!');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const photoURL = user?.photoURL;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-cyan-500/10 hover:to-blue-500/10 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-200 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="User menu"
      >
        {/* Profile Picture or Icon */}
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/40">
          {photoURL ? (
            <img
              src={photoURL}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <User className={`w-3 h-3 sm:w-4 sm:h-4 ${photoURL ? 'hidden' : ''}`} />
        </div>
        <span className="hidden sm:inline text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate max-w-24">
          {displayName}
        </span>
      </motion.button>

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
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-3 w-80 rounded-xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/20 z-40"
            >
              <div className="p-6">
                {/* Enhanced Profile Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-cyan-500/20">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/40">
                      {photoURL ? (
                        <img
                          src={photoURL}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <User className={`w-8 h-8 ${photoURL ? 'hidden' : ''}`} />
                    </div>
                    {/* Online status indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-slate-900 shadow-lg shadow-green-400/50" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-lg">{displayName}</div>
                    <div className="text-sm text-slate-400">{userEmail}</div>
                    {user?.emailVerified && (
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md text-xs text-green-400">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        Verified
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="space-y-3 mb-6">
                  <motion.button
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-cyan-500/10 hover:to-blue-500/10 border border-slate-700/50 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Account Settings</span>
                  </motion.button>

                  {/* Profile Picture Upload (if supported) */}
                  {!photoURL && (
                    <motion.button
                      onClick={handleProfilePictureUpload}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/20 hover:border-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-200 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Camera className="w-5 h-5" />
                      <span className="font-medium">Add Profile Picture</span>
                    </motion.button>
                  )}
                </div>

                {/* Account Info */}
                <div className="mb-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <div className="text-xs font-medium text-slate-400 mb-2">ACCOUNT INFO</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Provider:</span>
                      <span className="text-white font-medium">
                        {user?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Joined:</span>
                      <span className="text-white font-medium">
                        {user?.metadata.creationTime ? 
                          new Date(user.metadata.creationTime).toLocaleDateString() : 
                          'Unknown'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Sign In:</span>
                      <span className="text-white font-medium">
                        {user?.metadata.lastSignInTime ? 
                          new Date(user.metadata.lastSignInTime).toLocaleDateString() : 
                          'Unknown'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};