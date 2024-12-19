// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   StyleSheet,
//   Modal,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import MultiSelect from 'react-native-multiple-select';
// import {Picker} from '@react-native-picker/picker';
// import axios from 'axios';
// import {API_URL} from '@env';

// const AddTransaction = ({route}) => {
//   const [servicePersonName, setServicePersonName] = useState('');
//   const [servicePerContact, setServicePerContact] = useState('');
//   const [farmerName, setFarmerName] = useState('');
//   const [farmerContact, setFarmerContact] = useState('');
//   const [farmerVillageName, setFarmerVilageName] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [allItems, setAllItems] = useState([]);
//   const [allWarehouses, setAllWarehouses] = useState([]);
//   const [status, setStatus] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [imageUri, setImageUri] = useState(null);
//   const [serialNumber, setSerialNumber] = useState('');
//   const [selectedWarehouse, setSelectedWarehouse] = useState('');

//   useEffect(() => {
//     const selectedItemList = async () => {
//       const response = await axios.get(`${API_URL}/warehouse-admin/view-items`);
//       console.log(response.data.items);
//       const updateItemsData = [];
//       for (let index = 0; index < response.data.items.length; index++) {
//         updateItemsData.push({
//           _id: index + 1,
//           itemName: response.data.items[index],
//         });
//       }
//       setAllItems(updateItemsData);
//     };
//     selectedItemList();
//   }, []);

//   useEffect(() => {
//     const fetchWarehouses = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/get-warehouse`,
//         );
//         console.log('API Response:', response.data);
//         setAllWarehouses(response.data.warehouseName);
//       } catch (error) {
//         console.log('Failed to fetch warehouse names:', error);
//         setAllWarehouses([]);
//       }
//     };

//     fetchWarehouses();
//   }, []);

//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const handleDropdownOpen = () => {
//     setDropdownOpen(true);
//   };

//   const handleItemSelect = selected => {
//     setDropdownOpen(false);
//     setSelectedItems(selected);
//     const newQuantities = {};
//     selected.forEach(item => {
//       newQuantities[item] = '';
//     });
//     setQuantities(newQuantities);
//   };

//   const handleQuantityChange = (itemName, quantity) => {
//     setQuantities({...quantities, [itemName]: quantity});
//   };

//   const validateInput = () => {
//     if (
//       !servicePersonName ||
//       !servicePerContact ||
//       !farmerContact ||
//       !farmerName ||
//       !farmerVillageName
//     ) {
//       Alert.alert('Error', 'Please fill in all fields.');
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
//     // const formData = new FormData();
//     console.log('btn clicked');
//     if (!validateInput()) return;
//     console.log(selectedItems);
//     let itemSelected = [];
//     selectedItems.forEach(item => {
//       // data.append('items[]', JSON.stringify({ itemName: item, quantity: quantities[item] }));
//       itemSelected.push({itemName: item, quantity: parseInt(quantities[item])});
//     });
//     console.log(itemSelected);

//     const data = {
//       servicePersonName,
//       servicePerContact,
//       farmerName,
//       farmerContact,
//       farmerVillage: farmerVillageName,
//       items: itemSelected,
//       warehouse: allWarehouses,
//       remark: remarks,
//       serialNumber,
//       incoming: false,
//       pickupDate: new Date(),
//     };
//     console.log(data);

//     try {
//       const response = await axios.post(
//         `${API_URL}/warehouse-admin/outgoing-items`,
//         data,
//         {
//           headers: {
//             // 'Content-Type': 'multipart/form-data',
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       console.log(response.data);
//       // Alert.alert(JSON.stringify(response.data.response));

//       if (response.status === 200) {
//         resetForm();
//         Alert.alert('Success', 'Transaction saved successfully');
//         setModalVisible(false);
//       } else {
//         Alert.alert('Error', 'Failed to save transaction');
//       }
//     } catch (error) {
//       Alert.alert(JSON.stringify(error.response.data.message));
//       if (
//         error.response &&
//         error.response.data.message === 'servicePerson not found'
//       ) {
//         Alert.alert("Service Person Doesn't exist");
//       }
//     }
//   };

//   const resetForm = () => {
//     setServicePersonName('');
//     setServicePerContact('');
//     setFarmerName('');
//     setFarmerContact('');
//     setFarmerVilageName('');
//     setSelectedItems([]);
//     setQuantities({});
//     setAllWarehouses('');
//     setStatus('');
//     setRemarks('');
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => setModalVisible(true)}>
//         <Text style={styles.buttonText}>out Order</Text>
//       </TouchableOpacity>
//       <Modal
//         animationType="slide"
//         transparent={false}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}>

