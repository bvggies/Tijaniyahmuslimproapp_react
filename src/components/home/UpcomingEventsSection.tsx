import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../utils/designTokens';
import { IslamicEventData } from '../../services/mockData';
import { SectionHeader, GlassPill, SkeletonLoader } from '../ui';

interface UpcomingEventsSectionProps {
  events: IslamicEventData[];
  onEventPress?: (event: IslamicEventData) => void;
  isLoading?: boolean;
}

export default function UpcomingEventsSection({
  events,
  onEventPress,
  isLoading = false,
}: UpcomingEventsSectionProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <SectionHeader title="Upcoming Events" titleArabic="الأحداث القادمة" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.skeletonCard}>
              <SkeletonLoader height={24} width={100} style={{ marginBottom: 8 }} />
              <SkeletonLoader height={14} width={80} style={{ marginBottom: 4 }} />
              <SkeletonLoader height={12} width={60} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader title="Upcoming Events" titleArabic="الأحداث القادمة" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            index={index}
            onPress={() => onEventPress?.(event)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface EventCardProps {
  event: IslamicEventData;
  index: number;
  onPress?: () => void;
}

function EventCard({ event, index, onPress }: EventCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      holiday: tokens.colors.accentTeal,
      fasting: tokens.colors.accentPurple,
      pilgrimage: tokens.colors.accentOrange,
      celebration: tokens.colors.accentYellow,
    };
    return colors[category] || tokens.colors.accentTeal;
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            {
              translateX: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          <View style={styles.card}>
            {/* Date Pill */}
            <View
              style={[
                styles.datePill,
                { backgroundColor: `${getCategoryColor(event.category)}20` },
              ]}
            >
              <Text
                style={[
                  styles.datePillText,
                  { color: getCategoryColor(event.category) },
                ]}
              >
                {event.hijriDate}
              </Text>
            </View>

            {/* Event Title */}
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventTitleArabic}>{event.titleArabic}</Text>

            {/* Gregorian Date */}
            <Text style={styles.eventDate}>{event.date}</Text>

            {/* Days Until */}
            <View style={styles.daysUntilContainer}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color={tokens.colors.textSecondary}
              />
              <Text style={styles.daysUntilText}>
                {event.daysUntil} days
              </Text>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: tokens.spacing.xl,
    paddingLeft: tokens.spacing.lg,
  },
  scrollContent: {
    paddingRight: tokens.spacing.lg,
  },
  
  // Card
  cardContainer: {
    marginRight: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    ...tokens.shadows.md,
  },
  blur: {
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
  },
  card: {
    width: 160,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.glassBackground,
    borderWidth: 1,
    borderColor: tokens.colors.glassBorder,
    borderRadius: tokens.radius.lg,
  },
  
  // Date Pill
  datePill: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: tokens.radius.pill,
    marginBottom: tokens.spacing.sm,
  },
  datePillText: {
    fontSize: tokens.typography.size.xs,
    fontWeight: tokens.typography.weight.bold,
  },
  
  // Event Info
  eventTitle: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.textPrimary,
    marginBottom: 2,
  },
  eventTitleArabic: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.sm,
  },
  eventDate: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.xs,
  },
  
  // Days Until
  daysUntilContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  daysUntilText: {
    fontSize: tokens.typography.size.xs,
    color: tokens.colors.textSecondary,
  },
  
  // Skeleton
  skeletonCard: {
    width: 160,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.glassBackground,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.glassBorder,
    marginRight: tokens.spacing.md,
  },
});

