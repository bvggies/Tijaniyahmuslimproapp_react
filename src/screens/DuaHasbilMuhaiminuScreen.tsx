import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');

interface DuaLine {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

const DuaHasbilMuhaiminuScreen: React.FC = () => {
  const navigation = useNavigation();
  const [fontSize, setFontSize] = useState(28);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the shield icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const duaLines: DuaLine[] = [
    {
      id: '1',
      arabic: 'حَسْبِيَ المُهَيْمِنُ حَسْبِيَ العَلِيمُ',
      transliteration: 'Hasbiyal Muhaiminu hasbiyal \'Alim',
      translation: 'Sufficient for me is the Protector, sufficient for me is the All-Knowing',
    },
    {
      id: '2',
      arabic: 'حَسْبِيَ المُقَدِّمُ حَسْبِيَ المُؤَخِّرُ',
      transliteration: 'Hasbiyal Muqaddimu hasbiyal Mu\'akhkhir',
      translation: 'Sufficient for me is the One who brings forward, sufficient for me is the One who puts back',
    },
    {
      id: '3',
      arabic: 'حَسْبِيَ الظَّاهِرُ حَسْبِيَ البَاطِنُ',
      transliteration: 'Hasbiyal Dhahiru hasbiyal Batin',
      translation: 'Sufficient for me is the Manifest, sufficient for me is the Hidden',
    },
    {
      id: '4',
      arabic: 'حَسْبِيَ الأَوَّلُ حَسْبِيَ الآخِرُ',
      transliteration: 'Hasbiyal Awwalu hasbiyal Akhir',
      translation: 'Sufficient for me is the First, sufficient for me is the Last',
    },
    {
      id: '5',
      arabic: 'حَسْبِيَ القَوِيُّ حَسْبِيَ المَتِينُ',
      transliteration: 'Hasbiyal Qawiyyu hasbiyal Matin',
      translation: 'Sufficient for me is the All-Strong, sufficient for me is the Firm',
    },
    {
      id: '6',
      arabic: 'حَسْبِيَ الوَلِيُّ حَسْبِيَ الحَمِيدُ',
      transliteration: 'Hasbiyal Waliyyu hasbiyal Hamid',
      translation: 'Sufficient for me is the Protecting Friend, sufficient for me is the Praiseworthy',
    },
    {
      id: '7',
      arabic: 'حَسْبِيَ الوَاحِدُ حَسْبِيَ الأَحَدُ',
      transliteration: 'Hasbiyal Wahidu hasbiyal Ahad',
      translation: 'Sufficient for me is the One, sufficient for me is the Unique',
    },
    {
      id: '8',
      arabic: 'حَسْبِيَ الصَّمَدُ حَسْبِيَ الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ',
      transliteration: 'Hasbiyas Samadu hasbiyalladhi lam yalid wa lam yulad',
      translation: 'Sufficient for me is the Eternal, sufficient for me is He who begets not nor was begotten',
    },
    {
      id: '9',
      arabic: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
      transliteration: 'Wa lam yakun lahu kufuwan ahad',
      translation: 'And there is none comparable to Him',
    },
    {
      id: '10',
      arabic: 'حَسْبِيَ اللهُ وَنِعْمَ الوَكِيلُ',
      transliteration: 'Hasbiyallahu wa ni\'mal wakil',
      translation: 'Allah is sufficient for me, and He is the best Disposer of affairs',
    },
    {
      id: '11',
      arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ العَلِيِّ العَظِيمِ',
      transliteration: 'La hawla wa la quwwata illa billahil \'Aliyyil \'Adhim',
      translation: 'There is no power nor might except with Allah, the Most High, the Most Great',
    },
  ];

  const handleCopy = async (line: DuaLine) => {
    const text = `${line.arabic}\n\n${line.transliteration}\n\n${line.translation}`;
    await Clipboard.setStringAsync(text);
    setCopiedId(line.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = async () => {
    const fullDua = duaLines.map(l => 
      `${l.arabic}\n${l.transliteration}\n${l.translation}`
    ).join('\n\n');
    await Clipboard.setStringAsync(fullDua);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async () => {
    const fullDua = duaLines.map(l => l.arabic).join('\n');
    const transliteration = duaLines.map(l => l.transliteration).join('\n');
    const translation = duaLines.map(l => l.translation).join('\n');

    try {
      await Share.share({
        message: `حَسْبِيَ المُهَيْمِنُ - Hasbil Muhaiminu\n(The Protector is Sufficient for Me)\n\n${fullDua}\n\n--- Transliteration ---\n${transliteration}\n\n--- Translation ---\n${translation}\n\n- From Tijaniyah Muslim Pro`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => Math.min(42, Math.max(20, prev + delta)));
  };

  const renderDuaLine = (line: DuaLine, index: number) => {
    const lineAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(lineAnim, {
        toValue: 1,
        delay: index * 70,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        key={line.id}
        style={[
          styles.duaLine,
          {
            opacity: lineAnim,
            transform: [
              { translateX: lineAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) },
            ],
          },
        ]}
      >
        <View style={styles.lineContent}>
          <View style={styles.lineHeader}>
            <View style={styles.lineNumber}>
              <Text style={styles.lineNumberText}>{index + 1}</Text>
            </View>
            <TouchableOpacity
              style={[styles.copyBtn, copiedId === line.id && styles.copyBtnActive]}
              onPress={() => handleCopy(line)}
            >
              <Ionicons
                name={copiedId === line.id ? 'checkmark' : 'copy-outline'}
                size={16}
                color={copiedId === line.id ? '#FFFFFF' : '#3F51B5'}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.arabicText, { fontSize }]} selectable>
            {line.arabic}
          </Text>

          {showTransliteration && (
            <View style={styles.transliterationBox}>
              <Text style={styles.transliterationText} selectable>
                {line.transliteration}
              </Text>
            </View>
          )}

          {showTranslation && (
            <View style={styles.translationBox}>
              <Text style={styles.translationText} selectable>
                {line.translation}
              </Text>
            </View>
          )}
        </View>

        {/* Decorative line */}
        {index < duaLines.length - 1 && (
          <View style={styles.decorativeLine}>
            <View style={styles.lineLeft} />
            <Ionicons name="diamond" size={8} color="#3F51B540" />
            <View style={styles.lineRight} />
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <LinearGradient
          colors={['#3F51B5', '#303F9F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerPattern}>
            <View style={[styles.patternCircle, { top: -40, right: -40, width: 120, height: 120 }]} />
            <View style={[styles.patternCircle, { bottom: 0, left: -30, width: 80, height: 80 }]} />
          </View>

          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[styles.actionBtn, copiedId === 'all' && styles.actionBtnActive]}
                onPress={handleCopyAll}
              >
                <Ionicons
                  name={copiedId === 'all' ? 'checkmark' : 'copy'}
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerContent}>
            <Animated.View
              style={[
                styles.headerIconWrap,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Ionicons name="shield-checkmark" size={36} color="#FFFFFF" />
            </Animated.View>
            <Text style={styles.headerTitle}>Hasbil Muhaiminu</Text>
            <Text style={styles.headerArabic}>حَسْبِيَ المُهَيْمِنُ</Text>
            <Text style={styles.headerSubtitle}>
              The Protector is Sufficient for Me
            </Text>
          </View>

          {/* Benefits pills */}
          <View style={styles.benefitPills}>
            <View style={styles.benefitPill}>
              <Ionicons name="shield" size={12} color="#FFFFFF" />
              <Text style={styles.benefitPillText}>Protection</Text>
            </View>
            <View style={styles.benefitPill}>
              <Ionicons name="heart" size={12} color="#FFFFFF" />
              <Text style={styles.benefitPillText}>Peace</Text>
            </View>
            <View style={styles.benefitPill}>
              <Ionicons name="star" size={12} color="#FFFFFF" />
              <Text style={styles.benefitPillText}>Blessings</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Font</Text>
          <View style={styles.fontControls}>
            <TouchableOpacity
              style={styles.fontBtn}
              onPress={() => adjustFontSize(-2)}
            >
              <Text style={styles.fontBtnText}>A-</Text>
            </TouchableOpacity>
            <Text style={styles.fontSizeText}>{fontSize}</Text>
            <TouchableOpacity
              style={styles.fontBtn}
              onPress={() => adjustFontSize(2)}
            >
              <Text style={styles.fontBtnText}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleBtn, showTransliteration && styles.toggleBtnActive]}
            onPress={() => setShowTransliteration(!showTransliteration)}
          >
            <Ionicons
              name="mic-outline"
              size={16}
              color={showTransliteration ? '#FFFFFF' : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, showTranslation && styles.toggleBtnActive]}
            onPress={() => setShowTranslation(!showTranslation)}
          >
            <Ionicons
              name="language-outline"
              size={16}
              color={showTranslation ? '#FFFFFF' : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.introCard}>
          <LinearGradient
            colors={['#3F51B515', '#303F9F08']}
            style={styles.introGradient}
          >
            <View style={styles.introIconWrap}>
              <Ionicons name="information-circle" size={24} color="#3F51B5" />
            </View>
            <View style={styles.introTextContainer}>
              <Text style={styles.introTitle}>About This Powerful Dua</Text>
              <Text style={styles.introText}>
                Hasbil Muhaiminu is a powerful dua for seeking Allah's protection. 
                By invoking the beautiful names of Allah, we affirm our complete 
                reliance upon Him. This dua is especially beneficial for protection 
                from harm, evil eye, and all forms of negativity.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Recommendation */}
        <View style={styles.recommendCard}>
          <Ionicons name="time-outline" size={20} color="#3F51B5" />
          <Text style={styles.recommendText}>
            Recite this dua after Fajr and Maghrib prayers for maximum protection
          </Text>
        </View>

        {/* Dua Lines */}
        {duaLines.map((line, index) => renderDuaLine(line, index))}

        {/* Closing Section */}
        <View style={styles.closingSection}>
          <LinearGradient
            colors={['#3F51B5', '#303F9F']}
            style={styles.closingGradient}
          >
            <Ionicons name="shield-checkmark" size={40} color="#FFFFFF" />
            <Text style={styles.closingArabic}>
              اللهُ حَسْبُنَا وَنِعْمَ الوَكِيلُ
            </Text>
            <Text style={styles.closingTranslation}>
              Allah is sufficient for us, and He is the best Disposer of affairs
            </Text>
            <View style={styles.closingDivider} />
            <Text style={styles.closingNote}>
              May Allah protect you and your loved ones from all harm
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerArabic: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  benefitPills: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  benefitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  benefitPillText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 10,
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginHorizontal: 10,
    minWidth: 24,
    textAlign: 'center',
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#3F51B5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  introCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  introGradient: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3F51B530',
  },
  introIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3F51B515',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3F51B5',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  recommendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3F51B510',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#3F51B5',
  },
  recommendText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  duaLine: {
    marginBottom: 8,
  },
  lineContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  lineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lineNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3F51B520',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3F51B5',
  },
  copyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3F51B515',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyBtnActive: {
    backgroundColor: '#3F51B5',
  },
  arabicText: {
    fontSize: 28,
    lineHeight: 50,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  transliterationBox: {
    backgroundColor: '#3F51B508',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  transliterationText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  translationBox: {
    backgroundColor: `${colors.accentOrange}08`,
    borderRadius: 10,
    padding: 12,
  },
  translationText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    textAlign: 'center',
  },
  decorativeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  lineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: '#3F51B520',
    marginRight: 8,
  },
  lineRight: {
    flex: 1,
    height: 1,
    backgroundColor: '#3F51B520',
    marginLeft: 8,
  },
  closingSection: {
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  closingGradient: {
    padding: 24,
    alignItems: 'center',
  },
  closingArabic: {
    fontSize: 22,
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  closingTranslation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  closingDivider: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 16,
    borderRadius: 1,
  },
  closingNote: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DuaHasbilMuhaiminuScreen;

