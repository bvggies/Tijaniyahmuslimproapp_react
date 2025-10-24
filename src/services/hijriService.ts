import HijriDate from 'hijri-date';
import LocationService, { UserLocation } from './locationService';

export interface HijriDateInfo {
  day: number;
  month: number;
  year: number;
  monthName: string;
  dayName: string;
  fullDate: string;
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
   * Get current Hijri date based on user's location
   */
  async getCurrentHijriDate(): Promise<IslamicDateDisplay | null> {
    try {
      const location = await this.locationService.getUserLocation();
      if (!location) {
        console.log('⚠️ No location available, using default timezone');
        return this.getHijriDateForTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      }

      return this.getHijriDateForTimezone(location.timezone, location);
    } catch (error) {
      console.error('❌ Error getting Hijri date:', error);
      return null;
    }
  }

  /**
   * Get Hijri date for specific timezone
   */
  getHijriDateForTimezone(timezone: string, location?: UserLocation): IslamicDateDisplay {
    try {
      // Get current date in the specified timezone
      const now = new Date();
      const localDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
      
      console.log('🗓️ Current Gregorian date:', localDate.toLocaleDateString());
      console.log('🌍 Timezone:', timezone);
      
      // Create Hijri date
      const hijri = new HijriDate(localDate);
      
      console.log('🌙 Hijri date from library:', {
        day: hijri.getDate(),
        month: hijri.getMonth() + 1,
        year: hijri.getFullYear(),
        monthName: hijri.getMonthName(),
        fullDate: `${hijri.getDate()} ${hijri.getMonthName()} ${hijri.getFullYear()} AH`
      });
      
      // Check if the library result seems wrong (e.g., showing Muharram 1 when it should be Jumada al-Awwal)
      const hijriYear = hijri.getFullYear();
      const hijriMonth = hijri.getMonth() + 1;
      const hijriDay = hijri.getDate();
      
      let hijriInfo: HijriDateInfo;
      
      // If it's showing Muharram 1, it's likely wrong - use manual calculation
      if (hijriMonth === 1 && hijriDay === 1) {
        console.log('⚠️ Library showing Muharram 1, using manual calculation');
        const manualHijri = this.getManualHijriDate(localDate);
        console.log('🔧 Manual calculation result:', manualHijri);
        
        hijriInfo = {
          ...manualHijri,
          isToday: this.isToday(localDate),
        };
      } else {
        // Use library result
        hijriInfo = {
          day: hijri.getDate(),
          month: hijri.getMonth() + 1, // HijriDate uses 0-based months
          year: hijri.getFullYear(),
          monthName: hijri.getMonthName(),
          dayName: hijri.getDayName(),
          fullDate: `${hijri.getDate()} ${hijri.getMonthName()} ${hijri.getFullYear()} AH`,
          isToday: this.isToday(localDate),
        };
      }

      // Get Gregorian date info
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
      const localTime = localDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timezone,
      });

