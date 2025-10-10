import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Sensors from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { getQiblaDirection } from '../services/prayerService';
import { useTimeFormat } from '../contexts/TimeFormatContext';
import { useLanguage } from '../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');
const COMPASS_SIZE = Math.min(width, height) * 0.5;

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
}

interface QiblaData {
  direction: number;
  distance: number;
  bearing: number;
}

export default function QiblaScreen() {
  const { timeFormat } = useTimeFormat();
  const { t } = useLanguage();
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [accuracy, setAccuracy] = useState<'high' | 'medium' | 'low'>('low');
  const [viewMode, setViewMode] = useState<'compass' | 'map' | 'info'>('compass');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [compassStyle, setCompassStyle] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animation values
  const compassRotation = useRef(new Animated.Value(0)).current;
  const needleRotation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const isExpoGo = Constants.appOwnership === 'expo';

  // Kaaba coordinates
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  useEffect(() => {
    initializeLocation();
    startCompass();
    startTimeUpdate();
    startPulseAnimation();

    return () => {
      Sensors.Magnetometer.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (location) {
      calculateQiblaData();
    }
  }, [location]);

  useEffect(() => {
    if (qiblaData && deviceHeading !== null) {
      animateCompass();
    }
  }, [qiblaData, deviceHeading]);

  const initializeLocation = async () => {
    try {
      setIsLoading(true);
      
      // Check permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to find the Qibla direction.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      // Get current location
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 10000,
      });

      const newLocation: LocationData = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        accuracy: locationResult.coords.accuracy || undefined,
        altitude: locationResult.coords.altitude || undefined,
      };

      setLocation(newLocation);
      setAccuracy(getAccuracyLevel(locationResult.coords.accuracy || 0));
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Unable to get your location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startCompass = () => {
    Sensors.Magnetometer.setUpdateInterval(100);
    Sensors.Magnetometer.addListener(({ x, y }) => {
      const heading = Math.atan2(y, x) * (180 / Math.PI);
      const normalizedHeading = (heading + 360) % 360;
      setDeviceHeading(normalizedHeading);
    });
  };

  const startTimeUpdate = () => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  };

  const startPulseAnimation = () => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(pulse);
    };
    pulse();
  };

  const calculateQiblaData = () => {
    if (!location) return;

    const direction = getQiblaDirection(location.latitude, location.longitude);
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      KAABA_LAT,
      KAABA_LNG
    );

    setQiblaData({
      direction,
      distance,
      bearing: direction,
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getAccuracyLevel = (accuracy: number): 'high' | 'medium' | 'low' => {
    if (accuracy <= 10) return 'high';
    if (accuracy <= 50) return 'medium';
    return 'low';
  };

  const animateCompass = () => {
    if (!qiblaData) return;

    const targetRotation = -deviceHeading;
    const needleTargetRotation = qiblaData.direction - deviceHeading;

    Animated.parallel([
      Animated.timing(compassRotation, {
        toValue: targetRotation,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(needleRotation, {
        toValue: needleTargetRotation,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const calibrateCompass = async () => {
    setIsCalibrating(true);
    Alert.alert(
      'Calibrate Compass',
      'Please move your device in a figure-8 pattern to calibrate the compass.',
      [
        {
          text: 'Done',
          onPress: () => setIsCalibrating(false),
        },
      ]
    );
  };

  const formatDistance = (distance: number): string => {
    if (distanceUnit === 'mi') {
      return `${(distance * 0.621371).toFixed(1)} mi`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const formatTime = (date: Date): string => {
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

  const renderHeader = () => (
    <LinearGradient
      colors={[colors.accentTeal, colors.accentGreen]}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Qibla Direction</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowGuide(!showGuide)}
          >
            <Ionicons name="help-circle" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={calibrateCompass}
          >
            <Ionicons name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderModeSelector = () => (
    <View style={styles.modeSelector}>
      {['compass', 'map', 'info'].map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[
            styles.modeButton,
            viewMode === mode && styles.modeButtonActive,
          ]}
          onPress={() => setViewMode(mode as any)}
        >
          <Ionicons
            name={
              mode === 'compass' ? 'compass' :
              mode === 'map' ? 'map' : 'information-circle'
            }
            size={20}
            color={viewMode === mode ? '#FFFFFF' : colors.accentTeal}
          />
          <Text
            style={[
              styles.modeButtonText,
              viewMode === mode && styles.modeButtonTextActive,
            ]}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCompass = () => (
    <View style={styles.compassContainer}>
      <Animated.View
        style={[
          styles.compass,
          {
            transform: [
              { rotate: compassRotation.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              })},
            ],
          },
        ]}
      >
        {/* Compass Background */}
        <View style={styles.compassBackground}>
          {/* Direction Markers */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => (
            <View
              key={angle}
              style={[
                styles.directionMarker,
                {
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            >
              <Text
                style={[
                  styles.directionText,
                  {
                    transform: [{ rotate: `${-angle}deg` }],
                  },
                ]}
              >
                {['N', '', '', 'E', '', '', 'S', '', '', 'W', '', ''][index]}
              </Text>
            </View>
          ))}
        </View>

        {/* Qibla Needle */}
        <Animated.View
          style={[
            styles.qiblaNeedle,
            {
              transform: [
                { rotate: needleRotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                })},
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <View style={styles.needlePoint} />
          <View style={styles.needleTail} />
        </Animated.View>

        {/* Kaaba Icon - Shows direction to Mecca */}
        {qiblaData && (
          <Animated.View
            style={[
              styles.kaabaIcon,
              {
                transform: [
                  { rotate: needleRotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })},
                  { scale: pulseAnim },
                ],
              },
            ]}
          >
            <View style={styles.kaabaIconContainer}>
              <Ionicons name="cube" size={24} color="#8B4513" />
              <Text style={styles.kaabaLabel}>Kaaba</Text>
            </View>
          </Animated.View>
        )}

        {/* Center Dot */}
        <View style={styles.centerDot} />
      </Animated.View>

      {/* Qibla Direction Text */}
      <View style={styles.directionInfo}>
        <Text style={styles.directionText}>
          {qiblaData ? `${qiblaData.direction.toFixed(1)}°` : '--'}
        </Text>
        <Text style={styles.directionLabel}>Qibla Direction</Text>
      </View>
    </View>
  );

  const renderMap = () => {
    const userRegion: Region | undefined = location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }
      : undefined;

    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={userRegion || {
            latitude: KAABA_LAT,
            longitude: KAABA_LNG,
            latitudeDelta: 10,
            longitudeDelta: 10,
          }}
          showsUserLocation={!!location}
          showsCompass
        >
          {/* User marker */}
          {location && (
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={'You'}
              description={'Your current location'}
            />
          )}
          {/* Kaaba marker */}
          <Marker
            coordinate={{ latitude: KAABA_LAT, longitude: KAABA_LNG }}
            title={'Kaaba'}
            description={'Masjid al-Haram, Makkah'}
          />
          {/* Direction line */}
          {location && (
            <Polyline
              coordinates={[
                { latitude: location.latitude, longitude: location.longitude },
                { latitude: KAABA_LAT, longitude: KAABA_LNG },
              ]}
              strokeColor={colors.accentTeal}
              strokeWidth={3}
            />
          )}
        </MapView>
      </View>
    );
  };

  const renderLocationInfo = () => (
    <View style={styles.infoCard}>
      <Text style={styles.infoCardTitle}>Location Information</Text>
      
      <View style={styles.infoRow}>
        <Ionicons name="location" size={20} color={colors.accentTeal} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Your Location</Text>
          <Text style={styles.infoValue}>
            {location ? 
              `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 
              'Not available'
            }
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="flag" size={20} color={colors.accentTeal} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Distance to Kaaba</Text>
          <Text style={styles.infoValue}>
            {qiblaData ? formatDistance(qiblaData.distance) : 'Calculating...'}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time" size={20} color={colors.accentTeal} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Current Time</Text>
          <Text style={styles.infoValue}>{formatTime(currentTime)}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="checkmark-circle" size={20} color={colors.accentTeal} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Accuracy</Text>
          <Text style={[
            styles.infoValue,
            { color: accuracy === 'high' ? '#4CAF50' : accuracy === 'medium' ? '#FF9800' : '#F44336' }
          ]}>
            {accuracy.charAt(0).toUpperCase() + accuracy.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderKaabaInfo = () => (
    <View style={styles.infoCard}>
      <Text style={styles.infoCardTitle}>Kaaba Information</Text>
      
      <View style={styles.kaabaInfo}>
        <View style={styles.kaabaIcon}>
          <Ionicons name="home" size={40} color={colors.accentTeal} />
        </View>
        <View style={styles.kaabaDetails}>
          <Text style={styles.kaabaTitle}>Sacred Kaaba</Text>
          <Text style={styles.kaabaLocation}>Mecca, Saudi Arabia</Text>
          <Text style={styles.kaabaCoordinates}>
            {KAABA_LAT}°N, {KAABA_LNG}°E
          </Text>
        </View>
      </View>

      <View style={styles.kaabaFacts}>
        <Text style={styles.factsTitle}>Quick Facts</Text>
        <Text style={styles.factItem}>• Built by Prophet Ibrahim (AS)</Text>
        <Text style={styles.factItem}>• Direction of prayer for all Muslims</Text>
        <Text style={styles.factItem}>• Circumambulated during Hajj and Umrah</Text>
        <Text style={styles.factItem}>• Covered with the Kiswah (black cloth)</Text>
      </View>
    </View>
  );

  const renderGuide = () => (
    <View style={styles.guideCard}>
      <Text style={styles.guideTitle}>How the Qibla Compass Works</Text>
      
      {/* What is Qibla Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>What is Qibla?</Text>
        <Text style={styles.sectionText}>
          Qibla is the direction that Muslims face during prayer, pointing toward the Kaaba in Mecca, Saudi Arabia. 
          The Kaaba is the most sacred site in Islam and serves as the spiritual center for all Muslims worldwide.
        </Text>
      </View>

      {/* How It Works Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>How the Qibla Compass Works</Text>
        <Text style={styles.sectionText}>
          The Qibla compass uses your device's GPS location and magnetometer to calculate the exact direction to Mecca. 
          It combines your current coordinates with the Kaaba's coordinates (21.4225°N, 39.8262°E) to determine the precise bearing.
        </Text>
      </View>

      {/* Step-by-Step Instructions */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>How to Use the Qibla Compass</Text>
        
        <View style={styles.guideSteps}>
          <View style={styles.guideStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Enable Location Services</Text>
              <Text style={styles.stepText}>Allow the app to access your location for accurate Qibla calculation</Text>
            </View>
          </View>
          
          <View style={styles.guideStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Hold Device Flat and Level</Text>
              <Text style={styles.stepText}>Keep your device parallel to the ground for accurate compass readings</Text>
            </View>
          </View>
          
          <View style={styles.guideStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Follow the Qibla Needle</Text>
              <Text style={styles.stepText}>The red needle and Kaaba icon point to the exact Qibla direction</Text>
            </View>
          </View>
          
          <View style={styles.guideStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Face the Qibla Direction</Text>
              <Text style={styles.stepText}>Turn your body to face the direction indicated by the needle</Text>
            </View>
          </View>
          
          <View style={styles.guideStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>5</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Calibrate if Needed</Text>
              <Text style={styles.stepText}>If readings seem inaccurate, use the calibrate button and move your device in a figure-8 pattern</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Accuracy Tips */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Tips for Better Accuracy</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• Stay away from metal objects and electronic devices</Text>
          <Text style={styles.tipItem}>• Avoid using near large buildings or underground</Text>
          <Text style={styles.tipItem}>• Calibrate the compass regularly for best results</Text>
          <Text style={styles.tipItem}>• Use in open areas when possible for GPS accuracy</Text>
          <Text style={styles.tipItem}>• The compass works best when held steady</Text>
        </View>
      </View>

      {/* Understanding the Display */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Understanding the Display</Text>
        <View style={styles.displayInfo}>
          <View style={styles.displayItem}>
            <View style={[styles.displayIcon, { backgroundColor: '#FF4444' }]} />
            <Text style={styles.displayText}>Red Needle: Points to Qibla direction</Text>
          </View>
          <View style={styles.displayItem}>
            <View style={[styles.displayIcon, { backgroundColor: '#8B4513' }]} />
            <Text style={styles.displayText}>Kaaba Icon: Shows Mecca's position</Text>
          </View>
          <View style={styles.displayItem}>
            <View style={[styles.displayIcon, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.displayText}>Green Dot: Your current location</Text>
          </View>
          <View style={styles.displayItem}>
            <View style={[styles.displayIcon, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.displayText}>Blue Arrow: North direction</Text>
          </View>
        </View>
      </View>

      {/* Distance Information */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Distance to Kaaba</Text>
        <Text style={styles.sectionText}>
          The app shows your distance to the Kaaba in Mecca. This distance is calculated using the great circle formula, 
          which accounts for the Earth's curvature. The bearing angle shows the exact direction in degrees from your location.
        </Text>
      </View>

      {/* Prayer Times Integration */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Prayer Times Integration</Text>
        <Text style={styles.sectionText}>
          The Qibla direction is essential for all five daily prayers. Make sure to face the Qibla before starting your prayer. 
          The app also shows the current time and next prayer time to help you prepare for Salah.
        </Text>
      </View>
    </View>
  );

  const renderControls = () => (
    <View style={styles.controlsContainer}>
      <TouchableOpacity
        style={styles.controlButton}
        onPress={() => setDistanceUnit(distanceUnit === 'km' ? 'mi' : 'km')}
      >
        <Ionicons name="swap-horizontal" size={20} color={colors.accentTeal} />
        <Text style={styles.controlButtonText}>Units</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={() => setCompassStyle(
          compassStyle === 'modern' ? 'classic' : 
          compassStyle === 'classic' ? 'minimal' : 'modern'
        )}
      >
        <Ionicons name="color-palette" size={20} color={colors.accentTeal} />
        <Text style={styles.controlButtonText}>Style</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={initializeLocation}
      >
        <Ionicons name="refresh" size={20} color={colors.accentTeal} />
        <Text style={styles.controlButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentTeal} />
        <Text style={styles.loadingText}>Finding your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.accentTeal} />
      {renderHeader()}
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderModeSelector()}
        
        {viewMode === 'compass' && (
          <Animated.View style={[styles.compassSection, { opacity: fadeAnim }]}>
            {renderCompass()}
            {renderControls()}
          </Animated.View>
        )}
        
        {viewMode === 'map' && (
          <Animated.View style={[{ opacity: fadeAnim }]}>
            {renderMap()}
            {renderControls()}
          </Animated.View>
        )}
        
        {viewMode === 'info' && (
          <View style={styles.infoSection}>
            {renderLocationInfo()}
            {renderKaabaInfo()}
          </View>
        )}
        
        {showGuide && renderGuide()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
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
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollContainer: {
    flex: 1,
  },
  modeSelector: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: colors.accentTeal,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  compassSection: {
    alignItems: 'center',
    padding: 20,
  },
  compassContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  compass: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassBackground: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 4,
    borderColor: colors.accentTeal,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionMarker: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: colors.textSecondary,
    top: 10,
  },
  directionText: {
    position: 'absolute',
    top: -25,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  qiblaNeedle: {
    position: 'absolute',
    width: 4,
    height: COMPASS_SIZE * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  needlePoint: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF4444',
  },
  needleTail: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#CCCCCC',
  },
  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accentTeal,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  directionInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  directionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  directionLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoSection: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  mapContainer: {
    height: 300,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  kaabaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  kaabaIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  kaabaDetails: {
    flex: 1,
  },
  kaabaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  kaabaLocation: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  kaabaCoordinates: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  kaabaFacts: {
    marginTop: 16,
  },
  factsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  factItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  guideCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  guideSteps: {
    gap: 16,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  kaabaIcon: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 10,
  },
  kaabaIconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: '#8B4513',
    minWidth: 50,
  },
  kaabaLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 3,
    textAlign: 'center',
  },
  // Enhanced guide styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  stepContent: {
    flex: 1,
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  displayInfo: {
    marginTop: 8,
  },
  displayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  displayIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  displayText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
});