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
  screen?: string;
  specialties?: string[];
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

  // Scholars
  {
    id: 'ahmad_tijani',
    title: 'Shaykh Ahmad Tijani (R.A)',
    titleArabic: 'الشيخ أحمد التجاني',
    description: 'Founder of Tariqa Tijaniyya & Seal of Muhammadan Sainthood',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Sufism', 'Islamic Law', 'Hadith', 'Tafsir', 'Spiritual Guidance', 'Seal of Sainthood'],
  },
  {
    id: 'ali_harazim_al_barada',
    title: 'Khalifat Al-Akbar, Sidi Ali Harazim Al-Barada (R.A)',
    titleArabic: 'خليفة الأكبر سيدي علي حرازم البرادة',
    description: 'Greatest Inheritor of Shaykh Ahmad Tijani & Author of Jawahir al-Ma\'ani',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Sufism', 'Spiritual Guidance', 'Jawahir al-Ma\'ani', 'Khalifa', 'Scholarship'],
  },
  {
    id: 'ali_tamasini',
    title: 'Al-Qutb Sidi Al-Hajj Ali Ibn \'Isa Tamasini (R.A)',
    titleArabic: 'القطب سيدي الحاج علي بن عيسى تاماسيني',
    description: 'Khalifa of Shaykh Ahmad Tijani & Qutb',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Qutbaniyya', 'Spiritual Training', 'Karamat', 'Healing', 'Visionary Encounters'],
  },
  {
    id: 'muhammad_ghali',
    title: 'Sidi Muhammad Al-Ghali (R.A)',
    titleArabic: 'سيدي محمد الغالي',
    description: 'Khalifa of Shaykh Ahmad Tijani & Teacher of Shaykh Al-Hajj Umar Al-Futi Tal',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Khalifa', 'Spiritual Training', 'West Africa', 'Ijaza'],
  },
  {
    id: 'ibrahim_riyahi',
    title: 'Shaykh Al-Islam Ibrahim Al-Riyahi (R.A)',
    titleArabic: 'الشيخ الإسلام إبراهيم الرياحي',
    description: 'Imam of Zaytuna University & Introducer of Tariqa Tijaniyya in Tunisia',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Maliki Fiqh', 'Zaytuna University', 'Tunisia', 'Islamic Law', 'Scholarship'],
  },
  {
    id: 'muhammad_al_hafiz_shinqiti',
    title: 'Sidi Muhammad Al-Hafiz Al-Shinqiti (R.A)',
    titleArabic: 'سيدي محمد الحافظ الشنقيطي',
    description: 'First Introducer of Tariqa Tijaniyya in Mauritania',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Mauritania', 'West Africa', 'Hadith', 'Fiqh', 'Sufism', 'Idaw Ali'],
  },
  {
    id: 'umar_al_futi_tal',
    title: 'Shaykh Al-Hajj Umar Al-Futi Tal (R.A)',
    titleArabic: 'الشيخ الحاج عمر الفوتي تال',
    description: 'Khalifa of Tariqa Tijaniyya & Jihad Leader',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Jihad', 'Islamic Law', 'Sufism', 'Political Leadership', 'Scholarship'],
  },
  {
    id: 'muhammad_al_arabi_ibn_saih',
    title: 'Shaykh Sīdi Muhammad al-Arabī bin al-Sā\'ih (R.A)',
    titleArabic: 'الشيخ سيدي محمد العربي بن السائح',
    description: 'Renowned Scholar & Spiritual Guide',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Islamic Scholarship', 'Spiritual Guidance', 'Education', 'Islamic Sciences'],
  },
  {
    id: 'ahmad_sukayrij',
    title: 'Shaykh Ahmad Sukayrij (R.A)',
    titleArabic: 'الشيخ أحمد السكايرج',
    description: 'Renowned Scholar & Author',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Islamic Scholarship', 'Literature', 'Biography', 'Morocco'],
  },
  {
    id: 'abdoulaye_niasse',
    title: 'Al-Hajj Abdoulaye Bin Mamadou Niasse (R.A)',
    titleArabic: 'الحاج عبد الله بن ممدو نياس',
    description: 'Great Scholar of Senegambia & First to Obtain Ijaza Mutlaqa',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Islamic Scholarship', 'Senegambia', 'Ijaza Mutlaqa', 'Education'],
  },
  {
    id: 'malik_sy',
    title: 'Al-Hajj Malik Sy (R.A)',
    titleArabic: 'الحاج مالك سي',
    description: 'Renowned Tijani Scholar & Educator',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Education', 'Islamic Scholarship', 'Community Leadership', 'Poetry'],
  },
  {
    id: 'ibrahim_niasse',
    title: 'Shaykh Ibrahim Niasse (R.A)',
    titleArabic: 'الشيخ إبراهيم نياس',
    description: 'Shaykh al-Islam & Global Islamic Leader',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Islamic Scholarship', 'Global Leadership', 'Preaching', 'Education', 'Shaykh al-Islam'],
  },
  {
    id: 'sheikh_abdullahi_maikano',
    title: 'Sheikh Abdullahi Maikano (R.A)',
    titleArabic: 'الشيخ عبد الله مايكانو',
    description: 'First National Chief Imam of Ghana Armed Forces',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Ghana Armed Forces', 'Islamic Leadership', 'Military Chaplaincy', 'Ghana'],
  },
  {
    id: 'muhammad_hafiz_mishiri',
    title: 'Shaykh Muhammad Al-Hafiz Al-Mishiri (R.A)',
    titleArabic: 'الشيخ محمد الحافظ المشيري',
    description: 'Renowned Scholar & Spiritual Guide',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Islamic Scholarship', 'Spiritual Guidance', 'Education', 'Tariqa Tijaniyya', 'Islamic Sciences'],
  },
  {
    id: 'muhammad_al_ghali_abu_talib',
    title: 'Al-Muqaddam Al-Sharif, Sidi Muhammad Al-Ghali Abu Talib Al-Tijani Al-Hassani (R.A)',
    titleArabic: 'المقدم الشريف سيدي محمد الغالي أبو طالب التجاني الحسني',
    description: 'Elite Companion of Shaykh Ahmad Tijani',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Elite Companion', 'Spiritual Zeal', 'Visionary Encounters', 'Propagation', 'Hijaz'],
  },
  {
    id: 'sheikh_ahmed_jallo',
    title: 'Sheikh Ahmed Abulfaid Khalifa Jallo (R.A)',
    titleArabic: 'الشيخ أحمد أبو الفيض خليفة جالو',
    description: 'President & Supreme Leader of Tijaniyya Muslim Council of Ghana',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tariqa Tijaniyya', 'Leadership', 'Peace & Unity', 'Community Building', 'Interfaith Relations', 'Ghana'],
  },
  {
    id: 'imam_an_nawawi',
    title: 'Imam An-Nawawi (R.A)',
    titleArabic: 'الإمام النووي',
    description: 'Shaykh al-Islam & Hadith Scholar',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Hadith', 'Fiqh', 'Shafi\'i School', 'Spirituality', 'Scholarship'],
  },
  {
    id: 'ibn_kathir',
    title: 'Ibn Kathir (R.A)',
    titleArabic: 'ابن كثير',
    description: 'Mufassir & Historian',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Tafsir', 'History', 'Hadith', 'Fiqh', 'Shafi\'i School'],
  },
  {
    id: 'imam_al_ghazali',
    title: 'Imam Al-Ghazali (R.A)',
    titleArabic: 'الإمام الغزالي',
    description: 'Hujjat al-Islam & Theologian',
    type: 'scholar',
    category: 'Scholars',
    screen: 'Scholars',
    specialties: ['Aqidah', 'Tasawwuf', 'Philosophy', 'Fiqh', 'Shafi\'i School', 'Theology'],
  },

  // General
  {
    id: 'general-1',
    title: 'Qibla Direction',
    titleArabic: 'اتجاه القبلة',
    description: 'Find the direction of Kaaba',
    type: 'general',
    category: 'Qibla',
    screen: 'Qibla',
  },
  {
    id: 'general-2',
    title: 'Mosque Locator',
    titleArabic: 'محدد المساجد',
    description: 'Find nearby mosques',
    type: 'general',
    category: 'Mosque',
    screen: 'Mosque',
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
    item.category.toLowerCase().includes(lowercaseQuery) ||
    item.specialties?.some(specialty => specialty.toLowerCase().includes(lowercaseQuery))
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
