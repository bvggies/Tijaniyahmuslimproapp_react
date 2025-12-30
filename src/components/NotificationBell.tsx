import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from '../contexts/NotificationContext';
import { colors } from '../utils/theme';

interface NotificationBellProps {
  color?: string;
  size?: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  color = colors.textDark,
  size = 26,
}) => {
  const navigation = useNavigation<any>();
  const { unreadCount, refreshUnreadCount } = useNotifications();

  useEffect(() => {
    // Refresh unread count when component mounts
    refreshUnreadCount();
  }, []);

  const handlePress = () => {
    // Navigate to Notifications screen which is nested inside the More tab
    navigation.navigate('More', { screen: 'Notifications' });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
    >
      <Ionicons name="notifications-outline" size={size} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#e91e63',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.mintSurface,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NotificationBell;

