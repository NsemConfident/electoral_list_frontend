import { GuestRoute } from "@/components/ProtectedRoute";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <GuestRoute>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            title: "Login",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{ title: "Register", headerShown: false }}
        />
      </Stack>
    </GuestRoute>
  );
}
