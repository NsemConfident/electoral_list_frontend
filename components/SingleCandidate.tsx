import { PresidentialCandidate } from "@/types/candidate";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type ItemProps = {
  item: PresidentialCandidate;
  //   onPress: () => void;
  //   backgroundColor: string;
  //   textColor: string;
};
const SingleCandidate = ({ item }: ItemProps) => {
  return (
    <View className="flex flex-col mx-2">
      <View className="block bg-white border p-4 border-gray-200 rounded-lg shadow-sm">
        <View>
          {item.photo?.uri ? (
            <Image
              source={{ uri: item.photo.uri }}
              className="w-full h-28 object-contain rounded-md"
            />
          ) : (
            <View>
              <Image
                source={{
                  uri: "https://cdn.pixabay.com/photo/2017/01/11/12/20/suit-1971665_1280.jpg",
                }}
                className="w-full h-28 object-cover rounded-md"
              />
            </View>
          )}
        </View>
        <View>
          <Text className="mb-2 text-base font-bold tracking-tight text-gray-900">
            {item.full_name}
          </Text>
        </View>
        <View>
          <Text className="font-normal text-gray-700 dark:text-gray-400">
            {item.political_party}
          </Text>
        </View>
        <View>
          <Text className="font-normal text-gray-900">{item.region}</Text>
          <View>
            <TouchableOpacity
              onPress={() => {}}
              className="bg-primary p-2 rounded-md ml-auto"
            >
              <Text className=" text-white text-base">Vote</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SingleCandidate;
