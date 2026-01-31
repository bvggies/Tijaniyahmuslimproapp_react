import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import IslamicBackground from '../components/IslamicBackground';
import { useLanguage } from '../contexts/LanguageContext';
import { useFadeIn } from '../hooks/useAnimations';

// Digital Counter Component
const DigitalCounter = ({ count, onIncrement, onDecrement, onReset }: {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}) => (
  <View style={styles.counterContainer}>
    <TouchableOpacity style={styles.counterButton} onPress={onDecrement}>
      <Ionicons name="remove" size={24} color="#FFFFFF" />
    </TouchableOpacity>
    <View style={styles.counterDisplay}>
      <Text style={styles.counterText}>{count}</Text>
    </View>
    <TouchableOpacity style={styles.counterButton} onPress={onIncrement}>
      <Ionicons name="add" size={24} color="#FFFFFF" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.resetButton} onPress={onReset}>
      <Ionicons name="refresh" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  </View>
);

// Wazifa Step Card Component
const WazifaStepCard = ({ 
  stepNumber, 
  title, 
  arabic, 
  transliteration, 
  english, 
  count, 
  onIncrement, 
  onDecrement, 
  onReset,
  isCompleted,
  targetCount,
  useWhiteYellow = false
}: {
  stepNumber: number;
  title: string;
  arabic: string;
  transliteration: string;
  english: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  isCompleted: boolean;
  targetCount: number;
  useWhiteYellow?: boolean;
}) => (
  <View style={[styles.stepCard, isCompleted && styles.completedStepCard]}>
    <View style={styles.stepHeader}>
      <View style={[styles.stepNumber, isCompleted && styles.completedStepNumber]}>
        <Text style={styles.stepNumberText}>{stepNumber}</Text>
      </View>
      <View style={styles.stepTitleContainer}>
        <Text style={[styles.stepTitle, isCompleted && styles.completedText]}>{title}</Text>
        <Text style={styles.stepProgress}>{count}/{targetCount}</Text>
      </View>
      {isCompleted && (
        <View style={styles.completedIcon}>
          <Ionicons name="checkmark-circle" size={24} color={colors.accentTeal} />
        </View>
      )}
    </View>
    
    <View style={styles.stepContent}>
      <Text style={[styles.arabicText, useWhiteYellow && styles.arabicTextWhite]}>{arabic}</Text>
      <Text style={styles.transliterationText}>{transliteration}</Text>
      <Text style={[styles.englishText, useWhiteYellow && styles.englishTextYellow]}>{english}</Text>
    </View>
    
    <DigitalCounter
      count={count}
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      onReset={onReset}
    />
  </View>
);

