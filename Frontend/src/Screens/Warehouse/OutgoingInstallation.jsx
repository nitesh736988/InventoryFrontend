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
//   ActivityIndicator,
// } from 'react-native';
// import {Picker} from '@react-native-picker/picker';
// import CheckBox from '@react-native-community/checkbox';
// import axios from 'axios';
// import {API_URL} from '@env';
// import {useNavigation, useRoute} from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const OutgoingInstallation = () => {
//   const [servicePerson, setServicePerson] = useState([]);
//   const [systems, setSystems] = useState([]);
//   const [items, setItems] = useState([]);
//   const [selectedServicePerson, setSelectedServicePerson] = useState('');
//   const [selectedSystem, setSelectedSystem] = useState('');
//   const [selectedSystemName, setSelectedSystemName] = useState('');
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [panelNumbers, setPanelNumbers] = useState([]);
//   const [selectedSubItems, setSelectedSubItems] = useState({});
//   const [subItemQuantities, setSubItemQuantities] = useState({});
//   const [pumpNumber, setPumpNumber] = useState('');
//   const [controllerNumber, setControllerNumber] = useState('');
//   const [rmuNumber, setRmuNumber] = useState('');
//   const [farmerSaralId, setFarmerSaralId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [allScannedBarcodes, setAllScannedBarcodes] = useState([]);
//   const [motorNumber, setMotorNumber] = useState('');
//   const [availablePumps, setAvailablePumps] = useState([]);
//   const [selectedPump, setSelectedPump] = useState('');
//   const [isSaralIdValid, setIsSaralIdValid] = useState(false);
//   const [saralIdValidationMessage, setSaralIdValidationMessage] = useState('');
//   const [farmerDetails, setFarmerDetails] = useState(null);
//   const [validatingSaralId, setValidatingSaralId] = useState(false);

//   // Extra items state
//   const [showExtraItems, setShowExtraItems] = useState(false);
//   const [extraSelectedItems, setExtraSelectedItems] = useState([]);
//   const [extraQuantities, setExtraQuantities] = useState({});
//   const [extraPanelNumbers, setExtraPanelNumbers] = useState([]);
//   const [extraSelectedSubItems, setExtraSelectedSubItems] = useState({});
//   const [extraSubItemQuantities, setExtraSubItemQuantities] = useState({});
//   const placeholderTextColor = '#000000';

