/**
 * Quran.com API v4 Client
 * Primary data source for Quran content
 * 
 * Base URL: https://api.quran.com/api/v4
 * Fallback: https://api.alquran.cloud/v1
 */

import {
  validateChaptersResponse,
  validateVersesResponse,
  validateTranslationsResponse,
  validateChapterInfoResponse,
} from './quranSchemas';
import type {
  Chapter,
  ChapterInfo,
  VerseWithTranslation,
  Translation,
  Pagination,
  QuranError,
} from './quranTypes';

// ============================================
// CONFIGURATION
// ============================================

const QURAN_API_BASE = 'https://api.quran.com/api/v4';
const FALLBACK_API_BASE = 'https://api.alquran.cloud/v1';

const DEFAULT_PER_PAGE = 20;
const REQUEST_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Popular translation IDs
export const TRANSLATION_IDS = {
  SAHIH_INTERNATIONAL: 131, // English
  PICKTHALL: 57, // English
  YUSUF_ALI: 22, // English
  FRENCH_HAMIDULLAH: 136, // French
  INDONESIAN: 33, // Indonesian
  URDU_AHMED_ALI: 54, // Urdu
  TURKISH: 77, // Turkish
} as const;

// ============================================
// ERROR HANDLING
// ============================================

export class QuranApiError extends Error {
  code: string;
  retryable: boolean;
  statusCode?: number;

  constructor(message: string, code: string, retryable: boolean, statusCode?: number) {
    super(message);
    this.name = 'QuranApiError';
    this.code = code;
    this.retryable = retryable;
    this.statusCode = statusCode;
  }
}

function createError(message: string, code: string, retryable: boolean, statusCode?: number): QuranError {
  return { message, code, retryable };
}

// ============================================
// FETCH HELPERS
// ============================================

async function fetchWithTimeout(url: string, timeout: number = REQUEST_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on validation errors or 4xx client errors
      if (error instanceof QuranApiError && !error.retryable) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError || new Error('Request failed after retries');
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch all 114 Quran chapters (surahs)
 */
export async function getChapters(language: string = 'en'): Promise<Chapter[]> {
  return fetchWithRetry(async () => {
    const url = `${QURAN_API_BASE}/chapters?language=${language}`;
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new QuranApiError(
        `Failed to fetch chapters: ${response.statusText}`,
        'CHAPTERS_FETCH_ERROR',
        response.status >= 500,
        response.status
      );
    }
    
    const data = await response.json();
    const validated = validateChaptersResponse(data);
    
    if (!validated.success) {
      console.error('Chapters validation error:', validated.error);
      throw new QuranApiError(
        'Invalid chapters response format',
        'VALIDATION_ERROR',
        false
      );
    }
    
    return validated.data.chapters;
  });
}

/**
 * Fetch chapter info (description, history, etc.)
 */
export async function getChapterInfo(
  chapterId: number,
  language: string = 'en'
): Promise<ChapterInfo> {
  return fetchWithRetry(async () => {
    const url = `${QURAN_API_BASE}/chapters/${chapterId}/info?language=${language}`;
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new QuranApiError(
        `Failed to fetch chapter info: ${response.statusText}`,
        'CHAPTER_INFO_FETCH_ERROR',
        response.status >= 500,
        response.status
      );
    }
    
    const data = await response.json();
    const validated = validateChapterInfoResponse(data);
    
    if (!validated.success) {
      console.error('Chapter info validation error:', validated.error);
      throw new QuranApiError(
        'Invalid chapter info response format',
        'VALIDATION_ERROR',
        false
      );
    }
    
    return validated.data.chapter_info;
  });
}

/**
 * Fetch verses by chapter with pagination
 * Includes Arabic text (text_uthmani) and optional translations
 */
