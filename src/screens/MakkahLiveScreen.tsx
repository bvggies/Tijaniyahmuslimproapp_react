import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking, ActivityIndicator } from 'react-native';
import { colors } from '../utils/theme';
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

export default function MakkahLiveScreen() {
  const { t } = useLanguage();
  const [active, setActive] = useState<Channel>(CHANNELS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStreamHelp, setShowStreamHelp] = useState(false);

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

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{t('makkah_live.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('makkah_live.subtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.helpButton} onPress={toggleStreamHelp}>
            <Ionicons name="help-circle-outline" size={24} color={colors.accentTeal} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

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
            uri: `https://www.youtube.com/embed/${active.youtubeId}?autoplay=0&rel=0&modestbranding=1&playsinline=1&controls=1&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&enablejsapi=1&origin=https://www.youtube.com`
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
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            setIsLoading(false);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView HTTP error: ', nativeEvent);
            setIsLoading(false);
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

      <View style={{ height: 16 }} />
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
  helpBanner: {
    backgroundColor: colors.accentYellow + '20',
    marginHorizontal: 16,
    marginTop: 8,
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
  playerCard: { flex: 1, margin: 16, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.surface },
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
});