//   const navigation = useNavigation();
//   const route = useRoute();

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       if (route.params?.scannedBarcode && route.params?.barcodeType) {
//         const {scannedBarcode, barcodeType, panelIndex} = route.params;

//         if (allScannedBarcodes.includes(scannedBarcode)) {
//           Alert.alert('Duplicate', 'This barcode has already been scanned');
//           return;
//         }

//         switch (barcodeType) {
//           case 'pump':
//             setPumpNumber(scannedBarcode);
//             break;
//           case 'controller':
//             setControllerNumber(scannedBarcode);
//             break;
//           case 'rmu':
//             setRmuNumber(scannedBarcode);
//             break;
//           case 'motor':
//             setMotorNumber(scannedBarcode);
//             break;
//           case 'panel':
//             if (panelIndex !== undefined && panelIndex !== null) {
//               handlePanelNumberChange(panelIndex, scannedBarcode);
//             }
//             break;
//           case 'extraPanel':
//             if (panelIndex !== undefined && panelIndex !== null) {
//               handleExtraPanelNumberChange(panelIndex, scannedBarcode);
//             }
//             break;
//         }

//         setAllScannedBarcodes(prev => [...prev, scannedBarcode]);
//         navigation.setParams({
//           scannedBarcode: undefined,
//           barcodeType: undefined,
//           panelIndex: undefined,
//         });
//       }
//     });

//     return unsubscribe;
//   }, [navigation, route.params, allScannedBarcodes]);

//   useEffect(() => {
//     const fetchServicePersons = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/service-survey-persons?state=Maharashtra`,
//         );
//         setServicePerson(response?.data?.data);
//       } catch (error) {
//         Alert.alert('Error', JSON.stringify(error.response?.data?.message));
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
//       fetchAvailablePumps();
//       initializePanelNumbers();
//     }
//   }, [selectedSystem]);

//   useEffect(() => {
//     if (selectedPump) {
//       fetchItemsForSystem();
//     }
//   }, [selectedPump]);

//   const fetchAvailablePumps = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${API_URL}/warehouse-admin/show-pump-data?systemId=${selectedSystem}`,
//       );
//       setAvailablePumps(response?.data?.data || []);
//       setSelectedPump('');
//     } catch (error) {
//       Alert.alert('Error', JSON.stringify(error.response?.data?.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchItemsForSystem = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${API_URL}/warehouse-admin/show-items-subItems?systemId=${selectedSystem}`,
//       );
//       setItems(response?.data?.data);
//       setSelectedItems([]);
//       setQuantities({});
//       setPanelNumbers([]);
//       setSelectedSubItems({});
//       setSubItemQuantities({});
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch items for system');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateSaralId = async saralId => {
//     if (!saralId) {
//       setIsSaralIdValid(false);
//       setSaralIdValidationMessage('Please enter Farmer Saral ID');
//       setFarmerDetails(null);
//       return;
//     }

//     try {
//       setValidatingSaralId(true);
//       const response = await axios.get(
//         `http://88.222.214.93:8001/farmer/showFarmerAccordingToSaralId?saralId=${saralId}`,
//       );

//       if (response.data && response.data.success) {
//         setIsSaralIdValid(true);
//         setSaralIdValidationMessage('Valid Farmer Saral ID');
//         setFarmerDetails(response.data.data);
//       } else {
//         setIsSaralIdValid(false);
//         setSaralIdValidationMessage('Invalid Farmer Saral ID');
//         setFarmerDetails(null);
//       }
//     } catch (error) {
//       setIsSaralIdValid(false);
//       setSaralIdValidationMessage(
//         error?.response?.data?.message || 'Error validating Saral ID',
//       );
//       setFarmerDetails(null);
//     } finally {
//       setValidatingSaralId(false);
//     }
//   };

//   const handleSaralIdChange = text => {
//     setFarmerSaralId(text);
//     setIsSaralIdValid(false);
//     setSaralIdValidationMessage('');
//   };

//   const handleValidateSaralId = async () => {
//     await validateSaralId(farmerSaralId);
//   };

//   const toggleItemSelection = itemId => {
//     setSelectedItems(prev => {
//       if (prev.includes(itemId)) {
//         // Remove item if already selected
//         const newQuantities = {...quantities};
//         delete newQuantities[itemId];
//         setQuantities(newQuantities);

//         // Remove any selected sub-items for this item
//         const item = items.find(i => i.systemItemId._id === itemId);
//         if (item?.subItems?.length > 0) {
//           const newSelectedSubItems = {...selectedSubItems};
//           const newSubItemQuantities = {...subItemQuantities};
//           item.subItems.forEach(subItem => {
//             delete newSelectedSubItems[subItem.subItemId._id];
//             delete newSubItemQuantities[subItem.subItemId._id];
//           });
//           setSelectedSubItems(newSelectedSubItems);
//           setSubItemQuantities(newSubItemQuantities);
//         }

//         return prev.filter(id => id !== itemId);
//       } else {
//         return [...prev, itemId];
//       }
//     });
//   };

//   const toggleSubItemSelection = subItemId => {
//     setSelectedSubItems(prev => ({
//       ...prev,
//       [subItemId]: !prev[subItemId],
//     }));
//   };

//   const handleQuantityChange = (itemId, value) => {
//     setQuantities(prev => ({
//       ...prev,
//       [itemId]: value,
//     }));
//   };

//   const handleSubItemQuantityChange = (subItemId, value) => {
//     setSubItemQuantities(prev => ({
//       ...prev,
//       [subItemId]: value,
//     }));
//   };

//   const handlePanelNumberChange = (index, value) => {
//     setPanelNumbers(prev => {
//       const newPanelNumbers = [...prev];
//       newPanelNumbers[index] = value;
//       return newPanelNumbers;
//     });
//   };

//   const handleExtraPanelNumberChange = (index, value) => {
//     setExtraPanelNumbers(prev => {
//       const newPanelNumbers = [...prev];
//       newPanelNumbers[index] = value;
//       return newPanelNumbers;
//     });
//   };

//   const toggleExtraItemSelection = itemId => {
//     setExtraSelectedItems(prev => {
//       if (prev.includes(itemId)) {
//         // Remove item if already selected
//         const newQuantities = {...extraQuantities};
//         delete newQuantities[itemId];
//         setExtraQuantities(newQuantities);

//         // Remove any selected sub-items for this item
//         const item = items.find(i => i.systemItemId._id === itemId);
//         if (item?.subItems?.length > 0) {
//           const newSelectedSubItems = {...extraSelectedSubItems};
//           const newSubItemQuantities = {...extraSubItemQuantities};
//           item.subItems.forEach(subItem => {
//             delete newSelectedSubItems[subItem.subItemId._id];
//             delete newSubItemQuantities[subItem.subItemId._id];
//           });
//           setExtraSelectedSubItems(newSelectedSubItems);
//           setExtraSubItemQuantities(newSubItemQuantities);
//         }

//         return prev.filter(id => id !== itemId);
//       } else {
//         return [...prev, itemId];
//       }
//     });
//   };

//   const toggleExtraSubItemSelection = subItemId => {
//     setExtraSelectedSubItems(prev => ({
//       ...prev,
//       [subItemId]: !prev[subItemId],
//     }));
//   };

//   const handleExtraQuantityChange = (itemId, value) => {
//     setExtraQuantities(prev => ({
//       ...prev,
//       [itemId]: value,
//     }));
//   };

//   const handleExtraSubItemQuantityChange = (subItemId, value) => {
//     setExtraSubItemQuantities(prev => ({
//       ...prev,
//       [subItemId]: value,
//     }));
//   };

//   const handleScanBarcode = (type, index = null) => {
//     navigation.navigate('BarcodeScanner', {
//       barcodeType: type,
//       existingBarcodes: allScannedBarcodes,
//       returnScreen: 'OutgoingInstallation',
//       panelIndex: index,
//     });
//   };

//   const getItemName = itemId => {
//     const item = items.find(i => i.systemItemId._id === itemId);
//     return item?.systemItemId?.itemName || '';
//   };

//   const isSolarPanel = itemName =>
//     itemName.toLowerCase().includes('solar panel');

//   const initializePanelNumbers = () => {
//     setPanelNumbers([]);
//     setExtraPanelNumbers([]);
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
//     if (selectedItems.length === 0 && extraSelectedItems.length === 0) {
//       Alert.alert('Error', 'Please select at least one item');
//       return false;
//     }
//     if (!farmerSaralId) {
//       Alert.alert('Error', 'Please enter Farmer Saral ID');
//       return false;
//     }
//     if (!isSaralIdValid) {
//       Alert.alert('Error', 'Please validate Farmer Saral ID');
//       return false;
//     }

//     // Validate main items quantities
//     for (const itemId of selectedItems) {
//       if (!quantities[itemId]) {
//         Alert.alert(
//           'Error',
//           `Please enter a valid quantity for ${getItemName(itemId)}`,
//         );
//         return false;
//       }

//       const item = items.find(i => i.systemItemId._id === itemId);
//       if (item?.subItems) {
//         for (const subItem of item.subItems) {
//           if (selectedSubItems[subItem.subItemId._id]) {
//             const subItemQty = subItemQuantities[subItem.subItemId._id];
//             if (!subItemQty || isNaN(subItemQty)) {
//               Alert.alert(
//                 'Error',
//                 `Please enter a valid quantity for sub-item ${subItem.subItemId.itemName}`,
//               );
//               return false;
//             }
//           }
//         }
//       }
//     }

//     // Validate extra items quantities
//     for (const itemId of extraSelectedItems) {
//       if (!extraQuantities[itemId]) {
//         Alert.alert(
//           'Error',
//           `Please enter a valid quantity for extra item ${getItemName(itemId)}`,
//         );
//         return false;
//       }

//       const item = items.find(i => i.systemItemId._id === itemId);
//       if (item?.subItems) {
//         for (const subItem of item.subItems) {
//           if (extraSelectedSubItems[subItem.subItemId._id]) {
//             const subItemQty = extraSubItemQuantities[subItem.subItemId._id];
//             if (!subItemQty || isNaN(subItemQty)) {
//               Alert.alert(
//                 'Error',
//                 `Please enter a valid quantity for extra sub-item ${subItem.subItemId.itemName}`,
//               );
//               return false;
//             }
//           }
//         }
//       }
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateInput()) return;

//     try {
//       // Prepare main items list
//       const itemsList = selectedItems.map(itemId => {
//         const item = items.find(i => i.systemItemId._id === itemId);

//         const itemData = {
//           systemItemId: itemId,
//           quantity: parseInt(quantities[itemId], 10),
//         };

//         // Add subItems if any are selected
//         if (item.subItems && item.subItems.length > 0) {
//           const selectedSubs = item.subItems
//             .filter(subItem => selectedSubItems[subItem.subItemId._id])
//             .map(subItem => ({
//               subItemId: subItem.subItemId._id,
//               quantity: parseInt(subItemQuantities[subItem.subItemId._id], 10),
//             }));

//           if (selectedSubs.length > 0) {
//             itemData.subItems = selectedSubs;
//           }
//         }

//         return itemData;
//       });

//       // Prepare extra items list if any
//       const extraItemsList = extraSelectedItems.map(itemId => {
//         const item = items.find(i => i.systemItemId._id === itemId);

//         const itemData = {
//           systemItemId: itemId,
//           quantity: parseInt(extraQuantities[itemId], 10),
//         };

//         // Add subItems if any are selected
//         if (item.subItems && item.subItems.length > 0) {
//           const selectedSubs = item.subItems
//             .filter(subItem => extraSelectedSubItems[subItem.subItemId._id])
//             .map(subItem => ({
//               subItemId: subItem.subItemId._id,
//               quantity: parseInt(
//                 extraSubItemQuantities[subItem.subItemId._id],
//                 10,
//               ),
//             }));

//           if (selectedSubs.length > 0) {
//             itemData.subItems = selectedSubs;
//           }
//         }

//         return itemData;
//       });

//       // Filter out empty panel numbers
//       const filteredPanelNumbers = panelNumbers.filter(
//         num => num && num.trim() !== '',
//       );
//       const filteredExtraPanelNumbers = extraPanelNumbers.filter(
//         num => num && num.trim() !== '',
//       );

