import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/theme';
import { api } from '../services/api';
import { useSlideUpFadeIn } from '../hooks/useAnimations';

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

interface EventDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  category: string;
  status: string;
  maxAttendees?: number;
  registrationRequired: boolean;
}

export default function EventDetailScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { opacity, translateY } = useSlideUpFadeIn({ delay: 80, duration: 400, distance: 20 });

  const loadEvent = async () => {
    try {
      const data = await api.getEvent(eventId);
      setEvent({
        id: data.id,
        title: data.title,
        description: data.description || '',
        location: data.location || '',
        startDate: data.startDate,
        endDate: data.endDate,
        imageUrl: data.imageUrl,
        category: data.category || 'OTHER',
        status: data.status || 'UPCOMING',
        maxAttendees: data.maxAttendees,
        registrationRequired: data.registrationRequired || false,
      });
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvent();
  };

  if (loading && !event) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentTeal} />
        <Text style={styles.loadingText}>Loading event...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.errorText}>Event not found</Text>
        <TouchableOpacity style={styles.errorBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const categoryColor = { CONFERENCE: '#3B82F6', SEMINAR: '#10B981', WORKSHOP: '#F59E0B', CELEBRATION: '#EC4899', OTHER: '#6B7280' }[event.category] || '#6B7280';

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.gradientWrap, { opacity, transform: [{ translateY }] }]}>
      <LinearGradient
        colors={[colors.background, colors.surface, colors.background]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accentTeal} />
          }
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <BlurView intensity={80} tint="dark" style={styles.backButtonBlur}>
                <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
              </BlurView>
            </TouchableOpacity>
          </View>

          {event.imageUrl ? (
            <Image source={{ uri: event.imageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={[`${categoryColor}80`, `${categoryColor}40`]}
              style={styles.heroPlaceholder}
            >
              <Ionicons name="calendar" size={64} color={categoryColor} />
            </LinearGradient>
          )}

          <View style={styles.content}>
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}25` }]}>
              <View style={[styles.badgeDot, { backgroundColor: categoryColor }]} />
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {event.category.charAt(0) + event.category.slice(1).toLowerCase()}
              </Text>
            </View>

            <Text style={styles.title}>{event.title}</Text>

            <View style={styles.detailRow}>
              <View style={[styles.iconWrap, { backgroundColor: `${colors.accentTeal}20` }]}>
                <Ionicons name="calendar-outline" size={18} color={colors.accentTeal} />
              </View>
              <Text style={styles.detailText}>
                {formatDate(startDate)}
                {startDate.toDateString() !== endDate.toDateString() && ` – ${formatDate(endDate)}`}
              </Text>
            </View>

            {event.location ? (
              <View style={styles.detailRow}>
                <View style={[styles.iconWrap, { backgroundColor: `${colors.accentPurple}20` }]}>
                  <Ionicons name="location-outline" size={18} color={colors.accentPurple} />
                </View>
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            ) : null}

            {event.registrationRequired && (
              <View style={styles.detailRow}>
                <View style={[styles.iconWrap, { backgroundColor: `${colors.accentYellow}20` }]}>
                  <Ionicons name="person-add-outline" size={18} color={colors.accentYellow} />
                </View>
                <Text style={[styles.detailText, { color: colors.accentYellow, fontWeight: '600' }]}>
                  Registration required
                </Text>
              </View>
            )}

            {event.maxAttendees != null && (
              <View style={styles.detailRow}>
                <View style={[styles.iconWrap, { backgroundColor: `${colors.accentGreen}20` }]}>
                  <Ionicons name="people-outline" size={18} color={colors.accentGreen} />
                </View>
                <Text style={styles.detailText}>Up to {event.maxAttendees} attendees</Text>
              </View>
            )}

            {event.description ? (
              <>
                <Text style={styles.sectionTitle}>About this event</Text>
                <Text style={styles.description}>{event.description}</Text>
              </>
            ) : null}
          </View>
        </ScrollView>
      </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  gradientWrap: { flex: 1 },
  gradient: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { fontSize: 16, color: colors.textSecondary, marginTop: 12 },
  errorText: { fontSize: 18, color: colors.textSecondary, marginTop: 12, textAlign: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  backButton: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  errorBackButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: colors.accentTeal, borderRadius: 12 },
  backButtonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  backButtonBlur: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  heroImage: { width: '100%', height: 220 },
  heroPlaceholder: { width: '100%', height: 220, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6, marginBottom: 12 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  categoryText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, marginBottom: 20, lineHeight: 32 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  detailText: { fontSize: 15, color: colors.textSecondary, flex: 1, lineHeight: 22 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 24, marginBottom: 10 },
  description: { fontSize: 16, color: colors.textSecondary, lineHeight: 24 },
});
