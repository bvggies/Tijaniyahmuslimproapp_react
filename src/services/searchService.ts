export interface SearchResult {
  id: string;
  title: string;
  titleArabic?: string;
  description: string;
  type: 'prayer' | 'dua' | 'quran' | 'zikr' | 'wazifa' | 'lazim' | 'scholar' | 'mosque' | 'general';
  category: string;
  content?: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
}

export const searchData: SearchResult[] = [
  // Prayer Times
  {
    id: 'prayer-1',
    title: 'Fajr Prayer',
    titleArabic: 'صلاة الفجر',
    description: 'Dawn prayer time',
    type: 'prayer',
    category: 'Prayer Times',
  },
  {
    id: 'prayer-2',
    title: 'Dhuhr Prayer',
    titleArabic: 'صلاة الظهر',
    description: 'Midday prayer time',
    type: 'prayer',
    category: 'Prayer Times',
  },
  {
    id: 'prayer-3',
    title: 'Asr Prayer',
    titleArabic: 'صلاة العصر',
    description: 'Afternoon prayer time',
    type: 'prayer',
    category: 'Prayer Times',
  },
  {
    id: 'prayer-4',
    title: 'Maghrib Prayer',
    titleArabic: 'صلاة المغرب',
    description: 'Sunset prayer time',
    type: 'prayer',
    category: 'Prayer Times',
  },
  {
    id: 'prayer-5',
    title: 'Isha Prayer',
    titleArabic: 'صلاة العشاء',
    description: 'Night prayer time',
    type: 'prayer',
    category: 'Prayer Times',
  },

  // Duas
  {
    id: 'dua-1',
    title: 'Dua for Morning',
    titleArabic: 'دعاء الصباح',
    description: 'Morning supplication',
    type: 'dua',
    category: 'Duas',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    transliteration: 'Asbahna wa asbahal mulku lillah',
    translation: 'We have reached the morning and the dominion belongs to Allah',
  },
  {
    id: 'dua-2',
    title: 'Dua for Evening',
    titleArabic: 'دعاء المساء',
    description: 'Evening supplication',
    type: 'dua',
    category: 'Duas',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    transliteration: 'Amsayna wa amsal mulku lillah',
    translation: 'We have reached the evening and the dominion belongs to Allah',
  },
  {
    id: 'dua-3',
    title: 'Dua Before Eating',
    titleArabic: 'دعاء قبل الأكل',
    description: 'Supplication before meals',
    type: 'dua',
    category: 'Duas',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah',
  },

  // Quran
  {
    id: 'quran-1',
    title: 'Surah Al-Fatihah',
    titleArabic: 'سورة الفاتحة',
    description: 'The Opening - First chapter of Quran',
    type: 'quran',
    category: 'Quran',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillahi ar-Rahman ar-Raheem',
    translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
  },
  {
    id: 'quran-2',
    title: 'Surah Al-Baqarah',
    titleArabic: 'سورة البقرة',
    description: 'The Cow - Second chapter of Quran',
    type: 'quran',
    category: 'Quran',
  },
  {
    id: 'quran-3',
    title: 'Ayat al-Kursi',
    titleArabic: 'آية الكرسي',
    description: 'The Throne Verse - Verse 255 of Al-Baqarah',
    type: 'quran',
    category: 'Quran',
  },

  // Zikr
  {
    id: 'zikr-1',
    title: 'SubhanAllah',
    titleArabic: 'سبحان الله',
    description: 'Glory be to Allah',
    type: 'zikr',
    category: 'Dhikr',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah',
  },
  {
    id: 'zikr-2',
    title: 'Alhamdulillah',
    titleArabic: 'الحمد لله',
    description: 'Praise be to Allah',
    type: 'zikr',
    category: 'Dhikr',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Praise be to Allah',
  },
  {
    id: 'zikr-3',
    title: 'Allahu Akbar',
    titleArabic: 'الله أكبر',
    description: 'Allah is the Greatest',
    type: 'zikr',
    category: 'Dhikr',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
  },

  // Wazifa
  {
    id: 'wazifa-1',
    title: 'Daily Quran Reading',
    titleArabic: 'قراءة القرآن اليومية',
    description: 'Read at least 1 page of Quran daily',
    type: 'wazifa',
    category: 'Wazifa',
  },
  {
    id: 'wazifa-2',
    title: 'Morning Dhikr',
    titleArabic: 'ذكر الصباح',
    description: 'Recite morning adhkar after Fajr',
    type: 'wazifa',
    category: 'Wazifa',
  },

  // General
  {
    id: 'general-1',
    title: 'Qibla Direction',
    titleArabic: 'اتجاه القبلة',
    description: 'Find the direction of Kaaba',
    type: 'general',
    category: 'Qibla',
  },
  {
    id: 'general-2',
    title: 'Mosque Locator',
    titleArabic: 'محدد المساجد',
    description: 'Find nearby mosques',
    type: 'general',
    category: 'Mosque',
  },
];

export const searchApp = (query: string): SearchResult[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  return searchData.filter(item => 
    item.title.toLowerCase().includes(lowercaseQuery) ||
    item.titleArabic?.toLowerCase().includes(lowercaseQuery) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.arabic?.toLowerCase().includes(lowercaseQuery) ||
    item.transliteration?.toLowerCase().includes(lowercaseQuery) ||
    item.translation?.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getSearchSuggestions = (query: string): string[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  // Get exact matches first
  const exactMatches = searchData.filter(item => 
    item.title.toLowerCase().includes(lowercaseQuery) ||
    item.titleArabic?.toLowerCase().includes(lowercaseQuery)
  );
  
  // Get partial matches
  const partialMatches = searchData.filter(item => 
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery)
  );
  
  // Combine and deduplicate
  const allMatches = [...exactMatches, ...partialMatches];
  const uniqueMatches = allMatches.filter((item, index, self) => 
    index === self.findIndex(t => t.id === item.id)
  );
  
  return uniqueMatches.slice(0, 5).map(item => item.title);
};
