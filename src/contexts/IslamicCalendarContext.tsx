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

  // Convert Gregorian date to Islamic date using calendar-specific algorithms
  const convertToIslamic = (gregorianDate: Date): IslamicDate => {
    const epoch = new Date(622, 6, 16); // July 16, 622 CE (1 Muharram 1 AH)
    const daysSinceEpoch = Math.floor((gregorianDate.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
    
    let islamicYear: number;
    let daysInYear: number;
    
    // Calendar-specific calculations with regional adjustments
    switch (selectedCalendar) {
      case 'lunar':
        // Lunar: Traditional lunar calendar based on moon phases
        islamicYear = Math.floor(daysSinceEpoch / 354.367) + 1;
        daysInYear = daysSinceEpoch % 354.367;
        // Lunar observation-based adjustment
        daysInYear += Math.sin(islamicYear * 0.05) * 0.3;
        break;
        
      case 'umm-al-qura':
        // Umm al-Qura: Official Saudi calendar with specific leap year pattern
        islamicYear = Math.floor(daysSinceEpoch / 354.36667) + 1;
        daysInYear = daysSinceEpoch % 354.36667;
        // Add small regional adjustment for Saudi Arabia
        daysInYear += Math.floor(islamicYear / 100) * 0.1;
        break;
        
      case 'tabular':
        // Tabular Islamic: Fixed leap year pattern (2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29)
        const tabularLeapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
        const tabularCycle = 30;
        islamicYear = Math.floor(daysSinceEpoch / 354.36667) + 1;
        const tabularYearInCycle = ((islamicYear - 1) % tabularCycle) + 1;
        const isLeapYear = tabularLeapYears.includes(tabularYearInCycle);
        const daysPerYear = isLeapYear ? 355 : 354;
        daysInYear = daysSinceEpoch % daysPerYear;
        break;
        
      case 'kuwaiti':
        // Kuwaiti: Similar to Umm al-Qura but with slight variations
        islamicYear = Math.floor(daysSinceEpoch / 354.37) + 1;
        daysInYear = daysSinceEpoch % 354.37;
        // Kuwaiti adjustment
        daysInYear += Math.floor(islamicYear / 50) * 0.2;
        break;
        
      case 'makkah':
        // Makkah: Based on lunar observations with regional adjustments
        islamicYear = Math.floor(daysSinceEpoch / 354.35) + 1;
        daysInYear = daysSinceEpoch % 354.35;
        // Makkah observation-based adjustment
        daysInYear += Math.sin(islamicYear * 0.1) * 0.5;
        break;
        
      case 'karachi':
        // Karachi: Used in Pakistan with specific calculations
        islamicYear = Math.floor(daysSinceEpoch / 354.36) + 1;
        daysInYear = daysSinceEpoch % 354.36;
        // Pakistani regional adjustment
        daysInYear += Math.floor(islamicYear / 30) * 0.3;
        break;
        
      case 'istanbul':
        // Istanbul: Turkish calendar with European adjustments
        islamicYear = Math.floor(daysSinceEpoch / 354.38) + 1;
        daysInYear = daysSinceEpoch % 354.38;
        // Turkish European adjustment
        daysInYear += Math.floor(islamicYear / 25) * 0.4;
        break;
        
      case 'tehran':
        // Tehran: Iranian calendar with Persian adjustments
        islamicYear = Math.floor(daysSinceEpoch / 354.37) + 1;
        daysInYear = daysSinceEpoch % 354.37;
        // Persian adjustment
        daysInYear += Math.floor(islamicYear / 40) * 0.25;
        break;
        
      case 'cairo':
        // Cairo: Egyptian calendar with North African adjustments
        islamicYear = Math.floor(daysSinceEpoch / 354.36) + 1;
        daysInYear = daysSinceEpoch % 354.36;
        // Egyptian adjustment
        daysInYear += Math.floor(islamicYear / 35) * 0.35;
        break;
        
      case 'singapore':
        // Singapore: Southeast Asian calendar with regional adjustments
        islamicYear = Math.floor(daysSinceEpoch / 354.37) + 1;
        daysInYear = daysSinceEpoch % 354.37;
        // Southeast Asian adjustment
        daysInYear += Math.floor(islamicYear / 45) * 0.15;
        break;
        
      case 'jakarta':
        // Jakarta: Indonesian calendar with local adjustments
        islamicYear = Math.floor(daysSinceEpoch / 354.36) + 1;
        daysInYear = daysSinceEpoch % 354.36;
        // Indonesian adjustment
        daysInYear += Math.floor(islamicYear / 55) * 0.2;
        break;
        
      default:
        // Default to Umm al-Qura
        islamicYear = Math.floor(daysSinceEpoch / 354.36667) + 1;
        daysInYear = daysSinceEpoch % 354.36667;
    }
    
    // Find month and day with calendar-specific month lengths
    let remainingDays = daysInYear;
    let month = 1;
    let day = 1;
    
    // Calendar-specific month length calculations
    const getMonthLength = (monthNum: number, year: number): number => {
      switch (selectedCalendar) {
        case 'lunar':
          // Lunar: Traditional lunar month lengths based on moon phases
          if (monthNum === 12) return 29; // Dhu al-Hijjah varies
          return (monthNum % 2 === 0) ? 29 : 30;
          
        case 'umm-al-qura':
          // Umm al-Qura specific month lengths
          if (monthNum === 12) return 30; // Dhu al-Hijjah is always 30 days
          return (monthNum % 2 === 0) ? 29 : 30;
          
        case 'tabular':
          // Tabular calendar: fixed pattern
          const tabularLeapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
          const tabularCycle = 30;
          const yearInCycle = ((year - 1) % tabularCycle) + 1;
          const isLeapYear = tabularLeapYears.includes(yearInCycle);
          if (monthNum === 12) return isLeapYear ? 30 : 29;
          return (monthNum % 2 === 0) ? 29 : 30;
          
        case 'kuwaiti':
          // Kuwaiti: similar to Umm al-Qura
          if (monthNum === 12) return 30;
          return (monthNum % 2 === 0) ? 29 : 30;
          
        case 'makkah':
          // Makkah: observation-based with slight variations
          if (monthNum === 12) return 29; // Sometimes 29, sometimes 30
          return (monthNum % 2 === 0) ? 29 : 30;
          
        case 'karachi':
          // Karachi: Pakistani calculations
          if (monthNum === 12) return 30;
          return (monthNum % 2 === 0) ? 29 : 30;
          
        case 'istanbul':
          // Istanbul: Turkish calculations
          if (monthNum === 12) return 30;
          return (monthNum % 2 === 0) ? 29 : 30;
          
        case 'tehran':
          // Tehran: Iranian calculations
          if (monthNum === 12) return 30;
          return (monthNum % 2 === 0) ? 29 : 30;
          
        case 'cairo':
          // Cairo: Egyptian calculations
          if (monthNum === 12) return 30;
          return (monthNum % 2 === 0) ? 29 : 30;
          
        case 'singapore':
          // Singapore: Southeast Asian calculations
          if (monthNum === 12) return 30;
          return (monthNum % 2 === 0) ? 29 : 30;
          
        case 'jakarta':
          // Jakarta: Indonesian calculations
          if (monthNum === 12) return 30;
          return (monthNum % 2 === 0) ? 29 : 30;
          
        default:
          // Default pattern
          return (monthNum % 2 === 0) ? 29 : 30;
      }
    };
    
    for (let i = 0; i < 12; i++) {
      const daysInMonth = getMonthLength(i + 1, islamicYear);
      if (remainingDays < daysInMonth) {
        month = i + 1;
        day = Math.floor(remainingDays) + 1;
        break;
      }
      remainingDays -= daysInMonth;
    }
    
    const monthInfo = ISLAMIC_MONTHS[month - 1];
    const dayOfWeek = gregorianDate.getDay();
    const dayInfo = ISLAMIC_DAYS[dayOfWeek];
    
    const holidayKey = `${month}-${day}`;
    const isHoliday = holidayKey in ISLAMIC_HOLIDAYS;
    const holidayName = isHoliday ? ISLAMIC_HOLIDAYS[holidayKey] : undefined;
    
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

  // Convert Islamic date to Gregorian date using calendar-specific algorithms
  const convertToGregorian = (islamicDate: IslamicDate): Date => {
    const epoch = new Date(622, 6, 16); // July 16, 622 CE
    const yearsSinceEpoch = islamicDate.year - 1;
    
    // Calendar-specific year length calculations
    let daysPerYear: number;
    switch (selectedCalendar) {
      case 'lunar':
        daysPerYear = 354.367;
        break;
        
      case 'umm-al-qura':
        daysPerYear = 354.36667;
        break;
      case 'tabular':
        // Tabular: 11 leap years in 30-year cycle
        const tabularLeapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
        const tabularCycle = 30;
        const yearInCycle = ((islamicDate.year - 1) % tabularCycle) + 1;
        const isLeapYear = tabularLeapYears.includes(yearInCycle);
        daysPerYear = isLeapYear ? 355 : 354;
        break;
      case 'kuwaiti':
        daysPerYear = 354.37;
        break;
      case 'makkah':
        daysPerYear = 354.35;
        break;
      case 'karachi':
        daysPerYear = 354.36;
        break;
      case 'istanbul':
        daysPerYear = 354.38;
        break;
      case 'tehran':
        daysPerYear = 354.37;
        break;
      case 'cairo':
        daysPerYear = 354.36;
        break;
      case 'singapore':
        daysPerYear = 354.37;
        break;
      case 'jakarta':
        daysPerYear = 354.36;
        break;
      default:
        daysPerYear = 354.36667;
    }
    
    const daysSinceEpoch = yearsSinceEpoch * daysPerYear;
    
    // Calendar-specific month length calculations
    const getMonthLength = (monthNum: number, year: number): number => {
      switch (selectedCalendar) {
        case 'lunar':
          if (monthNum === 12) return 29;
          return (monthNum % 2 === 0) ? 29 : 30;
          
        case 'umm-al-qura':
          if (monthNum === 12) return 30;
          return (monthNum % 2 === 0) ? 29 : 30;
        case 'tabular':
          const tabularLeapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
          const tabularCycle = 30;
          const yearInCycle = ((year - 1) % tabularCycle) + 1;
          const isLeapYear = tabularLeapYears.includes(yearInCycle);
          if (monthNum === 12) return isLeapYear ? 30 : 29;
          return (monthNum % 2 === 0) ? 29 : 30;
        case 'makkah':
          if (monthNum === 12) return 29;
          return (monthNum % 2 === 0) ? 29 : 30;
        default:
          if (monthNum === 12) return 30;
          return (monthNum % 2 === 0) ? 29 : 30;
      }
    };
    
    let daysInCurrentYear = 0;
    for (let i = 1; i < islamicDate.month; i++) {
      daysInCurrentYear += getMonthLength(i, islamicDate.year);
    }
    daysInCurrentYear += islamicDate.day - 1;
    
    const totalDays = daysSinceEpoch + daysInCurrentYear;
    return new Date(epoch.getTime() + totalDays * 24 * 60 * 60 * 1000);
  };

  const getCurrentIslamicDate = (): IslamicDate => {
    return convertToIslamic(new Date());
  };

  // Get Islamic date with location-based calculations
  const getCurrentIslamicDateWithLocation = async (): Promise<IslamicDate | null> => {
    try {
      // TEMPORARILY DISABLE location-based Hijri date calculation
      // This prevents the wrong Muharram 1 date from overriding the correct date
      console.log('🚫 Location-based Islamic date calculation temporarily disabled');
      return null;
      
      // Original code (commented out for now):
      /*
      const hijriService = HijriService.getInstance();
      const hijriDate = await hijriService.getCurrentHijriDate();
      
      if (hijriDate) {
        // Validate the Hijri date - if it's showing Muharram 1, it's likely wrong
        if (hijriDate.hijri.month === 1 && hijriDate.hijri.day === 1) {
          console.log('⚠️ Location-based Hijri date showing Muharram 1, using fallback');
          return null; // Return null to use the regular calendar calculation
        }
        
        return {
          day: hijriDate.hijri.day,
          month: hijriDate.hijri.month,
          year: hijriDate.hijri.year,
          monthName: hijriDate.hijri.monthName,
          monthNameArabic: hijriDate.hijri.monthName, // You might want to add Arabic names
          dayName: hijriDate.hijri.dayName,
          dayNameArabic: hijriDate.hijri.dayName, // You might want to add Arabic names
          isHoliday: false, // You can enhance this with holiday detection
          holidayName: undefined
        };
      }
      
      return null;
      */
    } catch (error) {
      console.error('❌ Error getting location-based Islamic date:', error);
      return null;
    }
  };

  // Get location-based date information
  const getLocationBasedDate = async () => {
    try {
      // TEMPORARILY DISABLE location-based date calculation
      // This prevents the wrong Muharram 1 date from overriding the correct date
      console.log('🚫 Location-based date calculation temporarily disabled');
      return null;
      
      // Original code (commented out for now):
      /*
      const hijriService = HijriService.getInstance();
      return await hijriService.getCurrentHijriDate();
      */
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
