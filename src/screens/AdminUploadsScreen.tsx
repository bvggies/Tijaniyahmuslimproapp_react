import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useFadeIn } from '../hooks/useAnimations';

interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video';
  size: number;
  url: string;
  thumbnail?: string;
  category: 'news' | 'events' | 'lessons' | 'scholars' | 'general';
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
}

const AdminUploadsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const opacity = useFadeIn({ duration: 380 });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    imagesCount: 0,
    documentsCount: 0,
  });

  const categories = [
    { value: 'news', label: 'News', color: '#2196F3' },
    { value: 'events', label: 'Events', color: '#FF9800' },
    { value: 'lessons', label: 'Lessons', color: '#4CAF50' },
    { value: 'scholars', label: 'Scholars', color: '#E91E63' },
    { value: 'general', label: 'General', color: '#607D8B' },
  ];

  const fileTypes = [
    { value: 'image', label: 'Images', icon: 'image', color: '#4CAF50' },
    { value: 'document', label: 'Documents', icon: 'document-text', color: '#2196F3' },
    { value: 'audio', label: 'Audio', icon: 'musical-notes', color: '#FF9800' },
    { value: 'video', label: 'Video', icon: 'videocam', color: '#E91E63' },
  ];

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      // TODO: Replace with actual API call
      const mockFiles: UploadedFile[] = [
        {
          id: '1',
          name: 'mosque-image.jpg',
          type: 'image',
          size: 2048576, // 2MB
          url: 'https://example.com/mosque-image.jpg',
          thumbnail: 'https://example.com/mosque-thumb.jpg',
          category: 'events',
          uploadedAt: '2024-01-15T10:00:00Z',
          uploadedBy: 'Admin',
          description: 'Mosque building progress photo',
        },
        {
          id: '2',
          name: 'islamic-lesson.pdf',
          type: 'document',
          size: 5242880, // 5MB
          url: 'https://example.com/islamic-lesson.pdf',
          category: 'lessons',
          uploadedAt: '2024-01-14T14:30:00Z',
          uploadedBy: 'Sheikh Muhammad',
          description: 'Weekly Islamic lesson material',
        },
        {
          id: '3',
          name: 'azan-recording.mp3',
          type: 'audio',
          size: 3145728, // 3MB
          url: 'https://example.com/azan-recording.mp3',
          category: 'general',
          uploadedAt: '2024-01-13T09:15:00Z',
          uploadedBy: 'Admin',
          description: 'Beautiful Azan recording from Makkah',
        },
      ];
      setFiles(mockFiles);
      calculateStats(mockFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const calculateStats = (fileList: UploadedFile[]) => {
    const totalSize = fileList.reduce((sum, file) => sum + file.size, 0);
    const imagesCount = fileList.filter(f => f.type === 'image').length;
    const documentsCount = fileList.filter(f => f.type === 'document').length;

    setStats({
      totalFiles: fileList.length,
      totalSize,
      imagesCount,
      documentsCount,
    });
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access media library');
      return false;
    }
    return true;
  };

  const handleImageUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadFile(result.assets[0], 'image');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadFile(result.assets[0], 'document');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadFile = async (file: any, type: UploadedFile['type']) => {
    setUploading(true);
    try {
      // TODO: Replace with actual upload API call
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.fileName || file.uri.split('/').pop() || 'unknown',
        type,
        size: file.fileSize || 0,
        url: file.uri, // In real app, this would be the server URL
        category: 'general',
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Admin',
      };

      setFiles(prev => {
        const updated = [newFile, ...prev];
        calculateStats(updated);
        return updated;
      });

      Alert.alert('Success', 'File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete File',
      'Are you sure you want to delete this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setFiles(prev => {
                const updated = prev.filter(file => file.id !== id);
                calculateStats(updated);
                return updated;
              });
              Alert.alert('Success', 'File deleted successfully');
            } catch (error) {
              console.error('Error deleting file:', error);
              Alert.alert('Error', 'Failed to delete file');
            }
          },
        },
      ]
    );
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const getTypeInfo = (type: string) => {
    return fileTypes.find(t => t.value === type) || fileTypes[0];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredFiles = files.filter(file => {
    const matchesCategory = filterCategory === 'all' || file.category === filterCategory;
    const matchesType = filterType === 'all' || file.type === filterType;
    
    return matchesCategory && matchesType;
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

  const renderFile = (file: UploadedFile) => {
    const categoryInfo = getCategoryInfo(file.category);
    const typeInfo = getTypeInfo(file.type);

    return (
      <View key={file.id} style={styles.fileItem}>
        <View style={styles.fileHeader}>
          <View style={styles.fileInfo}>
            <View style={[styles.fileIcon, { backgroundColor: typeInfo.color }]}>
              <Ionicons name={typeInfo.icon as any} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.fileDetails}>
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
              {file.description && (
                <Text style={styles.fileDescription} numberOfLines={2}>
                  {file.description}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(file.id)}
          >
            <Ionicons name="trash" size={16} color="#F44336" />
          </TouchableOpacity>
        </View>

        <View style={styles.fileMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
            <Text style={styles.categoryText}>{categoryInfo.label}</Text>
          </View>
          <View style={styles.fileStats}>
            <Text style={styles.fileStat}>
              <Ionicons name="person" size={12} color={colors.textSecondary} />
              {' '}{file.uploadedBy}
            </Text>
            <Text style={styles.fileStat}>
              <Ionicons name="calendar" size={12} color={colors.textSecondary} />
              {' '}{formatDate(file.uploadedAt)}
            </Text>
          </View>
        </View>

        {file.type === 'image' && file.thumbnail && (
          <View style={styles.thumbnailContainer}>
            <Image source={{ uri: file.thumbnail }} style={styles.thumbnail} />
          </View>
        )}
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity }]}>
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
            <Text style={styles.headerTitle}>File Uploads</Text>
            <Text style={styles.headerSubtitle}>Manage uploaded files</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowUploadModal(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {renderStatsCard('Total Files', stats.totalFiles.toString(), 'folder', '#2196F3')}
          {renderStatsCard('Total Size', formatFileSize(stats.totalSize), 'storage', '#4CAF50')}
          {renderStatsCard('Images', stats.imagesCount.toString(), 'image', '#FF9800')}
          {renderStatsCard('Documents', stats.documentsCount.toString(), 'document-text', '#E91E63')}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
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
                filterType === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilterType('all')}
            >
              <Text style={[
                styles.filterButtonText,
                filterType === 'all' && styles.filterButtonTextActive
              ]}>
                All Types
              </Text>
            </TouchableOpacity>
            {fileTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.filterButton,
                  filterType === type.value && styles.filterButtonActive
                ]}
                onPress={() => setFilterType(type.value)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterType === type.value && styles.filterButtonTextActive
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Files List */}
      <ScrollView style={styles.content}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsText}>
            {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} found
          </Text>
        </View>
        
        {filteredFiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-upload-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No files uploaded yet</Text>
            <Text style={styles.emptyStateSubtext}>
              {filterCategory !== 'all' || filterType !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Tap the + button to upload your first file'
              }
            </Text>
          </View>
        ) : (
          filteredFiles.map(renderFile)
        )}
      </ScrollView>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload File</Text>
            <TouchableOpacity onPress={() => setShowUploadModal(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.uploadTitle}>Choose File Type</Text>
            <Text style={styles.uploadSubtitle}>Select the type of file you want to upload</Text>

            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={styles.uploadOption}
                onPress={handleImageUpload}
                disabled={uploading}
              >
                <View style={[styles.uploadIcon, { backgroundColor: '#4CAF50' }]}>
                  <Ionicons name="image" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.uploadOptionText}>Upload Image</Text>
                <Text style={styles.uploadOptionSubtext}>JPG, PNG, GIF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadOption}
                onPress={handleDocumentUpload}
                disabled={uploading}
              >
                <View style={[styles.uploadIcon, { backgroundColor: '#2196F3' }]}>
                  <Ionicons name="document-text" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.uploadOptionText}>Upload Document</Text>
                <Text style={styles.uploadOptionSubtext}>PDF, DOC, TXT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadOption, styles.uploadOptionDisabled]}
                disabled={true}
              >
                <View style={[styles.uploadIcon, { backgroundColor: '#FF9800' }]}>
                  <Ionicons name="musical-notes" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.uploadOptionText}>Upload Audio</Text>
                <Text style={styles.uploadOptionSubtext}>MP3, WAV (Coming Soon)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadOption, styles.uploadOptionDisabled]}
                disabled={true}
              >
                <View style={[styles.uploadIcon, { backgroundColor: '#E91E63' }]}>
                  <Ionicons name="videocam" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.uploadOptionText}>Upload Video</Text>
                <Text style={styles.uploadOptionSubtext}>MP4, MOV (Coming Soon)</Text>
              </TouchableOpacity>
            </View>

            {uploading && (
              <View style={styles.uploadingContainer}>
                <Ionicons name="cloud-upload" size={32} color={colors.accentTeal} />
                <Text style={styles.uploadingText}>Uploading file...</Text>
                <Text style={styles.uploadingSubtext}>Please wait while your file is being uploaded</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </Animated.View>
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
  fileItem: {
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
  fileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fileInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  fileDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  deleteButton: {
    padding: 8,
  },
  fileMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fileStats: {
    flexDirection: 'row',
  },
  fileStat: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  thumbnailContainer: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
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
  uploadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  uploadOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  uploadOption: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  uploadOptionDisabled: {
    opacity: 0.5,
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  uploadOptionSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  uploadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  uploadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  uploadingSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default AdminUploadsScreen;
