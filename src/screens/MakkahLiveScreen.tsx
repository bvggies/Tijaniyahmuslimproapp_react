import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking, ActivityIndicator, ScrollView, RefreshControl, Alert, Image, Animated } from 'react-native';
import { colors } from '../utils/theme';
import { commonScreenStyles } from '../utils/screenStyles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { useFadeIn } from '../hooks/useAnimations';

// API Response type
interface MakkahLiveChannel {
  id: string;
  title: string;
  titleArabic?: string;
  subtitle?: string;
  type: 'YOUTUBE_LIVE' | 'TV_CHANNEL';
  category: 'MAKKAH' | 'MADINAH' | 'QURAN' | 'ISLAMIC' | 'NEWS' | 'EDUCATIONAL';
  youtubeId?: string;
  websiteUrl?: string;
  logo?: string;
  thumbnailUrl?: string;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
}

// Local types for backwards compatibility
type Channel = {
  id: string;
  title: string;
  subtitle: string;
  youtubeId: string;
};

type TVChannel = {
  id: string;
  title: string;
  subtitle: string;
  websiteUrl: string;
  logo: string;
  category: 'islamic' | 'quran' | 'news' | 'educational';
};

// Fallback hardcoded channels in case API fails
const FALLBACK_CHANNELS: Channel[] = [
  {
    id: 'makkah-live-stream-1',
    title: '🕋 Makkah Live Stream 1',
    subtitle: 'Live streaming from the Holy Kaaba',
    youtubeId: '6F84NXOUCdw',
  },
  {
    id: 'makkah-live-stream-2',
    title: '🕋 Makkah Live Stream 2',
    subtitle: 'Live streaming from the Holy Kaaba',
    youtubeId: 'U6bEFxYWJlo',
  },
];

const FALLBACK_TV_CHANNELS: TVChannel[] = [
  {
    id: 'quran-tv-saudi',
    title: '📺 Quran TV Saudi Arabia',
    subtitle: 'Official Saudi Quran TV Channel',
    websiteUrl: 'https://qurantv.sa',
    logo: '📺',
    category: 'quran'
  },
  {
    id: 'iqra-tv',
    title: '📺 Iqra TV',
    subtitle: 'International Islamic TV Network',
    websiteUrl: 'https://iqra.tv',
    logo: '📺',
    category: 'islamic'
  },
  {
    id: 'peace-tv',
    title: '📺 Peace TV',
    subtitle: 'Global Islamic television network',
    websiteUrl: 'https://peacetv.tv',
    logo: '📺',
    category: 'islamic'
  },
];

