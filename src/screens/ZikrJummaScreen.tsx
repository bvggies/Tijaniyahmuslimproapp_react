import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';

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

// Haylala Step Card Component
const HaylalaStepCard = ({ 
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
  <View style={[styles.haylalaStepCard, isCompleted && styles.completedHaylalaStepCard]}>
    <View style={styles.haylalaStepHeader}>
      <View style={[styles.haylalaStepNumber, isCompleted && styles.completedHaylalaStepNumber]}>
        <Text style={styles.haylalaStepNumberText}>{stepNumber}</Text>
      </View>
      <View style={styles.haylalaStepTitleContainer}>
        <Text style={[styles.haylalaStepTitle, isCompleted && styles.completedHaylalaText]}>{title}</Text>
        <Text style={styles.haylalaStepProgress}>{count}/{targetCount}</Text>
      </View>
      {isCompleted && (
        <View style={styles.completedHaylalaIcon}>
          <Ionicons name="checkmark-circle" size={24} color={colors.accentTeal} />
        </View>
      )}
    </View>
    
    <View style={styles.haylalaStepContent}>
      <Text style={styles.haylalaArabicText}>{arabic}</Text>
      <Text style={styles.haylalaTransliterationText}>{transliteration}</Text>
      <Text style={styles.haylalaEnglishText}>{english}</Text>
    </View>
    
    <DigitalCounter
      count={count}
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      onReset={onReset}
    />
  </View>
);

interface ZikrItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  completed: boolean;
  category: 'friday' | 'general' | 'surah';
}

const fridayZikr: ZikrItem[] = [
  {
    id: '1',
    title: 'Surah Al-Kahf',
    arabic: 'سُورَةُ الْكَهْف',
    transliteration: 'Surah Al-Kahf',
    translation: 'The Cave - Read on Friday for protection',
    count: 1,
    completed: false,
    category: 'surah',
  },
  {
    id: '2',
    title: 'Salawat on Prophet (PBUH)',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    transliteration: 'Allahumma salli ala Muhammad',
    translation: 'O Allah, send blessings upon Muhammad',
    count: 100,
    completed: false,
    category: 'friday',
  },
  {
    id: '3',
    title: 'Istighfar (Seeking Forgiveness)',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah',
    count: 100,
    completed: false,
    category: 'general',
  },
  {
    id: '4',
    title: 'Tasbih (Glory to Allah)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah',
    count: 100,
    completed: false,
    category: 'general',
  },
  {
    id: '5',
    title: 'Tahmid (Praise to Allah)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Praise be to Allah',
    count: 100,
    completed: false,
    category: 'general',
  },
  {
    id: '6',
    title: 'Takbir (Allah is Great)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    count: 100,
    completed: false,
    category: 'general',
  },
];

const fridayDuas = [
  {
    id: '1',
    title: 'Dua for Friday Morning',
    arabic: 'اللَّهُمَّ اجْعَلْنَا مِنَ التَّوَّابِينَ وَاجْعَلْنَا مِنَ الْمُتَطَهِّرِينَ',
    transliteration: 'Allahumma ij\'alna minat-tawwabeen wa ij\'alna minal-mutatahhireen',
    translation: 'O Allah, make us among those who repent and purify themselves',
  },
  {
    id: '2',
    title: 'Dua for Friday Blessings',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي يَوْمِ الْجُمُعَةِ',
    transliteration: 'Allahumma barik lana fi yawmil Jumu\'ah',
    translation: 'O Allah, bless us on this Friday',
  },
];

