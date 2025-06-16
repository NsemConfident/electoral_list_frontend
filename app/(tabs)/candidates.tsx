// app/candidates.tsx or screens/CandidatesScreen.tsx

import SingleCandidate from "@/components/SingleCandidate";
import { CandidateProvider, useCandidate } from "@/contexts/candidateContext";
import { CreateCandidateData, PresidentialCandidate } from "@/types/candidate";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const CandidatesScreen = () => {
  const { candidates, isLoading, error, createCandidate, updateCandidate } =
    useCandidate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCandidate, setEditingCandidate] =
    useState<PresidentialCandidate | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<CreateCandidateData>({
    full_name: "",
    date_of_birth: new Date(), // or `null` if you want no default
    place_of_birth: "",
    political_party: "",
    national_id: "",
    region: "",
    email: "",
    phone: "",
    photo: null as any, // null until a file is picked
  });

  const renderItem = ({ item }: any) => {
    return <SingleCandidate item={item} />;
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {error}</Text>
      </View>
    );
  }
  const resetForm = () => {
    setFormData({
      full_name: "",
      date_of_birth: new Date(), // or `null` if you want no default
      place_of_birth: "",
      political_party: "",
      national_id: "",
      region: "",
      email: "",
      phone: "",
      photo: null as any, // null until a file is picked
    });
    setEditingCandidate(null);
  };
  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (candidate: PresidentialCandidate) => {
    setFormData({
      full_name: candidate.full_name,
      date_of_birth: candidate.date_of_birth,
      place_of_birth: candidate.place_of_birth,
      political_party: candidate.political_party,
      national_id: candidate.national_id,
      region: candidate.region,
      email: candidate.email,
      phone: candidate.phone,
      photo: candidate.photo,
    });
    setEditingCandidate(candidate);
    setModalVisible(true);
  };
  const renderFormField = (
    label: string,
    key: keyof CreateCandidateData,
    placeholder?: string,
    keyboardType?: "default" | "email-address" | "phone-pad"
  ) => {
    const handleImagePick = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageFile = {
          uri: result.assets[0].uri,
          name: "photo.jpg",
          type: "image/jpeg",
        };

        setFormData((prev) => ({ ...prev, [key]: imageFile }));
      }
    };

    // 📅 Date of Birth
    if (key === "date_of_birth") {
      return (
        <View className="flex flex-col gap-2 mt-2">
          <Text className="font-medium">{label}</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text className="bg-gray-200 p-3 rounded-md">
              {formData[key]
                ? formData[key].toLocaleDateString()
                : "Select Date"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData[key] || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData((prev) => ({ ...prev, [key]: selectedDate }));
                }
              }}
            />
          )}
        </View>
      );
    }

    if (key === "photo") {
      return (
        <View className="flex flex-col gap-2 mt-2">
          <Text className="font-medium">{label}</Text>
          {formData.photo && (
            <Image
              source={{ uri: formData.photo.uri }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 10,
                marginBottom: 10,
              }}
            />
          )}

          <TouchableOpacity
            onPress={handleImagePick}
            className="bg-blue-500 p-3 rounded-md"
          >
            <Text className="text-white">
              {formData.photo ? "Change Photo" : "Pick a Photo"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="flex flex-col gap-2 mt-2">
        <Text className="font-medium">{label}</Text>
        <TextInput
          value={formData[key] as any} // Typecast for simplicity
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, [key]: text }))
          }
          placeholder={placeholder || label}
          keyboardType={keyboardType || "default"}
          className="border p-2 rounded-md"
        />
      </View>
    );
  };
  const handleSubmit = async () => {
    try {
      let result;

      if (editingCandidate) {
        // Update existing candidate
        result = await updateCandidate({
          id: editingCandidate.id,
          ...formData,
        });
      } else {
        // Create new candidate
        result = await createCandidate(formData);
      }

      if (result.success) {
        setModalVisible(false);
        resetForm();
        Alert.alert(
          "Success",
          `Candidate ${editingCandidate ? "updated" : "created"} successfully!`
        );
      } else {
        Alert.alert("Error", result.error || "Operation failed");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-secondary gap-4 mt-3 mb-20 px-2">
        <View className="flex flex-row">
          <TouchableOpacity
            onPress={openCreateModal}
            className="bg-primary p-2 rounded-md ml-auto"
          >
            <Text className=" text-white text-base">Add Candidate</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={candidates} // ✅ Correct: this is the array from context
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </SafeAreaView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="px-4 pt-4 bg-secondary flex-1 gap-4">
          <View className="flex flex-row justify-between">
            <Text className="font-medium text-2xl text-primary">
              {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
            </Text>
            <TouchableOpacity
              className="bg-primary p-1 rounded"
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {renderFormField("Full Name", "full_name")}
            {renderFormField("Date of Birth", "date_of_birth", "YYYY-MM-DD")}
            {renderFormField("Place of Birth", "place_of_birth")}
            {renderFormField("Political Party", "political_party")}
            {renderFormField("National ID", "national_id")}
            {renderFormField("Region", "region")}
            {renderFormField(
              "Email",
              "email",
              "email@example.com",
              "email-address"
            )}
            {renderFormField("Phone", "phone", "Phone number", "phone-pad")}
            {renderFormField("Photo", "photo")}{" "}
            <View className="flex flex-row justify-between my-4">
              <TouchableOpacity
                className="border-2 border-primary px-4 py-2 rounded-md"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-base text-black font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border-2 bg-primary px-4 py-2 rounded-md"
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text className="text-base text-white font-medium">
                  {isLoading
                    ? "Saving..."
                    : editingCandidate
                    ? "Update"
                    : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
};

// Wrap your screen with the provider if it's not already wrapped globally
const Candidates = () => (
  <CandidateProvider>
    <CandidatesScreen />
  </CandidateProvider>
);

export default Candidates;
