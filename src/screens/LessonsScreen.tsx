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
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import UpgradePrompt from '../components/UpgradePrompt';
import IslamicBackground from '../components/IslamicBackground';
import { useFadeIn } from '../hooks/useAnimations';

const { width } = Dimensions.get('window');

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
  content: {
    type: 'video' | 'text' | 'quiz' | 'audio';
    title: string;
    duration?: string;
  }[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  thumbnail: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
}

export default function LessonsScreen({ navigation }: any) {
  const { authState } = useAuth();
  const opacity = useFadeIn({ duration: 400 });
  const [activeTab, setActiveTab] = useState<'courses' | 'lessons' | 'progress'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const courses: Course[] = [
    {
      id: '1',
      title: 'Quran Reading Basics',
      description: 'Learn to read the Holy Quran with proper pronunciation and tajweed rules',
      instructor: 'Shaykh Ahmad Tijani',
      totalLessons: 12,
      completedLessons: 0,
      progress: 0,
      thumbnail: '📖',
      category: 'Quran',
      level: 'Beginner',
      rating: 4.8,
      students: 1250,
    },
    {
      id: '2',
      title: 'Islamic Prayer Guide',
      description: 'Complete guide to performing Salah with proper postures and recitations',
      instructor: 'Imam Abdullah Maikano',
      totalLessons: 8,
      completedLessons: 0,
      progress: 0,
      thumbnail: '🕌',
      category: 'Prayer',
      level: 'Beginner',
      rating: 4.9,
      students: 2100,
    },
    {
      id: '3',
      title: 'Tijaniyya Tariqa',
      description: 'Understanding the spiritual path and practices of Tijaniyya',
      instructor: 'Shaykh Ibrahim Niasse',
      totalLessons: 15,
      completedLessons: 0,
      progress: 0,
      thumbnail: '🕊️',
      category: 'Spirituality',
      level: 'Intermediate',
      rating: 4.7,
      students: 890,
    },
    {
      id: '4',
      title: 'Islamic History',
      description: 'Journey through Islamic civilization and its contributions',
      instructor: 'Dr. Amina Hassan',
      totalLessons: 20,
      completedLessons: 0,
      progress: 0,
      thumbnail: '🏛️',
      category: 'History',
      level: 'Intermediate',
      rating: 4.6,
      students: 1560,
    },
    {
      id: '5',
      title: 'Arabic Language',
      description: 'Learn Arabic grammar, vocabulary, and conversation',
      instructor: 'Ustadh Muhammad Ali',
      totalLessons: 25,
      completedLessons: 0,
      progress: 0,
      thumbnail: '📚',
      category: 'Language',
      level: 'Beginner',
      rating: 4.5,
      students: 3200,
    },
    {
      id: '6',
      title: 'Fiqh Fundamentals',
      description: 'Understanding Islamic jurisprudence and legal principles',
      instructor: 'Qadi Ahmad Sukayrij',
      totalLessons: 18,
      completedLessons: 0,
      progress: 0,
      thumbnail: '⚖️',
      category: 'Fiqh',
      level: 'Advanced',
      rating: 4.8,
      students: 750,
    },
  ];

  const lessons: Lesson[] = [
    {
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
        { type: 'video', title: 'Arabic Alphabet Introduction', duration: '8 min' },
        { type: 'text', title: 'Letter Recognition Guide' },
        { type: 'quiz', title: 'Alphabet Quiz' },
      ],
    },
    {
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
        { type: 'video', title: 'Short Vowels Introduction', duration: '10 min' },
        { type: 'text', title: 'Vowel Recognition Guide' },
        { type: 'quiz', title: 'Vowels Quiz' },
      ],
    },
    {
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
        { type: 'video', title: 'Double Vowels Introduction', duration: '8 min' },
        { type: 'text', title: 'Tanween Guide' },
        { type: 'quiz', title: 'Tanween Quiz' },
      ],
    },
    {
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
        { type: 'video', title: 'Fathatain Introduction', duration: '6 min' },
        { type: 'text', title: 'Fathatain Usage Guide' },
        { type: 'quiz', title: 'Fathatain Quiz' },
      ],
    },
    {
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
        { type: 'video', title: 'Kasratain Introduction', duration: '6 min' },
        { type: 'text', title: 'Kasratain Usage Guide' },
        { type: 'quiz', title: 'Kasratain Quiz' },
      ],
    },
    {
      id: 'basic-tajweed',
      title: 'Basic Tajweed Rules',
      description: 'Essential rules for proper Quran recitation',
      category: 'Quran',
      duration: '20 min',
      level: 'Beginner',
      progress: 0,
      isCompleted: false,
      isLocked: true,
      thumbnail: '🎵',
      content: [
        { type: 'video', title: 'Tajweed Basics', duration: '12 min' },
        { type: 'audio', title: 'Practice Recitation', duration: '5 min' },
        { type: 'quiz', title: 'Tajweed Test' },
      ],
    },
    {
      id: 'wudu',
      title: 'Wudu (Ablution)',
      description: 'Step-by-step guide to performing ablution',
      category: 'Prayer',
      duration: '12 min',
      level: 'Beginner',
      progress: 0,
      isCompleted: false,
      isLocked: false,
      thumbnail: '💧',
      content: [
        { type: 'video', title: 'Wudu Demonstration', duration: '8 min' },
        { type: 'text', title: 'Wudu Steps Guide' },
        { type: 'quiz', title: 'Wudu Knowledge Check' },
      ],
    },
  ];

  const handleCoursePress = (course: Course) => {
    if (authState.isGuest) {
      setShowUpgradePrompt(true);
      return;
    }
    setSelectedCourse(course);
    // Navigate to course details or start course
  };

  const handleLessonPress = (lesson: Lesson) => {
    if (authState.isGuest) {
      setShowUpgradePrompt(true);
      return;
    }
    if (lesson.isLocked) {
      Alert.alert('Lesson Locked', 'Complete previous lessons to unlock this one.');
      return;
    }
    // Navigate to lesson detail screen
    navigation.navigate('LessonDetail', { lessonId: lesson.id });
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCourseCard = (course: Course) => (
    <TouchableOpacity
      key={course.id}
      style={styles.courseCard}
      onPress={() => handleCoursePress(course)}
    >
      <LinearGradient
        colors={[colors.surface, colors.mintSurface]}
        style={styles.courseGradient}
      >
        <View style={styles.courseHeader}>
          <Text style={styles.courseThumbnail}>{course.thumbnail}</Text>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseInstructor}>by {course.instructor}</Text>
            <Text style={styles.courseDescription}>{course.description}</Text>
          </View>
        </View>
        
        <View style={styles.courseStats}>
          <View style={styles.statItem}>
            <Ionicons name="book" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{course.totalLessons} lessons</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color={colors.accentYellow} />
            <Text style={styles.statText}>{course.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="people" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{course.students}</Text>
          </View>
        </View>

        <View style={styles.courseFooter}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{course.level}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{course.category}</Text>
          </View>
        </View>

        {course.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{course.progress}% Complete</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderLessonCard = (lesson: Lesson) => (
    <TouchableOpacity
      key={lesson.id}
      style={[styles.lessonCard, lesson.isLocked && styles.lockedCard]}
      onPress={() => handleLessonPress(lesson)}
    >
      <View style={styles.lessonHeader}>
        <Text style={styles.lessonThumbnail}>{lesson.thumbnail}</Text>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonDescription}>{lesson.description}</Text>
          <View style={styles.lessonMeta}>
            <Text style={styles.lessonDuration}>{lesson.duration}</Text>
            <Text style={styles.lessonLevel}>{lesson.level}</Text>
          </View>
        </View>
        <View style={styles.lessonStatus}>
          {lesson.isCompleted ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          ) : lesson.isLocked ? (
            <Ionicons name="lock-closed" size={24} color={colors.textSecondary} />
          ) : (
            <Ionicons name="play-circle" size={24} color={colors.accentTeal} />
          )}
        </View>
      </View>

      {lesson.progress > 0 && (
        <View style={styles.lessonProgress}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${lesson.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{lesson.progress}%</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <IslamicBackground opacity={1.0}>
      <Animated.View style={[styles.container, { opacity }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.surface, colors.background]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Islamic Lessons</Text>
        <Text style={styles.headerSubtitle}>Learn and grow in your Islamic knowledge</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses and lessons..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'courses' && styles.activeTab]}
          onPress={() => setActiveTab('courses')}
        >
          <Text style={[styles.tabText, activeTab === 'courses' && styles.activeTabText]}>
            Courses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lessons' && styles.activeTab]}
          onPress={() => setActiveTab('lessons')}
        >
          <Text style={[styles.tabText, activeTab === 'lessons' && styles.activeTabText]}>
            Lessons
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
          onPress={() => setActiveTab('progress')}
        >
          <Text style={[styles.tabText, activeTab === 'progress' && styles.activeTabText]}>
            Progress
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'courses' && (
          <View style={styles.coursesContainer}>
            {filteredCourses.map(renderCourseCard)}
          </View>
        )}

        {activeTab === 'lessons' && (
          <View style={styles.lessonsContainer}>
            {filteredLessons.map(renderLessonCard)}
          </View>
        )}

        {activeTab === 'progress' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>Learning Progress</Text>
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatNumber}>0</Text>
                  <Text style={styles.progressStatLabel}>Courses Completed</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatNumber}>0</Text>
                  <Text style={styles.progressStatLabel}>Lessons Completed</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatNumber}>0h</Text>
                  <Text style={styles.progressStatLabel}>Study Time</Text>
                </View>
              </View>
            </View>

            <View style={styles.achievementsCard}>
              <Text style={styles.achievementsTitle}>Achievements</Text>
              <View style={styles.achievementItem}>
                <Ionicons name="trophy" size={24} color={colors.accentYellow} />
                <Text style={styles.achievementText}>First Lesson</Text>
                <Text style={styles.achievementStatus}>Locked</Text>
              </View>
              <View style={styles.achievementItem}>
                <Ionicons name="medal" size={24} color={colors.accentYellow} />
                <Text style={styles.achievementText}>Course Completion</Text>
                <Text style={styles.achievementStatus}>Locked</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <UpgradePrompt
          visible={showUpgradePrompt}
          onClose={() => setShowUpgradePrompt(false)}
          onSignUp={() => {
            setShowUpgradePrompt(false);
            navigation.navigate('Register');
          }}
          onSignIn={() => {
            setShowUpgradePrompt(false);
            navigation.navigate('Login');
          }}
          feature="Lessons"
        />
      )}
      </Animated.View>
    </IslamicBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.accentTeal,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.accentTeal,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  coursesContainer: {
    gap: 16,
  },
  courseCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseGradient: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  courseThumbnail: {
    fontSize: 32,
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: colors.accentTeal,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  categoryBadge: {
    backgroundColor: colors.mintSurface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
  },
  progressContainer: {
    marginTop: 12,
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
    marginTop: 4,
    textAlign: 'right',
  },
  lessonsContainer: {
    gap: 12,
  },
  lessonCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  lockedCard: {
    opacity: 0.6,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonThumbnail: {
    fontSize: 24,
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  lessonDuration: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  lessonLevel: {
    fontSize: 12,
    color: colors.accentTeal,
    fontWeight: '600',
  },
  lessonStatus: {
    marginLeft: 12,
  },
  lessonProgress: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accentTeal,
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  achievementsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  achievementText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  achievementStatus: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
