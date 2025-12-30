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

interface DuaSection {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

const DuaKhatmulWazifaScreen: React.FC = () => {
  const navigation = useNavigation();
  const [fontSize, setFontSize] = useState(26);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const duaSections: DuaSection[] = [
    {
      id: '1',
      arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الفَاتِحِ لِمَا أُغْلِقَ وَالخَاتِمِ لِمَا سَبَقَ وَالنَّاصِرِ الحَقَّ بِالحَقِّ وَالهَادِي إِلَى صِرَاطِكَ المُسْتَقِيمِ وَعَلَى آلِهِ حَقَّ قَدْرِهِ وَمِقْدَارِهِ العَظِيمِ',
      transliteration: 'Allahumma salli \'ala sayyidina Muhammadin-il-Fatihi lima ughliqa wal-Khatimi lima sabaqa wan-Nasiril-Haqqi bil-Haqqi wal-Hadi ila Siratika-l-Mustaqimi wa \'ala alihi haqqa qadrihi wa miqdarihi-l-\'Azim',
      translation: 'O Allah, bless our master Muhammad, the opener of what was closed, the seal of what had preceded, the helper of the truth by the truth, the guide to Your straight path, and bless his family according to his immense and exalted status.',
    },
    {
      id: '2',
      arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ بِجَاهِ سَيِّدِنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ أَنْ تَغْفِرَ لَنَا ذُنُوبَنَا وَتُكَفِّرَ عَنَّا سَيِّئَاتِنَا وَتَتَوَفَّانَا مَعَ الأَبْرَارِ',
      transliteration: 'Allahumma inna nas\'aluka bi-jahi sayyidina Muhammadin sallallahu \'alayhi wa sallam an taghfira lana dhunubana wa tukaffira \'anna sayyi\'atina wa tatawaffana ma\' al-abrar',
      translation: 'O Allah, we ask You by the rank of our master Muhammad (peace and blessings be upon him) to forgive us our sins, to expiate our evil deeds, and to take our souls with the righteous.',
    },
    {
      id: '3',
      arabic: 'اللَّهُمَّ اغْفِرْ لِلْمُؤْمِنِينَ وَالمُؤْمِنَاتِ وَالمُسْلِمِينَ وَالمُسْلِمَاتِ الأَحْيَاءِ مِنْهُمْ وَالأَمْوَاتِ إِنَّكَ سَمِيعٌ قَرِيبٌ مُجِيبُ الدَّعَوَاتِ',
      transliteration: 'Allahumma-ghfir lil-mu\'minina wal-mu\'minat wal-muslimina wal-muslimat al-ahya\'i minhum wal-amwat innaka sami\'un qaribun mujib-ud-da\'awat',
      translation: 'O Allah, forgive the believing men and believing women, the Muslim men and Muslim women, the living among them and the deceased. Indeed, You are All-Hearing, Near, and Answerer of supplications.',
    },
    {
      id: '4',
      arabic: 'اللَّهُمَّ اغْفِرْ لَنَا وَلِوَالِدَيْنَا وَلِمَشَايِخِنَا وَلِإِخْوَانِنَا فِي الطَّرِيقَةِ وَلِجَمِيعِ المُسْلِمِينَ',
      transliteration: 'Allahumma-ghfir lana wa li-walidayna wa li-mashayikhina wa li-ikhwanina fi-t-tariqa wa li-jami\'il-muslimin',
      translation: 'O Allah, forgive us, our parents, our teachers (shaykhs), our brothers in the spiritual path, and all Muslims.',
    },
    {
      id: '5',
      arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      transliteration: 'Rabbana atina fi-d-dunya hasanatan wa fi-l-akhirati hasanatan wa qina \'adhab-an-nar',
      translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    },
    {
      id: '6',
      arabic: 'سُبْحَانَ رَبِّكَ رَبِّ العِزَّةِ عَمَّا يَصِفُونَ وَسَلاَمٌ عَلَى المُرْسَلِينَ وَالحَمْدُ للهِ رَبِّ العَالَمِينَ',
      transliteration: 'Subhana rabbika rabbi-l-\'izzati \'amma yasifun wa salamun \'ala-l-mursalin wal-hamdulillahi rabbi-l-\'alamin',
      translation: 'Glory be to your Lord, the Lord of Honor, above what they describe. And peace be upon the messengers. And praise be to Allah, Lord of all worlds.',
    },
  ];

  const handleCopy = async (section: DuaSection) => {
    const text = `${section.arabic}\n\n${section.transliteration}\n\n${section.translation}`;
    await Clipboard.setStringAsync(text);
    setCopiedId(section.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async () => {
    const fullDua = duaSections.map(s => 
      `${s.arabic}\n\n${s.transliteration}\n\n${s.translation}`
    ).join('\n\n---\n\n');

    try {
      await Share.share({
        message: `Dua Khatmul Wazifa (دعاء ختم الوظيفة)\n\n${fullDua}\n\n- From Tijaniyah Muslim Pro`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => Math.min(40, Math.max(18, prev + delta)));
  };

  const renderDuaSection = (section: DuaSection, index: number) => {
    const sectionAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(sectionAnim, {
        toValue: 1,
        delay: index * 100,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        key={section.id}
        style={[
          styles.duaSection,
          {
            opacity: sectionAnim,
            transform: [
              { translateY: sectionAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
            ],
          },
        ]}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNumber}>
            <Text style={styles.sectionNumberText}>{index + 1}</Text>
          </View>
          <TouchableOpacity
            style={[styles.copyBtn, copiedId === section.id && styles.copyBtnActive]}
            onPress={() => handleCopy(section)}
          >
            <Ionicons
              name={copiedId === section.id ? 'checkmark' : 'copy-outline'}
              size={18}
              color={copiedId === section.id ? '#FFFFFF' : colors.accentTeal}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.arabicContainer}>
          <Text style={[styles.arabicText, { fontSize }]} selectable>
            {section.arabic}
          </Text>
        </View>

        {showTransliteration && (
          <View style={styles.transliterationContainer}>
            <View style={styles.labelRow}>
              <Ionicons name="mic-outline" size={14} color={colors.accentTeal} />
              <Text style={styles.label}>Transliteration</Text>
            </View>
            <Text style={styles.transliterationText} selectable>
              {section.transliteration}
            </Text>
          </View>
        )}

        {showTranslation && (
          <View style={styles.translationContainer}>
            <View style={styles.labelRow}>
              <Ionicons name="language-outline" size={14} color={colors.accentOrange} />
              <Text style={styles.labelTranslation}>English Translation</Text>
            </View>
            <Text style={styles.translationText} selectable>
              {section.translation}
            </Text>
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
          colors={['#E91E63', '#C2185B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerPattern}>
            <View style={[styles.patternCircle, { top: -30, right: -30, width: 100, height: 100 }]} />
            <View style={[styles.patternCircle, { bottom: 10, left: -20, width: 60, height: 60 }]} />
          </View>

          <View style={styles.headerTopRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.headerIconWrap}>
              <Ionicons name="bookmark" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Dua Khatmul Wazifa</Text>
            <Text style={styles.headerArabic}>دعاء ختم الوظيفة</Text>
            <Text style={styles.headerSubtitle}>
              The Closing Supplication of Wazifa
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Font Size */}
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

        {/* Toggles */}
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

      {/* Dua Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Introduction */}
        <View style={styles.introCard}>
          <Ionicons name="information-circle" size={24} color={colors.accentTeal} />
          <Text style={styles.introText}>
            This dua is recited at the completion of the Wazifa. It is a blessed supplication 
            that carries immense spiritual rewards when recited with sincerity and presence of heart.
          </Text>
        </View>

        {/* Dua Sections */}
        {duaSections.map((section, index) => renderDuaSection(section, index))}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerIcon}>
            <Ionicons name="checkmark-done-circle" size={40} color={colors.accentTeal} />
          </View>
          <Text style={styles.footerText}>
            May Allah accept your Wazifa and grant you His blessings
          </Text>
          <Text style={styles.footerArabic}>آمين يا رب العالمين</Text>
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
    paddingBottom: 24,
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerArabic: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    textAlign: 'center',
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
    backgroundColor: colors.accentTeal,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${colors.accentTeal}15`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${colors.accentTeal}30`,
  },
  introText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  duaSection: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.accentTeal}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accentTeal,
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.accentTeal}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyBtnActive: {
    backgroundColor: colors.accentTeal,
  },
  arabicContainer: {
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 26,
    lineHeight: 50,
    color: colors.textPrimary,
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  transliterationContainer: {
    backgroundColor: `${colors.accentTeal}08`,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentTeal,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transliterationText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  translationContainer: {
    backgroundColor: `${colors.accentOrange}08`,
    borderRadius: 12,
    padding: 14,
  },
  labelTranslation: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentOrange,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  translationText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerIcon: {
    marginBottom: 16,
  },
  footerText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footerArabic: {
    fontSize: 20,
    color: colors.accentTeal,
    marginTop: 12,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
});

export default DuaKhatmulWazifaScreen;

