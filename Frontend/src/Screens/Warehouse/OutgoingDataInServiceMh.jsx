// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
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
//         Alert.alert('Error', JSON.stringify(error.response.data?.message));
//       }
//     };

//     const fetchSystems = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/show-systems`,
//         );
//         setSystems(response?.data?.data);
//       } catch (error) {
//         Alert.alert('Error', 'Failed to fetch systems');
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
//       if (item?.systemItemId.itemName.includes('Solar Panel')) {
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
//       Alert.alert('Error', 'Failed to fetch items for system');
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

//   const getSelectedItem = () => {
//     return items.find(i => i.systemItemId._id === selectedItem);
//   };

//   const getSelectedItemName = () => {
//     return getSelectedItem()?.systemItemId?.itemName || '';
//   };

//   const isSolarPanel = () =>
//     getSelectedItemName().toLowerCase().includes('solar panel');

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
//     if (!quantity) {
//       Alert.alert('Error', 'Please enter a valid quantity');
//       return false;
//     }
//     if (!farmerSaralId) {
//       Alert.alert('Error', 'Please enter Farmer Saral ID');
//       return false;
//     }

//     if (isSolarPanel() && panelNumbers.some(sn => !sn)) {
//       Alert.alert('Error', 'Please enter all serial numbers');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateInput()) return;

//     const selectedItemData = getSelectedItem();

//     const data = {
//       farmerSaralId: farmerSaralId,
//       empId: selectedServicePerson,
//       systemId: selectedSystem,
//       itemsList: [{
//         systemItemId: selectedItem,
//         quantity: parseInt(quantity, 10)
//       }],
//       ...(isSolarPanel() && {panelNumbers}),
//       ...(pumpNumber && {pumpNumber}),
//       ...(controllerNumber && {controllerNumber}),
//       ...(rmuNumber && {rmuNumber}),
//     };

//     console.log('Data to be sent:', data);

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${API_URL}/warehouse-admin/add-new-installation`,
//         data,
//         {headers: {'Content-Type': 'application/json'}},
//       );
//       console.log('response:', response);
//       console.log('response data:', response.data);

//         Alert.alert('Success', 'Transaction saved successfully');
//         resetForm();
//     } catch (error) {
//       Alert.alert('Error', JSON.stringify(error.response?.data?.message));
//       console.log('Error:', error);
//       console.log('Error response:', error.response);
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
//     setItems([]);
//     setSelectedSubItems({});
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.form}>

//           <Text style={styles.label}>System:</Text>
//           <Picker
//             selectedValue={selectedSystem}
//             onValueChange={setSelectedSystem}
//             style={styles.picker}>
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
//                 style={styles.picker}>
//                 <Picker.Item label="Select Item" value="" />
//                 {items.map(item => (
//                   <Picker.Item
//                     key={item.systemItemId._id}
//                     label={`${item.systemItemId.itemName}`}
//                     value={item.systemItemId._id}
//                   />
//                 ))}
//               </Picker>
//             </>
//           )}

//           <Text style={styles.label}>Farmer Saral ID:</Text>
//           <TextInput
//             style={styles.input}
//             value={farmerSaralId}
//             onChangeText={setFarmerSaralId}
//             placeholder="Enter Farmer Saral ID"
//           />

//           <Text style={styles.label}>Service Person:</Text>
//           <Picker
//             selectedValue={selectedServicePerson}
//             onValueChange={setSelectedServicePerson}
//             style={styles.picker}>
//             <Picker.Item label="Select Service Person" value="" />
//             {servicePerson.map(person => (
//               <Picker.Item
//                 key={person._id}
//                 label={person.name}
//                 value={person._id}
//               />
//             ))}
//           </Picker>

//           {selectedItem && (
//             <>
//               <Text style={styles.label}>Quantity:</Text>
//               <TextInput
//                 style={styles.input}
//                 value={quantity}
//                 onChangeText={setQuantity}
//                 keyboardType="numeric"
//                 placeholder="Enter quantity"
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
//                 />
//               ))}
//             </>
//           )}

//           <Text style={styles.label}>Pump Number:</Text>
//           <TextInput
//             style={styles.input}
//             value={pumpNumber}
//             onChangeText={setPumpNumber}
//             placeholder="Enter Pump Number"
//           />

//           <Text style={styles.label}>Controller Number:</Text>
//           <TextInput
//             style={styles.input}
//             value={controllerNumber}
//             onChangeText={setControllerNumber}
//             placeholder="Enter Controller Number"
//           />

//           <Text style={styles.label}>RMU Number:</Text>
//           <TextInput
//             style={styles.input}
//             value={rmuNumber}
//             onChangeText={setRmuNumber}
//             placeholder="Enter RMU Number"
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

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   FlatList,
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
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [panelNumbers, setPanelNumbers] = useState({});
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
//         Alert.alert('Error', JSON.stringify(error.response.data?.message));
//       }
//     };

//     const fetchSystems = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/show-systems`,
//         );
//         setSystems(response?.data?.data);
//       } catch (error) {
//         Alert.alert('Error', 'Failed to fetch systems');
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

