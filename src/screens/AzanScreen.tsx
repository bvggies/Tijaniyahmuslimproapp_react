import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import IslamicBackground from '../components/IslamicBackground';
import { Audio } from 'expo-av';
import { useLanguage } from '../contexts/LanguageContext';
import { useFadeIn } from '../hooks/useAnimations';
import { api } from '../services/api';

const { width } = Dimensions.get('window');

interface AzanOption {
  id: string;
  name: string;
  muezzin: string;
  location: string;
  description: string;
  icon: string;
  color: string;
  /** Local require() result (number) or remote URL string */
  audioUrl: string | number;
}

const TijaniyaAzanScreen: React.FC = () => {
  const { t } = useLanguage();
  const [selectedAzan, setSelectedAzan] = useState<AzanOption | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminAzans, setAdminAzans] = useState<AzanOption[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);
  const opacity = useFadeIn({ duration: 380 });

  useEffect(() => {
    let cancelled = false;
    api.getAzans(true)
      .then((list) => {
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        setAdminAzans(
          arr.map((a: { id: string; name: string; muezzin?: string; location?: string; description?: string; audioUrl: string }) => ({
            id: a.id,
            name: a.name,
            muezzin: a.muezzin || '',
            location: a.location || '',
            description: a.description || '',
            icon: 'volume-high',
            color: colors.accentTeal,
            audioUrl: a.audioUrl,
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setAdminAzans([]);
      });
    return () => { cancelled = true; };
  }, []);

  const builtInAzans: AzanOption[] = [
    {
      id: 'makkah',
      name: 'Makkah Al-Mukarramah',
      muezzin: 'Sheikh Abdul Rahman Al-Sudais',
      location: 'Masjid al-Haram, Makkah',
      description: 'The sacred call to prayer from the Grand Mosque in Makkah',
      icon: 'location',
      color: colors.primary,
      audioUrl: require('../../assets/audio/azan/makkah.mp3'),
    },
    {
      id: 'istanbul',
      name: 'Istanbul',
      muezzin: 'Sheikh Hafiz Mustafa Özcan',
      location: 'Sultan Ahmed Mosque, Istanbul',
      description: 'The magnificent call from the Blue Mosque in Istanbul',
      icon: 'business',
      color: colors.warning,
      audioUrl: require('../../assets/audio/azan/istanbul.mp3'),
    },
    {
      id: 'madinah',
      name: 'Madinah Al-Munawwarah',
      muezzin: 'Sheikh Ali Al-Hudhaifi',
      location: 'Masjid an-Nabawi, Madinah',
      description: 'The blessed call to prayer from the Prophet\'s Mosque',
      icon: 'home',
      color: colors.accentTeal,
      audioUrl: require('../../assets/audio/azan/makkah.mp3'), // Using Makkah audio as placeholder
    },
    {
      id: 'jerusalem',
      name: 'Al-Quds (Jerusalem)',
      muezzin: 'Sheikh Ekrima Sabri',
      location: 'Al-Aqsa Mosque, Jerusalem',
      description: 'The historic call to prayer from the third holiest mosque',
      icon: 'flag',
      color: colors.accentGreen,
      audioUrl: require('../../assets/audio/azan/istanbul.mp3'), // Using Istanbul audio as placeholder
    },
    {
      id: 'cairo',
      name: 'Cairo',
      muezzin: 'Sheikh Mahmoud Al-Tablawi',
      location: 'Al-Azhar Mosque, Cairo',
      description: 'The scholarly call from the prestigious Al-Azhar Mosque',
      icon: 'school',
      color: colors.accentYellow,
      audioUrl: require('../../assets/audio/azan/makkah.mp3'), // Using Makkah audio as placeholder
    },
    {
      id: 'baghdad',
      name: 'Baghdad',
      muezzin: 'Sheikh Ahmad Al-Kubaisi',
      location: 'Abu Hanifa Mosque, Baghdad',
      description: 'The traditional call from the historic Abu Hanifa Mosque',
      icon: 'library',
      color: colors.accentTeal,
      audioUrl: require('../../assets/audio/azan/istanbul.mp3'), // Using Istanbul audio as placeholder
    },
  ];

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadAudio = async (azan: AzanOption) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading audio for:', azan.name, 'URL:', azan.audioUrl);
      
      // Stop current audio if playing
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Set audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log('Audio mode set, creating sound...');

      const source = typeof azan.audioUrl === 'string' && (azan.audioUrl.startsWith('http') || azan.audioUrl.startsWith('https'))
        ? { uri: azan.audioUrl }
        : azan.audioUrl;

      // Create new sound object with timeout
      const soundPromise = Audio.Sound.createAsync(
        source,
        { 
          shouldPlay: false,
          volume: volume,
          isLooping: false,
          progressUpdateIntervalMillis: 1000,
        }
      );

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Audio loading timeout')), 10000);
      });

      const { sound } = await Promise.race([soundPromise, timeoutPromise]) as any;

      // Set up status update listener
      sound.setOnPlaybackStatusUpdate((status: any) => {
        console.log('Audio status update:', status);
        if (status.isLoaded) {
          setCurrentTime(status.positionMillis || 0);
          setDuration(status.durationMillis || 0);
          setIsPlaying(status.isPlaying || false);
          
          if (status.didJustFinish) {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        } else if (status.error) {
          console.error('Audio error:', status.error);
          setError(`Audio error: ${status.error}`);
          setIsLoading(false);
        }
      });

      console.log('Sound created successfully');
      soundRef.current = sound;
      setSelectedAzan(azan);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
      setError(`Failed to load audio: ${error.message || 'Network timeout or invalid URL'}`);
      Alert.alert('Audio Error', `Failed to load audio: ${error.message || 'Network timeout or invalid URL'}`);
    }
  };

  const playPause = async () => {
    if (!soundRef.current) return;

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch (error: any) {
      console.error('Error playing/pausing audio:', error);
      Alert.alert('Error', 'Failed to play audio. Please try again.');
    }
  };

  const stopAudio = async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.stopAsync();
      setCurrentTime(0);
      setIsPlaying(false);
    } catch (error: any) {
      console.error('Error stopping audio:', error);
    }
  };

  const seekTo = async (position: number) => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.setPositionAsync(position);
    } catch (error: any) {
      console.error('Error seeking audio:', error);
    }
  };

  const setVolumeLevel = async (newVolume: number) => {
    setVolume(newVolume);
    if (soundRef.current) {
      try {
        await soundRef.current.setVolumeAsync(newVolume);
      } catch (error: any) {
        console.error('Error setting volume:', error);
      }
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const azanOptions = [...builtInAzans, ...adminAzans];

  const renderAzanCard = (azan: AzanOption) => (
    <TouchableOpacity
      key={azan.id}
      style={[
        styles.azanCard,
        selectedAzan?.id === azan.id && styles.selectedCard
      ]}
      onPress={() => loadAudio(azan)}
    >
      <LinearGradient
        colors={[azan.color, `${azan.color}80`]}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name={azan.icon as any} size={24} color="white" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{azan.name}</Text>
            <Text style={styles.cardMuezzin}>{azan.muezzin}</Text>
            <Text style={styles.cardLocation}>{azan.location}</Text>
          </View>
          {selectedAzan?.id === azan.id && (
            <Ionicons name="checkmark-circle" size={24} color="white" />
          )}
        </View>
        <Text style={styles.cardDescription}>{azan.description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderPlayer = () => {
    if (!selectedAzan) return null;

    return (
      <View style={styles.playerContainer}>
        <LinearGradient
          colors={[colors.surface, colors.background]}
          style={styles.playerGradient}
        >
          <Text style={styles.playerTitle}>Now Playing</Text>
          <Text style={styles.playerAzanName}>{selectedAzan.name}</Text>
          <Text style={styles.playerMuezzin}>{selectedAzan.muezzin}</Text>

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <View style={styles.progressBar}>
              <TouchableOpacity
                style={[
                  styles.progressFill,
                  { width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }
                ]}
                onPress={() => {
                  const newPosition = (currentTime / duration) * duration;
                  seekTo(newPosition);
                }}
              />
            </View>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={stopAudio}
            >
              <Ionicons name="stop" size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.playButton, isLoading && styles.disabledButton]}
              onPress={playPause}
              disabled={isLoading || !!error}
            >
              <Ionicons 
                name={isLoading ? "hourglass" : (isPlaying ? "pause" : "play")} 
                size={32} 
                color="white" 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setVolumeLevel(volume === 0 ? 1.0 : 0)}
            >
              <Ionicons 
                name={volume === 0 ? "volume-mute" : "volume-high"} 
                size={24} 
                color={colors.textPrimary} 
              />
            </TouchableOpacity>
          </View>

          {/* Volume Slider */}
          <View style={styles.volumeContainer}>
            <Ionicons name="volume-low" size={16} color={colors.textSecondary} />
            <View style={styles.volumeSlider}>
              <TouchableOpacity
                style={[
                  styles.volumeFill,
                  { width: `${volume * 100}%` }
                ]}
                onPress={() => {
                  const newVolume = volume > 0.5 ? 0.25 : volume > 0.25 ? 0 : 1.0;
                  setVolumeLevel(newVolume);
                }}
              />
            </View>
            <Ionicons name="volume-high" size={16} color={colors.textSecondary} />
          </View>

          {/* Debug Info */}
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              Status: {isLoading ? t('azan.loading') : error ? t('common.error') : selectedAzan ? 'Ready' : 'No audio selected'}
            </Text>
            <Text style={styles.debugText}>
              Audio Source: Local File
            </Text>
            {error && (
              <Text style={[styles.debugText, { color: 'red' }]}>
                Error: {error}
              </Text>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <IslamicBackground opacity={0.1}>
      <Animated.View style={[styles.container, { opacity }]}>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <LinearGradient
            colors={[colors.accentTeal, colors.primary]}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Ionicons name="volume-high" size={40} color="white" />
              <Text style={styles.headerTitle}>{t('azan.title')}</Text>
              <Text style={styles.headerSubtitle}>{t('azan.subtitle')}</Text>
              <Text style={styles.headerArabic}>الأذان</Text>
            </View>
          </LinearGradient>

          {/* Player */}
          {renderPlayer()}

          {/* Azan Options */}
          <View style={styles.optionsContainer}>
            <Text style={styles.sectionTitle}>{t('azan.select_muezzin')}</Text>
            <Text style={styles.sectionSubtitle}>
              {t('azan.subtitle')}
            </Text>
            
            {azanOptions.map(renderAzanCard)}
          </View>

          {/* Information */}
          <View style={styles.infoContainer}>
            <LinearGradient
              colors={[colors.surface, colors.background]}
              style={styles.infoGradient}
            >
              <Text style={styles.infoTitle}>About Azan</Text>
              <Text style={styles.infoText}>
                The Azan (Adhan) is the Islamic call to prayer, recited by the muezzin at prescribed times of the day. 
                It serves as a reminder for Muslims to perform their obligatory prayers and is considered one of the 
                most beautiful and sacred sounds in Islam.
              </Text>
              <Text style={styles.infoText}>
                Each location has its own unique style and melody, reflecting the rich diversity of Islamic culture 
                while maintaining the same sacred message.
              </Text>
              <Text style={[styles.infoText, { color: colors.success, fontWeight: 'bold' }]}>
                ✅ Makkah and Istanbul Azan are now available! More locations will be added soon.
              </Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </Animated.View>
    </IslamicBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
    letterSpacing: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  headerArabic: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  playerContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  playerGradient: {
    padding: 25,
  },
  playerTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 5,
  },
  playerAzanName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  playerMuezzin: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
    minWidth: 40,
    textAlign: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    marginHorizontal: 10,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentTeal,
    borderRadius: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeSlider: {
    width: 150,
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    marginHorizontal: 10,
    position: 'relative',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: colors.accentTeal,
    borderRadius: 2,
  },
  debugContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  azanCard: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedCard: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  cardMuezzin: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    textAlign: 'justify',
  },
  infoContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoGradient: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 10,
  },
});

export default TijaniyaAzanScreen;