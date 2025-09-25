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
import { colors } from '../utils/theme';

const { width } = Dimensions.get('window');

const TariqaTijaniyyahScreen: React.FC = () => {
  const renderInfoCard = (title: string, content: string, icon: string, color: string) => (
    <View style={styles.infoCard}>
      <LinearGradient
        colors={[color, `${color}80`]}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <Ionicons name={icon as any} size={24} color="white" />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={styles.cardContent}>{content}</Text>
      </LinearGradient>
    </View>
  );

  const renderSectionHeader = (title: string, icon: string) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon as any} size={28} color={colors.accentTeal} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
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
            <Ionicons name="star" size={40} color="white" />
            <Text style={styles.headerTitle}>TARIQA TIJANIYYAH</Text>
            <Text style={styles.headerSubtitle}>The Tijānī Path</Text>
            <Text style={styles.headerArabic}>الطريقة التجانية</Text>
          </View>
        </LinearGradient>

        {/* Introduction */}
        {renderSectionHeader("Introduction", "book")}
        {renderInfoCard(
          "What is Tariqa Tijaniyyah?",
          "The Tijāniyyah (Arabic: الطريقة التجانية, transliterated: Al-Ṭarīqah al-Tijāniyyah, or 'The Tijānī Path') is a sufi tariqa (order, path) originating in North Africa but now more widespread in West Africa, particularly in Senegal, The Gambia, Mauritania, Mali, and Northern Nigeria and Sudan. Its adherents are called Tijānī (spelled Tijaan or Tiijaan in Wolof, Tidiane or Tidjane in French).",
          "information-circle",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Core Principles",
          "Tijānī attach a large importance to culture and education, and emphasize the individual adhesion of the disciple (murīd). To become a member of the order, one must receive the Tijānī wird, or a sequence of holy phrases to be repeated twice daily, from a muqaddam, or representative of the order.",
          "school",
          colors.primary
        )}

        {/* Foundation */}
        {renderSectionHeader("Foundation of the Order", "flag")}
        {renderInfoCard(
          "Founder: Sīdī 'Aḥmad al-Tijānī",
          "Sīdī 'Aḥmad al-Tijānī (1737–1815), who was born in Algeria and died in Fes, Morocco, founded the Tijānī order around 1781. Tijānī Islam, an 'Islam for the poor,' reacted against the conservative, hierarchical Qadiriyyah brotherhood then dominant, focusing on social reform and grass-roots Islamic revival.",
          "person",
          colors.success
        )}

        {/* Expansion */}
        {renderSectionHeader("Expansion in West Africa", "globe")}
        {renderInfoCard(
          "Early Expansion",
          "Although several other Sufi orders overshadow the Tijāniyyah in its birthplace of North Africa, the order has become the largest Sufi order in West Africa and continues to expand rapidly. It was brought to southern Mauritania around 1789 by Muḥammad al-Ḥāfiẓ of the 'Idaw `Ali tribe.",
          "trending-up",
          colors.warning
        )}

        {renderInfoCard(
          "Key Figures: Omar Tall",
          "Muḥammad al-Ḥāfiẓ's disciple Mawlūd Vāl initiated the 19th-century Fulbe leader Al-Ḥājj Omar Tall (Allaaji Omar Taal) and the Fulbe cleric `Abd al-Karīm an-Nāqil from Futa Jalon (modern Guinea) into the order. After receiving instruction from Muḥammad al-Ghālī from 1828 to 1830 in Makka, Omar Tall was appointed Khalīfa (successor or head representative) of Aḥmed at-Tijānī for all of the Western Sudan.",
          "people",
          colors.accentTeal
        )}

        {renderInfoCard(
          "El-Hajj Malick Sy",
          "In Senegal's Wolof country, especially the northern regions of Kajoor and Jolof, the Tijānī Order was spread primarily by El-Hajj Malick Sy (spelled 'El-Hadji Malick Sy' in French, 'Allaaji Maalig Si' in Wolof), born in 1855 near Dagana. In 1902, he founded a zāwiya (religious center) in Tivaouane (Tiwaawan), which became a center for Islamic education and culture under his leadership.",
          "library",
          colors.primary
        )}

        {renderInfoCard(
          "Ibrahima Niass - The Fayḍah",
          "The branch founded by Abdoulaye Niass's son, Al-Hadj Ibrahima Niass (Allaaji Ibrayima Ñas, often called 'Baye' or 'Baay', which is 'father' in Wolof), in the Kaolack suburb of Medina Baye in 1930, has become by far the largest and most visible Tijānī branch around the world today. Ibrahima Niass's teaching that all disciples, and not only specialists, can attain a direct mystical knowledge of God through tarbiyyah rūhiyyah (mystical education) has struck a chord with millions worldwide.",
          "star",
          colors.success
        )}

        {/* Jihad States */}
        {renderSectionHeader("Tijaniyah Jihad States", "shield")}
        {renderInfoCard(
          "Tijaniyya Jihad State",
          "The Tijaniyya Jihad state was founded on 10 March 1861 by `Umar ibn Sa`id in Segu (the traditional ruler style Fama was continued by the autochthonous dynasty in part of the state until the 1893 French takeover), using the ruler title Imam, also styled Amir al-Muslimin; in 1862 Masina (ruler title Ardo) is incorporated into Tijaniyya Jihad state.",
          "flag",
          colors.warning
        )}

        {renderInfoCard(
          "Dina (Sise Jihad State)",
          "Dina (the Sise Jihad state), in 1818 founded by Shaykhu Ahmadu, ruler title Imam (also styled Amir al-Mu´minin); on 16 May 1862 conquered by the Tijaniyya Jihad state.",
          "home",
          colors.accentTeal
        )}

        {/* Practices */}
        {renderSectionHeader("Practices", "heart")}
        {renderInfoCard(
          "The Tijānī Wird",
          "Upon entering the order, one receives the Tijānī wird from a muqaddam or representative of the order. The muqaddam explains to the initiate the duties of the order, which include keeping the basic tenets of Islam (including the five pillars of Islam), to honor and respect one's parents, and not to follow another Sufi order in addition to the Tijāniyya. Initiates are to pronounce the Tijānī wird (a process that usually takes ten to fifteen minutes) every morning and afternoon.",
          "time",
          colors.primary
        )}

        {renderInfoCard(
          "The Wird Formula",
          "The wird is a formula that includes repetitions of 'Lā 'ilāha 'ilā Llāh' ('There is no God but Allah'), 'Astaghfiru Llāh' ('I ask God for forgiveness'), and a prayer for Muḥammad called the Ṣalātu l-Fātiḥ (Prayer of the Opener).",
          "bookmark",
          colors.success
        )}

        {renderInfoCard(
          "Waẓīfah and Ḥaḍarat al-Jumʿah",
          "They are also to participate in the Waẓīfah, a similar formula that is chanted as a group, often at a mosque, after the sundown prayer (maghrib), as well as in the Ḥaḍarat al-Jumʿah, another formula chanted among other disciples on Friday afternoon.",
          "people-circle",
          colors.warning
        )}

        {renderInfoCard(
          "Dhikr and Meetings",
          "Additionally, disciples in many areas organize regular meetings, often on Thursday evenings or before or after Waẓīfa and Ḥaḍarat al-Jumʿah, to engage in dhikr Allāh, or mentioning God. This consists in repeating the phrase 'Lā 'ilāha 'ilā Llāh' or simply 'Allāh' as a group.",
          "chatbubbles",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Mawlid an-nabawī (Gàmmu)",
          "The most important communal event of the year for most Tijānī groups is the Mawlid an-nabawī (known in Wolof as the Gàmmu, spelled Gamou in French), or the celebration of the birth of Muḥammad, which falls on the night of the 12th of the Islamic month of Rabīʿ al-'Awwal. Most major Tijānī religious centers organize a large Mawlid event once a year, and hundreds of thousands of disciples attend the largest ones.",
          "calendar",
          colors.primary
        )}

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
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  headerArabic: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },
  cardContent: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 22,
    textAlign: 'justify',
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

export default TariqaTijaniyyahScreen;
