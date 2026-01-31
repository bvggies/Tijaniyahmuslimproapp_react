import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { Dua } from '../types';
import { useFadeIn, useStaggeredFadeIn } from '../hooks/useAnimations';

// Mock data for Duas
const mockDuas: Dua[] = [
  // Morning Duas
  {
    id: '1',
    title: 'Dua for Morning',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    transliteration: 'Asbahna wa asbahal mulku lillah',
    translation: 'We have reached the morning and the dominion belongs to Allah',
    frenchTranslation: 'Nous avons atteint le matin et la souveraineté appartient à Allah',
    hausaTranslation: 'Mun isa safe kuma mulki na Allah ne',
    category: 'Morning',
  },
  {
    id: '2',
    title: 'Morning Remembrance',
    arabic: 'اللَّهُمَّ أَصْبَحْنَا نُشْهِدُكَ وَنُشْهِدُ حَمَلَةَ عَرْشِكَ',
    transliteration: 'Allahumma asbahna nushhiduka wa nushhidu hamalata arshika',
    translation: 'O Allah, we have reached the morning and bear witness to You and the bearers of Your Throne',
    frenchTranslation: 'Ô Allah, nous avons atteint le matin et témoignons de Toi et des porteurs de Ton Trône',
    hausaTranslation: 'Ya Allah, mun isa safe kuma muna shaida a gare ka da masu ɗaukar kursiyinka',
    category: 'Morning',
  },
  
  // Evening Duas
  {
    id: '3',
    title: 'Dua for Evening',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    transliteration: 'Amsayna wa amsal mulku lillah',
    translation: 'We have reached the evening and the dominion belongs to Allah',
    frenchTranslation: 'Nous avons atteint le soir et la souveraineté appartient à Allah',
    hausaTranslation: 'Mun isa yamma kuma mulki na Allah ne',
    category: 'Evening',
  },
  {
    id: '4',
    title: 'Evening Remembrance',
    arabic: 'اللَّهُمَّ أَمْسَيْنَا نُشْهِدُكَ وَنُشْهِدُ حَمَلَةَ عَرْشِكَ',
    transliteration: 'Allahumma amsayna nushhiduka wa nushhidu hamalata arshika',
    translation: 'O Allah, we have reached the evening and bear witness to You and the bearers of Your Throne',
    frenchTranslation: 'Ô Allah, nous avons atteint le soir et témoignons de Toi et des porteurs de Ton Trône',
    hausaTranslation: 'Ya Allah, mun isa yamma kuma muna shaida a gare ka da masu ɗaukar kursiyinka',
    category: 'Evening',
  },
  
  // Eating Duas
  {
    id: '5',
    title: 'Dua Before Eating',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah',
    frenchTranslation: 'Au nom d\'Allah',
    hausaTranslation: 'Da sunan Allah',
    category: 'Eating',
  },
  {
    id: '6',
    title: 'Dua After Eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا',
    transliteration: 'Alhamdulillahil lathee at\'amana wa saqana',
    translation: 'Praise be to Allah who fed us and gave us drink',
    frenchTranslation: 'Louange à Allah qui nous a nourris et nous a donné à boire',
    hausaTranslation: 'Godiya ga Allah wanda ya ciyar da mu kuma ya ba mu ruwa',
    category: 'Eating',
  },
  {
    id: '7',
    title: 'Dua When Forgetting to Say Bismillah',
    arabic: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
    transliteration: 'Bismillahi awwalahu wa akhirahu',
    translation: 'In the name of Allah at its beginning and end',
    frenchTranslation: 'Au nom d\'Allah à son début et à sa fin',
    hausaTranslation: 'Da sunan Allah a farkonsa da ƙarshensa',
    category: 'Eating',
  },
  
  // Travel Duas
  {
    id: '8',
    title: 'Dua for Travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا',
    transliteration: 'Subhanallathee sakhkhara lana hadha',
    translation: 'Glory to Him who has subjected this to us',
    frenchTranslation: 'Gloire à Celui qui nous a soumis cela',
    hausaTranslation: 'Tsarki ga wanda ya sanya wannan a hannunmu',
    category: 'Travel',
  },
  {
    id: '9',
    title: 'Dua When Leaving Home',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ',
    transliteration: 'Bismillahi tawakkaltu ala Allah',
    translation: 'In the name of Allah, I place my trust in Allah',
    frenchTranslation: 'Au nom d\'Allah, je place ma confiance en Allah',
    hausaTranslation: 'Da sunan Allah, na dora amanata a kan Allah',
    category: 'Travel',
  },
  {
    id: '10',
    title: 'Dua When Returning Home',
    arabic: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
    transliteration: 'Aibuna taibuna abiduna li rabbina hamidun',
    translation: 'We return, repentant, worshipping our Lord, praising',
    frenchTranslation: 'Nous revenons, repentants, adorant notre Seigneur, louant',
    hausaTranslation: 'Muna dawowa, masu tuba, masu bauta wa Ubangijinmu, masu yabon',
    category: 'Travel',
  },
  
  // Prayer Duas
  {
    id: '11',
    title: 'Dua Before Prayer',
    arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ',
    transliteration: 'Allahumma ba\'id bayni wa bayna khataayaya',
    translation: 'O Allah, distance me from my sins',
    frenchTranslation: 'Ô Allah, éloigne-moi de mes péchés',
    hausaTranslation: 'Ya Allah, ka nisanta ni da zunubanku',
    category: 'Prayer',
  },
  {
    id: '12',
    title: 'Dua After Prayer',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ',
    transliteration: 'Astaghfirullah allathee la ilaha illa huwa',
    translation: 'I seek forgiveness from Allah, there is no god but He',
    frenchTranslation: 'Je demande pardon à Allah, il n\'y a de dieu que Lui',
    hausaTranslation: 'Ina neman gafara daga Allah, babu abin bautawa sai Shi',
    category: 'Prayer',
  },
  {
    id: '13',
    title: 'Dua in Sujood',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    transliteration: 'Subhana rabbiyal a\'la',
    translation: 'Glory to my Lord, the Most High',
    frenchTranslation: 'Gloire à mon Seigneur, le Très-Haut',
    hausaTranslation: 'Tsarki ga Ubangijina, Maɗaukaki',
    category: 'Prayer',
  },
  
  // Forgiveness Duas
  {
    id: '14',
    title: 'Dua for Forgiveness',
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ',
    transliteration: 'Rabbi ighfir li wa tub alayya',
    translation: 'My Lord, forgive me and accept my repentance',
    frenchTranslation: 'Mon Seigneur, pardonne-moi et accepte mon repentir',
    hausaTranslation: 'Ya Ubangijina, ka gafarta mini kuma ka karɓi tubana',
    category: 'Forgiveness',
  },
  {
    id: '15',
    title: 'Istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
    transliteration: 'Astaghfirullah al-azeem',
    translation: 'I seek forgiveness from Allah, the Most Great',
    frenchTranslation: 'Je demande pardon à Allah, le Très Grand',
    hausaTranslation: 'Ina neman gafara daga Allah, Maɗaukaki',
    category: 'Forgiveness',
  },
  {
    id: '16',
    title: 'Dua for Mercy',
    arabic: 'اللَّهُمَّ ارْحَمْنِي وَاغْفِرْ لِي',
    transliteration: 'Allahumma irhamni wa ighfir li',
    translation: 'O Allah, have mercy on me and forgive me',
    category: 'Forgiveness',
  },
];

