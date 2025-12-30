import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../../../lib/api';
import { NotificationCampaign } from '../../../lib/api/types';
import { toast } from '../../../components/ui/use-toast';

export interface NotificationFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  campaigns: () => [...notificationQueryKeys.all, 'campaigns'] as const,
  campaignList: (filters: NotificationFilters) => [...notificationQueryKeys.campaigns(), filters] as const,
  campaign: (id: string) => [...notificationQueryKeys.campaigns(), id] as const,
};

export function useNotificationCampaigns(params: NotificationFilters = {}) {
  return useQuery({
    queryKey: notificationQueryKeys.campaignList(params),
    queryFn: () => notificationsApi.getCampaigns(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<NotificationCampaign>) => notificationsApi.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.campaigns() });
      toast.success('Campaign created', 'Notification campaign has been created.');
    },
    onError: (error: Error) => {
      toast.error('Creation failed', error.message);
    },
  });
}

export function useSendCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => notificationsApi.sendCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.campaigns() });
      toast.success('Campaign sent', 'Notifications are being delivered.');
    },
    onError: (error: Error) => {
      toast.error('Send failed', error.message);
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.campaigns() });
      toast.success('Campaign deleted', 'Notification campaign has been deleted.');
    },
    onError: (error: Error) => {
      toast.error('Delete failed', error.message);
    },
  });
}

// User segment types for targeting
export type UserSegment = 
  | 'all'
  | 'premium'
  | 'free'
  | 'new_users_7d'
  | 'new_users_30d'
  | 'inactive_7d'
  | 'inactive_30d'
  | 'active_users'
  | 'scholars'
  | 'verified'
  | 'unverified'
  | 'custom';

export interface UserSegmentOption {
  value: UserSegment;
  label: string;
  description: string;
  icon: string;
  estimatedCount?: number;
}

export const userSegments: UserSegmentOption[] = [
  { value: 'all', label: 'All Users', description: 'Send to everyone', icon: 'users', estimatedCount: 12450 },
  { value: 'premium', label: 'Premium Users', description: 'Paid subscription users', icon: 'crown', estimatedCount: 1240 },
  { value: 'free', label: 'Free Users', description: 'Users without subscription', icon: 'user', estimatedCount: 11210 },
  { value: 'new_users_7d', label: 'New Users (7 days)', description: 'Registered in last 7 days', icon: 'user-plus', estimatedCount: 324 },
  { value: 'new_users_30d', label: 'New Users (30 days)', description: 'Registered in last 30 days', icon: 'user-plus', estimatedCount: 1456 },
  { value: 'inactive_7d', label: 'Inactive (7 days)', description: 'No activity in 7 days', icon: 'user-x', estimatedCount: 2100 },
  { value: 'inactive_30d', label: 'Inactive (30 days)', description: 'No activity in 30 days', icon: 'user-x', estimatedCount: 4500 },
  { value: 'active_users', label: 'Active Users', description: 'Active in last 7 days', icon: 'activity', estimatedCount: 3241 },
  { value: 'scholars', label: 'Scholars', description: 'Verified scholar accounts', icon: 'graduation-cap', estimatedCount: 45 },
  { value: 'verified', label: 'Verified Email', description: 'Users with verified email', icon: 'check-circle', estimatedCount: 9800 },
  { value: 'unverified', label: 'Unverified Email', description: 'Pending email verification', icon: 'alert-circle', estimatedCount: 2650 },
  { value: 'custom', label: 'Custom Selection', description: 'Select specific users', icon: 'filter', estimatedCount: 0 },
];

// Notification templates for quick creation
export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  category: 'reminder' | 'announcement' | 'promotion' | 'event' | 'update';
}

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Prayer Time Reminder',
    title: '🕌 Prayer Time',
    body: "It's time for {{prayer_name}} prayer. May Allah accept your worship.",
    category: 'reminder',
  },
  {
    id: '2',
    name: 'Daily Dhikr Reminder',
    title: '📿 Daily Dhikr',
    body: "Don't forget your daily dhikr and remembrance of Allah.",
    category: 'reminder',
  },
  {
    id: '3',
    name: 'New Event Announcement',
    title: '📅 New Event',
    body: 'Join us for {{event_name}} on {{event_date}}. Register now!',
    category: 'event',
  },
  {
    id: '4',
    name: 'New Lesson Available',
    title: '📚 New Lesson',
    body: 'Sheikh {{scholar_name}} has published a new lesson: "{{lesson_title}}"',
    category: 'update',
  },
  {
    id: '5',
    name: 'Jumma Reminder',
    title: '🕌 Jumma Mubarak',
    body: "It's Friday! Don't forget to recite Surah Al-Kahf and send blessings upon the Prophet ﷺ",
    category: 'reminder',
  },
  {
    id: '6',
    name: 'Ramadan Preparation',
    title: '🌙 Ramadan is Coming',
    body: 'Prepare your heart and soul for the blessed month. {{days_remaining}} days until Ramadan!',
    category: 'announcement',
  },
  {
    id: '7',
    name: 'Premium Upgrade',
    title: '⭐ Upgrade to Premium',
    body: 'Unlock all features and support the community. Get 20% off this month!',
    category: 'promotion',
  },
  {
    id: '8',
    name: 'Community Welcome',
    title: '👋 Welcome to Tijaniyah',
    body: 'Assalamu Alaikum! We are blessed to have you join our community. Explore the app and begin your spiritual journey.',
    category: 'announcement',
  },
];

// Mock campaigns data
export const mockCampaigns: NotificationCampaign[] = [
  {
    id: '1',
    title: '🕌 Jumma Mubarak',
    body: "It's Friday! Don't forget to recite Surah Al-Kahf.",
    targetType: 'all',
    trigger: 'manual',
    status: 'sent',
    sentAt: '2024-01-26T12:00:00Z',
    sentCount: 12450,
    openRate: 0.68,
    createdBy: 'admin',
    createdAt: '2024-01-26T10:00:00Z',
    updatedAt: '2024-01-26T12:00:00Z',
  },
  {
    id: '2',
    title: '📅 Upcoming Mawlid Event',
    body: 'Join us for the annual Mawlid celebration on February 15th.',
    targetType: 'active',
    trigger: 'manual',
    status: 'sent',
    sentAt: '2024-01-25T14:00:00Z',
    sentCount: 3241,
    openRate: 0.72,
    createdBy: 'moderator',
    createdAt: '2024-01-25T12:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
  {
    id: '3',
    title: '⭐ Premium Features Now Available',
    body: 'Upgrade to access exclusive lessons and ad-free experience.',
    targetType: 'free',
    trigger: 'scheduled',
    targetFilters: { tier: 'free' },
    status: 'scheduled',
    scheduledAt: '2024-02-01T09:00:00Z',
    createdBy: 'admin',
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z',
  },
  {
    id: '4',
    title: '👋 Welcome New Members',
    body: 'Thank you for joining! Start your journey with our beginner lessons.',
    targetType: 'new_users',
    trigger: 'manual',
    targetFilters: { registeredAfter: '2024-01-21' },
    status: 'draft',
    createdBy: 'admin',
    createdAt: '2024-01-28T08:00:00Z',
    updatedAt: '2024-01-28T08:00:00Z',
  },
];

