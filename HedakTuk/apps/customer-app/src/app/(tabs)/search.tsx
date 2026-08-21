import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';
import RestaurantCard from '@/components/RestaurantCard';
import { fetchAPI } from '@/api';

const RECENT_SEARCHES = ['Biryani', 'Pizza', 'Chinese', 'Coffee'];

export default function SearchScreen() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchRestaurants = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Query the real backend API instead of mock data
        const res = await fetchAPI(`/restaurants?search=${encodeURIComponent(query)}`);
        if (res && res.data) {
          setResults(res.data);
        } else {
            setResults([]);
        }
      } catch (err) {
        console.error('Failed to search restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search input
    const delayDebounceFn = setTimeout(() => {
      searchRestaurants();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Search Input */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color={Colors.textTertiary} />
          <TextInput
            style={styles.input}
            placeholder="Search restaurants, cuisines, dishes..."
            placeholderTextColor={Colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {query.length === 0 ? (
          <>
            {/* Recent Searches */}
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {RECENT_SEARCHES.map((s) => (
              <TouchableOpacity key={s} style={styles.recentItem} onPress={() => setQuery(s)}>
                <Ionicons name="time-outline" size={18} color={Colors.textTertiary} />
                <Text style={styles.recentText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.resultsWrap}>
            <Text style={styles.resultsCount}>
              {loading ? 'Searching...' : `${results.length} results found for "${query}"`}
            </Text>
            
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
            ) : (
                results.map((r) => (
                <RestaurantCard
                    key={r.id}
                    restaurant={r}
                    onPress={() => router.push(`/restaurant/${r.id}`)}
                />
                ))
            )}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.lg,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: Spacing.sm,
    fontSize: FontSize.md,
    fontFamily: FontWeight.Medium,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontWeight.Bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  recentText: {
    fontSize: FontSize.md,
    fontFamily: FontWeight.Medium,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  cuisineItem: {
    width: '47%',
    aspectRatio: 1.5,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cuisineIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  cuisineName: {
    fontSize: FontSize.sm,
    fontFamily: FontWeight.SemiBold,
    color: Colors.text,
  },
  resultsWrap: {
    marginTop: Spacing.sm,
  },
  resultsCount: {
    fontSize: FontSize.sm,
    fontFamily: FontWeight.Medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
});
