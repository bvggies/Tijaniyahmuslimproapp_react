/**
 * SurahReader Screen
 * Displays verses for a specific surah with infinite scroll
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { colors } from '../../utils/theme';
import {
  useChapter,
  useVersesByChapter,
  useAddBookmark,
  useRemoveBookmark,
  useBookmarks,
  useSaveLastRead,
} from './hooks';
import { useQuranStore } from './store';
import { VerseCard, FontSizeControls } from './components';
import type { VerseWithTranslation } from '../../lib/quran/quranTypes';

export function SurahReader() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { chapterId, initialVerse } = route.params || {};
  
  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [playingVerseKey, setPlayingVerseKey] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  // Audio ref
  const soundRef = useRef<Audio.Sound | null>(null);
  
  // Store
  const { selectedTranslationId } = useQuranStore();
  
  // Data hooks
  const { data: chapter, isLoading: isLoadingChapter } = useChapter(chapterId);
  const {
    data: versesData,
    isLoading: isLoadingVerses,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
  } = useVersesByChapter(chapterId, {
    translationId: selectedTranslationId,
    perPage: 20,
  });
  
  const { data: bookmarks } = useBookmarks();
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();
  const saveLastRead = useSaveLastRead();
  
  // Flatten paginated verses
  const verses = versesData?.pages.flatMap((page) => page.verses) || [];
  const isFromCache = versesData?.pages[0]?.fromCache || false;
  
  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);
  
  // Save last read on verse view
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ item: VerseWithTranslation }> }) => {
      if (viewableItems.length > 0) {
        const firstVisible = viewableItems[0].item;
        saveLastRead.mutate({
          chapterId,
          verseNumber: firstVisible.verse_number,
        });
      }
    },
    [chapterId, saveLastRead]
  );
  
  // Check if verse is bookmarked
  const isVerseBookmarked = useCallback(
    (verseKey: string) => {
      return bookmarks?.some((b) => b.verse_key === verseKey) || false;
    },
    [bookmarks]
  );
  
  // Handle bookmark toggle
  const handleBookmark = useCallback(
    async (verse: VerseWithTranslation) => {
      const isBookmarked = isVerseBookmarked(verse.verse_key);
      
      if (isBookmarked) {
        const bookmark = bookmarks?.find((b) => b.verse_key === verse.verse_key);
        if (bookmark) {
          removeBookmark.mutate(bookmark.id);
        }
      } else {
        addBookmark.mutate({ verseKey: verse.verse_key });
      }
    },
    [bookmarks, isVerseBookmarked, addBookmark, removeBookmark]
  );
  
  // Handle audio playback
  const handlePlayAudio = useCallback(
    async (verse: VerseWithTranslation) => {
      const verseKey = verse.verse_key;
      
      // If already playing, stop
      if (playingVerseKey === verseKey) {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        setPlayingVerseKey(null);
        return;
      }
      
      // Stop any current audio
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      
      setIsAudioLoading(true);
      setPlayingVerseKey(verseKey);
      
      try {
        // Calculate global verse number for audio URL
        let globalVerseNumber = 0;
        for (let i = 1; i < chapterId; i++) {
          // This is simplified - ideally we'd have verse counts cached
          const verseCounts = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109]; // First 10 surahs
          globalVerseNumber += verseCounts[i - 1] || 100;
        }
        globalVerseNumber += verse.verse_number;
        
        const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalVerseNumber}.mp3`;
        
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });
        
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded && status.didJustFinish) {
              setPlayingVerseKey(null);
            }
          }
        );
        
        soundRef.current = sound;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.error('Audio error:', error);
        setPlayingVerseKey(null);
      } finally {
        setIsAudioLoading(false);
      }
    },
    [chapterId, playingVerseKey]
  );
  
  // Handle share
  const handleShare = useCallback(async (verse: VerseWithTranslation) => {
    const translation = verse.translations?.[0]?.text || '';
    const shareText = `📖 ${chapter?.name_simple || `Surah ${chapterId}`} (${verse.verse_key})\n\n${verse.text_uthmani}\n\n${translation}\n\n— Holy Quran`;
    
    try {
      await Share.share({
        message: shareText,
        title: 'Holy Quran',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [chapter, chapterId]);
  
  // Load more on end reached
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  // Render footer
  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.accentTeal} />
          <Text style={styles.footerText}>Loading more verses...</Text>
        </View>
      );
    }
    
    if (!hasNextPage && verses.length > 0) {
      return (
        <View style={styles.endCard}>
          <Text style={styles.endEmoji}>🕌</Text>
          <Text style={styles.endTitle}>End of Surah</Text>
          <Text style={styles.endSubtitle}>
            صَدَقَ اللَّهُ الْعَظِيمُ
          </Text>
          <Text style={styles.endMeaning}>
            Allah the Almighty has spoken the truth
          </Text>
        </View>
      );
    }
    
    return null;
  };
  
  // Chapter info (Chapter | CachedChapter both have these)
  const chapterName = chapter
    ? (chapter as { name_simple: string }).name_simple
    : `Surah ${chapterId}`;
  const chapterArabic = chapter ? (chapter as { name_arabic: string }).name_arabic : '';
  const versesCount = chapter ? (chapter as { verses_count: number }).verses_count : 0;
  
  // Show bismillah for all surahs except Al-Fatihah (1) and At-Tawbah (9)
  const showBismillahForVerse = (verseNumber: number) => {
    return verseNumber === 1 && chapterId !== 1 && chapterId !== 9;
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
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{chapterName}</Text>
            <Text style={styles.headerArabic}>{chapterArabic}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
          >
            <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Surah Meta */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {versesCount} verses • {isFromCache ? 'Offline' : 'Online'}
          </Text>
        </View>
      </LinearGradient>
      
      {/* Content */}
      {isLoadingVerses && verses.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accentTeal} />
          <Text style={styles.loadingText}>Loading verses...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.errorTitle}>Failed to load verses</Text>
          <Text style={styles.errorText}>{(error as Error).message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={verses}
          renderItem={({ item }) => (
            <VerseCard
              verse={item}
              isBookmarked={isVerseBookmarked(item.verse_key)}
              isPlaying={playingVerseKey === item.verse_key}
              onBookmark={() => handleBookmark(item)}
              onPlay={() => handlePlayAudio(item)}
              onShare={() => handleShare(item)}
              showBismillah={showBismillahForVerse(item.verse_number)}
            />
          )}
          keyExtractor={(item) => item.verse_key}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
      )}
      
      {/* Settings Modal */}
      <FontSizeControls
        visible={showSettings}
        onClose={() => setShowSettings(false)}
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
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerArabic: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
  },
  errorText: {
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
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  endCard: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  endEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  endTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  endSubtitle: {
    fontSize: 22,
    color: colors.accentTeal,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
    marginBottom: 8,
  },
  endMeaning: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default SurahReader;

