/**
 * SQLite Cache Layer for Quran Data
 * Provides offline-first storage using expo-sqlite
 */

import * as SQLite from 'expo-sqlite';
import type {
  Chapter,
  VerseWithTranslation,
  Translation,
  CachedChapter,
  CachedVerse,
  CachedTranslation,
} from './quranTypes';

// ============================================
// DATABASE CONFIGURATION
// ============================================

const DB_NAME = 'quran_cache.db';
const DB_VERSION = 1;

let db: SQLite.SQLiteDatabase | null = null;

// ============================================
// DATABASE INITIALIZATION
// ============================================

/**
 * Get or create the database instance
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync(DB_NAME);
  await initializeDatabase(db);
  return db;
}

/**
 * Initialize database tables and run migrations
 */
async function initializeDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  // Create tables
  await database.execAsync(`
    -- Chapters table
    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY,
      name_arabic TEXT NOT NULL,
      name_simple TEXT NOT NULL,
      name_translated TEXT NOT NULL,
      revelation_place TEXT NOT NULL,
      verses_count INTEGER NOT NULL,
      revelation_order INTEGER NOT NULL,
      bismillah_pre INTEGER NOT NULL DEFAULT 1,
      updated_at INTEGER NOT NULL
    );
    
    -- Verses table
    CREATE TABLE IF NOT EXISTS verses (
      id INTEGER PRIMARY KEY,
      verse_key TEXT UNIQUE NOT NULL,
      chapter_id INTEGER NOT NULL,
      verse_number INTEGER NOT NULL,
      text_uthmani TEXT NOT NULL,
      juz_number INTEGER,
      page_number INTEGER,
      hizb_number INTEGER,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id)
    );
    
    -- Translations metadata table
    CREATE TABLE IF NOT EXISTS translations_meta (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      language_name TEXT NOT NULL,
      author_name TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    
    -- Verse translations table
    CREATE TABLE IF NOT EXISTS verse_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      verse_key TEXT NOT NULL,
      translation_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      UNIQUE(verse_key, translation_id),
      FOREIGN KEY (translation_id) REFERENCES translations_meta(id)
    );
    
    -- Cache state table (for versioning and sync timestamps)
    CREATE TABLE IF NOT EXISTS cache_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    
    -- Bookmarks table (local cache, synced with backend)
    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      verse_key TEXT NOT NULL,
      chapter_id INTEGER NOT NULL,
      verse_number INTEGER NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0
    );
    
    -- Last read position (local cache, synced with backend)
    CREATE TABLE IF NOT EXISTS last_read (
      id INTEGER PRIMARY KEY DEFAULT 1,
      chapter_id INTEGER NOT NULL,
      verse_number INTEGER NOT NULL,
      verse_key TEXT NOT NULL,
      scroll_position REAL,
      updated_at INTEGER NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0
    );
    
    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_verses_chapter ON verses(chapter_id);
    CREATE INDEX IF NOT EXISTS idx_verses_key ON verses(verse_key);
    CREATE INDEX IF NOT EXISTS idx_translations_verse ON verse_translations(verse_key);
    CREATE INDEX IF NOT EXISTS idx_translations_id ON verse_translations(translation_id);
  `);
  
  // Set initial cache state
  await setCacheState('db_version', DB_VERSION.toString());
}

// ============================================
// CACHE STATE HELPERS
// ============================================

export async function getCacheState(key: string): Promise<string | null> {
  const database = await getDatabase();
  const result = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM cache_state WHERE key = ?',
    [key]
  );
  return result?.value ?? null;
}

