export interface PrayerTime {
  name: string;
  time: string;
  isNext: boolean;
  isCurrent: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
  isFavorite?: boolean;
}

export interface QuranVerse {
  surah: number;
  verse: number;
  arabic: string;
  translation: string;
  transliteration: string;
}

export interface TasbihCount {
  id: string;
  name: string;
  count: number;
  target: number;
  date: string;
}

export interface Wazifa {
  id: string;
  title: string;
  description: string;
  times: string[];
  completed: boolean;
  date: string;
}

export interface LazimItem {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  date: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'grateful' | 'reflective' | 'hopeful' | 'peaceful';
}

export interface Scholar {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  specialties: string[];
}

export interface Mosque {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  prayerTimes: PrayerTime[];
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  date: string;
  type: 'text' | 'image' | 'video';
}

export interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}
