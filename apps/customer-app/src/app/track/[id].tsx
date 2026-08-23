import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { io, Socket } from 'socket.io-client';
import { FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';
import { fetchAPI, API_URL } from '@/api';

const STATUS_FLOW = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
const STATUS_DISPLAY = ['Placed', 'Confirmed', 'Preparing', 'Ready', 'On the way', 'Delivered'];

export default function OrderTrackingScreen() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetchAPI(`/orders/${id}`);
        setOrder(res);
        const stepIndex = STATUS_FLOW.indexOf(res.status);
        if (stepIndex !== -1) {
          setCurrentStep(stepIndex);
        }
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // WebSocket Integration
  useEffect(() => {
    // Only connect once we know the order ID exists
    if (!id) return;

    const socket: Socket = io(`${API_URL}/orders`, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to order tracking WS');
      socket.emit('join_order_room', id);
    });

    socket.on('order_status_updated', (data: { orderId: string; status: string; updatedAt: string }) => {
      if (data.orderId === id) {
        setOrder((prev: any) => ({ ...prev, status: data.status }));
        const stepIndex = STATUS_FLOW.indexOf(data.status);
        if (stepIndex !== -1) {
          setCurrentStep(stepIndex);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from order tracking WS');
    });

    return () => {
      socket.emit('leave_order_room', id);
      socket.disconnect();
    };
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{id}</Text>
        <TouchableOpacity>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapOverlay} />
          <Ionicons name="map-outline" size={48} color={Colors.textTertiary} />
          <Text style={styles.mapText}>Live Tracking Map</Text>
          {currentStep >= 4 && currentStep < 5 && (
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryBadgeText}>Arriving in 15 mins</Text>
            </View>
          )}
        </View>

        {/* Status Tracker */}
        <View style={styles.trackerCard}>
          <Text style={styles.trackerTitle}>{STATUS_DISPLAY[currentStep] || 'Processing'}</Text>
          <Text style={styles.trackerSubtitle}>
            {currentStep === 0 ? 'Your order has been placed.' :
             currentStep === 1 ? 'Restaurant has accepted your order.' :
             currentStep === 2 ? 'Your food is being prepared.' :
             currentStep === 3 ? 'Food is ready for pickup.' :
             currentStep === 4 ? 'Delivery partner is on the way.' :
             currentStep === 5 ? 'Your order was delivered successfully. Enjoy!' :
             'Waiting for update...'}
          </Text>

          <View style={styles.progressContainer}>
            {STATUS_DISPLAY.map((status, index) => {
              const isCompleted = index <= currentStep;
              const isActive = index === currentStep;
              return (
                <View key={status} style={[styles.progressStep, { flex: index === STATUS_DISPLAY.length - 1 ? 0 : 1 }]}>
                  <View style={[styles.dot, isCompleted && styles.dotCompleted, isActive && styles.dotActive]} />
                  {index < STATUS_DISPLAY.length - 1 && (
                    <View style={[styles.line, isCompleted && index < currentStep && styles.lineCompleted]} />
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.progressLabels}>
            {STATUS_DISPLAY.map((status, index) => (
              <Text key={status} style={[styles.progressLabel, index === 5 && { marginLeft: -30 }]} numberOfLines={1}>{status}</Text>
            ))}
          </View>
        </View>

        {/* Delivery Partner */}
        {currentStep >= 4 && currentStep < 5 && (
          <View style={styles.partnerCard}>
            <View style={styles.partnerAvatar}>
              <Ionicons name="person" size={24} color={Colors.white} />
            </View>
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerName}>{order?.deliveryPartner?.name || 'Delivery Partner'}</Text>
              <Text style={styles.partnerDetails}>
                {order?.deliveryPartner?.phone || 'Verified Partner'} • 4.8 ★
              </Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}

        {/* Post-Delivery Rating & Review */}
        {currentStep === 5 && (
          <ReviewSection orderId={id as string} restaurantName={order?.restaurant?.name || 'Restaurant'} />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ReviewSection({ orderId, restaurantName }: { orderId: string; restaurantName: string }) {
  const Colors = useTheme();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetchAPI(`/orders/${orderId}/review`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment: comment.trim() || undefined }),
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error('Review submit failed:', err);
      alert(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={[reviewStyles.card, { backgroundColor: Colors.surface, borderColor: Colors.border }]}>
        <Ionicons name="checkmark-circle" size={40} color={Colors.success} style={{ alignSelf: 'center', marginBottom: 8 }} />
        <Text style={[reviewStyles.title, { color: Colors.text, textAlign: 'center' }]}>Thank you for your review!</Text>
        <Text style={[reviewStyles.subtitle, { color: Colors.textSecondary, textAlign: 'center' }]}>
          Your feedback helps {restaurantName} improve their food and service.
        </Text>
      </View>
    );
  }

  return (
    <View style={[reviewStyles.card, { backgroundColor: Colors.surface, borderColor: Colors.border }]}>
      <Text style={[reviewStyles.title, { color: Colors.text }]}>Rate your food & delivery</Text>
      <Text style={[reviewStyles.subtitle, { color: Colors.textSecondary }]}>
        How was your order from {restaurantName}?
      </Text>

      {/* Star Selector */}
      <View style={reviewStyles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)} style={{ padding: 4 }}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= rating ? '#f59e0b' : Colors.textTertiary}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={[reviewStyles.commentInput, { backgroundColor: Colors.background, color: Colors.text, borderColor: Colors.border }]}
        placeholder="Write a comment (optional)..."
        placeholderTextColor={Colors.textTertiary}
        multiline
        numberOfLines={3}
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity
        style={[reviewStyles.submitBtn, { backgroundColor: Colors.primary }, isSubmitting && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={reviewStyles.submitBtnText}>Submit Review</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const reviewStyles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    ...Shadows.card,
  },
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: 4 },
  subtitle: { fontSize: FontSize.sm, marginBottom: Spacing.md },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: Spacing.sm },
  commentInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: 12,
    fontSize: FontSize.sm,
    textAlignVertical: 'top',
    marginVertical: Spacing.md,
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.bold },
});

const createStyles = (Colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface, zIndex: 10,
  },
  headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  helpText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: FontWeight.semibold },
  
  mapContainer: {
    height: 300,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' },
  mapText: { color: Colors.textSecondary, marginTop: Spacing.sm },
  deliveryBadge: {
    position: 'absolute', bottom: Spacing.lg,
    backgroundColor: Colors.warning, paddingHorizontal: Spacing.lg, paddingVertical: 8,
    borderRadius: Radius.full, ...Shadows.card,
  },
  deliveryBadgeText: { color: Colors.black, fontWeight: FontWeight.bold, fontSize: FontSize.md },

  trackerCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl,
    marginTop: -20, padding: Spacing.xl, ...Shadows.card,
  },
  trackerTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text, marginBottom: 4 },
  trackerSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xxl },
  
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  progressStep: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.borderAccent, zIndex: 2 },
  dotCompleted: { backgroundColor: Colors.success },
  dotActive: { borderWidth: 3, borderColor: Colors.successBg, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.success },
  line: { flex: 1, height: 3, backgroundColor: Colors.borderAccent, marginHorizontal: -2, zIndex: 1 },
  lineCompleted: { backgroundColor: Colors.success },
  
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  progressLabel: { fontSize: 9, color: Colors.textSecondary, width: 60, textAlign: 'center', marginLeft: -23 },

  partnerCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, marginHorizontal: Spacing.lg, marginTop: Spacing.xl,
    padding: Spacing.lg, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
  },
  partnerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.info, alignItems: 'center', justifyContent: 'center' },
  partnerInfo: { flex: 1 },
  partnerName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 2 },
  partnerDetails: { fontSize: FontSize.sm, color: Colors.textSecondary },
  callBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center' },
});
