// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import api from "api";
// import { API_URL } from "@env";

// const IncomingStock = ({ route, navigation }) => {
//   const { outgoingId, receivedItems } = route.params;

//   const [farmersData, setFarmersData] = useState(
//     receivedItems.map((farmer) => ({
//       farmerSaralId: farmer.farmerSaralId,
//       items: farmer.items.map((item) => ({
//         itemName: item.itemName,
//         quantity: item.quantity?.toString() || "",
//       })),
//     }))
//   );

//   const [remarks, setRemarks] = useState("");
//   const [driverName, setDriverName] = useState("");
//   const [driverContact, setDriverContact] = useState("");
//   const [vehicleNumber, setVehicleNumber] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Handle quantity input
//   const handleItemQuantityChange = (farmerIndex, itemIndex, value) => {
//     const updated = [...farmersData];
//     updated[farmerIndex].items[itemIndex].quantity = value;
//     setFarmersData(updated);
//   };

//   // Submit data
//   const handleSubmit = async () => {
//     const hasEmptyQty = farmersData.some((farmer) =>
//       farmer.items.some((item) => !item.quantity)
//     );

//     if (hasEmptyQty) {
//       Alert.alert("Validation Error", "Please enter quantity for all items.");
//       return;
//     }

//     const payload = {
//       outgoingId,
//       farmers: farmersData.map((farmer) => ({
//         farmerSaralId: farmer.farmerSaralId,
//         receivedItems: farmer.items.map((item) => ({
//           itemName: item.itemName,
//           quantity: parseInt(item.quantity, 10),
//         })),
//       })),
//       remarks: remarks.trim(),
//       driverName: driverName.trim(),
//       driverContact: driverContact.trim(),
//       vehicleNumber: vehicleNumber.trim(),
//     };

//     console.log("Payload Sent:", JSON.stringify(payload, null, 2));

//     try {
//       setLoading(true);
//       await api.post(`${API_URL}/warehouse-admin/add-receiving-items`, payload);
//       Alert.alert("Success", "Items received successfully!");
//       navigation.goBack();
//     } catch (error) {
//       console.log(error.response?.data || error.message);
//       Alert.alert("Error", error.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Incoming Stock</Text>

//       {farmersData.map((farmer, fIndex) => (
//         <View key={fIndex} style={styles.farmerCard}>
//           <Text style={styles.farmerId}>
//             Farmer Saral ID: {farmer.farmerSaralId}
//           </Text>

//           <Text style={styles.label}>Received Items:</Text>
//           {farmer.items.map((item, iIndex) => (
//             <View key={iIndex} style={styles.itemRow}>
//               <Text style={styles.itemText}>• {item.itemName}</Text>
//               <TextInput
//                 style={styles.input}
//                 value={item.quantity}
//                 keyboardType="numeric"
//                 onChangeText={(text) =>
//                   handleItemQuantityChange(fIndex, iIndex, text)
//                 }
//                 placeholder="Quantity"
//               />
//             </View>
//           ))}
//         </View>
//       ))}

//       {/* Remarks */}
//       <Text style={styles.label}>Remarks:</Text>
//       <TextInput
//         value={remarks}
//         onChangeText={setRemarks}
//         style={styles.textArea}
//         placeholder="Enter remarks"
//         multiline
//       />

//       {/* Driver Details - shown after Remarks */}
//       <Text style={styles.label}>Driver Name:</Text>
//       <TextInput
//         value={driverName}
//         onChangeText={setDriverName}
//         style={styles.input}
//         placeholder="Enter driver name"
//       />

//       <Text style={styles.label}>Driver Contact:</Text>
//       <TextInput
//         value={driverContact}
//         onChangeText={setDriverContact}
//         style={styles.input}
//         keyboardType="numeric"
//         placeholder="Enter driver contact number"
//       />

//       <Text style={styles.label}>Vehicle Number:</Text>
//       <TextInput
//         value={vehicleNumber}
//         onChangeText={setVehicleNumber}
//         style={styles.input}
//         placeholder="Enter vehicle number"
//       />

