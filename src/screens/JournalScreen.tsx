import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, ensureDemoAuth } from '../services/api';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import UpgradePrompt from '../components/UpgradePrompt';
import { useFadeIn } from '../hooks/useAnimations';

interface Entry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: 'grateful' | 'reflective' | 'hopeful' | 'peaceful' | 'struggling' | 'inspired';
  tags: string[];
  wordCount: number;
  createdAt: number;
}

interface JournalStats {
  totalEntries: number;
  totalWords: number;
  averageWords: number;
  moodDistribution: { [key: string]: number };
  mostActiveMonth: string;
  longestStreak: number;
}

const STORAGE_KEY = 'journal_entries_v2';

const ISLAMIC_PROMPTS = [
  "What am I grateful to Allah for today?",
  "How did I grow closer to Allah today?",
  "What lesson did I learn from today's experiences?",
  "How can I be a better Muslim tomorrow?",
  "What dua did I make today and why?",
  "How did I show kindness to others today?",
  "What challenges did Allah help me overcome?",
  "How did I practice patience today?",
  "What Islamic knowledge did I gain today?",
  "How did I remember Allah throughout the day?"
];

const MOOD_EMOJIS = {
  grateful: '🙏',
  reflective: '🤔',
  hopeful: '🌟',
  peaceful: '☮️',
  struggling: '💪',
  inspired: '✨'
};

