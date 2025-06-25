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
import { RegisterData } from "../../types/auth";

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
              Register
            </Text>
          </View>
          <Text className="text-white text-xl">Sign in to Account</Text>
        </ImageBackground>
      </View>
      <View className="px-5 py-14 flex flex-col gap-4 h-3/5">
        <TextInput
          className="border border-primary rounded-md mb-4"
          placeholder="name"
          value={credentials.name}
          onChangeText={(name) => setCredentials({ ...credentials, name })}
          autoCapitalize="none"
        />
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
        <TextInput
          className="border border-primary rounded-md mb-4"
          placeholder="Password_confirm"
          value={credentials.password_confirmation}
          onChangeText={(password_confirmation) =>
            setCredentials({ ...credentials, password_confirmation })
          }
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-primary p-4 rounded-md flex items-center justify-center"
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-xl">
            {isLoading ? "Sign Up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row items-center">
          <Text className="text-lg font-normal">Already have an account? </Text>
          <Link href="/(auth)/login">
            <Text className="text-primary text-lg font-normal">Login</Text>
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
