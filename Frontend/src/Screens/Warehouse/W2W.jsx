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
//   Dimensions,
// } from 'react-native';
// import MultiSelect from 'react-native-multiple-select';
// import {Picker} from '@react-native-picker/picker';
// import axios from 'axios';
// import {API_URL} from '@env';

// const {width} = Dimensions.get('window'); // Get screen width

// const W2W = () => {
//   const [items, setItems] = useState([]);
//   const [allWarehouses, setAllWarehouse] = useState([]);
//   const [formData, setFormData] = useState({
//     driverName: '',
//     driverContact: '',
//     remarks: '',
//     selectedItems: [],
//     quantities: {},
//     isDefective: null,
//     fromWarehouse: '',
//     toWarehouse: '',
//     modalVisible: false,
//   });

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/view-items`,
//         );
//         setItems(
//           response.data.items.map((item, index) => ({
//             _id: index + 1,
//             itemName: item,
//           })),
//         );
//       } catch (error) {
//         console.log('Failed to fetch items:', error);
//       }
//     };

//     const fetchWarehouses = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/get-warehouse`,
//         );
//         setFormData(prev => ({
//           ...prev,
//           fromWarehouse: response.data.warehouseName,
//         }));
//       } catch (error) {
//         console.log('Failed to fetch warehouses:', error);
//       }
//     };

//     fetchItems();
//     fetchWarehouses();
//   }, []);

//   useEffect(() => {
//     const fetchallWarehouses = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/all-warehouses`,
//         );
//         setAllWarehouse(response.data.allWarehouses);
//       } catch (error) {
//         console.log('Failed to fetch warehouses:', error);
//       }
//     };

//     fetchallWarehouses();
//   }, []);

