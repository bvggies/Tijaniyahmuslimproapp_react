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
  Image,
  Switch,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useFadeIn } from '../hooks/useAnimations';
import { api } from '../services/api';

interface Scholar {
  id: string;
  name: string;
  nameArabic: string;
  title: string;
  titleArabic: string;
  biography: string;
  biographyArabic: string;
  specialization: string[];
  country: string;
  city: string;
  birthYear?: number;
  deathYear?: number;
  isAlive: boolean;
  isActive: boolean;
  isFeatured: boolean;
  profileImage?: string;
  achievements: string[];
  achievementsArabic: string[];
  books: string[];
  booksArabic: string[];
  website?: string;
  socialMedia: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  contactEmail?: string;
  createdAt: string;
  updatedAt: string;
  followers: number;
  lessonsCount: number;
  booksCount: number;
}

const AdminScholarsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const { hasPermission } = useAdminAuth();
  const opacity = useFadeIn({ duration: 380 });
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [stats, setStats] = useState({
    totalScholars: 0,
    activeScholars: 0,
    featuredScholars: 0,
    totalFollowers: 0,
  });

  const specializations = [
    { value: 'tijaniyah', label: 'Tijaniyah Studies', color: '#4CAF50' },
    { value: 'quran', label: 'Quran Studies', color: '#2196F3' },
    { value: 'hadith', label: 'Hadith Studies', color: '#FF9800' },
    { value: 'fiqh', label: 'Islamic Jurisprudence', color: '#E91E63' },
    { value: 'tasawwuf', label: 'Sufism', color: '#9C27B0' },
    { value: 'history', label: 'Islamic History', color: '#607D8B' },
    { value: 'arabic', label: 'Arabic Language', color: '#795548' },
    { value: 'philosophy', label: 'Islamic Philosophy', color: '#3F51B5' },
  ];

  const countries = [
    'Nigeria', 'Senegal', 'Mauritania', 'Morocco', 'Algeria', 'Tunisia',
    'Egypt', 'Sudan', 'Mali', 'Ghana', 'Burkina Faso', 'Niger', 'Chad',
    'Cameroon', 'Ivory Coast', 'Guinea', 'Sierra Leone', 'Liberia',
    'Gambia', 'Guinea-Bissau', 'Togo', 'Benin', 'Other'
  ];

  const statuses = [
    { value: 'active', label: 'Active', color: '#4CAF50' },
    { value: 'inactive', label: 'Inactive', color: '#FF9800' },
    { value: 'deceased', label: 'Deceased', color: '#9E9E9E' },
  ];

  useEffect(() => {
    loadScholars();
  }, []);

  const loadScholars = async () => {
    try {
      const response = await api.getScholarsAdmin();
      const scholarsData = response.data || response;
      // Map backend data to frontend format
      const mappedScholars: Scholar[] = scholarsData.map((s: any) => ({
        id: s.id,
        name: s.name,
        nameArabic: s.nameArabic || '',
        title: s.title || '',
        titleArabic: '',
        biography: s.biography || '',
        biographyArabic: '',
        specialization: s.specialty ? [s.specialty] : [],
        country: s.location || '',
        city: '',
        birthYear: s.birthYear,
        deathYear: s.deathYear,
        isAlive: s.isAlive,
        isActive: s.isPublished,
        isFeatured: false,
        profileImage: s.imageUrl,
        achievements: [],
        achievementsArabic: [],
        books: [],
        booksArabic: [],
        website: '',
        socialMedia: {},
        contactEmail: '',
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        followers: 0,
        lessonsCount: 0,
        booksCount: 0,
      }));
      setScholars(mappedScholars);
      calculateStats(mappedScholars);
    } catch (error) {
      console.error('Error loading scholars:', error);
      Alert.alert('Error', 'Failed to load scholars');
    }
  };

  const calculateStats = (scholarList: Scholar[]) => {
    const activeScholars = scholarList.filter(s => s.isActive).length;
    const featuredScholars = scholarList.filter(s => s.isFeatured).length;
    const totalFollowers = scholarList.reduce((sum, scholar) => sum + scholar.followers, 0);

    setStats({
      totalScholars: scholarList.length,
      activeScholars,
      featuredScholars,
      totalFollowers,
    });
  };

  const handleCreateScholar = async (scholarData: Partial<Scholar>) => {
    try {
      const newScholar: Scholar = {
        id: Date.now().toString(),
        name: scholarData.name || '',
        nameArabic: scholarData.nameArabic || '',
        title: scholarData.title || '',
        titleArabic: scholarData.titleArabic || '',
        biography: scholarData.biography || '',
        biographyArabic: scholarData.biographyArabic || '',
        specialization: scholarData.specialization || [],
        country: scholarData.country || '',
        city: scholarData.city || '',
        birthYear: scholarData.birthYear,
        deathYear: scholarData.deathYear,
        isAlive: scholarData.isAlive || true,
        isActive: scholarData.isActive || true,
        isFeatured: scholarData.isFeatured || false,
        profileImage: scholarData.profileImage,
        achievements: scholarData.achievements || [],
        achievementsArabic: scholarData.achievementsArabic || [],
        books: scholarData.books || [],
        booksArabic: scholarData.booksArabic || [],
        website: scholarData.website,
        socialMedia: scholarData.socialMedia || {},
        contactEmail: scholarData.contactEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        followers: 0,
        lessonsCount: 0,
        booksCount: scholarData.books?.length || 0,
      };

      setScholars(prev => {
        const updated = [newScholar, ...prev];
        calculateStats(updated);
        return updated;
      });

      Alert.alert('Success', 'Scholar created successfully');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating scholar:', error);
      Alert.alert('Error', 'Failed to create scholar');
    }
  };

  const handleUpdateScholar = async (id: string, scholarData: Partial<Scholar>) => {
    try {
      setScholars(prev => {
        const updated = prev.map(scholar =>
          scholar.id === id
            ? { ...scholar, ...scholarData, updatedAt: new Date().toISOString() }
            : scholar
        );
        calculateStats(updated);
        return updated;
      });

      Alert.alert('Success', 'Scholar updated successfully');
      setShowEditModal(false);
      setSelectedScholar(null);
    } catch (error) {
      console.error('Error updating scholar:', error);
      Alert.alert('Error', 'Failed to update scholar');
    }
  };

  const handleDeleteScholar = (id: string) => {
    Alert.alert(
      'Delete Scholar',
      'Are you sure you want to delete this scholar? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setScholars(prev => {
                const updated = prev.filter(scholar => scholar.id !== id);
                calculateStats(updated);
                return updated;
              });
              Alert.alert('Success', 'Scholar deleted successfully');
            } catch (error) {
              console.error('Error deleting scholar:', error);
              Alert.alert('Error', 'Failed to delete scholar');
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = (id: string, field: 'isActive' | 'isFeatured') => {
    setScholars(prev => {
      const updated = prev.map(scholar =>
        scholar.id === id
          ? { ...scholar, [field]: !scholar[field], updatedAt: new Date().toISOString() }
          : scholar
      );
      calculateStats(updated);
      return updated;
    });
  };

  const handleImagePicker = async (setImage: (uri: string) => void) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access media library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const getSpecializationInfo = (specialization: string) => {
    return specializations.find(s => s.value === specialization) || specializations[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const filteredScholars = scholars.filter(scholar => {
    const matchesSearch = scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholar.nameArabic.includes(searchQuery) ||
                         scholar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholar.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = filterSpecialization === 'all' || 
                                 scholar.specialization.includes(filterSpecialization);
    const matchesCountry = filterCountry === 'all' || scholar.country === filterCountry;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && scholar.isActive) ||
                         (filterStatus === 'inactive' && !scholar.isActive) ||
                         (filterStatus === 'deceased' && !scholar.isAlive);
    
    return matchesSearch && matchesSpecialization && matchesCountry && matchesStatus;
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

  const renderScholar = (scholar: Scholar) => {
    return (
      <View key={scholar.id} style={styles.scholarItem}>
        <View style={styles.scholarHeader}>
          <View style={styles.scholarInfo}>
            <View style={styles.profileContainer}>
              {scholar.profileImage ? (
                <Image source={{ uri: scholar.profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Ionicons name="person" size={24} color={colors.textSecondary} />
                </View>
              )}
            </View>
            <View style={styles.scholarDetails}>
              <Text style={styles.scholarName}>{scholar.name}</Text>
              <Text style={styles.scholarNameArabic}>{scholar.nameArabic}</Text>
              <Text style={styles.scholarTitle}>{scholar.title}</Text>
              <Text style={styles.scholarLocation}>
                <Ionicons name="location" size={12} color={colors.textSecondary} />
                {' '}{scholar.city}, {scholar.country}
              </Text>
            </View>
          </View>
          <View style={styles.scholarActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setSelectedScholar(scholar);
                setShowEditModal(true);
              }}
            >
              <Ionicons name="create" size={16} color={colors.accentTeal} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteScholar(scholar.id)}
            >
              <Ionicons name="trash" size={16} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.specializationsContainer}>
          {scholar.specialization.map((spec, index) => {
            const specInfo = getSpecializationInfo(spec);
            return (
              <View key={index} style={[styles.specializationBadge, { backgroundColor: specInfo.color }]}>
                <Text style={styles.specializationText}>{specInfo.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.scholarStats}>
          <View style={styles.scholarStatItem}>
            <Ionicons name="people" size={14} color={colors.textSecondary} />
            <Text style={styles.scholarStatText}>{formatNumber(scholar.followers)}</Text>
          </View>
          <View style={styles.scholarStatItem}>
            <Ionicons name="book" size={14} color={colors.textSecondary} />
            <Text style={styles.scholarStatText}>{scholar.lessonsCount}</Text>
          </View>
          <View style={styles.scholarStatItem}>
            <Ionicons name="library" size={14} color={colors.textSecondary} />
            <Text style={styles.scholarStatText}>{scholar.booksCount}</Text>
          </View>
          <View style={styles.lifeStatus}>
            <Ionicons 
              name={scholar.isAlive ? "heart" : "heart-dislike"} 
              size={14} 
              color={scholar.isAlive ? "#4CAF50" : "#9E9E9E"} 
            />
            <Text style={[
              styles.lifeStatusText,
              { color: scholar.isAlive ? "#4CAF50" : "#9E9E9E" }
            ]}>
              {scholar.isAlive ? 'Alive' : 'Deceased'}
            </Text>
          </View>
        </View>

        <View style={styles.scholarFooter}>
          <View style={styles.statusControls}>
            <View style={styles.statusControl}>
              <Text style={styles.statusLabel}>Active</Text>
              <Switch
                value={scholar.isActive}
                onValueChange={() => handleToggleStatus(scholar.id, 'isActive')}
                trackColor={{ false: colors.divider, true: colors.accentTeal }}
                thumbColor={scholar.isActive ? '#FFFFFF' : colors.textSecondary}
              />
            </View>
            <View style={styles.statusControl}>
              <Text style={styles.statusLabel}>Featured</Text>
              <Switch
                value={scholar.isFeatured}
                onValueChange={() => handleToggleStatus(scholar.id, 'isFeatured')}
                trackColor={{ false: colors.divider, true: colors.accentGreen }}
                thumbColor={scholar.isFeatured ? '#FFFFFF' : colors.textSecondary}
              />
            </View>
          </View>
          <Text style={styles.dateText}>
            Updated: {formatDate(scholar.updatedAt)}
          </Text>
        </View>
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
            <Text style={styles.headerTitle}>Scholars Management</Text>
            <Text style={styles.headerSubtitle}>Manage Islamic scholars</Text>
          </View>
          {hasPermission('scholars', 'create') && (
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
          {renderStatsCard('Total Scholars', stats.totalScholars.toString(), 'people', '#2196F3')}
          {renderStatsCard('Active', stats.activeScholars.toString(), 'checkmark-circle', '#4CAF50')}
          {renderStatsCard('Featured', stats.featuredScholars.toString(), 'star', '#FF9800')}
          {renderStatsCard('Followers', formatNumber(stats.totalFollowers), 'heart', '#E91E63')}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search scholars..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterSpecialization === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilterSpecialization('all')}
            >
              <Text style={[
                styles.filterButtonText,
                filterSpecialization === 'all' && styles.filterButtonTextActive
              ]}>
                All Specializations
              </Text>
            </TouchableOpacity>
            {specializations.map((spec) => (
              <TouchableOpacity
                key={spec.value}
                style={[
                  styles.filterButton,
                  filterSpecialization === spec.value && styles.filterButtonActive
                ]}
                onPress={() => setFilterSpecialization(spec.value)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterSpecialization === spec.value && styles.filterButtonTextActive
                ]}>
                  {spec.label}
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
                filterCountry === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilterCountry('all')}
            >
              <Text style={[
                styles.filterButtonText,
                filterCountry === 'all' && styles.filterButtonTextActive
              ]}>
                All Countries
              </Text>
            </TouchableOpacity>
            {countries.map((country) => (
              <TouchableOpacity
                key={country}
                style={[
                  styles.filterButton,
                  filterCountry === country && styles.filterButtonActive
                ]}
                onPress={() => setFilterCountry(country)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterCountry === country && styles.filterButtonTextActive
                ]}>
                  {country}
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

      {/* Scholars List */}
      <ScrollView style={styles.content}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsText}>
            {filteredScholars.length} scholar{filteredScholars.length !== 1 ? 's' : ''} found
          </Text>
        </View>
        
        {filteredScholars.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No scholars found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery || filterSpecialization !== 'all' || filterCountry !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters' 
                : 'Add your first scholar to get started'
              }
            </Text>
          </View>
        ) : (
          filteredScholars.map(renderScholar)
        )}
      </ScrollView>

      {/* Create/Edit Scholar Modal */}
      <Modal
        visible={showCreateModal || showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setSelectedScholar(null);
        }}
      >
        <ScholarFormModal
          scholar={selectedScholar}
          isEdit={showEditModal}
          onSubmit={showEditModal ? 
            (data) => selectedScholar && handleUpdateScholar(selectedScholar.id, data) :
            handleCreateScholar
          }
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedScholar(null);
          }}
          onImagePicker={handleImagePicker}
        />
      </Modal>
    </Animated.View>
  );
};

// Scholar Form Modal Component
const ScholarFormModal: React.FC<{
  scholar?: Scholar | null;
  isEdit: boolean;
  onSubmit: (data: Partial<Scholar>) => void;
  onClose: () => void;
  onImagePicker: (setImage: (uri: string) => void) => void;
}> = ({ scholar, isEdit, onSubmit, onClose, onImagePicker }) => {
  const [formData, setFormData] = useState<Partial<Scholar>>({
    name: '',
    nameArabic: '',
    title: '',
    titleArabic: '',
    biography: '',
    biographyArabic: '',
    specialization: [],
    country: '',
    city: '',
    birthYear: undefined,
    deathYear: undefined,
    isAlive: true,
    isActive: true,
    isFeatured: false,
    profileImage: '',
    achievements: [],
    achievementsArabic: [],
    books: [],
    booksArabic: [],
    website: '',
    socialMedia: {},
    contactEmail: '',
    ...scholar,
  });

  const specializations = [
    { value: 'tijaniyah', label: 'Tijaniyah Studies' },
    { value: 'quran', label: 'Quran Studies' },
    { value: 'hadith', label: 'Hadith Studies' },
    { value: 'fiqh', label: 'Islamic Jurisprudence' },
    { value: 'tasawwuf', label: 'Sufism' },
    { value: 'history', label: 'Islamic History' },
    { value: 'arabic', label: 'Arabic Language' },
    { value: 'philosophy', label: 'Islamic Philosophy' },
  ];

  const countries = [
    'Nigeria', 'Senegal', 'Mauritania', 'Morocco', 'Algeria', 'Tunisia',
    'Egypt', 'Sudan', 'Mali', 'Ghana', 'Burkina Faso', 'Niger', 'Chad',
    'Cameroon', 'Ivory Coast', 'Guinea', 'Sierra Leone', 'Liberia',
    'Gambia', 'Guinea-Bissau', 'Togo', 'Benin', 'Other'
  ];

  const handleSubmit = () => {
    if (!formData.name?.trim()) {
      Alert.alert('Error', 'Please enter scholar name');
      return;
    }
    if (!formData.title?.trim()) {
      Alert.alert('Error', 'Please enter scholar title');
      return;
    }
    if (!formData.country?.trim()) {
      Alert.alert('Error', 'Please select a country');
      return;
    }

    onSubmit(formData);
  };

  const toggleSpecialization = (spec: string) => {
    const currentSpecs = formData.specialization || [];
    const updatedSpecs = currentSpecs.includes(spec)
      ? currentSpecs.filter(s => s !== spec)
      : [...currentSpecs, spec];
    setFormData({ ...formData, specialization: updatedSpecs });
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          {isEdit ? 'Edit Scholar' : 'Add New Scholar'}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalContent}>
        {/* Profile Image */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Profile Image</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => onImagePicker((uri) => setFormData({ ...formData, profileImage: uri }))}
          >
            {formData.profileImage ? (
              <Image source={{ uri: formData.profileImage }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={32} color={colors.textSecondary} />
                <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Name (English) *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter scholar name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Name (Arabic)</Text>
          <TextInput
            style={styles.formInput}
            placeholder="اسم العالم"
            value={formData.nameArabic}
            onChangeText={(text) => setFormData({ ...formData, nameArabic: text })}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Title (English) *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter scholar title"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Title (Arabic)</Text>
          <TextInput
            style={styles.formInput}
            placeholder="لقب العالم"
            value={formData.titleArabic}
            onChangeText={(text) => setFormData({ ...formData, titleArabic: text })}
          />
        </View>

        <View style={styles.formRow}>
          <View style={styles.formSectionHalf}>
            <Text style={styles.formLabel}>Country *</Text>
            <View style={styles.formInput}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country}
                  style={[
                    styles.optionButton,
                    formData.country === country && styles.optionButtonActive
                  ]}
                  onPress={() => setFormData({ ...formData, country })}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.country === country && styles.optionButtonTextActive
                  ]}>
                    {country}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSectionHalf}>
            <Text style={styles.formLabel}>City</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter city"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
            />
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.formSectionHalf}>
            <Text style={styles.formLabel}>Birth Year</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g., 1965"
              value={formData.birthYear?.toString()}
              onChangeText={(text) => setFormData({ ...formData, birthYear: parseInt(text) || undefined })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formSectionHalf}>
            <Text style={styles.formLabel}>Death Year</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g., 2020"
              value={formData.deathYear?.toString()}
              onChangeText={(text) => setFormData({ ...formData, deathYear: parseInt(text) || undefined })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Specializations</Text>
          <View style={styles.specializationGrid}>
            {specializations.map((spec) => (
              <TouchableOpacity
                key={spec.value}
                style={[
                  styles.specializationOption,
                  formData.specialization?.includes(spec.value) && styles.specializationOptionActive
                ]}
                onPress={() => toggleSpecialization(spec.value)}
              >
                <Text style={[
                  styles.specializationOptionText,
                  formData.specialization?.includes(spec.value) && styles.specializationOptionTextActive
                ]}>
                  {spec.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Biography (English)</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="Enter scholar biography"
            value={formData.biography}
            onChangeText={(text) => setFormData({ ...formData, biography: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Biography (Arabic)</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="سيرة العالم"
            value={formData.biographyArabic}
            onChangeText={(text) => setFormData({ ...formData, biographyArabic: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Settings</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Alive</Text>
            <Switch
              value={formData.isAlive || false}
              onValueChange={(value) => setFormData({ ...formData, isAlive: value })}
              trackColor={{ false: colors.divider, true: colors.accentTeal }}
              thumbColor={formData.isAlive ? '#FFFFFF' : colors.textSecondary}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Active</Text>
            <Switch
              value={formData.isActive || false}
              onValueChange={(value) => setFormData({ ...formData, isActive: value })}
              trackColor={{ false: colors.divider, true: colors.accentTeal }}
              thumbColor={formData.isActive ? '#FFFFFF' : colors.textSecondary}
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
            {isEdit ? 'Update Scholar' : 'Add Scholar'}
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
  scholarItem: {
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
  scholarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scholarInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  profileContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profilePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scholarDetails: {
    flex: 1,
  },
  scholarName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  scholarNameArabic: {
    fontSize: 14,
    color: colors.accentTeal,
    marginBottom: 2,
    textAlign: 'right',
  },
  scholarTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  scholarLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  scholarActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  specializationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  specializationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  specializationText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scholarStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scholarStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  scholarStatText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  lifeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  lifeStatusText: {
    fontSize: 12,
    marginLeft: 4,
  },
  scholarFooter: {
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
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    alignItems: 'center',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  specializationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specializationOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.divider,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  specializationOptionActive: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
  },
  specializationOptionText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  specializationOptionTextActive: {
    color: '#FFFFFF',
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
    fontSize: 12,
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

export default AdminScholarsScreen;
