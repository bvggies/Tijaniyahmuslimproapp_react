import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Share,
  Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getQuranChapters, 
  getChapterById, 
  getVersesByChapter, 
  getVersesByChapterAsync,
  searchQuran,
  addBookmark,
  removeBookmark,
  QuranChapter,
  QuranVerse,
  QuranBookmark
} from '../services/quranService';

export default function QuranScreen() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'chapters' | 'verses' | 'search'>('chapters');
  const [chapters, setChapters] = useState<QuranChapter[]>([]);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);
  const [searchResults, setSearchResults] = useState<{ chapters: QuranChapter[], verses: QuranVerse[] }>({ chapters: [], verses: [] });

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = () => {
    const quranChapters = getQuranChapters();
    setChapters(quranChapters);
  };

  const handleChapterSelect = async (chapterId: number) => {
    setSelectedChapter(chapterId);
    setIsLoadingVerses(true);
    setViewMode('verses');
    try {
      const full = await getVersesByChapterAsync(chapterId);
      setVerses(full);
    } catch {
      const fallback = getVersesByChapter(chapterId);
      setVerses(fallback);
    } finally {
      setIsLoadingVerses(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchQuran(query);
      setSearchResults(results);
      setViewMode('search');
    } else {
      setViewMode('chapters');
    }
  };

  const toggleBookmark = (surah: number, verse: number) => {
    const key = `${surah}:${verse}`;
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(key)) {
      newBookmarks.delete(key);
      removeBookmark(surah, verse);
    } else {
      newBookmarks.add(key);
      addBookmark(surah, verse);
    }
    setBookmarks(newBookmarks);
  };

  const handleShare = async (verse: QuranVerse) => {
    try {
      const chapter = getChapterById(verse.surah);
      const shareText = `${chapter?.name} ${verse.surah}:${verse.verse}\n\n${verse.arabic}\n\n${verse.translation}`;
      await Share.share({
        message: shareText,
        title: t('quran.title')
      });
    } catch (error) {
      console.error('Error sharing verse:', error);
    }
  };

  const handleCopy = (verse: QuranVerse) => {
    const chapter = getChapterById(verse.surah);
    const copyText = `${chapter?.name} ${verse.surah}:${verse.verse}\n\n${verse.arabic}\n\n${verse.translation}`;
    Clipboard.setString(copyText);
    Alert.alert(t('common.success'), t('quran.notes'));
  };

  const goBack = () => {
    if (viewMode === 'verses') {
      setViewMode('chapters');
      setSelectedChapter(null);
    } else if (viewMode === 'search') {
      setViewMode('chapters');
      setSearchQuery('');
    }
  };

  const renderChapterCard = ({ item }: { item: QuranChapter }) => (
    <TouchableOpacity
      style={styles.chapterCard}
      onPress={() => handleChapterSelect(item.id)}
    >
      <View style={styles.chapterHeader}>
        <View style={styles.chapterNumber}>
          <Text style={styles.chapterNumberText}>{item.id}</Text>
        </View>
        <View style={styles.chapterInfo}>
          <Text style={styles.chapterName}>{item.name}</Text>
          <Text style={styles.chapterNameArabic}>{item.nameArabic}</Text>
          <Text style={styles.chapterMeaning}>{item.meaning}</Text>
          <View style={styles.chapterMeta}>
            <Text style={styles.chapterVerses}>{item.verses} verses</Text>
            <Text style={styles.chapterPlace}>• {item.revelationPlace}</Text>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="#666"
        />
      </View>
    </TouchableOpacity>
  );

  const renderVerseCard = ({ item }: { item: QuranVerse }) => {
    const isBookmarked = bookmarks.has(`${item.surah}:${item.verse}`);
    
    return (
      <View style={styles.verseCard}>
        <View style={styles.verseHeader}>
          <Text style={styles.verseNumber}>{item.surah}:{item.verse}</Text>
          <TouchableOpacity
            onPress={() => toggleBookmark(item.surah, item.verse)}
            style={styles.bookmarkButton}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked ? '#FF6B6B' : '#666'}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.verseContent}>
          <Text style={styles.arabicText}>{item.arabic}</Text>
          <Text style={styles.transliterationText}>{item.transliteration}</Text>
          <Text style={styles.translationText}>{item.translation}</Text>
        </View>
        
        <View style={styles.verseFooter}>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => handleShare(item)}
          >
            <Ionicons name="share-outline" size={16} color="#2196F3" />
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => handleCopy(item)}
          >
            <Ionicons name="copy-outline" size={16} color="#4CAF50" />
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getHeaderTitle = () => {
    switch (viewMode) {
      case 'verses':
        const chapter = getChapterById(selectedChapter || 0);
        return chapter ? chapter.name : 'Verses';
      case 'search':
        return 'Search Results';
      default:
        return 'Holy Quran';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.accentTeal, colors.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {(viewMode === 'verses' || viewMode === 'search') && (
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          <TouchableOpacity style={styles.bookmarksButton}>
            <Ionicons name="bookmark" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chapters or verses..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Content */}
      <FlatList
        style={styles.content}
        showsVerticalScrollIndicator={false}
        data={viewMode === 'chapters' ? chapters : viewMode === 'verses' ? verses : []}
        renderItem={viewMode === 'chapters' ? renderChapterCard : renderVerseCard}
        keyExtractor={(item) => 
          viewMode === 'chapters' 
            ? item.id.toString() 
            : `${item.surah}:${item.verse}`
        }
        ListHeaderComponent={() => (
          <View>
            {viewMode === 'chapters' && (
              <View style={styles.chaptersContainer}>
                <Text style={styles.sectionTitle}>Quran Chapters (Surahs)</Text>
              </View>
            )}
            {viewMode === 'verses' && (
              <View style={styles.versesContainer}>
                <Text style={styles.sectionTitle}>
                  {getChapterById(selectedChapter || 0)?.name} - Verses
                </Text>
              </View>
            )}
            {viewMode === 'search' && (
              <View style={styles.searchResultsContainer}>
                {searchResults.chapters.length > 0 && (
                  <View style={styles.searchSection}>
                    <Text style={styles.sectionTitle}>Chapters ({searchResults.chapters.length})</Text>
                    {searchResults.chapters.map((item) => (
                      <View key={`search-chapter-${item.id}`}>
                        {renderChapterCard({ item })}
                      </View>
                    ))}
                  </View>
                )}
                
                {searchResults.verses.length > 0 && (
                  <View style={styles.searchSection}>
                    <Text style={styles.sectionTitle}>Verses ({searchResults.verses.length})</Text>
                    {searchResults.verses.map((item) => (
                      <View key={`search-verse-${item.surah}:${item.verse}`}>
                        {renderVerseCard({ item })}
                      </View>
                    ))}
                  </View>
                )}
                
                {searchResults.chapters.length === 0 && searchResults.verses.length === 0 && (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="search" size={48} color="#999" />
                    <Text style={styles.noResultsText}>No results found</Text>
                    <Text style={styles.noResultsSubtext}>Try searching with different keywords</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={() => {
          if (viewMode === 'search') return null;
          return (
            <View style={styles.noResultsContainer}>
              <Ionicons name="book" size={48} color="#999" />
              <Text style={styles.noResultsText}>No content available</Text>
            </View>
          );
        }}
        ListFooterComponent={() => (
          viewMode === 'verses' && isLoadingVerses ? (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={{ color: '#999' }}>Loading verses…</Text>
            </View>
          ) : null
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 70, // Add padding for floating tab bar
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  bookmarksButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
  },
  chaptersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  versesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchResultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  chapterCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  chapterNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  chapterNameArabic: {
    fontSize: 16,
    color: colors.accentTeal,
    marginBottom: 4,
    textAlign: 'right',
  },
  chapterMeaning: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  chapterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterVerses: {
    fontSize: 12,
    color: '#999',
  },
  chapterPlace: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  verseCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accentTeal,
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookmarkButton: {
    padding: 4,
  },
  verseContent: {
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 20,
    color: colors.accentTeal,
    textAlign: 'right',
    marginBottom: 12,
    lineHeight: 32,
    fontFamily: 'System',
  },
  transliterationText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  translationText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  verseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareText: {
    fontSize: 14,
    color: '#2196F3',
    marginLeft: 4,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
