import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '@/stores/cartStore';
import { Spacing, Radius, FontSize, FontWeight, Shadows } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';;

export default function CartBar() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const itemCount = useCartStore((state) => state.getItemCount());
  const subtotal = useCartStore((state) => state.getSubtotal());
  const restaurantName = useCartStore((state) => state.restaurantName);

  if (itemCount === 0) return null;

  // The tab bar is usually 65px + bottom inset
  const bottomPosition = 65 + Math.max(insets.bottom, 10) + 15;

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container, 
        { bottom: bottomPosition },
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
      ]} 
      onPress={() => router.push('/cart')}
    >
      <View style={styles.content}>
        <View style={styles.leftInfo}>
          <Text style={styles.itemCountText}>
            {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
          </Text>
          <Text style={styles.divider}>•</Text>
          <Text style={styles.priceText}>
            ${subtotal.toFixed(2)}
          </Text>
        </View>
        {restaurantName && (
          <Text style={styles.restaurantText} numberOfLines={1}>
            From {restaurantName}
          </Text>
        )}
      </View>
      <View style={styles.button}>
        <Text style={styles.buttonText}>View Cart</Text>
        <Ionicons name="cart" size={18} color={Colors.white} />
      </View>
    </Pressable>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    ...Shadows.card,
  },
  content: {
    flex: 1,
    marginRight: Spacing.md,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  itemCountText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  divider: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FontSize.sm,
  },
  priceText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  restaurantText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSize.xs,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
