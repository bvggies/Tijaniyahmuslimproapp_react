/**
 * AlAdhan API Service
 * Provides accurate prayer times and Islamic calendar dates based on user location
 * API Documentation: https://aladhan.com/prayer-times-api
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL
const ALADHAN_BASE_URL = 'https://api.aladhan.com/v1';

// Cache keys
const CACHE_KEYS = {
  PRAYER_TIMES: 'aladhan_prayer_times',
  HIJRI_DATE: 'aladhan_hijri_date',
  CACHE_TIMESTAMP: 'aladhan_cache_timestamp',
};

// Cache duration: 6 hours for prayer times (they change daily)
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000;

// Calculation methods available
export enum CalculationMethod {
  SHIA_ITHNA_ASHARI = 0,
  UNIVERSITY_OF_ISLAMIC_SCIENCES_KARACHI = 1,
  ISLAMIC_SOCIETY_OF_NORTH_AMERICA = 2,
  MUSLIM_WORLD_LEAGUE = 3,
  UMM_AL_QURA_UNIVERSITY_MAKKAH = 4,
  EGYPTIAN_GENERAL_AUTHORITY = 5,
  INSTITUTE_OF_GEOPHYSICS_UNIVERSITY_OF_TEHRAN = 7,
  GULF_REGION = 8,
  KUWAIT = 9,
  QATAR = 10,
  MAJLIS_UGAMA_ISLAM_SINGAPURA = 11,
  UNION_ORGANIZATION_ISLAMIC_DE_FRANCE = 12,
  DIYANET_ISLERI_BASKANLIGI_TURKEY = 13,
  SPIRITUAL_ADMINISTRATION_OF_MUSLIMS_OF_RUSSIA = 14,
  MOONSIGHTING_COMMITTEE_WORLDWIDE = 15,
  DUBAI = 16,
}

// School for Asr calculation
export enum AsrJuristicMethod {
  STANDARD_SHAFI = 0,
  HANAFI = 1,
}

// API Response Interfaces
export interface AlAdhanPrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird?: string;
  Lastthird?: string;
}

export interface AlAdhanDate {
  readable: string;
  timestamp: string;
  gregorian: {
    date: string;
    format: string;
    day: string;
    weekday: { en: string; ar?: string };
    month: { number: number; en: string; ar?: string };
    year: string;
    designation: { abbreviated: string; expanded: string };
  };
  hijri: {
    date: string;
    format: string;
    day: string;
    weekday: { en: string; ar: string };
    month: { number: number; en: string; ar: string };
    year: string;
    designation: { abbreviated: string; expanded: string };
    holidays: string[];
  };
}

export interface AlAdhanMeta {
  latitude: number;
  longitude: number;
  timezone: string;
  method: {
    id: number;
    name: string;
    params: {
      Fajr: number;
      Isha: number | string;
    };
    location: { latitude: number; longitude: number };
  };
  latitudeAdjustmentMethod: string;
  midnightMode: string;
  school: string;
  offset: Record<string, number>;
}

export interface AlAdhanPrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: AlAdhanPrayerTimings;
    date: AlAdhanDate;
    meta: AlAdhanMeta;
  };
}

export interface AlAdhanHijriDateResponse {
  code: number;
  status: string;
  data: {
    hijri: {
      date: string;
      format: string;
      day: string;
      weekday: { en: string; ar: string };
      month: { number: number; en: string; ar: string };
      year: string;
      designation: { abbreviated: string; expanded: string };
      holidays: string[];
    };
    gregorian: {
      date: string;
      format: string;
      day: string;
      weekday: { en: string };
      month: { number: number; en: string };
      year: string;
      designation: { abbreviated: string; expanded: string };
    };
  };
}

export interface AlAdhanCalendarResponse {
  code: number;
  status: string;
  data: Array<{
    timings: AlAdhanPrayerTimings;
    date: AlAdhanDate;
    meta: AlAdhanMeta;
  }>;
}

// Service Options
export interface AlAdhanOptions {
  method?: CalculationMethod;
  school?: AsrJuristicMethod;
  timezone?: string;
  adjustment?: number; // Days to adjust for Hijri date
  tune?: string; // Fine-tuning prayer times
}

class AlAdhanService {
  private static instance: AlAdhanService;
  private defaultMethod: CalculationMethod = CalculationMethod.MUSLIM_WORLD_LEAGUE;
  private defaultSchool: AsrJuristicMethod = AsrJuristicMethod.STANDARD_SHAFI;

  private constructor() {}

  static getInstance(): AlAdhanService {
    if (!AlAdhanService.instance) {
      AlAdhanService.instance = new AlAdhanService();
    }
    return AlAdhanService.instance;
  }

  /**
   * Get prayer times for a specific location and date
   */
  async getPrayerTimes(
    latitude: number,
    longitude: number,
    date?: Date,
    options?: AlAdhanOptions
  ): Promise<AlAdhanPrayerTimesResponse | null> {
    try {
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.error('❌ Invalid coordinates for AlAdhan API:', { latitude, longitude });
        return null;
      }

      // Check cache first
      const cacheKey = `${CACHE_KEYS.PRAYER_TIMES}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
      const cached = await this.getCachedData<AlAdhanPrayerTimesResponse>(cacheKey);
      
      // Check if cache is valid for today
      if (cached) {
        const cachedDate = cached.data?.date?.gregorian?.date;
        const today = this.formatDateForAPI(date || new Date());
        if (cachedDate === today) {
          console.log('✅ Using cached prayer times from AlAdhan API');
          return cached;
        }
      }

      const targetDate = date || new Date();
      const formattedDate = this.formatDateForAPI(targetDate);
      
      const method = options?.method ?? this.defaultMethod;
      const school = options?.school ?? this.defaultSchool;

      // Build URL with parameters
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        method: method.toString(),
        school: school.toString(),
      });

      if (options?.timezone) {
        params.append('timezonestring', options.timezone);
      }

      if (options?.tune) {
        params.append('tune', options.tune);
      }

      if (options?.adjustment !== undefined) {
        params.append('adjustment', options.adjustment.toString());
      }

      const url = `${ALADHAN_BASE_URL}/timings/${formattedDate}?${params.toString()}`;
      console.log('🕌 Fetching prayer times from AlAdhan API...');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`AlAdhan API error: ${response.status}`);
      }

      const data: AlAdhanPrayerTimesResponse = await response.json();

      if (data.code === 200 && data.status === 'OK') {
        console.log('✅ Successfully fetched prayer times from AlAdhan API');
        console.log('📍 Location:', data.data.meta.timezone);
        console.log('📅 Date:', data.data.date.readable);
        
        // Cache the response
        await this.setCachedData(cacheKey, data);
        
        return data;
      }

      console.error('❌ AlAdhan API returned error:', data);
      return null;
    } catch (error) {
      console.error('❌ Error fetching prayer times from AlAdhan API:', error);
      return null;
    }
  }

  /**
   * Get prayer times by city name
   */
  async getPrayerTimesByCity(
    city: string,
    country: string,
    date?: Date,
    options?: AlAdhanOptions
  ): Promise<AlAdhanPrayerTimesResponse | null> {
    try {
      const targetDate = date || new Date();
      const formattedDate = this.formatDateForAPI(targetDate);
      
      const method = options?.method ?? this.defaultMethod;
      const school = options?.school ?? this.defaultSchool;

      const params = new URLSearchParams({
        city,
        country,
        method: method.toString(),
        school: school.toString(),
      });

      const url = `${ALADHAN_BASE_URL}/timingsByCity/${formattedDate}?${params.toString()}`;
      console.log('🕌 Fetching prayer times by city from AlAdhan API...');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`AlAdhan API error: ${response.status}`);
      }

      const data: AlAdhanPrayerTimesResponse = await response.json();

      if (data.code === 200 && data.status === 'OK') {
        console.log('✅ Successfully fetched prayer times by city');
        return data;
      }

      return null;
    } catch (error) {
      console.error('❌ Error fetching prayer times by city:', error);
      return null;
    }
  }

  /**
   * Get Hijri date from Gregorian date
   */
  async getHijriDate(
    gregorianDate?: Date,
    adjustment?: number
  ): Promise<AlAdhanHijriDateResponse | null> {
    try {
      const date = gregorianDate || new Date();
      const formattedDate = this.formatDateForAPI(date);
      
      // Check cache
      const cacheKey = `${CACHE_KEYS.HIJRI_DATE}_${formattedDate}`;
      const cached = await this.getCachedData<AlAdhanHijriDateResponse>(cacheKey);
      if (cached) {
        console.log('✅ Using cached Hijri date from AlAdhan API');
        return cached;
      }

      let url = `${ALADHAN_BASE_URL}/gpiToH/${formattedDate}`;
      if (adjustment !== undefined) {
        url += `?adjustment=${adjustment}`;
      }

      console.log('🌙 Fetching Hijri date from AlAdhan API...');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`AlAdhan API error: ${response.status}`);
      }

      const data: AlAdhanHijriDateResponse = await response.json();

      if (data.code === 200 && data.status === 'OK') {
        console.log('✅ Successfully fetched Hijri date from AlAdhan API');
        console.log('🌙 Hijri:', data.data.hijri.date);
        
        // Cache the response
        await this.setCachedData(cacheKey, data);
        
        return data;
      }

      return null;
    } catch (error) {
      console.error('❌ Error fetching Hijri date from AlAdhan API:', error);
      return null;
    }
  }

  /**
   * Get Hijri date from timestamp
   */
  async getHijriDateFromTimestamp(
    timestamp: number,
    adjustment?: number
  ): Promise<AlAdhanHijriDateResponse | null> {
    try {
      let url = `${ALADHAN_BASE_URL}/gpiToH?timestamp=${timestamp}`;
      if (adjustment !== undefined) {
        url += `&adjustment=${adjustment}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`AlAdhan API error: ${response.status}`);
      }

      const data: AlAdhanHijriDateResponse = await response.json();

      if (data.code === 200 && data.status === 'OK') {
        return data;
      }

      return null;
    } catch (error) {
      console.error('❌ Error fetching Hijri date from timestamp:', error);
      return null;
    }
  }

  /**
   * Get Gregorian date from Hijri date
   */
  async getGregorianDate(
    day: number,
    month: number,
    year: number,
    adjustment?: number
  ): Promise<any | null> {
    try {
      const hijriDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
      let url = `${ALADHAN_BASE_URL}/hToG/${hijriDate}`;
      if (adjustment !== undefined) {
        url += `?adjustment=${adjustment}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`AlAdhan API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.code === 200 && data.status === 'OK') {
        return data;
      }

      return null;
    } catch (error) {
      console.error('❌ Error converting Hijri to Gregorian:', error);
      return null;
    }
  }

  /**
   * Get calendar for a month (Hijri calendar)
   */
  async getHijriCalendar(
    month: number,
    year: number,
    latitude: number,
    longitude: number,
    options?: AlAdhanOptions
  ): Promise<AlAdhanCalendarResponse | null> {
    try {
      const method = options?.method ?? this.defaultMethod;

      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        method: method.toString(),
      });

      const url = `${ALADHAN_BASE_URL}/hijriCalendar/${month}/${year}?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`AlAdhan API error: ${response.status}`);
      }

      const data: AlAdhanCalendarResponse = await response.json();

      if (data.code === 200 && data.status === 'OK') {
        return data;
      }

      return null;
    } catch (error) {
      console.error('❌ Error fetching Hijri calendar:', error);
      return null;
    }
  }

  /**
   * Get current Islamic month info
   */
  async getCurrentIslamicMonth(): Promise<{ name: string; nameArabic: string; number: number; year: number } | null> {
    try {
      const hijriData = await this.getHijriDate();
      if (hijriData) {
        return {
          name: hijriData.data.hijri.month.en,
          nameArabic: hijriData.data.hijri.month.ar,
          number: hijriData.data.hijri.month.number,
          year: parseInt(hijriData.data.hijri.year),
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting current Islamic month:', error);
      return null;
    }
  }

  /**
   * Get Islamic holidays for a given date
   */
  async getIslamicHolidays(date?: Date): Promise<string[]> {
    try {
      const hijriData = await this.getHijriDate(date);
      if (hijriData && hijriData.data.hijri.holidays) {
        return hijriData.data.hijri.holidays;
      }
      return [];
    } catch (error) {
      console.error('❌ Error getting Islamic holidays:', error);
      return [];
    }
  }

  /**
   * Get special prayer times (Tahajjud, Sunrise, etc.)
   */
  async getSpecialTimes(
    latitude: number,
    longitude: number,
    date?: Date
  ): Promise<{ sunrise: string; midnight: string; imsak: string; firstThird?: string; lastThird?: string } | null> {
    try {
      const prayerData = await this.getPrayerTimes(latitude, longitude, date);
      if (prayerData) {
        return {
          sunrise: prayerData.data.timings.Sunrise,
          midnight: prayerData.data.timings.Midnight,
          imsak: prayerData.data.timings.Imsak,
          firstThird: prayerData.data.timings.Firstthird,
          lastThird: prayerData.data.timings.Lastthird,
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting special times:', error);
      return null;
    }
  }

  /**
   * Set default calculation method
   */
  setDefaultMethod(method: CalculationMethod): void {
    this.defaultMethod = method;
  }

  /**
   * Set default Asr juristic method
   */
  setDefaultSchool(school: AsrJuristicMethod): void {
    this.defaultSchool = school;
  }

  /**
   * Get all available calculation methods
   */
  getAvailableMethods(): { id: number; name: string }[] {
    return [
      { id: 0, name: 'Shia Ithna-Ashari' },
      { id: 1, name: 'University of Islamic Sciences, Karachi' },
      { id: 2, name: 'Islamic Society of North America (ISNA)' },
      { id: 3, name: 'Muslim World League' },
      { id: 4, name: 'Umm Al-Qura University, Makkah' },
      { id: 5, name: 'Egyptian General Authority of Survey' },
      { id: 7, name: 'Institute of Geophysics, University of Tehran' },
      { id: 8, name: 'Gulf Region' },
      { id: 9, name: 'Kuwait' },
      { id: 10, name: 'Qatar' },
      { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore' },
      { id: 12, name: 'Union Organization Islamic de France' },
      { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey' },
      { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
      { id: 15, name: 'Moonsighting Committee Worldwide' },
      { id: 16, name: 'Dubai (experimental)' },
    ];
  }

  // ==========================================
  // Private Helper Methods
  // ==========================================

  private formatDateForAPI(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - timestamp < CACHE_DURATION_MS) {
        return data as T;
      }

      // Cache expired, remove it
      await AsyncStorage.removeItem(key);
      return null;
    } catch (error) {
      console.error('❌ Error reading cache:', error);
      return null;
    }
  }

  private async setCachedData<T>(key: string, data: T): Promise<void> {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error('❌ Error setting cache:', error);
    }
  }

  /**
   * Clear all AlAdhan cache
   */
  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const alAdhanKeys = keys.filter(key => key.startsWith('aladhan_'));
      await AsyncStorage.multiRemove(alAdhanKeys);
      console.log('✅ AlAdhan cache cleared');
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
    }
  }
}

export default AlAdhanService;

