/**
 * TanStack Query Hooks for Quran Data
 * Provides caching, refetching, and optimistic updates
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as quranRepo from '../../lib/quran/quranRepo';
import { TRANSLATION_IDS } from '../../lib/quran/quranApi';
import type {
  Chapter,
  VerseWithTranslation,
  Translation,
  CachedChapter,
} from '../../lib/quran/quranTypes';
import type { LocalBookmark, LocalLastRead } from '../../lib/quran/quranCache';

// ============================================
// QUERY KEYS
// ============================================

export const quranKeys = {
  all: ['quran'] as const,
  chapters: () => [...quranKeys.all, 'chapters'] as const,
  chapter: (id: number) => [...quranKeys.chapters(), id] as const,
  verses: () => [...quranKeys.all, 'verses'] as const,
  versesByChapter: (chapterId: number, translationId: number) => 
    [...quranKeys.verses(), 'chapter', chapterId, 'translation', translationId] as const,
  translations: () => [...quranKeys.all, 'translations'] as const,
  search: (query: string) => [...quranKeys.all, 'search', query] as const,
  bookmarks: () => [...quranKeys.all, 'bookmarks'] as const,
  lastRead: () => [...quranKeys.all, 'lastRead'] as const,
  cacheStats: () => [...quranKeys.all, 'cacheStats'] as const,
};

// ============================================
// CHAPTERS HOOKS
// ============================================

/**
 * Fetch all 114 Quran chapters
 */
export function useChapters(options?: {
  language?: string;
  enabled?: boolean;
}) {
  const { language = 'en', enabled = true } = options || {};
  
  return useQuery({
    queryKey: quranKeys.chapters(),
    queryFn: async () => {
      const result = await quranRepo.getChapters({ language });
      return result;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled,
  });
}

/**
 * Get a single chapter
 */
export function useChapter(chapterId: number) {
  return useQuery({
    queryKey: quranKeys.chapter(chapterId),
    queryFn: () => quranRepo.getChapter(chapterId),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: chapterId > 0 && chapterId <= 114,
  });
}

// ============================================
// VERSES HOOKS
// ============================================

/**
 * Fetch verses by chapter with infinite scroll
 */
export function useVersesByChapter(
  chapterId: number,
  options?: {
    translationId?: number;
    perPage?: number;
    enabled?: boolean;
    language?: string;
  }
) {
  const {
    translationId = TRANSLATION_IDS.SAHIH_INTERNATIONAL,
    perPage = 20,
    enabled = true,
    language = 'en',
  } = options || {};
  
  return useInfiniteQuery({
    queryKey: quranKeys.versesByChapter(chapterId, translationId),
    queryFn: async ({ pageParam = 1 }) => {
      const result = await quranRepo.getVersesByChapter(chapterId, {
        page: pageParam,
        perPage,
        translationIds: [translationId],
        language,
      });
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.next_page) {
        return lastPage.pagination.next_page;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: enabled && chapterId > 0 && chapterId <= 114,
  });
}

/**
 * Prefetch a chapter for offline reading
 */
export function usePrefetchChapter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      chapterId,
      translationIds = [TRANSLATION_IDS.SAHIH_INTERNATIONAL],
      onProgress,
    }: {
      chapterId: number;
      translationIds?: number[];
      onProgress?: (current: number, total: number) => void;
    }) => {
      await quranRepo.prefetchChapter(chapterId, translationIds, onProgress);
    },
    onSuccess: (_, { chapterId, translationIds }) => {
      // Invalidate queries to refresh from cache
      translationIds?.forEach((tId) => {
        queryClient.invalidateQueries({
          queryKey: quranKeys.versesByChapter(chapterId, tId),
        });
      });
    },
  });
}

// ============================================
// TRANSLATIONS HOOKS
// ============================================

/**
 * Fetch available translations
 */
export function useTranslations(options?: {
  language?: string;
  enabled?: boolean;
}) {
  const { language = 'en', enabled = true } = options || {};
  
  return useQuery({
    queryKey: quranKeys.translations(),
    queryFn: async () => {
      const result = await quranRepo.getTranslations({ language });
      return result;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    enabled,
  });
}

// ============================================
// SEARCH HOOKS
// ============================================

/**
 * Search the Quran
 */
export function useQuranSearch(
  query: string,
  options?: {
    enabled?: boolean;
    page?: number;
    perPage?: number;
    language?: string;
  }
) {
  const { enabled = true, page = 1, perPage = 20, language = 'en' } = options || {};
  
  return useQuery({
    queryKey: quranKeys.search(query),
    queryFn: () => quranRepo.searchQuran(query, { page, perPage, language }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled && query.length >= 2,
  });
}

// ============================================
// BOOKMARKS HOOKS
// ============================================

/**
 * Fetch all bookmarks
 */
export function useBookmarks() {
  return useQuery({
    queryKey: quranKeys.bookmarks(),
    queryFn: quranRepo.getBookmarks,
    staleTime: 0, // Always fresh for user data
  });
}

/**
 * Add a bookmark
 */
export function useAddBookmark() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ verseKey, note }: { verseKey: string; note?: string }) =>
      quranRepo.addBookmark(verseKey, note),
    onMutate: async ({ verseKey, note }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: quranKeys.bookmarks() });
      
      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData<LocalBookmark[]>(quranKeys.bookmarks());
      
      // Optimistically update
      const [chapterId, verseNumber] = verseKey.split(':').map(Number);
      const newBookmark: LocalBookmark = {
        id: `temp_${Date.now()}`,
        verse_key: verseKey,
        chapter_id: chapterId,
        verse_number: verseNumber,
        note,
        created_at: Date.now(),
        synced: false,
      };
      
      queryClient.setQueryData<LocalBookmark[]>(quranKeys.bookmarks(), (old) => 
        old ? [...old, newBookmark] : [newBookmark]
      );
      
      return { previousBookmarks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousBookmarks) {
        queryClient.setQueryData(quranKeys.bookmarks(), context.previousBookmarks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: quranKeys.bookmarks() });
    },
  });
}

/**
 * Remove a bookmark
 */
export function useRemoveBookmark() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => quranRepo.removeBookmark(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: quranKeys.bookmarks() });
      
      const previousBookmarks = queryClient.getQueryData<LocalBookmark[]>(quranKeys.bookmarks());
      
      queryClient.setQueryData<LocalBookmark[]>(quranKeys.bookmarks(), (old) =>
        old ? old.filter((b) => b.id !== id) : []
      );
      
      return { previousBookmarks };
    },
    onError: (err, id, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(quranKeys.bookmarks(), context.previousBookmarks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: quranKeys.bookmarks() });
    },
  });
}

// ============================================
// LAST READ HOOKS
// ============================================

/**
 * Fetch last read position
 */
export function useLastRead() {
  return useQuery({
    queryKey: quranKeys.lastRead(),
    queryFn: quranRepo.getLastRead,
    staleTime: 0,
  });
}

/**
 * Save last read position
 */
export function useSaveLastRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      chapterId,
      verseNumber,
      scrollPosition,
    }: {
      chapterId: number;
      verseNumber: number;
      scrollPosition?: number;
    }) => quranRepo.saveLastRead(chapterId, verseNumber, scrollPosition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quranKeys.lastRead() });
    },
  });
}

// ============================================
// CACHE MANAGEMENT HOOKS
// ============================================

/**
 * Get cache statistics
 */
export function useCacheStats() {
  return useQuery({
    queryKey: quranKeys.cacheStats(),
    queryFn: quranRepo.getCacheStats,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Clear all cache
 */
export function useClearCache() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quranRepo.clearCache,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quranKeys.all });
    },
  });
}

