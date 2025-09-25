import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';

interface UpgradePromptProps {
  visible: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onSignIn: () => void;
  feature: string;
}

export default function UpgradePrompt({ visible, onClose, onSignUp, onSignIn, feature }: UpgradePromptProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Image source={require('../../assets/appicon.png')} style={styles.logo} />
              <View style={styles.lockOverlay}>
                <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.title}>Upgrade Required</Text>
            <Text style={styles.subtitle}>
              {feature} requires a free account to access
            </Text>
          </View>

          <View style={styles.benefits}>
            <Text style={styles.benefitsTitle}>Unlock with a free account:</Text>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
              <Text style={styles.benefitText}>Personal Islamic Journal</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
              <Text style={styles.benefitText}>Community Features</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
              <Text style={styles.benefitText}>AI Noor Assistant</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
              <Text style={styles.benefitText}>Makkah Live Streams</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
              <Text style={styles.benefitText}>Progress Tracking</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.signUpButton} onPress={onSignUp}>
              <LinearGradient colors={[colors.accentTeal, colors.accentGreen]} style={styles.signUpButtonGradient}>
                <Ionicons name="person-add" size={20} color="#FFFFFF" />
                <Text style={styles.signUpButtonText}>Create Free Account</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signInButton} onPress={onSignIn}>
              <Text style={styles.signInButtonText}>
                Already have an account? <Text style={styles.signInButtonTextBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.mintSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accentTeal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  benefits: {
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  actions: {
    gap: 12,
  },
  signUpButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  signUpButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  signInButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  signInButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  signInButtonTextBold: {
    color: colors.accentTeal,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
