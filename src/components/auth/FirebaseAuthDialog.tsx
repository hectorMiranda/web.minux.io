import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, X, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { toast } from 'sonner';

interface FirebaseAuthDialogProps {
  onClose?: () => void;
}

export const FirebaseAuthDialog = ({ onClose }: FirebaseAuthDialogProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp, loading } = useAuthStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success('Account created successfully!');
      } else {
        await signIn(email, password);
        toast.success('Signed in successfully!');
      }
      onClose?.();
    } catch (error: any) {
      let errorMessage = 'An error occurred';
      
      switch (error?.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        default:
          errorMessage = error?.message || 'Authentication failed';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md mx-4"
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
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-primary font-mono text-sm">
                    {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
                  </h2>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 rounded-lg blur" />
                  <div className="relative bg-black/50 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary/70" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-primary/30 px-2 py-1 text-primary font-mono focus:outline-none focus:border-primary placeholder-primary/30"
                        placeholder="Email address"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 rounded-lg blur" />
                  <div className="relative bg-black/50 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-primary/70" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-primary/30 px-2 py-1 text-primary font-mono focus:outline-none focus:border-primary placeholder-primary/30"
                        placeholder="Password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-primary/50 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field (Sign Up only) */}
                {isSignUp && (
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 rounded-lg blur" />
                    <div className="relative bg-black/50 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-primary/70" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-transparent border-b-2 border-primary/30 px-2 py-1 text-primary font-mono focus:outline-none focus:border-primary placeholder-primary/30"
                          placeholder="Confirm password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-primary/50 hover:text-primary transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-xs font-mono bg-red-400/10 rounded px-3 py-2"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="relative group w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-primary rounded opacity-50 blur group-hover:opacity-75 transition-opacity" />
                    <div className="relative px-4 py-3 bg-[#112240] rounded font-mono text-sm text-primary flex items-center justify-center gap-2">
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      ) : isSignUp ? (
                        <>
                          <UserPlus size={16} />
                          CREATE ACCOUNT
                        </>
                      ) : (
                        <>
                          <LogIn size={16} />
                          SIGN IN
                        </>
                      )}
                    </div>
                  </motion.button>

                  {/* Toggle Sign Up/Sign In */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                        setPassword('');
                        setConfirmPassword('');
                      }}
                      className="text-sm font-mono text-primary/70 hover:text-primary transition-colors"
                    >
                      {isSignUp 
                        ? 'Already have an account? Sign In' 
                        : "Don't have an account? Sign Up"
                      }
                    </button>
                  </div>

                  {/* Cancel Button */}
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-sm font-mono text-primary/50 hover:text-primary/70 transition-colors text-center"
                    >
                      CANCEL
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
