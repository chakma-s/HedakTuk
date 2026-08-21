import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';
import ThemeToggle from '@/components/ThemeToggle';
import RestaurantCard from '@/components/RestaurantCard';
import { CUISINE_CATEGORIES, BANNERS } from '@/data/mockRestaurants';
import { fetchAPI } from '@/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const res = await fetchAPI('/restaurants');
        setRestaurants(res.data);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, []);

  const filteredRestaurants = activeCategory === 'all'
    ? restaurants
    : restaurants.filter(r =>
        r.cuisines.some((c: string) => c.toLowerCase().includes(activeCategory))
      );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Sticky Header */}
      <View style={styles.headerBar}>
        {/* Left: Location (constrained width) */}
        <TouchableOpacity style={styles.location}>
          <Ionicons name="location" size={20} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <View style={styles.locationTitleRow}>
              <Text style={styles.locationTitle}>Home</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.text} />
            </View>
            <Text style={styles.locationAddress} numberOfLines={1}>Koramangala 5th Block, Bangalore</Text>
          </View>
        </TouchableOpacity>

        {/* Center: Logo */}
        <View style={styles.logoContainer} pointerEvents="none">
          <Text style={styles.logoText}>HEDAKTUK</Text>
        </View>

        {/* Right: Actions */}
        <View style={styles.headerActions}>
          <ThemeToggle />
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="person-circle-outline" size={32} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(tabs)/search')} activeOpacity={0.7}>
          <Ionicons name="search" size={18} color={Colors.textTertiary} />
          <Text style={styles.searchPlaceholder}>Search for restaurants, dishes...</Text>
        </TouchableOpacity>

        {/* Banners */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.banners} contentContainerStyle={styles.bannersContent}>
          {BANNERS.map((b) => (
            <TouchableOpacity key={b.id} style={[styles.banner, { backgroundColor: b.color + '18' }]} activeOpacity={0.8}>
              <View>
                <Text style={[styles.bannerTitle, { color: b.color }]}>{b.title}</Text>
                <Text style={styles.bannerSubtitle}>{b.subtitle}</Text>
              </View>
              <Text style={styles.bannerEmoji}>{b.emoji}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cuisine Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories} contentContainerStyle={styles.categoriesContent}>
          {CUISINE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, activeCategory === cat.id && styles.chipActive]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipEmoji}>{cat.emoji}</Text>
              <Text style={[styles.chipLabel, activeCategory === cat.id && styles.chipLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategory === 'all' ? '🔥 Popular Near You' : `${CUISINE_CATEGORIES.find(c => c.id === activeCategory)?.emoji} ${CUISINE_CATEGORIES.find(c => c.id === activeCategory)?.label}`}
          </Text>
          <Text style={styles.sectionCount}>{filteredRestaurants.length} restaurants</Text>
        </View>

        {/* Restaurant Cards */}
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={() => router.push(`/restaurant/${restaurant.id}`)}
          />
        ))}

        {filteredRestaurants.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyText}>No restaurants found for this cuisine</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },

  // Header
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
  },
  location: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, zIndex: 2 },
  locationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  locationAddress: { fontSize: FontSize.xs, color: Colors.textSecondary, maxWidth: 140 },
  
  logoContainer: {
    position: 'absolute', left: 0, right: 0,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
  logoText: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: Colors.primary, 
    letterSpacing: -0.5,
    textTransform: 'uppercase'
  },
  
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 2 },
  profileBtn: { padding: 4 },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  searchPlaceholder: { color: Colors.textTertiary, fontSize: FontSize.md },

  // Banners
  banners: { marginBottom: Spacing.lg },
  bannersContent: { gap: 10 },
  banner: {
    width: width * 0.7, borderRadius: Radius.md,
    padding: Spacing.lg, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  bannerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold },
  bannerSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  bannerEmoji: { fontSize: 36 },

  // Categories
  categories: { marginBottom: Spacing.xl },
  categoriesContent: { gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primaryBg,
    borderColor: Colors.primary,
  },
  chipEmoji: { fontSize: 16 },
  chipLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  chipLabelActive: { color: Colors.primary, fontWeight: FontWeight.semibold },

  // Section
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  sectionCount: { fontSize: FontSize.sm, color: Colors.textTertiary },

  // Empty
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary },
});
