import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserLocation {
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
  city?: string;
  region?: string;
}

export interface LocationCache {
  location: UserLocation;
  timestamp: number;
  expiresAt: number;
}

const LOCATION_CACHE_KEY = 'user_location_cache';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

class LocationService {
  private static instance: LocationService;
  private currentLocation: UserLocation | null = null;
  private locationCache: LocationCache | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Get user's current location with caching
   */
  async getUserLocation(): Promise<UserLocation | null> {
    try {
      // Check if we have a valid cached location
      const cachedLocation = await this.getCachedLocation();
      if (cachedLocation && Date.now() < cachedLocation.expiresAt) {
        console.log('📍 Using cached location:', cachedLocation.location.city, cachedLocation.location.country);
        this.currentLocation = cachedLocation.location;
        return cachedLocation.location;
      }

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Location permission denied');
        return null;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });

      const { latitude, longitude } = location.coords;
      console.log('📍 Current coordinates:', latitude, longitude);

      // Reverse geocode to get address information
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length === 0) {
        console.log('❌ Could not get address from coordinates');
        return null;
      }

      const addressInfo = address[0];
      const timezone = this.getTimezoneFromCoordinates(latitude, longitude);
      
      const userLocation: UserLocation = {
        latitude,
        longitude,
        country: addressInfo.country || 'Unknown',
        timezone,
        city: addressInfo.city || addressInfo.district || 'Unknown',
        region: addressInfo.region || addressInfo.subregion,
      };

      // Cache the location
      await this.cacheLocation(userLocation);
      this.currentLocation = userLocation;

      console.log('✅ Location detected:', userLocation.city, userLocation.country, userLocation.timezone);
      return userLocation;

    } catch (error) {
      console.error('❌ Error getting user location:', error);
      
      // Try to use cached location even if expired
      const cachedLocation = await this.getCachedLocation();
      if (cachedLocation) {
        console.log('📍 Using expired cached location as fallback');
        this.currentLocation = cachedLocation.location;
        return cachedLocation.location;
      }
      
      return null;
    }
  }

  /**
   * Get cached location from storage
   */
  private async getCachedLocation(): Promise<LocationCache | null> {
    try {
      const cached = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('❌ Error reading cached location:', error);
    }
    return null;
  }

  /**
   * Cache location to storage
   */
  private async cacheLocation(location: UserLocation): Promise<void> {
    try {
      const cache: LocationCache = {
        location,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION,
      };
      await AsyncStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cache));
      console.log('💾 Location cached successfully');
    } catch (error) {
      console.error('❌ Error caching location:', error);
    }
  }

  /**
   * Get timezone from coordinates (simplified)
   */
  private getTimezoneFromCoordinates(lat: number, lng: number): string {
    // This is a simplified timezone detection
    // In a production app, you might want to use a more sophisticated library
    
    // Africa timezones
    if (lat >= -35 && lat <= 37 && lng >= -25 && lng <= 60) {
      if (lng >= -20 && lng <= 20) return 'Africa/Lagos'; // West Africa
      if (lng >= 20 && lng <= 40) return 'Africa/Cairo'; // North Africa
      if (lng >= 40 && lng <= 60) return 'Asia/Dubai'; // Middle East
    }
    
    // Asia timezones
    if (lat >= 0 && lat <= 50 && lng >= 60 && lng <= 180) {
      if (lng >= 60 && lng <= 80) return 'Asia/Karachi';
      if (lng >= 80 && lng <= 100) return 'Asia/Dhaka';
      if (lng >= 100 && lng <= 120) return 'Asia/Jakarta';
    }
    
    // Europe timezones
    if (lat >= 35 && lat <= 70 && lng >= -10 && lng <= 40) {
      return 'Europe/London';
    }
    
    // Americas timezones
    if (lat >= -60 && lat <= 70 && lng >= -180 && lng <= -30) {
      if (lng >= -80 && lng <= -30) return 'America/New_York';
      if (lng >= -120 && lng <= -80) return 'America/Los_Angeles';
    }
    
    // Default fallback
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  /**
   * Get current location (cached or fresh)
   */
  getCurrentLocation(): UserLocation | null {
    return this.currentLocation;
  }

  /**
   * Clear location cache
   */
  async clearLocationCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LOCATION_CACHE_KEY);
      this.currentLocation = null;
      this.locationCache = null;
      console.log('🗑️ Location cache cleared');
    } catch (error) {
      console.error('❌ Error clearing location cache:', error);
    }
  }

  /**
   * Get local time for current location
   */
  getLocalTime(): string {
    if (!this.currentLocation) {
      return new Date().toLocaleString();
    }

    try {
      return new Date().toLocaleString('en-US', {
        timeZone: this.currentLocation.timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      console.error('❌ Error getting local time:', error);
      return new Date().toLocaleString();
    }
  }

  /**
   * Get timezone offset for current location
   */
  getTimezoneOffset(): number {
    if (!this.currentLocation) {
      return new Date().getTimezoneOffset();
    }

    try {
      const now = new Date();
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      const local = new Date(utc.toLocaleString('en-US', { timeZone: this.currentLocation.timezone }));
      return (local.getTime() - utc.getTime()) / 60000;
    } catch (error) {
      console.error('❌ Error getting timezone offset:', error);
      return new Date().getTimezoneOffset();
    }
  }
}

export default LocationService;
