import { PrayerTime } from '../types';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

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

// Prayer times calculation using Adhan library
export const getPrayerTimes = async (latitude: number, longitude: number, timeFormat: '12h' | '24h' = '12h'): Promise<PrayerTime[]> => {
  try {
    // Use real Adhan library for accurate prayer times
    const coordinates = new Coordinates(latitude, longitude);
    const params = CalculationMethod.MuslimWorldLeague();
    const date = new Date();
    const prayerTimes = new PrayerTimes(coordinates, date, params);
    
    // Convert Adhan prayer times to our format
    const prayerTimesList: PrayerTime[] = [
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

    // Determine current and next prayer
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    let nextPrayerIndex = -1;
    let currentPrayerIndex = -1;

    for (let i = 0; i < prayerTimesList.length; i++) {
      // Use the dateTime field for accurate calculations
      const prayerDate = prayerTimesList[i].dateTime!;
      const prayerMinutes = prayerDate.getHours() * 60 + prayerDate.getMinutes();
      
      if (currentTime < prayerMinutes) {
        nextPrayerIndex = i;
        break;
      }
    }

    // If no next prayer found, it means we're past Isha, so Fajr is next
    if (nextPrayerIndex === -1) {
      nextPrayerIndex = 0;
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

    return updatedPrayerTimes;
  } catch (error) {
    console.error('Error calculating prayer times:', error);
    // Return default times in case of error
    return [
      { name: 'Fajr', time: '05:30', isNext: false, isCurrent: false },
      { name: 'Dhuhr', time: '12:15', isNext: false, isCurrent: false },
      { name: 'Asr', time: '15:45', isNext: false, isCurrent: false },
      { name: 'Maghrib', time: '18:20', isNext: true, isCurrent: false },
      { name: 'Isha', time: '19:45', isNext: false, isCurrent: false },
    ];
  }
};

// Function to update countdowns for existing prayer times
export const updatePrayerCountdowns = (prayerTimes: PrayerTime[], timeFormat: '12h' | '24h' = '12h'): PrayerTime[] => {
  try {
    const now = new Date();
    
    return prayerTimes.map((prayer) => {
      try {
        if (prayer.isNext && prayer.dateTime) {
          const countdownData = calculateCountdown(prayer.dateTime, now);
          return {
            ...prayer,
            countdown: countdownData.countdown,
            secondsUntil: countdownData.secondsUntil,
            timeWithSeconds: formatTimeWithSeconds(prayer.dateTime, timeFormat),
          };
        }
        return {
          ...prayer,
          timeWithSeconds: formatTimeWithSeconds(prayer.dateTime || now, timeFormat),
        };
      } catch (error) {
        console.error('Error updating prayer countdown for:', prayer.name, error);
        return {
          ...prayer,
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
