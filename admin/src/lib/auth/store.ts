import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserRole } from '../api/types';
import { getStoredToken, setStoredToken, removeStoredToken } from '../api/client';
import { authApi } from '../api/endpoints';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  
  // Role helpers
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  canModerate: () => boolean;
}

const ADMIN_ROLES: UserRole[] = ['ADMIN'];
const MODERATOR_ROLES: UserRole[] = ['ADMIN', 'MODERATOR'];
const CONTENT_ROLES: UserRole[] = ['ADMIN', 'MODERATOR', 'SCHOLAR'];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ email, password });
          
          // Check if user has admin access
          const allowedRoles: UserRole[] = ['ADMIN', 'MODERATOR', 'SCHOLAR', 'SUPPORT', 'VIEWER'];
          if (!allowedRoles.includes(response.user.role)) {
            throw new Error('Access denied. Admin privileges required.');
          }
          
          setStoredToken(response.accessToken);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Login failed',
          });
          throw error;
        }
      },
      
      logout: () => {
        removeStoredToken();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      checkAuth: async () => {
        const token = getStoredToken();
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }
        
        set({ isLoading: true });
        try {
          const user = await authApi.getMe();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          removeStoredToken();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
      
      clearError: () => set({ error: null }),
      
      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },
      
      hasAnyRole: (roles: UserRole[]) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },
      
      isAdmin: () => {
        const { user } = get();
        return user ? ADMIN_ROLES.includes(user.role) : false;
      },
      
      isModerator: () => {
        const { user } = get();
        return user ? MODERATOR_ROLES.includes(user.role) : false;
      },
      
      canModerate: () => {
        const { user } = get();
        return user ? CONTENT_ROLES.includes(user.role) : false;
      },
    }),
    {
      name: 'tijaniyah-admin-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Listen for unauthorized events
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().logout();
  });
}

