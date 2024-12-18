import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {API_URL} from '@env';

const {width} = Dimensions.get('window'); // Get screen width

const W2W = () => {
  const [items, setItems] = useState([]);
  const [allWarehouses, setAllWarehouse] = useState([]);
  const [formData, setFormData] = useState({
    driverName: '',
    driverContact: '',
    remarks: '',
    selectedItems: [],
    quantities: {},
    isDefective: null,
    fromWarehouse: '',
    toWarehouse: '',
    modalVisible: false,
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/view-items`,
        );
        setItems(
          response.data.items.map((item, index) => ({
            _id: index + 1,
            itemName: item,
          })),
        );
      } catch (error) {
        console.log('Failed to fetch items:', error);
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
        console.log('Failed to fetch warehouses:', error);
      }
    };

    fetchItems();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    const fetchallWarehouses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/all-warehouses`,
        );
        setAllWarehouse(response.data.allWarehouses);
      } catch (error) {
        console.log('Failed to fetch warehouses:', error);
      }
    };

    fetchallWarehouses();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleItemSelect = selected => {
    setFormData(prevData => {
      const newQuantities = {};
      selected.forEach(item => {
        newQuantities[item] = '';
      });
      return {...prevData, selectedItems: selected, quantities: newQuantities};
    });
  };

  const handleQuantityChange = (itemName, quantity) => {
    setFormData(prevData => ({
      ...prevData,
      quantities: {...prevData.quantities, [itemName]: quantity},
    }));
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
        setFormData(prevData => ({...prevData, modalVisible: false}));
      } else {
        Alert.alert('Error', 'Failed to save transaction');
      }
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error.response.data));
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
      modalVisible: false,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          setFormData(prevData => ({...prevData, modalVisible: true}))
        }>
        <Text style={styles.buttonText}>Outgoing Order</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={formData.modalVisible}
        onRequestClose={() =>
          setFormData(prevData => ({...prevData, modalVisible: false}))
        }>
      
        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: '#fbd33b',
            paddingTop: 30,
            
          }}>

         <Text style={styles.heading}>Warehouse to Warehouse Transfer</Text>
          <Text style={styles.label}>Select Items:</Text>
          <MultiSelect
            items={items}
            uniqueKey="itemName"
            onSelectedItemsChange={handleItemSelect}
            selectedItems={formData.selectedItems}
            selectText="Pick Items"
            searchInputPlaceholderText="Search Items..."
            displayKey="itemName"
            hideSubmitButton
            textColor="black"
            placeholderTextColor={'#000'}
          />
        </View>

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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.modalContainer}>
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
              onValueChange={value =>
                handleInputChange('fromWarehouse', value)
              }>
              <Picker.Item
                key={formData.fromWarehouse}
                label={formData.fromWarehouse}
                value={formData.fromWarehouse}
              />
            </Picker>
            <Text style={styles.label}>To Warehouse:</Text>
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
            </Picker>
            <Text style={styles.label}>Is Defective:</Text>
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
            <TouchableOpacity
              style={styles.button}
              onPress={handleDataOnSubmit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                setFormData(prevData => ({...prevData, modalVisible: false}))
              }>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#070604',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },

  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },

  buttonText: {
    color: '#fbd33b',
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fbd33b',
  },
  input: {
    backgroundColor: '#fbd33b',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: '#070604',
  },
  picker: {
    backgroundColor: '#fbd33b',
    color: '#070604',
    marginBottom: 20,
  },

  itemQuantityContainer: {
    width: width - 32,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  multiSelectWrapper: {
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default W2W;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   StyleSheet,
//   Modal,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
// } from 'react-native';
// import MultiSelect from 'react-native-multiple-select';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// import { API_URL } from '@env';

// const { width, height } = Dimensions.get('window');

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
//         const response = await axios.get(`${API_URL}/warehouse-admin/view-items`);
//         setItems(
//           response.data.items.map((item, index) => ({
//             _id: index + 1,
//             itemName: item,
//           }))
//         );
//       } catch (error) {
//         console.log('Failed to fetch items:', error);
//       }
//     };

//     const fetchWarehouses = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/warehouse-admin/get-warehouse`);
//         setFormData((prev) => ({
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
//         const response = await axios.get(`${API_URL}/warehouse-admin/all-warehouses`);
//         setAllWarehouse(response.data.allWarehouses);
//       } catch (error) {
//         console.log('Failed to fetch warehouses:', error);
//       }
//     };

//     fetchallWarehouses();
//   }, []);

//   const handleInputChange = (name, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleItemSelect = (selected) => {
//     setFormData((prevData) => {
//       const newQuantities = {};
//       selected.forEach((item) => {
//         newQuantities[item] = '';
//       });
//       return { ...prevData, selectedItems: selected, quantities: newQuantities };
//     });
//   };

//   const handleQuantityChange = (itemName, quantity) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       quantities: { ...prevData.quantities, [itemName]: quantity },
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

//     const itemSelected = selectedItems.map((item) => ({
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
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       if (response.status === 200) {
//         resetForm();
//         Alert.alert('Success', 'Transaction saved successfully');
//         setFormData((prevData) => ({ ...prevData, modalVisible: false }));
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
//     <FlatList
//       data={[{ key: 'form' }]}
//       renderItem={() => (
//         <View style={styles.card}>
//           <Text style={styles.cardHeader}>Outgoing Order</Text>

//           <Text>Select Items:</Text>
//           <MultiSelect
//             items={items}
//             uniqueKey="itemName"
//             onSelectedItemsChange={handleItemSelect}
//             selectedItems={formData.selectedItems}
//             selectText="Pick Items"
//             searchInputPlaceholderText="Search Items..."
//             displayKey="itemName"
//             hideSubmitButton
//             textColor="#000"
//           />
//           {formData.selectedItems.map((item) => (
//             <View key={item} style={styles.itemQuantityContainer}>
//               <Text style={styles.itemQuantityText}>Quantity for {item}:</Text>
//               <TextInput
//                 value={formData.quantities[item]}
//                 onChangeText={(value) => handleQuantityChange(item, value)}
//                 placeholder={`Enter quantity for ${item}`}
//                 style={styles.input}
//                 keyboardType="numeric"
//               />
//             </View>
//           ))}

//           <Text>Driver Name:</Text>
//           <TextInput
//             value={formData.driverName}
//             onChangeText={(value) => handleInputChange('driverName', value)}
//             placeholder="Enter Driver Name"
//             style={styles.input}
//           />

//           <Text>Driver Contact:</Text>
//           <TextInput
//             value={formData.driverContact}
//             onChangeText={(value) => handleInputChange('driverContact', value)}
//             placeholder="Enter Driver Contact"
//             style={styles.input}
//             keyboardType="phone-pad"
//           />

//           <Text>From Warehouse:</Text>
//           <Picker
//             selectedValue={formData.fromWarehouse}
//             style={styles.picker}
//             onValueChange={(value) => handleInputChange('fromWarehouse', value)}
//           >
//             <Picker.Item
//               key={formData.fromWarehouse}
//               label={formData.fromWarehouse}
//               value={formData.fromWarehouse}
//             />
//           </Picker>

//           <Text>To Warehouse:</Text>
//           <Picker
//             selectedValue={formData.toWarehouse}
//             style={styles.picker}
//             onValueChange={(value) => handleInputChange('toWarehouse', value)}
//           >
//             {allWarehouses.map((warehouse) => (
//               <Picker.Item key={warehouse._id} label={warehouse.warehouseName} value={warehouse.warehouseName} />
//             ))}
//           </Picker>

//           <Text>Is Defective:</Text>
//           <Picker
//             selectedValue={formData.isDefective}
//             style={styles.picker}
//             onValueChange={(value) => handleInputChange('isDefective', value)}
//           >
//             {[{ _id: 1, name: 'Yes' }, { _id: 2, name: 'No' }].map(({ _id, name }) => (
//               <Picker.Item key={_id} label={name} value={name} />
//             ))}
//           </Picker>

//           <View style={styles.remarksContainer}>
//             <Text>Remarks:</Text>
//             <TextInput
//               value={formData.remarks}
//               onChangeText={(value) => handleInputChange('remarks', value)}
//               placeholder="Enter Remarks"
//               style={styles.input}
//               maxLength={100}
//               multiline
//               numberOfLines={4}
//             />
//           </View>

//           <TouchableOpacity style={styles.button} onPress={handleDataOnSubmit}>
//             <Text style={styles.buttonText}>Save</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={resetForm}>
//             <Text style={styles.buttonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//       contentContainerStyle={styles.container}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   // container: {
//   //   flexGrow: 1,
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   //   padding: width * 0.05,
//   //   backgroundColor: '#f9f9f9',
//   // },
//   container: {
//     height: 100,
//     padding: 10,
//   },
//   card: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: width * 0.05,
//     marginBottom: height * 0.02,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   cardHeader: {
//     fontSize: width * 0.06,
//     fontWeight: 'bold',
//     marginBottom: height * 0.01,
//     textAlign: 'center',
//     color: '#333',
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
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: height * 0.015,
//   },
//   itemQuantityText: {
//     fontSize: width * 0.04,
//     fontWeight: '500',
//   },
//   remarksContainer: {
//     marginTop: height * 0.02,
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
// });

// export default W2W;
