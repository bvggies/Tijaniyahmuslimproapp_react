import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import ProfileAvatar from '../components/ProfileAvatar';

export default function ProfileScreen() {
  const { authState, logout, updateProfile, continueAsGuest } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: authState.user?.name || '',
    phone: authState.user?.phone || '',
    city: authState.user?.location?.city || '',
    country: authState.user?.location?.country || '',
  });

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        name: editData.name.trim(),
        phone: editData.phone.trim() || undefined,
        location: (editData.city.trim() || editData.country.trim()) ? {
          city: editData.city.trim(),
          country: editData.country.trim(),
        } : undefined,
      });
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleProfilePictureChange = async (imageUri: string) => {
    try {
      await updateProfile({
        profilePicture: imageUri,
      });
      Alert.alert('Success', 'Profile picture updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Guest user view
  if (authState.isGuest) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
          <Text style={styles.headerTitle}>Guest Mode</Text>
          <Text style={styles.headerSubtitle}>Limited access to features</Text>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Guest Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <ProfileAvatar 
                size={80}
                showBorder={false}
              />
            </View>
            <Text style={styles.userName}>Guest User</Text>
            <Text style={styles.userEmail}>Limited access mode</Text>
          </View>

          {/* Available Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Features</Text>
            
            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Prayer Times</Text>
                <Text style={styles.infoValue}>Full access</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Qibla Compass</Text>
                <Text style={styles.infoValue}>Full access</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Duas & Quran</Text>
                <Text style={styles.infoValue}>Full access</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Digital Tasbih</Text>
                <Text style={styles.infoValue}>Full access</Text>
              </View>
            </View>
          </View>

          {/* Limited Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requires Account</Text>
            
            <View style={styles.infoItem}>
              <Ionicons name="lock-closed" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Islamic Journal</Text>
                <Text style={styles.infoValue}>Personal reflections</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="lock-closed" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Community</Text>
                <Text style={styles.infoValue}>Connect with Muslims</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="lock-closed" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>AI Noor</Text>
                <Text style={styles.infoValue}>AI Islamic assistant</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="lock-closed" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Makkah Live</Text>
                <Text style={styles.infoValue}>Live streams from Kaaba</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="person-add" size={20} color={colors.accentTeal} />
              <Text style={styles.actionButtonText}>Create Free Account</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="log-in" size={20} color={colors.accentTeal} />
              <Text style={styles.actionButtonText}>Sign In</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={() => {
              Alert.alert(
                'Exit Guest Mode',
                'Are you sure you want to exit guest mode?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Exit', style: 'destructive', onPress: () => {
                    // This will take them back to the auth flow
                    logout();
                  }},
                ]
              );
            }}>
              <Ionicons name="exit" size={20} color="#FF6B6B" />
              <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Exit Guest Mode</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (!authState.user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <ProfileAvatar 
              profilePicture={authState.user.profilePicture}
              name={authState.user.name}
              size={80}
              showBorder={false}
              editable={true}
              onImageChange={handleProfilePictureChange}
            />
            <TouchableOpacity style={styles.editButton} onPress={() => setShowEditModal(true)}>
              <Ionicons name="create" size={16} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{authState.user.name}</Text>
          <Text style={styles.userEmail}>{authState.user.email}</Text>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="person" size={20} color={colors.accentTeal} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{authState.user.name}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="mail" size={20} color={colors.accentTeal} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{authState.user.email}</Text>
            </View>
          </View>

          {authState.user.phone && (
            <View style={styles.infoItem}>
              <Ionicons name="call" size={20} color={colors.accentTeal} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{authState.user.phone}</Text>
              </View>
            </View>
          )}

          {authState.user.location && (
            <View style={styles.infoItem}>
              <Ionicons name="location" size={20} color={colors.accentTeal} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>
                  {authState.user.location.city && authState.user.location.country
                    ? `${authState.user.location.city}, ${authState.user.location.country}`
                    : authState.user.location.city || authState.user.location.country}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="calculator" size={20} color={colors.accentTeal} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Prayer Method</Text>
              <Text style={styles.infoValue}>{authState.user.preferences.prayerMethod}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="language" size={20} color={colors.accentTeal} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Language</Text>
              <Text style={styles.infoValue}>
                {authState.user.preferences.language === 'en' ? 'English' : 'Arabic'}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="notifications" size={20} color={colors.accentTeal} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Notifications</Text>
              <Text style={styles.infoValue}>
                {authState.user.preferences.notifications ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color={colors.accentTeal} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{formatDate(authState.user.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="time" size={20} color={colors.accentTeal} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Last Login</Text>
              <Text style={styles.infoValue}>{formatDate(authState.user.lastLogin)}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowEditModal(true)}>
            <Ionicons name="create" size={20} color={colors.accentTeal} />
            <Text style={styles.actionButtonText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings" size={20} color={colors.accentTeal} />
            <Text style={styles.actionButtonText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="help-circle" size={20} color={colors.accentTeal} />
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#FF6B6B" />
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editData.name}
                  onChangeText={(value) => setEditData(prev => ({ ...prev, name: value }))}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editData.phone}
                  onChangeText={(value) => setEditData(prev => ({ ...prev, phone: value }))}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.input}
                  value={editData.city}
                  onChangeText={(value) => setEditData(prev => ({ ...prev, city: value }))}
                  placeholder="Enter your city"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Country</Text>
                <TextInput
                  style={styles.input}
                  value={editData.country}
                  onChangeText={(value) => setEditData(prev => ({ ...prev, country: value }))}
                  placeholder="Enter your country"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                <LinearGradient colors={[colors.accentTeal, colors.accentGreen]} style={styles.saveButtonGradient}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.mintSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutButtonText: {
    color: '#FF6B6B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalBody: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
});
