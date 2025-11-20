import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';

interface Lesson {
  id: string;
  title: string;
  titleArabic?: string;
  description: string;
  descriptionArabic?: string;
  content: string;
  contentArabic?: string;
  category: 'tijaniyah' | 'islamic_basics' | 'quran' | 'hadith' | 'spirituality' | 'history';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  author: string;
  authorArabic?: string;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  audioUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  downloads: number;
}

const AdminLessonsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const { hasPermission } = useAdminAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [stats, setStats] = useState({
    totalLessons: 0,
    publishedLessons: 0,
    totalViews: 0,
    totalDownloads: 0,
  });

  const categories = [
    { value: 'tijaniyah', label: 'Tijaniyah Practices', color: '#4CAF50' },
    { value: 'islamic_basics', label: 'Islamic Basics', color: '#2196F3' },
    { value: 'quran', label: 'Quran Studies', color: '#FF9800' },
    { value: 'hadith', label: 'Hadith Studies', color: '#E91E63' },
    { value: 'spirituality', label: 'Spirituality', color: '#9C27B0' },
    { value: 'history', label: 'Islamic History', color: '#607D8B' },
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner', color: '#4CAF50' },
    { value: 'intermediate', label: 'Intermediate', color: '#FF9800' },
    { value: 'advanced', label: 'Advanced', color: '#F44336' },
  ];

  const statuses = [
    { value: 'published', label: 'Published', color: '#4CAF50' },
    { value: 'draft', label: 'Draft', color: '#FF9800' },
    { value: 'archived', label: 'Archived', color: '#9E9E9E' },
  ];

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      // TODO: Replace with actual API call
      const mockLessons: Lesson[] = [
        {
          id: '1',
          title: 'Introduction to Tijaniyah Tariqa',
          titleArabic: 'مقدمة في الطريقة التجانية',
          description: 'Learn the fundamentals of the Tijaniyah spiritual path',
          descriptionArabic: 'تعلم أساسيات الطريقة التجانية الروحية',
          content: 'This lesson covers the basic principles and practices of the Tijaniyah Tariqa...',
          contentArabic: 'هذا الدرس يغطي المبادئ والممارسات الأساسية للطريقة التجانية...',
          category: 'tijaniyah',
          level: 'beginner',
          duration: 45,
          author: 'Sheikh Ahmad Tijani',
          authorArabic: 'الشيخ أحمد التجاني',
          isPublished: true,
          isFeatured: true,
          tags: ['tijaniyah', 'spirituality', 'beginner'],
          audioUrl: 'https://example.com/lesson1.mp3',
          pdfUrl: 'https://example.com/lesson1.pdf',
          thumbnailUrl: 'https://example.com/lesson1.jpg',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          views: 1250,
          likes: 89,
          downloads: 156,
        },
        {
          id: '2',
          title: 'The Lazimi Prayer',
          titleArabic: 'صلاة اللازمي',
          description: 'Understanding and practicing the daily Lazimi prayer',
          descriptionArabic: 'فهم وممارسة صلاة اللازمي اليومية',
          content: 'The Lazimi prayer is one of the core practices in Tijaniyah...',
          contentArabic: 'صلاة اللازمي هي إحدى الممارسات الأساسية في التجانية...',
          category: 'tijaniyah',
          level: 'intermediate',
          duration: 60,
          author: 'Sheikh Ibrahim Niasse',
          authorArabic: 'الشيخ إبراهيم نياس',
          isPublished: true,
          isFeatured: false,
          tags: ['tijaniyah', 'prayer', 'lazimi'],
          audioUrl: 'https://example.com/lesson2.mp3',
          videoUrl: 'https://example.com/lesson2.mp4',
          thumbnailUrl: 'https://example.com/lesson2.jpg',
          createdAt: '2024-01-14T14:30:00Z',
          updatedAt: '2024-01-16T09:15:00Z',
          views: 890,
          likes: 67,
          downloads: 98,
        },
        {
          id: '3',
          title: 'Quran Recitation Rules',
          titleArabic: 'قواعد تلاوة القرآن',
          description: 'Learn proper Quran recitation techniques',
          descriptionArabic: 'تعلم تقنيات تلاوة القرآن الصحيحة',
          content: 'Proper Quran recitation requires understanding of Tajweed rules...',
          contentArabic: 'تلاوة القرآن الصحيحة تتطلب فهم قواعد التجويد...',
          category: 'quran',
          level: 'beginner',
          duration: 30,
          author: 'Qari Muhammad',
          authorArabic: 'قاري محمد',
          isPublished: false,
          isFeatured: false,
          tags: ['quran', 'recitation', 'tajweed'],
          audioUrl: 'https://example.com/lesson3.mp3',
          pdfUrl: 'https://example.com/lesson3.pdf',
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:15:00Z',
          views: 0,
          likes: 0,
          downloads: 0,
        },
      ];
      setLessons(mockLessons);
      calculateStats(mockLessons);
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };

  const calculateStats = (lessonList: Lesson[]) => {
    const publishedLessons = lessonList.filter(l => l.isPublished).length;
    const totalViews = lessonList.reduce((sum, lesson) => sum + lesson.views, 0);
    const totalDownloads = lessonList.reduce((sum, lesson) => sum + lesson.downloads, 0);

    setStats({
      totalLessons: lessonList.length,
      publishedLessons,
      totalViews,
      totalDownloads,
    });
  };

  const handleCreateLesson = async (lessonData: Partial<Lesson>) => {
    try {
      const newLesson: Lesson = {
        id: Date.now().toString(),
        title: lessonData.title || '',
        titleArabic: lessonData.titleArabic || '',
        description: lessonData.description || '',
        descriptionArabic: lessonData.descriptionArabic || '',
        content: lessonData.content || '',
        contentArabic: lessonData.contentArabic || '',
        category: lessonData.category || 'tijaniyah',
        level: lessonData.level || 'beginner',
        duration: lessonData.duration || 30,
        author: lessonData.author || '',
        authorArabic: lessonData.authorArabic || '',
        isPublished: lessonData.isPublished || false,
        isFeatured: lessonData.isFeatured || false,
        tags: lessonData.tags || [],
        audioUrl: lessonData.audioUrl,
        videoUrl: lessonData.videoUrl,
        pdfUrl: lessonData.pdfUrl,
        thumbnailUrl: lessonData.thumbnailUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        downloads: 0,
      };

      setLessons(prev => {
        const updated = [newLesson, ...prev];
        calculateStats(updated);
        return updated;
      });

      Alert.alert('Success', 'Lesson created successfully');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating lesson:', error);
      Alert.alert('Error', 'Failed to create lesson');
    }
  };

  const handleUpdateLesson = async (id: string, lessonData: Partial<Lesson>) => {
    try {
      setLessons(prev => {
        const updated = prev.map(lesson =>
          lesson.id === id
            ? { ...lesson, ...lessonData, updatedAt: new Date().toISOString() }
            : lesson
        );
        calculateStats(updated);
        return updated;
      });

      Alert.alert('Success', 'Lesson updated successfully');
      setShowEditModal(false);
      setSelectedLesson(null);
    } catch (error) {
      console.error('Error updating lesson:', error);
      Alert.alert('Error', 'Failed to update lesson');
    }
  };

  const handleDeleteLesson = (id: string) => {
    Alert.alert(
      'Delete Lesson',
      'Are you sure you want to delete this lesson? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLessons(prev => {
                const updated = prev.filter(lesson => lesson.id !== id);
                calculateStats(updated);
                return updated;
              });
              Alert.alert('Success', 'Lesson deleted successfully');
            } catch (error) {
              console.error('Error deleting lesson:', error);
              Alert.alert('Error', 'Failed to delete lesson');
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = (id: string, field: 'isPublished' | 'isFeatured') => {
    setLessons(prev => {
      const updated = prev.map(lesson =>
        lesson.id === id
          ? { ...lesson, [field]: !lesson[field], updatedAt: new Date().toISOString() }
          : lesson
      );
      calculateStats(updated);
      return updated;
    });
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const getLevelInfo = (level: string) => {
    return levels.find(l => l.value === level) || levels[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || lesson.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || lesson.level === filterLevel;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && lesson.isPublished) ||
                         (filterStatus === 'draft' && !lesson.isPublished);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  const renderStatsCard = (title: string, value: string, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{title}</Text>
        </View>
      </View>
    </View>
  );

  const renderLesson = (lesson: Lesson) => {
    const categoryInfo = getCategoryInfo(lesson.category);
    const levelInfo = getLevelInfo(lesson.level);

    return (
      <View key={lesson.id} style={styles.lessonItem}>
        <View style={styles.lessonHeader}>
          <View style={styles.lessonInfo}>
            <Text style={styles.lessonTitle} numberOfLines={2}>{lesson.title}</Text>
            {lesson.titleArabic && (
              <Text style={styles.lessonTitleArabic} numberOfLines={1}>{lesson.titleArabic}</Text>
            )}
            <Text style={styles.lessonDescription} numberOfLines={2}>{lesson.description}</Text>
          </View>
          <View style={styles.lessonActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setSelectedLesson(lesson);
                setShowEditModal(true);
              }}
            >
              <Ionicons name="create" size={16} color={colors.accentTeal} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteLesson(lesson.id)}
            >
              <Ionicons name="trash" size={16} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lessonMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
            <Text style={styles.categoryText}>{categoryInfo.label}</Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: levelInfo.color }]}>
            <Text style={styles.levelText}>{levelInfo.label}</Text>
          </View>
          <View style={styles.durationBadge}>
            <Ionicons name="time" size={12} color={colors.textSecondary} />
            <Text style={styles.durationText}>{formatDuration(lesson.duration)}</Text>
          </View>
        </View>

        <View style={styles.lessonStats}>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={14} color={colors.textSecondary} />
            <Text style={styles.statText}>{lesson.views}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={14} color={colors.textSecondary} />
            <Text style={styles.statText}>{lesson.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="download" size={14} color={colors.textSecondary} />
            <Text style={styles.statText}>{lesson.downloads}</Text>
          </View>
          <Text style={styles.authorText}>by {lesson.author}</Text>
        </View>

        <View style={styles.lessonFooter}>
          <View style={styles.statusControls}>
            <View style={styles.statusControl}>
              <Text style={styles.statusLabel}>Published</Text>
              <Switch
                value={lesson.isPublished}
                onValueChange={() => handleToggleStatus(lesson.id, 'isPublished')}
                trackColor={{ false: colors.divider, true: colors.accentTeal }}
                thumbColor={lesson.isPublished ? '#FFFFFF' : colors.textSecondary}
              />
            </View>
            <View style={styles.statusControl}>
              <Text style={styles.statusLabel}>Featured</Text>
              <Switch
                value={lesson.isFeatured}
                onValueChange={() => handleToggleStatus(lesson.id, 'isFeatured')}
                trackColor={{ false: colors.divider, true: colors.accentGreen }}
                thumbColor={lesson.isFeatured ? '#FFFFFF' : colors.textSecondary}
              />
            </View>
          </View>
          <Text style={styles.dateText}>
            Updated: {formatDate(lesson.updatedAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.accentTeal, colors.accentGreen]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Lessons Management</Text>
            <Text style={styles.headerSubtitle}>Manage educational content</Text>
          </View>
          {hasPermission('lessons', 'create') && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {renderStatsCard('Total Lessons', stats.totalLessons.toString(), 'book', '#2196F3')}
          {renderStatsCard('Published', stats.publishedLessons.toString(), 'checkmark-circle', '#4CAF50')}
          {renderStatsCard('Total Views', stats.totalViews.toLocaleString(), 'eye', '#FF9800')}
          {renderStatsCard('Downloads', stats.totalDownloads.toLocaleString(), 'download', '#E91E63')}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search lessons..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterCategory === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilterCategory('all')}
            >
              <Text style={[
                styles.filterButtonText,
                filterCategory === 'all' && styles.filterButtonTextActive
              ]}>
                All Categories
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.filterButton,
                  filterCategory === category.value && styles.filterButtonActive
                ]}
                onPress={() => setFilterCategory(category.value)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterCategory === category.value && styles.filterButtonTextActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterLevel === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilterLevel('all')}
            >
              <Text style={[
                styles.filterButtonText,
                filterLevel === 'all' && styles.filterButtonTextActive
              ]}>
                All Levels
              </Text>
            </TouchableOpacity>
            {levels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.filterButton,
                  filterLevel === level.value && styles.filterButtonActive
                ]}
                onPress={() => setFilterLevel(level.value)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterLevel === level.value && styles.filterButtonTextActive
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilterStatus('all')}
            >
              <Text style={[
                styles.filterButtonText,
                filterStatus === 'all' && styles.filterButtonTextActive
              ]}>
                All Status
              </Text>
            </TouchableOpacity>
            {statuses.map((status) => (
              <TouchableOpacity
                key={status.value}
                style={[
                  styles.filterButton,
                  filterStatus === status.value && styles.filterButtonActive
                ]}
                onPress={() => setFilterStatus(status.value)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterStatus === status.value && styles.filterButtonTextActive
                ]}>
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Lessons List */}
      <ScrollView style={styles.content}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsText}>
            {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''} found
          </Text>
        </View>
        
        {filteredLessons.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No lessons found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery || filterCategory !== 'all' || filterLevel !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters' 
                : 'Create your first lesson to get started'
              }
            </Text>
          </View>
        ) : (
          filteredLessons.map(renderLesson)
        )}
      </ScrollView>

      {/* Create/Edit Lesson Modal */}
      <Modal
        visible={showCreateModal || showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setSelectedLesson(null);
        }}
      >
        <LessonFormModal
          lesson={selectedLesson}
          isEdit={showEditModal}
          onSubmit={showEditModal ? 
            (data) => selectedLesson && handleUpdateLesson(selectedLesson.id, data) :
            handleCreateLesson
          }
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedLesson(null);
          }}
        />
      </Modal>
    </View>
  );
};