export async function getVersesByChapter(
  chapterId: number,
  options: {
    page?: number;
    perPage?: number;
    translationIds?: number[];
    language?: string;
  } = {}
): Promise<{ verses: VerseWithTranslation[]; pagination: Pagination }> {
  const {
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    translationIds = [TRANSLATION_IDS.SAHIH_INTERNATIONAL],
    language = 'en',
  } = options;
  
  return fetchWithRetry(async () => {
    // Build URL with query params
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      language,
      fields: 'text_uthmani,verse_key,verse_number,juz_number,hizb_number,page_number',
    });
    
    // Add translation IDs
    if (translationIds.length > 0) {
      params.append('translations', translationIds.join(','));
    }
    
    const url = `${QURAN_API_BASE}/verses/by_chapter/${chapterId}?${params.toString()}`;
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new QuranApiError(
        `Failed to fetch verses: ${response.statusText}`,
        'VERSES_FETCH_ERROR',
        response.status >= 500,
        response.status
      );
    }
    
    const data = await response.json();
    const validated = validateVersesResponse(data);
    
    if (!validated.success) {
      console.error('Verses validation error:', validated.error);
      throw new QuranApiError(
        'Invalid verses response format',
        'VALIDATION_ERROR',
        false
      );
    }
    
    return {
      verses: validated.data.verses,
      pagination: validated.data.pagination,
    };
  });
}

/**
 * Fetch all available translations
 */
export async function getTranslations(language: string = 'en'): Promise<Translation[]> {
  return fetchWithRetry(async () => {
    const url = `${QURAN_API_BASE}/resources/translations?language=${language}`;
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new QuranApiError(
        `Failed to fetch translations: ${response.statusText}`,
        'TRANSLATIONS_FETCH_ERROR',
        response.status >= 500,
        response.status
      );
    }
    
    const data = await response.json();
    const validated = validateTranslationsResponse(data);
    
    if (!validated.success) {
      console.error('Translations validation error:', validated.error);
      throw new QuranApiError(
        'Invalid translations response format',
        'VALIDATION_ERROR',
        false
      );
    }
    
    return validated.data.translations;
  });
}

/**
 * Fetch a specific verse by key (e.g., "2:255" for Ayatul Kursi)
 */
export async function getVerseByKey(
  verseKey: string,
  translationIds: number[] = [TRANSLATION_IDS.SAHIH_INTERNATIONAL]
): Promise<VerseWithTranslation | null> {
  return fetchWithRetry(async () => {
    const params = new URLSearchParams({
      fields: 'text_uthmani,verse_key,verse_number,juz_number,hizb_number,page_number',
    });
    
    if (translationIds.length > 0) {
      params.append('translations', translationIds.join(','));
    }
    
    const url = `${QURAN_API_BASE}/verses/by_key/${verseKey}?${params.toString()}`;
    
    const response = await fetchWithTimeout(url);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new QuranApiError(
        `Failed to fetch verse: ${response.statusText}`,
        'VERSE_FETCH_ERROR',
        response.status >= 500,
        response.status
      );
    }
    
    const data = await response.json();
    
    // Single verse response has a different structure
    if (data.verse) {
      return data.verse as VerseWithTranslation;
    }
    
    return null;
  });
}

/**
 * Fetch verses by Juz number
 */
export async function getVersesByJuz(
  juzNumber: number,
  options: {
    page?: number;
    perPage?: number;
    translationIds?: number[];
  } = {}
): Promise<{ verses: VerseWithTranslation[]; pagination: Pagination }> {
  const {
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    translationIds = [TRANSLATION_IDS.SAHIH_INTERNATIONAL],
  } = options;
  
  return fetchWithRetry(async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      fields: 'text_uthmani,verse_key,verse_number,juz_number,hizb_number,page_number',
    });
    
    if (translationIds.length > 0) {
      params.append('translations', translationIds.join(','));
    }
    
    const url = `${QURAN_API_BASE}/verses/by_juz/${juzNumber}?${params.toString()}`;
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new QuranApiError(
        `Failed to fetch verses by juz: ${response.statusText}`,
        'VERSES_BY_JUZ_FETCH_ERROR',
        response.status >= 500,
        response.status
      );
    }
    
    const data = await response.json();
    const validated = validateVersesResponse(data);
    
    if (!validated.success) {
      throw new QuranApiError(
        'Invalid verses response format',
        'VALIDATION_ERROR',
        false
      );
    }
    
    return {
      verses: validated.data.verses,
      pagination: validated.data.pagination,
    };
  });
}

