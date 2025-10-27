export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profilePicture?: string;
  role?: 'user' | 'moderator' | 'admin' | 'super_admin';
  location?: {
    city: string;
    country: string;
  };
  preferences: {
    prayerMethod: string;
    language: 'en' | 'ar';
    notifications: boolean;
  };
  createdAt: string;
  lastLogin: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  profilePicture?: string;
  location?: {
    city: string;
    country: string;
  };
}

export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  getUserRole: () => string;
}
