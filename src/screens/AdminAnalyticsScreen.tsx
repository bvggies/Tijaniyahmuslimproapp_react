import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useFadeIn } from '../hooks/useAnimations';

const { width } = Dimensions.get('window');

interface AnalyticsData {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growthRate: number;
  };
  content: {
    news: number;
    events: number;
    lessons: number;
    scholars: number;
  };
  engagement: {
    totalViews: number;
    totalDownloads: number;
    totalLikes: number;
    averageSessionTime: number;
  };
  donations: {
    totalAmount: number;
    totalDonations: number;
    monthlyAmount: number;
    growthRate: number;
  };
  geography: {
    topCountries: Array<{ country: string; users: number; percentage: number }>;
    topCities: Array<{ city: string; country: string; users: number }>;
  };
  trends: {
    dailyActiveUsers: Array<{ date: string; users: number }>;
    monthlyRevenue: Array<{ month: string; amount: number }>;
    contentViews: Array<{ type: string; views: number }>;
  };
}

const AdminAnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const { hasPermission } = useAdminAuth();
  const opacity = useFadeIn({ duration: 380 });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        users: {
          total: 15420,
          active: 8930,
          newThisMonth: 1240,
          growthRate: 12.5,
        },
        content: {
          news: 45,
          events: 23,
          lessons: 67,
          scholars: 12,
        },
        engagement: {
          totalViews: 125000,
          totalDownloads: 8900,
          totalLikes: 15600,
          averageSessionTime: 18.5, // minutes
        },
        donations: {
          totalAmount: 2450000, // in NGN
          totalDonations: 890,
          monthlyAmount: 180000,
          growthRate: 8.3,
        },
        geography: {
          topCountries: [
            { country: 'Nigeria', users: 8500, percentage: 55.1 },
            { country: 'Senegal', users: 2100, percentage: 13.6 },
            { country: 'Mauritania', users: 1800, percentage: 11.7 },
            { country: 'Morocco', users: 1200, percentage: 7.8 },
            { country: 'Ghana', users: 820, percentage: 5.3 },
          ],
          topCities: [
            { city: 'Lagos', country: 'Nigeria', users: 3200 },
            { city: 'Kaolack', country: 'Senegal', users: 1800 },
            { city: 'Kano', country: 'Nigeria', users: 2100 },
            { city: 'Nouakchott', country: 'Mauritania', users: 1200 },
            { city: 'Fez', country: 'Morocco', users: 800 },
          ],
        },
        trends: {
          dailyActiveUsers: [
            { date: '2024-01-01', users: 1200 },
            { date: '2024-01-02', users: 1350 },
            { date: '2024-01-03', users: 1180 },
            { date: '2024-01-04', users: 1420 },
            { date: '2024-01-05', users: 1680 },
            { date: '2024-01-06', users: 1950 },
            { date: '2024-01-07', users: 2100 },
          ],
          monthlyRevenue: [
            { month: 'Jan 2024', amount: 180000 },
            { month: 'Feb 2024', amount: 195000 },
            { month: 'Mar 2024', amount: 220000 },
            { month: 'Apr 2024', amount: 240000 },
            { month: 'May 2024', amount: 260000 },
            { month: 'Jun 2024', amount: 280000 },
          ],
          contentViews: [
            { type: 'Lessons', views: 45000 },
            { type: 'News', views: 32000 },
            { type: 'Events', views: 28000 },
            { type: 'Scholars', views: 20000 },
          ],
        },
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      Alert.alert('Error', 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const renderMetricCard = (title: string, value: string, subtitle: string, icon: string, color: string, trend?: number) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color }]}>
          <Ionicons name={icon as any} size={24} color="#FFFFFF" />
        </View>
        {trend !== undefined && (
          <View style={[styles.trendBadge, { backgroundColor: trend >= 0 ? '#4CAF50' : '#F44336' }]}>
            <Ionicons 
              name={trend >= 0 ? 'trending-up' : 'trending-down'} 
              size={12} 
              color="#FFFFFF" 
            />
            <Text style={styles.trendText}>{Math.abs(trend)}%</Text>
          </View>
        )}
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricSubtitle}>{subtitle}</Text>
    </View>
  );

  const renderChartCard = (title: string, children: React.ReactNode) => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderBarChart = (data: Array<{ label: string; value: number; color: string }>) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <View style={styles.barChart}>
        {data.map((item, index) => (
          <View key={index} style={styles.barItem}>
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: (item.value / maxValue) * 120,
                    backgroundColor: item.color,
                  }
                ]} 
              />
            </View>
            <Text style={styles.barLabel}>{item.label}</Text>
            <Text style={styles.barValue}>{formatNumber(item.value)}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPieChart = (data: Array<{ label: string; value: number; color: string }>) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <View style={styles.pieChart}>
        <View style={styles.pieChartContainer}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            return (
              <View key={index} style={styles.pieItem}>
                <View style={[styles.pieColor, { backgroundColor: item.color }]} />
                <Text style={styles.pieLabel}>{item.label}</Text>
                <Text style={styles.pieValue}>{percentage.toFixed(1)}%</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderLineChart = (data: Array<{ label: string; value: number }>, color: string) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;
    
    return (
      <View style={styles.lineChart}>
        <View style={styles.lineChartContainer}>
          {data.map((item, index) => {
            const height = range > 0 ? ((item.value - minValue) / range) * 100 : 50;
            return (
              <View key={index} style={styles.lineItem}>
                <View 
                  style={[
                    styles.lineBar, 
                    { 
                      height: height,
                      backgroundColor: color,
                    }
                  ]} 
                />
                <Text style={styles.lineLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Analytics...</Text>
      </View>
    );
  }

  if (!analyticsData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={colors.textSecondary} />
        <Text style={styles.errorText}>Failed to load analytics data</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAnalyticsData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.accentTeal, colors.accentGreen]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Analytics & Reports</Text>
            <Text style={styles.headerSubtitle}>Comprehensive app insights</Text>
          </View>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.value}
              style={[
                styles.periodButton,
                selectedPeriod === period.value && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.value as any)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.value && styles.periodButtonTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {renderMetricCard(
              'Total Users',
              formatNumber(analyticsData.users.total),
              `${analyticsData.users.active} active`,
              'people',
              '#2196F3',
              analyticsData.users.growthRate
            )}
            {renderMetricCard(
              'Monthly Revenue',
              formatCurrency(analyticsData.donations.monthlyAmount),
              `${analyticsData.donations.totalDonations} donations`,
              'cash',
              '#4CAF50',
              analyticsData.donations.growthRate
            )}
            {renderMetricCard(
              'Content Views',
              formatNumber(analyticsData.engagement.totalViews),
              `${analyticsData.engagement.averageSessionTime}min avg`,
              'eye',
              '#FF9800'
            )}
            {renderMetricCard(
              'Downloads',
              formatNumber(analyticsData.engagement.totalDownloads),
              `${analyticsData.engagement.totalLikes} likes`,
              'download',
              '#E91E63'
            )}
          </View>
        </View>

        {/* User Growth Chart */}
        <View style={styles.section}>
          {renderChartCard('Daily Active Users', 
            renderLineChart(
              analyticsData.trends.dailyActiveUsers.map(d => ({ 
                label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: d.users 
              })),
              '#2196F3'
            )
          )}
        </View>

        {/* Revenue Chart */}
        <View style={styles.section}>
          {renderChartCard('Monthly Revenue Trend',
            renderBarChart(
              analyticsData.trends.monthlyRevenue.map(m => ({
                label: m.month.split(' ')[0],
                value: m.amount,
                color: '#4CAF50'
              }))
            )
          )}
        </View>

        {/* Content Views Distribution */}
        <View style={styles.section}>
          {renderChartCard('Content Views by Type',
            renderPieChart(
              analyticsData.trends.contentViews.map(c => ({
                label: c.type,
                value: c.views,
                color: c.type === 'Lessons' ? '#4CAF50' : 
                       c.type === 'News' ? '#2196F3' :
                       c.type === 'Events' ? '#FF9800' : '#E91E63'
              }))
            )
          )}
        </View>

        {/* Geographic Distribution */}
        <View style={styles.section}>
          {renderChartCard('Users by Country',
            renderBarChart(
              analyticsData.geography.topCountries.map(c => ({
                label: c.country,
                value: c.users,
                color: '#9C27B0'
              }))
            )
          )}
        </View>

        {/* Top Cities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Cities</Text>
          <View style={styles.citiesList}>
            {analyticsData.geography.topCities.map((city, index) => (
              <View key={index} style={styles.cityItem}>
                <View style={styles.cityRank}>
                  <Text style={styles.cityRankText}>{index + 1}</Text>
                </View>
                <View style={styles.cityInfo}>
                  <Text style={styles.cityName}>{city.city}</Text>
                  <Text style={styles.cityCountry}>{city.country}</Text>
                </View>
                <View style={styles.cityStats}>
                  <Text style={styles.cityUsers}>{formatNumber(city.users)}</Text>
                  <Text style={styles.cityLabel}>users</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Content Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Overview</Text>
          <View style={styles.contentGrid}>
            <View style={styles.contentItem}>
              <Ionicons name="newspaper" size={32} color="#2196F3" />
              <Text style={styles.contentNumber}>{analyticsData.content.news}</Text>
              <Text style={styles.contentLabel}>News Articles</Text>
            </View>
            <View style={styles.contentItem}>
              <Ionicons name="calendar" size={32} color="#FF9800" />
              <Text style={styles.contentNumber}>{analyticsData.content.events}</Text>
              <Text style={styles.contentLabel}>Events</Text>
            </View>
            <View style={styles.contentItem}>
              <Ionicons name="book" size={32} color="#4CAF50" />
              <Text style={styles.contentNumber}>{analyticsData.content.lessons}</Text>
              <Text style={styles.contentLabel}>Lessons</Text>
            </View>
            <View style={styles.contentItem}>
              <Ionicons name="school" size={32} color="#E91E63" />
              <Text style={styles.contentNumber}>{analyticsData.content.scholars}</Text>
              <Text style={styles.contentLabel}>Scholars</Text>
            </View>
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  periodButtonActive: {
    backgroundColor: colors.accentTeal,
    borderColor: colors.accentTeal,
  },
  periodButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.accentTeal,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
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
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  metricSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 10,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  pieChart: {
    alignItems: 'center',
  },
  pieChartContainer: {
    width: '100%',
  },
  pieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pieColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  pieLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  pieValue: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  lineChart: {
    height: 120,
  },
  lineChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  lineItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  lineBar: {
    width: '100%',
    borderRadius: 2,
    minHeight: 4,
    marginBottom: 8,
  },
  lineLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  citiesList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  cityRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cityRankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cityCountry: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  cityStats: {
    alignItems: 'flex-end',
  },
  cityUsers: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  cityLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contentItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contentNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  contentLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default AdminAnalyticsScreen;
