/**
 * SQLite Cache Layer for Quran Data
 * Provides offline-first storage using expo-sqlite
 */

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
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
const MAX_RETRIES = 3;
const RETRY_DELAY = 500; // ms

let db: SQLite.SQLiteDatabase | null = null;
let isInitializing = false;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Flag to track if SQLite is available
let sqliteAvailable: boolean | null = null;

// ============================================
// DATABASE INITIALIZATION
// ============================================

/**
 * Check if SQLite is available on this platform
 */
async function checkSQLiteAvailability(): Promise<boolean> {
  if (sqliteAvailable !== null) return sqliteAvailable;
  
  try {
    // Try to open a test database
    const testDb = await SQLite.openDatabaseAsync('__test_sqlite__.db');
    await testDb.closeAsync();
    sqliteAvailable = true;
    console.log('✅ SQLite is available');
    return true;
  } catch (error) {
    console.warn('⚠️ SQLite is not available:', error);
    sqliteAvailable = false;
    return false;
  }
}

/**
 * Get or create the database instance with retry logic
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase | null> {
  // Check if SQLite is available
  const isAvailable = await checkSQLiteAvailability();
  if (!isAvailable) {
    console.log('📦 SQLite not available, using in-memory fallback');
    return null;
  }
  
  // Return existing database if available
  if (db) return db;
  
  // If already initializing, wait for the existing promise
  if (isInitializing && initPromise) {
    return initPromise;
  }
  
  isInitializing = true;
  
  initPromise = (async () => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`📦 Opening SQLite database (attempt ${attempt}/${MAX_RETRIES})...`);
        
        const database = await SQLite.openDatabaseAsync(DB_NAME);
        
        // Test the connection
        await database.execAsync('SELECT 1');
        
        // Initialize tables
        await initializeDatabase(database);
        
        db = database;
        console.log('✅ SQLite database ready');
        return database;
      } catch (error: any) {
        lastError = error;
        console.warn(`⚠️ Database initialization attempt ${attempt} failed:`, error.message);
        
        // Close any partially opened database
        if (db) {
          try {
            await db.closeAsync();
          } catch {}
          db = null;
        }
        
        // Wait before retrying
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
        }
      }
    }
    
    // All retries failed
    console.error('❌ Failed to initialize SQLite database after', MAX_RETRIES, 'attempts');
    sqliteAvailable = false;
    throw lastError || new Error('Failed to initialize database');
  })();
  
  try {
    const result = await initPromise;
    return result;
  } catch (error) {
    return null;
  } finally {
    isInitializing = false;
    initPromise = null;
  }
}

/**
 * Initialize database tables and run migrations
 */
async function initializeDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  // Create tables one at a time to avoid complex transaction issues on Android
  const tables = [
    // Chapters table
    `CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY,
      name_arabic TEXT NOT NULL,
      name_simple TEXT NOT NULL,
      name_translated TEXT NOT NULL,
      revelation_place TEXT NOT NULL,
      verses_count INTEGER NOT NULL,
      revelation_order INTEGER NOT NULL,
      bismillah_pre INTEGER NOT NULL DEFAULT 1,
      updated_at INTEGER NOT NULL
    )`,
    
    // Verses table
    `CREATE TABLE IF NOT EXISTS verses (
      id INTEGER PRIMARY KEY,
      verse_key TEXT UNIQUE NOT NULL,
      chapter_id INTEGER NOT NULL,
      verse_number INTEGER NOT NULL,
      text_uthmani TEXT NOT NULL,
      juz_number INTEGER,
      page_number INTEGER,
      hizb_number INTEGER,
      updated_at INTEGER NOT NULL
    )`,
    
    // Translations metadata table
    `CREATE TABLE IF NOT EXISTS translations_meta (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      language_name TEXT NOT NULL,
      author_name TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )`,
    
    // Verse translations table
    `CREATE TABLE IF NOT EXISTS verse_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      verse_key TEXT NOT NULL,
      translation_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      UNIQUE(verse_key, translation_id)
    )`,
    
    // Cache state table
    `CREATE TABLE IF NOT EXISTS cache_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )`,
    
    // Bookmarks table
    `CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      verse_key TEXT NOT NULL,
      chapter_id INTEGER NOT NULL,
      verse_number INTEGER NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0
    )`,
    
    // Last read position
    `CREATE TABLE IF NOT EXISTS last_read (
      id INTEGER PRIMARY KEY DEFAULT 1,
      chapter_id INTEGER NOT NULL,
      verse_number INTEGER NOT NULL,
      verse_key TEXT NOT NULL,
      scroll_position REAL,
      updated_at INTEGER NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0
    )`,
  ];
  
  // Create indexes
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_verses_chapter ON verses(chapter_id)',
    'CREATE INDEX IF NOT EXISTS idx_verses_key ON verses(verse_key)',
    'CREATE INDEX IF NOT EXISTS idx_translations_verse ON verse_translations(verse_key)',
    'CREATE INDEX IF NOT EXISTS idx_translations_id ON verse_translations(translation_id)',
  ];
  
  // Execute each table creation separately
  for (const sql of tables) {
    await database.execAsync(sql);
  }
  
  // Create indexes
  for (const sql of indexes) {
    await database.execAsync(sql);
  }
  
  // Set initial cache state
  await database.runAsync(
    `INSERT OR REPLACE INTO cache_state (key, value, updated_at) VALUES (?, ?, ?)`,
    ['db_version', DB_VERSION.toString(), Date.now()]
  );
}

