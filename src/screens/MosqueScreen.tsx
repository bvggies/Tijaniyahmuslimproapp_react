import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors } from '../utils/theme';

interface Mosque { id: string; name: string; address: string; distance: number; }

export default function MosqueScreen() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [city, setCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const GOOGLE_API_KEY = 'AIzaSyDYF4HFEefrlQMuswHoefQDU-DawWBatDI';

  const toRad = (value: number) => (value * Math.PI) / 180;
  const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const openMaps = (name: string, address: string) => {
    const query = encodeURIComponent(`${name} ${address}`);
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    }) as string;
    Linking.openURL(url);
  };

  useEffect(() => { (async () => {
    setError('');
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      const rev = await Location.reverseGeocodeAsync({ latitude, longitude });
      setCity(rev[0]?.city || '');

      // Google Places Nearby Search for mosques within 5km
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&keyword=mosque&opennow=true&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status !== 'OK' && !data.results) {
        throw new Error(data.error_message || data.status || 'Failed to load nearby mosques');
      }
      const list: Mosque[] = (data.results || []).slice(0, 20).map((r: any) => ({
        id: r.place_id,
        name: r.name,
        address: r.vicinity || r.formatted_address || '',
        distance: r.geometry?.location ? haversineKm(latitude, longitude, r.geometry.location.lat, r.geometry.location.lng) : 0,
      })).sort((a: Mosque, b: Mosque) => a.distance - b.distance);
      setMosques(list);
    } catch (e: any) {
      setError(e?.message || 'Unable to fetch nearby mosques');
    } finally {
      setLoading(false);
    }
  })(); }, []);

  const renderItem = ({ item }: { item: Mosque }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.distance}><Ionicons name="navigate" size={12} color={colors.textDark} /><Text style={styles.distanceText}>{item.distance.toFixed(1)} km</Text></View>
      </View>
      <Text style={styles.address}>{item.address}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btnSmall} onPress={() => openMaps(item.name, item.address)}>
          <Ionicons name="map" size={16} color={'#FFFFFF'} /><Text style={styles.btnSmallText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnSmall, { backgroundColor: colors.mintSurface }]}>
          <Ionicons name="navigate" size={16} color={colors.textDark} /><Text style={[styles.btnSmallText, { color: colors.textDark }]}>Route</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.surface, colors.background]} style={styles.header}>
        <Text style={styles.headerTitle}>Mosque Locator</Text>
        <Text style={styles.headerSubtitle}>Nearby in {city || 'your area'}</Text>
      </LinearGradient>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.accentTeal} />
          <Text style={{ color: colors.textSecondary, marginTop: 10 }}>Searching nearby mosques...</Text>
        </View>
      ) : (
        <FlatList
          data={mosques}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>{error || 'No mosques found nearby.'}</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.textPrimary },
  headerSubtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 4 },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  distance: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mintSurface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  distanceText: { color: colors.textDark, marginLeft: 4, fontSize: 12, fontWeight: '600' },
  address: { color: colors.textSecondary, marginTop: 6 },
  row: { flexDirection: 'row', marginTop: 10 },
  btnSmall: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accentTeal, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8 },
  btnSmallText: { color: '#FFFFFF', marginLeft: 6, fontWeight: '700' },
});
