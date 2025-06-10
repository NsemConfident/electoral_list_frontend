import { Stack } from 'expo-router';
import { GuestRoute } from '@/components/ProtectedRoute';

export default function AuthLayout() {
  return (
    <GuestRoute>
      <Stack>
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
      </Stack>
    </GuestRoute>
  );
}