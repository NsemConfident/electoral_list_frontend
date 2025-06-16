import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen name="notification" options={{ title: "notification" }} />
        <Stack.Screen name="profile" options={{ title: "profile" }} />
        <Stack.Screen name="support" options={{ title: "support" }} />
      </Stack>
    </ProtectedRoute>
  );
};

export default _layout;
