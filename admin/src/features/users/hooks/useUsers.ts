import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../../lib/api';
import { User, UserRole } from '../../../lib/api/types';
import { toast } from '../../../components/ui/use-toast';

interface UseUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  tier?: string;
  category?: string;
  country?: string;
  registeredAfter?: string;
  registeredBefore?: string;
}

export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters: UseUsersParams) => [...userQueryKeys.lists(), filters] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

export function useUsers(params: UseUsersParams = {}) {
  return useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => usersApi.getAll(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      toast.success('User updated', 'User information has been updated successfully.');
    },
    onError: (error: Error) => {
      toast.error('Update failed', error.message);
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      usersApi.updateRole(id, role),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      toast.success('Role updated', 'User role has been changed successfully.');
    },
    onError: (error: Error) => {
      toast.error('Role update failed', error.message);
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => usersApi.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      toast.success('User activated', 'User account has been activated.');
    },
    onError: (error: Error) => {
      toast.error('Activation failed', error.message);
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => usersApi.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      toast.success('User deactivated', 'User account has been deactivated.');
    },
    onError: (error: Error) => {
      toast.error('Deactivation failed', error.message);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      toast.success('User deleted', 'User account has been deleted.');
    },
    onError: (error: Error) => {
      toast.error('Delete failed', error.message);
    },
  });
}

// User categories for filtering
export const userCategories = [
  { value: 'all', label: 'All Users', description: 'All registered users' },
  { value: 'premium', label: 'Premium Users', description: 'Users with premium subscription' },
  { value: 'free', label: 'Free Users', description: 'Users on free tier' },
  { value: 'new', label: 'New Users (7 days)', description: 'Registered in last 7 days' },
  { value: 'new_30', label: 'New Users (30 days)', description: 'Registered in last 30 days' },
  { value: 'active', label: 'Active Users', description: 'Active in last 7 days' },
  { value: 'inactive', label: 'Inactive Users', description: 'No activity in 30+ days' },
  { value: 'verified', label: 'Verified Email', description: 'Email verified users' },
  { value: 'unverified', label: 'Unverified Email', description: 'Email not verified' },
  { value: 'has_streak', label: 'Has Streak', description: 'Users with active streak' },
  { value: 'donors', label: 'Donors', description: 'Users who have donated' },
];

