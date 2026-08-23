import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';
import { fetchAPI } from '@/api';

interface AddressItem {
  id: string;
  label: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  landmark?: string;
  isDefault?: boolean;
}

export default function AddressesScreen() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const router = useRouter();

  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [landmark, setLandmark] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI('/users/me/addresses');
      if (Array.isArray(res)) {
        setAddresses(res);
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!street.trim() || !city.trim()) {
      Alert.alert('Required Fields', 'Please enter your street address and city.');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchAPI('/users/me/addresses', {
        method: 'POST',
        body: JSON.stringify({
          label,
          street: street.trim(),
          city: city.trim(),
          state: 'Karnataka',
          postalCode: postalCode.trim() || '560001',
          landmark: landmark.trim() || undefined,
          latitude: 12.9716,
          longitude: 77.5946,
          isDefault: addresses.length === 0,
        }),
      });

      setShowAddModal(false);
      setStreet('');
      setLandmark('');
      setPostalCode('');
      await loadAddresses();
    } catch (err: any) {
      console.error('Failed to add address:', err);
      Alert.alert('Error', err.message || 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await fetchAPI(`/users/me/addresses/${id}`, {
        method: 'DELETE',
      });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      console.error('Failed to delete address:', err);
      Alert.alert('Error', err.message || 'Failed to delete address');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {addresses.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardLabelRow}>
                  <Ionicons
                    name={item.label === 'Home' ? 'home' : item.label === 'Work' ? 'briefcase' : 'location'}
                    size={18}
                    color={Colors.primary}
                  />
                  <Text style={styles.cardLabel}>{item.label}</Text>
                  {item.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>DEFAULT</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => handleDeleteAddress(item.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                </TouchableOpacity>
              </View>

              <Text style={styles.cardStreet}>{item.street}</Text>
              {item.landmark && <Text style={styles.cardLandmark}>Landmark: {item.landmark}</Text>}
              <Text style={styles.cardCity}>
                {item.city} {item.postalCode ? `- ${item.postalCode}` : ''}
              </Text>
            </View>
          ))}

          {addresses.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={48} color={Colors.textTertiary} />
              <Text style={styles.emptyTitle}>No saved addresses yet</Text>
              <Text style={styles.emptySubtitle}>Add your home or office address for faster checkout.</Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* Add New Address Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={20} color={Colors.white} />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      {/* Add Address Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Address</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {/* Label Selector */}
            <Text style={styles.fieldLabel}>SAVE AS</Text>
            <View style={styles.labelRow}>
              {(['Home', 'Work', 'Other'] as const).map((l) => (
                <TouchableOpacity
                  key={l}
                  onPress={() => setLabel(l)}
                  style={[styles.labelChip, label === l && styles.labelChipActive]}
                >
                  <Ionicons
                    name={l === 'Home' ? 'home' : l === 'Work' ? 'briefcase' : 'location'}
                    size={16}
                    color={label === l ? Colors.white : Colors.text}
                  />
                  <Text style={[styles.labelText, label === l && styles.labelTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Inputs */}
            <Text style={styles.fieldLabel}>STREET ADDRESS *</Text>
            <TextInput
              style={styles.input}
              placeholder="House/Flat no., Building, Street area"
              placeholderTextColor={Colors.textTertiary}
              value={street}
              onChangeText={setStreet}
            />

            <Text style={styles.fieldLabel}>LANDMARK (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Near Metro Station"
              placeholderTextColor={Colors.textTertiary}
              value={landmark}
              onChangeText={setLandmark}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.fieldLabel}>CITY *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor={Colors.textTertiary}
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.fieldLabel}>PIN CODE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="560001"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="numeric"
                  value={postalCode}
                  onChangeText={setPostalCode}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handleAddAddress}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.saveBtnText}>Save Address</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scroll: { padding: Spacing.lg },

    card: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      marginBottom: Spacing.md,
      ...Shadows.sm,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    cardLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    cardLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
    defaultBadge: {
      backgroundColor: Colors.primaryBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: Radius.sm,
      marginLeft: 4,
    },
    defaultText: { fontSize: 10, fontWeight: FontWeight.bold, color: Colors.primary },
    deleteBtn: { padding: 4 },

    cardStreet: { fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.medium, marginBottom: 2 },
    cardLandmark: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 2 },
    cardCity: { fontSize: FontSize.xs, color: Colors.textTertiary },

    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginTop: 12 },
    emptySubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },

    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: Spacing.lg,
      backgroundColor: Colors.background,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
    },
    addBtn: {
      backgroundColor: Colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      borderRadius: Radius.md,
      ...Shadows.card,
    },
    addBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: FontWeight.bold },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: {
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius.xl,
      borderTopRightRadius: Radius.xl,
      padding: Spacing.xl,
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },

    fieldLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textSecondary, marginBottom: 6, marginTop: 10 },
    labelRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    labelChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceAlt,
    },
    labelChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    labelText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
    labelTextActive: { color: Colors.white },

    input: {
      backgroundColor: Colors.background,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Radius.md,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: FontSize.sm,
      color: Colors.text,
      marginBottom: 6,
    },
    row: { flexDirection: 'row' },

    saveBtn: {
      backgroundColor: Colors.primary,
      paddingVertical: 14,
      borderRadius: Radius.md,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 10,
    },
    saveBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  });
