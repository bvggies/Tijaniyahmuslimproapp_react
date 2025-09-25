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

const TijaniyaFiqhScreen: React.FC = () => {
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
            <Ionicons name="book" size={40} color="white" />
            <Text style={styles.headerTitle}>THE CONDITIONS OF TIJANIYA FIQH</Text>
            <Text style={styles.headerSubtitle}>The Three Obligatory Litanies</Text>
            <Text style={styles.headerArabic}>شروط فقه التجانية</Text>
          </View>
        </LinearGradient>

        {/* Introduction */}
        {renderSectionHeader("Introduction", "information-circle")}
        {renderInfoCard(
          "The Three Obligatory Litanies",
          "There are three obligatory litanies or 'wird': LAZIM – WAZIFA – HAILALA. The Tijaniyya litanies are all based on expressions which come from the Quran and the Sunnah. Reciting them is an inexhaustible source of blessings and neglecting or abandoning them is an opened door to misfortunes.",
          "list",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Authorization Required",
          "The litanies must be recited only with an authorization of a muqaddam whose transmittal channel is authentic. The other conditions of the validity of the mandatory litanies of the Tidjaniya are essential for proper practice.",
          "shield-checkmark",
          colors.primary
        )}

        {/* General Conditions */}
        {renderSectionHeader("General Conditions", "checkmark-circle")}
        {renderInfoCard(
          "Purification Requirements",
          "The follower must have ablution with water or Tayyamoun, according to the Sharia rules. The purification of the body, the clothes and the area, according to the prayer rules is required. The follower is required to cover his body (awrah) as for salat (prayers).",
          "water",
          colors.success
        )}

        {renderInfoCard(
          "Intention and Silence",
          "The follower must formulate the intention. The disciple must not speak during the mandatory litanies of the Tariqa Tidjaniya, from the beginning to the end, except by necessity in which case he can communicate by gestures, and if he is not understood, then he can say one or two words.",
          "chatbubbles",
          colors.warning
        )}

        {renderInfoCard(
          "Exceptions to Silence Rule",
          "There are three exceptions to this rule: the follower can answer freely when addressed by his parents, the wife (disciple) to her husband, and the follower to his Sheikh (his Muqaddam). The follower must refrain from eating and drinking during the mandatory litanies, doing such can invalidate the zikr.",
          "people",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Important Notes",
          "Anyone who does not respect one of these conditions above-cited, his evocations are invalidated and he has to do them again. Besides, it is very important to perform the Wadhifa and the 'Asrou (Hadra Friday after salatul 'Asr) in congregation whenever it is possible, pronouncing them aloud and harmoniously with the other brothers.",
          "warning",
          colors.primary
        )}

        {/* LAZIM */}
        {renderSectionHeader("I. THE LAZIM (WIRD)", "time")}
        {renderInfoCard(
          "The Three Mandatory Pillars",
          "The Lazim is composed of these three mandatory pillars (in this order):\n\n1. 'Astaghfirullah': 100 times – I am asking for forgiveness to Allah\n2. 'Salat 'ala Nabi': 100 times, which means to send prayers upon the Prophet Muhamad (peace and blessings be upon him)\n3. 'La Ilaha illallah': 100 times: 'There is no God but ALLAH'",
          "layers",
          colors.success
        )}

        {renderInfoCard(
          "Salatul Fatihi",
          "One can recite any of the salat ala nabi but the best one is Salatul Fatihi: 'Allahumma salli 'ala Sayyidinaa Muhammadin el faatihi limaa ughliqa, wal khaatimi limaa sabaqa, naasiri-l-haqqi bil haqqi wal haadi ilaa siraatiqa-l-mustaqiim, wa 'alaa aalihi haqqa qadrihi wa miqdaarihi-l-'aziim.'",
          "star",
          colors.warning
        )}

        {renderInfoCard(
          "The Power of Salatul Fatihi",
          "Seyyidina Ahmed Tijani (may ALLAH be satisfied with him) said: 'If there were 100000 communities, and each of these communities was constituted of 100000 tribes, and each of these tribes was formed of 100000 men, and each these men lived 100000 years, and each of these men recites everyday 100000 salat 'ala Nabi other than Salatul Fatihi, then all these rewards would not reach the reward of only one Salatul Fatihi.'",
          "diamond",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Completion of Lazim",
          "After the hundredth 'La Ilaha illAllah', we have to say: 'Sayyidunaa Muhammadun Rasulullah. 'alayhi Salamullah'",
          "checkmark-done",
          colors.primary
        )}

        {/* TIME OF THE WIRD */}
        {renderSectionHeader("TIME OF THE WIRD", "clock")}
        {renderInfoCard(
          "Morning Wird Timing",
          "The Lazim is an obligatory wird performed alone, in a low voice, twice a day: morning and evening. The time to perform the morning wird begins from Subh Prayer till Duha al A'la (about midday), it is the preferred time. The time of necessity, in case of valid excuse, extends from Duha al 'Ala to the Maghreb Prayer (the sunset).",
          "sunny",
          colors.success
        )}

        {renderInfoCard(
          "Evening Wird Timing",
          "The time to perform the evening wird begins from 'Asr Prayer till 'Icha Prayer, it is the preferred time. The time of necessity, in case of valid excuse, extends from 'Icha Prayer to the Fajr Prayer (the dawn).",
          "moon",
          colors.warning
        )}

        {renderInfoCard(
          "Night Recitation Benefits",
          "Seyyidina Ahmed Tijani (may ALLAH be pleased with him) said: 'The evocation of the wird during the night is equivalent to five hundred times his evocation during the day, and this is true for all good deeds.'",
          "sparkles",
          colors.accentTeal
        )}

        {/* WAZIIFA */}
        {renderSectionHeader("II. THE WAZIIFA", "people-circle")}
        {renderInfoCard(
          "Waziifa Performance",
          "The Waziifa must be performed in congregation whenever it is possible, arranging the rows properly, reciting loud. The Waziifa is composed of these four mandatory pillars (in this order).",
          "megaphone",
          colors.primary
        )}

        {renderInfoCard(
          "The Four Pillars of Waziifa",
          "a- 30 times: 'Astaghfirullah Al 'Aziim alazii laa ilaaha illaa Huwal-Hayyul-Qayyoum'\nb- 50 times Salaatul Faatihi (during the Waziifa, we can NOT recite another prayer upon the Prophet)\nc- 100 times 'La Ilaaha illa laah' then 'Seyyidunaa Muhammadu Rasoulullaah, Alayhi Salaamullaah'\nd- 12 times Djawharatul Kamaal",
          "list",
          colors.success
        )}

        {renderInfoCard(
          "Time of Waziifa",
          "The Wadhifa is to be performed once or twice a day. If the Wadhifa is accomplished twice a day, the time to perform it is the same than the Lazim. If the Wadhifa is performed only once a day, its time begins from the 'Asr Prayer to the 'Asr Prayer of the next day.",
          "time",
          colors.warning
        )}

        {renderInfoCard(
          "Women in Wazeefa",
          "Women can attend the Wazeefa: They should not occupy the same room as men. But if there is only one room for the group, they sit at the back in a discrete section. Women must not recite aloud (as for the five daily Prayers).",
          "female",
          colors.accentTeal
        )}

        {/* HAYLALA */}
        {renderSectionHeader("III. THE HAYLALA (THE HADRA OF THE FRIDAY)", "calendar")}
        {renderInfoCard(
          "Friday's Dhikr",
          "The Haylala (other names: Hadra, 'Asru) is the Friday's dhikr to perform between 'Asr and Maghreb Prayers. Like the Wadhifa, the Friday's Hadra must be performed in congregation whenever it is possible, arranging the ranks properly, reciting loud.",
          "radio",
          colors.primary
        )}

        {renderInfoCard(
          "Timing and Importance",
          "It is performed only the Friday, and only between 'Asr and Maghreb Prayers, the best time is just before the Azan of the Maghreb Prayer. If not accomplished during this lapse of time, we can't make up for it. Seyyidina Ahmed Tijani said that if it is not performed during this period without a valid excuse, the follower has to know that he has missed a huge blessing.",
          "warning",
          colors.success
        )}

        {renderInfoCard(
          "The Single Pillar",
          "The Haylala is composed of one single pillar: Recitation of 1000 or 1200 or 1600 times 'La Ilaha illAllah'",
          "repeat",
          colors.warning
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
    fontSize: 20,
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

export default TijaniyaFiqhScreen;
