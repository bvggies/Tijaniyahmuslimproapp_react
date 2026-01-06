import { get, post, patch, put, del } from './client';
import {
  AuthResponse,
  LoginCredentials,
  User,
  AnalyticsOverview,
  DailyAnalytics,
  ActivityItem,
  Event,
  CreateEventDto,
  Post,
  Comment,
  Report,
  ModerationAction,
  Scholar,
  Lesson,
  NotificationCampaign,
  Donation,
  Dua,
  Wazifa,
  JummaDhikr,
  Stream,
  Announcement,
  NewsArticle,
  NewsCategory,
  AuditLog,
  PaginatedResponse,
} from './types';

// ==================== AUTH ====================
export const authApi = {
  login: (credentials: LoginCredentials) =>
    post<AuthResponse>('/auth/login', credentials),
  
  getMe: () => get<User>('/auth/me'),
  
  logout: () => post('/auth/logout'),
};

// ==================== ANALYTICS ====================
export const analyticsApi = {
  getOverview: () => get<AnalyticsOverview>('/analytics/overview'),
  
  getDailyStats: (startDate: string, endDate: string) =>
    get<DailyAnalytics[]>('/analytics/daily', { startDate, endDate }),
  
  getRecentActivity: (limit = 20) =>
    get<ActivityItem[]>('/analytics/activity', { limit }),
};

// ==================== USERS ====================
export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) =>
    get<PaginatedResponse<User>>('/users', params),
  
  getById: (id: string) => get<User>(`/users/${id}`),
  
  update: (id: string, data: Partial<User>) =>
    patch<User>(`/users/${id}`, data),
  
  updateRole: (id: string, role: string) =>
    patch<User>(`/users/${id}/role`, { role }),
  
  activate: (id: string) => patch<User>(`/users/${id}/activate`),
  
  deactivate: (id: string) => patch<User>(`/users/${id}/deactivate`),
  
  delete: (id: string) => del(`/users/${id}`),
};

// ==================== EVENTS ====================
export const eventsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; category?: string }) =>
    get<PaginatedResponse<Event>>('/events', params),
  
  getById: (id: string) => get<Event>(`/events/${id}`),
  
  create: (data: CreateEventDto) => post<Event>('/events', data),
  
  update: (id: string, data: Partial<CreateEventDto>) =>
    patch<Event>(`/events/${id}`, data),
  
  delete: (id: string) => del(`/events/${id}`),
  
  publish: (id: string) => patch<Event>(`/events/${id}/publish`),
  
  unpublish: (id: string) => patch<Event>(`/events/${id}/unpublish`),
};

// ==================== POSTS ====================
export const postsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; userId?: string }) =>
    get<PaginatedResponse<Post>>('/posts', params),
  
  getById: (id: string) => get<Post>(`/posts/${id}`),
  
  getComments: (postId: string) => get<Comment[]>(`/posts/${postId}/comments`),
  
  hide: (id: string) => patch<Post>(`/posts/${id}/hide`),
  
  unhide: (id: string) => patch<Post>(`/posts/${id}/unhide`),
  
  pin: (id: string) => patch<Post>(`/posts/${id}/pin`),
  
  unpin: (id: string) => patch<Post>(`/posts/${id}/unpin`),
  
  lock: (id: string) => patch<Post>(`/posts/${id}/lock`),
  
  unlock: (id: string) => patch<Post>(`/posts/${id}/unlock`),
  
  delete: (id: string) => del(`/posts/${id}`),
  
  deleteComment: (postId: string, commentId: string) =>
    del(`/posts/${postId}/comments/${commentId}`),
};

// ==================== REPORTS ====================
export const reportsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string; type?: string }) =>
    get<PaginatedResponse<Report>>('/reports', params),
  
  getById: (id: string) => get<Report>(`/reports/${id}`),
  
  resolve: (id: string, action: string, reason: string) =>
    patch<Report>(`/reports/${id}/resolve`, { action, reason }),
  
  dismiss: (id: string, reason: string) =>
    patch<Report>(`/reports/${id}/dismiss`, { reason }),
  
  getModerationHistory: (targetType: string, targetId: string) =>
    get<ModerationAction[]>(`/moderation-actions`, { targetType, targetId }),
};

// ==================== SCHOLARS ====================
export const scholarsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    get<PaginatedResponse<Scholar>>('/scholars', params),
  
  getById: (id: string) => get<Scholar>(`/scholars/${id}`),
  
  create: (data: Partial<Scholar>) => post<Scholar>('/scholars', data),
  
  update: (id: string, data: Partial<Scholar>) =>
    patch<Scholar>(`/scholars/${id}`, data),
  
  delete: (id: string) => del(`/scholars/${id}`),
  
  verify: (id: string) => patch<Scholar>(`/scholars/${id}/verify`),
  
  unverify: (id: string) => patch<Scholar>(`/scholars/${id}/unverify`),
};

