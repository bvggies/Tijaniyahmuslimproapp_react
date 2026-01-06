import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { searchApp, SearchResult, getSearchSuggestions } from '../services/searchService';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

// Category definitions
const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'prayer', label: 'Prayer', icon: 'moon' },
  { id: 'learn', label: 'Learn', icon: 'book' },
  { id: 'community', label: 'Community', icon: 'people' },
  { id: 'tools', label: 'Tools', icon: 'construct' },
];

// Featured items that appear at the top
const FEATURED = [
  { id: 'ai-noor', title: 'AI Noor', subtitle: 'Ask anything Islamic', icon: 'sparkles', gradient: ['#00BCD4', '#0097A7'], screen: 'AI Noor' },
  { id: 'quran', title: 'Holy Quran', subtitle: 'Read & Listen', icon: 'book', gradient: ['#11C48D', '#0B9A6F'], screen: 'Quran' },
];

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  color: string;
  screen: string;
  category: string;
}

const features: FeatureItem[] = [
  {
    title: 'Digital Tasbih',
    description: 'Count your dhikr digitally',
    icon: 'radio-button-on',
    color: '#FFB300',
    screen: 'Tasbih',
    category: 'prayer',
  },
  {
    title: 'Wazifa',
    description: 'Daily spiritual practices',
    icon: 'checkmark-done-circle',
    color: '#FF8F00',
    screen: 'Wazifa',
    category: 'prayer',
  },
  {
    title: 'Lazim Tracker',
    description: 'Track daily commitments',
    icon: 'list-circle',
    color: '#2196F3',
    screen: 'Lazim',
    category: 'prayer',
  },
  {
    title: 'Tijaniya Lazim',
    description: 'Step-by-step guide',
    icon: 'reader',
    color: '#11C48D',
    screen: 'TijaniyaLazim',
    category: 'learn',
  },
  {
    title: 'Azan',
    description: 'Beautiful call to prayer',
    icon: 'volume-high',
    color: '#2E7D32',
    screen: 'Azan',
    category: 'prayer',
  },
  {
    title: 'Zikr Jumma',
    description: 'Friday special prayers',
    icon: 'today',
    color: '#9C27B0',
    screen: 'ZikrJumma',
    category: 'prayer',
  },
  {
    title: 'Islamic Journal',
    description: 'Reflect on your journey',
    icon: 'journal',
    color: '#FF5722',
    screen: 'Journal',
    category: 'tools',
  },
  {
    title: 'Scholars',
    description: 'Learn from scholars',
    icon: 'school',
    color: '#607D8B',
    screen: 'Scholars',
    category: 'learn',
  },
  {
    title: 'Lessons',
    description: 'Interactive courses',
    icon: 'library',
    color: '#4CAF50',
    screen: 'Lessons',
    category: 'learn',
  },
  {
    title: 'Community',
    description: 'Connect worldwide',
    icon: 'chatbubbles',
    color: '#E91E63',
    screen: 'Community',
    category: 'community',
  },
  {
    title: 'Events',
    description: 'Upcoming and past events',
    icon: 'calendar',
    color: '#3B82F6',
    screen: 'Events',
    category: 'community',
  },
  {
    title: 'Mosque Finder',
    description: 'Find nearby mosques',
    icon: 'location',
    color: '#795548',
    screen: 'Mosque',
    category: 'tools',
  },
  {
    title: 'Makkah Live',
    description: 'Live from Holy Kaaba',
    icon: 'videocam',
    color: '#FFC107',
    screen: 'Makkah Live',
    category: 'prayer',
  },
  {
    title: 'Donate',
    description: 'Support Islamic causes',
    icon: 'heart',
    color: '#F44336',
    screen: 'Donate',
    category: 'community',
  },
  {
    title: 'Zakat Calculator',
    description: 'Calculate your Zakat',
    icon: 'calculator',
    color: '#00C853',
    screen: 'ZakatCalculator',
    category: 'tools',
  },
  {
    title: 'Hajj Guide',
    description: 'Complete pilgrimage guide',
    icon: 'walk',
    color: '#00BFA5',
    screen: 'Hajj',
    category: 'learn',
  },
  {
    title: 'Notifications',
    description: 'Prayer reminders',
    icon: 'notifications',
    color: '#673AB7',
    screen: 'NotificationSettings',
    category: 'tools',
  },
  {
    title: 'Settings',
    description: 'App preferences',
    icon: 'settings',
    color: '#78909C',
    screen: 'Settings',
    category: 'tools',
  },
];