//   const fetchItemsForSystem = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${API_URL}/warehouse-admin/show-items-subItems?systemId=${selectedSystem}`,
//       );
//       setItems(response?.data?.data);
//       setSelectedItems([]);
//       setQuantities({});
//       setPanelNumbers({});
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch items for system');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleItemSelection = itemId => {
//     setSelectedItems(prev => {
//       if (prev.includes(itemId)) {
//         const newQuantities = {...quantities};
//         delete newQuantities[itemId];
//         setQuantities(newQuantities);

//         const newPanelNumbers = {...panelNumbers};
//         delete newPanelNumbers[itemId];
//         setPanelNumbers(newPanelNumbers);

//         return prev.filter(id => id !== itemId);
//       } else {
//         return [...prev, itemId];
//       }
//     });
//   };

//   const handleQuantityChange = (itemId, value) => {
//     setQuantities(prev => ({
//       ...prev,
//       [itemId]: value,
//     }));

//     // If this is a solar panel, initialize panel numbers array
//     const item = items.find(i => i.systemItemId._id === itemId);
//     if (item?.systemItemId.itemName.toLowerCase().includes('solar panel')) {
//       const qty = parseInt(value, 10) || 0;
//       setPanelNumbers(prev => ({
//         ...prev,
//         [itemId]: Array(qty).fill(''),
//       }));
//     }
//   };

//   const handleSerialNumberChange = (itemId, index, value) => {
//     setPanelNumbers(prev => {
//       const newPanelNumbers = {...prev};
//       if (newPanelNumbers[itemId]) {
//         newPanelNumbers[itemId][index] = value;
//       }
//       return newPanelNumbers;
//     });
//   };

//   const getItemName = itemId => {
//     const item = items.find(i => i.systemItemId._id === itemId);
//     return item?.systemItemId?.itemName || '';
//   };

//   const isSolarPanel = itemName =>
//     itemName.toLowerCase().includes('solar panel');

//   const validateInput = () => {
//     if (!selectedServicePerson) {
//       Alert.alert('Error', 'Please select a service person');
//       return false;
//     }
//     if (!selectedSystem) {
//       Alert.alert('Error', 'Please select a system');
//       return false;
//     }
//     if (selectedItems.length === 0) {
//       Alert.alert('Error', 'Please select at least one item');
//       return false;
//     }
//     if (!farmerSaralId) {
//       Alert.alert('Error', 'Please enter Farmer Saral ID');
//       return false;
//     }

//     for (const itemId of selectedItems) {
//       if (!quantities[itemId]) {
//         Alert.alert(
//           'Error',
//           `Please enter a valid quantity for ${getItemName(itemId)}`,
//         );
//         return false;
//       }

//       const itemName = getItemName(itemId);
//       if (isSolarPanel(itemName)) {
//         const panelNumbersForItem = panelNumbers[itemId] || [];
//         if (panelNumbersForItem.some(sn => !sn)) {
//           Alert.alert(
//             'Error',
//             `Please enter all serial numbers for ${itemName}`,
//           );
//           return false;
//         }
//       }
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateInput()) return;

//     const itemsList = selectedItems.map(itemId => ({
//       systemItemId: itemId,
//       quantity: parseInt(quantities[itemId], 10),
//       ...(isSolarPanel(getItemName(itemId)) && {
//         panelNumbers: panelNumbers[itemId],
//       }),
//     }));

//     const data = {
//       farmerSaralId: farmerSaralId,
//       empId: selectedServicePerson,
//       systemId: selectedSystem,
//       itemsList: itemsList,
//       ...(pumpNumber && {pumpNumber}),
//       ...(controllerNumber && {controllerNumber}),
//       ...(rmuNumber && {rmuNumber}),
//     };