export default function WazifaScreen() {
  const opacity = useFadeIn({ duration: 400 });
  const { t } = useLanguage();
  const [istighfarCount, setIstighfarCount] = useState(0);
  const [salatilFathiCount, setSalatilFathiCount] = useState(0);
  const [laIlahaCount, setLaIlahaCount] = useState(0);
  const [jawharatulKamalCount, setJawharatulKamalCount] = useState(0);
  const [showClosingDua, setShowClosingDua] = useState(false);

  const resetAllCounters = () => {
    setIstighfarCount(0);
    setSalatilFathiCount(0);
    setLaIlahaCount(0);
    setJawharatulKamalCount(0);
  };

  const isStepCompleted = (count: number, target: number) => count >= target;

  return (
    <IslamicBackground opacity={1.0}>
      <Animated.View style={[styles.container, { opacity }]}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <LinearGradient
            colors={[colors.accentTeal, colors.accentGreen]}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Ionicons name="book" size={32} color={colors.accentYellow} />
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>{t('wazifa.title')}</Text>
                <Text style={styles.headerSubtitle}>{t('wazifa.subtitle')}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Introduction */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>The Wazifa Unfolding</Text>
            <Text style={styles.introText}>
              The Wazifa is to be performed once or twice a day. Follow the steps below in order, 
              using the counters to track your progress.
            </Text>
          </View>

          {/* Niyyah (Intention) */}
          <View style={styles.niyyahCard}>
            <Text style={styles.niyyahTitle}>Niyyah (Intention)</Text>
            <Text style={styles.niyyahArabic}>
              اللهم إني نويت أن أتقرب إليك بقرائة الوظيفة التجانية اللازمة في الطريقة التجانية إقتداء بسيد أحمد التجاني رضي اللّٰه عنه تعبدا للّه تعالى
            </Text>
            <Text style={styles.niyyahTransliteration}>
              Allahumma nnii nawaytu an ataqarraba ilayka bi qiraa-atil wazeefati Tijaniyyah allaazimati fit-țareeqati Tijaniyyah iqtidaa-a bisayyidi Ahmad at-Tijani Radiyallahu anhu ta'abbudan lillahi ta'aalaa.
            </Text>
            <Text style={styles.niyyahEnglish}>
              O Allah, I intend to draw closer to You by reciting the obligatory Tijani Wazifa in the Tijani Tariqa, following our Master Ahmad al-Tijani, may Allah be pleased with him, as an act of devotion to Allah the Almighty.
            </Text>
            <Text style={styles.niyyahBreakdown}>
              Breakdown: "O Allah, I intend" → "to draw closer to You" → "by reciting the Wazifa" → "in the Tijani Tariqa" → "following our Master Ahmad al-Tijani, may Allah be pleased with him" → "as an act of devotion to Allah the Almighty"
            </Text>
          </View>

          {/* Step 1: Auzubillah */}
          <WazifaStepCard
            stepNumber={1}
            title="Seeking Refuge"
            arabic="أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ"
            transliteration="Auzubil-lahi minach-chaytani-rajim"
            english="I take refuge in God against the cursed satan"
            count={1}
            onIncrement={() => {}}
            onDecrement={() => {}}
            onReset={() => {}}
            isCompleted={true}
            targetCount={1}
            useWhiteYellow={true}
          />

          {/* Step 2: Suratul Fatiha */}
          <WazifaStepCard
            stepNumber={2}
            title="Suratul Fatiha"
            arabic="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ (1) الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (2) الرَّحْمَٰنِ الرَّحِيمِ (3) مَالِكِ يَوْمِ الدِّينِ (4) إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (5) اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (6) صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ (7)"
            transliteration="Bismillahi ar-Rahman ar-Raheem (1) Alhamdulillahi rabbil alameen (2) Ar-Rahman ar-Raheem (3) Maliki yawmid-deen (4) Iyyaka na'budu wa iyyaka nasta'een (5) Ihdinas-siratal mustaqeem (6) Siratal-lazeena an'amta 'alayhim ghayril maghdoobi 'alayhim wa lad-dalleen (7)"
            english="In the name of Allah, the Entirely Merciful, the Especially Merciful. (1) [All] praise is [due] to Allah, Lord of the worlds. (2) The Entirely Merciful, the Especially Merciful. (3) Sovereign of the Day of Recompense. (4) It is You we worship and You we ask for help. (5) Guide us to the straight path. (6) The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray. (7)"
            count={1}
            onIncrement={() => {}}
            onDecrement={() => {}}
            onReset={() => {}}
            isCompleted={true}
            targetCount={1}
            useWhiteYellow={true}
          />

          {/* Step 3: Istighfar */}
          <WazifaStepCard
            stepNumber={3}
            title="Istighfar (30 times)"
            arabic="أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ"
            transliteration="Astaghfirullah Al 'Aziim alazii laa ilaaha illaa Huwal-Hayyul-Qayyoum"
            english="I ask forgiveness from ALLAH, The Great One, no God exists but Him, The Ever Living One, The Self Existing One"
            count={istighfarCount}
            onIncrement={() => setIstighfarCount(prev => Math.min(prev + 1, 30))}
            onDecrement={() => setIstighfarCount(prev => Math.max(prev - 1, 0))}
            onReset={() => setIstighfarCount(0)}
            isCompleted={isStepCompleted(istighfarCount, 30)}
            targetCount={30}
          />

          {/* Step 4: Salatil Fathi */}
          <WazifaStepCard
            stepNumber={4}
            title="Salatil Fathi (50 times)"
            arabic="اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَىٰ صِرَاطِكَ الْمُسْتَقِيمِ"
            transliteration="Allahumma salli 'ala Sayyidina Muhammadini l-Fatihi lima ughliq(a), wa l-khatimi lima sabaq(a), nasiri l-haqqi bi l-haqq(i), wa l-hadi ila siratika l-mustaqim(i)"
            english="O Allah, send prayers upon our master Muhammad, the opener of what was closed, and the seal of what had preceded, the helper of the truth by the Truth, and the guide to Your straight path"
            count={salatilFathiCount}
            onIncrement={() => setSalatilFathiCount(prev => Math.min(prev + 1, 50))}
            onDecrement={() => setSalatilFathiCount(prev => Math.max(prev - 1, 0))}
            onReset={() => setSalatilFathiCount(0)}
            isCompleted={isStepCompleted(salatilFathiCount, 50)}
            targetCount={50}
          />

          {/* After 50th Salatil Fathi */}
          {isStepCompleted(salatilFathiCount, 50) && (
            <View style={styles.completionCard}>
              <Text style={styles.completionTitle}>After the 50th Salatil Fathi:</Text>
              <Text style={styles.completionText}>
                سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ وَسَلَامٌ عَلَى الْمُرْسَلِينَ وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
              </Text>
              <Text style={styles.completionTranslation}>
                "Glory be to your Lord, the Lord of Honor, far removed from what they describe. 
                And peace be upon the messengers. And all praise is due to Allah, the Lord of the worlds."
              </Text>
            </View>
          )}

          {/* Step 5: La Ilaha Illallah */}
          <WazifaStepCard
            stepNumber={5}
            title="La Ilaha Illallah (100 times)"
            arabic="لَا إِلَٰهَ إِلَّا اللَّهُ"
            transliteration="La ilaha illal-lah"
            english="There is no god but Allah"
            count={laIlahaCount}
            onIncrement={() => setLaIlahaCount(prev => Math.min(prev + 1, 100))}
            onDecrement={() => setLaIlahaCount(prev => Math.max(prev - 1, 0))}
            onReset={() => setLaIlahaCount(0)}
            isCompleted={isStepCompleted(laIlahaCount, 100)}
            targetCount={100}
          />

          {/* After 100th La Ilaha */}
          {isStepCompleted(laIlahaCount, 100) && (
            <View style={styles.completionCard}>
              <Text style={styles.completionTitle}>After the 100th La Ilaha Illallah:</Text>
              <Text style={styles.completionText}>
                سَيِّدُنَا مُحَمَّدٌ رَسُولُ اللَّهِ عَلَيْهِ سَلَامُ اللَّهِ
              </Text>
              <Text style={styles.completionTranslation}>
                "Our master Muhammad is the Messenger of Allah, upon him be the peace of Allah"
              </Text>
            </View>
          )}

          {/* Step 6: Jawharatul Kamal */}
          <WazifaStepCard
            stepNumber={6}
            title="Jawharatul Kamal (12 times)"
            arabic="اَللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ عَيْنِ الرَّحْمَةِ الرَّبَّانِيَّةِ وَالْيَاقُوتَةِ الْمُتَحَقِّقَةِ الْحَائِطَةِ بِمَرْكَزِ الْفُهُومِ والْمَعَانِي"
            transliteration="Allahumma salli wa sallim 'ala 'ayni r-rahmati r-rabbaniyyati wa l-yaqutati l-mutahaqqiqati l-ha'itati bi markazi l-fuhumi wa l-ma'ani"
            english="O Allah, send prayers and peace upon the eye of Divine Mercy and the realized ruby that encompasses the center of understandings and meanings"
            count={jawharatulKamalCount}
            onIncrement={() => setJawharatulKamalCount(prev => Math.min(prev + 1, 12))}
            onDecrement={() => setJawharatulKamalCount(prev => Math.max(prev - 1, 0))}
            onReset={() => setJawharatulKamalCount(0)}
            isCompleted={isStepCompleted(jawharatulKamalCount, 12)}
            targetCount={12}
          />

          {/* After 12th Jawharatul Kamal */}
          {isStepCompleted(jawharatulKamalCount, 12) && (
            <View style={styles.completionCard}>
              <Text style={styles.completionTitle}>After the 12th Jawharatul Kamal:</Text>
              <Text style={styles.completionText}>
                إِنَّ اللَّهَ وَمَلَيِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ يَأَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا
              </Text>
              <Text style={styles.completionTranslation}>
                "Indeed, Allah and His angels send blessings upon the Prophet. O you who believe, 
                send blessings upon him and greet him with peace."
              </Text>
            </View>
          )}

          {/* Closing Dua Button */}
          {isStepCompleted(jawharatulKamalCount, 12) && (
            <TouchableOpacity 
              style={styles.closingDuaButton}
              onPress={() => setShowClosingDua(true)}
            >
              <LinearGradient
                colors={[colors.accentTeal, colors.accentGreen]}
                style={styles.closingDuaGradient}
              >
                <Ionicons name="book" size={24} color="#FFFFFF" />
                <Text style={styles.closingDuaText}>Read Closing Dua</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Reset All Button */}
          <TouchableOpacity style={styles.resetAllButton} onPress={resetAllCounters}>
            <Ionicons name="refresh" size={20} color={colors.accentTeal} />
            <Text style={styles.resetAllText}>Reset All Counters</Text>
          </TouchableOpacity>

          {/* Time Information */}
          <View style={styles.timeInfoCard}>
            <Text style={styles.timeInfoTitle}>Time of Wazifa</Text>
            <Text style={styles.timeInfoText}>
              • The Wazifa is to be performed once or twice a day{'\n'}
              • If performed twice daily: same time as Lazim{'\n'}
              • If performed once daily: from 'Asr Prayer to 'Asr Prayer of next day{'\n'}
              • Period of necessity extends to Maghrib Prayer of next day
            </Text>
          </View>

          {/* Women's Guidelines */}
          <View style={styles.guidelinesCard}>
            <Text style={styles.guidelinesTitle}>Guidelines for Women</Text>
            <Text style={styles.guidelinesText}>
              • Women can attend the Wazeefa{'\n'}
              • Should not occupy the same room as men{'\n'}
              • If only one room available, sit at the back in discrete section{'\n'}
              • Must not recite aloud (as for the five daily Prayers)
            </Text>
          </View>
        </ScrollView>

        {/* Closing Dua Modal */}
        <Modal
          visible={showClosingDua}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowClosingDua(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Closing Dua</Text>
              <TouchableOpacity onPress={() => setShowClosingDua(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.duaText}>
                دعاء ختم الوظيفة 

اللّهُمَّ أَنْتَ الأَوَّلُ فَلَيْسَ قَبْلَكَ شَيئٌ وَأَنْتَ الآخِرُ فَلَيْسَ بَعْدَكَ شَيئُ وَأَنْتَ الظَّاهِرُ فَلَيسَ فَوْقَكَ شَيئٌ وَأَنتَ البَاطِنُ فَلَيسَ دُونَكَ شَيئٌ فَكُنْ لَنَا يَا أَوَّلُ يا آخرُ ياَظَاهِرُ  يا بَاطِنُ وَليًا وَنَصِيرَا أَنْتَ مَولَانَا فَنِعْمَ الْمَولَى وَنِعْمَ النَّصِيرُ الَّلهُمَّ إِنَا نَسْأَلُكَ بِفَاتِحِيَّةِ الْفَاتِحِ الْفَتْحَ التَّامَّ وَبِخَاتِمِيَّةِ الْخَاتِمِ حُسْنَ الْخِتَامِ الَّلهُمَ إِنَا نَسْأَلُكَ مِنَ الخَيرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ مَاعَلِمْنَا مِنْهُ وَمَالَم نَعْلَمْ وَنَعُوذُ بِكَ مِنَ شّرِ كلّهِ عاجلِهِ  وآجِالِه مَا عَلِمْنَا مِنْهُ وَمَالَمْ نَعٌلَمْ الَّلهُمَّ إِِنَّا نَسْأَلُكَ الْجَنَةَ وَمَاقرّبَ إلَيْهَا مِنْ قَولٍ وَعمَلٍ وَنَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْها مِنْ قَولٍ وَعَمَلٍ الَّلهُمَّ إِنَّا نَسْأَلُكَ الْعَفْو  ً وَالْعَافِيَةَ وَالْمُعَافَاةَ الدَّائِمَةَ فِي الدِّينِ وَالدُّنْيَا وَالْأٓخِرَة ِالَّلهُمَّ إِنَّا نَسْأَلُكَ رِضَاكَ وَرِضَى نَبِيِّكََ وَرِضَى الْأَشْيَاخِ وَرِضَى الْوَالِدَيْنِ الَّلهُمَّ اجْعَلْ مَا نُرِيدُ فِيمَا تُرِيْدُ الَّلهُمَّ اجْعَلْ فِي اخْتِيَارِكَ إخْتيارَناَ وَلَا تَجْعَلْ إِلَّا إِلَيْكَ اضْطِرَارَناَ
يَاربّنا يَاخَالِقَ الْعَوَالِمِ - حُلْ بَيْنَنَا وَبَيْنَ كُلِّ ظَالِمِ
واجْزِ لِكُلِّ مَنْ إِلَينَا أَحْسَنَا - وَجَازِهِ عَنَّا الجَزَاءَ الْأَحْسَنَا
الَّلهُمَّ ارْفَعْ عَنَّا الْجَهْدَ وَالْجُوعَ وَالْعُرْيَ وَاكْشِفْ عَنَّا مِنَ الْبَلَاءِ مَا لَايَكْشِفُهُ غَيرُكَ رَبَّنَا ءَاتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ رَبَّنَا لَا تُؤاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأنَا رَبَّنَا وَلَا تَحْمِل عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الّذِينَ مِنْ قَبْلِنَا رَبَّنَا وَلَا تُحَمِلنَا مَالَاطَاقَةَ لَنَا بِهِ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا أَنْتَ مَولَانَا فَانْصُرنَا عَلَى الْقَومِ الكَافِرِينَ رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِِيمَانِ أَنْ آمِنُوا بِرَبِّكُمْ فَآمَنَّا رَبَّنَا فَاغْفِرْلَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِئَاتِنَا وَتَوَفَنَا مَعَ الْأَبْرَارِ رَبَّنَا وَآتِنَا مَاوَعَدْتَنَا عَلَى رُسُلِكَ وَلَا تُخْزِنَا يَومَ الْقِيَامَةِ إِنَّكَ لَا تُخٌلِفً الْمِيْعَادَ رَبَّنٰا ظَلَمْنٰا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَ مِنَ الْخَاسِرِيْنَ رَبَّنَا ءَاتِنَا مِنْ لَدُنْكَ رَحْمَةً وَ هَيِئْ لَنَا مِنْ أَمْرِنَا رَشَدَا رَبَنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِيَاتِنَا قُرةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِيْنَ إِِمَامَا الَّلهُمَّ اغْفِرْ لِحَيِنَا وَمَيِّتِنَا وَكَبِيرِنَا وَصَغِيْرِنَا وَذَكَرِنَا وَأُنٌثَانَا وَحُرِنَا وَعَبْدِنَا وحَاضِرِنَا وَغَائِبِنَا وَطَائِعِناَ وَعَاصِيْنَا
              </Text>
              
              <Text style={styles.duaTransliteration}>
                TRANSLITERATION OF THE DU'A AFTER WAZIFAH

Allâhumma antal awwalu fa laysa ablaka chay'un wa antal âkhiru fa laysa ba'daka chay'un wa antaz-zâhiru fa laysa fayqaka chay'un wa antal bâtinu fa laysa dünaka chay un.
Fakun lana ya awwalu ya âqiru ya zâhiru ya bâtinu waliyyan wan-naçiran anta waliyuna fa ni'mal mawlâ wan-ni'man-naçiru.
Allâhumma innâ nas'aluka bifâtihiyyatil fâtihi fathat-tâma wa bi khâtimiyatil khâtimi husnal khitâmi.
Allâhumma innâ nas'alukal-khayra kullahû 'âjilahů wa âjilahû ma 'alimnâ minhu wa mâ lam na'lam,
wa na'üdhu bika minach-charri kullihi 'ajilihi wa âjilihî ma 'alimnâ minhu wa mâ lam na'lam.
Allâhumma innâ nas'alukal jannata wa mâ qarraba ilayha min qawlin wa 'amalin,
wa na'üdhu bika minan-nâri wa mâ qarraba ilayha min qawlin wa 'amalin.Allâhumma innâ nas'alukal-'afwa wal 'âfiyata wal mu'âfâtad-dâ'imata fid-dîni wad-dunya wal-âkhirati.
Allâhumma innâ nas'aluka ridâka wa ridâ nabiyyika sayyidina Muhammadin çallal-Lâhu 'alayhi was-sallam, wa ridâl-achyâkhi wa ridâl-walidayni.
Allâhumma i'al mâ nuhibbu fi mâ tuhibbu wa tardâ.
Allâhumma ij'al fi ikhtiyârika ikhtiyarana wa lâ taj'al illa ilayka idtirarana
Yâ rabbana yâ khâliqal-awâlimi hul baynana wa bayna kulli zalimi
Wajzi li kulli man ilaynâ ahsana wa jâzîhi 'annâ jazâ'al ahsanâ
Allâhumma irfa''annâl-jahda wal ju'a wal-'urya wakchif 'annâ minal balấ'i ma lâ yakchifuha ghayruka.
Allâhumma farrij 'an ummati sayyidin Muhammadin çallal-Lâhu 'alayhi was-sallam. Rabban âtina fid-dunya hasanatan wa fil-âkhirati hasanatan waqina 'adhâban-nâri.Rabbana la tuwakhidhna in nasina aw akhta'nâ, rabbânâ wa lâ tahmil 'alayna içran kama hamaltahů 'alal-lazîna min qablina,
rabbanâ wa lâ tuhammilnâ mâ la taqata lanâ bihi;
wa'tu 'annâ waghfir lanâ warhamnâ anta mawlânâ fançurnâ'alal qawmil kâfirina.
Rabbanâ lâ tuzigh qulûbanâ ba'da idh hadaytana wa hab lana min ladunka rahmatan innaka antal wahhab.
Rabban innana sami'nâ munâdiyan yunâdi lil imâni an âminü bi rabbikum fa âmanna.
Rabbanâ faghfir lana dhunûbanâ wa kafir 'anna sayyi'âtina wa tawaffanâ ma'al abrâri.
Rabbanâ wa âtinâ mâ wa'adtan 'alâ rusulika wa lâ tukhzin waymal qiyâmati innâka la tukhliful mi ada.
Rabbanâ zalamnâ anfusanâ wa in lam taghfir lan wa tarhamnâ la nakünana minal-khâsirina.abbanâ wa âtinâ mâ wa'adtanâ 'alâ rusulika wa lâ tukhzinâ waymal qiyâmati innâka la tukhliful mi'âda.
Rabbanâ zalamnâ anfusanâ wa in lam taghfir lanâ wa tarhamnâ la nakûnana minal-khâsirîna.
Rabbanâ âtinâ min ladunka rahmatan wa hayyi' lanâ min amrinâ rachadan.
Rabbanâ hab lanâ min azwâjina wa dhurriyyâtinâ qurrata a'yunin waj'alna lil muttaqina imâman.
Allâhumma ighfir lihayyinâ wa mayyitinâ, wa kabîrinâ waç-çaghirinâ, wa dhakarinâ wa unsânâ,
wa hurinâ wa 'abdinâ, wa hâdirinâ wa ghibinâ, wa tấ'i'inâ wa 'âsînâ. Amiin
              </Text>
              
              <Text style={styles.duaTranslation}>
                ENGLISH TRANSLATION (OF PRAYER (DU'AA) AFTER WAZIFAH)

O, Allah! You are the First. There is nothing before You.
And You are the Last. There is nothing after You.
You are the Manifest. There is nothing above You.
And You are the Hidden. There is nothing below You.

Then be for us, o, First; o, Last; o, Apparent o, Hidden! a helping guardian.
You are our Guardian and our Patron. And how excellent a Patron. How excellent a Helper.

O, Allah! We ask You by the opening of the Opener a complete opening!
And we ask You by the sealing of the Seal a good ending.

O, Allah! We ask You for all good, the immediate and the delayed, that which we know and that which we do not know.
And we seek refuge in You from all evil, the immediate and the delayed, that which we know and that which we do not know.

O, Allah! We ask You for Paradise and words and deeds that draw one close to it.
And we seek refuge in You from the Fire and words and deeds that draw one close to it. O, Allah!

We ask You for perpetual pardon, well-being and freedom from affliction in the religion, this world and the Hereafter. 

O, Allah! We ask You for Your satisfaction, the satisfaction of Your Prophet, the satisfaction of our Shaykhs and the satisfaction of our parents.
O, Allah! Cause that which we love to be among that which You love.
O, Allah! Cause our choice to be among that which You choose. And do not make our destituteness for anyone except You.

Our Lord! O, Creator of the Worlds, ** Separate between us and every oppressor,

And reward on our behalf all those who treat us well, ** And give them on our behalf the best of rewards.

O, Allah! Lift from us all strife, hunger and nakedness. And remove from us those afflictions that only You can remove.

{"Our Lord! Give us good in this world and good in the Hereafter. And Save us from the punishment of the Fire."} Q2:201

{"Our Lord! Do not seize us if we forget or commit mistakes. Our Lord! Do not place upon us a burden like the burdens You placed upon those who went before us. Our Lord! And do not place upon us a burden greater than we can bear. Pardon us, forgive us and have mercy on us. You are our Patron. So help us against the disbelieving people."} Q2:286  

{"Our Lord! Do not cause our hearts to deviate after You have guided us. And grant us from Yourself a mercy. Indeed, You are the One who Grants. Our Lord! We have heard a call calling to faith: \"Believe in your Lord!\" And we have believed, o, our Lord! So forgive us our sins and cover our faults. And cause us to die among the righteous."} Q3:193 

{"And, o, our Lord, grant us what You promised us through Your Messengers. And do not humiliate us on the Day of Judgement. Indeed, You never break Your promise."} Q3:194

{"Our Lord! We have wrong ourselves and if You do not forgive us or have mercy on us, we will be among the losers."} Q7:23

{"Our Lord! Grant us from Yourself a mercy. And prepare for us in our affair a good outcome"} Q18:10

{"Our Lord! Grant us make our wives and children the coolness of our eyes and make us leaders of the God-fearing"} Q25:74 

O, Allah! Forgive those of us who are living and those passed away, the elders and the young, our males and females, those of us present and those who are absent, those who are free and those who are slaves, the obedient and the disobedient.

O, Allah! Bless our Master Muhammad, the Opener of what was closed, the Seal of what went before, the Helper of the Truth by the Truth and the Guide to Your Straight Path, and his family in accordance with his grandeur and immense worth.  

Hallowed is your Lord, the Lord of Might, above that which they attribute to Him. Peace be upon the Messengers. And all praise is due to Allah, Lord of All the Worlds.


Ameen thumma Ameen!
              </Text>
            </ScrollView>
          </View>
        </Modal>
      </Animated.View>
    </IslamicBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  introCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  stepCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  completedStepCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: colors.accentTeal,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  completedStepNumber: {
    backgroundColor: colors.accentGreen,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  stepProgress: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  completedText: {
    color: colors.accentTeal,
  },
  completedIcon: {
    marginLeft: 8,
  },
  stepContent: {
    marginBottom: 20,
  },
  arabicText: {
    fontSize: 20,
    color: '#1a365d',
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 32,
    fontFamily: 'System',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  transliterationText: {
    fontSize: 16,
    color: '#4a5568',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 24,
    fontWeight: '500',
  },
  englishText: {
    fontSize: 16,
    color: '#B8860B',
    lineHeight: 24,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentTeal,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterDisplay: {
    minWidth: 60,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resetButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  completionCard: {
    backgroundColor: '#FFF8E1', // Warm cream background
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3', // Blue accent
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100', // Vibrant orange for title
    marginBottom: 12,
  },
  completionText: {
    fontSize: 16,
    color: '#2E7D32', // Rich green for Arabic text
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 24,
  },
  completionTranslation: {
    fontSize: 14,
    color: '#7B1FA2', // Deep purple for translation
    fontStyle: 'italic',
    lineHeight: 20,
  },
  closingDuaButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closingDuaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  closingDuaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resetAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.accentTeal,
  },
  resetAllText: {
    color: colors.accentTeal,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  timeInfoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.accentYellow,
  },
  timeInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  timeInfoText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  guidelinesCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.accentTeal,
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  guidelinesText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  duaText: {
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: 32,
    marginBottom: 20,
    fontFamily: 'System',
  },
  duaTransliteration: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: 'italic',
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    padding: 16,
    borderRadius: 8,
  },
  duaTranslation: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  // Conditional styles for first two cards
  arabicTextWhite: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  englishTextYellow: {
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Niyyah styles
  niyyahCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.accentYellow,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  niyyahTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accentYellow,
    marginBottom: 16,
    textAlign: 'center',
  },
  niyyahArabic: {
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: 32,
    marginBottom: 12,
    fontFamily: 'System',
  },
  niyyahTransliteration: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  niyyahEnglish: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  niyyahBreakdown: {
    fontSize: 14,
    color: colors.accentTeal,
    lineHeight: 20,
    fontStyle: 'italic',
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
});
