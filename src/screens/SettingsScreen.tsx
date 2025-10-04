import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useTimeFormat } from '../contexts/TimeFormatContext';
import { useIslamicCalendar, IslamicCalendarType } from '../contexts/IslamicCalendarContext';
import LanguageSelector from '../components/LanguageSelector';

interface Settings {
  notifications: boolean;
  prayerNotifications: boolean;
  darkMode: boolean;
  timeFormat: '12h' | '24h';
  language: string;
  locationServices: boolean;
  autoLocation: boolean;
}

export default function SettingsScreen({ navigation }: any) {
  const { t } = useLanguage();
  const { timeFormat, setTimeFormat } = useTimeFormat();
  const { selectedCalendar, setSelectedCalendar, getAllCalendars, getCalendarInfo } = useIslamicCalendar();
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    prayerNotifications: true,
    darkMode: false,
    timeFormat: '12h',
    language: 'en',
    locationServices: true,
    autoLocation: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const updateSetting = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const showCalendarSelector = () => {
    const calendars = getAllCalendars();
    const options = calendars.map(calendar => ({
      text: `${calendar.name} (${calendar.region})`,
      onPress: () => setSelectedCalendar(calendar.type)
    }));

    Alert.alert(
      'Select Islamic Calendar',
      'Choose your preferred Islamic calendar type:',
      [
        ...options,
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[colors.accentTeal, colors.accentGreen]}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>
    </LinearGradient>
  );

  const renderNotificationSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Ionicons name="notifications" size={20} color={colors.accentTeal} />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive general app notifications</Text>
          </View>
        </View>
        <Switch
          value={settings.notifications}
          onValueChange={(value) => updateSetting('notifications', value)}
          trackColor={{ false: colors.divider, true: colors.accentTeal }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Ionicons name="time" size={20} color={colors.accentTeal} />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Prayer Time Alerts</Text>
            <Text style={styles.settingDescription}>Get notified when prayer times arrive</Text>
          </View>
        </View>
        <Switch
          value={settings.prayerNotifications}
          onValueChange={(value) => updateSetting('prayerNotifications', value)}
          trackColor={{ false: colors.divider, true: colors.accentTeal }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );

  const renderDisplaySettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Display & Language</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Ionicons name="moon" size={20} color={colors.accentTeal} />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>Switch to dark theme</Text>
          </View>
        </View>
        <Switch
          value={settings.darkMode}
          onValueChange={(value) => updateSetting('darkMode', value)}
          trackColor={{ false: colors.divider, true: colors.accentTeal }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Ionicons name="time" size={20} color={colors.accentTeal} />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Time Format</Text>
            <Text style={styles.settingDescription}>Choose between 12-hour and 24-hour format</Text>
          </View>
        </View>
        <View style={styles.timeFormatContainer}>
          <TouchableOpacity
            style={[
              styles.timeFormatButton,
              timeFormat === '12h' && styles.timeFormatButtonActive
            ]}
            onPress={() => setTimeFormat('12h')}
          >
            <Text style={[
              styles.timeFormatText,
              timeFormat === '12h' && styles.timeFormatTextActive
            ]}>
              12h
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeFormatButton,
              timeFormat === '24h' && styles.timeFormatButtonActive
            ]}
            onPress={() => setTimeFormat('24h')}
          >
            <Text style={[
              styles.timeFormatText,
              timeFormat === '24h' && styles.timeFormatTextActive
            ]}>
              24h
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Ionicons name="language" size={20} color={colors.accentTeal} />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingDescription}>Choose your preferred language</Text>
          </View>
        </View>
        <LanguageSelector />
      </View>

      {/* Islamic Calendar Selection */}
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Ionicons name="calendar" size={20} color={colors.accentTeal} />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Islamic Calendar</Text>
            <Text style={styles.settingDescription}>Choose your preferred Islamic calendar type</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.calendarSelector}
          onPress={() => showCalendarSelector()}
        >
          <Text style={styles.calendarSelectorText}>
            {selectedCalendar ? getCalendarInfo(selectedCalendar).name : 'Umm al-Qura'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLocationSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Location Services</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Ionicons name="location" size={20} color={colors.accentTeal} />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Location Services</Text>
            <Text style={styles.settingDescription}>Allow app to access your location</Text>
          </View>
        </View>
        <Switch
          value={settings.locationServices}
          onValueChange={(value) => updateSetting('locationServices', value)}
          trackColor={{ false: colors.divider, true: colors.accentTeal }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Ionicons name="navigate" size={20} color={colors.accentTeal} />
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Auto Location</Text>
            <Text style={styles.settingDescription}>Automatically update location for prayer times</Text>
          </View>
        </View>
        <Switch
          value={settings.autoLocation}
          onValueChange={(value) => updateSetting('autoLocation', value)}
          trackColor={{ false: colors.divider, true: colors.accentTeal }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );

  const renderAppInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>App Information</Text>
      
      <TouchableOpacity style={styles.infoItem}>
        <View style={styles.infoContent}>
          <Ionicons name="information-circle" size={20} color={colors.accentTeal} />
          <Text style={styles.infoLabel}>Version</Text>
        </View>
        <Text style={styles.infoValue}>1.0.0</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.infoItem}>
        <View style={styles.infoContent}>
          <Ionicons name="help-circle" size={20} color={colors.accentTeal} />
          <Text style={styles.infoLabel}>Help & Support</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.infoItem}>
        <View style={styles.infoContent}>
          <Ionicons name="document-text" size={20} color={colors.accentTeal} />
          <Text style={styles.infoLabel}>Privacy Policy</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.infoItem}>
        <View style={styles.infoContent}>
          <Ionicons name="shield-checkmark" size={20} color={colors.accentTeal} />
          <Text style={styles.infoLabel}>Terms of Service</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderDataManagement = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Data Management</Text>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {
          Alert.alert(
            'Clear Cache',
            'This will clear all cached data. Continue?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: () => {
                Alert.alert('Success', 'Cache cleared successfully!');
              }}
            ]
          );
        }}
      >
        <Ionicons name="trash" size={20} color={colors.accentTeal} />
        <Text style={styles.actionButtonText}>Clear Cache</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {
          Alert.alert(
            'Reset Settings',
            'This will reset all settings to default. Continue?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: () => {
                const defaultSettings: Settings = {
                  notifications: true,
                  prayerNotifications: true,
                  darkMode: false,
                  timeFormat: '24h',
                  language: 'en',
                  locationServices: true,
                  autoLocation: true,
                };
                saveSettings(defaultSettings);
                Alert.alert('Success', 'Settings reset to default!');
              }}
            ]
          );
        }}
      >
        <Ionicons name="refresh" size={20} color={colors.accentTeal} />
        <Text style={styles.actionButtonText}>Reset to Default</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderNotificationSettings()}
        {renderDisplaySettings()}
        {renderLocationSettings()}
        {renderAppInfo()}
        {renderDataManagement()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timeFormatContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 2,
  },
  timeFormatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  timeFormatButtonActive: {
    backgroundColor: colors.accentTeal,
  },
  timeFormatText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  timeFormatTextActive: {
    color: '#FFFFFF',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  calendarSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 120,
  },
  calendarSelectorText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
});
