// import { View, Text, StyleSheet, FlatList, Alert, TextInput } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { API_URL } from '@env';

// const NewInstallationTransactionData = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/warehouse-admin/new-installation-data`);
//       setData(response.data.data);
//       setFilteredData(response.data.data); // Initialize filteredData with all data
//     } catch (error) {
//       console.log('Error fetching data:', error?.response?.data?.message);
//       Alert.alert('Error', error?.response?.data?.message || 'Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (search) {
//       setFilteredData(
//         data.filter((item) => {
//           const searchText = search.toLowerCase();
//           return (
//             (item.farmerSaralId || '').toLowerCase().includes(searchText) ||
//             (item.farmerDetails?.farmerName || '').toLowerCase().includes(searchText) ||
//             (item.farmerDetails?.contact || '').toLowerCase().includes(searchText) ||
//             (item.farmerDetails?.village || '').toLowerCase().includes(searchText) ||
//             (item.farmerDetails?.district || '').toLowerCase().includes(searchText)
//           );
//         })
//       );
//     } else {
//       setFilteredData(data);
//     }
//   }, [search, data]);

//   const formatDate = (dateString) => {
//     try {
//       if (!dateString) return 'N/A';
//       const date = new Date(dateString);
//       return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-IN');
//     } catch {
//       return 'N/A';
//     }
//   };

//   const renderStatus = (accepted, installationDone) => {
//     if (accepted) {
//       return installationDone ? (
//         <Text style={[styles.statusText, styles.statusApproved]}>Approved - Installation Complete</Text>
//       ) : (
//         <Text style={[styles.statusText, styles.statusPendingInstallation]}>Approved - Pending Installation</Text>
//       );
//     }
//     return <Text style={[styles.statusText, styles.statusPending]}>Pending Approval</Text>;
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.statusContainer}>
//         <Text style={styles.statusLabel}>Status: </Text>
//         {renderStatus(item.accepted, item.installationDone)}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Farmer Information</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Name:</Text>
//           <Text style={styles.value}>{item.farmerDetails?.farmerName || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Saral ID:</Text>
//           <Text style={styles.value}>{item.farmerSaralId || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Contact:</Text>
//           <Text style={styles.value}>{item.farmerDetails?.contact || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Village:</Text>
//           <Text style={styles.value}>{item.farmerDetails?.village || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>District:</Text>
//           <Text style={styles.value}>{item.farmerDetails?.district || 'N/A'}</Text>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Service Person</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Name:</Text>
//           <Text style={styles.value}>{item.empId?.name || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Contact:</Text>
//           <Text style={styles.value}>{item.empId?.contact || 'N/A'}</Text>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Equipment Details</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Pump Number:</Text>
//           <Text style={styles.value}>{item.pumpNumber || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Controller Number:</Text>
//           <Text style={styles.value}>{item.controllerNumber || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>RMU Number:</Text>
//           <Text style={styles.value}>{item.rmuNumber || 'N/A'}</Text>
//         </View>
//         {item.motorNumber && (
//           <View style={styles.row}>
//             <Text style={styles.label}>Motor Number:</Text>
//             <Text style={styles.value}>{item.motorNumber}</Text>
//           </View>
//         )}
//       </View>

  

//       {item.panelNumbers?.length > 0 && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Panel Numbers ({item.panelNumbers.length})</Text>
//           <View style={styles.panelContainer}>
//             {item.panelNumbers.map((panel, index) => (
//               <Text key={index} style={styles.panelNumber}>{panel || 'N/A'}</Text>
//             ))}
//           </View>
//         </View>
//       )}

//       {item.extraPanelNumbers?.length > 0 && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Extra Panel Numbers ({item.extraPanelNumbers.length})</Text>
//           <View style={styles.panelContainer}>
//             {item.extraPanelNumbers.map((panel, index) => (
//               <Text key={index} style={styles.panelNumber}>{panel || 'N/A'}</Text>
//             ))}
//           </View>
//         </View>
//       )}

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Items List ({item.itemsList?.length || 0})</Text>
//         {item.itemsList?.map((listItem, index) => (
//           <View key={index} style={styles.row}>
//             <Text style={styles.label}>{listItem.systemItemId?.itemName || 'Unknown Item'}:</Text>
//             <Text style={styles.value}>{listItem.quantity || 0}</Text>
//           </View>
//         ))}
//       </View>

//       {item.extraItemsList?.length > 0 && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Extra Items List ({item.extraItemsList.length})</Text>
//           {item.extraItemsList.map((listItem, index) => (
//             <View key={index} style={styles.row}>
//               <Text style={styles.label}>{listItem.systemItemId?.itemName || 'Unknown Item'}:</Text>
//               <Text style={styles.value}>{listItem.quantity || 0}</Text>
//             </View>
//           ))}
//         </View>
//       )}

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Dates</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Sending Date:</Text>
//           <Text style={styles.value}>{formatDate(item.sendingDate)}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Created At:</Text>
//           <Text style={styles.value}>{formatDate(item.createdAt)}</Text>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Warehouse</Text>
//         <Text style={styles.value}>{item.warehouseId?.warehouseName || 'N/A'}</Text>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>New Installation Transactions</Text>
      
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by farmer name, ID, contact, village..."
//           value={search}
//           onChangeText={setSearch}
//         />
//       </View>

