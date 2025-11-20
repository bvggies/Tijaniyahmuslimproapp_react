import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import IslamicBackground from '../components/IslamicBackground';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

const TijaniyaLazimScreen: React.FC = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [counter, setCounter] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStep, setSelectedStep] = useState(0);
  const [lazimType, setLazimType] = useState<'morning' | 'evening' | null>(null);

  const lazimSteps = [
    {
      id: 0,
      title: "Niyyah (Intention)",
      arabic: "اللهم إني نويت أن أتقرب إليك بقرائة ورد الصباح اللازم في الطريقة التجانية إقتداء بسيد أحمد التجاني رضي اللّٰه عنه تعبدا لله تعالى",
      transliteration: "Allahumma innii nawaytu an ataqarraba ilayka bi qiraa-ati wirdis-sabaahi allaazim fit-țareeqati Tijaniyyah iqtidaa-a bisayyidi Ahmad at-Tijani Radiyallahu anhu ta'abbudan lillahi ta'aalaa.",
      translation: "O Allah, I intend to draw closer to You by reciting the obligatory morning Lazim in the Tijani Tariqa, following our Master Ahmad al-Tijani, may Allah be pleased with him, as an act of devotion to Allah the Almighty.",
      instruction: "Choose Morning or Evening Lazim below, then recite the appropriate intention.",
      color: colors.accentYellow,
      icon: "heart",
      details: "This is the niyyah (intention) that must be recited before beginning the Lazim. Choose whether you're performing the Morning Lazim or Evening Lazim, then recite the appropriate intention.",
      morningArabic: "اللهم إني نويت أن أتقرب إليك بقرائة ورد الصباح اللازم في الطريقة التجانية إقتداء بسيد أحمد التجاني رضي اللّٰه عنه تعبدا لله تعالى",
      morningTransliteration: "Allahumma innii nawaytu an ataqarraba ilayka bi qiraa-ati wirdis-sabaahi allaazim fit-țareeqati Tijaniyyah iqtidaa-a bisayyidi Ahmad at-Tijani Radiyallahu anhu ta'abbudan lillahi ta'aalaa.",
      morningTranslation: "O Allah, I intend to draw closer to You by reciting the obligatory morning Lazim in the Tijani Tariqa, following our Master Ahmad al-Tijani, may Allah be pleased with him, as an act of devotion to Allah the Almighty.",
      eveningArabic: "اللهم إني نويت أن أتقرب إليك بقرائة ورد المساء اللازم في الطريقة التجانية إقتداء بسيد أحمد التجاني رضي اللّٰه عنه تعبدا لله تعالى",
      eveningTransliteration: "Allahumma innii nawaytu an ataqarraba ilayka bi qiraa-ati wirdil-masaa-i allaazim fit-tareeqati Tijaniyyah iqtidaa-a bisayyidi Ahmad at-Tijani Radiyallahu anhu ta'abbudan lillahi ta'aalaa.",
      eveningTranslation: "O Allah, I intend to draw closer to You by reciting the obligatory evening Lazim in the Tijani Tariqa, following our Master Ahmad al-Tijani, may Allah be pleased with him, as an act of devotion to Allah the Almighty."
    },
    {
      id: 1,
      title: "Opening Supplication",
      arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      transliteration: "A'Uzubillahi minashaytani -rajim",
      translation: "I seek refuge in Allah from Satan, the accursed",
      instruction: "Start with this supplication, then recite Suratul Fatiha until Amin",
      color: colors.primary,
      icon: "shield-checkmark",
      details: "This is the opening supplication that protects you from Satan's influence before beginning the Lazim. After reciting this, proceed to recite the entire Suratul Fatiha (The Opening) until you reach 'Amin'."
    },
    {
      id: 2,
      title: "Seeking Forgiveness",
      arabic: "أَسْتَغْفِرُ اللَّه",
      transliteration: "ASTAGHFIRULLAH",
      translation: "I ask Allah for forgiveness",
      instruction: "Recite this 100 times using the counter",
      color: colors.success,
      icon: "water",
      details: "This is the formula for asking forgiveness. Recite 'ASTAGHFIRULLAH' exactly 100 times. Use the counter to keep track of your recitations. This purifies your heart and soul before proceeding to the next step."
    },
    {
      id: 3,
      title: "Salat upon the Prophet",
      arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ",
      transliteration: "Allahumma şalli 'ala Sayyidina Muhammadini |-Fatihi limă ughliq(a), wa l-khatimi limā sabaq(a), năşiri |-haqqi bi l-haqq(i), wa I-hădi ilă șirațikal-mustaqim(i), wa 'alā alihi haqqa qadrihi wa miqdārihi I-'azim.",
      translation: "O Allah, send prayers upon our master Muhammad, the opener of what was closed, and the seal of what had preceded, the helper of the truth by the Truth, and the guide to Your straight path. May Allah send prayers upon his Family according to his greatness and magnificent rank.",
      instruction: "Recite Salatul Fatihi 100 times (this is the best salat upon the Prophet)",
      color: colors.accentTeal,
      icon: "star",
      details: "This is Salatul Fatihi, the most powerful prayer upon the Prophet (PBUH). Recite this complete formula 100 times. This prayer has immense spiritual benefits and is considered the best form of sending blessings upon the Prophet."
    },
    {
      id: 4,
      title: "Declaration of Faith",
      arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
      transliteration: "La ilaha illal-lah",
      translation: "There is no god but Allah",
      instruction: "Recite this 100 times, then add the completion formula",
      color: colors.warning,
      icon: "diamond",
      details: "This is the declaration of faith (Shahada). Recite 'La ilaha illal-lah' exactly 100 times. After the 100th recitation, you must add the completion formula to properly conclude this step."
    },
    {
      id: 5,
      title: "Completion Formula",
      arabic: "سَيِّدُنَا مُحَمَّدٌ رَسُولُ اللَّهِ عَلَيْهِ السَّلَامُ اللَّهِ",
      transliteration: "Sayyiduna Muhammad rasulullahi alayhi salami-lah",
      translation: "Our master Muhammad is the Messenger of Allah, peace be upon him",
      instruction: "Recite this after the 100th 'La ilaha illal-lah'",
      color: colors.accentGreen,
      icon: "checkmark-done",
      details: "This is the completion formula that must be recited immediately after the 100th 'La ilaha illal-lah'. It completes the declaration of faith and acknowledges the Prophet's status as Allah's messenger."
    },
    {
      id: 6,
      title: "Closing Supplication",
      arabic: "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا",
      transliteration: "Innal laha wa mala-ikatahu yuçalluna 'Alan-nabiyyi ya ayyuhal-lazina amanu çallu 'alayhi wa sallimu taslima",
      translation: "Indeed, Allah and His angels send blessings upon the Prophet. O you who believe, send blessings upon him and greet him with peace.",
      instruction: "Recite this beautiful verse from the Quran",
      color: colors.primary,
      icon: "book",
      details: "This is a verse from the Quran (33:56) that commands believers to send blessings upon the Prophet. It's a beautiful way to conclude the Lazim with Allah's own words."
    },
    {
      id: 7,
      title: "Final Blessings",
      arabic: "صَلَّى اللَّهُ عَلَيْهِ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ تَسْلِيمًا سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ وَسَلَامٌ عَلَى الْمُرْسَلِينَ وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      transliteration: "Çallal-lahu alayhi wa ala alihi wa çahbihi wa sallama tasliman. Subhana rabbika rabbil-izzaati amma yacifuna wa salamun alal-murçalina wal-hamdulil-lahi rabbil Alamin",
      translation: "May Allah send blessings upon him, his family, and his companions, and grant them peace. Glory to your Lord, the Lord of honor, above what they describe. Peace be upon the messengers, and praise be to Allah, Lord of the worlds.",
      instruction: "Conclude with these final blessings and praises",
      color: colors.accentTeal,
      icon: "heart",
      details: "This is the final supplication that concludes the Lazim. It includes blessings upon the Prophet, his family, and companions, followed by glorification of Allah and praise for His messengers."
    }
  ];

  const resetCounter = () => {
    setCounter(0);
  };

  const incrementCounter = () => {
    if (counter < 100) {
      setCounter(counter + 1);
    } else {
      Alert.alert("Complete", "You have reached 100 recitations!");
    }
  };

  const decrementCounter = () => {
    if (counter > 0) {
      setCounter(counter - 1);
    }
  };

  const openStepModal = (stepIndex: number) => {
    setSelectedStep(stepIndex);
    setIsModalVisible(true);
  };

  const renderStepCard = (step: any, index: number) => {
    // Special handling for niyyah step
    if (step.id === 0) {
      return (
        <View key={step.id} style={styles.niyyahCard}>
          <LinearGradient
            colors={[step.color, `${step.color}80`]}
            style={styles.niyyahGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.niyyahHeader}>
              <View style={styles.niyyahNumber}>
                <Text style={styles.niyyahNumberText}>{step.id}</Text>
              </View>
              <View style={styles.niyyahTitleContainer}>
                <Text style={styles.niyyahTitle}>{step.title}</Text>
                <Text style={styles.niyyahInstruction}>{step.instruction}</Text>
              </View>
              <Ionicons name={step.icon as any} size={24} color="white" />
            </View>
            
            {/* Lazim Type Selection */}
            <View style={styles.lazimTypeContainer}>
              <Text style={styles.lazimTypeTitle}>Choose Lazim Type:</Text>
              <View style={styles.lazimTypeButtons}>
                <TouchableOpacity
                  style={[styles.lazimTypeButton, lazimType === 'morning' && styles.lazimTypeButtonSelected]}
                  onPress={() => setLazimType('morning')}
                >
                  <Text style={[styles.lazimTypeButtonText, lazimType === 'morning' && styles.lazimTypeButtonTextSelected]}>
                    Morning Lazim
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.lazimTypeButton, lazimType === 'evening' && styles.lazimTypeButtonSelected]}
                  onPress={() => setLazimType('evening')}
                >
                  <Text style={[styles.lazimTypeButtonText, lazimType === 'evening' && styles.lazimTypeButtonTextSelected]}>
                    Evening Lazim
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Display selected niyyah */}
            {lazimType && (
              <View style={styles.selectedNiyyahContainer}>
                <View style={styles.arabicContainer}>
                  <Text style={styles.arabicText}>
                    {lazimType === 'morning' ? step.morningArabic : step.eveningArabic}
                  </Text>
                </View>
                
                <View style={styles.transliterationContainer}>
                  <Text style={styles.transliterationText}>
                    {lazimType === 'morning' ? step.morningTransliteration : step.eveningTransliteration}
                  </Text>
                </View>
                
                <View style={styles.translationContainer}>
                  <Text style={styles.translationText}>
                    {lazimType === 'morning' ? step.morningTranslation : step.eveningTranslation}
                  </Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </View>
      );
    }
    
    // Regular step rendering
    return (
      <TouchableOpacity
        key={step.id}
        style={styles.stepCard}
        onPress={() => openStepModal(index)}
      >
        <LinearGradient
          colors={[step.color, `${step.color}80`]}
          style={styles.stepGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{step.id}</Text>
            </View>
            <View style={styles.stepTitleContainer}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepInstruction}>{step.instruction}</Text>
            </View>
            <Ionicons name={step.icon as any} size={24} color="white" />
          </View>
          
          <View style={styles.arabicContainer}>
            <Text style={styles.arabicText}>{step.arabic}</Text>
          </View>
          
          <View style={styles.transliterationContainer}>
            <Text style={styles.transliterationText}>{step.transliteration}</Text>
          </View>
          
          <View style={styles.translationContainer}>
            <Text style={styles.translationText}>{step.translation}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderCounter = () => (
    <View style={styles.counterContainer}>
      <LinearGradient
        colors={[colors.accentTeal, colors.primary]}
        style={styles.counterGradient}
      >
        <Text style={styles.counterTitle}>Recitation Counter</Text>
        <View style={styles.counterDisplay}>
          <Text style={styles.counterNumber}>{counter}</Text>
          <Text style={styles.counterLabel}>/ 100</Text>
        </View>
        <View style={styles.counterButtons}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={decrementCounter}
            disabled={counter === 0}
          >
            <Ionicons name="remove" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={incrementCounter}
            disabled={counter === 100}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetCounter}
        >
          <Text style={styles.resetButtonText}>Reset Counter</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <IslamicBackground opacity={0.1}>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <LinearGradient
            colors={[colors.accentTeal, colors.primary]}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Ionicons name="book" size={40} color="white" />
              <Text style={styles.headerTitle}>{t('lazim.title')}</Text>
              <Text style={styles.headerSubtitle}>{t('lazim.subtitle')}</Text>
              <Text style={styles.headerArabic}>تطبيق الورد اللازم</Text>
            </View>
          </LinearGradient>

          {/* Counter Section */}
          {renderCounter()}

          {/* Steps */}
          <View style={styles.stepsContainer}>
            <Text style={styles.sectionTitle}>{t('lazim.title')}</Text>
            {lazimSteps.map((step, index) => renderStepCard(step, index))}
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <LinearGradient
              colors={[colors.surface, colors.background]}
              style={styles.instructionsGradient}
            >
              <Text style={styles.instructionsTitle}>Important Instructions</Text>
              <Text style={styles.instructionsText}>
                • Perform ablution (wudu) before starting{'\n'}
                • Find a clean, quiet place{'\n'}
                • Face the Qibla direction{'\n'}
                • Use the counter for accurate counting{'\n'}
                • Recite with proper pronunciation{'\n'}
                • Maintain focus and sincerity{'\n'}
                • Complete all steps in order
              </Text>
            </LinearGradient>
          </View>
        </ScrollView>

        {/* Step Detail Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={[lazimSteps[selectedStep]?.color || colors.primary, `${lazimSteps[selectedStep]?.color || colors.primary}80`]}
                style={styles.modalGradient}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{lazimSteps[selectedStep]?.title}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalScroll}>
                  <View style={styles.modalArabicContainer}>
                    <Text style={styles.modalArabicText}>{lazimSteps[selectedStep]?.arabic}</Text>
                  </View>
                  
                  <View style={styles.modalTransliterationContainer}>
                    <Text style={styles.modalTransliterationText}>{lazimSteps[selectedStep]?.transliteration}</Text>
                  </View>
                  
                  <View style={styles.modalTranslationContainer}>
                    <Text style={styles.modalTranslationText}>{lazimSteps[selectedStep]?.translation}</Text>
                  </View>
                  
                  <View style={styles.modalDetailsContainer}>
                    <Text style={styles.modalDetailsText}>{lazimSteps[selectedStep]?.details}</Text>
                  </View>
                </ScrollView>
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </View>
    </IslamicBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  headerArabic: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  counterContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  counterGradient: {
    padding: 25,
    alignItems: 'center',
  },
  counterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  counterDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  counterNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  counterLabel: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 5,
  },
  counterButtons: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  counterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stepsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  stepCard: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stepGradient: {
    padding: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  stepInstruction: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  arabicContainer: {
    marginBottom: 10,
  },
  arabicText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 28,
  },
  transliterationContainer: {
    marginBottom: 10,
  },
  transliterationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  translationContainer: {
    marginBottom: 5,
  },
  translationText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
  instructionsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  instructionsGradient: {
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'left',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalScroll: {
    flex: 1,
    padding: 20,
  },
  modalArabicContainer: {
    marginBottom: 15,
  },
  modalArabicText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 32,
  },
  modalTransliterationContainer: {
    marginBottom: 15,
  },
  modalTransliterationText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  modalTranslationContainer: {
    marginBottom: 20,
  },
  modalTranslationText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalDetailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  modalDetailsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    textAlign: 'justify',
  },
  // Niyyah styles
  niyyahCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  niyyahGradient: {
    padding: 20,
  },
  niyyahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  niyyahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  niyyahNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  niyyahTitleContainer: {
    flex: 1,
  },
  niyyahTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  niyyahInstruction: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  lazimTypeContainer: {
    marginBottom: 20,
  },
  lazimTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  lazimTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lazimTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  lazimTypeButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'white',
  },
  lazimTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  lazimTypeButtonTextSelected: {
    color: 'white',
  },
  selectedNiyyahContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
  },
});

export default TijaniyaLazimScreen;
