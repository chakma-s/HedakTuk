import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';
import { fetchAPI } from '@/api';

export default function OrdersScreen() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    // In a real app we'd use WebSockets, for MVP we poll every 10s
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetchAPI('/orders');
      if (res && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
  const pastOrders = orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));

  if (loading && orders.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>My Orders</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Active Orders */}
        {activeOrders.map((order) => (
          <View key={order.id} style={styles.activeOrder}>
            <View style={styles.activeHeader}>
              <View style={styles.activeDot} />
              <Text style={styles.activeLabel}>Live Order</Text>
            </View>
            <Text style={styles.activeRestaurant}>{order.restaurant?.name || 'Restaurant'}</Text>
            <Text style={styles.activeItems} numberOfLines={1}>
              {order.items?.map((i: any) => `${i.name} x${i.quantity}`).join(', ')}
            </Text>
            <View style={styles.activeStatusRow}>
              <Text style={styles.activeStatus}>{order.status}</Text>
              <Text style={styles.activeEta}>ETA: {order.estimatedDeliveryMinutes || 30} min</Text>
            </View>
            <View style={styles.progressBarWrap}>
              <View style={[
                styles.progressBar, 
                { width: order.status === 'PLACED' ? '10%' : 
                         order.status === 'CONFIRMED' ? '30%' : 
                         order.status === 'PREPARING' ? '50%' : 
                         order.status === 'READY' ? '70%' : 
                         order.status === 'OUT_FOR_DELIVERY' ? '90%' : '100%' }
              ]} />
            </View>
            <TouchableOpacity style={styles.trackBtn}>
              <Ionicons name="map-outline" size={16} color={Colors.primary} />
              <Text style={styles.trackText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Past Orders */}
        <Text style={styles.sectionTitle}>Past Orders</Text>
        {pastOrders.length === 0 && <Text style={{color: Colors.textTertiary}}>No past orders found.</Text>}
        {pastOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderRestaurant}>{order.restaurant?.name || 'Restaurant'}</Text>
              <Text style={[styles.orderStatus, { color: order.status === 'CANCELLED' ? Colors.danger : Colors.success }]}>{order.status}</Text>
            </View>
            <Text style={styles.orderItems} numberOfLines={1}>
               {order.items?.map((i: any) => `${i.name} x${i.quantity}`).join(', ')}
            </Text>
            <View style={styles.orderFooter}>
              <Text style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.orderTotal}>₹{order.total}</Text>
            </View>
            <View style={styles.orderActions}>
              <TouchableOpacity style={styles.reorderBtn}>
                <Ionicons name="refresh" size={14} color={Colors.primary} />
                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.helpBtn}>
                <Text style={styles.helpText}>Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  header: {
    fontSize: FontSize.xxl,
    fontFamily: FontWeight.Bold,
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  scroll: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontWeight.Bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.xl,
  },
  activeOrder: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    ...Shadows.md,
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: Spacing.sm,
  },
  activeLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontWeight.SemiBold,
    color: Colors.primary,
  },
  activeRestaurant: {
    fontSize: FontSize.lg,
    fontFamily: FontWeight.Bold,
    color: Colors.text,
    marginBottom: 4,
  },
  activeItems: {
    fontSize: FontSize.sm,
    fontFamily: FontWeight.Regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  activeStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  activeStatus: {
    fontSize: FontSize.md,
    fontFamily: FontWeight.Bold,
    color: Colors.text,
  },
  activeEta: {
    fontSize: FontSize.sm,
    fontFamily: FontWeight.Medium,
    color: Colors.textSecondary,
  },
  progressBarWrap: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary + '15',
    borderRadius: Radius.md,
  },
  trackText: {
    fontSize: FontSize.md,
    fontFamily: FontWeight.SemiBold,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  orderRestaurant: {
    fontSize: FontSize.md,
    fontFamily: FontWeight.Bold,
    color: Colors.text,
  },
  orderStatus: {
    fontSize: FontSize.sm,
    fontFamily: FontWeight.SemiBold,
  },
  orderItems: {
    fontSize: FontSize.sm,
    fontFamily: FontWeight.Regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  orderDate: {
    fontSize: FontSize.sm,
    fontFamily: FontWeight.Regular,
    color: Colors.textTertiary,
  },
  orderTotal: {
    fontSize: FontSize.md,
    fontFamily: FontWeight.SemiBold,
    color: Colors.text,
  },
  orderActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  reorderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary + '15',
    borderRadius: Radius.md,
  },
  reorderText: {
    fontSize: FontSize.sm,
    fontFamily: FontWeight.SemiBold,
    color: Colors.primary,
    marginLeft: 4,
  },
  helpBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
  },
  helpText: {
    fontSize: FontSize.sm,
    fontFamily: FontWeight.SemiBold,
    color: Colors.text,
  },
});
