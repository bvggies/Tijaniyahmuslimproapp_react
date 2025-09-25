import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { PrayerTime } from './prayerService';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
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
  };
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  type: 'prayer' | 'reminder' | 'islamic_event';
  data?: any;
}

class NotificationService {
  private static instance: NotificationService;
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
    },
  };

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
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
        console.log('Failed to get push token for push notification!');
        return false;
      }
      
      return true;
    } else {
      console.log('Must use physical device for Push Notifications');
      return false;
    }
  }

  // Get push token
  async getPushToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Schedule prayer time notifications
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
          data: { prayerName: prayer.name, prayerTime: prayer.time },
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

  // Cancel reminder notifications
  async cancelReminderNotifications(): Promise<void> {
    const reminderIds = ['daily_quran', 'daily_dhikr', 'daily_dua', 'daily_wazifa'];
    
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
}

export default NotificationService;
