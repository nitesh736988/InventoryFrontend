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
//   const [selectedState, setSelectedState] = useState('Maharashtra');
//   const [states] = useState([
//     {id: '1', name: 'Maharashtra'},
//     {id: '2', name: 'Haryana'},
//     {id: '3', name: 'Punjab'},
//     {id: '4', name: 'Chattisgarh'},
//     {id: '5', name: 'Rajasthan'},
//   ]);

//   const [verificationStatus, setVerificationStatus] = useState({
//     pump: {status: null, message: ''},
//     controller: {status: null, message: ''},
//     rmu: {status: null, message: ''},
//     motor: {status: null, message: ''},
//     panel: {},
//     extraPanel: {}
//   });

//   // Extra items state
//   const [showExtraItems, setShowExtraItems] = useState(false);
//   const [extraSelectedItems, setExtraSelectedItems] = useState([]);
//   const [extraQuantities, setExtraQuantities] = useState({});
//   const [extraPanelNumbers, setExtraPanelNumbers] = useState([]);
//   const [extraSelectedSubItems, setExtraSelectedSubItems] = useState({});
//   const [extraSubItemQuantities, setExtraSubItemQuantities] = useState({});

//   // Verification state
//   const [verifying, setVerifying] = useState({
//     pump: false,
//     controller: false,
//     rmu: false,
//     motor: false,
//     panel: false,
//     extraPanel: false
//   });

//   const [fetchingItems, setFetchingItems] = useState(false);

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
//           `${API_URL}/warehouse-admin/service-survey-persons?state=${selectedState}`,
//         );
//         setServicePerson(response?.data?.data || []);
//         setSelectedServicePerson('');
//       } catch (error) {
//         Alert.alert('Error', JSON.stringify(error.response?.data?.message));
//       }
//     };

//     const fetchSystems = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/show-systems`,
//         );
//         setSystems(response?.data?.data || []);
//       } catch (error) {
//         Alert.alert('Error', 'Failed to fetch systems');
//       }
//     };

//     fetchServicePersons();
//     fetchSystems();
//   }, [selectedState]);

//   const fetchAvailablePumps = async () => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/warehouse-admin/show-pump-data?systemId=${selectedSystem}`,
//       );
//       setAvailablePumps(response?.data?.data || []);
//       setSelectedPump('');
//     } catch (error) {
//       Alert.alert('Error', JSON.stringify(error.response?.data?.message));
//     }
//   };

//   const fetchItemsForSystem = async () => {
//     if (!selectedSystem) return;

//     try {
//       setFetchingItems(true);
//       const response = await axios.get(
//         `${API_URL}/warehouse-admin/show-items-subItems?systemId=${selectedSystem}`,
//       );

//       if (response.data && response.data.data) {
//         setItems(response.data.data);
//       } else {
//         setItems([]);
//         Alert.alert('Info', 'No items found for this system');
//       }

//       setSelectedItems([]);
//       setQuantities({});
//       setPanelNumbers([]);
//       setSelectedSubItems({});
//       setSubItemQuantities({});

//       // Also fetch available pumps for this system
//       await fetchAvailablePumps();

//       // Initialize panel numbers
//       initializePanelNumbers();
//     } catch (error) {
//       console.error('Error fetching items:', error);
//       Alert.alert('Error', 'Failed to fetch items for system');
//       setItems([]);
//     } finally {
//       setFetchingItems(false);
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
//         `http://88.222.214.93:8001/farmer/showFarmerAccordingToSaralIdFrontEnd?saralId=${saralId}&state=${selectedState}`,
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
//         const newQuantities = {...quantities};
//         delete newQuantities[itemId];
//         setQuantities(newQuantities);

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
//         const newQuantities = {...extraQuantities};
//         delete newQuantities[itemId];
//         setExtraQuantities(newQuantities);

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

//   const verifySerialNumber = async (productType, serialNumber, index = null) => {
//     if (productType !== 'panel' && productType !== 'extraPanel' && !serialNumber) {
//       Alert.alert('Error', 'Please enter a serial number first');
//       return;
//     }

//     try {
//       if (productType === 'panel') {
//         setVerifying(prev => ({...prev, panel: true}));
//       } else if (productType === 'extraPanel') {
//         setVerifying(prev => ({...prev, extraPanel: true}));
//       } else {
//         setVerifying(prev => ({...prev, [productType]: true}));
//       }

