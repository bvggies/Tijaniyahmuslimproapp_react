import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../utils/designTokens';
import { NewsArticleData } from '../../services/mockData';
import { SectionHeader, GlassPill, EmptyState, ErrorState, SkeletonCard } from '../ui';

interface NewsFeedSectionProps {
  articles: NewsArticleData[];
  onArticlePress?: (article: NewsArticleData) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

export default function NewsFeedSection({
  articles,
  onArticlePress,
  onRefresh,
  isLoading = false,
  hasError = false,
  onRetry,
}: NewsFeedSectionProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[tokens.colors.accentTeal, tokens.colors.primary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Ionicons name="newspaper" size={22} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Tijaniya News & Updates</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Stay updated with the latest Islamic news
          </Text>
        </LinearGradient>
        <View style={styles.articlesContainer}>
          <SkeletonCard style={{ marginBottom: tokens.spacing.md }} />
          <SkeletonCard />
        </View>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[tokens.colors.accentTeal, tokens.colors.primary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Ionicons name="newspaper" size={22} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Tijaniya News & Updates</Text>
          </View>
        </LinearGradient>
        <View style={styles.articlesContainer}>
          <ErrorState
            title="Unable to load news"
            message="Please check your connection and try again."
            onRetry={onRetry}
          />
        </View>
      </View>
    );
  }

  if (articles.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[tokens.colors.accentTeal, tokens.colors.primary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Ionicons name="newspaper" size={22} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Tijaniya News & Updates</Text>
          </View>
        </LinearGradient>
        <View style={styles.articlesContainer}>
          <EmptyState
            icon="newspaper-outline"
            title="No news yet"
            message="Check back later for the latest updates."
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[tokens.colors.accentTeal, tokens.colors.primary]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerContent}>
            <Ionicons name="newspaper" size={22} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Tijaniya News & Updates</Text>
          </View>
          {onRefresh && (
            <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
              <Ionicons name="refresh" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.headerSubtitle}>
          Stay updated with the latest Islamic news and community updates
        </Text>
      </LinearGradient>

      {/* Articles */}
      <View style={styles.articlesContainer}>
        {articles.map((article, index) => (
          <NewsCard
            key={article.id}
            article={article}
            index={index}
            onPress={() => onArticlePress?.(article)}
          />
        ))}
      </View>
    </View>
  );
}

interface NewsCardProps {
  article: NewsArticleData;
  index: number;
  onPress?: () => void;
}

function NewsCard({ article, index, onPress }: NewsCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
          <View style={styles.card}>
            {/* Image Header with Gradient Overlay */}
            <View style={styles.imageContainer}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={32} color={tokens.colors.textTertiary} />
              </View>
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                style={styles.imageOverlay}
              />
              
              {/* Category Chip */}
              <View style={styles.categoryChip}>
                <BlurView intensity={25} tint="dark" style={styles.categoryBlur}>
                  <Text style={styles.categoryText}>{article.category}</Text>
                </BlurView>
              </View>
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
              {/* Title */}
              <Text style={styles.articleTitle} numberOfLines={2}>
                {article.title}
              </Text>

              {/* Excerpt */}
              <Text style={styles.articleExcerpt} numberOfLines={2}>
                {article.excerpt}
              </Text>

              {/* Footer */}
              <View style={styles.cardFooter}>
                <Text style={styles.timestamp}>{article.timestamp}</Text>
                <Text style={styles.source}>{article.source}</Text>
              </View>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: tokens.spacing.xl,
  },
  
  // Header
  header: {
    padding: tokens.spacing.lg,
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    marginHorizontal: tokens.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: tokens.typography.size.xl,
    fontWeight: tokens.typography.weight.bold,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: tokens.typography.size.md,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  refreshButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: tokens.radius.sm,
  },
  
  // Articles Container
  articlesContainer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    minHeight: 300,
  },
  
  // Card
  cardContainer: {
    marginBottom: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    ...tokens.shadows.md,
  },
  cardBlur: {
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: tokens.colors.glassBackground,
    borderWidth: 1,
    borderColor: tokens.colors.glassBorder,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
  },
  
  // Image
  imageContainer: {
    height: 140,
    backgroundColor: tokens.colors.surface,
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surfaceElevated,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  
  // Category Chip
  categoryChip: {
    position: 'absolute',
    top: tokens.spacing.sm,
    left: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
    overflow: 'hidden',
  },
  categoryBlur: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  categoryText: {
    fontSize: tokens.typography.size.xs,
    fontWeight: tokens.typography.weight.semibold,
    color: '#FFFFFF',
  },
  
  // Content
  cardContent: {
    padding: tokens.spacing.md,
  },
  articleTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.bold,
    color: tokens.colors.textPrimary,
    marginBottom: 6,
    lineHeight: 22,
  },
  articleExcerpt: {
    fontSize: tokens.typography.size.md,
    color: tokens.colors.textSecondary,
    lineHeight: 20,
    marginBottom: tokens.spacing.sm,
  },
  
  // Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: tokens.typography.size.xs,
    color: tokens.colors.textTertiary,
  },
  source: {
    fontSize: tokens.typography.size.xs,
    color: tokens.colors.textTertiary,
    fontWeight: tokens.typography.weight.medium,
  },
});

