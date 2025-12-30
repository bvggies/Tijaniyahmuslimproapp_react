import AlAdhanService from './alAdhanService';

export interface IslamicDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  monthNameArabic: string;
  dayName: string;
  dayNameArabic: string;
  hijriDate: string;
  gregorianDate: string;
  holidays?: string[];
}

export interface IslamicMonth {
  number: number;
  name: string;
  nameArabic: string;
  days: number;
}

export const islamicMonths: IslamicMonth[] = [
  { number: 1, name: 'Muharram', nameArabic: 'مُحَرَّم', days: 30 },
  { number: 2, name: 'Safar', nameArabic: 'صَفَر', days: 29 },
  { number: 3, name: "Rabi' al-Awwal", nameArabic: 'رَبِيع ٱلْأَوَّل', days: 30 },
  { number: 4, name: "Rabi' al-Thani", nameArabic: 'رَبِيع ٱلثَّانِي', days: 29 },
  { number: 5, name: 'Jumada al-Awwal', nameArabic: 'جُمَادَىٰ ٱلْأَوَّل', days: 30 },
  { number: 6, name: 'Jumada al-Thani', nameArabic: 'جُمَادَىٰ ٱلثَّانِي', days: 29 },
  { number: 7, name: 'Rajab', nameArabic: 'رَجَب', days: 30 },
  { number: 8, name: "Sha'ban", nameArabic: 'شَعْبَان', days: 29 },
  { number: 9, name: 'Ramadan', nameArabic: 'رَمَضَان', days: 30 },
  { number: 10, name: 'Shawwal', nameArabic: 'شَوَّال', days: 29 },
  { number: 11, name: "Dhu al-Qi'dah", nameArabic: 'ذُو ٱلْقِعْدَة', days: 30 },
  { number: 12, name: 'Dhu al-Hijjah', nameArabic: 'ذُو ٱلْحِجَّة', days: 29 },
];

export const dayNames = [
  { english: 'Sunday', arabic: 'الأحد' },
  { english: 'Monday', arabic: 'الاثنين' },
  { english: 'Tuesday', arabic: 'الثلاثاء' },
  { english: 'Wednesday', arabic: 'الأربعاء' },
  { english: 'Thursday', arabic: 'الخميس' },
  { english: 'Friday', arabic: 'الجمعة' },
  { english: 'Saturday', arabic: 'السبت' },
];

/**
 * Get current Islamic date based on timezone
 * @param timezone - Optional timezone string (e.g., 'America/New_York')
 */
export const getCurrentIslamicDate = (timezone?: string): IslamicDate => {
  const now = new Date();
  
  // Get the local date in the specified timezone
  let localDate: Date;
  if (timezone) {
    try {
      const localDateStr = now.toLocaleString('en-US', { timeZone: timezone });
      localDate = new Date(localDateStr);
    } catch {
      localDate = now;
    }
  } else {
    localDate = now;
  }
  
  // Format Gregorian date based on timezone
  const gregorianDate = timezone
    ? now.toLocaleDateString('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  
  // Convert to Hijri date
  const hijriDate = convertToHijri(localDate);
  
  const month = islamicMonths[hijriDate.month - 1];
  const dayName = dayNames[localDate.getDay()];
  
  return {
    day: hijriDate.day,
    month: hijriDate.month,
    year: hijriDate.year,
    monthName: month.name,
    monthNameArabic: month.nameArabic,
    dayName: dayName.english,
    dayNameArabic: dayName.arabic,
    hijriDate: `${hijriDate.day} ${month.nameArabic} ${hijriDate.year}`,
    gregorianDate: gregorianDate,
  };
};

/**
 * Get current Islamic date using AlAdhan API (async, more accurate)
 * Falls back to local calculation if API fails
 */
export const getCurrentIslamicDateAsync = async (timezone?: string): Promise<IslamicDate> => {
  try {
    const alAdhanService = AlAdhanService.getInstance();
    const now = new Date();
    const response = await alAdhanService.getHijriDate(now);
    
    if (response && response.data) {
      const hijri = response.data.hijri;
      const gregorian = response.data.gregorian;
      
      console.log('✅ Got Islamic date from AlAdhan API:', hijri.date);
      
      // Format Gregorian date
      const gregorianDate = timezone
        ? now.toLocaleDateString('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`;
      
      return {
        day: parseInt(hijri.day),
        month: hijri.month.number,
        year: parseInt(hijri.year),
        monthName: hijri.month.en,
        monthNameArabic: hijri.month.ar,
        dayName: hijri.weekday.en,
        dayNameArabic: hijri.weekday.ar,
        hijriDate: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
        gregorianDate,
        holidays: hijri.holidays || [],
      };
    }
    
    // Fallback to local calculation
    console.log('⚠️ AlAdhan API returned no data, using local calculation');
    return getCurrentIslamicDate(timezone);
  } catch (error) {
    console.error('❌ Error fetching from AlAdhan API:', error);
    return getCurrentIslamicDate(timezone);
  }
};

/**
 * Convert Gregorian date to Hijri using Kuwaiti algorithm
 */
const convertToHijri = (date: Date): { day: number; month: number; year: number } => {
  try {
    const gYear = date.getFullYear();
    const gMonth = date.getMonth() + 1;
    const gDay = date.getDate();
    
    // Calculate Julian Day Number
    let jd: number;
    if (gMonth <= 2) {
      jd = Math.floor((gYear - 1) / 4) - Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400) 
           + Math.floor((367 * (gMonth + 12) - 362) / 12) + gDay + Math.floor(365.25 * (gYear - 1)) 
           + 1721423.5;
    } else {
      jd = Math.floor(gYear / 4) - Math.floor(gYear / 100) + Math.floor(gYear / 400) 
           + Math.floor((367 * gMonth - 362) / 12) + gDay + Math.floor(365.25 * gYear) 
           + 1721423.5 - 2;
    }
    
    // Islamic calendar epoch (Julian Day of 1 Muharram 1 AH)
    const islamicEpoch = 1948439.5;
    
    // Calculate Islamic date using Kuwaiti algorithm
    const l = Math.floor(jd - islamicEpoch) + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) 
              + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) 
               - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    
    const hijriMonth = Math.floor((24 * l3) / 709);
    const hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
    const hijriYear = 30 * n + j - 30;
    
    return {
      day: Math.max(1, Math.min(30, hijriDay)),
      month: Math.max(1, Math.min(12, hijriMonth)),
      year: Math.max(1400, Math.min(1500, hijriYear)),
    };
  } catch (error) {
    console.error('Error converting to Hijri:', error);
    // Fallback
    return { day: 1, month: 1, year: 1446 };
  }
};

