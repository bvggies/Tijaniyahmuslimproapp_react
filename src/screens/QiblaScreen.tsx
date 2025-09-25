import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Animated,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Sensors from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { getQiblaDirection } from '../services/prayerService';
import LocationService from '../services/locationService';

const { width, height } = Dimensions.get('window');
const COMPASS_SIZE = Math.min(width, height) * 0.6; // reduced to prevent overlap when map is shown

export default function QiblaScreen() {
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [rotation] = useState(new Animated.Value(0));
  const [viewMode, setViewMode] = useState<'compass' | 'map'>('compass');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [backgroundStyle, setBackgroundStyle] = useState<'none' | 'kaaba' | 'mosque'>('none');

  const isExpoGo = Constants.appOwnership === 'expo';

  const maps = useMemo(() => {
    // Disable map usage in Expo Go; react-native-maps native module isn't available there
    if (isExpoGo) {
      return { available: false } as any;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require('react-native-maps');
      if (!mod?.default) return { available: false } as any;
      return {
        MapView: mod.default,
        Marker: mod.Marker,
        Polyline: mod.Polyline,
        available: true,
      } as any;
    } catch (e) {
      return { available: false } as any;
    }
  }, [isExpoGo]);

  useEffect(() => {
    loadLocationAndCalculateQibla();
    startCompass();
    loadPreferences();
    return () => {
      Sensors.Magnetometer.removeAllListeners();
    };
  }, []);

  const loadPreferences = async () => {
    try {
      const unit = await AsyncStorage.getItem('qibla_unit');
      const bg = await AsyncStorage.getItem('qibla_bg');
      if (unit === 'km' || unit === 'mi') setDistanceUnit(unit);
      if (bg === 'none' || bg === 'kaaba' || bg === 'mosque') setBackgroundStyle(bg as any);
    } catch {}
  };

  const loadLocationAndCalculateQibla = async () => {
    try {
      const locationService = LocationService.getInstance();
      const locationData = await locationService.getCurrentLocation();
      
      if (!locationData) {
        Alert.alert('Location Required', 'Location permission is needed to calculate Qibla direction.');
        return;
      }

      const coords = locationData.coordinates;
      setLocation(coords);
      const direction = getQiblaDirection(coords.latitude, coords.longitude);
      setQiblaDirection(direction);
    } catch (error) {
      console.error('Error loading location:', error);
      Alert.alert('Error', 'Failed to load location. Please try again.');
    }
  };

  const startCompass = () => {
    Sensors.Magnetometer.setUpdateInterval(100);
    Sensors.Magnetometer.addListener((data) => {
      const { x, y } = data;
      let heading = Math.atan2(y, x) * (180 / Math.PI);
      heading = (heading + 360) % 360;
      setDeviceHeading(heading);
    });
  };

  const calibrateCompass = () => {
    setIsCalibrating(true);
    Alert.alert(
      'Calibrate Compass',
      'Move your device in a figure-8 pattern to calibrate the compass.',
      [
        {
          text: 'Done',
          onPress: () => setIsCalibrating(false),
        },
      ]
    );
  };

  const getCompassRotation = () => {
    if (!location) return 0;
    const rotationAngle = deviceHeading - qiblaDirection;
    return rotationAngle;
  };

  const getDistanceToKaaba = () => {
    if (!location) return 0;
    
    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    
    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((kaabaLat - location.latitude) * Math.PI) / 180;
    const dLng = ((kaabaLng - location.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((location.latitude * Math.PI) / 180) *
        Math.cos((kaabaLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const km = R * c;
    return Math.round(distanceUnit === 'km' ? km : km * 0.621371);
  };

  const rotationAngle = getCompassRotation();
  const kaabaCoords = { latitude: 21.4225, longitude: 39.8262 };
  const backgroundImage =
    backgroundStyle === 'kaaba'
      ? { uri: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Kaaba_-_Masjid_al-Haram%2C_Makkah.jpg' }
      : backgroundStyle === 'mosque'
      ? { uri: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Grand_Mosque_Interior.jpg' }
      : undefined;

  return (
    <View style={styles.container}>
      {backgroundImage ? (
        <ImageBackground source={backgroundImage} style={styles.bgImage} imageStyle={styles.bgImageStyle}>
          {renderContent()}
        </ImageBackground>
      ) : (
        renderContent()
      )}
    </View>
  );

  function renderContent() {
    return (
      <>
      {/* Header */}
      <LinearGradient
        colors={[colors.surface, colors.background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Qibla Compass</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.headerActionBtn, viewMode === 'compass' && styles.headerActionActive]}
              onPress={() => setViewMode('compass')}
            >
              <Ionicons name="compass" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerActionBtn, viewMode === 'map' && styles.headerActionActive]}
              onPress={() => setViewMode('map')}
            >
              <Ionicons name="map" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.calibrateButton} onPress={calibrateCompass}>
              <Ionicons name="refresh" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={{ marginTop: 8 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[styles.pillBtn, distanceUnit === 'km' && styles.pillBtnActive]}
            onPress={async () => {
              setDistanceUnit('km');
              try { await AsyncStorage.setItem('qibla_unit', 'km'); } catch {}
            }}
          >
            <Text style={styles.pillText}>KM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pillBtn, distanceUnit === 'mi' && styles.pillBtnActive]}
            onPress={async () => {
              setDistanceUnit('mi');
              try { await AsyncStorage.setItem('qibla_unit', 'mi'); } catch {}
            }}
          >
            <Text style={styles.pillText}>MI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pillBtn, backgroundStyle === 'none' && styles.pillBtnActive]}
            onPress={async () => {
              setBackgroundStyle('none');
              try { await AsyncStorage.setItem('qibla_bg', 'none'); } catch {}
            }}
          >
            <Text style={styles.pillText}>Plain</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pillBtn, backgroundStyle === 'kaaba' && styles.pillBtnActive]}
            onPress={async () => {
              setBackgroundStyle('kaaba');
              try { await AsyncStorage.setItem('qibla_bg', 'kaaba'); } catch {}
            }}
          >
            <Text style={styles.pillText}>Kaaba</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pillBtn, backgroundStyle === 'mosque' && styles.pillBtnActive]}
            onPress={async () => {
              setBackgroundStyle('mosque');
              try { await AsyncStorage.setItem('qibla_bg', 'mosque'); } catch {}
            }}
          >
            <Text style={styles.pillText}>Mosque</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {/* Map above Compass */}
        <View style={styles.mapContainerSmall}>
          {maps.available && location ? (
            <maps.MapView
              style={styles.map}
              initialRegion={{
                latitude: (location.latitude + 21.4225) / 2,
                longitude: (location.longitude + 39.8262) / 2,
                latitudeDelta: Math.max(0.5, Math.abs(location.latitude - 21.4225) * 2),
                longitudeDelta: Math.max(0.5, Math.abs(location.longitude - 39.8262) * 2),
              }}
              showsUserLocation
              showsCompass
              pitchEnabled={false}
              rotateEnabled
              loadingEnabled
            >
              <maps.Marker coordinate={{ latitude: 21.4225, longitude: 39.8262 }} title="Kaaba" description="Masjid al-Haram" />
              <maps.Polyline
                coordinates={[location, { latitude: 21.4225, longitude: 39.8262 }]}
                strokeColor="#FF6B6B"
                strokeWidth={3}
              />
            </maps.MapView>
          ) : (
            <View style={styles.mapFallback}>
              <Ionicons name="map" size={32} color="#999" />
              <Text style={styles.mapFallbackText}>
                Map preview unavailable. {location ? 'Install a dev build with react-native-maps.' : 'Waiting for location...'}
              </Text>
            </View>
          )}
          <View style={styles.mapInfoBarSmall}>
            <Text style={styles.mapInfoText}>Kaaba</Text>
            <Text style={styles.mapInfoText}>Distance: {getDistanceToKaaba()} {distanceUnit}</Text>
          </View>
        </View>

        {/* Compass Container */}
        <View style={styles.compassContainer}>
          <View style={styles.compassOuter}>
            <Animated.View
              style={[
                styles.compassInner,
                {
                  transform: [
                    {
                      rotate: `${rotationAngle}deg`,
                    },
                  ],
                },
              ]}
            >
              {/* Compass Background */}
              <View style={styles.compassBackground}>
                {/* Direction Markers */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => (
                  <View
                    key={index}
                    style={[
                      styles.directionMarker,
                      {
                        transform: [{ rotate: `${angle}deg` }],
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.markerLine,
                        angle % 90 === 0 && styles.majorMarker,
                      ]}
                    />
                    {angle % 90 === 0 && (
                      <Text
                        style={[
                          styles.directionText,
                          {
                            transform: [{ rotate: `${-angle}deg` }],
                          },
                        ]}
                      >
                        {angle === 0 ? 'N' : angle === 90 ? 'E' : angle === 180 ? 'S' : 'W'}
                      </Text>
                    )}
                  </View>
                ))}

                {/* Qibla Arrow */}
                <View style={styles.qiblaArrow}>
                  <Ionicons name="arrow-up" size={40} color="#FF6B6B" />
                </View>

                {/* Center Dot */}
                <View style={styles.centerDot} />
              </View>
            </Animated.View>
          </View>

          {/* Qibla Direction Info */}
          <View style={styles.directionInfo}>
            <Text style={styles.directionText}>Qibla: {Math.round(qiblaDirection)}°</Text>
            <Text style={styles.distanceText}>
              Distance to Kaaba: {getDistanceToKaaba()} {distanceUnit}
            </Text>
            <Text style={styles.metaText}>Heading: {Math.round(deviceHeading)}°</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionCard}>
            <Ionicons name="information-circle" size={24} color="#2196F3" />
            <View style={styles.instructionContent}>
              <Text style={styles.instructionTitle}>How to Use</Text>
              <Text style={styles.instructionText}>
                {'1. Hold your device flat\n2. Rotate until the red arrow points to the top\n3. The arrow now points to the Qibla direction'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Calibration Status */}
      {isCalibrating && (
        <View style={styles.calibrationOverlay}>
          <View style={styles.calibrationCard}>
            <Ionicons name="compass" size={48} color="#FF6B6B" />
            <Text style={styles.calibrationText}>Calibrating Compass...</Text>
            <Text style={styles.calibrationSubtext}>
              Move your device in a figure-8 pattern
            </Text>
          </View>
        </View>
      )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 70, // Add padding for floating tab bar
  },
  header: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginLeft: 8,
  },
  headerActionActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  calibrateButton: {
    padding: 8,
  },
  pillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginRight: 8,
  },
  pillBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  pillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  mapContainerSmall: {
    height: 200,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  map: {
    flex: 1,
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapFallbackText: {
    marginTop: 6,
    color: '#B8860B',
    textAlign: 'center',
  },
  mapInfoBarSmall: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapInfoText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  compassContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  compassOuter: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassInner: {
    width: COMPASS_SIZE - 20,
    height: COMPASS_SIZE - 20,
    borderRadius: (COMPASS_SIZE - 20) / 2,
    position: 'relative',
  },
  compassBackground: {
    width: '100%',
    height: '100%',
    borderRadius: (COMPASS_SIZE - 20) / 2,
    backgroundColor: '#F8F9FA',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionMarker: {
    position: 'absolute',
    width: 2,
    height: (COMPASS_SIZE - 20) / 2 - 10,
    top: 10,
    left: '50%',
    marginLeft: -1,
  },
  markerLine: {
    width: 2,
    height: 20,
    backgroundColor: '#666',
  },
  majorMarker: {
    height: 30,
    backgroundColor: '#333',
  },
  directionText: {
    position: 'absolute',
    top: -25,
    left: -10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  qiblaArrow: {
    position: 'absolute',
    top: 20,
    left: '50%',
    marginLeft: -20,
    zIndex: 10,
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -4,
    marginLeft: -4,
  },
  directionInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  directionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b1f24',
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 16,
    color: colors.primary,
  },
  metaText: {
    marginTop: 4,
    fontSize: 14,
    color: '#B8860B',
  },
  instructionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  instructionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionContent: {
    flex: 1,
    marginLeft: 12,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#B8860B',
    lineHeight: 20,
  },
  calibrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calibrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    margin: 20,
  },
  calibrationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  calibrationSubtext: {
    fontSize: 14,
    color: '#B8860B',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapInfoBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapInfoTextLarge: {
    color: '#fff',
    fontWeight: '600',
  },
  bgImage: {
    flex: 1,
  },
  bgImageStyle: {
    opacity: 0.35,
  },
});
