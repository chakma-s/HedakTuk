import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/stores/themeStore';

export default function RootLayout() {
  const Colors = useTheme();
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="restaurant/[id]" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="cart" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
      </Stack>
    </>
  );
}
