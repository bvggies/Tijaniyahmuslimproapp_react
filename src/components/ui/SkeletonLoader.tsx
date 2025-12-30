import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, StyleProp, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens } from '../../utils/designTokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  variant?: 'text' | 'circle' | 'rect' | 'card';
}

export default function SkeletonLoader({
  width = '100%',
  height = 16,
  borderRadius = tokens.radius.sm,
  style,
  variant = 'rect',
}: SkeletonLoaderProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'text':
        return { height: 14, borderRadius: 4 };
      case 'circle':
        return { width: height, height, borderRadius: height / 2 };
      case 'card':
        return { height: 120, borderRadius: tokens.radius.lg };
      default:
        return { height, borderRadius };
    }
  };

  const variantStyles = getVariantStyles();
  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: typeof width === 'number' ? width : width,
          height: variantStyles.height,
          borderRadius: variantStyles.borderRadius,
        },
        variant === 'circle' && { width: variantStyles.width },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            'transparent',
            tokens.colors.skeletonHighlight,
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

// Preset skeleton components
export function SkeletonText({ lines = 3, style }: { lines?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLoader
          key={index}
          variant="text"
          width={index === lines - 1 ? '60%' : '100%'}
          style={{ marginBottom: index < lines - 1 ? 8 : 0 }}
        />
      ))}
    </View>
  );
}

export function SkeletonCard({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.cardContainer, style]}>
      <SkeletonLoader variant="card" />
      <View style={styles.cardContent}>
        <SkeletonLoader height={20} width="70%" style={{ marginBottom: 8 }} />
        <SkeletonLoader height={14} width="90%" style={{ marginBottom: 4 }} />
        <SkeletonLoader height={14} width="50%" />
      </View>
    </View>
  );
}

export function SkeletonPrayerCard({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.prayerCardContainer, style]}>
      <View style={styles.prayerCardHeader}>
        <SkeletonLoader variant="circle" height={48} />
        <View style={styles.prayerCardHeaderText}>
          <SkeletonLoader height={14} width={80} style={{ marginBottom: 4 }} />
          <SkeletonLoader height={12} width={60} />
        </View>
      </View>
      <View style={styles.prayerCardBody}>
        <SkeletonLoader height={32} width={100} style={{ marginBottom: 8 }} />
        <SkeletonLoader height={28} width={80} />
      </View>
    </View>
  );
}

export function SkeletonQuickActions({ count = 4, style }: { count?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.quickActionsGrid, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.quickActionItem}>
          <SkeletonLoader variant="circle" height={56} style={{ marginBottom: 8 }} />
          <SkeletonLoader height={12} width={60} style={{ marginBottom: 4 }} />
          <SkeletonLoader height={10} width={40} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.skeletonBase,
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  cardContainer: {
    backgroundColor: tokens.colors.glassBackground,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tokens.colors.glassBorder,
  },
  cardContent: {
    padding: tokens.spacing.md,
  },
  prayerCardContainer: {
    backgroundColor: tokens.colors.glassBackground,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: tokens.colors.glassBorder,
  },
  prayerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  prayerCardHeaderText: {
    marginLeft: tokens.spacing.md,
  },
  prayerCardBody: {
    alignItems: 'flex-start',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    alignItems: 'center',
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    backgroundColor: tokens.colors.glassBackground,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.glassBorder,
  },
});

