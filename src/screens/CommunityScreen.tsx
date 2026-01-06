import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api, ensureDemoAuth, setToken, isAuthenticated, ensureAuthenticated } from '../services/api';
import CloudinaryService from '../services/cloudinaryService';

interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isVerified: boolean;
  followers: number;
  following: number;
}

interface Comment {
  id: string;
  author: User;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

interface Post {
  id: string;
  author: User;
  content: string;
  category: string;
  likes: number;
  comments: Comment[];
  shares: number;
  date: string;
  isLiked: boolean;
  isBookmarked: boolean;
  image?: string;
}

const categories = [
  { id: 'all', name: 'All', icon: 'grid-outline' },
  { id: 'prayer', name: 'Prayer', icon: 'time-outline' },
  { id: 'quran', name: 'Quran', icon: 'book-outline' },
  { id: 'dua', name: 'Dua', icon: 'heart-outline' },
  { id: 'ramadan', name: 'Ramadan', icon: 'moon-outline' },
  { id: 'hajj', name: 'Hajj', icon: 'location-outline' },
  { id: 'general', name: 'General', icon: 'chatbubbles-outline' },
];

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Ahmad Hassan',
    username: 'ahmad_hassan',
    isVerified: true,
    followers: 1250,
    following: 340,
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    username: 'fatima_zahra',
    isVerified: false,
    followers: 890,
    following: 156,
  },
  {
    id: '3',
    name: 'Omar Abdullah',
    username: 'omar_abdullah',
    isVerified: true,
    followers: 2100,
    following: 420,
  },
];

const samplePosts: Post[] = [
  {
    id: 'sample-1',
    author: {
      id: 'demo',
      name: 'Demo User',
      username: 'demo_user',
      isVerified: true,
      followers: 150,
      following: 89,
    },
    content: 'Welcome to the Tijaniyah Community! Share your thoughts, ask questions, and connect with fellow Muslims around the world. 🌍',
    category: 'general',
    likes: 12,
    comments: [],
    shares: 3,
    date: new Date().toLocaleString(),
    isLiked: false,
    isBookmarked: false,
  },
];

