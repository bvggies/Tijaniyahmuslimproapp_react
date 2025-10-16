import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';

export default function HajjScreen({ navigation }: any) {
  const { t } = useLanguage();
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const navigateTo = (screen: string) => navigation.navigate(screen);

  const Card = ({ icon, title, desc, screen }: { icon: any; title: string; desc: string; screen: string }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigateTo(screen)}>
      <View style={styles.cardIconWrap}><Ionicons name={icon} size={24} color={colors.accentTeal} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>{t('hajj.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('hajj.subtitle')}</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.qaBtn} onPress={() => navigateTo('Makkah Live')}>
            <Ionicons name="videocam" size={26} color={colors.accentTeal} />
            <Text style={styles.qaText}>{t('hajj.qa_makkah_live')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qaBtn} onPress={() => navigateTo('HajjUmrah')}>
            <Ionicons name="walk" size={26} color={colors.accentTeal} />
            <Text style={styles.qaText}>{t('hajj.qa_hajj_umrah')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qaBtn} onPress={() => navigateTo('HajjJourney')}>
            <Ionicons name="map" size={26} color={colors.accentTeal} />
            <Text style={styles.qaText}>{t('hajj.qa_journey')}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Accordion
          icon="videocam"
          title={t('hajj.makkah_live')}
          cta={t('common.open')}
          onPressCta={() => navigateTo('Makkah Live')}
        >
          <Text style={styles.blockTitle}>Key Features</Text>
          <Bullet>Live Video Feed: 24/7 HD stream of the Kaaba and Masjid al‑Haram with Tawaf visible in real time.</Bullet>
          <Bullet>Virtual Connection: Feel spiritually connected when travel isn’t possible.</Bullet>
          <Bullet>Prayer Times: Tune in during salāh for a more immersive experience.</Bullet>
          <Bullet>Special Occasions: Ramadan, Hajj and nightly worship highlights.</Bullet>
          <Bullet>HD Quality: Clear, beautiful view of the sanctuary.</Bullet>
          <Text style={styles.blockTitle}>Why It’s Useful</Text>
          <Bullet>Spiritual Connection from anywhere.</Bullet>
          <Bullet>Inspiration for pilgrims preparing for Hajj/Umrah.</Bullet>
        </Accordion>

        <Accordion
          icon="walk"
          title={t('hajj.hajj_umrah')}
          cta={t('common.open')}
          onPressCta={() => navigateTo('HajjUmrah')}
        >
          <Text style={styles.blockTitle}>Key Features</Text>
          <Bullet>Step‑by‑Step Guide: Ihram, Tawaf, Sa’i, Ramy al‑Jamarāt, Mina, ‘Arafah, Muzdalifah.</Bullet>
          <Bullet>Essential Duas: Text, meanings and (optionally) audio.</Bullet>
          <Bullet>Practical Info: Visa tips, packing lists, health & safety guidance.</Bullet>
          <Bullet>Q&A & Tips: FAQs and advice for first‑time pilgrims.</Bullet>
          <Bullet>Offline Access: Critical guidance available without internet.</Bullet>
          <Text style={styles.blockTitle}>Why It’s Useful</Text>
          <Bullet>Clear guidance reduces overwhelm for first‑timers.</Bullet>
          <Bullet>One‑stop resource from preparation to rituals.</Bullet>
        </Accordion>

        <Accordion
          icon="map"
          title={t('hajj.hajj_journey')}
          cta={t('common.open')}
          onPressCta={() => navigateTo('HajjJourney')}
        >
          <Text style={styles.blockTitle}>Key Features</Text>
          <Bullet>Personalized Timeline: Day‑by‑day itinerary aligned to Hajj schedule.</Bullet>
          <Bullet>Real‑Time Alerts: Reminders for ‘Arafah, Tawaf, Jamarāt, etc.</Bullet>
          <Bullet>Milestone Tracking: Check off completed rites and Qurbani.</Bullet>
          <Bullet>Interactive Maps: Guidance for key locations (Haram, Jamarāt, ‘Arafah).</Bullet>
          <Bullet>Emergency Assistance: Quick contacts and help info around Makkah.</Bullet>
          <Bullet>Hajj Diary: Capture reflections and notes.</Bullet>
          <Text style={styles.blockTitle}>Why It’s Useful</Text>
          <Bullet>Peace of mind with a structured plan.</Bullet>
          <Bullet>Focus on spiritual fulfillment while logistics are organized.</Bullet>
        </Accordion>
      </View>

      <View style={styles.section}>
        <Text style={styles.blockTitle}>{t('hajj.safety_tips_title')}</Text>
        <Bullet>{t('hajj.tip_heat')}</Bullet>
        <Bullet>{t('hajj.tip_mobility')}</Bullet>
        <Bullet>{t('hajj.tip_hygiene')}</Bullet>
        <Bullet>{t('hajj.tip_contacts')}</Bullet>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const Accordion = ({ icon, title, children, cta, onPressCta }: any) => {
  const [open, setOpen] = useState(false);
  const toggle = () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setOpen(!open); };
  return (
    <View style={styles.accContainer}>
      <TouchableOpacity style={styles.accHeader} onPress={toggle}>
        <View style={styles.cardIconWrap}><Ionicons name={icon} size={22} color={colors.accentTeal} /></View>
        <Text style={styles.accTitle}>{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
      </TouchableOpacity>
      {open && (
        <View style={styles.accBody}>
          {children}
          {!!cta && (
            <TouchableOpacity style={styles.ctaButton} onPress={onPressCta}>
              <Text style={styles.ctaText}>{cta}</Text>
              <Ionicons name="open-outline" size={16} color={colors.accentTeal} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bulletDot}>•</Text>
    <Text style={styles.bulletText}>{children as any}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  headerSubtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  qaBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 28, borderWidth: 1, borderColor: colors.accentTeal + '66', backgroundColor: colors.surface },
  qaText: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
  section: { padding: 20 },
  accContainer: { marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.divider, backgroundColor: colors.surface },
  accHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  accTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', flex: 1 },
  accBody: { paddingHorizontal: 16, paddingBottom: 14 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 6 },
  bulletDot: { color: colors.textSecondary, fontSize: 16, lineHeight: 20 },
  bulletText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, flex: 1 },
  blockTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginTop: 10 },
  ctaButton: { marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.accentTeal + '66' },
  ctaText: { color: colors.accentTeal, fontWeight: '700' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentTeal + '20',
  },
  cardTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  cardDesc: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
});