//       {filteredData.length === 0 ? (
//         <View style={styles.noData}>
//           <Text>No installation data found</Text>
//           {search && <Text>for search term: "{search}"</Text>}
//         </View>
//       ) : (
//         <FlatList
//           data={filteredData}
//           keyExtractor={(item) => item._id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           ListHeaderComponent={<View style={{ height: 10 }} />}
//           ListFooterComponent={<View style={{ height: 20 }} />}
//           refreshing={loading}
//           onRefresh={fetchData}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#333',
//   },
//   searchContainer: {
//     paddingHorizontal: 15,
//     marginBottom: 10,
//   },
//   searchInput: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   noData: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   listContent: {
//     paddingHorizontal: 15,
//     paddingBottom: 20,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     padding: 8,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 5,
//   },
//   statusLabel: {
//     fontWeight: 'bold',
//   },
//   statusText: {
//     fontWeight: 'bold',
//   },
//   statusPending: {
//     color: '#dc3545', // red
//   },
//   statusPendingInstallation: {
//     color: '#fd7e14', // orange
//   },
//   statusApproved: {
//     color: '#28a745', // green
//   },
//   section: {
//     marginBottom: 15,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   sectionTitle: {
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#495057',
//     fontSize: 16,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   label: {
//     color: '#6c757d',
//     flex: 1,
//     color: '#000'
//   },
//   value: {
//     flex: 1,
//     textAlign: 'right',
//     fontWeight: '500',
//     color: '#000'
//   },
//   panelContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   panelNumber: {
//     backgroundColor: '#e9ecef',
//     borderRadius: 4,
//     padding: 4,
//     marginRight: 6,
//     marginBottom: 6,
//   },
// });

// export default NewInstallationTransactionData;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MaharashtraInstallationForm = () => {
  const [farmerSaralId, setFarmerSaralId] = useState('');
  const [servicePerson, setServicePerson] = useState('');
  const [system, setSystem] = useState('');
  const [controllerNumber, setControllerNumber] = useState('918276363677');
  const [rmuNumber, setRmuNumber] = useState('');
  const [motorNumber, setMotorNumber] = useState('');

  const validateSaralId = () => {
    if (!farmerSaralId) {
      Alert.alert('Error', 'Please enter Farmer Saral ID');
      return;
    }
    // Here you would typically make an API call to validate the ID
    Alert.alert('Success', 'Farmer Saral ID validated successfully');
  };

  const handleSubmit = () => {
    if (!farmerSaralId || !servicePerson || !system || !controllerNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    // Here you would typically submit the form data to your backend
    Alert.alert('Success', 'Installation data submitted successfully');
  };

  const simulateScan = (field) => {
    // This would typically integrate with a barcode/QR scanner
    // For demo purposes, we'll just show an alert
    Alert.alert(
      'Scan Simulation',
      `Placeholder for ${field} scanning functionality`,
      [{ text: 'OK', onPress: () => console.log('Scan simulated') }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Maharashtra</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Farmer Saral ID:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Farmer Saral ID"
          value={farmerSaralId}
          onChangeText={setFarmerSaralId}
        />
        <TouchableOpacity style={styles.button} onPress={validateSaralId}>
          <Text style={styles.buttonText}>Validate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.label}>Service Person:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={servicePerson}
            onValueChange={(itemValue) => setServicePerson(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Service Person" value="" />
            <Picker.Item label="Rajesh Kumar" value="rajesh" />
            <Picker.Item label="Suresh Patel" value="suresh" />
            <Picker.Item label="Mohan Singh" value="mohan" />
          </Picker>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.label}>System:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={system}
            onValueChange={(itemValue) => setSystem(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select System" value="" />
            <Picker.Item label="3HP Solar Pump System" value="3hp" />
            <Picker.Item label="5HP Solar Pump System" value="5hp" />
            <Picker.Item label="7.5HP Solar Pump System" value="7.5hp" />
          </Picker>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.label}>Controller Number:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            value={controllerNumber}
            onChangeText={setControllerNumber}
          />
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => simulateScan('Controller Number')}
          >
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.label}>RMU Number:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            placeholder="Enter RMU Number"
            value={rmuNumber}
            onChangeText={setRmuNumber}
          />
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => simulateScan('RMU Number')}
          >
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.label}>MOTOR Number:</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            placeholder="Enter Motor Number"
            value={motorNumber}
            onChangeText={setMotorNumber}
          />
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => simulateScan('Motor Number')}
          >
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#1f4e3d',
  },
  section: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  flexInput: {
    flex: 1,
    marginRight: 8,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1f4e3d',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: '#3a7ca5',
    padding: 12,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  submitButton: {
    backgroundColor: '#1f4e3d',
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default MaharashtraInstallationForm;