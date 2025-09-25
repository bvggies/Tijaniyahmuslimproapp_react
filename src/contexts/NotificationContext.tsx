import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import NotificationService, { NotificationSettings } from '../services/notificationService';

interface NotificationContextType {
  settings: NotificationSettings;
  permissionsGranted: boolean;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  requestPermissions: () => Promise<boolean>;
  scheduleAllNotifications: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
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
    },
  });

  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Request permissions on app start
      const granted = await notificationService.requestPermissions();
      setPermissionsGranted(granted);

      // Load current settings
      const currentSettings = notificationService.getSettings();
      setSettings(currentSettings);

      // Schedule daily reminders if permissions are granted
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

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const granted = await notificationService.requestPermissions();
      setPermissionsGranted(granted);
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
        '🕌 Tijaniyah Pro',
        'This is a test notification from your Islamic app!',
        { type: 'test' }
      );
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  };

  const value: NotificationContextType = {
    settings,
    permissionsGranted,
    updateSettings,
    requestPermissions,
    scheduleAllNotifications,
    sendTestNotification,
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
