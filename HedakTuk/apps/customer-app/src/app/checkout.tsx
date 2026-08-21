import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';
import { useCartStore } from '@/stores/cartStore';
import { fetchAPI } from '@/api';

const ADDRESSES = [
  { id: 'a1', type: 'Home', text: '45 MG Road, Koramangala 5th Block, Bangalore', icon: 'home' },
  { id: 'a2', type: 'Work', text: 'WeWork Galaxy, Residency Road, Bangalore', icon: 'briefcase' },
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
  
  const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0].id);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayMock, setShowRazorpayMock] = useState(false);

  const subtotal = getSubtotal();
  const total = getTotal() + 5 + Math.round(subtotal * 0.05); // including platform fee + tax

  const executeOrder = async () => {
    setIsProcessing(true);
    try {
      const orderPayload = {
        restaurantId: restaurantId,
        paymentMethod: selectedPayment === 'cod' ? 'COD' : (selectedPayment === 'upi' ? 'UPI' : 'CARD'),
        items: items.map(item => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          quantity: item.quantity,
          unitPrice: item.menuItem.price,
          isVeg: item.menuItem.isVeg
        })),
        deliveryAddress: {
          label: ADDRESSES.find(a => a.id === selectedAddress)?.type,
          fullAddress: ADDRESSES.find(a => a.id === selectedAddress)?.text,
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
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Failed to place order. Please try again.');
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
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        {ADDRESSES.map((addr) => (
          <TouchableOpacity 
            key={addr.id} 
            style={[styles.card, selectedAddress === addr.id && styles.cardActive]}
            onPress={() => setSelectedAddress(addr.id)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Ionicons name={addr.icon as any} size={20} color={selectedAddress === addr.id ? Colors.primary : Colors.textTertiary} />
              <Text style={styles.cardTitle}>{addr.type}</Text>
              <View style={styles.radio}>
                {selectedAddress === addr.id && <View style={styles.radioInner} />}
              </View>
            </View>
            <Text style={styles.cardText}>{addr.text}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={18} color={Colors.primary} />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>

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

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Text style={styles.summaryText}>{items.length} items to be delivered.</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total to Pay</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.placeBtn, isProcessing && styles.placeBtnDisabled]} 
          onPress={handlePlaceOrderClick}
          disabled={isProcessing}
        >
          <Text style={styles.placeBtnText}>
            {isProcessing ? 'Processing...' : `Pay ₹${total} & Place Order`}
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
              <Text style={styles.razorpayAmount}>₹{total}</Text>
              <Text style={styles.razorpayDesc}>Pay to HedakTuk</Text>
              
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
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  
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
  
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: Spacing.sm },
  addBtnText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: FontWeight.semibold },

  summaryCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.xl,
  },
  summaryTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 4 },
  summaryText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.md },
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
