// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import MultiSelect from 'react-native-multiple-select';
// import {Picker} from '@react-native-picker/picker';
// import axios from 'axios';
// import {API_URL} from '@env';
// import {useNavigation} from '@react-navigation/native';

// const AddTransaction = ({route}) => {
//   const {
//     farmerComplaintId,
//     farmerContact,
//     farmerName,  
//     farmerVillage,
//     farmerSaralId,
//   } = route.params || {};

//   const [servicePerson, setServicePerson] = useState([]);
//   const [selectedServicePerson, setSelectedServicePerson] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [allItems, setAllItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [allWarehouses, setAllWarehouses] = useState([]);
//   const [serialNumber, setSerialNumber] = useState('');
//   const [selectedWarehouse, setSelectedWarehouse] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isNewStock, setIsNewStock] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchServicePersons = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/service-team/all-service-persons`,
//         );
//         setServicePerson(response?.data?.data);
//       } catch (error) {
//         Alert.alert('Error', JSON.stringify(error.response.data?.message));
//       }
//     };

//     fetchServicePersons();
//   }, []);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/view-items`,
//         );
//         const items = response?.data?.items?.map((item, index) => ({
//           _id: index + 1,
//           itemName: item,
//         }));
//         setAllItems(items);
//         setFilteredItems(items);
//       } catch (error) {
//         Alert.alert('Error', JSON.stringify(error.response.data?.message));
//       }
//     };

//     const fetchWarehouses = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/get-warehouse`,
//         );
//         setAllWarehouses(response?.data?.warehouseName);
//       } catch (error) {
//         Alert.alert('Error', JSON.stringify(error.response.data?.message));
//         setAllWarehouses([]);
//       }
//     };

//     fetchItems();
//     fetchWarehouses();
//   }, []);

//   const handleSearch = query => {
//     setSearchQuery(query);
//     const filtered = allItems.filter(item =>
//       item.itemName.toLowerCase().includes(query.toLowerCase()),
//     );
//     setFilteredItems(filtered);

//     if (query && filtered.length === 0) {
//       Alert.alert('Error', 'No items match your search query.');
//     }
//   };

//   const handleItemSelect = selected => {
//     const validItems = selected.filter(item =>
//       filteredItems.some(filteredItem => filteredItem.itemName === item),
//     );
//     setSelectedItems(validItems);

//     const newQuantities = {};
//     validItems.forEach(item => {
//       newQuantities[item] = '';
//     });
//     setQuantities(newQuantities);
//   };

//   const handleQuantityChange = (item, value) => {
//     setQuantities(prev => ({...prev, [item]: value}));
//   };

//   const validateInput = () => {
//     if (!selectedServicePerson || !farmerContact) {
//       Alert.alert('Error', 'Please fill in all required fields.');
//       return false;
//     }

//     if (!isNewStock) {
//       Alert.alert('Error', 'Please select if this is new stock.');
//       return false;
//     }

//     if (selectedItems.length === 0) {
//       Alert.alert('Error', 'No valid items selected.');
//       return false;
//     }

//     for (const item of selectedItems) {
//       if (!quantities[item]) {
//         Alert.alert('Error', `Please enter quantity for ${item}.`);
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateInput()) return;

//     const itemsData = selectedItems.map(item => ({
//       itemName: item,
//       quantity: parseInt(quantities[item], 10),
//     }));

