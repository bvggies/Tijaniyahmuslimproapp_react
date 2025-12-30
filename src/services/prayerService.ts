import { PrayerTime } from '../types';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import AlAdhanService, { CalculationMethod as AlAdhanMethod } from './alAdhanService';

// Helper function to format time from Date object
export const formatTime = (date: Date, timeFormat: '12h' | '24h' = '12h'): string => {
  if (timeFormat === '12h') {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } else {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
};

// Helper function to format time string (HH:mm) to Date object
const parseTimeString = (timeStr: string, referenceDate?: Date): Date => {
  const date = referenceDate ? new Date(referenceDate) : new Date();
  // Remove timezone info like "(EAT)" from the string
  const cleanTimeStr = timeStr.replace(/\s*\([^)]*\)\s*/g, '').trim();
  const [hours, minutes] = cleanTimeStr.split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Helper function to format AlAdhan time to display format
const formatAlAdhanTime = (timeStr: string, timeFormat: '12h' | '24h' = '12h'): string => {
  const date = parseTimeString(timeStr);
  return formatTime(date, timeFormat);
};

// Helper function to format time with seconds
export const formatTimeWithSeconds = (date: Date, timeFormat: '12h' | '24h' = '12h'): string => {
  if (timeFormat === '12h') {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } else {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }
};

// Helper function to calculate countdown
const calculateCountdown = (targetDate: Date, currentDate: Date): { countdown: string; secondsUntil: number } => {
  try {
    // Validate input dates
    if (!targetDate || !currentDate || isNaN(targetDate.getTime()) || isNaN(currentDate.getTime())) {
      console.error('Invalid dates provided to calculateCountdown:', { targetDate, currentDate });
      return { countdown: '00:00:00', secondsUntil: 0 };
    }

    // Ensure we're comparing dates on the same day
    const target = new Date(targetDate);
    const current = new Date(currentDate);
    
    // If target time has passed today, set it for tomorrow
    if (target.getTime() <= current.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    
    const diffMs = target.getTime() - current.getTime();
    
    if (diffMs <= 0) {
      return { countdown: '00:00:00', secondsUntil: 0 };
    }
    
    const totalSeconds = Math.floor(diffMs / 1000);
    
    // Validate totalSeconds
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      console.error('Invalid totalSeconds calculated:', totalSeconds);
      return { countdown: '00:00:00', secondsUntil: 0 };
    }
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    // Validate calculated values
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      console.error('Invalid time components calculated:', { hours, minutes, seconds, totalSeconds });
      return { countdown: '00:00:00', secondsUntil: 0 };
    }
    
    const countdownString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return {
      countdown: countdownString,
      secondsUntil: totalSeconds
    };
  } catch (error) {
    console.error('Error in calculateCountdown:', error);
    return { countdown: '00:00:00', secondsUntil: 0 };
  }
};