export async function setCacheState(key: string, value: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT OR REPLACE INTO cache_state (key, value, updated_at) VALUES (?, ?, ?)`,
    [key, value, Date.now()]
  );
}

// ============================================
// CHAPTERS CACHE
// ============================================

/**
 * Upsert chapters into cache
 */
export async function upsertChapters(chapters: Chapter[]): Promise<void> {
  const database = await getDatabase();
  const now = Date.now();
  
  await database.withTransactionAsync(async () => {
    for (const chapter of chapters) {
      await database.runAsync(
        `INSERT OR REPLACE INTO chapters 
         (id, name_arabic, name_simple, name_translated, revelation_place, verses_count, revelation_order, bismillah_pre, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          chapter.id,
          chapter.name_arabic,
          chapter.name_simple,
          chapter.translated_name?.name || chapter.name_simple,
          chapter.revelation_place,
          chapter.verses_count,
          chapter.revelation_order,
          chapter.bismillah_pre ? 1 : 0,
          now,
        ]
      );
    }
  });
  
  await setCacheState('chapters_last_sync', now.toString());
}

/**
 * Get all cached chapters
 */
export async function getCachedChapters(): Promise<CachedChapter[]> {
  const database = await getDatabase();
  const results = await database.getAllAsync<CachedChapter>(
    'SELECT * FROM chapters ORDER BY id ASC'
  );
  return results.map(row => ({
    ...row,
    bismillah_pre: Boolean(row.bismillah_pre),
  }));
}

/**
 * Get a single cached chapter
 */
export async function getCachedChapter(chapterId: number): Promise<CachedChapter | null> {
  const database = await getDatabase();
  const result = await database.getFirstAsync<CachedChapter>(
    'SELECT * FROM chapters WHERE id = ?',
    [chapterId]
  );
  return result ? { ...result, bismillah_pre: Boolean(result.bismillah_pre) } : null;
}

/**
 * Check if chapters are cached
 */
export async function hasChaptersCache(): Promise<boolean> {
  const database = await getDatabase();
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM chapters'
  );
  return (result?.count ?? 0) > 0;
}

// ============================================
// VERSES CACHE
// ============================================

/**
 * Upsert verses into cache
 */