// ============================================
// SAFE DATABASE OPERATIONS
// ============================================

/**
 * Safely execute a database operation with fallback
 */
async function safeDbOperation<T>(
  operation: (db: SQLite.SQLiteDatabase) => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const database = await getDatabase();
    if (!database) return fallback;
    return await operation(database);
  } catch (error) {
    console.warn('⚠️ Database operation failed:', error);
    return fallback;
  }
}

// ============================================
// CACHE STATE HELPERS
// ============================================

export async function getCacheState(key: string): Promise<string | null> {
  return safeDbOperation(async (database) => {
    const result = await database.getFirstAsync<{ value: string }>(
      'SELECT value FROM cache_state WHERE key = ?',
      [key]
    );
    return result?.value ?? null;
  }, null);
}

export async function setCacheState(key: string, value: string): Promise<void> {
  await safeDbOperation(async (database) => {
    await database.runAsync(
      `INSERT OR REPLACE INTO cache_state (key, value, updated_at) VALUES (?, ?, ?)`,
      [key, value, Date.now()]
    );
  }, undefined);
}

// ============================================
// CHAPTERS CACHE
// ============================================

/**
 * Upsert chapters into cache
 */
export async function upsertChapters(chapters: Chapter[]): Promise<void> {
  await safeDbOperation(async (database) => {
    const now = Date.now();
    
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
    
    await database.runAsync(
      `INSERT OR REPLACE INTO cache_state (key, value, updated_at) VALUES (?, ?, ?)`,
      ['chapters_last_sync', now.toString(), now]
    );
  }, undefined);
}

/**
 * Get all cached chapters
 */
export async function getCachedChapters(): Promise<CachedChapter[]> {
  return safeDbOperation(async (database) => {
    const results = await database.getAllAsync<CachedChapter>(
      'SELECT * FROM chapters ORDER BY id ASC'
    );
    return results.map(row => ({
      ...row,
      bismillah_pre: Boolean(row.bismillah_pre),
    }));
  }, []);
}

/**
 * Get a single cached chapter
 */
export async function getCachedChapter(chapterId: number): Promise<CachedChapter | null> {
  return safeDbOperation(async (database) => {
    const result = await database.getFirstAsync<CachedChapter>(
      'SELECT * FROM chapters WHERE id = ?',
      [chapterId]
    );
    return result ? { ...result, bismillah_pre: Boolean(result.bismillah_pre) } : null;
  }, null);
}

/**
 * Check if chapters are cached
 */
export async function hasChaptersCache(): Promise<boolean> {
  return safeDbOperation(async (database) => {
    const result = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM chapters'
    );
    return (result?.count ?? 0) > 0;
  }, false);
}

// ============================================
// VERSES CACHE
// ============================================

/**
 * Upsert verses into cache
 */
