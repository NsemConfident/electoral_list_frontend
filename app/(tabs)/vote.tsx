// components/VoterRegistrationButton.tsx
import React from "react";
import { TouchableOpacity, Text, View, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "@/contexts/authContext";

const VoterRegistrationButton = () => {
  const { voterStatus, isLoading, registerAsVoter } = useAuth();

  const handleRegister = async () => {
    try {
      const { success, error } = await registerAsVoter();
      
      if (success) {
        Alert.alert(
          "Success",
          "You have been registered as a voter successfully!",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Error",
          error || "Failed to register as voter",
          [{ text: "OK" }]
        );
      }
    } catch (err) {
      Alert.alert(
        "Error",
        "An unexpected error occurred during registration",
        [{ text: "OK" }]
      );
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="small" />;
  }

  if (!voterStatus?.is_registered) {
    return (
      <View className="p-4">
        <TouchableOpacity
          onPress={handleRegister}
          className="bg-green-600 p-3 rounded-md"
        >
          <Text className="text-white text-center text-base font-medium">
            Register as Voter
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

export default VoterRegistrationButton;