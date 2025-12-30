import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../utils/designTokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GlassTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function GlassTabBar({ state, descriptors, navigation }: GlassTabBarProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.tabBar}>
            {state.routes.map((route: any, index: number) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = state.index === index;

              return (
                <TabItem
                  key={route.key}
                  label={label}
                  routeName={route.name}
                  isFocused={isFocused}
                  options={options}
                  onPress={() => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!event.defaultPrevented) {
                      if (route.name === 'More' && isFocused) {
                        navigation.navigate('More', { screen: 'MoreFeatures' });
                      } else if (!isFocused) {
                        navigation.navigate(route.name);
                      }
                    }
                  }}
                  onLongPress={() => {
                    navigation.emit({
                      type: 'tabLongPress',
                      target: route.key,
                    });
                  }}
                />
              );
            })}
          </View>
        </View>
      </BlurView>
    </View>
  );
}

interface TabItemProps {
  label: string;
  routeName: string;
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({ label, routeName, isFocused, options, onPress, onLongPress }: TabItemProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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

  const getIconName = (routeName: string, focused: boolean) => {
    switch (routeName) {
      case 'Home':
        return focused ? 'home' : 'home-outline';
      case 'Qibla':
        return focused ? 'compass' : 'compass-outline';
      case 'Quran':
        return focused ? 'library' : 'library-outline';
      case 'Duas':
        return focused ? 'heart' : 'heart-outline';
      case 'Tijaniyah Features':
        return focused ? 'star' : 'star-outline';
      case 'More':
        return focused ? 'grid' : 'grid-outline';
      default:
        return 'circle';
    }
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
    >
      <Animated.View
        style={[
          styles.tabItemContent,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Icon Container with glow effect when active */}
        <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
          {isFocused && (
            <View style={styles.glowEffect} />
          )}
          <Ionicons
            name={getIconName(routeName, isFocused) as any}
            size={22}
            color={isFocused ? tokens.colors.accentTeal : tokens.colors.textSecondary}
          />
        </View>

        {/* Active Indicator Dot */}
        {isFocused && (
          <LinearGradient
            colors={[tokens.colors.accentTeal, tokens.colors.accentGreen]}
            style={styles.activeDot}
          />
        )}

        {/* Label */}
        <Text
          style={[
            styles.label,
            { color: isFocused ? tokens.colors.accentTeal : tokens.colors.textSecondary },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: tokens.spacing.md,
    paddingBottom: 16,
  },
  blurContainer: {
    borderRadius: tokens.radius.xl,
    overflow: 'hidden',
    ...tokens.shadows.lg,
  },
  innerContainer: {
    backgroundColor: 'rgba(11, 63, 57, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: tokens.radius.xl,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.xs,
  },
  
  // Tab Item
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabItemContent: {
    alignItems: 'center',
  },
  
  // Icon
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    position: 'relative',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(0, 191, 165, 0.15)',
  },
  glowEffect: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.accentTeal,
    opacity: 0.2,
  },
  
  // Active Indicator
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
    marginBottom: 2,
  },
  
  // Label
  label: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
