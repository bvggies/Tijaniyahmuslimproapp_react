import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  TextInput,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { PrayerTime, Location as LocationType } from '../types';
import { getPrayerTimes, updatePrayerCountdowns } from '../services/prayerService';
import { getCurrentIslamicDate, getUpcomingIslamicEvents } from '../services/islamicCalendarService';
import { colors } from '../utils/theme';
import { commonScreenStyles } from '../utils/screenStyles';
import NotificationService from '../services/notificationService';
import LocationService from '../services/locationService';
import IslamicBackground from '../components/IslamicBackground';
import ProfileAvatar from '../components/ProfileAvatar';
import NewsSection from '../components/NewsSection';
import LanguageSelector from '../components/LanguageSelector';
import { getDailyReminder, getCategoryColor, getCategoryIcon, DailyReminder } from '../services/dailyReminderService';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTimeFormat } from '../contexts/TimeFormatContext';
import { useIslamicCalendar } from '../contexts/IslamicCalendarContext';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { authState } = useAuth();
  const { t, language } = useLanguage();
  const { timeFormat, formatTimeWithSeconds } = useTimeFormat();
  const { getCurrentIslamicDate: getIslamicDate, getCalendarInfo, selectedCalendar, setSelectedCalendar, getAllCalendars } = useIslamicCalendar();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [islamicDate, setIslamicDate] = useState(getIslamicDate());
  const [upcomingEvents] = useState(getUpcomingIslamicEvents());
  const [showAINoor, setShowAINoor] = useState(false);
  const [dailyReminder, setDailyReminder] = useState<DailyReminder | null>(null);
  const [currentTimezone, setCurrentTimezone] = useState<string | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState(new Date());
  // Azan mini player state
  const [selectedAzanId, setSelectedAzanId] = useState<'makkah' | 'istanbul' | null>(null);
  const [isAzanPlaying, setIsAzanPlaying] = useState(false);
  const azanSoundRef = useRef<Audio.Sound | null>(null);
  const [openHajj, setOpenHajj] = useState<'live' | 'guide' | 'journey' | null>(null);

  const azanOptions = [
    {
      id: 'makkah' as const,
      label: 'Makkah',
      file: require('../../assets/audio/azan/makkah.mp3'),
    },
    {
      id: 'istanbul' as const,
      label: 'Istanbul',
      file: require('../../assets/audio/azan/istanbul.mp3'),
    },
  ];
  
  // Animation refs

  useEffect(() => {
    loadLocationAndPrayerTimes();
    loadDailyReminder();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [timeFormat]); // Reload when time format changes

  // Always tick current time every second (independent of prayer times)
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Restore real-time countdown updates for next prayer
  useEffect(() => {
    if (prayerTimes.length === 0) return;

    const intervalId = setInterval(() => {
      setPrayerTimes(prevPrayerTimes => {
        if (prevPrayerTimes.length > 0) {
          const updated = updatePrayerCountdowns(prevPrayerTimes, timeFormat);
          return updated;
        }
        return prevPrayerTimes;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [prayerTimes.length, timeFormat]);

  // Cleanup Azan sound on unmount
  useEffect(() => {
    // Configure iOS/Android audio session so playback works in silent mode on iOS
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        // no-op
      }
    })();

    return () => {
      if (azanSoundRef.current) {
        try {
          azanSoundRef.current.stopAsync();
          azanSoundRef.current.unloadAsync();
        } catch (error) {
          console.log('Error cleaning up azan audio:', error);
        }
        azanSoundRef.current = null;
        setIsAzanPlaying(false);
      }
    };
  }, []);

  const handlePlayPauseAzan = async () => {
    try {
      if (!selectedAzanId) {
        Alert.alert('Azan', 'Please select an azan audio first');
        return;
      }
      // Stop if currently playing
      if (isAzanPlaying && azanSoundRef.current) {
        await azanSoundRef.current.stopAsync();
        await azanSoundRef.current.unloadAsync();
        azanSoundRef.current = null;
        setIsAzanPlaying(false);
        return;
      }

      // (re)load selected audio
      const option = azanOptions.find(o => o.id === selectedAzanId);
      if (!option) return;

      if (azanSoundRef.current) {
        try { await azanSoundRef.current.unloadAsync(); } catch {}
        azanSoundRef.current = null;
      }
      // Ensure audio mode set (especially for iOS silent switch)
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
        });
      } catch {}

      const { sound } = await Audio.Sound.createAsync(option.file, { 
        shouldPlay: true, 
        volume: 0.5, // Reduced volume to prevent issues
        isLooping: false // Ensure no looping
      });
      azanSoundRef.current = sound;
      setIsAzanPlaying(true);
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status && status.didJustFinish) {
          setIsAzanPlaying(false);
          sound.unloadAsync();
          azanSoundRef.current = null;
        }
      });

      // Auto-unload after 30 seconds to prevent hanging
      setTimeout(() => {
        if (azanSoundRef.current) {
          azanSoundRef.current.unloadAsync();
          azanSoundRef.current = null;
          setIsAzanPlaying(false);
        }
      }, 30000);
    } catch (e) {
      setIsAzanPlaying(false);
      Alert.alert('Azan', 'Unable to play audio');
    }
  };

  // Refresh daily reminder at midnight in user's timezone
  useEffect(() => {
    if (!currentTimezone) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      loadDailyReminder(currentTimezone);
      // Set up interval to refresh every 24 hours
      const interval = setInterval(() => loadDailyReminder(currentTimezone), 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, timeUntilMidnight);
    
    return () => clearTimeout(timeout);
  }, [currentTimezone]);

  // Update Islamic date when calendar type changes
  useEffect(() => {
    setIslamicDate(getIslamicDate());
  }, [selectedCalendar, getIslamicDate]);

  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const showCalendarSelector = () => {
    setShowCalendarModal(true);
  };

  const loadLocationAndPrayerTimes = async () => {
    try {
      const locationService = LocationService.getInstance();
      const locationData = await locationService.getCurrentLocation();
      
      if (!locationData) {
        console.log('Unable to get location data');
        return;
      }

      const { coordinates, address } = locationData;

      setCurrentLocation({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        city: address.city,
        country: address.country,
      });

      // Get prayer times using location coordinates
      const times = await getPrayerTimes(coordinates.latitude, coordinates.longitude, timeFormat);
      setPrayerTimes(times);

      // Schedule prayer notifications
      const notificationService = NotificationService.getInstance();
      await notificationService.schedulePrayerNotifications(times);

      // Update Islamic date with location coordinates
      const locationBasedIslamicDate = getCurrentIslamicDate(coordinates.latitude, coordinates.longitude);
      setIslamicDate(locationBasedIslamicDate);

      // Store timezone and load daily reminder
      setCurrentTimezone(locationData.timezone);
      loadDailyReminder(locationData.timezone);
    } catch (error) {
      console.error('Error loading location and prayer times:', error);
    }
  };

  const loadDailyReminder = (timezone?: string) => {
    const reminder = getDailyReminder(timezone);
    setDailyReminder(reminder);
  };

  // Determine current and next prayers from flags maintained by prayerService
  const currentPrayer = React.useMemo(() => {
    return prayerTimes.find(p => p.isCurrent) || null;
  }, [prayerTimes]);

  const nextPrayer = React.useMemo(() => {
    return prayerTimes.find(p => p.isNext) || null;
  }, [prayerTimes]);




  const getCountryFlag = (country?: string): string => {
    if (!country) return '🌍';
    
    console.log('Country received:', country);
    const countryLower = country.toLowerCase();
    
    // Comprehensive country flag mapping
    const flagMap: { [key: string]: string } = {
      // African countries
      'ghana': '🇬🇭',
      'nigeria': '🇳🇬',
      'egypt': '🇪🇬',
      'morocco': '🇲🇦',
      'algeria': '🇩🇿',
      'tunisia': '🇹🇳',
      'libya': '🇱🇾',
      'sudan': '🇸🇩',
      'ethiopia': '🇪🇹',
      'kenya': '🇰🇪',
      'tanzania': '🇹🇿',
      'uganda': '🇺🇬',
      'south africa': '🇿🇦',
      'senegal': '🇸🇳',
      'mali': '🇲🇱',
      'burkina faso': '🇧🇫',
      'niger': '🇳🇪',
      'chad': '🇹🇩',
      'cameroon': '🇨🇲',
      'congo': '🇨🇬',
      'democratic republic of the congo': '🇨🇩',
      'central african republic': '🇨🇫',
      'gabon': '🇬🇦',
      'equatorial guinea': '🇬🇶',
      'sao tome and principe': '🇸🇹',
      'angola': '🇦🇴',
      'zambia': '🇿🇲',
      'zimbabwe': '🇿🇼',
      'botswana': '🇧🇼',
      'namibia': '🇳🇦',
      'lesotho': '🇱🇸',
      'eswatini': '🇸🇿',
      'mozambique': '🇲🇿',
      'madagascar': '🇲🇬',
      'mauritius': '🇲🇺',
      'seychelles': '🇸🇨',
      'comoros': '🇰🇲',
      'djibouti': '🇩🇯',
      'somalia': '🇸🇴',
      'eritrea': '🇪🇷',
      'rwanda': '🇷🇼',
      'burundi': '🇧🇮',
      'malawi': '🇲🇼',
      'liberia': '🇱🇷',
      'sierra leone': '🇸🇱',
      'guinea': '🇬🇳',
      'guinea-bissau': '🇬🇼',
      'gambia': '🇬🇲',
      'cape verde': '🇨🇻',
      'ivory coast': '🇨🇮',
      'cote d\'ivoire': '🇨🇮',
      'togo': '🇹🇬',
      'benin': '🇧🇯',
      
      // Middle Eastern countries
      'saudi arabia': '🇸🇦',
      'united arab emirates': '🇦🇪',
      'qatar': '🇶🇦',
      'kuwait': '🇰🇼',
      'bahrain': '🇧🇭',
      'oman': '🇴🇲',
      'yemen': '🇾🇪',
      'iraq': '🇮🇶',
      'syria': '🇸🇾',
      'lebanon': '🇱🇧',
      'jordan': '🇯🇴',
      'israel': '🇮🇱',
      'palestine': '🇵🇸',
      'iran': '🇮🇷',
      'afghanistan': '🇦🇫',
      'pakistan': '🇵🇰',
      'turkey': '🇹🇷',
      'cyprus': '🇨🇾',
      
      // Asian countries
      'india': '🇮🇳',
      'bangladesh': '🇧🇩',
      'sri lanka': '🇱🇰',
      'maldives': '🇲🇻',
      'nepal': '🇳🇵',
      'bhutan': '🇧🇹',
      'china': '🇨🇳',
      'japan': '🇯🇵',
      'south korea': '🇰🇷',
      'north korea': '🇰🇵',
      'mongolia': '🇲🇳',
      'taiwan': '🇹🇼',
      'hong kong': '🇭🇰',
      'macau': '🇲🇴',
      'vietnam': '🇻🇳',
      'laos': '🇱🇦',
      'cambodia': '🇰🇭',
      'thailand': '🇹🇭',
      'myanmar': '🇲🇲',
      'malaysia': '🇲🇾',
      'singapore': '🇸🇬',
      'indonesia': '🇮🇩',
      'brunei': '🇧🇳',
      'philippines': '🇵🇭',
      'east timor': '🇹🇱',
      'kazakhstan': '🇰🇿',
      'uzbekistan': '🇺🇿',
      'turkmenistan': '🇹🇲',
      'tajikistan': '🇹🇯',
      'kyrgyzstan': '🇰🇬',
      
      // European countries
      'united kingdom': '🇬🇧',
      'ireland': '🇮🇪',
      'france': '🇫🇷',
      'germany': '🇩🇪',
      'italy': '🇮🇹',
      'spain': '🇪🇸',
      'portugal': '🇵🇹',
      'netherlands': '🇳🇱',
      'belgium': '🇧🇪',
      'luxembourg': '🇱🇺',
      'switzerland': '🇨🇭',
      'austria': '🇦🇹',
      'poland': '🇵🇱',
      'czech republic': '🇨🇿',
      'slovakia': '🇸🇰',
      'hungary': '🇭🇺',
      'romania': '🇷🇴',
      'bulgaria': '🇧🇬',
      'croatia': '🇭🇷',
      'slovenia': '🇸🇮',
      'serbia': '🇷🇸',
      'bosnia and herzegovina': '🇧🇦',
      'montenegro': '🇲🇪',
      'albania': '🇦🇱',
      'north macedonia': '🇲🇰',
      'greece': '🇬🇷',
      'cyprus': '🇨🇾',
      'malta': '🇲🇹',
      'denmark': '🇩🇰',
      'sweden': '🇸🇪',
      'norway': '🇳🇴',
      'finland': '🇫🇮',
      'iceland': '🇮🇸',
      'estonia': '🇪🇪',
      'latvia': '🇱🇻',
      'lithuania': '🇱🇹',
      'belarus': '🇧🇾',
      'ukraine': '🇺🇦',
      'moldova': '🇲🇩',
      'russia': '🇷🇺',
      
      // North American countries
      'united states': '🇺🇸',
      'canada': '🇨🇦',
      'mexico': '🇲🇽',
      'guatemala': '🇬🇹',
      'belize': '🇧🇿',
      'el salvador': '🇸🇻',
      'honduras': '🇭🇳',
      'nicaragua': '🇳🇮',
      'costa rica': '🇨🇷',
      'panama': '🇵🇦',
      'cuba': '🇨🇺',
      'jamaica': '🇯🇲',
      'haiti': '🇭🇹',
      'dominican republic': '🇩🇴',
      'puerto rico': '🇵🇷',
      'trinidad and tobago': '🇹🇹',
      'barbados': '🇧🇧',
      'bahamas': '🇧🇸',
      
      // South American countries
      'brazil': '🇧🇷',
      'argentina': '🇦🇷',
      'chile': '🇨🇱',
      'peru': '🇵🇪',
      'colombia': '🇨🇴',
      'venezuela': '🇻🇪',
      'ecuador': '🇪🇨',
      'bolivia': '🇧🇴',
      'paraguay': '🇵🇾',
      'uruguay': '🇺🇾',
      'guyana': '🇬🇾',
      'suriname': '🇸🇷',
      'french guiana': '🇬🇫',
      
      // Oceania countries
      'australia': '🇦🇺',
      'new zealand': '🇳🇿',
      'fiji': '🇫🇯',
      'papua new guinea': '🇵🇬',
      'solomon islands': '🇸🇧',
      'vanuatu': '🇻🇺',
      'new caledonia': '🇳🇨',
      'french polynesia': '🇵🇫',
      'samoa': '🇼🇸',
      'tonga': '🇹🇴',
      'kiribati': '🇰🇮',
      'tuvalu': '🇹🇻',
      'nauru': '🇳🇷',
      'palau': '🇵🇼',
      'marshall islands': '🇲🇭',
      'micronesia': '🇫🇲',
    };
    
    // Try exact match first
    if (flagMap[countryLower]) {
      return flagMap[countryLower];
    }
    
    // Try partial matches for common variations
    for (const [key, flag] of Object.entries(flagMap)) {
      if (countryLower.includes(key) || key.includes(countryLower)) {
        return flag;
      }
    }
    
    // Default fallback
    return '🌍';
  };

  const getTimeUntil = (time: string): string => {
    if (!time) return '';
    
    try {
      const now = new Date();
      let target = new Date();
      
      // Handle both 12-hour and 24-hour formats
      if (time.includes('AM') || time.includes('PM')) {
        // 12-hour format (e.g., "2:30 PM")
        const timeStr = time.replace(/\s*(AM|PM)/i, '');
        const [h, m] = timeStr.split(':').map(Number);
        const isPM = time.toUpperCase().includes('PM');
        let hour24 = h;
        
        if (isPM && h !== 12) {
          hour24 = h + 12;
        } else if (!isPM && h === 12) {
          hour24 = 0;
        }
        
        target.setHours(hour24, m, 0, 0);
      } else {
        // 24-hour format (e.g., "14:30")
        const [h, m] = time.split(':').map(Number);
        if (isNaN(h) || isNaN(m)) {
          console.error('Invalid time format:', time);
          return '';
        }
        target.setHours(h, m, 0, 0);
      }
      
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }
      
      const diffMs = target.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid time calculation:', { hours, minutes, diffMs });
        return '';
      }
      
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    } catch (error) {
      console.error('Error in getTimeUntil:', error, 'for time:', time);
      return '';
    }
  };

  const getPrayerNameArabic = (prayerName: string) => {
    const arabicNames: { [key: string]: string } = {
      'Fajr': 'الفجر',
      'Dhuhr': 'الظهر',
      'Asr': 'العصر',
      'Maghrib': 'المغرب',
      'Isha': 'العشاء'
    };
    return arabicNames[prayerName] || prayerName;
  };

  const getPrayerIcon = (prayerName: string) => {
    const icons: { [key: string]: string } = {
      'Fajr': 'sunny',
      'Dhuhr': 'sunny',
      'Asr': 'partly-sunny',
      'Maghrib': 'sunny',
      'Isha': 'moon'
    };
    return icons[prayerName] || 'time';
  };

  const getPrayerColor = (prayerName: string) => {
    const colors: { [key: string]: string } = {
      'Fajr': '#FF6B35',
      'Dhuhr': '#FFD23F',
      'Asr': '#FF8C42',
      'Maghrib': '#FF6B9D',
      'Isha': '#4A90E2'
    };
    return colors[prayerName] || '#607D8B';
  };

  const quickActions = [
    { 
      title: t('home.lessons'), 
      titleArabic: 'الدروس',
      icon: 'school', 
      color: '#4CAF50', 
      screen: 'Lessons',
      description: 'Islamic lessons'
    },
    { 
      title: t('ai_noor.title'), 
      titleArabic: 'الذكاء الاصطناعي',
      icon: 'bulb', 
      color: '#00BCD4', 
      screen: 'AI Noor',
      description: 'AI Islamic assistant'
    },
    { 
      title: 'Azan', 
      titleArabic: 'الأذان',
      icon: 'volume-high', 
      color: '#FF9800', 
      screen: 'Azan',
      description: 'Prayer call audio'
    },
    { 
      title: 'Scholars', 
      titleArabic: 'العلماء',
      icon: 'people', 
      color: '#607D8B', 
      screen: 'Scholars',
      description: 'Islamic scholars'
    },
    { 
      title: 'Tariqa Tijaniyyah', 
      titleArabic: 'الطريقة التجانية',
      icon: 'star', 
      color: colors.accentTeal, 
      screen: 'TariqaTijaniyyah',
      description: 'The Tijānī Path'
    },
    { 
      title: 'Makkah Live', 
      titleArabic: 'مكة مباشر',
      icon: 'videocam', 
      color: colors.accentYellow, 
      screen: 'Makkah Live',
      description: 'Live from Kaaba'
    },
    { 
      title: 'Mosque Locator', 
      titleArabic: 'موقع المسجد',
      icon: 'location', 
      color: '#795548', 
      screen: 'Mosque',
      description: 'Find nearby mosques'
    },
    { 
      title: t('home.qibla_direction'), 
      titleArabic: 'القبلة',
      icon: 'compass', 
      color: '#FF5722', 
      screen: 'Qibla',
      description: 'Find prayer direction'
    },
    { 
      title: t('home.prayer_times'), 
      titleArabic: 'أوقات الصلاة',
      icon: 'time', 
      color: '#9C27B0', 
      screen: 'PrayerTimes',
      description: 'Daily prayer schedule'
    },
    { 
      title: 'Community', 
      titleArabic: 'المجتمع',
      icon: 'chatbubbles', 
      color: '#3F51B5', 
      screen: 'Community',
      description: 'Connect with Muslims'
    },
    { 
      title: 'Donate', 
      titleArabic: 'التبرع',
      icon: 'heart', 
      color: '#E91E63', 
      screen: 'Donate',
      description: 'Support Islamic causes'
    },
    { 
      title: 'Settings', 
      titleArabic: 'الإعدادات',
      icon: 'settings', 
      color: '#607D8B', 
      screen: 'NotificationSettings',
      description: 'App preferences'
    },
  ];

  const renderPrayerTimeCard = (prayer: PrayerTime, index: number) => {
    const prayerColor = getPrayerColor(prayer.name);
    const prayerIcon = getPrayerIcon(prayer.name);
    const arabicName = getPrayerNameArabic(prayer.name);
    
    return (
      <Animated.View
        key={prayer.name}
        style={[
          styles.prayerCard,
          prayer.isCurrent && styles.currentPrayerCard,
          { 
            opacity: fadeAnim, 
            transform: [
              { 
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30 * (index + 1), 0],
                })
              },
              {
                scale: prayer.isCurrent ? fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }) : 1
              }
            ] 
          }
        ]}
      >
        <LinearGradient
          colors={prayer.isCurrent ? [prayerColor, prayerColor + 'CC'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.prayerCardGradient}
        >
          <View style={styles.prayerCardContent}>
            {/* Prayer Icon */}
            <Animated.View 
              style={[
                styles.prayerIconContainer,
                { backgroundColor: prayer.isCurrent ? 'rgba(255,255,255,0.16)' : `${prayerColor}14` }
              ]}
            >
              <Ionicons 
                name={prayerIcon as any} 
                size={20} 
                color={prayer.isCurrent ? '#FFFFFF' : prayerColor} 
              />
            </Animated.View>

            {/* Prayer Info */}
            <View style={styles.prayerInfo}>
              <View style={styles.prayerNameContainer}>
                <Text style={[styles.prayerName, prayer.isCurrent && styles.currentPrayerName]}>
                  {prayer.name}
                </Text>
                <Text style={[styles.prayerNameArabic, prayer.isCurrent && styles.currentPrayerNameArabic]}>
                  {arabicName}
                </Text>
              </View>
              <View style={styles.prayerTimeContainer}>
                <Text style={[styles.prayerTime, prayer.isCurrent && styles.currentPrayerTime]}>
                  {prayer.time}
                </Text>
              </View>
            </View>

            {/* Current Prayer Indicator */}
            {prayer.isCurrent && (
              <Animated.View 
                style={[
                  styles.currentIndicator,
                  {
                    transform: [{
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.1],
                      })
                    }]
                  }
                ]}
              >
                <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                <Text style={styles.currentText}>Now</Text>
              </Animated.View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderQuickActionCard = ({ item, index }: { item: any, index: number }) => {
    const handlePress = () => {
      // Check if the screen is in the main tab navigator
      const mainTabScreens = ['Qibla', 'Tijaniyah Features'];
      
      if (mainTabScreens.includes(item.screen)) {
        // Navigate to main tab screen
        navigation.navigate(item.screen);
      } else {
        // Navigate to More stack screen
        navigation.navigate('More', { screen: item.screen });
      }
    };

    return (
      <Animated.View
        style={[
          styles.quickActionCard,
          { 
            opacity: fadeAnim,
            transform: [{ 
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30 * (index + 1), 0],
              })
            }]
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: item.color }]}
          onPress={handlePress}
        >
        <LinearGradient
          colors={[item.color, `${item.color}CC`]}
          style={styles.actionGradient}
        >
          <Ionicons name={item.icon as any} size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
        <Text style={styles.actionTitle}>{item.title}</Text>
        <Text style={styles.actionTitleArabic}>{item.titleArabic}</Text>
        <Text style={styles.actionDescription}>{item.description}</Text>
      </Animated.View>
    );
  };


  return (
    <IslamicBackground opacity={1.0}>
      <View style={styles.container}>

      <ScrollView 
        style={commonScreenStyles.scrollContainer} 
        contentContainerStyle={commonScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        data-scroll="true"
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >
        {/* Header with Islamic Design */}
        <LinearGradient
          colors={[colors.surface, colors.background]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            {/* Centered Logo */}
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/appicon.png')} style={styles.headerLogo} />
            </View>
            
              
              {/* Actions - Donate, Profile, Language, then Settings */}
              <View style={styles.headerActionsInline}>
                <View style={styles.headerButtonContainer}>
                <TouchableOpacity 
                  style={[styles.iconPillButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
                  onPress={() => navigation.navigate('More', { screen: 'Donate' })}
                >
                    <Ionicons name="heart" size={24} color={colors.accentYellow} />
                </TouchableOpacity>
                  <Text style={styles.headerButtonLabel}>Donate</Text>
                </View>

                <View style={styles.headerButtonContainer}>
                <TouchableOpacity 
                  style={styles.iconPillButton} 
                  onPress={() => navigation.navigate('More', { screen: 'Profile' })}
                >
                  <ProfileAvatar 
                    profilePicture={authState.user?.profilePicture}
                    name={authState.user?.name}
                      size={24}
                    showBorder={false}
                  />
                </TouchableOpacity>
                  <Text style={styles.headerButtonLabel}>Profile</Text>
                </View>

                <View style={styles.headerButtonContainer}>
                  <LanguageSelector compact />
                  <Text style={styles.headerButtonLabel}>Language</Text>
                </View>

                <View style={styles.headerButtonContainer}>
                <TouchableOpacity style={styles.iconPillButton} onPress={() => navigation.navigate('More', { screen: 'NotificationSettings' })}>
                    <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                  <Text style={styles.headerButtonLabel}>Settings</Text>
                </View>
              </View>
            </View>
            
            {/* Inline Greetings and Location */}
            <View style={styles.greetingLocationContainer}>
              {/* Greetings on the left */}
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>Assalamu Alaikum</Text>
                <Text style={styles.greetingArabic}>السلام عليكم</Text>
              </View>
              
              {/* Location on the right */}
              <View style={styles.locationContainer}>
                <View style={styles.locationContent}>
                  <Text style={styles.locationFlag}>
                    {getCountryFlag(currentLocation?.country)}
                  </Text>
                  <Text style={styles.locationText}>
                    {currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : 'Loading...'}
                  </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* {t('home.islamic_calendar')} Card */}
        <Animated.View
          style={[
            styles.calendarCard,
            { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }
          ]}
        >
          <TouchableOpacity
            onPress={showCalendarSelector}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.mintSurface, colors.mintSurfaceAlt]}
              style={styles.calendarGradient}
            >
            <View style={styles.calendarHeader}>
              <Ionicons name="calendar" size={24} color={colors.textDark} />
              <Text style={[styles.calendarTitle, { color: colors.textDark }]}>
                {t('home.islamic_calendar')} ({getCalendarInfo(selectedCalendar).name})
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textDark} style={styles.calendarChevron} />
            </View>
            <View style={styles.calendarContent}>
              <Text style={[styles.hijriDate, { color: colors.textDark }]}>
                {islamicDate.day} {islamicDate.monthNameArabic} {islamicDate.year} AH
              </Text>
              <Text style={[styles.gregorianDate, { color: colors.textDark }]}>
              {new Date().toLocaleDateString()} — {formatTimeWithSeconds(currentTime)}
              </Text>
              <Text style={[styles.dayName, { color: colors.textDark }]}>
                {islamicDate.dayNameArabic} - {islamicDate.dayName}
              </Text>
              {islamicDate.isHoliday && (
                <Text style={[styles.holidayText, { color: colors.accentTeal }]}>
                  {islamicDate.holidayName}
                </Text>
              )}
              <Text style={[styles.tapToChangeText, { color: colors.textDark }]}>
                Tap to change calendar
              </Text>
            </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* {t('prayer.next_prayer')} Card - Redesigned */}
        {nextPrayer && (
          <Animated.View
            style={[
              styles.nextPrayerContainer,
              { 
                opacity: fadeAnim, 
                transform: [
                  { scale: fadeAnim },
                  { translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    })
                  }
                ] 
              }
            ]}
          >
            <LinearGradient
              colors={[colors.accentTeal, colors.accentGreen, '#1BBFA7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextPrayerCard}
            >
              {/* Header with Islamic Pattern */}
              <View style={styles.prayerHeader}>
                <View style={styles.prayerHeaderLeft}>
                  <View style={styles.prayerIconContainer}>
                    <Ionicons name="moon" size={24} color={colors.accentYellow} />
                  </View>
                  <View>
                    <Text style={styles.nextPrayerLabel}>{t('prayer.next_prayer')}</Text>
                    <Text style={styles.nextPrayerLabelArabic}>الصلاة القادمة</Text>
                  </View>
                </View>
                <View style={styles.prayerStatusBadge}>
                  <Ionicons name="notifications" size={16} color={colors.textDark} />
                  <Text style={styles.prayerStatusText}>{t('home.upcoming')}</Text>
                </View>
              </View>

              {/* Main Prayer Info */}
              <View style={styles.prayerMainInfo}>
                <View style={styles.prayerNameSection}>
                  <Text style={styles.prayerNameLarge}>{nextPrayer.name}</Text>
                  <Text style={styles.prayerNameArabic}>{getPrayerNameArabic(nextPrayer.name)}</Text>
                </View>
                
                <View style={styles.prayerTimeSection}>
                  <View style={styles.timeDisplay}>
                    <Ionicons name="time-outline" size={28} color={colors.accentYellow} />
                    <Text style={styles.prayerTimeLarge}>
                      {nextPrayer.timeWithSeconds || nextPrayer.time}
                    </Text>
                  </View>
                  <View style={styles.countdownDisplay}>
                    <Ionicons name="hourglass-outline" size={20} color={colors.accentYellow} />
                    <Text style={styles.countdownText}>
                      {nextPrayer.countdown || '00:00:00'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Footer with Location and Method */}
              <View style={styles.prayerFooter}>
                {currentLocation && (
                  <View style={styles.locationInfo}>
                    <Ionicons name="location" size={16} color={colors.textPrimary} />
                    <Text style={styles.locationText}>{currentLocation.city}</Text>
                  </View>
                )}
                <View style={styles.methodInfo}>
                  <Ionicons name="calculator" size={16} color={colors.textPrimary} />
                  <Text style={styles.methodText}>MWL Method</Text>
                </View>
              </View>

              {/* Decorative Elements */}
              <View style={styles.decorativeElements}>
                <View style={[styles.decorativeDot, styles.dot1]} />
                <View style={[styles.decorativeDot, styles.dot2]} />
                <View style={[styles.decorativeDot, styles.dot3]} />
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Prayer Times */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.prayer_times')}</Text>
          <Text style={styles.sectionTitleArabic}>أوقات الصلاة</Text>
          
          {/* {t('prayer.next_prayer')} Display */}
          {nextPrayer && (
            <Animated.View style={[styles.nextPrayerCard, { opacity: fadeAnim }]}>
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                style={styles.nextPrayerGradient}
              >
                <View style={styles.nextPrayerContent}>
                  <View style={styles.nextPrayerIcon}>
                    <Ionicons name="time" size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.nextPrayerInfo}>
                    <Text style={styles.nextPrayerLabel}>{t('prayer.next_prayer')}</Text>
                    <Text style={styles.nextPrayerLabelArabic}>الصلاة القادمة</Text>
                    <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
                    <Text style={styles.nextPrayerNameArabic}>{getPrayerNameArabic(nextPrayer.name)}</Text>
                    <Text style={styles.nextPrayerTime}>{nextPrayer.timeWithSeconds || nextPrayer.time}</Text>
                  </View>
                  {/* Countdown removed per user request */}
                </View>
              </LinearGradient>
            </Animated.View>
          )}
          
          <View style={styles.prayerTimesContainer}>
            {prayerTimes.map((prayer, index) => renderPrayerTimeCard(prayer, index))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quick_actions')}</Text>
          <Text style={styles.sectionTitleArabic}>{t('home.quick_actions')}</Text>

          {/* Mini Azan Player */}
          <View style={styles.miniAzanCard}>
            <View style={styles.miniAzanHeader}>
              <Ionicons name="volume-high" size={18} color={colors.accentTeal} />
              <Text style={styles.miniAzanTitle}>Azan Player</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity style={styles.miniAzanPlay} onPress={handlePlayPauseAzan}>
                <Ionicons name={isAzanPlaying ? 'pause' : 'play'} size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.miniAzanList}>
              {azanOptions.map(opt => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.miniAzanItem, selectedAzanId === opt.id && styles.miniAzanItemActive]}
                  onPress={() => setSelectedAzanId(opt.id)}
                >
                  <Text style={[styles.miniAzanItemText, selectedAzanId === opt.id && styles.miniAzanItemTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <FlatList
            data={quickActions}
            renderItem={renderQuickActionCard}
            keyExtractor={(item) => item.title}
            numColumns={2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContainer}
            style={styles.quickActionsList}
          />
        </View>

        {/* {t('home.upcoming')} Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.upcoming_events')}</Text>
          <Text style={styles.sectionTitleArabic}>{t('home.upcoming_events')}</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            data-scroll="true"
            nestedScrollEnabled={true}
            scrollEventThrottle={16}
          >
            {upcomingEvents.slice(0, 3).map((event, index) => (
              <Animated.View
                key={event.id}
                style={[
                  styles.eventCard,
                  { 
                    opacity: fadeAnim,
                    transform: [{ 
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50 * (index + 1), 0],
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTitleArabic}>{event.titleArabic}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Hajj Section Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hajj</Text>
          <View style={styles.hajjQuickRow}>
            <TouchableOpacity style={styles.hajjQuickBtn} onPress={() => setOpenHajj(prev => prev==='live'?null:'live')}>
              <Ionicons name="videocam" size={22} color={colors.accentTeal} />
              <Text style={styles.hajjQuickText}>Watch Live</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hajjQuickBtn} onPress={() => setOpenHajj(prev => prev==='guide'?null:'guide')}>
              <Ionicons name="walk" size={22} color={colors.accentTeal} />
              <Text style={styles.hajjQuickText}>Hajj Guide</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hajjQuickBtn} onPress={() => setOpenHajj(prev => prev==='journey'?null:'journey')}>
              <Ionicons name="map" size={22} color={colors.accentTeal} />
              <Text style={styles.hajjQuickText}>Journey</Text>
            </TouchableOpacity>
          </View>
          {openHajj === 'live' && (
            <View style={styles.hajjDropdownCard}>
              <Text style={styles.hajjDropdownTitle}>Makkah Live</Text>
              <Text style={styles.hajjDropdownText}>24/7 HD stream of the Kaaba with prayer times and special events. Virtually connect to Masjid al‑Haram.</Text>
              <TouchableOpacity style={styles.hajjCta} onPress={() => navigation.navigate('More', { screen: 'Makkah Live' })}>
                <Ionicons name="open-outline" size={16} color={colors.accentTeal} />
                <Text style={styles.hajjCtaText}>Open</Text>
              </TouchableOpacity>
            </View>
          )}
          {openHajj === 'guide' && (
            <View style={styles.hajjDropdownCard}>
              <Text style={styles.hajjDropdownTitle}>Hajj & Umrah</Text>
              <Text style={styles.hajjDropdownText}>Step‑by‑step rites, essential duas, packing list, visa info, health & safety tips, and FAQs.</Text>
              <TouchableOpacity style={styles.hajjCta} onPress={() => navigation.navigate('More', { screen: 'HajjUmrah' })}>
                <Ionicons name="open-outline" size={16} color={colors.accentTeal} />
                <Text style={styles.hajjCtaText}>Open</Text>
              </TouchableOpacity>
            </View>
          )}
          {openHajj === 'journey' && (
            <View style={styles.hajjDropdownCard}>
              <Text style={styles.hajjDropdownTitle}>Hajj Journey</Text>
              <Text style={styles.hajjDropdownText}>Day‑by‑day timeline with reminders, mark‑done checklist, and quick map links to key locations.</Text>
              <TouchableOpacity style={styles.hajjCta} onPress={() => navigation.navigate('More', { screen: 'HajjJourney' })}>
                <Ionicons name="open-outline" size={16} color={colors.accentTeal} />
                <Text style={styles.hajjCtaText}>Open</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Daily Reminder */}
        {dailyReminder && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Reminder</Text>
            <Animated.View style={[styles.reminderCard, { opacity: fadeAnim }]}>
              <LinearGradient
                colors={['#8B4513', '#D2691E', '#CD853F']}
                style={styles.reminderGradient}
              >
                <View style={styles.reminderHeader}>
                  <Ionicons 
                    name={getCategoryIcon(dailyReminder.category) as any} 
                    size={24} 
                    color="#FFFFFF" 
                    style={styles.reminderIcon}
                  />
                  <View style={styles.reminderTitleContainer}>
                    <Text style={styles.reminderTitle}>
                      {language === 'ar' ? (dailyReminder.titleArabic || dailyReminder.title) : dailyReminder.title}
                    </Text>
                  </View>
                </View>
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderText}>
                    {language === 'ar' ? (dailyReminder.contentArabic || dailyReminder.content) : dailyReminder.content}
                  </Text>
                  {dailyReminder.source && (
                    <Text style={styles.reminderSource}>- {dailyReminder.source}</Text>
                  )}
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        )}

        {/* Islamic News & Blogs */}
        <View style={styles.newsSection}>
          <NewsSection 
            userLocation={currentLocation ? {
              country: currentLocation.country,
              city: currentLocation.city,
              region: currentLocation.region
            } : undefined}
          />
        </View>
      </ScrollView>

      {/* {t('home.islamic_calendar')} Selection Modal */}
      <Modal
        visible={showCalendarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {t('home.islamic_calendar')}</Text>
              <TouchableOpacity
                onPress={() => setShowCalendarModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {getAllCalendars().map((calendar) => (
                <TouchableOpacity
                  key={calendar.type}
                  style={[
                    styles.calendarOption,
                    selectedCalendar === calendar.type && styles.selectedCalendarOption
                  ]}
                  onPress={() => {
                    setSelectedCalendar(calendar.type);
                    setShowCalendarModal(false);
                  }}
                >
                  <View style={styles.calendarOptionContent}>
                    <Text style={[
                      styles.calendarOptionName,
                      selectedCalendar === calendar.type && styles.selectedCalendarOptionName
                    ]}>
                      {calendar.name}
                    </Text>
                    <Text style={[
                      styles.calendarOptionRegion,
                      selectedCalendar === calendar.type && styles.selectedCalendarOptionRegion
                    ]}>
                      {calendar.region}
                    </Text>
                    <Text style={[
                      styles.calendarOptionDescription,
                      selectedCalendar === calendar.type && styles.selectedCalendarOptionDescription
                    ]}>
                      {calendar.description}
                    </Text>
                  </View>
                  {selectedCalendar === calendar.type && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.accentTeal} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      </View>
    </IslamicBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 70, // Add padding for floating tab bar
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  patternCircle1: {
    position: 'absolute',
    top: 100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(205, 232, 220, 0.12)',
  },
  patternCircle2: {
    position: 'absolute',
    top: 300,
    left: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(17, 196, 141, 0.10)',
  },
  patternCircle3: {
    position: 'absolute',
    bottom: 200,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 191, 165, 0.08)',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  // Calendar selection modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.06)'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalCloseButton: {
    padding: 6,
  },
  modalScrollView: {
    paddingHorizontal: 12,
  },
  calendarOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.06)'
  },
  selectedCalendarOption: {
    borderWidth: 1,
    borderColor: colors.accentTeal,
    backgroundColor: 'rgba(0,191,165,0.08)'
  },
  calendarOptionContent: {
    flex: 1,
    paddingRight: 8,
  },
  calendarOptionName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700'
  },
  selectedCalendarOptionName: {
    color: colors.accentTeal,
  },
  calendarOptionRegion: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  selectedCalendarOptionRegion: {
    color: colors.textPrimary,
  },
  calendarOptionDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  selectedCalendarOptionDescription: {
    color: colors.textPrimary,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  headerLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  headerActionsInline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    flexShrink: 0,
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 0,
  },
  headerButtonContainer: {
    alignItems: 'center',
    flex: 1,
  },
  iconPillButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  headerButtonLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  greetingLocationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 54,
    marginBottom: 8,
  },
  locationContainer: {
    alignItems: 'flex-end',
  },
  greetingContainer: {
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'left',
    opacity: 0.8,
  },
  greetingArabic: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
    textAlign: 'left',
    opacity: 0.7,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationFlag: {
    fontSize: 11,
    marginRight: 4,
  },
  locationText: {
    fontSize: 6,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#0B3F39', // Solid color without transparency
    borderRadius: 12,
    marginTop: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  suggestionText: {
    color: colors.textPrimary,
    fontSize: 14,
    marginLeft: 8,
  },
  settingsButton: {
    padding: 8,
  },
  calendarCard: {
    margin: 20,
    marginTop: -10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  calendarGradient: {
    borderRadius: 16,
    padding: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarChevron: {
    marginLeft: 'auto',
    opacity: 0.6,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  calendarContent: {
    alignItems: 'center',
  },
  hijriDate: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  gregorianDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  dayName: {
    fontSize: 16,
    textAlign: 'center',
  },
  holidayText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  tapToChangeText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  // Redesigned {t('prayer.next_prayer')} Card Styles
  nextPrayerContainer: {
    margin: 20,
    marginTop: 10,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    borderRadius: 20,
  },
  nextPrayerCard: {
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  prayerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nextPrayerLabel: {
    fontSize: 16,
    color: colors.accentYellow,
    fontWeight: '700',
    marginBottom: 2,
  },
  nextPrayerLabelArabic: {
    fontSize: 12,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  prayerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  prayerStatusText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: 4,
  },
  prayerMainInfo: {
    marginBottom: 20,
  },
  prayerNameSection: {
    marginBottom: 16,
  },
  prayerNameLarge: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  prayerNameArabic: {
    fontSize: 18,
    color: colors.textPrimary,
    opacity: 0.9,
    fontWeight: '600',
  },
  prayerTimeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerTimeLarge: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  countdownDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  countdownText: {
    fontSize: 16,
    color: colors.accentYellow,
    fontWeight: '700',
    marginLeft: 6,
  },
  prayerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 6,
    fontWeight: '500',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 6,
    fontWeight: '500',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
  },
  decorativeDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dot1: {
    top: 20,
    right: 20,
  },
  dot2: {
    top: 40,
    right: 40,
  },
  dot3: {
    top: 60,
    right: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintSurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  locationBadgeText: {
    marginLeft: 4,
    color: colors.textDark,
    fontSize: 12,
    fontWeight: '600',
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintSurfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  methodBadgeText: {
    marginLeft: 4,
    color: colors.textDark,
    fontSize: 12,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  countdownLabel: {
    color: '#E0F7FA',
    fontSize: 12,
    marginRight: 6,
  },
  countdownValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  ringOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  ringTop: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  ringSub: {
    color: '#E0F7FA',
    fontSize: 11,
    marginBottom: 2,
  },
  ringText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
  },
  prayerIcon: {
    opacity: 0.8,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionTitleArabic: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  hajjQuickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  hajjQuickBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: colors.accentTeal + '66', backgroundColor: colors.surface },
  hajjQuickText: { color: colors.textPrimary, fontWeight: '700', fontSize: 12 },
  hajjDropdownCard: { marginTop: 8, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.divider, padding: 12 },
  hajjDropdownTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: 14, marginBottom: 4 },
  hajjDropdownText: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  hajjCta: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.accentTeal + '66', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 10, marginTop: 8 },
  hajjCtaText: { color: colors.accentTeal, fontWeight: '700' },
  prayerTimesContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  prayerCard: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    // Softer elevation on Android to avoid heavy banding/shades
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  currentPrayerCard: {
    // Keep current card a bit elevated but still subtle on Android
    elevation: 2,
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  prayerCardGradient: {
    padding: 12,
    // Ensure no underlying background that mixes with gradient (prevents extra shades)
    backgroundColor: 'transparent',
  },
  prayerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerNameContainer: {
    marginBottom: 2,
  },
  prayerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 1,
  },
  prayerNameArabic: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  currentPrayerName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  currentPrayerNameArabic: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  currentPrayerTime: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  prayerTimeContainer: {
    alignItems: 'flex-end',
  },
  prayerCountdown: {
    fontSize: 12,
    color: colors.accentTeal,
    fontWeight: '600',
    marginTop: 2,
  },
  currentIndicator: {
    alignItems: 'center',
    marginLeft: 8,
  },
  currentText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  nextPrayerCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  nextPrayerGradient: {
    padding: 16,
  },
  nextPrayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextPrayerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  nextPrayerInfo: {
    flex: 1,
  },
  nextPrayerLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '500',
  },
  nextPrayerLabelArabic: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'right',
  },
  nextPrayerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  nextPrayerNameArabic: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'right',
  },
  nextPrayerTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 4,
  },
  nextPrayerCountdown: {
    alignItems: 'center',
    marginLeft: 12,
  },
  countdownLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '500',
  },
  countdownTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  quickActionsContainer: {
    paddingBottom: 10,
  },
  quickActionsList: {
    // No maxHeight to allow all items to be visible without scrolling
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: colors.mintSurface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 2,
  },
  actionTitleArabic: {
    fontSize: 12,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 10,
    color: colors.textDark,
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: colors.mintSurface,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 150,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  eventTitleArabic: {
    fontSize: 12,
    color: colors.textDark,
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 12,
    color: colors.textDark,
  },
  reminderCard: {
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    flex: 1,
    marginLeft: 12,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B3F39',
    marginBottom: 2,
  },
  reminderTitleArabic: {
    fontSize: 14,
    color: '#0B3F39',
    marginBottom: 8,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#0B3F39',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  reminderDescriptionArabic: {
    fontSize: 12,
    color: '#0B3F39',
    fontStyle: 'italic',
  },
  reminderCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  reminderGradient: {
    padding: 20,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reminderIcon: {
    marginRight: 12,
  },
  reminderTitleContainer: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  reminderTitleArabic: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  reminderContent: {
    marginTop: 8,
  },
  reminderText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'left',
  },
  reminderTextArabic: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: 'System',
  },
  reminderSource: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  newsSection: {
    marginTop: 20,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 500,
  },
  // Mini Azan styles
  miniAzanCard: {
    backgroundColor: colors.mintSurface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  miniAzanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  miniAzanTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },
  miniAzanPlay: {
    backgroundColor: colors.accentTeal,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAzanList: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  miniAzanItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  miniAzanItemActive: {
    backgroundColor: 'rgba(0,191,165,0.15)',
    borderWidth: 1,
    borderColor: colors.accentTeal,
  },
  miniAzanItemText: {
    fontSize: 12,
    color: colors.textDark,
    fontWeight: '600',
  },
  miniAzanItemTextActive: {
    color: colors.accentTeal,
  },
});
