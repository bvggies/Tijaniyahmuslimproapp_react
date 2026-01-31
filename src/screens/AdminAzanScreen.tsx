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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { api } from '../services/api';
import { useFadeIn } from '../hooks/useAnimations';

interface AzanItem {
  id: string;
  name: string;
  muezzin: string | null;
  location: string | null;
  description: string | null;
  audioUrl: string;
  playAt: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const AdminAzanScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const opacity = useFadeIn({ duration: 380 });
  const [items, setItems] = useState<AzanItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AzanItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    muezzin: '',
    location: '',
    description: '',
    audioUrl: '',
    playAtHour: 5,
    playAtMinute: 30,
    isActive: true,
    sortOrder: 0,
  });

  const loadAzans = async () => {
    try {
      const list = await api.getAzansAdmin();
      setItems(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error loading azans:', error);
      Alert.alert('Error', 'Failed to load azan schedules');
      setItems([]);
    }
  };

  useEffect(() => {
    loadAzans();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      muezzin: '',
      location: '',
      description: '',
      audioUrl: '',
      playAtHour: 5,
      playAtMinute: 30,
      isActive: true,
      sortOrder: 0,
    });
    setEditingItem(null);
  };

  const playAtToForm = (playAt: string) => {
    const [h, m] = playAt.split(':').map(Number);
    return { playAtHour: isNaN(h) ? 5 : h, playAtMinute: isNaN(m) ? 30 : m };
  };

  const formToPlayAt = () => {
    const h = String(formData.playAtHour).padStart(2, '0');
    const m = String(formData.playAtMinute).padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    if (!formData.audioUrl.trim()) {
      Alert.alert('Error', 'Please enter an audio URL');
      return;
    }
    const playAt = formToPlayAt();
    try {
      if (editingItem) {
        await api.updateAzan(editingItem.id, {
          name: formData.name.trim(),
          muezzin: formData.muezzin.trim() || undefined,
          location: formData.location.trim() || undefined,
          description: formData.description.trim() || undefined,
          audioUrl: formData.audioUrl.trim(),
          playAt,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder,
        });
        Alert.alert('Success', 'Azan schedule updated');
      } else {
        await api.createAzan({
          name: formData.name.trim(),
          muezzin: formData.muezzin.trim() || undefined,
          location: formData.location.trim() || undefined,
          description: formData.description.trim() || undefined,
          audioUrl: formData.audioUrl.trim(),
          playAt,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder,
        });
        Alert.alert('Success', 'Azan schedule added');
      }
      setShowAddModal(false);
      resetForm();
      loadAzans();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save azan schedule');
    }
  };

  const handleEdit = (item: AzanItem) => {
    const { playAtHour, playAtMinute } = playAtToForm(item.playAt);
    setFormData({
      name: item.name,
      muezzin: item.muezzin || '',
      location: item.location || '',
      description: item.description || '',
      audioUrl: item.audioUrl,
      playAtHour,
      playAtMinute,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Azan',
      'Are you sure you want to delete this azan schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteAzan(id);
              Alert.alert('Success', 'Azan schedule deleted');
              loadAzans();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete');
            }
          },
        },
      ]
    );
  };

  const renderAzanItem = (item: AzanItem) => (
    <View key={item.id} style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.muezzin ? <Text style={styles.itemMuezzin}>{item.muezzin}</Text> : null}
          <View style={styles.itemMeta}>
            <View style={[styles.badge, item.isActive ? styles.badgeActive : styles.badgeInactive]}>
              <Text style={styles.badgeText}>{item.isActive ? 'Active' : 'Inactive'}</Text>
            </View>
            <Text style={styles.playAtText}>Plays at {item.playAt}</Text>
          </View>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
            <Ionicons name="pencil" size={20} color={colors.accentTeal} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
      {item.location ? <Text style={styles.itemLocation}>{item.location}</Text> : null}
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <LinearGradient colors={[colors.accentTeal, colors.accentGreen]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Azan Schedules</Text>
            <Text style={styles.headerSubtitle}>Manage azan play times (play daily at set time)</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="volume-high-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No azan schedules yet</Text>
            <Text style={styles.emptyStateSubtext}>Add one to play azan at a specific time daily (works offline)</Text>
          </View>
        ) : (
          items.map(renderAzanItem)
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingItem ? 'Edit Azan' : 'Add Azan Schedule'}</Text>
            <TouchableOpacity onPress={() => { setShowAddModal(false); resetForm(); }}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(t) => setFormData((p) => ({ ...p, name: t }))}
                placeholder="e.g. Makkah Al-Mukarramah"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Muezzin</Text>
              <TextInput
                style={styles.input}
                value={formData.muezzin}
                onChangeText={(t) => setFormData((p) => ({ ...p, muezzin: t }))}
                placeholder="e.g. Sheikh Abdul Rahman Al-Sudais"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(t) => setFormData((p) => ({ ...p, location: t }))}
                placeholder="e.g. Masjid al-Haram, Makkah"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(t) => setFormData((p) => ({ ...p, description: t }))}
                placeholder="Short description"
                multiline
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Audio URL *</Text>
              <TextInput
                style={styles.input}
                value={formData.audioUrl}
                onChangeText={(t) => setFormData((p) => ({ ...p, audioUrl: t }))}
                placeholder="https://example.com/azan.mp3"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Play at (24h) *</Text>
              <View style={styles.timeRow}>
                <View style={styles.timeSelect}>
                  <Text style={styles.timeLabel}>Hour</Text>
                  <ScrollView style={styles.pickerScroll} nestedScrollEnabled>
                    {HOURS_24.map((h) => (
                      <TouchableOpacity
                        key={h}
                        style={[styles.pickerItem, formData.playAtHour === h && styles.pickerItemActive]}
                        onPress={() => setFormData((p) => ({ ...p, playAtHour: h }))}
                      >
                        <Text style={[styles.pickerItemText, formData.playAtHour === h && styles.pickerItemTextActive]}>
                          {String(h).padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.timeSelect}>
                  <Text style={styles.timeLabel}>Minute</Text>
                  <ScrollView style={styles.pickerScroll} nestedScrollEnabled>
                    {MINUTES.map((m) => (
                      <TouchableOpacity
                        key={m}
                        style={[styles.pickerItem, formData.playAtMinute === m && styles.pickerItemActive]}
                        onPress={() => setFormData((p) => ({ ...p, playAtMinute: m }))}
                      >
                        <Text style={[styles.pickerItemText, formData.playAtMinute === m && styles.pickerItemTextActive]}>
                          {String(m).padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <Text style={styles.hint}>Azan will play daily at this time (user can turn on/off in Settings)</Text>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Sort order</Text>
              <TextInput
                style={styles.input}
                value={String(formData.sortOrder)}
                onChangeText={(t) => setFormData((p) => ({ ...p, sortOrder: parseInt(t, 10) || 0 }))}
                placeholder="0"
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.formGroupRow}>
              <Text style={styles.label}>Active</Text>
              <TouchableOpacity
                style={[styles.toggle, formData.isActive && styles.toggleActive]}
                onPress={() => setFormData((p) => ({ ...p, isActive: !p.isActive }))}
              >
                <Text style={styles.toggleText}>{formData.isActive ? 'Yes' : 'No'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => { setShowAddModal(false); resetForm(); }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{editingItem ? 'Update' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  headerText: { flex: 1, marginLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  addButton: { padding: 8 },
  content: { flex: 1, padding: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyStateText: { fontSize: 18, color: colors.textPrimary, marginTop: 12 },
  emptyStateSubtext: { fontSize: 14, color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
  itemCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  itemMuezzin: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeActive: { backgroundColor: colors.accentGreen + '33' },
  badgeInactive: { backgroundColor: colors.divider },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  playAtText: { fontSize: 12, color: colors.textSecondary },
  itemLocation: { fontSize: 12, color: colors.textSecondary, marginTop: 8 },
  itemActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 8 },
  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.divider },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  modalContent: { flex: 1, padding: 20 },
  formGroup: { marginBottom: 16 },
  formGroupRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  input: { backgroundColor: colors.surface, borderRadius: 8, padding: 12, fontSize: 16, color: colors.textPrimary, borderWidth: 1, borderColor: colors.divider },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  hint: { fontSize: 12, color: colors.textSecondary, marginTop: 6 },
  timeRow: { flexDirection: 'row', gap: 16 },
  timeSelect: { flex: 1 },
  timeLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  pickerScroll: { maxHeight: 120 },
  pickerItem: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4 },
  pickerItemActive: { backgroundColor: colors.accentTeal },
  pickerItemText: { fontSize: 14, color: colors.textPrimary },
  pickerItemTextActive: { color: '#FFFFFF', fontWeight: '600' },
  toggle: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.divider },
  toggleActive: { backgroundColor: colors.accentTeal },
  toggleText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  modalActions: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: colors.divider },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.divider, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, color: colors.textPrimary },
  saveButton: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: colors.accentTeal, alignItems: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

export default AdminAzanScreen;
