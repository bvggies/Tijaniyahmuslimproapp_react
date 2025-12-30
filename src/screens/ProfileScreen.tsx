import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  Switch,
  Dimensions,
  Animated,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import CloudinaryService from '../services/cloudinaryService';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string | { city: string; country: string };
  bio: string;
  profilePicture?: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    timeFormat: '12h' | '24h';
    language: string;
    prayerMethod?: string;
  };
  stats?: {
    posts: number;
    prayers: number;
    streak: number;
  };
}

export default function ProfileScreen({ navigation }: any) {
  const { authState, updateProfile, logout } = useAuth();
  const { t } = useLanguage();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const [profile, setProfile] = useState<UserProfile>({
    name: authState.user?.name || '',
    email: authState.user?.email || '',
    phone: authState.user?.phone || '',
    location: authState.user?.location || '',
    bio: authState.user?.bio || '',
    profilePicture: authState.user?.profilePicture,
    preferences: {
      notifications: true,
      darkMode: false,
      timeFormat: '24h',
      language: 'en',
    },
    stats: {
      posts: 12,
      prayers: 1543,
      streak: 45,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const cloudinaryService = CloudinaryService.getInstance();

  useEffect(() => {
    setProfile({
      ...profile,
      name: authState.user?.name || '',
      email: authState.user?.email || '',
      phone: authState.user?.phone || '',
      location: authState.user?.location || '',
      bio: authState.user?.bio || '',
      profilePicture: authState.user?.profilePicture,
    });
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [authState.user]);

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        ...authState.user,
        ...tempProfile,
      });
      setProfile(tempProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      let result;
      if (source === 'camera') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Photo library permission is needed to select images.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setShowImagePicker(false);
        setIsUploading(true);
        
        // Upload to Cloudinary
        const uploadResult = await cloudinaryService.uploadProfilePicture(result.assets[0].uri);
        
        if (uploadResult.success && uploadResult.url) {
          setTempProfile({
            ...tempProfile,
            profilePicture: uploadResult.url,
          });
          Alert.alert('Success', 'Profile picture uploaded successfully!');
        } else {
          Alert.alert('Upload Failed', uploadResult.error || 'Failed to upload image');
        }
        
        setIsUploading(false);
      }
    } catch (error) {
      setIsUploading(false);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
    setShowImagePicker(false);
  };

  // Animated header opacity
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const profileScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp',
  });

  const renderProfileAvatar = () => {
    const imageSource = isEditing ? tempProfile.profilePicture : profile.profilePicture;
    const displayName = isEditing ? tempProfile.name : profile.name;
    const initials = displayName
      ? displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';

    return (
      <Animated.View style={[styles.avatarContainer, { transform: [{ scale: profileScale }] }]}>
        <TouchableOpacity
          onPress={isEditing ? () => setShowImagePicker(true) : undefined}
          disabled={!isEditing || isUploading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00BFA5', '#11C48D', '#00897B']}
            style={styles.avatarGradientBorder}
          >
            <View style={styles.avatarInner}>
              {isUploading ? (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#00BFA5" />
                </View>
              ) : imageSource ? (
                <Image source={{ uri: imageSource }} style={styles.avatarImage} />
              ) : (
                <LinearGradient
                  colors={['#0B3F39', '#052F2A']}
                  style={styles.avatarPlaceholder}
                >
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </LinearGradient>
              )}
            </View>
          </LinearGradient>
          {isEditing && !isUploading && (
            <View style={styles.editAvatarBadge}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderStatsCard = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{profile.stats?.posts || 0}</Text>
        <Text style={styles.statLabel}>Posts</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{profile.stats?.prayers || 0}</Text>
        <Text style={styles.statLabel}>Prayers</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={16} color="#FF6B35" />
          <Text style={styles.statNumber}>{profile.stats?.streak || 0}</Text>
        </View>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
    </View>
  );

  const renderSection = (
    title: string,
    icon: string,
    children: React.ReactNode,
    sectionKey: string
  ) => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setActiveSection(activeSection === sectionKey ? null : sectionKey)}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderLeft}>
          <View style={styles.sectionIconContainer}>
            <Ionicons name={icon as any} size={20} color="#00BFA5" />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Ionicons
          name={activeSection === sectionKey ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
      {(activeSection === sectionKey || activeSection === null) && (
        <View style={styles.sectionContent}>{children}</View>
      )}
    </Animated.View>
  );

  const renderInfoRow = (
    icon: string,
    label: string,
    value: string,
    field: string,
    keyboardType: any = 'default'
  ) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <Ionicons name={icon as any} size={18} color="#00BFA5" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.infoInput}
            value={(tempProfile as any)[field] || ''}
            onChangeText={(text) => setTempProfile({ ...tempProfile, [field]: text })}
            placeholder={`Enter ${label.toLowerCase()}`}
            placeholderTextColor="rgba(255,255,255,0.3)"
            keyboardType={keyboardType}
          />
        ) : (
          <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
        )}
      </View>
    </View>
  );

  const renderPreferenceRow = (
    icon: string,
    label: string,
    value: boolean,
    field: string
  ) => (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceLeft}>
        <View style={styles.preferenceIconContainer}>
          <Ionicons name={icon as any} size={18} color="#00BFA5" />
        </View>
        <Text style={styles.preferenceLabel}>{label}</Text>
      </View>
      <Switch
        value={isEditing ? (tempProfile.preferences as any)[field] : value}
        onValueChange={(val) =>
          isEditing &&
          setTempProfile({
            ...tempProfile,
            preferences: { ...tempProfile.preferences, [field]: val },
          })
        }
        trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(0,191,165,0.5)' }}
        thumbColor={value ? '#00BFA5' : '#666'}
        disabled={!isEditing}
      />
    </View>
  );

  const renderActionButton = (
    icon: string,
    label: string,
    onPress: () => void,
    danger = false
  ) => (
    <TouchableOpacity
      style={[styles.actionButton, danger && styles.dangerButton]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIconContainer, danger && styles.dangerIconContainer]}>
        <Ionicons name={icon as any} size={20} color={danger ? '#FF5252' : '#00BFA5'} />
      </View>
      <Text style={[styles.actionLabel, danger && styles.dangerLabel]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#052F2A" />
      
      {/* Animated Mini Header */}
      <Animated.View style={[styles.miniHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={80} tint="dark" style={styles.miniHeaderBlur}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.miniHeaderBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.miniHeaderTitle}>{profile.name || 'Profile'}</Text>
          <TouchableOpacity
            onPress={isEditing ? handleSave : handleEdit}
            style={styles.miniHeaderBtn}
          >
            <Ionicons name={isEditing ? 'checkmark' : 'create-outline'} size={24} color="#00BFA5" />
          </TouchableOpacity>
        </BlurView>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      >
        {/* Profile Header */}
        <LinearGradient colors={['#052F2A', '#0B3F39', '#0D4A43']} style={styles.headerGradient}>
          {/* Background Pattern */}
          <View style={styles.headerPattern}>
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.patternDot,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.3,
                  },
                ]}
              />
            ))}
          </View>

          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerButton}
            >
              <BlurView intensity={30} tint="dark" style={styles.headerButtonBlur}>
                <Ionicons name="arrow-back" size={22} color="#FFF" />
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={isEditing ? handleSave : handleEdit}
              style={styles.headerButton}
            >
              <BlurView intensity={30} tint="dark" style={styles.headerButtonBlur}>
                <Ionicons
                  name={isEditing ? 'checkmark' : 'create-outline'}
                  size={22}
                  color="#00BFA5"
                />
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          {renderProfileAvatar()}

          {/* Name & Bio */}
          <View style={styles.profileInfo}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={tempProfile.name}
                onChangeText={(text) => setTempProfile({ ...tempProfile, name: text })}
                placeholder="Your name"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            ) : (
              <Text style={styles.profileName}>{profile.name || 'User'}</Text>
            )}
            <Text style={styles.profileEmail}>{profile.email}</Text>
            {isEditing ? (
              <TextInput
                style={styles.bioInput}
                value={tempProfile.bio}
                onChangeText={(text) => setTempProfile({ ...tempProfile, bio: text })}
                placeholder="Tell us about yourself..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                multiline
                numberOfLines={2}
              />
            ) : (
              <Text style={styles.profileBio}>{profile.bio || 'No bio yet'}</Text>
            )}
          </View>

          {/* Stats */}
          {renderStatsCard()}
        </LinearGradient>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Contact Information */}
          {renderSection('Contact Information', 'person-circle-outline', (
            <>
              {renderInfoRow('mail-outline', 'Email', profile.email, 'email', 'email-address')}
              {renderInfoRow('call-outline', 'Phone', profile.phone, 'phone', 'phone-pad')}
              {renderInfoRow(
                'location-outline',
                'Location',
                typeof profile.location === 'string'
                  ? profile.location
                  : profile.location?.city
                  ? `${profile.location.city}, ${profile.location.country}`
                  : '',
                'location'
              )}
            </>
          ), 'contact')}

          {/* Preferences */}
          {renderSection('Preferences', 'settings-outline', (
            <>
              {renderPreferenceRow('notifications-outline', 'Push Notifications', profile.preferences.notifications, 'notifications')}
              {renderPreferenceRow('moon-outline', 'Dark Mode', profile.preferences.darkMode, 'darkMode')}
              <View style={styles.preferenceRow}>
                <View style={styles.preferenceLeft}>
                  <View style={styles.preferenceIconContainer}>
                    <Ionicons name="time-outline" size={18} color="#00BFA5" />
                  </View>
                  <Text style={styles.preferenceLabel}>Time Format</Text>
                </View>
                <View style={styles.timeToggle}>
                  {['12h', '24h'].map((format) => (
                    <TouchableOpacity
                      key={format}
                      style={[
                        styles.timeOption,
                        (isEditing ? tempProfile.preferences.timeFormat : profile.preferences.timeFormat) === format &&
                          styles.timeOptionActive,
                      ]}
                      onPress={() =>
                        isEditing &&
                        setTempProfile({
                          ...tempProfile,
                          preferences: { ...tempProfile.preferences, timeFormat: format as '12h' | '24h' },
                        })
                      }
                      disabled={!isEditing}
                    >
                      <Text
                        style={[
                          styles.timeOptionText,
                          (isEditing ? tempProfile.preferences.timeFormat : profile.preferences.timeFormat) === format &&
                            styles.timeOptionTextActive,
                        ]}
                      >
                        {format}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.preferenceRow}>
                <View style={styles.preferenceLeft}>
                  <View style={styles.preferenceIconContainer}>
                    <Ionicons name="language-outline" size={18} color="#00BFA5" />
                  </View>
                  <Text style={styles.preferenceLabel}>Language</Text>
                </View>
                <LanguageSelector />
              </View>
            </>
          ), 'preferences')}

          {/* Account Actions */}
          {renderSection('Account', 'shield-checkmark-outline', (
            <>
              {renderActionButton('download-outline', 'Export Data', () => {
                Alert.alert('Export Data', 'Your data will be prepared for download.');
              })}
              {renderActionButton('help-circle-outline', 'Help & Support', () => {
                Alert.alert('Help & Support', 'Email: support@tijaniyahpro.com');
              })}
              {renderActionButton('information-circle-outline', 'About', () => {
                Alert.alert(
                  'Tijaniyah Muslim Pro',
                  'Version 1.0.0\n\nA comprehensive Islamic app for the Tijaniyya community.\n\n© 2024 All rights reserved.'
                );
              })}
              {renderActionButton('log-out-outline', 'Logout', () => {
                Alert.alert('Logout', 'Are you sure you want to logout?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                      await logout();
                    },
                  },
                ]);
              }, true)}
            </>
          ), 'account')}

          {/* Edit Actions */}
          {isEditing && (
            <View style={styles.editActionsContainer}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <LinearGradient
                  colors={['#00BFA5', '#11C48D']}
                  style={styles.saveBtnGradient}
                >
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </View>
      </Animated.ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImagePicker(false)}
        >
          <View style={styles.modalContent}>
            <LinearGradient colors={['#0B3F39', '#052F2A']} style={styles.modalGradient}>
              <Text style={styles.modalTitle}>Change Profile Picture</Text>
              <Text style={styles.modalSubtitle}>
                Choose how you'd like to update your photo
              </Text>

              <TouchableOpacity style={styles.modalOption} onPress={() => pickImage('camera')}>
                <View style={styles.modalOptionIcon}>
                  <Ionicons name="camera" size={24} color="#00BFA5" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Take Photo</Text>
                  <Text style={styles.modalOptionDesc}>Use your camera</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalOption} onPress={() => pickImage('library')}>
                <View style={styles.modalOptionIcon}>
                  <Ionicons name="images" size={24} color="#00BFA5" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Choose from Library</Text>
                  <Text style={styles.modalOptionDesc}>Select existing photo</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowImagePicker(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#052F2A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  
  // Mini Header (appears on scroll)
  miniHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 90,
  },
  miniHeaderBlur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  miniHeaderBtn: {
    padding: 8,
  },
  miniHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },

  // Header Gradient
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  patternDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00BFA5',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerButtonBlur: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Avatar
  avatarContainer: {
    marginBottom: 16,
  },
  avatarGradientBorder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    padding: 4,
    elevation: 8,
    shadowColor: '#00BFA5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 62,
    overflow: 'hidden',
    backgroundColor: '#0B3F39',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 40,
    fontWeight: '700',
    color: '#00BFA5',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00BFA5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0B3F39',
  },

  // Profile Info
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#00BFA5',
    paddingBottom: 4,
    marginBottom: 4,
    minWidth: 200,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  bioInput: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,191,165,0.5)',
    paddingBottom: 4,
    minWidth: width - 80,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 16,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Content Container
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // Section
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0,191,165,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,191,165,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    color: '#FFF',
  },
  infoInput: {
    fontSize: 15,
    color: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,191,165,0.5)',
    paddingVertical: 4,
  },

  // Preference Row
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,191,165,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  preferenceLabel: {
    fontSize: 15,
    color: '#FFF',
  },
  timeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 2,
  },
  timeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeOptionActive: {
    backgroundColor: '#00BFA5',
  },
  timeOptionText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  timeOptionTextActive: {
    color: '#FFF',
  },

  // Action Button
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dangerButton: {
    borderBottomWidth: 0,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,191,165,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dangerIconContainer: {
    backgroundColor: 'rgba(255,82,82,0.1)',
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    color: '#FFF',
  },
  dangerLabel: {
    color: '#FF5252',
  },

  // Edit Actions
  editActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  saveBtnText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '600',
  },

  bottomSpacer: {
    height: 40,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  modalOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,191,165,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 2,
  },
  modalOptionDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  modalCancel: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
});