// Prayer times calculation - Uses AlAdhan API with local Adhan library fallback
export const getPrayerTimes = async (
  latitude: number, 
  longitude: number, 
  timeFormat: '12h' | '24h' = '12h',
  calculationMethod?: AlAdhanMethod
): Promise<PrayerTime[]> => {
  try {
    console.log('🕌 Getting prayer times for coordinates:', latitude, longitude);
    
    // Validate coordinates
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      throw new Error(`Invalid coordinates: lat=${latitude}, lng=${longitude}`);
    }

    const now = new Date();
    let prayerTimesList: PrayerTime[] = [];

    // Try AlAdhan API first for accurate times
    try {
      const alAdhanService = AlAdhanService.getInstance();
      const alAdhanData = await alAdhanService.getPrayerTimes(
        latitude, 
        longitude, 
        now,
        { method: calculationMethod }
      );

      if (alAdhanData && alAdhanData.data?.timings) {
        console.log('✅ Using AlAdhan API prayer times');
        console.log('📍 Timezone:', alAdhanData.data.meta?.timezone);
        console.log('📅 Date:', alAdhanData.data.date?.readable);
        
        const timings = alAdhanData.data.timings;
        
        prayerTimesList = [
          {
            name: 'Fajr',
            time: formatAlAdhanTime(timings.Fajr, timeFormat),
            timeWithSeconds: formatAlAdhanTime(timings.Fajr, timeFormat),
            isNext: false,
            isCurrent: false,
            dateTime: parseTimeString(timings.Fajr, now),
          },
          {
            name: 'Dhuhr',
            time: formatAlAdhanTime(timings.Dhuhr, timeFormat),
            timeWithSeconds: formatAlAdhanTime(timings.Dhuhr, timeFormat),
            isNext: false,
            isCurrent: false,
            dateTime: parseTimeString(timings.Dhuhr, now),
          },
          {
            name: 'Asr',
            time: formatAlAdhanTime(timings.Asr, timeFormat),
            timeWithSeconds: formatAlAdhanTime(timings.Asr, timeFormat),
            isNext: false,
            isCurrent: false,
            dateTime: parseTimeString(timings.Asr, now),
          },
          {
            name: 'Maghrib',
            time: formatAlAdhanTime(timings.Maghrib, timeFormat),
            timeWithSeconds: formatAlAdhanTime(timings.Maghrib, timeFormat),
            isNext: false,
            isCurrent: false,
            dateTime: parseTimeString(timings.Maghrib, now),
          },
          {
            name: 'Isha',
            time: formatAlAdhanTime(timings.Isha, timeFormat),
            timeWithSeconds: formatAlAdhanTime(timings.Isha, timeFormat),
            isNext: false,
            isCurrent: false,
            dateTime: parseTimeString(timings.Isha, now),
          },
        ];
      } else {
        throw new Error('AlAdhan API returned no data');
      }
    } catch (alAdhanError) {
      console.log('⚠️ AlAdhan API failed, falling back to local Adhan library');
      console.error('AlAdhan error:', alAdhanError);
      
      // Fallback to local Adhan library
      const coordinates = new Coordinates(latitude, longitude);
      const params = CalculationMethod.MuslimWorldLeague();
      const prayerTimes = new PrayerTimes(coordinates, now, params);
      
      prayerTimesList = [
        { 
          name: 'Fajr', 
          time: formatTime(prayerTimes.fajr, timeFormat),
          timeWithSeconds: formatTimeWithSeconds(prayerTimes.fajr, timeFormat),
          isNext: false, 
          isCurrent: false,
          dateTime: prayerTimes.fajr
        },
        { 
          name: 'Dhuhr', 
          time: formatTime(prayerTimes.dhuhr, timeFormat),
          timeWithSeconds: formatTimeWithSeconds(prayerTimes.dhuhr, timeFormat),
          isNext: false, 
          isCurrent: false,
          dateTime: prayerTimes.dhuhr
        },
        { 
          name: 'Asr', 
          time: formatTime(prayerTimes.asr, timeFormat),
          timeWithSeconds: formatTimeWithSeconds(prayerTimes.asr, timeFormat),
          isNext: false, 
          isCurrent: false,
          dateTime: prayerTimes.asr
        },
        { 
          name: 'Maghrib', 
          time: formatTime(prayerTimes.maghrib, timeFormat),
          timeWithSeconds: formatTimeWithSeconds(prayerTimes.maghrib, timeFormat),
          isNext: false, 
          isCurrent: false,
          dateTime: prayerTimes.maghrib
        },
        { 
          name: 'Isha', 
          time: formatTime(prayerTimes.isha, timeFormat),
          timeWithSeconds: formatTimeWithSeconds(prayerTimes.isha, timeFormat),
          isNext: false, 
          isCurrent: false,
          dateTime: prayerTimes.isha
        },
      ];
    }

    // Determine current and next prayer
    let nextPrayerIndex = -1;
    let currentPrayerIndex = -1;

    // Find the next prayer by comparing actual Date objects
    for (let i = 0; i < prayerTimesList.length; i++) {
      const prayerDate = prayerTimesList[i].dateTime!;
      
      // If prayer time is in the future
      if (prayerDate.getTime() > now.getTime()) {
        nextPrayerIndex = i;
        break;
      }
    }

    // If no next prayer found, it means we're past Isha, so Fajr is next (tomorrow)
    if (nextPrayerIndex === -1) {
      nextPrayerIndex = 0;
      // Set Fajr for tomorrow
      const tomorrowFajr = new Date(prayerTimesList[0].dateTime!);
      tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
      prayerTimesList[0].dateTime = tomorrowFajr;
    }

    // Current prayer is the one before next prayer
    currentPrayerIndex = nextPrayerIndex === 0 ? prayerTimesList.length - 1 : nextPrayerIndex - 1;

    // Update the prayer times with current/next flags and countdown
    const updatedPrayerTimes = prayerTimesList.map((prayer, index) => {
      const isCurrent = index === currentPrayerIndex;
      const isNext = index === nextPrayerIndex;
      
      // Calculate countdown for next prayer
      let countdown = '';
      let secondsUntil = 0;
      
      if (isNext && prayer.dateTime) {
        const countdownData = calculateCountdown(prayer.dateTime, now);
        countdown = countdownData.countdown;
        secondsUntil = countdownData.secondsUntil;
      }
      
      return {
        ...prayer,
        isCurrent,
        isNext,
        countdown,
        secondsUntil,
      };
    });

    console.log('✅ Prayer times ready with next prayer:', updatedPrayerTimes.find(p => p.isNext)?.name);
    return updatedPrayerTimes;
  } catch (error) {
    console.error('❌ Error calculating prayer times:', error);
    console.error('📍 Coordinates that failed:', { latitude, longitude });
    
    // Return default times in case of all errors
    const fallbackTimes: PrayerTime[] = [
      { name: 'Fajr', time: '05:30', isNext: false, isCurrent: false },
      { name: 'Dhuhr', time: '12:15', isNext: false, isCurrent: false },
      { name: 'Asr', time: '15:45', isNext: false, isCurrent: false },
      { name: 'Maghrib', time: '18:20', isNext: true, isCurrent: false },
      { name: 'Isha', time: '19:45', isNext: false, isCurrent: false },
    ];
    
    console.log('🔄 Using hardcoded fallback prayer times');
    return fallbackTimes;
  }
};

