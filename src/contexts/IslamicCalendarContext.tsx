import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationService from '../services/locationService';
import HijriService from '../services/hijriService';

export type IslamicCalendarType = 
  | 'lunar'            // Lunar calendar (default)
  | 'umm-al-qura'      // Saudi Arabia (Umm al-Qura)
  | 'tabular'          // Tabular Islamic calendar
  | 'kuwaiti'          // Kuwaiti algorithm
  | 'makkah'           // Makkah calendar
  | 'karachi'          // Karachi (Pakistan) calendar
  | 'istanbul'         // Istanbul (Turkey) calendar
  | 'tehran'           // Tehran (Iran) calendar
  | 'cairo'            // Cairo (Egypt) calendar
  | 'singapore'        // Singapore calendar
  | 'jakarta';         // Jakarta (Indonesia) calendar

export interface IslamicDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  monthNameArabic: string;
  dayName: string;
  dayNameArabic: string;
  isHoliday?: boolean;
  holidayName?: string;
}

export interface IslamicCalendarInfo {
  type: IslamicCalendarType;
  name: string;
  description: string;
  region: string;
  accuracy: 'high' | 'medium' | 'low';
}

interface IslamicCalendarContextType {
  selectedCalendar: IslamicCalendarType;
  setSelectedCalendar: (calendar: IslamicCalendarType) => void;
  getCurrentIslamicDate: () => IslamicDate;
  getCurrentIslamicDateWithLocation: () => Promise<IslamicDate | null>;
  getCalendarInfo: (type: IslamicCalendarType) => IslamicCalendarInfo;
  getAllCalendars: () => IslamicCalendarInfo[];
  convertToIslamic: (gregorianDate: Date) => IslamicDate;
  convertToGregorian: (islamicDate: IslamicDate) => Date;
  getLocationBasedDate: () => Promise<any>;
}

const IslamicCalendarContext = createContext<IslamicCalendarContextType | undefined>(undefined);

const ISLAMIC_CALENDAR_STORAGE_KEY = 'tijaniyah_islamic_calendar';

// Islamic calendar information
const CALENDAR_INFO: Record<IslamicCalendarType, IslamicCalendarInfo> = {
  'lunar': {
    type: 'lunar',
    name: 'Lunar Calendar',
    description: 'Traditional lunar calendar based on moon phases and observations',
    region: 'Global',
    accuracy: 'high'
  },
  'umm-al-qura': {
    type: 'umm-al-qura',
    name: 'Umm al-Qura',
    description: 'Official calendar of Saudi Arabia, used for Hajj and Ramadan',
    region: 'Saudi Arabia',
    accuracy: 'high'
  },
  'tabular': {
    type: 'tabular',
    name: 'Tabular Islamic',
    description: 'Mathematical calendar with fixed leap year pattern',
    region: 'Global',
    accuracy: 'high'
  },
  'kuwaiti': {
    type: 'kuwaiti',
    name: 'Kuwaiti Algorithm',
    description: 'Used in Kuwait and some Gulf countries',
    region: 'Kuwait',
    accuracy: 'high'
  },
  'makkah': {
    type: 'makkah',
    name: 'Makkah Calendar',
    description: 'Based on Makkah sighting, used in some regions',
    region: 'Makkah',
    accuracy: 'medium'
  },
  'karachi': {
    type: 'karachi',
    name: 'Karachi Calendar',
    description: 'Used in Pakistan and some South Asian countries',
    region: 'Pakistan',
    accuracy: 'high'
  },
  'istanbul': {
    type: 'istanbul',
    name: 'Istanbul Calendar',
    description: 'Used in Turkey and some European countries',
    region: 'Turkey',
    accuracy: 'high'
  },
  'tehran': {
    type: 'tehran',
    name: 'Tehran Calendar',
    description: 'Used in Iran and some Central Asian countries',
    region: 'Iran',
    accuracy: 'high'
  },
  'cairo': {
    type: 'cairo',
    name: 'Cairo Calendar',
    description: 'Used in Egypt and some North African countries',
    region: 'Egypt',
    accuracy: 'high'
  },
  'singapore': {
    type: 'singapore',
    name: 'Singapore Calendar',
    description: 'Used in Singapore and some Southeast Asian countries',
    region: 'Singapore',
    accuracy: 'high'
  },
  'jakarta': {
    type: 'jakarta',
    name: 'Jakarta Calendar',
    description: 'Used in Indonesia and some Southeast Asian countries',
    region: 'Indonesia',
    accuracy: 'high'
  }
};

