/**
 * Zustand Store for Quran Reading Settings
 * Persists user preferences locally
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATION_IDS } from '../../lib/quran/quranApi';

// ============================================
// TYPES
// ============================================

export interface QuranSettings {
  // Translation
  selectedTranslationId: number;
  selectedTranslationName: string;
  
  // Font sizes
  arabicFontSize: number;
  translationFontSize: number;
  
  // Display options
  showTransliteration: boolean;
  showTranslation: boolean;
  showWordByWord: boolean;
  
  // Theme
  theme: 'dark' | 'light' | 'sepia';
  
  // Reading mode
  readingMode: 'verse' | 'page' | 'juz';
  
  // Audio
  autoPlayAudio: boolean;
  selectedReciterId: number;
}

export interface QuranStore extends QuranSettings {
  // Actions
  setTranslation: (id: number, name: string) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  toggleTransliteration: () => void;
  toggleTranslation: () => void;
  toggleWordByWord: () => void;
  setTheme: (theme: 'dark' | 'light' | 'sepia') => void;
  setReadingMode: (mode: 'verse' | 'page' | 'juz') => void;
  setAutoPlayAudio: (value: boolean) => void;
  setReciter: (id: number) => void;
  resetSettings: () => void;
}

// ============================================
// DEFAULT VALUES
// ============================================

const defaultSettings: QuranSettings = {
  selectedTranslationId: TRANSLATION_IDS.SAHIH_INTERNATIONAL,
  selectedTranslationName: 'Sahih International',
  arabicFontSize: 28,
  translationFontSize: 16,
  showTransliteration: false,
  showTranslation: true,
  showWordByWord: false,
  theme: 'dark',
  readingMode: 'verse',
  autoPlayAudio: false,
  selectedReciterId: 7, // Mishary Rashid Alafasy
};

// ============================================
// STORE
// ============================================

export const useQuranStore = create<QuranStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setTranslation: (id, name) => set({
        selectedTranslationId: id,
        selectedTranslationName: name,
      }),
      
      setArabicFontSize: (size) => set({
        arabicFontSize: Math.min(Math.max(size, 20), 48),
      }),
      
      setTranslationFontSize: (size) => set({
        translationFontSize: Math.min(Math.max(size, 12), 24),
      }),
      
      toggleTransliteration: () => set((state) => ({
        showTransliteration: !state.showTransliteration,
      })),
      
      toggleTranslation: () => set((state) => ({
        showTranslation: !state.showTranslation,
      })),
      
      toggleWordByWord: () => set((state) => ({
        showWordByWord: !state.showWordByWord,
      })),
      
      setTheme: (theme) => set({ theme }),
      
      setReadingMode: (mode) => set({ readingMode: mode }),
      
      setAutoPlayAudio: (value) => set({ autoPlayAudio: value }),
      
      setReciter: (id) => set({ selectedReciterId: id }),
      
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'quran-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ============================================
// SELECTORS
// ============================================

export const useSelectedTranslation = () => useQuranStore((state) => ({
  id: state.selectedTranslationId,
  name: state.selectedTranslationName,
}));

export const useFontSizes = () => useQuranStore((state) => ({
  arabic: state.arabicFontSize,
  translation: state.translationFontSize,
}));

export const useDisplayOptions = () => useQuranStore((state) => ({
  showTransliteration: state.showTransliteration,
  showTranslation: state.showTranslation,
  showWordByWord: state.showWordByWord,
}));

export const useQuranTheme = () => useQuranStore((state) => state.theme);