// Get additional prayer data (Sunrise, Imsak, Midnight)
export const getAdditionalPrayerTimes = async (
  latitude: number,
  longitude: number,
  timeFormat: '12h' | '24h' = '12h'
): Promise<{ sunrise: string; imsak: string; midnight: string } | null> => {
  try {
    const alAdhanService = AlAdhanService.getInstance();
    const specialTimes = await alAdhanService.getSpecialTimes(latitude, longitude);
    
    if (specialTimes) {
      return {
        sunrise: formatAlAdhanTime(specialTimes.sunrise, timeFormat),
        imsak: formatAlAdhanTime(specialTimes.imsak, timeFormat),
        midnight: formatAlAdhanTime(specialTimes.midnight, timeFormat),
      };
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting additional prayer times:', error);
    return null;
  }
};

// Function to update countdowns for existing prayer times
export const updatePrayerCountdowns = (prayerTimes: PrayerTime[], timeFormat: '12h' | '24h' = '12h'): PrayerTime[] => {
  try {
    const now = new Date();
    
    // Check if we need to recalculate next prayer (e.g., if current next prayer has passed)
    let needsRecalculation = false;
    const nextPrayer = prayerTimes.find(p => p.isNext);
    
    if (nextPrayer && nextPrayer.dateTime && nextPrayer.dateTime.getTime() <= now.getTime()) {
      needsRecalculation = true;
    }
    
    // If we need to recalculate, get fresh prayer times
    if (needsRecalculation) {
      console.log('Next prayer has passed, recalculating prayer times...');
      // This will be handled by the calling component by reloading prayer times
      return prayerTimes.map(prayer => ({
        ...prayer,
        countdown: '00:00:00',
        secondsUntil: 0,
        timeWithSeconds: formatTimeWithSeconds(prayer.dateTime || now, timeFormat),
      }));
    }
    
    // If there is no isNext set (or data came from storage), determine the next prayer here
    let nextIndex = prayerTimes.findIndex(p => p.isNext);
    if (nextIndex === -1) {
      // Find earliest prayer time in the future
      let minDiff = Number.POSITIVE_INFINITY;
      let candidateIndex = -1;
      prayerTimes.forEach((p, idx) => {
        if (p.dateTime) {
          let target = new Date(p.dateTime);
          if (target.getTime() <= now.getTime()) {
            // consider tomorrow for passed times (handles after-Isha case)
            target.setDate(target.getDate() + 1);
          }
          const diff = target.getTime() - now.getTime();
          if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            candidateIndex = idx;
          }
        }
      });
      if (candidateIndex !== -1) nextIndex = candidateIndex;
    }

    return prayerTimes.map((prayer, index) => {
      try {
        const isNext = index === nextIndex;
        if (isNext && prayer.dateTime) {
          // Use a target that is guaranteed to be in the future (tomorrow if needed)
          const target = new Date(prayer.dateTime);
          if (target.getTime() <= now.getTime()) {
            target.setDate(target.getDate() + 1);
          }
          const countdownData = calculateCountdown(prayer.dateTime, now);
          return {
            ...prayer,
            isNext: true,
            countdown: countdownData.countdown,
            secondsUntil: countdownData.secondsUntil,
            timeWithSeconds: formatTimeWithSeconds(prayer.dateTime, timeFormat),
          };
        }
        return {
          ...prayer,
          isNext: index === nextIndex,
          timeWithSeconds: formatTimeWithSeconds(prayer.dateTime || now, timeFormat),
        };
      } catch (error) {
        console.error('Error updating prayer countdown for:', prayer.name, error);
        return {
          ...prayer,
          isNext: index === nextIndex,
          countdown: '00:00:00',
          secondsUntil: 0,
          timeWithSeconds: prayer.time || '00:00',
        };
      }
    });
  } catch (error) {
    console.error('Error in updatePrayerCountdowns:', error);
    return prayerTimes.map(prayer => ({
      ...prayer,
      countdown: '00:00:00',
      secondsUntil: 0,
      timeWithSeconds: prayer.time || '00:00',
    }));
  }
};

export const getQiblaDirection = (latitude: number, longitude: number): number => {
  // Kaaba coordinates
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  
  // Calculate bearing to Kaaba
  const lat1 = (latitude * Math.PI) / 180;
  const lat2 = (kaabaLat * Math.PI) / 180;
  const deltaLng = ((kaabaLng - longitude) * Math.PI) / 180;
  
  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
};
