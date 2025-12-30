import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../utils/designTokens';
import { SectionHeader, GlassPill } from '../ui';

interface HajjQuickAccessProps {
  onLivePress: () => void;
  onGuidePress: () => void;
  onJourneyPress: () => void;
}

type HajjSection = 'live' | 'guide' | 'journey' | null;

const hajjOptions = [
  {
    id: 'live' as const,
    icon: 'videocam',
    label: 'Watch Live',
    title: 'Makkah Live',
    description: '24/7 HD stream of the Kaaba with prayer times and special events. Virtually connect to Masjid al‑Haram.',
  },
  {
    id: 'guide' as const,
    icon: 'walk',
    label: 'Hajj Guide',
    title: 'Hajj & Umrah',
    description: 'Step‑by‑step rites, essential duas, packing list, visa info, health & safety tips, and FAQs.',
  },
  {
    id: 'journey' as const,
    icon: 'map',
    label: 'Journey',
    title: 'Hajj Journey',
    description: 'Day‑by‑day timeline with reminders, mark‑done checklist, and quick map links to key locations.',
  },
];

export default function HajjQuickAccess({
  onLivePress,
  onGuidePress,
  onJourneyPress,
}: HajjQuickAccessProps) {
  const [openSection, setOpenSection] = useState<HajjSection>(null);

  const getOnPress = (id: HajjSection) => {
    switch (id) {
      case 'live': return onLivePress;
      case 'guide': return onGuidePress;
      case 'journey': return onJourneyPress;
      default: return () => {};
    }
  };

  const toggleSection = (id: HajjSection) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Hajj" titleArabic="الحج" />

      {/* Action Pills */}
      <View style={styles.pillsRow}>
        {hajjOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => toggleSection(option.id)}
            style={[
              styles.pill,
              openSection === option.id && styles.pillActive,
            ]}
          >
            <Ionicons
              name={option.icon as any}
              size={18}
              color={openSection === option.id ? tokens.colors.accentTeal : tokens.colors.textSecondary}
            />
            <Text
              style={[
                styles.pillText,
                openSection === option.id && styles.pillTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Expandable Content */}
      {openSection && (
        <Animated.View style={styles.expandedContent}>
          <BlurView intensity={15} tint="dark" style={styles.blur}>
            <View style={styles.expandedCard}>
              <Text style={styles.expandedTitle}>
                {hajjOptions.find(o => o.id === openSection)?.title}
              </Text>
              <Text style={styles.expandedDescription}>
                {hajjOptions.find(o => o.id === openSection)?.description}
              </Text>
              <TouchableOpacity
                style={styles.openButton}
                onPress={getOnPress(openSection)}
              >
                <Ionicons name="open-outline" size={14} color={tokens.colors.accentTeal} />
                <Text style={styles.openButtonText}>Open</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: tokens.spacing.lg,
    marginTop: tokens.spacing.xl,
  },
  
  // Pills Row
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.glassBackground,
    borderWidth: 1,
    borderColor: tokens.colors.glassBorder,
    gap: 6,
  },
  pillActive: {
    borderColor: tokens.colors.accentTeal,
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
  },
  pillText: {
    fontSize: tokens.typography.size.sm,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.textSecondary,
  },
  pillTextActive: {
    color: tokens.colors.accentTeal,
  },
  
  // Expanded Content
  expandedContent: {
    marginTop: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
  },
  blur: {
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
  },
  expandedCard: {
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.glassBackground,
    borderWidth: 1,
    borderColor: tokens.colors.glassBorder,
    borderRadius: tokens.radius.lg,
  },
  expandedTitle: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.textPrimary,
    marginBottom: 4,
  },
  expandedDescription: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
    marginBottom: tokens.spacing.md,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 191, 165, 0.4)',
    gap: 4,
  },
  openButtonText: {
    fontSize: tokens.typography.size.sm,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.accentTeal,
  },
});

