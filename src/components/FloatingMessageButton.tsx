import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  AppState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from '../utils/theme';
import { api, isAuthenticated } from '../services/api';
import { useNotifications } from '../contexts/NotificationContext';

interface FloatingMessageButtonProps {
  bottomOffset?: number;
}

const FloatingMessageButton: React.FC<FloatingMessageButtonProps> = ({
  bottomOffset = 110, // Above the bottom nav bar with extra spacing
}) => {
  const navigation = useNavigation<any>();
  const { lastNotificationType, clearLastNotificationType } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Fetch unread message count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated()) {
      setUnreadCount(0);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.getUnreadMessageCount();
      if (response && typeof response.count === 'number') {
        const newCount = response.count;
        
        // Animate bounce if count increased
        if (newCount > unreadCount && unreadCount > 0) {
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -10,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.spring(bounceAnim, {
              toValue: 0,
              friction: 3,
              tension: 100,
              useNativeDriver: true,
            }),
          ]).start();
        }
        
        setUnreadCount(newCount);
      }
    } catch (error) {
      console.error('❌ Failed to fetch unread message count:', error);
    } finally {
      setIsLoading(false);
    }
  }, [unreadCount]);

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchUnreadCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [fetchUnreadCount])
  );

  // Refresh when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        fetchUnreadCount();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [fetchUnreadCount]);

  // Refresh when a new message notification is received
  useEffect(() => {
    if (lastNotificationType === 'MESSAGE') {
      console.log('📬 New message notification, refreshing unread count...');
      fetchUnreadCount();
    }
  }, [lastNotificationType, fetchUnreadCount]);

  // Pulse animation for unread messages
  useEffect(() => {
    if (unreadCount > 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [unreadCount]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    // Navigate to Chat screen
    navigation.navigate('More', { screen: 'Chat' });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: bottomOffset,
          transform: [
            { scale: scaleAnim },
            { translateY: bounceAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
      >
        {/* Glow effect for unread messages */}
        {unreadCount > 0 && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        )}
        
        {/* Button background */}
        <LinearGradient
          colors={[colors.accentTeal, '#00A896']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons 
            name="chatbubbles" 
            size={26} 
            color="#FFFFFF" 
          />
        </LinearGradient>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <Animated.View 
            style={[
              styles.badge,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 1000,
    elevation: 10,
  },
  touchable: {
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 40,
    backgroundColor: colors.accentTeal,
    opacity: 0.3,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.accentTeal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4757',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FloatingMessageButton;

