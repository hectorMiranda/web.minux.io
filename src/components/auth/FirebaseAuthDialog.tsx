import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, X, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { toast } from 'sonner';

// Google Icon Component
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

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

  const { signIn, signUp, signInWithGoogle, loading } = useAuthStore();

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

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google successfully!');
      onClose?.();
    } catch (error: any) {
      let errorMessage = 'Google sign-in failed';
      
      switch (error?.code) {
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked. Please allow popups for this site.';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in was cancelled.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
          break;
        default:
          errorMessage = error?.message || 'Google sign-in failed';
      }
      
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
                  {/* Google Sign In Button */}
                  <motion.button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="relative group w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded opacity-30 blur group-hover:opacity-50 transition-opacity" />
                    <div className="relative px-4 py-3 bg-white rounded font-mono text-sm text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                      <GoogleIcon />
                      Continue with Google
                    </div>
                  </motion.button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-primary/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-[#0A192F] px-2 text-primary/50 font-mono">OR</span>
                    </div>
                  </div>

                  {/* Email/Password Sign In Button */}
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
