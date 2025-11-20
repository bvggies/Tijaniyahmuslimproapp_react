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
    const initializeApp = async () => {
      await createAdminUsersIfNeeded(); // Create admin users first
      await initializeDemoAccount(); // Initialize demo account
      await loadStoredToken();
      await loadStoredUser();
    };
    initializeApp();
  }, []);

  const loadStoredToken = async () => {
    try {
      const { loadStoredToken } = await import('../services/api');
      await loadStoredToken();
    } catch (error) {
      console.error('Error loading stored token:', error);
    }
  };

  const createAdminUsersIfNeeded = async () => {
    try {
      const users = await getStoredUsers();
      
      // Create admin user if not exists
      const adminUserExists = users.find(u => u.email === 'admin@tijaniyahpro.com');
      if (!adminUserExists) {
        const adminUser: User = {
          id: 'admin-user-001',
          email: 'admin@tijaniyahpro.com',
          name: 'Super Administrator',
          phone: '+233 558415813',
          role: 'super_admin',
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
        
        const updatedUsers = [...users, adminUser];
        await storeUsers(updatedUsers);
        console.log('✅ Admin user created');
      }
      
      // Create moderator user if not exists
      const moderatorUserExists = users.find(u => u.email === 'moderator@tijaniyahpro.com');
      if (!moderatorUserExists) {
        const moderatorUser: User = {
          id: 'moderator-user-001',
          email: 'moderator@tijaniyahpro.com',
          name: 'Content Moderator',
          phone: '+233 558415813',
          role: 'moderator',
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
        
        const updatedUsers = [...users, moderatorUser];
        await storeUsers(updatedUsers);
        console.log('✅ Moderator user created');
      }
    } catch (error) {
      console.error('Error creating admin users:', error);
    }
  };

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
          role: 'user',
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

      // Initialize admin users
      const adminUserExists = users.find(u => u.email === 'admin@tijaniyahpro.com');
      if (!adminUserExists) {
        const adminUser: User = {
          id: 'admin-user-001',
          email: 'admin@tijaniyahpro.com',
          name: 'Super Administrator',
          phone: '+233 558415813',
          role: 'super_admin',
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
        
        const updatedUsers = [...users, adminUser];
        await storeUsers(updatedUsers);
      }

      // Initialize moderator user
      const moderatorUserExists = users.find(u => u.email === 'moderator@tijaniyahpro.com');
      if (!moderatorUserExists) {
        const moderatorUser: User = {
          id: 'moderator-user-001',
          email: 'moderator@tijaniyahpro.com',
          name: 'Content Moderator',
          phone: '+233 558415813',
          role: 'moderator',
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
        
        const updatedUsers = [...users, moderatorUser];
        await storeUsers(updatedUsers);
      }

      // Also ensure demo user exists in backend
      try {
        const { api } = await import('../services/api');
        await api.signup('demo@tijaniyah.com', 'demo123', 'Demo User');
        console.log('✅ Demo user created in backend');
      } catch (backendError: any) {
        if (backendError.message?.includes('User already exists')) {
          console.log('✅ Demo user already exists in backend');
        } else {
          console.log('⚠️ Failed to create demo user in backend:', backendError.message);
        }
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
      console.log('🔍 Available users:', users.map(u => ({ email: u.email, role: u.role })));
      console.log('🔍 Looking for user:', credentials.email);
      
      const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());

      if (!user) {
        console.log('❌ User not found in stored users');
        throw new Error('User not found. Please check your email or register.');
      }

      console.log('✅ User found:', { email: user.email, role: user.role });

      // In a real app, you would verify the password hash here
      // For demo purposes, we'll accept any password for existing users
      if (!credentials.password) {
        throw new Error('Password is required');
      }

      // Special handling for demo account
      if (user.email === 'demo@tijaniyah.com' && credentials.password !== 'demo123') {
        throw new Error('Invalid password for demo account. Use: demo123');
      }

      // Special handling for admin accounts
      if (user.email === 'admin@tijaniyahpro.com' && credentials.password !== 'admin123') {
        throw new Error('Invalid password for admin account. Use: admin123');
      }

      if (user.email === 'moderator@tijaniyahpro.com' && credentials.password !== 'moderator123') {
        throw new Error('Invalid password for moderator account. Use: moderator123');
      }

      // Also authenticate with backend
      try {
        const { api } = await import('../services/api');
        const response = await api.login(credentials.email, credentials.password);
        console.log('✅ Backend authentication successful');
        // Store the token for future API calls
        if (response?.accessToken) {
          const { setToken } = await import('../services/api');
          await setToken(response.accessToken);
        }
      } catch (backendError: any) {
        console.log('⚠️ Backend authentication failed:', backendError.message);
        
        // If user doesn't exist in backend, try to create them
        if (backendError.message?.includes('Invalid credentials') || backendError.message?.includes('User not found')) {
          console.log('🔄 User not found in backend, attempting to create account...');
          try {
            const { api } = await import('../services/api');
            await api.signup(credentials.email, credentials.password, user.name);
            console.log('✅ Backend account created successfully');
            
            // Now try to login again
            const loginResponse = await api.login(credentials.email, credentials.password);
            if (loginResponse?.accessToken) {
              const { setToken } = await import('../services/api');
              await setToken(loginResponse.accessToken);
              console.log('✅ Backend login successful after account creation');
            }
          } catch (signupError: any) {
            console.log('❌ Failed to create backend account:', signupError.message);
            // Continue with local login even if backend fails
          }
        }
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
        role: 'user', // Default role for new users
        location: data.location,
        preferences: {
          prayerMethod: 'MWL',
          language: 'en',
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Also create account on backend
      try {
        const { api } = await import('../services/api');
        await api.signup(data.email, data.password, data.name);
        console.log('✅ Backend account created successfully');
      } catch (backendError: any) {
        console.log('⚠️ Backend account creation failed:', backendError.message);
        // Continue with local registration even if backend fails
      }

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
      // Clear the authentication token
      try {
        const { clearToken } = await import('../services/api');
        await clearToken();
      } catch (tokenError) {
        console.error('Error clearing token:', tokenError);
      }
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