export default function JournalScreen() {
  const { authState } = useAuth();
  const opacity = useFadeIn({ duration: 380 });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Entry['mood']>('grateful');
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<Entry['mood'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mood'>('newest');

  useEffect(() => {
    (async () => {
      try {
        // Load from API first
        const list = await api.listJournal();
        const mapped: Entry[] = (Array.isArray(list) ? list : []).map((e: any) => ({
          id: e.id,
          title: e.title || 'Untitled',
          content: e.content || '',
          mood: 'grateful',
          tags: Array.isArray(e.tags) ? e.tags : [],
          wordCount: String(e.content || '').trim().split(/\s+/).filter((w: string) => w.length > 0).length,
          createdAt: e.createdAt ? new Date(e.createdAt).getTime() : Date.now(),
          date: new Date(e.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        }));
        setEntries(mapped);
        // persist local cache
        try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mapped)); } catch {}
      } catch {
        // fallback to local cache
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          if (raw) setEntries(JSON.parse(raw));
        } catch {}
      }
    })();
  }, []);

  const saveEntries = async (list: Entry[]) => {
    setEntries(list);
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  };

  const addEntry = async () => {
    if (authState.isGuest) {
      setShowUpgradePrompt(true);
      return;
    }
    
    if (!title.trim() && !content.trim()) return;
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    await ensureDemoAuth();
    const optimistic: Entry = {
      id: `tmp-${Date.now()}`,
      title: title.trim() || 'Untitled',
      content: content.trim(),
      mood,
      tags,
      wordCount,
      createdAt: Date.now(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
    saveEntries([optimistic, ...entries]);
    try {
      const created = await api.createJournal(optimistic.title, optimistic.content, optimistic.tags);
      const mapped: Entry = {
        id: created.id,
        title: created.title || 'Untitled',
        content: created.content || '',
        mood: optimistic.mood,
        tags: Array.isArray(created.tags) ? created.tags : [],
        wordCount: String(created.content || '').trim().split(/\s+/).filter((w: string) => w.length > 0).length,
        createdAt: created.createdAt ? new Date(created.createdAt).getTime() : Date.now(),
        date: new Date(created.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      };
      saveEntries([mapped, ...entries]);
    } catch (e) {
      // rollback optimistic
      saveEntries(entries);
      Alert.alert('Error', 'Failed to save entry');
    }
    setTitle('');
    setContent('');
    setMood('grateful');
    setTags([]);
    setShowModal(false);
  };

  const getFilteredEntries = () => {
    let filtered = entries;
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Mood filter
    if (filterMood !== 'all') {
      filtered = filtered.filter(entry => entry.mood === filterMood);
    }
    
    // Sort
    switch (sortBy) {
      case 'oldest':
        return filtered.sort((a, b) => a.createdAt - b.createdAt);
      case 'mood':
        return filtered.sort((a, b) => a.mood.localeCompare(b.mood));
      default:
        return filtered.sort((a, b) => b.createdAt - a.createdAt);
    }
  };

  const getJournalStats = (): JournalStats => {
    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const averageWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
    
    const moodDistribution: { [key: string]: number } = {};
    entries.forEach(entry => {
      moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
    });
    
    // Find most active month
    const monthCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      const month = new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    const mostActiveMonth = Object.keys(monthCounts).reduce((a, b) => 
      monthCounts[a] > monthCounts[b] ? a : b, 'No entries'
    );
    
    // Calculate longest streak (simplified)
    const sortedEntries = entries.sort((a, b) => a.createdAt - b.createdAt);
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate = 0;
    
    sortedEntries.forEach(entry => {
      const entryDate = new Date(entry.createdAt).toDateString();
      if (entryDate !== new Date(lastDate).toDateString()) {
        const daysDiff = Math.floor((entry.createdAt - lastDate) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1 || lastDate === 0) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        longestStreak = Math.max(longestStreak, currentStreak);
        lastDate = entry.createdAt;
      }
    });
    
    return {
      totalEntries,
      totalWords,
      averageWords,
      moodDistribution,
      mostActiveMonth,
      longestStreak
    };
  };

  const usePrompt = (prompt: string) => {
    setTitle(prompt);
    setContent('');
    setShowPrompts(false);
    setShowModal(true);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const deleteEntry = async (id: string) => {
    const prev = entries;
    saveEntries(entries.filter(e => e.id !== id));
    try {
      if (!id.startsWith('tmp-')) await api.deleteJournal(id);
    } catch (e) {
      // rollback
      saveEntries(prev);
      Alert.alert('Error', 'Failed to delete entry');
    }
  };

  const renderItem = ({ item }: { item: Entry }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={[styles.moodBadge, moodColor(item.mood)]}>
          <Text style={styles.moodEmoji}>{MOOD_EMOJIS[item.mood]}</Text>
          <Text style={styles.moodText}>{item.mood}</Text>
        </View>
      </View>
      <Text style={styles.cardDate}>{item.date}</Text>
      <Text style={styles.cardContent} numberOfLines={3}>{item.content}</Text>
      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTags}>+{item.tags.length - 3} more</Text>
          )}
        </View>
      )}
      <View style={styles.cardFooter}>
        <View style={styles.wordCount}>
          <Ionicons name="document-text" size={14} color={colors.textSecondary} />
          <Text style={styles.wordCountText}>{item.wordCount} words</Text>
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteEntry(item.id)}>
          <Ionicons name="trash" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>Islamic Journal</Text>
        <Text style={styles.headerSubtitle}>Reflect on your spiritual journey</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowStats(true)}>
            <Ionicons name="stats-chart" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowPrompts(true)}>
            <Ionicons name="bulb" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addFab} onPress={() => setShowModal(true)}>
            <Ionicons name="add" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => {
          const moods: (Entry['mood'] | 'all')[] = ['all', 'grateful', 'reflective', 'hopeful', 'peaceful', 'struggling', 'inspired'];
          const currentIndex = moods.indexOf(filterMood);
          setFilterMood(moods[(currentIndex + 1) % moods.length]);
        }}>
          <Ionicons name="filter" size={20} color={colors.accentTeal} />
        </TouchableOpacity>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        {(['newest', 'oldest', 'mood'] as const).map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.sortBtn, sortBy === option && styles.sortBtnActive]}
            onPress={() => setSortBy(option)}
          >
            <Text style={[styles.sortBtnText, sortBy === option && styles.sortBtnTextActive]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getFilteredEntries()}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="journal" size={48} color={colors.textSecondary} />
            <Text style={styles.empty}>No entries found.</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || filterMood !== 'all' ? 'Try adjusting your search or filters.' : 'Add your first reflection to begin your spiritual journey.'}
            </Text>
          </View>
        }
      />

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={60} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Entry</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 16 }}>
              <TextInput
                placeholder="Title"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                placeholder="Write your reflection..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, styles.textArea]}
                value={content}
                onChangeText={setContent}
                multiline
              />
              <View style={styles.moodRow}>
                {(['grateful','reflective','hopeful','peaceful','struggling','inspired'] as Entry['mood'][]).map(m => (
                  <TouchableOpacity key={m} style={[styles.moodOption, mood === m && styles.moodSelected]} onPress={() => setMood(m)}>
                    <Text style={styles.moodEmoji}>{MOOD_EMOJIS[m]}</Text>
                    <Text style={[styles.moodOptionText, mood === m && styles.moodSelectedText]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tags Section */}
              <View style={styles.tagsSection}>
                <Text style={styles.sectionLabel}>Tags (optional)</Text>
                <View style={styles.tagsInputContainer}>
                  <TextInput
                    style={styles.tagInput}
                    placeholder="Add a tag..."
                    placeholderTextColor={colors.textSecondary}
                    onSubmitEditing={(e) => {
                      addTag(e.nativeEvent.text);
                      e.currentTarget.clear();
                    }}
                  />
                </View>
                {tags.length > 0 && (
                  <View style={styles.selectedTags}>
                    {tags.map((tag, index) => (
                      <View key={index} style={styles.selectedTag}>
                        <Text style={styles.selectedTagText}>{tag}</Text>
                        <TouchableOpacity onPress={() => removeTag(tag)}>
                          <Ionicons name="close" size={16} color={colors.textPrimary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={addEntry}>
                <LinearGradient colors={[colors.accentTeal, '#1BBFA7']} style={styles.saveBtnGrad}>
                  <Text style={styles.saveText}>Save Entry</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Stats Modal */}
      <Modal visible={showStats} transparent animationType="slide" onRequestClose={() => setShowStats(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Journal Statistics</Text>
              <TouchableOpacity onPress={() => setShowStats(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.statsContent}>
              {(() => {
                const stats = getJournalStats();
                return (
                  <>
                    <View style={styles.statCard}>
                      <Text style={styles.statNumber}>{stats.totalEntries}</Text>
                      <Text style={styles.statLabel}>Total Entries</Text>
                    </View>
                    <View style={styles.statCard}>
                      <Text style={styles.statNumber}>{stats.totalWords.toLocaleString()}</Text>
                      <Text style={styles.statLabel}>Total Words</Text>
                    </View>
                    <View style={styles.statCard}>
                      <Text style={styles.statNumber}>{stats.averageWords}</Text>
                      <Text style={styles.statLabel}>Average Words</Text>
                    </View>
                    <View style={styles.statCard}>
                      <Text style={styles.statNumber}>{stats.longestStreak}</Text>
                      <Text style={styles.statLabel}>Longest Streak (days)</Text>
                    </View>
                    <View style={styles.statCard}>
                      <Text style={styles.statLabel}>Most Active Month</Text>
                      <Text style={styles.statValue}>{stats.mostActiveMonth}</Text>
                    </View>
                    <View style={styles.moodStatsCard}>
                      <Text style={styles.sectionLabel}>Mood Distribution</Text>
                      {Object.entries(stats.moodDistribution).map(([mood, count]) => (
                        <View key={mood} style={styles.moodStatRow}>
                          <Text style={styles.moodStatEmoji}>{MOOD_EMOJIS[mood as Entry['mood']]}</Text>
                          <Text style={styles.moodStatText}>{mood}</Text>
                          <Text style={styles.moodStatCount}>{count}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                );
              })()}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Prompts Modal */}
      <Modal visible={showPrompts} transparent animationType="slide" onRequestClose={() => setShowPrompts(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Islamic Writing Prompts</Text>
              <TouchableOpacity onPress={() => setShowPrompts(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.promptsContent}>
              {ISLAMIC_PROMPTS.map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.promptCard}
                  onPress={() => usePrompt(prompt)}
                >
                  <Text style={styles.promptText}>{prompt}</Text>
                  <Ionicons name="arrow-forward" size={20} color={colors.accentTeal} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Upgrade Prompt */}
      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onSignUp={() => {
          setShowUpgradePrompt(false);
          // Navigation to sign up would be handled by the parent
        }}
        onSignIn={() => {
          setShowUpgradePrompt(false);
          // Navigation to sign in would be handled by the parent
        }}
        feature="Islamic Journal"
      />
    </Animated.View>
  );
}

const moodColor = (m: Entry['mood']) => {
  switch (m) {
    case 'grateful': return { backgroundColor: colors.mintSurface };
    case 'reflective': return { backgroundColor: '#DCE3F1' };
    case 'hopeful': return { backgroundColor: '#E7F5E1' };
    case 'peaceful': return { backgroundColor: '#E1F5F4' };
    case 'struggling': return { backgroundColor: '#FFE5E5' };
    case 'inspired': return { backgroundColor: '#FFF5E5' };
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.textPrimary },
  headerSubtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 4 },
  headerActions: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  headerBtn: { padding: 8, marginRight: 8 },
  addFab: { padding: 10, backgroundColor: colors.accentTeal, borderRadius: 25 },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 12, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, color: colors.textPrimary, fontSize: 16 },
  filterBtn: { padding: 12, backgroundColor: colors.surface, borderRadius: 12 },
  sortContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  sortBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface, marginRight: 8 },
  sortBtnActive: { backgroundColor: colors.accentTeal },
  sortBtnText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  sortBtnTextActive: { color: '#FFFFFF' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: 16, fontSize: 16, fontWeight: '600' },
  emptySubtext: { color: colors.textSecondary, textAlign: 'center', marginTop: 8, fontSize: 14, paddingHorizontal: 40 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', flex: 1 },
  moodBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  moodEmoji: { fontSize: 14, marginRight: 4 },
  moodText: { color: colors.textDark, fontSize: 12, fontWeight: '600' },
  cardDate: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  cardContent: { color: colors.textPrimary, fontSize: 14, marginTop: 8, lineHeight: 20 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  tag: { backgroundColor: colors.mintSurface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 6, marginBottom: 4 },
  tagText: { color: colors.textDark, fontSize: 12, fontWeight: '500' },
  moreTags: { color: colors.textSecondary, fontSize: 12, alignSelf: 'center' },
  cardFooter: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordCount: { flexDirection: 'row', alignItems: 'center' },
  wordCountText: { color: colors.textSecondary, fontSize: 12, marginLeft: 4 },
  deleteBtn: { padding: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '92%', maxHeight: '80%', backgroundColor: colors.surface, borderRadius: 16, padding: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: colors.divider, borderRadius: 10, padding: 12, color: colors.textPrimary, marginBottom: 10 },
  textArea: { height: 120, textAlignVertical: 'top' },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 },
  moodOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 14, backgroundColor: colors.mintSurface, marginRight: 8, marginBottom: 8 },
  moodSelected: { backgroundColor: colors.accentTeal },
  moodOptionText: { color: colors.textDark, fontSize: 12, fontWeight: '600', marginLeft: 4 },
  moodSelectedText: { color: '#FFFFFF' },
  tagsSection: { marginVertical: 8 },
  sectionLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  tagsInputContainer: { marginBottom: 8 },
  tagInput: { borderWidth: 1, borderColor: colors.divider, borderRadius: 8, padding: 8, color: colors.textPrimary, fontSize: 14 },
  selectedTags: { flexDirection: 'row', flexWrap: 'wrap' },
  selectedTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accentTeal, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 6, marginBottom: 4 },
  selectedTagText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500', marginRight: 4 },
  saveBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  saveBtnGrad: { paddingVertical: 12, alignItems: 'center' },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
  statsContent: { maxHeight: 400 },
  statCard: { backgroundColor: colors.background, borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center' },
  statNumber: { color: colors.accentTeal, fontSize: 32, fontWeight: '800' },
  statLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '600', marginTop: 4 },
  statValue: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', marginTop: 4 },
  moodStatsCard: { backgroundColor: colors.background, borderRadius: 12, padding: 16, marginBottom: 12 },
  moodStatRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  moodStatEmoji: { fontSize: 16, marginRight: 8 },
  moodStatText: { color: colors.textPrimary, fontSize: 14, flex: 1 },
  moodStatCount: { color: colors.accentTeal, fontSize: 14, fontWeight: '600' },
  promptsContent: { maxHeight: 400 },
  promptCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 12, padding: 16, marginBottom: 12 },
  promptText: { color: colors.textPrimary, fontSize: 14, flex: 1, lineHeight: 20 },
});
