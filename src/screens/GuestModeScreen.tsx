import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { useFadeIn } from '../hooks/useAnimations';

interface GuestModeScreenProps {
  navigation: any;
}

export default function GuestModeScreen({ navigation }: GuestModeScreenProps) {
  const { continueAsGuest } = useAuth();
  const opacity = useFadeIn({ duration: 400 });

  const handleContinueAsGuest = () => {
    continueAsGuest();
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  const limitedFeatures = [
    {
      title: 'Prayer Times',
      description: 'View basic prayer times',
      icon: 'time',
      available: true,
    },
    {
      title: 'Qibla Compass',
      description: 'Find direction to Kaaba',
      icon: 'compass',
      available: true,
    },
    {
      title: 'Duas & Supplications',
      description: 'Read Islamic prayers',
      icon: 'book',
      available: true,
    },
    {
      title: 'Quran Reader',
      description: 'Read Holy Quran',
      icon: 'library',
      available: true,
    },
    {
      title: 'Digital Tasbih',
      description: 'Count dhikr',
      icon: 'ellipse',
      available: true,
    },
    {
      title: 'Islamic Journal',
      description: 'Personal reflections',
      icon: 'journal',
      available: false,
      reason: 'Requires account',
    },
    {
      title: 'Community',
      description: 'Connect with Muslims',
      icon: 'people',
      available: false,
      reason: 'Requires account',
    },
    {
      title: 'AI Noor',
      description: 'AI Islamic assistant',
      icon: 'chatbubble',
      available: false,
      reason: 'Requires account',
    },
    {
      title: 'Makkah Live',
      description: 'Live streams from Kaaba',
      icon: 'videocam',
      available: false,
      reason: 'Requires account',
    },
  ];

  const renderFeatureCard = (feature: any, index: number) => (
    <View key={index} style={[styles.featureCard, !feature.available && styles.featureCardDisabled]}>
      <View style={styles.featureIcon}>
        <Ionicons 
          name={feature.icon as any} 
          size={24} 
          color={feature.available ? colors.accentTeal : colors.textSecondary} 
        />
      </View>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, !feature.available && styles.featureTitleDisabled]}>
          {feature.title}
        </Text>
        <Text style={[styles.featureDescription, !feature.available && styles.featureDescriptionDisabled]}>
          {feature.description}
        </Text>
        {!feature.available && (
          <Text style={styles.featureReason}>{feature.reason}</Text>
        )}
      </View>
      {feature.available ? (
        <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
      ) : (
        <Ionicons name="lock-closed" size={20} color={colors.textSecondary} />
      )}
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <LinearGradient colors={[colors.background, colors.surface]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/appicon.png')} style={styles.logo} />
            </View>
            <Text style={styles.title}>Welcome to Tijaniyah Muslim Pro</Text>
            <Text style={styles.subtitle}>Explore Islamic features as a guest</Text>
          </View>

          {/* Guest Benefits */}
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>What you can access as a guest:</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
                <Text style={styles.benefitText}>Prayer times and Qibla direction</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
                <Text style={styles.benefitText}>Read Duas and Quran</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
                <Text style={styles.benefitText}>Use Digital Tasbih</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
                <Text style={styles.benefitText}>Basic Islamic resources</Text>
              </View>
            </View>
          </View>

          {/* Limited Features Preview */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Available Features</Text>
            {limitedFeatures.map(renderFeatureCard)}
          </View>

          {/* Upgrade Benefits */}
          <View style={styles.upgradeCard}>
            <Text style={styles.upgradeTitle}>Unlock Full Features</Text>
            <Text style={styles.upgradeSubtitle}>Create a free account to access:</Text>
            <View style={styles.upgradeList}>
              <View style={styles.upgradeItem}>
                <Ionicons name="star" size={16} color={colors.accentYellow} />
                <Text style={styles.upgradeText}>Personal Islamic Journal</Text>
              </View>
              <View style={styles.upgradeItem}>
                <Ionicons name="star" size={16} color={colors.accentYellow} />
                <Text style={styles.upgradeText}>Community Features</Text>
              </View>
              <View style={styles.upgradeItem}>
                <Ionicons name="star" size={16} color={colors.accentYellow} />
                <Text style={styles.upgradeText}>AI Noor Assistant</Text>
              </View>
              <View style={styles.upgradeItem}>
                <Ionicons name="star" size={16} color={colors.accentYellow} />
                <Text style={styles.upgradeText}>Makkah Live Streams</Text>
              </View>
              <View style={styles.upgradeItem}>
                <Ionicons name="star" size={16} color={colors.accentYellow} />
                <Text style={styles.upgradeText}>Personalized Settings</Text>
              </View>
              <View style={styles.upgradeItem}>
                <Ionicons name="star" size={16} color={colors.accentYellow} />
                <Text style={styles.upgradeText}>Progress Tracking</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.guestButton} onPress={handleContinueAsGuest}>
              <LinearGradient colors={[colors.accentTeal, colors.accentGreen]} style={styles.guestButtonGradient}>
                <Ionicons name="eye" size={20} color="#FFFFFF" />
                <Text style={styles.guestButtonText}>Continue as Guest</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <LinearGradient colors={[colors.accentYellow, colors.accentYellowDark]} style={styles.signUpButtonGradient}>
                <Ionicons name="person-add" size={20} color="#FFFFFF" />
                <Text style={styles.signUpButtonText}>Create Free Account</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>
                Already have an account? <Text style={styles.signInButtonTextBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.mintSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  benefitsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureCardDisabled: {
    opacity: 0.6,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mintSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureTitleDisabled: {
    color: colors.textSecondary,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  featureDescriptionDisabled: {
    color: colors.textSecondary,
    opacity: 0.7,
  },
  featureReason: {
    fontSize: 12,
    color: colors.accentTeal,
    fontWeight: '600',
  },
  upgradeCard: {
    backgroundColor: colors.mintSurface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.accentTeal + '20',
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.accentYellowDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: colors.accentYellowDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeList: {
    gap: 8,
  },
  upgradeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeText: {
    fontSize: 14,
    color: colors.accentYellowDark,
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    gap: 16,
  },
  guestButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  guestButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  guestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  signUpButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  signUpButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  signInButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  signInButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  signInButtonTextBold: {
    color: colors.accentTeal,
    fontWeight: '700',
  },
});
