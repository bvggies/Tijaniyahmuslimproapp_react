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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';

interface AppSettings {
  general: {
    appName: string;
    appVersion: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
    maxFileSize: number; // in MB
    supportedFileTypes: string[];
  };
  notifications: {
    pushNotifications: boolean;
    emailNotifications: boolean;
    prayerTimeNotifications: boolean;
    eventReminders: boolean;
    newsUpdates: boolean;
    donationReceipts: boolean;
  };
  content: {
    autoApproveNews: boolean;
    autoApproveEvents: boolean;
    allowUserSubmissions: boolean;
    moderationRequired: boolean;
    maxContentLength: number;
    allowedImageFormats: string[];
  };
  security: {
    requireStrongPasswords: boolean;
    sessionTimeout: number; // in minutes
    maxLoginAttempts: number;
    enableTwoFactor: boolean;
    ipWhitelist: string[];
    allowedDomains: string[];
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupRetention: number; // in days
    cloudBackup: boolean;
    lastBackupDate: string;
  };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

const AdminSettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const { adminUser, hasPermission, updateProfile, changePassword } = useAdminAuth();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    loadAdminUsers();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Replace with actual API call
      const mockSettings: AppSettings = {
        general: {
          appName: 'Tijaniyah Muslim Pro',
          appVersion: '1.0.0',
          maintenanceMode: false,
          registrationEnabled: true,
          emailVerificationRequired: true,
          maxFileSize: 10,
          supportedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'mp3', 'mp4'],
        },
        notifications: {
          pushNotifications: true,
          emailNotifications: true,
          prayerTimeNotifications: true,
          eventReminders: true,
          newsUpdates: true,
          donationReceipts: true,
        },
        content: {
          autoApproveNews: false,
          autoApproveEvents: false,
          allowUserSubmissions: true,
          moderationRequired: true,
          maxContentLength: 5000,
          allowedImageFormats: ['jpg', 'jpeg', 'png', 'gif'],
        },
        security: {
          requireStrongPasswords: true,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          enableTwoFactor: false,
          ipWhitelist: [],
          allowedDomains: ['tijaniyahpro.com'],
        },
        backup: {
          autoBackup: true,
          backupFrequency: 'daily',
          backupRetention: 30,
          cloudBackup: true,
          lastBackupDate: '2024-01-20T10:00:00Z',
        },
      };
      setSettings(mockSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    try {
      // TODO: Replace with actual API call
      const mockAdmins: AdminUser[] = [
        {
          id: '1',
          name: 'Super Administrator',
          email: 'admin@tijaniyahpro.com',
          role: 'super_admin',
          isActive: true,
          lastLogin: '2024-01-20T10:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          permissions: ['all'],
        },
        {
          id: '2',
          name: 'Content Moderator',
          email: 'moderator@tijaniyahpro.com',
          role: 'moderator',
          isActive: true,
          lastLogin: '2024-01-19T15:30:00Z',
          createdAt: '2024-01-05T00:00:00Z',
          permissions: ['news', 'events', 'lessons', 'scholars'],
        },
        {
          id: '3',
          name: 'Support Admin',
          email: 'support@tijaniyahpro.com',
          role: 'admin',
          isActive: false,
          lastLogin: '2024-01-15T09:20:00Z',
          createdAt: '2024-01-10T00:00:00Z',
          permissions: ['users', 'donations'],
        },
      ];
      setAdminUsers(mockAdmins);
    } catch (error) {
      console.error('Error loading admin users:', error);
    }
  };

  const updateSetting = (section: keyof AppSettings, key: string, value: any) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };
    });
  };

  const saveSettings = async () => {
    try {
      // TODO: Replace with actual API call
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleAddAdmin = async (adminData: Partial<AdminUser>) => {
    try {
      const newAdmin: AdminUser = {
        id: Date.now().toString(),
        name: adminData.name || '',
        email: adminData.email || '',
        role: adminData.role || 'moderator',
        isActive: true,
        lastLogin: '',
        createdAt: new Date().toISOString(),
        permissions: adminData.permissions || [],
      };

      setAdminUsers(prev => [newAdmin, ...prev]);
      Alert.alert('Success', 'Admin user added successfully');
      setShowAddAdminModal(false);
    } catch (error) {
      console.error('Error adding admin:', error);
      Alert.alert('Error', 'Failed to add admin user');
    }
  };

  const handleToggleAdminStatus = (id: string) => {
    setAdminUsers(prev => 
      prev.map(admin => 
        admin.id === id 
          ? { ...admin, isActive: !admin.isActive }
          : admin
      )
    );
  };

  const handleDeleteAdmin = (id: string) => {
    Alert.alert(
      'Delete Admin',
      'Are you sure you want to delete this admin user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAdminUsers(prev => prev.filter(admin => admin.id !== id));
            Alert.alert('Success', 'Admin user deleted successfully');
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderSettingSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderSwitchSetting = (
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    description?: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.divider, true: colors.accentTeal }}
        thumbColor={value ? '#FFFFFF' : colors.textSecondary}
      />
    </View>
  );

  const renderTextSetting = (
    label: string,
    value: string,
    onValueChange: (value: string) => void,
    placeholder?: string,
    keyboardType?: 'default' | 'numeric' | 'email-address'
  ) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onValueChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderAdminUser = (admin: AdminUser) => (
    <View key={admin.id} style={styles.adminItem}>
      <View style={styles.adminInfo}>
        <View style={styles.adminAvatar}>
          <Text style={styles.adminAvatarText}>
            {admin.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.adminDetails}>
          <Text style={styles.adminName}>{admin.name}</Text>
          <Text style={styles.adminEmail}>{admin.email}</Text>
          <Text style={styles.adminRole}>{admin.role}</Text>
        </View>
      </View>
      <View style={styles.adminActions}>
        <View style={styles.adminStatus}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: admin.isActive ? '#4CAF50' : '#9E9E9E' }
          ]} />
          <Text style={[
            styles.statusText,
            { color: admin.isActive ? '#4CAF50' : '#9E9E9E' }
          ]}>
            {admin.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleToggleAdminStatus(admin.id)}
        >
          <Ionicons 
            name={admin.isActive ? 'pause' : 'play'} 
            size={16} 
            color={admin.isActive ? '#FF9800' : '#4CAF50'} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteAdmin(admin.id)}
        >
          <Ionicons name="trash" size={16} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Settings...</Text>
      </View>
    );
  }

  if (!settings) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={colors.textSecondary} />
        <Text style={styles.errorText}>Failed to load settings</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSettings}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            <Text style={styles.headerTitle}>Settings & Permissions</Text>
            <Text style={styles.headerSubtitle}>Manage app configuration</Text>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
            <Ionicons name="checkmark" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Settings</Text>
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => setShowProfileModal(true)}
          >
            <View style={styles.profileInfo}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>
                  {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
                </Text>
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{adminUser?.name}</Text>
                <Text style={styles.profileEmail}>{adminUser?.email}</Text>
                <Text style={styles.profileRole}>{adminUser?.role}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowPasswordModal(true)}
          >
            <Ionicons name="key" size={24} color={colors.accentTeal} />
            <Text style={styles.actionText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* General Settings */}
        {renderSettingSection('General Settings',
          <>
            {renderTextSetting(
              'App Name',
              settings.general.appName,
              (value) => updateSetting('general', 'appName', value)
            )}
            {renderTextSetting(
              'App Version',
              settings.general.appVersion,
              (value) => updateSetting('general', 'appVersion', value)
            )}
            {renderSwitchSetting(
              'Maintenance Mode',
              settings.general.maintenanceMode,
              (value) => updateSetting('general', 'maintenanceMode', value),
              'Temporarily disable app access for maintenance'
            )}
            {renderSwitchSetting(
              'Allow Registration',
              settings.general.registrationEnabled,
              (value) => updateSetting('general', 'registrationEnabled', value),
              'Allow new users to register'
            )}
            {renderSwitchSetting(
              'Email Verification Required',
              settings.general.emailVerificationRequired,
              (value) => updateSetting('general', 'emailVerificationRequired', value),
              'Require email verification for new accounts'
            )}
            {renderTextSetting(
              'Max File Size (MB)',
              settings.general.maxFileSize.toString(),
              (value) => updateSetting('general', 'maxFileSize', parseInt(value) || 10),
              '10',
              'numeric'
            )}
          </>
        )}

        {/* Notification Settings */}
        {renderSettingSection('Notification Settings',
          <>
            {renderSwitchSetting(
              'Push Notifications',
              settings.notifications.pushNotifications,
              (value) => updateSetting('notifications', 'pushNotifications', value)
            )}
            {renderSwitchSetting(
              'Email Notifications',
              settings.notifications.emailNotifications,
              (value) => updateSetting('notifications', 'emailNotifications', value)
            )}
            {renderSwitchSetting(
              'Prayer Time Notifications',
              settings.notifications.prayerTimeNotifications,
              (value) => updateSetting('notifications', 'prayerTimeNotifications', value)
            )}
            {renderSwitchSetting(
              'Event Reminders',
              settings.notifications.eventReminders,
              (value) => updateSetting('notifications', 'eventReminders', value)
            )}
            {renderSwitchSetting(
              'News Updates',
              settings.notifications.newsUpdates,
              (value) => updateSetting('notifications', 'newsUpdates', value)
            )}
            {renderSwitchSetting(
              'Donation Receipts',
              settings.notifications.donationReceipts,
              (value) => updateSetting('notifications', 'donationReceipts', value)
            )}
          </>
        )}

        {/* Content Settings */}
        {renderSettingSection('Content Settings',
          <>
            {renderSwitchSetting(
              'Auto Approve News',
              settings.content.autoApproveNews,
              (value) => updateSetting('content', 'autoApproveNews', value),
              'Automatically approve news submissions'
            )}
            {renderSwitchSetting(
              'Auto Approve Events',
              settings.content.autoApproveEvents,
              (value) => updateSetting('content', 'autoApproveEvents', value),
              'Automatically approve event submissions'
            )}
            {renderSwitchSetting(
              'Allow User Submissions',
              settings.content.allowUserSubmissions,
              (value) => updateSetting('content', 'allowUserSubmissions', value),
              'Allow users to submit content'
            )}
            {renderSwitchSetting(
              'Moderation Required',
              settings.content.moderationRequired,
              (value) => updateSetting('content', 'moderationRequired', value),
              'Require admin approval for user submissions'
            )}
            {renderTextSetting(
              'Max Content Length',
              settings.content.maxContentLength.toString(),
              (value) => updateSetting('content', 'maxContentLength', parseInt(value) || 5000),
              '5000',
              'numeric'
            )}
          </>
        )}

        {/* Security Settings */}
        {renderSettingSection('Security Settings',
          <>
            {renderSwitchSetting(
              'Require Strong Passwords',
              settings.security.requireStrongPasswords,
              (value) => updateSetting('security', 'requireStrongPasswords', value),
              'Enforce strong password requirements'
            )}
            {renderTextSetting(
              'Session Timeout (minutes)',
              settings.security.sessionTimeout.toString(),
              (value) => updateSetting('security', 'sessionTimeout', parseInt(value) || 30),
              '30',
              'numeric'
            )}
            {renderTextSetting(
              'Max Login Attempts',
              settings.security.maxLoginAttempts.toString(),
              (value) => updateSetting('security', 'maxLoginAttempts', parseInt(value) || 5),
              '5',
              'numeric'
            )}
            {renderSwitchSetting(
              'Enable Two-Factor Authentication',
              settings.security.enableTwoFactor,
              (value) => updateSetting('security', 'enableTwoFactor', value),
              'Require 2FA for admin accounts'
            )}
          </>
        )}

        {/* Backup Settings */}
        {renderSettingSection('Backup Settings',
          <>
            {renderSwitchSetting(
              'Auto Backup',
              settings.backup.autoBackup,
              (value) => updateSetting('backup', 'autoBackup', value),
              'Automatically backup app data'
            )}
            {renderSwitchSetting(
              'Cloud Backup',
              settings.backup.cloudBackup,
              (value) => updateSetting('backup', 'cloudBackup', value),
              'Store backups in cloud storage'
            )}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Backup Frequency</Text>
              <View style={styles.optionContainer}>
                {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.optionButton,
                      settings.backup.backupFrequency === freq && styles.optionButtonActive
                    ]}
                    onPress={() => updateSetting('backup', 'backupFrequency', freq)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      settings.backup.backupFrequency === freq && styles.optionButtonTextActive
                    ]}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Last Backup</Text>
              <Text style={styles.settingValue}>
                {formatDate(settings.backup.lastBackupDate)}
              </Text>
            </View>
          </>
        )}

        {/* Admin Users */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Admin Users</Text>
            {hasPermission('settings', 'create') && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddAdminModal(true)}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          {adminUsers.map(renderAdminUser)}
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <ProfileModal
          adminUser={adminUser}
          onClose={() => setShowProfileModal(false)}
          onUpdate={updateProfile}
        />
      </Modal>

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onChangePassword={changePassword}
        />
      </Modal>

      {/* Add Admin Modal */}
      <Modal
        visible={showAddAdminModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddAdminModal(false)}
      >
        <AddAdminModal
          onClose={() => setShowAddAdminModal(false)}
          onAdd={handleAddAdmin}
        />
      </Modal>
    </View>
  );
};

