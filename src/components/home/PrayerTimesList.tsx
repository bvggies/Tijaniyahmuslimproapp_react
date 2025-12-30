import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../utils/designTokens';
import { PrayerTimeData, getPrayerIcon, getPrayerColor } from '../../services/mockData';
import { SectionHeader, NowBadge, SkeletonLoader } from '../ui';

interface PrayerTimesListProps {
  prayerTimes: PrayerTimeData[];
  onAllTimesPress?: () => void;
  isLoading?: boolean;
}

export default function PrayerTimesList({
  prayerTimes,
  onAllTimesPress,
  isLoading = false,
}: PrayerTimesListProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <SectionHeader
          title="Prayer Times"
          titleArabic="أوقات الصلاة"
          actionLabel="All times"
          onAction={onAllTimesPress}
        />
        <View style={styles.listContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={styles.skeletonTile}>
              <SkeletonLoader variant="circle" height={36} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <SkeletonLoader height={14} width={60} style={{ marginBottom: 4 }} />
                <SkeletonLoader height={12} width={40} />
              </View>
              <SkeletonLoader height={18} width={70} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Prayer Times"
        titleArabic="أوقات الصلاة"
        actionLabel="All times"
        onAction={onAllTimesPress}
      />
      
      <View style={styles.listContainer}>
        {prayerTimes.map((prayer, index) => (
          <PrayerTimeTile
            key={prayer.id}
            prayer={prayer}
            index={index}
          />
        ))}
      </View>
    </View>
  );
}

interface PrayerTimeTileProps {
  prayer: PrayerTimeData;
  index: number;
}

function PrayerTimeTile({ prayer, index }: PrayerTimeTileProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const prayerColor = getPrayerColor(prayer.name);
  const prayerIcon = getPrayerIcon(prayer.name);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
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

  return (
    <Animated.View
      style={[
        styles.tileContainer,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.touchable}
      >
        {prayer.isCurrent ? (
          <LinearGradient
            colors={[prayerColor, `${prayerColor}CC`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tile}
          >
            <TileContent prayer={prayer} prayerIcon={prayerIcon} prayerColor="#FFFFFF" isCurrent />
          </LinearGradient>
        ) : (
          <BlurView intensity={15} tint="dark" style={styles.blurTile}>
            <View style={styles.glassTile}>
              <TileContent prayer={prayer} prayerIcon={prayerIcon} prayerColor={prayerColor} />
            </View>
          </BlurView>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

interface TileContentProps {
  prayer: PrayerTimeData;
  prayerIcon: string;
  prayerColor: string;
  isCurrent?: boolean;
}

function TileContent({ prayer, prayerIcon, prayerColor, isCurrent = false }: TileContentProps) {
  return (
    <View style={styles.tileContent}>
      {/* Prayer Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isCurrent
              ? 'rgba(255, 255, 255, 0.2)'
              : `${prayerColor}15`,
          },
        ]}
      >
        <Ionicons
          name={prayerIcon as any}
          size={18}
          color={isCurrent ? '#FFFFFF' : prayerColor}
        />
      </View>

      {/* Prayer Info */}
      <View style={styles.prayerInfo}>
        <Text style={[styles.prayerName, isCurrent && styles.currentText]}>
          {prayer.name}
        </Text>
        <Text style={[styles.prayerNameArabic, isCurrent && styles.currentTextSecondary]}>
          {prayer.nameArabic}
        </Text>
      </View>

      {/* Time and Status */}
      <View style={styles.timeContainer}>
        <Text style={[styles.prayerTime, isCurrent && styles.currentText]}>
          {prayer.time}
        </Text>
        {isCurrent && <NowBadge style={{ marginTop: 4 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: tokens.spacing.lg,
    marginTop: tokens.spacing.lg,
  },
  listContainer: {
    backgroundColor: tokens.colors.glassBackground,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.glassBorder,
  },
  
  // Tile
  tileContainer: {
    marginBottom: tokens.spacing.xs,
  },
  touchable: {
    borderRadius: tokens.radius.md,
    overflow: 'hidden',
  },
  tile: {
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
  },
  blurTile: {
    borderRadius: tokens.radius.md,
    overflow: 'hidden',
  },
  glassTile: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  
  // Tile Content
  tileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: 2,
  },
  prayerNameArabic: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.textSecondary,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  prayerTime: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.textPrimary,
  },
  
  // Current Prayer Styles
  currentText: {
    color: '#FFFFFF',
  },
  currentTextSecondary: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  
  // Skeleton
  skeletonTile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.glassBackground,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.xs,
  },
});