//       {/* Submit */}
//       <TouchableOpacity
//         style={styles.submitButton}
//         onPress={handleSubmit}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.submitText}>Submit</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default IncomingStock;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fbd33b",
//     padding: 16,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "black",
//     marginBottom: 16,
//   },
//   farmerCard: {
//     backgroundColor: "white",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   farmerId: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "black",
//   },
//   label: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "black",
//     marginTop: 10,
//   },
//   itemRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginVertical: 6,
//   },
//   itemText: {
//     fontSize: 14,
//     color: "#333",
//     flex: 1,
//   },
//   input: {
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 6,
//     marginTop: 6,
//     fontSize: 15,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   textArea: {
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 6,
//     marginTop: 6,
//     height: 70,
//     textAlignVertical: "top",
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   submitButton: {
//     backgroundColor: "#007bff",
//     paddingVertical: 12,
//     borderRadius: 6,
//     marginTop: 20,
//     alignItems: "center",
//   },
//   submitText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import api from '../../auth/api';;
import {API_URL} from '@env';

const IncomingStock = ({route, navigation}) => {
  const {outgoingId, receivedItems} = route.params;

  console.log('Received Items:', JSON.stringify(receivedItems, null, 2));

  // Initialize with isFullyReceived + receivedQuantity
  const [farmersData, setFarmersData] = useState(
    receivedItems.map(farmer => ({
      farmerSaralId: farmer.farmerSaralId,
      items: farmer.items.map(item => ({
        itemName: item.itemName,
        quantity: item.quantity?.toString() || '',
        receivedQuantity: item.receivedQuantity || 0,
        isFullyReceived: item.isFullyReceived || false,
      })),
    })),
  );

  const [remarks, setRemarks] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverContact, setDriverContact] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);


  // Handle quantity input
  const handleItemQuantityChange = (farmerIndex, itemIndex, value) => {
    const updated = [...farmersData];
    updated[farmerIndex].items[itemIndex].quantity = value;
    setFarmersData(updated);
  };

  // Submit data
  const handleSubmit = async () => {
    const hasEmptyQty = farmersData.some(farmer =>
      farmer.items.some(
        item =>
          !item.isFullyReceived &&
          (item.quantity === '' || isNaN(item.quantity)),
      ),
    );

    if (hasEmptyQty) {
      Alert.alert(
        'Validation Error',
        'Please enter quantity for all items not fully received.',
      );
      return;
    }

    // ✅ Filter out zero-quantity items and skip fully received ones
    const filteredFarmers = farmersData
      .map(farmer => ({
        farmerSaralId: farmer.farmerSaralId,
        receivedItems: farmer.items
          .filter(
            item => !item.isFullyReceived && parseInt(item.quantity, 10) > 0,
          )
          .map(item => ({
            itemName: item.itemName,
            quantity: parseInt(item.quantity, 10),
          })),
      }))
      .filter(farmer => farmer.receivedItems.length > 0);

    if (filteredFarmers.length === 0) {
      Alert.alert(
        'Validation Error',
        'No items to receive (all fully received or zero quantity).',
      );
      return;
    }

    const payload = {
      outgoingId,
      farmers: filteredFarmers,
      remarks: remarks.trim(),
      driverName: driverName.trim(),
      driverContact: driverContact.trim(),
      vehicleNumber: vehicleNumber.trim(),
    };

    console.log('Payload Sent:', JSON.stringify(payload, null, 2));

    try {
      setLoading(true);
      await api.post(
        `${API_URL}/warehouse-admin/add-receiving-items`,
        payload,
      );
      Alert.alert('Success', 'Items received successfully!');
      navigation.goBack();
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Incoming Stock</Text>

      {farmersData.map((farmer, fIndex) => (
        <View key={fIndex} style={styles.farmerCard}>
          <Text style={styles.farmerId}>
            Farmer Saral ID: {farmer.farmerSaralId}
          </Text>

          <Text style={styles.label}>Received Items:</Text>
          {farmer.items.map((item, iIndex) => (
            <View key={iIndex} style={styles.itemRow}>
              <View style={{flex: 1}}>
                <Text style={styles.itemText}>• {item.itemName}</Text>
                <Text style={styles.subText}>
                  Received: {item.receivedQuantity}
                </Text>
                {item.isFullyReceived && (
                  <Text style={styles.receivedText}>(Fully Received)</Text>
                )}
              </View>

              {/* Only show quantity input if not fully received */}
              {!item.isFullyReceived ? (
                <TextInput
                  style={styles.input}
                  value={item.quantity}
                  keyboardType="numeric"
                  onChangeText={text =>
                    handleItemQuantityChange(fIndex, iIndex, text)
                  }
                  placeholder="Qty"
                />
              ) : (
                <View style={styles.disabledBox}>
                  <Text style={styles.disabledText}>✓ Done</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      ))}

      {/* Remarks */}
      <Text style={styles.label}>Remarks:</Text>
      <TextInput
        value={remarks}
        onChangeText={setRemarks}
        style={styles.textArea}
        placeholder="Enter remarks"
        multiline
      />

      {/* Driver Details */}
      <Text style={styles.label}>Driver Name:</Text>
      <TextInput
        value={driverName}
        onChangeText={setDriverName}
        style={styles.input}
        placeholder="Enter driver name"
      />

      <Text style={styles.label}>Driver Contact:</Text>
      <TextInput
        value={driverContact}
        onChangeText={setDriverContact}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter driver contact number"
      />

      <Text style={styles.label}>Vehicle Number:</Text>
      <TextInput
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
        style={styles.input}
        placeholder="Enter vehicle number"
      />

      {/* Submit */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default IncomingStock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbd33b',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  farmerCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  farmerId: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
    marginTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  subText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
    height: 70,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  receivedText: {
    color: 'green',
    fontSize: 13,
    marginTop: 2,
  },
  disabledBox: {
    backgroundColor: '#d4edda',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  disabledText: {
    color: 'green',
    fontWeight: '600',
  },
});
