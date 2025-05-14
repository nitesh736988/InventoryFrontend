// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import {Picker} from '@react-native-picker/picker';
// import CheckBox from '@react-native-community/checkbox';
// import axios from 'axios';
// import {API_URL} from '@env';
// import {useNavigation} from '@react-navigation/native';

// const OutgoingDataInServiceMh = () => {
//   const [servicePerson, setServicePerson] = useState([]);
//   const [systems, setSystems] = useState([]);
//   const [items, setItems] = useState([]);
//   const [selectedServicePerson, setSelectedServicePerson] = useState('');
//   const [selectedSystem, setSelectedSystem] = useState('');
//   const [selectedItem, setSelectedItem] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [panelNumbers, setPanelNumbers] = useState([]);
//   const [selectedSubItems, setSelectedSubItems] = useState({});
//   const [pumpNumber, setPumpNumber] = useState('');
//   const [controllerNumber, setControllerNumber] = useState('');
//   const [rmuNumber, setRmuNumber] = useState('');
//   const [farmerSaralId, setFarmerSaralId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchServicePersons = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/service-survey-persons?state=Maharashtra`,
//         );
//         setServicePerson(response?.data?.data);
//       } catch (error) {
//         handleApiError(error, 'Failed to fetch service persons');
//       }
//     };

//     const fetchSystems = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/show-systems`,
//         );
//         setSystems(response?.data?.data);
//       } catch (error) {
//         handleApiError(error, 'Failed to fetch systems');
//       }
//     };

//     fetchServicePersons();
//     fetchSystems();
//   }, []);

//   useEffect(() => {
//     if (selectedSystem) {
//       fetchItemsForSystem();
//     }
//   }, [selectedSystem]);

//   useEffect(() => {
//     if (selectedItem) {
//       setQuantity('');
//       setPanelNumbers([]);
//       setPumpNumber('');
//       setControllerNumber('');
//       setRmuNumber('');
//       const item = items.find(i => i.systemItemId._id === selectedItem);
//       if (item && item.subItems.length > 0) {
//         const initialSelected = {};
//         item.subItems.forEach(subItem => {
//           initialSelected[subItem.subItemId._id] = false;
//         });
//         setSelectedSubItems(initialSelected);
//       } else {
//         setSelectedSubItems({});
//       }
//     }
//   }, [selectedItem, items]);

//   useEffect(() => {
//     if (selectedItem && quantity) {
//       const item = items.find(i => i.systemItemId._id === selectedItem);
//       if (item?.systemItemId.itemName.toLowerCase().includes('solar panel')) {
//         const qty = parseInt(quantity, 10) || 0;
//         setPanelNumbers(Array(qty).fill(''));
//       }
//     }
//   }, [quantity, selectedItem]);

//   const fetchItemsForSystem = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${API_URL}/warehouse-admin/show-items-subItems?systemId=${selectedSystem}`,
//       );
//       setItems(response?.data?.data);
//       setSelectedItem('');
//     } catch (error) {
//       handleApiError(error, 'Failed to fetch items for system');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleSubItemSelection = subItemId => {
//     setSelectedSubItems(prev => ({
//       ...prev,
//       [subItemId]: !prev[subItemId],
//     }));
//   };

//   const handleSerialNumberChange = (index, value) => {
//     const newSerialNumbers = [...panelNumbers];
//     newSerialNumbers[index] = value;
//     setPanelNumbers(newSerialNumbers);
//   };

//   const handleQuantityChange = text => {
//     if (/^\d*$/.test(text)) {
//       setQuantity(text);
//     }
//   };

//   const getSelectedItem = () => {
//     return items.find(i => i.systemItemId._id === selectedItem);
//   };

//   const getSelectedItemName = () => {
//     return getSelectedItem()?.systemItemId?.itemName || '';
//   };

//   const isSolarPanel = () =>
//     getSelectedItemName().toLowerCase().includes('solar panel');

//   const handleApiError = (error, defaultMessage) => {
//     const errorMessage =
//       error.response?.data?.message || error.message || defaultMessage;
//     Alert.alert('Error', typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
//   };

