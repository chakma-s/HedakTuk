import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/stores/themeStore';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { Ionicons } from '@expo/vector-icons';
import { fetchAPI } from '@/api';

export default function OrderRequestScreen() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const router = useRouter();
  const { activeOrder, setActiveOrder } = useDeliveryStore();
  const [progress] = useState(new Animated.Value(100));
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    // 15 second timer to accept
    Animated.timing(progress, {
      toValue: 0,
      duration: 15000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) rejectOrder();
    });
  }, []);

  const acceptOrder = async () => {
    if (!activeOrder) return;
    setIsAccepting(true);
    try {
      await fetchAPI(`/orders/${activeOrder.id}/accept`, {
        method: 'PATCH',
      });
      setActiveOrder({ ...activeOrder, status: 'going_to_pickup' });
      router.replace('/active-trip');
    } catch (err: any) {
      console.error('Failed to accept order:', err);
      Alert.alert('Order Unavailable', err.message || 'This order is no longer available.');
      setActiveOrder(null);
      router.replace('/');
    } finally {
      setIsAccepting(false);
    }
  };

  const rejectOrder = () => {
    setActiveOrder(null);
    router.replace('/');
  };

  if (!activeOrder) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.newRequestText}>NEW DELIVERY REQUEST</Text>
          <Text style={styles.earningText}>₹{activeOrder.earning}</Text>
          <Text style={styles.estTimeText}>Est. 25 mins • 4.2 km</Text>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.locationRow}>
            <Ionicons name="restaurant" size={24} color={Colors.primary} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>PICKUP</Text>
              <Text style={styles.locationName}>{activeOrder.restaurantName}</Text>
              <Text style={styles.locationAddress}>{activeOrder.restaurantAddress}</Text>
            </View>
          </View>
          
          <View style={styles.routeLine} />

          <View style={styles.locationRow}>
            <Ionicons name="location" size={24} color={Colors.success} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>DROPOFF</Text>
              <Text style={styles.locationName}>{activeOrder.customerName}</Text>
              <Text style={styles.locationAddress}>{activeOrder.customerAddress}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.timerBarBg}>
          <Animated.View style={[styles.timerBar, { width: progress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.rejectBtn} onPress={rejectOrder} disabled={isAccepting}>
            <Text style={styles.rejectText}>REJECT</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.acceptBtn, isAccepting && { opacity: 0.7 }]} 
            onPress={acceptOrder}
            disabled={isAccepting}
          >
            {isAccepting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.acceptText}>ACCEPT</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  
  header: { alignItems: 'center', marginBottom: 40 },
  newRequestText: { color: Colors.primary, fontWeight: '900', fontSize: 18, letterSpacing: 2, marginBottom: 10 },
  earningText: { color: Colors.text, fontWeight: 'black', fontSize: 48 },
  estTimeText: { color: Colors.textSecondary, fontSize: 16, fontWeight: 'bold', marginTop: 5 },

  routeCard: {
    backgroundColor: Colors.background, padding: 20, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 15 },
  locationInfo: { flex: 1 },
  locationLabel: { color: Colors.textSecondary, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  locationName: { color: Colors.text, fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  locationAddress: { color: Colors.textSecondary, fontSize: 14, marginTop: 2 },
  
  routeLine: {
    width: 2, height: 40, backgroundColor: Colors.border,
    marginLeft: 11, marginVertical: 10,
  },

  actions: { padding: 20, paddingBottom: 40 },
  timerBarBg: { height: 4, backgroundColor: Colors.border, borderRadius: 2, marginBottom: 20, overflow: 'hidden' },
  timerBar: { height: '100%', backgroundColor: Colors.primary },
  
  btnRow: { flexDirection: 'row', gap: 15 },
  rejectBtn: {
    flex: 1, padding: 20, borderRadius: 12, alignItems: 'center',
    backgroundColor: Colors.background, borderWidth: 2, borderColor: Colors.border,
  },
  rejectText: { color: Colors.textSecondary, fontWeight: '900', fontSize: 16 },
  
  acceptBtn: {
    flex: 2, padding: 20, borderRadius: 12, alignItems: 'center',
    backgroundColor: Colors.success,
  },
  acceptText: { color: 'white', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
});
