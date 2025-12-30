import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../utils/designTokens';

interface GlassPillProps {
  children?: React.ReactNode;
  text?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  iconColor?: string;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'accent' | 'success' | 'warning';
}

export default function GlassPill({
  children,
  text,
  icon,
  iconPosition = 'left',
  iconColor,
  iconSize,
  style,
  textStyle,
  size = 'md',
  variant = 'default',
}: GlassPillProps) {
  const sizeStyles = {
    sm: { paddingVertical: 4, paddingHorizontal: 10, fontSize: 10, iconSize: 12 },
    md: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12, iconSize: 14 },
    lg: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14, iconSize: 16 },
  };

  const variantStyles = {
    default: {
      bg: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      text: tokens.colors.textPrimary,
      icon: tokens.colors.textSecondary,
    },
    accent: {
      bg: 'rgba(0, 191, 165, 0.15)',
      border: 'rgba(0, 191, 165, 0.3)',
      text: tokens.colors.accentTeal,
      icon: tokens.colors.accentTeal,
    },
    success: {
      bg: 'rgba(76, 175, 80, 0.15)',
      border: 'rgba(76, 175, 80, 0.3)',
      text: tokens.colors.success,
      icon: tokens.colors.success,
    },
    warning: {
      bg: 'rgba(255, 152, 0, 0.15)',
      border: 'rgba(255, 152, 0, 0.3)',
      text: tokens.colors.warning,
      icon: tokens.colors.warning,
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];
  const finalIconSize = iconSize || currentSize.iconSize;
  const finalIconColor = iconColor || currentVariant.icon;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentVariant.bg,
          borderColor: currentVariant.border,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
        },
        style,
      ]}
    >
      {icon && iconPosition === 'left' && (
        <Ionicons
          name={icon}
          size={finalIconSize}
          color={finalIconColor}
          style={styles.iconLeft}
        />
      )}
      {text ? (
        <Text
          style={[
            styles.text,
            { fontSize: currentSize.fontSize, color: currentVariant.text },
            textStyle,
          ]}
        >
          {text}
        </Text>
      ) : (
        children
      )}
      {icon && iconPosition === 'right' && (
        <Ionicons
          name={icon}
          size={finalIconSize}
          color={finalIconColor}
          style={styles.iconRight}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
  },
  text: {
    fontWeight: tokens.typography.weight.semibold,
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
});

