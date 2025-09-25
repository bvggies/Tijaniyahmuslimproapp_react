import { PrayerTime } from '../types';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

// Helper function to format time from Date object
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// Prayer times calculation using Adhan library
export const getPrayerTimes = async (latitude: number, longitude: number): Promise<PrayerTime[]> => {
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
        time: formatTime(prayerTimes.fajr), 
        isNext: false, 
        isCurrent: false 
      },
      { 
        name: 'Dhuhr', 
        time: formatTime(prayerTimes.dhuhr), 
        isNext: false, 
        isCurrent: false 
      },
      { 
        name: 'Asr', 
        time: formatTime(prayerTimes.asr), 
        isNext: false, 
        isCurrent: false 
      },
      { 
        name: 'Maghrib', 
        time: formatTime(prayerTimes.maghrib), 
        isNext: false, 
        isCurrent: false 
      },
      { 
        name: 'Isha', 
        time: formatTime(prayerTimes.isha), 
        isNext: false, 
        isCurrent: false 
      },
    ];

    // Determine current and next prayer
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    let nextPrayerIndex = -1;
    let currentPrayerIndex = -1;

    for (let i = 0; i < prayerTimesList.length; i++) {
      const [hours, minutes] = prayerTimesList[i].time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      
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

    // Update the prayer times with current/next flags
    const updatedPrayerTimes = prayerTimesList.map((prayer, index) => ({
      ...prayer,
      isCurrent: index === currentPrayerIndex,
      isNext: index === nextPrayerIndex,
    }));

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
