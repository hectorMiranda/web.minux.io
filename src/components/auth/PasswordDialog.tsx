import { useState } from 'react';
import { motion } from 'framer-motion';

interface PasswordDialogProps {
  onAuthenticate: (password: string) => void;
}

export const PasswordDialog = ({ onAuthenticate }: PasswordDialogProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === process.env.NEXT_PUBLIC_SYSTEM_PASSWORD) {
      onAuthenticate(password);
    } else {
      setError('Invalid system access code');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="w-full max-w-sm mx-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black p-8 rounded-lg border-2 border-primary"
        >
          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center"
            >
              <span className="text-3xl">⚡</span>
            </motion.div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div>
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Access Code"
                  className="w-full px-4 py-3 bg-black border-2 border-primary text-primary placeholder-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-red-500 text-sm"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Initialize System
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 