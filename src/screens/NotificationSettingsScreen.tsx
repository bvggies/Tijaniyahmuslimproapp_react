import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useNotifications } from '../contexts/NotificationContext';
import { NotificationSettings, BackendNotificationPreferences } from '../services/notificationService';
import { isAuthenticated } from '../services/api';

export default function NotificationSettingsScreen() {
  const {
    settings,
    backendPreferences,
    permissionsGranted,
    isDeviceRegistered,
    updateSettings,
    updateBackendPreferences,
    requestPermissions,
    scheduleAllNotifications,
    sendTestNotification,
  } = useNotifications();

  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    updateSettings({ [key]: value });
  };

  const updateReminderType = (type: keyof NotificationSettings['reminderTypes'], value: boolean) => {
    updateSettings({
      reminderTypes: {
        ...settings.reminderTypes,
        [type]: value,
      },
    });
  };

  const updateBackendPref = async (key: keyof BackendNotificationPreferences, value: any) => {
    if (!isAuthenticated()) {
      Alert.alert('Sign In Required', 'Please sign in to sync notification preferences.');
      return;
    }
    setIsSaving(true);
    try {
      await updateBackendPreferences({ [key]: value });
    } catch (error) {
      Alert.alert('Error', 'Failed to update preference. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async () => {
    if (!permissionsGranted) {
      Alert.alert(
        'Permissions Required',
        'Please grant notification permissions to test notifications.',
        [{ text: 'OK', onPress: requestPermissions }]
      );
      return;
    }

    try {
      await sendTestNotification();
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification.');
    }
  };

  const handleScheduleAll = async () => {
    if (!permissionsGranted) {
      Alert.alert(
        'Permissions Required',
        'Please grant notification permissions to schedule notifications.',
        [{ text: 'OK', onPress: requestPermissions }]
      );
      return;
    }

    try {
      await scheduleAllNotifications();
      Alert.alert('Success', 'All notifications have been scheduled!');
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notifications. Please try again.');
    }
  };

  const SettingCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.settingCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );

  const ToggleRow = ({
    title,
    subtitle,
    value,
    onValueChange,
    icon,
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    icon: string;
  }) => (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLeft}>
        <Ionicons name={icon as any} size={24} color={colors.primary} style={styles.toggleIcon} />
        <View style={styles.toggleText}>
          <Text style={styles.toggleTitle}>{title}</Text>
          {subtitle && <Text style={styles.toggleSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.mintSurfaceAlt, true: colors.primary }}
        thumbColor={value ? colors.mintSurface : colors.textLight}
      />
    </View>
  );

  return (
    <LinearGradient colors={[colors.background, colors.mintSurface]} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notification Settings</Text>
          <Text style={styles.headerSubtitle}>
            Customize your Islamic reminders and prayer notifications
          </Text>
        </View>

        {/* Permissions Status */}
        <SettingCard title="Permissions">
          <View style={styles.permissionStatus}>
            <Ionicons
              name={permissionsGranted ? 'checkmark-circle' : 'close-circle'}
              size={24}
              color={permissionsGranted ? colors.success : colors.error}
            />
            <Text style={[
              styles.permissionText,
              { color: permissionsGranted ? colors.success : colors.error }
            ]}>
              {permissionsGranted ? 'Notifications Enabled' : 'Notifications Disabled'}
            </Text>
          </View>
          {!permissionsGranted && (
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
              <Text style={styles.permissionButtonText}>Enable Notifications</Text>
            </TouchableOpacity>
          )}
          {permissionsGranted && isAuthenticated() && (
            <View style={styles.deviceStatus}>
              <Ionicons
                name={isDeviceRegistered ? 'cloud-done' : 'cloud-offline'}
                size={20}
                color={isDeviceRegistered ? colors.success : colors.textLight}
              />
              <Text style={styles.deviceStatusText}>
                {isDeviceRegistered ? 'Device registered for push notifications' : 'Device not registered'}
              </Text>
            </View>
          )}
        </SettingCard>

        {/* Push Notification Preferences (Backend synced) */}
        {isAuthenticated() && (
          <SettingCard title="Push Notifications">
            {isSaving && (
              <View style={styles.savingIndicator}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.savingText}>Saving...</Text>
              </View>
            )}
            <ToggleRow
              title="Enable Push Notifications"
              subtitle="Receive notifications on your device"
              value={backendPreferences.pushEnabled}
              onValueChange={(value) => updateBackendPref('pushEnabled', value)}
              icon="notifications"
            />
            
            {backendPreferences.pushEnabled && (
              <>
                <ToggleRow
                  title="Likes"
                  subtitle="When someone likes your post"
                  value={backendPreferences.likesEnabled}
                  onValueChange={(value) => updateBackendPref('likesEnabled', value)}
                  icon="heart"
                />
                <ToggleRow
                  title="Comments"
                  subtitle="When someone comments on your post"
                  value={backendPreferences.commentsEnabled}
                  onValueChange={(value) => updateBackendPref('commentsEnabled', value)}
                  icon="chatbubble"
                />
                <ToggleRow
                  title="Messages"
                  subtitle="When you receive a new message"
                  value={backendPreferences.messagesEnabled}
                  onValueChange={(value) => updateBackendPref('messagesEnabled', value)}
                  icon="mail"
                />
                <ToggleRow
                  title="Events"
                  subtitle="Upcoming Islamic events and reminders"
                  value={backendPreferences.eventsEnabled}
                  onValueChange={(value) => updateBackendPref('eventsEnabled', value)}
                  icon="calendar"
                />
                <ToggleRow
                  title="System Announcements"
                  subtitle="Important app updates and news"
                  value={backendPreferences.systemEnabled}
                  onValueChange={(value) => updateBackendPref('systemEnabled', value)}
                  icon="megaphone"
                />
              </>
            )}
          </SettingCard>
        )}

        {/* Prayer Notifications */}
        <SettingCard title="Prayer Notifications">
          <ToggleRow
            title="Prayer Time Alerts"
            subtitle="Get notified when it's time for prayer"
            value={settings.prayerNotifications}
            onValueChange={(value) => updateSetting('prayerNotifications', value)}
            icon="time"
          />
        </SettingCard>

        {/* Daily Reminders */}
        <SettingCard title="Daily Reminders">
          <ToggleRow
            title="Daily Islamic Reminders"
            subtitle="Receive daily reminders for spiritual practices"
            value={settings.reminderNotifications}
            onValueChange={(value) => updateSetting('reminderNotifications', value)}
            icon="notifications"
          />

          {settings.reminderNotifications && (
            <>
              <View style={styles.timePicker}>
                <Text style={styles.timeLabel}>Reminder Time</Text>
                <TextInput
                  style={styles.timeInput}
                  value={settings.reminderTime}
                  onChangeText={(text) => updateSetting('reminderTime', text)}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.textLight}
                />
              </View>

              <View style={styles.reminderTypes}>
                <Text style={styles.reminderTypesTitle}>Reminder Types</Text>
                
                <ToggleRow
                  title="Quran Reading"
                  subtitle="Daily reminder to read the Holy Quran"
                  value={settings.reminderTypes.quranReading}
                  onValueChange={(value) => updateReminderType('quranReading', value)}
                  icon="book"
                />

                <ToggleRow
                  title="Dhikr"
                  subtitle="Reminder for remembrance of Allah"
                  value={settings.reminderTypes.dhikr}
                  onValueChange={(value) => updateReminderType('dhikr', value)}
                  icon="heart"
                />

                <ToggleRow
                  title="Dua"
                  subtitle="Reminder to make supplications"
                  value={settings.reminderTypes.dua}
                  onValueChange={(value) => updateReminderType('dua', value)}
                  icon="hand-left"
                />

                <ToggleRow
                  title="Wazifa"
                  subtitle="Reminder for daily spiritual practices"
                  value={settings.reminderTypes.wazifa}
                  onValueChange={(value) => updateReminderType('wazifa', value)}
                  icon="fitness"
                />

                <ToggleRow
                  title="Hajj Reminders"
                  subtitle="Journey step reminders and preparation alerts"
                  value={settings.reminderTypes.hajjReminders}
                  onValueChange={(value) => updateReminderType('hajjReminders', value)}
                  icon="walk"
                />

                <ToggleRow
                  title="Qibla Updates"
                  subtitle="Direction change notifications when traveling"
                  value={settings.reminderTypes.qiblaUpdates}
                  onValueChange={(value) => updateReminderType('qiblaUpdates', value)}
                  icon="compass"
                />
              </View>
            </>
          )}
        </SettingCard>

        {/* Hajj Journey Notifications */}
        <SettingCard title="Hajj Journey">
          <ToggleRow
            title="Hajj Step Reminders"
            subtitle="Get notified for each Hajj ritual and preparation step"
            value={settings.reminderTypes.hajjReminders}
            onValueChange={(value) => updateReminderType('hajjReminders', value)}
            icon="map"
          />
          
          {settings.reminderTypes.hajjReminders && (
            <View style={styles.hajjInfo}>
              <Text style={styles.hajjInfoText}>
                📋 You'll receive reminders for:
              </Text>
              <Text style={styles.hajjInfoItem}>• Entering Ihram</Text>
              <Text style={styles.hajjInfoItem}>• Day of Arafat</Text>
              <Text style={styles.hajjInfoItem}>• Muzdalifah night</Text>
              <Text style={styles.hajjInfoItem}>• Stoning of Jamarat</Text>
            </View>
          )}
        </SettingCard>

        {/* Qibla Notifications */}
        <SettingCard title="Qibla Direction">
          <ToggleRow
            title="Travel Qibla Reminders"
            subtitle="Get reminded to check Qibla direction when traveling"
            value={settings.reminderTypes.qiblaUpdates}
            onValueChange={(value) => updateReminderType('qiblaUpdates', value)}
            icon="location"
          />
          
          {settings.reminderTypes.qiblaUpdates && (
            <View style={styles.qiblaInfo}>
              <Text style={styles.qiblaInfoText}>
                🧭 You'll receive Qibla direction reminders every 6 hours when traveling to help maintain accurate prayer orientation.
              </Text>
            </View>
          )}
        </SettingCard>

        {/* Notification Preferences */}
        <SettingCard title="Notification Preferences">
          <ToggleRow
            title="Sound"
            subtitle="Play sound with notifications"
            value={settings.soundEnabled}
            onValueChange={(value) => updateSetting('soundEnabled', value)}
            icon="volume-high"
          />

          <ToggleRow
            title="Vibration"
            subtitle="Vibrate with notifications"
            value={settings.vibrationEnabled}
            onValueChange={(value) => updateSetting('vibrationEnabled', value)}
            icon="phone-portrait"
          />
        </SettingCard>

        {/* Test & Actions */}
        <SettingCard title="Actions">
          <TouchableOpacity style={styles.actionButton} onPress={handleTestNotification}>
            <Ionicons name="send" size={20} color={colors.mintSurface} />
            <Text style={styles.actionButtonText}>Send Test Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleScheduleAll}>
            <Ionicons name="calendar" size={20} color={colors.mintSurface} />
            <Text style={styles.actionButtonText}>Schedule All Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={async () => {
            const notificationService = (await import('../services/notificationService')).default.getInstance();
            await notificationService.scheduleHajjJourneyReminders();
            Alert.alert('Success', 'Hajj journey reminders scheduled!');
          }}>
            <Ionicons name="walk" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Schedule Hajj Reminders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={async () => {
            const notificationService = (await import('../services/notificationService')).default.getInstance();
            await notificationService.scheduleQiblaNotifications();
            Alert.alert('Success', 'Qibla reminders scheduled!');
          }}>
            <Ionicons name="compass" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Schedule Qibla Reminders</Text>
          </TouchableOpacity>
        </SettingCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Notifications help you stay connected to your Islamic practices and prayer times.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  settingCard: {
    backgroundColor: colors.mintSurface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  permissionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: colors.mintSurface,
    fontSize: 16,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.mintSurfaceAlt,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    marginRight: 12,
  },
  toggleText: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 18,
  },
  timePicker: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.mintSurfaceAlt,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: colors.mintSurfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  reminderTypes: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.mintSurfaceAlt,
  },
  reminderTypesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    color: colors.mintSurface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  hajjInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.mintSurfaceAlt,
    borderRadius: 8,
  },
  hajjInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  hajjInfoItem: {
    fontSize: 13,
    color: colors.textLight,
    marginLeft: 8,
    marginBottom: 2,
  },
  qiblaInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.mintSurfaceAlt,
    borderRadius: 8,
  },
  qiblaInfoText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.mintSurfaceAlt,
  },
  deviceStatusText: {
    fontSize: 13,
    color: colors.textLight,
    marginLeft: 8,
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: colors.mintSurfaceAlt,
    borderRadius: 8,
  },
  savingText: {
    fontSize: 13,
    color: colors.primary,
    marginLeft: 8,
  },
});
