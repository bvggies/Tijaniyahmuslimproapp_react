import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  AppState,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';
import { api, ensureAuthenticated } from '../services/api';

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }>;
  lastMessage?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
    };
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const { authState } = useAuth();
  const { t } = useLanguage();
  const { lastNotificationType, clearLastNotificationType, unreadCount } = useNotifications();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadConversations = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }
      console.log('🔄 Loading conversations...');
      
      // Ensure user is authenticated before loading
      await ensureAuthenticated();
      
      const data = await api.getConversations();
      setConversations(data || []);
      console.log('✅ Loaded', data?.length || 0, 'conversations');
    } catch (error: any) {
      console.error('❌ Failed to load conversations:', error);
      
      // Don't show error alert for auth issues - just show empty state
      if (error.message?.includes('Not authenticated') || error.message?.includes('401')) {
        console.log('⚠️ User not authenticated for chat');
        setConversations([]);
      } else if (!isRefresh) {
        Alert.alert('Error', 'Failed to load conversations. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [loadConversations])
  );

  // Refresh when a new message notification is received
  useEffect(() => {
    if (lastNotificationType === 'MESSAGE') {
      console.log('📬 New message notification detected, refreshing conversations...');
      loadConversations(true);
      clearLastNotificationType();
    }
  }, [lastNotificationType, loadConversations, clearLastNotificationType]);

  // Refresh when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadConversations(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loadConversations]);

  const onRefresh = useCallback(() => {
    loadConversations(true);
  }, [loadConversations]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const otherUser = item.participants.find(p => p.id !== authState.user?.id);
    
    const handlePress = () => {
      navigation.navigate('ConversationDetail', {
        conversationId: item.id,
        otherUserId: otherUser?.id,
        otherUserName: otherUser?.name,
      });
    };
    
    const avatarColors = [
      ['#00BFA5', '#00A896'],
      ['#9C27B0', '#7B1FA2'],
      ['#FF6B6B', '#FF5252'],
      ['#4ECDC4', '#26A69A'],
      ['#FFA726', '#FF9800'],
    ];
    const colorIndex = (otherUser?.name?.charCodeAt(0) || 0) % avatarColors.length;
    const [avatarColor1, avatarColor2] = avatarColors[colorIndex];
    
    return (
      <TouchableOpacity 
        style={styles.conversationItem}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <BlurView intensity={20} tint="light" style={styles.blurContainer}>
          <LinearGradient
            colors={[avatarColor1 + '15', avatarColor2 + '10']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientOverlay}
          >
            <LinearGradient
              colors={[avatarColor1, avatarColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {otherUser?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
              {item.unreadCount > 0 && (
                <View style={styles.avatarUnreadIndicator} />
              )}
            </LinearGradient>
            
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <View style={styles.nameContainer}>
                  <Text style={styles.conversationName}>
                    {otherUser?.name || 'Unknown User'}
                  </Text>
                  {item.unreadCount > 0 && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>
                <Text style={styles.conversationTime}>
                  {formatTime(item.updatedAt)}
                </Text>
              </View>
              
              <View style={styles.conversationFooter}>
                <Text 
                  style={[
                    styles.lastMessage,
                    item.unreadCount > 0 && styles.unreadMessage
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage 
                    ? `${item.lastMessage.sender.id === authState.user?.id ? 'You: ' : ''}${item.lastMessage.content}`
                    : t('chat.no_messages')
                  }
                </Text>
                
                {item.unreadCount > 0 && (
                  <LinearGradient
                    colors={[colors.accentTeal, '#00A896']}
                    style={styles.unreadBadge}
                  >
                    <Text style={styles.unreadCount}>
                      {item.unreadCount > 99 ? '99+' : item.unreadCount}
                    </Text>
                  </LinearGradient>
                )}
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="chatbubbles-outline" size={48} color={colors.accentTeal} />
        <Text style={styles.loadingText}>{t('chat.loading_conversations')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={[colors.accentTeal + '20', colors.background, colors.background]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="chatbubbles" size={28} color={colors.accentTeal} />
          </View>
          <Text style={styles.headerTitle}>{t('chat.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('chat.subtitle')}</Text>
        </View>
      </LinearGradient>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>{t('chat.no_conversations')}</Text>
          <Text style={styles.emptySubtitle}>
            {t('chat.start_chatting')}
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Ionicons name="refresh-outline" size={20} color={colors.accentTeal} />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.conversationsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accentTeal}
              colors={[colors.accentTeal]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accentTeal + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  conversationsList: {
    padding: 16,
    paddingTop: 20,
  },
  conversationItem: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatarUnreadIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF4757',
    borderWidth: 2,
    borderColor: colors.background,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversationName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentTeal,
    marginLeft: 6,
  },
  conversationTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  unreadMessage: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  unreadBadge: {
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: colors.accentTeal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    fontWeight: '600',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.accentTeal}25`,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: `${colors.accentTeal}40`,
  },
  refreshButtonText: {
    color: colors.accentTeal,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
