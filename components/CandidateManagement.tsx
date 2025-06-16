// components/CandidateManagement.tsx
import { useCandidate } from "@/contexts/candidateContext";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CreateCandidateData, PresidentialCandidate } from "../types/candidate";

export function CandidateManagement() {
  const {
    candidates,
    isLoading,
    error,
    refreshCandidates,
    createCandidate,
    updateCandidate,
    deleteCandidate,
  } = useCandidate();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCandidate, setEditingCandidate] =
    useState<PresidentialCandidate | null>(null);
  const [formData, setFormData] = useState<CreateCandidateData>({
    full_name: "",
    date_of_birth: "",
    place_of_birth: "",
    political_party: "",
    national_id: "",
    region: "",
    email: "",
    phone: "",
  });

  const resetForm = () => {
    setFormData({
      full_name: "",
      date_of_birth: "",
      place_of_birth: "",
      political_party: "",
      national_id: "",
      region: "",
      email: "",
      phone: "",
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
    });
    setEditingCandidate(candidate);
    setModalVisible(true);
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

  const handleDelete = (candidate: PresidentialCandidate) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${candidate.full_name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await deleteCandidate(candidate.id);
            if (result.success) {
              Alert.alert("Success", "Candidate deleted successfully!");
            } else {
              Alert.alert(
                "Error",
                result.error || "Failed to delete candidate"
              );
            }
          },
        },
      ]
    );
  };
const renderCandidate = ({ item }: { item: PresidentialCandidate }) => (
    
    <View className="flex flex-col gap-3 w-full">
      <View className="flex flex-col gap-2 bg-accent">
        <Image src={item.photo} />
        <View className="bg-red-500">
          <Text>{item.full_name}</Text>
          <Text>{item.political_party}</Text>
          <Text>{item.region}</Text>
        </View>
      </View>
    </View>
  );

  const renderFormField = (
    label: string,
    key: keyof CreateCandidateData,
    placeholder?: string,
    keyboardType?: "default" | "email-address" | "phone-pad"
  ) => (
    <View style={styles.formField}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[key]}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, [key]: text }))
        }
        placeholder={placeholder || label}
        keyboardType={keyboardType || "default"}
      />
    </View>
  );

  if (isLoading && candidates.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading candidates...</Text>
      </View>
    );
  }

  if (error && candidates.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={refreshCandidates}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Presidential Candidates</Text>
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
          <Text style={styles.buttonText}>Add Candidate</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={candidates}
        renderItem={renderCandidate}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshCandidates}
            colors={["#0066cc"]}
          />
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for Create/Edit */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
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

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#0066cc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  listContainer: {
    padding: 16,
  },
  candidateCard: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  candidateInfo: {
    marginBottom: 12,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  candidateParty: {
    fontSize: 16,
    color: "#0066cc",
    fontWeight: "600",
    marginBottom: 4,
  },
  candidateRegion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  candidateEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  candidatePhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  candidateDate: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 60,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#28a745",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  retryButton: {
    backgroundColor: "#0066cc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#cc0000",
    textAlign: "center",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
    gap: 12,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    flex: 1,
    padding: 12,
  },
  submitButton: {
    backgroundColor: "#0066cc",
    flex: 1,
    padding: 12,
  },
});