export default function ZikrJummaScreen() {
  const { t } = useLanguage();
  const [zikrItems, setZikrItems] = useState<ZikrItem[]>(fridayZikr);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'friday' | 'general' | 'surah'>('all');
  const [currentCounts, setCurrentCounts] = useState<{ [key: string]: number }>({});
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Haylala (Friday's Dhikr) state
  const [istighfarCount, setIstighfarCount] = useState(0);
  const [salatilFathiCount1, setSalatilFathiCount1] = useState(0);
  const [laIlahaCount, setLaIlahaCount] = useState(0);
  const [sayidinaMuhammadCount, setSayidinaMuhammadCount] = useState(0);
  const [salatilFathiCount2, setSalatilFathiCount2] = useState(0);
  const [showHaylalaInfo, setShowHaylalaInfo] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredZikr = zikrItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const completedCount = zikrItems.filter(item => item.completed).length;
  const totalCount = zikrItems.length;

  const incrementCount = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCount = (currentCounts[id] || 0) + 1;
    setCurrentCounts(prev => ({ ...prev, [id]: newCount }));
    
    const zikrItem = zikrItems.find(item => item.id === id);
    if (zikrItem && newCount >= zikrItem.count) {
      setZikrItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, completed: true } : item
        )
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const resetCount = (id: string) => {
    setCurrentCounts(prev => ({ ...prev, [id]: 0 }));
    setZikrItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: false } : item
      )
    );
  };

  const resetAllHaylalaCounters = () => {
    setIstighfarCount(0);
    setSalatilFathiCount1(0);
    setLaIlahaCount(0);
    setSayidinaMuhammadCount(0);
    setSalatilFathiCount2(0);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'friday': return '#9C27B0';
      case 'general': return '#2196F3';
      case 'surah': return '#FF9800';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'friday': return 'calendar';
      case 'general': return 'ellipse';
      case 'surah': return 'book';
      default: return 'ellipse';
    }
  };

  const renderZikrCard = ({ item }: { item: ZikrItem }) => {
    const currentCount = currentCounts[item.id] || 0;
    const progress = (currentCount / item.count) * 100;
    
    return (
      <Animated.View
        style={[
          styles.zikrCard,
          item.completed && styles.completedCard,
          { opacity: fadeAnim }
        ]}
      >
        <View style={styles.zikrHeader}>
          <View style={styles.zikrInfo}>
            <View style={styles.zikrTitleRow}>
              <Text style={[styles.zikrTitle, item.completed && styles.completedText]}>
                {item.title}
              </Text>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                <Ionicons name={getCategoryIcon(item.category) as any} size={12} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.arabicText}>{item.arabic}</Text>
            <Text style={styles.transliterationText}>{item.transliteration}</Text>
            <Text style={styles.translationText}>{item.translation}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {currentCount} / {item.count}
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round(progress)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress, 100)}%` }
              ]}
            />
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.countButton, item.completed && styles.disabledButton]}
            onPress={() => incrementCount(item.id)}
            disabled={item.completed}
          >
            <LinearGradient
              colors={item.completed ? ['#E0E0E0', '#F0F0F0'] : ['#4CAF50', '#66BB6A']}
              style={styles.countButtonGradient}
            >
              <Ionicons 
                name={item.completed ? "checkmark" : "add"} 
                size={20} 
                color={item.completed ? "#999" : "#FFFFFF"} 
              />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => resetCount(item.id)}
          >
            <Ionicons name="refresh" size={16} color="#666" />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderDuaCard = ({ item }: { item: any }) => (
    <View style={styles.duaCard}>
      <Text style={styles.duaTitle}>{item.title}</Text>
      <Text style={styles.duaArabic}>{item.arabic}</Text>
      <Text style={styles.duaTransliteration}>{item.transliteration}</Text>
      <Text style={styles.duaTranslation}>{item.translation}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Haylala (Friday's Dhikr) Section */}
        <View style={styles.haylalaSection}>
          <LinearGradient
            colors={[colors.accentTeal, colors.accentGreen]}
            style={styles.haylalaHeader}
          >
            <View style={styles.haylalaHeaderContent}>
              <View>
                <Text style={styles.haylalaTitle}>Haylala (Friday's Dhikr)</Text>
                <Text style={styles.haylalaSubtitle}>The Friday's dhikr to perform between 'Asr and Maghreb Prayers</Text>
              </View>
              <TouchableOpacity 
                style={styles.infoButton}
                onPress={() => setShowHaylalaInfo(true)}
              >
                <Ionicons name="information-circle" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.haylalaContent}>
            <Text style={styles.haylalaIntroText}>
              The Haylala (other names: Hadra, 'Asru) is the Friday's dhikr to perform between 'Asr and Maghreb Prayers.
            </Text>

            {/* Niyyah (Intention) */}
            <View style={styles.niyyahCard}>
              <Text style={styles.niyyahTitle}>Niyyah (Intention)</Text>
              <Text style={styles.niyyahArabic}>
                اللهم إني نويت ذكر هيللة الجمعة اللازمة في الطريقة التجانية إقتداء بسيد أحمد التجاني رضي اللّٰه عنه تعبدا لله تعالى
              </Text>
              <Text style={styles.niyyahTransliteration}>
                Allahumma innii nawaytu dzikria haylalatal jum'ati allaazimati fit-țareeqati Tijaniyyah iqtidaa-a bisayyidi Ahmad at-Tijani Radiyallahu anhu ta'abbudan lillahi ta'aalaa.
              </Text>
              <Text style={styles.niyyahEnglish}>
                O Allah, I intend to perform the dhikr of the obligatory Friday Haylala in the Tijani Tariqa, following our Master Ahmad al-Tijani, may Allah be pleased with him, as an act of devotion to Allah the Almighty.
              </Text>
              <Text style={styles.niyyahBreakdown}>
                Breakdown: "O Allah, I intend" → "to perform the dhikr of the Friday Haylala" → "in the Tijani Tariqa" → "following our Master Ahmad al-Tijani, may Allah be pleased with him" → "as an act of devotion to Allah the Almighty"
              </Text>
            </View>

            {/* Haylala Steps */}
            <View style={styles.haylalaStepsContainer}>
              {/* Step 1: Auzubillah */}
              <HaylalaStepCard
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
              <HaylalaStepCard
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
              <HaylalaStepCard
                stepNumber={3}
                title="Istighfar (3 times)"
                arabic="أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ"
                transliteration="Astaghfirullah Al 'Aziim alazii laa ilaaha illaa Huwal-Hayyul-Qayyoum"
                english="I ask forgiveness from ALLAH, The Great One, no God exists but Him, The Ever Living One, The Self Existing One"
                count={istighfarCount}
                onIncrement={() => setIstighfarCount(prev => Math.min(prev + 1, 3))}
                onDecrement={() => setIstighfarCount(prev => Math.max(prev - 1, 0))}
                onReset={() => setIstighfarCount(0)}
                isCompleted={istighfarCount >= 3}
                targetCount={3}
              />

              {/* Step 4: Salatil Fathi (First) */}
              <HaylalaStepCard
                stepNumber={4}
                title="Salatil Fathi (3 times)"
                arabic="اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَىٰ صِرَاطِكَ الْمُسْتَقِيمِ"
                transliteration="Allahumma salli 'ala Sayyidina Muhammadini l-Fatihi lima ughliq(a), wa l-khatimi lima sabaq(a), nasiri l-haqqi bi l-haqq(i), wa l-hadi ila siratika l-mustaqim(i)"
                english="O Allah, send prayers upon our master Muhammad, the opener of what was closed, and the seal of what had preceded, the helper of the truth by the Truth, and the guide to Your straight path"
                count={salatilFathiCount1}
                onIncrement={() => setSalatilFathiCount1(prev => Math.min(prev + 1, 3))}
                onDecrement={() => setSalatilFathiCount1(prev => Math.max(prev - 1, 0))}
                onReset={() => setSalatilFathiCount1(0)}
                isCompleted={salatilFathiCount1 >= 3}
                targetCount={3}
              />

              {/* Step 5: La Ilaha Illallah */}
              <HaylalaStepCard
                stepNumber={5}
                title="La Ilaha Illallah (1000/1200/1600 times)"
                arabic="لَا إِلَٰهَ إِلَّا اللَّهُ"
                transliteration="La ilaha illal-lah"
                english="There is no god but Allah"
                count={laIlahaCount}
                onIncrement={() => setLaIlahaCount(prev => Math.min(prev + 1, 1600))}
                onDecrement={() => setLaIlahaCount(prev => Math.max(prev - 1, 0))}
                onReset={() => setLaIlahaCount(0)}
                isCompleted={laIlahaCount >= 1000}
                targetCount={1000}
              />

              {/* Step 6: Sayidina Muhammad Rasulullah */}
              <HaylalaStepCard
                stepNumber={6}
                title="Sayidina Muhammad Rasulullah"
                arabic="سَيِّدِنَا مُحَمَّدٌ رَسُولُ اللَّهِ"
                transliteration="Sayyidina Muhammad Rasulullah"
                english="Our master Muhammad is the Messenger of Allah"
                count={sayidinaMuhammadCount}
                onIncrement={() => setSayidinaMuhammadCount(prev => Math.min(prev + 1, 1))}
                onDecrement={() => setSayidinaMuhammadCount(prev => Math.max(prev - 1, 0))}
                onReset={() => setSayidinaMuhammadCount(0)}
                isCompleted={sayidinaMuhammadCount >= 1}
                targetCount={1}
              />

              {/* Step 7: Auzubillah (Second) */}
              <HaylalaStepCard
                stepNumber={7}
                title="Seeking Refuge (Second)"
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

              {/* Step 8: Suratul Fatiha (Second) */}
              <HaylalaStepCard
                stepNumber={8}
                title="Suratul Fatiha (Second)"
                arabic="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ (1) الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (2) الرَّحْمَٰنِ الرَّحِيمِ (3) مَالِكِ يَوْمِ الدِّينِ (4) إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (5) اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (6) صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ (7)"
                transliteration="Bismillahi ar-Rahman ar-Raheem (1) Alhamdulillahi rabbil alameen (2) Ar-Rahman ar-Raheem (3) Maliki yawmid-deen (4) Iyyaka na'budu wa iyyaka nasta'een (5) Ihdinas-siratal mustaqeem (6) Siratal-lazeena an'amta 'alayhim ghayril maghdoobi 'alayhim wa lad-dalleen (7)"
                english="In the name of Allah, the Entirely Merciful, the Especially Merciful. (1) [All] praise is [due] to Allah, Lord of the worlds. (2) The Entirely Merciful, the Especially Merciful. (3) Sovereign of the Day of Recompense. (4) It is You we worship and You we ask for help. (5) Guide us to the straight path. (6) The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray. (7)"
                count={1}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onReset={() => {}}
                isCompleted={true}
                targetCount={1}
              />

              {/* Step 9: Salatil Fathi (Second) */}
              <HaylalaStepCard
                stepNumber={9}
                title="Salatil Fathi (3 times - Second)"
                arabic="اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَىٰ صِرَاطِكَ الْمُسْتَقِيمِ"
                transliteration="Allahumma salli 'ala Sayyidina Muhammadini l-Fatihi lima ughliq(a), wa l-khatimi lima sabaq(a), nasiri l-haqqi bi l-haqq(i), wa l-hadi ila siratika l-mustaqim(i)"
                english="O Allah, send prayers upon our master Muhammad, the opener of what was closed, and the seal of what had preceded, the helper of the truth by the Truth, and the guide to Your straight path"
                count={salatilFathiCount2}
                onIncrement={() => setSalatilFathiCount2(prev => Math.min(prev + 1, 3))}
                onDecrement={() => setSalatilFathiCount2(prev => Math.max(prev - 1, 0))}
                onReset={() => setSalatilFathiCount2(0)}
                isCompleted={salatilFathiCount2 >= 3}
                targetCount={3}
              />

              {/* Step 10: Closing Dua */}
              <HaylalaStepCard
                stepNumber={10}
                title="Closing Dua"
                arabic="إِنَّ اللَّهَ وَمَلَيِكَتَهُ يُصَلَوْنَ عَلَ النَّبيِّ يَأْيِهَا الذِينَ ءَامَنُواْ صَلّوا عَليهِ وَسَلِمُوا تَسَلِيمًا"
                transliteration="Innal laha wa mala-ikatahu yuçalluna 'Alan-nabiyyi ya ayyuhal-lazina amanu çallu 'alayhi wa sallimu taslima"
                english="Indeed, Allah and His angels send blessings upon the Prophet. O you who believe, send blessings upon him and greet him with peace"
                count={1}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onReset={() => {}}
                isCompleted={true}
                targetCount={1}
              />
            </View>

            {/* Reset All Button */}
            <TouchableOpacity 
              style={styles.resetAllButton}
              onPress={resetAllHaylalaCounters}
            >
              <LinearGradient
                colors={[colors.accentTeal, colors.accentGreen]}
                style={styles.resetAllButtonGradient}
              >
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.resetAllButtonText}>Reset All Counters</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      {/* Friday Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoContent}>
          <Ionicons name="information-circle" size={24} color="#2196F3" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Friday - The Best Day</Text>
            <Text style={styles.infoDescription}>
              Friday is the best day of the week. Engage in special dhikr and prayers to receive Allah's blessings.
            </Text>
          </View>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: 'All', icon: 'grid-outline' },
          { key: 'friday', label: 'Friday', icon: 'calendar' },
          { key: 'general', label: 'General', icon: 'ellipse' },
          { key: 'surah', label: 'Surah', icon: 'book' },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedCategory === filter.key && styles.selectedFilterButton,
            ]}
            onPress={() => setSelectedCategory(filter.key as any)}
          >
            <Ionicons 
              name={filter.icon as any} 
              size={16} 
              color={selectedCategory === filter.key ? '#FFFFFF' : '#666'} 
            />
            <Text
              style={[
                styles.filterButtonText,
                selectedCategory === filter.key && styles.selectedFilterButtonText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Zikr Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('zikr_jumma.friday_dhikr')}</Text>
        <FlatList
          data={filteredZikr}
          renderItem={renderZikrCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>

      {/* Friday Duas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('zikr_jumma.friday_duas')}</Text>
        <FlatList
          data={fridayDuas}
          renderItem={renderDuaCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>

        {/* Friday Reminder */}
        <View style={styles.reminderCard}>
          <LinearGradient
            colors={['#9C27B0', '#BA68C8']}
            style={styles.reminderGradient}
          >
            <Ionicons name="bulb" size={24} color="#FFFFFF" />
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>{t('zikr_jumma.friday_reminder')}</Text>
              <Text style={styles.reminderText}>
                "The best day on which the sun has risen is Friday; on it Adam was created, on it he was made to enter Paradise, and on it he was expelled from it."
              </Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Haylala Information Modal */}
      <Modal
        visible={showHaylalaInfo}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHaylalaInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('zikr_jumma.info')}</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowHaylalaInfo(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalText}>
                <Text style={styles.modalBoldText}>{t('zikr_jumma.time_perform')}:</Text>{'\n'}
                The Haylala (other names: Hadra, 'Asru) is the Friday's dhikr to perform between 'Asr and Maghreb Prayers.
              </Text>
              
              <Text style={styles.modalText}>
                <Text style={styles.modalBoldText}>{t('zikr_jumma.how_perform')}:</Text>{'\n'}
                Like the Wadhifa, the Friday's Hadra must be performed in congregation whenever it is possible, arranging the ranks properly, reciting loud. If there is no congregation to join, do it alone.
              </Text>
              
              <Text style={styles.modalText}>
                <Text style={styles.modalBoldText}>{t('zikr_jumma.important_timing')}:</Text>{'\n'}
                It is performed only the Friday, and only between 'Asr and Maghreb Prayers, the best time is just before the Azan of the Maghreb Prayer. If not accomplished during this lapse of time, we can't make up for it.
              </Text>
              
              <Text style={styles.modalText}>
                <Text style={styles.modalBoldText}>{t('zikr_jumma.warning')}:</Text>{'\n'}
                Seyyidina Ahmed Tijani (may ALLAH be satisfied with him) said that if it is not performed during this period (i.e. between the 'Asr and Maghreb Prayers of the Friday) without a valid excuse, the follower has to know that he has missed a huge blessing that he will not be able to make up.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  infoCard: {
    margin: 20,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedFilterButton: {
    backgroundColor: '#2E7D32',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
  },
  selectedFilterButtonText: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  zikrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedCard: {
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  zikrHeader: {
    marginBottom: 12,
  },
  zikrInfo: {
    flex: 1,
  },
  zikrTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  zikrTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  completedText: {
    color: '#2E7D32',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  arabicText: {
    fontSize: 18,
    color: '#2E7D32',
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 28,
  },
  transliterationText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  countButtonGradient: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  resetText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  duaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  duaArabic: {
    fontSize: 18,
    color: '#2E7D32',
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 28,
  },
  duaTransliteration: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  duaTranslation: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  reminderCard: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  reminderGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  reminderContent: {
    flex: 1,
    marginLeft: 12,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 14,
    color: '#F3E5F5',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  // Haylala Section Styles
  haylalaSection: {
    margin: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  haylalaHeader: {
    padding: 20,
  },
  haylalaHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  haylalaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  haylalaSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  infoButton: {
    padding: 8,
  },
  haylalaContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
  },
  haylalaIntroText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  haylalaStepsContainer: {
    marginBottom: 20,
  },
  haylalaStepCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
  completedHaylalaStepCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: colors.accentTeal,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  haylalaStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  haylalaStepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  completedHaylalaStepNumber: {
    backgroundColor: colors.accentGreen,
  },
  haylalaStepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  haylalaStepTitleContainer: {
    flex: 1,
  },
  haylalaStepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  haylalaStepProgress: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  completedHaylalaText: {
    color: colors.accentTeal,
  },
  completedHaylalaIcon: {
    marginLeft: 8,
  },
  haylalaStepContent: {
    marginBottom: 20,
  },
  haylalaArabicText: {
    fontSize: 18,
    color: '#2C3E50',
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 28,
    fontFamily: 'System',
    fontWeight: '600',
  },
  haylalaTransliterationText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 24,
  },
  haylalaEnglishText: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
  },
  resetAllButton: {
    marginTop: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  resetAllButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  resetAllButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Counter Styles
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
    marginHorizontal: 8,
  },
  counterDisplay: {
    minWidth: 60,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
    marginBottom: 16,
  },
  modalBoldText: {
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  // Niyyah styles
  niyyahCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.accentTeal,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  niyyahTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accentTeal,
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
