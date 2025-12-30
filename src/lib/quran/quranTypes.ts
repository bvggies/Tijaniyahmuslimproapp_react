/**
 * Quran Types for Tijaniyah Muslim Pro
 * Based on Quran.com API v4
 */

// ============================================
// CHAPTER (SURAH) TYPES
// ============================================

export interface Chapter {
  id: number;
  revelation_place: 'makkah' | 'madinah';
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface ChapterInfo {
  id: number;
  chapter_id: number;
  language_name: string;
  short_text: string;
  source: string;
  text: string;
}

// ============================================
// VERSE (AYAH) TYPES
// ============================================

export interface Verse {
  id: number;
  verse_key: string; // e.g., "1:1", "2:255"
  verse_number: number;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  page_number: number;
  juz_number: number;
  text_uthmani: string;
  text_imlaei?: string;
  text_indopak?: string;
  words?: Word[];
}

export interface Word {
  id: number;
  position: number;
  audio_url?: string;
  char_type_name: string;
  text_uthmani: string;
  text_indopak?: string;
  text_imlaei?: string;
  page_number: number;
  line_number: number;
  translation?: {
    text: string;
    language_name: string;
  };
  transliteration?: {
    text: string;
    language_name: string;
  };
}

// ============================================
// TRANSLATION TYPES
// ============================================

export interface Translation {
  id: number;
  name: string;
  author_name: string;
  slug?: string;
  language_name: string;
  translated_name?: {
    name: string;
    language_name: string;
  };
}

export interface VerseTranslation {
  resource_id: number;
  text: string;
}

export interface VerseWithTranslation extends Verse {
  translations?: VerseTranslation[];
}

// ============================================
// AUDIO/RECITATION TYPES
// ============================================

export interface Recitation {
  id: number;
  reciter_name: string;
  style?: string;
  translated_name?: {
    name: string;
    language_name: string;
  };
}

export interface AudioFile {
  url: string;
  duration: number;
  format: string;
  segments?: number[][];
}

// ============================================
// PAGINATION TYPES
// ============================================

export interface Pagination {
  per_page: number;
  current_page: number;
  next_page: number | null;
  total_pages: number;
  total_records: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ChaptersResponse {
  chapters: Chapter[];
}

export interface VersesResponse {
  verses: VerseWithTranslation[];
  pagination: Pagination;
}

export interface TranslationsResponse {
  translations: Translation[];
}

export interface ChapterInfoResponse {
  chapter_info: ChapterInfo;
}

// ============================================
// USER DATA TYPES (for backend sync)
// ============================================

export interface Bookmark {
  id: string;
  userId: string;
  verseKey: string;
  chapterId: number;
  verseNumber: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LastRead {
  id: string;
  userId: string;
  chapterId: number;
  verseNumber: number;
  verseKey: string;
  scrollPosition?: number;
  updatedAt: string;
}

export interface ReadingPreferences {
  translationId: number;
  arabicFontSize: number;
  translationFontSize: number;
  showTransliteration: boolean;
  theme: 'light' | 'dark' | 'sepia';
}

// ============================================
// LOCAL CACHE TYPES
// ============================================

export interface CachedChapter {
  id: number;
  name_arabic: string;
  name_simple: string;
  name_translated: string;
  revelation_place: string;
  verses_count: number;
  revelation_order: number;
  bismillah_pre: boolean;
  updated_at: number;
}

export interface CachedVerse {
  id: number;
  verse_key: string;
  chapter_id: number;
  verse_number: number;
  text_uthmani: string;
  juz_number: number;
  page_number: number;
  updated_at: number;
}

export interface CachedTranslation {
  id: number;
  verse_key: string;
  translation_id: number;
  text: string;
  updated_at: number;
}

// ============================================
// UI STATE TYPES
// ============================================

export interface QuranState {
  selectedTranslationId: number;
  arabicFontSize: number;
  translationFontSize: number;
  showTransliteration: boolean;
  lastReadChapter: number | null;
  lastReadVerse: number | null;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface QuranError {
  message: string;
  code?: string;
  retryable: boolean;
}

