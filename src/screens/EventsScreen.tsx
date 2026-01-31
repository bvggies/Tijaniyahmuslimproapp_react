import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { useFadeIn, useStaggeredFadeIn, usePressScale } from '../hooks/useAnimations';
// Date formatting helper
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const { width } = Dimensions.get('window');

/** Wraps an event card with staggered entrance and press scale animation */
function AnimatedEventCardWrapper({
  index,
  onPress,
  children,
}: {
  index: number;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const { opacity, translateY } = useStaggeredFadeIn(index, { baseDelay: 100 });
  const { scale, onPressIn, onPressOut } = usePressScale(0.98);

  return (
    <Animated.View
      style={[
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={styles.eventCard}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  category: string;
  status: string;
  isPublished: boolean;
  maxAttendees?: number;
  registrationRequired: boolean;
}

export default function EventsScreen({ navigation }: any) {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const loadEvents = async () => {
    try {
      const response = await api.getEvents();
      const eventsData = Array.isArray(response) ? response : (response?.data || []);
      
      const mappedEvents: Event[] = eventsData
        .filter((event: any) => event.isPublished)
        .map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          startDate: event.startDate,
          endDate: event.endDate,
          imageUrl: event.imageUrl,
          category: event.category || 'OTHER',
          status: event.status || 'UPCOMING',
          isPublished: event.isPublished,
          maxAttendees: event.maxAttendees,
          registrationRequired: event.registrationRequired || false,
        }));

      setEvents(mappedEvents);
      console.log('✅ Loaded', mappedEvents.length, 'events');
    } catch (error) {
      console.error('⚠️ Failed to load events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('🎯 Events screen focused, reloading events...');
      loadEvents();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents();
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter((event) => {
    const startDate = new Date(event.startDate);
    return startDate >= now;
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const pastEvents = events.filter((event) => {
    const endDate = new Date(event.endDate);
    return endDate < now;
  }).sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      CONFERENCE: '#3B82F6',
      SEMINAR: '#10B981',
      WORKSHOP: '#F59E0B',
      CELEBRATION: '#EC4899',
      OTHER: '#6B7280',
    };
    return colors[category] || colors.OTHER;
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0) + category.slice(1).toLowerCase();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      UPCOMING: '#10B981',
      ONGOING: '#3B82F6',
      COMPLETED: '#6B7280',
      CANCELLED: '#EF4444',
    };
    return colors[status] || colors.UPCOMING;
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDate(date);
  };

  const renderEventCardContent = (event: Event) => {
    const categoryColor = getCategoryColor(event.category);
    const statusColor = getStatusColor(event.status);
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const isUpcoming = startDate >= now;
    const daysUntil = isUpcoming 
      ? Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <BlurView intensity={100} tint="dark" style={styles.blurCard}>
          <LinearGradient
            colors={[`${colors.surface}E6`, `${colors.surface}CC`, `${colors.surface}E6`]}
            style={styles.cardGradient}
          >
            {event.imageUrl ? (
              <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
            ) : (
              <LinearGradient
                colors={[`${categoryColor}60`, `${categoryColor}30`, `${categoryColor}20`]}
                style={styles.eventImagePlaceholder}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}30` }]}>
                  <Ionicons name="calendar" size={32} color={categoryColor} />
                </View>
              </LinearGradient>
            )}

            <View style={styles.eventInfo}>
              <View style={styles.eventHeader}>
                <View style={styles.badgeRow}>
                  <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}25` }]}>
                    <View style={[styles.badgeDot, { backgroundColor: categoryColor }]} />
                    <Text style={[styles.categoryText, { color: categoryColor }]}>
                      {getCategoryLabel(event.category)}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${statusColor}25` }]}>
                    <View style={[styles.badgeDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {event.status}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDescription} numberOfLines={2}>
                {event.description}
              </Text>

              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <View style={[styles.detailIconContainer, { backgroundColor: `${colors.accentTeal}20` }]}>
                    <Ionicons name="calendar-outline" size={14} color={colors.accentTeal} />
                  </View>
                  <Text style={styles.detailText}>
                    {formatEventDate(event.startDate)}
                    {startDate.toDateString() !== endDate.toDateString() && 
                      ` - ${formatEventDate(event.endDate)}`}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <View style={[styles.detailIconContainer, { backgroundColor: `${colors.accentPurple}20` }]}>
                    <Ionicons name="location-outline" size={14} color={colors.accentPurple} />
                  </View>
                  <Text style={styles.detailText} numberOfLines={1}>
                    {event.location}
                  </Text>
                </View>

                {daysUntil !== null && daysUntil >= 0 && (
                  <View style={styles.detailRow}>
                    <View style={[styles.detailIconContainer, { backgroundColor: `${colors.accentGreen}20` }]}>
                      <Ionicons name="time-outline" size={14} color={colors.accentGreen} />
                    </View>
                    <Text style={[styles.detailText, { color: colors.accentGreen, fontWeight: '600' }]}>
                      {daysUntil === 0 ? 'Today' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''} until event`}
                    </Text>
                  </View>
                )}

                {event.registrationRequired && (
                  <View style={styles.detailRow}>
                    <View style={[styles.detailIconContainer, { backgroundColor: `${colors.accentYellow}20` }]}>
                      <Ionicons name="person-add-outline" size={14} color={colors.accentYellow} />
                    </View>
                    <Text style={[styles.detailText, { color: colors.accentYellow, fontWeight: '600' }]}>
                      Registration Required
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </BlurView>
    );
  };

  const screenOpacity = useFadeIn({ duration: 350 });

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <LinearGradient
        colors={[colors.background, colors.surface, colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <BlurView intensity={80} tint="dark" style={styles.backButtonBlur}>
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Events</Text>
            <Text style={styles.headerSubtitle}>
              {activeTab === 'upcoming' ? `${upcomingEvents.length} upcoming` : `${pastEvents.length} past`}
            </Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
            onPress={() => setActiveTab('upcoming')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={activeTab === 'upcoming' 
                ? [colors.accentTeal, colors.accentGreen]
                : ['transparent', 'transparent']}
              style={styles.tabGradient}
            >
              <Ionicons 
                name="calendar" 
                size={18} 
                color={activeTab === 'upcoming' ? '#FFFFFF' : colors.textSecondary} 
                style={styles.tabIcon}
              />
              <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
                Upcoming
              </Text>
              <View style={[styles.tabBadge, activeTab === 'upcoming' && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === 'upcoming' && styles.tabBadgeTextActive]}>
                  {upcomingEvents.length}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.tabActive]}
            onPress={() => setActiveTab('past')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={activeTab === 'past' 
                ? [colors.accentTeal, colors.accentGreen]
                : ['transparent', 'transparent']}
              style={styles.tabGradient}
            >
              <Ionicons 
                name="archive" 
                size={18} 
                color={activeTab === 'past' ? '#FFFFFF' : colors.textSecondary} 
                style={styles.tabIcon}
              />
              <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
                Past
              </Text>
              <View style={[styles.tabBadge, activeTab === 'past' && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === 'past' && styles.tabBadgeTextActive]}>
                  {pastEvents.length}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Events List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={colors.accentTeal}
              colors={[colors.accentTeal]}
            />
          }
        >
          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={colors.accentTeal} />
              <Text style={styles.emptyText}>Loading events...</Text>
            </View>
          ) : activeTab === 'upcoming' ? (
            upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, i) => (
                <AnimatedEventCardWrapper
                  key={event.id}
                  index={i}
                  onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
                >
                  {renderEventCardContent(event)}
                </AnimatedEventCardWrapper>
              ))
            ) : (
              <View style={styles.emptyState}>
                <LinearGradient
                  colors={[`${colors.accentTeal}20`, `${colors.accentGreen}10`]}
                  style={styles.emptyIconContainer}
                >
                  <Ionicons name="calendar-outline" size={64} color={colors.accentTeal} />
                </LinearGradient>
                <Text style={styles.emptyText}>No upcoming events</Text>
                <Text style={styles.emptySubtext}>
                  Check back later for new events
                </Text>
              </View>
            )
          ) : pastEvents.length > 0 ? (
            pastEvents.map((event, i) => (
              <AnimatedEventCardWrapper
                key={event.id}
                index={i}
                onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
              >
                {renderEventCardContent(event)}
              </AnimatedEventCardWrapper>
            ))
          ) : (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={[`${colors.accentTeal}20`, `${colors.accentGreen}10`]}
                style={styles.emptyIconContainer}
              >
                <Ionicons name="archive-outline" size={64} color={colors.accentTeal} />
              </LinearGradient>
              <Text style={styles.emptyText}>No past events</Text>
              <Text style={styles.emptySubtext}>
                Past events will appear here
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  backButtonBlur: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  headerRight: {
    width: 44,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  tab: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabActive: {
    elevation: 4,
    shadowOpacity: 0.2,
  },
  tabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  tabIcon: {
    marginRight: 4,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginLeft: 4,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  eventCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  blurCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventImagePlaceholder: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    padding: 20,
  },
  eventHeader: {
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
    lineHeight: 28,
    letterSpacing: 0.3,
  },
  eventDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  eventDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
    letterSpacing: 0.3,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },
});