/**
 * Fetch verses by page number (Mushaf page)
 */
export async function getVersesByPage(
  pageNumber: number,
  options: {
    translationIds?: number[];
  } = {}
): Promise<{ verses: VerseWithTranslation[]; pagination: Pagination }> {
  const { translationIds = [TRANSLATION_IDS.SAHIH_INTERNATIONAL] } = options;
  
  return fetchWithRetry(async () => {
    const params = new URLSearchParams({
      fields: 'text_uthmani,verse_key,verse_number,juz_number,hizb_number,page_number',
    });
    
    if (translationIds.length > 0) {
      params.append('translations', translationIds.join(','));
    }
    
    const url = `${QURAN_API_BASE}/verses/by_page/${pageNumber}?${params.toString()}`;
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new QuranApiError(
        `Failed to fetch verses by page: ${response.statusText}`,
        'VERSES_BY_PAGE_FETCH_ERROR',
        response.status >= 500,
        response.status
      );
    }
    
    const data = await response.json();
    const validated = validateVersesResponse(data);
    
    if (!validated.success) {
      throw new QuranApiError(
        'Invalid verses response format',
        'VALIDATION_ERROR',
        false
      );
    }
    
    return {
      verses: validated.data.verses,
      pagination: validated.data.pagination,
    };
  });
}

/**
 * Search the Quran
 */
export async function searchQuran(
  query: string,
  options: {
    page?: number;
    perPage?: number;
    language?: string;
  } = {}
): Promise<{ verses: VerseWithTranslation[]; pagination: Pagination }> {
  const { page = 1, perPage = 20, language = 'en' } = options;
  
  return fetchWithRetry(async () => {
    const params = new URLSearchParams({
      q: query,
      size: perPage.toString(),
      page: page.toString(),
      language,
    });
    
    const url = `${QURAN_API_BASE}/search?${params.toString()}`;
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new QuranApiError(
        `Search failed: ${response.statusText}`,
        'SEARCH_ERROR',
        response.status >= 500,
        response.status
      );
    }
    
    const data = await response.json();
    
    // Search has a different response format
    return {
      verses: data.search?.results || [],
      pagination: {
        per_page: perPage,
        current_page: page,
        next_page: data.search?.total_results > page * perPage ? page + 1 : null,
        total_pages: Math.ceil((data.search?.total_results || 0) / perPage),
        total_records: data.search?.total_results || 0,
      },
    };
  });
}

// ============================================
// FALLBACK API (alquran.cloud)
// ============================================

/**
 * Fallback: Fetch surah from alquran.cloud
 * Used when Quran.com API is unavailable
 */
export async function getFallbackSurah(
  surahNumber: number,
  edition: string = 'quran-uthmani'
): Promise<VerseWithTranslation[]> {
  return fetchWithRetry(async () => {
    const url = `${FALLBACK_API_BASE}/surah/${surahNumber}/${edition}`;
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new QuranApiError(
        `Fallback API failed: ${response.statusText}`,
        'FALLBACK_API_ERROR',
        response.status >= 500,
        response.status
      );
    }
    
    const data = await response.json();
    
    if (data.code !== 200 || !data.data?.ayahs) {
      throw new QuranApiError(
        'Invalid fallback API response',
        'FALLBACK_VALIDATION_ERROR',
        false
      );
    }
    
    // Transform to our format
    return data.data.ayahs.map((ayah: any) => ({
      id: ayah.number,
      verse_key: `${surahNumber}:${ayah.numberInSurah}`,
      verse_number: ayah.numberInSurah,
      text_uthmani: ayah.text,
      juz_number: ayah.juz,
      page_number: ayah.page,
      hizb_number: ayah.hizbQuarter,
      rub_el_hizb_number: 0,
      ruku_number: ayah.ruku,
      manzil_number: ayah.manzil,
      sajdah_number: ayah.sajda ? 1 : null,
    }));
  });
}

// ============================================
// HEALTH CHECK
// ============================================

/**
 * Check if the Quran.com API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${QURAN_API_BASE}/chapters`, 5000);
    return response.ok;
  } catch {
    return false;
  }
}