// Animated Feature Card Component
const FeatureCard = ({ 
  item, 
  index, 
  onPress 
}: { 
  item: FeatureItem; 
  index: number; 
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 50,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        delay: index * 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.featureCard}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.cardGradientBorder}>
          <View style={styles.cardInner}>
            {/* Icon Container */}
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
              <View style={[styles.iconInner, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
              </View>
            </View>
            
            {/* Content */}
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
            
            {/* Arrow indicator */}
            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={16} color={item.color} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Featured Card Component
const FeaturedCard = ({ 
  item, 
  onPress 
}: { 
  item: typeof FEATURED[0]; 
  onPress: () => void;
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.featuredCard, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient
          colors={item.gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredGradient}
        >
          <View style={styles.featuredIconWrap}>
            <Ionicons name={item.icon as any} size={28} color="#FFFFFF" />
          </View>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>{item.title}</Text>
            <Text style={styles.featuredSubtitle}>{item.subtitle}</Text>
          </View>
          <View style={styles.featuredArrow}>
            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function MoreFeaturesScreen({ navigation }: any) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const searchBarScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchApp(query);
      const suggestions = getSearchSuggestions(query);
      setSearchResults(results);
      setSearchSuggestions(suggestions);
    } else {
      setSearchResults([]);
      setSearchSuggestions([]);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    Animated.spring(searchBarScale, {
      toValue: 1.02,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    Animated.spring(searchBarScale, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleSearchResultPress = (result: SearchResult) => {
    if (result.screen) {
      navigation.navigate(result.screen);
    }
  };

  const handleAINoorSearch = () => {
    navigation.navigate('AI Noor', { searchQuery: searchQuery.trim() });
  };

  const filteredFeatures = features.filter(feature => {
    if (selectedCategory !== 'all' && feature.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      return (
        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.accentTeal]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Header Content */}
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>{t('more.title')}</Text>
              <Text style={styles.headerSubtitle}>Explore all features & tools</Text>
            </View>
            <View style={styles.headerStats}>
              <View style={styles.statBadge}>
                <Text style={styles.statNumber}>{features.length}</Text>
                <Text style={styles.statLabel}>Features</Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <Animated.View
            style={[
              styles.searchWrapper,
              { transform: [{ scale: searchBarScale }] },
            ]}
          >
            <BlurView intensity={20} tint="light" style={styles.searchBlur}>
              <View style={[
                styles.searchBar,
                isSearchFocused && styles.searchBarFocused,
              ]}>
                <Ionicons 
                  name="search" 
                  size={20} 
                  color={isSearchFocused ? colors.accentTeal : 'rgba(255,255,255,0.6)'} 
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder={t('more.search_placeholder')}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => handleSearch('')}>
                    <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.6)" />
                  </TouchableOpacity>
                )}
              </View>
            </BlurView>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Search Suggestions Overlay */}
      {searchSuggestions.length > 0 && isSearchFocused && (
        <View style={styles.suggestionsOverlay}>
          <View style={styles.suggestionsContainer}>
            {searchSuggestions.slice(0, 5).map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.suggestionText}>{suggestion}</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.accentTeal} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Results */}
        {searchResults.length > 0 ? (
          <View style={styles.searchResultsSection}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="search" size={18} color={colors.accentTeal} /> Search Results
            </Text>
            {searchResults.map((result, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResultCard}
                onPress={() => handleSearchResultPress(result)}
              >
                <View style={styles.searchResultContent}>
                  <Text style={styles.searchResultTitle}>{result.title}</Text>
                  {result.titleArabic && (
                    <Text style={styles.searchResultArabic}>{result.titleArabic}</Text>
                  )}
                  <Text style={styles.searchResultDesc}>{result.description}</Text>
                  <View style={styles.searchResultMeta}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{result.category}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.searchResultArrow}>
                  <Ionicons name="chevron-forward" size={20} color={colors.accentTeal} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : searchQuery.trim() ? (
          /* No Results State */
          <View style={styles.noResultsContainer}>
            <View style={styles.noResultsIcon}>
              <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
            </View>
            <Text style={styles.noResultsTitle}>No results found</Text>
            <Text style={styles.noResultsText}>
              Try searching with different keywords or ask AI Noor
            </Text>
            <TouchableOpacity style={styles.aiNoorButton} onPress={handleAINoorSearch}>
              <LinearGradient
                colors={[colors.accentTeal, '#00BCD4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.aiNoorGradient}
              >
                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                <Text style={styles.aiNoorButtonText}>Ask AI Noor</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Featured Section */}
            <View style={styles.featuredSection}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="star" size={18} color={colors.accentYellow} /> Featured
              </Text>
              {FEATURED.map((item) => (
                <FeaturedCard
                  key={item.id}
                  item={item}
                  onPress={() => navigation.navigate(item.screen)}
                />
              ))}
            </View>

            {/* Category Filter */}
            <View style={styles.categorySection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      selectedCategory === cat.id && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={16}
                      color={selectedCategory === cat.id ? '#FFFFFF' : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === cat.id && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Features Grid */}
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="apps" size={18} color={colors.accentGreen} /> All Features
              </Text>
              <View style={styles.featuresGrid}>
                {filteredFeatures.map((feature, index) => (
                  <FeatureCard
                    key={feature.screen}
                    item={feature}
                    index={index}
                    onPress={() => navigation.navigate(feature.screen)}
                  />
                ))}
              </View>
            </View>

            {/* App Info Card */}
            <View style={styles.appInfoSection}>
              <LinearGradient
                colors={[`${colors.accentTeal}15`, `${colors.accentGreen}10`]}
                style={styles.appInfoCard}
              >
                <View style={styles.appInfoIconWrap}>
                  <LinearGradient
                    colors={[colors.accentTeal, colors.accentGreen]}
                    style={styles.appInfoIcon}
                  >
                    <Ionicons name="leaf" size={24} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <View style={styles.appInfoContent}>
                  <Text style={styles.appInfoTitle}>Tijaniyah Muslim Pro</Text>
                  <Text style={styles.appInfoDesc}>
                    Your comprehensive Islamic companion for spiritual growth and daily practice.
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    zIndex: 10,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  headerStats: {
    alignItems: 'flex-end',
  },
  statBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  searchWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  searchBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
  },
  searchBarFocused: {
    borderColor: colors.accentTeal,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    marginRight: 8,
  },
  suggestionsOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 165 : 155,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  suggestionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  featuredSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  featuredCard: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  featuredGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  featuredIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContent: {
    flex: 1,
    marginLeft: 16,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  featuredSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  featuredArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySection: {
    marginTop: 24,
    marginBottom: 8,
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  categoryChipActive: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  featuresSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: 12,
  },
  featureCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradientBorder: {
    padding: 1,
    borderRadius: 20,
    backgroundColor: colors.divider,
  },
  cardInner: {
    backgroundColor: colors.surface,
    borderRadius: 19,
    padding: 16,
    minHeight: 150,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconInner: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  arrowContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultsSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  searchResultArabic: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  searchResultDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  searchResultMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  categoryBadge: {
    backgroundColor: `${colors.accentTeal}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accentTeal,
    textTransform: 'capitalize',
  },
  searchResultArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.accentTeal}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noResultsIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  aiNoorButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: colors.accentTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  aiNoorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  aiNoorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  appInfoSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  appInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${colors.accentTeal}30`,
  },
  appInfoIconWrap: {
    marginRight: 16,
  },
  appInfoIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appInfoContent: {
    flex: 1,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  appInfoDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
