import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Wazifa } from '../types';
import { colors } from '../utils/theme';

// Mock data for Wazifa
const mockWazifas: Wazifa[] = [
  {
    id: '1',
    title: 'Morning Dhikr',
    description: 'Recite SubhanAllah 100 times after Fajr prayer',
    times: ['06:00', '06:30'],
    completed: false,
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Evening Dhikr',
    description: 'Recite Alhamdulillah 100 times after Maghrib prayer',
    times: ['18:30', '19:00'],
    completed: true,
    date: '2024-01-15',
  },
  {
    id: '3',
    title: 'Surah Al-Fatihah',
    description: 'Read Surah Al-Fatihah 7 times daily',
    times: ['Anytime'],
    completed: false,
    date: '2024-01-15',
  },
  {
    id: '4',
    title: 'Istighfar',
    description: 'Seek forgiveness 100 times before sleeping',
    times: ['21:00', '22:00'],
    completed: false,
    date: '2024-01-15',
  },
  {
    id: '5',
    title: 'Salawat',
    description: 'Send blessings upon Prophet Muhammad (PBUH) 100 times',
    times: ['12:00', '15:00', '18:00'],
    completed: true,
    date: '2024-01-15',
  },
];

export default function WazifaScreen() {
  const [wazifas, setWazifas] = useState<Wazifa[]>(mockWazifas);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredWazifas = wazifas.filter(wazifa => {
    if (selectedFilter === 'pending') return !wazifa.completed;
    if (selectedFilter === 'completed') return wazifa.completed;
    return true;
  });

  const toggleWazifa = (id: string) => {
    setWazifas(prev =>
      prev.map(wazifa =>
        wazifa.id === id ? { ...wazifa, completed: !wazifa.completed } : wazifa
      )
    );
  };

  const completedCount = wazifas.filter(w => w.completed).length;
  const totalCount = wazifas.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const renderWazifaCard = ({ item }: { item: Wazifa }) => (
    <View style={[styles.wazifaCard, item.completed && styles.completedCard]}>
      <View style={styles.wazifaHeader}>
        <View style={styles.wazifaInfo}>
          <Text style={[styles.wazifaTitle, item.completed && styles.completedText]}>
            {item.title}
          </Text>
          <Text style={styles.wazifaDescription}>{item.description}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkbox, item.completed && styles.checkedBox]}
          onPress={() => toggleWazifa(item.id)}
        >
          {item.completed && <Ionicons name="checkmark" size={20} color={colors.accentYellow} />}
        </TouchableOpacity>
      </View>
      
      <View style={styles.wazifaTimes}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.timesText}>
          {item.times.join(', ')}
        </Text>
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
        <Text style={styles.headerTitle}>Wazifa</Text>
        <Text style={styles.headerSubtitle}>Daily Islamic Practices</Text>
      </LinearGradient>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <Text style={styles.progressText}>{completedCount}/{totalCount}</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
        <Text style={styles.progressPercentage}>
          {Math.round(progressPercentage)}% Complete
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'completed', label: 'Completed' },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.selectedFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
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

      {/* Wazifas List */}
      <FlatList
        data={filteredWazifas}
        renderItem={renderWazifaCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.wazifasList}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Wazifa Button */}
      <TouchableOpacity style={styles.addButton}>
        <LinearGradient
          colors={['#4CAF50', '#66BB6A']}
          style={styles.addButtonGradient}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Wazifa</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  progressCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    alignItems: 'center',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedFilterButtonText: {
    color: '#FFFFFF',
  },
  wazifasList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  wazifaCard: {
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
  wazifaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  wazifaInfo: {
    flex: 1,
    marginRight: 12,
  },
  wazifaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  completedText: {
    color: '#2E7D32',
  },
  wazifaDescription: {
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
  wazifaTimes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timesText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
