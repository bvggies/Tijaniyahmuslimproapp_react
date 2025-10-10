import { quranChapters, getVersesForChapter, QuranChapter, QuranVerse } from '../data/completeQuran';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuranBookmark {
  surah: number;
  verse: number;
  timestamp: string;
  note?: string;
}

// Service functions
export const getQuranChapters = (): QuranChapter[] => {
  return quranChapters;
};

export const getChapterById = (id: number): QuranChapter | undefined => {
  return quranChapters.find(chapter => chapter.id === id);
};

export const getVersesByChapter = (chapterId: number): QuranVerse[] => {
  // Return verses for the specified chapter
  // In a real app, this would fetch from a database or API
  return getVersesForChapter(chapterId);
};

// Async version that fetches full chapter from a public API when local data is incomplete
const VERSES_CACHE_PREFIX = 'quran_verses_cache_';

export const getVersesByChapterAsync = async (chapterId: number): Promise<QuranVerse[]> => {
  // If we already have full verses locally, use them
  const local = getVersesForChapter(chapterId);
  const chapterMeta = quranChapters.find(c => c.id === chapterId);
  if (chapterMeta && local && local.length >= chapterMeta.verses) {
    return local;
  }

  // Try cache
  try {
    const cached = await AsyncStorage.getItem(VERSES_CACHE_PREFIX + chapterId);
    if (cached) {
      const parsed: QuranVerse[] = JSON.parse(cached);
      if (parsed && parsed.length > 0) return parsed;
    }
  } catch {}

  // Fetch from public API (alquran.cloud) as a fallback
  try {
    // English Saheeh International translation with Arabic text
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${chapterId}/editions/quran-simple,en.sahih`);
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    // API returns data as an array of editions; we need to merge arabic and english by verse number
    const editions = json.data || [];
    const arabic = editions.find((e: any) => e.edition && (e.edition.identifier === 'quran-simple' || e.edition.language === 'ar'));
    const english = editions.find((e: any) => e.edition && (e.edition.identifier === 'en.sahih' || e.edition.language === 'en'));
    const verses: QuranVerse[] = [];
    const max = Math.max(
      Array.isArray(arabic?.ayahs) ? arabic.ayahs.length : 0,
      Array.isArray(english?.ayahs) ? english.ayahs.length : 0
    );
    for (let i = 0; i < max; i++) {
      const a = arabic?.ayahs?.[i];
      const e = english?.ayahs?.[i];
      verses.push({
        surah: chapterId,
        verse: (a?.numberInSurah || e?.numberInSurah || i + 1),
        arabic: a?.text || '',
        translation: e?.text || '',
        transliteration: ''
      });
    }
    // Cache and return
    try { await AsyncStorage.setItem(VERSES_CACHE_PREFIX + chapterId, JSON.stringify(verses)); } catch {}
    return verses;
  } catch {
    // Last resort: return whatever local sample we have
    return local;
  }
};

export const searchQuran = (query: string): { chapters: QuranChapter[], verses: QuranVerse[] } => {
  const lowercaseQuery = query.toLowerCase();
  
  const matchingChapters = quranChapters.filter(chapter =>
    chapter.name.toLowerCase().includes(lowercaseQuery) ||
    chapter.nameArabic.includes(query) ||
    chapter.nameTransliterated.toLowerCase().includes(lowercaseQuery) ||
    chapter.meaning.toLowerCase().includes(lowercaseQuery)
  );

  // For search, we'll search through all available verses
  const allVerses: QuranVerse[] = [];
  for (let i = 1; i <= 114; i++) {
    allVerses.push(...getVersesForChapter(i));
  }

  const matchingVerses = allVerses.filter(verse =>
    verse.translation.toLowerCase().includes(lowercaseQuery) ||
    verse.transliteration.toLowerCase().includes(lowercaseQuery) ||
    verse.arabic.includes(query)
  );

  return { chapters: matchingChapters, verses: matchingVerses };
};

export const getBookmarks = (): QuranBookmark[] => {
  // In a real app, this would fetch from AsyncStorage or a database
  return [];
};

export const addBookmark = (surah: number, verse: number, note?: string): QuranBookmark => {
  const bookmark: QuranBookmark = {
    surah,
    verse,
    timestamp: new Date().toISOString(),
    note
  };
  
  // In a real app, this would save to AsyncStorage or a database
  return bookmark;
};

export const removeBookmark = (surah: number, verse: number): void => {
  // In a real app, this would remove from AsyncStorage or a database
  console.log(`Removing bookmark for Surah ${surah}, Verse ${verse}`);
};

// Export types for use in other files
export type { QuranChapter, QuranVerse };