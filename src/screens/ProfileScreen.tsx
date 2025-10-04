import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import ProfileAvatar from '../components/ProfileAvatar';

const { width } = Dimensions.get('window');

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
}

export default function ProfileScreen({ navigation }: any) {
  const { authState, updateProfile, logout } = useAuth();
  const { t } = useLanguage();
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
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    setProfile({
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
    });
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

  const handleImagePicker = () => {
    setShowImagePicker(true);
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
        setTempProfile({
          ...tempProfile,
          profilePicture: result.assets[0].uri,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
    setShowImagePicker(false);
  };

  const renderProfileHeader = () => (
    <LinearGradient
      colors={[colors.accentTeal, colors.accentGreen]}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={isEditing ? handleSave : handleEdit}
        >
          <Ionicons 
            name={isEditing ? "checkmark" : "create-outline"} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>
        </LinearGradient>
  );

  const renderProfileInfo = () => (
    <View style={styles.profileInfoContainer}>
      <TouchableOpacity
        style={styles.profilePictureContainer}
        onPress={isEditing ? handleImagePicker : undefined}
        disabled={!isEditing}
      >
              <ProfileAvatar 
          profilePicture={isEditing ? tempProfile.profilePicture : profile.profilePicture}
          name={isEditing ? tempProfile.name : profile.name}
          size={120}
          showBorder={true}
        />
        {isEditing && (
          <View style={styles.editIconContainer}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.profileDetails}>
        {isEditing ? (
          <TextInput
            style={styles.nameInput}
            value={tempProfile.name}
            onChangeText={(text) => setTempProfile({ ...tempProfile, name: text })}
            placeholder="Enter your name"
            placeholderTextColor={colors.textSecondary}
          />
        ) : (
          <Text style={styles.nameText}>{profile.name || 'User'}</Text>
        )}

        <Text style={styles.emailText}>{profile.email}</Text>
        
        {isEditing ? (
          <TextInput
            style={styles.bioInput}
            value={tempProfile.bio}
            onChangeText={(text) => setTempProfile({ ...tempProfile, bio: text })}
            placeholder="Tell us about yourself..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        ) : (
          <Text style={styles.bioText}>{profile.bio || 'No bio available'}</Text>
        )}
              </View>
            </View>
  );

  const renderContactInfo = () => (
          <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.infoItem}>
        <View style={styles.infoIcon}>
          <Ionicons name="mail" size={20} color={colors.accentTeal} />
            </View>
              <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoInput}
              value={tempProfile.email}
              onChangeText={(text) => setTempProfile({ ...tempProfile, email: text })}
              placeholder="Enter email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.infoValue}>{profile.email}</Text>
          )}
              </View>
            </View>

            <View style={styles.infoItem}>
        <View style={styles.infoIcon}>
          <Ionicons name="call" size={20} color={colors.accentTeal} />
            </View>
              <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Phone</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoInput}
              value={tempProfile.phone}
              onChangeText={(text) => setTempProfile({ ...tempProfile, phone: text })}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.infoValue}>{profile.phone || 'Not provided'}</Text>
          )}
            </View>
          </View>

          <View style={styles.infoItem}>
        <View style={styles.infoIcon}>
          <Ionicons name="location" size={20} color={colors.accentTeal} />
            </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
          {isEditing ? (
            <TextInput
              style={styles.infoInput}
              value={typeof tempProfile.location === 'string' 
                ? tempProfile.location 
                : tempProfile.location?.city && tempProfile.location?.country 
                  ? `${tempProfile.location.city}, ${tempProfile.location.country}`
                  : ''
              }
              onChangeText={(text) => setTempProfile({ ...tempProfile, location: text })}
              placeholder="Enter location"
              placeholderTextColor={colors.textSecondary}
            />
          ) : (
            <Text style={styles.infoValue}>
              {typeof profile.location === 'string' 
                ? profile.location 
                : profile.location?.city && profile.location?.country 
                  ? `${profile.location.city}, ${profile.location.country}`
                  : 'Not provided'
              }
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderPreferences = () => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceContent}>
          <Ionicons name="notifications" size={20} color={colors.accentTeal} />
          <Text style={styles.preferenceLabel}>Push Notifications</Text>
            </View>
        <Switch
          value={isEditing ? tempProfile.preferences.notifications : profile.preferences.notifications}
          onValueChange={(value) => isEditing && setTempProfile({
            ...tempProfile,
            preferences: { ...tempProfile.preferences, notifications: value }
          })}
          trackColor={{ false: colors.divider, true: colors.accentTeal }}
          thumbColor={isEditing ? (tempProfile.preferences.notifications ? '#FFFFFF' : '#FFFFFF') : '#FFFFFF'}
          disabled={!isEditing}
        />
          </View>

      <View style={styles.preferenceItem}>
        <View style={styles.preferenceContent}>
          <Ionicons name="moon" size={20} color={colors.accentTeal} />
          <Text style={styles.preferenceLabel}>Dark Mode</Text>
            </View>
        <Switch
          value={isEditing ? tempProfile.preferences.darkMode : profile.preferences.darkMode}
          onValueChange={(value) => isEditing && setTempProfile({
            ...tempProfile,
            preferences: { ...tempProfile.preferences, darkMode: value }
          })}
          trackColor={{ false: colors.divider, true: colors.accentTeal }}
          thumbColor={isEditing ? (tempProfile.preferences.darkMode ? '#FFFFFF' : '#FFFFFF') : '#FFFFFF'}
          disabled={!isEditing}
        />
          </View>

      <View style={styles.preferenceItem}>
        <View style={styles.preferenceContent}>
          <Ionicons name="time" size={20} color={colors.accentTeal} />
          <Text style={styles.preferenceLabel}>Time Format</Text>
        </View>
        <View style={styles.timeFormatContainer}>
          <TouchableOpacity
            style={[
              styles.timeFormatButton,
              (isEditing ? tempProfile.preferences.timeFormat : profile.preferences.timeFormat) === '12h' && styles.timeFormatButtonActive
            ]}
            onPress={() => isEditing && setTempProfile({
              ...tempProfile,
              preferences: { ...tempProfile.preferences, timeFormat: '12h' }
            })}
            disabled={!isEditing}
          >
            <Text style={[
              styles.timeFormatText,
              (isEditing ? tempProfile.preferences.timeFormat : profile.preferences.timeFormat) === '12h' && styles.timeFormatTextActive
            ]}>
              12h
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeFormatButton,
              (isEditing ? tempProfile.preferences.timeFormat : profile.preferences.timeFormat) === '24h' && styles.timeFormatButtonActive
            ]}
            onPress={() => isEditing && setTempProfile({
              ...tempProfile,
              preferences: { ...tempProfile.preferences, timeFormat: '24h' }
            })}
            disabled={!isEditing}
          >
            <Text style={[
              styles.timeFormatText,
              (isEditing ? tempProfile.preferences.timeFormat : profile.preferences.timeFormat) === '24h' && styles.timeFormatTextActive
            ]}>
              24h
            </Text>
          </TouchableOpacity>
            </View>
          </View>

      <View style={styles.preferenceItem}>
        <View style={styles.preferenceContent}>
          <Ionicons name="language" size={20} color={colors.accentTeal} />
          <Text style={styles.preferenceLabel}>Language</Text>
            </View>
        <LanguageSelector />
          </View>
        </View>
  );

  const renderActions = () => (
        <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account Actions</Text>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {
          Alert.alert(
            'Export Data',
            'This feature will export your profile data, preferences, and app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Export', onPress: () => {
                Alert.alert('Success', 'Data export feature will be implemented in a future update.');
              }}
            ]
          );
        }}
      >
        <Ionicons name="download" size={20} color={colors.accentTeal} />
        <Text style={styles.actionButtonText}>Export Data</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {
          Alert.alert(
            'Help & Support',
            'Need help? Contact our support team or check our FAQ section.',
            [
              { text: 'FAQ', onPress: () => {
                Alert.alert('FAQ', 'Frequently Asked Questions will be available soon.');
              }},
              { text: 'Contact Support', onPress: () => {
                Alert.alert('Contact Support', 'Email: support@tijaniyahpro.com\nPhone: +1 (555) 123-4567');
              }},
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }}
      >
        <Ionicons name="help-circle" size={20} color={colors.accentTeal} />
        <Text style={styles.actionButtonText}>Help & Support</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {
          Alert.alert(
            'About Tijaniyah Pro',
            'Version: 1.0.0\n\nTijaniyah Pro is a comprehensive Islamic app for followers of the Tijaniyya Tariqa. It provides prayer times, Qibla direction, Islamic calendar, and spiritual guidance.\n\n© 2024 Tijaniyah Pro. All rights reserved.',
            [{ text: 'OK' }]
          );
        }}
      >
        <Ionicons name="information-circle" size={20} color={colors.accentTeal} />
        <Text style={styles.actionButtonText}>About</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.actionButton, styles.logoutButton]}
        onPress={() => {
          Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive', onPress: async () => {
                try {
                  await logout();
                  Alert.alert('Success', 'You have been logged out successfully.');
                } catch (error) {
                  Alert.alert('Error', 'Failed to logout. Please try again.');
                }
              }}
            ]
          );
        }}
      >
        <Ionicons name="log-out" size={20} color="#FF5722" />
        <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderProfileHeader()}
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderProfileInfo()}
        {renderContactInfo()}
        {renderPreferences()}
        {renderActions()}
        
        {isEditing && (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
        )}
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Profile Picture</Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => pickImage('camera')}
            >
              <Ionicons name="camera" size={24} color={colors.accentTeal} />
              <Text style={styles.modalButtonText}>Take Photo</Text>
              </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => pickImage('library')}
            >
              <Ionicons name="images" size={24} color={colors.accentTeal} />
              <Text style={styles.modalButtonText}>Choose from Library</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
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
    backgroundColor: colors.background,
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  profileInfoContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.accentTeal,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    alignItems: 'center',
    width: '100%',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.accentTeal,
    paddingBottom: 4,
    width: '100%',
  },
  emailText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bioInput: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.accentTeal,
    paddingBottom: 4,
    width: '100%',
    minHeight: 60,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  infoInput: {
    fontSize: 16,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.accentTeal,
    paddingBottom: 4,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  timeFormatContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 2,
  },
  timeFormatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  timeFormatButtonActive: {
    backgroundColor: colors.accentTeal,
  },
  timeFormatText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  timeFormatTextActive: {
    color: '#FFFFFF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF5722',
  },
  editActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentTeal,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.accentTeal,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.accentTeal,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 300,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E8F5E8',
    marginBottom: 12,
  },
  modalButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  modalCancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});