//         <View
//           style={{
//             paddingHorizontal: 20,
//             backgroundColor: '#fbd33b',
//             paddingTop: 30,
//           }}>
//           <Text style={{color:'#000'}}>Select Items:</Text>
//           <MultiSelect
//             items={allItems}
//             uniqueKey="itemName"
//             onSelectedItemsChange={handleItemSelect}
//             selectedItems={selectedItems}
//             selectText="Pick Items"
//             searchInputPlaceholderText="Search Items..."
//             displayKey="itemName"
//             hideSubmitButton
//             textColor="#000"
//             styleListContainer={{ minHeight: 300, maxHeight: 300 }}
//             // styleDropdownMenuSubsection={{ backgroundColor: '#fbd33b' }}
//             //  styleListContainer={{ backgroundColor: '#fbd33b' }}
//           />
//         </View>
//         <ScrollView contentContainerStyle={{...styles.scrollContainer}}>
//           <View style={styles.modalContainer}>
//             <Text style={{color:'#000'}}>Service Person Name:</Text>
//             <TextInput
//               value={servicePersonName}
//               onChangeText={setServicePersonName}
//               placeholder="Enter ServicePerson Name"
//               style={styles.input}
//               placeholderTextColor={'#000'}
//             />

//             <Text style={{color:'#000'}}>Service Person Contact:</Text>
//             <TextInput
//               value={servicePerContact}
//               onChangeText={setServicePerContact}
//               placeholder="Enter ServicePerson Contact"
//               style={styles.input}
//               placeholderTextColor={'#000'}
//             />

//             <Text style={{color:'#000'}}>Farmer Name:</Text>
//             <TextInput
//               value={farmerName}
//               onChangeText={setFarmerName}
//               placeholder="Enter Contact"
//               style={styles.input}
//               placeholderTextColor={'#000'}
//             />

//             <Text style={{color:'#000'}}>Farmer Contact Number:</Text>
//             <TextInput
//               value={farmerContact}
//               onChangeText={setFarmerContact}
//               placeholder="Enter Contact"
//               style={styles.input}
//               maxLength={10}
//               placeholderTextColor={'#000'}
//             />

//             <Text style={{color:'#000'}}>Farmer Village Name:</Text>
//             <TextInput
//               value={farmerVillageName}
//               onChangeText={setFarmerVilageName}
//               placeholder="Enter Contact"
//               style={styles.input}
//               placeholderTextColor={'#000'}
//             />

//             {selectedItems.map((item, index) => (
//               <View key={index}>
//                 <Text style={{color:'#000'}}>
//                   Quantity for <Text style={styles.itemText}>{item}</Text>:
//                 </Text>
//                 <TextInput
//                   value={quantities[item]}
//                   onChangeText={value => handleQuantityChange(item, value)}
//                   keyboardType="numeric"
//                   placeholder="Enter Quantity"
//                   style={styles.input}
//                   placeholderTextColor={'#000'}
//                 />
//               </View>
//             ))}

//             <Text style={{color:'#000'}}>Serial Number</Text>
//             <TextInput
//               value={serialNumber}
//               onChangeText={setSerialNumber}
//               placeholder="Enter serial Number"
//               style={styles.input}
//               maxLength={100}
//               multiline
//               numberOfLines={4}
//               required
//               placeholderTextColor={'#000'}
//             />
//             <Text style={{color:'#000'}}>Warehouse:</Text>
//             <Picker
//               selectedValue={selectedWarehouse}
//               style={styles.picker}
//               onValueChange={itemValue => setSelectedWarehouse(itemValue)}>
//               <Picker.Item
//                 key={allWarehouses}
//                 label={allWarehouses}
//                 value={allWarehouses}
//                 placeholderTextColor={'#000'}
//               />
//             </Picker>

//             <View style={styles.remark}>
//               <Text style={{color:'#000'}}>Remarks:</Text>
//               <ScrollView style={styles.scrollView}>
//                 <TextInput
//                   value={remarks}
//                   onChangeText={setRemarks}
//                   placeholder="Enter Remarks"
//                   style={styles.input}
//                   maxLength={100}
//                   multiline
//                   numberOfLines={4}
//                   placeholderTextColor={'#000'}
//                 />
//               </ScrollView>
//             </View>

//             <TouchableOpacity style={{...styles.button}} onPress={handleSubmit}>
//               <Text style={styles.buttonText}>Submit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.button}
//               onPress={() => setModalVisible(false)}>
//               <Text style={styles.buttonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: 200,
//     padding: 20,
//   },
//   listContainer: {
//     backgroundColor: '#fbd33b',
//     maxHeight: 500,
//     height: 300,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   modalContainer: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#fbd33b',
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: 'black',
//   },
//   input: {
//     backgroundColor: '#fbd33b',
//     borderWidth: 1,
//     borderColor: '#070604',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 20,
//     color: '#070604',
//   },
//   remark: {
//     flex: 1,
//     padding: 16,
//   },
//   scrollView: {
//     borderRadius: 5,
//     padding: 5,
//   },
//   itemText: {
//     fontWeight: 'bold',
//   },
//   picker: {
//     backgroundColor: '#fbd33b',
//     color: '#070604',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#070604',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fbd33b',
//     fontSize: 16,
//   },
//   image: {
//     width: 200,
//     height: 200,
//     marginTop: 10,
//   },
// });

