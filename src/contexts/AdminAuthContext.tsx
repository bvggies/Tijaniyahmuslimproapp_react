import React, { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: AdminPermission[];
  lastLogin: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminPermission {
  id: string;
  name: string;
  resource: 'users' | 'news' | 'events' | 'donations' | 'uploads' | 'lessons' | 'scholars' | 'settings' | 'analytics';
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  updateProfile: (data: Partial<AdminUser>) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'tijaniyah_admin_auth';
const ADMIN_TOKEN_KEY = 'tijaniyah_admin_token';

// Mock admin users for development
const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    email: 'admin@tijaniyahpro.com',
    name: 'Super Administrator',
    role: 'super_admin',
    permissions: [
      { id: '1', name: 'Full Access', resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { id: '2', name: 'Full Access', resource: 'news', actions: ['create', 'read', 'update', 'delete'] },
      { id: '3', name: 'Full Access', resource: 'events', actions: ['create', 'read', 'update', 'delete'] },
      { id: '4', name: 'Full Access', resource: 'donations', actions: ['create', 'read', 'update', 'delete'] },
      { id: '5', name: 'Full Access', resource: 'uploads', actions: ['create', 'read', 'update', 'delete'] },
      { id: '6', name: 'Full Access', resource: 'lessons', actions: ['create', 'read', 'update', 'delete'] },
      { id: '7', name: 'Full Access', resource: 'scholars', actions: ['create', 'read', 'update', 'delete'] },
      { id: '8', name: 'Full Access', resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
      { id: '9', name: 'Full Access', resource: 'analytics', actions: ['create', 'read', 'update', 'delete'] },
    ],
    lastLogin: new Date().toISOString(),
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'moderator@tijaniyahpro.com',
    name: 'Content Moderator',
    role: 'moderator',
    permissions: [
      { id: '1', name: 'Read Only', resource: 'users', actions: ['read'] },
      { id: '2', name: 'Content Management', resource: 'news', actions: ['create', 'read', 'update'] },
      { id: '3', name: 'Content Management', resource: 'events', actions: ['create', 'read', 'update'] },
      { id: '4', name: 'Read Only', resource: 'donations', actions: ['read'] },
      { id: '5', name: 'Upload Management', resource: 'uploads', actions: ['create', 'read', 'update'] },
      { id: '6', name: 'Content Management', resource: 'lessons', actions: ['create', 'read', 'update'] },
      { id: '7', name: 'Content Management', resource: 'scholars', actions: ['create', 'read', 'update'] },
    ],
    lastLogin: new Date().toISOString(),
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Mock passwords (in production, these would be hashed)
const MOCK_PASSWORDS: { [email: string]: string } = {
  'admin@tijaniyahpro.com': 'admin123',
  'moderator@tijaniyahpro.com': 'moderator123',
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, isAdmin, isSuperAdmin, isModerator, getUserRole } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [authState.user]);

  const checkAdminAccess = async () => {
    try {
      if (authState.user && (isAdmin() || isModerator())) {
        // Convert regular user to admin user format
        const adminUserData: AdminUser = {
          id: authState.user.id,
          email: authState.user.email,
          name: authState.user.name,
          role: authState.user.role as 'super_admin' | 'admin' | 'moderator',
          permissions: getPermissionsForRole(authState.user.role as 'super_admin' | 'admin' | 'moderator'),
          lastLogin: authState.user.lastLogin,
          isActive: true,
          createdAt: authState.user.createdAt,
        };
        setAdminUser(adminUserData);
        await saveAuthData(adminUserData, `admin_token_${Date.now()}_${authState.user.id}`);
      } else {
        setAdminUser(null);
        await clearAuthData();
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionsForRole = (role: 'super_admin' | 'admin' | 'moderator'): AdminPermission[] => {
    const allPermissions: AdminPermission[] = [
      { id: '1', name: 'Full Access', resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { id: '2', name: 'Full Access', resource: 'news', actions: ['create', 'read', 'update', 'delete'] },
      { id: '3', name: 'Full Access', resource: 'events', actions: ['create', 'read', 'update', 'delete'] },
      { id: '4', name: 'Full Access', resource: 'donations', actions: ['create', 'read', 'update', 'delete'] },
      { id: '5', name: 'Full Access', resource: 'uploads', actions: ['create', 'read', 'update', 'delete'] },
      { id: '6', name: 'Full Access', resource: 'lessons', actions: ['create', 'read', 'update', 'delete'] },
      { id: '7', name: 'Full Access', resource: 'scholars', actions: ['create', 'read', 'update', 'delete'] },
      { id: '8', name: 'Full Access', resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
      { id: '9', name: 'Full Access', resource: 'analytics', actions: ['create', 'read', 'update', 'delete'] },
    ];

    const moderatorPermissions: AdminPermission[] = [
      { id: '1', name: 'Read Only', resource: 'users', actions: ['read'] },
      { id: '2', name: 'Content Management', resource: 'news', actions: ['create', 'read', 'update'] },
      { id: '3', name: 'Content Management', resource: 'events', actions: ['create', 'read', 'update'] },
      { id: '4', name: 'Read Only', resource: 'donations', actions: ['read'] },
      { id: '5', name: 'Upload Management', resource: 'uploads', actions: ['create', 'read', 'update'] },
      { id: '6', name: 'Content Management', resource: 'lessons', actions: ['create', 'read', 'update'] },
      { id: '7', name: 'Content Management', resource: 'scholars', actions: ['create', 'read', 'update'] },
    ];

    switch (role) {
      case 'super_admin':
      case 'admin':
        return allPermissions;
      case 'moderator':
        return moderatorPermissions;
      default:
        return [];
    }
  };

  const saveAuthData = async (user: AdminUser, token: string) => {
    try {
      const authData = {
        adminUser: user,
        token: token,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(authData));
      await AsyncStorage.setItem(ADMIN_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving admin auth data:', error);
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.removeItem(ADMIN_STORAGE_KEY);
      await AsyncStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing admin auth data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // This function is now handled by the main AuthContext
      // Admin users will be automatically redirected based on their role
      return false; // This should not be called directly anymore
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setAdminUser(null);
      await clearAuthData();
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!adminUser) return false;
    
    // Super admin has all permissions
    if (adminUser.role === 'super_admin') return true;
    
    // Check specific permissions
    const permission = adminUser.permissions.find(p => p.resource === resource);
    return permission ? permission.actions.includes(action as any) : false;
  };

  const updateProfile = async (data: Partial<AdminUser>): Promise<boolean> => {
    try {
      if (!adminUser) return false;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...adminUser, ...data };
      setAdminUser(updatedUser);
      
      // Update stored data
      const storedAuth = await AsyncStorage.getItem(ADMIN_STORAGE_KEY);
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        authData.adminUser = updatedUser;
        await AsyncStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(authData));
      }
      
      return true;
    } catch (error) {
      console.error('Error updating admin profile:', error);
      return false;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!adminUser) return false;
      
      // Check old password
      const correctOldPassword = MOCK_PASSWORDS[adminUser.email];
      if (oldPassword !== correctOldPassword) {
        throw new Error('Current password is incorrect');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update password in mock data
      MOCK_PASSWORDS[adminUser.email] = newPassword;
      
      return true;
    } catch (error) {
      console.error('Error changing admin password:', error);
      return false;
    }
  };

  const value: AdminAuthContextType = {
    adminUser,
    isAuthenticated: !!adminUser,
    isLoading,
    login,
    logout,
    hasPermission,
    updateProfile,
    changePassword,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