//   const validateInput = () => {
//     if (!selectedServicePerson) {
//       Alert.alert('Error', 'Please select a service person');
//       return false;
//     }
//     if (!selectedSystem) {
//       Alert.alert('Error', 'Please select a system');
//       return false;
//     }
//     if (!selectedItem) {
//       Alert.alert('Error', 'Please select an item');
//       return false;
//     }
//     if (!quantity || isNaN(quantity) {
//       Alert.alert('Error', 'Please enter a valid quantity');
//       return false;
//     }
//     if (!farmerSaralId) {
//       Alert.alert('Error', 'Please enter Farmer Saral ID');
//       return false;
//     }

//     if (isSolarPanel() && panelNumbers.some(sn => !sn.trim())) {
//       Alert.alert('Error', 'Please enter all serial numbers');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateInput()) return;

//     const selectedItemData = getSelectedItem();
//     const selectedSubItemsList = Object.keys(selectedSubItems).filter(
//       key => selectedSubItems[key],
//     );

//     const data = {
//       farmerSaralId: farmerSaralId.trim(),
//       empId: selectedServicePerson,
//       systemId: selectedSystem,
//       itemsList: [
//         {
//           systemItemId: selectedItem,
//           quantity: parseInt(quantity, 10),
//           ...(selectedSubItemsList.length > 0 && {subItems: selectedSubItemsList}),
//         },
//       ],
//       ...(isSolarPanel() && {panelNumbers}),
//       ...(pumpNumber && {pumpNumber: pumpNumber.trim()}),
//       ...(controllerNumber && {controllerNumber: controllerNumber.trim()}),
//       ...(rmuNumber && {rmuNumber: rmuNumber.trim()}),
//     };

//     try {
//       setLoading(true);
//       await axios.post(
//         `${API_URL}/warehouse-admin/add-new-installation`,
//         data,
//         {headers: {'Content-Type': 'application/json'}},
//       );

//       Alert.alert('Success', 'Transaction saved successfully', [
//         {text: 'OK', onPress: () => navigation.goBack()},
//       ]);
//     } catch (error) {
//       handleApiError(error, 'Failed to submit data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSelectedServicePerson('');
//     setSelectedSystem('');
//     setSelectedItem('');
//     setQuantity('');
//     setPanelNumbers([]);
//     setPumpNumber('');
//     setControllerNumber('');
//     setRmuNumber('');
//     setFarmerSaralId('');
//     setSelectedSubItems({});
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.form}>
//           {loading && <ActivityIndicator size="large" color="#070604" />}

//           <Text style={styles.label}>Farmer Saral ID:</Text>
//           <TextInput
//             style={styles.input}
//             value={farmerSaralId}
//             onChangeText={setFarmerSaralId}
//             placeholder="Enter Farmer Saral ID"
//             editable={!loading}
//           />

//           <Text style={styles.label}>Service Person:</Text>
//           <Picker
//             selectedValue={selectedServicePerson}
//             onValueChange={setSelectedServicePerson}
//             style={styles.picker}
//             enabled={!loading}>
//             <Picker.Item label="Select Service Person" value="" />
//             {servicePerson.map(person => (
//               <Picker.Item
//                 key={person._id}
//                 label={person.name}
//                 value={person._id}
//               />
//             ))}
//           </Picker>

//           <Text style={styles.label}>System:</Text>
//           <Picker
//             selectedValue={selectedSystem}
//             onValueChange={setSelectedSystem}
//             style={styles.picker}
//             enabled={!loading}>
//             <Picker.Item label="Select System" value="" />
//             {systems.map(system => (
//               <Picker.Item
//                 key={system._id}
//                 label={system.systemName}
//                 value={system._id}
//               />
//             ))}
//           </Picker>

//           {items.length > 0 && (
//             <>
//               <Text style={styles.label}>Select Item:</Text>
//               <Picker
//                 selectedValue={selectedItem}
//                 onValueChange={setSelectedItem}
//                 style={styles.picker}
//                 enabled={!loading}>
//                 <Picker.Item label="Select Item" value="" />
//                 {items.map(item => (
//                   <Picker.Item
//                     key={item.systemItemId._id}
//                     label={`${item.systemItemId.itemName} (${item.availableQuantity} available)`}
//                     value={item.systemItemId._id}
//                   />
//                 ))}
//               </Picker>
//             </>
//           )}