export default function CommunityScreen() {
  const { authState } = useAuth();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  
  const cloudinaryService = CloudinaryService.getInstance();
  const [refreshing, setRefreshing] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentUser] = useState<User>({
    id: 'current',
    name: authState.user?.email?.split('@')[0] || 'You',
    username: 'current_user',
    isVerified: false,
    followers: 0,
    following: 0,
  });

  const mapApiPost = (p: any): Post => {
    const authorName = p?.user?.name || p?.user?.email?.split('@')[0] || 'User';
    const authorUser: User = {
      id: p?.user?.id || 'user',
      name: authorName,
      username: authorName.replace(/\s+/g, '_').toLowerCase(),
      isVerified: false,
      followers: 0,
      following: 0,
    };
    const mappedComments: Comment[] = Array.isArray(p?.comments)
      ? p.comments.map((c: any) => ({
          id: c.id,
          author: {
            id: c.user?.id || 'user',
            name: c.user?.name || c.user?.email?.split('@')[0] || 'User',
            username: (c.user?.name || c.user?.email || 'user').split('@')[0].toLowerCase(),
            isVerified: false,
            followers: 0,
            following: 0,
          },
          content: c.content,
          date: new Date(c.createdAt || Date.now()).toLocaleString(),
          likes: 0,
        }))
      : [];
    return {
      id: p.id,
      author: authorUser,
      content: p.content,
      category: 'general',
      likes: (p._count?.likes as number) || 0,
      comments: mappedComments,
      shares: 0,
      date: new Date(p.createdAt || Date.now()).toLocaleString(),
      isLiked: false,
      isBookmarked: false,
    };
  };

  const loadPosts = async () => {
    try {
      console.log('🔄 Loading posts from API...');
      const data = await api.listPosts(20);
      console.log('📊 API Response:', data);
      
      // The API returns { data: [...], nextCursor: "...", hasNextPage: true }
      const items = Array.isArray(data?.data) ? data.data : [];
      
      if (items.length > 0) {
        const mappedPosts = items.map(mapApiPost);
        console.log('✅ Loaded', mappedPosts.length, 'posts from API');
        setPosts(mappedPosts);
      } else {
        console.log('📝 No posts from API, using sample posts');
        setPosts(samplePosts);
      }
    } catch (e) {
      console.log('⚠️ Failed to load posts from API:', e);
      console.log('📝 Using sample posts as fallback');
      setPosts(samplePosts);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  // Load posts when component mounts
  useEffect(() => {
    loadPosts();
    testApiConnection();
  }, []);

  // Reload posts when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('🎯 Community screen focused, reloading posts...');
      loadPosts();
    }, [])
  );

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pickPostImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Photo library permission is needed to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploadingImage(true);
        
        // Upload to Cloudinary
        const uploadResult = await cloudinaryService.uploadPostImage(result.assets[0].uri);
        
        if (uploadResult.success && uploadResult.url) {
          setNewPostImages([...newPostImages, uploadResult.url]);
          console.log('✅ Image uploaded:', uploadResult.url);
        } else {
          Alert.alert('Upload Failed', uploadResult.error || 'Failed to upload image');
        }
        
        setIsUploadingImage(false);
      }
    } catch (error) {
      setIsUploadingImage(false);
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePostPhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploadingImage(true);
        
        const uploadResult = await cloudinaryService.uploadPostImage(result.assets[0].uri);
        
        if (uploadResult.success && uploadResult.url) {
          setNewPostImages([...newPostImages, uploadResult.url]);
          console.log('✅ Photo uploaded:', uploadResult.url);
        } else {
          Alert.alert('Upload Failed', uploadResult.error || 'Failed to upload photo');
        }
        
        setIsUploadingImage(false);
      }
    } catch (error) {
      setIsUploadingImage(false);
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const removePostImage = (index: number) => {
    setNewPostImages(newPostImages.filter((_, i) => i !== index));
  };

  const createPost = async () => {
    if (!newPostContent.trim() && newPostImages.length === 0) {
      Alert.alert('Empty Post', 'Please add some content or an image to your post.');
      return;
    }
    
    // Check if user is authenticated
    if (!authState.user) {
      Alert.alert('Authentication Required', 'Please sign in to create posts');
      return;
    }
    
    // Check if we have a valid API token
    if (!isAuthenticated()) {
      Alert.alert('Authentication Error', 'Please sign out and sign back in to refresh your session');
      return;
    }

    const optimistic: Post = {
      id: `tmp-${Date.now()}`,
      author: currentUser,
      content: newPostContent.trim(),
      category: newPostCategory,
      likes: 0,
      comments: [],
      shares: 0,
      date: 'Just now',
      isLiked: false,
      isBookmarked: false,
      image: newPostImages[0], // First image as main image
    };
    setPosts([optimistic, ...posts]);
    setNewPostContent('');
    setNewPostImages([]);
    setShowCreatePost(false);
    
    try {
      const created = await api.createPost(optimistic.content, newPostImages);
      setPosts(prev => [mapApiPost(created), ...prev.filter(p => p.id !== optimistic.id)]);
      console.log('✅ Post created successfully with', newPostImages.length, 'images');
      
      // Reload all posts to ensure consistency and show the new post to all users
      setTimeout(() => {
        loadPosts();
      }, 500); // Small delay to ensure backend has processed the post
    } catch (e: any) {
      setPosts(prev => prev.filter(p => p.id !== optimistic.id));
      Alert.alert('Error', e?.message ? String(e.message) : 'Failed to create post');
      console.log('❌ Post creation failed:', e);
    }
  };

  const toggleLike = async (postId: string) => {
    // Optimistic update
    setPosts(prev => prev.map(post => post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post));
    try {
      // Ensure we're authenticated before making the request
      await ensureAuthenticated();
      
      const liked = posts.find(p => p.id === postId)?.isLiked;
      if (liked) await api.unlikePost(postId);
      else await api.likePost(postId);
    } catch (e: any) {
      console.error('❌ Failed to toggle like:', e.message);
      // Revert optimistic update on error
      setPosts(prev => prev.map(post => post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post));
    }
  };

  const toggleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const startEditPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setEditingPost(postId);
      setEditPostContent(post.content);
    }
  };

  const cancelEditPost = () => {
    setEditingPost(null);
    setEditPostContent('');
  };

  const saveEditPost = async () => {
    if (!editingPost || !editPostContent.trim()) return;
    
    try {
      // Update post optimistically
      setPosts(prev => prev.map(post => 
        post.id === editingPost 
          ? { ...post, content: editPostContent.trim() }
          : post
      ));
      
      // TODO: Call API to update post
      console.log('📝 Post updated:', editingPost);
      
      setEditingPost(null);
      setEditPostContent('');
    } catch (error) {
      console.error('❌ Failed to update post:', error);
      Alert.alert('Error', 'Failed to update post');
    }
  };

  const deletePost = async (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove post optimistically
              setPosts(prev => prev.filter(post => post.id !== postId));
              
              // TODO: Call API to delete post
              console.log('🗑️ Post deleted:', postId);
            } catch (error) {
              console.error('❌ Failed to delete post:', error);
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const reportPost = (postId: string) => {
    Alert.alert(
      'Report Post',
      'Why are you reporting this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Spam', onPress: () => console.log('📢 Reported as spam:', postId) },
        { text: 'Inappropriate', onPress: () => console.log('📢 Reported as inappropriate:', postId) },
        { text: 'Harassment', onPress: () => console.log('📢 Reported as harassment:', postId) },
      ]
    );
  };

  const testApiConnection = async () => {
    try {
      console.log('🔄 Testing API connection...');
      const health = await api.health();
      console.log('✅ API health check:', health);
      
      if (authState.isAuthenticated) {
        console.log('🔄 Testing authentication...');
        const testAuth = await api.testAuth();
        console.log('✅ Authentication test:', testAuth);
      }
    } catch (error) {
      console.error('❌ API connection test failed:', error);
    }
  };

  const loadMessagesWithRetry = async (conversationId: string, retryCount = 0) => {
    const maxRetries = 3;
    try {
      console.log(`🔄 Loading messages (attempt ${retryCount + 1}/${maxRetries + 1})...`);
      const messagesData = await api.getMessages(conversationId, 50);
      console.log('✅ Messages loaded:', messagesData.data?.length || 0, 'messages');
      return messagesData.data || [];
    } catch (error: any) {
      console.error(`❌ Failed to load messages (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying in 1 second... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loadMessagesWithRetry(conversationId, retryCount + 1);
      }
      
      throw error;
    }
  };

  const startChat = async (user: User) => {
    try {
      setSelectedUser(user);
      setShowChat(true);
      
      console.log('🔄 Starting chat with user:', user.name, 'ID:', user.id);
      
      // Check authentication first
      if (!authState.user || !authState.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      console.log('🔐 User authenticated:', authState.user.name);
      
      // Get or create conversation
      console.log('🔄 Getting or creating conversation...');
      const conversation = await api.getOrCreateConversation(user.id);
      console.log('✅ Conversation created/found:', conversation.id);
      setCurrentConversationId(conversation.id);
      
      // Load messages with retry
      const messages = await loadMessagesWithRetry(conversation.id);
      setChatMessages(messages);
      
      console.log('✅ Chat started successfully with:', user.name);
    } catch (error: any) {
      console.error('❌ Failed to start chat:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        user: user.name,
        userId: user.id,
        isAuthenticated: authState.isAuthenticated,
        currentUser: authState.user?.name
      });
      
      let errorMessage = 'Failed to load messages. Please try again.';
      if (error.message?.includes('Not authenticated')) {
        errorMessage = 'Please sign in to start a chat.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('401')) {
        errorMessage = 'Authentication expired. Please sign in again.';
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentConversationId) return;
    
    try {
      const messageContent = newMessage.trim();
      setNewMessage(''); // Clear input immediately
      
      console.log('🔄 Sending message:', messageContent);
      
      // Add message optimistically
      const optimisticMessage = {
        id: `tmp-${Date.now()}`,
        content: messageContent,
        senderId: currentUser.id,
        sender: currentUser,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setChatMessages(prev => [...prev, optimisticMessage]);
      
      // Send to API
      const sentMessage = await api.sendMessage(currentConversationId, messageContent);
      console.log('✅ Message sent successfully:', sentMessage.id);
      
      // Replace optimistic message with real one
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticMessage.id ? sentMessage : msg
        )
      );
      
      console.log('✅ Message sent successfully');
    } catch (error: any) {
      console.error('❌ Failed to send message:', error);
      console.error('❌ Send message error details:', {
        message: error.message,
        conversationId: currentConversationId,
        messageContent: newMessage.trim(),
        isAuthenticated: authState.isAuthenticated
      });
      
      let errorMessage = 'Failed to send message. Please try again.';
      if (error.message?.includes('Not authenticated')) {
        errorMessage = 'Please sign in to send messages.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('401')) {
        errorMessage = 'Authentication expired. Please sign in again.';
      }
      
      Alert.alert('Error', errorMessage);
      
      // Remove optimistic message on error
      setChatMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    }
  };

  const addComment = async (postId: string) => {
    if (!newComment.trim()) return;
    const optimistic: Comment = {
      id: `tmp-${Date.now()}`,
      author: currentUser,
      content: newComment.trim(),
      date: 'Just now',
      likes: 0,
    };
    setPosts(prev => prev.map(post => post.id === postId ? { ...post, comments: [...post.comments, optimistic] } : post));
    setNewComment('');
    try {
      // Ensure we're authenticated before making the request
      await ensureAuthenticated();
      
      await api.addComment(postId, optimistic.content);
      // Optionally refetch single post to get real comment from server
    } catch (e: any) {
      console.error('❌ Failed to add comment:', e.message);
      setPosts(prev => prev.map(post => post.id === postId ? { ...post, comments: post.comments.filter(c => c.id !== optimistic.id) } : post));
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'Just now') return dateString;
    return dateString;
  };

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={20} 
        color={selectedCategory === item.id ? colors.textPrimary : colors.textSecondary} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity 
          style={styles.authorInfo}
          onPress={() => startChat(item.author)}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.author.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.authorDetails}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorNameTappable}>{item.author.name}</Text>
              {item.author.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color={colors.accentTeal} />
              )}
              <Ionicons name="chatbubble-outline" size={12} color={colors.accentTeal} style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.authorUsername}>@{item.author.username}</Text>
            <Text style={styles.postDate}>{formatDate(item.date)}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.postHeaderActions}>
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => startChat(item.author)}
          >
            <Ionicons name="chatbubble-outline" size={18} color={colors.accentTeal} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => {
              Alert.alert(
                'Post Options',
                'What would you like to do?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  ...(item.author.id === currentUser.id ? [
                    { text: 'Edit', onPress: () => startEditPost(item.id) },
                    { text: 'Delete', style: 'destructive', onPress: () => deletePost(item.id) },
                  ] : []),
                  { text: 'Report', style: 'destructive', onPress: () => reportPost(item.id) },
                ]
              );
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{item.content}</Text>

      {/* Post Category */}
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryBadgeText}>
          {categories.find(c => c.id === item.category)?.name}
        </Text>
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => toggleLike(item.id)}
        >
          <Ionicons 
            name={item.isLiked ? "heart" : "heart-outline"} 
            size={20} 
            color={item.isLiked ? colors.error : colors.textSecondary} 
          />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowComments(showComments === item.id ? null : item.id)}
        >
          <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>{item.comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>{item.shares}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => toggleBookmark(item.id)}
        >
          <Ionicons 
            name={item.isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={item.isBookmarked ? colors.accentYellow : colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {showComments === item.id && (
        <View style={styles.commentsSection}>
          {item.comments.map(comment => (
            <View key={comment.id} style={styles.comment}>
              <TouchableOpacity 
                style={styles.commentAvatar}
                onPress={() => startChat(comment.author)}
                activeOpacity={0.7}
              >
                <Text style={styles.commentAvatarText}>
                  {comment.author.name.charAt(0).toUpperCase()}
                </Text>
              </TouchableOpacity>
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <TouchableOpacity 
                    onPress={() => startChat(comment.author)}
                    style={styles.commentAuthorTouchable}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.commentAuthorTappable}>{comment.author.name}</Text>
                    <Ionicons name="chatbubble-outline" size={10} color={colors.accentTeal} style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                  <Text style={styles.commentDate}>{comment.date}</Text>
                </View>
                <Text style={styles.commentText}>{comment.content}</Text>
                <TouchableOpacity style={styles.commentLike}>
                  <Ionicons name="heart-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.commentLikeText}>{comment.likes}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {/* Add Comment */}
          <View style={styles.addCommentRow}>
            <View style={styles.addCommentAvatar}>
              <Text style={styles.addCommentAvatarText}>
                {currentUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TextInput
              style={styles.addCommentInput}
                    placeholder={t('community.write_comment')}
              placeholderTextColor={colors.textSecondary}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity 
              style={styles.addCommentButton}
              onPress={() => addComment(item.id)}
            >
              <Ionicons name="send" size={16} color={colors.accentTeal} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>{t('community.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('community.subtitle')}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.messagesButton}
              onPress={() => navigation.navigate('Chat' as never)}
            >
              <Ionicons name="chatbubbles-outline" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.createPostButton}
              onPress={() => setShowCreatePost(true)}
            >
              <Ionicons name="add" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('community.search_placeholder')}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </LinearGradient>

      {/* Posts List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="chatbubbles-outline" size={48} color={colors.accentTeal} />
                 <Text style={styles.loadingText}>{t('community.loading_posts')}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.postsContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color={colors.textSecondary} />
                     <Text style={styles.emptyTitle}>{t('community.no_posts')}</Text>
                     <Text style={styles.emptySubtitle}>
                       {searchQuery ? t('community.try_search') : t('community.first_share')}
                     </Text>
            </View>
          }
        />
      )}

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreatePost(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
                   <Text style={styles.modalTitle}>{t('community.create_post')}</Text>
            <TouchableOpacity onPress={createPost}>
              <Text style={styles.modalPost}>Post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.modalAuthorInfo}>
              <View style={styles.modalAvatar}>
                <Text style={styles.modalAvatarText}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.modalAuthorName}>{currentUser.name}</Text>
                <View style={styles.categorySelector}>
                  <Text style={styles.categoryLabel}>Category: </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.slice(1).map(category => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryOption,
                          newPostCategory === category.id && styles.selectedCategoryOption
                        ]}
                        onPress={() => setNewPostCategory(category.id)}
                      >
                        <Text style={[
                          styles.categoryOptionText,
                          newPostCategory === category.id && styles.selectedCategoryOptionText
                        ]}>
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>

            <TextInput
              style={styles.modalTextInput}
                     placeholder={t('community.whats_on_mind')}
              placeholderTextColor={colors.textSecondary}
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              textAlignVertical="top"
            />

            {/* Image Preview */}
            {newPostImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
                {newPostImages.map((uri, index) => (
                  <View key={index} style={styles.imagePreviewWrapper}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removePostImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF5252" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Image Upload Actions */}
            <View style={styles.postActionsBar}>
              <TouchableOpacity
                style={styles.postActionButton}
                onPress={pickPostImage}
                disabled={isUploadingImage || newPostImages.length >= 4}
              >
                {isUploadingImage ? (
                  <ActivityIndicator size="small" color={colors.accentTeal} />
                ) : (
                  <>
                    <Ionicons name="images-outline" size={22} color={colors.accentTeal} />
                    <Text style={styles.postActionText}>Gallery</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.postActionButton}
                onPress={takePostPhoto}
                disabled={isUploadingImage || newPostImages.length >= 4}
              >
                <Ionicons name="camera-outline" size={22} color={colors.accentTeal} />
                <Text style={styles.postActionText}>Camera</Text>
              </TouchableOpacity>

              <View style={styles.postActionButton}>
                <Text style={styles.imageCountText}>
                  {newPostImages.length}/4 images
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Post Modal */}
      <Modal
        visible={!!editingPost}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={cancelEditPost}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
                   <Text style={styles.modalTitle}>{t('community.edit_post')}</Text>
            <TouchableOpacity onPress={saveEditPost}>
              <Text style={styles.modalPost}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalTextInput}
                     placeholder={t('community.edit_your_post')}
              placeholderTextColor={colors.textSecondary}
              value={editPostContent}
              onChangeText={setEditPostContent}
              multiline
              textAlignVertical="top"
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Chat Modal */}
      <Modal
        visible={showChat}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.chatUserInfo}>
              <Text style={styles.chatUserName}>{selectedUser?.name}</Text>
              <Text style={styles.chatUserStatus}>Online</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="call" size={24} color={colors.accentTeal} />
            </TouchableOpacity>
          </View>

          <View style={styles.chatMessages}>
            {chatMessages.length === 0 ? (
              <View style={styles.chatEmptyState}>
                 <Text style={styles.chatEmptyText}>{t('community.no_messages')}</Text>
                 <Text style={styles.chatEmptySubtext}>{t('community.start_conversation')}</Text>
              </View>
            ) : (
              chatMessages.map((message) => (
                <View 
                  key={message.id} 
                  style={[
                    styles.chatMessage,
                    message.senderId === currentUser.id && styles.chatMessageOwn
                  ]}
                >
                  <Text style={[
                    styles.chatMessageText,
                    message.senderId === currentUser.id && styles.chatMessageTextOwn
                  ]}>
                    {message.content}
                  </Text>
                  <Text style={styles.chatMessageTime}>
                    {new Date(message.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.chatInput}>
            <TextInput
              style={styles.chatTextInput}
              placeholder={t('community.type_message')}
              placeholderTextColor={colors.textSecondary}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.chatSendButton, !newMessage.trim() && styles.chatSendButtonDisabled]}
              onPress={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={newMessage.trim() ? colors.textPrimary : colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagesButton: {
    backgroundColor: colors.accentTeal,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  createPostButton: {
    backgroundColor: colors.accentTeal,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    marginLeft: 8,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: colors.accentTeal,
  },
  categoryText: {
    color: colors.textSecondary,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: colors.textPrimary,
  },
  postsContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorDetails: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 4,
  },
  authorNameTappable: {
    color: colors.accentTeal,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 4,
  },
  authorUsername: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  postDate: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  postContent: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentTeal,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryBadgeText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    color: colors.textSecondary,
    marginLeft: 6,
    fontSize: 14,
  },
  commentsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  commentAvatarText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
    marginRight: 8,
  },
  commentAuthorTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAuthorTappable: {
    color: colors.accentTeal,
    fontWeight: '600',
    fontSize: 14,
  },
  commentDate: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  commentText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  commentLike: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikeText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
  addCommentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  addCommentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addCommentAvatarText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  addCommentInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.textPrimary,
    fontSize: 14,
    maxHeight: 80,
  },
  addCommentButton: {
    marginLeft: 8,
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalCancel: {
    color: colors.accentTeal,
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalPost: {
    color: colors.accentTeal,
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalAuthorInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalAvatarText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalAuthorName: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  categoryOption: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedCategoryOption: {
    backgroundColor: colors.accentTeal,
  },
  categoryOptionText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  selectedCategoryOptionText: {
    color: colors.textPrimary,
  },
  modalTextInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  // Post Management Styles
  postHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatButton: {
    marginRight: 8,
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accentTeal,
  },
  // Chat Styles
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  chatUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chatUserStatus: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatMessage: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '80%',
  },
  chatMessageOwn: {
    backgroundColor: colors.accentTeal,
    alignSelf: 'flex-end',
  },
  chatMessageText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  chatMessageTextOwn: {
    color: colors.textPrimary,
  },
  chatMessageTime: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: 8,
  },
  chatSendButton: {
    backgroundColor: colors.accentTeal,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendButtonDisabled: {
    backgroundColor: colors.surface,
  },
  chatEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  chatEmptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chatEmptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    fontWeight: '500',
  },
  // Image Upload Styles
  imagePreviewContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  imagePreview: {
    width: 120,
    height: 90,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  postActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    marginTop: 'auto',
  },
  postActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
  },
  postActionText: {
    color: colors.accentTeal,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  imageCountText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});