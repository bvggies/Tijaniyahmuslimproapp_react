import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../../lib/api';

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardQueryKeys.all, 'overview'] as const,
  dailyStats: (startDate: string, endDate: string) => 
    [...dashboardQueryKeys.all, 'daily', startDate, endDate] as const,
  activity: () => [...dashboardQueryKeys.all, 'activity'] as const,
};

export function useOverviewStats() {
  return useQuery({
    queryKey: dashboardQueryKeys.overview(),
    queryFn: analyticsApi.getOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

export function useDailyStats(startDate: string, endDate: string) {
  return useQuery({
    queryKey: dashboardQueryKeys.dailyStats(startDate, endDate),
    queryFn: () => analyticsApi.getDailyStats(startDate, endDate),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: Boolean(startDate && endDate),
  });
}

export function useRecentActivity(limit = 20) {
  return useQuery({
    queryKey: dashboardQueryKeys.activity(),
    queryFn: () => analyticsApi.getRecentActivity(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
}

// Mock data fallback for when API is not available
export const mockOverviewData = {
  totalUsers: 12450,
  activeUsers7d: 3241,
  activeUsers30d: 8924,
  newUsersToday: 47,
  postsToday: 234,
  reportsPending: 7,
  donationsToday: 420,
  donationsWeek: 2840,
  donationsMonth: 8420,
  upcomingEvents: 15,
  wazifaCompletions: 1823,
  lazimCompletions: 956,
};

export const mockDailyStats = [
  { date: '2024-01-24', activeUsers: 2841, newUsers: 42, posts: 187, donations: 380 },
  { date: '2024-01-25', activeUsers: 2956, newUsers: 38, posts: 201, donations: 420 },
  { date: '2024-01-26', activeUsers: 3102, newUsers: 51, posts: 224, donations: 510 },
  { date: '2024-01-27', activeUsers: 2789, newUsers: 35, posts: 178, donations: 290 },
  { date: '2024-01-28', activeUsers: 3241, newUsers: 47, posts: 234, donations: 420 },
  { date: '2024-01-29', activeUsers: 3156, newUsers: 44, posts: 219, donations: 380 },
  { date: '2024-01-30', activeUsers: 3312, newUsers: 52, posts: 241, donations: 520 },
];

export const mockActivityData = [
  { id: '1', type: 'user_signup' as const, userName: 'Ahmad Hassan', description: 'New user registered', timestamp: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: '2', type: 'report' as const, description: 'Post reported for review', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: '3', type: 'donation' as const, userName: 'Anonymous', description: 'Donation received: $50', timestamp: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: '4', type: 'event_created' as const, description: 'Event "Jumma Gathering" published', timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString() },
  { id: '5', type: 'user_signup' as const, userName: 'Fatima Ali', description: 'New user registered', timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString() },
  { id: '6', type: 'post_created' as const, userName: 'Ibrahim Khan', description: 'New community post', timestamp: new Date(Date.now() - 4 * 60 * 60000).toISOString() },
  { id: '7', type: 'donation' as const, userName: 'Mohammed Ali', description: 'Donation received: $100', timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString() },
];














