import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, LoginCredentials, RegisterData, AuthContextType } from '../types/auth';

const AUTH_STORAGE_KEY = 'tijaniyah_auth_user';
const USERS_STORAGE_KEY = 'tijaniyah_users_data';

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Load user from storage on app start
  useEffect(() => {
    loadStoredUser();
    initializeDemoAccount();
  }, []);

  const initializeDemoAccount = async () => {
    try {
      const users = await getStoredUsers();
      const demoUserExists = users.find(u => u.email === 'demo@tijaniyah.com');
      
      if (!demoUserExists) {
        const demoUser: User = {
          id: 'demo-user-001',
          email: 'demo@tijaniyah.com',
          name: 'Demo User',
          phone: '+233 558415813',
          location: {
            city: 'Accra',
            country: 'Ghana',
          },
          preferences: {
            prayerMethod: 'MWL',
            language: 'en',
            notifications: true,
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        
        const updatedUsers = [...users, demoUser];
        await storeUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Error initializing demo account:', error);
    }
  };

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const storeUser = async (user: User) => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
    }
  };

  const removeStoredUser = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing stored user:', error);
    }
  };

  const getStoredUsers = async (): Promise<User[]> => {
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error('Error loading stored users:', error);
      return [];
    }
  };

  const storeUsers = async (users: User[]) => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error storing users:', error);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const users = await getStoredUsers();
      const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());

      if (!user) {
        throw new Error('User not found. Please check your email or register.');
      }

      // In a real app, you would verify the password hash here
      // For demo purposes, we'll accept any password for existing users
      if (!credentials.password) {
        throw new Error('Password is required');
      }

      // Special handling for demo account
      if (user.email === 'demo@tijaniyah.com' && credentials.password !== 'demo123') {
        throw new Error('Invalid password for demo account. Use: demo123');
      }

      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString(),
      };

      // Update user in storage
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      await storeUsers(updatedUsers);
      await storeUser(updatedUser);

      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
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

      const users = await getStoredUsers();
      
      // Check if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email.toLowerCase(),
        name: data.name.trim(),
        phone: data.phone?.trim(),
        profilePicture: data.profilePicture,
        location: data.location,
        preferences: {
          prayerMethod: 'MWL',
          language: 'en',
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Store user
      const updatedUsers = [...users, newUser];
      await storeUsers(updatedUsers);
      await storeUser(newUser);

      dispatch({ type: 'SET_USER', payload: newUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' });
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await removeStoredUser();
      dispatch({ type: 'LOGOUT' });
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
      const users = await getStoredUsers();
      const updatedUser = { ...authState.user, ...updates };
      
      const updatedUsers = users.map(u => u.id === authState.user!.id ? updatedUser : u);
      await storeUsers(updatedUsers);
      await storeUser(updatedUser);

      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Update failed' });
    }
  };

  const resetPassword = async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const users = await getStoredUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw new Error('No account found with this email address');
      }

      // In a real app, you would send a password reset email here
      // For demo purposes, we'll just show a success message
      dispatch({ type: 'SET_LOADING', payload: false });
      // You could dispatch a success message here
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Password reset failed' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
