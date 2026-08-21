import { Stack } from 'expo-router';
import { useTheme } from '@/stores/themeStore';

export default function RootLayout() {
  const Colors = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    />
  );
}