//       // Format the items lists correctly
//       const formattedItemsList = itemsList.flatMap(item => {
//         const base = [
//           {systemItemId: item.systemItemId, quantity: item.quantity},
//         ];
//         const subs =
//           item.subItems?.map(sub => ({
//             systemItemId: sub.subItemId,
//             quantity: sub.quantity,
//           })) || [];
//         return base.concat(subs);
//       });

//       const formattedExtraItemsList = extraItemsList.flatMap(item => {
//         const base = [
//           {systemItemId: item.systemItemId, quantity: item.quantity},
//         ];
//         const subs =
//           item.subItems?.map(sub => ({
//             systemItemId: sub.subItemId,
//             quantity: sub.quantity,
//           })) || [];
//         return base.concat(subs);
//       });

//       const payload = {
//         farmerSaralId: farmerSaralId,
//         empId: selectedServicePerson,
//         systemId: selectedSystem,
//         itemsList: formattedItemsList,
//         ...(filteredPanelNumbers.length > 0 && {
//           panelNumbers: filteredPanelNumbers,
//         }),
//         ...(pumpNumber && {pumpNumber}),
//         ...(motorNumber && {motorNumber}),
//         ...(controllerNumber && {controllerNumber}),
//         ...(rmuNumber && {rmuNumber}),
//         ...(formattedExtraItemsList.length > 0 && {
//           extraItemsList: formattedExtraItemsList,
//         }),
//         ...(filteredExtraPanelNumbers.length > 0 && {
//           extraPanelNumbers: filteredExtraPanelNumbers,
//         }),
//       };

//       console.log('Final Payload:', payload);

//       setLoading(true);
//       const response = await axios.post(
//         `${API_URL}/warehouse-admin/add-new-installation`,
//         payload,
//         {headers: {'Content-Type': 'application/json'}},
//       );

//       Alert.alert('Success', 'Transaction saved successfully');
//       resetForm();
//     } catch (error) {
//       console.log('Submission error:', error.response?.data || error.message);
//       Alert.alert(
//         'Error',
//         error.response?.data?.message || 'Failed to submit data',
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSelectedServicePerson('');
//     setSelectedSystem('');
//     setSelectedSystemName('');
//     setSelectedItems([]);
//     setQuantities({});
//     setPanelNumbers([]);
//     setPumpNumber('');
//     setControllerNumber('');
//     setRmuNumber('');
//     setFarmerSaralId('');
//     setMotorNumber('');
//     setIsSaralIdValid(false);
//     setSaralIdValidationMessage('');
//     setItems([]);
//     setSelectedSubItems({});
//     setSubItemQuantities({});
//     setFarmerDetails(null);
//     setSelectedPump('');
//     setAllScannedBarcodes([]);
//     setShowExtraItems(false);
//     setExtraSelectedItems([]);
//     setExtraQuantities({});
//     setExtraPanelNumbers([]);
//     setExtraSelectedSubItems({});
//     setExtraSubItemQuantities({});
//   };

//   const renderPumpSelection = () => {
//     if (availablePumps.length === 0 || !selectedSystem) return null;

//     return (
//       <>
//         <Text style={styles.label}>Select Pump:</Text>
//         <Picker
//           selectedValue={selectedPump}
//           onValueChange={itemValue => {
//             setSelectedPump(itemValue);
//           }}
//           style={styles.picker}>
//           <Picker.Item label="Select Pump" value="" />
//           {availablePumps.map((pump, index) => (
//             <Picker.Item key={index} label={pump.itemName} value={pump._id} />
//           ))}
//         </Picker>

//         <Text style={styles.label}>Enter Pump Number:</Text>
//         <View style={styles.barcodeInputContainer}>
//           <TextInput
//             style={[styles.input, styles.barcodeInput]}
//             value={pumpNumber}
//             onChangeText={setPumpNumber}
//             placeholder="Enter Pump Number"
//             placeholderTextColor={placeholderTextColor}
//           />
//           <TouchableOpacity
//             style={styles.scanButton}
//             onPress={() => handleScanBarcode('pump')}>
//             <Text style={styles.scanButtonText}>Scan</Text>
//           </TouchableOpacity>
//         </View>
//       </>
//     );
//   };

//   const renderItem = ({item}) => {
//     const itemId = item.systemItemId._id;
//     const isSelected = selectedItems.includes(itemId);
//     const itemName = item.systemItemId.itemName;
//     const isPanel = isSolarPanel(itemName);
//     const hasSubItems = item.subItems && item.subItems.length > 0;

//     return (
//       <View style={styles.itemContainer}>
//         <View style={styles.itemRow}>
//           <CheckBox
//             value={isSelected}
//             onValueChange={() => toggleItemSelection(itemId)}
//             tintColors={{true: '#000000', false: '#000000'}}
//             onCheckColor="#000000"
//             onTintColor="#000000"
//             tintColor="#000000"
//           />
//           <Text style={styles.itemText}>{itemName}</Text>
//         </View>

//         {isSelected && (
//           <View style={styles.itemDetails}>
//             <Text style={styles.label}>Quantity:</Text>
//             <TextInput
//               style={styles.input}
//               value={quantities[itemId]?.toString() || ''}
//               onChangeText={text => handleQuantityChange(itemId, text)}
//               keyboardType="numeric"
//               placeholder="Enter quantity"
//               placeholderTextColor={placeholderTextColor}
//             />

//             {isPanel && (
//               <>
//                 <Text style={styles.label}>Enter Panel Numbers:</Text>
//                 {Array.from({length: parseInt(quantities[itemId] || 0)}).map(
//                   (_, index) => (
//                     <View key={index} style={styles.barcodeInputContainer}>
//                       <TextInput
//                         style={[styles.input, styles.barcodeInput]}
//                         value={panelNumbers[index] || ''}
//                         onChangeText={text =>
//                           handlePanelNumberChange(index, text)
//                         }
//                         placeholder={`Panel ${index + 1} Serial Number`}
//                         placeholderTextColor={placeholderTextColor}
//                       />
//                       <TouchableOpacity
//                         style={styles.scanButton}
//                         onPress={() => handleScanBarcode('panel', index)}>
//                         <Text style={styles.scanButtonText}>Scan</Text>
//                       </TouchableOpacity>
//                     </View>
//                   ),
//                 )}
//               </>
//             )}

//             {hasSubItems && (
//               <>
//                 <Text style={styles.subItemHeader}>Sub Items:</Text>
//                 {item.subItems.map((subItem, subIndex) => (
//                   <View key={subIndex} style={styles.subItemContainer}>
//                     <View style={styles.subItemRow}>
//                       <CheckBox
//                         value={!!selectedSubItems[subItem.subItemId._id]}
//                         onValueChange={() =>
//                           toggleSubItemSelection(subItem.subItemId._id)
//                         }
//                         tintColors={{true: '#000000', false: '#000000'}}
//                         onCheckColor="#000000"
//                         onTintColor="#000000"
//                         tintColor="#000000"
//                       />
//                       <Text style={styles.subItemText}>
//                         {subItem.subItemId.itemName}
//                       </Text>
//                     </View>

