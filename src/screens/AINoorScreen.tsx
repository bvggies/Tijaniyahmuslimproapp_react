import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const OPENAI_API_KEY = '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';

const SYSTEM_PROMPT = `You are AI Noor, a knowledgeable and compassionate Islamic assistant. You help Muslims with:

1. Islamic knowledge and guidance
2. Prayer times and Qibla direction
3. Duas and supplications
4. Quranic verses and their meanings
5. Hadith and Sunnah
6. Tijaniyya Tariqa teachings
7. Islamic history and scholars
8. Spiritual guidance and advice

Always respond with:
- Islamic greetings (Assalamu alaikum, Barakallahu feeki, etc.)
- Authentic Islamic knowledge from Quran and Sunnah
- Gentle, respectful, and helpful tone
- Encouragement for good deeds
- Reminders about Allah's mercy and guidance
- When unsure, recommend consulting local scholars

Keep responses concise but informative, and always end with Islamic phrases like "May Allah guide us all" or "Barakallahu feeki".`;

export default function AINoorScreen({ route }: any) {
  const { searchQuery } = route.params || {};
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'm1', 
      role: 'assistant', 
      content: 'Assalamu alaikum! I am AI Noor, your Islamic assistant. Ask me anything about Islam, prayer, Quran, Tijaniyya, or spiritual guidance. May Allah bless our conversation!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Auto-send search query if provided
  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      setInput(searchQuery);
      // Auto-send the search query after a short delay
      setTimeout(() => {
        onSend();
      }, 500);
    }
  }, [searchQuery]);

  const callOpenAI = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return 'I apologize, but I am experiencing technical difficulties. Please check your internet connection and try again. May Allah bless you!';
    }
  };

  const onSend = async () => {
    const content = input.trim();
    if (!content || isLoading) return;

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
      const aiResponse = await callOpenAI(content, messages);
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

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>AI Noor</Text>
        <Text style={styles.headerSubtitle}>Ask Islamic questions with a gentle, helpful guide</Text>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'assistant' ? styles.bubbleAssistant : styles.bubbleUser]}>
            {item.role === 'assistant' ? (
              <Ionicons name="sparkles" size={14} color={colors.accentTeal} style={{ marginRight: 6 }} />
            ) : (
              <Ionicons name="person" size={14} color={colors.accentYellow} style={{ marginRight: 6 }} />
            )}
            <Text style={item.role === 'assistant' ? styles.textAssistant : styles.textUser}>{item.content}</Text>
            <Text style={styles.timestamp}>
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.accentTeal} />
          <Text style={styles.loadingText}>AI Noor is thinking...</Text>
        </View>
      )}

      <View style={styles.composer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about Islam, prayer, Quran, Tijaniyya..."
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          returnKeyType="send"
          onSubmitEditing={onSend}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.send, (!input.trim() || isLoading) && styles.sendDisabled]} 
          onPress={onSend}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.textSecondary} />
          ) : (
            <Ionicons name="send" size={18} color={input.trim() ? colors.accentTeal : colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  header: { 
    paddingTop: 50, 
    paddingBottom: 12, 
    paddingHorizontal: 16 
  },
  headerTitle: { 
    color: colors.textPrimary, 
    fontSize: 22, 
    fontWeight: '800' 
  },
  headerSubtitle: { 
    color: colors.textSecondary, 
    marginTop: 4 
  },
  bubble: { 
    maxWidth: '86%', 
    borderRadius: 14, 
    padding: 12, 
    marginBottom: 10, 
    flexDirection: 'row', 
    alignItems: 'flex-start',
    position: 'relative'
  },
  bubbleAssistant: { 
    backgroundColor: colors.mintSurface, 
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4
  },
  bubbleUser: { 
    backgroundColor: colors.surface, 
    alignSelf: 'flex-end',
    borderTopRightRadius: 4
  },
  textAssistant: { 
    color: colors.textDark,
    flex: 1,
    lineHeight: 20
  },
  textUser: { 
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 20
  },
  timestamp: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    fontSize: 10,
    color: colors.textSecondary,
    opacity: 0.7
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center'
  },
  loadingText: {
    color: colors.textSecondary,
    marginLeft: 8,
    fontSize: 12
  },
  composer: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    padding: 10, 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider
  },
  input: { 
    flex: 1, 
    color: colors.textPrimary, 
    backgroundColor: colors.background, 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    marginRight: 8,
    maxHeight: 100,
    textAlignVertical: 'top'
  },
  send: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: colors.mintSurface, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  sendDisabled: {
    backgroundColor: colors.divider,
    opacity: 0.5
  }
});
