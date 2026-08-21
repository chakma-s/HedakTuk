import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/stores/themeStore';

interface VegBadgeProps {
  isVeg: boolean;
  size?: number;
}

export default function VegBadge({ isVeg, size = 16 }: VegBadgeProps) {
  const Colors = useTheme();
  const styles = createStyles(Colors);
  const color = isVeg ? Colors.success : Colors.danger;
  const innerSize = size * 0.5;

  return (
    <View style={[styles.outer, { width: size, height: size, borderColor: color }]}>
      <View style={[
        styles.inner, 
        { width: innerSize, height: innerSize, backgroundColor: color, borderRadius: isVeg ? innerSize / 2 : 2 }
      ]} />
    </View>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  outer: {
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {},
});
