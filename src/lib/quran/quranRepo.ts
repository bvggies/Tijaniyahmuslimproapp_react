/**
 * Quran Repository - Offline-First Data Access
 * 
 * Strategy:
 * 1. Try network first for fresh data
 * 2. Cache the results
 * 3. If network fails, return cached data
 * 4. Track sync state for background updates
 */

import * as Network from 'expo-network';
import * as quranApi from './quranApi';
import * as quranCache from './quranCache';
import type {
  Chapter,
  VerseWithTranslation,
  Translation,
  Pagination,
  CachedChapter,
  CachedVerse,
} from './quranTypes';

// ============================================
// NETWORK HELPERS
// ============================================

/**
 * Check if device has network connectivity
 */
export async function isOnline(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return state.isConnected && state.isInternetReachable !== false;
  } catch {
    return false;
  }
}

// ============================================
// CHAPTERS REPOSITORY
// ============================================

export interface ChaptersResult {
  chapters: (Chapter | CachedChapter)[];
  fromCache: boolean;
  error?: string;
}

/**
 * Get all chapters - offline first
 */
export async function getChapters(
  options: { forceRefresh?: boolean; language?: string } = {}
): Promise<ChaptersResult> {
  const { forceRefresh = false, language = 'en' } = options;
  
  // Check if we have cached data
  const hasCached = await quranCache.hasChaptersCache();
  
  // If not forcing refresh and we have cache, check if online
  if (!forceRefresh && hasCached) {
    const online = await isOnline();
    
    // If offline, use cache immediately
    if (!online) {
      const cached = await quranCache.getCachedChapters();
      return { chapters: cached, fromCache: true };
    }
  }
  
  // Try network
  try {
    const chapters = await quranApi.getChapters(language);
    
    // Cache the results
    await quranCache.upsertChapters(chapters);
    
    return { chapters, fromCache: false };
  } catch (error) {
    // Network failed - try cache
    if (hasCached) {
      const cached = await quranCache.getCachedChapters();
      return {
        chapters: cached,
        fromCache: true,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
    
    // No cache available
    throw error;
  }
}

/**
 * Get a single chapter
 */
export async function getChapter(chapterId: number): Promise<Chapter | CachedChapter | null> {
  // Try cache first for single item (faster)
  const cached = await quranCache.getCachedChapter(chapterId);
  if (cached) return cached;
  
  // If not cached, fetch all chapters
  const result = await getChapters();
  return result.chapters.find(c => c.id === chapterId) || null;
}

// ============================================
// VERSES REPOSITORY
// ============================================

export interface VersesResult {
  verses: VerseWithTranslation[];
  pagination: Pagination | null;
  fromCache: boolean;
  isComplete: boolean;
  error?: string;
}

/**
 * Get verses by chapter with pagination - offline first
 */
export async function getVersesByChapter(
  chapterId: number,
  options: {
    page?: number;
    perPage?: number;
    translationIds?: number[];
    forceRefresh?: boolean;
    language?: string;
  } = {}
): Promise<VersesResult> {
  const {
    page = 1,
    perPage = 20,
    translationIds = [quranApi.TRANSLATION_IDS.SAHIH_INTERNATIONAL],
    forceRefresh = false,
    language = 'en',
  } = options;
  
  const offset = (page - 1) * perPage;
  
  // Get chapter info for verse count
  const chapter = await getChapter(chapterId);
  const expectedVerseCount = chapter?.verses_count || 0;
  
  // Check if we have complete cached data for this chapter
  const cachedCount = await quranCache.getCachedVerseCount(chapterId);
  const hasCompleteCacheForChapter = cachedCount >= expectedVerseCount;
  
  // If not forcing refresh and we have complete cache
  if (!forceRefresh && hasCompleteCacheForChapter) {
    const online = await isOnline();
    
    // If offline or have complete cache, use cache
    if (!online || hasCompleteCacheForChapter) {
      const cachedVerses = await quranCache.getCachedVersesByChapter(chapterId, {
        offset,
        limit: perPage,
      });
      
      // Build verses with translations from cache
      const versesWithTranslations: VerseWithTranslation[] = await Promise.all(
        cachedVerses.map(async (v) => {
          const translations = await Promise.all(
            translationIds.map(async (tId) => {
              const t = await quranCache.getCachedVerseTranslation(v.verse_key, tId);
              return t ? { resource_id: tId, text: t.text } : null;
            })
          );
          
          return {
            id: v.id,
            verse_key: v.verse_key,
            verse_number: v.verse_number,
            text_uthmani: v.text_uthmani,
            juz_number: v.juz_number,
            page_number: v.page_number,
            hizb_number: 0,
            rub_el_hizb_number: 0,
            ruku_number: 0,
            manzil_number: 0,
            sajdah_number: null,
            translations: translations.filter(Boolean) as { resource_id: number; text: string }[],
          };
        })
      );
      
      return {
        verses: versesWithTranslations,
        pagination: {
          per_page: perPage,
          current_page: page,
          next_page: offset + perPage < expectedVerseCount ? page + 1 : null,
          total_pages: Math.ceil(expectedVerseCount / perPage),
          total_records: expectedVerseCount,
        },
        fromCache: true,
        isComplete: versesWithTranslations.length === Math.min(perPage, expectedVerseCount - offset),
      };
    }
  }
  
  // Try network
  try {
    const result = await quranApi.getVersesByChapter(chapterId, {
      page,
      perPage,
      translationIds,
      language,
    });
    
    // Cache the verses
    if (result.verses.length > 0) {
      await quranCache.upsertVerses(result.verses);
    }
    
    return {
      verses: result.verses,
      pagination: result.pagination,
      fromCache: false,
      isComplete: result.pagination.next_page === null,
    };
  } catch (error) {
    // Network failed - try cache
    const cachedVerses = await quranCache.getCachedVersesByChapter(chapterId, {
      offset,
      limit: perPage,
    });
    
    if (cachedVerses.length > 0) {
      const versesWithTranslations: VerseWithTranslation[] = await Promise.all(
        cachedVerses.map(async (v) => {
          const translations = await Promise.all(
            translationIds.map(async (tId) => {
              const t = await quranCache.getCachedVerseTranslation(v.verse_key, tId);
              return t ? { resource_id: tId, text: t.text } : null;
            })
          );
          
          return {
            id: v.id,
            verse_key: v.verse_key,
            verse_number: v.verse_number,
            text_uthmani: v.text_uthmani,
            juz_number: v.juz_number,
            page_number: v.page_number,
            hizb_number: 0,
            rub_el_hizb_number: 0,
            ruku_number: 0,
            manzil_number: 0,
            sajdah_number: null,
            translations: translations.filter(Boolean) as { resource_id: number; text: string }[],
          };
        })
      );
      
      return {
        verses: versesWithTranslations,
        pagination: null,
        fromCache: true,
        isComplete: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
    
    // No cache available
    throw error;
  }
}

/**
 * Prefetch all verses for a chapter (for offline reading)
 */
export async function prefetchChapter(
  chapterId: number,
  translationIds: number[] = [quranApi.TRANSLATION_IDS.SAHIH_INTERNATIONAL],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const chapter = await getChapter(chapterId);
  if (!chapter) throw new Error(`Chapter ${chapterId} not found`);
  
  const totalVerses = chapter.verses_count;
  const perPage = 50; // Larger pages for prefetch
  const totalPages = Math.ceil(totalVerses / perPage);
  
  for (let page = 1; page <= totalPages; page++) {
    const result = await quranApi.getVersesByChapter(chapterId, {
      page,
      perPage,
      translationIds,
    });
    
    await quranCache.upsertVerses(result.verses);
    
    if (onProgress) {
      const current = Math.min(page * perPage, totalVerses);
      onProgress(current, totalVerses);
    }
  }
}

// ============================================
// TRANSLATIONS REPOSITORY
// ============================================

export interface TranslationsResult {
  translations: Translation[];
  fromCache: boolean;
  error?: string;
}

/**
 * Get available translations - offline first
 */
export async function getTranslations(
  options: { forceRefresh?: boolean; language?: string } = {}
): Promise<TranslationsResult> {
  const { forceRefresh = false, language = 'en' } = options;
  
  // Check cached translations
  const cached = await quranCache.getCachedTranslationsMeta();
  const hasCached = cached.length > 0;
  
  if (!forceRefresh && hasCached) {
    const online = await isOnline();
    if (!online) {
      return { translations: cached, fromCache: true };
    }
  }
  
  // Try network
  try {
    const translations = await quranApi.getTranslations(language);
    
    // Cache
    await quranCache.upsertTranslationsMeta(translations);
    
    return { translations, fromCache: false };
  } catch (error) {
    if (hasCached) {
      return {
        translations: cached,
        fromCache: true,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
    
    throw error;
  }
}

// ============================================
// SEARCH REPOSITORY
// ============================================

export interface SearchResult {
  verses: VerseWithTranslation[];
  pagination: Pagination;
  fromCache: boolean;
}

/**
 * Search the Quran (requires network)
 */
export async function searchQuran(
  query: string,
  options: { page?: number; perPage?: number; language?: string } = {}
): Promise<SearchResult> {
  const online = await isOnline();
  
  if (!online) {
    throw new Error('Search requires internet connection');
  }
  
  const result = await quranApi.searchQuran(query, options);
  
  return {
    verses: result.verses,
    pagination: result.pagination,
    fromCache: false,
  };
}

// ============================================
// BOOKMARKS REPOSITORY
// ============================================

/**
 * Get all bookmarks
 */
export async function getBookmarks(): Promise<quranCache.LocalBookmark[]> {
  return quranCache.getBookmarks();
}

/**
 * Add a bookmark
 */
export async function addBookmark(
  verseKey: string,
  note?: string
): Promise<string> {
  const [chapterId, verseNumber] = verseKey.split(':').map(Number);
  return quranCache.addBookmark(verseKey, chapterId, verseNumber, note);
}

/**
 * Remove a bookmark
 */
export async function removeBookmark(id: string): Promise<void> {
  return quranCache.removeBookmark(id);
}

/**
 * Check if verse is bookmarked
 */
export async function isBookmarked(verseKey: string): Promise<boolean> {
  return quranCache.isBookmarked(verseKey);
}

// ============================================
// LAST READ REPOSITORY
// ============================================

/**
 * Get last read position
 */
export async function getLastRead(): Promise<quranCache.LocalLastRead | null> {
  return quranCache.getLastRead();
}

/**
 * Save last read position
 */
export async function saveLastRead(
  chapterId: number,
  verseNumber: number,
  scrollPosition?: number
): Promise<void> {
  return quranCache.saveLastRead(chapterId, verseNumber, scrollPosition);
}

// ============================================
// CACHE MANAGEMENT
// ============================================

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  return quranCache.getCacheStats();
}

/**
 * Clear all cache
 */
export async function clearCache(): Promise<void> {
  return quranCache.clearAllCache();
}

/**
 * Clear cache for a specific chapter
 */
export async function clearChapterCache(chapterId: number): Promise<void> {
  return quranCache.clearChapterCache(chapterId);
}

