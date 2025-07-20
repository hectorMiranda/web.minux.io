import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { auth } from './firebase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      
      signIn: async (email: string, password: string) => {
        if (!auth) {
          throw new Error('Firebase authentication is not initialized');
        }
        try {
          set({ loading: true });
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          set({ 
            user: userCredential.user, 
            isAuthenticated: true, 
            loading: false 
          });
        } catch (error: any) {
          set({ loading: false });
          
          // Handle unauthorized domain error in development
          if (error?.code === 'auth/unauthorized-domain') {
            const isDev = process.env.NODE_ENV === 'development';
            const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
            
            if (isDev) {
              console.error(`Firebase unauthorized domain error in development. Please add '${currentDomain}' to your Firebase project's authorized domains.`);
              console.error('Go to Firebase Console > Authentication > Settings > Authorized domains and add:', currentDomain);
            }
            
            throw new Error(`Authentication unavailable: Please add ${currentDomain} to Firebase authorized domains`);
          }
          
          throw error;
        }
      },

      signUp: async (email: string, password: string) => {
        if (!auth) {
          throw new Error('Firebase authentication is not initialized');
        }
        try {
          set({ loading: true });
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          set({ 
            user: userCredential.user, 
            isAuthenticated: true, 
            loading: false 
          });
        } catch (error: any) {
          set({ loading: false });
          
          // Handle unauthorized domain error in development
          if (error?.code === 'auth/unauthorized-domain') {
            const isDev = process.env.NODE_ENV === 'development';
            const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
            
            if (isDev) {
              console.error(`Firebase unauthorized domain error in development. Please add '${currentDomain}' to your Firebase project's authorized domains.`);
            }
            
            throw new Error(`Authentication unavailable: Please add ${currentDomain} to Firebase authorized domains`);
          }
          
          throw error;
        }
      },

      signInWithGoogle: async () => {
        if (!auth) {
          throw new Error('Firebase authentication is not initialized');
        }
        try {
          set({ loading: true });
          const provider = new GoogleAuthProvider();
          provider.addScope('email');
          provider.addScope('profile');
          const userCredential = await signInWithPopup(auth, provider);
          set({ 
            user: userCredential.user, 
            isAuthenticated: true, 
            loading: false 
          });
        } catch (error: any) {
          set({ loading: false });
          
          // Handle unauthorized domain error in development
          if (error?.code === 'auth/unauthorized-domain') {
            const isDev = process.env.NODE_ENV === 'development';
            const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
            
            if (isDev) {
              console.error(`Firebase unauthorized domain error in development. Please add '${currentDomain}' to your Firebase project's authorized domains.`);
            }
            
            throw new Error(`Authentication unavailable: Please add ${currentDomain} to Firebase authorized domains`);
          }
          
          throw error;
        }
      },

      signOut: async () => {
        if (!auth) {
          throw new Error('Firebase authentication is not initialized');
        }
        try {
          set({ loading: true });
          await signOut(auth);
          set({ 
            user: null, 
            isAuthenticated: false, 
            loading: false 
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({ 
          user, 
          isAuthenticated: !!user, 
          loading: false 
        });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        // Only persist user ID and authentication status
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Initialize auth state listener
if (typeof window !== 'undefined' && auth) {
  onAuthStateChanged(auth, (user: User | null) => {
    useAuthStore.getState().setUser(user);
  });
} 