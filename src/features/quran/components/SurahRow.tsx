/**
 * SurahRow Component
 * Displays a single surah in the list
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/theme';
import type { Chapter, CachedChapter } from '../../../lib/quran/quranTypes';

interface SurahRowProps {
  chapter: Chapter | CachedChapter;
  onPress: () => void;
  isDownloaded?: boolean;
  isLastRead?: boolean;
}

function SurahRowComponent({
  chapter,
  onPress,
  isDownloaded = false,
  isLastRead = false,
}: SurahRowProps) {
  // Handle both API response (Chapter) and cached format (CachedChapter)
  const ch = chapter as Chapter & CachedChapter;
  const nameArabic = ch.name_arabic;
  const nameSimple = ch.name_simple;
  const nameTranslated = 'translated_name' in chapter && chapter.translated_name
    ? (chapter as Chapter).translated_name?.name
    : 'name_translated' in chapter
      ? (chapter as CachedChapter).name_translated
      : nameSimple;
  const versesCount = ch.verses_count;
  const revelationPlace = ch.revelation_place;
  
  return (
    <TouchableOpacity
      style={[styles.container, isLastRead && styles.lastReadContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Surah Number Badge */}
      <View style={styles.numberContainer}>
        <LinearGradient
          colors={isLastRead ? ['#11C48D', '#00BFA5'] : [colors.accentTeal, colors.primary]}
          style={styles.numberBadge}
        >
          <Text style={styles.numberText}>{chapter.id}</Text>
        </LinearGradient>
      </View>
      
      {/* Surah Info */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.nameSimple}>{nameSimple}</Text>
          <Text style={styles.nameArabic}>{nameArabic}</Text>
        </View>
        
        <View style={styles.metaRow}>
          <View style={[
            styles.placeBadge,
String(revelationPlace).toLowerCase() === 'makkah' ? styles.makkahBadge : styles.madinahBadge
          ]}>
            <Text style={styles.placeText}>
              {String(revelationPlace).toLowerCase() === 'makkah' ? 'Makkah' : 'Madinah'}
            </Text>
          </View>
          <Text style={styles.verseCount}>{versesCount} verses</Text>
          
          {isDownloaded && (
            <View style={styles.downloadedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.accentGreen} />
            </View>
          )}
        </View>
        
        <Text style={styles.meaning} numberOfLines={1}>
          {nameTranslated}
        </Text>
      </View>
      
      {/* Arrow */}
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={colors.textSecondary} 
      />
      
      {/* Last Read Indicator */}
      {isLastRead && (
        <View style={styles.lastReadIndicator}>
          <Ionicons name="bookmark" size={16} color={colors.accentGreen} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export const SurahRow = memo(SurahRowComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  lastReadContainer: {
    borderWidth: 1,
    borderColor: colors.accentGreen,
    backgroundColor: `${colors.accentGreen}10`,
  },
  numberContainer: {
    marginRight: 14,
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  numberText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameSimple: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  nameArabic: {
    fontSize: 20,
    color: colors.accentTeal,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  placeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  makkahBadge: {
    backgroundColor: `${colors.accentYellow}30`,
  },
  madinahBadge: {
    backgroundColor: `${colors.accentGreen}30`,
  },
  placeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  verseCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  downloadedBadge: {
    marginLeft: 8,
  },
  meaning: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  lastReadIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