export async function upsertVerses(verses: VerseWithTranslation[]): Promise<void> {
  await safeDbOperation(async (database) => {
    const now = Date.now();
    
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
  }, undefined);
}

/**
 * Get cached verses by chapter with pagination
 */
export async function getCachedVersesByChapter(
  chapterId: number,
  options: { offset?: number; limit?: number } = {}
): Promise<CachedVerse[]> {
  const { offset = 0, limit = 50 } = options;
  
  return safeDbOperation(async (database) => {
    return database.getAllAsync<CachedVerse>(
      `SELECT * FROM verses 
       WHERE chapter_id = ? 
       ORDER BY verse_number ASC 
       LIMIT ? OFFSET ?`,
      [chapterId, limit, offset]
    );
  }, []);
}

/**
 * Get a single cached verse
 */
export async function getCachedVerse(verseKey: string): Promise<CachedVerse | null> {
  return safeDbOperation(async (database) => {
    return database.getFirstAsync<CachedVerse>(
      'SELECT * FROM verses WHERE verse_key = ?',
      [verseKey]
    );
  }, null);
}

/**
 * Get cached verse count for a chapter
 */
export async function getCachedVerseCount(chapterId: number): Promise<number> {
  return safeDbOperation(async (database) => {
    const result = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM verses WHERE chapter_id = ?',
      [chapterId]
    );
    return result?.count ?? 0;
  }, 0);
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
  await safeDbOperation(async (database) => {
    const now = Date.now();
    
    for (const translation of translations) {
      await database.runAsync(
        `INSERT OR REPLACE INTO translations_meta 
         (id, name, language_name, author_name, updated_at)
         VALUES (?, ?, ?, ?, ?)`,
        [translation.id, translation.name, translation.language_name, translation.author_name, now]
      );
    }
    
    await database.runAsync(
      `INSERT OR REPLACE INTO cache_state (key, value, updated_at) VALUES (?, ?, ?)`,
      ['translations_last_sync', now.toString(), now]
    );
  }, undefined);
}

/**
 * Get cached translation metadata
 */
export async function getCachedTranslationsMeta(): Promise<Translation[]> {
  return safeDbOperation(async (database) => {
    return database.getAllAsync<Translation>(
      'SELECT id, name, language_name, author_name FROM translations_meta ORDER BY language_name, name'
    );
  }, []);
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
  
  return safeDbOperation(async (database) => {
    return database.getAllAsync<CachedTranslation>(
      `SELECT vt.* FROM verse_translations vt
       JOIN verses v ON v.verse_key = vt.verse_key
       WHERE v.chapter_id = ? AND vt.translation_id = ?
       ORDER BY v.verse_number ASC
       LIMIT ? OFFSET ?`,
      [chapterId, translationId, limit, offset]
    );
  }, []);
}

/**
 * Get translation for a specific verse
 */
