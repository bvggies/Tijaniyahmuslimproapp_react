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
import { useLanguage } from '../contexts/LanguageContext';
import { useTimeFormat } from '../contexts/TimeFormatContext';
import { useIslamicCalendar } from '../contexts/IslamicCalendarContext';

// Service imports
import { getPrayerTimes, updatePrayerCountdowns } from '../services/prayerService';
import { getUpcomingIslamicEvents } from '../services/islamicCalendarService';
import { getDailyReminder, DailyReminder } from '../services/dailyReminderService';
import NotificationService from '../services/notificationService';
import LocationService from '../services/locationService';
import HijriService from '../services/hijriService';

// Component imports
import IslamicBackground from '../components/IslamicBackground';
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
  mockUpcomingEvents,
  mockNewsArticles,
  PrayerTimeData,
  IslamicDateData,
  LocationData,
} from '../services/mockData';

export default function HomeScreen({ navigation }: any) {
  // Context hooks
  const { authState } = useAuth();
  const { t, language } = useLanguage();
  const { timeFormat, formatTimeWithSeconds } = useTimeFormat();
  const {
    getCurrentIslamicDate: getIslamicDate,
    getCalendarInfo,
    selectedCalendar,
    setSelectedCalendar,
    getAllCalendars,
  } = useIslamicCalendar();

  // State
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [islamicDate, setIslamicDate] = useState(getIslamicDate());
  const [upcomingEvents] = useState(getUpcomingIslamicEvents());
  const [dailyReminder, setDailyReminder] = useState<DailyReminder | null>(null);
  const [currentTimezone, setCurrentTimezone] = useState<string | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Loading states
  const [isLoadingPrayers, setIsLoadingPrayers] = useState(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  
  // Azan mini player state
  const [selectedAzanId, setSelectedAzanId] = useState<'makkah' | 'istanbul' | null>(null);
  const [isAzanPlaying, setIsAzanPlaying] = useState(false);
  const azanSoundRef = useRef<Audio.Sound | null>(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Effect: Load initial data
  useEffect(() => {
    loadLocationAndPrayerTimes();
    loadDailyReminder();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [timeFormat]);

  // Effect: Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Effect: Update prayer countdowns
  useEffect(() => {
    if (prayerTimes.length === 0) return;

    const interval = setInterval(() => {
      setPrayerTimes((prev) => {
        if (prev.length > 0) {
          return updatePrayerCountdowns(prev, timeFormat);
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes.length, timeFormat]);

  // Effect: Setup audio
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });
      } catch {}
    })();

    return () => {
      if (azanSoundRef.current) {
        try {
          azanSoundRef.current.stopAsync();
          azanSoundRef.current.unloadAsync();
        } catch {}
        azanSoundRef.current = null;
        setIsAzanPlaying(false);
      }
    };
  }, []);

  // Effect: Update Islamic date when calendar changes or timezone is available
  useEffect(() => {
    const updateIslamicDate = async () => {
      if (currentTimezone) {
        // Use location-based date with timezone
        try {
          const hijriService = HijriService.getInstance();
          const locationDate = hijriService.getHijriDateForTimezone(currentTimezone);
          
          if (locationDate) {
            setIslamicDate({
              day: locationDate.hijri.day,
              month: locationDate.hijri.month,
              year: locationDate.hijri.year,
              monthName: locationDate.hijri.monthName,
              monthNameArabic: locationDate.hijri.monthNameArabic,
              dayName: locationDate.hijri.dayName,
              dayNameArabic: locationDate.hijri.dayNameArabic,
              isHoliday: false,
              holidayName: undefined,
            });
            return;
          }
        } catch (error) {
          console.log('Error getting location-based date:', error);
        }
      }
      // Fallback to context method
      setIslamicDate(getIslamicDate());
    };
    
    updateIslamicDate();
  }, [selectedCalendar, getIslamicDate, currentTimezone]);

  // Effect: Refresh reminder at midnight
  useEffect(() => {
    if (!currentTimezone) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeout = setTimeout(() => {
      loadDailyReminder(currentTimezone);
      const interval = setInterval(
        () => loadDailyReminder(currentTimezone),
        24 * 60 * 60 * 1000
      );
      return () => clearInterval(interval);
    }, tomorrow.getTime() - now.getTime());

    return () => clearTimeout(timeout);
  }, [currentTimezone]);

  // Load functions
  const loadLocationAndPrayerTimes = async () => {
    setIsLoadingLocation(true);
    setIsLoadingPrayers(true);

    try {
      const locationService = LocationService.getInstance();
      const userLocation = await locationService.getUserLocation();

      if (!userLocation) {
        // Fallback to Makkah
        const fallback = {
          latitude: 21.3891,
          longitude: 39.8579,
          city: 'Makkah',
          country: 'Saudi Arabia',
        };
        setCurrentLocation(fallback);
        const times = await getPrayerTimes(fallback.latitude, fallback.longitude, timeFormat);
        setPrayerTimes(times);
      } else {
        setCurrentLocation({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          city: userLocation.city,
          country: userLocation.country,
        });

        const times = await getPrayerTimes(
          userLocation.latitude,
          userLocation.longitude,
          timeFormat
        );
        setPrayerTimes(times);

        // Schedule notifications
        const notificationService = NotificationService.getInstance();
        await notificationService.schedulePrayerNotifications(times);

        setCurrentTimezone(userLocation.timezone);
        loadDailyReminder(userLocation.timezone);
      }
    } catch (error) {
      console.error('Error loading location and prayer times:', error);
      // Fallback
      const fallback = {
        latitude: 21.3891,
        longitude: 39.8579,
        city: 'Makkah',
        country: 'Saudi Arabia',
      };
      setCurrentLocation(fallback);
      try {
        const times = await getPrayerTimes(fallback.latitude, fallback.longitude, timeFormat);
        setPrayerTimes(times);
      } catch {}
    } finally {
      setIsLoadingLocation(false);
      setIsLoadingPrayers(false);
    }
  };

  const loadDailyReminder = (timezone?: string) => {
    const reminder = getDailyReminder(timezone);
    setDailyReminder(reminder);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLocationAndPrayerTimes();
    loadDailyReminder(currentTimezone);
    setRefreshing(false);
  }, [currentTimezone]);

  // Derived state
  const nextPrayer = prayerTimes.find((p) => p.isNext) || null;
  const currentPrayer = prayerTimes.find((p) => p.isCurrent) || null;

  // Country flag helper
  const getCountryFlag = (country?: string): string => {
    if (!country) return '🌍';
    const flagMap: Record<string, string> = {
      ghana: '🇬🇭',
      nigeria: '🇳🇬',
      'saudi arabia': '🇸🇦',
      'united states': '🇺🇸',
      'united kingdom': '🇬🇧',
      egypt: '🇪🇬',
      morocco: '🇲🇦',
      turkey: '🇹🇷',
      indonesia: '🇮🇩',
      malaysia: '🇲🇾',
      pakistan: '🇵🇰',
      india: '🇮🇳',
      bangladesh: '🇧🇩',
    };
    return flagMap[country.toLowerCase()] || '🌍';
  };

  // Convert prayer times to PrayerTimeData format
  const prayerTimesData: PrayerTimeData[] = prayerTimes.map((p) => ({
    id: p.name,
    name: p.name,
    nameArabic: getPrayerNameArabic(p.name),
    time: p.time,
    timeWithSeconds: p.timeWithSeconds,
    countdown: p.countdown,
    isCurrent: p.isCurrent || false,
    isNext: p.isNext || false,
  }));

  const nextPrayerData: PrayerTimeData | null = nextPrayer
    ? {
        id: nextPrayer.name,
        name: nextPrayer.name,
        nameArabic: getPrayerNameArabic(nextPrayer.name),
        time: nextPrayer.time,
        timeWithSeconds: nextPrayer.timeWithSeconds,
        countdown: nextPrayer.countdown,
        isCurrent: false,
        isNext: true,
      }
    : null;

  const locationData: LocationData | null = currentLocation
    ? {
        city: currentLocation.city,
        country: currentLocation.country,
        countryCode: '',
        flag: getCountryFlag(currentLocation.country),
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      }
    : null;

  const islamicDateData: IslamicDateData = {
    day: islamicDate.day,
    month: islamicDate.month,
    monthName: islamicDate.monthName,
    monthNameArabic: islamicDate.monthNameArabic,
    year: islamicDate.year,
    dayName: islamicDate.dayName,
    dayNameArabic: islamicDate.dayNameArabic,
    isHoliday: islamicDate.isHoliday || false,
    holidayName: islamicDate.holidayName,
  };

  // Navigation handlers
  const handleDonatePress = () => navigation.navigate('More', { screen: 'Donate' });
  const handleProfilePress = () => navigation.navigate('More', { screen: 'Profile' });
  const handleSettingsPress = () => navigation.navigate('More', { screen: 'NotificationSettings' });
  const handleAllTimesPress = () => navigation.navigate('More', { screen: 'PrayerTimes' });
  
  const handleQuickActionPress = (screen: string) => {
    const mainTabScreens = ['Qibla', 'Tijaniyah Features'];
    if (mainTabScreens.includes(screen)) {
      navigation.navigate(screen);
    } else {
      navigation.navigate('More', { screen });
    }
  };

  const handleHajjLivePress = () => navigation.navigate('More', { screen: 'Makkah Live' });
  const handleHajjGuidePress = () => navigation.navigate('More', { screen: 'HajjUmrah' });
  const handleHajjJourneyPress = () => navigation.navigate('More', { screen: 'HajjJourney' });

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
              colors={[tokens.colors.accentTeal]}
              tintColor={tokens.colors.accentTeal}
            />
          }
        >
          {/* Header */}
          <HomeHeader
            userName={authState.user?.name}
            userProfilePicture={authState.user?.profilePicture}
            location={
              locationData
                ? {
                    city: locationData.city,
                    country: locationData.country,
                    flag: locationData.flag,
                  }
                : undefined
            }
            onDonatePress={handleDonatePress}
            onProfilePress={handleProfilePress}
            onSettingsPress={handleSettingsPress}
          />

          {/* Calendar Card */}
          <CalendarCard
            islamicDate={islamicDateData}
            gregorianDate={
              currentTimezone
                ? new Date().toLocaleDateString('en-US', {
                    timeZone: currentTimezone,
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
            }
            currentTime={
              currentTimezone
                ? new Date().toLocaleTimeString('en-US', {
                    timeZone: currentTimezone,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })
                : formatTimeWithSeconds(currentTime)
            }
            calendarName={getCalendarInfo(selectedCalendar).name}
            onPress={() => setShowCalendarModal(true)}
            isLoading={isLoadingLocation}
          />

          {/* Next Prayer Hero */}
          <NextPrayerHero
            nextPrayer={nextPrayerData}
            location={locationData}
            calculationMethod="MWL"
            onUpcomingPress={handleAllTimesPress}
            isLoading={isLoadingPrayers}
          />

          {/* Prayer Times List */}
          <PrayerTimesList
            prayerTimes={prayerTimesData}
            onAllTimesPress={handleAllTimesPress}
            isLoading={isLoadingPrayers}
          />

          {/* Quick Actions Grid */}
          <QuickActionsGrid
            actions={mockQuickActions}
            onActionPress={handleQuickActionPress}
            isLoading={false}
          />

          {/* Upcoming Events */}
          <UpcomingEventsSection
            events={upcomingEvents.slice(0, 3).map((e) => ({
              id: e.id,
              title: e.title,
              titleArabic: e.titleArabic,
              date: e.date,
              hijriDate: e.hijriDate || '',
              daysUntil: e.daysUntil || 0,
              category: 'celebration' as const,
            }))}
            isLoading={false}
          />

          {/* Hajj Quick Access */}
          <HajjQuickAccess
            onLivePress={handleHajjLivePress}
            onGuidePress={handleHajjGuidePress}
            onJourneyPress={handleHajjJourneyPress}
          />

          {/* Daily Reminder */}
          <DailyReminderCard
            reminder={
              dailyReminder
                ? {
                    id: '1',
                    category: dailyReminder.category as any,
                    title: dailyReminder.title,
                    titleArabic: dailyReminder.titleArabic,
                    content: dailyReminder.content,
                    contentArabic: dailyReminder.contentArabic,
                    source: dailyReminder.source || '',
                  }
                : null
            }
            language={language === 'ar' ? 'ar' : 'en'}
            isLoading={false}
          />

          {/* News Feed */}
          <NewsFeedSection
            articles={mockNewsArticles}
            isLoading={false}
          />

          {/* Bottom Padding for Tab Bar */}
          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Calendar Selection Modal */}
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
                <TouchableOpacity
                  onPress={() => setShowCalendarModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color={tokens.colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScrollView}>
                {getAllCalendars().map((calendar) => (
                  <TouchableOpacity
                    key={calendar.type}
                    style={[
                      styles.calendarOption,
                      selectedCalendar === calendar.type && styles.selectedCalendarOption,
                    ]}
                    onPress={() => {
                      setSelectedCalendar(calendar.type);
                      setShowCalendarModal(false);
                    }}
                  >
                    <View style={styles.calendarOptionContent}>
                      <Text
                        style={[
                          styles.calendarOptionName,
                          selectedCalendar === calendar.type && styles.selectedCalendarOptionName,
                        ]}
                      >
                        {calendar.name}
                      </Text>
                      <Text style={styles.calendarOptionRegion}>{calendar.region}</Text>
                      <Text style={styles.calendarOptionDescription}>{calendar.description}</Text>
                    </View>
                    {selectedCalendar === calendar.type && (
                      <Ionicons name="checkmark-circle" size={24} color={tokens.colors.accentTeal} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Floating Message Button */}
        <FloatingMessageButton bottomOffset={100} />
      </View>
    </IslamicBackground>
  );
}

// Helper function
function getPrayerNameArabic(name: string): string {
  const arabicNames: Record<string, string> = {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
  };
  return arabicNames[name] || name;
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
    height: 100, // Space for floating tab bar
  },

  // Modal Styles
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
    maxHeight: '80%',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.glassBorder,
    backgroundColor: tokens.colors.glassBackground,
  },
  modalTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.textPrimary,
  },
  modalCloseButton: {
    padding: 6,
  },
  modalScrollView: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  calendarOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginVertical: 4,
    backgroundColor: tokens.colors.glassBackground,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCalendarOption: {
    borderColor: tokens.colors.accentTeal,
    backgroundColor: 'rgba(0,191,165,0.08)',
  },
  calendarOptionContent: {
    flex: 1,
    paddingRight: tokens.spacing.sm,
  },
  calendarOptionName: {
    color: tokens.colors.textPrimary,
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.bold,
  },
  selectedCalendarOptionName: {
    color: tokens.colors.accentTeal,
  },
  calendarOptionRegion: {
    color: tokens.colors.textSecondary,
    fontSize: tokens.typography.size.sm,
    marginTop: 2,
  },
  calendarOptionDescription: {
    color: tokens.colors.textSecondary,
    fontSize: tokens.typography.size.sm,
    marginTop: 4,
    lineHeight: 18,
  },
});