// ==================== LESSONS ====================
export const lessonsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; scholarId?: string }) =>
    get<PaginatedResponse<Lesson>>('/lessons', params),
  
  getById: (id: string) => get<Lesson>(`/lessons/${id}`),
  
  create: (data: Partial<Lesson>) => post<Lesson>('/lessons', data),
  
  update: (id: string, data: Partial<Lesson>) =>
    patch<Lesson>(`/lessons/${id}`, data),
  
  delete: (id: string) => del(`/lessons/${id}`),
  
  publish: (id: string) => patch<Lesson>(`/lessons/${id}/publish`),
  
  unpublish: (id: string) => patch<Lesson>(`/lessons/${id}/unpublish`),
};

// ==================== NOTIFICATIONS ====================
export const notificationsApi = {
  // Campaign management
  getCampaigns: (params?: { limit?: number; cursor?: string; status?: string }) =>
    get<{ data: NotificationCampaign[]; nextCursor: string | null; hasNextPage: boolean }>('/admin/campaigns', params),
  
  getCampaign: (id: string) => get<NotificationCampaign>(`/admin/campaigns/${id}`),
  
  createCampaign: (data: {
    title: string;
    body: string;
    deepLink?: string;
    targetType: 'all' | 'new_users' | 'active_users' | 'inactive_users' | 'custom';
    targetFilters?: Record<string, any>;
    scheduledAt?: string;
    sendNow?: boolean;
  }) => post<NotificationCampaign>('/admin/campaigns', data),
  
  deleteCampaign: (id: string) => del(`/admin/campaigns/${id}`),
  
  sendCampaign: (id: string) => post<NotificationCampaign>(`/admin/campaigns/${id}/send`),
};

// ==================== DONATIONS ====================
export const donationsApi = {
  getAll: (params?: { page?: number; limit?: number; startDate?: string; endDate?: string; status?: string }) =>
    get<PaginatedResponse<Donation>>('/donations', params),
  
  getById: (id: string) => get<Donation>(`/donations/${id}`),
  
  getStats: (startDate?: string, endDate?: string) =>
    get<{ total: number; count: number; byMethod: Record<string, number> }>('/donations/stats', { startDate, endDate }),
  
  export: (params?: { startDate?: string; endDate?: string; format?: 'csv' | 'json' }) =>
    get<Blob>('/donations/export', params),
};

// ==================== CONTENT ====================
export const duasApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string }) =>
    get<PaginatedResponse<Dua>>('/content/duas', params),
  
  getById: (id: string) => get<Dua>(`/content/duas/${id}`),
  
  create: (data: Partial<Dua>) => post<Dua>('/content/duas', data),
  
  update: (id: string, data: Partial<Dua>) =>
    patch<Dua>(`/content/duas/${id}`, data),
  
  delete: (id: string) => del(`/content/duas/${id}`),
};

export const wazifaApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    get<PaginatedResponse<Wazifa>>('/content/wazifa', params),
  
  getById: (id: string) => get<Wazifa>(`/content/wazifa/${id}`),
  
  create: (data: Partial<Wazifa>) => post<Wazifa>('/content/wazifa', data),
  
  update: (id: string, data: Partial<Wazifa>) =>
    patch<Wazifa>(`/content/wazifa/${id}`, data),
  
  delete: (id: string) => del(`/content/wazifa/${id}`),
};

export const jummaDhikrApi = {
  getAll: () => get<JummaDhikr[]>('/content/jumma-dhikr'),
  
  getById: (id: string) => get<JummaDhikr>(`/content/jumma-dhikr/${id}`),
  
  create: (data: Partial<JummaDhikr>) => post<JummaDhikr>('/content/jumma-dhikr', data),
  
  update: (id: string, data: Partial<JummaDhikr>) =>
    patch<JummaDhikr>(`/content/jumma-dhikr/${id}`, data),
  
  delete: (id: string) => del(`/content/jumma-dhikr/${id}`),
  
  setActive: (id: string) => patch<JummaDhikr>(`/content/jumma-dhikr/${id}/activate`),
};

export const streamsApi = {
  getAll: () => get<Stream[]>('/streams'),
  
  getById: (id: string) => get<Stream>(`/streams/${id}`),
  
  create: (data: Partial<Stream>) => post<Stream>('/streams', data),
  
  update: (id: string, data: Partial<Stream>) =>
    patch<Stream>(`/streams/${id}`, data),
  
  delete: (id: string) => del(`/streams/${id}`),
};

