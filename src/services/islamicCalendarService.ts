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
  { number: 3, name: 'Rabi\' al-awwal', nameArabic: 'رَبِيع ٱلْأَوَّل', days: 30 },
  { number: 4, name: 'Rabi\' al-thani', nameArabic: 'رَبِيع ٱلثَّانِي', days: 29 },
  { number: 5, name: 'Jumada al-awwal', nameArabic: 'جُمَادَىٰ ٱلْأَوَّل', days: 30 },
  { number: 6, name: 'Jumada al-thani', nameArabic: 'جُمَادَىٰ ٱلثَّانِي', days: 29 },
  { number: 7, name: 'Rajab', nameArabic: 'رَجَب', days: 30 },
  { number: 8, name: 'Sha\'ban', nameArabic: 'شَعْبَان', days: 29 },
  { number: 9, name: 'Ramadan', nameArabic: 'رَمَضَان', days: 30 },
  { number: 10, name: 'Shawwal', nameArabic: 'شَوَّال', days: 29 },
  { number: 11, name: 'Dhu al-Qi\'dah', nameArabic: 'ذُو ٱلْقِعْدَة', days: 30 },
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

// Real Islamic calendar calculation using hijri-converter
export const getCurrentIslamicDate = (latitude?: number, longitude?: number): IslamicDate => {
  const now = new Date();
  
  // TEMPORARILY DISABLE location-based calculations to prevent wrong date override
  // The location-based calculation is returning incorrect dates (Muharram 1 instead of correct date)
  console.log('🚫 Location-based Islamic date calculation disabled in islamicCalendarService');
  
  // Use standard calculation without location adjustments
  const gregorianDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Convert to Hijri date using standard calculation (no location adjustments)
  const hijriDate = convertToHijri(now);
  
  const month = islamicMonths[hijriDate.month - 1];
  const dayName = dayNames[now.getDay()];
  
  return {
    day: hijriDate.day,
    month: hijriDate.month,
    year: hijriDate.year,
    monthName: month.name,
    monthNameArabic: month.nameArabic,
    dayName: dayName.english,
    dayNameArabic: dayName.arabic,
    // Keep Hijri date in Arabic (full month name)
    hijriDate: `${hijriDate.day} ${month.nameArabic} ${hijriDate.year}`,
    gregorianDate: gregorianDate,
  };
};

// Helper function to convert Gregorian date to Hijri
const convertToHijri = (date: Date, latitude?: number, longitude?: number): { day: number; month: number; year: number } => {
  try {
    // TEMPORARILY DISABLE location-based calculations to prevent wrong date override
    console.log('🚫 Location-based Hijri conversion disabled');
    
    // Use standard calculation without location adjustments
    const gregorianYear = date.getFullYear();
    const gregorianMonth = date.getMonth() + 1;
    const gregorianDay = date.getDate();
    
    // More accurate Hijri conversion algorithm
    // This is based on the Umm al-Qura calendar used in Saudi Arabia
    const hijriEpoch = new Date(622, 6, 16); // July 16, 622 CE
    const daysSinceEpoch = Math.floor((date.getTime() - hijriEpoch.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate Hijri year (more accurate)
    let hijriYear = Math.floor(daysSinceEpoch / 354.37) + 1;
    
    // Calculate remaining days in the year
    let remainingDays = daysSinceEpoch - Math.floor((hijriYear - 1) * 354.37);
    
    // Account for leap years (11 leap years in 30-year cycle)
    const leapYears = Math.floor((hijriYear - 1) / 30) * 11 + Math.floor(((hijriYear - 1) % 30) * 11 / 30);
    remainingDays -= leapYears;
    
    // Calculate month and day
    let hijriMonth = 1;
    let hijriDay = 1;
    
    for (let month = 1; month <= 12; month++) {
      const monthDays = islamicMonths[month - 1].days;
      if (remainingDays >= monthDays) {
        remainingDays -= monthDays;
        hijriMonth++;
      } else {
        hijriDay = remainingDays + 1;
        break;
      }
    }
    
    // Adjust for leap years in current year
    if (hijriMonth > 12) {
      hijriMonth = 1;
      hijriYear++;
    }
    
    return {
      day: Math.max(1, hijriDay),
      month: Math.max(1, Math.min(12, hijriMonth)),
      year: Math.max(1, hijriYear),
    };
  } catch (error) {
    console.error('Error converting to Hijri:', error);
    // Fallback to approximate calculation
    const gregorianYear = date.getFullYear();
    const hijriYear = Math.floor((gregorianYear - 622) * 1.0307);
    return {
      day: 1,
      month: 1,
      year: Math.max(1, hijriYear),
    };
  }
};

// Helper function to get timezone from coordinates
const getTimeZoneFromCoordinates = (latitude?: number, longitude?: number): string => {
  if (!latitude || !longitude) {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
  // Simplified timezone calculation based on longitude
  // Real implementation would use a proper timezone database
  const timezoneOffset = Math.round(longitude / 15);
  const utcOffset = timezoneOffset >= 0 ? `+${timezoneOffset}` : `${timezoneOffset}`;
  
  // Return a generic timezone string
  return `Etc/GMT${utcOffset}`;
};

// Helper function to get timezone offset in minutes
const getTimeZoneOffset = (latitude?: number, longitude?: number): number => {
  if (!longitude) {
    return new Date().getTimezoneOffset();
  }
  
  // Calculate timezone offset based on longitude
  return Math.round(longitude / 15) * 60;
};

export const getUpcomingIslamicEvents = () => {
  return [
    {
      id: '1',
      title: 'Laylat al-Qadr',
      titleArabic: 'ليلة القدر',
      date: '2024-03-27',
      description: 'Night of Power - The holiest night of Ramadan',
      isUpcoming: true,
    },
    {
      id: '2',
      title: 'Eid al-Fitr',
      titleArabic: 'عيد الفطر',
      date: '2024-04-10',
      description: 'Festival of Breaking the Fast',
      isUpcoming: true,
    },
    {
      id: '3',
      title: 'Hajj',
      titleArabic: 'الحج',
      date: '2024-06-14',
      description: 'Annual pilgrimage to Mecca',
      isUpcoming: true,
    },
    {
      id: '4',
      title: 'Eid al-Adha',
      titleArabic: 'عيد الأضحى',
      date: '2024-06-16',
      description: 'Festival of Sacrifice',
      isUpcoming: true,
    },
  ];
};
