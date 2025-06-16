import { useAuth } from "@/contexts/authContext";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RegisterData } from "../../types/auth";
import { Link } from "expo-router";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [credentials, setCredentials] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async (): Promise<void> => {
    if (
      !credentials.name ||
      !credentials.email ||
      !credentials.password ||
      !credentials.password ||
      !credentials.password_confirmation
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const result = await register(credentials);
    setIsLoading(false);

    if (!result.success) {
      Alert.alert("Registration Failed", result.error || "An error occurred");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="name"
        value={credentials.name}
        onChangeText={(name) => setCredentials({ ...credentials, name })}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={credentials.email}
        onChangeText={(email) => setCredentials({ ...credentials, email })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={credentials.password}
        onChangeText={(password) =>
          setCredentials({ ...credentials, password })
        }
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Password_confirm"
        value={credentials.password_confirmation}
        onChangeText={(password_confirmation) =>
          setCredentials({ ...credentials, password_confirmation })
        }
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Sign Up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
      <View className="flex flex-row items-center">
        <Text>Already have an account? </Text>
        <Link href="/(auth)/login">
          <Text className="text-blue-700">Login</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