//                     {selectedSubItems[subItem.subItemId._id] && (
//                       <View style={styles.subItemQuantityContainer}>
//                         <Text style={styles.subItemLabel}>Quantity:</Text>
//                         <TextInput
//                           style={[styles.input, styles.subItemInput]}
//                           value={
//                             subItemQuantities[
//                               subItem.subItemId._id
//                             ]?.toString() || ''
//                           }
//                           onChangeText={text =>
//                             handleSubItemQuantityChange(
//                               subItem.subItemId._id,
//                               text,
//                             )
//                           }
//                           keyboardType="numeric"
//                           placeholder="Enter quantity"
//                           placeholderTextColor={placeholderTextColor}
//                         />
//                       </View>
//                     )}
//                   </View>
//                 ))}
//               </>
//             )}
//           </View>
//         )}
//       </View>
//     );
//   };

//   const renderExtraItem = ({item}) => {
//     const itemId = item.systemItemId._id;
//     const isSelected = extraSelectedItems.includes(itemId);
//     const itemName = item.systemItemId.itemName;
//     const isPanel = isSolarPanel(itemName);
//     const hasSubItems = item.subItems && item.subItems.length > 0;

//     return (
//       <View style={styles.itemContainer}>
//         <View style={styles.itemRow}>
//           <CheckBox
//             value={isSelected}
//             onValueChange={() => toggleExtraItemSelection(itemId)}
//             tintColors={{true: '#000000', false: '#000000'}}
//             onCheckColor="#000000"
//             onTintColor="#000000"
//             tintColor="#000000"
//           />
//           <Text style={styles.itemText}>{itemName}</Text>
//         </View>

//         {isSelected && (
//           <View style={styles.itemDetails}>
//             <Text style={styles.label}>Quantity:</Text>
//             <TextInput
//               style={styles.input}
//               value={extraQuantities[itemId]?.toString() || ''}
//               onChangeText={text => handleExtraQuantityChange(itemId, text)}
//               keyboardType="numeric"
//               placeholder="Enter quantity"
//               placeholderTextColor={placeholderTextColor}
//             />

//             {isPanel && (
//               <>
//                 <Text style={styles.label}>Enter Panel Numbers:</Text>
//                 {Array.from({
//                   length: parseInt(extraQuantities[itemId] || 0),
//                 }).map((_, index) => (
//                   <View key={index} style={styles.barcodeInputContainer}>
//                     <TextInput
//                       style={[styles.input, styles.barcodeInput]}
//                       value={extraPanelNumbers[index] || ''}
//                       onChangeText={text =>
//                         handleExtraPanelNumberChange(index, text)
//                       }
//                       placeholder={`Panel ${index + 1} Serial Number`}
//                       placeholderTextColor={placeholderTextColor}
//                     />
//                     <TouchableOpacity
//                       style={styles.scanButton}
//                       onPress={() => handleScanBarcode('extraPanel', index)}>
//                       <Text style={styles.scanButtonText}>Scan</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//               </>
//             )}

//             {hasSubItems && (
//               <>
//                 <Text style={styles.subItemHeader}>Sub Items:</Text>
//                 {item.subItems.map((subItem, subIndex) => (
//                   <View key={subIndex} style={styles.subItemContainer}>
//                     <View style={styles.subItemRow}>
//                       <CheckBox
//                         value={!!extraSelectedSubItems[subItem.subItemId._id]}
//                         onValueChange={() =>
//                           toggleExtraSubItemSelection(subItem.subItemId._id)
//                         }
//                         tintColors={{true: '#000000', false: '#000000'}}
//                         onCheckColor="#000000"
//                         onTintColor="#000000"
//                         tintColor="#000000"
//                       />
//                       <Text style={styles.subItemText}>
//                         {subItem.subItemId.itemName}
//                       </Text>
//                     </View>

//                     {extraSelectedSubItems[subItem.subItemId._id] && (
//                       <View style={styles.subItemQuantityContainer}>
//                         <Text style={styles.subItemLabel}>Quantity:</Text>
//                         <TextInput
//                           style={[styles.input, styles.subItemInput]}
//                           value={
//                             extraSubItemQuantities[
//                               subItem.subItemId._id
//                             ]?.toString() || ''
//                           }
//                           onChangeText={text =>
//                             handleExtraSubItemQuantityChange(
//                               subItem.subItemId._id,
//                               text,
//                             )
//                           }
//                           keyboardType="numeric"
//                           placeholder="Enter quantity"
//                           placeholderTextColor={placeholderTextColor}
//                         />
//                       </View>
//                     )}
//                   </View>
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
//         <Text style={styles.header}>
//           Outgoing Data in Service (Maharashtra)
//         </Text>
//         <View style={styles.form}>
//           <Text style={styles.label}>Farmer Saral ID:</Text>
//           <View style={styles.saralIdContainer}>
//             <TextInput
//               style={[
//                 styles.input,
//                 styles.saralIdInput,
//                 farmerSaralId
//                   ? isSaralIdValid
//                     ? styles.validInput
//                     : saralIdValidationMessage
//                     ? styles.invalidInput
//                     : null
//                   : null,
//               ]}
//               value={farmerSaralId}
//               onChangeText={handleSaralIdChange}
//               placeholder="Enter Farmer Saral ID"
//               placeholderTextColor={placeholderTextColor}
//             />
//             <TouchableOpacity
//               style={styles.validateButton}
//               onPress={handleValidateSaralId}
//               disabled={validatingSaralId}>
//               <Text style={styles.validateButtonText}>
//                 {validatingSaralId ? 'Validating...' : 'Validate'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {validatingSaralId ? (
//             <View style={styles.validationContainer}>
//               <ActivityIndicator size="small" color="#0000ff" />
//               <Text style={styles.validatingText}>Validating...</Text>
//             </View>
//           ) : (
//             saralIdValidationMessage && (
//               <Text
//                 style={
//                   isSaralIdValid ? styles.validMessage : styles.invalidMessage
//                 }>
//                 {saralIdValidationMessage}
//               </Text>
//             )
//           )}

//           {farmerDetails && (
//             <View style={styles.farmerDetailsContainer}>
//               <Text style={styles.farmerDetailText}>
//                 <Text style={styles.farmerDetailLabel}>Name:</Text>{' '}
//                 {farmerDetails.farmerName}
//               </Text>
//               <Text style={styles.farmerDetailText}>
//                 <Text style={styles.farmerDetailLabel}>Contact:</Text>{' '}
//                 {farmerDetails.contact}
//               </Text>
//             </View>
//           )}

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

//           <Text style={styles.label}>System:</Text>
//           <Picker
//             selectedValue={selectedSystem}
//             onValueChange={value => {
//               setSelectedSystem(value);
//               const system = systems.find(sys => sys._id === value);
//               if (system) {
//                 setSelectedSystemName(system.systemName);
//               }
//             }}
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

//           {renderPumpSelection()}

//           {items.length > 0 && (
//             <>
//               <View style={styles.itemsHeader}>
//                 <Text style={styles.label}>Items List:</Text>
//                 {!showExtraItems && (
//                   <TouchableOpacity
//                     style={styles.addButton}
//                     onPress={() => setShowExtraItems(true)}>
//                     <Icon name="add" size={24} color="#4CAF50" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//               <FlatList
//                 data={items}
//                 renderItem={renderItem}
//                 keyExtractor={item => item.systemItemId._id}
//                 scrollEnabled={false}
//               />
//             </>
//           )}

//           {showExtraItems && (
//             <>
//               <View style={styles.itemsHeader}>
//                 <Text style={styles.label}>Extra Items List:</Text>
//                 <TouchableOpacity
//                   style={styles.addButton}
//                   onPress={() => setShowExtraItems(false)}>
//                   <Icon name="close" size={24} color="#F44336" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={items}
//                 renderItem={renderExtraItem}
//                 keyExtractor={item => item.systemItemId._id}
//                 scrollEnabled={false}
//               />
//             </>
//           )}

