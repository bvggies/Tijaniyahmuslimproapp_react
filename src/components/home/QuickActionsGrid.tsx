import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../utils/designTokens';
import { QuickActionData } from '../../services/mockData';
import { SectionHeader, SkeletonQuickActions } from '../ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_WIDTH = (SCREEN_WIDTH - tokens.spacing.lg * 2 - tokens.spacing.md) / 2;

interface QuickActionsGridProps {
  actions: QuickActionData[];
  onActionPress: (screen: string) => void;
  onEditPress?: () => void;
  isLoading?: boolean;
}

export default function QuickActionsGrid({
  actions,
  onActionPress,
  onEditPress,
  isLoading = false,
}: QuickActionsGridProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <SectionHeader
          title="Quick Actions"
          titleArabic="الإجراءات السريعة"
          actionLabel="Edit"
          onAction={onEditPress}
        />
        <SkeletonQuickActions count={4} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Quick Actions"
        titleArabic="الإجراءات السريعة"
        actionLabel="Edit"
        onAction={onEditPress}
      />

      <View style={styles.grid}>
        {actions.map((action, index) => (
          <QuickActionTile
            key={action.id}
            action={action}
            index={index}
            onPress={() => onActionPress(action.screen)}
          />
        ))}
      </View>
    </View>
  );
}

interface QuickActionTileProps {
  action: QuickActionData;
  index: number;
  onPress: () => void;
}

function QuickActionTile({ action, index, onPress }: QuickActionTileProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 60,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
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
                outputRange: [30, 0],
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
        style={styles.tile}
      >
        {/* Icon Container with Gradient */}
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={[action.color, `${action.color}CC`]}
            style={styles.iconContainer}
          >
            <Ionicons name={action.icon as any} size={28} color="#FFFFFF" />
          </LinearGradient>
        </View>

        {/* Title - English primary */}
        <Text style={styles.title} numberOfLines={1}>
          {action.title}
        </Text>

        {/* Title - Arabic secondary */}
        <Text style={styles.titleArabic} numberOfLines={1}>
          {action.titleArabic}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={1}>
          {action.description}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: tokens.spacing.lg,
    marginTop: tokens.spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  // Tile
  tileContainer: {
    width: TILE_WIDTH,
    marginBottom: tokens.spacing.md,
  },
  tile: {
    backgroundColor: tokens.colors.mintSurface,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    alignItems: 'center',
    ...tokens.shadows.md,
  },
  
  // Icon
  iconWrapper: {
    marginBottom: tokens.spacing.md,
  },
  iconContainer: {
    width: tokens.quickActionTile.iconContainerSize,
    height: tokens.quickActionTile.iconContainerSize,
    borderRadius: tokens.quickActionTile.iconContainerSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...tokens.shadows.sm,
  },
  
  // Text
  title: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.textDark,
    textAlign: 'center',
    marginBottom: 2,
  },
  titleArabic: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.textDark,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: tokens.typography.size.xs,
    color: tokens.colors.textDark,
    opacity: 0.5,
    textAlign: 'center',
  },
});

