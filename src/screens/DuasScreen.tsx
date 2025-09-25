import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { Dua } from '../types';

// Mock data for Duas
const mockDuas: Dua[] = [
  // Morning Duas
  {
    id: '1',
    title: 'Dua for Morning',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    transliteration: 'Asbahna wa asbahal mulku lillah',
    translation: 'We have reached the morning and the dominion belongs to Allah',
    category: 'Morning',
  },
  {
    id: '2',
    title: 'Morning Remembrance',
    arabic: 'اللَّهُمَّ أَصْبَحْنَا نُشْهِدُكَ وَنُشْهِدُ حَمَلَةَ عَرْشِكَ',
    transliteration: 'Allahumma asbahna nushhiduka wa nushhidu hamalata arshika',
    translation: 'O Allah, we have reached the morning and bear witness to You and the bearers of Your Throne',
    category: 'Morning',
  },
  
  // Evening Duas
  {
    id: '3',
    title: 'Dua for Evening',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    transliteration: 'Amsayna wa amsal mulku lillah',
    translation: 'We have reached the evening and the dominion belongs to Allah',
    category: 'Evening',
  },
  {
    id: '4',
    title: 'Evening Remembrance',
    arabic: 'اللَّهُمَّ أَمْسَيْنَا نُشْهِدُكَ وَنُشْهِدُ حَمَلَةَ عَرْشِكَ',
    transliteration: 'Allahumma amsayna nushhiduka wa nushhidu hamalata arshika',
    translation: 'O Allah, we have reached the evening and bear witness to You and the bearers of Your Throne',
    category: 'Evening',
  },
  
  // Eating Duas
  {
    id: '5',
    title: 'Dua Before Eating',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah',
    category: 'Eating',
  },
  {
    id: '6',
    title: 'Dua After Eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا',
    transliteration: 'Alhamdulillahil lathee at\'amana wa saqana',
    translation: 'Praise be to Allah who fed us and gave us drink',
    category: 'Eating',
  },
  {
    id: '7',
    title: 'Dua When Forgetting to Say Bismillah',
    arabic: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
    transliteration: 'Bismillahi awwalahu wa akhirahu',
    translation: 'In the name of Allah at its beginning and end',
    category: 'Eating',
  },
  
  // Travel Duas
  {
    id: '8',
    title: 'Dua for Travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا',
    transliteration: 'Subhanallathee sakhkhara lana hadha',
    translation: 'Glory to Him who has subjected this to us',
    category: 'Travel',
  },
  {
    id: '9',
    title: 'Dua When Leaving Home',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ',
    transliteration: 'Bismillahi tawakkaltu ala Allah',
    translation: 'In the name of Allah, I place my trust in Allah',
    category: 'Travel',
  },
  {
    id: '10',
    title: 'Dua When Returning Home',
    arabic: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
    transliteration: 'Aibuna taibuna abiduna li rabbina hamidun',
    translation: 'We return, repentant, worshipping our Lord, praising',
    category: 'Travel',
  },
  
  // Prayer Duas
  {
    id: '11',
    title: 'Dua Before Prayer',
    arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ',
    transliteration: 'Allahumma ba\'id bayni wa bayna khataayaya',
    translation: 'O Allah, distance me from my sins',
    category: 'Prayer',
  },
  {
    id: '12',
    title: 'Dua After Prayer',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ',
    transliteration: 'Astaghfirullah allathee la ilaha illa huwa',
    translation: 'I seek forgiveness from Allah, there is no god but He',
    category: 'Prayer',
  },
  {
    id: '13',
    title: 'Dua in Sujood',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    transliteration: 'Subhana rabbiyal a\'la',
    translation: 'Glory to my Lord, the Most High',
    category: 'Prayer',
  },
  
  // Forgiveness Duas
  {
    id: '14',
    title: 'Dua for Forgiveness',
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ',
    transliteration: 'Rabbi ighfir li wa tub alayya',
    translation: 'My Lord, forgive me and accept my repentance',
    category: 'Forgiveness',
  },
  {
    id: '15',
    title: 'Istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
    transliteration: 'Astaghfirullah al-azeem',
    translation: 'I seek forgiveness from Allah, the Most Great',
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

export default function DuasScreen() {
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

  const renderDuaCard = ({ item }: { item: Dua }) => (
    <View style={styles.duaCard}>
      <View style={styles.duaHeader}>
        <Text style={styles.duaTitle}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
            size={24}
            color={favorites.includes(item.id) ? '#FF6B6B' : '#666'}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.duaContent}>
        <Text style={styles.arabicText}>{item.arabic}</Text>
        <Text style={styles.transliterationText}>{item.transliteration}</Text>
        <Text style={styles.translationText}>{item.translation}</Text>
      </View>
      
      <View style={styles.duaFooter}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={20} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search duas..."
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
    <View style={styles.container}>
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
    </View>
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