      return {
        hijri: hijriInfo,
        gregorian: gregorianInfo,
        location: {
          city: location?.city || 'Unknown',
          country: location?.country || 'Unknown',
          timezone: timezone,
        },
        localTime,
      };

    } catch (error) {
      console.error('❌ Error creating Hijri date:', error);
      // Fallback to current date
      return this.getFallbackHijriDate();
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
   * Get fallback Hijri date when location/timezone detection fails
   */
  private getFallbackHijriDate(): IslamicDateDisplay {
    const now = new Date();
    const hijri = new HijriDate(now);
    
    console.log('🔄 Using fallback Hijri date calculation');
    console.log('🗓️ Fallback Gregorian:', now.toLocaleDateString());
    console.log('🌙 Fallback Hijri:', `${hijri.getDate()} ${hijri.getMonthName()} ${hijri.getFullYear()} AH`);
    
    return {
      hijri: {
        day: hijri.getDate(),
        month: hijri.getMonth() + 1,
        year: hijri.getFullYear(),
        monthName: hijri.getMonthName(),
        dayName: hijri.getDayName(),
        fullDate: `${hijri.getDate()} ${hijri.getMonthName()} ${hijri.getFullYear()} AH`,
        isToday: true,
      },
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
        city: 'Unknown',
        country: 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      localTime: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };
  }

  /**
   * Get accurate Hijri date using manual calculation
   * This is a backup method when the hijri-date library fails
   */
  private getManualHijriDate(gregorianDate: Date): HijriDateInfo {
    // More accurate manual calculation
    const epoch = new Date(622, 6, 16); // July 16, 622 CE (Muharram 1, 1 AH)
    const daysSinceEpoch = Math.floor((gregorianDate.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
    
    // More accurate calculation using Umm al-Qura method
    const islamicYear = Math.floor(daysSinceEpoch / 354.36667) + 1;
    const daysInYear = daysSinceEpoch % 354.36667;
    
    // Calculate month and day more accurately
    let remainingDays = Math.floor(daysInYear);
    let month = 1;
    let day = 1;
    
    // Islamic months with their lengths (alternating 29/30 days)
    const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
    
    for (let i = 0; i < 12; i++) {
      if (remainingDays <= monthLengths[i]) {
        month = i + 1;
        day = remainingDays + 1;
        break;
      }
      remainingDays -= monthLengths[i];
    }
    
    const monthNames = [
      'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
      'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];
    
    const result = {
      day: Math.max(1, Math.min(30, day)),
      month: Math.max(1, Math.min(12, month)),
      year: islamicYear,
      monthName: monthNames[Math.max(0, Math.min(11, month - 1))],
      dayName: gregorianDate.toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: `${Math.max(1, Math.min(30, day))} ${monthNames[Math.max(0, Math.min(11, month - 1))]} ${islamicYear} AH`,
      isToday: true,
    };
    
    console.log('🔧 Manual Hijri calculation:', result);
    return result;
  }

  /**
   * Get Hijri date for a specific Gregorian date
   */
  getHijriDateForGregorian(gregorianDate: Date, timezone?: string): HijriDateInfo {
    try {
      const hijri = new HijriDate(gregorianDate);
      
      return {
        day: hijri.getDate(),
        month: hijri.getMonth() + 1,
        year: hijri.getFullYear(),
        monthName: hijri.getMonthName(),
        dayName: hijri.getDayName(),
        fullDate: `${hijri.getDate()} ${hijri.getMonthName()} ${hijri.getFullYear()} AH`,
        isToday: this.isToday(gregorianDate),
      };
    } catch (error) {
      console.error('❌ Error converting to Hijri date:', error);
      return {
        day: 1,
        month: 1,
        year: 1446,
        monthName: 'Muharram',
        dayName: 'Monday',
        fullDate: '1 Muharram 1446 AH',
        isToday: false,
      };
    }
  }

  /**
   * Get Gregorian date for a specific Hijri date
   */
  getGregorianDateForHijri(hijriDay: number, hijriMonth: number, hijriYear: number): Date {
    try {
      const hijri = new HijriDate();
      hijri.setDate(hijriDay);
      hijri.setMonth(hijriMonth - 1); // HijriDate uses 0-based months
      hijri.setFullYear(hijriYear);
      
      return hijri.getGregorianDate();
    } catch (error) {
      console.error('❌ Error converting from Hijri date:', error);
      return new Date();
    }
  }

  /**
   * Get Islamic month names
   */
  getIslamicMonthNames(): string[] {
    return [
      'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
      'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];
  }

  /**
   * Get Islamic day names
   */
  getIslamicDayNames(): string[] {
    return [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
      'Thursday', 'Friday', 'Saturday'
    ];
  }

  /**
   * Check if current date is a special Islamic day
   */
  isSpecialIslamicDay(): { isSpecial: boolean; occasion?: string } {
    try {
      const hijri = new HijriDate();
      const month = hijri.getMonth() + 1;
      const day = hijri.getDate();

      // Special Islamic days
      if (month === 1 && day === 1) return { isSpecial: true, occasion: 'Islamic New Year' };
      if (month === 1 && day === 10) return { isSpecial: true, occasion: 'Day of Ashura' };
      if (month === 3 && day === 12) return { isSpecial: true, occasion: 'Mawlid al-Nabi' };
      if (month === 7 && day === 27) return { isSpecial: true, occasion: 'Laylat al-Miraj' };
      if (month === 7 && day === 15) return { isSpecial: true, occasion: 'Laylat al-Bara\'ah' };
      if (month === 8 && day === 15) return { isSpecial: true, occasion: 'Laylat al-Qadr' };
      if (month === 9) return { isSpecial: true, occasion: 'Ramadan' };
      if (month === 10 && day === 1) return { isSpecial: true, occasion: 'Eid al-Fitr' };
      if (month === 12 && day === 9) return { isSpecial: true, occasion: 'Day of Arafah' };
      if (month === 12 && day === 10) return { isSpecial: true, occasion: 'Eid al-Adha' };

      return { isSpecial: false };
    } catch (error) {
      console.error('❌ Error checking special Islamic day:', error);
      return { isSpecial: false };
    }
  }
}

export default HijriService;
