import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api, ensureAuthenticated } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFadeIn } from '../hooks/useAnimations';

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  messageType: string;
  createdAt: string;
  isRead: boolean;
}

interface ConversationDetailScreenParams {
  conversationId: string;
  otherUserId?: string;
  otherUserName?: string;
}

export default function ConversationDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { authState } = useAuth();
  const { t } = useLanguage();
  const { conversationId, otherUserId, otherUserName } = (route.params || {}) as ConversationDetailScreenParams;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const flatListRef = useRef<FlatList>(null);
  const opacity = useFadeIn({ duration: 350 });

  const loadMessages = useCallback(async (loadMore = false) => {
    try {
      if (!conversationId) {
        console.warn('⚠️ No conversationId provided');
        setLoading(false);
        return;
      }
      
      if (!loadMore) {
        setLoading(true);
      }
      
      await ensureAuthenticated();
      
      console.log('📥 Loading messages for conversation:', conversationId);
      const response = await api.getMessages(conversationId, 50, loadMore ? cursor : undefined);
      
      console.log('📥 API Response:', response);
      
      // Backend returns { data: Message[], nextCursor, hasNextPage }
      const messagesArray = response?.data || response?.messages || (Array.isArray(response) ? response : []);
      
      if (Array.isArray(messagesArray) && messagesArray.length > 0) {
        console.log('✅ Loaded', messagesArray.length, 'messages');
        if (loadMore) {
          // When loading more (older messages), prepend them
          setMessages(prev => [...messagesArray, ...prev]);
        } else {
          // New messages should be at the bottom
          setMessages(messagesArray);
        }
        setHasMore(response?.hasNextPage || false);
        setCursor(response?.nextCursor);
      } else {
        console.log('ℹ️ No messages found in response');
        setMessages([]);
        setHasMore(false);
      }
    } catch (error: any) {
      console.error('❌ Failed to load messages:', error);
      console.error('❌ Error details:', error.message, error.stack);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [conversationId, cursor]);

  // Debug: Log route params
  useEffect(() => {
    console.log('📱 ConversationDetailScreen mounted');
    console.log('📱 Route params:', route.params);
    console.log('📱 ConversationId:', conversationId);
    console.log('📱 Other user:', otherUserName);
  }, []);

  useEffect(() => {
    if (conversationId) {
      console.log('🔄 Loading messages for conversation:', conversationId);
      loadMessages();
    } else {
      console.warn('⚠️ No conversationId - cannot load messages');
    }
  }, [conversationId, loadMessages]);

  // Scroll to bottom when messages first load
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length, loading]);

  // Mark messages as read when screen is focused/opened
  useFocusEffect(
    useCallback(() => {
      if (conversationId) {
        console.log('👁️ Marking conversation as read:', conversationId);
        // Mark as read immediately when screen is focused
        api.markAsRead(conversationId)
          .then(() => {
            console.log('✅ Conversation marked as read');
            // Trigger refresh of unread count
            // This will be picked up by FloatingMessageButton on next focus
          })
          .catch(err => console.error('❌ Failed to mark as read:', err));
      }
    }, [conversationId])
  );

  // Mark as read periodically while viewing the conversation
  useEffect(() => {
    if (!conversationId) return;

    // Mark as read immediately when messages load
    if (messages.length > 0) {
      api.markAsRead(conversationId).catch(err => 
        console.error('Failed to mark as read:', err)
      );
    }

    // Also mark as read every 2 seconds while viewing (catches new incoming messages quickly)
    const interval = setInterval(() => {
      if (conversationId) {
        api.markAsRead(conversationId)
          .then(() => {
            // Silently mark as read - no need to log every time
          })
          .catch(err => 
            console.error('Failed to mark as read (interval):', err)
          );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [conversationId, messages.length]);

  // Listen for new message notifications and mark as read immediately
  useEffect(() => {
    if (!conversationId) return;

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data;
      
      // If this notification is for the current conversation, mark as read immediately
      if (data?.type === 'MESSAGE' && data?.conversationId === conversationId) {
        console.log('📬 New message notification for current conversation, marking as read...');
        api.markAsRead(conversationId)
          .then(() => {
            console.log('✅ Marked conversation as read (notification received)');
            // Reload messages to show the new one
            loadMessages();
          })
          .catch(err => console.error('Failed to mark as read:', err));
      }
    });

    return () => subscription.remove();
  }, [conversationId, loadMessages]);

  // Mark as read when leaving the screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (conversationId) {
        console.log('👋 Leaving conversation, marking as read:', conversationId);
        api.markAsRead(conversationId)
          .then(() => {
            console.log('✅ Conversation marked as read before leaving');
          })
          .catch(err => console.error('❌ Failed to mark as read:', err));
      }
    });

    return unsubscribe;
  }, [navigation, conversationId]);

  // Track previous message count to detect new messages
  const prevMessageCountRef = useRef(0);
  const lastMessageIdRef = useRef<string | null>(null);

  // Mark as read immediately when new messages arrive
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      const currentLastMessageId = messages[messages.length - 1]?.id;
      const hasNewMessages = 
        messages.length > prevMessageCountRef.current || 
        (currentLastMessageId && currentLastMessageId !== lastMessageIdRef.current);

      if (hasNewMessages) {
        // Mark as read immediately when new messages are detected
        console.log('🔄 New messages detected, marking as read...');
        api.markAsRead(conversationId)
          .then(() => {
            console.log('✅ Marked conversation as read (new messages detected)');
            prevMessageCountRef.current = messages.length;
            lastMessageIdRef.current = currentLastMessageId || null;
          })
          .catch(err => console.error('Failed to mark as read:', err));
      } else {
        prevMessageCountRef.current = messages.length;
        lastMessageIdRef.current = currentLastMessageId || null;
      }
    } else if (messages.length === 0) {
      prevMessageCountRef.current = 0;
      lastMessageIdRef.current = null;
    }
  }, [conversationId, messages]);

  const sendMessage = useCallback(async () => {
    if (!messageText.trim() || sending) return;

    try {
      setSending(true);
      await ensureAuthenticated();
      
      const newMessage = await api.sendMessage(conversationId, messageText.trim());
      
      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
        setMessageText('');
        
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error: any) {
      console.error('❌ Failed to send message:', error);
    } finally {
      setSending(false);
    }
  }, [conversationId, messageText, sending]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // Handle both senderId (from frontend) and sender.id (from backend)
    const senderId = item.senderId || item.sender?.id || '';
    const currentUserId = authState.user?.id || '';
    
    // More robust comparison - check both string and strict equality
    const isMyMessage = String(senderId) === String(currentUserId) && senderId !== '';
    const senderName = item.sender?.name || 'Unknown';
    
    return (
      <View style={[
        styles.messageWrapper,
        isMyMessage ? styles.myMessageWrapper : styles.otherMessageWrapper
      ]}>
        <View style={[
          styles.messageContainer, 
          isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
        ]}>
          {!isMyMessage && (
            <LinearGradient
              colors={['#9C27B0', '#7B1FA2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {senderName.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          )}
          
          <LinearGradient
            colors={isMyMessage ? ['#00BFA5', '#00A896'] : ['#9C27B0', '#7B1FA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.messageBubble, 
              isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
            ]}
          >
            {!isMyMessage && (
              <Text style={styles.senderName}>{senderName}</Text>
            )}
            <Text style={[
              styles.messageText, 
              isMyMessage ? styles.myMessageText : styles.otherMessageText
            ]}>
              {item.content}
            </Text>
            <Text style={[
              styles.messageTime, 
              isMyMessage ? styles.myMessageTime : styles.otherMessageTime
            ]}>
              {formatTime(item.createdAt)}
            </Text>
          </LinearGradient>
          
          {isMyMessage && (
            <LinearGradient
              colors={['#00BFA5', '#00A896']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.myAvatar}
            >
              <Text style={styles.myAvatarText}>
                {authState.user?.name?.charAt(0).toUpperCase() || 'Y'}
              </Text>
            </LinearGradient>
          )}
        </View>
      </View>
    );
  };

  // Show error if no conversationId
  if (!conversationId) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.loadingText}>No conversation selected</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: colors.accentTeal, marginTop: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && messages.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentTeal} />
        <Text style={styles.loadingText}>{t('chat.loading_messages')}</Text>
      </View>
    );
  }

  // Islamic decorative patterns component
  const IslamicBackground = () => (
    <View style={styles.islamicBackground} pointerEvents="none">
      {/* Arabic calligraphy patterns */}
      <Text style={styles.arabicPattern1}>﷽</Text>
      <Text style={styles.arabicPattern2}>الله</Text>
      <Text style={styles.arabicPattern3}>محمد</Text>
      <Text style={styles.arabicPattern4}>الرحمن</Text>
      
      {/* Geometric patterns */}
      <View style={styles.geometricPattern1}>
        <View style={styles.geometricShape1} />
        <View style={styles.geometricShape2} />
        <View style={styles.geometricShape3} />
      </View>
      <View style={styles.geometricPattern2}>
        <View style={styles.geometricShape4} />
        <View style={styles.geometricShape5} />
      </View>
      <View style={styles.geometricPattern3}>
        <View style={styles.geometricShape6} />
      </View>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity }]}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80} // Account for bottom nav bar
    >
      <IslamicBackground />
      <LinearGradient 
        colors={[colors.accentTeal + '25', colors.background, colors.background]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.headerInner}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[colors.accentTeal + '30', colors.accentTeal + '20']}
              style={styles.backButtonGradient}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {otherUserName || t('chat.messages')}
            </Text>
            <Text style={styles.headerSubtitle}>Active now</Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.messagesList,
          { paddingBottom: Math.max(insets.bottom, 10) + 130 } // Extra padding for input box - increased to match new input position
        ]}
        inverted={false}
        onEndReached={() => {
          if (hasMore && !loading) {
            loadMessages(true);
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>{t('chat.no_messages')}</Text>
          </View>
        }
      />

      <BlurView intensity={80} tint="light" style={styles.inputBlurContainer}>
        <LinearGradient
          colors={[colors.surface + 'F0', colors.surface + 'E0']}
          style={[styles.inputContainer, { 
            paddingBottom: Math.max(insets.bottom, 10) + 100, // 100px for bottom nav bar - more space above
          }]}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={t('chat.type_message')}
              placeholderTextColor={colors.textSecondary + '80'}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[styles.sendButton, sending && styles.sendButtonDisabled, !messageText.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={sending || !messageText.trim()}
              activeOpacity={0.8}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <LinearGradient
                  colors={messageText.trim() ? [colors.accentTeal, '#00A896'] : [colors.textSecondary + '40', colors.textSecondary + '30']}
                  style={styles.sendButtonGradient}
                >
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </BlurView>
    </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    position: 'relative',
    zIndex: 1,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  backButton: {
    marginRight: 12,
  },
  backButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  messagesList: {
    padding: 20,
    paddingBottom: 20,
    position: 'relative',
    zIndex: 1,
  },
  messageWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  myMessageWrapper: {
    alignItems: 'flex-end', // Align to the right
    paddingLeft: 50, // Leave space on left for other messages
  },
  otherMessageWrapper: {
    alignItems: 'flex-start', // Align to the left
    paddingRight: 50, // Leave space on right for my messages
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '75%',
    minWidth: 100,
  },
  myMessageContainer: {
    flexDirection: 'row-reverse', // Reverse order: avatar on right, message on left
    alignSelf: 'flex-end', // Ensure it aligns to the right
  },
  otherMessageContainer: {
    flexDirection: 'row', // Normal order: avatar on left, message on right
    alignSelf: 'flex-start', // Ensure it aligns to the left
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 3,
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  myAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 3,
    shadowColor: '#00BFA5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  myAvatarText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  messageBubble: {
    maxWidth: '100%',
    borderRadius: 20,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  otherMessageBubble: {
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  myMessageBubble: {
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF', // White text on purple background
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  otherMessageText: {
    color: '#FFFFFF', // White text on purple background
  },
  myMessageText: {
    color: '#FFFFFF', // White text on teal background
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  otherMessageTime: {
    color: '#FFFFFF', // White text on purple background
    opacity: 0.8,
  },
  myMessageTime: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  inputBlurContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 10,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    position: 'relative',
    zIndex: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background + 'F0',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.textSecondary + '20',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.accentTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginLeft: 10,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Islamic background patterns
  islamicBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  arabicPattern1: {
    position: 'absolute',
    top: '15%',
    right: '10%',
    fontSize: 120,
    color: colors.accentTeal + '08',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
    transform: [{ rotate: '-15deg' }],
  },
  arabicPattern2: {
    position: 'absolute',
    top: '35%',
    left: '5%',
    fontSize: 100,
    color: colors.accentPurple + '08',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
    transform: [{ rotate: '20deg' }],
  },
  arabicPattern3: {
    position: 'absolute',
    bottom: '25%',
    right: '15%',
    fontSize: 90,
    color: colors.accentTeal + '06',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
    transform: [{ rotate: '10deg' }],
  },
  arabicPattern4: {
    position: 'absolute',
    bottom: '40%',
    left: '10%',
    fontSize: 85,
    color: colors.accentPurple + '07',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
    transform: [{ rotate: '-25deg' }],
  },
  geometricPattern1: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: 150,
    height: 150,
  },
  geometricShape1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: colors.accentTeal + '10',
    borderRadius: 30,
    transform: [{ rotate: '45deg' }],
  },
  geometricShape2: {
    position: 'absolute',
    top: 45,
    left: 45,
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: colors.accentPurple + '10',
    borderRadius: 30,
    transform: [{ rotate: '-45deg' }],
  },
  geometricShape3: {
    position: 'absolute',
    top: 22,
    left: 22,
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderColor: colors.accentTeal + '08',
    borderRadius: 30,
  },
  geometricPattern2: {
    position: 'absolute',
    bottom: '30%',
    right: '25%',
    width: 120,
    height: 120,
  },
  geometricShape4: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: colors.accentPurple + '10',
    transform: [{ rotate: '45deg' }],
  },
  geometricShape5: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 80,
    height: 80,
    borderWidth: 1.5,
    borderColor: colors.accentTeal + '08',
    transform: [{ rotate: '-45deg' }],
  },
  geometricPattern3: {
    position: 'absolute',
    top: '50%',
    right: '5%',
    width: 100,
    height: 100,
  },
  geometricShape6: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: colors.accentTeal + '08',
    borderRadius: 50,
    borderStyle: 'dashed',
  },
});

