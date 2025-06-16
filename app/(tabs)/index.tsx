import { useAuth } from "@/contexts/authContext";
import {
  ActivityIndicator,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function Index() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }
  const image = {
    uri: "https://images.unsplash.com/photo-1676969046758-79b463366a39?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  return (
    <SafeAreaProvider className="flex-1">
      <SafeAreaView className="h-full px-4">
        <View>
          <ImageBackground
            source={image}
            resizeMode="cover"
            className="flex flex-row justify-between items-center my-4 py-10 rounded-md px-4"
          >
            <View className="flex flex-col">
              <Text className="text-xl text-light font-medium">
                Welcome back,{" "}
              </Text>
              <Text className="text-2xl font-extrabold text-accent">
                {user?.name ?? "Guest"}
              </Text>
            </View>
            <TouchableOpacity
              className="border-2 border-blue-500 text-white text-base font-medium px-12 py-3 rounded-full"
              onPress={() => {}}
            >
              <View>
                <Text>Vote</Text>
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
