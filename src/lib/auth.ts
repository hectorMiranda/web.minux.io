import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
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
        } catch (error) {
          set({ loading: false });
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
        } catch (error) {
          set({ loading: false });
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