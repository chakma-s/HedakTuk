import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontSize, FontWeight, Radius } from '@/constants/theme';
import { useTheme } from '@/stores/themeStore';;

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  compact?: boolean;
}

export default function QuantitySelector({ quantity, onIncrease, onDecrease, compact = false }: QuantitySelectorProps) {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <TouchableOpacity onPress={onDecrease} style={styles.btn}>
        <Ionicons name="remove" size={compact ? 14 : 18} color={Colors.primary} />
      </TouchableOpacity>
      <Text style={[styles.qty, compact && styles.qtyCompact]}>{quantity}</Text>
      <TouchableOpacity onPress={onIncrease} style={styles.btn}>
        <Ionicons name="add" size={compact ? 14 : 18} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBg,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    height: 36,
  },
  containerCompact: {
    height: 28,
  },
  btn: {
    paddingHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  qtyCompact: {
    fontSize: FontSize.md,
    minWidth: 18,
  },
});
