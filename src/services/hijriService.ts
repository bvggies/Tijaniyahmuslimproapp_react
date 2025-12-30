/**
 * Hijri Date Service
 * 
 * Provides accurate Islamic (Hijri) calendar dates based on user location.
 * 
 * PRIMARY MARKET: Ghana (West Africa)
 * - Defaults to Africa/Accra timezone (GMT+0, no DST)
 * - Automatically detects West African countries and uses Ghana timezone
 * - Uses AlAdhan API for accurate dates with local calculation fallback
 * 
 * The service ensures that Hijri dates are calculated based on the local
 * date in the user's timezone, not UTC, which is critical for accuracy.
 */

import HijriDate from 'hijri-date';
import LocationService, { UserLocation } from './locationService';
import AlAdhanService from './alAdhanService';

export interface HijriDateInfo {
  day: number;
  month: number;
  year: number;
  monthName: string;
  monthNameArabic: string;
  dayName: string;
  dayNameArabic: string;
  fullDate: string;
  fullDateArabic: string;
  isToday: boolean;
}

export interface IslamicDateDisplay {
  hijri: HijriDateInfo;
  gregorian: {
    day: number;
    month: number;
    year: number;
    monthName: string;
    dayName: string;
    fullDate: string;
  };
  location: {
    city: string;
    country: string;
    timezone: string;
  };
  localTime: string;
}