export default function MakkahLiveScreen() {
  const { t } = useLanguage();
  const opacity = useFadeIn({ duration: 380 });
  const [channels, setChannels] = useState<Channel[]>(FALLBACK_CHANNELS);
  const [tvChannels, setTVChannels] = useState<TVChannel[]>(FALLBACK_TV_CHANNELS);
  const [active, setActive] = useState<Channel>(FALLBACK_CHANNELS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStreamHelp, setShowStreamHelp] = useState(false);
  const [quality, setQuality] = useState<'sd'|'hd'>('hd');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch channels from API
  const fetchChannels = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    
    try {
      const response = await api.getMakkahLiveChannels({ activeOnly: true });
      
      console.log('📺 Makkah Live API Response:', response);
      
      // Handle both array and object with data property
      let channelsData: MakkahLiveChannel[] = [];
      if (Array.isArray(response)) {
        channelsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        channelsData = response.data;
      } else if (response?.channels && Array.isArray(response.channels)) {
        channelsData = response.channels;
      }
      
      if (channelsData.length > 0) {
        console.log(`📺 Found ${channelsData.length} active channels from API`);
        
        // Separate YouTube and TV channels
        const youtubeChannels: Channel[] = channelsData
          .filter((ch: MakkahLiveChannel) => {
            const isValid = ch.type === 'YOUTUBE_LIVE' && ch.isActive && ch.youtubeId && ch.youtubeId.trim() !== '';
            if (!isValid && ch.type === 'YOUTUBE_LIVE') {
              console.warn(`⚠️ Skipping YouTube channel "${ch.title}": missing youtubeId or inactive`);
            }
            return isValid;
          })
          .map((ch: MakkahLiveChannel) => ({
            id: ch.id,
            title: ch.logo ? `${ch.logo} ${ch.title}` : ch.title,
            subtitle: ch.subtitle || '',
            youtubeId: ch.youtubeId!,
          }));

        const tvChs: TVChannel[] = channelsData
          .filter((ch: MakkahLiveChannel) => {
            const isValid = ch.type === 'TV_CHANNEL' && ch.isActive && ch.websiteUrl && ch.websiteUrl.trim() !== '';
            if (!isValid && ch.type === 'TV_CHANNEL') {
              console.warn(`⚠️ Skipping TV channel "${ch.title}": missing websiteUrl or inactive`);
            }
            return isValid;
          })
          .map((ch: MakkahLiveChannel) => ({
            id: ch.id,
            title: ch.logo ? `${ch.logo} ${ch.title}` : `📺 ${ch.title}`,
            subtitle: ch.subtitle || '',
            websiteUrl: ch.websiteUrl!,
            logo: ch.logo || '📺',
            category: ch.category.toLowerCase() as 'islamic' | 'quran' | 'news' | 'educational',
          }));

        console.log(`📺 Processed ${youtubeChannels.length} YouTube channels and ${tvChs.length} TV channels`);

        if (youtubeChannels.length > 0) {
          setChannels(youtubeChannels);
          setActive(youtubeChannels[0]);
        } else {
          console.warn('⚠️ No valid YouTube channels found, keeping fallback channels');
        }

        if (tvChs.length > 0) {
          setTVChannels(tvChs);
        } else {
          console.warn('⚠️ No valid TV channels found, keeping fallback channels');
        }

        setFetchError(null);
      } else {
        console.warn('⚠️ No channels returned from API, using fallback channels');
        setFetchError('No channels available');
      }
    } catch (error: any) {
      console.error('❌ Error fetching Makkah Live channels:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error keys:', Object.keys(error || {}));
      
      // Provide more specific error information
      let errorMessage = 'Using offline channels';
      const errorStr = error?.toString() || '';
      const errorMsg = error?.message || errorStr;
      
      console.error('❌ Error message:', errorMsg);
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      
      if (errorMsg) {
        if (errorMsg.includes('Network') || errorMsg.includes('fetch') || errorMsg.includes('Failed to fetch')) {
          errorMessage = 'Network error - check your connection';
        } else if (errorMsg.includes('404') || errorMsg.includes('Not Found')) {
          errorMessage = 'Channels endpoint not found (404)';
        } else if (errorMsg.includes('500') || errorMsg.includes('Internal Server')) {
          errorMessage = 'Server error - please try again';
        } else if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
          errorMessage = 'Authentication error';
        } else if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
          errorMessage = 'Access forbidden';
        } else {
          errorMessage = `Error: ${errorMsg.substring(0, 50)}`;
        }
      }
      
      // Log the full error for debugging
      if (error?.response) {
        console.error('API Response error:', error.response);
      }
      if (error?.status) {
        console.error('HTTP Status:', error.status);
      }
      if (error?.statusCode) {
        console.error('HTTP Status Code:', error.statusCode);
      }
      
      setFetchError(errorMessage);
      // Keep using fallback channels
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const openInYouTube = (channel: Channel) => {
    // Try YouTube app first, then fallback to web
    const youtubeAppUrl = `vnd.youtube:${channel.youtubeId}`;
    const youtubeWebUrl = `https://www.youtube.com/watch?v=${channel.youtubeId}`;
    
    Linking.canOpenURL(youtubeAppUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(youtubeAppUrl);
        } else {
          return Linking.openURL(youtubeWebUrl);
        }
      })
      .catch((err) => {
        console.error('Failed to open YouTube:', err);
        // Fallback to web URL
        Linking.openURL(youtubeWebUrl).catch(() => {
          Alert.alert('Error', 'Could not open YouTube. Please check your connection and try again.');
        });
      });
  };

  const handleChannelChange = (channel: Channel) => {
    setActive(channel);
    setIsLoading(true);
    setVideoError(null);
    setRetryCount(0);
  };

  const toggleStreamHelp = () => {
    setShowStreamHelp(!showStreamHelp);
  };

  const openTVChannel = (channel: TVChannel) => {
    Linking.openURL(channel.websiteUrl);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'quran': return colors.accentTeal + '20';
      case 'islamic': return colors.accentYellow + '20';
      case 'news': return colors.accentRed + '20';
      case 'educational': return colors.accentGreen + '20';
      default: return colors.textSecondary + '20';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'quran': return t('makkah_live.category_quran');
      case 'islamic': return t('makkah_live.category_islamic');
      case 'news': return t('makkah_live.category_news');
      case 'educational': return t('makkah_live.category_educational');
      default: return category;
    }
  };

  const currentSrc = useMemo(() => {
    if (quality === 'hd') return active.youtubeId;
    const sd = channels.find(c => c.id.includes('24-7')) || active;
    return sd.youtubeId;
  }, [quality, active, channels]);

  // Validate YouTube ID format (should be 11 characters, alphanumeric and hyphens/underscores)
  const isValidYouTubeId = (id: string) => {
    if (!id) return false;
    // YouTube video IDs are typically 11 characters
    // Allow alphanumeric, hyphens, and underscores
    return /^[a-zA-Z0-9_-]{11}$/.test(id);
  };

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <View style={styles.headerContent}>
        <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{t('makkah_live.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('makkah_live.subtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.qualityToggle} onPress={() => setQuality(prev => prev==='hd'?'sd':'hd')}>
            <Ionicons name={quality==='hd' ? 'videocam' : 'videocam-outline'} size={18} color={colors.accentTeal} />
            <Text style={styles.qualityLabel}>{quality.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpButton} onPress={toggleStreamHelp}>
            <Ionicons name="help-circle-outline" size={24} color={colors.accentTeal} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={commonScreenStyles.scrollContainer}
        contentContainerStyle={commonScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchChannels(true)}
            tintColor={colors.accentTeal}
            colors={[colors.accentTeal]}
          />
        }
      >
        {/* Stream Help Notification */}
        {showStreamHelp && (
          <View style={styles.helpBanner}>
            <View style={styles.helpContent}>
              <Ionicons name="information-circle" size={20} color={colors.accentYellow} />
              <View style={styles.helpText}>
                <Text style={styles.helpTitle}>{t('makkah_live.help_title')}</Text>
                <Text style={styles.helpDescription}>
                  {t('makkah_live.help_description')}
                </Text>
              </View>
              <TouchableOpacity onPress={toggleStreamHelp} style={styles.closeHelpButton}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Offline indicator */}
        {fetchError && (
          <TouchableOpacity 
            style={styles.offlineBanner}
            onPress={() => fetchChannels(true)}
          >
            <Ionicons name="cloud-offline" size={16} color={colors.textSecondary} />
            <Text style={styles.offlineText}>{fetchError}</Text>
            <Text style={[styles.offlineText, { fontSize: 12, marginTop: 4 }]}>
              Tap to retry
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.prayerStrip}>
          <Text style={styles.prayerItem}>{t('prayer.fajr')}</Text>
          <Text style={styles.prayerItem}>{t('prayer.dhuhr')}</Text>
          <Text style={styles.prayerItem}>{t('prayer.asr')}</Text>
          <Text style={styles.prayerItem}>{t('prayer.maghrib')}</Text>
          <Text style={styles.prayerItem}>{t('prayer.isha')}</Text>
        </View>

        <View style={styles.playerCard}>
        {isLoading && !videoError && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accentTeal} />
            <Text style={styles.loadingText}>{t('makkah_live.loading')}</Text>
          </View>
        )}
        
        {videoError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={colors.accentRed} />
            <Text style={styles.errorTitle}>Video Playback Error</Text>
            <Text style={styles.errorMessage}>
              {!isValidYouTubeId(currentSrc) 
                ? 'Invalid YouTube video ID. Please check the channel configuration in admin dashboard.'
                : videoError
              }
            </Text>
            <View style={styles.errorActions}>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setVideoError(null);
                  setRetryCount(prev => prev + 1);
                  setIsLoading(true);
                }}
              >
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.openYoutubeButton}
                onPress={() => openInYouTube(active)}
              >
                <Ionicons name="logo-youtube" size={20} color="#FFFFFF" />
                <Text style={styles.openYoutubeButtonText}>Open in YouTube</Text>
              </TouchableOpacity>
            </View>
            {channels.length > 1 && (
              <TouchableOpacity
                style={styles.switchChannelButton}
                onPress={() => {
                  const currentIndex = channels.findIndex(c => c.id === active.id);
                  const nextIndex = (currentIndex + 1) % channels.length;
                  handleChannelChange(channels[nextIndex]);
                  setVideoError(null);
                  setRetryCount(0);
                }}
              >
                <Ionicons name="swap-horizontal" size={16} color={colors.accentTeal} />
                <Text style={styles.switchChannelText}>Try Another Stream</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.youtubePlayerContainer}
            activeOpacity={0.9}
            onPress={() => openInYouTube(active)}
          >
            <View style={styles.youtubeThumbnailContainer}>
              <Image
                source={{ uri: `https://img.youtube.com/vi/${currentSrc}/maxresdefault.jpg` }}
                style={styles.youtubeThumbnail}
                onError={() => {
                  // If thumbnail fails, try lower quality
                  console.log('Thumbnail load failed');
                }}
              />
              <View style={styles.playButtonOverlay}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)']}
                  style={styles.playButtonGradient}
                >
                  <View style={styles.playButton}>
                    <Ionicons name="play" size={48} color="#FFFFFF" />
                  </View>
                  <Text style={styles.playButtonText}>Tap to Watch Live</Text>
                  <Text style={styles.playButtonSubtext}>Opens in YouTube</Text>
                </LinearGradient>
              </View>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
          </TouchableOpacity>
          )}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={channels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.channelCard, item.id === active.id && styles.channelCardActive]}
            onPress={() => handleChannelChange(item)}
          >
            <View style={styles.channelIcon}><Ionicons name="radio" size={16} color={item.id === active.id ? colors.textDark : colors.accentTeal} /></View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.channelTitle, item.id === active.id && styles.channelTitleActive]} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.channelSubtitle} numberOfLines={1}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* TV Channels Section */}
      <View style={styles.tvChannelsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('makkah_live.tv_channels')}</Text>
          <Text style={styles.sectionSubtitle}>{t('makkah_live.tv_channels_subtitle')}</Text>
        </View>

        <FlatList
          data={tvChannels}
          numColumns={2}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tvChannelsGrid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tvChannelCard}
              onPress={() => openTVChannel(item)}
            >
              <View style={styles.tvChannelHeader}>
                <Text style={styles.tvChannelLogo}>{item.logo}</Text>
                <Ionicons name="open-outline" size={16} color={colors.accentTeal} />
              </View>
              <View style={styles.tvChannelContent}>
                <Text style={styles.tvChannelTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.tvChannelSubtitle} numberOfLines={2}>{item.subtitle}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                  <Text style={styles.categoryText}>{getCategoryLabel(item.category)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16 },
  headerContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  headerText: { 
    flex: 1 
  },
  headerTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: colors.textSecondary, marginTop: 4 },
  helpButton: { 
    padding: 8, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
  },
  qualityToggle: { flexDirection: 'row', alignItems: 'center', gap: 6 as any, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: colors.accentTeal + '66', marginRight: 8 },
  qualityLabel: { color: colors.textPrimary, fontWeight: '700', fontSize: 12 },
  helpBanner: {
    backgroundColor: colors.accentYellow + '20',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.accentYellow,
  },
  helpContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
  },
  helpText: {
    flex: 1,
    marginLeft: 8,
  },
  helpTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  helpDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  closeHelpButton: {
    padding: 4,
    marginLeft: 8,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  offlineText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  playerCard: { height: 300, margin: 16, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.surface },
  youtubePlayerContainer: {
    flex: 1,
    height: 300,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  youtubeThumbnailContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  youtubeThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  playButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  prayerStrip: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 8 },
  prayerItem: { color: colors.textSecondary, fontSize: 12 },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  fallbackText: { color: colors.textSecondary, marginTop: 8, marginBottom: 12 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6 as any, backgroundColor: colors.mintSurface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  ctaText: { color: colors.textDark, fontWeight: '700', marginLeft: 6 },
  channelCard: { width: 240, backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginRight: 10, flexDirection: 'row', alignItems: 'center' },
  channelCardActive: { backgroundColor: colors.mintSurface },
  channelIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000020', marginRight: 10 },
  channelTitle: { color: colors.textPrimary, fontWeight: '700' },
  channelTitleActive: { color: colors.textDark },
  channelSubtitle: { color: colors.textSecondary, fontSize: 12 },
  loadingContainer: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: colors.surface, 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 1 
  },
  loadingText: { 
    color: colors.textPrimary, 
    marginTop: 12, 
    fontSize: 16, 
    fontWeight: '600' 
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.surface,
  },
  errorTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentTeal,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  openYoutubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  openYoutubeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  switchChannelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  switchChannelText: {
    color: colors.accentTeal,
    fontSize: 12,
    fontWeight: '600',
  },
  // TV Channels Section Styles
  tvChannelsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  tvChannelsGrid: {
    paddingBottom: 16,
  },
  tvChannelCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    margin: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tvChannelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tvChannelLogo: {
    fontSize: 24,
  },
  tvChannelContent: {
    flex: 1,
  },
  tvChannelTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  tvChannelSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '600',
  },
});
