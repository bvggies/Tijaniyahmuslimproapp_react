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
   */
  async getCurrentHijriDate(): Promise<IslamicDateDisplay | null> {
    try {
      // Try to get user's location for timezone
      const location = await this.locationService.getUserLocation();
      
      // Get the device's timezone
      const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timezone = location?.timezone || deviceTimezone;
      
      console.log('🌍 Using timezone:', timezone);
      console.log('📍 Location:', location?.city || 'Unknown', location?.country || 'Unknown');

      // Try AlAdhan API first for accurate Hijri date
      try {
        const alAdhanService = AlAdhanService.getInstance();
        const now = new Date();
        const alAdhanResponse = await alAdhanService.getHijriDate(now);
        
        if (alAdhanResponse && alAdhanResponse.data) {
          const hijri = alAdhanResponse.data.hijri;
          const gregorian = alAdhanResponse.data.gregorian;
          
          console.log('✅ Using AlAdhan API for Hijri date:', hijri.date);
          
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
   */
  getHijriDateForTimezone(timezone: string, location?: UserLocation | null): IslamicDateDisplay {
    try {
      // Get current date in the specified timezone
      const now = new Date();
      
      // Get the local date string for the timezone
      const localDateStr = now.toLocaleString('en-US', { 
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      console.log('🗓️ Local date string for timezone:', localDateStr);
      
      // Parse the local date
      const [datePart] = localDateStr.split(', ');
      const [month, day, year] = datePart.split('/').map(Number);
      const localDate = new Date(year, month - 1, day);
      
      console.log('🗓️ Parsed local date:', localDate.toDateString());
      
      // Calculate Hijri date using the accurate algorithm
      const hijriInfo = this.calculateHijriDate(localDate);
      
      console.log('🌙 Calculated Hijri date:', hijriInfo);

      // Get Gregorian date info for the timezone
      const gregorianInfo = {
        day: localDate.getDate(),
        month: localDate.getMonth() + 1,
        year: localDate.getFullYear(),
        monthName: localDate.toLocaleDateString('en-US', { month: 'long', timeZone: timezone }),
        dayName: localDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: timezone }),
        fullDate: localDate.toLocaleDateString('en-US', { 
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
   * Manual Hijri calculation using Kuwaiti algorithm
   */
  private manualHijriCalculation(gregorianDate: Date): HijriDateInfo {
    const dayOfWeek = gregorianDate.getDay();
    const dayInfo = DAY_NAMES[dayOfWeek];
    
    // Calculate Julian Day Number
    const gYear = gregorianDate.getFullYear();
    const gMonth = gregorianDate.getMonth() + 1;
    const gDay = gregorianDate.getDate();
    
    // Julian Day calculation
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
    
    // Calculate Islamic date
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
    
    // Validate and adjust
    const validMonth = Math.max(1, Math.min(12, hijriMonth));
    const validDay = Math.max(1, Math.min(30, hijriDay));
    const validYear = Math.max(1400, Math.min(1500, hijriYear));
    
    const monthInfo = ISLAMIC_MONTHS[validMonth - 1];
    
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
   */
  private getFallbackHijriDate(): IslamicDateDisplay {
    const now = new Date();
    const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const hijriInfo = this.calculateHijriDate(now);
    
    return {
      hijri: hijriInfo,
      gregorian: {
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        monthName: now.toLocaleDateString('en-US', { month: 'long' }),
        dayName: now.toLocaleDateString('en-US', { weekday: 'long' }),
        fullDate: now.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
      },
      location: {
        city: 'Local',
        country: '',
        timezone: deviceTimezone,
      },
      localTime: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
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
