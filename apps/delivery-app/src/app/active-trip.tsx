import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/stores/themeStore';
import { useDeliveryStore, RiderStatus, DeliveryOrder } from '@/stores/deliveryStore';
import { Ionicons } from '@expo/vector-icons';
import { fetchAPI } from '@/api';

export default function ActiveTripScreen() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const router = useRouter();
  const { activeOrder, setActiveOrder, completeOrder } = useDeliveryStore();
  const [isUpdating, setIsUpdating] = React.useState(false);

  if (!activeOrder) return null;

  const handleNextStep = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      if (activeOrder.status === 'going_to_pickup') {
        await fetchAPI(`/orders/${activeOrder.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'PICKED_UP' })
        });
        setActiveOrder({ ...activeOrder, status: 'picked_up' });
      } else if (activeOrder.status === 'picked_up') {
        await fetchAPI(`/orders/${activeOrder.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' })
        });
        setActiveOrder({ ...activeOrder, status: 'going_to_dropoff' });
      } else if (activeOrder.status === 'going_to_dropoff') {
        await fetchAPI(`/orders/${activeOrder.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'DELIVERED' })
        });
        completeOrder();
        router.replace('/');
      }
    } catch (err: any) {
      console.error('Failed to update status', err);
      alert(err.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getActionText = () => {
    switch (activeOrder.status) {
      case 'going_to_pickup': return 'ARRIVED AT RESTAURANT';
      case 'picked_up': return 'ORDER PICKED UP';
      case 'going_to_dropoff': return 'MARK AS DELIVERED';
      default: return 'CONTINUE';
    }
  };

  const getStatusText = () => {
    switch (activeOrder.status) {
      case 'going_to_pickup': return 'Heading to Pickup';
      case 'picked_up': return 'At Restaurant';
      case 'going_to_dropoff': return 'Heading to Customer';
      default: return 'Delivery';
    }
  };

  return (
    <View style={styles.container}>
      {/* Mock Map Background */}
      <View style={styles.mapBackground}>
        <Ionicons name="map" size={100} color={Colors.border} />
        <Text style={styles.mapText}>Live Navigation (Mock)</Text>
      </View>

      {/* Floating Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/')}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </SafeAreaView>

      {/* Bottom Sheet UI */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        
        <ScrollView style={styles.sheetContent}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>{activeOrder.id}</Text>
            <Text style={styles.earning}>₹{activeOrder.earning}</Text>
          </View>

          {/* Restaurant Details */}
          <View style={[styles.infoCard, activeOrder.status === 'going_to_dropoff' && styles.faded]}>
            <View style={styles.iconBox}>
              <Ionicons name="restaurant" size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>PICKUP FROM</Text>
              <Text style={styles.infoTitle}>{activeOrder.restaurantName}</Text>
              <Text style={styles.infoDesc}>{activeOrder.restaurantAddress}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Customer Details */}
          <View style={[styles.infoCard, activeOrder.status === 'going_to_pickup' && styles.faded]}>
            <View style={[styles.iconBox, { backgroundColor: Colors.success + '20' }]}>
              <Ionicons name="person" size={20} color={Colors.success} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>DELIVER TO</Text>
              <Text style={styles.infoTitle}>{activeOrder.customerName}</Text>
              <Text style={styles.infoDesc}>{activeOrder.customerAddress}</Text>
            </View>
            <TouchableOpacity style={[styles.callBtn, { backgroundColor: Colors.success }]}>
              <Ionicons name="call" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.actionFooter}>
          <TouchableOpacity 
            style={[
              styles.actionBtn, 
              activeOrder.status === 'going_to_dropoff' && { backgroundColor: Colors.success },
              isUpdating && { opacity: 0.7 }
            ]} 
            onPress={handleNextStep}
            disabled={isUpdating}
          >
            <Text style={styles.actionBtnText}>
              {isUpdating ? 'UPDATING...' : getActionText()}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  mapText: { color: Colors.textSecondary, fontWeight: 'bold', marginTop: 10 },
  
  header: {
    position: 'absolute', top: 40, left: 20, right: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
  },
  statusBadge: {
    backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3
  },
  statusText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10,
    maxHeight: '60%',
  },
  sheetHandle: {
    width: 40, height: 5, borderRadius: 3, backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 20
  },
  sheetContent: { paddingHorizontal: 20 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  orderId: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  earning: { fontSize: 24, fontWeight: '900', color: Colors.success },

  infoCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  faded: { opacity: 0.4 },
  iconBox: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '20',
    alignItems: 'center', justifyContent: 'center', marginRight: 15
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 10, fontWeight: 'bold', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 4 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  infoDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  
  callBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginLeft: 10
  },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 20, marginLeft: 55 },

  actionFooter: { padding: 20, paddingTop: 10, backgroundColor: Colors.surface },
  actionBtn: {
    backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 20, borderRadius: 16, gap: 10
  },
  actionBtnText: { color: 'white', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
});