// export default AddTransaction;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '@env';

const AddTransaction = () => {
  const [servicePersonName, setServicePersonName] = useState('');
  const [servicePerContact, setServicePerContact] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [farmerContact, setFarmerContact] = useState('');
  const [farmerVillageName, setFarmerVillageName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [status, setStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/warehouse-admin/view-items`);
        const items = response.data.items.map((item, index) => ({
          _id: index + 1,
          itemName: item,
        }));
        setAllItems(items);
        setFilteredItems(items); 
      } catch (error) {
        console.log('Failed to fetch items:', error);
      }
    };

    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(`${API_URL}/warehouse-admin/get-warehouse`);
        setAllWarehouses(response.data.warehouseName);
      } catch (error) {
        console.log('Failed to fetch warehouse names:', error);
        setAllWarehouses([]);
      }
    };

    fetchItems();
    fetchWarehouses();
  }, []);

  const  handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = allItems.filter(item =>
      item.itemName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);

    if (query && filtered.length === 0) {
      Alert.alert('Error', 'No items match your search query.');
    }
  };

  const handleItemSelect = (selected) => {
    const validItems = selected.filter(item =>
      filteredItems.some(filteredItem => filteredItem.itemName === item)
    );
    setSelectedItems(validItems);

    const newQuantities = {};
    validItems.forEach(item => {
      newQuantities[item] = '';
    });
    setQuantities(newQuantities);
  };

  const handleQuantityChange = (item, value) => {
    setQuantities(prev => ({ ...prev, [item]: value }));
  };

  const validateInput = () => {
    if (
      !servicePersonName ||
      !servicePerContact ||
      !farmerName ||
      !farmerContact ||
      !farmerVillageName
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
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
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    const itemsData = selectedItems.map(item => ({
      itemName: item,
      quantity: parseInt(quantities[item], 10),
    }));

    const data = {
      servicePersonName,
      servicePerContact,
      farmerName,
      farmerContact,
      farmerVillage: farmerVillageName,
      items: itemsData,
      warehouse: selectedWarehouse,
      remark: remarks,
      serialNumber,
      incoming: false,
      pickupDate: new Date(),
    };

    try {
      const response = await axios.post(`${API_URL}/warehouse-admin/outgoing-items`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Transaction saved successfully');
        resetForm();
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to save transaction');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while saving the transaction');
    }
  };

  const resetForm = () => {
    setServicePersonName('');
    setServicePerContact('');
    setFarmerName('');
    setFarmerContact('');
    setFarmerVillageName('');
    setSelectedItems([]);
    setQuantities({});
    setRemarks('');
    setSerialNumber('');
    setSelectedWarehouse('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Out Order</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        
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
            <Text style={styles.label}>Service Person Name:</Text>
            <TextInput
              value={servicePersonName}
              onChangeText={setServicePersonName}
              style={styles.input}
            />
            <Text style={styles.label}>Service Person Contact:</Text>
            <TextInput
              value={servicePerContact}
              onChangeText={setServicePerContact}
              style={styles.input}
            />
            <Text style={styles.label}>Farmer Name:</Text>
            <TextInput
              value={farmerName}
              onChangeText={setFarmerName}
              style={styles.input}
            />
            <Text style={styles.label}>Farmer Contact:</Text>
            <TextInput
              value={farmerContact}
              onChangeText={setFarmerContact}
              style={styles.input}
            />
            <Text style={styles.label}>Farmer Village Name:</Text>
            <TextInput
              value={farmerVillageName}
              onChangeText={setFarmerVillageName}
              style={styles.input}
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
              </View>
            ))}
            <Text style={styles.label}>Serial Number:</Text>
            <TextInput
              value={serialNumber}
              onChangeText={setSerialNumber}
              style={styles.input}
            />
             <Text style={{color:'#000'}}>Warehouse:</Text>
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

            <Text style={styles.label}>Remarks:</Text>
            <TextInput
              value={remarks}
              onChangeText={setRemarks}
              style={styles.textArea}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    backgroundColor: '#fbd33b',
    maxHeight: 300,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
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
    shadowOffset: { width: 0, height: 2 },
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
    borderColor: '#ccc',
    marginBottom: 15,
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
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#070604',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#070604',
    flex: 1,
  },
  quantityInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    borderRadius: 5,
    padding: 5,
  },
});


export default AddTransaction;
                                                                                                                                                                                                                                                                                                                                                                                                                         