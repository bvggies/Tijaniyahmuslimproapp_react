import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PushService } from './push.service';
import { RegisterDeviceDto, UpdatePreferencesDto, CreateCampaignDto } from './dto';
import { NotificationType, NotificationStatus } from '@prisma/client';

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  body: string;
  deepLink?: string;
  actorUserId?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
  recipientUserIds: string[];
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private pushService: PushService,
  ) {}

  // ==========================================
  // DEVICE TOKEN MANAGEMENT
  // ==========================================

  async registerDevice(userId: string, dto: RegisterDeviceDto) {
    this.logger.log(`Registering device for user ${userId}: ${dto.platform}`);

    // Upsert device token
    const device = await this.prisma.deviceToken.upsert({
      where: { expoPushToken: dto.expoPushToken },
      update: {
        userId,
        platform: dto.platform,
        deviceName: dto.deviceName,
        isActive: true,
        lastSeenAt: new Date(),
      },
      create: {
        userId,
        expoPushToken: dto.expoPushToken,
        platform: dto.platform,
        deviceName: dto.deviceName,
        isActive: true,
      },
    });

    // Ensure user has notification preferences
    await this.ensureUserPreferences(userId);

    return { success: true, deviceId: device.id };
  }

  async unregisterDevice(userId: string, expoPushToken: string) {
    await this.prisma.deviceToken.updateMany({
      where: { userId, expoPushToken },
      data: { isActive: false },
    });
    return { success: true };
  }

  async getUserDevices(userId: string) {
    return this.prisma.deviceToken.findMany({
      where: { userId, isActive: true },
      orderBy: { lastSeenAt: 'desc' },
    });
  }

  // ==========================================
  // NOTIFICATION PREFERENCES
  // ==========================================

  async ensureUserPreferences(userId: string) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  async getPreferences(userId: string) {
    let prefs = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await this.ensureUserPreferences(userId);
    }

    return prefs;
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    await this.ensureUserPreferences(userId);

    return this.prisma.notificationPreference.update({
      where: { userId },
      data: dto,
    });
  }

  // ==========================================
  // IN-APP NOTIFICATIONS
  // ==========================================

  async getNotifications(
    userId: string,
    options: { limit?: number; cursor?: string; status?: NotificationStatus } = {},
  ) {
    const { limit = 20, cursor, status } = options;

    const recipients = await this.prisma.notificationRecipient.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      include: {
        notification: {
          include: {
            actor: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasNextPage = recipients.length > limit;
    const nextCursor = hasNextPage ? recipients[limit - 1].id : null;
    const data = hasNextPage ? recipients.slice(0, -1) : recipients;

    // Get unread count
    const unreadCount = await this.prisma.notificationRecipient.count({
      where: { userId, status: 'UNREAD' },
    });

    return {
      data: data.map((r) => ({
        id: r.id,
        notificationId: r.notificationId,
        status: r.status,
        readAt: r.readAt,
        createdAt: r.createdAt,
        notification: {
          id: r.notification.id,
          type: r.notification.type,
          title: r.notification.title,
          body: r.notification.body,
          deepLink: r.notification.deepLink,
          entityType: r.notification.entityType,
          entityId: r.notification.entityId,
          metadata: r.notification.metadata,
          createdAt: r.notification.createdAt,
          actor: r.notification.actor,
        },
      })),
      unreadCount,
      nextCursor,
      hasNextPage,
    };
  }

  async markAsRead(userId: string, recipientId: string) {
    const recipient = await this.prisma.notificationRecipient.findFirst({
      where: { id: recipientId, userId },
    });

    if (!recipient) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notificationRecipient.update({
      where: { id: recipientId },
      data: { status: 'READ', readAt: new Date() },
    });

    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notificationRecipient.updateMany({
      where: { userId, status: 'UNREAD' },
      data: { status: 'READ', readAt: new Date() },
    });

    return { success: true };
  }

  async archiveNotification(userId: string, recipientId: string) {
    const recipient = await this.prisma.notificationRecipient.findFirst({
      where: { id: recipientId, userId },
    });

    if (!recipient) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notificationRecipient.update({
      where: { id: recipientId },
      data: { status: 'ARCHIVED' },
    });

    return { success: true };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notificationRecipient.count({
      where: { userId, status: 'UNREAD' },
    });
    return { count };
  }

  // ==========================================
  // CREATE & SEND NOTIFICATIONS
  // ==========================================

  async createNotification(params: CreateNotificationParams) {
    const {
      type,
      title,
      body,
      deepLink,
      actorUserId,
      entityType,
      entityId,
      metadata,
      recipientUserIds,
    } = params;

    if (recipientUserIds.length === 0) {
      this.logger.warn('No recipients for notification');
      return null;
    }

    // Remove actor from recipients (don't notify yourself)
    const filteredRecipients = actorUserId
      ? recipientUserIds.filter((id) => id !== actorUserId)
      : recipientUserIds;

    if (filteredRecipients.length === 0) {
      return null;
    }

    // Create notification with recipients in a transaction
    const notification = await this.prisma.$transaction(async (tx) => {
      const notif = await tx.notification.create({
        data: {
          type,
          title,
          body,
          deepLink,
          actorUserId,
          entityType,
          entityId,
          metadata,
          recipients: {
            create: filteredRecipients.map((userId) => ({
              userId,
              status: 'UNREAD',
            })),
          },
        },
        include: {
          recipients: true,
          actor: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });

      return notif;
    });

    // Send push notifications asynchronously (don't block)
    this.sendPushNotificationsForNotification(notification, filteredRecipients).catch((error) => {
      this.logger.error('Failed to send push notifications:', error);
    });

    return notification;
  }

  private async sendPushNotificationsForNotification(
    notification: any,
    recipientUserIds: string[],
  ) {
    // Get preferences and device tokens for all recipients
    const [preferences, devices] = await Promise.all([
      this.prisma.notificationPreference.findMany({
        where: { userId: { in: recipientUserIds } },
      }),
      this.prisma.deviceToken.findMany({
        where: {
          userId: { in: recipientUserIds },
          isActive: true,
        },
      }),
    ]);

    const prefsMap = new Map(preferences.map((p) => [p.userId, p]));

    // Filter devices based on preferences
    const eligibleDevices = devices.filter((device) => {
      const prefs = prefsMap.get(device.userId);
      if (!prefs || !prefs.pushEnabled) return false;

      // Check category-specific settings
      switch (notification.type) {
        case 'LIKE':
          return prefs.likesEnabled;
        case 'COMMENT':
          return prefs.commentsEnabled;
        case 'MESSAGE':
          return prefs.messagesEnabled;
        case 'REMINDER':
          return prefs.remindersEnabled;
        case 'EVENT':
          return prefs.eventsEnabled;
        case 'SYSTEM':
        case 'CAMPAIGN':
          return prefs.systemEnabled;
        default:
          return true;
      }
    });

    if (eligibleDevices.length === 0) {
      this.logger.log('No eligible devices for push notification');
      return;
    }

    // Check quiet hours
    const devicesOutsideQuietHours = eligibleDevices.filter((device) => {
      const prefs = prefsMap.get(device.userId);
      if (!prefs?.quietHoursStart || !prefs?.quietHoursEnd) return true;
      return !this.isInQuietHours(
        prefs.quietHoursStart,
        prefs.quietHoursEnd,
        prefs.quietHoursTimezone,
      );
    });

    if (devicesOutsideQuietHours.length === 0) {
      this.logger.log('All eligible devices are in quiet hours');
      return;
    }

    // Prepare and send push notifications
    const pushMessages = devicesOutsideQuietHours.map((device) => ({
      expoPushToken: device.expoPushToken,
      title: notification.title,
      body: notification.body,
      data: {
        notificationId: notification.id,
        deepLink: notification.deepLink,
        type: notification.type,
        entityType: notification.entityType,
        entityId: notification.entityId,
      },
    }));

    const results = await this.pushService.sendPushNotifications(pushMessages);

    // Update push status for recipients
    const deviceUserMap = new Map(devicesOutsideQuietHours.map((d) => [d.expoPushToken, d.userId]));
    const recipientUpdates = results.map((result) => {
      const userId = deviceUserMap.get(result.token);
      return {
        notificationId: notification.id,
        userId,
        pushSentAt: result.success ? new Date() : null,
        pushError: result.error || null,
      };
    });

    // Batch update recipients
    for (const update of recipientUpdates) {
      if (update.userId) {
        await this.prisma.notificationRecipient.updateMany({
          where: {
            notificationId: update.notificationId,
            userId: update.userId,
          },
          data: {
            pushSentAt: update.pushSentAt,
            pushError: update.pushError,
          },
        });
      }
    }

    this.logger.log(
      `Sent ${results.filter((r) => r.success).length}/${results.length} push notifications`,
    );
  }

  private isInQuietHours(
    startTime: string,
    endTime: string,
    timezone?: string | null,
  ): boolean {
    try {
      const now = new Date();
      const tz = timezone || 'UTC';
      
      // Get current time in user's timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      
      const currentTime = formatter.format(now);
      const [currentHour, currentMinute] = currentTime.split(':').map(Number);
      const currentMinutes = currentHour * 60 + currentMinute;

      const [startHour, startMinute] = startTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMinute;

      const [endHour, endMinute] = endTime.split(':').map(Number);
      const endMinutes = endHour * 60 + endMinute;

      // Handle overnight quiet hours (e.g., 22:00 - 07:00)
      if (startMinutes > endMinutes) {
        return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
      }

      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } catch {
      return false;
    }
  }

  // ==========================================
  // NOTIFICATION TRIGGERS (called from other services)
  // ==========================================

  async notifyPostLiked(postId: string, postOwnerId: string, likerId: string, likerName: string) {
    return this.createNotification({
      type: 'LIKE',
      title: 'New Like',
      body: `${likerName} liked your post`,
      deepLink: `/posts/${postId}`,
      actorUserId: likerId,
      entityType: 'post',
      entityId: postId,
      recipientUserIds: [postOwnerId],
    });
  }

  async notifyPostCommented(
    postId: string,
    postOwnerId: string,
    commenterId: string,
    commenterName: string,
    commentPreview: string,
  ) {
    return this.createNotification({
      type: 'COMMENT',
      title: 'New Comment',
      body: `${commenterName}: ${commentPreview.slice(0, 50)}${commentPreview.length > 50 ? '...' : ''}`,
      deepLink: `/posts/${postId}`,
      actorUserId: commenterId,
      entityType: 'post',
      entityId: postId,
      recipientUserIds: [postOwnerId],
    });
  }

  async notifyNewMessage(
    conversationId: string,
    recipientId: string,
    senderId: string,
    senderName: string,
    messagePreview: string,
  ) {
    return this.createNotification({
      type: 'MESSAGE',
      title: senderName,
      body: messagePreview.slice(0, 100) + (messagePreview.length > 100 ? '...' : ''),
      deepLink: `/chat/${conversationId}`,
      actorUserId: senderId,
      entityType: 'message',
      entityId: conversationId,
      recipientUserIds: [recipientId],
    });
  }

  async notifyEvent(
    eventId: string,
    eventTitle: string,
    eventBody: string,
    recipientUserIds: string[],
  ) {
    return this.createNotification({
      type: 'EVENT',
      title: eventTitle,
      body: eventBody,
      deepLink: `/events/${eventId}`,
      entityType: 'event',
      entityId: eventId,
      recipientUserIds,
    });
  }

  async notifyReminder(
    reminderType: string,
    title: string,
    body: string,
    recipientUserIds: string[],
    deepLink?: string,
  ) {
    return this.createNotification({
      type: 'REMINDER',
      title,
      body,
      deepLink: deepLink || '/reminders',
      entityType: reminderType,
      recipientUserIds,
    });
  }

  // ==========================================
  // CAMPAIGNS (Admin)
  // ==========================================

  async createCampaign(dto: CreateCampaignDto, adminId?: string) {
    const campaign = await this.prisma.notificationCampaign.create({
      data: {
        title: dto.title,
        body: dto.body,
        deepLink: dto.deepLink,
        targetType: dto.targetType,
        targetFilters: dto.targetFilters,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        status: dto.sendNow ? 'sending' : dto.scheduledAt ? 'scheduled' : 'draft',
        createdBy: adminId,
      },
    });

    if (dto.sendNow) {
      this.executeCampaign(campaign.id).catch((error) => {
        this.logger.error(`Failed to execute campaign ${campaign.id}:`, error);
      });
    }

    return campaign;
  }

  async executeCampaign(campaignId: string) {
    const campaign = await this.prisma.notificationCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Get target users based on campaign settings
    const targetUsers = await this.getTargetUsers(campaign.targetType, campaign.targetFilters as any);

    await this.prisma.notificationCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'sending',
        totalRecipients: targetUsers.length,
        sentAt: new Date(),
      },
    });

    // Create notification
    const notification = await this.createNotification({
      type: 'CAMPAIGN',
      title: campaign.title,
      body: campaign.body,
      deepLink: campaign.deepLink || undefined,
      recipientUserIds: targetUsers.map((u) => u.id),
    });

    await this.prisma.notificationCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'sent',
        sentCount: notification?.recipients?.length || 0,
      },
    });

    return campaign;
  }

  private async getTargetUsers(targetType: string, filters?: Record<string, any>) {
    switch (targetType) {
      case 'all':
        return this.prisma.user.findMany({ select: { id: true } });

      case 'new_users':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return this.prisma.user.findMany({
          where: { createdAt: { gte: thirtyDaysAgo } },
          select: { id: true },
        });

      case 'active_users':
        // Users who have posted or commented in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const [activePosters, activeCommenters] = await Promise.all([
          this.prisma.communityPost.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { userId: true },
            distinct: ['userId'],
          }),
          this.prisma.communityComment.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { userId: true },
            distinct: ['userId'],
          }),
        ]);
        const activeUserIds = new Set([
          ...activePosters.map((p) => p.userId),
          ...activeCommenters.map((c) => c.userId),
        ]);
        return Array.from(activeUserIds).map((id) => ({ id }));

      case 'inactive_users':
        // Users who haven't been active in 30 days
        const inactiveDate = new Date();
        inactiveDate.setDate(inactiveDate.getDate() - 30);
        return this.prisma.user.findMany({
          where: {
            posts: { none: { createdAt: { gte: inactiveDate } } },
            comments: { none: { createdAt: { gte: inactiveDate } } },
          },
          select: { id: true },
        });

      case 'custom':
        if (filters?.userIds) {
          return filters.userIds.map((id: string) => ({ id }));
        }
        return [];

      default:
        return [];
    }
  }

  async getCampaigns(options: { limit?: number; cursor?: string; status?: string } = {}) {
    const { limit = 20, cursor, status } = options;

    const campaigns = await this.prisma.notificationCampaign.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasNextPage = campaigns.length > limit;
    const nextCursor = hasNextPage ? campaigns[limit - 1].id : null;
    const data = hasNextPage ? campaigns.slice(0, -1) : campaigns;

    return { data, nextCursor, hasNextPage };
  }

  async getCampaign(id: string) {
    const campaign = await this.prisma.notificationCampaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async deleteCampaign(id: string) {
    await this.prisma.notificationCampaign.delete({ where: { id } });
    return { success: true };
  }
}

