import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import NewsCard from './NewsCard';
import { 
  getIslamicNews, 
  openNewsArticle, 
  refreshNews, 
  NewsArticle 
} from '../services/newsService';

interface NewsSectionProps {
  onRefresh?: () => void;
  userLocation?: {
    country?: string;
    city?: string;
    region?: string;
  };
}

export default function NewsSection({ onRefresh, userLocation }: NewsSectionProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNews();
    
    // Set up auto-refresh every hour
    const interval = setInterval(() => {
      loadNews(true);
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [userLocation]);

  const loadNews = async (silent = false) => {
    if (!silent) setLoading(true);
    
    try {
      const newsData = await getIslamicNews(userLocation);
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const newsData = await refreshNews(userLocation);
      setNews(newsData);
      onRefresh?.();
    } catch (error) {
      console.error('Error refreshing news:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNewsPress = async (url: string) => {
    await openNewsArticle(url);
  };

  const renderNewsItem = ({ item }: { item: NewsArticle }) => (
    <NewsCard article={item} onPress={handleNewsPress} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentTeal} />
        <Text style={styles.loadingText}>Loading Islamic News...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.accentTeal, colors.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Ionicons name="newspaper" size={24} color="#FFFFFF" />
            <Text style={styles.title}>Islamic News & Blogs</Text>
          </View>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          {userLocation?.city ? 
            `Stay updated with Islamic news from ${userLocation.city} and beyond` : 
            'Stay updated with the latest Islamic news and community updates'
          }
        </Text>
      </LinearGradient>

      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.accentTeal]}
            tintColor={colors.accentTeal}
          />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Loading Islamic News...</Text>
            <Text style={styles.emptySubtext}>Please wait while we fetch the latest updates</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  refreshButton: {
    padding: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
    minHeight: 400,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