//           {selectedItem && (
//             <>
//               <Text style={styles.label}>Quantity:</Text>
//               <TextInput
//                 style={styles.input}
//                 value={quantity}
//                 onChangeText={handleQuantityChange}
//                 keyboardType="numeric"
//                 placeholder="Enter quantity"
//                 editable={!loading}
//               />
//             </>
//           )}

//           {isSolarPanel() && quantity && (
//             <>
//               <Text style={styles.label}>Enter Panel Numbers:</Text>
//               {panelNumbers.map((sn, index) => (
//                 <TextInput
//                   key={index}
//                   style={styles.input}
//                   value={sn}
//                   onChangeText={text => handleSerialNumberChange(index, text)}
//                   placeholder={`Panel ${index + 1} Serial Number`}
//                   editable={!loading}
//                 />
//               ))}
//             </>
//           )}

//           {selectedItem && Object.keys(selectedSubItems).length > 0 && (
//             <View style={styles.subItemsContainer}>
//               <Text style={styles.label}>Select Sub-Items:</Text>
//               {items
//                 .find(i => i.systemItemId._id === selectedItem)
//                 .subItems.map(subItem => (
//                   <View key={subItem.subItemId._id} style={styles.subItemRow}>
//                     <CheckBox
//                       value={selectedSubItems[subItem.subItemId._id]}
//                       onValueChange={() => toggleSubItemSelection(subItem.subItemId._id)}
//                       disabled={loading}
//                     />
//                     <Text style={styles.subItemText}>
//                       {subItem.subItemId.subItemName}
//                     </Text>
//                   </View>
//                 ))}
//             </View>
//           )}

//           {getSelectedItemName().toLowerCase().includes('pump') && (
//             <>
//               <Text style={styles.label}>Pump Number:</Text>
//               <TextInput
//                 style={styles.input}
//                 value={pumpNumber}
//                 onChangeText={setPumpNumber}
//                 placeholder="Enter Pump Number"
//                 editable={!loading}
//               />
//             </>
//           )}

//           {getSelectedItemName().toLowerCase().includes('controller') && (
//             <>
//               <Text style={styles.label}>Controller Number:</Text>
//               <TextInput
//                 style={styles.input}
//                 value={controllerNumber}
//                 onChangeText={setControllerNumber}
//                 placeholder="Enter Controller Number"
//                 editable={!loading}
//               />
//             </>
//           )}

//           {getSelectedItemName().toLowerCase().includes('rmu') && (
//             <>
//               <Text style={styles.label}>RMU Number:</Text>
//               <TextInput
//                 style={styles.input}
//                 value={rmuNumber}
//                 onChangeText={setRmuNumber}
//                 placeholder="Enter RMU Number"
//                 editable={!loading}
//               />
//             </>
//           )}

//           <TouchableOpacity
//             style={[styles.button, loading && styles.disabledButton]}
//             onPress={handleSubmit}
//             disabled={loading}>
//             <Text style={styles.buttonText}>
//               {loading ? 'Submitting...' : 'Submit'}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.button, styles.resetButton]}
//             onPress={resetForm}
//             disabled={loading}>
//             <Text style={styles.buttonText}>Reset Form</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 20, backgroundColor: '#ffffff'},
//   scrollContainer: {flexGrow: 1, paddingBottom: 20},
//   form: {
//     padding: 20,
//     backgroundColor: '#fbd33b',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: '#070604',
//   },
//   picker: {
//     height: 50,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#000',
//     marginBottom: 15,
//   },
//   input: {
//     backgroundColor: '#f9f9f9',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 15,
//     fontSize: 14,
//     color: '#070604',
//   },
//   button: {
//     backgroundColor: '#070604',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   disabledButton: {
//     backgroundColor: '#555',
//   },
//   resetButton: {
//     backgroundColor: '#d9534f',
//   },
//   buttonText: {
//     color: '#fbd33b',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   subItemsContainer: {
//     marginLeft: 10,
//     marginBottom: 15,
//   },
//   subItemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   subItemText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#070604',
//   },
// });

