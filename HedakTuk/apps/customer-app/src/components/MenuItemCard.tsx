import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';;
import type { MockMenuItem } from '@/data/mockRestaurants';
import VegBadge from './VegBadge';
import QuantitySelector from './QuantitySelector';

interface MenuItemCardProps {
  item: MockMenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function MenuItemCard({ item, quantity, onAdd, onRemove }: MenuItemCardProps) {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <VegBadge isVeg={item.isVeg} size={14} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        ) : null}
      </View>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.image} 
          contentFit="cover"
        />
        <View style={styles.actionContainer}>
          {quantity > 0 ? (
            <QuantitySelector 
              quantity={quantity} 
              onIncrease={onAdd} 
              onDecrease={onRemove} 
              compact
            />
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={onAdd}>
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoContainer: {
    flex: 1,
    paddingRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.xs,
    marginBottom: 4,
  },
  price: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  imageContainer: {
    position: 'relative',
    width: 110,
    height: 110,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt,
  },
  actionContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    ...Shadows.subtle,
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
});
