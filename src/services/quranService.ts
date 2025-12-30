import { quranChapters, QuranChapter, QuranVerse } from '../data/completeQuran';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuranBookmark {
  surah: number;
  verse: number;
  timestamp: string;
  note?: string;
}

export interface ReadingProgress {
  chapterId: number;
  verseNumber: number;
  timestamp: string;
  percentage: number;
}

export interface QuranJuz {
  number: number;
  name: string;
  nameArabic: string;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

// All 30 Juz (parts) of the Quran
export const quranJuz: QuranJuz[] = [
  { number: 1, name: 'Alif Lam Mim', nameArabic: 'الم', startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141 },
  { number: 2, name: 'Sayaqool', nameArabic: 'سيقول', startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
  { number: 3, name: 'Tilkar Rusul', nameArabic: 'تلك الرسل', startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92 },
  { number: 4, name: 'Lan Tanaloo', nameArabic: 'لن تنالوا', startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23 },
  { number: 5, name: 'Wal Mohsanat', nameArabic: 'والمحصنات', startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
  { number: 6, name: 'La Yuhibbullah', nameArabic: 'لا يحب الله', startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
  { number: 7, name: 'Wa Iza Samiu', nameArabic: 'وإذا سمعوا', startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
  { number: 8, name: 'Wa Lau Annana', nameArabic: 'ولو أننا', startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
  { number: 9, name: 'Qalal Malao', nameArabic: 'قال الملأ', startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
  { number: 10, name: 'Wa Alamu', nameArabic: 'واعلموا', startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
  { number: 11, name: 'Yatazeroon', nameArabic: 'يعتذرون', startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
  { number: 12, name: 'Wa Mamin Dabbah', nameArabic: 'وما من دابة', startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
  { number: 13, name: 'Wa Ma Ubarrio', nameArabic: 'وما أبرئ', startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
  { number: 14, name: 'Rubama', nameArabic: 'ربما', startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128 },
  { number: 15, name: 'Subhanallazi', nameArabic: 'سبحان الذي', startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74 },
  { number: 16, name: 'Qala Alam', nameArabic: 'قال ألم', startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
  { number: 17, name: 'Iqtaraba', nameArabic: 'اقترب', startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78 },
  { number: 18, name: 'Qad Aflaha', nameArabic: 'قد أفلح', startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20 },
  { number: 19, name: 'Wa Qalallazina', nameArabic: 'وقال الذين', startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55 },
  { number: 20, name: 'Amman Khalaqa', nameArabic: 'أمن خلق', startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45 },
  { number: 21, name: 'Utlu Ma Oohi', nameArabic: 'اتل ما أوحي', startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
  { number: 22, name: 'Wa Manyaqnut', nameArabic: 'ومن يقنت', startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
  { number: 23, name: 'Wa Mali', nameArabic: 'وما لي', startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
  { number: 24, name: 'Faman Azlam', nameArabic: 'فمن أظلم', startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
  { number: 25, name: 'Ilaihi Yurad', nameArabic: 'إليه يرد', startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
  { number: 26, name: 'Ha Mim', nameArabic: 'حم', startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30 },
  { number: 27, name: 'Qala Fama Khatbukum', nameArabic: 'قال فما خطبكم', startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
  { number: 28, name: 'Qad Sami Allah', nameArabic: 'قد سمع الله', startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12 },
  { number: 29, name: 'Tabarakallazi', nameArabic: 'تبارك الذي', startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50 },
  { number: 30, name: 'Amma Yatasa\'aloon', nameArabic: 'عم يتساءلون', startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6 }
];

// Storage keys
const VERSES_CACHE_PREFIX = 'quran_verses_cache_v2_';
const BOOKMARKS_KEY = 'quran_bookmarks';
const LAST_READ_KEY = 'quran_last_read';
const READING_SETTINGS_KEY = 'quran_reading_settings';

export interface ReadingSettings {
  arabicFontSize: number;
  translationFontSize: number;
  showTransliteration: boolean;
  showTranslation: boolean;
  arabicFont: 'uthmani' | 'simple' | 'indopak';
  translationLanguage: 'en' | 'fr' | 'ha';
}

const defaultReadingSettings: ReadingSettings = {
  arabicFontSize: 28,
  translationFontSize: 16,
  showTransliteration: true,
  showTranslation: true,
  arabicFont: 'simple',
  translationLanguage: 'en'
};

// Service functions
export const getQuranChapters = (): QuranChapter[] => {
  return quranChapters;
};

export const getChapterById = (id: number): QuranChapter | undefined => {
  return quranChapters.find(chapter => chapter.id === id);
};

// Get chapters by Juz
export const getChaptersByJuz = (juzNumber: number): QuranChapter[] => {
  const juz = quranJuz.find(j => j.number === juzNumber);
  if (!juz) return [];
  
  return quranChapters.filter(
    chapter => chapter.id >= juz.startSurah && chapter.id <= juz.endSurah
  );
};

// Async version that fetches full chapter from public API
export const getVersesByChapterAsync = async (
  chapterId: number, 
  language: string = 'en',
  forceRefresh: boolean = false
): Promise<QuranVerse[]> => {
  const cacheKey = `${VERSES_CACHE_PREFIX}${chapterId}_${language}`;
  
  // Try cache first (unless force refresh)
  if (!forceRefresh) {
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const parsed: QuranVerse[] = JSON.parse(cached);
        const chapterMeta = quranChapters.find(c => c.id === chapterId);
        if (parsed && parsed.length >= (chapterMeta?.verses || 0)) {
          return parsed;
        }
      }
    } catch (e) {
      console.log('Cache read error:', e);
    }
  }

  // Fetch from public API (alquran.cloud)
  try {
    // Determine which translation to fetch based on language
    let translationId = 'en.sahih';
    if (language === 'fr') {
      translationId = 'fr.hamidullah';
    } else if (language === 'ha') {
      translationId = 'en.sahih'; // Fallback to English for Hausa
    }
    
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${chapterId}/editions/quran-uthmani,${translationId}`,
      { 
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(15000) // 15 second timeout
      }
    );
    
    if (!res.ok) throw new Error('Network error');
    
    const json = await res.json();
    const editions = json.data || [];
    
    const arabic = editions.find((e: any) => 
      e.edition && (e.edition.identifier === 'quran-uthmani' || e.edition.language === 'ar')
    );
    const translation = editions.find((e: any) => 
      e.edition && (e.edition.identifier === translationId || e.edition.language === language)
    );
    
    const verses: QuranVerse[] = [];
    const max = Math.max(
      Array.isArray(arabic?.ayahs) ? arabic.ayahs.length : 0,
      Array.isArray(translation?.ayahs) ? translation.ayahs.length : 0
    );
    
    for (let i = 0; i < max; i++) {
      const a = arabic?.ayahs?.[i];
      const t = translation?.ayahs?.[i];
      verses.push({
        surah: chapterId,
        verse: a?.numberInSurah || t?.numberInSurah || i + 1,
        arabic: a?.text || '',
        translation: t?.text || '',
        frenchTranslation: language === 'fr' ? t?.text : undefined,
        hausaTranslation: language === 'ha' ? t?.text : undefined,
        transliteration: '',
        audioUrl: a?.audio || undefined
      });
    }
    
    // Cache the result
    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(verses));
    } catch (e) {
      console.log('Cache write error:', e);
    }
    
    return verses;
  } catch (error) {
    console.log('API fetch error:', error);
    // Return empty array if fetch fails
    return [];
  }
};

// Get single verse
export const getVerseAsync = async (
  surahId: number, 
  verseNumber: number, 
  language: string = 'en'
): Promise<QuranVerse | null> => {
  const verses = await getVersesByChapterAsync(surahId, language);
  return verses.find(v => v.verse === verseNumber) || null;
};

// Search Quran (searches in cached data)
export const searchQuran = async (
  query: string, 
  language: string = 'en'
): Promise<{ chapters: QuranChapter[], verses: QuranVerse[] }> => {
  const lowercaseQuery = query.toLowerCase();
  
  const matchingChapters = quranChapters.filter(chapter =>
    chapter.name.toLowerCase().includes(lowercaseQuery) ||
    chapter.nameArabic.includes(query) ||
    chapter.nameTransliterated.toLowerCase().includes(lowercaseQuery) ||
    chapter.meaning.toLowerCase().includes(lowercaseQuery)
  );

  // Search in cached verses
  const matchingVerses: QuranVerse[] = [];
  const keys = await AsyncStorage.getAllKeys();
  const verseKeys = keys.filter(k => k.startsWith(VERSES_CACHE_PREFIX));
  
  for (const key of verseKeys) {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const verses: QuranVerse[] = JSON.parse(cached);
        const matches = verses.filter(verse =>
          verse.translation.toLowerCase().includes(lowercaseQuery) ||
          verse.transliteration?.toLowerCase().includes(lowercaseQuery) ||
          verse.arabic.includes(query)
        );
        matchingVerses.push(...matches);
      }
    } catch (e) {
      console.log('Search cache error:', e);
    }
  }

  return { chapters: matchingChapters, verses: matchingVerses.slice(0, 50) }; // Limit results
};

// Bookmark management
export const getBookmarks = async (): Promise<QuranBookmark[]> => {
  try {
    const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addBookmark = async (surah: number, verse: number, note?: string): Promise<QuranBookmark> => {
  const bookmark: QuranBookmark = {
    surah,
    verse,
    timestamp: new Date().toISOString(),
    note
  };
  
  try {
    const bookmarks = await getBookmarks();
    const exists = bookmarks.find(b => b.surah === surah && b.verse === verse);
    if (!exists) {
      bookmarks.push(bookmark);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  } catch (e) {
    console.log('Error saving bookmark:', e);
  }
  
  return bookmark;
};

export const removeBookmark = async (surah: number, verse: number): Promise<void> => {
  try {
    const bookmarks = await getBookmarks();
    const filtered = bookmarks.filter(b => !(b.surah === surah && b.verse === verse));
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.log('Error removing bookmark:', e);
  }
};

export const isBookmarked = async (surah: number, verse: number): Promise<boolean> => {
  const bookmarks = await getBookmarks();
  return bookmarks.some(b => b.surah === surah && b.verse === verse);
};

// Last read position
export const getLastRead = async (): Promise<ReadingProgress | null> => {
  try {
    const stored = await AsyncStorage.getItem(LAST_READ_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const saveLastRead = async (chapterId: number, verseNumber: number): Promise<void> => {
  const chapter = getChapterById(chapterId);
  if (!chapter) return;
  
  const progress: ReadingProgress = {
    chapterId,
    verseNumber,
    timestamp: new Date().toISOString(),
    percentage: Math.round((verseNumber / chapter.verses) * 100)
  };
  
  try {
    await AsyncStorage.setItem(LAST_READ_KEY, JSON.stringify(progress));
  } catch (e) {
    console.log('Error saving last read:', e);
  }
};

// Reading settings
export const getReadingSettings = async (): Promise<ReadingSettings> => {
  try {
    const stored = await AsyncStorage.getItem(READING_SETTINGS_KEY);
    return stored ? { ...defaultReadingSettings, ...JSON.parse(stored) } : defaultReadingSettings;
  } catch {
    return defaultReadingSettings;
  }
};

export const saveReadingSettings = async (settings: Partial<ReadingSettings>): Promise<void> => {
  try {
    const current = await getReadingSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(READING_SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.log('Error saving settings:', e);
  }
};

// Clear all cached verses
export const clearVersesCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const verseKeys = keys.filter(k => k.startsWith(VERSES_CACHE_PREFIX));
    await AsyncStorage.multiRemove(verseKeys);
  } catch (e) {
    console.log('Error clearing cache:', e);
  }
};

// Get audio URL for a verse
export const getVerseAudioUrl = (surahId: number, verseNumber: number, reciter: string = 'ar.alafasy'): string => {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${surahId}${verseNumber.toString().padStart(3, '0')}.mp3`;
};

// Export types for use in other files
export type { QuranChapter, QuranVerse };
