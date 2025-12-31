import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { tokens as designTokens } from '../utils/designTokens';
import { IslamicDateData } from '../../services/mockData';
import { SkeletonLoader } from '../ui';

interface CalendarCardProps {
  islamicDate: IslamicDateData | null;
  gregorianDate: string;
  currentTime: string;
  calendarName: string;
  onPress: () => void;
  isLoading?: boolean;
}

export default function CalendarCard({
  islamicDate,
  gregorianDate,
  currentTime,
  calendarName,
  onPress,
  isLoading = false,
}: CalendarCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.skeletonCard]}>
          <SkeletonLoader height={24} width={180} style={{ marginBottom: 12 }} />
          <SkeletonLoader height={32} width={220} style={{ marginBottom: 8 }} />
          <SkeletonLoader height={16} width={160} style={{ marginBottom: 4 }} />
          <SkeletonLoader height={14} width={120} />
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <BlurView intensity={25} tint="light" style={styles.blur}>
          <LinearGradient
            colors={[tokens.colors.mintSurface, tokens.colors.mintSurfaceAlt]}
            style={styles.card}
          >
            {/* Watermark Icon */}
            <View style={styles.watermark}>
              <Ionicons
                name="calendar"
                size={120}
                color={tokens.colors.textDark}
                style={{ opacity: 0.05 }}
              />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Ionicons name="calendar" size={22} color={tokens.colors.textDark} />
                <Text style={styles.headerTitle}>
                  Islamic Calendar ({calendarName})
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={tokens.colors.textDark}
                style={{ opacity: 0.6 }}
              />
            </View>

            {/* Date Content */}
            <View style={styles.content}>
              {/* Gregorian Date - Primary */}
              <Text style={styles.gregorianDatePrimary}>
                {gregorianDate}
              </Text>
              
              {/* Current Time */}
              <Text style={styles.currentTime}>
                {currentTime}
              </Text>

              {/* Day Name */}
              {islamicDate && (
                <Text style={styles.dayName}>
                  {islamicDate.dayName} • {islamicDate.dayNameArabic}
                </Text>
              )}

              {/* Hijri Date - Secondary */}
              {islamicDate && (
                <View style={styles.hijriContainer}>
                  <Text style={styles.hijriLabel}>Islamic Date:</Text>
                  <Text style={styles.hijriDate}>
                    {islamicDate.day} {islamicDate.monthName} {islamicDate.year} AH
                  </Text>
                  <Text style={styles.hijriDateArabic}>
                    {islamicDate.day} {islamicDate.monthNameArabic} {islamicDate.year}
                  </Text>
                </View>
              )}

              {/* Holiday Badge */}
              {islamicDate?.isHoliday && islamicDate.holidayName && (
                <View style={styles.holidayBadge}>
                  <Ionicons name="star" size={12} color={tokens.colors.accentTeal} />
                  <Text style={styles.holidayText}>{islamicDate.holidayName}</Text>
                </View>
              )}

              {/* Tap hint */}
              <Text style={styles.tapHint}>Tap to change calendar</Text>
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: tokens.spacing.lg,
    marginTop: -10,
    borderRadius: tokens.radius.lg,
    ...tokens.shadows.lg,
  },
  blur: {
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
  },
  card: {
    padding: tokens.spacing.lg,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  skeletonCard: {
    backgroundColor: tokens.colors.glassBackground,
    borderColor: tokens.colors.glassBorder,
    padding: tokens.spacing.lg,
    alignItems: 'center',
  },
  
  // Watermark
  watermark: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.textDark,
  },
  
  // Content
  content: {
    alignItems: 'center',
  },
  gregorianDatePrimary: {
    fontSize: tokens.typography.size.xxxl,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.textDark,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  currentTime: {
    fontSize: tokens.typography.size.xl,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.textDark,
    opacity: 0.8,
    marginBottom: tokens.spacing.sm,
  },
  dayName: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.medium,
    color: tokens.colors.textDark,
    marginBottom: tokens.spacing.md,
  },
  hijriContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.sm,
  },
  hijriLabel: {
    fontSize: tokens.typography.size.xs,
    color: tokens.colors.textDark,
    opacity: 0.6,
    marginBottom: 2,
  },
  hijriDate: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.textDark,
    marginBottom: 2,
  },
  hijriDateArabic: {
    fontSize: tokens.typography.size.md,
    color: tokens.colors.textDark,
    opacity: 0.7,
  },
  
  // Holiday Badge
  holidayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 191, 165, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: tokens.radius.pill,
    marginBottom: tokens.spacing.sm,
    gap: 4,
  },
  holidayText: {
    fontSize: tokens.typography.size.sm,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.accentTeal,
  },
  
  // Tap hint
  tapHint: {
    fontSize: tokens.typography.size.xs,
    color: tokens.colors.textDark,
    opacity: 0.5,
    fontStyle: 'italic',
    marginTop: tokens.spacing.xs,
  },
});

