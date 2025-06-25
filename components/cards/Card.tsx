import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { IconProps } from '@expo/vector-icons/build/createIconSet';

// Card component interface
interface CardProps {
  number: number;
  description: string;
  onPress?: () => void;
  Icon: React.ElementType; // <- this is the icon component
  iconName: string;
}

// Basic Card Component
export const Card: React.FC<CardProps & { color?: string }> = ({
  number,
  description,
  onPress,
  Icon,
  iconName,
  color = "#16423C",
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      onPress={onPress}
      className="flex bg-white rounded-3xl shadow-md justify-center items-center p-5 mr-4 w-40 h-52"
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View className="flex flex-col w-full h-full gap-4">
        <View
          style={{ backgroundColor: color }}
          className="rounded-full flex justify-center items-center h-14 w-14"
        >
          <Icon name={iconName} size={24} color="#3D90D7" />
        </View>
        <Text className="text-black font-medium text-xl">{description}</Text>
        <Text className="text-gray-500 font-bold text-2xl">{number}</Text>
      </View>
    </CardWrapper>
  );
};
