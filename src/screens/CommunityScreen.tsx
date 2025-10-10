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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';
import { api, ensureDemoAuth, setToken } from '../services/api';

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

const samplePosts: Post[] = [];

export default function CommunityScreen() {
  const { authState } = useAuth();
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
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

  useEffect(() => {
    (async () => {
      try {
        const data = await api.listPosts(20);
        const items = Array.isArray(data?.items) ? data.items : [];
        const mappedPosts = items.map(mapApiPost);
        console.log('📥 Loaded posts:', mappedPosts.length);
        setPosts(mappedPosts);
      } catch (e) {
        console.log('⚠️ Failed to load posts, using sample data:', e);
        // Keep sample posts as fallback
      }
    })();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const createPost = async () => {
    if (!newPostContent.trim()) return;
    
    // Check if user is authenticated
    if (!authState.user) {
      Alert.alert('Authentication Required', 'Please sign in to create posts');
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
    };
    setPosts([optimistic, ...posts]);
    setNewPostContent('');
    setShowCreatePost(false);
    
    try {
      const created = await api.createPost(optimistic.content, []);
      setPosts(prev => [mapApiPost(created), ...prev.filter(p => p.id !== optimistic.id)]);
    } catch (e: any) {
      setPosts(prev => prev.filter(p => p.id !== optimistic.id));
      Alert.alert('Error', e?.message ? String(e.message) : 'Failed to create post');
    }
  };

  const toggleLike = async (postId: string) => {
    setPosts(prev => prev.map(post => post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post));
    try {
      const liked = posts.find(p => p.id === postId)?.isLiked;
      if (liked) await api.unlikePost(postId);
      else await api.likePost(postId);
    } catch (e) {
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
      await api.addComment(postId, optimistic.content);
      // Optionally refetch single post to get real comment from server
    } catch (e) {
      setPosts(prev => prev.map(post => post.id === postId ? { ...post, comments: post.comments.filter(c => c.id !== optimistic.id) } : post));
      Alert.alert('Error', 'Failed to add comment');
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
        <View style={styles.authorInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.author.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.authorDetails}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName}>{item.author.name}</Text>
              {item.author.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color={colors.accentTeal} />
              )}
            </View>
            <Text style={styles.authorUsername}>@{item.author.username}</Text>
            <Text style={styles.postDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
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
              <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>
                  {comment.author.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.author.name}</Text>
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
              placeholder="Write a comment..."
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
            <Text style={styles.headerTitle}>Community</Text>
            <Text style={styles.headerSubtitle}>Connect with fellow Muslims worldwide</Text>
          </View>
          <TouchableOpacity 
            style={styles.createPostButton}
            onPress={() => setShowCreatePost(true)}
          >
            <Ionicons name="add" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts, users..."
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
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No posts found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'Be the first to share something inspiring'}
            </Text>
          </View>
        }
      />

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
            <Text style={styles.modalTitle}>Create Post</Text>
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
              placeholder="What's on your mind? Share something inspiring..."
              placeholderTextColor={colors.textSecondary}
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              textAlignVertical="top"
            />
          </View>
        </KeyboardAvoidingView>
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
});