//   const handleInputChange = (name, value) => {
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleItemSelect = selected => {
//     setFormData(prevData => {
//       const newQuantities = {};
//       selected.forEach(item => {
//         newQuantities[item] = '';
//       });
//       return {...prevData, selectedItems: selected, quantities: newQuantities};
//     });
//   };

//   const handleQuantityChange = (itemName, quantity) => {
//     setFormData(prevData => ({
//       ...prevData,
//       quantities: {...prevData.quantities, [itemName]: quantity},
//     }));
//   };

//   const validateInput = () => {
//     const {
//       driverName,
//       driverContact,
//       selectedItems,
//       fromWarehouse,
//       toWarehouse,
//       isDefective,
//     } = formData;

//     for (const item of selectedItems) {
//       const quantity = formData.quantities[item];
//       if (!quantity || isNaN(quantity) || quantity <= 0) {
//         Alert.alert('Error', `Please enter a valid quantity for ${item}.`);
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleDataOnSubmit = async () => {
//     if (!validateInput()) return;

//     const {
//       driverName,
//       driverContact,
//       selectedItems,
//       quantities,
//       isDefective,
//       fromWarehouse,
//       toWarehouse,
//       remarks,
//     } = formData;

//     const itemSelected = selectedItems.map(item => ({
//       itemName: item,
//       quantity: parseInt(quantities[item], 10),
//     }));

//     const data = {
//       fromWarehouse,
//       toWarehouse,
//       isDefective: isDefective === 'Yes' ? true : false,
//       items: itemSelected,
//       driverName,
//       driverContact,
//       remarks,
//       status: false,
//       pickupDate: new Date(),
//     };

//     try {
//       const response = await axios.post(
//         `${API_URL}/warehouse-admin/defective-order-data`,
//         data,
//         {
//           headers: {'Content-Type': 'application/json'},
//         },
//       );

//       if (response.status === 200) {
//         resetForm();
//         Alert.alert('Success', 'Transaction saved successfully');
//         setFormData(prevData => ({...prevData, modalVisible: false}));
//       } else {
//         Alert.alert('Error', 'Failed to save transaction');
//       }
//     } catch (error) {
//       Alert.alert('Error', JSON.stringify(error.response.data));
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       driverName: '',
//       driverContact: '',
//       remarks: '',
//       selectedItems: [],
//       quantities: {},
//       isDefective: '',
//       fromWarehouse: '',
//       toWarehouse: '',
//       modalVisible: false,
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() =>
//           setFormData(prevData => ({...prevData, modalVisible: true}))
//         }>
//         <Text style={styles.buttonText}>Outgoing Order</Text>
//       </TouchableOpacity>

//       <Modal
//         animationType="slide"
//         transparent={false}
//         visible={formData.modalVisible}
//         onRequestClose={() =>
//           setFormData(prevData => ({...prevData, modalVisible: false}))
//         }>

//         <View
//           style={{
//             paddingHorizontal: 20,
//             backgroundColor: '#fbd33b',
//             paddingTop: 30,

//           }}>

//          <Text style={styles.heading}>Warehouse to Warehouse Transfer</Text>
//           <Text style={styles.label}>Select Items:</Text>
//           <MultiSelect
//             items={items}
//             uniqueKey="itemName"
//             onSelectedItemsChange={handleItemSelect}
//             selectedItems={formData.selectedItems}
//             selectText="Pick Items"
//             searchInputPlaceholderText="Search Items..."
//             displayKey="itemName"
//             hideSubmitButton
//             textColor="black"
//             placeholderTextColor={'#000'}
//           />
//         </View>

//         {formData.selectedItems.map(item => (
//           <View key={item} style={styles.itemQuantityContainer}>
//             <Text style={styles.label}>Quantity for {item}:</Text>
//             <TextInput
//               value={formData.quantities[item]}
//               onChangeText={value => handleQuantityChange(item, value)}
//               placeholder={`Enter quantity for ${item}`}
//               style={styles.input}
//               keyboardType="numeric"
//               placeholderTextColor={'#000'}
//             />
//           </View>
//         ))}
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.label}>Driver Name:</Text>
//             <TextInput
//               value={formData.driverName}
//               onChangeText={value => handleInputChange('driverName', value)}
//               placeholder="Enter Driver Name"
//               style={styles.input}
//               placeholderTextColor={'#000'}
//             />
//             <Text style={styles.label}>Driver Contact:</Text>
//             <TextInput
//               value={formData.driverContact}
//               onChangeText={value => handleInputChange('driverContact', value)}
//               placeholder="Enter Driver Contact"
//               style={styles.input}
//               keyboardType="phone-pad"
//               placeholderTextColor={'#000'}
//             />

//             <Text style={styles.label}>From Warehouse:</Text>
//             <Picker
//               selectedValue={formData.fromWarehouse}
//               style={styles.picker}
//               onValueChange={value =>
//                 handleInputChange('fromWarehouse', value)
//               }>
//               <Picker.Item
//                 key={formData.fromWarehouse}
//                 label={formData.fromWarehouse}
//                 value={formData.fromWarehouse}
//               />
//             </Picker>
//             <Text style={styles.label}>To Warehouse:</Text>
//             <Picker
//               selectedValue={formData.toWarehouse}
//               style={styles.picker}
//               onValueChange={value => handleInputChange('toWarehouse', value)}>
//               {allWarehouses.map(warehouse => (
//                 <Picker.Item
//                   key={warehouse._id}
//                   label={warehouse.warehouseName}
//                   value={warehouse.warehouseName}
//                 />
//               ))}
//             </Picker>
//             <Text style={styles.label}>Is Defective:</Text>
//             <Picker
//               selectedValue={formData.isDefective}
//               style={styles.picker}
//               onValueChange={value => handleInputChange('isDefective', value)}>
//               {[
//                 {_id: 1, name: 'Yes'},
//                 {_id: 2, name: 'No'},
//               ].map(({_id, name}) => (
//                 <Picker.Item key={_id} label={name} value={name} />
//               ))}
//             </Picker>
//             <Text style={styles.label}>Remarks:</Text>
//             <TextInput
//               value={formData.remarks}
//               onChangeText={value => handleInputChange('remarks', value)}
//               placeholder="Enter Remarks"
//               style={styles.input}
//               maxLength={100}
//               multiline
//               numberOfLines={4}
//               placeholderTextColor={'#000'}
//             />
//             <TouchableOpacity
//               style={styles.button}
//               onPress={handleDataOnSubmit}>
//               <Text style={styles.buttonText}>Save</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.button}
//               onPress={() =>
//                 setFormData(prevData => ({...prevData, modalVisible: false}))
//               }>
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
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//   },
//   button: {
//     backgroundColor: '#070604',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   label: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 5,
//     color: '#333',
//   },

//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: 'black',
//   },

//   buttonText: {
//     color: '#fbd33b',
//     fontSize: 16,
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
//   input: {
//     backgroundColor: '#fbd33b',
//     borderWidth: 1,
//     borderColor: '#070604',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 20,
//     color: '#070604',
//   },
//   picker: {
//     backgroundColor: '#fbd33b',
//     color: '#070604',
//     marginBottom: 20,
//   },

//   itemQuantityContainer: {
//     width: width - 32,
//     paddingHorizontal: 16,
//     marginBottom: 12,
//   },
//   multiSelectWrapper: {
//     marginBottom: 16,
//     paddingHorizontal: 8,
//     borderRadius: 5,
//     borderColor: '#ccc',
//     borderWidth: 1,
//   },
// });

// export default W2W;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {API_URL} from '@env';

// const {width} = Dimensions.get('window');

const W2W = () => {
  const [items, setItems] = useState([]);
  const [allWarehouses, setAllWarehouse] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    driverName: '',
    driverContact: '',
    remarks: '',
    selectedItems: [],
    quantities: {},
    isDefective: null,
    fromWarehouse: 'Bhiwani',
    toWarehouse: '',
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/view-items`,
        );
        const items = response.data.items.map((item, index) => ({
          _id: index + 1,
          itemName: item,
        }));
        setItems(items);
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
        setFormData(prev => ({
          ...prev,
          fromWarehouse: response.data.warehouseName,
        }));
      } catch (error) {
        Alert.alert('Error', JSON.stringify(error.response.data?.message));
      }
    };

    fetchItems();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    const fetchAllWarehouses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/all-warehouses`,
        );
        setAllWarehouse(response.data.allWarehouses);
      } catch (error) {
        Alert.alert('Error', JSON.stringify(error.response.data?.message));
      }
    };

    fetchAllWarehouses();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleItemSelect = selected => {
    const validItems = selected.filter(item =>
      filteredItems.some(filteredItem => filteredItem.itemName === item),
    );
    setSelectedItems(validItems);

    setFormData(prevData => ({
      ...prevData,
      selectedItems: validItems,
      quantities: validItems.reduce((acc, item) => {
        acc[item] = prevData.quantities[item] || '';
        return acc;
      }, {}),
    }));
  };

  const handleQuantityChange = (itemName, quantity) => {
    setFormData(prevData => ({
      ...prevData,
      quantities: {...prevData.quantities, [itemName]: quantity},
    }));
  };

  const handleSearch = searchText => {
    const filtered = items.filter(item =>
      item.itemName.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredItems(filtered);
  };

  const validateInput = () => {
    const {
      driverName,
      driverContact,
      selectedItems,
      fromWarehouse,
      toWarehouse,
      isDefective,
    } = formData;

    for (const item of selectedItems) {
      const quantity = formData.quantities[item];
      if (!quantity || isNaN(quantity) || quantity <= 0) {
        Alert.alert('Error', `Please enter a valid quantity for ${item}.`);
        return false;
      }
    }
    return true;
  };

  const handleDataOnSubmit = async () => {
    if (!validateInput()) return;

    const {
      driverName,
      driverContact,
      selectedItems,
      quantities,
      isDefective,
      fromWarehouse,
      toWarehouse,
      remarks,
    } = formData;

    const itemSelected = selectedItems.map(item => ({
      itemName: item,
      quantity: parseInt(quantities[item], 10),
    }));

    const data = {
      fromWarehouse,
      toWarehouse,
      isDefective: isDefective === 'Yes' ? true : false,
      items: itemSelected,
      driverName,
      driverContact,
      remarks,
      status: false,
      pickupDate: new Date(),
    };

    try {
      const response = await axios.post(
        `${API_URL}/warehouse-admin/defective-order-data`,
        data,
        {
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (response.status === 200) {
        resetForm();
        Alert.alert('Success', 'Transaction saved successfully');
      } else {
        Alert.alert('Error', 'Failed to save transaction');
      }
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error.response.data?.message));
    }
  };

  const resetForm = () => {
    setFormData({
      driverName: '',
      driverContact: '',
      remarks: '',
      selectedItems: [],
      quantities: {},
      isDefective: '',
      fromWarehouse: '',
      toWarehouse: '',
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingHorizontal: 20,
          backgroundColor: '#fbd33b',
          paddingTop: 30,
        }}>
        <Text style={styles.heading}>Warehouse to Warehouse Transfer</Text>
        <Text style={styles.label}>Select Items:</Text>
        <MultiSelect
          hideTags
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
        {/* <View style={styles.modalContainer}> */}

        {formData.selectedItems.map(item => (
          <View key={item} style={styles.itemQuantityContainer}>
            <Text style={styles.label}>Quantity for {item}:</Text>
            <TextInput
              value={formData.quantities[item]}
              onChangeText={value => handleQuantityChange(item, value)}
              placeholder={`Enter quantity for ${item}`}
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor={'#000'}
            />
          </View>
        ))}

        <Text style={styles.label}>Driver Name:</Text>
        <TextInput
          value={formData.driverName}
          onChangeText={value => handleInputChange('driverName', value)}
          placeholder="Enter Driver Name"
          style={styles.input}
          placeholderTextColor={'#000'}
        />
        <Text style={styles.label}>Driver Contact:</Text>
        <TextInput
          value={formData.driverContact}
          onChangeText={value => handleInputChange('driverContact', value)}
          placeholder="Enter Driver Contact"
          style={styles.input}
          keyboardType="phone-pad"
          placeholderTextColor={'#000'}
        />

        <Text style={styles.label}>From Warehouse:</Text>
        <Picker
          selectedValue={formData.fromWarehouse}
          style={styles.picker}
          onValueChange={value => handleInputChange('fromWarehouse', value)}>
          <Picker.Item
            label={formData.fromWarehouse}
            value={formData.fromWarehouse}
          />
        </Picker>

        {/* <Text style={styles.label}>To Warehouse:</Text>
        <Picker
          selectedValue={formData.toWarehouse}
          style={styles.picker}
          onValueChange={value => handleInputChange('toWarehouse', value)}>
          {allWarehouses.map(warehouse => (
            <Picker.Item
              key={warehouse._id}
              label={warehouse.warehouseName}
              value={warehouse.warehouseName}
            />
          ))}
        </Picker> */}

        <Text style={styles.label}>To Warehouse:</Text>
        <Picker
          selectedValue={formData.toWarehouse || null}
          style={styles.picker}
          onValueChange={value => handleInputChange('toWarehouse', value)}>
          <Picker.Item label="Select Warehouse" value={null} />
          {allWarehouses.map(warehouse => (
            <Picker.Item
              key={warehouse._id}
              label={warehouse.warehouseName}
              value={warehouse.warehouseName}
            />
          ))}
        </Picker>

        {/* <Text style={styles.label}>Is Defective:</Text>
            <Picker
              selectedValue={formData.isDefective}
              style={styles.picker}
              onValueChange={value => handleInputChange('isDefective', value)}>
              {[
                {_id: 1, name: 'Yes'},
                {_id: 2, name: 'No'},
              ].map(({_id, name}) => (
                <Picker.Item key={_id} label={name} value={name} />
              ))}
            </Picker> */}

        <Text style={styles.label}>Is Defective:</Text>
        <Picker
          selectedValue={formData.isDefective || null}
          style={styles.picker}
          onValueChange={value => handleInputChange('isDefective', value)}>
          <Picker.Item label="Select Data" value={null} />
          {[
            {_id: 1, name: 'Yes'},
            {_id: 2, name: 'No'},
          ].map(({_id, name}) => (
            <Picker.Item key={_id} label={name} value={name} />
          ))}
        </Picker>

        <Text style={styles.label}>Remarks:</Text>
        <TextInput
          value={formData.remarks}
          onChangeText={value => handleInputChange('remarks', value)}
          placeholder="Enter Remarks"
          style={styles.input}
          maxLength={100}
          multiline
          numberOfLines={4}
          placeholderTextColor={'#000'}
        />
        <TouchableOpacity style={styles.button} onPress={handleDataOnSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#fbd33b',
//   },
//   button: {
//     backgroundColor: '#070604',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   label: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 5,
//     color: '#000',
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: 'black',
//   },
//   buttonText: {
//     color: '#fbd33b',
//     fontSize: 16,
//     marginBottom: 150
//   },
//   scrollContainer: {
//     flexGrow: 1,
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
//   picker: {
//     backgroundColor: '#fbd33b',
//     color: '#070604',
//     marginBottom: 20,
//   },
//   itemQuantityContainer: {
//     paddingHorizontal: 16,
//     backgroundColor: '#fbd33b'
//   },
//   listContainer: {
//     maxHeight: 250,
//   },
// });

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05,
    backgroundColor: '#fbd33b',
  },
  button: {
    backgroundColor: '#070604',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: 8,
    marginVertical: height * 0.02,
    alignItems: 'center',
    marginBottom: 140,
  },
  buttonText: {
    color: '#fbd33b',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginBottom: height * 0.005,
    color: '#000',
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
    color: 'black',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: height * 0.05,
  },
  input: {
    backgroundColor: '#fbd33b',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
    color: '#070604',
  },
  picker: {
    backgroundColor: '#fbd33b',
    color: '#070604',
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
  },
  itemQuantityContainer: {
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fbd33b',
  },
  listContainer: {
    maxHeight: height * 0.3,
  },
  multiSelectContainer: {
    width: '100%',
    minHeight: height * 0.08,
  },
  multiSelectText: {
    color: '#000',
    fontSize: width * 0.04,
  },
  multiSelectDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: width * 0.02,
  },
});

export default W2W;