//       let payload = {};
//       const url = `${API_URL}/warehouse-admin/check-serial-number`;

//       if (productType === 'panel' || productType === 'extraPanel') {
//         const panelNumbersToVerify = productType === 'panel'
//           ? panelNumbers.filter(num => num && num.trim() !== '')
//           : extraPanelNumbers.filter(num => num && num.trim() !== '');

//         if (panelNumbersToVerify.length === 0) {
//           Alert.alert('Error', 'Please enter at least one panel number');
//           return;
//         }

//         payload = {
//           productType: 'panel',
//           panelNumberList: panelNumbersToVerify
//         };
//       } else {
//         payload = {
//           productType,
//           serialNumber
//         };
//       }

//       const response = await axios.post(
//         url,
//         payload,
//         {headers: {'Content-Type': 'application/json'}}
//       );

//       if (productType === 'panel' || productType === 'extraPanel') {
//         const { unusedSerials, usedSerials } = response.data.data;

//         const newStatus = {};
//         const panelNumbersToCheck = productType === 'panel' ? panelNumbers : extraPanelNumbers;

//         panelNumbersToCheck.forEach((num, idx) => {
//           if (num && num.trim() !== '') {
//             if (usedSerials && usedSerials.includes(num)) {
//               newStatus[idx] = {status: 'used', message: 'Used in previous installation'};
//             } else if (unusedSerials && unusedSerials.includes(num)) {
//               newStatus[idx] = {status: 'unused', message: 'Available for use'};
//             } else {
//               newStatus[idx] = {status: 'unknown', message: 'Status unknown'};
//             }
//           }
//         });

//         setVerificationStatus(prev => ({
//           ...prev,
//           [productType]: newStatus
//         }));
//       } else {
//         const responseMessage = response.data.message || '';
//         const isAlreadyAssigned = responseMessage.includes('Farmer Already Assigned');
//         const isAvailable = responseMessage.includes('Available for use') ||
//                            responseMessage.includes('unused');
//         const isInvalid = responseMessage.includes('Invalid') ||
//                          responseMessage.includes('not found');

//         setVerificationStatus(prev => ({
//           ...prev,
//           [productType]: {
//             status: isAlreadyAssigned ? 'used' :
//                    (isAvailable ? 'unused' :
//                    (isInvalid ? 'invalid' : 'unknown')),
//             message: responseMessage
//           }
//         }));
//       }
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 'Verification failed';
//       Alert.alert('Error', errorMessage);

//       if (productType === 'panel' || productType === 'extraPanel') {
//         const newStatus = {};
//         const panelNumbersToCheck = productType === 'panel' ? panelNumbers : extraPanelNumbers;

//         panelNumbersToCheck.forEach((num, idx) => {
//           if (num && num.trim() !== '') {
//             newStatus[idx] = {status: 'error', message: errorMessage};
//           }
//         });

//         setVerificationStatus(prev => ({
//           ...prev,
//           [productType]: newStatus
//         }));
//       } else {
//         setVerificationStatus(prev => ({
//           ...prev,
//           [productType]: {status: 'error', message: errorMessage}
//         }));
//       }
//     } finally {
//       if (productType === 'panel') {
//         setVerifying(prev => ({...prev, panel: false}));
//       } else if (productType === 'extraPanel') {
//         setVerifying(prev => ({...prev, extraPanel: false}));
//       } else {
//         setVerifying(prev => ({...prev, [productType]: false}));
//       }
//     }
//   };

//   const getInputStyle = (productType, index = null) => {
//     let status;

//     if (productType === 'panel' || productType === 'extraPanel') {
//       status = verificationStatus[productType][index]?.status;
//     } else {
//       status = verificationStatus[productType]?.status;
//     }

//     switch (status) {
//       case 'used':
//         return styles.usedInput;
//       case 'unused':
//         return styles.unusedInput;
//       case 'invalid':
//         return styles.invalidInput;
//       case 'error':
//         return styles.errorInput;
//       default:
//         return null;
//     }
//   };

//    const getStatusText = (productType, index = null) => {
//     let status, message;

//     if (productType === 'panel' || productType === 'extraPanel') {
//       status = verificationStatus[productType][index];
//       message = status?.message;
//     } else {
//       status = verificationStatus[productType];
//       message = status?.message;
//     }

//     if (!message) return null;

