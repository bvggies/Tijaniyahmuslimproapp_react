import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import NotificationService, { 
  NotificationSettings, 
  BackendNotificationPreferences,
  InAppNotification 
} from '../services/notificationService';
import { isAuthenticated } from '../services/api';

interface NotificationContextType {
  // Local settings (for prayer/reminder scheduling)
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  
  // Backend preferences (for push notifications)
  backendPreferences: BackendNotificationPreferences;
  updateBackendPreferences: (prefs: Partial<BackendNotificationPreferences>) => Promise<boolean>;
  
  // In-app notifications
  notifications: InAppNotification[];
  unreadCount: number;
  isLoadingNotifications: boolean;
  hasMoreNotifications: boolean;
  fetchNotifications: (refresh?: boolean) => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archiveNotification: (id: string) => Promise<void>;
  
  // General
  permissionsGranted: boolean;
  isDeviceRegistered: boolean;
  requestPermissions: () => Promise<boolean>;
  scheduleAllNotifications: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
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
  });

  const [backendPreferences, setBackendPreferences] = useState<BackendNotificationPreferences>({
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
  });

  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const notificationService = NotificationService.getInstance();

  // Initialize notifications on mount and when auth changes
  useEffect(() => {
    initializeNotifications();
    
    // Set up interval to refresh unread count
    const interval = setInterval(() => {
      if (isAuthenticated()) {
        refreshUnreadCount();
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  const initializeNotifications = async () => {
    try {
      // Request permissions on app start
      const granted = await notificationService.requestPermissions();
      setPermissionsGranted(granted);

      // Load current local settings
      const currentSettings = notificationService.getSettings();
      setSettings(currentSettings);

      // If authenticated, sync with backend
      if (isAuthenticated()) {
        // Register device
        const registered = await notificationService.registerDeviceWithBackend();
        setIsDeviceRegistered(registered);

        // Sync backend preferences
        const prefs = await notificationService.syncBackendPreferences();
        if (prefs) {
          setBackendPreferences(prefs);
        }

        // Fetch initial notifications
        await fetchNotifications(true);
      }

      // Schedule local reminders if permissions are granted
      if (granted) {
        await notificationService.scheduleDailyReminders();
        await notificationService.scheduleIslamicEventNotifications();
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    notificationService.updateSettings(updatedSettings);
  };

  const updateBackendPreferencesHandler = async (prefs: Partial<BackendNotificationPreferences>): Promise<boolean> => {
    const success = await notificationService.updateBackendPreferences(prefs);
    if (success) {
      setBackendPreferences(prev => ({ ...prev, ...prefs }));
    }
    return success;
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const granted = await notificationService.requestPermissions();
      setPermissionsGranted(granted);
      
      if (granted && isAuthenticated()) {
        const registered = await notificationService.registerDeviceWithBackend();
        setIsDeviceRegistered(registered);
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const scheduleAllNotifications = async (): Promise<void> => {
    try {
      await notificationService.scheduleDailyReminders();
      await notificationService.scheduleIslamicEventNotifications();
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      throw error;
    }
  };

  const sendTestNotification = async (): Promise<void> => {
    try {
      await notificationService.sendImmediateNotification(
        '🕌 Tijaniyah Muslim Pro',
        'This is a test notification from your Islamic app!',
        { type: 'test' }
      );
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  };

  const fetchNotifications = useCallback(async (refresh = false) => {
    if (!isAuthenticated()) return;

    setIsLoadingNotifications(true);
    try {
      const result = await notificationService.fetchNotifications(20, refresh ? undefined : undefined);
      if (result) {
        setNotifications(result.data);
        setUnreadCount(result.unreadCount);
        setNextCursor(result.nextCursor);
        setHasMoreNotifications(result.hasNextPage);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  const loadMoreNotifications = useCallback(async () => {
    if (!isAuthenticated() || !hasMoreNotifications || !nextCursor || isLoadingNotifications) return;

    setIsLoadingNotifications(true);
    try {
      const result = await notificationService.fetchNotifications(20, nextCursor);
      if (result) {
        setNotifications(prev => [...prev, ...result.data]);
        setNextCursor(result.nextCursor);
        setHasMoreNotifications(result.hasNextPage);
      }
    } catch (error) {
      console.error('Error loading more notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [hasMoreNotifications, nextCursor, isLoadingNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    const success = await notificationService.markAsRead(id);
    if (success) {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, status: 'READ', readAt: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const success = await notificationService.markAllAsRead();
    if (success) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'READ', readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    }
  }, []);

  const archiveNotification = useCallback(async (id: string) => {
    const success = await notificationService.archiveNotification(id);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      // Update unread count if the archived notification was unread
      const notification = notifications.find(n => n.id === id);
      if (notification?.status === 'UNREAD') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  }, [notifications]);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated()) return;
    const count = await notificationService.getUnreadCount();
    setUnreadCount(count);
  }, []);

  const value: NotificationContextType = {
    settings,
    updateSettings,
    backendPreferences,
    updateBackendPreferences: updateBackendPreferencesHandler,
    notifications,
    unreadCount,
    isLoadingNotifications,
    hasMoreNotifications,
    fetchNotifications,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    permissionsGranted,
    isDeviceRegistered,
    requestPermissions,
    scheduleAllNotifications,
    sendTestNotification,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