//     const data = {
//       farmerComplaintId,
//       servicePerson: selectedServicePerson,
//       farmerContact,
//       farmerName,
//       farmerVillage,
//       items: itemsData,
//       warehouse: selectedWarehouse,
//       remark: remarks,
//       serialNumber,
//       incoming: false,
//       pickupDate: new Date(),
//       farmerSaralId,
//       isNewStock: isNewStock === 'Yes', // ✅ converts string to boolean
//     };

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${API_URL}/warehouse-admin/outgoing-items`,
//         data,
//         {headers: {'Content-Type': 'application/json'}},
//       );

//       if (response.status === 200) {
//         Alert.alert('Success', 'Transaction saved successfully');
//         resetForm();
//       } else {
//         Alert.alert('Error', 'Failed to save transaction');
//       }
//     } catch (error) {
//       Alert.alert('Error', JSON.stringify(error.response?.data?.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSelectedServicePerson('');
//     setSelectedItems([]);
//     setQuantities({});
//     setRemarks('');
//     setSerialNumber('');
//     setSelectedWarehouse('');
//     setIsNewStock('');
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.modalHeader}>
//         <Text style={styles.label}>Select Items:</Text>
//         <MultiSelect
//           items={filteredItems}
//           uniqueKey="itemName"
//           onSelectedItemsChange={handleItemSelect}
//           selectedItems={selectedItems}
//           selectText="Pick Items"
//           searchInputPlaceholderText="Search Items..."
//           onSearch={handleSearch}
//           displayKey="itemName"
//           hideSubmitButton
//           styleListContainer={styles.listContainer}
//           textColor="#000"
//         />
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.form}>
//           <Text style={styles.label}>Service Person:</Text>
//           <Picker
//             selectedValue={selectedServicePerson}
//             onValueChange={itemValue => setSelectedServicePerson(itemValue)}
//             style={styles.input}>
//             <Picker.Item label="Select Service Person" value="" />
//             {Array.isArray(servicePerson) &&
//               servicePerson.map(person => (
//                 <Picker.Item
//                   key={person._id}
//                   label={person.name}
//                   value={person._id}
//                 />
//               ))}
//           </Picker>

//           <Text style={styles.label}>Farmer Contact:</Text>
//           <TextInput
//             style={[styles.input, styles.nonEditable]}
//             value={farmerContact?.toString() || 'N/A'}
//             keyboardType="phone-pad"
//             editable={false}
//           />

//           <Text style={styles.label}>Farmer Saral Id:</Text>
//           <TextInput
//             style={[styles.input, styles.nonEditable]}
//             value={farmerSaralId || 'N/A'}
//             editable={false}
//           />

//           {selectedItems.map(item => (
//             <View key={item}>
//               <Text style={styles.label}>Quantity for {item}:</Text>
//               <TextInput
//                 value={quantities[item]}
//                 onChangeText={value => handleQuantityChange(item, value)}
//                 style={styles.input}
//                 keyboardType="numeric"
//               />
//             </View>
//           ))}

//           <Text style={styles.label}>Serial Number:</Text>
//           <TextInput
//             value={serialNumber}
//             onChangeText={setSerialNumber}
//             style={styles.input}
//           />

//           {/* <Text style={styles.label}>Warehouse:</Text>
//           <Picker
//             selectedValue={selectedWarehouse}
//             style={styles.picker}
//             onValueChange={itemValue => setSelectedWarehouse(itemValue)}
//           >
//             <Picker.Item label="Select Warehouse" value="" />
//             {Array.isArray(allWarehouses) &&
//               allWarehouses.map((wh, index) => (
//                 <Picker.Item key={index} label={wh} value={wh} />
//               ))}
//           </Picker> */}

//           <Text style={{color: '#000'}}>Warehouse:</Text>
//           <Picker
//             selectedValue={selectedWarehouse}
//             style={styles.picker}
//             onValueChange={itemValue => setSelectedWarehouse(itemValue)}>
//             <Picker.Item
//               key={allWarehouses}
//               label={allWarehouses}
//               value={allWarehouses}
//               placeholderTextColor={'#000'}
//             />
//           </Picker>

//           <Text style={styles.label}>Is New Stock?</Text>
//           <Picker
//             selectedValue={isNewStock}
//             onValueChange={itemValue => setIsNewStock(itemValue)}
//             style={styles.picker}>
//             <Picker.Item label="Select Option" value="" />
//             <Picker.Item label="Yes" value="Yes" />
//             <Picker.Item label="No" value="No" />
//           </Picker>

//           <Text style={styles.label}>Remarks:</Text>
//           <TextInput
//             value={remarks}
//             onChangeText={setRemarks}
//             style={styles.textArea}
//             multiline
//           />

//           <TouchableOpacity
//             style={styles.button}
//             onPress={handleSubmit}
//             disabled={loading}>
//             <Text style={styles.buttonText}>
//               {loading ? 'Submitting...' : 'Submit'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 20, backgroundColor: '#ffffff'},
//   listContainer: {backgroundColor: '#fbd33b', maxHeight: 300},
//   scrollContainer: {flexGrow: 1, paddingBottom: 20},
//   modalHeader: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#fbd33b',
//     borderBottomWidth: 1,
//     borderBottomColor: '#070604',
//   },
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
//   textArea: {
//     backgroundColor: '#f9f9f9',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     minHeight: 80,
//     fontSize: 14,
//     color: '#070604',
//     marginBottom: 15,
//   },
//   picker: {
//     height: 50,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#000',
//     marginBottom: 15,
//     color: '#000',
//   },
//   button: {
//     backgroundColor: '#070604',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fbd33b',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   nonEditable: {
//     backgroundColor: '#e9e9e9',
//   },
// });

// export default AddTransaction;


import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';

const AddTransaction = ({route}) => {
  const {
    farmerComplaintId,
    farmerContact,
    farmerName,  
    farmerVillage,
    farmerSaralId,
  } = route.params || {};

  const [servicePerson, setServicePerson] = useState([]);
  const [selectedServicePerson, setSelectedServicePerson] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [serialNumbers, setSerialNumbers] = useState({}); // Changed to object for multiple items
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewStock, setIsNewStock] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchServicePersons = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/service-team/all-service-persons`,
        );
        setServicePerson(response?.data?.data);
      } catch (error) {
        Alert.alert('Error', JSON.stringify(error.response.data?.message));
      }
    };

    fetchServicePersons();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/view-items`,
        );
        const items = response?.data?.items?.map((item, index) => ({
          _id: index + 1,
          itemName: item,
        }));
        setAllItems(items);
        setFilteredItems(items);
      } catch (error) {
        Alert.alert('Error', JSON.stringify(error.response.data?.message));
      }
    };

    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/get-warehouse`,
        );
        setAllWarehouses(response?.data?.warehouseName);
      } catch (error) {
        Alert.alert('Error', JSON.stringify(error.response.data?.message));
        setAllWarehouses([]);
      }
    };

    fetchItems();
    fetchWarehouses();
  }, []);

  const handleSearch = query => {
    setSearchQuery(query);
    const filtered = allItems.filter(item =>
      item.itemName.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredItems(filtered);

    if (query && filtered.length === 0) {
      Alert.alert('Error', 'No items match your search query.');
    }
  };

  const handleItemSelect = selected => {
    const validItems = selected.filter(item =>
      filteredItems.some(filteredItem => filteredItem.itemName === item),
    );
    setSelectedItems(validItems);

    // Initialize quantities and serialNumbers for each selected item
    const newQuantities = {};
    const newSerialNumbers = {};
    validItems.forEach(item => {
      newQuantities[item] = quantities[item] || '';
      newSerialNumbers[item] = serialNumbers[item] || '';
    });
    setQuantities(newQuantities);
    setSerialNumbers(newSerialNumbers);
  };

  const handleQuantityChange = (item, value) => {
    setQuantities(prev => ({...prev, [item]: value}));
  };

  const handleSerialNumberChange = (item, value) => {
    setSerialNumbers(prev => ({...prev, [item]: value}));
  };

  const validateInput = () => {
    if (!selectedServicePerson || !farmerContact) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return false;
    }

    if (!isNewStock) {
      Alert.alert('Error', 'Please select if this is new stock.');
      return false;
    }

    if (selectedItems.length === 0) {
      Alert.alert('Error', 'No valid items selected.');
      return false;
    }

    for (const item of selectedItems) {
      if (!quantities[item]) {
        Alert.alert('Error', `Please enter quantity for ${item}.`);
        return false;
      }
      if (!serialNumbers[item]) {
        Alert.alert('Error', `Please enter serial number for ${item}.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    const itemsData = selectedItems.map(item => ({
      itemName: item,
      quantity: parseInt(quantities[item], 10),
      serialNumber: serialNumbers[item],
    }));

    const data = {
      farmerComplaintId,
      servicePerson: selectedServicePerson,
      farmerContact,
      farmerName,
      farmerVillage,
      items: itemsData,
      warehouse: selectedWarehouse,
      remark: remarks,
      incoming: false,
      pickupDate: new Date(),
      farmerSaralId,
      isNewStock: isNewStock === 'Yes',
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/warehouse-admin/outgoing-items`,
        data,
        {headers: {'Content-Type': 'application/json'}},
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Transaction saved successfully');
        resetForm();
      } else {
        Alert.alert('Error', 'Failed to save transaction');
      }
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedServicePerson('');
    setSelectedItems([]);
    setQuantities({});
    setSerialNumbers({});
    setRemarks('');
    setSelectedWarehouse('');
    setIsNewStock('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalHeader}>
        <Text style={styles.label}>Select Items:</Text>
        <MultiSelect
          items={filteredItems}
          uniqueKey="itemName"
          onSelectedItemsChange={handleItemSelect}
          selectedItems={selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          onSearch={handleSearch}
          displayKey="itemName"
          hideSubmitButton
          styleListContainer={styles.listContainer}
          textColor="#000"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.label}>Service Person:</Text>
          <Picker
            selectedValue={selectedServicePerson}
            onValueChange={itemValue => setSelectedServicePerson(itemValue)}
            style={styles.input}>
            <Picker.Item label="Select Service Person" value="" />
            {Array.isArray(servicePerson) &&
              servicePerson.map(person => (
                <Picker.Item
                  key={person._id}
                  label={person.name}
                  value={person._id}
                />
              ))}
          </Picker>

          <Text style={styles.label}>Farmer Contact:</Text>
          <TextInput
            style={[styles.input, styles.nonEditable]}
            value={farmerContact?.toString() || 'N/A'}
            keyboardType="phone-pad"
            editable={false}
          />

          <Text style={styles.label}>Farmer Saral Id:</Text>
          <TextInput
            style={[styles.input, styles.nonEditable]}
            value={farmerSaralId || 'N/A'}
            editable={false}
          />

          {selectedItems.map(item => (
            <View key={item}>
              <Text style={styles.label}>Quantity for {item}:</Text>
              <TextInput
                value={quantities[item]}
                onChangeText={value => handleQuantityChange(item, value)}
                style={styles.input}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Serial Number for {item}:</Text>
              <TextInput
                value={serialNumbers[item]}
                onChangeText={value => handleSerialNumberChange(item, value)}
                style={styles.input}
              />
            </View>
          ))}

          <Text style={{color: '#000'}}>Warehouse:</Text>
          <Picker
            selectedValue={selectedWarehouse}
            style={styles.picker}
            onValueChange={itemValue => setSelectedWarehouse(itemValue)}>
            <Picker.Item
              key={allWarehouses}
              label={allWarehouses}
              value={allWarehouses}
              placeholderTextColor={'#000'}
            />
          </Picker>

          <Text style={styles.label}>Is New Stock?</Text>
          <Picker
            selectedValue={isNewStock}
            onValueChange={itemValue => setIsNewStock(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Select Option" value="" />
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>

          <Text style={styles.label}>Remarks:</Text>
          <TextInput
            value={remarks}
            onChangeText={setRemarks}
            style={styles.textArea}
            multiline
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
  listContainer: {backgroundColor: '#fbd33b', maxHeight: 300},
  scrollContainer: {flexGrow: 1, paddingBottom: 20},
  modalHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fbd33b',
    borderBottomWidth: 1,
    borderBottomColor: '#070604',
  },
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
  textArea: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    fontSize: 14,
    color: '#070604',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 15,
    color: '#000',
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
  nonEditable: {
    backgroundColor: '#e9e9e9',
  },
});

export default AddTransaction;