// Islamic month names
const ISLAMIC_MONTHS = [
  { name: 'Muharram', arabic: 'محرم' },
  { name: 'Safar', arabic: 'صفر' },
  { name: 'Rabi\' al-awwal', arabic: 'ربيع الأول' },
  { name: 'Rabi\' al-thani', arabic: 'ربيع الثاني' },
  { name: 'Jumada al-awwal', arabic: 'جمادى الأولى' },
  { name: 'Jumada al-thani', arabic: 'جمادى الثانية' },
  { name: 'Rajab', arabic: 'رجب' },
  { name: 'Sha\'ban', arabic: 'شعبان' },
  { name: 'Ramadan', arabic: 'رمضان' },
  { name: 'Shawwal', arabic: 'شوال' },
  { name: 'Dhu al-Qi\'dah', arabic: 'ذو القعدة' },
  { name: 'Dhu al-Hijjah', arabic: 'ذو الحجة' }
];

// Islamic day names
const ISLAMIC_DAYS = [
  { name: 'Sunday', arabic: 'الأحد' },
  { name: 'Monday', arabic: 'الاثنين' },
  { name: 'Tuesday', arabic: 'الثلاثاء' },
  { name: 'Wednesday', arabic: 'الأربعاء' },
  { name: 'Thursday', arabic: 'الخميس' },
  { name: 'Friday', arabic: 'الجمعة' },
  { name: 'Saturday', arabic: 'السبت' }
];

// Islamic holidays
const ISLAMIC_HOLIDAYS: Record<string, string> = {
  '1-1': 'Islamic New Year',
  '1-10': 'Day of Ashura',
  '3-12': 'Mawlid al-Nabi',
  '7-27': 'Laylat al-Mi\'raj',
  '8-15': 'Laylat al-Bara\'ah',
  '9-1': 'First Day of Ramadan',
  '9-27': 'Laylat al-Qadr',
  '10-1': 'Eid al-Fitr',
  '12-8': 'Day of Tarwiyah',
  '12-9': 'Day of Arafah',
  '12-10': 'Eid al-Adha',
  '12-11': 'Days of Tashriq',
  '12-12': 'Days of Tashriq',
  '12-13': 'Days of Tashriq'
};

