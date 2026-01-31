import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function TasbihScreen() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [rotationAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));
  const [selectedDhikr, setSelectedDhikr] = useState(0);

  const dhikrOptions = [
    { arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah', meaning: 'Glory be to Allah', color: '#4CAF50' },
    { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', meaning: 'Praise be to Allah', color: '#2196F3' },
    { arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest', color: '#FF9800' },
    { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illa Allah', meaning: 'There is no god but Allah', color: '#9C27B0' },
  ];

  const incrementCount = () => {
    setCount(prev => {
      const newCount = prev + 1;
      
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Enhanced animations
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Glow animation
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.timing(rotationAnim, {
        toValue: (rotationAnim as unknown as { _value: number })._value + 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Vibration when target reached
      if (newCount % target === 0) {
        Vibration.vibrate(500);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      return newCount;
    });
  };

  const resetCount = () => {
    setCount(0);
    Animated.timing(rotationAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const changeTarget = (newTarget: number) => {
    setTarget(newTarget);
    setCount(0);
  };

  const completedRounds = Math.floor(count / target);
  const currentRound = (count % target) + 1;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Dhikr Selection */}
        <View style={styles.dhikrContainer}>
          <Text style={styles.dhikrTitle}>Select Dhikr</Text>
          <FlatList
            data={dhikrOptions}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dhikrScroll}
            renderItem={({ item: dhikr, index }) => (
              <TouchableOpacity
                style={[
                  styles.dhikrCard,
                  { backgroundColor: dhikr.color },
                  selectedDhikr === index && styles.selectedDhikrCard
                ]}
                onPress={() => setSelectedDhikr(index)}
              >
                <Text style={styles.dhikrArabic}>{dhikr.arabic}</Text>
                <Text style={styles.dhikrTransliteration}>{dhikr.transliteration}</Text>
                <Text style={styles.dhikrMeaning}>{dhikr.meaning}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        {/* Main Counter */}
        <View style={styles.counterContainer}>
          <Animated.View
            style={[
              styles.counterCircle,
              {
                transform: [
                  { scale: scaleAnim },
                  { scale: pulseAnim },
                  {
                    rotate: rotationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
                shadowOpacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={[dhikrOptions[selectedDhikr].color, colors.accentTeal]}
              style={styles.counterGradient}
            >
              <Text style={styles.counterText}>{count}</Text>
              <Text style={styles.counterSubtext}>Count</Text>
            </LinearGradient>
          </Animated.View>

          {/* Progress Ring */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRing}>
              <LinearGradient
                colors={[dhikrOptions[selectedDhikr].color, colors.accentTeal]}
                style={[
                  styles.progressFill,
                  {
                    width: `${(currentRound / target) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentRound} / {target}
            </Text>
          </View>
        </View>

        {/* Action Buttons - Moved Up */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.countButton}
            onPress={incrementCount}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[dhikrOptions[selectedDhikr].color, colors.accentTeal]}
              style={styles.countButtonGradient}
            >
              <Ionicons name="add" size={36} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetCount}
          >
            <LinearGradient
              colors={[colors.surface, colors.background]}
              style={styles.resetButtonGradient}
            >
              <Ionicons name="refresh" size={24} color={colors.textSecondary} />
              <Text style={styles.resetButtonText}>Reset</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={[colors.surface, colors.background]}
            style={styles.statCard}
          >
            <Ionicons name="checkmark-circle" size={24} color={colors.accentGreen} />
            <Text style={styles.statNumber}>{completedRounds}</Text>
            <Text style={styles.statLabel}>Rounds</Text>
          </LinearGradient>
          <LinearGradient
            colors={[colors.surface, colors.background]}
            style={styles.statCard}
          >
            <Ionicons name="flag" size={24} color={colors.accentTeal} />
            <Text style={styles.statNumber}>{target}</Text>
            <Text style={styles.statLabel}>Target</Text>
          </LinearGradient>
          <LinearGradient
            colors={[colors.surface, colors.background]}
            style={styles.statCard}
          >
            <Ionicons name="calculator" size={24} color={colors.accentYellow} />
            <Text style={styles.statNumber}>{count}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </LinearGradient>
        </View>

        {/* Target Selection */}
        <View style={styles.targetContainer}>
          <Text style={styles.targetTitle}>Select Target</Text>
          <View style={styles.targetButtons}>
            {[33, 99, 100, 1000].map((targetValue) => (
              <TouchableOpacity
                key={targetValue}
                style={[
                  styles.targetButton,
                  target === targetValue && styles.selectedTargetButton,
                ]}
                onPress={() => changeTarget(targetValue)}
              >
                <LinearGradient
                  colors={target === targetValue ? [colors.accentTeal, colors.accentGreen] : [colors.surface, colors.background]}
                  style={styles.targetButtonGradient}
                >
                  <Text
                    style={[
                      styles.targetButtonText,
                      target === targetValue && styles.selectedTargetButtonText,
                    ]}
                  >
                    {targetValue}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>


        {/* Dhikr Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Dhikr Guide</Text>
          <View style={styles.suggestionCard}>
            <LinearGradient
              colors={[colors.surface, colors.background]}
              style={styles.suggestionGradient}
            >
              <Ionicons name="book" size={20} color={colors.accentTeal} />
              <Text style={styles.suggestionText}>
                Recite each dhikr with intention and focus
              </Text>
            </LinearGradient>
          </View>
          <View style={styles.suggestionCard}>
            <LinearGradient
              colors={[colors.surface, colors.background]}
              style={styles.suggestionGradient}
            >
              <Ionicons name="heart" size={20} color={colors.accentGreen} />
              <Text style={styles.suggestionText}>
                Feel the spiritual connection with each count
              </Text>
            </LinearGradient>
          </View>
          <View style={styles.suggestionCard}>
            <LinearGradient
              colors={[colors.surface, colors.background]}
              style={styles.suggestionGradient}
            >
              <Ionicons name="time" size={20} color={colors.accentYellow} />
              <Text style={styles.suggestionText}>
                Take your time and don't rush the dhikr
              </Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  dhikrContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  dhikrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  dhikrScroll: {
    paddingHorizontal: 10,
  },
  dhikrCard: {
    width: 140,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  selectedDhikrCard: {
    transform: [{ scale: 1.05 }],
    elevation: 8,
    shadowOpacity: 0.5,
  },
  dhikrArabic: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  dhikrTransliteration: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  dhikrMeaning: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  counterContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  counterCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    marginBottom: 16,
  },
  counterGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  counterSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressRing: {
    width: 140,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 8,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minWidth: 80,
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  targetContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  targetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  targetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  targetButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedTargetButton: {
    borderWidth: 2,
    borderColor: colors.accentTeal,
  },
  targetButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  selectedTargetButtonText: {
    color: '#FFFFFF',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  countButton: {
    marginRight: 30,
  },
  countButtonGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  resetButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  resetButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  resetButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '600',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  suggestionCard: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  suggestionGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
});
