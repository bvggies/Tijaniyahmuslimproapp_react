import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Animated,
  Dimensions,
  ActivityIndicator,
  Platform,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getQuranChapters, 
  getChapterById, 
  getVersesByChapterAsync,
  searchQuran,
  addBookmark,
  removeBookmark,
  getBookmarks,
  getLastRead,
  saveLastRead,
  getReadingSettings,
  saveReadingSettings,
  getVerseAudioUrl,
  quranJuz,
  QuranChapter,
  QuranVerse,
  QuranBookmark,
  ReadingProgress,
  ReadingSettings,
  QuranJuz
} from '../services/quranService';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';

const { width, height } = Dimensions.get('window');

// Bismillah that appears at the start of most surahs
const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

export default function QuranScreen() {
  const { t, language } = useLanguage();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<QuranChapter | null>(null);
  const [chapters, setChapters] = useState<QuranChapter[]>([]);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);
  const [lastRead, setLastRead] = useState<ReadingProgress | null>(null);
  const [settings, setSettings] = useState<ReadingSettings | null>(null);
  
  // UI State
  const [viewMode, setViewMode] = useState<'home' | 'chapters' | 'juz' | 'reading' | 'search' | 'bookmarks'>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  
  // Audio State
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingVerse, setPlayingVerse] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerHeight = useRef(new Animated.Value(220)).current;
  
  // Refs
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadInitialData();
    animateIn();
    
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadInitialData = async () => {
    const quranChapters = getQuranChapters();
    setChapters(quranChapters);
    
    const [storedBookmarks, storedLastRead, storedSettings] = await Promise.all([
      getBookmarks(),
      getLastRead(),
      getReadingSettings()
    ]);
    
    setBookmarks(storedBookmarks);
    setLastRead(storedLastRead);
    setSettings(storedSettings);
  };

  const handleChapterSelect = async (chapter: QuranChapter) => {
    setSelectedChapter(chapter);
    setIsLoading(true);
    setViewMode('reading');
    
    // Collapse header animation
    Animated.timing(headerHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    try {
      const chapterVerses = await getVersesByChapterAsync(chapter.id, language);
      setVerses(chapterVerses);
    } catch (error) {
      console.error('Error loading verses:', error);
      setVerses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      setIsLoading(true);
      setViewMode('search');
      try {
        const results = await searchQuran(query, language);
        // For now, just filter chapters
        const filtered = chapters.filter(ch =>
          ch.name.toLowerCase().includes(query.toLowerCase()) ||
          ch.nameArabic.includes(query) ||
          ch.meaning.toLowerCase().includes(query.toLowerCase())
        );
        setChapters(filtered.length > 0 ? filtered : getQuranChapters());
      } finally {
        setIsLoading(false);
      }
    } else if (query.trim() === '') {
      setChapters(getQuranChapters());
      if (viewMode === 'search') setViewMode('home');
    }
  };

  const goBack = () => {
    // Expand header animation
    Animated.timing(headerHeight, {
      toValue: 220,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    if (viewMode === 'reading') {
      setViewMode(selectedJuz ? 'juz' : 'chapters');
      setSelectedChapter(null);
      setVerses([]);
      stopAudio();
    } else if (viewMode === 'search' || viewMode === 'chapters' || viewMode === 'juz' || viewMode === 'bookmarks') {
      setViewMode('home');
      setSearchQuery('');
      setChapters(getQuranChapters());
      setSelectedJuz(null);
    }
  };

  const handleVerseScroll = useCallback((verseNumber: number) => {
    if (selectedChapter) {
      saveLastRead(selectedChapter.id, verseNumber);
    }
  }, [selectedChapter]);

  const toggleBookmark = async (verse: QuranVerse) => {
    const isBookmarked = bookmarks.some(b => b.surah === verse.surah && b.verse === verse.verse);
    
    if (isBookmarked) {
      await removeBookmark(verse.surah, verse.verse);
      setBookmarks(prev => prev.filter(b => !(b.surah === verse.surah && b.verse === verse.verse)));
    } else {
      await addBookmark(verse.surah, verse.verse);
      const updatedBookmarks = await getBookmarks();
      setBookmarks(updatedBookmarks);
    }
  };

  const handleShare = async (verse: QuranVerse) => {
    const chapter = getChapterById(verse.surah);
    const shareText = `📖 ${chapter?.name} (${chapter?.nameArabic}) ${verse.surah}:${verse.verse}\n\n${verse.arabic}\n\n${verse.translation}\n\n— Holy Quran`;
    
    try {
      if (await Sharing.isAvailableAsync()) {
        // For mobile, we'd need to create a file first
        await Clipboard.setStringAsync(shareText);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopy = async (verse: QuranVerse) => {
    const chapter = getChapterById(verse.surah);
    const copyText = `${chapter?.name} ${verse.surah}:${verse.verse}\n\n${verse.arabic}\n\n${verse.translation}`;
    await Clipboard.setStringAsync(copyText);
  };

  // Audio functions
  const playVerseAudio = async (verse: QuranVerse) => {
    const verseKey = `${verse.surah}:${verse.verse}`;
    
    if (playingVerse === verseKey) {
      await stopAudio();
      return;
    }
    
    setIsAudioLoading(true);
    await stopAudio();
    
    try {
      // Calculate the verse number in the entire Quran
      let globalVerseNumber = 0;
      for (let i = 1; i < verse.surah; i++) {
        const ch = getChapterById(i);
        if (ch) globalVerseNumber += ch.verses;
      }
      globalVerseNumber += verse.verse;
      
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalVerseNumber}.mp3`;
      
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlayingVerse(null);
          }
        }
      );
      
      setSound(newSound);
      setPlayingVerse(verseKey);
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingVerse(null);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setPlayingVerse(null);
  };

  const updateSettings = async (newSettings: Partial<ReadingSettings>) => {
    const updated = { ...settings, ...newSettings } as ReadingSettings;
    setSettings(updated);
    await saveReadingSettings(newSettings);
  };

  const continueReading = () => {
    if (lastRead) {
      const chapter = getChapterById(lastRead.chapterId);
      if (chapter) {
        handleChapterSelect(chapter);
      }
    }
  };

  // Render components
  const renderHeader = () => (
    <Animated.View style={{ height: viewMode === 'reading' ? 0 : undefined }}>
      <LinearGradient
        colors={['#0D7377', '#14919B', '#0D7377']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <StatusBar barStyle="light-content" />
        
        {/* Decorative elements */}
        <View style={styles.headerDecoration}>
          <View style={[styles.decorCircle, { top: -40, right: -40, width: 150, height: 150 }]} />
          <View style={[styles.decorCircle, { bottom: -30, left: -30, width: 100, height: 100 }]} />
        </View>
        
        <View style={styles.headerContent}>
          {viewMode !== 'home' && (
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {viewMode === 'reading' && selectedChapter 
                ? selectedChapter.name 
                : viewMode === 'bookmarks'
                ? 'Bookmarks'
                : viewMode === 'juz'
                ? `Juz ${selectedJuz}`
                : '📖 Holy Quran'}
            </Text>
            {viewMode === 'home' && (
              <Text style={styles.headerSubtitle}>القرآن الكريم</Text>
            )}
            {viewMode === 'reading' && selectedChapter && (
              <Text style={styles.headerMeta}>
                {selectedChapter.nameArabic} • {selectedChapter.verses} verses • {selectedChapter.revelationPlace}
              </Text>
            )}
          </View>
          
          <View style={styles.headerActions}>
            {viewMode === 'reading' && (
              <TouchableOpacity 
                onPress={() => setShowSettings(true)} 
                style={styles.headerButton}
              >
                <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => setViewMode('bookmarks')} 
              style={styles.headerButton}
            >
              <Ionicons 
                name={viewMode === 'bookmarks' ? 'bookmark' : 'bookmark-outline'} 
                size={22} 
                color="#FFFFFF" 
              />
              {bookmarks.length > 0 && (
                <View style={styles.bookmarkBadge}>
                  <Text style={styles.bookmarkBadgeText}>{bookmarks.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        {viewMode !== 'reading' && (
          <View style={styles.searchContainer}>
            <BlurView intensity={20} tint="light" style={styles.searchBlur}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="rgba(255,255,255,0.8)" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search surah, verse, or topic..."
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => handleSearch('')}>
                    <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.8)" />
                  </TouchableOpacity>
                )}
              </View>
            </BlurView>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );

  const renderQuickAccess = () => (
    <View style={styles.quickAccessContainer}>
      {/* Continue Reading Card */}
      {lastRead && (
        <TouchableOpacity style={styles.continueReadingCard} onPress={continueReading}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueGradient}
          >
            <View style={styles.continueContent}>
              <View style={styles.continueIcon}>
                <Ionicons name="book" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.continueText}>
                <Text style={styles.continueLabel}>Continue Reading</Text>
                <Text style={styles.continueSurah}>
                  {getChapterById(lastRead.chapterId)?.name} - Verse {lastRead.verseNumber}
                </Text>
              </View>
              <View style={styles.continueProgress}>
                <Text style={styles.progressText}>{lastRead.percentage}%</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.quickAction, viewMode === 'chapters' && styles.quickActionActive]}
          onPress={() => setViewMode('chapters')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="list" size={22} color="#2E7D32" />
          </View>
          <Text style={styles.quickActionText}>Surahs</Text>
          <Text style={styles.quickActionCount}>114</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.quickAction, viewMode === 'juz' && styles.quickActionActive]}
          onPress={() => setViewMode('juz')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="layers" size={22} color="#1976D2" />
          </View>
          <Text style={styles.quickActionText}>Juz</Text>
          <Text style={styles.quickActionCount}>30</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => setViewMode('bookmarks')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="bookmark" size={22} color="#E65100" />
          </View>
          <Text style={styles.quickActionText}>Saved</Text>
          <Text style={styles.quickActionCount}>{bookmarks.length}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderChapterCard = ({ item, index }: { item: QuranChapter; index: number }) => {
    const delay = index * 30;
    
    return (
      <Animated.View
        style={[
          styles.chapterCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.chapterCardInner}
          onPress={() => handleChapterSelect(item)}
          activeOpacity={0.7}
        >
          <View style={styles.chapterNumberContainer}>
            <LinearGradient
              colors={['#14919B', '#0D7377']}
              style={styles.chapterNumberGradient}
            >
              <Text style={styles.chapterNumber}>{item.id}</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.chapterInfo}>
            <View style={styles.chapterNameRow}>
              <Text style={styles.chapterName}>{item.name}</Text>
              <Text style={styles.chapterArabic}>{item.nameArabic}</Text>
            </View>
            <Text style={styles.chapterMeaning}>{item.meaning}</Text>
            <View style={styles.chapterMeta}>
              <View style={[styles.metaBadge, item.revelationPlace === 'Mecca' ? styles.meccaBadge : styles.medinaBadge]}>
                <Text style={styles.metaBadgeText}>{item.revelationPlace}</Text>
              </View>
              <Text style={styles.verseCount}>{item.verses} verses</Text>
            </View>
          </View>
          
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderJuzCard = ({ item }: { item: QuranJuz }) => (
    <TouchableOpacity
      style={styles.juzCard}
      onPress={() => {
        setSelectedJuz(item.number);
        const chapter = getChapterById(item.startSurah);
        if (chapter) handleChapterSelect(chapter);
      }}
    >
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.juzCardGradient}
      >
        <View style={styles.juzNumber}>
          <Text style={styles.juzNumberText}>{item.number}</Text>
        </View>
        <View style={styles.juzInfo}>
          <Text style={styles.juzName}>{item.name}</Text>
          <Text style={styles.juzArabic}>{item.nameArabic}</Text>
          <Text style={styles.juzRange}>
            Surah {item.startSurah}:{item.startAyah} - {item.endSurah}:{item.endAyah}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderVerseCard = ({ item, index }: { item: QuranVerse; index: number }) => {
    const isBookmarked = bookmarks.some(b => b.surah === item.surah && b.verse === item.verse);
    const isPlaying = playingVerse === `${item.surah}:${item.verse}`;
    const arabicSize = settings?.arabicFontSize || 28;
    const translationSize = settings?.translationFontSize || 16;
    
    // Show Bismillah before verse 1 (except for Surah 1 and 9)
    const showBismillah = item.verse === 1 && item.surah !== 1 && item.surah !== 9;
    
    return (
      <View style={styles.verseCardContainer}>
        {showBismillah && (
          <View style={styles.bismillahContainer}>
            <Text style={styles.bismillahText}>{BISMILLAH}</Text>
          </View>
        )}
        
        <View style={[styles.verseCard, isPlaying && styles.verseCardPlaying]}>
          {/* Verse Header */}
          <View style={styles.verseHeader}>
            <View style={styles.verseNumberBadge}>
              <Text style={styles.verseNumberText}>{item.verse}</Text>
            </View>
            
            <View style={styles.verseActions}>
              <TouchableOpacity
                onPress={() => playVerseAudio(item)}
                style={[styles.verseActionBtn, isPlaying && styles.verseActionActive]}
                disabled={isAudioLoading}
              >
                {isAudioLoading && playingVerse === `${item.surah}:${item.verse}` ? (
                  <ActivityIndicator size="small" color="#14919B" />
                ) : (
                  <Ionicons 
                    name={isPlaying ? 'pause' : 'play'} 
                    size={18} 
                    color={isPlaying ? '#FFFFFF' : '#14919B'} 
                  />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => toggleBookmark(item)}
                style={[styles.verseActionBtn, isBookmarked && styles.bookmarkActive]}
              >
                <Ionicons 
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
                  size={18} 
                  color={isBookmarked ? '#FFFFFF' : '#E65100'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleCopy(item)}
                style={styles.verseActionBtn}
              >
                <Ionicons name="copy-outline" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Arabic Text */}
          <Text style={[styles.arabicText, { fontSize: arabicSize }]}>
            {item.arabic}
          </Text>
          
          {/* Transliteration */}
          {settings?.showTransliteration && item.transliteration && (
            <Text style={styles.transliterationText}>
              {item.transliteration}
            </Text>
          )}
          
          {/* Translation */}
          {settings?.showTranslation && (
            <Text style={[styles.translationText, { fontSize: translationSize }]}>
              {language === 'fr' && item.frenchTranslation 
                ? item.frenchTranslation 
                : language === 'ha' && item.hausaTranslation 
                ? item.hausaTranslation 
                : item.translation}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderBookmarkCard = ({ item }: { item: QuranBookmark }) => {
    const chapter = getChapterById(item.surah);
    
    return (
      <TouchableOpacity
        style={styles.bookmarkCard}
        onPress={() => {
          if (chapter) handleChapterSelect(chapter);
        }}
      >
        <View style={styles.bookmarkContent}>
          <View style={styles.bookmarkIcon}>
            <Ionicons name="bookmark" size={20} color="#E65100" />
          </View>
          <View style={styles.bookmarkInfo}>
            <Text style={styles.bookmarkTitle}>
              {chapter?.name} - Verse {item.verse}
            </Text>
            <Text style={styles.bookmarkMeta}>
              {chapter?.nameArabic} • {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              removeBookmark(item.surah, item.verse);
              setBookmarks(prev => prev.filter(b => !(b.surah === item.surah && b.verse === item.verse)));
            }}
            style={styles.removeBookmark}
          >
            <Ionicons name="close-circle" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSettingsModal = () => (
    <Modal
      visible={showSettings}
      animationType="slide"
      transparent
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.settingsModal}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>Reading Settings</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Arabic Font Size</Text>
            <View style={styles.fontSizeControls}>
              <TouchableOpacity
                style={styles.fontSizeBtn}
                onPress={() => updateSettings({ arabicFontSize: Math.max(20, (settings?.arabicFontSize || 28) - 2) })}
              >
                <Ionicons name="remove" size={20} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.fontSizeValue}>{settings?.arabicFontSize || 28}</Text>
              <TouchableOpacity
                style={styles.fontSizeBtn}
                onPress={() => updateSettings({ arabicFontSize: Math.min(48, (settings?.arabicFontSize || 28) + 2) })}
              >
                <Ionicons name="add" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Translation Font Size</Text>
            <View style={styles.fontSizeControls}>
              <TouchableOpacity
                style={styles.fontSizeBtn}
                onPress={() => updateSettings({ translationFontSize: Math.max(12, (settings?.translationFontSize || 16) - 1) })}
              >
                <Ionicons name="remove" size={20} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.fontSizeValue}>{settings?.translationFontSize || 16}</Text>
              <TouchableOpacity
                style={styles.fontSizeBtn}
                onPress={() => updateSettings({ translationFontSize: Math.min(24, (settings?.translationFontSize || 16) + 1) })}
              >
                <Ionicons name="add" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.settingToggle}
            onPress={() => updateSettings({ showTransliteration: !settings?.showTransliteration })}
          >
            <Text style={styles.settingLabel}>Show Transliteration</Text>
            <View style={[styles.toggle, settings?.showTransliteration && styles.toggleActive]}>
              <View style={[styles.toggleKnob, settings?.showTransliteration && styles.toggleKnobActive]} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.settingToggle}
            onPress={() => updateSettings({ showTranslation: !settings?.showTranslation })}
          >
            <Text style={styles.settingLabel}>Show Translation</Text>
            <View style={[styles.toggle, settings?.showTranslation && styles.toggleActive]}>
              <View style={[styles.toggleKnob, settings?.showTranslation && styles.toggleKnobActive]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#14919B" />
          <Text style={styles.loadingText}>Loading verses...</Text>
        </View>
      );
    }

    switch (viewMode) {
      case 'home':
        return (
          <FlatList
            data={chapters.slice(0, 20)} // Show first 20 on home
            renderItem={renderChapterCard}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={renderQuickAccess}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => setViewMode('chapters')}
              >
                <Text style={styles.viewAllText}>View All 114 Surahs</Text>
                <Ionicons name="arrow-forward" size={18} color="#14919B" />
              </TouchableOpacity>
            }
          />
        );

      case 'chapters':
        return (
          <FlatList
            data={chapters}
            renderItem={renderChapterCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
          />
        );

      case 'juz':
        return (
          <FlatList
            data={quranJuz}
            renderItem={renderJuzCard}
            keyExtractor={(item) => item.number.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        );

      case 'reading':
        return (
          <FlatList
            ref={flatListRef}
            data={verses}
            renderItem={renderVerseCard}
            keyExtractor={(item) => `${item.surah}:${item.verse}`}
            contentContainerStyle={styles.versesContent}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={({ viewableItems }) => {
              if (viewableItems.length > 0) {
                const firstVisible = viewableItems[0].item as QuranVerse;
                handleVerseScroll(firstVisible.verse);
              }
            }}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="cloud-offline-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No verses loaded</Text>
                <Text style={styles.emptySubtitle}>Please check your internet connection</Text>
              </View>
            }
          />
        );

      case 'bookmarks':
        return (
          <FlatList
            data={bookmarks}
            renderItem={renderBookmarkCard}
            keyExtractor={(item) => `${item.surah}:${item.verse}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="bookmark-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No bookmarks yet</Text>
                <Text style={styles.emptySubtitle}>Save verses to access them quickly</Text>
              </View>
            }
          />
        );

      case 'search':
        return (
          <FlatList
            data={chapters}
            renderItem={renderChapterCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySubtitle}>Try searching with different keywords</Text>
              </View>
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {renderSettingsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  
  // Header Styles
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  headerMeta: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bookmarkBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  // Search Styles
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
  
  // Quick Access Styles
  quickAccessContainer: {
    padding: 16,
  },
  continueReadingCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  continueGradient: {
    padding: 16,
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  continueText: {
    flex: 1,
  },
  continueLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  continueSurah: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 4,
  },
  continueProgress: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionActive: {
    borderWidth: 2,
    borderColor: '#14919B',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  quickActionCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  
  // List Styles
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  versesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  
  // Chapter Card Styles
  chapterCard: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chapterCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  chapterNumberContainer: {
    marginRight: 16,
  },
  chapterNumberGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
  },
  chapterInfo: {
    flex: 1,
  },
  chapterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapterName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  chapterArabic: {
    fontSize: 18,
    color: '#14919B',
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  chapterMeaning: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  chapterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  meccaBadge: {
    backgroundColor: '#FEF3C7',
  },
  medinaBadge: {
    backgroundColor: '#D1FAE5',
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  verseCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  
  // Juz Card Styles
  juzCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  juzCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  juzNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#14919B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  juzNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  juzInfo: {
    flex: 1,
  },
  juzName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  juzArabic: {
    fontSize: 18,
    color: '#14919B',
    marginTop: 2,
  },
  juzRange: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  
  // Verse Card Styles
  verseCardContainer: {
    marginBottom: 16,
  },
  bismillahContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 8,
  },
  bismillahText: {
    fontSize: 26,
    color: '#14919B',
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  verseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  verseCardPlaying: {
    borderWidth: 2,
    borderColor: '#14919B',
    backgroundColor: '#F0FDFA',
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verseNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  verseActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verseActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  verseActionActive: {
    backgroundColor: '#14919B',
  },
  bookmarkActive: {
    backgroundColor: '#E65100',
  },
  arabicText: {
    fontSize: 28,
    color: '#1F2937',
    textAlign: 'right',
    lineHeight: 52,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
    marginBottom: 16,
  },
  transliterationText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 22,
  },
  translationText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
  },
  
  // Bookmark Card Styles
  bookmarkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookmarkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  bookmarkIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  bookmarkMeta: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  removeBookmark: {
    padding: 4,
  },
  
  // Settings Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  settingsModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: height * 0.7,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 8,
  },
  fontSizeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fontSizeValue: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  settingToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  toggle: {
    width: 52,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#14919B',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleKnobActive: {
    transform: [{ translateX: 24 }],
  },
  
  // View All Button
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14919B',
    marginRight: 8,
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
});