// Islamic month names with Arabic
const ISLAMIC_MONTHS = [
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

// Day names with Arabic
const DAY_NAMES = [
  { name: 'Sunday', arabic: 'الأحد' },
  { name: 'Monday', arabic: 'الإثنين' },
  { name: 'Tuesday', arabic: 'الثلاثاء' },
  { name: 'Wednesday', arabic: 'الأربعاء' },
  { name: 'Thursday', arabic: 'الخميس' },
  { name: 'Friday', arabic: 'الجمعة' },
  { name: 'Saturday', arabic: 'السبت' },
];

class HijriService {
  private static instance: HijriService;
  private locationService: LocationService;

  constructor() {
    this.locationService = LocationService.getInstance();
  }

  static getInstance(): HijriService {
    if (!HijriService.instance) {
      HijriService.instance = new HijriService();
    }
    return HijriService.instance;
  }

  /**
   * Get current Hijri date based on user's location/timezone
   * Uses AlAdhan API for accurate dates with local fallback
   * Defaults to Ghana (Africa/Accra) timezone for West Africa
   */
  async getCurrentHijriDate(): Promise<IslamicDateDisplay | null> {
    try {
      // Try to get user's location for timezone
      const location = await this.locationService.getUserLocation();
      
      // Get the device's timezone
      const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Default to Ghana timezone for West Africa if not detected
      let timezone = location?.timezone || deviceTimezone;
      
      // If in West Africa region but timezone not detected, use Ghana timezone
      if (location?.country && ['Ghana', 'Nigeria', 'Senegal', 'Mali', 'Burkina Faso', 'Niger', 'Togo', 'Benin', 'Ivory Coast', 'Guinea'].includes(location.country)) {
        if (!timezone || timezone === 'UTC') {
          timezone = 'Africa/Accra'; // Ghana timezone (GMT+0, no DST)
        }
      }
      
      // Default to Ghana if no location detected (app is primarily for Ghana)
      if (!timezone || timezone === 'UTC') {
        timezone = 'Africa/Accra';
      }
      
      console.log('🌍 Using timezone:', timezone);
      console.log('📍 Location:', location?.city || 'Unknown', location?.country || 'Unknown');

      // Get the current date in the user's timezone (important for accurate Hijri date)
      // This is critical for Ghana users - we must use Ghana's local date, not UTC
      const now = new Date();
      const localYear = parseInt(now.toLocaleString('en-US', { timeZone: timezone, year: 'numeric' }));
      const localMonth = parseInt(now.toLocaleString('en-US', { timeZone: timezone, month: 'numeric' }));
      const localDay = parseInt(now.toLocaleString('en-US', { timeZone: timezone, day: 'numeric' }));
      
      // Create a date object using local components for calculation
      const localDate = new Date(localYear, localMonth - 1, localDay);
      
      console.log('📅 Local date in', timezone + ':', `${localDay}/${localMonth}/${localYear}`);
      console.log('📅 Date for calculation:', localDate.toDateString());
      
      // Try AlAdhan API first for accurate Hijri date
      try {
        const alAdhanService = AlAdhanService.getInstance();
        // Pass the local date - AlAdhan API will use it correctly
        const alAdhanResponse = await alAdhanService.getHijriDate(localDate);
        
        if (alAdhanResponse && alAdhanResponse.data) {
          const hijri = alAdhanResponse.data.hijri;
          const gregorian = alAdhanResponse.data.gregorian;
          
          console.log('✅ Using AlAdhan API for Hijri date:', hijri.date);
          console.log('📅 Gregorian date from API:', gregorian.date);
          
          // Check for Islamic holidays
          const holidays = hijri.holidays || [];
          
          const hijriInfo: HijriDateInfo = {
            day: parseInt(hijri.day),
            month: hijri.month.number,
            year: parseInt(hijri.year),
            monthName: hijri.month.en,
            monthNameArabic: hijri.month.ar,
            dayName: hijri.weekday.en,
            dayNameArabic: hijri.weekday.ar,
            fullDate: `${hijri.day} ${hijri.month.en} ${hijri.year} AH`,
            fullDateArabic: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
            isToday: true,
          };

          const gregorianInfo = {
            day: parseInt(gregorian.day),
            month: gregorian.month.number,
            year: parseInt(gregorian.year),
            monthName: gregorian.month.en,
            dayName: gregorian.weekday.en,
            fullDate: `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`,
          };

          // Get local time for the timezone
          const localTime = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timezone,
            hour12: true,
          });

          return {
            hijri: hijriInfo,
            gregorian: gregorianInfo,
            location: {
              city: location?.city || 'Local',
              country: location?.country || '',
              timezone: timezone,
            },
            localTime,
          };
        }
      } catch (alAdhanError) {
        console.log('⚠️ AlAdhan API failed, using local calculation');
        console.error('AlAdhan error:', alAdhanError);
      }

      // Fallback to local calculation
      return this.getHijriDateForTimezone(timezone, location);
    } catch (error) {
      console.error('❌ Error getting Hijri date:', error);
      return this.getFallbackHijriDate();
    }
  }

  /**
   * Get Hijri date for specific timezone
   * Properly handles Ghana (Africa/Accra) timezone
   */
  getHijriDateForTimezone(timezone: string, location?: UserLocation | null): IslamicDateDisplay {
    try {
      // Get current date in the specified timezone
      const now = new Date();
      
      // Get the local date components directly (more reliable)
      const localYear = parseInt(now.toLocaleString('en-US', { timeZone: timezone, year: 'numeric' }));
      const localMonth = parseInt(now.toLocaleString('en-US', { timeZone: timezone, month: 'numeric' }));
      const localDay = parseInt(now.toLocaleString('en-US', { timeZone: timezone, day: 'numeric' }));
      
      console.log('🗓️ Local date in', timezone + ':', `${localDay}/${localMonth}/${localYear}`);
      
      // Create a date object for calculation (using local date components)
      // Note: We use local components to ensure correct Hijri date calculation
      const localDate = new Date(localYear, localMonth - 1, localDay);
      
      // Calculate Hijri date using the accurate algorithm with local date
      const hijriInfo = this.calculateHijriDate(localDate);
      
      console.log('🌙 Calculated Hijri date:', `${hijriInfo.day} ${hijriInfo.monthName} ${hijriInfo.year} AH`);

      // Get Gregorian date info for the timezone
      const gregorianInfo = {
        day: localDay,
        month: localMonth,
        year: localYear,
        monthName: now.toLocaleDateString('en-US', { month: 'long', timeZone: timezone }),
        dayName: now.toLocaleDateString('en-US', { weekday: 'long', timeZone: timezone }),
        fullDate: now.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          timeZone: timezone 
        }),
      };

      // Get local time
      const localTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
        hour12: true,
      });

      return {
        hijri: hijriInfo,
        gregorian: gregorianInfo,
        location: {
          city: location?.city || 'Local',
          country: location?.country || '',
          timezone: timezone,
        },
        localTime,
      };

    } catch (error) {
      console.error('❌ Error creating Hijri date:', error);
      return this.getFallbackHijriDate();
    }
  }

  /**
   * Calculate Hijri date from Gregorian date - uses AlAdhan API with fallback
   */
  private calculateHijriDate(gregorianDate: Date): HijriDateInfo {
    // For sync calls, use local calculation
    // AlAdhan API will be used in the async method
    return this.localHijriCalculation(gregorianDate);
  }

  /**
   * Get Hijri date from AlAdhan API (async)
   */
  async getHijriDateFromAPI(gregorianDate?: Date): Promise<HijriDateInfo | null> {
    try {
      const alAdhanService = AlAdhanService.getInstance();
      const date = gregorianDate || new Date();
      const response = await alAdhanService.getHijriDate(date);
      
      if (response && response.data?.hijri) {
        const hijri = response.data.hijri;
        const gregorian = response.data.gregorian;
        
        console.log('✅ Got Hijri date from AlAdhan API:', hijri.date);
        
        return {
          day: parseInt(hijri.day),
          month: hijri.month.number,
          year: parseInt(hijri.year),
          monthName: hijri.month.en,
          monthNameArabic: hijri.month.ar,
          dayName: hijri.weekday.en,
          dayNameArabic: hijri.weekday.ar,
          fullDate: `${hijri.day} ${hijri.month.en} ${hijri.year} AH`,
          fullDateArabic: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
          isToday: this.isToday(date),
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting Hijri date from AlAdhan API:', error);
      return null;
    }
  }

  /**
   * Local Hijri calculation using hijri-date library
   */
  private localHijriCalculation(gregorianDate: Date): HijriDateInfo {
    try {
      // Try using the hijri-date library first
      const hijri = new HijriDate(gregorianDate);
      const hijriDay = hijri.getDate();
      const hijriMonth = hijri.getMonth() + 1; // Library uses 0-based months
      const hijriYear = hijri.getFullYear();
      
      // Validate the library result
      if (hijriYear >= 1400 && hijriYear <= 1500 && hijriMonth >= 1 && hijriMonth <= 12 && hijriDay >= 1 && hijriDay <= 30) {
        const monthInfo = ISLAMIC_MONTHS[hijriMonth - 1];
        const dayOfWeek = gregorianDate.getDay();
        const dayInfo = DAY_NAMES[dayOfWeek];
        
        return {
          day: hijriDay,
          month: hijriMonth,
          year: hijriYear,
          monthName: monthInfo.name,
          monthNameArabic: monthInfo.arabic,
          dayName: dayInfo.name,
          dayNameArabic: dayInfo.arabic,
          fullDate: `${hijriDay} ${monthInfo.name} ${hijriYear} AH`,
          fullDateArabic: `${hijriDay} ${monthInfo.arabic} ${hijriYear}`,
          isToday: this.isToday(gregorianDate),
        };
      }
      
      // Fallback to manual calculation if library result seems wrong
      console.log('⚠️ Library result seems incorrect, using manual calculation');
      return this.manualHijriCalculation(gregorianDate);
      
    } catch (error) {
      console.error('❌ Error with hijri-date library:', error);
      return this.manualHijriCalculation(gregorianDate);
    }
  }

  /**
   * Check if a date is today
   */
  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  /**
   * Manual Hijri calculation using corrected algorithm
   * Based on the arithmetic Islamic calendar (Umm al-Qura approximation)
   */
  private manualHijriCalculation(gregorianDate: Date): HijriDateInfo {
    const dayOfWeek = gregorianDate.getDay();
    const dayInfo = DAY_NAMES[dayOfWeek];
    
    const gYear = gregorianDate.getFullYear();
    const gMonth = gregorianDate.getMonth() + 1;
    const gDay = gregorianDate.getDate();
    
    // Convert Gregorian to Julian Day Number
    const a = Math.floor((14 - gMonth) / 12);
    const y = gYear + 4800 - a;
    const m = gMonth + 12 * a - 3;
    
    const jd = gDay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Islamic calendar epoch: July 16, 622 CE (Julian) = JD 1948439.5
    // Using the civil Islamic calendar (tabular)
    const islamicEpoch = 1948439;
    
    // Days since epoch
    const daysSinceEpoch = jd - islamicEpoch;
    
    // Average Islamic year = 354.36667 days (30-year cycle with 11 leap years)
    // Each 30-year cycle = 10631 days
    const cycle30 = Math.floor(daysSinceEpoch / 10631);
    const remainingDays = daysSinceEpoch % 10631;
    
    // Find year within 30-year cycle
    // Leap years in cycle: 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29
    let yearInCycle = 0;
    let daysInYear = 0;
    let accumulated = 0;
    
    for (let i = 1; i <= 30; i++) {
      const isLeap = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(i);
      daysInYear = isLeap ? 355 : 354;
      
      if (accumulated + daysInYear > remainingDays) {
        yearInCycle = i;
        break;
      }
      accumulated += daysInYear;
    }
    
    const hijriYear = cycle30 * 30 + yearInCycle;
    const dayOfYear = remainingDays - accumulated + 1;
    
    // Find month and day
    // Odd months have 30 days, even months have 29 days (except month 12 in leap years)
    const isLeapYear = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(yearInCycle);
    let hijriMonth = 0;
    let hijriDay = 0;
    let accumulatedMonthDays = 0;
    
    for (let month = 1; month <= 12; month++) {
      let daysInMonth = (month % 2 === 1) ? 30 : 29;
      if (month === 12 && isLeapYear) {
        daysInMonth = 30;
      }
      
      if (accumulatedMonthDays + daysInMonth >= dayOfYear) {
        hijriMonth = month;
        hijriDay = dayOfYear - accumulatedMonthDays;
        break;
      }
      accumulatedMonthDays += daysInMonth;
    }
    
    // Ensure valid values
    const validMonth = Math.max(1, Math.min(12, hijriMonth || 1));
    const validDay = Math.max(1, Math.min(30, hijriDay || 1));
    const validYear = Math.max(1, hijriYear);
    
    const monthInfo = ISLAMIC_MONTHS[validMonth - 1];
    
    console.log(`🌙 Manual Hijri calculation: ${gDay}/${gMonth}/${gYear} -> ${validDay} ${monthInfo.name} ${validYear} AH`);
    
    return {
      day: validDay,
      month: validMonth,
      year: validYear,
      monthName: monthInfo.name,
      monthNameArabic: monthInfo.arabic,
      dayName: dayInfo.name,
      dayNameArabic: dayInfo.arabic,
      fullDate: `${validDay} ${monthInfo.name} ${validYear} AH`,
      fullDateArabic: `${validDay} ${monthInfo.arabic} ${validYear}`,
      isToday: true,
    };
  }

  /**
   * Get fallback Hijri date
   * Defaults to Ghana (Africa/Accra) timezone for West Africa users
   */
  private getFallbackHijriDate(): IslamicDateDisplay {
    const now = new Date();
    // Default to Ghana timezone for West Africa (app's primary market)
    const defaultTimezone = 'Africa/Accra';
    
    // Get local date components for Ghana timezone
    const localYear = parseInt(now.toLocaleString('en-US', { timeZone: defaultTimezone, year: 'numeric' }));
    const localMonth = parseInt(now.toLocaleString('en-US', { timeZone: defaultTimezone, month: 'numeric' }));
    const localDay = parseInt(now.toLocaleString('en-US', { timeZone: defaultTimezone, day: 'numeric' }));
    
    const localDate = new Date(localYear, localMonth - 1, localDay);
    const hijriInfo = this.calculateHijriDate(localDate);
    
    return {
      hijri: hijriInfo,
      gregorian: {
        day: localDay,
        month: localMonth,
        year: localYear,
        monthName: now.toLocaleDateString('en-US', { month: 'long', timeZone: defaultTimezone }),
        dayName: now.toLocaleDateString('en-US', { weekday: 'long', timeZone: defaultTimezone }),
        fullDate: now.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          timeZone: defaultTimezone
        }),
      },
      location: {
        city: 'Accra',
        country: 'Ghana',
        timezone: defaultTimezone,
      },
      localTime: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: defaultTimezone,
        hour12: true,
      }),
    };
  }

  /**
   * Check if current date is a special Islamic day
   */
  isSpecialIslamicDay(): { isSpecial: boolean; occasion?: string } {
    try {
      const now = new Date();
      const hijriInfo = this.calculateHijriDate(now);
      const month = hijriInfo.month;
      const day = hijriInfo.day;

      // Special Islamic days
      if (month === 1 && day === 1) return { isSpecial: true, occasion: 'Islamic New Year' };
      if (month === 1 && day === 10) return { isSpecial: true, occasion: 'Day of Ashura' };
      if (month === 3 && day === 12) return { isSpecial: true, occasion: 'Mawlid al-Nabi' };
      if (month === 7 && day === 27) return { isSpecial: true, occasion: "Laylat al-Mi'raj" };
      if (month === 8 && day === 15) return { isSpecial: true, occasion: "Laylat al-Bara'ah" };
      if (month === 9) return { isSpecial: true, occasion: 'Ramadan' };
      if (month === 9 && day === 27) return { isSpecial: true, occasion: 'Laylat al-Qadr' };
      if (month === 10 && day === 1) return { isSpecial: true, occasion: 'Eid al-Fitr' };
      if (month === 12 && day === 9) return { isSpecial: true, occasion: 'Day of Arafah' };
      if (month === 12 && day === 10) return { isSpecial: true, occasion: 'Eid al-Adha' };
      if (month === 12 && (day === 11 || day === 12 || day === 13)) return { isSpecial: true, occasion: 'Days of Tashriq' };

      return { isSpecial: false };
    } catch (error) {
      console.error('❌ Error checking special Islamic day:', error);
      return { isSpecial: false };
    }
  }

  /**
   * Get Islamic month names
   */
  getIslamicMonthNames(): { name: string; arabic: string }[] {
    return ISLAMIC_MONTHS;
  }

  /**
   * Get Islamic day names
   */
  getIslamicDayNames(): { name: string; arabic: string }[] {
    return DAY_NAMES;
  }
}

export default HijriService;
