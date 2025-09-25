import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import UpgradePrompt from '../components/UpgradePrompt';
import IslamicBackground from '../components/IslamicBackground';

const { width } = Dimensions.get('window');

interface LessonContent {
  id: string;
  type: 'text' | 'image' | 'example' | 'practice' | 'quiz';
  title?: string;
  content: string;
  arabicText?: string;
  transliteration?: string;
  translation?: string;
  imageUrl?: string;
  examples?: string[];
  practiceQuestions?: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  isCompleted: boolean;
  isLocked: boolean;
  thumbnail: string;
  content: LessonContent[];
}

export default function LessonDetailScreen({ route, navigation }: any) {
  const { lessonId } = route.params;
  const { authState } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    // Load lesson data based on lessonId
    const lessonData = getLessonData(lessonId);
    setLesson(lessonData);
  }, [lessonId]);

  const getLessonData = (id: string): Lesson => {
    const lessons: { [key: string]: Lesson } = {
      'arabic-alphabet': {
        id: 'arabic-alphabet',
        title: 'Arabic Alphabet Names',
        description: 'Learn the names and pronunciation of all 28 Arabic letters',
        category: 'Arabic Language',
        duration: '25 min',
        level: 'Beginner',
        progress: 0,
        isCompleted: false,
        isLocked: false,
        thumbnail: '🔤',
        content: [
          {
            id: 'intro',
            type: 'text',
            content: 'Welcome to the Arabic Alphabet! The Arabic alphabet consists of 28 letters, and each letter has a name. Learning the names of the letters is the first step in mastering Arabic reading and writing.',
          },
          {
            id: 'alphabet-chart',
            type: 'text',
            title: 'Arabic Alphabet Chart',
            content: 'Here is the complete Arabic alphabet with all 28 letters:\n\nأ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي\n\nEach letter has a specific name and sound. Let\'s learn them one by one.',
          },
          {
            id: 'letter-names',
            type: 'example',
            title: 'Letter Names and Pronunciation',
            content: 'Each Arabic letter has a specific name. Here are the names of all 28 letters:',
            examples: [
              'أ (Alif) - First letter of the alphabet',
              'ب (Ba) - Like "b" in "book"',
              'ت (Ta) - Like "t" in "table"',
              'ث (Tha) - Like "th" in "think"',
              'ج (Jim) - Like "j" in "jump"',
              'ح (Ha) - Harsh "h" sound',
              'خ (Kha) - Like "ch" in "Bach"',
              'د (Dal) - Like "d" in "door"',
              'ذ (Dhal) - Like "th" in "that"',
              'ر (Ra) - Like "r" in "red"',
              'ز (Zay) - Like "z" in "zebra"',
              'س (Seen) - Like "s" in "sun"',
              'ش (Sheen) - Like "sh" in "ship"',
              'ص (Sad) - Emphatic "s" sound',
              'ض (Dad) - Emphatic "d" sound',
              'ط (Ta) - Emphatic "t" sound',
              'ظ (Za) - Emphatic "z" sound',
              'ع (Ayn) - Guttural sound',
              'غ (Ghayn) - Like French "r"',
              'ف (Fa) - Like "f" in "fish"',
              'ق (Qaf) - Deep "k" sound',
              'ك (Kaf) - Like "k" in "key"',
              'ل (Lam) - Like "l" in "love"',
              'م (Meem) - Like "m" in "mother"',
              'ن (Noon) - Like "n" in "nose"',
              'ه (Ha) - Like "h" in "house"',
              'و (Waw) - Like "w" in "water"',
              'ي (Ya) - Like "y" in "yes"',
            ],
          },
          {
            id: 'examples',
            type: 'example',
            title: 'Letter Examples',
            content: 'Let\'s practice with some examples:',
            examples: [
              'أ (Alif) - like "a" in "apple"',
              'ب (Ba) - like "b" in "book"',
              'ت (Ta) - like "t" in "table"',
              'ث (Tha) - like "th" in "think"',
              'ج (Jim) - like "j" in "jump"',
            ],
          },
          {
            id: 'practice',
            type: 'practice',
            title: 'Practice Exercise',
            content: 'Match the Arabic letter with its name:',
            practiceQuestions: [
              {
                question: 'What is the name of the letter أ?',
                options: ['Alif', 'Ba', 'Ta', 'Tha'],
                correct: 0,
              },
              {
                question: 'What is the name of the letter ب?',
                options: ['Alif', 'Ba', 'Ta', 'Tha'],
                correct: 1,
              },
            ],
          },
        ],
      },
      'short-vowels': {
        id: 'short-vowels',
        title: 'Arabic Short Vowels',
        description: 'Learn the three short vowels: Fatha, Kasra, and Damma',
        category: 'Arabic Language',
        duration: '20 min',
        level: 'Beginner',
        progress: 0,
        isCompleted: false,
        isLocked: false,
        thumbnail: '🔤',
        content: [
          {
            id: 'intro',
            type: 'text',
            content: 'Arabic short vowels are essential for proper pronunciation. There are three main short vowels: Fatha, Kasra, and Damma. These vowels are written as small marks above or below the letters.',
          },
          {
            id: 'fatha',
            type: 'example',
            title: 'Fatha (َ) - Short "a" Sound',
            content: 'Fatha is a short "a" sound, written as a small diagonal line above the letter. It sounds like the "a" in "cat" or "bat".',
            examples: [
              'بَ (ba) - "ba" sound like in "bat"',
              'تَ (ta) - "ta" sound like in "cat"',
              'جَ (ja) - "ja" sound like in "jam"',
              'دَ (da) - "da" sound like in "dad"',
              'كَ (ka) - "ka" sound like in "cat"',
            ],
          },
          {
            id: 'kasra',
            type: 'example',
            title: 'Kasra (ِ) - Short "i" Sound',
            content: 'Kasra is a short "i" sound, written as a small diagonal line below the letter. It sounds like the "i" in "bit" or "sit".',
            examples: [
              'بِ (bi) - "bi" sound like in "bit"',
              'تِ (ti) - "ti" sound like in "sit"',
              'جِ (ji) - "ji" sound like in "gym"',
              'دِ (di) - "di" sound like in "did"',
              'كِ (ki) - "ki" sound like in "kit"',
            ],
          },
          {
            id: 'damma',
            type: 'example',
            title: 'Damma (ُ) - Short "u" Sound',
            content: 'Damma is a short "u" sound, written as a small "w" shape above the letter. It sounds like the "u" in "put" or "book".',
            examples: [
              'بُ (bu) - "bu" sound like in "book"',
              'تُ (tu) - "tu" sound like in "put"',
              'جُ (ju) - "ju" sound like in "jug"',
              'دُ (du) - "du" sound like in "dude"',
              'كُ (ku) - "ku" sound like in "cook"',
            ],
          },
          {
            id: 'practice',
            type: 'practice',
            title: 'Practice Exercise',
            content: 'Identify the vowel sound:',
            practiceQuestions: [
              {
                question: 'What sound does بَ make?',
                options: ['ba', 'bi', 'bu', 'be'],
                correct: 0,
              },
              {
                question: 'What sound does بِ make?',
                options: ['ba', 'bi', 'bu', 'be'],
                correct: 1,
              },
            ],
          },
        ],
      },
      'double-vowels': {
        id: 'double-vowels',
        title: 'The Double Vowel-Marks',
        description: 'Learn about Tanween: Fathatain, Kasratain, and Dammatain',
        category: 'Arabic Language',
        duration: '18 min',
        level: 'Beginner',
        progress: 0,
        isCompleted: false,
        isLocked: false,
        thumbnail: '🔤',
        content: [
          {
            id: 'intro',
            type: 'text',
            content: 'Double vowel marks (Tanween) are used to indicate indefinite nouns in Arabic. There are three types: Fathatain, Kasratain, and Dammatain.',
          },
          {
            id: 'fathatain',
            type: 'example',
            title: 'Fathatain (ً)',
            content: 'Fathatain indicates an indefinite noun with "an" sound, written as two Fatha marks.',
            examples: [
              'بَيْتاً (baytan) - "a house"',
              'كِتَاباً (kitaban) - "a book"',
              'قَلَماً (qalaman) - "a pen"',
            ],
          },
          {
            id: 'kasratain',
            type: 'example',
            title: 'Kasratain (ٍ)',
            content: 'Kasratain indicates an indefinite noun with "in" sound, written as two Kasra marks.',
            examples: [
              'بَيْتٍ (baytin) - "a house" (in genitive)',
              'كِتَابٍ (kitabin) - "a book" (in genitive)',
              'قَلَمٍ (qalamin) - "a pen" (in genitive)',
            ],
          },
          {
            id: 'dammatain',
            type: 'example',
            title: 'Dammatain (ٌ)',
            content: 'Dammatain indicates an indefinite noun with "un" sound, written as two Damma marks.',
            examples: [
              'بَيْتٌ (baytun) - "a house" (in nominative)',
              'كِتَابٌ (kitabun) - "a book" (in nominative)',
              'قَلَمٌ (qalamun) - "a pen" (in nominative)',
            ],
          },
          {
            id: 'practice',
            type: 'practice',
            title: 'Practice Exercise',
            content: 'Identify the Tanween type:',
            practiceQuestions: [
              {
                question: 'What type of Tanween is in كِتَاباً?',
                options: ['Fathatain', 'Kasratain', 'Dammatain', 'None'],
                correct: 0,
              },
              {
                question: 'What type of Tanween is in كِتَابٌ?',
                options: ['Fathatain', 'Kasratain', 'Dammatain', 'None'],
                correct: 2,
              },
            ],
          },
        ],
      },
      'fathatain': {
        id: 'fathatain',
        title: 'Short Vowel Marks - Fathatain',
        description: 'Detailed study of Fathatain and its usage',
        category: 'Arabic Language',
        duration: '15 min',
        level: 'Beginner',
        progress: 0,
        isCompleted: false,
        isLocked: false,
        thumbnail: '🔤',
        content: [
          {
            id: 'intro',
            type: 'text',
            content: 'Fathatain (ً) is one of the three Tanween marks in Arabic. It consists of two Fatha marks and indicates an indefinite noun in the accusative case.',
          },
          {
            id: 'usage',
            type: 'text',
            title: 'When to Use Fathatain',
            content: 'Fathatain is used when:\n• The noun is indefinite (not specific)\n• The noun is in the accusative case (object of a verb)\n• The noun is the object of a preposition',
          },
          {
            id: 'examples',
            type: 'example',
            title: 'Examples with Fathatain',
            content: 'Here are more examples of Fathatain usage:',
            examples: [
              'رَأَيْتُ بَيْتاً (ra\'aytu baytan) - "I saw a house"',
              'قَرَأْتُ كِتَاباً (qara\'tu kitaban) - "I read a book"',
              'كَتَبْتُ رِسَالَةً (katabtu risalatan) - "I wrote a letter"',
            ],
          },
          {
            id: 'practice',
            type: 'practice',
            title: 'Practice Exercise',
            content: 'Complete the sentence with Fathatain:',
            practiceQuestions: [
              {
                question: 'رَأَيْتُ _____ (I saw a car)',
                options: ['سَيَّارَةً', 'سَيَّارَةٌ', 'سَيَّارَةٍ', 'سَيَّارَةْ'],
                correct: 0,
              },
            ],
          },
        ],
      },
      'kasratain': {
        id: 'kasratain',
        title: 'Short Vowel Marks - Kasratain',
        description: 'Detailed study of Kasratain and its usage',
        category: 'Arabic Language',
        duration: '15 min',
        level: 'Beginner',
        progress: 0,
        isCompleted: false,
        isLocked: false,
        thumbnail: '🔤',
        content: [
          {
            id: 'intro',
            type: 'text',
            content: 'Kasratain (ٍ) is one of the three Tanween marks in Arabic. It consists of two Kasra marks and indicates an indefinite noun in the genitive case.',
          },
          {
            id: 'usage',
            type: 'text',
            title: 'When to Use Kasratain',
            content: 'Kasratain is used when:\n• The noun is indefinite (not specific)\n• The noun is in the genitive case (after prepositions)\n• The noun is part of an idafa construction',
          },
          {
            id: 'examples',
            type: 'example',
            title: 'Examples with Kasratain',
            content: 'Here are more examples of Kasratain usage:',
            examples: [
              'فِي بَيْتٍ (fi baytin) - "in a house"',
              'مِنْ كِتَابٍ (min kitabin) - "from a book"',
              'إِلَى مَدْرَسَةٍ (ila madrasatin) - "to a school"',
            ],
          },
          {
            id: 'practice',
            type: 'practice',
            title: 'Practice Exercise',
            content: 'Complete the sentence with Kasratain:',
            practiceQuestions: [
              {
                question: 'فِي _____ (in a car)',
                options: ['سَيَّارَةً', 'سَيَّارَةٌ', 'سَيَّارَةٍ', 'سَيَّارَةْ'],
                correct: 2,
              },
            ],
          },
        ],
      },
    };

    return lessons[id] || lessons['arabic-alphabet'];
  };

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const checkAnswers = () => {
    if (!lesson) return;
    
    const currentContent = lesson.content[currentContentIndex];
    if (currentContent.type !== 'practice') return;

    let correct = 0;
    const total = currentContent.practiceQuestions?.length || 0;
    
    currentContent.practiceQuestions?.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correct++;
      }
    });

    const percentage = Math.round((correct / total) * 100);
    
    Alert.alert(
      'Quiz Results',
      `You got ${correct} out of ${total} correct (${percentage}%)`,
      [{ text: 'OK' }]
    );
  };

  const renderContent = (content: LessonContent) => {
    switch (content.type) {
      case 'text':
        return (
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{content.content}</Text>
          </View>
        );

      case 'image':
        return (
          <View style={styles.contentCard}>
            <Text style={styles.contentTitle}>{content.title}</Text>
            <Text style={styles.contentText}>{content.content}</Text>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: content.imageUrl }}
                style={styles.lessonImage}
                resizeMode="contain"
              />
            </View>
          </View>
        );

      case 'example':
        return (
          <View style={styles.contentCard}>
            <Text style={styles.contentTitle}>{content.title}</Text>
            <Text style={styles.contentText}>{content.content}</Text>
            {content.examples?.map((example, index) => (
              <View key={index} style={styles.exampleItem}>
                <Text style={styles.exampleText}>{example}</Text>
              </View>
            ))}
          </View>
        );

      case 'practice':
        return (
          <View style={styles.contentCard}>
            <Text style={styles.contentTitle}>{content.title}</Text>
            <Text style={styles.contentText}>{content.content}</Text>
            {content.practiceQuestions?.map((question, qIndex) => (
              <View key={qIndex} style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.question}</Text>
                {question.options.map((option, oIndex) => (
                  <TouchableOpacity
                    key={oIndex}
                    style={[
                      styles.optionButton,
                      userAnswers[qIndex] === oIndex && styles.selectedOption,
                    ]}
                    onPress={() => handleAnswer(qIndex, oIndex)}
                  >
                    <Text style={[
                      styles.optionText,
                      userAnswers[qIndex] === oIndex && styles.selectedOptionText,
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <TouchableOpacity style={styles.checkButton} onPress={checkAnswers}>
              <Text style={styles.checkButtonText}>Check Answers</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  if (!lesson) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading lesson...</Text>
      </View>
    );
  }

  if (authState.isGuest) {
    return (
      <View style={styles.container}>
        <UpgradePrompt
          visible={true}
          onClose={() => navigation.goBack()}
          onSignUp={() => navigation.navigate('Register')}
          onSignIn={() => navigation.navigate('Login')}
        />
      </View>
    );
  }

  return (
    <IslamicBackground opacity={1.0}>
      <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.surface, colors.background]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{lesson.title}</Text>
          <Text style={styles.headerSubtitle}>{lesson.description}</Text>
        </View>
      </LinearGradient>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            { width: `${((currentContentIndex + 1) / lesson.content.length) * 100}%` }
          ]} />
        </View>
        <Text style={styles.progressText}>
          {currentContentIndex + 1} of {lesson.content.length}
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent(lesson.content[currentContentIndex])}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentContentIndex === 0 && styles.disabledButton,
          ]}
          onPress={() => setCurrentContentIndex(Math.max(0, currentContentIndex - 1))}
          disabled={currentContentIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentContentIndex === lesson.content.length - 1 && styles.disabledButton,
          ]}
          onPress={() => setCurrentContentIndex(Math.min(lesson.content.length - 1, currentContentIndex + 1))}
          disabled={currentContentIndex === lesson.content.length - 1}
        >
          <Text style={styles.navButtonText}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      </View>
    </IslamicBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentTeal,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  lessonImage: {
    width: width - 80,
    height: 200,
    borderRadius: 12,
  },
  exampleItem: {
    backgroundColor: colors.mintSurface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '500',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
  },
  optionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  selectedOptionText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  checkButton: {
    backgroundColor: colors.accentTeal,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 90, // Add extra padding for floating nav bar
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginHorizontal: 8,
  },
});
