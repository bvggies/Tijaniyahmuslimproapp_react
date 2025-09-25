import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

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
  const [zikrItems, setZikrItems] = useState<ZikrItem[]>(fridayZikr);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'friday' | 'general' | 'surah'>('all');
  const [currentCounts, setCurrentCounts] = useState<{ [key: string]: number }>({});
  const [fadeAnim] = useState(new Animated.Value(0));

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Zikr Jumma</Text>
            <Text style={styles.headerSubtitle}>Special Friday prayers and dhikr</Text>
          </View>
          <View style={styles.statsBadge}>
            <Text style={styles.statsText}>{completedCount}/{totalCount}</Text>
          </View>
        </View>
      </LinearGradient>

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
        <Text style={styles.sectionTitle}>Friday Dhikr</Text>
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
        <Text style={styles.sectionTitle}>Friday Duas</Text>
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
            <Text style={styles.reminderTitle}>Friday Reminder</Text>
            <Text style={styles.reminderText}>
              "The best day on which the sun has risen is Friday; on it Adam was created, on it he was made to enter Paradise, and on it he was expelled from it."
            </Text>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8F5E8',
    marginTop: 4,
  },
  statsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    margin: 20,
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
});
