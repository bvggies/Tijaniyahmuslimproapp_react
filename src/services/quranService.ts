import { quranChapters, getVersesForChapter, QuranChapter, QuranVerse } from '../data/completeQuran';

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