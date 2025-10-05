import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { commonScreenStyles } from '../utils/screenStyles';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { PrayerTime, Location as LocationType } from '../types';
import { getPrayerTimes, updatePrayerCountdowns } from '../services/prayerService';
import LocationService from '../services/locationService';
import { getCurrentIslamicDate } from '../services/islamicCalendarService';
import IslamicBackground from '../components/IslamicBackground';
import { useTimeFormat } from '../contexts/TimeFormatContext';

export default function PrayerTimesScreen() {
  const { timeFormat } = useTimeFormat();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timezone, setTimezone] = useState<string>('');
  const [hijriDisplay, setHijriDisplay] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadPrayerTimes();
  }, [timeFormat]); // Reload when time format changes

  // Real-time countdown updates
  useEffect(() => {
    if (prayerTimes.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setPrayerTimes(prevPrayerTimes => {
        if (prevPrayerTimes.length > 0) {
          return updatePrayerCountdowns(prevPrayerTimes, timeFormat);
        }
        return prevPrayerTimes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes.length > 0, timeFormat]); // Run when we have prayer times or time format changes

  const loadPrayerTimes = async () => {
    try {
      setLoading(true);
      const locationService = LocationService.getInstance();
      const locationData = await locationService.getCurrentLocation();
      
      if (!locationData) {
        Alert.alert('Location Required', 'Location permission is needed to calculate accurate prayer times.');
        return;
      }

      const { coordinates, address } = locationData;

      setCurrentLocation({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        city: address.city,
        country: address.country,
      });
      setTimezone(locationData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);

      // Get prayer times using location coordinates
      const times = await getPrayerTimes(coordinates.latitude, coordinates.longitude, timeFormat);
      setPrayerTimes(times);

      // Islamic date (location-aware)
      const islamic = getCurrentIslamicDate(coordinates.latitude, coordinates.longitude);
      setHijriDisplay(`${islamic.hijriDate}`);
    } catch (error) {
      console.error('Error loading prayer times:', error);
      Alert.alert('Error', 'Failed to load prayer times. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrayerTimes();
    setRefreshing(false);
  };

  const getTimeUntilNextPrayer = (prayerTime: string): string => {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    
    if (prayerDate <= now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }
    
    const diff = prayerDate.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m`;
    } else {
      return `${minutesLeft}m`;
    }
  };

  const getNextPrayerSummary = () => {
    const next = prayerTimes.find(p => p.isNext);
    if (!next) return null;
    return { name: next.name, time: next.time, until: getTimeUntilNextPrayer(next.time) };
  };

  // Prayer icon and color functions from home screen
  const getPrayerIcon = (prayerName: string): string => {
    switch (prayerName.toLowerCase()) {
      case 'fajr':
        return 'sunny';
      case 'dhuhr':
        return 'sunny';
      case 'asr':
        return 'partly-sunny';
      case 'maghrib':
        return 'partly-sunny';
      case 'isha':
        return 'moon';
      default:
        return 'time';
    }
  };

  const getPrayerColor = (prayerName: string): string => {
    switch (prayerName.toLowerCase()) {
      case 'fajr':
        return '#FF6B35'; // Orange
      case 'dhuhr':
        return '#FFD23F'; // Yellow
      case 'asr':
        return '#06FFA5'; // Teal
      case 'maghrib':
        return '#3A86FF'; // Blue
      case 'isha':
        return '#7209B7'; // Purple
      default:
        return colors.accentTeal;
    }
  };

  const getNextPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const prayer of prayerTimes) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      
      if (prayerTime > currentTime) {
        return prayer;
      }
    }
    
    // If no prayer found for today, return the first prayer of tomorrow (Fajr)
    return prayerTimes[0];
  };

  const renderPrayerCard = (prayer: PrayerTime, index: number) => {
    const prayerIcon = getPrayerIcon(prayer.name);
    const prayerColor = getPrayerColor(prayer.name);
    const scaleAnim = new Animated.Value(prayer.isCurrent ? 1.05 : 1);

    // Animate current prayer
    if (prayer.isCurrent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.08,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    return (
      <Animated.View
        key={prayer.name}
        style={[
          styles.prayerCard,
          prayer.isCurrent && styles.currentPrayerCard,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <LinearGradient
          colors={
            prayer.isCurrent
              ? [prayerColor, `${prayerColor}CC`]
              : [colors.surface, colors.surface]
          }
          style={styles.prayerCardGradient}
        >
          <View style={styles.prayerCardContent}>
            {/* Prayer Icon */}
            <Animated.View
              style={[
                styles.prayerIconContainer,
                { backgroundColor: prayer.isCurrent ? 'rgba(255,255,255,0.2)' : `${prayerColor}20` }
              ]}
            >
              <Ionicons 
                name={prayerIcon as any} 
                size={20} 
                color={prayer.isCurrent ? '#FFFFFF' : prayerColor} 
              />
            </Animated.View>

            {/* Prayer Info */}
            <View style={styles.prayerInfo}>
              <View style={styles.prayerNameContainer}>
                <Text style={[
                  styles.prayerName,
                  prayer.isCurrent && styles.currentPrayerName
                ]}>
                  {prayer.name}
                </Text>
                <Text style={[
                  styles.prayerNameArabic,
                  prayer.isCurrent && styles.currentPrayerNameArabic
                ]}>
                  {prayer.name === 'Fajr' ? 'الفجر' :
                   prayer.name === 'Dhuhr' ? 'الظهر' :
                   prayer.name === 'Asr' ? 'العصر' :
                   prayer.name === 'Maghrib' ? 'المغرب' :
                   prayer.name === 'Isha' ? 'العشاء' : ''}
                </Text>
              </View>
              <View style={styles.prayerTimeContainer}>
                <Text style={[
                  styles.prayerTime,
                  prayer.isCurrent && styles.currentPrayerTime
                ]}>
                  {prayer.timeWithSeconds || prayer.time}
                </Text>
                {prayer.isNext && prayer.countdown && (
                  <Text style={styles.prayerCountdown}>
                    {prayer.countdown}
                  </Text>
                )}
              </View>
            </View>

            {/* Current Prayer Indicator */}
            {prayer.isCurrent && (
              <Animated.View
                style={styles.currentIndicator}
                animation={[
                  {
                    scale: [1, 1.1, 1],
                    duration: 2000,
                    loop: true,
                    useNativeDriver: true,
                  }
                ]}
              >
                <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                <Text style={styles.currentText}>Now</Text>
              </Animated.View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading prayer times...</Text>
      </View>
    );
  }

  return (
    <IslamicBackground>
      <ScrollView
        style={commonScreenStyles.scrollContainer}
        contentContainerStyle={commonScreenStyles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      {/* Header */}
      <LinearGradient
        colors={[colors.surface, colors.background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Prayer Times</Text>
            <Text style={styles.headerSubtitle}>
              {currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : 'Loading...'}
            </Text>
            {!!hijriDisplay && (
              <View style={styles.dateContainer}>
                <Text style={styles.headerSubtle}>
                  {hijriDisplay}
                </Text>
                <Text style={styles.headerSubtle}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={loadPrayerTimes}>
            <Ionicons name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Next Prayer Summary */}
        {getNextPrayerSummary() && (
          <View style={styles.nextSummary}>
            <Ionicons name="time-outline" size={20} color={colors.accentYellow} />
            <View style={styles.nextSummaryContent}>
              <Text style={styles.nextSummaryTitle}>
                Next Prayer: {getNextPrayerSummary()!.name}
              </Text>
              <Text style={styles.nextSummaryDetails}>
                {getNextPrayerSummary()!.time} • in {getNextPrayerSummary()!.until}
              </Text>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Next Prayer Display */}
      {getNextPrayer() && (
        <View style={styles.nextPrayerCard}>
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.nextPrayerGradient}
          >
            <View style={styles.nextPrayerContent}>
              <View style={styles.nextPrayerIcon}>
                <Ionicons 
                  name={getPrayerIcon(getNextPrayer()!.name) as any} 
                  size={32} 
                  color="#FFFFFF" 
                />
              </View>
              <View style={styles.nextPrayerInfo}>
                <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
                <Text style={styles.nextPrayerLabelArabic}>الصلاة القادمة</Text>
                <Text style={styles.nextPrayerName}>{getNextPrayer()!.name}</Text>
                <Text style={styles.nextPrayerNameArabic}>
                  {getNextPrayer()!.name === 'Fajr' ? 'الفجر' :
                   getNextPrayer()!.name === 'Dhuhr' ? 'الظهر' :
                   getNextPrayer()!.name === 'Asr' ? 'العصر' :
                   getNextPrayer()!.name === 'Maghrib' ? 'المغرب' :
                   getNextPrayer()!.name === 'Isha' ? 'العشاء' : ''}
                </Text>
                <Text style={styles.nextPrayerTime}>{getNextPrayer()!.time}</Text>
                <Text style={styles.nextPrayerCountdown}>
                  <Text style={styles.countdownLabel}>in </Text>
                  <Text style={styles.countdownTime}>{getTimeUntilNextPrayer(getNextPrayer()!.time)}</Text>
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Prayer Times List */}
      <View style={styles.prayerTimesContainer}>
        {prayerTimes.map((prayer, index) => renderPrayerCard(prayer, index))}
      </View>

      {/* Additional Info */}
      <View style={styles.infoContainer}>
        {/* Location & Timezone */}
        {currentLocation && (
          <View style={styles.infoCard}>
            <Ionicons name="location" size={20} color={colors.accentTeal} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Your Location</Text>
              <Text style={styles.infoText}>
                {currentLocation.city}, {currentLocation.country}
              </Text>
              <Text style={styles.infoText}>
                Coords: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)} • TZ: {timezone}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Prayer Times Calculation</Text>
            <Text style={styles.infoText}>
              Times are calculated based on your current location using the Muslim World League method.
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.infoCard}>
          <Ionicons name="bulb" size={20} color={colors.accentYellow} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Tip</Text>
            <Text style={styles.infoText}>
              Ensure your device time and timezone are correct for accurate prayer times.
            </Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </IslamicBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 70, // Add padding for floating tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  headerSubtle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    opacity: 0.8,
  },
  dateContainer: {
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
  },
  nextSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextSummaryContent: {
    flex: 1,
    marginLeft: 12,
  },
  nextSummaryTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  nextSummaryDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    opacity: 0.9,
  },
  prayerTimesContainer: {
    margin: 20,
    marginTop: 10,
    marginBottom: 0,
  },
  prayerCard: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  currentPrayerCard: {
    elevation: 4,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  prayerCardGradient: {
    padding: 12,
  },
  prayerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerNameContainer: {
    marginBottom: 2,
  },
  prayerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 1,
  },
  prayerNameArabic: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  currentPrayerName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  currentPrayerNameArabic: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  currentPrayerTime: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  prayerTimeContainer: {
    alignItems: 'flex-end',
  },
  prayerCountdown: {
    fontSize: 12,
    color: colors.accentTeal,
    fontWeight: '600',
    marginTop: 2,
  },
  currentIndicator: {
    alignItems: 'center',
    marginLeft: 8,
  },
  currentText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  nextPrayerCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  nextPrayerGradient: {
    padding: 20,
  },
  nextPrayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextPrayerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  nextPrayerInfo: {
    flex: 1,
  },
  nextPrayerLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 2,
  },
  nextPrayerLabelArabic: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'right',
    marginBottom: 8,
  },
  nextPrayerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  nextPrayerNameArabic: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'right',
    marginBottom: 8,
  },
  nextPrayerTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  nextPrayerCountdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  countdownTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoContainer: {
    margin: 20,
    marginTop: 20,
    paddingBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContent: {
    flex: 1,
    marginLeft: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
