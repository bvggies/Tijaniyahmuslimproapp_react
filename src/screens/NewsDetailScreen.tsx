import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { api } from '../services/api';
import { useSlideUpFadeIn } from '../hooks/useAnimations';

interface NewsDetail {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  source?: string;
  sourceUrl?: string;
}

export default function NewsDetailScreen({ route, navigation }: any) {
  const { articleId } = route.params;
  const [article, setArticle] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { opacity, translateY } = useSlideUpFadeIn({ delay: 80, duration: 400, distance: 20 });

  const loadArticle = async () => {
    try {
      const data = await api.getNewsItem(articleId);
      setArticle({
        id: data.id,
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content || '',
        imageUrl: data.imageUrl,
        category: data.category || 'GENERAL',
        isPublished: data.isPublished,
        createdAt: data.createdAt,
        source: data.source,
        sourceUrl: data.sourceUrl,
      });
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadArticle();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading && !article) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentTeal} />
        <Text style={styles.loadingText}>Loading article...</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="newspaper-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.errorText}>Article not found</Text>
        <TouchableOpacity style={styles.errorBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedWrap, { opacity, transform: [{ translateY }] }]}>
      <LinearGradient
        colors={[colors.background, colors.surface, colors.background]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accentTeal} />
          }
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <BlurView intensity={80} tint="dark" style={styles.backButtonBlur}>
                <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
              </BlurView>
            </TouchableOpacity>
          </View>

          {article.imageUrl ? (
            <Image source={{ uri: article.imageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={[`${colors.accentTeal}40`, `${colors.accentGreen}20`]}
              style={styles.heroPlaceholder}
            >
              <Ionicons name="newspaper" size={64} color={colors.accentTeal} />
            </LinearGradient>
          )}

          <View style={styles.content}>
            <View style={styles.metaRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{article.category}</Text>
              </View>
              <Text style={styles.dateText}>{formatDate(article.createdAt)}</Text>
            </View>

            <Text style={styles.title}>{article.title}</Text>
            {article.excerpt ? <Text style={styles.excerpt}>{article.excerpt}</Text> : null}

            <Text style={styles.sectionTitle}>Full article</Text>
            <Text style={styles.body}>{article.content}</Text>

            {article.source ? (
              <Text style={styles.source}>
                Source: {article.source}
                {article.sourceUrl ? ` (${article.sourceUrl})` : ''}
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  animatedWrap: { flex: 1 },
  gradient: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { fontSize: 16, color: colors.textSecondary, marginTop: 12 },
  errorText: { fontSize: 18, color: colors.textSecondary, marginTop: 12, textAlign: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  backButton: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  errorBackButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: colors.accentTeal, borderRadius: 12 },
  backButtonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  backButtonBlur: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  heroImage: { width: '100%', height: 220 },
  heroPlaceholder: { width: '100%', height: 220, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  categoryBadge: { backgroundColor: `${colors.accentTeal}25`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  categoryText: { fontSize: 12, fontWeight: '700', color: colors.accentTeal, textTransform: 'uppercase' },
  dateText: { fontSize: 13, color: colors.textSecondary },
  title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, lineHeight: 32 },
  excerpt: { fontSize: 16, color: colors.textSecondary, lineHeight: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
  body: { fontSize: 16, color: colors.textSecondary, lineHeight: 26 },
  source: { fontSize: 13, color: colors.textSecondary, marginTop: 24, fontStyle: 'italic' },
});
