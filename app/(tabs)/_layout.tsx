import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Tabs } from "expo-router";
import { Image, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export default function TabsLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "teal",
          tabBarStyle: { position: "absolute" },
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.light,
          headerRight: () => (
            <View className="flex flex-row gap-4 mr-3 items-center">
              <Link href="/app/(tabs)/index.tsx">
                <Fontisto name="bell" size={24} color={Colors.light} />
              </Link>
              <Link href="/app/(tabs)/index.tsx">
                <AntDesign
                  name="customerservice"
                  size={24}
                  color={Colors.light}
                />
              </Link>
              <Link href="/app/screens/profile.tsx">
                <View className="flex justify-center items-center border-4 border-primary rounded-full">
                  <Image
                    className="rounded-full h-10 w-10 object-cover"
                    source={{
                      uri: "https://scontent-los2-1.xx.fbcdn.net/v/t39.30808-6/358456969_1060087592038559_392440770978322575_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeETipsUIecQfJQVRs8DM6DKbNiRW222MoFs2JFbbbYygUmIH11WLx1Iea9bgjzCIdD96lTdcoPhc88xxGl2LJ3B&_nc_ohc=CU7Ui_zLwisQ7kNvwFwEKr1&_nc_oc=AdnK5t6FwVB5Jt8CvtkwC0Vl_9AeA8_sHnS3i0WbDPGYl0xHMqKlNX40qfhc8UAC_5A&_nc_zt=23&_nc_ht=scontent-los2-1.xx&_nc_gid=ilgibxVIE_kw8W7Tc44Auw&oh=00_AfM218g0_NjsbnW-s-ygiVCfP9rJcxDSFpYDDg6LRoFkbA&oe=684E6ECD",
                    }}
                  />
                </View>
              </Link>
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerTitleStyle: {
              fontWeight: "bold",
            },

            tabBarIcon: ({ color }) => (
              <Feather name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Candidates"
          options={{
            title: "Candidates",
            tabBarIcon: ({ color }) => (
              <Feather name="users" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            title: "News",
            tabBarIcon: ({ color }) => (
              <Ionicons name="newspaper-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
