/**
 * QuranHome Screen
 * Main entry point for Quran reading feature
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/theme';
import { useChapters, useLastRead, useBookmarks } from './hooks';
import { useQuranStore } from './store';
import { SurahRow, TranslationPicker } from './components';
import type { Chapter, CachedChapter } from '../../lib/quran/quranTypes';

export function QuranHome() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showTranslationPicker, setShowTranslationPicker] = useState(false);
  
  // Data hooks
  const { data: chaptersResult, isLoading, error, refetch, isRefetching } = useChapters();
  const { data: lastRead } = useLastRead();
  const { data: bookmarks } = useBookmarks();
  
  // Store
  const { selectedTranslationName } = useQuranStore();
  
  // Filter chapters by search query
  const filteredChapters = useMemo(() => {
    if (!chaptersResult?.chapters) return [];
    
    const query = searchQuery.toLowerCase().trim();
    if (!query) return chaptersResult.chapters;
    
    return chaptersResult.chapters.filter((chapter) => {
      const nameSimple = 'name_simple' in chapter ? chapter.name_simple : chapter.name_simple;
      const nameArabic = 'name_arabic' in chapter ? chapter.name_arabic : chapter.name_arabic;
      const translated = 'translated_name' in chapter 
        ? chapter.translated_name?.name 
        : 'name_translated' in chapter 
          ? chapter.name_translated 
          : '';
      
      return (
        nameSimple.toLowerCase().includes(query) ||
        nameArabic.includes(query) ||
        translated?.toLowerCase().includes(query) ||
        chapter.id.toString() === query
      );
    });
  }, [chaptersResult?.chapters, searchQuery]);
  
  // Handle surah selection
  const handleSurahPress = useCallback((chapter: Chapter | CachedChapter) => {
    navigation.navigate('SurahReader', { chapterId: chapter.id });
  }, [navigation]);
  
  // Continue reading
  const handleContinueReading = useCallback(() => {
    if (lastRead) {
      navigation.navigate('SurahReader', {
        chapterId: lastRead.chapter_id,
        initialVerse: lastRead.verse_number,
      });
    }
  }, [lastRead, navigation]);
  
  // Render header
  const renderHeader = () => (
    <View>
      {/* Last Read Card */}
      {lastRead && (
        <TouchableOpacity
          style={styles.lastReadCard}
          onPress={handleContinueReading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.accentTeal, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.lastReadGradient}
          >
            <View style={styles.lastReadContent}>
              <View style={styles.lastReadIcon}>
                <Ionicons name="book" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.lastReadInfo}>
                <Text style={styles.lastReadLabel}>Continue Reading</Text>
                <Text style={styles.lastReadSurah}>
                  Surah {lastRead.chapter_id} • Verse {lastRead.verse_number}
                </Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={28} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
      
      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="book-outline" size={20} color={colors.accentTeal} />
          <Text style={styles.statValue}>114</Text>
          <Text style={styles.statLabel}>Surahs</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="bookmark-outline" size={20} color={colors.accentOrange} />
          <Text style={styles.statValue}>{bookmarks?.length || 0}</Text>
          <Text style={styles.statLabel}>Bookmarks</Text>
        </View>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => setShowTranslationPicker(true)}
        >
          <Ionicons name="language-outline" size={20} color={colors.accentPurple} />
          <Text style={styles.statValue} numberOfLines={1}>
            {selectedTranslationName.split(' ')[0]}
          </Text>
          <Text style={styles.statLabel}>Translation</Text>
        </TouchableOpacity>
      </View>
      
      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Surahs</Text>
        <Text style={styles.sectionSubtitle}>
          {chaptersResult?.fromCache ? '(Offline)' : ''}
        </Text>
      </View>
    </View>
  );
  
  // Render empty state
  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.accentTeal} />
          <Text style={styles.emptyText}>Loading Quran...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-offline" size={48} color={colors.error} />
          <Text style={styles.emptyTitle}>Failed to load</Text>
          <Text style={styles.emptyText}>{(error as Error).message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (searchQuery && filteredChapters.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No results</Text>
          <Text style={styles.emptyText}>Try a different search term</Text>
        </View>
      );
    }
    
    return null;
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.accentTeal, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Decorative elements */}
        <View style={styles.headerDecoration}>
          <View style={[styles.decorCircle, { top: -40, right: -40, width: 150, height: 150 }]} />
          <View style={[styles.decorCircle, { bottom: -30, left: -30, width: 100, height: 100 }]} />
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>📖 Holy Quran</Text>
          <Text style={styles.headerSubtitle}>القرآن الكريم</Text>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <BlurView intensity={20} tint="light" style={styles.searchBlur}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="rgba(255,255,255,0.8)" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search surah by name or number..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        </View>
      </LinearGradient>
      
      {/* Surah List */}
      <FlatList
        data={filteredChapters}
        renderItem={({ item }) => (
          <SurahRow
            chapter={item}
            onPress={() => handleSurahPress(item)}
            isLastRead={lastRead?.chapter_id === item.id}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accentTeal}
            colors={[colors.accentTeal]}
          />
        }
      />
      
      {/* Translation Picker Modal */}
      <TranslationPicker
        visible={showTranslationPicker}
        onClose={() => setShowTranslationPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerDecoration: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 100,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
    paddingVertical: 0,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  lastReadCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  lastReadGradient: {
    padding: 16,
  },
  lastReadContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastReadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lastReadInfo: {
    flex: 1,
  },
  lastReadLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  lastReadSurah: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.accentTeal,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default QuranHome;

