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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: 'general' | 'events' | 'announcements' | 'updates';
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminNewsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    category: 'general' as NewsItem['category'],
    priority: 'medium' as NewsItem['priority'],
    isPublished: false,
  });

  const categories = [
    { value: 'general', label: 'General News', color: '#2196F3' },
    { value: 'events', label: 'Events', color: '#FF9800' },
    { value: 'announcements', label: 'Announcements', color: '#4CAF50' },
    { value: 'updates', label: 'App Updates', color: '#9C27B0' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', color: '#FF9800' },
    { value: 'high', label: 'High', color: '#F44336' },
  ];

  useEffect(() => {
    loadNewsItems();
  }, []);

  const loadNewsItems = async () => {
    try {
      // TODO: Replace with actual API call
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'New Islamic Calendar Feature',
          content: 'We have added a new Islamic calendar feature with Hijri date conversion...',
          category: 'updates',
          priority: 'high',
          isPublished: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Upcoming Tijaniyya Conference',
          content: 'Join us for the annual Tijaniyya conference in Kaolack, Senegal...',
          category: 'events',
          priority: 'medium',
          isPublished: true,
          createdAt: '2024-01-10T14:30:00Z',
          updatedAt: '2024-01-10T14:30:00Z',
        },
      ];
      setNewsItems(mockNews);
    } catch (error) {
      console.error('Error loading news items:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const newsItem: NewsItem = {
        id: editingItem?.id || Date.now().toString(),
        ...formData,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingItem) {
        setNewsItems(prev => prev.map(item => 
          item.id === editingItem.id ? newsItem : item
        ));
      } else {
        setNewsItems(prev => [newsItem, ...prev]);
      }

      setShowAddModal(false);
      setEditingItem(null);
      resetForm();
      Alert.alert('Success', 'News item saved successfully');
    } catch (error) {
      console.error('Error saving news item:', error);
      Alert.alert('Error', 'Failed to save news item');
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl || '',
      category: item.category,
      priority: item.priority,
      isPublished: item.isPublished,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete News Item',
      'Are you sure you want to delete this news item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setNewsItems(prev => prev.filter(item => item.id !== id));
              Alert.alert('Success', 'News item deleted successfully');
            } catch (error) {
              console.error('Error deleting news item:', error);
              Alert.alert('Error', 'Failed to delete news item');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      category: 'general',
      priority: 'medium',
      isPublished: false,
    });
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const getPriorityInfo = (priority: string) => {
    return priorities.find(pri => pri.value === priority) || priorities[1];
  };

  const renderNewsItem = (item: NewsItem) => {
    const categoryInfo = getCategoryInfo(item.category);
    const priorityInfo = getPriorityInfo(item.priority);

    return (
      <View key={item.id} style={styles.newsItem}>
        <View style={styles.newsItemHeader}>
          <View style={styles.newsItemMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
              <Text style={styles.categoryText}>{categoryInfo.label}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: priorityInfo.color }]}>
              <Text style={styles.priorityText}>{priorityInfo.label}</Text>
            </View>
            {item.isPublished ? (
              <View style={styles.publishedBadge}>
                <Text style={styles.publishedText}>Published</Text>
              </View>
            ) : (
              <View style={styles.draftBadge}>
                <Text style={styles.draftText}>Draft</Text>
              </View>
            )}
          </View>
          <View style={styles.newsItemActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="pencil" size={16} color={colors.accentTeal} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash" size={16} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.newsItemTitle}>{item.title}</Text>
        <Text style={styles.newsItemContent} numberOfLines={3}>
          {item.content}
        </Text>
        <Text style={styles.newsItemDate}>
          Updated: {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
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
            <Text style={styles.headerTitle}>News & Updates</Text>
            <Text style={styles.headerSubtitle}>Manage app content</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setEditingItem(null);
              setShowAddModal(true);
            }}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* News List */}
      <ScrollView style={styles.content}>
        {newsItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="newspaper-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No news items yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap the + button to add your first news item</Text>
          </View>
        ) : (
          newsItems.map(renderNewsItem)
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit News Item' : 'Add News Item'}
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                placeholder="Enter news title"
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Content *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.content}
                onChangeText={(text) => setFormData(prev => ({ ...prev, content: text }))}
                placeholder="Enter news content"
                multiline
                numberOfLines={6}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Image URL</Text>
              <TextInput
                style={styles.input}
                value={formData.imageUrl}
                onChangeText={(text) => setFormData(prev => ({ ...prev, imageUrl: text }))}
                placeholder="https://example.com/image.jpg"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categorySelector}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryOption,
                      formData.category === category.value && styles.categoryOptionSelected,
                      { borderColor: category.color }
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, category: category.value as any }))}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      formData.category === category.value && { color: category.color }
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.prioritySelector}>
                {priorities.map((priority) => (
                  <TouchableOpacity
                    key={priority.value}
                    style={[
                      styles.priorityOption,
                      formData.priority === priority.value && styles.priorityOptionSelected,
                      { borderColor: priority.color }
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, priority: priority.value as any }))}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      formData.priority === priority.value && { color: priority.color }
                    ]}>
                      {priority.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  formData.isPublished && styles.checkboxChecked
                ]}
                onPress={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
              >
                <Ionicons
                  name={formData.isPublished ? "checkmark" : "checkmark-outline"}
                  size={20}
                  color={formData.isPublished ? "#FFFFFF" : colors.textSecondary}
                />
                <Text style={[
                  styles.checkboxText,
                  formData.isPublished && styles.checkboxTextChecked
                ]}>
                  Publish immediately
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                {editingItem ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
    padding: 20,
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
  newsItem: {
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
  newsItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  newsItemMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  publishedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    marginBottom: 4,
  },
  publishedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  draftBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FF9800',
    marginBottom: 4,
  },
  draftText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newsItemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  newsItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  newsItemContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  newsItemDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryOptionSelected: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  categoryOptionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  prioritySelector: {
    flexDirection: 'row',
  },
  priorityOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  priorityOptionSelected: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  priorityOptionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  checkboxChecked: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
  },
  checkboxText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  checkboxTextChecked: {
    color: '#FFFFFF',
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

export default AdminNewsScreen;