export const IslamicCalendarProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCalendar, setSelectedCalendarState] = useState<IslamicCalendarType>('lunar');

  useEffect(() => {
    const loadSelectedCalendar = async () => {
      try {
        const storedCalendar = await AsyncStorage.getItem(ISLAMIC_CALENDAR_STORAGE_KEY);
        if (storedCalendar && storedCalendar in CALENDAR_INFO) {
          setSelectedCalendarState(storedCalendar as IslamicCalendarType);
        }
      } catch (error) {
        console.error('Failed to load Islamic calendar from AsyncStorage', error);
      }
    };
    loadSelectedCalendar();
  }, []);

  const setSelectedCalendar = async (calendar: IslamicCalendarType) => {
    try {
      setSelectedCalendarState(calendar);
      await AsyncStorage.setItem(ISLAMIC_CALENDAR_STORAGE_KEY, calendar);
    } catch (error) {
      console.error('Failed to save Islamic calendar to AsyncStorage', error);
    }
  };

  // Convert Gregorian date to Islamic date using correct tabular algorithm
  const convertToIslamic = (gregorianDate: Date): IslamicDate => {
    // Calculate Julian Day Number from Gregorian date
    const gYear = gregorianDate.getFullYear();
    const gMonth = gregorianDate.getMonth() + 1;
    const gDay = gregorianDate.getDate();
    
    // Convert to Julian Day Number
    const a = Math.floor((14 - gMonth) / 12);
    const y = gYear + 4800 - a;
    const m = gMonth + 12 * a - 3;
    const jd = gDay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Islamic calendar epoch: July 16, 622 CE (Julian) = JD 1948440
    const islamicEpoch = 1948440;
    
    // Days since Islamic epoch
    const daysSinceEpoch = jd - islamicEpoch;
    
    if (daysSinceEpoch < 0) {
      // Before Islamic calendar - return placeholder
      return createDefaultIslamicDate(gregorianDate);
    }
    
    // Tabular Islamic Calendar calculation
    // 30-year cycle = 10631 days
    // Leap years in each cycle: 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29
    const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
    const cycleLength = 10631; // days in a 30-year cycle
    
    // Find the cycle and remaining days
    const cycles = Math.floor(daysSinceEpoch / cycleLength);
    let remainingDays = daysSinceEpoch % cycleLength;
    
    // Find year within the 30-year cycle
    let yearInCycle = 0;
    for (let i = 1; i <= 30; i++) {
      const isLeap = leapYears.includes(i);
      const daysInYear = isLeap ? 355 : 354;
      if (remainingDays < daysInYear) {
        yearInCycle = i;
        break;
      }
      remainingDays -= daysInYear;
    }
    
    // Calculate the Islamic year
    const islamicYear = cycles * 30 + yearInCycle;
    
    // Find month and day
    // Odd months: 30 days, Even months: 29 days
    // Month 12 has 30 days in leap years
    const isLeapYear = leapYears.includes(yearInCycle);
    let month = 1;
    let day = remainingDays + 1; // +1 because days are 1-indexed
    
    for (let m = 1; m <= 12; m++) {
      let daysInMonth: number;
      if (m % 2 === 1) {
        daysInMonth = 30; // Odd months have 30 days
      } else if (m === 12 && isLeapYear) {
        daysInMonth = 30; // Month 12 in leap year has 30 days
      } else {
        daysInMonth = 29; // Even months have 29 days
      }
      
      if (day <= daysInMonth) {
        month = m;
        break;
      }
      day -= daysInMonth;
    }
    
    // Ensure valid values
    day = Math.max(1, Math.min(30, day));
    month = Math.max(1, Math.min(12, month));
    
    // Get month and day names
    const monthNames = [
      { name: 'Muharram', arabic: 'محرم' },
      { name: 'Safar', arabic: 'صفر' },
      { name: "Rabi' al-Awwal", arabic: 'ربيع الأول' },
      { name: "Rabi' al-Thani", arabic: 'ربيع الثاني' },
      { name: 'Jumada al-Awwal', arabic: 'جمادى الأولى' },
      { name: 'Jumada al-Thani', arabic: 'جمادى الآخرة' },
      { name: 'Rajab', arabic: 'رجب' },
      { name: "Sha'ban", arabic: 'شعبان' },
      { name: 'Ramadan', arabic: 'رمضان' },
      { name: 'Shawwal', arabic: 'شوال' },
      { name: "Dhu al-Qi'dah", arabic: 'ذو القعدة' },
      { name: 'Dhu al-Hijjah', arabic: 'ذو الحجة' },
    ];
    
    const dayNames = [
      { name: 'Sunday', arabic: 'الأحد' },
      { name: 'Monday', arabic: 'الإثنين' },
      { name: 'Tuesday', arabic: 'الثلاثاء' },
      { name: 'Wednesday', arabic: 'الأربعاء' },
      { name: 'Thursday', arabic: 'الخميس' },
      { name: 'Friday', arabic: 'الجمعة' },
      { name: 'Saturday', arabic: 'السبت' },
    ];
    
    const dayOfWeek = gregorianDate.getDay();
    const monthInfo = monthNames[month - 1];
    const dayInfo = dayNames[dayOfWeek];
    
    // Check for holidays
    const holidayKey = `${month}-${day}`;
    const isHoliday = holidayKey in ISLAMIC_HOLIDAYS;
    const holidayName = isHoliday ? ISLAMIC_HOLIDAYS[holidayKey] : undefined;
    
    console.log(`🌙 Hijri conversion: ${gDay}/${gMonth}/${gYear} -> ${day} ${monthInfo.name} ${islamicYear} AH`);
    
    return {
      day,
      month,
      year: islamicYear,
      monthName: monthInfo.name,
      monthNameArabic: monthInfo.arabic,
      dayName: dayInfo.name,
      dayNameArabic: dayInfo.arabic,
      isHoliday,
      holidayName
    };
  };
  
  // Helper function for creating default Islamic date
  const createDefaultIslamicDate = (gregorianDate: Date): IslamicDate => {
    const dayOfWeek = gregorianDate.getDay();
    const dayNames = [
      { name: 'Sunday', arabic: 'الأحد' },
      { name: 'Monday', arabic: 'الإثنين' },
      { name: 'Tuesday', arabic: 'الثلاثاء' },
      { name: 'Wednesday', arabic: 'الأربعاء' },
      { name: 'Thursday', arabic: 'الخميس' },
      { name: 'Friday', arabic: 'الجمعة' },
      { name: 'Saturday', arabic: 'السبت' },
    ];
    return {
      day: 1,
      month: 1,
      year: 1,
      monthName: 'Muharram',
      monthNameArabic: 'محرم',
      dayName: dayNames[dayOfWeek].name,
      dayNameArabic: dayNames[dayOfWeek].arabic,
    };
  };
  

  // Convert Islamic date to Gregorian date using proper tabular algorithm
  const convertToGregorian = (islamicDate: IslamicDate): Date => {
    const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
    
    // Calculate days from Islamic epoch
    const year = islamicDate.year;
    const month = islamicDate.month;
    const day = islamicDate.day;
    
    // Calculate complete 30-year cycles
    const completeCycles = Math.floor((year - 1) / 30);
    const remainingYears = (year - 1) % 30;
    
    // Days in complete cycles (10631 days per cycle)
    let totalDays = completeCycles * 10631;
    
    // Days in remaining complete years
    for (let y = 1; y <= remainingYears; y++) {
      const isLeap = leapYears.includes(y);
      totalDays += isLeap ? 355 : 354;
    }
    
    // Days in complete months of current year
    const yearInCycle = ((year - 1) % 30) + 1;
    const isLeapYear = leapYears.includes(yearInCycle);
    
    for (let m = 1; m < month; m++) {
      if (m % 2 === 1) {
        totalDays += 30; // Odd months have 30 days
      } else if (m === 12 && isLeapYear) {
        totalDays += 30; // Month 12 in leap year
      } else {
        totalDays += 29; // Even months have 29 days
      }
    }
    
    // Add remaining days
    totalDays += day - 1;
    
    // Convert Julian Day to Gregorian
    // Islamic epoch JD = 1948440
    const jd = 1948440 + totalDays;
    
    // Convert JD to Gregorian date
    const z = jd;
    const a = Math.floor((z - 1867216.25) / 36524.25);
    const aa = z + 1 + a - Math.floor(a / 4);
    const b = aa + 1524;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);
    
    const gDay = b - d - Math.floor(30.6001 * e);
    const gMonth = e < 14 ? e - 1 : e - 13;
    const gYear = gMonth > 2 ? c - 4716 : c - 4715;
    
    return new Date(gYear, gMonth - 1, gDay);
  };

  const getCurrentIslamicDate = (): IslamicDate => {
    return convertToIslamic(new Date());
  };

  // Get Islamic date with location-based calculations
  const getCurrentIslamicDateWithLocation = async (): Promise<IslamicDate | null> => {
    try {
      const hijriService = HijriService.getInstance();
      const hijriDate = await hijriService.getCurrentHijriDate();
      
      if (hijriDate) {
        const holidayKey = `${hijriDate.hijri.month}-${hijriDate.hijri.day}`;
        const isHoliday = holidayKey in ISLAMIC_HOLIDAYS;
        const holidayName = isHoliday ? ISLAMIC_HOLIDAYS[holidayKey] : undefined;
        
        return {
          day: hijriDate.hijri.day,
          month: hijriDate.hijri.month,
          year: hijriDate.hijri.year,
          monthName: hijriDate.hijri.monthName,
          monthNameArabic: hijriDate.hijri.monthNameArabic,
          dayName: hijriDate.hijri.dayName,
          dayNameArabic: hijriDate.hijri.dayNameArabic,
          isHoliday,
          holidayName
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting location-based Islamic date:', error);
      return null;
    }
  };

  // Get location-based date information (returns full date display with timezone info)
  const getLocationBasedDate = async () => {
    try {
      const hijriService = HijriService.getInstance();
      return await hijriService.getCurrentHijriDate();
    } catch (error) {
      console.error('❌ Error getting location-based date:', error);
      return null;
    }
  };

  const getCalendarInfo = (type: IslamicCalendarType): IslamicCalendarInfo => {
    return CALENDAR_INFO[type];
  };

  const getAllCalendars = (): IslamicCalendarInfo[] => {
    return Object.values(CALENDAR_INFO);
  };

  return (
    <IslamicCalendarContext.Provider
      value={{
        selectedCalendar,
        setSelectedCalendar,
        getCurrentIslamicDate,
        getCurrentIslamicDateWithLocation,
        getCalendarInfo,
        getAllCalendars,
        convertToIslamic,
        convertToGregorian,
        getLocationBasedDate
      }}
    >
      {children}
    </IslamicCalendarContext.Provider>
  );
};

export const useIslamicCalendar = () => {
  const context = useContext(IslamicCalendarContext);
  if (context === undefined) {
    throw new Error('useIslamicCalendar must be used within an IslamicCalendarProvider');
  }
  return context;
};