// Profile Modal Component
const ProfileModal: React.FC<{
  adminUser: any;
  onClose: () => void;
  onUpdate: (data: any) => Promise<boolean>;
}> = ({ adminUser, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: adminUser?.name || '',
    email: adminUser?.email || '',
  });

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const success = await onUpdate(formData);
    if (success) {
      onClose();
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.modalContent}>
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput
            style={styles.formInput}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Email</Text>
          <TextInput
            style={styles.formInput}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>
      </View>

      <View style={styles.modalActions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Password Modal Component
const PasswordModal: React.FC<{
  onClose: () => void;
  onChangePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}> = ({ onClose, onChangePassword }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async () => {
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    const success = await onChangePassword(formData.oldPassword, formData.newPassword);
    if (success) {
      Alert.alert('Success', 'Password changed successfully');
      onClose();
    } else {
      Alert.alert('Error', 'Failed to change password');
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Change Password</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.modalContent}>
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Current Password</Text>
          <TextInput
            style={styles.formInput}
            value={formData.oldPassword}
            onChangeText={(text) => setFormData({ ...formData, oldPassword: text })}
            placeholder="Enter current password"
            secureTextEntry
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>New Password</Text>
          <TextInput
            style={styles.formInput}
            value={formData.newPassword}
            onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
            placeholder="Enter new password"
            secureTextEntry
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Confirm New Password</Text>
          <TextInput
            style={styles.formInput}
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            placeholder="Confirm new password"
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.modalActions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Add Admin Modal Component
const AddAdminModal: React.FC<{
  onClose: () => void;
  onAdd: (data: Partial<AdminUser>) => void;
}> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'moderator' as 'super_admin' | 'admin' | 'moderator',
    password: '',
  });

  const roles = [
    { value: 'moderator', label: 'Moderator' },
    { value: 'admin', label: 'Admin' },
    { value: 'super_admin', label: 'Super Admin' },
  ];

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    onAdd(formData);
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Add Admin User</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.modalContent}>
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput
            style={styles.formInput}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter admin name"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Email</Text>
          <TextInput
            style={styles.formInput}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter admin email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Role</Text>
          <View style={styles.optionContainer}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={[
                  styles.optionButton,
                  formData.role === role.value && styles.optionButtonActive
                ]}
                onPress={() => setFormData({ ...formData, role: role.value as any })}
              >
                <Text style={[
                  styles.optionButtonText,
                  formData.role === role.value && styles.optionButtonTextActive
                ]}>
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Password</Text>
          <TextInput
            style={styles.formInput}
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            placeholder="Enter temporary password"
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.modalActions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Add Admin</Text>
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
  saveButton: {
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.accentTeal,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 12,
    color: colors.accentTeal,
    textTransform: 'capitalize',
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  settingItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.divider,
    marginTop: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.divider,
    marginRight: 8,
    backgroundColor: colors.background,
  },
  optionButtonActive: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
  },
  optionButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
  },
  adminItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adminAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adminAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  adminDetails: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  adminEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  adminRole: {
    fontSize: 12,
    color: colors.accentTeal,
    textTransform: 'capitalize',
  },
  adminActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    padding: 8,
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
  formSection: {
    marginBottom: 20,
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

export default AdminSettingsScreen;
