import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  DollarSign,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { StatsCard, FeaturedStatsCard } from './components/StatsCard';
import { ActivityFeed } from './components/ActivityFeed';
import { UserGrowthChart, DonationsChart } from './components/Charts';
import { 
  useOverviewStats, 
  useRecentActivity,
  useDailyStats,
} from './hooks/useDashboardData';
import { formatCurrency, formatNumber } from '../../lib/utils';
import { toast } from '../../components/ui/use-toast';

export default function DashboardPage() {
  // Real API queries
  const { 
    data: overviewData, 
    isLoading: isLoadingOverview, 
    error: overviewError,
    refetch: refetchOverview 
  } = useOverviewStats();
  
  const { 
    data: activityData, 
    isLoading: isLoadingActivity, 
    error: activityError 
  } = useRecentActivity();

  // Get date range for daily stats (last 7 days)
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const { data: dailyStatsData } = useDailyStats(startDate, endDate);

  // Always use real data, show loading state if not available
  const stats = overviewData;
  const activities = activityData || [];
  const chartData = dailyStatsData || [];

  // Debug: Log the data to see what we're getting
  useEffect(() => {
    if (overviewError) {
      console.error('Dashboard overview error:', overviewError);
    }
    if (overviewData) {
      console.log('Dashboard overview data:', overviewData);
    }
  }, [overviewData, overviewError]);

  // Calculate percentage changes from real data
  const calculateChange = (current: number, previous: number | undefined): { value: string; trend: 'up' | 'down' | 'neutral' } => {
    if (previous === undefined || previous === null) {
      return { value: 'No previous data', trend: 'neutral' };
    }
    if (previous === 0) {
      if (current === 0) {
        return { value: 'No change', trend: 'neutral' };
      }
      return { value: 'New data', trend: 'up' };
    }
    const change = ((current - previous) / previous) * 100;
    return {
      value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    };
  };

  const totalUsersChange = stats ? calculateChange(stats.totalUsers, stats.totalUsersLastMonth) : { value: 'No previous data', trend: 'neutral' as const };
  const postsChange = stats ? calculateChange(stats.postsToday, stats.postsYesterday) : { value: 'No previous data', trend: 'neutral' as const };
  const eventsChange = stats && stats.upcomingEventsLastWeek !== undefined 
    ? { value: `${stats.upcomingEvents - (stats.upcomingEventsLastWeek || 0)} new this week`, trend: (stats.upcomingEvents > (stats.upcomingEventsLastWeek || 0)) ? 'up' as const : 'neutral' as const }
    : { value: stats ? 'No change' : 'No previous data', trend: 'neutral' as const };
  const donationsChange = stats ? calculateChange(stats.donationsMonth, stats.donationsMonthLastMonth) : { value: 'No previous data', trend: 'neutral' as const };

  const handleRefresh = async () => {
    try {
      await refetchOverview();
      toast.success('Dashboard refreshed', 'Data has been updated');
    } catch {
      toast.error('Refresh failed', 'Using cached data');
    }
  };

  const isLoading = isLoadingOverview && !overviewData;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your Tijaniyah community.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>


      {/* Error Display */}
      {overviewError && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 font-medium">Error loading analytics data</p>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">
            {overviewError instanceof Error ? overviewError.message : 'Failed to fetch dashboard data'}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats ? formatNumber(stats.totalUsers ?? 0) : (isLoading ? '...' : '0')}
          change={stats ? (totalUsersChange.value + (stats.totalUsersLastMonth !== undefined ? ' from last month' : '')) : (isLoading ? 'Loading...' : 'No data')}
          trend={totalUsersChange.trend}
          icon={Users}
          color="primary"
          isLoading={isLoading}
        />
        <StatsCard
          title="Posts Today"
          value={stats ? formatNumber(stats.postsToday ?? 0) : (isLoading ? '...' : '0')}
          change={stats ? (postsChange.value + (stats.postsYesterday !== undefined ? ' from yesterday' : '')) : (isLoading ? 'Loading...' : 'No data')}
          trend={postsChange.trend}
          icon={MessageSquare}
          color="blue"
          isLoading={isLoading}
        />
        <StatsCard
          title="Upcoming Events"
          value={stats ? (stats.upcomingEvents ?? 0).toString() : (isLoading ? '...' : '0')}
          change={eventsChange.value}
          trend={eventsChange.trend}
          icon={Calendar}
          color="purple"
          isLoading={isLoading}
        />
        <StatsCard
          title="Donations (Month)"
          value={stats ? formatCurrency(stats.donationsMonth ?? 0) : (isLoading ? '...' : '$0')}
          change={stats ? (donationsChange.value + (stats.donationsMonthLastMonth !== undefined ? ' from last month' : '')) : (isLoading ? 'Loading...' : 'No data')}
          trend={donationsChange.trend}
          icon={DollarSign}
          color="gold"
          isLoading={isLoading}
        />
      </div>

      {/* Featured Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <FeaturedStatsCard
          title="Pending Reports"
          value={stats ? (stats.reportsPending ?? 0) : (isLoading ? '...' : 0)}
          subtitle={stats ? (stats.reportsPending > 0 ? 'Requires attention' : 'All clear') : (isLoading ? 'Loading...' : 'No data')}
          icon={AlertTriangle}
          gradient="bg-gradient-to-br from-primary-500 to-primary-600"
          isLoading={isLoading}
        />
        <FeaturedStatsCard
          title="Active Users (7d)"
          value={stats ? formatNumber(stats.activeUsers7d ?? 0) : (isLoading ? '...' : '0')}
          subtitle={stats && stats.totalUsers > 0 ? `${((stats.activeUsers7d / stats.totalUsers) * 100).toFixed(1)}% of total` : (stats ? '0% of total' : (isLoading ? 'Loading...' : 'No data'))}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          isLoading={isLoading}
        />
        <FeaturedStatsCard
          title="Today's Donations"
          value={stats ? formatCurrency(stats.donationsToday ?? 0) : (isLoading ? '...' : '$0')}
          subtitle={stats ? `${formatCurrency(stats.donationsWeek ?? 0)} this week` : (isLoading ? 'Loading...' : 'No data')}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-amber-500 to-amber-600"
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UserGrowthChart
          data={chartData}
          isLoading={isLoading}
          error={null}
        />
        <DonationsChart
          data={chartData}
          isLoading={isLoading}
          error={null}
        />
      </div>

      {/* Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed
          activities={activities}
          isLoading={isLoadingActivity}
          error={activityError as Error | null}
        />
        
        {/* Quick Actions / Additional Stats */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Stats</h3>
          <div className="grid gap-4">
            <StatsCard
              title="New Users Today"
              value={stats ? (stats.newUsersToday ?? 0) : (isLoading ? '...' : 0)}
              change="Active registrations"
              trend="neutral"
              icon={Users}
              color="emerald"
              isLoading={isLoading}
            />
            <StatsCard
              title="Active Users (30d)"
              value={stats ? formatNumber(stats.activeUsers30d ?? 0) : (isLoading ? '...' : '0')}
              change={stats && stats.totalUsers > 0 ? `${((stats.activeUsers30d / stats.totalUsers) * 100).toFixed(1)}% engagement` : (stats ? '0% engagement' : (isLoading ? 'Loading...' : 'No data'))}
              trend="up"
              icon={TrendingUp}
              color="blue"
              isLoading={isLoading}
            />
            {stats && stats.wazifaCompletions !== undefined && (
              <StatsCard
                title="Wazifa Completions"
                value={formatNumber(stats.wazifaCompletions)}
                change="This month"
                trend="up"
                icon={Calendar}
                color="purple"
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