//           <Text style={styles.label}>Controller Number:</Text>
//           <View style={styles.barcodeInputContainer}>
//             <TextInput
//               style={[styles.input, styles.barcodeInput]}
//               value={controllerNumber}
//               onChangeText={setControllerNumber}
//               placeholder="Enter Controller Number"
//               placeholderTextColor={placeholderTextColor}
//             />
//             <TouchableOpacity
//               style={styles.scanButton}
//               onPress={() => handleScanBarcode('controller')}>
//               <Text style={styles.scanButtonText}>Scan</Text>
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.label}>RMU Number:</Text>
//           <View style={styles.barcodeInputContainer}>
//             <TextInput
//               style={[styles.input, styles.barcodeInput]}
//               value={rmuNumber}
//               onChangeText={setRmuNumber}
//               placeholder="Enter RMU Number"
//               placeholderTextColor={placeholderTextColor}
//             />
//             <TouchableOpacity
//               style={styles.scanButton}
//               onPress={() => handleScanBarcode('rmu')}>
//               <Text style={styles.scanButtonText}>Scan</Text>
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.label}>MOTOR Number:</Text>
//           <View style={styles.barcodeInputContainer}>
//             <TextInput
//               style={[styles.input, styles.barcodeInput]}
//               value={motorNumber}
//               onChangeText={setMotorNumber}
//               placeholder="Enter Motor Number"
//               placeholderTextColor={placeholderTextColor}
//             />
//             <TouchableOpacity
//               style={styles.scanButton}
//               onPress={() => handleScanBarcode('motor')}>
//               <Text style={styles.scanButtonText}>Scan</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={[styles.button, !isSaralIdValid && styles.disabledButton]}
//             onPress={handleSubmit}
//             disabled={loading || validatingSaralId || !isSaralIdValid}>
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
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//     textAlign: 'center',
//   },
//   form: {
//     padding: 20,
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: '#000',
//   },
//   picker: {
//     height: 50,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginBottom: 15,
//     color: '#000',
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 15,
//     fontSize: 16,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 8,
//     marginVertical: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   disabledButton: {
//     backgroundColor: '#cccccc',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   itemContainer: {
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 15,
//     backgroundColor: '#fff',
//   },
//   itemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   itemText: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   itemDetails: {
//     marginLeft: 30,
//     marginTop: 10,
//   },
//   subItemHeader: {
//     fontSize: 15,
//     fontWeight: '600',
//     marginTop: 15,
//     marginBottom: 8,
//     color: '#555',
//   },
//   subItemContainer: {
//     marginBottom: 10,
//     paddingLeft: 10,
//   },
//   subItemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   subItemText: {
//     marginLeft: 10,
//     fontSize: 15,
//     color: '#555',
//   },
//   subItemQuantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 30,
//     marginTop: 5,
//     marginBottom: 10,
//   },
//   subItemLabel: {
//     fontSize: 14,
//     marginRight: 10,
//     color: '#555',
//   },
//   subItemInput: {
//     flex: 1,
//     marginBottom: 0,
//     padding: 10,
//   },
//   barcodeInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   barcodeInput: {
//     flex: 1,
//     marginRight: 10,
//   },
//   scanButton: {
//     backgroundColor: '#2196F3',
//     padding: 12,
//     borderRadius: 8,
//   },
//   scanButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   saralIdContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   saralIdInput: {
//     flex: 1,
//     marginRight: 10,
//   },
//   validateButton: {
//     backgroundColor: '#FF9800',
//     padding: 12,
//     borderRadius: 8,
//   },
//   validateButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   validationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   validatingText: {
//     marginLeft: 10,
//     color: '#555',
//   },
//   validMessage: {
//     color: '#4CAF50',
//     marginBottom: 15,
//   },
//   invalidMessage: {
//     color: '#F44336',
//     marginBottom: 15,
//   },
//   validInput: {
//     borderColor: '#4CAF50',
//   },
//   invalidInput: {
//     borderColor: '#F44336',
//   },
//   farmerDetailsContainer: {
//     backgroundColor: '#f9f9f9',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   farmerDetailText: {
//     fontSize: 14,
//     marginBottom: 5,
//     color: '#333',
//   },
//   farmerDetailLabel: {
//     fontWeight: '600',
//   },
//   itemsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   addButton: {
//     padding: 8,
//   },
// });

