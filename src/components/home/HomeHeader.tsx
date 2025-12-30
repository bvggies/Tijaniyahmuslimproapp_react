import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../utils/designTokens';
import { GlassIconButton, GlassPill } from '../ui';
import ProfileAvatar from '../ProfileAvatar';
import LanguageSelector from '../LanguageSelector';
import NotificationBell from '../NotificationBell';

interface HomeHeaderProps {
  userName?: string;
  userProfilePicture?: string;
  location?: {
    city: string;
    country: string;
    flag: string;
  };
  onDonatePress: () => void;
  onProfilePress: () => void;
  onSettingsPress: () => void;
  onNotificationsPress?: () => void;
}

export default function HomeHeader({
  userName,
  userProfilePicture,
  location,
  onDonatePress,
  onProfilePress,
  onSettingsPress,
  onNotificationsPress,
}: HomeHeaderProps) {
  return (
    <LinearGradient
      colors={[tokens.colors.surface, tokens.colors.background]}
      style={styles.container}
    >
      {/* Logo with subtle glow */}
      <View style={styles.logoContainer}>
        <View style={styles.logoGlow}>
          <Image
            source={require('../../../assets/appicon.png')}
            style={styles.logo}
          />
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        <View style={styles.actionItem}>
          <GlassIconButton
            icon="heart"
            onPress={onDonatePress}
            size="lg"
            iconColor={tokens.colors.accentYellow}
          />
          <Text style={styles.actionLabel}>Donate</Text>
        </View>

        <View style={styles.actionItem}>
          <NotificationBell color="#FFFFFF" size={24} />
          <Text style={styles.actionLabel}>Alerts</Text>
        </View>

        <View style={styles.actionItem}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={onProfilePress}
          >
            <BlurView intensity={25} tint="dark" style={styles.profileBlur}>
              <View style={styles.profileContent}>
                <ProfileAvatar
                  profilePicture={userProfilePicture}
                  name={userName}
                  size={24}
                  showBorder={false}
                />
              </View>
            </BlurView>
          </TouchableOpacity>
          <Text style={styles.actionLabel}>Profile</Text>
        </View>

        <View style={styles.actionItem}>
          <LanguageSelector compact />
          <Text style={styles.actionLabel}>Language</Text>
        </View>

        <View style={styles.actionItem}>
          <GlassIconButton
            icon="settings-outline"
            onPress={onSettingsPress}
            size="lg"
            iconColor="#FFFFFF"
          />
          <Text style={styles.actionLabel}>Settings</Text>
        </View>
      </View>

      {/* Greeting and Location Row */}
      <View style={styles.greetingLocationRow}>
        {/* Greeting with user name */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingPrimary}>
            Assalamu Alaikum{userName ? `, ${userName.split(' ')[0]}` : ''}
          </Text>
          <Text style={styles.greetingSecondary}>السلام عليكم</Text>
        </View>

        {/* Location Pill */}
        {location && (
          <TouchableOpacity style={styles.locationPill}>
            <BlurView intensity={20} tint="dark" style={styles.locationBlur}>
              <View style={styles.locationContent}>
                <Text style={styles.locationFlag}>{location.flag}</Text>
                <Text style={styles.locationCity}>{location.city}</Text>
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={tokens.colors.textSecondary}
                />
              </View>
            </BlurView>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: tokens.spacing.lg,
  },
  
  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  logoGlow: {
    padding: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
    ...tokens.shadows.glow(tokens.colors.accentTeal),
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  
  // Actions Row
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.xl,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionLabel: {
    marginTop: tokens.spacing.xs,
    fontSize: tokens.typography.size.xs,
    color: tokens.colors.textMuted,
    fontWeight: tokens.typography.weight.medium,
  },
  
  // Profile Button (special handling)
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    ...tokens.shadows.sm,
  },
  profileBlur: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  profileContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
  },
  
  // Greeting and Location
  greetingLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greetingPrimary: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.medium,
    color: tokens.colors.textPrimary,
    opacity: 0.9,
  },
  greetingSecondary: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.textSecondary,
    marginTop: 2,
    opacity: 0.7,
  },
  
  // Location Pill
  locationPill: {
    borderRadius: tokens.radius.pill,
    overflow: 'hidden',
  },
  locationBlur: {
    borderRadius: tokens.radius.pill,
    overflow: 'hidden',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: tokens.radius.pill,
    gap: 6,
  },
  locationFlag: {
    fontSize: 14,
  },
  locationCity: {
    fontSize: tokens.typography.size.sm,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.textPrimary,
  },
});

