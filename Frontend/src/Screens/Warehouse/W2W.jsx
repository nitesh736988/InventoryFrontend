// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import MultiSelect from 'react-native-multiple-select';
// import {Picker} from '@react-native-picker/picker';
// import axios from 'axios';
// import {API_URL} from '@env';

// // const {width} = Dimensions.get('window');

// const W2W = () => {
//   const [items, setItems] = useState([]);
//   const [allWarehouses, setAllWarehouse] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [formData, setFormData] = useState({
//     driverName: '',
//     driverContact: '',
//     remarks: '',
//     selectedItems: [],
//     quantities: {},
//     isDefective: null,
//     fromWarehouse: 'Bhiwani',
//     toWarehouse: '',
//   });

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/view-items`,
//         );
//         const items = response.data.items.map((item, index) => ({
//           _id: index + 1,
//           itemName: item,
//         }));
//         setItems(items);
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
//         setFormData(prev => ({
//           ...prev,
//           fromWarehouse: response.data.warehouseName,
//         }));
//       } catch (error) {
//         Alert.alert('Error', JSON.stringify(error.response.data?.message));
//       }
//     };

//     fetchItems();
//     fetchWarehouses();
//   }, []);

//   useEffect(() => {
//     const fetchAllWarehouses = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/all-warehouses`,
//         );
//         setAllWarehouse(response.data.allWarehouses);
//       } catch (error) {
//         Alert.alert('Error', JSON.stringify(error.response.data?.message));
//       }
//     };

//     fetchAllWarehouses();
//   }, []);

