import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDeliveryStore } from '../stores/deliveryStore';
import { useTheme } from '../stores/themeStore';

export default function EarningsScreen() {
  const { theme } = useTheme();
  const { todayEarnings, thisWeekEarnings, fetchEarnings } = useDeliveryStore();

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Earnings & Wallet</Text>
      
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Today's Earnings</Text>
        <Text style={[styles.amount, { color: theme.colors.primary }]}>₹{todayEarnings}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, marginTop: 16 }]}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>This Week (Mon - Sun)</Text>
        <Text style={[styles.amount, { color: theme.colors.text }]}>₹{thisWeekEarnings}</Text>
        <View style={styles.payoutNotice}>
          <Text style={{ color: theme.colors.background, fontWeight: 'bold' }}>Next payout: Monday</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  card: { padding: 24, borderRadius: 16, alignItems: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  amount: { fontSize: 48, fontWeight: 'bold' },
  payoutNotice: { marginTop: 16, backgroundColor: '#10b981', padding: 12, borderRadius: 8 }
});
