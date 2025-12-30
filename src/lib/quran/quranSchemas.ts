/**
 * Zod Schemas for Quran.com API v4
 * Validates API responses to ensure data integrity
 */

import { z } from 'zod';

// ============================================
// CHAPTER (SURAH) SCHEMAS
// ============================================

export const TranslatedNameSchema = z.object({
  language_name: z.string(),
  name: z.string(),
});

export const ChapterSchema = z.object({
  id: z.number(),
  revelation_place: z.enum(['makkah', 'madinah']),
  revelation_order: z.number(),
  bismillah_pre: z.boolean(),
  name_simple: z.string(),
  name_complex: z.string(),
  name_arabic: z.string(),
  verses_count: z.number(),
  pages: z.array(z.number()),
  translated_name: TranslatedNameSchema,
});

export const ChaptersResponseSchema = z.object({
  chapters: z.array(ChapterSchema),
});

export const ChapterInfoSchema = z.object({
  id: z.number(),
  chapter_id: z.number(),
  language_name: z.string(),
  short_text: z.string(),
  source: z.string(),
  text: z.string(),
});

export const ChapterInfoResponseSchema = z.object({
  chapter_info: ChapterInfoSchema,
});

// ============================================
// VERSE (AYAH) SCHEMAS
// ============================================

export const WordTranslationSchema = z.object({
  text: z.string(),
  language_name: z.string(),
}).optional();

export const WordSchema = z.object({
  id: z.number(),
  position: z.number(),
  audio_url: z.string().optional(),
  char_type_name: z.string(),
  text_uthmani: z.string(),
  text_indopak: z.string().optional(),
  text_imlaei: z.string().optional(),
  page_number: z.number(),
  line_number: z.number(),
  translation: WordTranslationSchema,
  transliteration: WordTranslationSchema,
});

export const VerseTranslationSchema = z.object({
  resource_id: z.number(),
  text: z.string(),
});

export const VerseSchema = z.object({
  id: z.number(),
  verse_key: z.string(),
  verse_number: z.number(),
  hizb_number: z.number(),
  rub_el_hizb_number: z.number(),
  ruku_number: z.number(),
  manzil_number: z.number(),
  sajdah_number: z.number().nullable(),
  page_number: z.number(),
  juz_number: z.number(),
  text_uthmani: z.string().optional(),
  text_imlaei: z.string().optional(),
  text_indopak: z.string().optional(),
  words: z.array(WordSchema).optional(),
  translations: z.array(VerseTranslationSchema).optional(),
});

export const PaginationSchema = z.object({
  per_page: z.number(),
  current_page: z.number(),
  next_page: z.number().nullable(),
  total_pages: z.number(),
  total_records: z.number(),
});

export const VersesResponseSchema = z.object({
  verses: z.array(VerseSchema),
  pagination: PaginationSchema,
});

// ============================================
// TRANSLATION SCHEMAS
// ============================================

export const TranslationSchema = z.object({
  id: z.number(),
  name: z.string(),
  author_name: z.string(),
  slug: z.string().nullable().optional(),
  language_name: z.string(),
  translated_name: TranslatedNameSchema.optional(),
});

export const TranslationsResponseSchema = z.object({
  translations: z.array(TranslationSchema),
});

// ============================================
// RECITATION SCHEMAS
// ============================================

export const RecitationSchema = z.object({
  id: z.number(),
  reciter_name: z.string(),
  style: z.string().optional(),
  translated_name: TranslatedNameSchema.optional(),
});

export const RecitationsResponseSchema = z.object({
  recitations: z.array(RecitationSchema),
});

// ============================================
// AUDIO SCHEMAS
// ============================================

export const AudioFileSchema = z.object({
  url: z.string(),
  duration: z.number(),
  format: z.string(),
  segments: z.array(z.array(z.number())).optional(),
});

// ============================================
// USER DATA SCHEMAS (Backend)
// ============================================

export const BookmarkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  verseKey: z.string(),
  chapterId: z.number(),
  verseNumber: z.number(),
  note: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const BookmarksResponseSchema = z.object({
  bookmarks: z.array(BookmarkSchema),
});

export const LastReadSchema = z.object({
  id: z.string(),
  userId: z.string(),
  chapterId: z.number(),
  verseNumber: z.number(),
  verseKey: z.string(),
  scrollPosition: z.number().optional(),
  updatedAt: z.string(),
});

export const LastReadResponseSchema = z.object({
  lastRead: LastReadSchema.nullable(),
});

export const ReadingPreferencesSchema = z.object({
  translationId: z.number(),
  arabicFontSize: z.number(),
  translationFontSize: z.number(),
  showTransliteration: z.boolean(),
  theme: z.enum(['light', 'dark', 'sepia']),
});

// ============================================
// VALIDATION HELPERS
// ============================================

export function validateChaptersResponse(data: unknown) {
  return ChaptersResponseSchema.safeParse(data);
}

export function validateVersesResponse(data: unknown) {
  return VersesResponseSchema.safeParse(data);
}

export function validateTranslationsResponse(data: unknown) {
  return TranslationsResponseSchema.safeParse(data);
}

export function validateChapterInfoResponse(data: unknown) {
  return ChapterInfoResponseSchema.safeParse(data);
}

// Type exports from schemas
export type ChapterSchemaType = z.infer<typeof ChapterSchema>;
export type VerseSchemaType = z.infer<typeof VerseSchema>;
export type TranslationSchemaType = z.infer<typeof TranslationSchema>;
export type PaginationSchemaType = z.infer<typeof PaginationSchema>;
export type BookmarkSchemaType = z.infer<typeof BookmarkSchema>;
export type LastReadSchemaType = z.infer<typeof LastReadSchema>;