//   const handleInputChange = (name, value) => {
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleItemSelect = selected => {
//     const validItems = selected.filter(item =>
//       filteredItems.some(filteredItem => filteredItem.itemName === item),
//     );
//     setSelectedItems(validItems);

//     setFormData(prevData => ({
//       ...prevData,
//       selectedItems: validItems,
//       quantities: validItems.reduce((acc, item) => {
//         acc[item] = prevData.quantities[item] || '';
//         return acc;
//       }, {}),
//     }));
//   };

//   const handleQuantityChange = (itemName, quantity) => {
//     setFormData(prevData => ({
//       ...prevData,
//       quantities: {...prevData.quantities, [itemName]: quantity},
//     }));
//   };

//   const handleSearch = searchText => {
//     const filtered = items.filter(item =>
//       item.itemName.toLowerCase().includes(searchText.toLowerCase()),
//     );
//     setFilteredItems(filtered);
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
//       } else {
//         Alert.alert('Error', 'Failed to save transaction');
//       }
//     } catch (error) {
//       Alert.alert('Error', JSON.stringify(error.response.data?.message));
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
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <View
//         style={{
//           paddingHorizontal: 20,
//           backgroundColor: '#fbd33b',
//           paddingTop: 30,
//         }}>
//         <Text style={styles.heading}>Warehouse to Warehouse Transfer</Text>
//         <Text style={styles.label}>Select Items:</Text>
//         <MultiSelect
//           hideTags
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
//         {/* <View style={styles.modalContainer}> */}

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

//         <Text style={styles.label}>Driver Name:</Text>
//         <TextInput
//           value={formData.driverName}
//           onChangeText={value => handleInputChange('driverName', value)}
//           placeholder="Enter Driver Name"
//           style={styles.input}
//           placeholderTextColor={'#000'}
//         />
//         <Text style={styles.label}>Driver Contact:</Text>
//         <TextInput
//           value={formData.driverContact}
//           onChangeText={value => handleInputChange('driverContact', value)}
//           placeholder="Enter Driver Contact"
//           style={styles.input}
//           keyboardType="phone-pad"
//           placeholderTextColor={'#000'}
//         />

//         <Text style={styles.label}>From Warehouse:</Text>
//         <Picker
//           selectedValue={formData.fromWarehouse}
//           style={styles.picker}
//           onValueChange={value => handleInputChange('fromWarehouse', value)}>
//           <Picker.Item
//             label={formData.fromWarehouse}
//             value={formData.fromWarehouse}
//           />
//         </Picker>

//         {/* <Text style={styles.label}>To Warehouse:</Text>
//         <Picker
//           selectedValue={formData.toWarehouse}
//           style={styles.picker}
//           onValueChange={value => handleInputChange('toWarehouse', value)}>
//           {allWarehouses.map(warehouse => (
//             <Picker.Item
//               key={warehouse._id}
//               label={warehouse.warehouseName}
//               value={warehouse.warehouseName}
//             />
//           ))}
//         </Picker> */}

//         <Text style={styles.label}>To Warehouse:</Text>
//         <Picker
//           selectedValue={formData.toWarehouse || null}
//           style={styles.picker}
//           onValueChange={value => handleInputChange('toWarehouse', value)}>
//           <Picker.Item label="Select Warehouse" value={null} />
//           {allWarehouses.map(warehouse => (
//             <Picker.Item
//               key={warehouse._id}
//               label={warehouse.warehouseName}
//               value={warehouse.warehouseName}
//             />
//           ))}
//         </Picker>

//         {/* <Text style={styles.label}>Is Defective:</Text>
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
//             </Picker> */}

//         <Text style={styles.label}>Is Defective:</Text>
//         <Picker
//           selectedValue={formData.isDefective || null}
//           style={styles.picker}
//           onValueChange={value => handleInputChange('isDefective', value)}>
//           <Picker.Item label="Select Data" value={null} />
//           {[
//             {_id: 1, name: 'Yes'},
//             {_id: 2, name: 'No'},
//           ].map(({_id, name}) => (
//             <Picker.Item key={_id} label={name} value={name} />
//           ))}
//         </Picker>

//         <Text style={styles.label}>Remarks:</Text>
//         <TextInput
//           value={formData.remarks}
//           onChangeText={value => handleInputChange('remarks', value)}
//           placeholder="Enter Remarks"
//           style={styles.input}
//           maxLength={100}
//           multiline
//           numberOfLines={4}
//           placeholderTextColor={'#000'}
//         />
//         <TouchableOpacity style={styles.button} onPress={handleDataOnSubmit}>
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// // const styles = StyleSheet.create({
// //   container: {
// //     flexGrow: 1,
// //     padding: 20,
// //     backgroundColor: '#fbd33b',
// //   },
// //   button: {
// //     backgroundColor: '#070604',
// //     padding: 10,
// //     borderRadius: 5,
// //     marginVertical: 10,
// //     alignItems: 'center',
// //   },
// //   label: {
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //     marginBottom: 5,
// //     color: '#000',
// //   },
// //   heading: {
// //     fontSize: 22,
// //     fontWeight: 'bold',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //     color: 'black',
// //   },
// //   buttonText: {
// //     color: '#fbd33b',
// //     fontSize: 16,
// //     marginBottom: 150
// //   },
// //   scrollContainer: {
// //     flexGrow: 1,
// //   },

// //   input: {
// //     backgroundColor: '#fbd33b',
// //     borderWidth: 1,
// //     borderColor: '#070604',
// //     borderRadius: 5,
// //     padding: 10,
// //     marginBottom: 20,
// //     color: '#070604',
// //   },
// //   picker: {
// //     backgroundColor: '#fbd33b',
// //     color: '#070604',
// //     marginBottom: 20,
// //   },
// //   itemQuantityContainer: {
// //     paddingHorizontal: 16,
// //     backgroundColor: '#fbd33b'
// //   },
// //   listContainer: {
// //     maxHeight: 250,
// //   },
// // });

// const {width, height} = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: width * 0.05,
//     backgroundColor: '#fbd33b',
//   },
//   button: {
//     backgroundColor: '#070604',
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.2,
//     borderRadius: 8,
//     marginVertical: height * 0.02,
//     alignItems: 'center',
//     marginBottom: 140,
//   },
//   buttonText: {
//     color: '#fbd33b',
//     fontSize: width * 0.045,
//     fontWeight: 'bold',
//   },
//   label: {
//     fontWeight: 'bold',
//     fontSize: width * 0.045,
//     marginBottom: height * 0.005,
//     color: '#000',
//   },
//   heading: {
//     fontSize: width * 0.06,
//     fontWeight: 'bold',
//     marginBottom: height * 0.02,
//     textAlign: 'center',
//     color: 'black',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: height * 0.05,
//   },
//   input: {
//     backgroundColor: '#fbd33b',
//     borderWidth: 1,
//     borderColor: '#070604',
//     borderRadius: 8,
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.04,
//     marginBottom: height * 0.02,
//     fontSize: width * 0.04,
//     color: '#070604',
//   },
//   picker: {
//     backgroundColor: '#fbd33b',
//     color: '#070604',
//     marginBottom: height * 0.02,
//     fontSize: width * 0.04,
//   },
//   itemQuantityContainer: {
//     paddingHorizontal: width * 0.04,
//     backgroundColor: '#fbd33b',
//   },
//   listContainer: {
//     maxHeight: height * 0.3,
//   },
//   multiSelectContainer: {
//     width: '100%',
//     minHeight: height * 0.08,
//   },
//   multiSelectText: {
//     color: '#000',
//     fontSize: width * 0.04,
//   },
//   multiSelectDropdown: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: width * 0.02,
//   },
// });

// export default W2W;


// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import MultiSelect from 'react-native-multiple-select';
// import {Picker} from '@react-native-picker/picker';
// import axios from 'axios';
// import {API_URL} from '@env';

// const W2W = () => {
//   const [items, setItems] = useState([]);
//   const [allWarehouses, setAllWarehouse] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [isNewStock, setIsNewStock] = useState('');
//   const [formData, setFormData] = useState({
//     driverName: '',
//     driverContact: '',
//     remarks: '',
//     selectedItems: [],
//     quantities: {},
//     isDefective: null,
//     fromWarehouse: 'Bhiwani',
//     toWarehouse: '',
//   });

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/view-items`,
//         );
//         const items = response.data.items.map((item, index) => ({
//           _id: index + 1,
//           itemName: item,
//         }));
//         setItems(items);
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
//         setFormData(prev => ({
//           ...prev,
//           fromWarehouse: response.data.warehouseName,
//         }));
//       } catch (error) {
//         Alert.alert('Error', JSON.stringify(error.response.data?.message));
//       }
//     };

//     fetchItems();
//     fetchWarehouses();
//   }, []);

//   useEffect(() => {
//     const fetchAllWarehouses = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/all-warehouses`,
//         );
//         setAllWarehouse(response.data.allWarehouses);
//       } catch (error) {
//         Alert.alert('Error', JSON.stringify(error.response.data?.message));
//       }
//     };

//     fetchAllWarehouses();
//   }, []);

//   const handleInputChange = (name, value) => {
//     if (name === 'isDefective' && value !== 'No') {
//       setIsNewStock('');
//     }
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleItemSelect = selected => {
//     const validItems = selected.filter(item =>
//       filteredItems.some(filteredItem => filteredItem.itemName === item),
//     );
//     setSelectedItems(validItems);

//     setFormData(prevData => ({
//       ...prevData,
//       selectedItems: validItems,
//       quantities: validItems.reduce((acc, item) => {
//         acc[item] = prevData.quantities[item] || '';
//         return acc;
//       }, {}),
//     }));
//   };

//   const handleQuantityChange = (itemName, quantity) => {
//     setFormData(prevData => ({
//       ...prevData,
//       quantities: {...prevData.quantities, [itemName]: quantity},
//     }));
//   };

//   const handleSearch = searchText => {
//     const filtered = items.filter(item =>
//       item.itemName.toLowerCase().includes(searchText.toLowerCase()),
//     );
//     setFilteredItems(filtered);
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

//     if (!driverName || !driverContact) {
//       Alert.alert('Error', 'Please enter driver details');
//       return false;
//     }

//     if (!toWarehouse) {
//       Alert.alert('Error', 'Please select destination warehouse');
//       return false;
//     }

//     if (isDefective === null) {
//       Alert.alert('Error', 'Please select if items are defective');
//       return false;
//     }

//     if (selectedItems.length === 0) {
//       Alert.alert('Error', 'Please select at least one item');
//       return false;
//     }

//     for (const item of selectedItems) {
//       const quantity = formData.quantities[item];
//       if (!quantity) {
//         Alert.alert('Error', `Please enter a valid quantity for ${item}`);
//         return false;
//       }
//       if (parseInt(quantity, 10) <= 0) {
//         Alert.alert('Error', `Quantity for ${item} must be greater than 0`);
//         return false;
//       }
//     }

//     if (isDefective === 'No' && !isNewStock) {
//       Alert.alert('Error', 'Please specify if this is new stock');
//       return false;
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
//       isDefective: isDefective === 'Yes',
//       items: itemSelected,
//       driverName,
//       driverContact,
//       remarks,
//       status: false,
//       pickupDate: new Date(),
//       isNewStock: isNewStock === 'Yes',
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
//         console.log('Transaction saved successfully:', response.data);
//       } else {
//         Alert.alert('Error', 'Failed to save transaction');
//       }
//     } catch (error) {
//       Alert.alert('Error', JSON.stringify(error.response.data?.message));
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       driverName: '',
//       driverContact: '',
//       remarks: '',
//       selectedItems: [],
//       quantities: {},
//       isDefective: null,
//       fromWarehouse: 'Bhiwani',
//       toWarehouse: '',
//     });
//     setIsNewStock('');
//     setSelectedItems([]);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.heading}>Warehouse to Warehouse Transfer</Text>
//         <Text style={styles.label}>Select Items:</Text>
//         <MultiSelect
//           hideTags
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

//         <Text style={styles.label}>Driver Name:</Text>
//         <TextInput
//           value={formData.driverName}
//           onChangeText={value => handleInputChange('driverName', value)}
//           placeholder="Enter Driver Name"
//           style={styles.input}
//           placeholderTextColor={'#000'}
//         />

//         <Text style={styles.label}>Driver Contact:</Text>
//         <TextInput
//           value={formData.driverContact}
//           onChangeText={value => handleInputChange('driverContact', value)}
//           placeholder="Enter Driver Contact"
//           style={styles.input}
//           keyboardType="phone-pad"
//           placeholderTextColor={'#000'}
//         />

//         <Text style={styles.label}>From Warehouse:</Text>
//         <Picker
//           selectedValue={formData.fromWarehouse}
//           style={styles.picker}
//           onValueChange={value => handleInputChange('fromWarehouse', value)}>
//           <Picker.Item
//             label={formData.fromWarehouse}
//             value={formData.fromWarehouse}
//           />
//         </Picker>

//         <Text style={styles.label}>To Warehouse:</Text>
//         <Picker
//           selectedValue={formData.toWarehouse || null}
//           style={styles.picker}
//           onValueChange={value => handleInputChange('toWarehouse', value)}>
//           <Picker.Item label="Select Warehouse" value={null} />
//           {allWarehouses.map(warehouse => (
//             <Picker.Item
//               key={warehouse._id}
//               label={warehouse.warehouseName}
//               value={warehouse.warehouseName}
//             />
//           ))}
//         </Picker>

//         <Text style={styles.label}>Is Defective:</Text>
//         <Picker
//           selectedValue={formData.isDefective || null}
//           style={styles.picker}
//           onValueChange={value => handleInputChange('isDefective', value)}>
//           <Picker.Item label="Select Option" value={null} />
//           <Picker.Item label="Yes" value="Yes" />
//           <Picker.Item label="No" value="No" />
//         </Picker>

//         {formData.isDefective === 'No' && (
//           <>
//             <Text style={styles.label}>Is New Stock?</Text>
//             <Picker
//               selectedValue={isNewStock}
//               onValueChange={itemValue => setIsNewStock(itemValue)}
//               style={styles.picker}>
//               <Picker.Item label="Select Option" value="" />
//               <Picker.Item label="YES - New Item" value="Yes" />
//               <Picker.Item label="NO - Repaired Item" value="No" />
//             </Picker>
//           </>
//         )}

//         <Text style={styles.label}>Remarks:</Text>
//         <TextInput
//           value={formData.remarks}
//           onChangeText={value => handleInputChange('remarks', value)}
//           placeholder="Enter Remarks"
//           style={styles.input}
//           maxLength={100}
//           multiline
//           numberOfLines={4}
//           placeholderTextColor={'#000'}
//         />

//         <TouchableOpacity style={styles.button} onPress={handleDataOnSubmit}>
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// const {width, height} = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fbd33b',
//     marginBottom: 120,
//   },
//   header: {
//     paddingHorizontal: width * 0.05,
//     backgroundColor: '#fbd33b',
//     paddingTop: height * 0.03,
//   },
//   button: {
//     backgroundColor: '#070604',
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.2,
//     borderRadius: 8,
//     marginVertical: height * 0.02,
//     alignItems: 'center',
//     marginBottom: 140,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fbd33b',
//     fontSize: width * 0.045,
//     fontWeight: 'bold',
//   },
//   label: {
//     fontWeight: 'bold',
//     fontSize: width * 0.045,
//     marginBottom: height * 0.005,
//     color: '#000',
//     paddingHorizontal: width * 0.05,
//   },
//   heading: {
//     fontSize: width * 0.06,
//     fontWeight: 'bold',
//     marginBottom: height * 0.02,
//     textAlign: 'center',
//     color: 'black',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: height * 0.05,
//   },
//   input: {
//     backgroundColor: '#fbd33b',
//     borderWidth: 1,
//     borderColor: '#070604',
//     borderRadius: 8,
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.04,
//     marginBottom: height * 0.02,
//     fontSize: width * 0.04,
//     color: '#070604',
//     marginHorizontal: width * 0.05,
//   },
//   picker: {
//     backgroundColor: '#fbd33b',
//     color: '#070604',
//     marginBottom: height * 0.02,
//     fontSize: width * 0.04,
//     marginHorizontal: width * 0.05,
//   },
//   itemQuantityContainer: {
//     backgroundColor: '#fbd33b',
//     paddingHorizontal: width * 0.05,
//   },
//   listContainer: {
//     maxHeight: height * 0.3,
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

const W2W = () => {
  const [items, setItems] = useState([]);
  const [allWarehouses, setAllWarehouse] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isNewStock, setIsNewStock] = useState('');
  const [formData, setFormData] = useState({
    driverName: '',
    driverContact: '',
    remarks: '',
    selectedItems: [],
    quantities: {},
    serialNumber: {},
    isDefective: null,
    fromWarehouse: 'Bhiwani',
    toWarehouse: '',
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/warehouse-admin/view-items`);
        const formattedItems = response.data.items.map((item, index) => ({
          _id: index + 1,
          itemName: item,
        }));
        setItems(formattedItems);
        setFilteredItems(formattedItems);
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to fetch items');
      }
    };

    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(`${API_URL}/warehouse-admin/get-warehouse`);
        setFormData(prev => ({
          ...prev,
          fromWarehouse: response.data.warehouseName,
        }));
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to fetch warehouse');
      }
    };

    fetchItems();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    const fetchAllWarehouses = async () => {
      try {
        const response = await axios.get(`${API_URL}/warehouse-admin/all-warehouses`);
        setAllWarehouse(response.data.allWarehouses);
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to fetch warehouses');
      }
    };

    fetchAllWarehouses();
  }, []);

  const handleSearch = (searchText) => {
    if (!searchText) {
      setFilteredItems(items);
      return;
    }
    const filtered = items.filter(item =>
      item.itemName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleInputChange = (name, value) => {
    if (name === 'isDefective' && value !== 'No') {
      setIsNewStock('');
    }
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleItemSelect = (selected) => {
    const validItems = selected.filter(item =>
      filteredItems.some(filteredItem => filteredItem.itemName === item)
    );
    setSelectedItems(validItems);

    setFormData(prevData => ({
      ...prevData,
      selectedItems: validItems,
      quantities: validItems.reduce((acc, item) => {
        acc[item] = prevData.quantities[item] || '';
        return acc;
      }, {}),
      serialNumber: validItems.reduce((acc, item) => {
        acc[item] = prevData.serialNumber[item] || [];
        return acc;
      }, {}),
    }));
  };

  const handleQuantityChange = (itemName, quantity) => {
    const qty = parseInt(quantity, 10) || 0;
    
    setFormData(prevData => {
      const currentSerials = prevData.serialNumber[itemName] || [];
      let newSerials = [...currentSerials];
      
      if (qty > currentSerials.length) {
        while (newSerials.length < qty) {
          newSerials.push('');
        }
      } else if (qty < currentSerials.length) {
        newSerials = newSerials.slice(0, qty);
      }
      
      return {
        ...prevData,
        quantities: {...prevData.quantities, [itemName]: quantity},
        serialNumber: {...prevData.serialNumber, [itemName]: newSerials},
      };
    });
  };

  const handleSerialNumberChange = (itemName, index, value) => {
    setFormData(prevData => {
      const updatedSerials = [...prevData.serialNumber[itemName]];
      updatedSerials[index] = value;
      
      return {
        ...prevData,
        serialNumber: {
          ...prevData.serialNumber,
          [itemName]: updatedSerials,
        },
      };
    });
  };

  const validateInput = () => {
    const {
      driverName,
      driverContact,
      selectedItems,
      fromWarehouse,
      toWarehouse,
      isDefective,
      quantities,
      serialNumber,
    } = formData;

    if (!driverName || !driverContact) {
      Alert.alert('Error', 'Please enter driver details');
      return false;
    }

    if (!toWarehouse) {
      Alert.alert('Error', 'Please select destination warehouse');
      return false;
    }

    if (isDefective === null) {
      Alert.alert('Error', 'Please select if items are defective');
      return false;
    }

    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return false;
    }

    for (const item of selectedItems) {
      const quantity = quantities[item];
      if (!quantity) {
        Alert.alert('Error', `Please enter a valid quantity for ${item}`);
        return false;
      }
      if (parseInt(quantity, 10) <= 0) {
        Alert.alert('Error', `Quantity for ${item} must be greater than 0`);
        return false;
      }
      
      const itemSerials = serialNumber[item] || [];
      if (itemSerials.length !== parseInt(quantity, 10)) {
        Alert.alert('Error', `Quantity and serial numbers count don't match for ${item}`);
        return false;
      }
      
      for (let i = 0; i < itemSerials.length; i++) {
        if (!itemSerials[i]) {
          Alert.alert('Error', `Please enter serial number #${i + 1} for ${item}`);
          return false;
        }
      }
    }

    if (isDefective === 'No' && !isNewStock) {
      Alert.alert('Error', 'Please specify if this is new stock');
      return false;
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
      serialNumber,
      isDefective,
      fromWarehouse,
      toWarehouse,
      remarks,
    } = formData;

    const itemSelected = selectedItems.map(item => ({
      itemName: item,
      quantity: parseInt(quantities[item], 10),
      serialNumber: serialNumber[item],
    }));

    const data = {
      fromWarehouse,
      toWarehouse,
      isDefective: isDefective === 'Yes',
      items: itemSelected,
      driverName,
      driverContact,
      remarks,
      status: false,
      pickupDate: new Date(),
      isNewStock: isNewStock === 'Yes',
    };

    console.log('Data to be submitted:', {
      ...data,
      items: data.items.map(item => ({
        ...item,
        serialNumber: item.serialNumber
      }))
    });

    console.log('Full data JSON:', JSON.stringify(data, null, 2));

    console.log("serialNumber", serialNumber);

    try {
      console.log('Submitting data:', data);
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
      console.log('Submission error:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit data');
    }
  };

  const resetForm = () => {
    setFormData({
      driverName: '',
      driverContact: '',
      remarks: '',
      selectedItems: [],
      quantities: {},
      serialNumber: {},
      isDefective: null,
      fromWarehouse: 'Bhiwani',
      toWarehouse: '',
    });
    setIsNewStock('');
    setSelectedItems([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
        {formData.selectedItems.map(item => (
          <View key={item} style={styles.itemContainer}>
            <Text style={styles.itemLabel}>{item}</Text>
            
            <Text style={styles.label}>Quantity:</Text>
            <TextInput
              value={formData.quantities[item]}
              onChangeText={value => handleQuantityChange(item, value)}
              placeholder="Enter quantity"
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#000"
            />
            
            {formData.quantities[item] && parseInt(formData.quantities[item]) > 0 && (
              <View>
                <Text style={styles.label}>Serial Numbers:</Text>
                {(formData.serialNumber[item] || []).map((serial, index) => (
                  <TextInput
                    key={`${item}-${index}`}
                    value={serial}
                    onChangeText={value => handleSerialNumberChange(item, index, value)}
                    placeholder={`Serial #${index + 1}`}
                    style={styles.input}
                    placeholderTextColor="#000"
                  />
                ))}
              </View>
            )}
          </View>
        ))}

        <Text style={styles.label}>Driver Name:</Text>
        <TextInput
          value={formData.driverName}
          onChangeText={value => handleInputChange('driverName', value)}
          placeholder="Enter Driver Name"
          style={styles.input}
          placeholderTextColor="#000"
        />

        <Text style={styles.label}>Driver Contact:</Text>
        <TextInput
          value={formData.driverContact}
          onChangeText={value => handleInputChange('driverContact', value)}
          placeholder="Enter Driver Contact"
          style={styles.input}
          keyboardType="phone-pad"
          placeholderTextColor="#000"
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

        <Text style={styles.label}>To Warehouse:</Text>
        <Picker
          selectedValue={formData.toWarehouse || ''}
          style={styles.picker}
          onValueChange={value => handleInputChange('toWarehouse', value)}>
          <Picker.Item label="Select Warehouse" value="" />
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
          selectedValue={formData.isDefective || ''}
          style={styles.picker}
          onValueChange={value => handleInputChange('isDefective', value)}>
          <Picker.Item label="Select Option" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>

        {formData.isDefective === 'No' && (
          <>
            <Text style={styles.label}>Is New Stock?</Text>
            <Picker
              selectedValue={isNewStock}
              onValueChange={itemValue => setIsNewStock(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Select Option" value="" />
              <Picker.Item label="YES - New Item" value="Yes" />
              <Picker.Item label="NO - Repaired Item" value="No" />
            </Picker>
          </>
        )}

        <Text style={styles.label}>Remarks:</Text>
        <TextInput
          value={formData.remarks}
          onChangeText={value => handleInputChange('remarks', value)}
          placeholder="Enter Remarks"
          style={[styles.input, {height: 100}]}
          maxLength={100}
          multiline
          placeholderTextColor="#000"
        />

        <TouchableOpacity style={styles.button} onPress={handleDataOnSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbd33b',
  },
  header: {
    paddingHorizontal: width * 0.05,
    backgroundColor: '#fbd33b',
    paddingTop: height * 0.02,
  },
  scrollContainer: {
    paddingBottom: height * 0.1,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
    color: '#000',
  },
  label: {
    fontWeight: 'bold',
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
    color: '#000',
    paddingHorizontal: width * 0.05,
  },
  itemLabel: {
    fontWeight: 'bold',
    fontSize: width * 0.04,
    marginTop: height * 0.02,
    color: '#000',
    paddingHorizontal: width * 0.05,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 8,
    padding: width * 0.03,
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
    color: '#000',
    marginHorizontal: width * 0.05,
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 8,
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.05,
    color: '#000',
  },
  button: {
    backgroundColor: '#070604',
    paddingVertical: height * 0.02,
    borderRadius: 8,
    marginVertical: height * 0.02,
    alignItems: 'center',
    marginHorizontal: width * 0.05,
  },
  buttonText: {
    color: '#fbd33b',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  listContainer: {
    maxHeight: height * 0.3,
  },
  itemContainer: {
    marginBottom: height * 0.01,
  },
});

export default W2W;