//     let textColor;
//     switch (status?.status) {
//       case 'used':
//         textColor = styles.usedText;
//         break;
//       case 'unused':
//         textColor = styles.unusedText;
//         break;
//       case 'invalid':
//         textColor = styles.invalidText;
//         break;
//       case 'error':
//         textColor = styles.errorText;
//         break;
//       default:
//         textColor = styles.defaultText;
//     }

//     return <Text style={[styles.statusText, textColor]}>{message}</Text>;
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
//       const itemsList = selectedItems.map(itemId => {
//         const item = items.find(i => i.systemItemId._id === itemId);

//         const itemData = {
//           systemItemId: itemId,
//           quantity: parseInt(quantities[itemId], 10),
//         };

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

//       const extraItemsList = extraSelectedItems.map(itemId => {
//         const item = items.find(i => i.systemItemId._id === itemId);

//         const itemData = {
//           systemItemId: itemId,
//           quantity: parseInt(extraQuantities[itemId], 10),
//         };

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

//       const filteredPanelNumbers = panelNumbers.filter(
//         num => num && num.trim() !== '',
//       );
//       const filteredExtraPanelNumbers = extraPanelNumbers.filter(
//         num => num && num.trim() !== '',
//       );

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

//       console.log('Payload to submit:', payload);

//       setLoading(true);
//       const response = await axios.post(
//         `${API_URL}/warehouse-admin/add-new-installation`,
//         payload,
//         {headers: {'Content-Type': 'application/json'}},
//       );

//       Alert.alert('Success', 'Transaction saved successfully');
//       resetForm();
//     } catch (error) {
//       console.log("Submission error: ", error?.response?.data?.message || error?.message || error);
//       Alert.alert(' Error', error?.response?.data?.message);
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
//     setVerifying({
//       pump: false,
//       controller: false,
//       rmu: false,
//       motor: false,
//       panel: false,
//       extraPanel: false
//     });
//   };

//   const renderBarcodeInputWithVerify = (type, value, setValue, index = null) => {
//     const isPanel = type === 'panel' || type === 'extraPanel';
//     const placeholder = isPanel
//       ? `Panel ${index + 1} Serial Number`
//       : `Enter ${type.charAt(0).toUpperCase() + type.slice(1)} Number`;

//     const isVerifying = verifying[type];

//    return (
//       <View style={styles.barcodeInputContainer}>
//         <View style={styles.inputWithStatus}>
//           <TextInput
//             style={[styles.input, styles.barcodeInput, getInputStyle(type, index)]}
//             value={value}
//             onChangeText={setValue}
//             placeholder={placeholder}
//             placeholderTextColor={placeholderTextColor}
//           />
//           {getStatusText(type, index)}
//         </View>
//         <TouchableOpacity
//           style={[styles.scanButton, {marginRight: 5}]}
//           onPress={() => handleScanBarcode(type, index)}>
//           <Text style={styles.scanButtonText}>Scan</Text>
//         </TouchableOpacity>
//         {!isPanel && (
//           <TouchableOpacity
//             style={[styles.verifyButton, isVerifying && styles.verifyingButton]}
//             onPress={() => verifySerialNumber(type, value)}
//             disabled={isVerifying}>
//             {isVerifying ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Text style={styles.verifyButtonText}>Verify</Text>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   const renderPanelVerificationButton = (isExtra = false) => {
//     const panelNumbersToVerify = isExtra
//       ? extraPanelNumbers.filter(num => num && num.trim() !== '')
//       : panelNumbers.filter(num => num && num.trim() !== '');

//     const isVerifying = isExtra ? verifying.extraPanel : verifying.panel;

