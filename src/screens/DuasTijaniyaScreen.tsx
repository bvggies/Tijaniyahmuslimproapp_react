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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';

const { width } = Dimensions.get('window');

interface Dua {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  category: 'wazifa' | 'protection' | 'blessing' | 'daily';
  icon: string;
  color: string;
  gradient: [string, string];
  screen: string;
}

const DuasTijaniyaScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const duas: Dua[] = [
    {
      id: '1',
      title: 'Dua Khatmul Wazifa',
      titleArabic: 'دعاء ختم الوظيفة',
      description: 'The closing supplication recited after completing the Wazifa',
      category: 'wazifa',
      icon: 'bookmark',
      color: '#E91E63',
      gradient: ['#E91E63', '#C2185B'],
      screen: 'DuaKhatmulWazifa',
    },
    {
      id: '2',
      title: 'Dua Rabil Ibadi',
      titleArabic: 'دعاء رب العباد',
      description: 'Prayer to the Lord of All Servants - A powerful supplication',
      category: 'blessing',
      icon: 'heart',
      color: '#673AB7',
      gradient: ['#673AB7', '#512DA8'],
      screen: 'DuaRabilIbadi',
    },
    {
      id: '3',
      title: 'Dua Hasbil Muhaiminu',
      titleArabic: 'حسبي المهيمن',
      description: 'The Protector is Sufficient for Me - For divine protection',
      category: 'protection',
      icon: 'shield-checkmark',
      color: '#3F51B5',
      gradient: ['#3F51B5', '#303F9F'],
      screen: 'DuaHasbilMuhaiminu',
    },
    {
      id: '4',
      title: 'Salatul Fatih',
      titleArabic: 'صلاة الفاتح',
      description: 'The Opening Prayer - Core prayer of Tijaniyya',
      category: 'daily',
      icon: 'sunny',
      color: '#FF9800',
      gradient: ['#FF9800', '#F57C00'],
      screen: 'SalatulFatih',
    },
    {
      id: '5',
      title: 'Jawharat al-Kamal',
      titleArabic: 'جوهرة الكمال',
      description: 'The Jewel of Perfection - Sacred prayer of the path',
      category: 'wazifa',
      icon: 'diamond',
      color: '#00BCD4',
      gradient: ['#00BCD4', '#0097A7'],
      screen: 'JawharatAlKamal',
    },
    {
      id: '6',
      title: 'Haylala (La ilaha illallah)',
      titleArabic: 'لا إله إلا الله',
      description: 'Declaration of faith - The greatest dhikr',
      category: 'daily',
      icon: 'infinite',
      color: '#4CAF50',
      gradient: ['#4CAF50', '#388E3C'],
      screen: 'Haylala',
    },
    {
      id: '7',
      title: 'Istikhara Prayer',
      titleArabic: 'صلاة الاستخارة',
      description: 'Prayer for seeking guidance in decisions',
      category: 'daily',
      icon: 'compass',
      color: '#9C27B0',
      gradient: ['#9C27B0', '#7B1FA2'],
      screen: 'IstikhaaraPrayer',
    },
    {
      id: '8',
      title: 'Morning Adhkar',
      titleArabic: 'أذكار الصباح',
      description: 'Morning remembrances and supplications',
      category: 'daily',
      icon: 'partly-sunny',
      color: '#2196F3',
      gradient: ['#2196F3', '#1976D2'],
      screen: 'MorningAdhkar',
    },
    {
      id: '9',
      title: 'Evening Adhkar',
      titleArabic: 'أذكار المساء',
      description: 'Evening remembrances and supplications',
      category: 'daily',
      icon: 'moon',
      color: '#5C6BC0',
      gradient: ['#5C6BC0', '#3F51B5'],
      screen: 'EveningAdhkar',
    },
    {
      id: '10',
      title: 'Protection Duas',
      titleArabic: 'أدعية الحماية',
      description: 'Supplications for protection from harm',
      category: 'protection',
      icon: 'shield',
      color: '#607D8B',
      gradient: ['#607D8B', '#455A64'],
      screen: 'ProtectionDuas',
    },
  ];

  const categories = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'wazifa', label: 'Wazifa', icon: 'moon' },
    { id: 'protection', label: 'Protection', icon: 'shield' },
    { id: 'blessing', label: 'Blessing', icon: 'heart' },
    { id: 'daily', label: 'Daily', icon: 'sunny' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredDuas = duas.filter(dua => {
    const matchesSearch = 
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.titleArabic.includes(searchQuery) ||
      dua.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || dua.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDuaPress = (dua: Dua) => {
    navigation.navigate('More' as never, { screen: dua.screen } as never);
  };

  const renderDuaCard = (dua: Dua, index: number) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(cardAnim, {
        toValue: 1,
        delay: index * 60,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        key={dua.id}
        style={[
          styles.duaCardWrapper,
          {
            opacity: cardAnim,
            transform: [
              { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.duaCard}
          activeOpacity={0.85}
          onPress={() => handleDuaPress(dua)}
        >
          <LinearGradient
            colors={dua.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.duaGradient}
          >
            {/* Icon */}
            <View style={styles.duaIconContainer}>
              <Ionicons name={dua.icon as any} size={28} color="#FFFFFF" />
            </View>

            {/* Content */}
            <View style={styles.duaContent}>
              <Text style={styles.duaTitle}>{dua.title}</Text>
              <Text style={styles.duaArabic}>{dua.titleArabic}</Text>
              <Text style={styles.duaDescription} numberOfLines={2}>
                {dua.description}
              </Text>
            </View>

            {/* Arrow */}
            <View style={styles.duaArrow}>
              <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.8)" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <LinearGradient
          colors={['#00BCD4', '#0097A7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerPattern}>
            <View style={[styles.patternCircle, { top: -40, right: -40, width: 120, height: 120 }]} />
            <View style={[styles.patternCircle, { bottom: 0, left: -20, width: 80, height: 80 }]} />
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.headerIconWrap}>
              <Ionicons name="hands" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Duas of Tijaniyya</Text>
            <Text style={styles.headerArabic}>أدعية التجانية</Text>
            <Text style={styles.headerSubtitle}>
              Sacred supplications from the Tijani path
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search duas..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Category Chips */}
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={selectedCategory === cat.id ? '#FFFFFF' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.id && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Duas List */}
      <ScrollView
        style={styles.duasList}
        contentContainerStyle={styles.duasListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua, index) => renderDuaCard(dua, index))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No duas found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different search term or category
            </Text>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <LinearGradient
            colors={[`${colors.accentTeal}15`, `${colors.primary}10`]}
            style={styles.infoGradient}
          >
            <Ionicons name="information-circle" size={24} color={colors.accentTeal} />
            <Text style={styles.infoText}>
              These duas are authentic supplications from the Tijaniyya tradition. 
              Recite them with sincerity and proper wudu for maximum spiritual benefit.
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerArabic: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
  categorySection: {
    paddingVertical: 16,
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  categoryChipActive: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
  },
  categoryChipText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  duasList: {
    flex: 1,
  },
  duasListContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  duaCardWrapper: {
    marginBottom: 12,
  },
  duaCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  duaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  duaIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  duaContent: {
    flex: 1,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  duaArabic: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  duaDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 16,
  },
  duaArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  infoCard: {
    marginTop: 24,
  },
  infoGradient: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${colors.accentTeal}30`,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

export default DuasTijaniyaScreen;

