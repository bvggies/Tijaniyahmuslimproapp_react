import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens } from '../../utils/designTokens';

// Empty State Component
interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  icon = 'folder-open-outline',
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.emptyContainer, style]}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name={icon} size={48} color={tokens.colors.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message && <Text style={styles.emptyMessage}>{message}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.emptyAction} onPress={onAction}>
          <Text style={styles.emptyActionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Error State Component
interface ErrorStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function ErrorState({
  icon = 'alert-circle-outline',
  title = 'Something went wrong',
  message = 'Unable to load content. Please try again.',
  onRetry,
  retryLabel = 'Retry',
  style,
}: ErrorStateProps) {
  return (
    <View style={[styles.errorContainer, style]}>
      <View style={styles.errorIconContainer}>
        <Ionicons name={icon} size={48} color={tokens.colors.error} />
      </View>
      <Text style={styles.errorTitle}>{title}</Text>
      {message && <Text style={styles.errorMessage}>{message}</Text>}
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.retryButtonText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Loading State Component (alternative to skeleton)
interface LoadingStateProps {
  message?: string;
  style?: StyleProp<ViewStyle>;
}

export function LoadingState({ message = 'Loading...', style }: LoadingStateProps) {
  return (
    <View style={[styles.loadingContainer, style]}>
      <View style={styles.loadingSpinner}>
        <Ionicons name="hourglass" size={32} color={tokens.colors.accentTeal} />
      </View>
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

// Section Header Component
interface SectionHeaderProps {
  title: string;
  titleArabic?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({
  title,
  titleArabic,
  actionLabel,
  onAction,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {titleArabic && <Text style={styles.sectionTitleArabic}>{titleArabic}</Text>}
      </View>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={14} color={tokens.colors.accentTeal} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Now Badge Component
interface NowBadgeProps {
  style?: StyleProp<ViewStyle>;
}

export function NowBadge({ style }: NowBadgeProps) {
  return (
    <LinearGradient
      colors={[tokens.colors.accentTeal, tokens.colors.accentGreen]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.nowBadge, style]}
    >
      <Text style={styles.nowBadgeText}>Now</Text>
    </LinearGradient>
  );
}

// Countdown Badge Component
interface CountdownBadgeProps {
  countdown: string;
  style?: StyleProp<ViewStyle>;
}

export function CountdownBadge({ countdown, style }: CountdownBadgeProps) {
  return (
    <View style={[styles.countdownBadge, style]}>
      <Ionicons name="hourglass-outline" size={14} color={tokens.colors.accentYellow} />
      <Text style={styles.countdownText}>{countdown}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xxl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
  },
  emptyTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: tokens.typography.size.md,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: tokens.spacing.md,
  },
  emptyAction: {
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    backgroundColor: tokens.colors.accentTeal,
    borderRadius: tokens.radius.pill,
  },
  emptyActionText: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.semibold,
    color: '#FFFFFF',
  },

  // Error State
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xxl,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
  },
  errorTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: tokens.typography.size.md,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: tokens.spacing.lg,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    backgroundColor: tokens.colors.error,
    borderRadius: tokens.radius.pill,
  },
  retryButtonText: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.semibold,
    color: '#FFFFFF',
  },

  // Loading State
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xxl,
  },
  loadingSpinner: {
    marginBottom: tokens.spacing.md,
  },
  loadingText: {
    fontSize: tokens.typography.size.md,
    color: tokens.colors.textSecondary,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.md,
  },
  sectionTitle: {
    fontSize: tokens.typography.size.xxl,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.textPrimary,
  },
  sectionTitleArabic: {
    fontSize: tokens.typography.size.lg,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionActionText: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.accentTeal,
    fontWeight: tokens.typography.weight.medium,
  },

  // Now Badge
  nowBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: tokens.radius.pill,
  },
  nowBadgeText: {
    fontSize: tokens.typography.size.xs,
    fontWeight: tokens.typography.weight.bold,
    color: '#FFFFFF',
  },

  // Countdown Badge
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: tokens.radius.pill,
  },
  countdownText: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.accentYellow,
    marginLeft: 4,
  },
});

