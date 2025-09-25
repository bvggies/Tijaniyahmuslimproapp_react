import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color, onPress }) => (
  <TouchableOpacity style={styles.featureCard} onPress={onPress}>
    <View style={styles.glassCard}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}33` }]}>
        <Ionicons name={icon as any} size={26} color={color} />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
);

export default function MoreFeaturesScreen({ navigation }: any) {
  const features = [
    {
      title: 'Digital Tasbih',
      description: 'Count your dhikr with our digital tasbih',
      icon: 'ellipse',
      color: colors.accentYellow,
      screen: 'Tasbih',
    },
    {
      title: 'Wazifa',
      description: 'Daily Islamic practices and routines',
      icon: 'checkmark-circle',
      color: colors.accentYellowDark,
      screen: 'Wazifa',
    },
    {
      title: 'Lazim Tracker',
      description: 'Track your daily Islamic commitments',
      icon: 'list',
      color: '#2196F3',
      screen: 'Lazim',
    },
    {
      title: 'Zikr Jumma',
      description: 'Special Friday prayers and dhikr',
      icon: 'calendar',
      color: '#9C27B0',
      screen: 'ZikrJumma',
    },
    {
      title: 'Islamic Journal',
      description: 'Reflect on your spiritual journey',
      icon: 'book',
      color: '#FF5722',
      screen: 'Journal',
    },
    {
      title: 'Scholars',
      description: 'Learn from Islamic scholars and teachers',
      icon: 'people',
      color: '#607D8B',
      screen: 'Scholars',
    },
    {
      title: 'Lessons',
      description: 'Interactive Islamic lessons and courses',
      icon: 'school',
      color: '#4CAF50',
      screen: 'Lessons',
    },
    {
      title: 'Community',
      description: 'Connect with fellow Muslims worldwide',
      icon: 'chatbubbles',
      color: '#E91E63',
      screen: 'Community',
    },
    {
      title: 'Mosque Locator',
      description: 'Find nearby mosques and prayer facilities',
      icon: 'location',
      color: '#795548',
      screen: 'Mosque',
    },
    {
      title: 'Makkah Live',
      description: 'Watch live streams from the Holy Kaaba',
      icon: 'videocam',
      color: colors.accentYellow,
      screen: 'Makkah Live',
    },
    {
      title: 'AI Noor',
      description: 'AI-powered Islamic assistant',
      icon: 'bulb',
      color: '#00BCD4',
      screen: 'AI Noor',
    },
    {
      title: 'Donate',
      description: 'Support Islamic causes',
      icon: 'heart',
      color: '#F44336',
      screen: 'Donate',
    },
    {
      title: 'Notifications',
      description: 'Manage prayer and reminder notifications',
      icon: 'notifications',
      color: colors.primary,
      screen: 'NotificationSettings',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[colors.surface, colors.background]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>More Features</Text>
        <Text style={styles.headerSubtitle}>Explore all Islamic tools and resources</Text>
      </LinearGradient>

      {/* Features Grid */}
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            color={feature.color}
            onPress={() => navigation.navigate(feature.screen)}
          />
        ))}
      </View>

      {/* App Info */}
      <View style={styles.appInfoContainer}>
        <View style={styles.appInfoCard}>
          <Ionicons name="information-circle" size={24} color={colors.accentTeal} />
          <View style={styles.appInfoContent}>
            <Text style={styles.appInfoTitle}>Tijaniyah Pro</Text>
            <Text style={styles.appInfoDescription}>
              Your comprehensive Islamic companion app with all the tools you need for spiritual growth and daily practice.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  featuresContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
  },
  glassCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 16,
  },
  appInfoContainer: {
    padding: 20,
    paddingTop: 0,
  },
  appInfoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  appInfoContent: {
    flex: 1,
    marginLeft: 12,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  appInfoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
