import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking, ActivityIndicator, ScrollView } from 'react-native';
import { colors } from '../utils/theme';
import { commonScreenStyles } from '../utils/screenStyles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { useLanguage } from '../contexts/LanguageContext';

type Channel = {
  id: string;
  title: string;
  subtitle: string;
  youtubeId: string; // video id for watch/embed
};

type TVChannel = {
  id: string;
  title: string;
  subtitle: string;
  websiteUrl: string;
  logo: string; // emoji or icon
  category: 'islamic' | 'quran' | 'news' | 'educational';
};

const CHANNELS: Channel[] = [
  {
    id: 'makkah-live-24-7',
    title: '🕋 Makkah Live Online 24/7',
    subtitle: 'Live streaming from the Holy Kaaba',
    youtubeId: 'zIl0NYIsBCE',
  },
  {
    id: 'makkah-hd-live',
    title: '🕋 Makkah HD Live',
    subtitle: 'High definition live stream from Makkah',
    youtubeId: 'ZlU0ELqIfeY',
  },
  {
    id: 'quran-kareem-tv',
    title: '📺 Al Quran Al Kareem TV Channel Live',
    subtitle: 'Official Quran TV channel live stream',
    youtubeId: '-PR51PBK_yY',
  },
  {
    id: 'madina-live-24-7',
    title: '🕌 Madina Live – Al Masjid an-Nabawi 24/7 Streaming',
    subtitle: 'Live streaming from the Prophet\'s Mosque',
    youtubeId: 'TpT8b8JFZ6E',
  },
  {
    id: 'medina-heart-live',
    title: '🕌 Medina Live: Connect to the Heart of the Sacred City',
    subtitle: 'Experience the spiritual beauty of Medina',
    youtubeId: 'TpT8b8JFZ6E',
  },
  {
    id: 'medina-spiritual-live',
    title: '🕌 Medinah Live: Experience the Spiritual Beauty',
    subtitle: 'Connect with the sacred atmosphere of Medina',
    youtubeId: 'uvV-g-j7NRk',
  },
];

const TV_CHANNELS: TVChannel[] = [
  // Quran Channels
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
    id: 'al-majd-quran',
    title: '📺 Al Majd Quran',
    subtitle: 'Quran recitation and Islamic content',
    websiteUrl: 'https://almajd.tv',
    logo: '📺',
    category: 'quran'
  },
  {
    id: 'al-resalah-tv',
    title: '📺 Al Resalah TV',
    subtitle: 'Islamic educational and cultural content',
    websiteUrl: 'https://alresalah.tv',
    logo: '📺',
    category: 'islamic'
  },
  {
    id: 'al-huda-tv',
    title: '📺 Al Huda TV',
    subtitle: 'Islamic guidance and education',
    websiteUrl: 'https://alhuda.tv',
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
  {
    id: 'islam-channel',
    title: '📺 Islam Channel',
    subtitle: 'UK-based Islamic television',
    websiteUrl: 'https://islamchannel.tv',
    logo: '📺',
    category: 'islamic'
  },
  {
    id: 'huda-tv',
    title: '📺 Huda TV',
    subtitle: 'Islamic satellite television',
    websiteUrl: 'https://hudatv.net',
    logo: '📺',
    category: 'islamic'
  },
  {
    id: 'al-noor-tv',
    title: '📺 Al Noor TV',
    subtitle: 'Islamic educational programming',
    websiteUrl: 'https://alnoortv.com',
    logo: '📺',
    category: 'islamic'
  },
  {
    id: 'al-kawthar-tv',
    title: '📺 Al Kawthar TV',
    subtitle: 'Islamic cultural and educational content',
    websiteUrl: 'https://alkawthartv.com',
    logo: '📺',
    category: 'islamic'
  },
  {
    id: 'al-eman-tv',
    title: '📺 Al Eman TV',
    subtitle: 'Islamic faith and guidance',
    websiteUrl: 'https://aleman.tv',
    logo: '📺',
    category: 'islamic'
  },
  {
    id: 'al-fajr-tv',
    title: '📺 Al Fajr TV',
    subtitle: 'Islamic news and current affairs',
    websiteUrl: 'https://alfajrtv.com',
    logo: '📺',
    category: 'news'
  }
];

export default function MakkahLiveScreen() {
  const { t } = useLanguage();
  const [active, setActive] = useState<Channel>(CHANNELS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStreamHelp, setShowStreamHelp] = useState(false);
  const [quality, setQuality] = useState<'sd'|'hd'>('hd');

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
    // Simulate HD/SD by switching between HD channel and 24/7 channel
    if (quality === 'hd') return active.youtubeId;
    // fallback to first (24/7) if not already that
    const sd = CHANNELS.find(c => c.id === 'makkah-live-24-7') || active;
    return sd.youtubeId;
  }, [quality, active]);

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
            // Use privacy-enhanced mode to reduce prompts and tracking
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
            // If YouTube player throws config error (e.g., error 153), suggest opening in YouTube or switching streams
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
              // Allow the main embed host and static resources, block sign-in/consent pages
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
            // Handle YouTube player messages
            console.log('YouTube message:', event.nativeEvent.data);
          }}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={CHANNELS}
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
          data={TV_CHANNELS}
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
