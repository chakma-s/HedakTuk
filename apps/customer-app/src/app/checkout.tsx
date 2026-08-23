import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';
import { useCartStore } from '@/stores/cartStore';
import { fetchAPI } from '@/api';

const DEFAULT_ADDRESSES = [
  { id: 'a1', label: 'Home', street: '45 MG Road, Koramangala 5th Block', city: 'Bangalore', landmark: 'Near Police Station' },
  { id: 'a2', label: 'Work', street: 'WeWork Galaxy, 43 Residency Road', city: 'Bangalore', landmark: 'Opposite Shell Fuel' },
];

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', icon: 'phone-portrait-outline' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
  { id: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' },
];

export default function CheckoutScreen() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const router = useRouter();
  const { getTotal, getSubtotal, items, clearCart, restaurantId } = useCartStore();
  
  const [addresses, setAddresses] = useState<any[]>(DEFAULT_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState(DEFAULT_ADDRESSES[0].id);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayMock, setShowRazorpayMock] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    loadUserAddresses();
  }, []);

  const loadUserAddresses = async () => {
    try {
      const res = await fetchAPI('/users/me/addresses');
      if (Array.isArray(res) && res.length > 0) {
        setAddresses(res);
        setSelectedAddress(res[0].id);
      }
    } catch (err) {
      console.log('Using default mock addresses');
    }
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const sub = getSubtotal();
    if (code === 'WELCOME50') {
      const d = Math.min(50, sub);
      setDiscount(d);
      setAppliedCoupon(code);
      Alert.alert('Coupon Applied', '₹50 flat discount applied successfully!');
    } else if (code === 'SAVE20') {
      const d = Math.round(sub * 0.2);
      setDiscount(d);
      setAppliedCoupon(code);
      Alert.alert('Coupon Applied', '20% discount applied successfully!');
    } else if (code === 'FESTIVE100') {
      if (sub < 300) {
        Alert.alert('Invalid Coupon', 'Minimum order amount for FESTIVE100 is ₹300');
        return;
      }
      const d = Math.min(100, sub);
      setDiscount(d);
      setAppliedCoupon(code);
      Alert.alert('Coupon Applied', '₹100 discount applied!');
    } else {
      Alert.alert('Invalid Coupon', 'Coupon code is invalid or expired. Try "WELCOME50" or "SAVE20".');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
  };

  const subtotal = getSubtotal();
  const taxesAndFees = Math.round(subtotal * 0.05) + 5; // tax + platform fee
  const deliveryFee = 30;
  const rawTotal = subtotal + taxesAndFees + deliveryFee;
  const finalTotal = Math.max(0, rawTotal - discount);

  const executeOrder = async () => {
    setIsProcessing(true);
    try {
      const chosenAddr = addresses.find((a) => a.id === selectedAddress) || addresses[0];
      const orderPayload = {
        restaurantId: restaurantId,
        paymentMethod: selectedPayment === 'cod' ? 'COD' : (selectedPayment === 'upi' ? 'UPI' : 'CARD'),
        couponCode: appliedCoupon || undefined,
        items: items.map(item => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          quantity: item.quantity,
          unitPrice: item.menuItem.price,
          isVeg: item.menuItem.isVeg
        })),
        deliveryAddress: {
          label: chosenAddr.label || chosenAddr.type || 'Home',
          fullAddress: `${chosenAddr.street || ''}, ${chosenAddr.city || ''}`.trim(),
          latitude: 12.9716,
          longitude: 77.5946
        }
      };

      const res = await fetchAPI('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });
      
      clearCart();
      router.replace(`/track/${res.id}`);
    } catch (err: any) {
      console.error('Checkout failed:', err);
      Alert.alert('Checkout Failed', err.message || 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePlaceOrderClick = () => {
    if (selectedPayment !== 'cod') {
      setShowRazorpayMock(true);
    } else {
      executeOrder();
    }
  };

  const simulatePaymentSuccess = () => {
    setShowRazorpayMock(false);
    executeOrder();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Delivery Address */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TouchableOpacity onPress={() => router.push('/addresses')}>
            <Text style={styles.manageText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {addresses.map((addr) => (
          <TouchableOpacity 
            key={addr.id} 
            style={[styles.card, selectedAddress === addr.id && styles.cardActive]}
            onPress={() => setSelectedAddress(addr.id)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Ionicons 
                name={addr.label === 'Work' ? 'briefcase' : 'home'} 
                size={20} 
                color={selectedAddress === addr.id ? Colors.primary : Colors.textTertiary} 
              />
              <Text style={styles.cardTitle}>{addr.label || addr.type || 'Address'}</Text>
              <View style={styles.radio}>
                {selectedAddress === addr.id && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.cardText}>
              {addr.street ? `${addr.street}, ${addr.city}` : addr.text}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Coupons & Offers */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Offers & Coupons</Text>
        <View style={styles.couponBox}>
          {appliedCoupon ? (
            <View style={styles.appliedCouponRow}>
              <View style={styles.appliedLeft}>
                <Ionicons name="pricetag" size={18} color={Colors.success} />
                <div>
                  <Text style={styles.appliedCode}>{appliedCoupon}</Text>
                  <Text style={styles.appliedSavings}>You saved ₹{discount}!</Text>
                </div>
              </View>
              <TouchableOpacity onPress={handleRemoveCoupon}>
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponInputRow}>
              <Ionicons name="pricetag-outline" size={18} color={Colors.textTertiary} style={{ marginLeft: 10 }} />
              <TextInput
                style={styles.couponInput}
                placeholder="Enter coupon (e.g. WELCOME50)"
                placeholderTextColor={Colors.textTertiary}
                autoCapitalize="characters"
                value={couponCode}
                onChangeText={setCouponCode}
              />
              <TouchableOpacity style={styles.applyBtn} onPress={handleApplyCoupon}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Payment Method</Text>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity 
            key={method.id} 
            style={[styles.card, selectedPayment === method.id && styles.cardActive]}
            onPress={() => setSelectedPayment(method.id)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Ionicons name={method.icon as any} size={20} color={selectedPayment === method.id ? Colors.primary : Colors.textTertiary} />
              <Text style={styles.cardTitle}>{method.label}</Text>
              <View style={styles.radio}>
                {selectedPayment === method.id && <View style={styles.radioInner} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Detailed Bill Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Bill Details</Text>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total ({items.length} items)</Text>
            <Text style={styles.billValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>₹{deliveryFee}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Taxes & Platform Charges</Text>
            <Text style={styles.billValue}>₹{taxesAndFees}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: Colors.success, fontWeight: FontWeight.bold }]}>
                Coupon Discount ({appliedCoupon})
              </Text>
              <Text style={[styles.billValue, { color: Colors.success, fontWeight: FontWeight.bold }]}>
                -₹{discount}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>To Pay</Text>
            <Text style={styles.totalValue}>₹{finalTotal}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Place Order Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.placeBtn, isProcessing && styles.placeBtnDisabled]} 
          onPress={handlePlaceOrderClick}
          disabled={isProcessing}
        >
          <Text style={styles.placeBtnText}>
            {isProcessing ? 'Processing...' : `Pay ₹${finalTotal} & Place Order`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Razorpay Mock Modal */}
      <Modal visible={showRazorpayMock} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.razorpayContainer}>
            <View style={styles.razorpayHeader}>
              <Text style={styles.razorpayTitle}>Razorpay</Text>
              <TouchableOpacity onPress={() => setShowRazorpayMock(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.razorpayContent}>
              <Text style={styles.razorpayAmount}>₹{finalTotal}</Text>
              <Text style={styles.razorpayDesc}>Pay to HedakTuk Food Delivery</Text>
              
              <TouchableOpacity style={styles.razorpayBtn} onPress={simulatePaymentSuccess}>
                <Text style={styles.razorpayBtnText}>Simulate Success</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.razorpayBtn, {backgroundColor: '#ef4444', marginTop: 12}]} onPress={() => setShowRazorpayMock(false)}>
                <Text style={styles.razorpayBtnText}>Simulate Failure</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  scroll: { padding: Spacing.lg },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  manageText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md,
  },
  cardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryBg },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.borderAccent, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  cardText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.sm, paddingLeft: 30 },
  
  couponBox: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginTop: Spacing.sm,
  },
  couponInputRow: { flexDirection: 'row', alignItems: 'center' },
  couponInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: FontSize.sm, color: Colors.text },
  applyBtn: { paddingHorizontal: Spacing.lg, paddingVertical: 12, backgroundColor: Colors.primary },
  applyBtnText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  appliedCouponRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.md, backgroundColor: Colors.success + '15',
  },
  appliedLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  appliedCode: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.success },
  appliedSavings: { fontSize: FontSize.xs, color: Colors.textSecondary },
  removeCouponText: { color: Colors.danger, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  summaryCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.xl,
  },
  summaryTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  billLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  billValue: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.md, marginTop: Spacing.sm },
  totalLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  totalValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, paddingTop: Spacing.md,
    backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  placeBtn: {
    backgroundColor: Colors.success, paddingVertical: 16, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center', ...Shadows.card,
  },
  placeBtnDisabled: { opacity: 0.7 },
  placeBtnText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: FontWeight.bold },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  razorpayContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48 },
  razorpayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  razorpayTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a56db' },
  razorpayContent: { alignItems: 'center' },
  razorpayAmount: { fontSize: 32, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  razorpayDesc: { fontSize: 16, color: '#666', marginBottom: 32 },
  razorpayBtn: { backgroundColor: '#1a56db', width: '100%', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  razorpayBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

