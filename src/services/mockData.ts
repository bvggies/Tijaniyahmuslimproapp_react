/**
 * Mock Data Service for UI Development
 * Provides typed mock data for all home screen sections
 */

// Types
export interface PrayerTimeData {
  id: string;
  name: string;
  nameArabic: string;
  time: string;
  timeWithSeconds?: string;
  countdown?: string;
  isCurrent: boolean;
  isNext: boolean;
}

export interface IslamicDateData {
  day: number;
  month: number;
  monthName: string;
  monthNameArabic: string;
  year: number;
  dayName: string;
  dayNameArabic: string;
  isHoliday: boolean;
  holidayName?: string;
}

export interface LocationData {
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  latitude: number;
  longitude: number;
}

export interface QuickActionData {
  id: string;
  title: string;
  titleArabic: string;
  icon: string;
  color: string;
  screen: string;
  description: string;
}

export interface IslamicEventData {
  id: string;
  title: string;
  titleArabic: string;
  date: string;
  hijriDate: string;
  daysUntil: number;
  category: 'holiday' | 'fasting' | 'pilgrimage' | 'celebration';
}

export interface DailyReminderData {
  id: string;
  category: 'quran' | 'hadith' | 'dua' | 'wisdom';
  title: string;
  titleArabic?: string;
  content: string;
  contentArabic?: string;
  source: string;
  reference?: string;
}

export interface NewsArticleData {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  timestamp: string;
  source: string;
  url: string;
}

// Mock Data
export const mockPrayerTimes: PrayerTimeData[] = [
  { id: '1', name: 'Fajr', nameArabic: 'الفجر', time: '5:45 AM', timeWithSeconds: '5:45:00 AM', countdown: '5h 32m', isCurrent: false, isNext: false },
  { id: '2', name: 'Dhuhr', nameArabic: 'الظهر', time: '12:30 PM', timeWithSeconds: '12:30:00 PM', countdown: '2h 15m', isCurrent: false, isNext: true },
  { id: '3', name: 'Asr', nameArabic: 'العصر', time: '3:45 PM', timeWithSeconds: '3:45:00 PM', countdown: '5h 30m', isCurrent: false, isNext: false },
  { id: '4', name: 'Maghrib', nameArabic: 'المغرب', time: '6:15 PM', timeWithSeconds: '6:15:00 PM', countdown: '8h 00m', isCurrent: false, isNext: false },
  { id: '5', name: 'Isha', nameArabic: 'العشاء', time: '7:45 PM', timeWithSeconds: '7:45:00 PM', countdown: '9h 30m', isCurrent: false, isNext: false },
];

export const mockIslamicDate: IslamicDateData = {
  day: 15,
  month: 7,
  monthName: 'Rajab',
  monthNameArabic: 'رجب',
  year: 1446,
  dayName: 'Monday',
  dayNameArabic: 'الإثنين',
  isHoliday: false,
};

export const mockLocation: LocationData = {
  city: 'Accra',
  country: 'Ghana',
  countryCode: 'GH',
  flag: '🇬🇭',
  latitude: 5.6037,
  longitude: -0.1870,
};

export const mockQuickActions: QuickActionData[] = [
  { id: '1', title: 'Lessons', titleArabic: 'الدروس', icon: 'school', color: '#4CAF50', screen: 'Lessons', description: 'Islamic lessons' },
  { id: '2', title: 'AI Noor', titleArabic: 'الذكاء الاصطناعي', icon: 'bulb', color: '#00BCD4', screen: 'AI Noor', description: 'AI Islamic assistant' },
  { id: '3', title: 'Azan', titleArabic: 'الأذان', icon: 'volume-high', color: '#FF9800', screen: 'Azan', description: 'Prayer call audio' },
  { id: '4', title: 'Scholars', titleArabic: 'العلماء', icon: 'people', color: '#607D8B', screen: 'Scholars', description: 'Islamic scholars' },
  { id: '5', title: 'Tariqa', titleArabic: 'الطريقة', icon: 'star', color: '#00BFA5', screen: 'TariqaTijaniyyah', description: 'The Tijānī Path' },
  { id: '6', title: 'Makkah', titleArabic: 'مكة مباشر', icon: 'videocam', color: '#FFD54F', screen: 'Makkah Live', description: 'Live from Kaaba' },
  { id: '7', title: 'Mosque', titleArabic: 'موقع المسجد', icon: 'location', color: '#795548', screen: 'Mosque', description: 'Find nearby mosques' },
  { id: '8', title: 'Qibla', titleArabic: 'القبلة', icon: 'compass', color: '#FF5722', screen: 'Qibla', description: 'Find prayer direction' },
];

export const mockUpcomingEvents: IslamicEventData[] = [
  { id: '1', title: 'Isra and Miraj', titleArabic: 'الإسراء والمعراج', date: 'Feb 28, 2025', hijriDate: '27 Rajab', daysUntil: 15, category: 'celebration' },
  { id: '2', title: 'Ramadan Begins', titleArabic: 'بداية رمضان', date: 'Mar 1, 2025', hijriDate: '1 Ramadan', daysUntil: 30, category: 'fasting' },
  { id: '3', title: 'Laylat al-Qadr', titleArabic: 'ليلة القدر', date: 'Mar 27, 2025', hijriDate: '27 Ramadan', daysUntil: 56, category: 'celebration' },
];

export const mockDailyReminder: DailyReminderData = {
  id: '1',
  category: 'quran',
  title: 'Surah Al-Baqarah, Verse 286',
  titleArabic: 'سورة البقرة، الآية ٢٨٦',
  content: 'Allah does not burden a soul beyond that it can bear. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned.',
  contentArabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ',
  source: 'Quran 2:286',
  reference: 'Al-Baqarah',
};

export const mockNewsArticles: NewsArticleData[] = [
  {
    id: '1',
    title: 'Annual Mawlid Celebration Brings Together Thousands',
    excerpt: 'The grand celebration of Prophet Muhammad\'s birthday gathered Muslims from across the region...',
    imageUrl: 'https://example.com/image1.jpg',
    category: 'Community',
    timestamp: '2 hours ago',
    source: 'Islamic Times',
    url: 'https://example.com/article1',
  },
  {
    id: '2',
    title: 'New Mosque Opens in Downtown Accra',
    excerpt: 'A beautiful new mosque has opened its doors, featuring stunning Islamic architecture...',
    imageUrl: 'https://example.com/image2.jpg',
    category: 'Local',
    timestamp: '5 hours ago',
    source: 'Ghana Muslim News',
    url: 'https://example.com/article2',
  },
];

// Utility functions
export const getPrayerIcon = (prayerName: string): string => {
  const icons: Record<string, string> = {
    'Fajr': 'sunny',
    'Dhuhr': 'sunny',
    'Asr': 'partly-sunny',
    'Maghrib': 'sunny',
    'Isha': 'moon',
  };
  return icons[prayerName] || 'time';
};

export const getPrayerColor = (prayerName: string): string => {
  const colors: Record<string, string> = {
    'Fajr': '#FF6B35',
    'Dhuhr': '#FFD23F',
    'Asr': '#FF8C42',
    'Maghrib': '#FF6B9D',
    'Isha': '#4A90E2',
  };
  return colors[prayerName] || '#607D8B';
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'quran': 'book',
    'hadith': 'document-text',
    'dua': 'heart',
    'wisdom': 'bulb',
  };
  return icons[category] || 'star';
};

