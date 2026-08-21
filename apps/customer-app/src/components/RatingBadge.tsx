import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Radius } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';;

interface RatingBadgeProps {
  rating: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingBadge({ rating, totalRatings, size = 'sm' }: RatingBadgeProps) {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const iconSize = size === 'sm' ? 10 : size === 'md' ? 14 : 18;
  const textSize = size === 'sm' ? FontSize.xs : size === 'md' ? FontSize.sm : FontSize.md;
  const paddingH = size === 'sm' ? 4 : size === 'md' ? 8 : 12;
  const paddingV = size === 'sm' ? 2 : size === 'md' ? 4 : 6;

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { paddingHorizontal: paddingH, paddingVertical: paddingV }]}>
        <Ionicons name="star" size={iconSize} color={Colors.white} />
        <Text style={[styles.ratingText, { fontSize: textSize }]}>{rating}</Text>
      </View>
      {totalRatings !== undefined && (
        <Text style={styles.totalText}>({totalRatings >= 1000 ? (totalRatings/1000).toFixed(1) + 'k' : totalRatings}+ ratings)</Text>
      )}
    </View>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    borderRadius: Radius.sm,
    gap: 4,
  },
  ratingText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },
  totalText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
  },
});
