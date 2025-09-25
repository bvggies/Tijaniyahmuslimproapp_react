import * as Location from 'expo-location';
import { Location as LocationType } from '../types';

export interface LocationData {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: {
    city: string;
    country: string;
    region?: string;
    street?: string;
  };
  timezone?: string;
}

class LocationService {
  private static instance: LocationService;
  private cachedLocation: LocationData | null = null;
  private lastLocationUpdate: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Request location permissions
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  // Get current location with caching
  async getCurrentLocation(forceRefresh: boolean = false): Promise<LocationData | null> {
    try {
      // Check if we have cached location and it's still valid
      if (!forceRefresh && this.cachedLocation && this.isCacheValid()) {
        return this.cachedLocation;
      }

      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Get reverse geocoding for address information
      const reverseGeocode = await Location.reverseGeocodeAsync(coords);
      const addressInfo = reverseGeocode[0];

      const locationData: LocationData = {
        coordinates: coords,
        address: {
          city: addressInfo?.city || 'Unknown',
          country: addressInfo?.country || 'Unknown',
          region: addressInfo?.region,
          street: addressInfo?.street,
        },
        timezone: await this.getTimezoneFromCoordinates(coords.latitude, coords.longitude),
      };

      // Cache the location
      this.cachedLocation = locationData;
      this.lastLocationUpdate = Date.now();

      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  // Get timezone from coordinates
  private async getTimezoneFromCoordinates(latitude: number, longitude: number): Promise<string> {
    try {
      // Use a simple timezone calculation based on longitude
      // In production, you might want to use a more sophisticated timezone service
      const timezoneOffset = Math.round(longitude / 15);
      return `GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`;
    } catch (error) {
      console.error('Error getting timezone:', error);
      return 'GMT+0';
    }
  }

  // Check if cached location is still valid
  private isCacheValid(): boolean {
    return Date.now() - this.lastLocationUpdate < this.CACHE_DURATION;
  }

  // Clear cached location
  clearCache(): void {
    this.cachedLocation = null;
    this.lastLocationUpdate = 0;
  }

  // Get cached location
  getCachedLocation(): LocationData | null {
    return this.cachedLocation;
  }

  // Check if location services are enabled
  async isLocationEnabled(): Promise<boolean> {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      return enabled;
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }

  // Get location accuracy
  async getLocationAccuracy(): Promise<Location.Accuracy> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return Location.Accuracy.Lowest;
      }

      // Try to get a high accuracy location first
      try {
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          timeout: 5000,
        });
        return Location.Accuracy.Highest;
      } catch {
        // Fall back to balanced accuracy
        return Location.Accuracy.Balanced;
      }
    } catch (error) {
      console.error('Error getting location accuracy:', error);
      return Location.Accuracy.Lowest;
    }
  }

  // Format location for display
  formatLocationForDisplay(locationData: LocationData): string {
    const { address } = locationData;
    if (address.street && address.city) {
      return `${address.street}, ${address.city}, ${address.country}`;
    } else if (address.city) {
      return `${address.city}, ${address.country}`;
    } else {
      return `${address.country}`;
    }
  }

  // Get distance between two coordinates (in kilometers)
  getDistanceBetween(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export default LocationService;