export async function getCachedVerseTranslation(
  verseKey: string,
  translationId: number
): Promise<CachedTranslation | null> {
  return safeDbOperation(async (database) => {
    return database.getFirstAsync<CachedTranslation>(
      'SELECT * FROM verse_translations WHERE verse_key = ? AND translation_id = ?',
      [verseKey, translationId]
    );
  }, null);
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
  const bookmarkId = id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await safeDbOperation(async (database) => {
    await database.runAsync(
      `INSERT OR REPLACE INTO bookmarks 
       (id, verse_key, chapter_id, verse_number, note, created_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [bookmarkId, verseKey, chapterId, verseNumber, note || null, Date.now(), id ? 1 : 0]
    );
  }, undefined);
  
  return bookmarkId;
}

/**
 * Remove a bookmark
 */
export async function removeBookmark(id: string): Promise<void> {
  await safeDbOperation(async (database) => {
    await database.runAsync('DELETE FROM bookmarks WHERE id = ?', [id]);
  }, undefined);
}

/**
 * Get all bookmarks
 */
export async function getBookmarks(): Promise<LocalBookmark[]> {
  return safeDbOperation(async (database) => {
    const results = await database.getAllAsync<any>(
      'SELECT * FROM bookmarks ORDER BY created_at DESC'
    );
    return results.map(row => ({
      ...row,
      synced: Boolean(row.synced),
    }));
  }, []);
}

/**
 * Check if a verse is bookmarked
 */
export async function isBookmarked(verseKey: string): Promise<boolean> {
  return safeDbOperation(async (database) => {
    const result = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM bookmarks WHERE verse_key = ?',
      [verseKey]
    );
    return (result?.count ?? 0) > 0;
  }, false);
}

/**
 * Get unsynced bookmarks
 */
export async function getUnsyncedBookmarks(): Promise<LocalBookmark[]> {
  return safeDbOperation(async (database) => {
    const results = await database.getAllAsync<any>(
      'SELECT * FROM bookmarks WHERE synced = 0'
    );
    return results.map(row => ({
      ...row,
      synced: Boolean(row.synced),
    }));
  }, []);
}

/**
 * Mark bookmark as synced
 */
export async function markBookmarkSynced(id: string): Promise<void> {
  await safeDbOperation(async (database) => {
    await database.runAsync('UPDATE bookmarks SET synced = 1 WHERE id = ?', [id]);
  }, undefined);
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
  await safeDbOperation(async (database) => {
    const verseKey = `${chapterId}:${verseNumber}`;
    
    await database.runAsync(
      `INSERT OR REPLACE INTO last_read 
       (id, chapter_id, verse_number, verse_key, scroll_position, updated_at, synced)
       VALUES (1, ?, ?, ?, ?, ?, ?)`,
      [chapterId, verseNumber, verseKey, scrollPosition || null, Date.now(), synced ? 1 : 0]
    );
  }, undefined);
}

/**
 * Get last read position
 */
export async function getLastRead(): Promise<LocalLastRead | null> {
  return safeDbOperation(async (database) => {
    const result = await database.getFirstAsync<any>(
      'SELECT * FROM last_read WHERE id = 1'
    );
    return result ? {
      ...result,
      synced: Boolean(result.synced),
    } : null;
  }, null);
}

/**
 * Mark last read as synced
 */
export async function markLastReadSynced(): Promise<void> {
  await safeDbOperation(async (database) => {
    await database.runAsync('UPDATE last_read SET synced = 1 WHERE id = 1');
  }, undefined);
}

// ============================================
// CACHE MANAGEMENT
// ============================================

/**
 * Clear all cached data
 */
export async function clearAllCache(): Promise<void> {
  await safeDbOperation(async (database) => {
    await database.execAsync('DELETE FROM verse_translations');
    await database.execAsync('DELETE FROM verses');
    await database.execAsync('DELETE FROM chapters');
    await database.execAsync('DELETE FROM translations_meta');
    await database.execAsync('DELETE FROM cache_state');
  }, undefined);
}

/**
 * Clear cached verses for a specific chapter
 */
export async function clearChapterCache(chapterId: number): Promise<void> {
  await safeDbOperation(async (database) => {
    await database.runAsync(
      'DELETE FROM verse_translations WHERE verse_key LIKE ?',
      [`${chapterId}:%`]
    );
    await database.runAsync(
      'DELETE FROM verses WHERE chapter_id = ?',
      [chapterId]
    );
  }, undefined);
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
  sqliteAvailable: boolean;
}> {
  const isAvailable = await checkSQLiteAvailability();
  
  if (!isAvailable) {
    return {
      chaptersCount: 0,
      versesCount: 0,
      translationsCount: 0,
      bookmarksCount: 0,
      lastSyncChapters: null,
      lastSyncTranslations: null,
      sqliteAvailable: false,
    };
  }
  
  return safeDbOperation(async (database) => {
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
      sqliteAvailable: true,
    };
  }, {
    chaptersCount: 0,
    versesCount: 0,
    translationsCount: 0,
    bookmarksCount: 0,
    lastSyncChapters: null,
    lastSyncTranslations: null,
    sqliteAvailable: false,
  });
}

/**
 * Close the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    try {
      await db.closeAsync();
    } catch (error) {
      console.warn('⚠️ Error closing database:', error);
    }
    db = null;
  }
}

/**
 * Check if SQLite caching is available
 */
export function isSQLiteAvailable(): boolean {
  return sqliteAvailable === true;
}
