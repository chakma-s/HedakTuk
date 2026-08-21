import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';
import RatingBadge from '@/components/RatingBadge';
import MenuItemCard from '@/components/MenuItemCard';
import { useCartStore } from '@/stores/cartStore';
import { fetchAPI } from '@/api';

const { width } = Dimensions.get('window');

export default function RestaurantDetailScreen() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const cartStore = useCartStore();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const data = await fetchAPI(`/restaurants/${id}`);
        setRestaurant(data);
      } catch (err) {
        console.error('Failed to fetch restaurant:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurant();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    );
  }

  const cartItemCount = cartStore.getItemCount();
  const cartTotal = cartStore.getTotal();
  const isCartFromThis = cartStore.restaurantId === restaurant.id;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: restaurant.coverImageUrl }} style={styles.heroImage} />
          <View style={styles.coverOverlay} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.cuisines}>{restaurant.cuisines.join(' • ')}</Text>
          <Text style={styles.address}>{restaurant.address}</Text>

          <View style={styles.metaRow}>
            <RatingBadge rating={restaurant.rating} totalRatings={restaurant.totalRatings} size="md" />
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{restaurant.avgDeliveryTimeMinutes} min</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="bicycle-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>₹{restaurant.deliveryFee} delivery</Text>
            </View>
          </View>

          {/* Offers strip */}
          <View style={styles.offersStrip}>
            <View style={styles.offerTag}>
              <Ionicons name="pricetag" size={12} color={Colors.info} />
              <Text style={styles.offerText}>20% off up to ₹120</Text>
            </View>
            <View style={styles.offerTag}>
              <Ionicons name="pricetag" size={12} color={Colors.success} />
              <Text style={styles.offerText}>Free delivery above ₹199</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <View style={styles.menuHeaderLine} />
            <Text style={styles.menuTitle}>MENU</Text>
            <View style={styles.menuHeaderLine} />
          </View>

          {restaurant.categories?.map((category: any) => (
            <View key={category.id} style={styles.category}>
              <Text style={styles.categoryName}>{category.name} ({category.items.length})</Text>
              {category.items.map((item: any) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  quantity={cartStore.getItemQuantity(item.id)}
                  onAdd={() => cartStore.addItem(restaurant.id, restaurant.name, item)}
                  onRemove={() => cartStore.updateQuantity(item.id, cartStore.getItemQuantity(item.id) - 1)}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={{ height: cartItemCount > 0 ? 120 : 40 }} />
      </ScrollView>

      {/* Cart Bar */}
      {cartItemCount > 0 && (
        <View style={styles.cartBarWrap}>
          <TouchableOpacity style={styles.cartBar} onPress={() => router.push('/cart')} activeOpacity={0.9}>
            <View>
              <Text style={styles.cartCount}>{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}</Text>
              {!isCartFromThis && <Text style={styles.cartFrom}>from {cartStore.restaurantName}</Text>}
            </View>
            <View style={styles.cartRight}>
              <Text style={styles.cartTotal}>₹{cartTotal}</Text>
              <Text style={styles.cartAction}>VIEW CART →</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  errorText: { color: Colors.textSecondary, fontSize: FontSize.lg },

  // Hero
  heroWrap: { height: 220, position: 'relative' },
  heroImage: { width: '100%', height: '100%', backgroundColor: Colors.surfaceAlt },
  coverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  backBtn: { position: 'absolute', top: 50, left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  shareBtn: { position: 'absolute', top: 50, right: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },

  // Info
  infoSection: { padding: Spacing.lg },
  name: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text, marginBottom: 4 },
  cuisines: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: 2 },
  address: { fontSize: FontSize.sm, color: Colors.textTertiary, marginBottom: Spacing.md },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.md },
  metaDivider: { width: 1, height: 16, backgroundColor: Colors.border },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSize.sm, color: Colors.textSecondary },

  offersStrip: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  offerTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surface, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border,
  },
  offerText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: FontWeight.medium },

  // Menu
  menuSection: { paddingHorizontal: Spacing.lg },
  menuHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: Spacing.xl },
  menuHeaderLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  menuTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textTertiary, letterSpacing: 2 },
  category: { marginBottom: Spacing.xxl },
  categoryName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm },

  // Cart bar
  cartBarWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl,
  },
  cartBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.success, borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    ...Shadows.card,
  },
  cartCount: { color: Colors.white, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  cartFrom: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs },
  cartRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  cartTotal: { color: Colors.white, fontSize: FontSize.lg, fontWeight: FontWeight.extrabold },
  cartAction: { color: Colors.white, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
});
