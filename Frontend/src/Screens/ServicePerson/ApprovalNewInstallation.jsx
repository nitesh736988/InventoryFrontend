// import React, { useState } from "react";
// import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from "react-native";

// const ApprovalNewInstallation = ({ data }) => {
//   const [expandedItems, setExpandedItems] = useState([]);

//   const toggleExpand = (id) => {
//     setExpandedItems((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const renderItem = ({ item }) => {
//     const isExpanded = expandedItems.includes(item._id);

//     return (
//       <View style={styles.card}>
//         <Text style={styles.title}>Farmer Name: {item.farmerDetails.farmerName}</Text>
//         <Text>Contact: {item.farmerDetails.contact}</Text>
//         <Text>State: {item.farmerDetails.state}</Text>
//         <Text>District: {item.farmerDetails.district}</Text>
//         <Text>Warehouse: {item.warehouseId.warehouseName}</Text>
//         <Text>Survey Person: {item.empId.name}</Text>
//         <Text>Accepted: {item.accepted ? "Yes" : "No"}</Text>
//         <Text>Installation Done: {item.installationDone ? "Yes" : "No"}</Text>
        
//         {isExpanded && (
//           <View>
//             <Text>Pump Number: {item.pumpNumber}</Text>
//             <Text>Controller Number: {item.controllerNumber}</Text>
//             <Text>RMU Number: {item.rmuNumber}</Text>
//             <Text>Panel Numbers: {item.panelNumbers.join(", ")}</Text>
//             <Text>Items List:</Text>
//             {item.itemsList.map((subItem, index) => (
//               <Text key={index}>- {subItem.subItemId.subItemName} (Qty: {subItem.quantity})</Text>
//             ))}
//           </View>
//         )}

//         <TouchableOpacity onPress={() => toggleExpand(item._id)} style={styles.button}>
//           <Text style={styles.buttonText}>{isExpanded ? "Show Less" : "Show More"}</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <FlatList
//       data={data}
//       keyExtractor={(item) => item._id}
//       renderItem={renderItem}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     margin: 10,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   button: {
//     marginTop: 10,
//     backgroundColor: "#007bff",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

// export default ApprovalNewInstallation;


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const ApprovalNewInstallation = () => {
  const [installationData, setInstallationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://88.222.214.93:5000/service-person/show-new-install-data')
      .then((response) => {
        setInstallationData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render error if API call fails
  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  // Render the data if successfully fetched
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approval New Installation</Text>
      <FlatList
        data={installationData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/* Warehouse Name */}
            <Text>Warehouse Name: {item.warehouseId?.warehouseName}</Text>
            
            {/* Sub Item Name & Quantity */}
            {item.itemsList.map((subItem, index) => (
              <Text key={index}>
                Sub Item: {subItem.subItemId?.subItemName}, Quantity: {subItem.quantity}
              </Text>
            ))}
            
            {/* Pump and Controller Numbers */}
            <Text>Pump Number: {item.pumpNumber}</Text>
            <Text>Controller Number: {item.controllerNumber}</Text>
            <Text>RMU Number: {item.rmuNumber}</Text>

            {/* Farmer Details */}
            <Text>Farmer Name: {item.farmerDetails?.farmerName}</Text>
            <Text>Saral ID: {item.farmerDetails?.saralId}</Text>
            <Text>Contact: {item.farmerDetails?.contact}</Text>
            <Text>State: {item.farmerDetails?.state}</Text>
            <Text>District: {item.farmerDetails?.district}</Text>
            <Text>Village: {item.farmerDetails?.village}</Text>
            <Text>Block: {item.farmerDetails?.block}</Text>
            <Text>Installation Date: {item.farmerDetails?.installationDate}</Text>

            {/* Additional Fields */}
            <Text>Product: {item.farmerDetails?.product}</Text>
            <Text>HP: {item.farmerDetails?.HP}</Text>
            <Text>AC/DC: {item.farmerDetails?.AC_DC}</Text>
            <Text>Pump Type: {item.farmerDetails?.pump_type}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApprovalNewInstallation;

