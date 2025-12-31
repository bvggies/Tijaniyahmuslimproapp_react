import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  RefreshControl,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

// Context imports
import { useAuth } from '../contexts/AuthContext';
// import { useLanguage } from '../contexts/LanguageContext';
// import { useTimeFormat } from '../contexts/TimeFormatContext';
// import { useIslamicCalendar } from '../contexts/IslamicCalendarContext';

// Service imports
import { getPrayerTimes, updatePrayerCountdowns } from '../services/prayerService';
import { getUpcomingIslamicEvents } from '../services/islamicCalendarService';
import { getDailyReminder, DailyReminder } from '../services/dailyReminderService';
import NotificationService from '../services/notificationService';
import LocationService from '../services/locationService';
import HijriService from '../services/hijriService';

// Component imports
import IslamicBackground from '../components/IslamicBackground';
import { colors as themeColors } from '../utils/theme';
import FloatingMessageButton from '../components/FloatingMessageButton';
import {
  HomeHeader,
  CalendarCard,
  NextPrayerHero,
  PrayerTimesList,
  QuickActionsGrid,
  UpcomingEventsSection,
  DailyReminderCard,
  HajjQuickAccess,
  NewsFeedSection,
} from '../components/home';

// Type imports
import { PrayerTime, Location as LocationType } from '../types';
import { tokens } from '../utils/designTokens';
import {
  mockQuickActions,
  mockNewsArticles,
  PrayerTimeData,
  IslamicDateData,
  LocationData,
} from '../services/mockData';
import { api } from '../services/api';

export default function HomeScreen({ navigation }: any) {
  const { authState } = useAuth();

  // STATE
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [islamicDate, setIslamicDate] = useState<any>({});
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [dailyReminder, setDailyReminder] = useState<DailyReminder | null>(null);
  const [currentTimezone, setCurrentTimezone] = useState<string | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingPrayers, setIsLoadingPrayers] = useState(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  return (
    <IslamicBackground opacity={1.0}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[themeColors.accentTeal]}
              tintColor={themeColors.accentTeal}
            />
          }
        >
          <HomeHeader
            userName={authState.user?.name}
            userProfilePicture={authState.user?.profilePicture}
            onDonatePress={() => navigation.navigate('More', { screen: 'Donate' })}
            onProfilePress={() => navigation.navigate('More', { screen: 'Profile' })}
            onSettingsPress={() =>
              navigation.navigate('More', { screen: 'NotificationSettings' })
            }
          />

          <View style={styles.bottomPadding} />
        </ScrollView>

        <FloatingMessageButton bottomOffset={100} />

        <Modal
          visible={showCalendarModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCalendarModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Islamic Calendar</Text>
                <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={tokens.colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </IslamicBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomPadding: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.md,
  },
  modalContent: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: tokens.spacing.md,
  },
  modalTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.textPrimary,
  },
});
