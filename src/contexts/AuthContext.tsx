import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterData, AuthContextType } from '../types/auth';
import { api, loadStoredToken, clearToken, getToken } from '../services/api';

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_GUEST'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isGuest: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
        error: null,
      };
    case 'SET_GUEST':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isGuest: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Map backend user to app User type
const mapBackendUserToAppUser = (backendUser: any): User => {
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.name || 'User',
    phone: backendUser.phone,
    profilePicture: backendUser.avatarUrl,
    role: backendUser.role?.toLowerCase() === 'admin' || backendUser.role?.toLowerCase() === 'super_admin' 
      ? 'super_admin' 
      : backendUser.role?.toLowerCase() === 'moderator' 
        ? 'moderator' 
        : 'user',
    location: backendUser.location,
    preferences: {
      prayerMethod: 'MWL',
      language: 'en',
      notifications: true,
    },
    createdAt: backendUser.createdAt || new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Load user from stored token on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Load stored token
        const token = await loadStoredToken();
        
        if (token) {
          console.log('✅ Found stored token, fetching user data...');
          try {
            // Fetch user data from backend
            const userData = await api.getMe();
            const user = mapBackendUserToAppUser(userData);
            dispatch({ type: 'SET_USER', payload: user });
            console.log('✅ User loaded from backend:', user.email);
          } catch (error: any) {
            console.log('⚠️ Token invalid or expired:', error.message);
            // Token is invalid, clear it
            await clearToken();
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          console.log('📝 No stored token found');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      console.log('🔐 Attempting login for:', credentials.email);
      
      // Authenticate with backend
      const response = await api.login(credentials.email, credentials.password);
      
      if (response?.user) {
        const user = mapBackendUserToAppUser(response.user);
        dispatch({ type: 'SET_USER', payload: user });
        console.log('✅ Login successful:', user.email);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error.message);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message?.includes('Invalid credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Validation
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      console.log('📝 Attempting registration for:', data.email);
      
      // Register with backend
      const response = await api.signup(data.email, data.password, data.name);
      
      if (response?.user) {
        const user = mapBackendUserToAppUser(response.user);
        dispatch({ type: 'SET_USER', payload: user });
        console.log('✅ Registration successful:', user.email);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('❌ Registration failed:', error.message);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message?.includes('User already exists')) {
        errorMessage = 'An account with this email already exists.';
      } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await clearToken();
      dispatch({ type: 'LOGOUT' });
      console.log('✅ Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const continueAsGuest = () => {
    dispatch({ type: 'SET_GUEST', payload: true });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // For now, update locally since we don't have a profile update endpoint
      const updatedUser = { ...authState.user, ...updates };
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Update failed' });
    }
  };

  const resetPassword = async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // TODO: Implement password reset API endpoint
      console.log('🔄 Password reset requested for:', email);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Password reset failed' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Helper functions for role checking
  const isAdmin = (): boolean => {
    return authState.user?.role === 'admin' || authState.user?.role === 'super_admin';
  };

  const isSuperAdmin = (): boolean => {
    return authState.user?.role === 'super_admin';
  };

  const isModerator = (): boolean => {
    return authState.user?.role === 'moderator' || isAdmin();
  };

  const getUserRole = (): string => {
    return authState.user?.role || 'user';
  };

  const value: AuthContextType = {
    authState,
    login,
    register,
    logout,
    continueAsGuest,
    updateProfile,
    resetPassword,
    clearError,
    isAdmin,
    isSuperAdmin,
    isModerator,
    getUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
