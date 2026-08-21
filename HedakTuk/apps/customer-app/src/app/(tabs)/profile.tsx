import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { fetchAPI } from '@/api';

const MENU_ITEMS = [
  { icon: 'bookmark-outline', label: 'Saved Addresses', badge: '3' },
  { icon: 'card-outline', label: 'Payment Methods' },
  { icon: 'gift-outline', label: 'Offers & Coupons', badge: '2 new' },
  { icon: 'star-outline', label: 'Your Reviews' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'settings-outline', label: 'App Settings' },
  { icon: 'help-circle-outline', label: 'Help & Support' },
  { icon: 'document-text-outline', label: 'Terms & Conditions' },
];

export default function ProfileScreen() {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const router = useRouter();
  
  const { user, logout } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optionally fetch fresh profile data
    const fetchProfile = async () => {
      try {
        const res = await fetchAPI('/users/me');
        if (res) {
          setProfileData(res);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  if (!user && !profileData) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{color: Colors.text, marginBottom: 20}}>Please login to view profile.</Text>
        <TouchableOpacity style={{backgroundColor: Colors.primary, padding: 12, borderRadius: Radius.md}} onPress={() => router.push('/(auth)/login')}>
           <Text style={{color: Colors.white, fontWeight: 'bold'}}>Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(profileData?.firstName || profileData?.name)}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{profileData?.firstName || profileData?.name || 'User'}</Text>
            <Text style={styles.phone}>{profileData?.phone || 'No Phone'}</Text>
            <Text style={styles.email}>{profileData?.email || 'No Email'}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Favourites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Addresses</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} activeOpacity={0.7}>
              <Ionicons name={item.icon as any} size={20} color={Colors.textSecondary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>HedakTuk v1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.primary },
  info: { flex: 1 },
  name: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  phone: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  email: { fontSize: FontSize.sm, color: Colors.textTertiary, marginTop: 1 },
  editBtn: { padding: 8 },

  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.xxl,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },

  menuSection: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: { backgroundColor: Colors.primaryBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: Spacing.xxl, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.dangerBg, borderRadius: Radius.md,
  },
  logoutText: { color: Colors.danger, fontSize: FontSize.md, fontWeight: FontWeight.semibold },

  version: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: Spacing.lg },
});
