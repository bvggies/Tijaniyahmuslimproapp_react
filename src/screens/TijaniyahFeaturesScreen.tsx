import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

const TijaniyahFeaturesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  
  const features = [
    {
      id: '1',
      title: 'Tariqa Tijaniyyah',
      description: 'Learn about The Tijānī Path',
      icon: 'star',
      color: colors.accentTeal,
      screen: 'TariqaTijaniyyah',
    },
    {
      id: '2',
      title: 'Tijaniya Fiqh',
      description: 'The Conditions of Tijaniya Fiqh',
      icon: 'book',
      color: colors.primary,
      screen: 'TijaniyaFiqh',
    },
    {
      id: '3',
      title: 'Resources for Beginners',
      description: 'Islamic Terms & Phrases',
      icon: 'library',
      color: colors.success,
      screen: 'ResourcesForBeginners',
    },
    {
      id: '4',
      title: 'Proof of Tasawwuf Part 1',
      description: 'Dhikr is the Greatest Obligation',
      icon: 'diamond',
      color: colors.warning,
      screen: 'ProofOfTasawwufPart1',
    },
  ];

  const renderFeatureCard = ({ item }: { item: any }) => {
    const handlePress = () => {
      if (item.screen) {
        navigation.navigate('More', { screen: item.screen });
      }
    };

    return (
      <TouchableOpacity style={styles.featureCard} activeOpacity={0.8} onPress={handlePress}>
        <LinearGradient
          colors={[item.color, `${item.color}80`]}
          style={styles.featureGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.featureIconContainer}>
            <Ionicons name={item.icon as any} size={32} color="white" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>{item.title}</Text>
            <Text style={styles.featureDescription}>{item.description}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Header */}
      <LinearGradient
        colors={[colors.accentTeal, colors.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="star" size={32} color="white" />
          <Text style={styles.headerTitle}>{t('tijaniyah.title')}</Text>
          <Text style={styles.headerSubtitle}>Authentic Tijaniyah Practices & Resources</Text>
        </View>
      </LinearGradient>

      {/* Features Section Title */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>{t('tijaniyah.title')}</Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        "The best of people are those who benefit others"
      </Text>
      <Text style={styles.footerSubtext}>
        - Prophet Muhammad (SAW)
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        
        <View style={styles.featuresGrid}>
          {features.map((item) => (
            <View key={item.id} style={styles.featureCardWrapper}>
              {renderFeatureCard({ item })}
            </View>
          ))}
        </View>
        
        {renderFooter()}
      </ScrollView>
    </View>
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
    paddingVertical: 30,
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
    textAlign: 'center',
  },
  featuresContainer: {
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
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  featureCardWrapper: {
    width: (width - 60) / 2,
    marginBottom: 15,
  },
  featureCard: {
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
  featureGradient: {
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIconContainer: {
    marginBottom: 10,
  },
  featureContent: {
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
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

export default TijaniyahFeaturesScreen;
