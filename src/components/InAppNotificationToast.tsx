import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface InAppNotificationToastProps {
  visible: boolean;
  title: string;
  body: string;
  type?: 'MESSAGE' | 'LIKE' | 'COMMENT' | 'SYSTEM' | 'EVENT' | 'REMINDER' | 'CAMPAIGN';
  deepLink?: string | null;
  onPress?: () => void;
  onDismiss?: () => void;
  duration?: number;
  senderAvatar?: string | null;
  senderName?: string | null;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const InAppNotificationToast: React.FC<InAppNotificationToastProps> = ({
  visible,
  title,
  body,
  type = 'SYSTEM',
  deepLink,
  onPress,
  onDismiss,
  duration = 4000,
  senderName,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      const timer = setTimeout(() => {
        dismissToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -150,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  const getIcon = () => {
    switch (type) {
      case 'MESSAGE':
        return 'chatbubble';
      case 'LIKE':
        return 'heart';
      case 'COMMENT':
        return 'chatbubble-ellipses';
      case 'EVENT':
        return 'calendar';
      case 'REMINDER':
        return 'notifications';
      case 'CAMPAIGN':
        return 'megaphone';
      default:
        return 'notifications';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'MESSAGE':
        return colors.accentTeal;
      case 'LIKE':
        return '#FF4757';
      case 'COMMENT':
        return '#3498DB';
      case 'EVENT':
        return colors.accentYellow;
      case 'REMINDER':
        return colors.primary;
      case 'CAMPAIGN':
        return '#9B59B6';
      default:
        return colors.accentTeal;
    }
  };

  const getGradientBackground = () => {
    switch (type) {
      case 'MESSAGE':
        return `${colors.accentTeal}15`;
      case 'LIKE':
        return '#FF475715';
      case 'COMMENT':
        return '#3498DB15';
      default:
        return `${colors.primary}15`;
    }
  };

  if (!visible && opacity._value === 0) return null;

  const handlePress = () => {
    dismissToast();
    onPress?.();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + (Platform.OS === 'ios' ? 0 : 10),
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.toast, { backgroundColor: getGradientBackground() }]}
        activeOpacity={0.9}
        onPress={handlePress}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: `${getIconColor()}20` }]}>
          <Ionicons name={getIcon()} size={22} color={getIconColor()} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.now}>now</Text>
          </View>
          <Text style={styles.body} numberOfLines={2}>
            {body}
          </Text>
          {type === 'MESSAGE' && (
            <Text style={styles.tapToReply}>Tap to reply</Text>
          )}
        </View>

        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={dismissToast}>
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 9999,
    elevation: 10,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: `${colors.textSecondary}20`,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  now: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  tapToReply: {
    fontSize: 12,
    color: colors.accentTeal,
    marginTop: 4,
    fontWeight: '500',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${colors.textSecondary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default InAppNotificationToast;

