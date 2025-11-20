import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { searchApp, SearchResult, getSearchSuggestions } from '../services/searchService';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleSearchResultPress = (result: SearchResult) => {
    // Navigate to the appropriate screen based on the result
    if (result.screen) {
      navigation.navigate(result.screen);
    }
  };

  const handleAINoorSearch = () => {
    // Navigate to AI Noor with the search query
    navigation.navigate('AI Noor', { searchQuery: searchQuery.trim() });
  };

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
      title: 'Tijaniya Lazim',
      description: 'Complete guide to performing the Lazim with step-by-step instructions',
      icon: 'book',
      color: colors.accentTeal,
      screen: 'TijaniyaLazim',
    },
    {
      title: 'Azan',
      description: 'Listen to beautiful Azan from famous mosques around the world',
      icon: 'volume-high',
      color: colors.primary,
      screen: 'Azan',
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
      title: 'Zakat Calculator',
      description: 'Calculate your obligatory charity (Zakat)',
      icon: 'calculator',
      color: '#4CAF50',
      screen: 'ZakatCalculator',
    },
    {
      title: 'Hajj',
      description: 'Makkah Live, Hajj & Umrah, Hajj Journey',
      icon: 'walk',
      color: colors.accentGreen,
      screen: 'Hajj',
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
        <Text style={styles.headerTitle}>{t('more.title')}</Text>
        <Text style={styles.headerSubtitle}>Explore all Islamic tools and resources</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('more.search_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </View>
          
          {/* Search Suggestions */}
          {searchSuggestions.length > 0 && isSearchFocused && (
            <View style={styles.suggestionsContainer}>
              {searchSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Ionicons name="search" size={16} color={colors.textSecondary} />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Search Results or Features Grid */}
      {searchResults.length > 0 ? (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsTitle}>{t('more.search_results')}</Text>
          {searchResults.map((result, index) => (
            <TouchableOpacity
              key={index}
              style={styles.searchResultItem}
              onPress={() => handleSearchResultPress(result)}
            >
              <View style={styles.searchResultContent}>
                <Text style={styles.searchResultTitle}>{result.title}</Text>
                {result.titleArabic && (
                  <Text style={styles.searchResultTitleArabic}>{result.titleArabic}</Text>
                )}
                <Text style={styles.searchResultDescription}>{result.description}</Text>
                <Text style={styles.searchResultCategory}>{result.category}</Text>
                {result.specialties && (
                  <View style={styles.specialtiesContainer}>
                    {result.specialties.slice(0, 3).map((specialty, idx) => (
                      <View key={idx} style={styles.specialtyTag}>
                        <Text style={styles.specialtyText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      ) : searchQuery.trim() ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.noResultsTitle}>No results found</Text>
          <Text style={styles.noResultsSubtitle}>
            We couldn't find "{searchQuery}" in our content
          </Text>
          
          <View style={styles.aiSearchContainer}>
            <Text style={styles.aiSearchTitle}>{t('more.search_with_ai')}</Text>
            <Text style={styles.aiSearchSubtitle}>
              {t('more.ai_search_subtitle')}
            </Text>
            
            <TouchableOpacity 
              style={styles.aiNoorButton}
              onPress={handleAINoorSearch}
            >
              <LinearGradient
                colors={[colors.accentTeal, colors.accentGreen]}
                style={styles.aiNoorGradient}
              >
                <Ionicons name="sparkles" size={20} color={colors.textPrimary} />
                <Text style={styles.aiNoorButtonText}>Ask AI Noor</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.aiNoorDescription}>
              AI Noor can help with Islamic questions, Quran, Hadith, Tijaniyya teachings, and more
            </Text>
          </View>
        </View>
      ) : (
      <View style={styles.featuresContainer}>
          {features
            .filter(feature => 
              !searchQuery.trim() || 
              feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              feature.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((feature, index) => (
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
      )}

      {/* App Info */}
      <View style={styles.appInfoContainer}>
        <View style={styles.appInfoCard}>
          <Ionicons name="information-circle" size={24} color={colors.accentTeal} />
          <View style={styles.appInfoContent}>
            <Text style={styles.appInfoTitle}>Tijaniyah Muslim Pro</Text>
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
    marginBottom: 16,
  },
  searchContainer: {
    position: 'relative',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    marginLeft: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  suggestionText: {
    color: colors.textPrimary,
    fontSize: 14,
    marginLeft: 8,
  },
  searchResultsContainer: {
    padding: 20,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 8,
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
    marginBottom: 2,
  },
  searchResultTitleArabic: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  searchResultDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  searchResultCategory: {
    fontSize: 12,
    color: colors.accentTeal,
    fontWeight: '500',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  specialtyTag: {
    backgroundColor: colors.accentTeal + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 10,
    color: colors.accentTeal,
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  aiSearchContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accentTeal + '20',
  },
  aiSearchTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  aiSearchSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  aiNoorButton: {
    marginBottom: 16,
  },
  aiNoorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  aiNoorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  aiNoorDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
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
