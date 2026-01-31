import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { useFadeIn } from '../hooks/useAnimations';

const { width } = Dimensions.get('window');

const ProofOfTasawwufPart1Screen: React.FC = () => {
  const opacity = useFadeIn({ duration: 380 });
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

  const renderQuoteCard = (quote: string, author: string, color: string) => (
    <View style={styles.quoteCard}>
      <LinearGradient
        colors={[color, `${color}80`]}
        style={styles.quoteGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="quote" size={24} color="white" style={styles.quoteIcon} />
        <Text style={styles.quoteText}>{quote}</Text>
        <Text style={styles.quoteAuthor}>- {author}</Text>
      </LinearGradient>
    </View>
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
            <Text style={styles.headerTitle}>PROOF OF TASAWWUF PART 1</Text>
            <Text style={styles.headerSubtitle}>Dhikr is the Greatest Obligation</Text>
            <Text style={styles.headerArabic}>دليل التصوف الجزء الأول</Text>
          </View>
        </LinearGradient>

        {/* Main Title */}
        {renderSectionHeader("DHIKR IS THE GREATEST OBLIGATION AND A PERPETUAL DIVINE ORDER", "star")}
        
        {renderInfoCard(
          "The Excellence of Dhikr",
          "Dhikr of Allah is the most excellent act of Allah's servants and is stressed over a hundred times in the Holy Qur'an. It is the most praiseworthy work to earn Allah's pleasure, the most effective weapon to overcome the enemy, and the most deserving of deeds in reward. It is the flag of Islam, the polish of hearts, the essence of the science of faith, the immunization against hypocrisy, the head of worship, and the key of all success.",
          "diamond",
          colors.accentTeal
        )}

        {renderInfoCard(
          "No Restrictions on Dhikr",
          "There are no restrictions on the modality, frequency, or timing of dhikr whatsoever. The restrictions on modality pertain to certain specific obligatory acts which are not the issue here, such as Salat. The Shari'a is clear and everyone knows what they have to do. Indeed, the Prophet said that the People of Paradise will only regret one thing: not having made enough dhikr in the world!",
          "unlock",
          colors.primary
        )}

        {/* Quranic Evidence */}
        {renderSectionHeader("Quranic Evidence", "book")}
        
        {renderQuoteCard(
          "O Believers, make abundant mention of ALLAH!",
          "Quran 33:41",
          colors.success
        )}

        {renderQuoteCard(
          "Those who remember their Lord standing, and sitting, and lying on their sides",
          "Quran 3:191",
          colors.warning
        )}

        {renderInfoCard(
          "The Prophet's Constant Dhikr",
          "A'isha said, as narrated by Muslim, that the Prophet mentioned/remembered Allah at all times of the day and night. The Prophet said: 'If your hearts were always in the state that they are in during dhikr, the angels would come to see you to the point that they would greet you in the middle of the road.'",
          "heart",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Paradise Regret",
          "Mu'adh ibn Jabal said that the Prophet also said: 'The People of Paradise will not regret except one thing alone: the hour that passed them by and in which they made no remembrance of Allah.'",
          "time",
          colors.primary
        )}

        {/* Dhikr Above Prayer */}
        {renderSectionHeader("Dhikr Above Prayer in Value", "trending-up")}
        
        {renderQuoteCard(
          "Lo! Worship guards one from lewdness and iniquity, but verily, remembrance of Allah is greater/more important.",
          "Quran 29:45",
          colors.success
        )}

        {renderQuoteCard(
          "He is successful who purifies himself, and remembers the name of his Lord, and so prays.",
          "Quran 87:14-15",
          colors.warning
        )}

        {renderQuoteCard(
          "So establish prayer for My remembrance.",
          "Quran 20:14",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Ibn Hajar's Explanation",
          "Ibn Hajar in his Fath al-bari relates Qadi Abu Bakr Ibn al-'Arabi's explanation that there is no good deed except with dhikr as a precondition for its validity, and whoever does not remember Allah in his heart at the time of his sadaqa or fasting, for example, then his deed is incomplete: therefore dhikr is the best of deeds because of this.",
          "checkmark-circle",
          colors.primary
        )}

        {/* The Cursed Earth */}
        {renderSectionHeader("The Earth and Everything in It", "globe")}
        
        {renderInfoCard(
          "Abu Hurayra's Narration",
          "Abu Hurayra said that the Prophet said, Peace be upon him: 'The earth and everything in it is cursed, except for dhikr and what attends dhikr, and a teacher (of dhikr) and a student (of dhikr).' By the words 'the world and everything in it' is meant here all that claims status or existence apart from Allah instead of in Him.",
          "shield",
          colors.success
        )}

        {renderInfoCard(
          "All Creation Does Dhikr",
          "In fact, all creation does dhikr because Allah said that all creation does praise to Him constantly, and tasbih is a kind of dhikr. Allah said of the Prophet Yunus, when the whale swallowed him: 'Had he not been one of My glorifiers (musabbihin), he would have remained inside the whale's stomach until Judgment Day.'",
          "leaf",
          colors.warning
        )}

        {/* Highest Rank */}
        {renderSectionHeader("The Highest Rank Before Allah", "trophy")}
        
        {renderInfoCard(
          "People Who Call on Allah Without Distraction",
          "The people who call on Allah without distraction have been mentioned in Qur'an, as well as the effect that calling has on their heart: 'In houses which Allah has allowed to be raised to honor and for His Name to be remembered in them; He is glorified there day and night by men whom neither trade nor sale can divert from the remembrance of Allah'",
          "home",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Heart Satisfaction",
          "'Those who believe, and their hearts find satisfaction in the remembrance of Allah: By remembering Allah, truly satisfaction comes to the heart' (13:28).",
          "heart-circle",
          colors.primary
        )}

        {/* Isra and Miraj Story */}
        {renderSectionHeader("The Man in the Light of the Throne", "flash")}
        
        {renderInfoCard(
          "During Isra' and Mi'raj",
          "During the night of Isra' and Mi'raj, the Prophet was taken up to a point where he heard the screeching of the Pens (writing the divine Decree). He saw a man who had disappeared into the light of the Throne. He said: 'Who is this? Is this an angel?' It was said to him, no. He said: 'Is it a Prophet?' Again the answer was no. He said: 'Who is it then?' The answer was: 'This is a man whose tongue was moist with Allah's remembrance in the world, and his heart was attached to the mosques, and he never incurred the curse of his father and mother.'",
          "person",
          colors.success
        )}

        {/* Keep Your Tongue Moist */}
        {renderSectionHeader("Keep Your Tongue Moist with Dhikr", "water")}
        
        {renderInfoCard(
          "The Prophet's Advice",
          "A man came to the Prophet and said, 'O Rasulallah, the laws and conditions of Islam have become too many for me. Tell me something that I can always keep.' The Prophet said: '(I am advising you in one thing:) Keep your tongue always moist with dhikrullah.'",
          "chatbubbles",
          colors.warning
        )}

        {/* Dhikr Above Jihad */}
        {renderSectionHeader("Dhikr Above Jihad", "shield-checkmark")}
        
        {renderInfoCard(
          "Abu al-Darda's Narration",
          "The Prophet once asked his companions: 'Shall I tell you about the best of all deeds, the best act of piety in the eyes of your Lord, which will elevate your status in the Hereafter, and carries more virtue than the spending of gold and silver in the service of Allah or taking part in jihad and slaying or being slain in the path of Allah? The dhikr of Allah.'",
          "star",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Abu Sa'id's Narration",
          "The Prophet was asked, 'Which of the servants of Allah is best in rank before Allah on the Day of resurrection?' He said: 'The ones who remember him much.' I said: 'O Messenger of Allah, what about the fighter in the way of Allah?' He answered: 'Even if he strikes the unbelievers and mushrikin with his sword until it broke, and becomes red with their blood, truly those who do dhikr are better than him in rank.'",
          "sword",
          colors.primary
        )}

        {renderInfoCard(
          "Ibn Umar's Narration",
          "Abd Allah ibn Umar said that the Prophet used to say: 'Everything has a polish, and the polish of hearts is dhikr of Allah. Nothing is more calculated to rescue from Allah's punishment than dhikr of Allah.' He was asked whether this did not apply also to jihad in Allah's path, and he replied: 'Not even if one should ply his sword until it breaks.'",
          "diamond",
          colors.success
        )}

        {/* Meanings of Dhikr */}
        {renderSectionHeader("Meanings of Dhikr", "layers")}
        
        {renderInfoCard(
          "Multiple Meanings",
          "The word dhikr has many meanings. It means: Allah's Book and its recitation; Prayer; Learning and teaching; Invocation of Allah with the tongue according to one of the formulas taught by the Prophet or any other formula; Remembrance of Allah in the heart, or in both the heart and the tongue.",
          "book-open",
          colors.warning
        )}

        {renderInfoCard(
          "The Best Dhikr",
          "The Prophet's saying in Tirmidhi and Ibn Majah from Ibn Jubayr: 'The best dhikr is La ilaha illallah.' The Prophet did not say, 'the best dhikr is making a lecture'; or 'giving advice'; or 'raising funds.'",
          "medal",
          colors.accentTeal
        )}

        {renderInfoCard(
          "The Single-Hearted",
          "The Prophet both praised and explained what is in the verse when he said, as it is related in Muslim, 'The single-hearted are foremost.' When he was asked, 'O Messenger of Allah, who are the single-hearted?' he replied, 'The men and women who remember Allah abundantly.'",
          "heart",
          colors.primary
        )}

        {/* Three Types of Dhikr */}
        {renderSectionHeader("Three Types of Dhikr", "apps")}
        
        {renderInfoCard(
          "Dhikr of the Heart",
          "Remembrance of Allah in the heart, as in the verse: 'The men and women who remember Allah abundantly' (33:35). The Prophet further elucidated the role of the heart in effecting such remembrance when he said to Abu Hurayra: 'Go with these two sandals of mine and whoever you meet behind this wall that witnesses that there is no god except Allah with certitude in his heart, give him glad tidings that he will enter Paradise.'",
          "heart-circle",
          colors.success
        )}

        {renderInfoCard(
          "Dhikr of the Tongue",
          "Invocation of Allah with the tongue according to one of the formulas taught by the Prophet or any other formula. What is meant by dhikr here is the utterance of the expressions which we have been encouraged to say, and say abundantly, such as the enduring good deeds — al-baqiyat al-salihat — and they are: subhan allah, al-hamdu lillah, la ilaha illallah, allahu akbar.",
          "chatbubbles",
          colors.warning
        )}

        {renderInfoCard(
          "Dhikr of Both Together",
          "Dhikr may sometimes mean both inner remembrance and outward mention, as in the verse 'Remember Me, and I shall remember you' (2:152) when it is read in the light of the hadith qudsi, 'Those that remember Me in their heart, I remember them in My heart; and those that remember Me in a gathering (i.e. that make mention of Me), I remember them (i.e. make mention of them) in a gathering better than theirs.'",
          "people",
          colors.accentTeal
        )}

        {/* Seven Aspects of Dhikr */}
        {renderSectionHeader("Seven Aspects of Dhikr", "grid")}
        
        {renderInfoCard(
          "Complete Dhikr",
          "It is reported from some of the Knowers of Allah that dhikr has seven aspects: dhikr of the eyes, which consists in weeping (buka'); dhikr of the ears, which consists in listening (isgha'); dhikr of the tongue, which consists in praise (thana'); dhikr of the hands, which consists in giving ('ata'); dhikr of the body, which consists in loyalty (wafa'); dhikr of the heart, which consists in fear and hope (kawf wa raja'); dhikr of the spirit, which consists of utter submission and acceptance (taslim wa rida').",
          "body",
          colors.primary
        )}

        {/* Loudness in Dhikr */}
        {renderSectionHeader("Loudness in Dhikr", "volume-high")}
        
        {renderInfoCard(
          "The Prophet Praised Loud Dhikr",
          "The Prophet praised a man who was awwah — literally: one who says ah, ah! — that is: loud in his dhikr, even when others censured him. Ahmad narrated with a good chain in his Musnad from Uqba ibn Amir: 'The Prophet said of a man named Dhu al-bijadayn: innahu awwah, He is a man who says ah a lot. This is because he was a man abundant in his dhikr of Allah in Qur'an-recitation, and he would raise his voice high when supplicating.'",
          "megaphone",
          colors.success
        )}

        {renderInfoCard(
          "Prophet Ibrahim as Awwah",
          "Allah said of the Prophet Ibrahim: 'Verily, Ibrahim is awwah and halim' (9:114, 11:75), that is, according to Tafsir al-jalalayn: 'Crying out and suffering much, out of fear and dread of his Lord.' The Prophet prayed to be awwah in the following invocation: rabbi ij'alni ilayka awwahan, 'O Allah, make me one who often cries out ah to you.'",
          "person-circle",
          colors.warning
        )}

        {/* Collective Dhikr */}
        {renderSectionHeader("Gatherings of Collective, Loud Dhikr", "people-circle")}
        
        {renderInfoCard(
          "Angels Roaming the Roads",
          "The Prophet said that Allah has angels roaming the roads to find the people of dhikr, i.e. those who say La Ilaha Illallah and similar expressions, and when they find a group of people (qawm) reciting dhikr, they call each other and encompass them in layers until the first heaven. Allah asks His angels, 'What are my servants saying?' The angels say: 'They are praising You (tasbih) and magnifying Your Name (takbir) and glorifying You (tahmid), and giving You the best Attributes (tamjid).'",
          "cloud",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Allah's Forgiveness",
          "Allah says: 'I am making you witness that I have forgiven them.' One of the angels says: 'O my Lord, someone was there who did not belong to that group, but came for some other need.' Allah says: 'Those are such a group that anyone who sits with them — no matter for what reason — that person will also have his sins forgiven.'",
          "checkmark-done-circle",
          colors.primary
        )}

        {renderInfoCard(
          "Imam Ahmad Mashhur al-Haddad's Explanation",
          "This hadith indicates what merit lies in gathering for dhikr, and in everyone present doing it aloud and in unison, because of the phrases: 'They are invoking You' in the plural, and 'They are the people who sit,' meaning those who assemble for remembrance and do it in unison, something which can only be done aloud, since someone whose dhikr is silent has no need to seek out a session in someone else's company.",
          "library",
          colors.success
        )}

        {/* The Single-Hearted */}
        {renderSectionHeader("The Single-Hearted (Al-Mufarridun)", "heart")}
        
        {renderInfoCard(
          "They Have Surpassed All",
          "Allah has bestowed a special distinction upon those who remember Him. The Prophet, peace be upon him, said, 'The single-hearted (al-mufarridun) have surpassed all.' They asked, 'Who are these single-hearted people, O Prophet of Allah?' He replied, 'Those men and women who remember Allah unceasingly.'",
          "trophy",
          colors.warning
        )}

        {renderInfoCard(
          "Ibn Qayyim's Explanation",
          "Ibn Qayyim al-Jawziyya in Madarij al-salikin explains that the term mufarridun has two meanings here: either the muwahidun, the people engaged in tawhid who declare Allah's Oneness as a group (i.e. not necessarily alone), or those whom he calls ahad furada, the same people as (single) individuals sitting alone (in isolation).",
          "book",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Do Not Care What People Say",
          "In another explanation of mufarridun also cited by Ibn Qayyim, the meaning is 'those that tremble from reciting dhikrullah, entranced with it perpetually, not caring what people say or do about them.' This is because the Prophet said: udhkur Allaha hatta yaqulu majnun 'Remember / mention Allah as much as you want, until people say that you are crazy and foolish' — that is: do not care about them!",
          "shield",
          colors.primary
        )}

        {renderInfoCard(
          "The Living and the Dead",
          "The mufarridun are the people who are really alive. Abu Musa reported, 'The likeness of the one who remembers his Lord and the one who does not remember Him is like that of a living to a dead person.'",
          "pulse",
          colors.success
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  headerArabic: {
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
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
  quoteCard: {
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
  quoteGradient: {
    padding: 20,
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 10,
  },
  quoteAuthor: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '600',
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

export default ProofOfTasawwufPart1Screen;
