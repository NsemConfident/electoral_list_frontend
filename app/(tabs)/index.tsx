import { Card } from "@/components/cards/Card";
import { useAuth } from "@/contexts/authContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ScrollView,
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
  const cardData = [
    {
      id: 1,
      number: 1,
      icon: FontAwesome5,
      iconName: "vote-yea",
      description: "Total Vote",
    },
    {
      id: 2,
      number: 2,
      icon: FontAwesome6,
      iconName: "users-line",
      description: "Total Applicants",
    },
    {
      id: 3,
      number: 3,
      icon: FontAwesome5,
      iconName: "users",
      description: "Total Candidates",
    },
  ];
  return (
    <SafeAreaProvider className="flex-1">
      <SafeAreaView className="px-4">
        <View>
          <ImageBackground
            source={image}
            resizeMode="cover"
            className="flex flex-row justify-between items-center my-4 py-10 rounded px-4"
          >
            <View className="flex flex-col h-full">
              <Text className="text-xl text-white font-medium">
                Welcome back,{" "}
              </Text>
              <Text className="text-2xl font-extrabold text-white">
                {user?.name ?? "Guest"}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-primary text-white text-base font-medium px-12 py-3 rounded-full mb-auto"
              onPress={() => {}}
            >
              <View className="">
                <Text className="text-lg font-bold text-white">Vote</Text>
              </View>
            </TouchableOpacity>
          </ImageBackground>
          <View>
            <FlatList
              data={cardData}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Card
                  number={item.number}
                  description={item.description}
                  Icon={item.icon}
                  iconName={item.iconName}
                  onPress={() => console.log(`Card ${item.number} pressed`)}
                />
              )}
            />
          </View>
          <ScrollView>
            
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
