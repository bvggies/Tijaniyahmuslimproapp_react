import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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

  const renderCategoryCard = (categoryNumber: string, title: string, content: string, color: string) => (
    <View style={styles.categoryCard}>
      <LinearGradient
        colors={[color, `${color}90`]}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.categoryHeader}>
          <View style={styles.categoryNumber}>
            <Text style={styles.categoryNumberText}>{categoryNumber}</Text>
          </View>
          <Text style={styles.categoryTitle}>{title}</Text>
        </View>
        <Text style={styles.categoryContent}>{content}</Text>
      </LinearGradient>
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
            <Text style={styles.headerTitle}>TARIQA TIJANIYA</Text>
            <Text style={styles.headerSubtitle}>Conditions of Tariqa Tijaniya</Text>
            <Text style={styles.headerArabic}>شروط الطريقة التجانية</Text>
          </View>
        </LinearGradient>

        {/* Introduction */}
        {renderSectionHeader("Introduction", "information-circle")}
        {renderInfoCard(
          "The Five Categories of Conditions",
          "The conditions of the TARIQA TIJANIYA are divided into five categories. Each category has specific requirements and guidelines that followers must adhere to for proper practice and spiritual development within the Tariqa.",
          "layers",
          colors.accentTeal
        )}

        {/* 1st Category */}
        {renderSectionHeader("1st Category - Sheikh-Disciple Relationship", "people")}
        {renderCategoryCard(
          "1",
          "Conditions Relating to the Particular Companion",
          "These are the conditions relating to the particular companion between the sheikh and his disciple:",
          colors.primary
        )}

        {renderInfoCard(
          "Exclusive Tariqa Commitment",
          "Don't have other ways with this one throughout your life. (That is you don't have to add or collect any other TARIQA to the TARIQA TIJANIYA)",
          "shield-checkmark",
          colors.success
        )}

        {renderInfoCard(
          "Limited Saint Visits",
          "Limit the visit of living or dead saints to those limited by authorization of SIDI AHMED TIJANI (RTA) but preserving the sacrality and respect of all the saints. It is permissible to visit only the companions of the PROPHET MUHAMMAD (PBUH), the people of the way and of course without the need to specify the prophets (on them prayer and peace). [Simply do not visit saints who are not in the TARIQA TIJANIYA or seek for their prayers]",
          "location",
          colors.warning
        )}

        {renderInfoCard(
          "Assiduity in Prayer",
          "The assiduity to perform prayer to death without ever abandoning it. Oration are taken under the statue of pious vow, by this means the supererogatory acts have the value of the obligatory acts.",
          "time",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Respect for Sidi Ahmed Tijani",
          "The absence of any insult, animosity or hostility towards Sidi Ahmed TIJANI (RTA). The characteristic sign of this is not to take into account its recommendations and warnings. Continuity in love with Sidi Ahmed TIJANI (RTA) without rapture. Protect yourself from any criticism of Sidi Ahmed TIJANI (RTA).",
          "heart",
          colors.primary
        )}

        {renderInfoCard(
          "Strong Belief and Faith",
          "Strong belief in Sidi Ahmed TIJANI (RTA) and his words, for they follow the HOLY BOOK and Sunnah, and do not deny them and the same regard to all Aaliyahullah. He who infringes only one of these conditions has lost his affiliation immediately and he will only be able to relate to the Sheikh after repenting and renewing his affiliation while being sincere in his follow-up.",
          "diamond",
          colors.success
        )}

        {/* 2nd Category */}
        {renderSectionHeader("2nd Category - Duties of Each Disciple", "checkmark-circle")}
        {renderCategoryCard(
          "2",
          "Duties of Each Disciple",
          "Even if this category does not fall within the scope of breaking affiliation immediately, nevertheless, it remains a duty to each disciple:",
          colors.warning
        )}

        {renderInfoCard(
          "Preservation of Shari'a",
          "Preservation of all the commandments of the law (SHARI'A) through knowledge and deeds and among this the preservation of the five daily prayers in their legal times of fulfillment in groups (if possible) by completing its conditions, its pillars, its parts, in continual devotion. Also the reading of the Basmala hung on the Fatiha in a low voice when it is in a low voice and out loud when it is out loud, outside the framework of divergence. So do the inclination and the prostration with at least three formulas of glorification.",
          "book",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Avoiding Sin and Negligence",
          "Do not believe that you are immune from the tricks of Allah. I.e. by committing sins while resting on the mercy of Allah or on the intercession of the prophet (PBUH) or the Waliyy. Do not claim to be transferred of the authorization when one does not own no authorization to do so (TITLE OF MUQADAM) for some Awliyahullah this is a sign of bad end.",
          "warning",
          colors.primary
        )}

        {renderInfoCard(
          "Respect and Brotherhood",
          "Show respect to all those affiliated with Sidi Ahmed TIJANI (RTA). Move away from the detractors of Sidi Ahmed TIJANI (RTA) because they cannot be used without causing trouble. Do not break ties with creatures away from religious necessity even more concerning his brothers in the way.",
          "people-circle",
          colors.success
        )}

        {renderInfoCard(
          "Congregational Practice",
          "Regrouping for the fulfillment of the Wazifa and the Asr, if there are brothers and the possibility. The one who violates one of these conditions, which he eagerly returns to his fulfillment that Allah will allow him to continue in the way.",
          "megaphone",
          colors.warning
        )}

        {/* 3rd Category */}
        {renderSectionHeader("3rd Category - Conditions of Validity for Prayers", "water")}
        {renderCategoryCard(
          "3",
          "Conditions of Validity for Prayers",
          "These are the conditions of validity for prayers:",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Essential Requirements",
          "• The intention (NIYAH)\n• Ritual purity by water or tayyamum according to the rules of shari'a\n• Purity of body, clothes and placed in accordance with prayer\n• Hide private parts as for prayer",
          "checkmark-done",
          colors.primary
        )}

        {renderInfoCard(
          "Silence and Focus",
          "Interruption of all words foreign to the prayers from the beginning of their completion until the end. Except out of necessity in which case we make gestures and if we are not understood, we can then say a word or two. There are three exceptions to this rule: the parents, the wife to her husband and the disciple to her sheikh.",
          "chatbubbles",
          colors.success
        )}

        {renderInfoCard(
          "Eating and Drinking Restrictions",
          "Likewise one should refrain from eating and drinking, the little invalidates the lazim but not the wazifa which is not invalidated. Than by the many (The little is a sip or what is left between the teeth). Whoever violates only one of these conditions his oration are valid and he must repeat them.",
          "restaurant",
          colors.warning
        )}

        {renderInfoCard(
          "Jawharatul Kamal Requirements",
          "For the recitation of the JAWHARATUL KAMAL: The purity of water, a pure place that can hold six people and that even to recite it once. It is not recited on a mount or on a boat. The one who does tayyamum or the one who is not washed with water for his needs or who has an impurity on his body or clothes that he cannot get rid of, instead he recites twenty salatil fathi in the wazifa and does the same to one who cannot meet his conditions.",
          "diamond",
          colors.accentTeal
        )}

        {/* 4th Category */}
        {renderSectionHeader("4th Category - Conditions of Behavior", "eye")}
        {renderCategoryCard(
          "4",
          "Conditions of Behavior for Prayer",
          "These are the conditions of behavior for the prayer which do not invalidate them if they are abandoned but which diminish their light:",
          colors.primary
        )}

        {renderInfoCard(
          "Proper Posture and Direction",
          "The seat, we do not mention it lying down or standing except with an excuse but the prayer remains valid and even when walking with the condition, however, to take care as much as possible not to step on impurities. Dealing with qibla except for the one who travels and cannot and even if the trip is a short distance.",
          "compass",
          colors.success
        )}

        {renderInfoCard(
          "Voice and Pronunciation",
          "Perform the prayers that are done alone in a low voice so as to hear the recitation without silencing the sound of Dhikir. Perform group prayers aloud but harmoniously. Understand the meaning of what one recites while distinctly pronouncing as much as possible and being careful not to scratch the pronunciation.",
          "volume-high",
          colors.warning
        )}

        {renderInfoCard(
          "Visualization",
          "Visualize the image of Sidi Ahmed TIJANI (RTA) and better that of the prophet (PBUH).",
          "eye",
          colors.accentTeal
        )}

        {/* 5th Category */}
        {renderSectionHeader("5th Category - Transmission of Affiliation", "link")}
        {renderCategoryCard(
          "5",
          "Conditions Validating Transmission",
          "These are the conditions validating the transmission of the affiliation of the route:",
          colors.primary
        )}

        {renderInfoCard(
          "Authenticity of Transmission",
          "Authenticity of the transmitter and the chain of transmission of each link up to Sidi Ahmed TIJANI RTA.",
          "shield-checkmark",
          colors.success
        )}

        {renderInfoCard(
          "Applicant's Validity",
          "Applicants validity: must be a Muslim, of genuine belief, frees from all other ways and all other prayers, being determined to be within this TARIQA all his life, accepting the conditions which are read and explained to him.",
          "person-check",
          colors.warning
        )}

        {/* Reference */}
        {renderSectionHeader("Reference", "library")}
        {renderInfoCard(
          "Source",
          "Reference: QASD SABIL BY SIDS MOHAMMED EL HAFIDH EL MISRI TIDJANI RTA",
          "book",
          colors.accentTeal
        )}

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>THE THREE OBLIGATORY LITANIES</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Introduction to Litanies */}
        {renderSectionHeader("Introduction to the Litanies", "information-circle")}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  categoryCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryGradient: {
    padding: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  categoryNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  categoryContent: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 22,
    textAlign: 'justify',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },
  cardContent: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 20,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.accentTeal,
    opacity: 0.3,
  },
  dividerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accentTeal,
    marginHorizontal: 15,
    textAlign: 'center',
    letterSpacing: 1,
  },
});

export default TijaniyaFiqhScreen;