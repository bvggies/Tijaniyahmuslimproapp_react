/**
 * TranslationPicker Component
 * Modal for selecting Quran translations
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/theme';
import { useTranslations } from '../hooks';
import { useQuranStore } from '../store';
import type { Translation } from '../../../lib/quran/quranTypes';

interface TranslationPickerProps {
  visible: boolean;
  onClose: () => void;
}

export function TranslationPicker({ visible, onClose }: TranslationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error } = useTranslations();
  const { selectedTranslationId, setTranslation } = useQuranStore();
  
  // Filter translations by search query
  const filteredTranslations = useMemo(() => {
    if (!data?.translations) return [];
    
    const query = searchQuery.toLowerCase();
    if (!query) return data.translations;
    
    return data.translations.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.author_name.toLowerCase().includes(query) ||
        t.language_name.toLowerCase().includes(query)
    );
  }, [data?.translations, searchQuery]);
  
  // Group translations by language
  const groupedTranslations = useMemo(() => {
    const groups: Record<string, Translation[]> = {};
    
    filteredTranslations.forEach((t) => {
      const lang = t.language_name;
      if (!groups[lang]) {
        groups[lang] = [];
      }
      groups[lang].push(t);
    });
    
    return Object.entries(groups)
      .sort(([a], [b]) => {
        // Prioritize common languages
        const priority = ['English', 'Arabic', 'French', 'Turkish', 'Urdu', 'Indonesian'];
        const aIndex = priority.indexOf(a);
        const bIndex = priority.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
      })
      .map(([language, translations]) => ({
        language,
        translations,
      }));
  }, [filteredTranslations]);
  
  const handleSelect = (translation: Translation) => {
    setTranslation(translation.id, translation.name);
    onClose();
  };
  
  const renderTranslation = ({ item }: { item: Translation }) => (
    <TouchableOpacity
      style={[
        styles.translationItem,
        selectedTranslationId === item.id && styles.selectedItem,
      ]}
      onPress={() => handleSelect(item)}
    >
      <View style={styles.translationInfo}>
        <Text style={styles.translationName}>{item.name}</Text>
        <Text style={styles.translationAuthor}>{item.author_name}</Text>
      </View>
      {selectedTranslationId === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={colors.accentGreen} />
      )}
    </TouchableOpacity>
  );
  
  const renderLanguageSection = ({ item }: { item: { language: string; translations: Translation[] } }) => (
    <View style={styles.languageSection}>
      <Text style={styles.languageHeader}>{item.language}</Text>
      {item.translations.map((t) => (
        <View key={t.id}>{renderTranslation({ item: t })}</View>
      ))}
    </View>
  );
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Select Translation</Text>
          <View style={styles.placeholder} />
        </View>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search translations..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accentTeal} />
            <Text style={styles.loadingText}>Loading translations...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={colors.error} />
            <Text style={styles.errorText}>Failed to load translations</Text>
          </View>
        ) : (
          <FlatList
            data={groupedTranslations}
            renderItem={renderLanguageSection}
            keyExtractor={(item) => item.language}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: colors.textPrimary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  languageSection: {
    marginBottom: 20,
  },
  languageHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accentTeal,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  translationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  selectedItem: {
    borderWidth: 1,
    borderColor: colors.accentGreen,
    backgroundColor: `${colors.accentGreen}10`,
  },
  translationInfo: {
    flex: 1,
  },
  translationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  translationAuthor: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});

