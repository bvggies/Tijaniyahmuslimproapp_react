import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../utils/theme';

interface AdminRedirectProps {
  navigation: any;
  children: React.ReactNode;
}

const AdminRedirect: React.FC<AdminRedirectProps> = ({ navigation, children }) => {
  const { authState, isAdmin, isModerator } = useAuth();

  useEffect(() => {
    // Check if user is admin and redirect to admin dashboard
    if (authState.isAuthenticated && authState.user && (isAdmin() || isModerator())) {
      // Small delay to ensure navigation is ready
      const timer = setTimeout(() => {
        navigation.navigate('AdminPanel');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [authState.isAuthenticated, authState.user, isAdmin, isModerator, navigation]);

  // Show loading while checking admin status
  if (authState.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentTeal} />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AdminRedirect;
