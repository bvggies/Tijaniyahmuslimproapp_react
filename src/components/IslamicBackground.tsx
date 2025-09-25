import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface IslamicBackgroundProps {
  children: React.ReactNode;
  opacity?: number;
}

export default function IslamicBackground({ children, opacity = 0.15 }: IslamicBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Central Islamic Mandala */}
      <View style={[styles.mandala, { opacity }]}>
        <View style={styles.mandalaOuter} />
        <View style={styles.mandalaMiddle} />
        <View style={styles.mandalaInner} />
        <View style={styles.mandalaCenter} />
      </View>

      {/* Corner Geometric Patterns */}
      <View style={[styles.cornerPattern1, { opacity }]}>
        <View style={styles.cornerShape1} />
        <View style={styles.cornerShape2} />
        <View style={styles.cornerShape3} />
      </View>

      <View style={[styles.cornerPattern2, { opacity }]}>
        <View style={styles.cornerShape4} />
        <View style={styles.cornerShape5} />
        <View style={styles.cornerShape6} />
      </View>

      <View style={[styles.cornerPattern3, { opacity }]}>
        <View style={styles.cornerShape7} />
        <View style={styles.cornerShape8} />
        <View style={styles.cornerShape9} />
      </View>

      <View style={[styles.cornerPattern4, { opacity }]}>
        <View style={styles.cornerShape10} />
        <View style={styles.cornerShape11} />
        <View style={styles.cornerShape12} />
      </View>

      {/* Islamic Calligraphy Flourishes */}
      <View style={[styles.flourish1, { opacity }]}>
        <View style={styles.flourishLine1} />
        <View style={styles.flourishLine2} />
        <View style={styles.flourishLine3} />
      </View>

      <View style={[styles.flourish2, { opacity }]}>
        <View style={styles.flourishLine4} />
        <View style={styles.flourishLine5} />
        <View style={styles.flourishLine6} />
      </View>

      {/* Crescent and Star Constellation */}
      <View style={[styles.constellation1, { opacity }]}>
        <Ionicons name="moon" size={50} color={colors.accentTeal} style={styles.crescentIcon} />
        <Ionicons name="star" size={18} color={colors.accentYellow} style={styles.starIcon1} />
        <Ionicons name="star" size={12} color={colors.accentYellow} style={styles.starIcon2} />
        <Ionicons name="star" size={14} color={colors.accentYellow} style={styles.starIcon3} />
      </View>

      <View style={[styles.constellation2, { opacity }]}>
        <Ionicons name="moon" size={45} color={colors.accentGreen} style={styles.crescentIcon} />
        <Ionicons name="star" size={16} color={colors.accentYellow} style={styles.starIcon4} />
        <Ionicons name="star" size={10} color={colors.accentYellow} style={styles.starIcon5} />
      </View>

      {/* Mosque Architecture */}
      <View style={[styles.mosqueArchitecture, { opacity }]}>
        <View style={styles.mosqueDome} />
        <View style={styles.mosqueMinaret1} />
        <View style={styles.mosqueMinaret2} />
        <View style={styles.mosqueBase} />
        <View style={styles.mosqueArch} />
      </View>

      {/* Floating Islamic Elements */}
      <View style={[styles.floatingElements, { opacity }]}>
        <View style={styles.floatingCircle1} />
        <View style={styles.floatingCircle2} />
        <View style={styles.floatingCircle3} />
        <View style={styles.floatingCircle4} />
        <View style={styles.floatingCircle5} />
        <View style={styles.floatingCircle6} />
      </View>

      {/* Decorative Borders */}
      <View style={[styles.decorativeBorder1, { opacity }]}>
        <View style={styles.borderPattern1} />
        <View style={styles.borderPattern2} />
        <View style={styles.borderPattern3} />
      </View>

      <View style={[styles.decorativeBorder2, { opacity }]}>
        <View style={styles.borderPattern4} />
        <View style={styles.borderPattern5} />
        <View style={styles.borderPattern6} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },

  // Central Islamic Mandala
  mandala: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.4,
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mandalaOuter: {
    width: 120,
    height: 120,
    borderWidth: 4,
    borderColor: colors.accentTeal,
    borderRadius: 60,
    position: 'absolute',
    transform: [{ rotate: '0deg' }],
  },
  mandalaMiddle: {
    width: 80,
    height: 80,
    borderWidth: 3,
    borderColor: colors.accentGreen,
    borderRadius: 40,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  mandalaInner: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: colors.accentTeal,
    borderRadius: 25,
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
  },
  mandalaCenter: {
    width: 20,
    height: 20,
    backgroundColor: colors.accentYellow,
    borderRadius: 10,
    position: 'absolute',
  },

  // Corner Patterns
  cornerPattern1: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 0,
  },
  cornerShape1: {
    width: 60,
    height: 60,
    borderWidth: 4,
    borderColor: colors.accentTeal,
    borderRadius: 30,
    transform: [{ rotate: '45deg' }],
    marginBottom: 10,
    backgroundColor: 'rgba(0, 191, 165, 0.15)',
  },
  cornerShape2: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: colors.accentGreen,
    borderRadius: 20,
    transform: [{ rotate: '45deg' }],
    marginBottom: 10,
    backgroundColor: 'rgba(17, 196, 141, 0.15)',
  },
  cornerShape3: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.accentTeal,
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(0, 191, 165, 0.15)',
  },

  cornerPattern2: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 0,
  },
  cornerShape4: {
    width: 50,
    height: 50,
    borderWidth: 4,
    borderColor: colors.accentGreen,
    borderRadius: 25,
    transform: [{ rotate: '45deg' }],
    marginBottom: 10,
    backgroundColor: 'rgba(17, 196, 141, 0.15)',
  },
  cornerShape5: {
    width: 35,
    height: 35,
    borderWidth: 3,
    borderColor: colors.accentTeal,
    borderRadius: 17.5,
    transform: [{ rotate: '45deg' }],
    marginBottom: 10,
    backgroundColor: 'rgba(0, 191, 165, 0.15)',
  },
  cornerShape6: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: colors.accentGreen,
    borderRadius: 9,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(17, 196, 141, 0.15)',
  },

  cornerPattern3: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    zIndex: 0,
  },
  cornerShape7: {
    width: 45,
    height: 45,
    borderWidth: 4,
    borderColor: colors.accentTeal,
    borderRadius: 22.5,
    transform: [{ rotate: '45deg' }],
    marginBottom: 10,
    backgroundColor: 'rgba(0, 191, 165, 0.15)',
  },
  cornerShape8: {
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: colors.accentGreen,
    borderRadius: 15,
    transform: [{ rotate: '45deg' }],
    marginBottom: 10,
    backgroundColor: 'rgba(17, 196, 141, 0.15)',
  },
  cornerShape9: {
    width: 15,
    height: 15,
    borderWidth: 2,
    borderColor: colors.accentTeal,
    borderRadius: 7.5,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(0, 191, 165, 0.15)',
  },

  cornerPattern4: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    zIndex: 0,
  },
  cornerShape10: {
    width: 55,
    height: 55,
    borderWidth: 4,
    borderColor: colors.accentGreen,
    borderRadius: 27.5,
    transform: [{ rotate: '45deg' }],
    marginBottom: 10,
    backgroundColor: 'rgba(17, 196, 141, 0.15)',
  },
  cornerShape11: {
    width: 38,
    height: 38,
    borderWidth: 3,
    borderColor: colors.accentTeal,
    borderRadius: 19,
    transform: [{ rotate: '45deg' }],
    marginBottom: 10,
    backgroundColor: 'rgba(0, 191, 165, 0.15)',
  },
  cornerShape12: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.accentGreen,
    borderRadius: 11,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(17, 196, 141, 0.15)',
  },

  // Islamic Calligraphy Flourishes
  flourish1: {
    position: 'absolute',
    top: height * 0.2,
    left: 10,
    zIndex: 0,
  },
  flourishLine1: {
    width: 120,
    height: 6,
    backgroundColor: colors.accentTeal,
    borderRadius: 3,
    transform: [{ rotate: '20deg' }],
    marginBottom: 8,
  },
  flourishLine2: {
    width: 90,
    height: 6,
    backgroundColor: colors.accentGreen,
    borderRadius: 3,
    transform: [{ rotate: '-15deg' }],
    marginBottom: 8,
  },
  flourishLine3: {
    width: 70,
    height: 6,
    backgroundColor: colors.accentTeal,
    borderRadius: 3,
    transform: [{ rotate: '10deg' }],
  },

  flourish2: {
    position: 'absolute',
    top: height * 0.6,
    right: 10,
    zIndex: 0,
  },
  flourishLine4: {
    width: 110,
    height: 6,
    backgroundColor: colors.accentGreen,
    borderRadius: 3,
    transform: [{ rotate: '-25deg' }],
    marginBottom: 8,
  },
  flourishLine5: {
    width: 85,
    height: 6,
    backgroundColor: colors.accentTeal,
    borderRadius: 3,
    transform: [{ rotate: '18deg' }],
    marginBottom: 8,
  },
  flourishLine6: {
    width: 65,
    height: 6,
    backgroundColor: colors.accentGreen,
    borderRadius: 3,
    transform: [{ rotate: '-8deg' }],
  },

  // Crescent and Star Constellation
  constellation1: {
    position: 'absolute',
    top: height * 0.1,
    left: width * 0.2,
    zIndex: 0,
    alignItems: 'center',
  },
  crescentIcon: {
    transform: [{ rotate: '-30deg' }],
  },
  starIcon1: {
    position: 'absolute',
    top: 8,
    left: 35,
  },
  starIcon2: {
    position: 'absolute',
    top: 25,
    left: 15,
  },
  starIcon3: {
    position: 'absolute',
    top: 40,
    left: 30,
  },

  constellation2: {
    position: 'absolute',
    bottom: height * 0.2,
    right: width * 0.15,
    zIndex: 0,
    alignItems: 'center',
  },
  starIcon4: {
    position: 'absolute',
    top: 5,
    left: 30,
  },
  starIcon5: {
    position: 'absolute',
    top: 20,
    left: 10,
  },

  // Mosque Architecture
  mosqueArchitecture: {
    position: 'absolute',
    bottom: height * 0.1,
    left: width * 0.3,
    zIndex: 0,
    alignItems: 'center',
  },
  mosqueDome: {
    width: 80,
    height: 40,
    borderWidth: 3,
    borderColor: colors.accentTeal,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomWidth: 0,
    marginBottom: 5,
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
  },
  mosqueMinaret1: {
    width: 10,
    height: 50,
    backgroundColor: colors.accentGreen,
    borderRadius: 5,
    position: 'absolute',
    top: -15,
    left: 20,
  },
  mosqueMinaret2: {
    width: 10,
    height: 50,
    backgroundColor: colors.accentTeal,
    borderRadius: 5,
    position: 'absolute',
    top: -15,
    right: 20,
  },
  mosqueBase: {
    width: 100,
    height: 25,
    borderWidth: 3,
    borderColor: colors.accentTeal,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
  },
  mosqueArch: {
    width: 60,
    height: 30,
    borderWidth: 2,
    borderColor: colors.accentGreen,
    borderTopWidth: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'absolute',
    top: 15,
    left: 10,
  },

  // Floating Islamic Elements
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingCircle1: {
    position: 'absolute',
    top: height * 0.15,
    left: width * 0.1,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.accentTeal,
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
  },
  floatingCircle2: {
    position: 'absolute',
    top: height * 0.25,
    right: width * 0.1,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: colors.accentGreen,
    backgroundColor: 'rgba(17, 196, 141, 0.1)',
  },
  floatingCircle3: {
    position: 'absolute',
    top: height * 0.45,
    left: width * 0.05,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.accentTeal,
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
  },
  floatingCircle4: {
    position: 'absolute',
    top: height * 0.55,
    right: width * 0.05,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: colors.accentGreen,
    backgroundColor: 'rgba(17, 196, 141, 0.1)',
  },
  floatingCircle5: {
    position: 'absolute',
    bottom: height * 0.3,
    left: width * 0.15,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.accentTeal,
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
  },
  floatingCircle6: {
    position: 'absolute',
    bottom: height * 0.4,
    right: width * 0.2,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.accentGreen,
    backgroundColor: 'rgba(17, 196, 141, 0.1)',
  },

  // Decorative Borders
  decorativeBorder1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  borderPattern1: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 60,
    height: 4,
    backgroundColor: colors.accentTeal,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  borderPattern2: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 60,
    height: 4,
    backgroundColor: colors.accentGreen,
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
  },
  borderPattern3: {
    position: 'absolute',
    top: 40,
    left: width * 0.5 - 30,
    width: 60,
    height: 4,
    backgroundColor: colors.accentTeal,
    borderRadius: 2,
    transform: [{ rotate: '0deg' }],
  },

  decorativeBorder2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  borderPattern4: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 60,
    height: 4,
    backgroundColor: colors.accentGreen,
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
  },
  borderPattern5: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 4,
    backgroundColor: colors.accentTeal,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  borderPattern6: {
    position: 'absolute',
    bottom: 40,
    left: width * 0.5 - 30,
    width: 60,
    height: 4,
    backgroundColor: colors.accentGreen,
    borderRadius: 2,
    transform: [{ rotate: '0deg' }],
  },
});

