import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChecklistItem { id: string; label: string; done: boolean; }

export default function HajjUmrahScreen() {
  const { t } = useLanguage();
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('umrah_checklist');
        const base: ChecklistItem[] = [
          { id: 'ihram', label: t('hajj.umrah_ihram'), done: false },
          { id: 'tawaf', label: t('hajj.umrah_tawaf'), done: false },
          { id: 'sai', label: t('hajj.umrah_sai'), done: false },
          { id: 'taqseer', label: t('hajj.umrah_taqseer'), done: false },
        ];
        if (saved) {
          const parsed: Record<string, boolean> = JSON.parse(saved);
          setItems(base.map(i => ({ ...i, done: !!parsed[i.id] })));
        } else {
          setItems(base);
        }
      } catch {
        setItems([
          { id: 'ihram', label: t('hajj.umrah_ihram'), done: false },
          { id: 'tawaf', label: t('hajj.umrah_tawaf'), done: false },
          { id: 'sai', label: t('hajj.umrah_sai'), done: false },
          { id: 'taqseer', label: t('hajj.umrah_taqseer'), done: false },
        ]);
      }
    })();
  }, [t]);

  const toggle = async (id: string) => {
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, done: !i.done } : i);
      const map: Record<string, boolean> = {};
      next.forEach(i => { map[i.id] = i.done; });
      AsyncStorage.setItem('umrah_checklist', JSON.stringify(map)).catch(()=>{});
      return next;
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>{t('hajj.hajj_umrah')}</Text>
        <Text style={styles.headerSubtitle}>{t('hajj.hajj_umrah_desc')}</Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('hajj.umrah_steps')}  ({Math.round((items.filter(i=>i.done).length / Math.max(1, items.length)) * 100)}%)</Text>
        {items.map(item => (
          <TouchableOpacity key={item.id} style={styles.checkItem} onPress={() => toggle(item.id)}>
            <Ionicons name={item.done ? 'checkbox' : 'square-outline'} size={22} color={item.done ? colors.accentGreen : colors.textSecondary} />
            <Text style={[styles.checkLabel, item.done && styles.checkLabelDone]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('hajj.packing_title')}</Text>
        <View style={styles.bullets}>
          <Text style={styles.bullet}>• Ihram garments (men), modest clothing (women)</Text>
          <Text style={styles.bullet}>• Comfortable sandals/shoes, unscented toiletries</Text>
          <Text style={styles.bullet}>• Refillable water bottle, small first‑aid kit</Text>
          <Text style={styles.bullet}>• Travel documents, IDs, cards, emergency contacts</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('hajj.visa_title')}</Text>
        <Text style={styles.paragraph}>• {t('hajj.visa_title')}: eVisa portals, group operator guidance, vaccination requirements as per current policy.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('hajj.faq_title')}</Text>
        <Text style={styles.faqQ}>{t('hajj.faq_q1')}</Text>
        <Text style={styles.faqA}>{t('hajj.faq_a1')}</Text>
        <Text style={styles.faqQ}>{t('hajj.faq_q2')}</Text>
        <Text style={styles.faqA}>{t('hajj.faq_a2')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('hajj.hajj_overview')}</Text>
        <Text style={styles.paragraph}>{t('hajj.hajj_overview_text')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('hajj.duas_title')}</Text>
        <View style={styles.duaCard}>
          <Text style={styles.duaTitle}>{t('hajj.dua_talbiya_title')}</Text>
          <Text style={styles.duaArabic}>لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ</Text>
          <Text style={styles.duaLabel}>{t('hajj.dua_transliteration')}</Text>
          <Text style={styles.duaTrans}>Labbayka Allāhumma labbayk. Labbayka lā sharīka laka labbayk. Inna al‑ḥamda wan‑ni‘mata laka wal‑mulk. Lā sharīka lak.</Text>
          <Text style={styles.duaLabel}>{t('hajj.dua_translation')}</Text>
          <Text style={styles.duaTrans}>Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Truly, all praise, favor and sovereignty belong to You. You have no partner.</Text>
        </View>
        <View style={styles.duaCard}>
          <Text style={styles.duaTitle}>{t('hajj.dua_tawaf_title')}</Text>
          <Text style={styles.duaArabic}>رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ</Text>
          <Text style={styles.duaLabel}>{t('hajj.dua_transliteration')}</Text>
          <Text style={styles.duaTrans}>Rabbana ātinā fid‑dunyā ḥasanah wa fil‑ākhirati ḥasanah wa qinā ‘adhāban‑nār.</Text>
          <Text style={styles.duaLabel}>{t('hajj.dua_translation')}</Text>
          <Text style={styles.duaTrans}>Our Lord, give us in this world good and in the Hereafter good, and protect us from the punishment of the Fire.</Text>
        </View>
        <View style={styles.duaCard}>
          <Text style={styles.duaTitle}>{t('hajj.dua_sai_title')}</Text>
          <Text style={styles.duaArabic}>إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ</Text>
          <Text style={styles.duaLabel}>{t('hajj.dua_transliteration')}</Text>
          <Text style={styles.duaTrans}>Inna al‑Ṣafā wal‑Marwata min sha‘ā’irillāh.</Text>
          <Text style={styles.duaLabel}>{t('hajj.dua_translation')}</Text>
          <Text style={styles.duaTrans}>Indeed, Safa and Marwah are among the symbols of Allah.</Text>
        </View>
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
  sectionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  paragraph: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  checkLabel: { color: colors.textPrimary, fontSize: 15 },
  checkLabelDone: { textDecorationLine: 'line-through', color: colors.textSecondary },
  duaCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.divider, marginBottom: 12 },
  duaTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 6 },
  duaArabic: { color: colors.textPrimary, fontSize: 16, lineHeight: 24, marginBottom: 6 },
  duaLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 6 },
  duaTrans: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  bullets: { marginTop: 6 },
  bullet: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  faqQ: { color: colors.textPrimary, fontWeight: '700', marginTop: 8 },
  faqA: { color: colors.textSecondary },
});


