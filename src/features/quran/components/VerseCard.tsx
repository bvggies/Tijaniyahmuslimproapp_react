/**
 * VerseCard Component
 * Displays a single Quran verse with Arabic text, translation, and actions
 */

import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../utils/theme';
import { useQuranStore } from '../store';
import type { VerseWithTranslation } from '../../../lib/quran/quranTypes';

// Bismillah that appears at the start of most surahs
const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

interface VerseCardProps {
  verse: VerseWithTranslation;
  isBookmarked?: boolean;
  isPlaying?: boolean;
  onBookmark?: () => void;
  onPlay?: () => void;
  onShare?: () => void;
  showBismillah?: boolean;
}

function VerseCardComponent({
  verse,
  isBookmarked = false,
  isPlaying = false,
  onBookmark,
  onPlay,
  onShare,
  showBismillah = false,
}: VerseCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { arabicFontSize, translationFontSize } = useQuranStore();
  
  // Get translation text
  const translationText = verse.translations?.[0]?.text || '';
  
  const handleCopy = async () => {
    const text = `${verse.text_uthmani}\n\n${translationText}\n\n— Quran ${verse.verse_key}`;
    await Clipboard.setStringAsync(text);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBookmark?.();
  };
  
  return (
    <View style={styles.container}>
      {/* Bismillah */}
      {showBismillah && (
        <View style={styles.bismillahContainer}>
          <Text style={styles.bismillahText}>{BISMILLAH}</Text>
          <View style={styles.bismillahDivider} />
        </View>
      )}
      
      {/* Verse Card */}
      <View style={[styles.card, isPlaying && styles.cardPlaying]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.verseNumber}>
            <Text style={styles.verseNumberText}>{verse.verse_number}</Text>
          </View>
          
          <View style={styles.actions}>
            {/* Play Button */}
            <TouchableOpacity
              style={[styles.actionBtn, isPlaying && styles.actionBtnActive]}
              onPress={onPlay}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={18}
                color={isPlaying ? '#FFFFFF' : colors.accentTeal}
              />
            </TouchableOpacity>
            
            {/* Bookmark Button */}
            <TouchableOpacity
              style={[styles.actionBtn, isBookmarked && styles.bookmarkActive]}
              onPress={handleBookmark}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? '#FFFFFF' : colors.accentOrange}
              />
            </TouchableOpacity>
            
            {/* Copy Button */}
            <TouchableOpacity
              style={[styles.actionBtn, isCopied && styles.copiedBtn]}
              onPress={handleCopy}
            >
              <Ionicons
                name={isCopied ? 'checkmark' : 'copy-outline'}
                size={18}
                color={isCopied ? colors.accentGreen : colors.textSecondary}
              />
            </TouchableOpacity>
            
            {/* Share Button */}
            <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
              <Ionicons
                name="share-outline"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Arabic Text */}
        <View style={styles.arabicContainer}>
          <Text
            style={[styles.arabicText, { fontSize: arabicFontSize }]}
            selectable
          >
            {verse.text_uthmani}
          </Text>
        </View>
        
        {/* English Translation */}
        {translationText && (
          <View style={styles.translationContainer}>
            <View style={styles.translationHeader}>
              <Ionicons name="language-outline" size={14} color={colors.accentTeal} />
              <Text style={styles.translationLabel}>English Translation</Text>
            </View>
            <Text
              style={[styles.translationText, { fontSize: translationFontSize }]}
              selectable
            >
              {translationText}
            </Text>
          </View>
        )}
        
        {/* Footer Metadata */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Juz {verse.juz_number} • Page {verse.page_number}
          </Text>
        </View>
      </View>
    </View>
  );
}

export const VerseCard = memo(VerseCardComponent);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  bismillahContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 8,
  },
  bismillahText: {
    fontSize: 28,
    color: colors.accentTeal,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
    textAlign: 'center',
  },
  bismillahDivider: {
    width: 100,
    height: 2,
    backgroundColor: colors.divider,
    marginTop: 16,
    borderRadius: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardPlaying: {
    borderColor: colors.accentTeal,
    backgroundColor: `${colors.accentTeal}10`,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtnActive: {
    backgroundColor: colors.accentTeal,
  },
  bookmarkActive: {
    backgroundColor: colors.accentOrange,
  },
  copiedBtn: {
    backgroundColor: `${colors.accentGreen}30`,
  },
  arabicContainer: {
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 28,
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: 52,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  translationContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: `${colors.accentTeal}08`,
    marginTop: 8,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  translationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  translationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentTeal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  translationText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 26,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
});

