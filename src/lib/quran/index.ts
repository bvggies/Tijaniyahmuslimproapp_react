/**
 * Quran Library - Main Export
 * Tijaniyah Muslim Pro
 * Prefer quranRepo for offline-first; quranApi/quranCache for direct use.
 */

// Types
export * from './quranTypes';

// Schemas
export * from './quranSchemas';

// Repository (Offline-First) - primary API
export * from './quranRepo';

// API Client - for advanced/custom usage
export {
  getChapters as getChaptersApi,
  getChapterInfo,
  getVersesByChapter as getVersesByChapterApi,
  getTranslations as getTranslationsApi,
  getVerseByKey,
  getVersesByJuz,
  getVersesByPage,
  searchQuran as searchQuranApi,
  getFallbackSurah,
  checkApiHealth,
  TRANSLATION_IDS,
} from './quranApi';

// Cache - for bookmarks, last read, cache stats
export {
  addBookmark as addBookmarkCache,
  removeBookmark as removeBookmarkCache,
  getBookmarks as getBookmarksCache,
  isBookmarked as isBookmarkedCache,
  getLastRead as getLastReadCache,
  saveLastRead as saveLastReadCache,
  getCacheStats as getCacheStatsCache,
  clearChapterCache as clearChapterCacheCache,
} from './quranCache';

