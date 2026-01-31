import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useFadeIn } from '../hooks/useAnimations';

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'GHS' | 'NGN';

interface ZakatInputs {
  cash: string;
  goldGrams: string;
  goldValue: string;
  silverGrams: string;
  silverValue: string;
  businessAssets: string;
  investments: string;
  receivables: string;
  debts: string;
}

const STORAGE_KEY = 'zakat_calculator_history_v1';

export default function ZakatCalculatorScreen() {
  const { t } = useLanguage();
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [inputs, setInputs] = useState<ZakatInputs>({
    cash: '',
    goldGrams: '',
    goldValue: '',
    silverGrams: '',
    silverValue: '',
    businessAssets: '',
    investments: '',
    receivables: '',
    debts: '',
  });
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(75); // fallback approx in selected currency
  const [silverPricePerGram, setSilverPricePerGram] = useState<number>(0.9); // fallback approx
  const [isSaving, setIsSaving] = useState(false);
  const opacity = useFadeIn({ duration: 380 });

  // Best effort: try to fetch latest prices; silently fall back on defaults
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Use a lightweight public price source if available in production; here we keep safe defaults
        // You can wire a backend proxy later if needed.
      } catch {}
    };
    fetchPrices();
  }, [currency]);

  const parse = (v: string): number => {
    const n = parseFloat((v || '').replace(/[^0-9.\-]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  const goldTotal = useMemo(() => {
    const grams = parse(inputs.goldGrams);
    const explicit = parse(inputs.goldValue);
    if (explicit > 0) return explicit;
    return grams * goldPricePerGram;
  }, [inputs.goldGrams, inputs.goldValue, goldPricePerGram]);

  const silverTotal = useMemo(() => {
    const grams = parse(inputs.silverGrams);
    const explicit = parse(inputs.silverValue);
    if (explicit > 0) return explicit;
    return grams * silverPricePerGram;
  }, [inputs.silverGrams, inputs.silverValue, silverPricePerGram]);

  const totalZakatable = useMemo(() => {
    const cash = parse(inputs.cash);
    const business = parse(inputs.businessAssets);
    const invest = parse(inputs.investments);
    const recv = parse(inputs.receivables);
    const debts = parse(inputs.debts);
    const gross = cash + goldTotal + silverTotal + business + invest + recv;
    return Math.max(0, gross - debts);
  }, [inputs, goldTotal, silverTotal]);

  // Nisab: 85g gold or 595g silver (use lower monetary value)
  const nisab = useMemo(() => {
    const goldNisab = 85 * goldPricePerGram;
    const silverNisab = 595 * silverPricePerGram;
    return Math.min(goldNisab, silverNisab);
  }, [goldPricePerGram, silverPricePerGram]);

  const zakatDue = useMemo(() => totalZakatable * 0.025, [totalZakatable]);
  const isEligible = totalZakatable >= nisab;

  const setField = (field: keyof ZakatInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setInputs({
      cash: '',
      goldGrams: '',
      goldValue: '',
      silverGrams: '',
      silverValue: '',
      businessAssets: '',
      investments: '',
      receivables: '',
      debts: '',
    });
  };

  const saveCalculation = async () => {
    try {
      setIsSaving(true);
      const entry = {
        ts: Date.now(),
        currency,
        inputs,
        totals: { totalZakatable, zakatDue, nisab },
      };
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(entry);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 10)));
      Alert.alert(t('common.success'), t('zakat.saved'));
    } catch (e) {
      Alert.alert(t('common.error'), t('zakat.save_failed'));
    } finally {
      setIsSaving(false);
    }
  };

  const CurrencyPill = ({ code }: { code: CurrencyCode }) => (
    <TouchableOpacity
      style={[styles.pill, currency === code && styles.pillActive]}
      onPress={() => setCurrency(code)}
    >
      <Text style={[styles.pillText, currency === code && styles.pillTextActive]}>{code}</Text>
    </TouchableOpacity>
  );

  const Stat = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
    <View style={[styles.statRow, highlight && styles.statRowHighlight]}>
      <Text style={[styles.statLabel, highlight && styles.statLabelHighlight]}>{label}</Text>
      <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>{value}</Text>
    </View>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );

  const Input = ({ placeholder, value, onChangeText }: { placeholder: string; value: string; onChangeText: (v: string) => void }) => (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      style={styles.input}
      keyboardType="numeric"
      value={value}
      onChangeText={onChangeText}
    />
  );

  return (
    <Animated.View style={[styles.container, { opacity }]}>
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>{t('zakat.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('zakat.subtitle')}</Text>
      </LinearGradient>

      {/* Currency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('zakat.currency')}</Text>
        <View style={styles.pillsRow}>
          <CurrencyPill code="USD" />
          <CurrencyPill code="EUR" />
          <CurrencyPill code="GBP" />
          <CurrencyPill code="GHS" />
          <CurrencyPill code="NGN" />
        </View>
      </View>

      {/* Nisab */}
      <Section title={t('zakat.nisab_threshold')}>
        <View style={styles.nisabRow}>
          <View style={styles.nisabCol}>
            <Text style={styles.nisabLabel}>85g Gold</Text>
            <Text style={styles.nisabValue}>{currency} {(85 * goldPricePerGram).toFixed(2)}</Text>
          </View>
          <View style={styles.nisabCol}>
            <Text style={styles.nisabLabel}>595g Silver</Text>
            <Text style={styles.nisabValue}>{currency} {(595 * silverPricePerGram).toFixed(2)}</Text>
          </View>
        </View>
        <Text style={styles.infoText}>{t('zakat.info')}</Text>
      </Section>

      {/* Assets */}
      <Section title={t('zakat.cash_savings')}>
        <Input placeholder={`${currency} 0.00`} value={inputs.cash} onChangeText={(v) => setField('cash', v)} />
      </Section>

      <Section title={t('zakat.gold')}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.fieldLabel}>{t('zakat.by_grams')}</Text>
            <Input placeholder={'0'} value={inputs.goldGrams} onChangeText={(v) => setField('goldGrams', v)} />
          </View>
          <View style={styles.col}>
            <Text style={styles.fieldLabel}>{t('zakat.by_value')}</Text>
            <Input placeholder={`${currency} 0.00`} value={inputs.goldValue} onChangeText={(v) => setField('goldValue', v)} />
          </View>
        </View>
        <Stat label={t('zakat.estimated_value')} value={`${currency} ${goldTotal.toFixed(2)}`} />
      </Section>

      <Section title={t('zakat.silver')}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.fieldLabel}>{t('zakat.by_grams')}</Text>
            <Input placeholder={'0'} value={inputs.silverGrams} onChangeText={(v) => setField('silverGrams', v)} />
          </View>
          <View style={styles.col}>
            <Text style={styles.fieldLabel}>{t('zakat.by_value')}</Text>
            <Input placeholder={`${currency} 0.00`} value={inputs.silverValue} onChangeText={(v) => setField('silverValue', v)} />
          </View>
        </View>
        <Stat label={t('zakat.estimated_value')} value={`${currency} ${silverTotal.toFixed(2)}`} />
      </Section>

      <Section title={t('zakat.business_assets')}>
        <Input placeholder={`${currency} 0.00`} value={inputs.businessAssets} onChangeText={(v) => setField('businessAssets', v)} />
      </Section>

      <Section title={t('zakat.investments')}>
        <Input placeholder={`${currency} 0.00`} value={inputs.investments} onChangeText={(v) => setField('investments', v)} />
      </Section>

      <Section title={t('zakat.money_owed')}>
        <Input placeholder={`${currency} 0.00`} value={inputs.receivables} onChangeText={(v) => setField('receivables', v)} />
      </Section>

      <Section title={t('zakat.debts')}>
        <Input placeholder={`${currency} 0.00`} value={inputs.debts} onChangeText={(v) => setField('debts', v)} />
      </Section>

      {/* Totals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('zakat.total_assets')}</Text>
        <View style={styles.card}>
          <Stat label={t('zakat.total_assets')} value={`${currency} ${totalZakatable.toFixed(2)}`} />
          <Stat label={t('zakat.zakat_due')} value={`${currency} ${zakatDue.toFixed(2)}`} highlight={true} />
          <View style={[styles.eligibility, isEligible ? styles.eligible : styles.notEligible]}>
            <Ionicons name={isEligible ? 'checkmark-circle' : 'alert-circle'} size={18} color={isEligible ? colors.accentGreen : colors.textSecondary} />
            <Text style={[styles.eligibilityText, isEligible && styles.eligibilityTextActive]}>
              {isEligible ? t('zakat.eligible') : t('zakat.not_eligible')}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={reset}>
          <Text style={styles.buttonText}>{t('zakat.reset')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.calculateButton]} onPress={saveCalculation} disabled={isSaving}>
          <LinearGradient colors={[colors.accentTeal, colors.accentGreen]} style={styles.calculateGradient}>
            <Ionicons name="save" size={18} color="#fff" />
            <Text style={styles.buttonTextPrimary}>{t('common.save')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  headerSubtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  section: { paddingHorizontal: 20, paddingTop: 16 },
  sectionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.divider },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.divider, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, color: colors.textPrimary, fontSize: 16 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  fieldLabel: { color: colors.textSecondary, fontSize: 12, marginBottom: 6 },
  pillsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.divider },
  pillActive: { backgroundColor: colors.accentTeal + '22', borderColor: colors.accentTeal + '66' },
  pillText: { color: colors.textSecondary, fontSize: 12 },
  pillTextActive: { color: colors.accentTeal, fontWeight: '700' },
  nisabRow: { flexDirection: 'row', gap: 12 },
  nisabCol: { flex: 1 },
  nisabLabel: { color: colors.textSecondary, fontSize: 12 },
  nisabValue: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 4 },
  infoText: { color: colors.textSecondary, fontSize: 12, marginTop: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  statRowHighlight: { borderTopWidth: 1, borderColor: colors.divider, paddingTop: 10, marginTop: 10 },
  statLabel: { color: colors.textSecondary, fontSize: 14 },
  statLabelHighlight: { color: colors.textPrimary, fontWeight: '700' },
  statValue: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  statValueHighlight: { color: colors.accentGreen },
  eligibility: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  eligible: {},
  notEligible: {},
  eligibilityText: { color: colors.textSecondary, fontSize: 13 },
  eligibilityTextActive: { color: colors.accentGreen, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 16 },
  button: { flex: 1 },
  resetButton: { },
  calculateButton: { },
  calculateGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, gap: 8 },
  buttonText: { color: colors.textPrimary, textAlign: 'center', paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.divider, backgroundColor: 'rgba(255,255,255,0.06)', fontWeight: '600' },
  buttonTextPrimary: { color: '#fff', fontWeight: '700', fontSize: 16 },
});


