import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { useFadeIn } from '../hooks/useAnimations';

interface AdminStats {
  totalUsers: number;
  totalDonations: number;
  totalNews: number;
  totalEvents: number;
  totalLessons: number;
  totalScholars: number;
}

interface AdminMenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  screen: string;
  count?: number;
}

const AdminDashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const opacity = useFadeIn({ duration: 380 });
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalDonations: 0,
    totalNews: 0,
    totalEvents: 0,
    totalLessons: 0,
    totalScholars: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const adminMenuItems: AdminMenuItem[] = [
    {
      id: 'news',
      title: 'News & Updates',
      subtitle: 'Manage app news and announcements',
      icon: 'newspaper',
      color: '#2196F3',
      screen: 'AdminNews',
      count: stats.totalNews,
    },
    {
      id: 'events',
      title: 'Events Management',
      subtitle: 'Create and manage upcoming events',
      icon: 'calendar',
      color: '#FF9800',
      screen: 'AdminEvents',
      count: stats.totalEvents,
    },
    {
      id: 'users',
      title: 'User Management',
      subtitle: 'Manage app users and permissions',
      icon: 'people',
      color: '#4CAF50',
      screen: 'AdminUsers',
      count: stats.totalUsers,
    },
    {
      id: 'donations',
      title: 'Donation Management',
      subtitle: 'Track and manage donations',
      icon: 'card',
      color: '#9C27B0',
      screen: 'AdminDonations',
      count: stats.totalDonations,
    },
    {
      id: 'uploads',
      title: 'File Uploads',
      subtitle: 'Manage uploaded files and media',
      icon: 'cloud-upload',
      color: '#607D8B',
      screen: 'AdminUploads',
    },
    {
      id: 'lessons',
      title: 'Lessons Management',
      subtitle: 'Create and edit Islamic lessons',
      icon: 'book',
      color: '#795548',
      screen: 'AdminLessons',
      count: stats.totalLessons,
    },
    {
      id: 'scholars',
      title: 'Scholars Management',
      subtitle: 'Add and manage Islamic scholars',
      icon: 'school',
      color: '#E91E63',
      screen: 'AdminScholars',
      count: stats.totalScholars,
    },
    {
      id: 'settings',
      title: 'App Settings',
      subtitle: 'Configure app-wide settings',
      icon: 'settings',
      color: '#FF5722',
      screen: 'AdminSettings',
    },
    {
      id: 'azan',
      title: 'Azan Schedules',
      subtitle: 'Add azans to play at set times (daily, works offline)',
      icon: 'volume-high',
      color: '#00BCD4',
      screen: 'AdminAzan',
    },
  ];

  const loadStats = async () => {
    try {
      const overview = await api.getAnalyticsOverview();
      setStats({
        totalUsers: overview?.totalUsers ?? 0,
        totalDonations: overview?.donationsMonth ?? 0,
        totalNews: overview?.totalNews ?? 0,
        totalEvents: overview?.totalEvents ?? 0,
        totalLessons: overview?.totalLessons ?? 0,
        totalScholars: overview?.totalScholars ?? 0,
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
      setStats({
        totalUsers: 0,
        totalDonations: 0,
        totalNews: 0,
        totalEvents: 0,
        totalLessons: 0,
        totalScholars: 0,
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleMenuPress = (item: AdminMenuItem) => {
    navigation.navigate(item.screen);
  };

  const renderStatCard = (title: string, value: number, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{title}</Text>
        </View>
      </View>
    </View>
  );

  const renderMenuItem = (item: AdminMenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item)}
    >
      <LinearGradient
        colors={[item.color + '20', item.color + '10']}
        style={styles.menuItemGradient}
      >
        <View style={styles.menuItemContent}>
          <View style={[styles.menuItemIcon, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.menuItemText}>
            <Text style={styles.menuItemTitle}>{item.title}</Text>
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
            {item.count !== undefined && (
              <Text style={styles.menuItemCount}>{item.count} items</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, { opacity, flex: 1 }]}>
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={[colors.accentTeal, colors.accentGreen]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="shield-checkmark" size={32} color={colors.accentYellow} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>Manage Tijaniyah Muslim Pro</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Total Users', stats.totalUsers, 'people', '#4CAF50')}
          {renderStatCard('Donations', stats.totalDonations, 'card', '#9C27B0')}
          {renderStatCard('News Items', stats.totalNews, 'newspaper', '#2196F3')}
          {renderStatCard('Events', stats.totalEvents, 'calendar', '#FF9800')}
          {renderStatCard('Lessons', stats.totalLessons, 'book', '#795548')}
          {renderStatCard('Scholars', stats.totalScholars, 'school', '#E91E63')}
        </View>
      </View>

      {/* Management Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Management Tools</Text>
        {adminMenuItems.map(renderMenuItem)}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('AdminNews')}
          >
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
            <Text style={styles.quickActionText}>Add News</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('AdminEvents')}
          >
            <Ionicons name="calendar-plus" size={24} color="#FF9800" />
            <Text style={styles.quickActionText}>Add Event</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('AdminScholars')}
          >
            <Ionicons name="person-add" size={24} color="#2196F3" />
            <Text style={styles.quickActionText}>Add Scholar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('AdminLessons')}
          >
            <Ionicons name="book-plus" size={24} color="#795548" />
            <Text style={styles.quickActionText}>Add Lesson</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('AdminUsers')}
          >
            <Ionicons name="person-add-outline" size={24} color="#4CAF50" />
            <Text style={styles.quickActionText}>Add User</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  menuItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemGradient: {
    padding: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  menuItemCount: {
    fontSize: 12,
    color: colors.accentTeal,
    fontWeight: '600',
  },
  quickActionsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 8,
    fontWeight: '600',
  },
});

export default AdminDashboard;
