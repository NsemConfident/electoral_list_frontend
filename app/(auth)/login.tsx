// app/(auth)/login.tsx
import { useAuth } from "@/contexts/authContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LoginCredentials } from "../../types/auth";

export default function LoginScreen() {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    if (!credentials.email || !credentials.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const result = await login(credentials);
    setIsLoading(false);

    if (!result.success) {
      Alert.alert("Login Failed", result.error || "An error occurred");
    }
  };

  const image = {
    uri: "https://cdn.pixabay.com/photo/2017/02/14/23/06/background-2067263_640.jpg",
  };

  return (
    <View className="flex-1 bg-secondary">
      <View className="w-full h-2/5">
        <ImageBackground
          className="w-full h-full object-cover py-12 px-5  flex justify-center gap-4"
          resizeMode="cover"
          source={image}
        >
          <View className="h-14 w-14 bg-primary rounded-full flex justify-center items-center p">
            <AntDesign name="left" size={24} color="white" />
          </View>
          <View className="flex items-start text-start mb-7">
            <Text style={styles.title} className="font-extrabold text-white">
              Sign in to your
            </Text>
            <Text
              style={styles.title}
              className="text-white text-2xl font-extrabold"
            >
              account
            </Text>
          </View>
          <Text className="text-white text-xl">Sign in to Account</Text>
        </ImageBackground>
      </View>
      <View className="px-5 py-14 flex flex-col gap-4 h-3/5">
        <TextInput
          className="border border-primary rounded-md mb-4"
          placeholder="Email"
          value={credentials.email}
          onChangeText={(email) => setCredentials({ ...credentials, email })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="border border-primary rounded-md mb-4"
          placeholder="Password"
          value={credentials.password}
          onChangeText={(password) =>
            setCredentials({ ...credentials, password })
          }
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-primary p-4 rounded-md flex items-center justify-center"
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-xl">
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row items-center">
          <Text className="text-lg font-normal">Dont have an account? </Text>
          <Link href="/(auth)/register">
            <Text className="text-primary text-lg font-normal">Register</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "left",
  },
});
