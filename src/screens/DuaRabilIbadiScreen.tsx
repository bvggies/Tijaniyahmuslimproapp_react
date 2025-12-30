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

interface DuaVerse {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

const DuaRabilIbadiScreen: React.FC = () => {
  const navigation = useNavigation();
  const [fontSize, setFontSize] = useState(26);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const duaVerses: DuaVerse[] = [
    {
      id: '1',
      arabic: 'رَبِّ العِبَادِ أَنْتَ رَبِّي وَمَلاذِي يَا إِلَهِي',
      transliteration: 'Rabbi-l-\'ibadi anta rabbi wa maladhi ya ilahi',
      translation: 'O Lord of all servants, You are my Lord and my refuge, O my God',
    },
    {
      id: '2',
      arabic: 'أَنْتَ المُجِيرُ وَأَنْتَ العَاصِمُ لِلنَّاسِ مِنْ سَخَطِهِ',
      transliteration: 'Anta-l-mujiru wa anta-l-\'asimu li-n-nasi min sakhatihi',
      translation: 'You are the Protector and You are the Preserver of people from His wrath',
    },
    {
      id: '3',
      arabic: 'يَا خَالِقَ البَشَرِ العَلِيَّ فَوْقَ خَلْقِهِ',
      transliteration: 'Ya khaliqa-l-bashari-l-\'aliyya fawqa khalqihi',
      translation: 'O Creator of mankind, the Most High above His creation',
    },
    {
      id: '4',
      arabic: 'يَا مَنْ لَهُ الخَلْقُ وَالأَمْرُ تَعَالَى وَتَقَدَّسَ',
      transliteration: 'Ya man lahu-l-khalqu wa-l-amru ta\'ala wa taqaddasa',
      translation: 'O He to whom belongs creation and command, Most High and Most Holy',
    },
    {
      id: '5',
      arabic: 'يَا مَالِكَ المُلْكِ تُؤْتِي المُلْكَ مَنْ تَشَاءُ',
      transliteration: 'Ya malika-l-mulki tu\'ti-l-mulka man tasha\'u',
      translation: 'O Owner of sovereignty, You give sovereignty to whom You will',
    },
    {
      id: '6',
      arabic: 'وَتَنْزِعُ المُلْكَ مِمَّنْ تَشَاءُ بِيَدِكَ الخَيْرُ',
      transliteration: 'Wa tanzi\'u-l-mulka mimman tasha\'u bi-yadika-l-khayr',
      translation: 'And You take sovereignty away from whom You will, in Your hand is all good',
    },
    {
      id: '7',
      arabic: 'إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ يَا أَللهُ',
      transliteration: 'Innaka \'ala kulli shay\'in qadirun ya Allah',
      translation: 'Indeed, You have power over all things, O Allah',
    },
    {
      id: '8',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ',
      transliteration: 'Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana \'abduka',
      translation: 'O Allah, You are my Lord, there is no deity except You, You created me and I am Your servant',
    },
    {
      id: '9',
      arabic: 'وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
      transliteration: 'Wa ana \'ala \'ahdika wa wa\'dika ma-stata\'tu',
      translation: 'And I am upon Your covenant and promise as much as I am able',
    },
    {
      id: '10',
      arabic: 'أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ',
      transliteration: 'A\'udhu bika min sharri ma sana\'tu abu\'u laka bi ni\'matika \'alayya',
      translation: 'I seek refuge in You from the evil of what I have done, I acknowledge Your blessings upon me',
    },
    {
      id: '11',
      arabic: 'وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      transliteration: 'Wa abu\'u bi dhanbi faghfir li fa innahu la yaghfiru-dh-dhunuba illa anta',
      translation: 'And I acknowledge my sins, so forgive me, for none forgives sins except You',
    },
    {
      id: '12',
      arabic: 'يَا غَفَّارُ يَا تَوَّابُ يَا رَحِيمُ يَا كَرِيمُ يَا اللهُ',
      transliteration: 'Ya Ghaffaru ya Tawwabu ya Rahimu ya Karimu ya Allah',
      translation: 'O Ever-Forgiving, O Acceptor of Repentance, O Most Merciful, O Most Generous, O Allah',
    },
  ];

  const handleCopy = async (verse: DuaVerse) => {
    const text = `${verse.arabic}\n\n${verse.transliteration}\n\n${verse.translation}`;
    await Clipboard.setStringAsync(text);
    setCopiedId(verse.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async () => {
    const fullDua = duaVerses.map(v => 
      `${v.arabic}\n${v.transliteration}\n${v.translation}`
    ).join('\n\n');

    try {
      await Share.share({
        message: `Dua Rabil Ibadi (دعاء رب العباد)\n\n${fullDua}\n\n- From Tijaniyah Muslim Pro`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => Math.min(40, Math.max(18, prev + delta)));
  };

  const renderDuaVerse = (verse: DuaVerse, index: number) => {
    const verseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(verseAnim, {
        toValue: 1,
        delay: index * 80,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        key={verse.id}
        style={[
          styles.verseCard,
          {
            opacity: verseAnim,
            transform: [
              { translateY: verseAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
            ],
          },
        ]}
      >
        <View style={styles.verseHeader}>
          <View style={styles.verseNumber}>
            <Text style={styles.verseNumberText}>{index + 1}</Text>
          </View>
          <TouchableOpacity
            style={[styles.copyBtn, copiedId === verse.id && styles.copyBtnActive]}
            onPress={() => handleCopy(verse)}
          >
            <Ionicons
              name={copiedId === verse.id ? 'checkmark' : 'copy-outline'}
              size={16}
              color={copiedId === verse.id ? '#FFFFFF' : '#673AB7'}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.arabicText, { fontSize }]} selectable>
          {verse.arabic}
        </Text>

        {showTransliteration && (
          <View style={styles.transliterationBox}>
            <Text style={styles.transliterationText} selectable>
              {verse.transliteration}
            </Text>
          </View>
        )}

        {showTranslation && (
          <View style={styles.translationBox}>
            <Text style={styles.translationText} selectable>
              {verse.translation}
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
          colors={['#673AB7', '#512DA8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerPattern}>
            <View style={[styles.patternCircle, { top: -30, right: -30, width: 100, height: 100 }]} />
            <View style={[styles.patternCircle, { bottom: 10, left: -20, width: 60, height: 60 }]} />
            <View style={[styles.patternCircle, { top: 50, left: 50, width: 40, height: 40 }]} />
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
              <Ionicons name="heart" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Dua Rabil Ibadi</Text>
            <Text style={styles.headerArabic}>دعاء رب العباد</Text>
            <Text style={styles.headerSubtitle}>
              Prayer to the Lord of All Servants
            </Text>
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
            colors={['#673AB720', '#512DA810']}
            style={styles.introGradient}
          >
            <Ionicons name="sparkles" size={24} color="#673AB7" />
            <View style={styles.introTextContainer}>
              <Text style={styles.introTitle}>About This Dua</Text>
              <Text style={styles.introText}>
                Dua Rabil Ibadi is a beautiful supplication that acknowledges 
                Allah as the Lord of all servants. It is a prayer of humility, 
                seeking forgiveness, and recognizing Allah's sovereignty over 
                all creation.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Verses */}
        {duaVerses.map((verse, index) => renderDuaVerse(verse, index))}

        {/* Benefits Section */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Benefits of This Dua</Text>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="shield-checkmark" size={18} color="#673AB7" />
            </View>
            <Text style={styles.benefitText}>Protection from divine wrath</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="heart" size={18} color="#673AB7" />
            </View>
            <Text style={styles.benefitText}>Forgiveness of sins</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="star" size={18} color="#673AB7" />
            </View>
            <Text style={styles.benefitText}>Drawing closer to Allah</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="sunny" size={18} color="#673AB7" />
            </View>
            <Text style={styles.benefitText}>Inner peace and tranquility</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerArabic}>
            رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ العَلِيمُ
          </Text>
          <Text style={styles.footerText}>
            Our Lord, accept from us. Indeed, You are the Hearing, the Knowing.
          </Text>
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
    backgroundColor: '#673AB7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  introCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  introGradient: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#673AB730',
  },
  introTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#673AB7',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  verseCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#673AB720',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#673AB7',
  },
  copyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#673AB715',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyBtnActive: {
    backgroundColor: '#673AB7',
  },
  arabicText: {
    fontSize: 26,
    lineHeight: 48,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  transliterationBox: {
    backgroundColor: '#673AB708',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  transliterationText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    fontStyle: 'italic',
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
  },
  benefitsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#673AB715',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerArabic: {
    fontSize: 18,
    color: '#673AB7',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DuaRabilIbadiScreen;

