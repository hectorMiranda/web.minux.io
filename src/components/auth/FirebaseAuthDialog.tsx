import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, X, LogIn, UserPlus, Eye, EyeOff, Sparkles, Shield } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { toast } from 'sonner';

// Google Icon Component
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
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

// Floating particles component
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary/20 rounded-full"
        animate={{
          x: [0, Math.random() * 100 - 50],
          y: [0, Math.random() * 100 - 50],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    ))}
  </div>
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
        case 'auth/unauthorized-domain':
          if (process.env.NODE_ENV === 'development') {
            errorMessage = 'Development setup needed: Add localhost to Firebase authorized domains in the console';
          } else {
            errorMessage = 'Domain not authorized for authentication';
          }
          break;
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
        case 'auth/unauthorized-domain':
          if (process.env.NODE_ENV === 'development') {
            errorMessage = 'Development setup needed: Add localhost to Firebase authorized domains in the console';
          } else {
            errorMessage = 'Domain not authorized for authentication';
          }
          break;
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop with enhanced blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-900/90 to-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* Floating particles */}
      <FloatingParticles />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ 
          type: "spring", 
          damping: 20, 
          stiffness: 300,
          duration: 0.4
        }}
        className="relative w-full max-w-md mx-4 z-10"
      >
        {/* Outer glow container */}
        <div className="relative">
          {/* Animated gradient border */}
          <motion.div 
            className="absolute -inset-1 rounded-2xl opacity-60 blur-sm"
            animate={{
              background: [
                "linear-gradient(45deg, #64ffda, #82b1ff, #64ffda)",
                "linear-gradient(45deg, #82b1ff, #64ffda, #82b1ff)",
                "linear-gradient(45deg, #64ffda, #82b1ff, #64ffda)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Main glass container */}
          <div className="relative bg-slate-900/70 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm px-8 py-6 border-b border-white/10">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`
              }} />
              
              <div className="relative flex items-center justify-between">
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg" />
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <Shield className="w-6 h-6 text-primary" />
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <motion.h2 
                      className="text-white font-semibold text-xl tracking-tight"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </motion.h2>
                    <motion.p 
                      className="text-slate-400 text-sm font-medium"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {isSignUp ? 'Join the Minux ecosystem' : 'Sign in to your account'}
                    </motion.p>
                  </div>
                </motion.div>
                
                {onClose && (
                  <motion.button
                    onClick={onClose}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <X size={18} className="text-slate-400 hover:text-white transition-colors" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="relative p-8 bg-gradient-to-b from-slate-900/50 to-slate-900/80">
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Email Field */}
                <motion.div 
                  className="relative group"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email Address
                  </label>
                  <div className="relative">
                    <motion.div 
                      className="absolute -inset-0.5 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="relative w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div 
                  className="relative group"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Password
                  </label>
                  <div className="relative">
                    <motion.div 
                      className="absolute -inset-0.5 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="relative w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                {/* Confirm Password Field (Sign Up only) */}
                <AnimatePresence>
                  {isSignUp && (
                    <motion.div 
                      className="relative group"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        Confirm Password
                      </label>
                      <div className="relative">
                        <motion.div 
                          className="absolute -inset-0.5 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                        />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="relative w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-200"
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative"
                    >
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-red-300 text-sm flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                          {error}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex flex-col gap-4 pt-4">
                  {/* Google Sign In Button */}
                  <motion.button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="relative group w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/30 via-yellow-500/30 to-green-500/30 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative px-6 py-4 bg-white/95 backdrop-blur-sm rounded-xl font-medium text-gray-700 flex items-center justify-center gap-3 hover:bg-white transition-all duration-200 border border-white/20">
                      <GoogleIcon />
                      Continue with Google
                    </div>
                  </motion.button>

                  {/* Divider */}
                  <motion.div 
                    className="relative my-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-slate-900 px-4 text-slate-400 font-medium">OR</span>
                    </div>
                  </motion.div>

                  {/* Email/Password Sign In Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="relative group w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <motion.div 
                      className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity"
                      animate={{
                        background: [
                          "linear-gradient(45deg, #64ffda, #82b1ff, #64ffda)",
                          "linear-gradient(45deg, #82b1ff, #64ffda, #82b1ff)",
                          "linear-gradient(45deg, #64ffda, #82b1ff, #64ffda)",
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl font-medium text-white flex items-center justify-center gap-3 backdrop-blur-sm border border-white/10">
                      {loading ? (
                        <motion.div 
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          {isSignUp ? (
                            <>
                              <UserPlus size={18} />
                              Create Account
                            </>
                          ) : (
                            <>
                              <LogIn size={18} />
                              Sign In
                            </>
                          )}
                          <Sparkles size={16} className="text-primary/70" />
                        </>
                      )}
                    </div>
                  </motion.button>

                  {/* Toggle Sign Up/Sign In */}
                  <motion.div 
                    className="text-center pt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                        setPassword('');
                        setConfirmPassword('');
                      }}
                      className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                    >
                      {isSignUp 
                        ? 'Already have an account? Sign In' 
                        : "Don't have an account? Sign Up"
                      }
                    </button>
                  </motion.div>

                  {/* Cancel Button */}
                  {onClose && (
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="text-sm text-slate-500 hover:text-slate-400 transition-colors text-center py-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </motion.form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
