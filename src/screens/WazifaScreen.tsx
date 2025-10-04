import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import IslamicBackground from '../components/IslamicBackground';

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
  targetCount 
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
      <Text style={styles.arabicText}>{arabic}</Text>
      <Text style={styles.transliterationText}>{transliteration}</Text>
      <Text style={styles.englishText}>{english}</Text>
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
      <View style={styles.container}>
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
                <Text style={styles.headerTitle}>Tijaniya Wazifa</Text>
                <Text style={styles.headerSubtitle}>The Unfolding of Wazifa</Text>
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
          />

          {/* Step 2: Suratul Fatiha */}
          <WazifaStepCard
            stepNumber={2}
            title="Suratul Fatiha"
            arabic="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
            transliteration="Bismillahi ar-Rahman ar-Raheem"
            english="Recite Suratul Fatiha"
            count={1}
            onIncrement={() => {}}
            onDecrement={() => {}}
            onReset={() => {}}
            isCompleted={true}
            targetCount={1}
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
                اللّهُمَّ أَنْتَ الأَوَّلُ فَلَيْسَ قَبْلَكَ شَيئٌ وَأَنْتَ الآخِرُ فَلَيْسَ بَعْدَكَ شَيئُ وَأَنْتَ الظَّاهِرُ فَلَيسَ فَوْقَكَ شَيئٌ وَأَنتَ البَاطِنُ فَلَيسَ دُونَكَ شَيئٌ فَكُنْ لَنَا يَا أَوَّلُ يا آخرُ ياَظَاهِرُ  يا بَاطِنُ وَليًا وَنَصِيرَا أَنْتَ مَولَانَا فَنِعْمَ الْمَولَى وَنِعْمَ النَّصِيرُ الَّلهُمَّ إِنَا نَسْأَلُكَ بِفَاتِحِيَّةِ الْفَاتِحِ الْفَتْحَ التَّامَّ وَبِخَاتِمِيَّةِ الْخَاتِمِ حُسْنَ الْخِتَامِ الَّلهُمَ إِنَا نَسْأَلُكَ مِنَ الخَيرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ مَاعَلِمْنَا مِنْهُ وَمَالَم نَعْلَمْ وَنَعُوذُ بِكَ مِنَ شّرِ كلّهِ عاجلِهِ  وآجِالِه مَا عَلِمْنَا مِنْهُ وَمَالَمْ نَعٌلَمْ الَّلهُمَّ إِِنَّا نَسْأَلُكَ الْجَنَةَ وَمَاقرّبَ إلَيْهَا مِنْ قَولٍ وَعمَلٍ وَنَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْها مِنْ قَولٍ وَعَمَلٍ الَّلهُمَّ إِنَّا نَسْأَلُكَ الْعَفْو  ً وَالْعَافِيَةَ وَالْمُعَافَاةَ الدَّائِمَةَ فِي الدِّينِ وَالدُّنْيَا وَالْأٓخِرَة ِالَّلهُمَّ إِنَّا نَسْأَلُكَ رِضَاكَ وَرِضَى نَبِيِّكََ وَرِضَى الْأَشْيَاخِ وَرِضَى الْوَالِدَيْنِ الَّلهُمَّ اجْعَلْ مَا نُرِيدُ فِيمَا تُرِيْدُ الَّلهُمَّ اجْعَلْ فِي اخْتِيَارِكَ إخْتيارَناَ وَلَا تَجْعَلْ إِلَّا إِلَيْكَ اضْطِرَارَناَ
              </Text>
              <Text style={styles.duaTranslation}>
                "O Allah, You are the First, so there is nothing before You, and You are the Last, so there is nothing after You, and You are the Manifest, so there is nothing above You, and You are the Hidden, so there is nothing below You. So be for us, O First, O Last, O Manifest, O Hidden, a guardian and helper. You are our Master, so what an excellent Master and what an excellent Helper. O Allah, we ask You by the opening of the Opener, the complete opening, and by the sealing of the Sealer, the good sealing. O Allah, we ask You for all good, immediate and delayed, what we know of it and what we do not know, and we seek refuge in You from all evil, immediate and delayed, what we know of it and what we do not know. O Allah, we ask You for Paradise and what brings us closer to it of word and deed, and we seek refuge in You from the Fire and what brings us closer to it of word and deed. O Allah, we ask You for forgiveness, well-being, and permanent protection in religion, this world, and the Hereafter. O Allah, we ask You for Your pleasure and the pleasure of Your Prophet and the pleasure of the shaykhs and the pleasure of the parents. O Allah, make what we want in what You want. O Allah, make our choice in Your choice and do not make our need except to You."
              </Text>
            </ScrollView>
          </View>
        </Modal>
      </View>
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
    fontSize: 18,
    color: '#2C3E50',
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 28,
    fontFamily: 'System',
    fontWeight: '600',
  },
  transliterationText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 24,
  },
  englishText: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
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
    backgroundColor: colors.mintSurface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.accentGreen,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  completionText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 24,
  },
  completionTranslation: {
    fontSize: 14,
    color: colors.textSecondary,
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
  duaTranslation: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