// export default OutgoingInstallation;


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
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import {API_URL} from '@env';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OutgoingInstallation = () => {
  const [servicePerson, setServicePerson] = useState([]);
  const [systems, setSystems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedServicePerson, setSelectedServicePerson] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [selectedSystemName, setSelectedSystemName] = useState('');
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
  const [allScannedBarcodes, setAllScannedBarcodes] = useState([]);
  const [motorNumber, setMotorNumber] = useState('');
  const [availablePumps, setAvailablePumps] = useState([]);
  const [selectedPump, setSelectedPump] = useState('');
  const [isSaralIdValid, setIsSaralIdValid] = useState(false);
  const [saralIdValidationMessage, setSaralIdValidationMessage] = useState('');
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [validatingSaralId, setValidatingSaralId] = useState(false);
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [states] = useState([
    'Maharashtra',
    'Haryana',
    'Punjab',
    'Chattisgarh',
    'Rajasthan',
  ]);

  // Extra items state
  const [showExtraItems, setShowExtraItems] = useState(false);
  const [extraSelectedItems, setExtraSelectedItems] = useState([]);
  const [extraQuantities, setExtraQuantities] = useState({});
  const [extraPanelNumbers, setExtraPanelNumbers] = useState([]);
  const [extraSelectedSubItems, setExtraSelectedSubItems] = useState({});
  const [extraSubItemQuantities, setExtraSubItemQuantities] = useState({});
  const placeholderTextColor = '#000000';

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.scannedBarcode && route.params?.barcodeType) {
        const {scannedBarcode, barcodeType, panelIndex} = route.params;

        if (allScannedBarcodes.includes(scannedBarcode)) {
          Alert.alert('Duplicate', 'This barcode has already been scanned');
          return;
        }

        switch (barcodeType) {
          case 'pump':
            setPumpNumber(scannedBarcode);
            break;
          case 'controller':
            setControllerNumber(scannedBarcode);
            break;
          case 'rmu':
            setRmuNumber(scannedBarcode);
            break;
          case 'motor':
            setMotorNumber(scannedBarcode);
            break;
          case 'panel':
            if (panelIndex !== undefined && panelIndex !== null) {
              handlePanelNumberChange(panelIndex, scannedBarcode);
            }
            break;
          case 'extraPanel':
            if (panelIndex !== undefined && panelIndex !== null) {
              handleExtraPanelNumberChange(panelIndex, scannedBarcode);
            }
            break;
        }

        setAllScannedBarcodes(prev => [...prev, scannedBarcode]);
        navigation.setParams({
          scannedBarcode: undefined,
          barcodeType: undefined,
          panelIndex: undefined,
        });
      }
    });

    return unsubscribe;
  }, [navigation, route.params, allScannedBarcodes]);

  useEffect(() => {
    const fetchServicePersons = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/service-survey-persons?state=${selectedState}`,
        );
        setServicePerson(response?.data?.data);
        setSelectedServicePerson('');
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
  }, [selectedState]);

  useEffect(() => {
    if (selectedSystem) {
      fetchAvailablePumps();
      initializePanelNumbers();
    }
  }, [selectedSystem]);

  useEffect(() => {
    if (selectedPump) {
      fetchItemsForSystem();
    }
  }, [selectedPump]);

  const fetchAvailablePumps = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/warehouse-admin/show-pump-data?systemId=${selectedSystem}`,
      );
      setAvailablePumps(response?.data?.data || []);
      setSelectedPump('');
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

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

  const validateSaralId = async saralId => {
    if (!saralId) {
      setIsSaralIdValid(false);
      setSaralIdValidationMessage('Please enter Farmer Saral ID');
      setFarmerDetails(null);
      return;
    }

    try {
      setValidatingSaralId(true);
      const response = await axios.get(
        `http://88.222.214.93:8001/farmer/showFarmerAccordingToSaralId?saralId=${saralId}`,
      );

      if (response.data && response.data.success) {
        setIsSaralIdValid(true);
        setSaralIdValidationMessage('Valid Farmer Saral ID');
        setFarmerDetails(response.data.data);
      } else {
        setIsSaralIdValid(false);
        setSaralIdValidationMessage('Invalid Farmer Saral ID');
        setFarmerDetails(null);
      }
    } catch (error) {
      setIsSaralIdValid(false);
      setSaralIdValidationMessage(
        error?.response?.data?.message || 'Error validating Saral ID',
      );
      setFarmerDetails(null);
    } finally {
      setValidatingSaralId(false);
    }
  };

  const handleSaralIdChange = text => {
    setFarmerSaralId(text);
    setIsSaralIdValid(false);
    setSaralIdValidationMessage('');
  };

  const handleValidateSaralId = async () => {
    await validateSaralId(farmerSaralId);
  };

  const toggleItemSelection = itemId => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        const newQuantities = {...quantities};
        delete newQuantities[itemId];
        setQuantities(newQuantities);

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
        return [...prev, itemId];
      }
    });
  };

  const toggleSubItemSelection = subItemId => {
    setSelectedSubItems(prev => ({
      ...prev,
      [subItemId]: !prev[subItemId],
    }));
  };

  const handleQuantityChange = (itemId, value) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleSubItemQuantityChange = (subItemId, value) => {
    setSubItemQuantities(prev => ({
      ...prev,
      [subItemId]: value,
    }));
  };

  const handlePanelNumberChange = (index, value) => {
    setPanelNumbers(prev => {
      const newPanelNumbers = [...prev];
      newPanelNumbers[index] = value;
      return newPanelNumbers;
    });
  };

  const handleExtraPanelNumberChange = (index, value) => {
    setExtraPanelNumbers(prev => {
      const newPanelNumbers = [...prev];
      newPanelNumbers[index] = value;
      return newPanelNumbers;
    });
  };

  const toggleExtraItemSelection = itemId => {
    setExtraSelectedItems(prev => {
      if (prev.includes(itemId)) {
        const newQuantities = {...extraQuantities};
        delete newQuantities[itemId];
        setExtraQuantities(newQuantities);

        const item = items.find(i => i.systemItemId._id === itemId);
        if (item?.subItems?.length > 0) {
          const newSelectedSubItems = {...extraSelectedSubItems};
          const newSubItemQuantities = {...extraSubItemQuantities};
          item.subItems.forEach(subItem => {
            delete newSelectedSubItems[subItem.subItemId._id];
            delete newSubItemQuantities[subItem.subItemId._id];
          });
          setExtraSelectedSubItems(newSelectedSubItems);
          setExtraSubItemQuantities(newSubItemQuantities);
        }

        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const toggleExtraSubItemSelection = subItemId => {
    setExtraSelectedSubItems(prev => ({
      ...prev,
      [subItemId]: !prev[subItemId],
    }));
  };

  const handleExtraQuantityChange = (itemId, value) => {
    setExtraQuantities(prev => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleExtraSubItemQuantityChange = (subItemId, value) => {
    setExtraSubItemQuantities(prev => ({
      ...prev,
      [subItemId]: value,
    }));
  };

  const handleScanBarcode = (type, index = null) => {
    navigation.navigate('BarcodeScanner', {
      barcodeType: type,
      existingBarcodes: allScannedBarcodes,
      returnScreen: 'OutgoingInstallation',
      panelIndex: index,
    });
  };

  const getItemName = itemId => {
    const item = items.find(i => i.systemItemId._id === itemId);
    return item?.systemItemId?.itemName || '';
  };

  const isSolarPanel = itemName =>
    itemName.toLowerCase().includes('solar panel');

  const initializePanelNumbers = () => {
    setPanelNumbers([]);
    setExtraPanelNumbers([]);
  };

  const validateInput = () => {
    if (!selectedServicePerson) {
      Alert.alert('Error', 'Please select a service person');
      return false;
    }
    if (!selectedSystem) {
      Alert.alert('Error', 'Please select a system');
      return false;
    }
    if (selectedItems.length === 0 && extraSelectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return false;
    }
    if (!farmerSaralId) {
      Alert.alert('Error', 'Please enter Farmer Saral ID');
      return false;
    }
    if (!isSaralIdValid) {
      Alert.alert('Error', 'Please validate Farmer Saral ID');
      return false;
    }

    for (const itemId of selectedItems) {
      if (!quantities[itemId]) {
        Alert.alert(
          'Error',
          `Please enter a valid quantity for ${getItemName(itemId)}`,
        );
        return false;
      }

      const item = items.find(i => i.systemItemId._id === itemId);
      if (item?.subItems) {
        for (const subItem of item.subItems) {
          if (selectedSubItems[subItem.subItemId._id]) {
            const subItemQty = subItemQuantities[subItem.subItemId._id];
            if (!subItemQty || isNaN(subItemQty)) {
              Alert.alert(
                'Error',
                `Please enter a valid quantity for sub-item ${subItem.subItemId.itemName}`,
              );
              return false;
            }
          }
        }
      }
    }

    for (const itemId of extraSelectedItems) {
      if (!extraQuantities[itemId]) {
        Alert.alert(
          'Error',
          `Please enter a valid quantity for extra item ${getItemName(itemId)}`,
        );
        return false;
      }

      const item = items.find(i => i.systemItemId._id === itemId);
      if (item?.subItems) {
        for (const subItem of item.subItems) {
          if (extraSelectedSubItems[subItem.subItemId._id]) {
            const subItemQty = extraSubItemQuantities[subItem.subItemId._id];
            if (!subItemQty || isNaN(subItemQty)) {
              Alert.alert(
                'Error',
                `Please enter a valid quantity for extra sub-item ${subItem.subItemId.itemName}`,
              );
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
      const itemsList = selectedItems.map(itemId => {
        const item = items.find(i => i.systemItemId._id === itemId);

        const itemData = {
          systemItemId: itemId,
          quantity: parseInt(quantities[itemId], 10),
        };

        if (item.subItems && item.subItems.length > 0) {
          const selectedSubs = item.subItems
            .filter(subItem => selectedSubItems[subItem.subItemId._id])
            .map(subItem => ({
              subItemId: subItem.subItemId._id,
              quantity: parseInt(subItemQuantities[subItem.subItemId._id], 10),
            }));

          if (selectedSubs.length > 0) {
            itemData.subItems = selectedSubs;
          }
        }

        return itemData;
      });

      const extraItemsList = extraSelectedItems.map(itemId => {
        const item = items.find(i => i.systemItemId._id === itemId);

        const itemData = {
          systemItemId: itemId,
          quantity: parseInt(extraQuantities[itemId], 10),
        };

        if (item.subItems && item.subItems.length > 0) {
          const selectedSubs = item.subItems
            .filter(subItem => extraSelectedSubItems[subItem.subItemId._id])
            .map(subItem => ({
              subItemId: subItem.subItemId._id,
              quantity: parseInt(
                extraSubItemQuantities[subItem.subItemId._id],
                10,
              ),
            }));

          if (selectedSubs.length > 0) {
            itemData.subItems = selectedSubs;
          }
        }

        return itemData;
      });

      const filteredPanelNumbers = panelNumbers.filter(
        num => num && num.trim() !== '',
      );
      const filteredExtraPanelNumbers = extraPanelNumbers.filter(
        num => num && num.trim() !== '',
      );

      const formattedItemsList = itemsList.flatMap(item => {
        const base = [
          {systemItemId: item.systemItemId, quantity: item.quantity},
        ];
        const subs =
          item.subItems?.map(sub => ({
            systemItemId: sub.subItemId,
            quantity: sub.quantity,
          })) || [];
        return base.concat(subs);
      });

      const formattedExtraItemsList = extraItemsList.flatMap(item => {
        const base = [
          {systemItemId: item.systemItemId, quantity: item.quantity},
        ];
        const subs =
          item.subItems?.map(sub => ({
            systemItemId: sub.subItemId,
            quantity: sub.quantity,
          })) || [];
        return base.concat(subs);
      });

      const payload = {
        farmerSaralId: farmerSaralId,
        empId: selectedServicePerson,
        systemId: selectedSystem,
        itemsList: formattedItemsList,
        ...(filteredPanelNumbers.length > 0 && {
          panelNumbers: filteredPanelNumbers,
        }),
        ...(pumpNumber && {pumpNumber}),
        ...(motorNumber && {motorNumber}),
        ...(controllerNumber && {controllerNumber}),
        ...(rmuNumber && {rmuNumber}),
        ...(formattedExtraItemsList.length > 0 && {
          extraItemsList: formattedExtraItemsList,
        }),
        ...(filteredExtraPanelNumbers.length > 0 && {
          extraPanelNumbers: filteredExtraPanelNumbers,
        }),
      };

      setLoading(true);
      const response = await axios.post(
        `${API_URL}/warehouse-admin/add-new-installation`,
        payload,
        {headers: {'Content-Type': 'application/json'}},
      );

      Alert.alert('Success', 'Transaction saved successfully');
      resetForm();
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to submit data',
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedServicePerson('');
    setSelectedSystem('');
    setSelectedSystemName('');
    setSelectedItems([]);
    setQuantities({});
    setPanelNumbers([]);
    setPumpNumber('');
    setControllerNumber('');
    setRmuNumber('');
    setFarmerSaralId('');
    setMotorNumber('');
    setIsSaralIdValid(false);
    setSaralIdValidationMessage('');
    setItems([]);
    setSelectedSubItems({});
    setSubItemQuantities({});
    setFarmerDetails(null);
    setSelectedPump('');
    setAllScannedBarcodes([]);
    setShowExtraItems(false);
    setExtraSelectedItems([]);
    setExtraQuantities({});
    setExtraPanelNumbers([]);
    setExtraSelectedSubItems({});
    setExtraSubItemQuantities({});
  };

  const renderPumpSelection = () => {
    if (availablePumps.length === 0 || !selectedSystem) return null;

    return (
      <>
        <Text style={styles.label}>Select Pump:</Text>
        <Picker
          selectedValue={selectedPump}
          onValueChange={itemValue => {
            setSelectedPump(itemValue);
          }}
          style={styles.picker}>
          <Picker.Item label="Select Pump" value="" />
          {availablePumps.map((pump, index) => (
            <Picker.Item key={index} label={pump.itemName} value={pump._id} />
          ))}
        </Picker>

        <Text style={styles.label}>Enter Pump Number:</Text>
        <View style={styles.barcodeInputContainer}>
          <TextInput
            style={[styles.input, styles.barcodeInput]}
            value={pumpNumber}
            onChangeText={setPumpNumber}
            placeholder="Enter Pump Number"
            placeholderTextColor={placeholderTextColor}
          />
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => handleScanBarcode('pump')}>
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>
      </>
    );
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
            tintColors={{true: '#000000', false: '#000000'}}
            onCheckColor="#000000"
            onTintColor="#000000"
            tintColor="#000000"
          />
          <Text style={styles.itemText}>{itemName}</Text>
        </View>

        {isSelected && (
          <View style={styles.itemDetails}>
            <Text style={styles.label}>Quantity:</Text>
            <TextInput
              style={styles.input}
              value={quantities[itemId]?.toString() || ''}
              onChangeText={text => handleQuantityChange(itemId, text)}
              keyboardType="numeric"
              placeholder="Enter quantity"
              placeholderTextColor={placeholderTextColor}
            />

            {isPanel && (
              <>
                <Text style={styles.label}>Enter Panel Numbers:</Text>
                {Array.from({length: parseInt(quantities[itemId] || 0)}).map(
                  (_, index) => (
                    <View key={index} style={styles.barcodeInputContainer}>
                      <TextInput
                        style={[styles.input, styles.barcodeInput]}
                        value={panelNumbers[index] || ''}
                        onChangeText={text =>
                          handlePanelNumberChange(index, text)
                        }
                        placeholder={`Panel ${index + 1} Serial Number`}
                        placeholderTextColor={placeholderTextColor}
                      />
                      <TouchableOpacity
                        style={styles.scanButton}
                        onPress={() => handleScanBarcode('panel', index)}>
                        <Text style={styles.scanButtonText}>Scan</Text>
                      </TouchableOpacity>
                    </View>
                  ),
                )}
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
                        onValueChange={() =>
                          toggleSubItemSelection(subItem.subItemId._id)
                        }
                        tintColors={{true: '#000000', false: '#000000'}}
                        onCheckColor="#000000"
                        onTintColor="#000000"
                        tintColor="#000000"
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
                          value={
                            subItemQuantities[
                              subItem.subItemId._id
                            ]?.toString() || ''
                          }
                          onChangeText={text =>
                            handleSubItemQuantityChange(
                              subItem.subItemId._id,
                              text,
                            )
                          }
                          keyboardType="numeric"
                          placeholder="Enter quantity"
                          placeholderTextColor={placeholderTextColor}
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

  const renderExtraItem = ({item}) => {
    const itemId = item.systemItemId._id;
    const isSelected = extraSelectedItems.includes(itemId);
    const itemName = item.systemItemId.itemName;
    const isPanel = isSolarPanel(itemName);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemRow}>
          <CheckBox
            value={isSelected}
            onValueChange={() => toggleExtraItemSelection(itemId)}
            tintColors={{true: '#000000', false: '#000000'}}
            onCheckColor="#000000"
            onTintColor="#000000"
            tintColor="#000000"
          />
          <Text style={styles.itemText}>{itemName}</Text>
        </View>

        {isSelected && (
          <View style={styles.itemDetails}>
            <Text style={styles.label}>Quantity:</Text>
            <TextInput
              style={styles.input}
              value={extraQuantities[itemId]?.toString() || ''}
              onChangeText={text => handleExtraQuantityChange(itemId, text)}
              keyboardType="numeric"
              placeholder="Enter quantity"
              placeholderTextColor={placeholderTextColor}
            />

            {isPanel && (
              <>
                <Text style={styles.label}>Enter Panel Numbers:</Text>
                {Array.from({
                  length: parseInt(extraQuantities[itemId] || 0),
                }).map((_, index) => (
                  <View key={index} style={styles.barcodeInputContainer}>
                    <TextInput
                      style={[styles.input, styles.barcodeInput]}
                      value={extraPanelNumbers[index] || ''}
                      onChangeText={text =>
                        handleExtraPanelNumberChange(index, text)
                      }
                      placeholder={`Panel ${index + 1} Serial Number`}
                      placeholderTextColor={placeholderTextColor}
                    />
                    <TouchableOpacity
                      style={styles.scanButton}
                      onPress={() => handleScanBarcode('extraPanel', index)}>
                      <Text style={styles.scanButtonText}>Scan</Text>
                    </TouchableOpacity>
                  </View>
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
                        value={!!extraSelectedSubItems[subItem.subItemId._id]}
                        onValueChange={() =>
                          toggleExtraSubItemSelection(subItem.subItemId._id)
                        }
                        tintColors={{true: '#000000', false: '#000000'}}
                        onCheckColor="#000000"
                        onTintColor="#000000"
                        tintColor="#000000"
                      />
                      <Text style={styles.subItemText}>
                        {subItem.subItemId.itemName}
                      </Text>
                    </View>

                    {extraSelectedSubItems[subItem.subItemId._id] && (
                      <View style={styles.subItemQuantityContainer}>
                        <Text style={styles.subItemLabel}>Quantity:</Text>
                        <TextInput
                          style={[styles.input, styles.subItemInput]}
                          value={
                            extraSubItemQuantities[
                              subItem.subItemId._id
                            ]?.toString() || ''
                          }
                          onChangeText={text =>
                            handleExtraSubItemQuantityChange(
                              subItem.subItemId._id,
                              text,
                            )
                          }
                          keyboardType="numeric"
                          placeholder="Enter quantity"
                          placeholderTextColor={placeholderTextColor}
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
        <Text style={styles.header}>
          Outgoing Installation Data
        </Text>
        <View style={styles.form}>
          <Text style={styles.label}>Select State:</Text>
          <Picker
            selectedValue={selectedState}
            onValueChange={itemValue => {
              setSelectedState(itemValue);
            }}
            style={styles.picker}>
            {states.map((state, index) => (
              <Picker.Item key={index} label={state} value={state} />
            ))}
          </Picker>

          <Text style={styles.label}>Farmer Saral ID:</Text>
          <View style={styles.saralIdContainer}>
            <TextInput
              style={[
                styles.input,
                styles.saralIdInput,
                farmerSaralId
                  ? isSaralIdValid
                    ? styles.validInput
                    : saralIdValidationMessage
                    ? styles.invalidInput
                    : null
                  : null,
              ]}
              value={farmerSaralId}
              onChangeText={handleSaralIdChange}
              placeholder="Enter Farmer Saral ID"
              placeholderTextColor={placeholderTextColor}
            />
            <TouchableOpacity
              style={styles.validateButton}
              onPress={handleValidateSaralId}
              disabled={validatingSaralId}>
              <Text style={styles.validateButtonText}>
                {validatingSaralId ? 'Validating...' : 'Validate'}
              </Text>
            </TouchableOpacity>
          </View>

          {validatingSaralId ? (
            <View style={styles.validationContainer}>
              <ActivityIndicator size="small" color="#0000ff" />
              <Text style={styles.validatingText}>Validating...</Text>
            </View>
          ) : (
            saralIdValidationMessage && (
              <Text
                style={
                  isSaralIdValid ? styles.validMessage : styles.invalidMessage
                }>
                {saralIdValidationMessage}
              </Text>
            )
          )}

          {farmerDetails && (
            <View style={styles.farmerDetailsContainer}>
              <Text style={styles.farmerDetailText}>
                <Text style={styles.farmerDetailLabel}>Name:</Text>{' '}
                {farmerDetails.farmerName}
              </Text>
              <Text style={styles.farmerDetailText}>
                <Text style={styles.farmerDetailLabel}>Contact:</Text>{' '}
                {farmerDetails.contact}
              </Text>
            </View>
          )}

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
            onValueChange={value => {
              setSelectedSystem(value);
              const system = systems.find(sys => sys._id === value);
              if (system) {
                setSelectedSystemName(system.systemName);
              }
            }}
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

          {renderPumpSelection()}

          {items.length > 0 && (
            <>
              <View style={styles.itemsHeader}>
                <Text style={styles.label}>Items List:</Text>
                {!showExtraItems && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowExtraItems(true)}>
                    <Icon name="add" size={24} color="#4CAF50" />
                  </TouchableOpacity>
                )}
              </View>
              <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.systemItemId._id}
                scrollEnabled={false}
              />
            </>
          )}

          {showExtraItems && (
            <>
              <View style={styles.itemsHeader}>
                <Text style={styles.label}>Extra Items List:</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowExtraItems(false)}>
                  <Icon name="close" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={items}
                renderItem={renderExtraItem}
                keyExtractor={item => item.systemItemId._id}
                scrollEnabled={false}
              />
            </>
          )}

          <Text style={styles.label}>Controller Number:</Text>
          <View style={styles.barcodeInputContainer}>
            <TextInput
              style={[styles.input, styles.barcodeInput]}
              value={controllerNumber}
              onChangeText={setControllerNumber}
              placeholder="Enter Controller Number"
              placeholderTextColor={placeholderTextColor}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => handleScanBarcode('controller')}>
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>RMU Number:</Text>
          <View style={styles.barcodeInputContainer}>
            <TextInput
              style={[styles.input, styles.barcodeInput]}
              value={rmuNumber}
              onChangeText={setRmuNumber}
              placeholder="Enter RMU Number"
              placeholderTextColor={placeholderTextColor}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => handleScanBarcode('rmu')}>
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>MOTOR Number:</Text>
          <View style={styles.barcodeInputContainer}>
            <TextInput
              style={[styles.input, styles.barcodeInput]}
              value={motorNumber}
              onChangeText={setMotorNumber}
              placeholder="Enter Motor Number"
              placeholderTextColor={placeholderTextColor}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => handleScanBarcode('motor')}>
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, !isSaralIdValid && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading || validatingSaralId || !isSaralIdValid}>
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
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
    color: '#000',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    color: '#000',
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
  disabledButton: {
    backgroundColor: '#cccccc',
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
  barcodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  barcodeInput: {
    flex: 1,
    marginRight: 10,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  saralIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  saralIdInput: {
    flex: 1,
    marginRight: 10,
  },
  validateButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
  },
  validateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  validatingText: {
    marginLeft: 10,
    color: '#555',
  },
  validMessage: {
    color: '#4CAF50',
    marginBottom: 15,
  },
  invalidMessage: {
    color: '#F44336',
    marginBottom: 15,
  },
  validInput: {
    borderColor: '#4CAF50',
  },
  invalidInput: {
    borderColor: '#F44336',
  },
  farmerDetailsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  farmerDetailText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  farmerDetailLabel: {
    fontWeight: '600',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    padding: 8,
  },
});

export default OutgoingInstallation;