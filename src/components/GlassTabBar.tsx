import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';

interface GlassTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function GlassTabBar({ state, descriptors, navigation }: GlassTabBarProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="light" style={styles.blurContainer}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.gradientOverlay}
        >
          <View style={styles.tabBar}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!event.defaultPrevented) {
                // Special handling for More tab - if we're already in More stack, navigate to root
                if (route.name === 'More' && isFocused) {
                  navigation.navigate('More', { screen: 'MoreFeatures' });
                } else if (!isFocused) {
                  navigation.navigate(route.name);
                }
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
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
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
              >
                <View style={[
                  styles.iconContainer,
                  isFocused && styles.activeIconContainer
                ]}>
                  <Ionicons
                    name={getIconName(route.name, isFocused) as any}
                    size={20}
                    color={isFocused ? colors.accentTeal : colors.textSecondary}
                  />
                </View>
                <Text style={[
                  styles.label,
                  { color: isFocused ? colors.accentTeal : colors.textSecondary }
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  gradientOverlay: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    shadowColor: colors.accentTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
});
