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

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  imageUrl?: string;
  category: 'conference' | 'seminar' | 'workshop' | 'celebration' | 'other';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isPublished: boolean;
  maxAttendees?: number;
  registrationRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminEventsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    imageUrl: '',
    category: 'conference' as Event['category'],
    status: 'upcoming' as Event['status'],
    isPublished: false,
    maxAttendees: '',
    registrationRequired: false,
  });

  const categories = [
    { value: 'conference', label: 'Conference', color: '#2196F3' },
    { value: 'seminar', label: 'Seminar', color: '#4CAF50' },
    { value: 'workshop', label: 'Workshop', color: '#FF9800' },
    { value: 'celebration', label: 'Celebration', color: '#E91E63' },
    { value: 'other', label: 'Other', color: '#607D8B' },
  ];

  const statuses = [
    { value: 'upcoming', label: 'Upcoming', color: '#4CAF50' },
    { value: 'ongoing', label: 'Ongoing', color: '#FF9800' },
    { value: 'completed', label: 'Completed', color: '#9E9E9E' },
    { value: 'cancelled', label: 'Cancelled', color: '#F44336' },
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      // TODO: Replace with actual API call
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Annual Tijaniyya Conference',
          description: 'Join us for the annual Tijaniyya conference featuring renowned scholars and spiritual leaders.',
          location: 'Kaolack, Senegal',
          startDate: '2024-03-15',
          endDate: '2024-03-17',
          startTime: '09:00',
          endTime: '18:00',
          category: 'conference',
          status: 'upcoming',
          isPublished: true,
          maxAttendees: 500,
          registrationRequired: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Islamic Knowledge Workshop',
          description: 'A comprehensive workshop on Islamic jurisprudence and spirituality.',
          location: 'Online',
          startDate: '2024-02-20',
          endDate: '2024-02-20',
          startTime: '14:00',
          endTime: '17:00',
          category: 'workshop',
          status: 'upcoming',
          isPublished: true,
          registrationRequired: false,
          createdAt: '2024-01-10T14:30:00Z',
          updatedAt: '2024-01-10T14:30:00Z',
        },
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const event: Event = {
        id: editingEvent?.id || Date.now().toString(),
        ...formData,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        createdAt: editingEvent?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingEvent) {
        setEvents(prev => prev.map(item => 
          item.id === editingEvent.id ? event : item
        ));
      } else {
        setEvents(prev => [event, ...prev]);
      }

      setShowAddModal(false);
      setEditingEvent(null);
      resetForm();
      Alert.alert('Success', 'Event saved successfully');
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', 'Failed to save event');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      imageUrl: event.imageUrl || '',
      category: event.category,
      status: event.status,
      isPublished: event.isPublished,
      maxAttendees: event.maxAttendees?.toString() || '',
      registrationRequired: event.registrationRequired,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setEvents(prev => prev.filter(item => item.id !== id));
              Alert.alert('Success', 'Event deleted successfully');
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      imageUrl: '',
      category: 'conference',
      status: 'upcoming',
      isPublished: false,
      maxAttendees: '',
      registrationRequired: false,
    });
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const getStatusInfo = (status: string) => {
    return statuses.find(stat => stat.value === status) || statuses[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderEvent = (event: Event) => {
    const categoryInfo = getCategoryInfo(event.category);
    const statusInfo = getStatusInfo(event.status);

    return (
      <View key={event.id} style={styles.eventItem}>
        <View style={styles.eventHeader}>
          <View style={styles.eventMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
              <Text style={styles.categoryText}>{categoryInfo.label}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
              <Text style={styles.statusText}>{statusInfo.label}</Text>
            </View>
            {event.isPublished ? (
              <View style={styles.publishedBadge}>
                <Text style={styles.publishedText}>Published</Text>
              </View>
            ) : (
              <View style={styles.draftBadge}>
                <Text style={styles.draftText}>Draft</Text>
              </View>
            )}
          </View>
          <View style={styles.eventActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(event)}
            >
              <Ionicons name="pencil" size={16} color={colors.accentTeal} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(event.id)}
            >
              <Ionicons name="trash" size={16} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>
        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Ionicons name="location" size={16} color={colors.textSecondary} />
            <Text style={styles.eventDetailText}>{event.location}</Text>
          </View>
          <View style={styles.eventDetail}>
            <Ionicons name="calendar" size={16} color={colors.textSecondary} />
            <Text style={styles.eventDetailText}>
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </Text>
          </View>
          <View style={styles.eventDetail}>
            <Ionicons name="time" size={16} color={colors.textSecondary} />
            <Text style={styles.eventDetailText}>
              {event.startTime} - {event.endTime}
            </Text>
          </View>
          {event.maxAttendees && (
            <View style={styles.eventDetail}>
              <Ionicons name="people" size={16} color={colors.textSecondary} />
              <Text style={styles.eventDetailText}>
                Max {event.maxAttendees} attendees
              </Text>
            </View>
          )}
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
            <Text style={styles.headerTitle}>Events Management</Text>
            <Text style={styles.headerSubtitle}>Manage upcoming events</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setEditingEvent(null);
              setShowAddModal(true);
            }}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Events List */}
      <ScrollView style={styles.content}>
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No events yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap the + button to add your first event</Text>
          </View>
        ) : (
          events.map(renderEvent)
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
              {editingEvent ? 'Edit Event' : 'Add Event'}
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                placeholder="Enter event title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Enter event description"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="Enter event location"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Start Date *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.startDate}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>End Date *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.endDate}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, endDate: text }))}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Start Time *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.startTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, startTime: text }))}
                  placeholder="HH:MM"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>End Time *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.endTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, endTime: text }))}
                  placeholder="HH:MM"
                />
              </View>
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
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusSelector}>
                {statuses.map((status) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.statusOption,
                      formData.status === status.value && styles.statusOptionSelected,
                      { borderColor: status.color }
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, status: status.value as any }))}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      formData.status === status.value && { color: status.color }
                    ]}>
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Max Attendees</Text>
              <TextInput
                style={styles.input}
                value={formData.maxAttendees}
                onChangeText={(text) => setFormData(prev => ({ ...prev, maxAttendees: text }))}
                placeholder="Leave empty for unlimited"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  formData.registrationRequired && styles.checkboxChecked
                ]}
                onPress={() => setFormData(prev => ({ ...prev, registrationRequired: !prev.registrationRequired }))}
              >
                <Ionicons
                  name={formData.registrationRequired ? "checkmark" : "checkmark-outline"}
                  size={20}
                  color={formData.registrationRequired ? "#FFFFFF" : colors.textSecondary}
                />
                <Text style={[
                  styles.checkboxText,
                  formData.registrationRequired && styles.checkboxTextChecked
                ]}>
                  Registration required
                </Text>
              </TouchableOpacity>
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
                {editingEvent ? 'Update' : 'Save'}
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
  eventItem: {
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventMeta: {
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  statusText: {
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
  eventActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  eventDetailText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
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
  formRow: {
    flexDirection: 'row',
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
    height: 100,
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
  statusSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  statusOptionSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  statusOptionText: {
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

export default AdminEventsScreen;
