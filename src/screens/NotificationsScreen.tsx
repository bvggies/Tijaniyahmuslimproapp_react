import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from '../utils/theme';
import { useNotifications } from '../contexts/NotificationContext';
import { InAppNotification } from '../services/notificationService';
import { useFadeIn } from '../hooks/useAnimations';

const { width } = Dimensions.get('window');

const getNotificationIcon = (type: string): { name: any; color: string; bgColor: string } => {
  switch (type) {
    case 'LIKE':
      return { name: 'heart', color: '#FF4081', bgColor: 'rgba(255, 64, 129, 0.15)' };
    case 'COMMENT':
      return { name: 'chatbubble', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.15)' };
    case 'MESSAGE':
      return { name: 'mail', color: '#00BFA5', bgColor: 'rgba(0, 191, 165, 0.15)' };
    case 'REMINDER':
      return { name: 'alarm', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.15)' };
    case 'EVENT':
      return { name: 'calendar', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.15)' };
    case 'SYSTEM':
    case 'CAMPAIGN':
      return { name: 'megaphone', color: '#00897B', bgColor: 'rgba(0, 137, 123, 0.15)' };
    default:
      return { name: 'notifications', color: '#00897B', bgColor: 'rgba(0, 137, 123, 0.15)' };
  }
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

interface NotificationItemProps {
  item: InAppNotification;
  onPress: () => void;
  onArchive: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item, onPress, onArchive }) => {
  const icon = getNotificationIcon(item.notification.type);
  const isUnread = item.status === 'UNREAD';

  return (
    <TouchableOpacity
      style={[styles.notificationItem, isUnread && styles.unreadItem]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Unread indicator line */}
      {isUnread && <View style={[styles.unreadIndicator, { backgroundColor: icon.color }]} />}
      
      <View style={styles.notificationLeft}>
        {item.notification.actor?.avatarUrl ? (
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: item.notification.actor.avatarUrl }}
              style={styles.avatar}
            />
            <View style={[styles.typeIconSmall, { backgroundColor: icon.bgColor }]}>
              <Ionicons name={icon.name} size={12} color={icon.color} />
            </View>
          </View>
        ) : (
          <View style={[styles.iconContainer, { backgroundColor: icon.bgColor }]}>
            <Ionicons name={icon.name} size={24} color={icon.color} />
          </View>
        )}
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, isUnread && styles.unreadTitle]} numberOfLines={1}>
            {item.notification.title}
          </Text>
          {isUnread && <View style={[styles.unreadDot, { backgroundColor: icon.color }]} />}
        </View>
        <Text style={styles.notificationBody} numberOfLines={2}>
          {item.notification.body}
        </Text>
        <View style={styles.notificationFooter}>
          <Ionicons name="time-outline" size={12} color="#8E99A4" />
          <Text style={styles.notificationTime}>
            {formatTimeAgo(item.createdAt)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.archiveButton}
        onPress={(e) => {
          e.stopPropagation();
          onArchive();
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={18} color="#A0AEC0" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const {
    notifications,
    unreadCount,
    isLoadingNotifications,
    hasMoreNotifications,
    fetchNotifications,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    archiveNotification,
  } = useNotifications();

  const opacity = useFadeIn({ duration: 380 });

  useEffect(() => {
    fetchNotifications(true);
  }, []);

  // Reload notifications when screen comes into focus (so new notifications appear immediately)
  useFocusEffect(
    useCallback(() => {
      console.log('🎯 Notifications screen focused, reloading notifications...');
      fetchNotifications(true);
    }, [fetchNotifications])
  );

  const handleNotificationPress = useCallback(async (notification: InAppNotification) => {
    if (notification.status === 'UNREAD') {
      await markAsRead(notification.id);
    }

    const deepLink = notification.notification.deepLink;
    if (deepLink) {
      if (deepLink.includes('/posts/')) {
        const postId = deepLink.split('/posts/')[1];
        navigation.navigate('Community', { screen: 'PostDetail', params: { postId } });
      } else if (deepLink.includes('/chat/')) {
        const conversationId = deepLink.split('/chat/')[1];
        navigation.navigate('Chat', { conversationId });
      } else if (deepLink.includes('/events/')) {
        navigation.navigate('Events');
      }
    }
  }, [markAsRead, navigation]);

  const handleArchive = useCallback(async (id: string) => {
    await archiveNotification(id);
  }, [archiveNotification]);

  const renderItem = useCallback(({ item }: { item: InAppNotification }) => (
    <NotificationItem
      item={item}
      onPress={() => handleNotificationPress(item)}
      onArchive={() => handleArchive(item.id)}
    />
  ), [handleNotificationPress, handleArchive]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <LinearGradient
          colors={['rgba(0, 191, 165, 0.2)', 'rgba(0, 137, 123, 0.1)']}
          style={styles.emptyIconGradient}
        >
          <Ionicons name="notifications-off-outline" size={56} color="#00897B" />
        </LinearGradient>
      </View>
      <Text style={styles.emptyTitle}>All Caught Up!</Text>
      <Text style={styles.emptySubtitle}>
        You don't have any notifications right now.{'\n'}
        We'll let you know when something arrives.
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!hasMoreNotifications) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#00897B" />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {/* Modern Header */}
      <LinearGradient
        colors={['#052F2A', '#0B3F39']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BlurView intensity={20} tint="light" style={styles.backButtonBlur}>
              <Ionicons name="arrow-back" size={22} color="#FFF" />
            </BlurView>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
          
          {unreadCount > 0 ? (
            <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
              <BlurView intensity={20} tint="light" style={styles.markAllButtonBlur}>
                <Ionicons name="checkmark-done" size={20} color="#00BFA5" />
              </BlurView>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {/* Stats Row */}
        {notifications.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{notifications.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{unreadCount}</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{notifications.length - unreadCount}</Text>
              <Text style={styles.statLabel}>Read</Text>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Notifications List */}
      <View style={styles.listContainer}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            notifications.length === 0 && styles.emptyListContent,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingNotifications && notifications.length === 0}
              onRefresh={() => fetchNotifications(true)}
              colors={['#00897B']}
              tintColor="#00897B"
              progressBackgroundColor="#FFFFFF"
            />
          }
          onEndReached={loadMoreNotifications}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={!isLoadingNotifications ? renderEmpty : null}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonBlur: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerBadge: {
    backgroundColor: '#FF4081',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markAllButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  markAllButtonBlur: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  listContainer: {
    flex: 1,
    marginTop: -12,
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  separator: {
    height: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  unreadItem: {
    backgroundColor: '#FFFFFF',
  },
  unreadIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  notificationLeft: {
    marginRight: 14,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
  },
  typeIconSmall: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    letterSpacing: 0.1,
  },
  unreadTitle: {
    fontWeight: '700',
    color: '#1A202C',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationBody: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12,
    color: '#8E99A4',
    marginLeft: 4,
    fontWeight: '500',
  },
  archiveButton: {
    padding: 8,
    marginTop: -4,
    marginRight: -4,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyIconWrapper: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingFooter: {
    paddingVertical: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 10,
    fontWeight: '500',
  },
});
