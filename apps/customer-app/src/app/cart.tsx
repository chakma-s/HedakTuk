import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';;
import VegBadge from '@/components/VegBadge';
import QuantitySelector from '@/components/QuantitySelector';
import { useCartStore } from '@/stores/cartStore';

export default function CartScreen() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const router = useRouter();
  const { items, restaurantName, clearCart, updateQuantity, removeItem, getSubtotal, getDeliveryFee, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add items from a restaurant to get started</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => router.back()}>
            <Text style={styles.browseBtnText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Cart</Text>
          <Text style={styles.headerSub}>{restaurantName}</Text>
        </View>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Cart Items */}
        <View style={styles.itemsCard}>
          {items.map((ci) => (
            <View key={ci.menuItem.id} style={styles.itemRow}>
              <VegBadge isVeg={ci.menuItem.isVeg} size={14} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{ci.menuItem.name}</Text>
                <Text style={styles.itemPrice}>₹{ci.menuItem.price * ci.quantity}</Text>
              </View>
              <QuantitySelector
                quantity={ci.quantity}
                onIncrease={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)}
                onDecrease={() => updateQuantity(ci.menuItem.id, ci.quantity - 1)}
                compact
              />
            </View>
          ))}
        </View>

        {/* Coupon */}
        <TouchableOpacity style={styles.couponRow}>
          <Ionicons name="pricetag-outline" size={18} color={Colors.info} />
          <Text style={styles.couponText}>Apply Coupon</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* Delivery Address */}
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressLabel}>Deliver to</Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressRow}>
            <Ionicons name="location" size={18} color={Colors.primary} />
            <View>
              <Text style={styles.addressTitle}>Home</Text>
              <Text style={styles.addressText}>Koramangala 5th Block, Bangalore</Text>
            </View>
          </View>
        </View>

        {/* Bill Details */}
        <View style={styles.billCard}>
          <Text style={styles.billTitle}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>₹{deliveryFee}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform Fee</Text>
            <Text style={styles.billValue}>₹5</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST & Charges</Text>
            <Text style={styles.billValue}>₹{Math.round(subtotal * 0.05)}</Text>
          </View>
          <View style={[styles.billRow, styles.billTotal]}>
            <Text style={styles.totalLabel}>To Pay</Text>
            <Text style={styles.totalValue}>₹{total + 5 + Math.round(subtotal * 0.05)}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Place Order */}
      <View style={styles.checkoutWrap}>
        <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.9} onPress={() => router.push('/checkout')}>
          <View>
            <Text style={styles.checkoutTotal}>₹{total + 5 + Math.round(subtotal * 0.05)}</Text>
            <Text style={styles.checkoutBreakdown}>TOTAL</Text>
          </View>
          <View style={styles.checkoutRight}>
            <Text style={styles.checkoutText}>Place Order</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },

  // Empty
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 8 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center' },
  browseBtn: { marginTop: 24, backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 12, borderRadius: Radius.sm },
  browseBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: FontWeight.bold },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerCenter: { flex: 1, marginLeft: Spacing.md },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  headerSub: { fontSize: FontSize.sm, color: Colors.textSecondary },
  clearText: { fontSize: FontSize.sm, color: Colors.danger, fontWeight: FontWeight.semibold },

  // Items
  itemsCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.lg,
  },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: FontSize.md, color: Colors.text, fontWeight: FontWeight.medium },
  itemPrice: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },

  // Coupon
  couponRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.md,
  },
  couponText: { flex: 1, fontSize: FontSize.md, color: Colors.info, fontWeight: FontWeight.semibold },

  // Address
  addressCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.md,
  },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  addressLabel: { fontSize: FontSize.sm, color: Colors.textTertiary, fontWeight: FontWeight.semibold },
  changeText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addressTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  addressText: { fontSize: FontSize.sm, color: Colors.textSecondary },

  // Bill
  billCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.md,
  },
  billTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  billLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  billValue: { fontSize: FontSize.sm, color: Colors.textSecondary },
  billTotal: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10, marginTop: 6 },
  totalLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  totalValue: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: Colors.text },

  // Checkout
  checkoutWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.success, borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl, paddingVertical: 14,
    ...Shadows.card,
  },
  checkoutTotal: { color: Colors.white, fontSize: FontSize.lg, fontWeight: FontWeight.extrabold },
  checkoutBreakdown: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: FontWeight.semibold, letterSpacing: 1, marginTop: 1 },
  checkoutRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkoutText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: FontWeight.bold },
});
