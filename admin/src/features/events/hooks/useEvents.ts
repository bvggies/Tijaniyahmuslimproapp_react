import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../../../lib/api';
import { Event, CreateEventDto } from '../../../lib/api/types';
import { toast } from '../../../components/ui/use-toast';

export const eventQueryKeys = {
  all: ['events'] as const,
  lists: () => [...eventQueryKeys.all, 'list'] as const,
  list: (filters: UseEventsParams) => [...eventQueryKeys.lists(), filters] as const,
  details: () => [...eventQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventQueryKeys.details(), id] as const,
};

interface UseEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export function useEvents(params: UseEventsParams = {}) {
  return useQuery({
    queryKey: eventQueryKeys.list(params),
    queryFn: () => eventsApi.getAll(params),
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache old data
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventQueryKeys.detail(id),
    queryFn: () => eventsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateEventDto) => eventsApi.create(data),
    onSuccess: (newEvent) => {
      // Invalidate all event queries
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all });
      // Force refetch all event list queries
      queryClient.refetchQueries({ 
        queryKey: eventQueryKeys.all,
        type: 'active' 
      });
      toast.success('Event created', 'Event has been created successfully.');
    },
    onError: (error: Error) => {
      toast.error('Creation failed', error.message);
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventDto> }) =>
      eventsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.lists() });
      toast.success('Event updated', 'Event has been updated successfully.');
    },
    onError: (error: Error) => {
      toast.error('Update failed', error.message);
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.lists() });
      toast.success('Event deleted', 'Event has been deleted.');
    },
    onError: (error: Error) => {
      toast.error('Delete failed', error.message);
    },
  });
}

export function usePublishEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => eventsApi.publish(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.lists() });
      toast.success('Event published', 'Event is now visible to users.');
    },
    onError: (error: Error) => {
      toast.error('Publish failed', error.message);
    },
  });
}

export function useUnpublishEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => eventsApi.unpublish(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.lists() });
      toast.success('Event unpublished', 'Event is now hidden from users.');
    },
    onError: (error: Error) => {
      toast.error('Unpublish failed', error.message);
    },
  });
}

// Mock events data
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Friday Jumma Gathering',
    description: 'Join us for our weekly Jumma gathering with Sheikh Ibrahim leading the prayers and providing spiritual guidance.',
    startDate: '2024-02-02T12:30:00Z',
    endDate: '2024-02-02T14:00:00Z',
    location: 'Tijaniyah Central Mosque, Accra',
    category: 'Prayer',
    tags: ['jumma', 'weekly', 'prayer'],
    isPublished: true,
    rsvpCount: 156,
    createdBy: 'admin',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z',
  },
  {
    id: '2',
    title: 'Mawlid Celebration 2024',
    description: 'Annual celebration of the Prophet Muhammad (PBUH) birth with special dhikr sessions, lectures, and community feast.',
    startDate: '2024-09-15T18:00:00Z',
    endDate: '2024-09-15T23:00:00Z',
    location: 'Grand Islamic Center, Lagos',
    imageUrl: 'https://example.com/mawlid.jpg',
    category: 'Celebration',
    tags: ['mawlid', 'annual', 'celebration'],
    isPublished: true,
    rsvpCount: 842,
    createdBy: 'admin',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },
  {
    id: '3',
    title: 'Islamic Finance Workshop',
    description: 'Learn about halal investment strategies and Islamic banking principles from industry experts.',
    startDate: '2024-02-10T10:00:00Z',
    endDate: '2024-02-10T16:00:00Z',
    location: 'Virtual - Zoom',
    category: 'Education',
    tags: ['finance', 'workshop', 'education'],
    isPublished: false,
    createdBy: 'moderator',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '4',
    title: 'Youth Quran Competition',
    description: 'Annual Quran recitation competition for youth ages 10-18. Categories: Memorization, Tajweed, and Tafsir.',
    startDate: '2024-03-20T09:00:00Z',
    endDate: '2024-03-20T17:00:00Z',
    location: 'Tijaniyah Islamic School, Dakar',
    category: 'Competition',
    tags: ['quran', 'youth', 'competition'],
    isPublished: true,
    rsvpCount: 234,
    createdBy: 'scholar',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
  },
  {
    id: '5',
    title: 'Ramadan Preparation Seminar',
    description: 'Get spiritually prepared for Ramadan with tips on fasting, prayer schedules, and maximizing the holy month.',
    startDate: '2024-02-25T19:00:00Z',
    endDate: '2024-02-25T21:00:00Z',
    location: 'Community Hall, Cairo',
    category: 'Education',
    tags: ['ramadan', 'preparation', 'seminar'],
    isPublished: true,
    rsvpCount: 189,
    createdBy: 'admin',
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
];

export const eventCategories = [
  'Prayer',
  'Celebration',
  'Education',
  'Competition',
  'Community',
  'Charity',
  'Other',
];

