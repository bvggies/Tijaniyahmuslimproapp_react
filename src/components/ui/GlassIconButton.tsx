import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../utils/designTokens';

interface GlassIconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  showGlow?: boolean;
  glowColor?: string;
}

export default function GlassIconButton({
  icon,
  onPress,
  size = 'lg',
  iconColor = '#FFFFFF',
  style,
  disabled = false,
  showGlow = false,
  glowColor = tokens.colors.accentTeal,
}: GlassIconButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const sizeConfig = tokens.glassButton[size];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
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

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: sizeConfig.size,
          height: sizeConfig.size,
          borderRadius: sizeConfig.size / 2,
          transform: [{ scale: scaleAnim }],
        },
        showGlow && {
          ...tokens.shadows.glow(glowColor),
        },
        tokens.shadows.sm,
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        <BlurView intensity={25} tint="dark" style={styles.blur}>
          <View
            style={[
              styles.content,
              {
                width: sizeConfig.size,
                height: sizeConfig.size,
                borderRadius: sizeConfig.size / 2,
                opacity: disabled ? 0.5 : 1,
              },
            ]}
          >
            <Ionicons name={icon} size={sizeConfig.iconSize} color={iconColor} />
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
  },
  blur: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

