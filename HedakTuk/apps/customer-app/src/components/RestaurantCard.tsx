import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';;
import type { MockRestaurant } from '@/data/mockRestaurants';

interface RestaurantCardProps {
  restaurant: MockRestaurant;
  onPress: () => void;
}

export default function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: restaurant.coverImageUrl }} 
          style={styles.image} 
          contentFit="cover"
          transition={200}
        />
        {restaurant.promoted && (
          <View style={styles.promotedBadge}>
            <Text style={styles.promotedText}>Promoted</Text>
          </View>
        )}
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{restaurant.avgDeliveryTimeMinutes} mins</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={Colors.white} />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.cuisines} numberOfLines={1}>
            {restaurant.cuisines.join(' • ')}
          </Text>
        </View>
        
        <View style={styles.footerRow}>
          <Text style={styles.distance}>{restaurant.distance}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.fee}>₹{restaurant.deliveryFee} Delivery Fee</Text>
        </View>
      </View>
    </Pressable>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  promotedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  promotedText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
  },
  timeBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  timeText: {
    color: Colors.black,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  infoContainer: {
    padding: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    gap: 2,
  },
  ratingText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  detailsRow: {
    marginBottom: Spacing.sm,
  },
  cuisines: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distance: {
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
  },
  dot: {
    color: Colors.textTertiary,
    fontSize: FontSize.xs,
  },
  fee: {
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
  },
});
