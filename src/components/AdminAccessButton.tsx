import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';

interface AdminAccessButtonProps {
  navigation: any;
}

const AdminAccessButton: React.FC<AdminAccessButtonProps> = ({ navigation }) => {
  const { authState, isAdmin, isModerator } = useAuth();

  const handleAdminAccess = () => {
    if (!authState.isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login first to access the admin panel.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    if (isAdmin() || isModerator()) {
      // User is admin/moderator, redirect to admin dashboard
      navigation.navigate('AdminPanel');
    } else {
      Alert.alert(
        'Access Denied',
        'You do not have admin privileges. Only administrators and moderators can access the admin panel.',
        [{ text: 'OK' }]
      );
    }
  };

  // Don't show the button if user is not authenticated or not admin
  if (!authState.isAuthenticated || (!isAdmin() && !isModerator())) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.adminButton}
      onPress={handleAdminAccess}
    >
      <View style={styles.adminButtonContent}>
        <Ionicons name="shield-checkmark" size={24} color={colors.accentTeal} />
        <View style={styles.adminButtonText}>
          <Text style={styles.adminButtonTitle}>Admin Panel</Text>
          <Text style={styles.adminButtonSubtitle}>
            {isAdmin() ? 'Administrator Access' : 'Moderator Access'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  adminButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  adminButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  adminButtonText: {
    flex: 1,
    marginLeft: 12,
  },
  adminButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  adminButtonSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default AdminAccessButton;