// export default OutgoingDataInServiceMh;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';

const OutgoingDataInServiceMh = () => {
  const [servicePerson, setServicePerson] = useState([]);
  const [systems, setSystems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedServicePerson, setSelectedServicePerson] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [panelNumbers, setPanelNumbers] = useState([]);
  const [selectedSubItems, setSelectedSubItems] = useState({});
  const [pumpNumber, setPumpNumber] = useState('');
  const [controllerNumber, setControllerNumber] = useState('');
  const [rmuNumber, setRmuNumber] = useState('');
  const [farmerSaralId, setFarmerSaralId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchServicePersons = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/service-survey-persons?state=Maharashtra`,
        );
        setServicePerson(response?.data?.data);
      } catch (error) {
        Alert.alert('Error', JSON.stringify(error.response.data?.message));
      }
    };

    const fetchSystems = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/show-systems`,
        );
        setSystems(response?.data?.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch systems');
      }
    };

    fetchServicePersons();
    fetchSystems();
  }, []);

  useEffect(() => {
    if (selectedSystem) {
      fetchItemsForSystem();
    }
  }, [selectedSystem]);

  useEffect(() => {
    if (selectedItem) {
      setQuantity('');
      setPanelNumbers([]);
      setPumpNumber('');
      setControllerNumber('');
      setRmuNumber('');
      const item = items.find(i => i.systemItemId._id === selectedItem);
      if (item && item.subItems.length > 0) {
        const initialSelected = {};
        item.subItems.forEach(subItem => {
          initialSelected[subItem.subItemId._id] = false;
        });
        setSelectedSubItems(initialSelected);
      } else {
        setSelectedSubItems({});
      }
    }
  }, [selectedItem, items]);

  useEffect(() => {
    if (selectedItem && quantity) {
      const item = items.find(i => i.systemItemId._id === selectedItem);
      if (item?.systemItemId.itemName.includes('Solar Panel')) {
        const qty = parseInt(quantity, 10) || 0;
        setPanelNumbers(Array(qty).fill(''));
      }
    }
  }, [quantity, selectedItem]);

  const fetchItemsForSystem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/warehouse-admin/show-items-subItems?systemId=${selectedSystem}`,
      );
      setItems(response?.data?.data);
      setSelectedItem('');
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch items for system');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubItemSelection = subItemId => {
    setSelectedSubItems(prev => ({
      ...prev,
      [subItemId]: !prev[subItemId],
    }));
  };

  const handleSerialNumberChange = (index, value) => {
    const newSerialNumbers = [...panelNumbers];
    newSerialNumbers[index] = value;
    setPanelNumbers(newSerialNumbers);
  };

  const getSelectedItem = () => {
    return items.find(i => i.systemItemId._id === selectedItem);
  };

  const getSelectedItemName = () => {
    return getSelectedItem()?.systemItemId?.itemName || '';
  };

  const isSolarPanel = () =>
    getSelectedItemName().toLowerCase().includes('solar panel');

  const validateInput = () => {
    if (!selectedServicePerson) {
      Alert.alert('Error', 'Please select a service person');
      return false;
    }
    if (!selectedSystem) {
      Alert.alert('Error', 'Please select a system');
      return false;
    }
    if (!selectedItem) {
      Alert.alert('Error', 'Please select an item');
      return false;
    }
    if (!quantity) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return false;
    }
    if (!farmerSaralId) {
      Alert.alert('Error', 'Please enter Farmer Saral ID');
      return false;
    }

    if (isSolarPanel() && panelNumbers.some(sn => !sn)) {
      Alert.alert('Error', 'Please enter all serial numbers');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    const selectedItemData = getSelectedItem();

    const data = {
      farmerSaralId: farmerSaralId,
      empId: selectedServicePerson,
      systemId: selectedSystem,
      itemsList: [{
        systemItemId: selectedItem,
        quantity: parseInt(quantity, 10)
      }],
      ...(isSolarPanel() && {panelNumbers}),
      ...(pumpNumber && {pumpNumber}),
      ...(controllerNumber && {controllerNumber}),
      ...(rmuNumber && {rmuNumber}),
    };

    console.log('Data to be sent:', data);

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/warehouse-admin/add-new-installation`,
        data,
        {headers: {'Content-Type': 'application/json'}},
      );
      console.log('response:', response);
      console.log('response data:', response.data);

        Alert.alert('Success', 'Transaction saved successfully');
        resetForm();
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error.response?.data?.message));
      console.log('Error:', error);
      console.log('Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedServicePerson('');
    setSelectedSystem('');
    setSelectedItem('');
    setQuantity('');
    setPanelNumbers([]);
    setPumpNumber('');
    setControllerNumber('');
    setRmuNumber('');
    setFarmerSaralId('');
    setItems([]);
    setSelectedSubItems({});
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.label}>Farmer Saral ID:</Text>
          <TextInput
            style={styles.input}
            value={farmerSaralId}
            onChangeText={setFarmerSaralId}
            placeholder="Enter Farmer Saral ID"
          />

          <Text style={styles.label}>Service Person:</Text>
          <Picker
            selectedValue={selectedServicePerson}
            onValueChange={setSelectedServicePerson}
            style={styles.picker}>
            <Picker.Item label="Select Service Person" value="" />
            {servicePerson.map(person => (
              <Picker.Item
                key={person._id}
                label={person.name}
                value={person._id}
              />
            ))}
          </Picker>

          <Text style={styles.label}>System:</Text>
          <Picker
            selectedValue={selectedSystem}
            onValueChange={setSelectedSystem}
            style={styles.picker}>
            <Picker.Item label="Select System" value="" />
            {systems.map(system => (
              <Picker.Item
                key={system._id}
                label={system.systemName}
                value={system._id}
              />
            ))}
          </Picker>

          {items.length > 0 && (
            <>
              <Text style={styles.label}>Select Item:</Text>
              <Picker
                selectedValue={selectedItem}
                onValueChange={setSelectedItem}
                style={styles.picker}>
                <Picker.Item label="Select Item" value="" />
                {items.map(item => (
                  <Picker.Item
                    key={item.systemItemId._id}
                    label={`${item.systemItemId.itemName} )`}
                    value={item.systemItemId._id}
                  />
                ))}
              </Picker>
            </>
          )}

          {selectedItem && (
            <>
              <Text style={styles.label}>Quantity:</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="Enter quantity"
              />
            </>
          )}

          {isSolarPanel() && quantity && (
            <>
              <Text style={styles.label}>Enter Panel Numbers:</Text>
              {panelNumbers.map((sn, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  value={sn}
                  onChangeText={text => handleSerialNumberChange(index, text)}
                  placeholder={`Panel ${index + 1} Serial Number`}
                />
              ))}
            </>
          )}

          <Text style={styles.label}>Pump Number:</Text>
          <TextInput
            style={styles.input}
            value={pumpNumber}
            onChangeText={setPumpNumber}
            placeholder="Enter Pump Number"
          />

          <Text style={styles.label}>Controller Number:</Text>
          <TextInput
            style={styles.input}
            value={controllerNumber}
            onChangeText={setControllerNumber}
            placeholder="Enter Controller Number"
          />

          <Text style={styles.label}>RMU Number:</Text>
          <TextInput
            style={styles.input}
            value={rmuNumber}
            onChangeText={setRmuNumber}
            placeholder="Enter RMU Number"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#ffffff'},
  scrollContainer: {flexGrow: 1, paddingBottom: 20},
  form: {
    padding: 20,
    backgroundColor: '#fbd33b',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#070604',
  },
  picker: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    color: '#070604',
  },
  button: {
    backgroundColor: '#070604',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fbd33b',
    fontSize: 16,
    fontWeight: '600',
  },
  subItemsContainer: {
    marginLeft: 10,
    marginBottom: 15,
  },
  subItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  subItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#070604',
  },
});

export default OutgoingDataInServiceMh;
