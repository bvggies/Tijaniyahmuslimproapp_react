import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import AdminLoginScreen from './AdminLoginScreen';
import AdminDashboard from './AdminDashboard';
import AdminNewsScreen from './AdminNewsScreen';
import AdminEventsScreen from './AdminEventsScreen';
import AdminUsersScreen from './AdminUsersScreen';
import AdminDonationsScreen from './AdminDonationsScreen';
import AdminUploadsScreen from './AdminUploadsScreen';
import AdminLessonsScreen from './AdminLessonsScreen';
import AdminScholarsScreen from './AdminScholarsScreen';
import AdminAnalyticsScreen from './AdminAnalyticsScreen';
import AdminSettingsScreen from './AdminSettingsScreen';

interface AdminMainScreenProps {
  navigation: any;
}

const AdminMainScreen: React.FC<AdminMainScreenProps> = ({ navigation }) => {
  const { isAuthenticated, isLoading, adminUser, logout } = useAdminAuth();
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLoginSuccess = () => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentScreen('login');
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from the admin panel?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => setShowLogoutModal(true),
        },
      ]
    );
  };

  const renderCurrentScreen = () => {
    const screenProps = { navigation: { goBack: () => setCurrentScreen('dashboard') } };

    switch (currentScreen) {
      case 'login':
        return <AdminLoginScreen onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        return <AdminDashboard navigation={screenProps.navigation} />;
      case 'news':
        return <AdminNewsScreen navigation={screenProps.navigation} />;
      case 'events':
        return <AdminEventsScreen navigation={screenProps.navigation} />;
      case 'users':
        return <AdminUsersScreen navigation={screenProps.navigation} />;
      case 'donations':
        return <AdminDonationsScreen navigation={screenProps.navigation} />;
      case 'uploads':
        return <AdminUploadsScreen navigation={screenProps.navigation} />;
      case 'lessons':
        return <AdminLessonsScreen navigation={screenProps.navigation} />;
      case 'scholars':
        return <AdminScholarsScreen navigation={screenProps.navigation} />;
      case 'analytics':
        return <AdminAnalyticsScreen navigation={screenProps.navigation} />;
      case 'settings':
        return <AdminSettingsScreen navigation={screenProps.navigation} />;
      default:
        return <AdminDashboard navigation={screenProps.navigation} />;
    }
  };

  const renderSidebar = () => {
    if (!isAuthenticated || currentScreen === 'login') return null;

    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'grid', color: colors.accentTeal },
      { id: 'news', label: 'News & Updates', icon: 'newspaper', color: '#2196F3' },
      { id: 'events', label: 'Events', icon: 'calendar', color: '#FF9800' },
      { id: 'users', label: 'Users', icon: 'people', color: '#4CAF50' },
      { id: 'donations', label: 'Donations', icon: 'card', color: '#E91E63' },
      { id: 'uploads', label: 'File Uploads', icon: 'cloud-upload', color: '#9C27B0' },
      { id: 'lessons', label: 'Lessons', icon: 'book', color: '#607D8B' },
      { id: 'scholars', label: 'Scholars', icon: 'school', color: '#795548' },
      { id: 'analytics', label: 'Analytics', icon: 'analytics', color: '#3F51B5' },
      { id: 'settings', label: 'Settings', icon: 'settings', color: '#9E9E9E' },
    ];

    return (
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <View style={styles.adminInfo}>
            <View style={styles.adminAvatar}>
              <Text style={styles.adminAvatarText}>
                {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
              </Text>
            </View>
            <View style={styles.adminDetails}>
              <Text style={styles.adminName}>{adminUser?.name}</Text>
              <Text style={styles.adminRole}>{adminUser?.role}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={confirmLogout}
          >
            <Ionicons name="log-out" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                currentScreen === item.id && styles.menuItemActive
              ]}
              onPress={() => setCurrentScreen(item.id)}
            >
              <View style={[
                styles.menuIcon,
                { backgroundColor: currentScreen === item.id ? item.color : colors.divider }
              ]}>
                <Ionicons 
                  name={item.icon as any} 
                  size={20} 
                  color={currentScreen === item.id ? '#FFFFFF' : colors.textSecondary} 
                />
              </View>
              <Text style={[
                styles.menuLabel,
                currentScreen === item.id && styles.menuLabelActive
              ]}>
                {item.label}
              </Text>
              {currentScreen === item.id && (
                <View style={[styles.activeIndicator, { backgroundColor: item.color }]} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <View style={styles.footerInfo}>
            <Text style={styles.footerTitle}>Tijaniyah Muslim Pro</Text>
            <Text style={styles.footerSubtitle}>Admin Panel v1.0</Text>
          </View>
          <View style={styles.footerStatus}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentTeal} />
        <Text style={styles.loadingText}>Loading Admin Panel...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderSidebar()}
      
      <View style={styles.mainContent}>
        {renderCurrentScreen()}
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="log-out" size={24} color="#F44336" />
              <Text style={styles.modalTitle}>Confirm Logout</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              Are you sure you want to logout from the admin panel? You will need to login again to access the admin features.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalLogoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.modalLogoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.divider,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sidebarHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adminAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adminAvatarText: {
    fontSize: 18,
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
  adminRole: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  logoutButton: {
    padding: 8,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: colors.background,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  menuLabelActive: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerInfo: {
    marginBottom: 12,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  footerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  mainContent: {
    flex: 1,
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
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    marginRight: 12,
  },
  modalCancelText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  modalLogoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F44336',
  },
  modalLogoutText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AdminMainScreen;
