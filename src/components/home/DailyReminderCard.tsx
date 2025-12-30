import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../utils/designTokens';
import { DailyReminderData, getCategoryIcon } from '../../services/mockData';
import { SectionHeader, SkeletonLoader } from '../ui';

interface DailyReminderCardProps {
  reminder: DailyReminderData | null;
  language?: 'en' | 'ar';
  onPress?: () => void;
  isLoading?: boolean;
}

export default function DailyReminderCard({
  reminder,
  language = 'en',
  onPress,
  isLoading = false,
}: DailyReminderCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

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
        <SectionHeader title="Daily Reminder" />
        <View style={styles.skeletonCard}>
          <View style={styles.skeletonHeader}>
            <SkeletonLoader variant="circle" height={40} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <SkeletonLoader height={16} width={140} style={{ marginBottom: 4 }} />
              <SkeletonLoader height={12} width={80} />
            </View>
          </View>
          <SkeletonLoader height={14} width="100%" style={{ marginBottom: 6 }} />
          <SkeletonLoader height={14} width="90%" style={{ marginBottom: 6 }} />
          <SkeletonLoader height={14} width="70%" style={{ marginBottom: 12 }} />
          <SkeletonLoader height={12} width={100} style={{ alignSelf: 'flex-end' }} />
        </View>
      </View>
    );
  }

  if (!reminder) return null;

  const icon = getCategoryIcon(reminder.category);
  const title = language === 'ar' && reminder.titleArabic ? reminder.titleArabic : reminder.title;
  const content = language === 'ar' && reminder.contentArabic ? reminder.contentArabic : reminder.content;

  return (
    <View style={styles.container}>
      <SectionHeader title="Daily Reminder" />

      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <LinearGradient
            colors={['#8B4513', '#A0522D', '#CD853F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            {/* Decorative Pattern */}
            <View style={styles.pattern}>
              <Ionicons name="book" size={150} color="#FFFFFF" style={{ opacity: 0.03 }} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name={icon as any} size={22} color="#FFFFFF" />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.categoryLabel}>
                  {reminder.category.charAt(0).toUpperCase() + reminder.category.slice(1)}
                </Text>
                <Text style={styles.title}>{title}</Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
              <Text style={[styles.content, language === 'ar' && styles.arabicText]}>
                {content}
              </Text>
            </View>

            {/* Source Attribution */}
            <Text style={styles.source}>— {reminder.source}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: tokens.spacing.lg,
    marginTop: tokens.spacing.xl,
  },
  cardContainer: {
    borderRadius: tokens.radius.xl,
    ...tokens.shadows.lg,
    overflow: 'hidden',
  },
  card: {
    padding: tokens.spacing.xl,
    borderRadius: tokens.radius.xl,
    position: 'relative',
    overflow: 'hidden',
  },

  // Pattern
  pattern: {
    position: 'absolute',
    right: -40,
    bottom: -40,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: tokens.typography.size.xs,
    fontWeight: tokens.typography.weight.medium,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.bold,
    color: '#FFFFFF',
  },

  // Content
  contentContainer: {
    marginBottom: tokens.spacing.lg,
  },
  content: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.regular,
    color: '#FFFFFF',
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  arabicText: {
    textAlign: 'right',
    fontSize: tokens.typography.size.xl,
    lineHeight: 32,
  },

  // Source
  source: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.medium,
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },

  // Skeleton
  skeletonCard: {
    backgroundColor: tokens.colors.glassBackground,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.xl,
    borderWidth: 1,
    borderColor: tokens.colors.glassBorder,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
});

