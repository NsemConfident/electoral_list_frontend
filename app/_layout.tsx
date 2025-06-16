import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/authContext';
import './globals.css'

export default function RootLayout() {
  
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </AuthProvider>
  );
}