// User & Auth Types
export type UserRole = 'ADMIN' | 'MODERATOR' | 'SCHOLAR' | 'SUPPORT' | 'VIEWER' | 'USER';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export type UserTier = 'free' | 'premium' | 'vip';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  tier: UserTier;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
  phone?: string;
  city?: string;
  country?: string;
  deviceToken?: string;
  notificationsEnabled: boolean;
  streakCount?: number;
  totalPrayers?: number;
  donationsTotal?: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Analytics Types
export interface AnalyticsOverview {
  totalUsers: number;
  activeUsers7d: number;
  activeUsers30d: number;
  newUsersToday: number;
  newUsersWeek?: number;
  premiumUsers?: number;
  postsToday: number;
  reportsPending: number;
  donationsToday: number;
  donationsWeek: number;
  donationsMonth: number;
  upcomingEvents: number;
  wazifaCompletions?: number;
  lazimCompletions?: number;
  // Comparison data for calculating changes
  totalUsersLastMonth?: number;
  postsYesterday?: number;
  upcomingEventsLastWeek?: number;
  donationsMonthLastMonth?: number;
}

export interface DailyAnalytics {
  date: string;
  activeUsers: number;
  newUsers: number;
  posts: number;
  donations: number;
}

export interface ActivityItem {
  id: string;
  type: 'user_signup' | 'post_created' | 'donation' | 'report' | 'event_created' | 'notification_sent';
  userId?: string;
  userName?: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  rsvpCount?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  imageUrl?: string;
  category: string;
  tags?: string[];
  isPublished?: boolean;
}

// Post & Community Types
export interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  isLocked: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  type: 'post' | 'comment' | 'user';
  targetId: string;
  reportedBy: string;
  reporterName: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface ModerationAction {
  id: string;
  type: 'hide' | 'delete' | 'lock' | 'warn' | 'ban';
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  performedBy: string;
  performerName: string;
  reason: string;
  createdAt: string;
}

// Scholar & Lessons Types
export interface Scholar {
  id: string;
  name: string;
  nameArabic?: string;
  title?: string;
  biography?: string;
  imageUrl?: string;
  birthYear?: number;
  deathYear?: number;
  location?: string;
  specialty?: string;
  isAlive: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  scholarId: string;
  scholarName: string;
  type: 'audio' | 'video' | 'text';
  contentUrl?: string;
  content?: string;
  duration?: number;
  viewsCount: number;
  completionsCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export type NotificationTargetType = 
  | 'all' 
  | 'individual' 
  | 'group' 
  | 'premium' 
  | 'free'
  | 'new_users'
  | 'inactive'
  | 'active'
  | 'by_country'
  | 'by_role'
  | 'custom';

export type NotificationTrigger = 
  | 'manual'
  | 'scheduled'
  | 'prayer_time'
  | 'streak_reminder'
  | 'event_reminder'
  | 'welcome'
  | 'inactive_reminder'
  | 'donation_thank_you'
  | 'ramadan_special';

export interface NotificationCampaign {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  actionUrl?: string;
  targetType: NotificationTargetType;
  targetUserIds?: string[];
  targetFilters?: {
    country?: string;
    role?: UserRole;
    tier?: UserTier;
    minDaysInactive?: number;
    maxDaysInactive?: number;
    registeredAfter?: string;
    registeredBefore?: string;
    hasStreak?: boolean;
  };
  trigger: NotificationTrigger;
  scheduledAt?: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
  sentCount?: number;
  deliveredCount?: number;
  openedCount?: number;
  openRate?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  trigger: NotificationTrigger;
  isActive: boolean;
  createdAt: string;
}

export interface SendNotificationDto {
  title: string;
  body: string;
  imageUrl?: string;
  actionUrl?: string;
  targetType: NotificationTargetType;
  targetUserIds?: string[];
  targetFilters?: NotificationCampaign['targetFilters'];
  trigger?: NotificationTrigger;
  scheduledAt?: string;
}

// Donation Types
export interface Donation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
}

// Content Types
export interface Dua {
  id: string;
  title: string;
  titleArabic: string;
  content: string;
  contentArabic: string;
  transliteration: string;
  category: string;
  source?: string;
  audioUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Wazifa {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  steps: WazifaStep[];
  category: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WazifaStep {
  order: number;
  title: string;
  titleArabic: string;
  content: string;
  contentArabic: string;
  repeatCount: number;
}

export interface JummaDhikr {
  id: string;
  title: string;
  titleArabic: string;
  dhikrs: DhikrItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DhikrItem {
  order: number;
  text: string;
  textArabic: string;
  repeatCount: number;
}

export interface Stream {
  id: string;
  title: string;
  description: string;
  type: 'makkah' | 'madinah' | 'quran' | 'other';
  streamUrl: string;
  thumbnailUrl?: string;
  isLive: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  isActive: boolean;
  startsAt: string;
  endsAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// News Category Types
export interface NewsCategory {
  id: string;
  name: string;
  nameArabic?: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// News Types
export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  category: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  isPublished: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  source?: string;
  sourceUrl?: string;
  publishedAt?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
