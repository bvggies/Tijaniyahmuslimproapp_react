import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { PrayerTime } from '../types';
import { Audio } from 'expo-av';
import { api, isAuthenticated } from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationSettings {
  prayerNotifications: boolean;
  reminderNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  reminderTime: string; // Format: "HH:MM"
  reminderTypes: {
    quranReading: boolean;
    dhikr: boolean;
    dua: boolean;
    wazifa: boolean;
    hajjReminders: boolean;
    qiblaUpdates: boolean;
  };
}

// Backend notification preferences
export interface BackendNotificationPreferences {
  pushEnabled: boolean;
  likesEnabled: boolean;
  commentsEnabled: boolean;
  messagesEnabled: boolean;
  remindersEnabled: boolean;
  eventsEnabled: boolean;
  systemEnabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  quietHoursTimezone: string | null;
}

// In-app notification from backend
export interface InAppNotification {
  id: string;
  notificationId: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  readAt: string | null;
  createdAt: string;
  notification: {
    id: string;
    type: 'REMINDER' | 'MESSAGE' | 'COMMENT' | 'LIKE' | 'SYSTEM' | 'EVENT' | 'CAMPAIGN';
    title: string;
    body: string;
    deepLink: string | null;
    entityType: string | null;
    entityId: string | null;
    metadata: any;
    createdAt: string;
    actor: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    } | null;
  };
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  type: 'prayer' | 'reminder' | 'islamic_event' | 'hajj' | 'qibla';
  data?: any;
}

