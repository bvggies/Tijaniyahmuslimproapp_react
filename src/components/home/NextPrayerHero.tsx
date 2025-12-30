import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../utils/designTokens';
import { PrayerTimeData, LocationData } from '../../services/mockData';
import { CountdownBadge, GlassPill, SkeletonPrayerCard } from '../ui';

interface NextPrayerHeroProps {
  nextPrayer: PrayerTimeData | null;
  location: LocationData | null;
  calculationMethod?: string;
  onUpcomingPress?: () => void;
  isLoading?: boolean;
}

export default function NextPrayerHero({
  nextPrayer,
  location,
  calculationMethod = 'MWL',
  onUpcomingPress,
  isLoading = false,
}: NextPrayerHeroProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the glow
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonPrayerCard />
      </View>
    );
  }

  if (!nextPrayer) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Subtle pulse glow effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            transform: [{ scale: pulseAnim }],
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.1],
              outputRange: [0.3, 0.5],
            }),
          },
        ]}
      />

      <LinearGradient
        colors={[tokens.colors.prayerGradientStart, tokens.colors.prayerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Header Row */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="moon" size={24} color={tokens.colors.accentYellow} />
            </View>
            <View>
              <Text style={styles.label}>Next Prayer</Text>
              <Text style={styles.labelArabic}>الصلاة القادمة</Text>
            </View>
          </View>

          {/* Upcoming Button */}
          {onUpcomingPress && (
            <TouchableOpacity
              onPress={onUpcomingPress}
              style={styles.upcomingButton}
            >
              <Ionicons name="notifications" size={14} color={tokens.colors.textDark} />
              <Text style={styles.upcomingText}>Upcoming</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Main Prayer Info */}
        <View style={styles.mainContent}>
          {/* Prayer Name */}
          <Text style={styles.prayerName}>{nextPrayer.name}</Text>
          <Text style={styles.prayerNameArabic}>{nextPrayer.nameArabic}</Text>

          {/* Time Display */}
          <View style={styles.timeRow}>
            <View style={styles.timeDisplay}>
              <Ionicons name="time-outline" size={28} color={tokens.colors.accentYellow} />
              <Text style={styles.prayerTime}>
                {nextPrayer.timeWithSeconds || nextPrayer.time}
              </Text>
            </View>

            {/* Countdown Badge */}
            {nextPrayer.countdown && (
              <CountdownBadge countdown={nextPrayer.countdown} />
            )}
          </View>
        </View>

        {/* Footer - Location and Method */}
        <View style={styles.footer}>
          {location && (
            <View style={styles.footerChip}>
              <Ionicons name="location" size={14} color={tokens.colors.textPrimary} />
              <Text style={styles.footerChipText}>{location.city}</Text>
            </View>
          )}
          <View style={styles.footerChip}>
            <Ionicons name="calculator" size={14} color={tokens.colors.textPrimary} />
            <Text style={styles.footerChipText}>{calculationMethod} Method</Text>
          </View>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeDotsContainer}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: tokens.spacing.lg,
    marginTop: tokens.spacing.lg,
    borderRadius: tokens.radius.xl,
    ...tokens.shadows.xl,
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: tokens.radius.xl + 8,
    backgroundColor: tokens.colors.prayerGradientStart,
  },
  card: {
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  label: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.accentYellow,
  },
  labelArabic: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.textPrimary,
    opacity: 0.8,
  },

  // Upcoming Button
  upcomingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: tokens.radius.pill,
    gap: 4,
  },
  upcomingText: {
    fontSize: tokens.typography.size.xs,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.textDark,
  },

  // Main Content
  mainContent: {
    marginBottom: tokens.spacing.lg,
  },
  prayerName: {
    fontSize: tokens.typography.size.display,
    fontWeight: tokens.typography.weight.extrabold,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  prayerNameArabic: {
    fontSize: tokens.typography.size.xl,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.textPrimary,
    opacity: 0.9,
    marginBottom: tokens.spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prayerTime: {
    fontSize: 28,
    fontWeight: tokens.typography.weight.bold,
    color: '#FFFFFF',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: tokens.spacing.sm,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: tokens.radius.pill,
    gap: 4,
  },
  footerChipText: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.textPrimary,
    fontWeight: tokens.typography.weight.medium,
  },

  // Decorative Dots
  decorativeDotsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dot1: { top: 0, right: 0 },
  dot2: { top: 20, right: 20 },
  dot3: { top: 40, right: 0 },
});

