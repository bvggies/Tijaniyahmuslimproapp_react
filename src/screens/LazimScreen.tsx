import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LazimItem } from '../types';
import * as Haptics from 'expo-haptics';

// Mock data for Lazim items
const mockLazimItems: LazimItem[] = [
  {
    id: '1',
    title: 'Daily Quran Reading',
    description: 'Read at least 1 page of Quran daily',
    frequency: 'daily',
    completed: true,
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Morning Dhikr',
    description: 'Recite morning adhkar after Fajr',
    frequency: 'daily',
    completed: true,
    date: '2024-01-15',
  },
  {
    id: '3',
    title: 'Weekly Fasting',
    description: 'Fast on Mondays and Thursdays',
    frequency: 'weekly',
    completed: false,
    date: '2024-01-15',
  },
  {
    id: '4',
    title: 'Monthly Charity',
    description: 'Give charity to the needy',
    frequency: 'monthly',
    completed: false,
    date: '2024-01-15',
  },
  {
    id: '5',
    title: 'Evening Reflection',
    description: 'Reflect on the day and seek forgiveness',
    frequency: 'daily',
    completed: true,
    date: '2024-01-15',
  },
];

export default function LazimScreen() {
  const [lazimItems, setLazimItems] = useState<LazimItem[]>(mockLazimItems);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', frequency: 'daily' as const });

  const filteredItems = lazimItems.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.frequency === selectedFilter;
  });

  const completedCount = lazimItems.filter(item => item.completed).length;
  const totalCount = lazimItems.length;
  const streakDays = 7; // Mock streak data

  const toggleLazim = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLazimItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addNewLazim = () => {
    if (!newItem.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your commitment');
      return;
    }

    const newLazimItem: LazimItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      frequency: newItem.frequency,
      completed: false,
      date: new Date().toISOString().split('T')[0],
    };

    setLazimItems(prev => [newLazimItem, ...prev]);
    setNewItem({ title: '', description: '', frequency: 'daily' });
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '#4CAF50';
      case 'weekly': return '#2196F3';
      case 'monthly': return '#FF9800';
      default: return '#666';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'calendar-outline';
      case 'weekly': return 'calendar';
      case 'monthly': return 'calendar-sharp';
      default: return 'calendar-outline';
    }
  };

  const renderLazimCard = ({ item }: { item: LazimItem }) => (
    <View style={[styles.lazimCard, item.completed && styles.completedCard]}>
      <View style={styles.lazimHeader}>
        <View style={styles.lazimInfo}>
          <View style={styles.lazimTitleRow}>
            <Text style={[styles.lazimTitle, item.completed && styles.completedText]}>
              {item.title}
            </Text>
            <View style={[styles.frequencyBadge, { backgroundColor: getFrequencyColor(item.frequency) }]}>
              <Ionicons name={getFrequencyIcon(item.frequency) as any} size={12} color="#FFFFFF" />
              <Text style={styles.frequencyText}>{item.frequency}</Text>
            </View>
          </View>
          <Text style={styles.lazimDescription}>{item.description}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkbox, item.completed && styles.checkedBox]}
          onPress={() => toggleLazim(item.id)}
        >
          {item.completed && <Ionicons name="checkmark" size={20} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
      
      <View style={styles.lazimFooter}>
        <Text style={styles.dateText}>{item.date}</Text>
        <View style={styles.progressIndicator}>
          <View style={[styles.progressDot, item.completed && styles.completedDot]} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Lazim Tracker</Text>
            <Text style={styles.headerSubtitle}>Track your daily Islamic commitments</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{streakDays}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <Text style={styles.progressText}>{Math.round((completedCount / totalCount) * 100)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completedCount / totalCount) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: 'All', icon: 'grid-outline' },
          { key: 'daily', label: 'Daily', icon: 'calendar-outline' },
          { key: 'weekly', label: 'Weekly', icon: 'calendar' },
          { key: 'monthly', label: 'Monthly', icon: 'calendar-sharp' },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.selectedFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
            <Ionicons 
              name={filter.icon as any} 
              size={16} 
              color={selectedFilter === filter.key ? '#FFFFFF' : '#666'} 
            />
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter.key && styles.selectedFilterButtonText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lazim Items List */}
      <FlatList
        data={filteredItems}
        renderItem={renderLazimCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lazimList}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Lazim Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Commitment</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Commitment title"
              value={newItem.title}
              onChangeText={(text) => setNewItem({ ...newItem, title: text })}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newItem.description}
              onChangeText={(text) => setNewItem({ ...newItem, description: text })}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.frequencySelector}>
              <Text style={styles.frequencyLabel}>Frequency:</Text>
              {['daily', 'weekly', 'monthly'].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyOption,
                    newItem.frequency === freq && styles.selectedFrequencyOption,
                  ]}
                  onPress={() => setNewItem({ ...newItem, frequency: freq as any })}
                >
                  <Text
                    style={[
                      styles.frequencyOptionText,
                      newItem.frequency === freq && styles.selectedFrequencyOptionText,
                    ]}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={addNewLazim}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>Add Commitment</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8F5E8',
    marginTop: 4,
  },
  addButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedFilterButton: {
    backgroundColor: '#2E7D32',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
  },
  selectedFilterButtonText: {
    color: '#FFFFFF',
  },
  lazimList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  lazimCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedCard: {
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  lazimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lazimInfo: {
    flex: 1,
    marginRight: 12,
  },
  lazimTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  lazimTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  completedText: {
    color: '#2E7D32',
  },
  frequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  frequencyText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 2,
    fontWeight: '600',
  },
  lazimDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  lazimFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  progressIndicator: {
    flexDirection: 'row',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginLeft: 4,
  },
  completedDot: {
    backgroundColor: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  frequencySelector: {
    marginBottom: 20,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  frequencyOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  selectedFrequencyOption: {
    backgroundColor: '#2E7D32',
  },
  frequencyOptionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selectedFrequencyOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
