import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/stores/themeStore';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { Ionicons } from '@expo/vector-icons';
import { fetchAPI } from '@/api';
import ThemeToggle from '@/components/ThemeToggle';

const { width } = Dimensions.get('window');

export default function DeliveryDashboard() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const router = useRouter();
  
  const { status, setStatus, activeOrder, todayEarnings, todayTrips, setActiveOrder } = useDeliveryStore();

  const toggleStatus = () => {
    setStatus(status === 'offline' ? 'online' : 'offline');
  };

  const [pendingOrders, setPendingOrders] = React.useState<any[]>([]);

  React.useEffect(() => {
    let interval: any;
    if (status === 'online' && !activeOrder) {
      interval = setInterval(async () => {
        try {
          const res = await fetchAPI('/orders/delivery/pending');
          if (res.data && res.data.length > 0) {
            setPendingOrders(res.data);
          } else {
            setPendingOrders([]);
          }
        } catch (err) {
          console.error(err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [status, activeOrder]);

  const viewPendingOrder = (order: any) => {
    setActiveOrder({
      id: order.id,
      restaurantName: order.restaurant.name,
      restaurantAddress: order.restaurant.address,
      customerName: order.user?.name || 'Customer',
      customerAddress: order.deliveryAddress?.fullAddress || 'Unknown',
      earning: order.deliveryFee,
      status: 'pending'
    });
    router.push('/order-request');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Rider!</Text>
          <Text style={styles.subtitle}>Ready for deliveries?</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThemeToggle />
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-circle" size={40} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Online/Offline Toggle */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: status === 'offline' ? Colors.danger : Colors.success }]} />
        <Text style={styles.statusText}>{status === 'offline' ? "YOU'RE OFFLINE" : "YOU'RE ONLINE"}</Text>
        
        <TouchableOpacity 
          activeOpacity={0.8}
          style={[styles.toggleBtn, { backgroundColor: status === 'offline' ? Colors.primary : Colors.danger }]}
          onPress={toggleStatus}
        >
          <Text style={styles.toggleText}>{status === 'offline' ? 'GO ONLINE' : 'GO OFFLINE'}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TODAY'S EARNINGS</Text>
          <Text style={styles.statValue}>₹{todayEarnings}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TRIPS COMPLETED</Text>
          <Text style={styles.statValue}>{todayTrips}</Text>
        </View>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <Ionicons name="map-outline" size={60} color={Colors.border} />
        <Text style={styles.mapText}>Map View</Text>
        
        {status === 'online' && !activeOrder && pendingOrders.length > 0 && (
          <TouchableOpacity style={styles.simulateBtn} onPress={() => viewPendingOrder(pendingOrders[0])}>
            <Text style={styles.simulateText}>{pendingOrders.length} New Orders! Tap to view</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Active Order Banner */}
      {activeOrder && (
        <TouchableOpacity style={styles.activeOrderBanner} onPress={() => router.push('/active-trip')}>
          <View style={styles.activeOrderInfo}>
            <Text style={styles.activeOrderTitle}>Active Delivery</Text>
            <Text style={styles.activeOrderDesc}>{activeOrder.restaurantName} → {activeOrder.customerAddress}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 40,
  },
  greeting: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  profileBtn: {},
  
  statusContainer: {
    alignItems: 'center', paddingVertical: 30,
    backgroundColor: Colors.surface, marginHorizontal: 20, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  statusIndicator: { width: 12, height: 12, borderRadius: 6, marginBottom: 10 },
  statusText: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 20, letterSpacing: 1 },
  toggleBtn: {
    paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30,
  },
  toggleText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  statsContainer: {
    flexDirection: 'row', marginHorizontal: 20, marginTop: 20, gap: 15,
  },
  statBox: {
    flex: 1, backgroundColor: Colors.surface, padding: 20, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  statLabel: { fontSize: 10, fontWeight: 'bold', color: Colors.textSecondary, marginBottom: 10, letterSpacing: 0.5 },
  statValue: { fontSize: 28, fontWeight: '900', color: Colors.text },

  mapContainer: {
    flex: 1, margin: 20, backgroundColor: Colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  mapText: { color: Colors.textSecondary, marginTop: 10, fontWeight: 'bold' },
  
  simulateBtn: {
    position: 'absolute', bottom: 20, backgroundColor: Colors.primary,
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
  },
  simulateText: { color: 'white', fontWeight: 'bold' },

  activeOrderBanner: {
    position: 'absolute', bottom: 20, left: 20, right: 20,
    backgroundColor: Colors.success, borderRadius: 12, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 5,
  },
  activeOrderTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  activeOrderDesc: { color: 'white', fontSize: 12, marginTop: 4, opacity: 0.9 },
  activeOrderInfo: { flex: 1 },
});
