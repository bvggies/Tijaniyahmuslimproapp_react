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

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  profileImage?: string;
  location?: string;
  preferences: {
    language: string;
    notifications: boolean;
    theme: string;
  };
}

const AdminUsersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user' as User['role'],
    status: 'active' as User['status'],
    location: '',
    language: 'en',
    notifications: true,
    theme: 'light',
  });

  const roles = [
    { value: 'user', label: 'User', color: '#4CAF50' },
    { value: 'moderator', label: 'Moderator', color: '#FF9800' },
    { value: 'admin', label: 'Admin', color: '#F44336' },
  ];

  const statuses = [
    { value: 'active', label: 'Active', color: '#4CAF50' },
    { value: 'inactive', label: 'Inactive', color: '#9E9E9E' },
    { value: 'suspended', label: 'Suspended', color: '#F44336' },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // TODO: Replace with actual API call
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'Ahmad Ibrahim',
          role: 'user',
          status: 'active',
          createdAt: '2024-01-15T10:00:00Z',
          lastLogin: '2024-01-20T14:30:00Z',
          location: 'Kano, Nigeria',
          preferences: {
            language: 'en',
            notifications: true,
            theme: 'light',
          },
        },
        {
          id: '2',
          email: 'moderator@example.com',
          name: 'Fatima Aliyu',
          role: 'moderator',
          status: 'active',
          createdAt: '2024-01-10T09:00:00Z',
          lastLogin: '2024-01-20T16:45:00Z',
          location: 'Lagos, Nigeria',
          preferences: {
            language: 'ar',
            notifications: true,
            theme: 'dark',
          },
        },
        {
          id: '3',
          email: 'admin@example.com',
          name: 'Sheikh Muhammad',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-01T08:00:00Z',
          lastLogin: '2024-01-20T18:00:00Z',
          location: 'Kaolack, Senegal',
          preferences: {
            language: 'fr',
            notifications: true,
            theme: 'light',
          },
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.email.trim() || !formData.name.trim()) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const user: User = {
        id: editingUser?.id || Date.now().toString(),
        ...formData,
        createdAt: editingUser?.createdAt || new Date().toISOString(),
        lastLogin: editingUser?.lastLogin || new Date().toISOString(),
        preferences: {
          language: formData.language,
          notifications: formData.notifications,
          theme: formData.theme,
        },
      };

      if (editingUser) {
        setUsers(prev => prev.map(item => 
          item.id === editingUser.id ? user : item
        ));
      } else {
        setUsers(prev => [user, ...prev]);
      }

      setShowAddModal(false);
      setEditingUser(null);
      resetForm();
      Alert.alert('Success', 'User saved successfully');
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Error', 'Failed to save user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      location: user.location || '',
      language: user.preferences.language,
      notifications: user.preferences.notifications,
      theme: user.preferences.theme,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setUsers(prev => prev.filter(item => item.id !== id));
              Alert.alert('Success', 'User deleted successfully');
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const handleSuspend = (id: string) => {
    Alert.alert(
      'Suspend User',
      'Are you sure you want to suspend this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Suspend',
          style: 'destructive',
          onPress: async () => {
            try {
              setUsers(prev => prev.map(user => 
                user.id === id ? { ...user, status: 'suspended' as User['status'] } : user
              ));
              Alert.alert('Success', 'User suspended successfully');
            } catch (error) {
              console.error('Error suspending user:', error);
              Alert.alert('Error', 'Failed to suspend user');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      role: 'user',
      status: 'active',
      location: '',
      language: 'en',
      notifications: true,
      theme: 'light',
    });
  };

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.value === role) || roles[0];
  };

  const getStatusInfo = (status: string) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const renderUser = (user: User) => {
    const roleInfo = getRoleInfo(user.role);
    const statusInfo = getStatusInfo(user.status);

    return (
      <View key={user.id} style={styles.userItem}>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              {user.location && (
                <Text style={styles.userLocation}>
                  <Ionicons name="location" size={12} color={colors.textSecondary} />
                  {' '}{user.location}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.userMeta}>
            <View style={[styles.roleBadge, { backgroundColor: roleInfo.color }]}>
              <Text style={styles.roleText}>{roleInfo.label}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
              <Text style={styles.statusText}>{statusInfo.label}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Joined</Text>
            <Text style={styles.statValue}>{formatDate(user.createdAt)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Last Login</Text>
            <Text style={styles.statValue}>{formatDate(user.lastLogin)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Language</Text>
            <Text style={styles.statValue}>{user.preferences.language.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.userActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(user)}
          >
            <Ionicons name="pencil" size={16} color={colors.accentTeal} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          
          {user.status !== 'suspended' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSuspend(user.id)}
            >
              <Ionicons name="pause-circle" size={16} color="#FF9800" />
              <Text style={styles.actionText}>Suspend</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(user.id)}
          >
            <Ionicons name="trash" size={16} color="#F44336" />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
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
            <Text style={styles.headerTitle}>User Management</Text>
            <Text style={styles.headerSubtitle}>Manage app users</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setEditingUser(null);
              setShowAddModal(true);
            }}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterRole === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilterRole('all')}
            >
              <Text style={[
                styles.filterButtonText,
                filterRole === 'all' && styles.filterButtonTextActive
              ]}>
                All Roles
              </Text>
            </TouchableOpacity>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={[
                  styles.filterButton,
                  filterRole === role.value && styles.filterButtonActive
                ]}
                onPress={() => setFilterRole(role.value)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterRole === role.value && styles.filterButtonTextActive
                ]}>
                  {role.label}
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

      {/* Users List */}
      <ScrollView style={styles.content}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsText}>
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
          </Text>
        </View>
        
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No users found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery || filterRole !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Tap the + button to add your first user'
              }
            </Text>
          </View>
        ) : (
          filteredUsers.map(renderUser)
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
              {editingUser ? 'Edit User' : 'Add User'}
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter user name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Enter user email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="Enter user location"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.roleSelector}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.roleOption,
                      formData.role === role.value && styles.roleOptionSelected,
                      { borderColor: role.color }
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, role: role.value as any }))}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      formData.role === role.value && { color: role.color }
                    ]}>
                      {role.label}
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
              <Text style={styles.label}>Language</Text>
              <View style={styles.languageSelector}>
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    formData.language === 'en' && styles.languageOptionSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, language: 'en' }))}
                >
                  <Text style={[
                    styles.languageOptionText,
                    formData.language === 'en' && styles.languageOptionTextSelected
                  ]}>
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    formData.language === 'ar' && styles.languageOptionSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, language: 'ar' }))}
                >
                  <Text style={[
                    styles.languageOptionText,
                    formData.language === 'ar' && styles.languageOptionTextSelected
                  ]}>
                    العربية
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    formData.language === 'fr' && styles.languageOptionSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, language: 'fr' }))}
                >
                  <Text style={[
                    styles.languageOptionText,
                    formData.language === 'fr' && styles.languageOptionTextSelected
                  ]}>
                    Français
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  formData.notifications && styles.checkboxChecked
                ]}
                onPress={() => setFormData(prev => ({ ...prev, notifications: !prev.notifications }))}
              >
                <Ionicons
                  name={formData.notifications ? "checkmark" : "checkmark-outline"}
                  size={20}
                  color={formData.notifications ? "#FFFFFF" : colors.textSecondary}
                />
                <Text style={[
                  styles.checkboxText,
                  formData.notifications && styles.checkboxTextChecked
                ]}>
                  Enable notifications
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
                {editingUser ? 'Update' : 'Save'}
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
  userItem: {
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
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  userMeta: {
    alignItems: 'flex-end',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
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
  roleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roleOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  roleOptionSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  roleOptionText: {
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
  languageSelector: {
    flexDirection: 'row',
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    marginRight: 8,
  },
  languageOptionSelected: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
  },
  languageOptionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  languageOptionTextSelected: {
    color: '#FFFFFF',
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

export default AdminUsersScreen;