export const announcementsApi = {
  getAll: (params?: { active?: boolean }) =>
    get<Announcement[]>('/announcements', params),
  
  getById: (id: string) => get<Announcement>(`/announcements/${id}`),
  
  create: (data: Partial<Announcement>) => post<Announcement>('/announcements', data),
  
  update: (id: string, data: Partial<Announcement>) =>
    patch<Announcement>(`/announcements/${id}`, data),
  
  delete: (id: string) => del(`/announcements/${id}`),
};

// ==================== NEWS ====================
export const newsApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; isPublished?: boolean }) =>
    get<PaginatedResponse<NewsArticle>>('/news', params),
  
  getById: (id: string) => get<NewsArticle>(`/news/${id}`),
  
  create: (data: Partial<NewsArticle>) => post<NewsArticle>('/news', data),
  
  update: (id: string, data: Partial<NewsArticle>) =>
    patch<NewsArticle>(`/news/${id}`, data),
  
  delete: (id: string) => del(`/news/${id}`),
  
  publish: (id: string) => patch<NewsArticle>(`/news/${id}/publish`),
  
  unpublish: (id: string) => patch<NewsArticle>(`/news/${id}/unpublish`),
};

// ==================== NEWS CATEGORIES ====================
export const newsCategoriesApi = {
  getAll: (activeOnly?: boolean) =>
    get<NewsCategory[]>(`/news-categories${activeOnly !== undefined ? `?activeOnly=${activeOnly}` : ''}`),
  
  getById: (id: string) => get<NewsCategory>(`/news-categories/${id}`),
  
  create: (data: Partial<NewsCategory>) => post<NewsCategory>('/news-categories', data),
  
  update: (id: string, data: Partial<NewsCategory>) =>
    patch<NewsCategory>(`/news-categories/${id}`, data),
  
  delete: (id: string) => del(`/news-categories/${id}`),
};

// ==================== AUDIT LOGS ====================
export const auditLogsApi = {
  getAll: (params?: { page?: number; limit?: number; userId?: string; action?: string; entityType?: string }) =>
    get<PaginatedResponse<AuditLog>>('/audit-logs', params),
};

// ==================== MAKKAH LIVE ====================
export interface MakkahLiveChannel {
  id: string;
  title: string;
  titleArabic?: string;
  subtitle?: string;
  type: 'YOUTUBE_LIVE' | 'TV_CHANNEL';
  category: 'MAKKAH' | 'MADINAH' | 'QURAN' | 'ISLAMIC' | 'NEWS' | 'EDUCATIONAL';
  youtubeId?: string;
  websiteUrl?: string;
  logo?: string;
  thumbnailUrl?: string;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMakkahChannelDto {
  title: string;
  titleArabic?: string;
  subtitle?: string;
  type: 'YOUTUBE_LIVE' | 'TV_CHANNEL';
  category: 'MAKKAH' | 'MADINAH' | 'QURAN' | 'ISLAMIC' | 'NEWS' | 'EDUCATIONAL';
  youtubeId?: string;
  websiteUrl?: string;
  logo?: string;
  thumbnailUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export const makkahLiveApi = {
  getAll: () => get<MakkahLiveChannel[]>('/makkah-live/admin/channels'),
  
  getById: (id: string) => get<MakkahLiveChannel>(`/makkah-live/channels/${id}`),
  
  create: (data: CreateMakkahChannelDto) => 
    post<MakkahLiveChannel>('/makkah-live/admin/channels', data),
  
  update: (id: string, data: Partial<CreateMakkahChannelDto>) =>
    put<MakkahLiveChannel>(`/makkah-live/admin/channels/${id}`, data),
  
  delete: (id: string) => del(`/makkah-live/admin/channels/${id}`),
  
  toggleStatus: (id: string) =>
    put<MakkahLiveChannel>(`/makkah-live/admin/channels/${id}/toggle-status`),
  
  toggleFeatured: (id: string) =>
    put<MakkahLiveChannel>(`/makkah-live/admin/channels/${id}/toggle-featured`),
  
  reorder: (orders: { id: string; sortOrder: number }[]) =>
    put<MakkahLiveChannel[]>('/makkah-live/admin/channels/reorder', { orders }),
  
  seed: () => post<{ message: string; count: number }>('/makkah-live/admin/seed'),
};

// ==================== SYSTEM ====================
export const systemApi = {
  getHealth: () => get<{ status: string; timestamp: string }>('/health'),
  
  getStatus: () => get<{ 
    database: boolean; 
    cache: boolean; 
    storage: boolean;
    version: string;
  }>('/system/status'),
};

