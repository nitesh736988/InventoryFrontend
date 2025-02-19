import React, { useState } from "react";
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from "react-native";

const ApprovalNewInstallation = ({ data }) => {
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleExpand = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedItems.includes(item._id);

    return (
      <View style={styles.card}>
        <Text style={styles.title}>Farmer Name: {item.farmerDetails.farmerName}</Text>
        <Text>Contact: {item.farmerDetails.contact}</Text>
        <Text>State: {item.farmerDetails.state}</Text>
        <Text>District: {item.farmerDetails.district}</Text>
        <Text>Warehouse: {item.warehouseId.warehouseName}</Text>
        <Text>Survey Person: {item.empId.name}</Text>
        <Text>Accepted: {item.accepted ? "Yes" : "No"}</Text>
        <Text>Installation Done: {item.installationDone ? "Yes" : "No"}</Text>
        
        {isExpanded && (
          <View>
            <Text>Pump Number: {item.pumpNumber}</Text>
            <Text>Controller Number: {item.controllerNumber}</Text>
            <Text>RMU Number: {item.rmuNumber}</Text>
            <Text>Panel Numbers: {item.panelNumbers.join(", ")}</Text>
            <Text>Items List:</Text>
            {item.itemsList.map((subItem, index) => (
              <Text key={index}>- {subItem.subItemId.subItemName} (Qty: {subItem.quantity})</Text>
            ))}
          </View>
        )}

        <TouchableOpacity onPress={() => toggleExpand(item._id)} style={styles.button}>
          <Text style={styles.buttonText}>{isExpanded ? "Show Less" : "Show More"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    margin: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ApprovalNewInstallation;
