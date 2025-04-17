import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, X } from 'lucide-react';

interface PasswordDialogProps {
  onAuthenticate: (password: string) => void;
  onClose?: () => void;
}

export const PasswordDialog = ({ onAuthenticate, onClose }: PasswordDialogProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === process.env.NEXT_PUBLIC_SYSTEM_PASSWORD) {
      onAuthenticate(password);
    } else {
      setError('Invalid system access code');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm mx-4"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50 blur-lg rounded-lg" />
          
          {/* Main container */}
          <div className="relative bg-[#0A192F] rounded-lg overflow-hidden border border-primary/30">
            {/* Header */}
            <div className="bg-[#112240] px-6 py-4 border-b border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Key className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-primary font-mono text-sm">RESTRICTED ACCESS</h2>
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="text-primary/50 hover:text-primary transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 rounded-lg blur" />
                  <div className="relative bg-black/50 backdrop-blur-sm rounded-lg p-4">
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-primary/30 px-2 py-1 text-primary font-mono focus:outline-none focus:border-primary placeholder-primary/30"
                      placeholder="Enter Access Code"
                    />
                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-red-400 text-xs font-mono"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-mono text-primary/70 hover:text-primary transition-colors"
                    >
                      CANCEL
                    </button>
                  )}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-primary rounded opacity-50 blur group-hover:opacity-75 transition-opacity" />
                    <div className="relative px-4 py-2 bg-[#112240] rounded font-mono text-sm text-primary">
                      ENTER
                    </div>
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 