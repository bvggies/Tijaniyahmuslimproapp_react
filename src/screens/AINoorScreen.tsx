import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useLanguage } from '../contexts/LanguageContext';
import { useTimeFormat } from '../contexts/TimeFormatContext';
import { api, ensureAuthenticated } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

// Quick suggestion chips
const SUGGESTIONS = [
  { id: '1', text: 'Dua for morning', icon: 'sunny-outline' },
  { id: '2', text: 'Surah Al-Fatiha', icon: 'book-outline' },
  { id: '3', text: 'Tijaniyya Wird', icon: 'heart-outline' },
  { id: '4', text: 'Prayer times', icon: 'time-outline' },
];

// Typing indicator component
const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  const dotStyle = (dot: Animated.Value) => ({
    transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }],
  });

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <View style={styles.aiAvatarSmall}>
          <Text style={styles.aiAvatarEmoji}>✨</Text>
        </View>
        <View style={styles.typingDots}>
          <Animated.View style={[styles.typingDot, dotStyle(dot1)]} />
          <Animated.View style={[styles.typingDot, dotStyle(dot2)]} />
          <Animated.View style={[styles.typingDot, dotStyle(dot3)]} />
        </View>
      </View>
    </View>
  );
};

export default function AINoorScreen({ route }: any) {
  const { searchQuery } = route.params || {};
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { formatTime } = useTimeFormat();
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'm1', 
      role: 'assistant', 
      content: 'Assalamu alaikum! ☪️\n\nI am AI Noor, your Islamic companion. I\'m here to help you with:\n\n• Quran & Hadith guidance\n• Duas and supplications\n• Tijaniyya teachings\n• Prayer and spiritual advice\n\nHow may I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Auto-send search query if provided
  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      setInput(searchQuery);
      setTimeout(() => {
        onSend();
      }, 500);
    }
  }, [searchQuery]);

  const callGroqAI = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      console.log('🤖 Calling AI Noor backend API...');
      
      // Ensure user is authenticated
      await ensureAuthenticated();
      
      // Convert conversation history to the format expected by the backend
      const history = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Call the backend API endpoint
      const response = await api.aiChat(userMessage, history);
      
      if (response.success && response.message) {
        console.log('✅ AI Noor response received');
        return response.message;
      } else {
        console.error('AI Noor API Error:', response.error || 'Unknown error');
        return response.message || 'I apologize, but I could not generate a response. Please try again.';
      }
    } catch (error: any) {
      console.error('AI Noor API Error:', error);
      return 'I apologize, but I am experiencing technical difficulties. Please check your internet connection and try again. May Allah bless you!';
    }
  };

  const onSend = async () => {
    const content = input.trim();
    if (!content || isLoading) return;

    setShowSuggestions(false);
    
    const userMsg: Message = { 
      id: String(Date.now()), 
      role: 'user', 
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await callGroqAI(content, messages);
      const assistantMsg: Message = { 
        id: String(Date.now() + 1), 
        role: 'assistant', 
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: Message = { 
        id: String(Date.now() + 1), 
        role: 'assistant', 
        content: 'I apologize for the error. Please try again. May Allah bless you!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isAI = item.role === 'assistant';
    
    return (
      <Animated.View 
        style={[
          styles.messageRow,
          isAI ? styles.messageRowAI : styles.messageRowUser,
          { opacity: fadeAnim }
        ]}
      >
        {isAI && (
          <View style={styles.aiAvatar}>
            <LinearGradient
              colors={['#00BFA5', '#00897B']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarEmoji}>✨</Text>
            </LinearGradient>
          </View>
        )}
        
        <View style={[styles.messageBubble, isAI ? styles.aiBubble : styles.userBubble]}>
          {isAI && (
            <View style={styles.aiLabel}>
              <Ionicons name="sparkles" size={10} color={colors.accentTeal} />
              <Text style={styles.aiLabelText}>AI Noor</Text>
            </View>
          )}
          <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
            {item.content}
          </Text>
          <Text style={[styles.timestamp, isAI ? styles.aiTimestamp : styles.userTimestamp]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
        
        {!isAI && (
          <View style={styles.userAvatar}>
            <LinearGradient
              colors={['#FFB74D', '#FF9800']}
              style={styles.avatarGradient}
            >
              <Ionicons name="person" size={16} color="#FFFFFF" />
            </LinearGradient>
          </View>
        )}
      </Animated.View>
    );
  };

  // Calculate bottom padding for Android to avoid bottom nav bar
  const bottomPadding = Platform.OS === 'android' ? 100 : Math.max(insets.bottom, 20) + 80;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient 
        colors={[colors.accentTeal, '#00897B', colors.primary]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconEmoji}>✨</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Noor</Text>
              <Text style={styles.headerSubtitle}>Your Islamic Companion</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <View style={styles.statusBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
            <View style={styles.poweredBy}>
              <Ionicons name="flash" size={10} color="#FFD700" />
              <Text style={styles.poweredByText}>Groq AI</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[
            styles.messagesList,
            { paddingBottom: bottomPadding + 80 }
          ]}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
        />

        {/* Suggestions */}
        {showSuggestions && messages.length === 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Quick Questions</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsList}
            >
              {SUGGESTIONS.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.id}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestion(suggestion.text)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={suggestion.icon as any} size={16} color={colors.accentTeal} />
                  <Text style={styles.suggestionText}>{suggestion.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: bottomPadding }]}>
          <BlurView intensity={80} tint="dark" style={styles.inputBlur}>
            <View style={styles.inputWrapper}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask anything about Islam..."
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                returnKeyType="send"
                onSubmitEditing={onSend}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton, 
                  (!input.trim() || isLoading) && styles.sendButtonDisabled
                ]} 
                onPress={onSend}
                disabled={!input.trim() || isLoading}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <LinearGradient
                    colors={input.trim() ? ['#00BFA5', '#00897B'] : [colors.divider, colors.divider]}
                    style={styles.sendButtonGradient}
                  >
                    <Ionicons 
                      name="send" 
                      size={18} 
                      color={input.trim() ? '#FFFFFF' : colors.textSecondary} 
                    />
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  
  // Header
  header: { 
    paddingBottom: 16, 
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerIconEmoji: {
    fontSize: 24,
  },
  headerTitle: { 
    color: '#FFFFFF', 
    fontSize: 24, 
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 13,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  poweredBy: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  poweredByText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '500',
  },

  // Chat
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingTop: 20,
  },
  
  // Message Rows
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageRowAI: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  
  // Avatars
  aiAvatar: {
    marginRight: 8,
  },
  userAvatar: {
    marginLeft: 8,
  },
  avatarGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  
  // Message Bubbles
  messageBubble: {
    maxWidth: SCREEN_WIDTH * 0.72,
    borderRadius: 20,
    padding: 14,
    paddingBottom: 24,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  userBubble: {
    backgroundColor: colors.accentTeal,
    borderBottomRightRadius: 6,
  },
  aiLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiLabelText: {
    fontSize: 11,
    color: colors.accentTeal,
    fontWeight: '600',
    marginLeft: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: colors.textPrimary,
  },
  userText: {
    color: '#FFFFFF',
  },
  timestamp: {
    position: 'absolute',
    bottom: 6,
    right: 12,
    fontSize: 10,
  },
  aiTimestamp: {
    color: colors.textSecondary,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  
  // Typing Indicator
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  aiAvatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  aiAvatarEmoji: {
    fontSize: 12,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentTeal,
    marginHorizontal: 2,
  },
  
  // Suggestions
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  suggestionsTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 10,
    fontWeight: '600',
  },
  suggestionsList: {
    paddingRight: 16,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.accentTeal + '40',
  },
  suggestionText: {
    color: colors.textPrimary,
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
  },
  
  // Input
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  inputBlur: {
    paddingHorizontal: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  input: { 
    flex: 1, 
    color: colors.textPrimary, 
    fontSize: 15,
    paddingVertical: 10,
    maxHeight: 100,
    lineHeight: 20,
  },
  sendButton: {
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
