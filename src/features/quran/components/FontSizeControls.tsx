/**
 * FontSizeControls Component
 * Adjustable font size controls for Arabic and translation text
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/theme';
import { useQuranStore } from '../store';

interface FontSizeControlsProps {
  visible: boolean;
  onClose: () => void;
}

export function FontSizeControls({ visible, onClose }: FontSizeControlsProps) {
  const {
    arabicFontSize,
    translationFontSize,
    showTranslation,
    showTransliteration,
    setArabicFontSize,
    setTranslationFontSize,
    toggleTranslation,
    toggleTransliteration,
  } = useQuranStore();
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Handle bar */}
          <View style={styles.handleBar} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Reading Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Arabic Font Size */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Arabic Font Size</Text>
              <View style={styles.sizeControls}>
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() => setArabicFontSize(arabicFontSize - 2)}
                  disabled={arabicFontSize <= 20}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color={arabicFontSize <= 20 ? colors.textLight : colors.textPrimary}
                  />
                </TouchableOpacity>
                
                <View style={styles.sizeValue}>
                  <Text style={styles.sizeValueText}>{arabicFontSize}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() => setArabicFontSize(arabicFontSize + 2)}
                  disabled={arabicFontSize >= 48}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color={arabicFontSize >= 48 ? colors.textLight : colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>
              
              {/* Preview */}
              <View style={styles.preview}>
                <Text style={[styles.previewArabic, { fontSize: arabicFontSize }]}>
                  بِسْمِ اللَّهِ
                </Text>
              </View>
            </View>
            
            {/* Translation Font Size */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Translation Font Size</Text>
              <View style={styles.sizeControls}>
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() => setTranslationFontSize(translationFontSize - 1)}
                  disabled={translationFontSize <= 12}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color={translationFontSize <= 12 ? colors.textLight : colors.textPrimary}
                  />
                </TouchableOpacity>
                
                <View style={styles.sizeValue}>
                  <Text style={styles.sizeValueText}>{translationFontSize}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() => setTranslationFontSize(translationFontSize + 1)}
                  disabled={translationFontSize >= 24}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color={translationFontSize >= 24 ? colors.textLight : colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>
              
              {/* Preview */}
              <View style={styles.preview}>
                <Text style={[styles.previewTranslation, { fontSize: translationFontSize }]}>
                  In the name of Allah
                </Text>
              </View>
            </View>
            
            {/* Display Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Display Options</Text>
              
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Ionicons name="language" size={20} color={colors.accentTeal} />
                  <Text style={styles.toggleLabel}>Show Translation</Text>
                </View>
                <Switch
                  value={showTranslation}
                  onValueChange={toggleTranslation}
                  trackColor={{ false: colors.divider, true: colors.accentGreen }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Ionicons name="text" size={20} color={colors.accentTeal} />
                  <Text style={styles.toggleLabel}>Show Transliteration</Text>
                </View>
                <Switch
                  value={showTransliteration}
                  onValueChange={toggleTransliteration}
                  trackColor={{ false: colors.divider, true: colors.accentGreen }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
            
            {/* Quick Presets */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Presets</Text>
              <View style={styles.presetsRow}>
                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => {
                    setArabicFontSize(24);
                    setTranslationFontSize(14);
                  }}
                >
                  <Text style={styles.presetLabel}>Small</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => {
                    setArabicFontSize(28);
                    setTranslationFontSize(16);
                  }}
                >
                  <Text style={styles.presetLabel}>Medium</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => {
                    setArabicFontSize(34);
                    setTranslationFontSize(18);
                  }}
                >
                  <Text style={styles.presetLabel}>Large</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accentTeal,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  sizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 8,
  },
  sizeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeValue: {
    flex: 1,
    alignItems: 'center',
  },
  sizeValueText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  preview: {
    marginTop: 12,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
  },
  previewArabic: {
    color: colors.textPrimary,
    fontFamily: 'Geeza Pro',
  },
  previewTranslation: {
    color: colors.textSecondary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  presetButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  presetLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

