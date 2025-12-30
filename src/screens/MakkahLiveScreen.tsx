import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { colors } from '../utils/theme';
import { commonScreenStyles } from '../utils/screenStyles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

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
  const [channels, setChannels] = useState<Channel[]>(FALLBACK_CHANNELS);
  const [tvChannels, setTVChannels] = useState<TVChannel[]>(FALLBACK_TV_CHANNELS);
  const [active, setActive] = useState<Channel>(FALLBACK_CHANNELS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStreamHelp, setShowStreamHelp] = useState(false);
  const [quality, setQuality] = useState<'sd'|'hd'>('hd');
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch channels from API
  const fetchChannels = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    
    try {
      const response = await api.getMakkahLiveChannels({ activeOnly: true });
      
      if (response && Array.isArray(response)) {
        // Separate YouTube and TV channels
        const youtubeChannels: Channel[] = response
          .filter((ch: MakkahLiveChannel) => ch.type === 'YOUTUBE_LIVE' && ch.youtubeId)
          .map((ch: MakkahLiveChannel) => ({
            id: ch.id,
            title: ch.logo ? `${ch.logo} ${ch.title}` : ch.title,
            subtitle: ch.subtitle || '',
            youtubeId: ch.youtubeId!,
          }));

        const tvChs: TVChannel[] = response
          .filter((ch: MakkahLiveChannel) => ch.type === 'TV_CHANNEL' && ch.websiteUrl)
          .map((ch: MakkahLiveChannel) => ({
            id: ch.id,
            title: ch.logo ? `${ch.logo} ${ch.title}` : `📺 ${ch.title}`,
            subtitle: ch.subtitle || '',
            websiteUrl: ch.websiteUrl!,
            logo: ch.logo || '📺',
            category: ch.category.toLowerCase() as 'islamic' | 'quran' | 'news' | 'educational',
          }));

        if (youtubeChannels.length > 0) {
          setChannels(youtubeChannels);
          setActive(youtubeChannels[0]);
        }

        if (tvChs.length > 0) {
          setTVChannels(tvChs);
        }

        setFetchError(null);
      }
    } catch (error) {
      console.log('📺 Using fallback channels (API unavailable):', error);
      setFetchError('Using offline channels');
      // Keep using fallback channels
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const openInYouTube = (channel: Channel) => {
    const url = `https://www.youtube.com/watch?v=${channel.youtubeId}`;
    Linking.openURL(url);
  };

  const handleChannelChange = (channel: Channel) => {
    setActive(channel);
    setIsLoading(true);
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

  return (
    <View style={styles.container}>
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
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline" size={16} color={colors.textSecondary} />
            <Text style={styles.offlineText}>{fetchError}</Text>
          </View>
        )}

        <View style={styles.prayerStrip}>
          <Text style={styles.prayerItem}>{t('prayer.fajr')}</Text>
          <Text style={styles.prayerItem}>{t('prayer.dhuhr')}</Text>
          <Text style={styles.prayerItem}>{t('prayer.asr')}</Text>
          <Text style={styles.prayerItem}>{t('prayer.maghrib')}</Text>
          <Text style={styles.prayerItem}>{t('prayer.isha')}</Text>
        </View>

        <View style={styles.playerCard}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accentTeal} />
            <Text style={styles.loadingText}>{t('makkah_live.loading')}</Text>
          </View>
        )}
        <WebView
          style={{ flex: 1, borderRadius: 14, overflow: 'hidden' }}
          source={{ 
            uri: `https://www.youtube-nocookie.com/embed/${currentSrc}?autoplay=0&rel=0&modestbranding=1&playsinline=1&controls=1&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&enablejsapi=1`
          }}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          mixedContentMode="compatibility"
          thirdPartyCookiesEnabled={false}
          setSupportMultipleWindows={false}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            setIsLoading(false);
            setShowStreamHelp(true);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView HTTP error: ', nativeEvent);
            setIsLoading(false);
            setShowStreamHelp(true);
          }}
          onShouldStartLoadWithRequest={(request) => {
            const disallowedHosts = [
              'accounts.google.com',
              'consent.youtube.com',
              'm.youtube.com',
              'www.youtube.com',
              'youtube.com',
              'myaccount.google.com',
            ];
            try {
              const url = new URL(request.url);
              const host = url.hostname.toLowerCase();
              if (host.endsWith('youtube-nocookie.com') || host.endsWith('ytimg.com')) {
                return true;
              }
              if (disallowedHosts.some(h => host.endsWith(h))) {
                return false;
              }
            } catch {}
            return true;
          }}
          onMessage={(event) => {
            console.log('YouTube message:', event.nativeEvent.data);
          }}
        />
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
    </View>
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
  playerCard: { height: 250, margin: 16, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.surface },
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
