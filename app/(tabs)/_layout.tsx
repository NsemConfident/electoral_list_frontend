import { Tabs } from "expo-router";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function TabsLayout() {
  return (
    <ProtectedRoute>
      <Tabs
      screenOptions={{ 
        
        tabBarActiveTintColor: 'teal',
        tabBarStyle: {position: 'absolute'},
       }}
      >
        <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home",
          tabBarIcon: ({color}) => <Feather name="home" size={24} color={color} />
         }}
           />
        <Tabs.Screen 
        name="candidates" 
        options={{ 
          title: "Candidates",
          tabBarIcon: ({color}) => <Feather name="users" size={24} color={color} />
           }} />
        <Tabs.Screen name="news" options={{ 
          title: "News",
          tabBarIcon: ({color})=> <Ionicons name="newspaper-outline" size={24} color={color} />
           }} />
      </Tabs>
    </ProtectedRoute>
  );
}