const categories = ['All', 'Morning', 'Evening', 'Eating', 'Travel', 'Prayer', 'Forgiveness'];

function AnimatedDuaCard({
  item,
  index,
  language,
  favorites,
  toggleFavorite,
  styles: s,
  t,
}: {
  item: Dua;
  index: number;
  language: string;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  styles: any;
  t: (key: string) => string;
}) {
  const { opacity, translateY } = useStaggeredFadeIn(index, { baseDelay: 80, itemDelay: 50 });
  return (
    <Animated.View style={[s.duaCard, { opacity, transform: [{ translateY }] }]}>
      <View style={s.duaHeader}>
        <Text style={s.duaTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={s.favoriteButton}>
          <Ionicons
            name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
            size={24}
            color={favorites.includes(item.id) ? '#FF6B6B' : '#666'}
          />
        </TouchableOpacity>
      </View>
      <View style={s.duaContent}>
        <Text style={s.arabicText}>{item.arabic}</Text>
        <Text style={s.transliterationText}>{item.transliteration}</Text>
        <Text style={s.translationText}>
          {language === 'fr' && item.frenchTranslation ? item.frenchTranslation :
           language === 'ha' && item.hausaTranslation ? item.hausaTranslation :
           item.translation}
        </Text>
      </View>
      <View style={s.duaFooter}>
        <View style={s.categoryBadge}>
          <Text style={s.categoryText}>{item.category}</Text>
        </View>
        <TouchableOpacity style={s.shareButton}>
          <Ionicons name="share-outline" size={20} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function DuasScreen() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredDuas = mockDuas.filter(dua => {
    const matchesSearch = dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dua.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || dua.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (category: string) => {
    if (category === 'All') return mockDuas.length;
    return mockDuas.filter(dua => dua.category === category).length;
  };

  const toggleFavorite = (duaId: string) => {
    setFavorites(prev => 
      prev.includes(duaId) 
        ? prev.filter(id => id !== duaId)
        : [...prev, duaId]
    );
  };

  const screenOpacity = useFadeIn({ duration: 350 });

  const renderDuaCard = ({ item, index }: { item: Dua; index: number }) => (
    <AnimatedDuaCard item={item} index={index} language={language} favorites={favorites} toggleFavorite={toggleFavorite} styles={styles} t={t} />
  );

  const renderHeader = () => (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('duas.search_placeholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
        data-scroll="true"
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.selectedCategoryButtonText,
              ]}
            >
              {category} ({getCategoryCount(category)})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {searchQuery ? 
            `Search results for "${searchQuery}" (${filteredDuas.length})` : 
            `${selectedCategory} Duas (${filteredDuas.length})`
          }
        </Text>
      </View>
    </>
  );

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.surface, colors.background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Duas & Supplications</Text>
          <TouchableOpacity style={styles.favoritesButton}>
            <Ionicons name="heart" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Duas List with Header */}
      <FlatList
        data={filteredDuas}
        renderItem={renderDuaCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.duasList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        data-flatlist="true"
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No duas found matching your search' : `No duas found in ${selectedCategory} category`}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'Try selecting a different category'}
            </Text>
          </View>
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 70, // Add padding for floating tab bar
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
    color: colors.textPrimary,
  },
  favoritesButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 12,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 100,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategoryButton: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    numberOfLines: 1,
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
  },
  duasList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  duaCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  duaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  duaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  duaContent: {
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 20,
    color: colors.accentTeal,
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 28,
  },
  transliterationText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  translationText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  duaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: colors.mintSurface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textDark,
    fontWeight: '500',
  },
  shareButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
});