/**
 * Get upcoming Islamic events
 */
export const getUpcomingIslamicEvents = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Calculate approximate dates for Islamic events in the current Gregorian year
  // These are approximations and should be updated based on actual moon sighting
  return [
    {
      id: '1',
      title: 'Laylat al-Qadr',
      titleArabic: 'ليلة القدر',
      date: `${currentYear}-03-27`,
      hijriDate: '27 Ramadan',
      daysUntil: calculateDaysUntil(`${currentYear}-03-27`),
      description: 'Night of Power - The holiest night of Ramadan',
      isUpcoming: true,
    },
    {
      id: '2',
      title: 'Eid al-Fitr',
      titleArabic: 'عيد الفطر',
      date: `${currentYear}-04-10`,
      hijriDate: '1 Shawwal',
      daysUntil: calculateDaysUntil(`${currentYear}-04-10`),
      description: 'Festival of Breaking the Fast',
      isUpcoming: true,
    },
    {
      id: '3',
      title: 'Day of Arafah',
      titleArabic: 'يوم عرفة',
      date: `${currentYear + 1}-06-06`,
      hijriDate: '9 Dhu al-Hijjah',
      daysUntil: calculateDaysUntil(`${currentYear + 1}-06-06`),
      description: 'Most important day of Hajj',
      isUpcoming: true,
    },
    {
      id: '4',
      title: 'Eid al-Adha',
      titleArabic: 'عيد الأضحى',
      date: `${currentYear + 1}-06-07`,
      hijriDate: '10 Dhu al-Hijjah',
      daysUntil: calculateDaysUntil(`${currentYear + 1}-06-07`),
      description: 'Festival of Sacrifice',
      isUpcoming: true,
    },
    {
      id: '5',
      title: 'Islamic New Year',
      titleArabic: 'رأس السنة الهجرية',
      date: `${currentYear + 1}-06-27`,
      hijriDate: '1 Muharram',
      daysUntil: calculateDaysUntil(`${currentYear + 1}-06-27`),
      description: 'Beginning of the Islamic year',
      isUpcoming: true,
    },
    {
      id: '6',
      title: 'Day of Ashura',
      titleArabic: 'يوم عاشوراء',
      date: `${currentYear + 1}-07-06`,
      hijriDate: '10 Muharram',
      daysUntil: calculateDaysUntil(`${currentYear + 1}-07-06`),
      description: 'Day of fasting and remembrance',
      isUpcoming: true,
    },
    {
      id: '7',
      title: 'Mawlid al-Nabi',
      titleArabic: 'المولد النبوي',
      date: `${currentYear + 1}-09-05`,
      hijriDate: "12 Rabi' al-Awwal",
      daysUntil: calculateDaysUntil(`${currentYear + 1}-09-05`),
      description: "Prophet Muhammad's Birthday (PBUH)",
      isUpcoming: true,
    },
  ].filter(event => event.daysUntil >= 0).sort((a, b) => a.daysUntil - b.daysUntil);
};

/**
 * Calculate days until a given date
 */
const calculateDaysUntil = (dateStr: string): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