//     return (
//       <TouchableOpacity
//         style={[styles.panelVerifyButton, isVerifying && styles.verifyingButton]}
//         onPress={() => verifySerialNumber(isExtra ? 'extraPanel' : 'panel')}
//         disabled={isVerifying || panelNumbersToVerify.length === 0}>
//         {isVerifying ? (
//           <ActivityIndicator size="small" color="#fff" />
//         ) : (
//           <Text style={styles.verifyButtonText}>
//             Verify All {isExtra ? 'Extra ' : ''}Panel Numbers
//           </Text>
//         )}
//       </TouchableOpacity>
//     );
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
//         {renderBarcodeInputWithVerify(
//           'pump',
//           pumpNumber,
//           setPumpNumber
//         )}
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
//                     <View key={index}>
//                       {renderBarcodeInputWithVerify(
//                         'panel',
//                         panelNumbers[index] || '',
//                         text => handlePanelNumberChange(index, text),
//                         index
//                       )}
//                     </View>
//                   ),
//                 )}
//                 {renderPanelVerificationButton(false)}
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
//                   <View key={index}>
//                     {renderBarcodeInputWithVerify(
//                       'extraPanel',
//                       extraPanelNumbers[index] || '',
//                       text => handleExtraPanelNumberChange(index, text),
//                       index
//                     )}
//                   </View>
//                 ))}
//                 {renderPanelVerificationButton(true)}
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
//           Outgoing Installation Data
//         </Text>
//         <View style={styles.form}>
//           <Text style={styles.label}>Select State:</Text>
//           <Picker
//             selectedValue={selectedState}
//             onValueChange={itemValue => {
//               setSelectedState(itemValue);
//             }}
//             style={styles.picker}>
//             {states.map((state, index) => (
//               <Picker.Item key={index} label={state.name} value={state.name} />
//             ))}
//           </Picker>

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
//                 // Automatically fetch items for the selected system
//                 fetchItemsForSystem();
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

//           {fetchingItems && (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="small" color="#0000ff" />
//               <Text style={styles.loadingText}>Loading items...</Text>
//             </View>
//           )}

//           {renderPumpSelection()}

//           {items && items.length > 0 ? (
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
//                 keyExtractor={(item, index) => `main-${item.systemItemId._id}-${index}`}
//                 scrollEnabled={false}
//                 ListEmptyComponent={
//                   <Text style={styles.emptyText}>No items available</Text>
//                 }
//               />
//             </>
//           ) : selectedSystem && !fetchingItems ? (
//             <Text style={styles.emptyText}>No items available for this system</Text>
//           ) : null}

//           {showExtraItems && items && items.length > 0 && (
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
//                 keyExtractor={(item, index) => `extra-${item.systemItemId._id}-${index}`}
//                 scrollEnabled={false}
//                 ListEmptyComponent={
//                   <Text style={styles.emptyText}>No items available</Text>
//                 }
//               />
//             </>
//           )}

//           <Text style={styles.label}>Controller Number:</Text>
//           {renderBarcodeInputWithVerify(
//             'controller',
//             controllerNumber,
//             setControllerNumber
//           )}

//           <Text style={styles.label}>RMU Number:</Text>
//           {renderBarcodeInputWithVerify(
//             'rmu',
//             rmuNumber,
//             setRmuNumber
//           )}

//           <Text style={styles.label}>MOTOR Number:</Text>
//           {renderBarcodeInputWithVerify(
//             'motor',
//             motorNumber,
//             setMotorNumber
//           )}

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
//     marginRight: 5,
//   },
//   scanButton: {
//     backgroundColor: '#2196F3',
//     padding: 12,
//     borderRadius: 8,
//     marginRight: 5,
//   },
//   verifyButton: {
//     backgroundColor: '#FF9800',
//     padding: 12,
//     borderRadius: 8,
//   },
//   panelVerifyButton: {
//     backgroundColor: '#FF9800',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//     alignItems: 'center',
//   },
//   verifyingButton: {
//     backgroundColor: '#CCCCCC',
//   },
//   scanButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   verifyButtonText: {
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
//   usedInput: {
//     borderColor: '#F44336',
//     backgroundColor: '#FFEBEE',
//   },
//   unusedInput: {
//     borderColor: '#4CAF50',
//     backgroundColor: '#E8F5E9',
//   },
//   invalidInput: {
//     borderColor: '#FFC107',
//     backgroundColor: '#FFF9C4',
//   },
//   errorInput: {
//     borderColor: '#FF9800',
//     backgroundColor: '#FFF3E0',
//   },
//   statusText: {
//     fontSize: 12,
//     marginTop: 4,
//   },
//   usedText: {
//     color: '#F44336',
//   },
//   unusedText: {
//     color: '#4CAF50',
//   },
//   invalidText: {
//     color: '#FFC107',
//   },
//   errorText: {
//     color: '#FF9800',
//   },
//   defaultText: {
//     color: '#757575',
//   },
//   inputWithStatus: {
//     flex: 1,
//     marginRight: 5,
//   },
//   emptyText: {
//     textAlign: 'center',
//     color: '#757575',
//     marginVertical: 10,
//     fontStyle: 'italic',
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 15,
//   },
//   loadingText: {
//     marginLeft: 10,
//     color: '#555',
//   },
// });

