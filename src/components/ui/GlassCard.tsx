import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { tokens } from '../../utils/designTokens';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: 'light' | 'medium' | 'strong';
  blur?: number;
  borderRadius?: number;
  padding?: number;
}

export default function GlassCard({
  children,
  style,
  intensity = 'medium',
  blur = 20,
  borderRadius = tokens.radius.lg,
  padding = tokens.spacing.md,
}: GlassCardProps) {
  const intensityStyles = {
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    medium: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    strong: {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
  };

  return (
    <View style={[styles.container, { borderRadius }, tokens.shadows.md, style]}>
      <BlurView intensity={blur} tint="dark" style={[styles.blur, { borderRadius }]}>
        <View
          style={[
            styles.content,
            {
              borderRadius,
              padding,
              backgroundColor: intensityStyles[intensity].backgroundColor,
              borderColor: intensityStyles[intensity].borderColor,
            },
          ]}
        >
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  blur: {
    overflow: 'hidden',
  },
  content: {
    borderWidth: 1,
  },
});

