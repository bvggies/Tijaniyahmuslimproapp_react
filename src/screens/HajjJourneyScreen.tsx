import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';

const phases = [
  { key: 'day8', titleKey: 'hajj.day8_title', textKey: 'hajj.day8_text' },
  { key: 'day9', titleKey: 'hajj.day9_title', textKey: 'hajj.day9_text' },
  { key: 'day10', titleKey: 'hajj.day10_title', textKey: 'hajj.day10_text' },
  { key: 'days11_13', titleKey: 'hajj.days11_13_title', textKey: 'hajj.days11_13_text' },
];

export default function HajjJourneyScreen() {
  const { t } = useLanguage();
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => { (async () => { try { const s = await AsyncStorage.getItem('hajj_journey_done'); if (s) setDone(JSON.parse(s)); } catch {} })(); }, []);
  const toggle = (k: string) => setDone(prev => ({ ...prev, [k]: !prev[k] }));
  useEffect(() => { AsyncStorage.setItem('hajj_journey_done', JSON.stringify(done)).catch(()=>{}); }, [done]);
  const openMap = (query: string) => {
    const url = Platform.select({ ios: `http://maps.apple.com/?q=${encodeURIComponent(query)}`, android: `geo:0,0?q=${encodeURIComponent(query)}` });
    if (url) Linking.openURL(url).catch(()=>{});
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>{t('hajj.hajj_journey')}</Text>
        <Text style={styles.headerSubtitle}>{t('hajj.hajj_journey_desc')}</Text>
      </LinearGradient>

      <View style={styles.section}>
        {phases.map(p => (
          <View key={p.key} style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <Text style={styles.phaseTitle}>{t(p.titleKey)}</Text>
            </View>
            <Text style={styles.phaseText}>{t(p.textKey)}</Text>
            <TouchableOpacity onPress={() => toggle(p.key)} style={[styles.doneBtn, done[p.key] && styles.doneBtnActive]}>
              <Text style={[styles.doneBtnText, done[p.key] && styles.doneBtnTextActive]}>{done[p.key] ? '✓ Done' : 'Mark Done'}</Text>
            </TouchableOpacity>
            <View style={styles.mapRow}>
              <TouchableOpacity style={styles.mapBtn} onPress={() => openMap('Masjid al-Haram')}><Text style={styles.mapBtnText}>Haram</Text></TouchableOpacity>
              <TouchableOpacity style={styles.mapBtn} onPress={() => openMap('Jamarat Bridge')}><Text style={styles.mapBtnText}>Jamarat</Text></TouchableOpacity>
              <TouchableOpacity style={styles.mapBtn} onPress={() => openMap('Mount Arafat')}><Text style={styles.mapBtnText}>Arafat</Text></TouchableOpacity>
              <TouchableOpacity style={styles.mapBtn} onPress={() => openMap('Muzdalifah')}><Text style={styles.mapBtnText}>Muzdalifah</Text></TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  headerSubtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  section: { padding: 20 },
  phaseCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.divider, marginBottom: 12 },
  phaseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  phaseTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  phaseText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  doneBtn: { borderWidth: 1, borderColor: colors.divider, borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: colors.surface },
  doneBtnActive: { borderColor: colors.accentGreen, backgroundColor: colors.accentGreen + '22' },
  doneBtnText: { color: colors.textSecondary, fontWeight: '700' },
  doneBtnTextActive: { color: colors.accentGreen },
  mapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  mapBtn: { borderWidth: 1, borderColor: colors.accentTeal + '66', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 10 },
  mapBtnText: { color: colors.accentTeal, fontWeight: '700' },
});