export async function upsertVerses(verses: VerseWithTranslation[]): Promise<void> {
  const database = await getDatabase();
  const now = Date.now();
  
  await database.withTransactionAsync(async () => {
    for (const verse of verses) {
      // Skip if no Arabic text
      if (!verse.text_uthmani) continue;
      
      const [chapterId] = verse.verse_key.split(':').map(Number);
      
      await database.runAsync(
        `INSERT OR REPLACE INTO verses 
         (id, verse_key, chapter_id, verse_number, text_uthmani, juz_number, page_number, hizb_number, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          verse.id,
          verse.verse_key,
          chapterId,
          verse.verse_number,
          verse.text_uthmani,
          verse.juz_number || null,
          verse.page_number || null,
          verse.hizb_number || null,
          now,
        ]
      );
      
      // Also cache translations
      if (verse.translations && verse.translations.length > 0) {
        for (const translation of verse.translations) {
          await database.runAsync(
            `INSERT OR REPLACE INTO verse_translations 
             (verse_key, translation_id, text, updated_at)
             VALUES (?, ?, ?, ?)`,
            [verse.verse_key, translation.resource_id, translation.text, now]
          );
        }
      }
    }
  });
}

/**
 * Get cached verses by chapter with pagination
 */
export async function getCachedVersesByChapter(
  chapterId: number,
  options: { offset?: number; limit?: number } = {}
): Promise<CachedVerse[]> {
  const { offset = 0, limit = 50 } = options;
  const database = await getDatabase();
  
  return database.getAllAsync<CachedVerse>(
    `SELECT * FROM verses 
     WHERE chapter_id = ? 
     ORDER BY verse_number ASC 
     LIMIT ? OFFSET ?`,
    [chapterId, limit, offset]
  );
}

/**
 * Get a single cached verse
 */
export async function getCachedVerse(verseKey: string): Promise<CachedVerse | null> {
  const database = await getDatabase();
  return database.getFirstAsync<CachedVerse>(
    'SELECT * FROM verses WHERE verse_key = ?',
    [verseKey]
  );
}

/**
 * Get cached verse count for a chapter
 */
export async function getCachedVerseCount(chapterId: number): Promise<number> {
  const database = await getDatabase();
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM verses WHERE chapter_id = ?',
    [chapterId]
  );
  return result?.count ?? 0;
}

/**
 * Check if all verses for a chapter are cached
 */
export async function hasAllVersesCached(chapterId: number, expectedCount: number): Promise<boolean> {
  const count = await getCachedVerseCount(chapterId);
  return count >= expectedCount;
}

// ============================================
// TRANSLATIONS CACHE
// ============================================

/**
 * Upsert translation metadata
 */
export async function upsertTranslationsMeta(translations: Translation[]): Promise<void> {
  const database = await getDatabase();
  const now = Date.now();
  
  await database.withTransactionAsync(async () => {
    for (const translation of translations) {
      await database.runAsync(
        `INSERT OR REPLACE INTO translations_meta 
         (id, name, language_name, author_name, updated_at)
         VALUES (?, ?, ?, ?, ?)`,
        [translation.id, translation.name, translation.language_name, translation.author_name, now]
      );
    }
  });
  
  await setCacheState('translations_last_sync', now.toString());
}

/**
 * Get cached translation metadata
 */
export async function getCachedTranslationsMeta(): Promise<Translation[]> {
  const database = await getDatabase();
  return database.getAllAsync<Translation>(
    'SELECT id, name, language_name, author_name FROM translations_meta ORDER BY language_name, name'
  );
}

/**
 * Get cached verse translations
 */
export async function getCachedVerseTranslations(
  chapterId: number,
  translationId: number,
  options: { offset?: number; limit?: number } = {}
): Promise<CachedTranslation[]> {
  const { offset = 0, limit = 50 } = options;
  const database = await getDatabase();
  
  return database.getAllAsync<CachedTranslation>(
    `SELECT vt.* FROM verse_translations vt
     JOIN verses v ON v.verse_key = vt.verse_key
     WHERE v.chapter_id = ? AND vt.translation_id = ?
     ORDER BY v.verse_number ASC
     LIMIT ? OFFSET ?`,
    [chapterId, translationId, limit, offset]
  );
}

/**
 * Get translation for a specific verse
 */
export async function getCachedVerseTranslation(
  verseKey: string,
  translationId: number
): Promise<CachedTranslation | null> {
  const database = await getDatabase();
  return database.getFirstAsync<CachedTranslation>(
    'SELECT * FROM verse_translations WHERE verse_key = ? AND translation_id = ?',
    [verseKey, translationId]
  );
}

// ============================================
// BOOKMARKS CACHE
// ============================================

export interface LocalBookmark {
  id: string;
  verse_key: string;
  chapter_id: number;
  verse_number: number;
  note?: string;
  created_at: number;
  synced: boolean;
}

/**
 * Add a bookmark
 */
export async function addBookmark(
  verseKey: string,
  chapterId: number,
  verseNumber: number,
  note?: string,
  id?: string
): Promise<string> {
  const database = await getDatabase();
  const bookmarkId = id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await database.runAsync(
    `INSERT OR REPLACE INTO bookmarks 
     (id, verse_key, chapter_id, verse_number, note, created_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [bookmarkId, verseKey, chapterId, verseNumber, note || null, Date.now(), id ? 1 : 0]
  );
  
  return bookmarkId;
}

/**
 * Remove a bookmark
 */
export async function removeBookmark(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM bookmarks WHERE id = ?', [id]);
}

/**
 * Get all bookmarks
 */
export async function getBookmarks(): Promise<LocalBookmark[]> {
  const database = await getDatabase();
  const results = await database.getAllAsync<any>(
    'SELECT * FROM bookmarks ORDER BY created_at DESC'
  );
  return results.map(row => ({
    ...row,
    synced: Boolean(row.synced),
  }));
}

/**
 * Check if a verse is bookmarked
 */
export async function isBookmarked(verseKey: string): Promise<boolean> {
  const database = await getDatabase();
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM bookmarks WHERE verse_key = ?',
    [verseKey]
  );
  return (result?.count ?? 0) > 0;
}

/**
 * Get unsynced bookmarks
 */
export async function getUnsyncedBookmarks(): Promise<LocalBookmark[]> {
  const database = await getDatabase();
  const results = await database.getAllAsync<any>(
    'SELECT * FROM bookmarks WHERE synced = 0'
  );
  return results.map(row => ({
    ...row,
    synced: Boolean(row.synced),
  }));
}

/**
 * Mark bookmark as synced
 */
export async function markBookmarkSynced(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('UPDATE bookmarks SET synced = 1 WHERE id = ?', [id]);
}

// ============================================
// LAST READ CACHE
// ============================================

export interface LocalLastRead {
  chapter_id: number;
  verse_number: number;
  verse_key: string;
  scroll_position?: number;
  updated_at: number;
  synced: boolean;
}

/**
 * Save last read position
 */
export async function saveLastRead(
  chapterId: number,
  verseNumber: number,
  scrollPosition?: number,
  synced: boolean = false
): Promise<void> {
  const database = await getDatabase();
  const verseKey = `${chapterId}:${verseNumber}`;
  
  await database.runAsync(
    `INSERT OR REPLACE INTO last_read 
     (id, chapter_id, verse_number, verse_key, scroll_position, updated_at, synced)
     VALUES (1, ?, ?, ?, ?, ?, ?)`,
    [chapterId, verseNumber, verseKey, scrollPosition || null, Date.now(), synced ? 1 : 0]
  );
}

/**
 * Get last read position
 */
export async function getLastRead(): Promise<LocalLastRead | null> {
  const database = await getDatabase();
  const result = await database.getFirstAsync<any>(
    'SELECT * FROM last_read WHERE id = 1'
  );
  return result ? {
    ...result,
    synced: Boolean(result.synced),
  } : null;
}

/**
 * Mark last read as synced
 */
export async function markLastReadSynced(): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('UPDATE last_read SET synced = 1 WHERE id = 1');
}

// ============================================
// CACHE MANAGEMENT
// ============================================

/**
 * Clear all cached data
 */
export async function clearAllCache(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(`
    DELETE FROM verse_translations;
    DELETE FROM verses;
    DELETE FROM chapters;
    DELETE FROM translations_meta;
    DELETE FROM cache_state;
  `);
}

/**
 * Clear cached verses for a specific chapter
 */
export async function clearChapterCache(chapterId: number): Promise<void> {
  const database = await getDatabase();
  await database.withTransactionAsync(async () => {
    await database.runAsync(
      'DELETE FROM verse_translations WHERE verse_key LIKE ?',
      [`${chapterId}:%`]
    );
    await database.runAsync(
      'DELETE FROM verses WHERE chapter_id = ?',
      [chapterId]
    );
  });
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  chaptersCount: number;
  versesCount: number;
  translationsCount: number;
  bookmarksCount: number;
  lastSyncChapters: string | null;
  lastSyncTranslations: string | null;
}> {
  const database = await getDatabase();
  
  const [chapters, verses, translations, bookmarks] = await Promise.all([
    database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM chapters'),
    database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM verses'),
    database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM verse_translations'),
    database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM bookmarks'),
  ]);
  
  const lastSyncChapters = await getCacheState('chapters_last_sync');
  const lastSyncTranslations = await getCacheState('translations_last_sync');
  
  return {
    chaptersCount: chapters?.count ?? 0,
    versesCount: verses?.count ?? 0,
    translationsCount: translations?.count ?? 0,
    bookmarksCount: bookmarks?.count ?? 0,
    lastSyncChapters,
    lastSyncTranslations,
  };
}

/**
 * Close the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

