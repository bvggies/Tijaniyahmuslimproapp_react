import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

interface Feature {
  id: string;
  title: string;
  titleArabic?: string;
  description: string;
  icon: string;
  color: string;
  gradient: [string, string];
  screen: string;
  category: 'learning' | 'practice' | 'duas';
}

const TijaniyahFeaturesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const features: Feature[] = [
    // Learning Section
    {
      id: '1',
      title: 'Tariqa Tijaniyyah',
      titleArabic: 'الطريقة التجانية',
      description: 'Learn about The Tijānī Path',
      icon: 'star',
      color: colors.accentTeal,
      gradient: [colors.accentTeal, '#0B9A6F'],
      screen: 'TariqaTijaniyyah',
      category: 'learning',
    },
    {
      id: '2',
      title: 'Tijaniya Fiqh',
      titleArabic: 'فقه التجانية',
      description: 'The Conditions of Tijaniya Fiqh',
      icon: 'book',
      color: colors.primary,
      gradient: [colors.primary, '#1B5E20'],
      screen: 'TijaniyaFiqh',
      category: 'learning',
    },
    {
      id: '3',
      title: 'Resources for Beginners',
      titleArabic: 'موارد للمبتدئين',
      description: 'Islamic Terms & Phrases',
      icon: 'library',
      color: '#4CAF50',
      gradient: ['#4CAF50', '#2E7D32'],
      screen: 'ResourcesForBeginners',
      category: 'learning',
    },
    {
      id: '4',
      title: 'Proof of Tasawwuf',
      titleArabic: 'دليل التصوف',
      description: 'Dhikr is the Greatest Obligation',
      icon: 'diamond',
      color: '#9C27B0',
      gradient: ['#9C27B0', '#6A1B9A'],
      screen: 'ProofOfTasawwufPart1',
      category: 'learning',
    },
    // Practice Section
    {
      id: '5',
      title: 'Wazifa',
      titleArabic: 'الوظيفة',
      description: 'Daily Tijaniyya Litany',
      icon: 'moon',
      color: '#FF9800',
      gradient: ['#FF9800', '#F57C00'],
      screen: 'Wazifa',
      category: 'practice',
    },
    {
      id: '6',
      title: 'Lazim (Laazeem)',
      titleArabic: 'اللازم',
      description: 'The Obligatory Daily Practice',
      icon: 'time',
      color: '#2196F3',
      gradient: ['#2196F3', '#1565C0'],
      screen: 'TijaniyaLazim',
      category: 'practice',
    },
    // Duas Section
    {
      id: '7',
      title: "Duas of Tijaniyya",
      titleArabic: 'أدعية التجانية',
      description: 'Complete collection of Tijani Duas',
      icon: 'hands',
      color: '#00BCD4',
      gradient: ['#00BCD4', '#0097A7'],
      screen: 'DuasTijaniya',
      category: 'duas',
    },
    {
      id: '8',
      title: 'Dua Khatmul Wazifa',
      titleArabic: 'دعاء ختم الوظيفة',
      description: 'Closing Prayer of Wazifa',
      icon: 'bookmark',
      color: '#E91E63',
      gradient: ['#E91E63', '#C2185B'],
      screen: 'DuaKhatmulWazifa',
      category: 'duas',
    },
    {
      id: '9',
      title: 'Dua Rabil Ibadi',
      titleArabic: 'دعاء رب العباد',
      description: 'Prayer to the Lord of Servants',
      icon: 'heart',
      color: '#673AB7',
      gradient: ['#673AB7', '#512DA8'],
      screen: 'DuaRabilIbadi',
      category: 'duas',
    },
    {
      id: '10',
      title: 'Dua Hasbil Muhaiminu',
      titleArabic: 'حسبي المهيمن',
      description: 'The Protector is Sufficient for Me',
      icon: 'shield-checkmark',
      color: '#3F51B5',
      gradient: ['#3F51B5', '#303F9F'],
      screen: 'DuaHasbilMuhaiminu',
      category: 'duas',
    },
  ];

  const learningFeatures = features.filter(f => f.category === 'learning');
  const practiceFeatures = features.filter(f => f.category === 'practice');
  const duasFeatures = features.filter(f => f.category === 'duas');

  const renderFeatureCard = (item: Feature, index: number) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(cardAnim, {
        toValue: 1,
        delay: index * 80,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePress = () => {
      if (item.screen) {
        navigation.navigate('More' as never, { screen: item.screen } as never);
      }
    };

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.featureCardWrapper,
          {
            opacity: cardAnim,
            transform: [
              {
                scale: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={handlePress}>
          <LinearGradient
            colors={item.gradient}
            style={styles.featureGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Icon */}
            <View style={styles.featureIconContainer}>
              <View style={styles.iconBg}>
                <Ionicons name={item.icon as any} size={28} color="#FFFFFF" />
              </View>
            </View>
            
            {/* Content */}
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle} numberOfLines={1}>{item.title}</Text>
              {item.titleArabic && (
                <Text style={styles.featureArabic}>{item.titleArabic}</Text>
              )}
              <Text style={styles.featureDescription} numberOfLines={2}>{item.description}</Text>
            </View>
            
            {/* Arrow */}
            <View style={styles.arrowContainer}>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSectionHeader = (title: string, icon: string, color: string) => (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIconWrap, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <LinearGradient
            colors={[colors.primary, colors.accentTeal]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerPattern}>
              {/* Decorative circles */}
              <View style={[styles.patternCircle, styles.circle1]} />
              <View style={[styles.patternCircle, styles.circle2]} />
              <View style={[styles.patternCircle, styles.circle3]} />
            </View>
            
            <View style={styles.headerContent}>
              <View style={styles.headerIconWrap}>
                <Ionicons name="star" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.headerTitle}>Tijaniyya</Text>
              <Text style={styles.headerArabic}>الطريقة التجانية</Text>
              <Text style={styles.headerSubtitle}>
                Authentic Practices & Sacred Duas
              </Text>
            </View>
            
            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{features.length}</Text>
                <Text style={styles.statLabel}>Features</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{duasFeatures.length}</Text>
                <Text style={styles.statLabel}>Duas</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>2</Text>
                <Text style={styles.statLabel}>Practices</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Learning Section */}
        <View style={styles.section}>
          {renderSectionHeader('Learning & Knowledge', 'book', colors.accentTeal)}
          <View style={styles.featuresGrid}>
            {learningFeatures.map((item, index) => renderFeatureCard(item, index))}
          </View>
        </View>

        {/* Practice Section */}
        <View style={styles.section}>
          {renderSectionHeader('Daily Practices', 'moon', '#FF9800')}
          <View style={styles.featuresGrid}>
            {practiceFeatures.map((item, index) => renderFeatureCard(item, index + learningFeatures.length))}
          </View>
        </View>

        {/* Duas Section */}
        <View style={styles.section}>
          {renderSectionHeader('Sacred Duas', 'hands', '#00BCD4')}
          <View style={styles.featuresGrid}>
            {duasFeatures.map((item, index) => renderFeatureCard(item, index + learningFeatures.length + practiceFeatures.length))}
          </View>
        </View>

        {/* Footer Quote */}
        <View style={styles.footer}>
          <LinearGradient
            colors={[`${colors.accentTeal}15`, `${colors.primary}10`]}
            style={styles.footerCard}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color={colors.accentTeal} />
            <Text style={styles.footerQuote}>
              "Whoever perseveres in the Wird and Wazifa with sincerity, Allah will open for him the doors of His mercy and blessings."
            </Text>
            <Text style={styles.footerAttribution}>
              — Shaykh Ahmad Tijani (RA)
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circle1: {
    width: 150,
    height: 150,
    top: -30,
    right: -30,
  },
  circle2: {
    width: 100,
    height: 100,
    bottom: 20,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    top: 60,
    right: 80,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerArabic: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  section: {
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  featureCardWrapper: {
    width: CARD_WIDTH,
    marginBottom: 12,
  },
  featureCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  featureGradient: {
    padding: 16,
    minHeight: 140,
  },
  featureIconContainer: {
    marginBottom: 12,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  featureArabic: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  featureDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 16,
  },
  arrowContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  footerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.accentTeal}30`,
  },
  footerQuote: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  footerAttribution: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 12,
    fontWeight: '600',
  },
});

export default TijaniyahFeaturesScreen;