// Mock users data with enhanced fields
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@tijaniyahpro.com',
    name: 'Super Administrator',
    role: 'ADMIN',
    isActive: true,
    emailVerified: true,
    tier: 'vip',
    isPremium: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-28T10:30:00Z',
    lastLoginAt: '2024-01-28T10:30:00Z',
    lastActiveAt: '2024-01-28T10:30:00Z',
    city: 'Accra',
    country: 'Ghana',
    notificationsEnabled: true,
    streakCount: 45,
    totalPrayers: 320,
    donationsTotal: 500,
  },
  {
    id: '2',
    email: 'moderator@tijaniyahpro.com',
    name: 'Content Moderator',
    role: 'MODERATOR',
    isActive: true,
    emailVerified: true,
    tier: 'premium',
    isPremium: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-27T15:20:00Z',
    lastLoginAt: '2024-01-27T15:20:00Z',
    lastActiveAt: '2024-01-27T15:20:00Z',
    city: 'Lagos',
    country: 'Nigeria',
    notificationsEnabled: true,
    streakCount: 30,
    totalPrayers: 210,
    donationsTotal: 150,
  },
  {
    id: '3',
    email: 'scholar@example.com',
    name: 'Sheikh Ibrahim',
    role: 'SCHOLAR',
    isActive: true,
    emailVerified: true,
    tier: 'vip',
    isPremium: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-26T09:00:00Z',
    lastActiveAt: '2024-01-26T09:00:00Z',
    city: 'Dakar',
    country: 'Senegal',
    notificationsEnabled: true,
    streakCount: 120,
    totalPrayers: 840,
  },
  {
    id: '4',
    email: 'demo@tijaniyah.com',
    name: 'Demo User',
    role: 'USER',
    isActive: true,
    emailVerified: true,
    tier: 'free',
    isPremium: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-28T08:00:00Z',
    lastLoginAt: '2024-01-28T08:00:00Z',
    lastActiveAt: '2024-01-28T08:00:00Z',
    city: 'New York',
    country: 'USA',
    notificationsEnabled: true,
    streakCount: 7,
    totalPrayers: 49,
  },
  {
    id: '5',
    email: 'ahmad@example.com',
    name: 'Ahmad Hassan',
    role: 'USER',
    isActive: true,
    emailVerified: false,
    tier: 'free',
    isPremium: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    city: 'Cairo',
    country: 'Egypt',
    notificationsEnabled: true,
    streakCount: 0,
  },
  {
    id: '6',
    email: 'fatima@example.com',
    name: 'Fatima Ali',
    role: 'USER',
    isActive: false,
    emailVerified: true,
    tier: 'premium',
    isPremium: true,
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    lastActiveAt: '2023-12-15T00:00:00Z', // Inactive
    city: 'Casablanca',
    country: 'Morocco',
    notificationsEnabled: false,
    donationsTotal: 75,
  },
  {
    id: '7',
    email: 'support@tijaniyahpro.com',
    name: 'Support Agent',
    role: 'SUPPORT',
    isActive: true,
    emailVerified: true,
    tier: 'free',
    isPremium: false,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-28T11:00:00Z',
    lastActiveAt: '2024-01-28T11:00:00Z',
    city: 'Accra',
    country: 'Ghana',
    notificationsEnabled: true,
  },
  {
    id: '8',
    email: 'viewer@example.com',
    name: 'Viewer User',
    role: 'VIEWER',
    isActive: true,
    emailVerified: true,
    tier: 'free',
    isPremium: false,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-28T07:00:00Z',
    lastActiveAt: '2024-01-28T07:00:00Z',
    city: 'London',
    country: 'UK',
    notificationsEnabled: true,
    streakCount: 14,
    totalPrayers: 98,
  },
  {
    id: '9',
    email: 'newuser1@example.com',
    name: 'New User One',
    role: 'USER',
    isActive: true,
    emailVerified: true,
    tier: 'free',
    isPremium: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    city: 'Dubai',
    country: 'UAE',
    notificationsEnabled: true,
    streakCount: 1,
  },
  {
    id: '10',
    email: 'newuser2@example.com',
    name: 'New User Two',
    role: 'USER',
    isActive: true,
    emailVerified: false,
    tier: 'free',
    isPremium: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    city: 'Istanbul',
    country: 'Turkey',
    notificationsEnabled: true,
  },
  {
    id: '11',
    email: 'premium1@example.com',
    name: 'Premium Member One',
    role: 'USER',
    isActive: true,
    emailVerified: true,
    tier: 'premium',
    isPremium: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-28T06:00:00Z',
    lastActiveAt: '2024-01-28T06:00:00Z',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    notificationsEnabled: true,
    streakCount: 60,
    totalPrayers: 420,
    donationsTotal: 200,
  },
  {
    id: '12',
    email: 'inactive1@example.com',
    name: 'Inactive User',
    role: 'USER',
    isActive: true,
    emailVerified: true,
    tier: 'free',
    isPremium: false,
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2023-11-15T00:00:00Z',
    lastActiveAt: '2023-11-15T00:00:00Z', // Very inactive
    city: 'Jakarta',
    country: 'Indonesia',
    notificationsEnabled: true,
    streakCount: 0,
  },
];

// Helper function to filter users by category
export function filterUsersByCategory(users: User[], category: string): User[] {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  switch (category) {
    case 'premium':
      return users.filter(u => u.isPremium || u.tier === 'premium' || u.tier === 'vip');
    case 'free':
      return users.filter(u => !u.isPremium && u.tier === 'free');
    case 'new':
      return users.filter(u => new Date(u.createdAt) >= sevenDaysAgo);
    case 'new_30':
      return users.filter(u => new Date(u.createdAt) >= thirtyDaysAgo);
    case 'active':
      return users.filter(u => u.lastActiveAt && new Date(u.lastActiveAt) >= sevenDaysAgo);
    case 'inactive':
      return users.filter(u => !u.lastActiveAt || new Date(u.lastActiveAt) < thirtyDaysAgo);
    case 'verified':
      return users.filter(u => u.emailVerified);
    case 'unverified':
      return users.filter(u => !u.emailVerified);
    case 'has_streak':
      return users.filter(u => u.streakCount && u.streakCount > 0);
    case 'donors':
      return users.filter(u => u.donationsTotal && u.donationsTotal > 0);
    default:
      return users;
  }
}

// Get unique countries from users
export function getUniqueCountries(users: User[]): string[] {
  const countries = users
    .map(u => u.country)
    .filter((c): c is string => Boolean(c));
  return Array.from(new Set(countries)).sort();
}
