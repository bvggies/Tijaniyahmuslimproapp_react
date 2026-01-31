import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { useFadeIn } from '../hooks/useAnimations';

const { width } = Dimensions.get('window');

const ResourcesForBeginnersScreen: React.FC = () => {
  const opacity = useFadeIn({ duration: 380 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Terms', icon: 'list' },
    { id: 'common', name: 'Common Phrases', icon: 'chatbubbles' },
    { id: 'prayer', name: 'Prayer Terms', icon: 'time' },
    { id: 'quran', name: 'Quran Terms', icon: 'book' },
    { id: 'islamic', name: 'Islamic Concepts', icon: 'star' },
  ];

  const commonPhrases = [
    {
      term: "AL-HAMDU LILLAHI RABBIL 'ALAMIN",
      meaning: "Praise be to Allah, the Lord of the worlds.",
      description: "This is a verse from the Qur'an that Muslims recite and say many times per day. A Muslim invokes the praises of Allah before he does his daily work; and when he finishes, he thanks Allah for His favors.",
      category: 'common'
    },
    {
      term: "ALLAHU AKBAR",
      meaning: "Allah is the Greatest.",
      description: "This statement is said by Muslims numerous times. During the call for prayer, during prayer, when they are happy, and wish to express their approval of what they hear.",
      category: 'common'
    },
    {
      term: "ASSALAMU 'ALAIKUM",
      meaning: "Peace be upon you.",
      description: "This is an expression Muslims say whenever they meet one another. It is a statement of greeting with peace. Muslims try to establish peace on earth even through the friendly relation of greeting.",
      category: 'common'
    },
    {
      term: "ASTAGHFIRULLAH",
      meaning: "I ask Allah forgiveness.",
      description: "This is an expression used by a Muslim when he wants to ask Allah forgiveness. A Muslim says this phrase many times, even when he is talking to another person.",
      category: 'common'
    },
    {
      term: "BISMILLAHIR RAHMANIR RAHIM",
      meaning: "In the name of Allah, the Most Beneficent, the Most Merciful.",
      description: "This is a phrase from the Qur'an that is recited before reading the Qur'an. This phrase is also recited before doing any daily activity.",
      category: 'common'
    },
    {
      term: "IN SHA' ALLAH",
      meaning: "If Allah wills.",
      description: "When a person wishes to plan for the future, when he promises, when he makes resolutions, and when he makes a pledge, he makes them with permission and the will of Allah.",
      category: 'common'
    },
    {
      term: "MA SHA' ALLAH",
      meaning: "Whatever Allah wants.",
      description: "This is an expression that Muslims say whenever they are excited and surprised. When they wish to express their happiness, they use such an expression.",
      category: 'common'
    },
    {
      term: "LA ILAHA ILLALLAH",
      meaning: "There is no lord worthy of worship except Allah.",
      description: "This expression is the most important one in Islam. It is the creed that every person has to say to be considered a Muslim. It is part of the first pillar of Islam.",
      category: 'islamic'
    },
    {
      term: "MUHAMMADUN RASULULLAH",
      meaning: "Muhammad is the messenger of Allah.",
      description: "This statement is the second part of the first pillar of Islam. The meaning of this part is that Prophet Muhammad is the last and final prophet and messenger of Allah to mankind.",
      category: 'islamic'
    },
    {
      term: "SALLALLAHU 'ALAIHI WA SALLAM",
      meaning: "May the blessings and the peace of Allah be upon him (Muhammad).",
      description: "When the name of Prophet Muhammad (saw) is mentioned or written, a Muslim is to respect him and invoke this statement of peace upon him.",
      category: 'islamic'
    },
    {
      term: "SUBHANAHU WA TA'ALA",
      meaning: "Allah is pure of having partners and He is exalted from having a son.",
      description: "This is an expression that Muslims use whenever the name of Allah is pronounced or written. Muslims believe that Allah is the only God, the Creator of the Universe.",
      category: 'islamic'
    },
    {
      term: "JAZAKALLAHU KHAYRAN",
      meaning: "May Allah reward you for the good.",
      description: "This is a statement of thanks and appreciation to be said to the person who does a favor. Instead of saying 'thanks', the Islamic statement of thanks is to say this phrase.",
      category: 'common'
    },
    {
      term: "BARAKALLAH",
      meaning: "May the blessings of Allah (be upon you).",
      description: "This is an expression which means: 'May the blessings of Allah (be upon you).' When a Muslim wants to thank to another person, he uses different statements to express his thanks.",
      category: 'common'
    },
    {
      term: "INNA LILLAHI WA INNA ILAHI RAJI'UN",
      meaning: "We are from Allah and to Whom we are returning.",
      description: "When a Muslim is struck with a calamity, when he loses one of his loved ones, or when he has gone bankrupt, he should be patient and say this statement.",
      category: 'islamic'
    },
    {
      term: "LA HAWLA WA LA QUWWATA ILLA BILLAH",
      meaning: "There is no power and no strength save in Allah.",
      description: "This expression is read by a Muslim when he is struck by a calamity, or is taken over by a situation beyond his control. A Muslim puts his trust in the hands of Allah.",
      category: 'islamic'
    }
  ];

  const prayerTerms = [
    { term: "ADHAAN", meaning: "The Muslim Call To Prayer", category: 'prayer' },
    { term: "ASR", meaning: "The Afternoon Prayer", category: 'prayer' },
    { term: "FAJR", meaning: "The Dawn Prayer", category: 'prayer' },
    { term: "MAGHRIB", meaning: "Prayer After Sunset", category: 'prayer' },
    { term: "ISHA", meaning: "The Night Prayer", category: 'prayer' },
    { term: "DUHR", meaning: "Noon Prayer", category: 'prayer' },
    { term: "SALAT", meaning: "Prayers", category: 'prayer' },
    { term: "RAK'AH", meaning: "A Unit Of Prayer", category: 'prayer' },
    { term: "QIBLAH", meaning: "Direction In Which All Muslim Pray", category: 'prayer' },
    { term: "WUDU", meaning: "Ritual Washing With Water To Be Pure For Prayer", category: 'prayer' },
    { term: "MASJID", meaning: "Mosque", category: 'prayer' },
    { term: "IMAM", meaning: "A Leader In The Community (Also Leads Prayer)", category: 'prayer' }
  ];

  const quranTerms = [
    { term: "QUR'AN", meaning: "The Word Of God - The Final Revelation From God", category: 'quran' },
    { term: "AYAH", meaning: "A Verse Of The Holy Qur'an", category: 'quran' },
    { term: "SURAH", meaning: "A Chapter Of The Holy Qur'an", category: 'quran' },
    { term: "FATIHAH", meaning: "The Opening Chapter", category: 'quran' },
    { term: "JUZ", meaning: "A Part Of The Holy Qur'an", category: 'quran' },
    { term: "QARI", meaning: "One Who Memorizes The Qur'an By Heart", category: 'quran' },
    { term: "TAJWEED", meaning: "Recitation Of The Holy Qur'an With Precise Articulation", category: 'quran' },
    { term: "TAFSIR", meaning: "A Commentary", category: 'quran' },
    { term: "TILAWAT", meaning: "Reciting The Holy Qur'an And Conveying It's Message", category: 'quran' }
  ];

  const islamicConcepts = [
    { term: "ISLAM", meaning: "Submission To The Will Of God", category: 'islamic' },
    { term: "IMAAN", meaning: "Faith", category: 'islamic' },
    { term: "TAQWA", meaning: "Fear Of God (Fear To Do Anything That Would Displease God)", category: 'islamic' },
    { term: "TAWHEED", meaning: "The Divine Unity", category: 'islamic' },
    { term: "SUNNAH", meaning: "The Traditions And Practices Of Muhammad", category: 'islamic' },
    { term: "HADITH", meaning: "Narrations/Reports Of The Deeds And Sayings Of The Holy Prophet", category: 'islamic' },
    { term: "SHARIAH", meaning: "The Islamic Law", category: 'islamic' },
    { term: "JIHAD", meaning: "A Struggle", category: 'islamic' },
    { term: "ZAKAT", meaning: "The Muslims Wealth Tax - It Is Compulsory On All Muslims", category: 'islamic' },
    { term: "HAJJ", meaning: "Pilgrimage To Mecca During The Islamic Month Of Dhul-Hijjah", category: 'islamic' },
    { term: "RAMADAN", meaning: "The Holy Month In The Islamic Calendar", category: 'islamic' },
    { term: "JANNAH", meaning: "Paradise", category: 'islamic' },
    { term: "JAHANAM", meaning: "Hell", category: 'islamic' },
    { term: "MALAIKAH", meaning: "Angels", category: 'islamic' },
    { term: "JIN", meaning: "God's Creation Made Of Smokeless Fire", category: 'islamic' }
  ];

  const allTerms = [...commonPhrases, ...prayerTerms, ...quranTerms, ...islamicConcepts];

  const filteredTerms = allTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderTermCard = (term: any, index: number) => (
    <View key={index} style={styles.termCard}>
      <LinearGradient
        colors={[getCategoryColor(term.category), `${getCategoryColor(term.category)}80`]}
        style={styles.termGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.termHeader}>
          <Ionicons name={getCategoryIcon(term.category) as any} size={20} color="white" />
          <Text style={styles.termText}>{term.term}</Text>
        </View>
        <Text style={styles.meaningText}>{term.meaning}</Text>
        {term.description && (
          <Text style={styles.descriptionText}>{term.description}</Text>
        )}
      </LinearGradient>
    </View>
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'common': return colors.accentTeal;
      case 'prayer': return colors.primary;
      case 'quran': return colors.success;
      case 'islamic': return colors.warning;
      default: return colors.accentTeal;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'common': return 'chatbubbles';
      case 'prayer': return 'time';
      case 'quran': return 'book';
      case 'islamic': return 'star';
      default: return 'list';
    }
  };

  const renderCategoryButton = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategoryButton
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons 
        name={category.icon as any} 
        size={16} 
        color={selectedCategory === category.id ? 'white' : colors.accentTeal} 
      />
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category.id && styles.selectedCategoryButtonText
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, { opacity }]}>
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
            <Ionicons name="library" size={40} color="white" />
            <Text style={styles.headerTitle}>RESOURCES FOR BEGINNERS</Text>
            <Text style={styles.headerSubtitle}>Islamic Terms & Phrases</Text>
            <Text style={styles.headerArabic}>مصادر للمبتدئين</Text>
          </View>
        </LinearGradient>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search terms..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map(renderCategoryButton)}
          </ScrollView>
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredTerms.length} {selectedCategory === 'all' ? 'Terms' : categories.find(c => c.id === selectedCategory)?.name} Found
          </Text>
        </View>

        {/* Terms List */}
        <View style={styles.termsContainer}>
          {filteredTerms.map((term, index) => renderTermCard(term, index))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            "The best of people are those who benefit others"
          </Text>
          <Text style={styles.footerSubtext}>
            - Prophet Muhammad (SAW)
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
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
    paddingBottom: 100, // Space for floating nav bar
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
    letterSpacing: 1,
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.accentTeal,
  },
  selectedCategoryButton: {
    backgroundColor: colors.accentTeal,
  },
  categoryButtonText: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.accentTeal,
    fontWeight: '600',
  },
  selectedCategoryButtonText: {
    color: 'white',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  termsContainer: {
    paddingHorizontal: 20,
  },
  termCard: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  termGradient: {
    padding: 16,
  },
  termHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  termText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
    flex: 1,
  },
  meaningText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  descriptionText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ResourcesForBeginnersScreen;
