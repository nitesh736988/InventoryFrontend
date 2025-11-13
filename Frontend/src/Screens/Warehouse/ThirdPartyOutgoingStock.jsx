import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import api from "../../auth/api";
import { API_URL } from "@env";
import { Picker } from "@react-native-picker/picker";
import MultiSelect from "react-native-multiple-select";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ThirdPartyOutgoingStock = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [toServiceCenter, setToServiceCenter] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [driverName, setDriverName] = useState("");
  const [driverContact, setDriverContact] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [groups, setGroups] = useState([
    { id: Date.now().toString(), farmerSaralId: "", selectedItems: [], itemDefectives: {} },
  ]);

  // Fetch warehouses
  const fetchWarehouses = async () => {
    try {
      const response = await api.get(`${API_URL}/warehouse-admin/get-warehouse`);
      if (response.data.success) {
        const warehouses = Array.isArray(response.data.warehouseName)
          ? response.data.warehouseName
          : [response.data.warehouseName];
        setAllWarehouses(warehouses);
        if (warehouses.length > 0) setSelectedWarehouse(warehouses[0]);
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch warehouses");
    } finally {
      setLoading(false);
    }
  };

  // Fetch items
  const fetchItems = async () => {
    try {
      const response = await api.get(`${API_URL}/warehouse-admin/view-items`);
      const items =
        response?.data?.items?.map((item) => ({
          id: item,
          name: item,
        })) || [];
      setAllItems(items);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchWarehouses();
    fetchItems();
  }, []);

  // Add new group
  const addGroup = () => {
    setGroups((prev) => [
      ...prev,
      { id: Date.now().toString(), farmerSaralId: "", selectedItems: [], itemDefectives: {} },
    ]);
  };

  // Remove group
  const removeGroup = (id) => {
    if (groups.length === 1) return Alert.alert("Note", "At least one group is required");
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedWarehouse) return Alert.alert("Error", "Select a warehouse");
    if (!toServiceCenter) return Alert.alert("Error", "Enter service center name");
    if (!driverName) return Alert.alert("Error", "Enter service center name");
    if (!driverContact) return Alert.alert("Error", "Enter driver contact");
    if (!vehicleNumber) return Alert.alert("Error", "Enter vehicle number");
    // Validate 

    // Validate groups
    for (const g of groups) {
      if (!g.farmerSaralId) return Alert.alert("Error", "Enter Saral ID for all groups");
      if (g.selectedItems.length === 0)
        return Alert.alert("Error", "Select at least one item for each group");
      for (const item of g.selectedItems) {
        const qty = g.itemDefectives[item];
        if (!qty || isNaN(qty) || parseInt(qty) < 0)
          return Alert.alert("Error", `Enter valid defective count for ${item}`);
      }
    }

    const payload = {
      fromWarehouse: selectedWarehouse,
      toServiceCenter,
      driverName,
      driverContact,
      vehicleNumber,
      farmers: groups.map((g) => ({
        farmerSaralId: g.farmerSaralId,
        items: g.selectedItems.map((item) => ({
          itemName: item,
          quantity: parseInt(g.itemDefectives[item]),
        })),
      })),
    };

    console.log("Payload:", payload);
    try {
      setLoading(true);
      await api.post(`${API_URL}/warehouse-admin/add-outgoing-item`, payload);
      Alert.alert("Success", "Items transferred successfully!");
      setGroups([{ id: Date.now().toString(), farmerSaralId: "", selectedItems: [], itemDefectives: {} }]);
      setToServiceCenter("");
      setDriverName("");
      setDriverContact("");
      setVehicleNumber("");
      navigation.navigate("WarehouseNavigation");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );

  return (
    <FlatList
      data={[{ key: "form" }]}
      renderItem={() => (
        <View style={styles.container}>
          <Text style={styles.title}>Transfer to Service Center</Text>

          {/* Warehouse Section */}
          <View style={styles.section}>
            <Text style={styles.label}>From Warehouse:</Text>
            <Picker
              selectedValue={selectedWarehouse}
              style={styles.picker}
              onValueChange={setSelectedWarehouse}>
              {allWarehouses.map((warehouse, i) => (
                <Picker.Item key={i} label={warehouse} value={warehouse} />
              ))}
            </Picker>
          </View>

          {/* Service Center */}
          <View style={styles.section}>
            <Text style={styles.label}>To Service Center:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter service center name"
              value={toServiceCenter}
              onChangeText={setToServiceCenter}
              placeholderTextColor="#999"
            />
          </View>

           <View style={styles.section}>
            <Text style={styles.label}>Driver Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter service center name"
              value={driverName}
              onChangeText={setDriverName}
              placeholderTextColor="#999"
            />
          </View>

           <View style={styles.section}>
            <Text style={styles.label}>Driver Contact:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter service center name"
              value={driverContact}
              onChangeText={setDriverContact}
              placeholderTextColor="#999"
            />
          </View>

           <View style={styles.section}>
            <Text style={styles.label}>Vehicle Number:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter service center name"
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              placeholderTextColor="#999"
            />
          </View>

          {/* Dynamic Groups */}
          {groups.map((g, index) => (
            <View key={g.id} style={styles.groupContainer}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>Group {index + 1}</Text>
                <TouchableOpacity onPress={() => removeGroup(g.id)}>
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Select Items:</Text>
              <MultiSelect
                items={allItems}
                uniqueKey="id"
                onSelectedItemsChange={(selected) => {
                  const updated = groups.map((grp) =>
                    grp.id === g.id ? { ...grp, selectedItems: selected } : grp
                  );
                  setGroups(updated);
                }}
                selectedItems={g.selectedItems}
                selectText="Select Items"
                searchInputPlaceholderText="Search items..."
                displayKey="name"
                hideSubmitButton
                textColor="#000"
              />

              <Text style={styles.label}>Saral ID:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Saral Id"
                value={g.farmerSaralId}
                onChangeText={(text) => {
                  const updated = groups.map((grp) =>
                    grp.id === g.id ? { ...grp, farmerSaralId: text } : grp
                  );
                  setGroups(updated);
                }}
                placeholderTextColor="#999"
              />

              {g.selectedItems.map((item) => (
                <View key={item} style={styles.itemSection}>
                  <Text style={styles.itemLabel}>{item}</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Enter defective count"
                    value={g.itemDefectives[item]}
                    onChangeText={(text) => {
                      const updatedGroups = groups.map((grp) => {
                        if (grp.id === g.id) {
                          return {
                            ...grp,
                            itemDefectives: { ...grp.itemDefectives, [item]: text },
                          };
                        }
                        return grp;
                      });
                      setGroups(updatedGroups);
                    }}
                    placeholderTextColor="#999"
                  />
                </View>
              ))}
            </View>
          ))}

          {/* Add new group */}
          <TouchableOpacity style={styles.addButton} onPress={addGroup}>
            <Icon name="add-circle-outline" size={24} color="#000" />
            <Text style={styles.addText}>Add More</Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Transfer Items</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 24 },
  section: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fbd33b",
    borderRadius: 10,
    elevation: 4,
  },
  label: { fontSize: 16, fontWeight: "600", color: "#070604", marginBottom: 8 },
  picker: {
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 50,
    color: "#000",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  groupContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  groupTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  itemSection: {
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
  },
  itemLabel: { fontSize: 16, fontWeight: "600", color: "#444", marginBottom: 6 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addText: { fontSize: 16, fontWeight: "600", marginLeft: 6, color: "#000" },
  submitButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});

export default ThirdPartyOutgoingStock;