// export default OutgoingInstallation;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {API_URL} from '@env';

const {width} = Dimensions.get('window');

const OutgoingInstallation = () => {
  const [systems, setSystems] = useState([]);
  const [servicePersons, setServicePersons] = useState([]);
  const [forms, setForms] = useState([
    {
      selectedSystem: '',
      pumps: [],
      selectedPump: '',
      selectedServicePerson: '',
      saralId: '',
      validating: false,
      isValid: false,
      farmerDetails: null,
      message: '',
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSystems();
    fetchServicePersons();
  }, []);

  const fetchSystems = async () => {
    try {
      const res = await axios.get(`${API_URL}/warehouse-admin/show-systems`);
      setSystems(res?.data?.data || []);
    } catch (err) {
      console.log('Error fetching systems:', err?.response?.data?.message || err?.message || err);
      setSystems([]);
    }
  };

  const fetchServicePersons = async () => {
    try {
      const res = await axios.get(`${API_URL}/warehouse-admin/get-installer-data`);
      setServicePersons(res?.data?.data || []);
    } catch (err) {
      console.log('Error fetching service persons:', err?.response?.data?.message || err?.message || err);
      setServicePersons([]);
    }
  };

  const fetchPumpData = async (systemId, index) => {
    try {
      const res = await axios.get(
        `${API_URL}/warehouse-admin/show-pump-data?systemId=${systemId}`,
      );
      const newForms = [...forms];
      newForms[index].pumps = res?.data?.data || [];
      setForms(newForms);
    } catch (err) {
      console.log('Error fetching pump data:', err?.response?.data?.message || err?.message || err);
    }
  };

  const handleSystemChange = (index, value) => {
    const updated = [...forms];
    updated[index].selectedSystem = value;
    updated[index].selectedPump = '';
    updated[index].pumps = [];
    setForms(updated);
    if (value) fetchPumpData(value, index);
  };

  const handleServicePersonChange = (index, value) => {
    const updated = [...forms];
    updated[index].selectedServicePerson = value;
    setForms(updated);
  };

  const handleSaralIdChange = (index, text) => {
    const updated = [...forms];
    updated[index].saralId = text;
    updated[index].isValid = false;
    updated[index].message = '';
    updated[index].farmerDetails = null;
    setForms(updated);
  };

  const validateSaralId = async index => {
    const updated = [...forms];
    const form = updated[index];

    if (!form.saralId) {
      Alert.alert('Validation', 'Please enter Saral ID first');
      return;
    }

    form.validating = true;
    setForms([...updated]);

    try {
      const res = await axios.get(
        `http://88.222.214.93:8001/farmer/showFarmerAccordingToSaralIdFrontEnd?saralId=${form.saralId}`,
      );

      if (res.data && res.data.success) {
        form.isValid = true;
        form.farmerDetails = res.data.data;
        form.message = 'Saral ID is valid!';
      } else {
        form.isValid = false;
        form.farmerDetails = null;
        form.message = 'Invalid Saral ID';
      }
    } catch (error) {
      form.isValid = false;
      form.farmerDetails = null;
      form.message = 'Error validating Saral ID';
    } finally {
      form.validating = false;
      setForms([...updated]);
    }
  };

  const addForm = () => {
    setForms(prev => [
      ...prev,
      {
        selectedSystem: '',
        pumps: [],
        selectedPump: '',
        selectedServicePerson: '',
        saralId: '',
        validating: false,
        isValid: false,
        farmerDetails: null,
        message: '',
      },
    ]);
  };

  const removeForm = index => {
    setForms(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const dispatchedSystem = forms
      .filter(
        f =>
          f.isValid &&
          f.saralId &&
          f.selectedSystem &&
          f.selectedPump &&
          f.selectedServicePerson,
      )
      .map(f => ({
        farmerSaralId: f.saralId,
        installerId: f.selectedServicePerson,
        systemId: f.selectedSystem,
        pumpId: f.selectedPump,
      }));

    if (dispatchedSystem.length === 0) {
      Alert.alert(
        'Validation',
        'Please complete and validate at least one full form before submitting.',
      );
      return;
    }

    const payload = { dispatchedSystem };
    console.log('Submitting payload:', payload);

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/warehouse-admin/add-new-installation`,
        payload,
      );

        Alert.alert(res?.data?.message);
        setForms([
          {
            selectedSystem: '',
            pumps: [],
            selectedPump: '',
            selectedServicePerson: '',
            saralId: '',
            validating: false,
            isValid: false,
            farmerDetails: null,
            message: '',
          },
        ]);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || err?.message);
      console.log('Error:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Outgoing Installation</Text>

      {forms.map((form, index) => (
        <View key={index} style={styles.formBlock}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Form {index + 1}</Text>
            {forms.length > 1 && (
              <TouchableOpacity onPress={() => removeForm(index)}>
                <Text style={styles.removeFormText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* System Picker */}
          <Text style={styles.label}>Select System</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.selectedSystem}
              onValueChange={val => handleSystemChange(index, val)}>
              <Picker.Item label="Select System" value="" />
              {systems.map(sys => (
                <Picker.Item key={sys._id} label={sys.systemName} value={sys._id} />
              ))}
            </Picker>
          </View>

          {/* Pump Picker */}
          {form.pumps.length > 0 && (
            <>
              <Text style={styles.label}>Select Pump</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.selectedPump}
                  onValueChange={val => {
                    const updated = [...forms];
                    updated[index].selectedPump = val;
                    setForms(updated);
                  }}>
                  <Picker.Item label="Select Pump" value="" />
                  {form.pumps.map(pump => (
                    <Picker.Item key={pump._id} label={pump.itemName} value={pump._id} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {/* Service Person Picker */}
          <Text style={styles.label}>Select Service Person</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.selectedServicePerson}
              onValueChange={val => handleServicePersonChange(index, val)}>
              <Picker.Item label="Select Service Person" value="" />
              {servicePersons.map(sp => (
                <Picker.Item key={sp._id} label={sp.name} value={sp._id} />
              ))}
            </Picker>
          </View>

          {/* Saral ID Input */}
          <Text style={styles.label}>Farmer Saral ID:</Text>
          <View style={styles.saralIdContainer}>
            <TextInput
              style={[
                styles.input,
                { flex: 1 },
                form.isValid ? styles.validInput :
                form.message ? styles.invalidInput : null,
              ]}
              placeholder="Enter Farmer Saral ID"
              value={form.saralId}
              onChangeText={text => handleSaralIdChange(index, text)}
            />
            <TouchableOpacity
              style={styles.validateButton}
              onPress={() => validateSaralId(index)}
              disabled={form.validating}>
              <Text style={styles.validateButtonText}>
                {form.validating ? 'Checking...' : 'Validate'}
              </Text>
            </TouchableOpacity>
          </View>

          {form.message ? (
            <Text style={form.isValid ? styles.validMessage : styles.invalidMessage}>
              {form.message}
            </Text>
          ) : null}

          {form.farmerDetails && (
            <View style={styles.farmerDetailsContainer}>
              <Text style={styles.farmerDetailText}>
                <Text style={styles.farmerDetailLabel}>Name:</Text> {form.farmerDetails.farmerName}
              </Text>
              <Text style={styles.farmerDetailText}>
                <Text style={styles.farmerDetailLabel}>Contact:</Text> {form.farmerDetails.contact}
              </Text>
            </View>
          )}
        </View>
      ))}

      {/* Add Another Form */}
      <TouchableOpacity style={styles.addButton} onPress={addForm}>
        <Text style={styles.addButtonText}>+ Add Another Form</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, loading && {backgroundColor: '#ccc'}]}
        onPress={handleSubmit}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Submitting...' : 'Submit All Installations'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OutgoingInstallation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formBlock: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    ...Platform.select({android: {elevation: 2}}),
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  formTitle: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  removeFormText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    fontSize: width * 0.04,
  },
  saralIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  validateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  validateButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  validInput: {
    borderColor: '#28a745',
  },
  invalidInput: {
    borderColor: '#dc3545',
  },
  validMessage: {
    color: '#28a745',
    fontSize: width * 0.04,
    marginBottom: 10,
  },
  invalidMessage: {
    color: '#dc3545',
    fontSize: width * 0.04,
    marginBottom: 10,
  },
  farmerDetailsContainer: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  farmerDetailLabel: {
    fontWeight: 'bold',
  },
  farmerDetailText: {
    fontSize: width * 0.04,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});
