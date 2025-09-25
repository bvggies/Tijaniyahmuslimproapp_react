import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { NewsArticle, formatTimeAgo, getCategoryColor, getCategoryIcon } from '../services/newsService';

interface NewsCardProps {
  article: NewsArticle;
  onPress: (url: string) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width - 40; // Account for padding

export default function NewsCard({ article, onPress }: NewsCardProps) {
  const categoryColor = getCategoryColor(article.category);
  const categoryIcon = getCategoryIcon(article.category);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(article.url)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: article.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageGradient}
        />
        <View style={styles.categoryBadge}>
          <Ionicons name={categoryIcon as any} size={12} color="#FFFFFF" />
          <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
        </View>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{formatTimeAgo(article.publishedAt)}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {article.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.sourceContainer}>
            <Ionicons name="newspaper-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.sourceText}>{article.source}</Text>
            {article.location && (
              <>
                <Ionicons name="location-outline" size={12} color={colors.textSecondary} style={styles.locationIcon} />
                <Text style={styles.locationText}>
                  {article.isLocal ? 'Local' : article.location.city || article.location.country}
                </Text>
              </>
            )}
          </View>
          <View style={[styles.readMoreContainer, { backgroundColor: categoryColor }]}>
            <Text style={styles.readMoreText}>Read More</Text>
            <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  timeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sourceText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  locationIcon: {
    marginLeft: 8,
  },
  locationText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 2,
    fontWeight: '400',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  readMoreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
});