//     console.log('Data to be sent:', data);

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${API_URL}/warehouse-admin/add-new-installation`,
//         data,
//         {headers: {'Content-Type': 'application/json'}},
//       );
//       console.log('response:', response);
//       console.log('response data:', response.data);

//       Alert.alert('Success', 'Transaction saved successfully');
//       resetForm();
//     } catch (error) {
//       Alert.alert('Error', JSON.stringify(error.response?.data?.message));
//       console.log('Error:', error);
//       console.log('Error response:', error.response);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSelectedServicePerson('');
//     setSelectedSystem('');
//     setSelectedItems([]);
//     setQuantities({});
//     setPanelNumbers({});
//     setPumpNumber('');
//     setControllerNumber('');
//     setRmuNumber('');
//     setFarmerSaralId('');
//     setItems([]);
//     setSelectedSubItems({});
//   };

//   const renderItem = ({item}) => {
//     const itemId = item.systemItemId._id;
//     const isSelected = selectedItems.includes(itemId);
//     const itemName = item.systemItemId.itemName;
//     const isPanel = isSolarPanel(itemName);

//     return (
//       <View style={styles.itemContainer}>
//         <View style={styles.itemRow}>
//           <CheckBox
//             value={isSelected}
//             onValueChange={() => toggleItemSelection(itemId)}
//           />
//           <Text style={styles.itemText}>{itemName}</Text>
//         </View>

//         {isSelected && (
//           <View style={styles.itemDetails}>
//             <Text style={styles.label}>Quantity:</Text>
//             <TextInput
//               style={styles.input}
//               value={quantities[itemId] || ''}
//               onChangeText={text => handleQuantityChange(itemId, text)}
//               keyboardType="numeric"
//               placeholder="Enter quantity"
//             />

//             {isPanel && quantities[itemId] && (
//               <>
//                 <Text style={styles.label}>Enter Panel Numbers:</Text>
//                 {(panelNumbers[itemId] || []).map((sn, index) => (
//                   <TextInput
//                     key={index}
//                     style={styles.input}
//                     value={sn}
//                     onChangeText={text =>
//                       handleSerialNumberChange(itemId, index, text)
//                     }
//                     placeholder={`Panel ${index + 1} Serial Number`}
//                   />
//                 ))}
//               </>
//             )}
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.form}>
//           <Text style={styles.label}>System:</Text>
//           <Picker
//             selectedValue={selectedSystem}
//             onValueChange={setSelectedSystem}
//             style={styles.picker}>
//             <Picker.Item label="Select System" value="" />
//             {systems.map(system => (
//               <Picker.Item
//                 key={system._id}
//                 label={system.systemName}
//                 value={system._id}
//               />
//             ))}
//           </Picker>

//           <Text style={styles.label}>Farmer Saral ID:</Text>
//           <TextInput
//             style={styles.input}
//             value={farmerSaralId}
//             onChangeText={setFarmerSaralId}
//             placeholder="Enter Farmer Saral ID"
//           />

//           <Text style={styles.label}>Service Person:</Text>
//           <Picker
//             selectedValue={selectedServicePerson}
//             onValueChange={setSelectedServicePerson}
//             style={styles.picker}>
//             <Picker.Item label="Select Service Person" value="" />
//             {servicePerson.map(person => (
//               <Picker.Item
//                 key={person._id}
//                 label={person.name}
//                 value={person._id}
//               />
//             ))}
//           </Picker>

//           {items.length > 0 && (
//             <>
//               <Text style={styles.label}>Select Items:</Text>
//               <FlatList
//                 data={items}
//                 renderItem={renderItem}
//                 keyExtractor={item => item.systemItemId._id}
//                 scrollEnabled={false}
//               />
//             </>
//           )}

//           <Text style={styles.label}>Pump Number:</Text>
//           <TextInput
//             style={styles.input}
//             value={pumpNumber}
//             onChangeText={setPumpNumber}
//             placeholder="Enter Pump Number"
//           />

//           <Text style={styles.label}>Controller Number:</Text>
//           <TextInput
//             style={styles.input}
//             value={controllerNumber}
//             onChangeText={setControllerNumber}
//             placeholder="Enter Controller Number"
//           />

//           <Text style={styles.label}>RMU Number:</Text>
//           <TextInput
//             style={styles.input}
//             value={rmuNumber}
//             onChangeText={setRmuNumber}
//             placeholder="Enter RMU Number"
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
//   buttonText: {
//     color: '#fbd33b',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   itemContainer: {
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   itemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   itemText: {
//     marginLeft: 8,
//     fontSize: 16,
//     color: '#070604',
//   },
//   itemDetails: {
//     marginLeft: 28,
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
  FlatList,
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [panelNumbers, setPanelNumbers] = useState([]);
  const [selectedSubItems, setSelectedSubItems] = useState({});
  const [subItemQuantities, setSubItemQuantities] = useState({});
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
        Alert.alert('Error', JSON.stringify(error.response?.data?.message));
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

  const fetchItemsForSystem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/warehouse-admin/show-items-subItems?systemId=${selectedSystem}`,
      );
      setItems(response?.data?.data);
      setSelectedItems([]);
      setQuantities({});
      setPanelNumbers([]);
      setSelectedSubItems({});
      setSubItemQuantities({});
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch items for system');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        // Remove item if already selected
        const newQuantities = {...quantities};
        delete newQuantities[itemId];
        setQuantities(newQuantities);

        // Remove any selected sub-items for this item
        const item = items.find(i => i.systemItemId._id === itemId);
        if (item?.subItems?.length > 0) {
          const newSelectedSubItems = {...selectedSubItems};
          const newSubItemQuantities = {...subItemQuantities};
          item.subItems.forEach(subItem => {
            delete newSelectedSubItems[subItem.subItemId._id];
            delete newSubItemQuantities[subItem.subItemId._id];
          });
          setSelectedSubItems(newSelectedSubItems);
          setSubItemQuantities(newSubItemQuantities);
        }

        return prev.filter(id => id !== itemId);
      } else {
        // Add item if not selected
        return [...prev, itemId];
      }
    });
  };

  const toggleSubItemSelection = (subItemId) => {
    setSelectedSubItems(prev => ({
      ...prev,
      [subItemId]: !prev[subItemId],
    }));
  };

  const handleQuantityChange = (itemId, value) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleSubItemQuantityChange = (subItemId, value) => {
    setSubItemQuantities(prev => ({
      ...prev,
      [subItemId]: value
    }));
  };

  const handleSerialNumberChange = (index, value) => {
    setPanelNumbers(prev => {
      const newPanelNumbers = [...prev];
      newPanelNumbers[index] = value;
      return newPanelNumbers;
    });
  };

  const getItemName = (itemId) => {
    const item = items.find(i => i.systemItemId._id === itemId);
    return item?.systemItemId?.itemName || '';
  };

  const isSolarPanel = (itemName) => 
    itemName.toLowerCase().includes('solar panel');

  const validateInput = () => {
    if (!selectedServicePerson) {
      Alert.alert('Error', 'Please select a service person');
      return false;
    }
    if (!selectedSystem) {
      Alert.alert('Error', 'Please select a system');
      return false;
    }
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return false;
    }
    if (!farmerSaralId) {
      Alert.alert('Error', 'Please enter Farmer Saral ID');
      return false;
    }

    // Validate quantities
    for (const itemId of selectedItems) {
      if (!quantities[itemId]) {
        Alert.alert('Error', `Please enter a valid quantity for ${getItemName(itemId)}`);
        return false;
      }

      const item = items.find(i => i.systemItemId._id === itemId);
      if (item?.subItems) {
        for (const subItem of item.subItems) {
          if (selectedSubItems[subItem.subItemId._id]) {
            const subItemQty = subItemQuantities[subItem.subItemId._id];
            if (!subItemQty || isNaN(subItemQty)) {
              Alert.alert('Error', `Please enter a valid quantity for sub-item ${subItem.subItemId.itemName}`);
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    try {
      // Prepare items list
      const itemsList = selectedItems.map(itemId => {
        const item = items.find(i => i.systemItemId._id === itemId);
        
        const itemData = {
          systemItemId: itemId,
          quantity: parseInt(quantities[itemId], 10),
        };

        // Add subItems if any are selected
        if (item.subItems && item.subItems.length > 0) {
          const selectedSubs = item.subItems
            .filter(subItem => selectedSubItems[subItem.subItemId._id])
            .map(subItem => ({
              subItemId: subItem.subItemId._id,
              quantity: parseInt(subItemQuantities[subItem.subItemId._id], 10)
            }));

          if (selectedSubs.length > 0) {
            itemData.subItems = selectedSubs;
          }
        }

        return itemData;
      });

      // Filter out empty panel numbers
      const filteredPanelNumbers = panelNumbers.filter(num => num && num.trim() !== '');

      // Format the items list correctly
      const formattedItemsList = itemsList.flatMap(item => {
        const base = [{ systemItemId: item.systemItemId, quantity: item.quantity }];
        const subs = item.subItems?.map(sub => ({
          systemItemId: sub.subItemId,
          quantity: sub.quantity
        })) || [];
        return base.concat(subs);
      });

      const payload = {
        farmerSaralId: farmerSaralId,
        empId: selectedServicePerson,
        systemId: selectedSystem,
        itemsList: formattedItemsList,
        ...(filteredPanelNumbers.length > 0 && { panelNumbers: filteredPanelNumbers }),
        ...(pumpNumber && { pumpNumber }),
        ...(controllerNumber && { controllerNumber }),
        ...(rmuNumber && { rmuNumber }),
      };

      console.log('Final Payload:', payload);

      setLoading(true);
      const response = await axios.post(
        `${API_URL}/warehouse-admin/add-new-installation`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      Alert.alert('Success', 'Transaction saved successfully');
      resetForm();
    } catch (error) {
      console.log('Submission error:', error.response?.data || error.message);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to submit data'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedServicePerson('');
    setSelectedSystem('');
    setSelectedItems([]);
    setQuantities({});
    setPanelNumbers([]);
    setPumpNumber('');
    setControllerNumber('');
    setRmuNumber('');
    setFarmerSaralId('');
    setItems([]);
    setSelectedSubItems({});
    setSubItemQuantities({});
  };

  const renderItem = ({item}) => {
    const itemId = item.systemItemId._id;
    const isSelected = selectedItems.includes(itemId);
    const itemName = item.systemItemId.itemName;
    const isPanel = isSolarPanel(itemName);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemRow}>
          <CheckBox
            value={isSelected}
            onValueChange={() => toggleItemSelection(itemId)}
          />
          <Text style={styles.itemText}>{itemName}</Text>
        </View>

        {isSelected && (
          <View style={styles.itemDetails}>
            <Text style={styles.label}>Quantity:</Text>
            <TextInput
              style={styles.input}
              value={quantities[itemId]?.toString() || ''}
              onChangeText={(text) => handleQuantityChange(itemId, text)}
              keyboardType="numeric"
              placeholder="Enter quantity"
            />

            {isPanel && (
              <>
                <Text style={styles.label}>Enter Panel Numbers:</Text>
                {Array.from({ length: parseInt(quantities[itemId] || 0) }).map((_, index) => (
                  <TextInput
                    key={index}
                    style={styles.input}
                    value={panelNumbers[index] || ''}
                    onChangeText={text => handleSerialNumberChange(index, text)}
                    placeholder={`Panel ${index + 1} Serial Number`}
                  />
                ))}
              </>
            )}

            {hasSubItems && (
              <>
                <Text style={styles.subItemHeader}>Sub Items:</Text>
                {item.subItems.map((subItem, subIndex) => (
                  <View key={subIndex} style={styles.subItemContainer}>
                    <View style={styles.subItemRow}>
                      <CheckBox
                        value={!!selectedSubItems[subItem.subItemId._id]}
                        onValueChange={() => toggleSubItemSelection(subItem.subItemId._id)}
                      />
                      <Text style={styles.subItemText}>
                        {subItem.subItemId.itemName}
                      </Text>
                    </View>
                    
                    {selectedSubItems[subItem.subItemId._id] && (
                      <View style={styles.subItemQuantityContainer}>
                        <Text style={styles.subItemLabel}>Quantity:</Text>
                        <TextInput
                          style={[styles.input, styles.subItemInput]}
                          value={subItemQuantities[subItem.subItemId._id]?.toString() || ''}
                          onChangeText={text => handleSubItemQuantityChange(subItem.subItemId._id, text)}
                          keyboardType="numeric"
                          placeholder="Enter quantity"
                        />
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
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

          {items.length > 0 && (
            <>
              <Text style={styles.label}>Select Items:</Text>
              <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.systemItemId._id}
                scrollEnabled={false}
              />
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  form: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  itemDetails: {
    marginLeft: 30,
    marginTop: 10,
  },
  subItemHeader: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#555',
  },
  subItemContainer: {
    marginBottom: 10,
    paddingLeft: 10,
  },
  subItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  subItemText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#555',
  },
  subItemQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginTop: 5,
    marginBottom: 10,
  },
  subItemLabel: {
    fontSize: 14,
    marginRight: 10,
    color: '#555',
  },
  subItemInput: {
    flex: 1,
    marginBottom: 0,
    padding: 10,
  },
});

export default OutgoingDataInServiceMh;