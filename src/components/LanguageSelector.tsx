import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  style?: any;
  compact?: boolean;
}

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
];

export default function LanguageSelector({ style, compact = false }: LanguageSelectorProps) {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = languageOptions.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setModalVisible(false);
  };

  const renderLanguageOption = ({ item }: { item: LanguageOption }) => (
    <TouchableOpacity
      style={[
        styles.languageOption,
        item.code === language && styles.selectedLanguageOption,
      ]}
      onPress={() => handleLanguageChange(item.code)}
    >
      <View style={styles.languageInfo}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.languageText}>
          <Text style={[
            styles.languageName,
            item.code === language && styles.selectedLanguageName,
          ]}>
            {item.nativeName}
          </Text>
          <Text style={[
            styles.languageCode,
            item.code === language && styles.selectedLanguageCode,
          ]}>
            {item.name}
          </Text>
        </View>
      </View>
      {item.code === language && (
        <Ionicons name="checkmark-circle" size={24} color={colors.accentTeal} />
      )}
    </TouchableOpacity>
  );

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <TouchableOpacity
          style={styles.compactButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.compactFlag}>{currentLanguage?.flag}</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={[styles.modalContainer, isRTL && styles.modalContainerRTL]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t('settings.language')}</Text>
              <View style={styles.placeholder} />
            </View>

            <FlatList
              data={languageOptions}
              renderItem={renderLanguageOption}
              keyExtractor={(item) => item.code}
              style={styles.languageList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          <Text style={styles.flag}>{currentLanguage?.flag}</Text>
          <View style={styles.selectorText}>
            <Text style={styles.selectorTitle}>{t('settings.language')}</Text>
            <Text style={styles.selectorSubtitle}>
              {currentLanguage?.nativeName}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, isRTL && styles.modalContainerRTL]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t('settings.language')}</Text>
            <View style={styles.placeholder} />
          </View>

          <FlatList
            data={languageOptions}
            renderItem={renderLanguageOption}
            keyExtractor={(item) => item.code}
            style={styles.languageList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  compactContainer: {
    marginVertical: 0,
  },
  compactButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  compactFlag: {
    fontSize: 20,
  },
  selectorButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  selectorText: {
    flex: 1,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  selectorSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  modalContainerRTL: {
    direction: 'rtl',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  languageList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedLanguageOption: {
    backgroundColor: colors.mintSurface,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageText: {
    marginLeft: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: colors.accentTeal,
  },
  languageCode: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedLanguageCode: {
    color: colors.accentTeal,
  },
});