class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;
  private deviceRegistered: boolean = false;
  
  private settings: NotificationSettings = {
    prayerNotifications: true,
    reminderNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    reminderTime: '20:00',
    reminderTypes: {
      quranReading: true,
      dhikr: true,
      dua: true,
      wazifa: true,
      hajjReminders: true,
      qiblaUpdates: true,
    },
  };

  private backendPreferences: BackendNotificationPreferences = {
    pushEnabled: true,
    likesEnabled: true,
    commentsEnabled: true,
    messagesEnabled: true,
    remindersEnabled: true,
    eventsEnabled: true,
    systemEnabled: true,
    quietHoursStart: null,
    quietHoursEnd: null,
    quietHoursTimezone: null,
  };

  private constructor() {
    // Set up notification response handler for deep links
    Notifications.addNotificationResponseReceivedListener(this.handleNotificationResponse);
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Handle notification tap for deep linking
  private handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    if (data?.deepLink) {
      console.log('📱 Deep link from notification:', data.deepLink);
      // Deep linking will be handled by the navigation context
      // Store it for later retrieval
      this.lastDeepLink = data.deepLink as string;
    }
  };

  private lastDeepLink: string | null = null;

  public getAndClearLastDeepLink(): string | null {
    const link = this.lastDeepLink;
    this.lastDeepLink = null;
    return link;
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('📱 Push notification permission not granted. In-app notifications will still work.');
        return false;
      }
      
      // Get token and register with backend
      const token = await this.getPushToken();
      if (token && isAuthenticated()) {
        await this.registerDeviceWithBackend(token);
      }
      
      return true;
    } else {
      console.log('📱 Push notifications require a physical device. Running in simulator mode - in-app notifications will still work.');
      return false;
    }
  }

  // Get push token
  async getPushToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        return null;
      }

      if (this.expoPushToken) {
        return this.expoPushToken;
      }

      // Get projectId from config, with fallback to Constants projectId
      const projectId = 
        Constants.expoConfig?.extra?.eas?.projectId || 
        Constants.expoConfig?.projectId || 
        '0c6679dc-cf6b-41f2-be84-fc83580cb435'; // Fallback from .easrc
      
      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      
      this.expoPushToken = token.data;
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Register device with backend for push notifications
  async registerDeviceWithBackend(token?: string): Promise<boolean> {
    try {
      if (!isAuthenticated()) {
        console.log('⚠️ Cannot register device: User not authenticated');
        return false;
      }

      const pushToken = token || await this.getPushToken();
      if (!pushToken) {
        console.log('⚠️ Cannot register device: No push token available');
        return false;
      }

      const platform = Platform.OS as 'ios' | 'android' | 'web';
      const deviceName = Device.deviceName || `${Device.brand} ${Device.modelName}`;

      await api.registerDevice(pushToken, platform, deviceName);
      this.deviceRegistered = true;
      console.log('✅ Device registered with backend for push notifications');
      return true;
    } catch (error) {
      console.error('❌ Failed to register device with backend:', error);
      return false;
    }
  }

  // Check if device is registered
  isDeviceRegistered(): boolean {
    return this.deviceRegistered;
  }

  // Sync backend notification preferences
  async syncBackendPreferences(): Promise<BackendNotificationPreferences | null> {
    try {
      if (!isAuthenticated()) {
        return null;
      }

      const prefs = await api.getNotificationPreferences();
      this.backendPreferences = prefs;
      console.log('✅ Synced backend notification preferences');
      return prefs;
    } catch (error) {
      console.error('❌ Failed to sync backend preferences:', error);
      return null;
    }
  }

  // Update backend notification preferences
  async updateBackendPreferences(prefs: Partial<BackendNotificationPreferences>): Promise<boolean> {
    try {
      if (!isAuthenticated()) {
        return false;
      }

      const updated = await api.updateNotificationPreferences(prefs);
      this.backendPreferences = { ...this.backendPreferences, ...updated };
      console.log('✅ Updated backend notification preferences');
      return true;
    } catch (error) {
      console.error('❌ Failed to update backend preferences:', error);
      return false;
    }
  }

  // Get backend preferences
  getBackendPreferences(): BackendNotificationPreferences {
    return { ...this.backendPreferences };
  }

  // Fetch in-app notifications from backend
  async fetchNotifications(limit = 20, cursor?: string, status?: 'UNREAD' | 'READ' | 'ARCHIVED'): Promise<{
    data: InAppNotification[];
    unreadCount: number;
    nextCursor: string | null;
    hasNextPage: boolean;
  } | null> {
    try {
      if (!isAuthenticated()) {
        return null;
      }

      return await api.getNotifications(limit, cursor, status);
    } catch (error) {
      console.error('❌ Failed to fetch notifications:', error);
      return null;
    }
  }

  // Get unread notification count
  async getUnreadCount(): Promise<number> {
    try {
      if (!isAuthenticated()) {
        return 0;
      }

      const result = await api.getUnreadNotificationCount();
      return result?.count || 0;
    } catch (error) {
      console.error('❌ Failed to get unread count:', error);
      return 0;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      if (!isAuthenticated()) {
        return false;
      }

      await api.markNotificationRead(notificationId);
      return true;
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<boolean> {
    try {
      if (!isAuthenticated()) {
        return false;
      }

      await api.markAllNotificationsRead();
      return true;
    } catch (error) {
      console.error('❌ Failed to mark all notifications as read:', error);
      return false;
    }
  }

  // Archive notification
  async archiveNotification(notificationId: string): Promise<boolean> {
    try {
      if (!isAuthenticated()) {
        return false;
      }

      await api.archiveNotification(notificationId);
      return true;
    } catch (error) {
      console.error('❌ Failed to archive notification:', error);
      return false;
    }
  }

  // Schedule prayer time notifications with Azan audio
  async schedulePrayerNotifications(prayerTimes: PrayerTime[]): Promise<void> {
    if (!this.settings.prayerNotifications) return;

    // Cancel existing prayer notifications
    await this.cancelPrayerNotifications();

    for (const prayer of prayerTimes) {
      const prayerTime = new Date(prayer.time);
      const now = new Date();
      
      // Only schedule if prayer time is in the future
      if (prayerTime > now) {
        await this.scheduleNotification({
          id: `prayer_${prayer.name.toLowerCase()}`,
          title: `🕌 ${prayer.name} Time`,
          body: `It's time for ${prayer.name} prayer. May Allah accept your prayers.`,
          scheduledTime: prayerTime,
          type: 'prayer',
          data: { prayerName: prayer.name, prayerTime: prayer.time, playAzan: true },
        });
      }
    }
  }

  // Schedule Hajj journey step reminders
  async scheduleHajjJourneyReminders(): Promise<void> {
    if (!this.settings.reminderTypes.hajjReminders) return;

    // Cancel existing Hajj notifications
    await this.cancelHajjNotifications();

    const hajjSteps = [
      {
        id: 'hajj_ihram',
        title: '🕋 Enter Ihram',
        body: 'Time to enter the state of Ihram for Hajj. Recite the Talbiyah.',
        daysBeforeHajj: 1,
      },
      {
        id: 'hajj_arafat',
        title: '🏔️ Day of Arafat',
        body: 'Today is the Day of Arafat. Stand at Mount Arafat and make dua.',
        daysBeforeHajj: 0,
      },
      {
        id: 'hajj_muzdalifah',
        title: '🌙 Muzdalifah',
        body: 'Spend the night at Muzdalifah and collect pebbles for Jamarat.',
        daysBeforeHajj: 0,
      },
      {
        id: 'hajj_ramy',
        title: '🎯 Stoning of Jamarat',
        body: 'Perform the stoning of the Jamarat pillars.',
        daysBeforeHajj: -1,
      },
    ];

    // Calculate Hajj dates (simplified - in real app, use Islamic calendar)
    const hajjStartDate = this.getHajjStartDate();

    for (const step of hajjSteps) {
      const scheduledTime = new Date(hajjStartDate);
      scheduledTime.setDate(scheduledTime.getDate() + step.daysBeforeHajj);
      scheduledTime.setHours(6, 0, 0, 0); // 6 AM reminder

      if (scheduledTime > new Date()) {
        await this.scheduleNotification({
          id: step.id,
          title: step.title,
          body: step.body,
          scheduledTime,
          type: 'hajj',
          data: { hajjStep: step.id },
        });
      }
    }
  }

  // Schedule Qibla direction change notifications
  async scheduleQiblaNotifications(): Promise<void> {
    if (!this.settings.reminderTypes.qiblaUpdates) return;

    // Cancel existing Qibla notifications
    await this.cancelQiblaNotifications();

    // Schedule Qibla reminder every 6 hours when traveling
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const scheduledTime = new Date(now);
      scheduledTime.setHours(now.getHours() + (i * 6), 0, 0, 0);

      if (scheduledTime > now) {
        await this.scheduleNotification({
          id: `qibla_reminder_${i}`,
          title: '🧭 Qibla Direction',
          body: 'Check your Qibla direction for accurate prayer orientation.',
          scheduledTime,
          type: 'qibla',
          data: { reminderType: 'qibla_check' },
        });
      }
    }
  }

  // Schedule daily Islamic reminders
  async scheduleDailyReminders(): Promise<void> {
    if (!this.settings.reminderNotifications) return;

    // Cancel existing reminder notifications
    await this.cancelReminderNotifications();

    const [hours, minutes] = this.settings.reminderTime.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If reminder time has passed today, schedule for tomorrow
    if (reminderTime <= new Date()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const reminders = [
      {
        id: 'daily_quran',
        title: '📖 Quran Reading Reminder',
        body: 'Take a moment to read the Holy Quran and reflect on its teachings.',
        enabled: this.settings.reminderTypes.quranReading,
      },
      {
        id: 'daily_dhikr',
        title: '🕊️ Dhikr Reminder',
        body: 'Remember Allah through dhikr and seek His blessings.',
        enabled: this.settings.reminderTypes.dhikr,
      },
      {
        id: 'daily_dua',
        title: '🤲 Dua Reminder',
        body: 'Make dua for yourself, your family, and the Ummah.',
        enabled: this.settings.reminderTypes.dua,
      },
      {
        id: 'daily_wazifa',
        title: '📿 Wazifa Reminder',
        body: 'Continue your daily wazifa and spiritual practices.',
        enabled: this.settings.reminderTypes.wazifa,
      },
      {
        id: 'daily_hajj_prep',
        title: '🕋 Hajj Preparation',
        body: 'Review your Hajj checklist and spiritual preparation.',
        enabled: this.settings.reminderTypes.hajjReminders,
      },
    ];

    for (const reminder of reminders) {
      if (reminder.enabled) {
        // Schedule for different times to avoid spam
        const scheduledTime = new Date(reminderTime);
        scheduledTime.setMinutes(scheduledTime.getMinutes() + Math.random() * 30);

        await this.scheduleNotification({
          id: reminder.id,
          title: reminder.title,
          body: reminder.body,
          scheduledTime,
          type: 'reminder',
          data: { reminderType: reminder.id },
        });
      }
    }
  }

  // Schedule Islamic event notifications
  async scheduleIslamicEventNotifications(): Promise<void> {
    const events = [
      {
        id: 'friday_prayer',
        title: '🕌 Jumu\'ah Prayer',
        body: 'Don\'t forget to attend Friday prayer at your local mosque.',
        dayOfWeek: 5, // Friday
        hour: 12,
        minute: 0,
      },
      {
        id: 'ramadan_reminder',
        title: '🌙 Ramadan Preparation',
        body: 'Ramadan is approaching. Start preparing spiritually and physically.',
        dayOfWeek: 0, // Sunday
        hour: 18,
        minute: 0,
      },
    ];

    for (const event of events) {
      const scheduledTime = this.getNextOccurrence(event.dayOfWeek, event.hour, event.minute);
      
      await this.scheduleNotification({
        id: event.id,
        title: event.title,
        body: event.body,
        scheduledTime,
        type: 'islamic_event',
        data: { eventType: event.id },
      });
    }
  }

  // Schedule a single notification
  private async scheduleNotification(notification: ScheduledNotification): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          sound: this.settings.soundEnabled,
          data: notification.data,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notification.scheduledTime,
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Cancel prayer notifications
  async cancelPrayerNotifications(): Promise<void> {
    const prayerIds = ['prayer_fajr', 'prayer_dhuhr', 'prayer_asr', 'prayer_maghrib', 'prayer_isha'];
    
    for (const id of prayerIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  }

  // Cancel Hajj notifications
  async cancelHajjNotifications(): Promise<void> {
    const hajjIds = ['hajj_ihram', 'hajj_arafat', 'hajj_muzdalifah', 'hajj_ramy'];
    
    for (const id of hajjIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  }

  // Cancel Qibla notifications
  async cancelQiblaNotifications(): Promise<void> {
    const qiblaIds = ['qibla_reminder_0', 'qibla_reminder_1', 'qibla_reminder_2', 'qibla_reminder_3'];
    
    for (const id of qiblaIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  }

  // Cancel reminder notifications
  async cancelReminderNotifications(): Promise<void> {
    const reminderIds = ['daily_quran', 'daily_dhikr', 'daily_dua', 'daily_wazifa', 'daily_hajj_prep'];
    
    for (const id of reminderIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get next occurrence of a specific day and time
  private getNextOccurrence(dayOfWeek: number, hour: number, minute: number): Date {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);
    
    const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7;
    scheduledTime.setDate(now.getDate() + daysUntilTarget);
    
    // If the time has passed today, schedule for next week
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 7);
    }
    
    return scheduledTime;
  }

  // Update notification settings
  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Get current settings
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Play Azan audio for prayer notifications
  async playAzanAudio(): Promise<void> {
    try {
      // Check if sound is enabled in settings
      if (!this.settings.soundEnabled) {
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/azan/makkah.mp3'),
        { 
          shouldPlay: true, 
          volume: 0.5, // Reduced volume to prevent issues
          isLooping: false // Ensure no looping
        }
      );
      
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status && status.didJustFinish) {
          sound.unloadAsync();
        }
      });

      // Auto-unload after 30 seconds to prevent hanging
      setTimeout(() => {
        sound.unloadAsync();
      }, 30000);
    } catch (error) {
      console.error('Error playing Azan audio:', error);
    }
  }

  // Get Hajj start date (simplified calculation)
  private getHajjStartDate(): Date {
    // In a real app, calculate based on Islamic calendar
    // For now, return a placeholder date
    const hajjDate = new Date();
    hajjDate.setMonth(hajjDate.getMonth() + 6); // 6 months from now
    return hajjDate;
  }

  // Send immediate notification (for testing)
  async sendImmediateNotification(title: string, body: string, data?: any): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: this.settings.soundEnabled,
        data,
      },
      trigger: null, // Immediate
    });
  }

  // Emergency: Stop all audio and clear all notifications
  async emergencyStop(): Promise<void> {
    try {
      // Cancel all scheduled notifications
      await this.cancelAllNotifications();
      
      // Stop all audio playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      console.log('Emergency stop: All notifications and audio stopped');
    } catch (error) {
      console.error('Error in emergency stop:', error);
    }
  }

  // Disable all notifications temporarily
  async disableAllNotifications(): Promise<void> {
    this.settings.prayerNotifications = false;
    this.settings.reminderNotifications = false;
    this.settings.soundEnabled = false;
    this.settings.vibrationEnabled = false;
    
    await this.cancelAllNotifications();
    console.log('All notifications disabled');
  }
}

export default NotificationService;