// Lesson Form Modal Component
const LessonFormModal: React.FC<{
  lesson?: Lesson | null;
  isEdit: boolean;
  onSubmit: (data: Partial<Lesson>) => void;
  onClose: () => void;
}> = ({ lesson, isEdit, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Partial<Lesson>>({
    title: '',
    titleArabic: '',
    description: '',
    descriptionArabic: '',
    content: '',
    contentArabic: '',
    category: 'tijaniyah',
    level: 'beginner',
    duration: 30,
    author: '',
    authorArabic: '',
    isPublished: false,
    isFeatured: false,
    tags: [],
    ...lesson,
  });

  const categories = [
    { value: 'tijaniyah', label: 'Tijaniyah Practices' },
    { value: 'islamic_basics', label: 'Islamic Basics' },
    { value: 'quran', label: 'Quran Studies' },
    { value: 'hadith', label: 'Hadith Studies' },
    { value: 'spirituality', label: 'Spirituality' },
    { value: 'history', label: 'Islamic History' },
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const handleSubmit = () => {
    if (!formData.title?.trim()) {
      Alert.alert('Error', 'Please enter a lesson title');
      return;
    }
    if (!formData.description?.trim()) {
      Alert.alert('Error', 'Please enter a lesson description');
      return;
    }
    if (!formData.author?.trim()) {
      Alert.alert('Error', 'Please enter an author name');
      return;
    }

    onSubmit(formData);
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          {isEdit ? 'Edit Lesson' : 'Create New Lesson'}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalContent}>
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Title (English) *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter lesson title"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Title (Arabic)</Text>
          <TextInput
            style={styles.formInput}
            placeholder="عنوان الدرس"
            value={formData.titleArabic}
            onChangeText={(text) => setFormData({ ...formData, titleArabic: text })}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Description (English) *</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="Enter lesson description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Description (Arabic)</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="وصف الدرس"
            value={formData.descriptionArabic}
            onChangeText={(text) => setFormData({ ...formData, descriptionArabic: text })}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.formRow}>
          <View style={styles.formSectionHalf}>
            <Text style={styles.formLabel}>Category</Text>
            <View style={styles.formInput}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.optionButton,
                    formData.category === category.value && styles.optionButtonActive
                  ]}
                  onPress={() => setFormData({ ...formData, category: category.value as any })}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.category === category.value && styles.optionButtonTextActive
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSectionHalf}>
            <Text style={styles.formLabel}>Level</Text>
            <View style={styles.formInput}>
              {levels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.optionButton,
                    formData.level === level.value && styles.optionButtonActive
                  ]}
                  onPress={() => setFormData({ ...formData, level: level.value as any })}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.level === level.value && styles.optionButtonTextActive
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.formSectionHalf}>
            <Text style={styles.formLabel}>Duration (minutes)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="30"
              value={formData.duration?.toString()}
              onChangeText={(text) => setFormData({ ...formData, duration: parseInt(text) || 30 })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formSectionHalf}>
            <Text style={styles.formLabel}>Author</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter author name"
              value={formData.author}
              onChangeText={(text) => setFormData({ ...formData, author: text })}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Content (English)</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="Enter lesson content"
            value={formData.content}
            onChangeText={(text) => setFormData({ ...formData, content: text })}
            multiline
            numberOfLines={6}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Content (Arabic)</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="محتوى الدرس"
            value={formData.contentArabic}
            onChangeText={(text) => setFormData({ ...formData, contentArabic: text })}
            multiline
            numberOfLines={6}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Settings</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Published</Text>
            <Switch
              value={formData.isPublished || false}
              onValueChange={(value) => setFormData({ ...formData, isPublished: value })}
              trackColor={{ false: colors.divider, true: colors.accentTeal }}
              thumbColor={formData.isPublished ? '#FFFFFF' : colors.textSecondary}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Featured</Text>
            <Switch
              value={formData.isFeatured || false}
              onValueChange={(value) => setFormData({ ...formData, isFeatured: value })}
              trackColor={{ false: colors.divider, true: colors.accentGreen }}
              thumbColor={formData.isFeatured ? '#FFFFFF' : colors.textSecondary}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.modalActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
        >
          <Text style={styles.saveButtonText}>
            {isEdit ? 'Update Lesson' : 'Create Lesson'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filtersContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.textPrimary,
  },
  filterRow: {
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.divider,
    marginRight: 8,
    backgroundColor: colors.background,
  },
  filterButtonActive: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsHeader: {
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  lessonItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lessonInfo: {
    flex: 1,
    marginRight: 12,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  lessonTitleArabic: {
    fontSize: 14,
    color: colors.accentTeal,
    marginBottom: 4,
    textAlign: 'right',
  },
  lessonDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  lessonActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  lessonStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  authorText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 'auto',
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  statusControls: {
    flexDirection: 'row',
  },
  statusControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  formSectionHalf: {
    flex: 1,
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  optionButtonActive: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
  },
  optionButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.accentTeal,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AdminLessonsScreen;
