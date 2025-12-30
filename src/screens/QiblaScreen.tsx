import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Animated,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Line, Path, G, Text as SvgText, Defs, RadialGradient, Stop } from 'react-native-svg';
import * as Location from 'expo-location';
import * as Sensors from 'expo-sensors';
import { getQiblaDirection } from '../services/prayerService';
import { useTimeFormat } from '../contexts/TimeFormatContext';

const { width, height } = Dimensions.get('window');
const COMPASS_SIZE = Math.min(width * 0.85, 340);

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function QiblaScreen() {
  const { timeFormat } = useTimeFormat();
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAligned, setIsAligned] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Animation refs
  const compassRotation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeLocation();
    startCompass();
    startAnimations();

    return () => {
      Sensors.Magnetometer.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (location) {
      const direction = getQiblaDirection(location.latitude, location.longitude);
      setQiblaDirection(direction);
      setDistance(calculateDistance(location.latitude, location.longitude, KAABA_LAT, KAABA_LNG));
    }
  }, [location]);

  useEffect(() => {
    if (qiblaDirection !== null) {
      // Check if device is aligned with Qibla (within 5 degrees)
      const diff = Math.abs(((qiblaDirection - deviceHeading) + 180) % 360 - 180);
      setIsAligned(diff < 5);
      
      // Animate compass
      Animated.spring(compassRotation, {
        toValue: -deviceHeading,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }).start();
    }
  }, [deviceHeading, qiblaDirection]);

  const initializeLocation = async () => {
    try {
      setIsLoading(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Required',
          'Please enable location services to find Qibla direction.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        accuracy: locationResult.coords.accuracy || undefined,
      });

      // Fade in animation
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
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
    Sensors.Magnetometer.setUpdateInterval(50);
    Sensors.Magnetometer.addListener(({ x, y }) => {
      let heading = Math.atan2(y, x) * (180 / Math.PI);
      heading = (heading + 360) % 360;
      // Smooth the heading
      setDeviceHeading(heading);
    });
  };

  const startAnimations = () => {
    // Pulse animation for Kaaba icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Glow animation when aligned
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calibrateCompass = () => {
    Alert.alert(
      '📱 Calibrate Compass',
      'Move your device in a figure-8 pattern several times to calibrate the compass sensor.',
      [{ text: 'Got it!' }]
    );
  };

  const renderCompass = () => {
    const compassSpin = compassRotation.interpolate({
      inputRange: [-360, 0, 360],
      outputRange: ['-360deg', '0deg', '360deg'],
    });

    const qiblaAngle = qiblaDirection || 0;

    return (
      <View style={styles.compassWrapper}>
        {/* Alignment glow effect */}
        {isAligned && (
          <Animated.View 
            style={[
              styles.alignedGlow,
              { opacity: glowAnim }
            ]}
          />
        )}

        {/* Main compass */}
        <Animated.View
          style={[
            styles.compassContainer,
            { transform: [{ rotate: compassSpin }] }
          ]}
        >
          <Svg width={COMPASS_SIZE} height={COMPASS_SIZE} viewBox="0 0 300 300">
            <Defs>
              <RadialGradient id="compassGrad" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#1A3A35" />
                <Stop offset="100%" stopColor="#0D2622" />
              </RadialGradient>
            </Defs>

            {/* Outer ring */}
            <Circle cx="150" cy="150" r="145" fill="none" stroke="#00BFA5" strokeWidth="2" opacity="0.3" />
            <Circle cx="150" cy="150" r="140" fill="url(#compassGrad)" />
            
            {/* Inner decorative rings */}
            <Circle cx="150" cy="150" r="120" fill="none" stroke="rgba(0,191,165,0.2)" strokeWidth="1" />
            <Circle cx="150" cy="150" r="100" fill="none" stroke="rgba(0,191,165,0.15)" strokeWidth="1" />
            <Circle cx="150" cy="150" r="80" fill="none" stroke="rgba(0,191,165,0.1)" strokeWidth="1" />

            {/* Degree markers */}
            {[...Array(72)].map((_, i) => {
              const angle = i * 5;
              const isMajor = angle % 30 === 0;
              const isCardinal = angle % 90 === 0;
              const length = isCardinal ? 20 : isMajor ? 15 : 8;
              const x1 = 150 + 120 * Math.sin(angle * Math.PI / 180);
              const y1 = 150 - 120 * Math.cos(angle * Math.PI / 180);
              const x2 = 150 + (120 - length) * Math.sin(angle * Math.PI / 180);
              const y2 = 150 - (120 - length) * Math.cos(angle * Math.PI / 180);
              return (
                <Line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={isCardinal ? '#00BFA5' : isMajor ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isCardinal ? 3 : isMajor ? 2 : 1}
                />
              );
            })}

            {/* Cardinal directions */}
            {[
              { label: 'N', angle: 0, color: '#00BFA5' },
              { label: 'E', angle: 90, color: 'rgba(255,255,255,0.7)' },
              { label: 'S', angle: 180, color: 'rgba(255,255,255,0.7)' },
              { label: 'W', angle: 270, color: 'rgba(255,255,255,0.7)' },
            ].map(({ label, angle, color }) => {
              const x = 150 + 95 * Math.sin(angle * Math.PI / 180);
              const y = 150 - 95 * Math.cos(angle * Math.PI / 180) + 6;
              return (
                <SvgText
                  key={label}
                  x={x}
                  y={y}
                  fontSize="18"
                  fontWeight="bold"
                  fill={color}
                  textAnchor="middle"
                >
                  {label}
                </SvgText>
              );
            })}

            {/* Qibla direction indicator (arrow pointing to Mecca) */}
            <G rotation={qiblaAngle} origin="150, 150">
              {/* Qibla line */}
              <Line x1="150" y1="150" x2="150" y2="35" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" />
              
              {/* Qibla arrow head */}
              <Path
                d="M 150 20 L 140 45 L 150 38 L 160 45 Z"
                fill="#FFD700"
              />
              
              {/* Kaaba icon circle */}
              <Circle cx="150" cy="25" r="18" fill="#1A1A1A" stroke="#FFD700" strokeWidth="2" />
              
              {/* Kaaba symbol */}
              <Path
                d="M 143 20 L 143 30 L 157 30 L 157 20 Z"
                fill="#FFD700"
              />
              <Circle cx="150" cy="22" r="2" fill="#1A1A1A" />
            </G>

            {/* Center dot */}
            <Circle cx="150" cy="150" r="8" fill="#00BFA5" />
            <Circle cx="150" cy="150" r="4" fill="#FFF" />
          </Svg>
        </Animated.View>

        {/* Fixed "You" indicator at top */}
        <View style={styles.youIndicator}>
          <View style={styles.youArrow} />
          <Text style={styles.youText}>YOU</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#052F2A', '#0A3D37', '#0D4A43']} style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#052F2A" />
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <Ionicons name="compass" size={60} color="#00BFA5" />
          </View>
          <ActivityIndicator size="large" color="#00BFA5" style={{ marginTop: 24 }} />
          <Text style={styles.loadingTitle}>Finding Qibla</Text>
          <Text style={styles.loadingSubtitle}>Getting your location...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#052F2A', '#0A3D37', '#0D4A43']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#052F2A" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleSection}>
          <Text style={styles.headerTitle}>Qibla Direction</Text>
          <Text style={styles.headerSubtitle}>Face towards Makkah</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowTips(!showTips)}>
            <Ionicons name="help-circle-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={calibrateCompass}>
            <Ionicons name="refresh" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Card */}
      <Animated.View style={[styles.statusCard, { opacity: fadeIn }]}>
        <LinearGradient
          colors={isAligned ? ['#00BFA5', '#00897B'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.statusGradient}
        >
          <View style={styles.statusContent}>
            <View style={styles.statusIconContainer}>
              <Ionicons 
                name={isAligned ? 'checkmark-circle' : 'compass-outline'} 
                size={28} 
                color={isAligned ? '#FFF' : '#00BFA5'} 
              />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={[styles.statusTitle, isAligned && styles.statusTitleAligned]}>
                {isAligned ? '✓ Facing Qibla!' : 'Turn to align with Qibla'}
              </Text>
              <Text style={[styles.statusSubtitle, isAligned && styles.statusSubtitleAligned]}>
                {qiblaDirection !== null 
                  ? `Qibla is ${qiblaDirection.toFixed(1)}° from North`
                  : 'Calculating...'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main Compass */}
      <Animated.View style={[styles.compassSection, { opacity: fadeIn }]}>
        {renderCompass()}
      </Animated.View>

      {/* Info Cards */}
      <Animated.View style={[styles.infoSection, { opacity: fadeIn }]}>
        <View style={styles.infoCard}>
          <Ionicons name="location" size={22} color="#00BFA5" />
          <View style={styles.infoCardContent}>
            <Text style={styles.infoCardLabel}>Distance to Kaaba</Text>
            <Text style={styles.infoCardValue}>
              {distance ? `${distance.toFixed(0)} km` : '--'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="navigate" size={22} color="#00BFA5" />
          <View style={styles.infoCardContent}>
            <Text style={styles.infoCardLabel}>Bearing</Text>
            <Text style={styles.infoCardValue}>
              {qiblaDirection !== null ? `${qiblaDirection.toFixed(1)}°` : '--'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="radio-button-on" size={22} color={location?.accuracy && location.accuracy < 20 ? '#4CAF50' : '#FF9800'} />
          <View style={styles.infoCardContent}>
            <Text style={styles.infoCardLabel}>Accuracy</Text>
            <Text style={styles.infoCardValue}>
              {location?.accuracy ? `±${location.accuracy.toFixed(0)}m` : '--'}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Tips Panel */}
      {showTips && (
        <View style={styles.tipsPanel}>
          <BlurView intensity={80} tint="dark" style={styles.tipsBlur}>
            <View style={styles.tipsContent}>
              <View style={styles.tipsHeader}>
                <Text style={styles.tipsTitle}>📱 How to Use</Text>
                <TouchableOpacity onPress={() => setShowTips(false)}>
                  <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.tipItem}>
                <View style={styles.tipNumber}><Text style={styles.tipNumberText}>1</Text></View>
                <Text style={styles.tipText}>Hold your phone flat and level</Text>
              </View>
              
              <View style={styles.tipItem}>
                <View style={styles.tipNumber}><Text style={styles.tipNumberText}>2</Text></View>
                <Text style={styles.tipText}>The golden arrow points to the Kaaba</Text>
              </View>
              
              <View style={styles.tipItem}>
                <View style={styles.tipNumber}><Text style={styles.tipNumberText}>3</Text></View>
                <Text style={styles.tipText}>Rotate until "YOU" aligns with the arrow</Text>
              </View>
              
              <View style={styles.tipItem}>
                <View style={styles.tipNumber}><Text style={styles.tipNumberText}>4</Text></View>
                <Text style={styles.tipText}>The card turns green when aligned</Text>
              </View>

              <View style={styles.tipDivider} />
              
              <Text style={styles.tipNote}>
                💡 Stay away from metal objects for best accuracy
              </Text>
            </View>
          </BlurView>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 191, 165, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 24,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitleSection: {},
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Status Card
  statusCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statusGradient: {
    padding: 16,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF',
  },
  statusTitleAligned: {
    color: '#FFF',
  },
  statusSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statusSubtitleAligned: {
    color: 'rgba(255,255,255,0.9)',
  },

  // Compass
  compassSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  compassWrapper: {
    width: COMPASS_SIZE + 40,
    height: COMPASS_SIZE + 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassContainer: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
  },
  alignedGlow: {
    position: 'absolute',
    width: COMPASS_SIZE + 30,
    height: COMPASS_SIZE + 30,
    borderRadius: (COMPASS_SIZE + 30) / 2,
    backgroundColor: 'rgba(0, 191, 165, 0.3)',
  },
  youIndicator: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  youArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#00BFA5',
  },
  youText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00BFA5',
    marginTop: 4,
    letterSpacing: 1,
  },

  // Info Section
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  infoCardContent: {
    alignItems: 'center',
    marginTop: 8,
  },
  infoCardLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 4,
  },

  // Tips Panel
  tipsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  tipsBlur: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  tipsContent: {},
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00BFA5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  tipText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  tipDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 16,
  },
  tipNote: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});
