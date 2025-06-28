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
// import {RadioButton} from 'react-native-paper';
// import {useNavigation} from '@react-navigation/native';

// const InOrder = ({route}) => {
//   const {id, name, farmerContact, saralId, farmerName, village} = route.params;
//   const [items, setItems] = useState([{}]);
//   const [warehouses, setWarehouses] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(false);
//   const [buttonVisible, setButtonVisible] = useState(true);

//   const [formData, setFormData] = useState({
//     remarks: '',
//     selectedItems: [],
//     quantities: {},
//     status: '',
//     serialNumber: '',
//     selectedWarehouse: 'Bhiwani',
//     controllerSelected: false,
//     withoutRMU: null,
//     rmuRemark: '',
//     farmerSaralId: '',
//   });

//   const {
//     remarks,
//     selectedItems,
//     quantities,
//     status,
//     serialNumber,
//     selectedWarehouse,
//     controllerSelected,
//     withoutRMU,
//     rmuRemark,
//   farmerSaralId,
//   } = formData;

//   useEffect(() => {
//     const fetchAllWarehouses = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/service-person/all-warehouses`,
//         );
//         setWarehouses(response.data.allWarehouses);
//       } catch (error) {
//         console.log('Failed to fetch warehouses:', error);
//       }
//     };

//     fetchAllWarehouses();
//   }, []);

//   useEffect(() => {
//     const selectedItemList = async () => {
//       const response = await axios.get(
//         `${API_URL}/service-person/warehouse-items?option=${selectedWarehouse}`,
//       );
//       const updateItemsData = [];
//       for (let index = 0; index < response.data.itemsData.length; index++) {
//         updateItemsData.push({
//           _id: index + 1,
//           itemName: response.data.itemsData[index],
//         });
//       }
//       setItems(updateItemsData);
//       setFilteredItems(updateItemsData);
//     };
//     selectedItemList();
//   }, [selectedWarehouse]);

//   const handleItemSelect = selected => {
//     const validItems = selected.filter(item =>
//       filteredItems.some(
//         filteredItem =>
//           filteredItem.itemName.toLowerCase() === item.toLowerCase(),
//       ),
//     );

//     const isControllerSelected = validItems.some(item =>
//       item.toLowerCase().includes('controller'),
//     );

//     setFormData(prevState => ({
//       ...prevState,
//       selectedItems: validItems,
//       quantities: validItems.reduce((acc, item) => ({...acc, [item]: ''}), {}),
//       controllerSelected: isControllerSelected,
//       withoutRMU: isControllerSelected ? null : prevState.withoutRMU,
//     }));
//   };

//   const handleQuantityChange = (itemName, quantity) => {
//     setFormData(prevState => ({
//       ...prevState,
//       quantities: {...prevState.quantities, [itemName]: quantity},
//     }));
//   };

//   const validateInput = () => {
//     if (!farmerContact) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return false;
//     }

//     for (const item of selectedItems) {
//       if (!quantities[item]) {
//         Alert.alert('Error', `Please enter quantity for ${item}.`);
//         return false;
//       }
//     }

//     if (withoutRMU === true && !rmuRemark) {
//       Alert.alert(
//         'Error',
//         'Please provide a reason for selecting "Without RMU".',
//       );
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateInput()) return;

//     setButtonVisible(false); 

//     const itemSelected = selectedItems.map(item => ({
//       itemName: item,
//       quantity: parseInt(quantities[item]),
//     }));

//     const data = {
//       farmerComplaintId: id,
//       name,
//       farmerContact,
//       items: itemSelected,
//       warehouse: selectedWarehouse,
//       remark: remarks,
//       serialNumber,
//       incoming: true,
//       pickupDate: new Date(),
//       withoutRMU,
//       rmuRemark,
//       farmerSaralId: saralId,
//       farmerName, 
//       farmerVillage: village,

//     };
//     console.log("Form Data", data)

//     if (!controllerSelected) {
//       data.withoutRMU = null;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${API_URL}/service-person/incoming-items`,
//         data,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );
//       console.log("Form Data",data)
//       resetForm();
//       setFormData(prevState => ({...prevState, modalVisible: false}));
//       Alert.alert('Success', 'Transaction saved successfully');
//       navigation.goBack();
//     } catch (error) {
//        Alert.alert("Error", JSON.stringify(error.response.data?.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       selectedItems: [],
//       quantities: {},
//       remarks: '',
//       serialNumber: '',
//       selectedWarehouse: 'Bhiwani',
//       controllerSelected: false,
//       withoutRMU: null,
//       rmuRemark: '',
//       farmerSaralId: '',
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
//         <Text style={{color: 'black'}}>Select Items:</Text>
//         <MultiSelect
//           items={filteredItems}
//           uniqueKey="itemName"
//           onSelectedItemsChange={handleItemSelect}
//           selectedItems={selectedItems}
//           selectText="Pick Items"
//           searchInputPlaceholderText="Search Items..."
//           displayKey="itemName"
//           hideSubmitButton
//           styleListContainer={styles.listContainer}
//           textColor="#000"
//         />
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.modalContainer}>
//           <Text style={{color: 'black'}}>Farmer Saral Id:</Text>
//           <TextInput
//             value={saralId}
//             onChangeText={text =>
//               setFormData(prevState => ({...prevState, saralId: text}))
//             }
//             placeholder="Enter Saral Id"
//             style={styles.input}
//             placeholderTextColor={'#000'}
//           />

//           <Text style={styles.label}>Farmer Name:</Text>
//           <TextInput
//             style={[styles.input, styles.nonEditable]}
//             value={name || 'N/A'}
//             editable={false}
//           />

//           <Text style={styles.label}>Farmer Contact:</Text>
//           <TextInput
//             style={[styles.input, styles.nonEditable]}
//             value={farmerContact?.toString() || 'N/A'}
//             keyboardType="phone-pad"
//             editable={false}
//           />

//           {selectedItems.map((item, index) => (
//             <View key={index}>
//               <Text style={{color: 'black'}}>
//                 Quantity for <Text style={styles.itemText}>{item}</Text>:
//               </Text>
//               <TextInput
//                 value={quantities[item]}
//                 onChangeText={value => handleQuantityChange(item, value)}
//                 keyboardType="numeric"
//                 placeholder="Enter Quantity"
//                 style={styles.input}
//                 placeholderTextColor={'#000'}
//               />
//             </View>
//           ))}

//           <Text style={{color: 'black'}}>Serial Number:</Text>
//           <TextInput
//             value={serialNumber}
//             onChangeText={text =>
//               setFormData(prevState => ({...prevState, serialNumber: text}))
//             }
//             placeholder="Enter Serial Number"
//             style={styles.input}
//             placeholderTextColor={'#000'}
//           />

//           <Text style={{color: 'black'}}>Warehouse:</Text>
//           <Picker
//             selectedValue={selectedWarehouse}
//             style={styles.picker}
//             onValueChange={value =>
//               setFormData(prevState => ({
//                 ...prevState,
//                 selectedWarehouse: value,
//               }))
//             }>
//             {warehouses?.map(warehouse => (
//               <Picker.Item
//                 key={warehouse._id}
//                 label={warehouse.warehouseName}
//                 value={warehouse.warehouseName}
//               />
//             ))}
//           </Picker>

//           {controllerSelected && (
//             <View>
//               <Text>Select RMU or Without RMU:</Text>
//               <RadioButton.Group
//                 onValueChange={value =>
//                   setFormData(prevState => ({
//                     ...prevState,
//                     withoutRMU: value,
//                   }))
//                 }
//                 value={withoutRMU}>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-around',
//                     marginVertical: 10,
//                   }}>
//                   <View style={{alignItems: 'center'}}>
//                     <Text>RMU</Text>
//                     <RadioButton value={false} />
//                   </View>
//                   <View style={{alignItems: 'center'}}>
//                     <Text>Without RMU</Text>
//                     <RadioButton value={true} />
//                   </View>
//                 </View>
//               </RadioButton.Group>

//               {withoutRMU && (
//                 <View>
//                   <Text>Reason for Without RMU:</Text>
//                   <TextInput
//                     value={rmuRemark}
//                     onChangeText={text =>
//                       setFormData(prevState => ({
//                         ...prevState,
//                         rmuRemark: text,
//                       }))
//                     }
//                     placeholder="Enter Reason"
//                     style={styles.input}
//                     placeholderTextColor={'#000'}
//                   />
//                 </View>
//               )}
//             </View>
//           )}

//           <Text style={{color: 'black'}}>Remarks:</Text>
//           <TextInput
//             value={remarks}
//             onChangeText={text =>
//               setFormData(prevState => ({...prevState, remarks: text}))
//             }
//             placeholder="Enter Remarks"
//             style={styles.input}
//             placeholderTextColor={'#000'}
//           />

//           {/* <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//               <Text style={styles.buttonText}>Submit</Text>
//             </TouchableOpacity> */}

//          {buttonVisible && (
//           <TouchableOpacity
//             style={[styles.button, loading && styles.disabledButton]}
//             onPress={handleSubmit}
//             disabled={loading}>
//             <Text style={styles.buttonText}>
//               {loading ? 'Submitting...' : 'Submit'}
//             </Text>
//           </TouchableOpacity>
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: 200,
//     padding: 20,
//     flex: 1,
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
//   multiSelect: {
//     backgroundColor: '#fbd33b',
//   },
//   picker: {
//     backgroundColor: '#fbd33b',
//     color: '#070604',
//   },
//   button: {
//     backgroundColor: '#070604',
//     padding: 12,
//     marginBottom: 15,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   itemText: {
//     fontWeight: 'bold',
//   },
// });

// export default InOrder;

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
import {RadioButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const InOrder = ({route}) => {
  const {id, name, farmerContact, saralId, farmerName, village} = route.params;
  const [items, setItems] = useState([{}]);
  const [warehouses, setWarehouses] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);

  const [formData, setFormData] = useState({
    remarks: '',
    selectedItems: [],
    quantities: {},
    status: '',
    serialNumber: '',
    selectedWarehouse: 'Bhiwani',
    controllerSelected: false,
    withoutRMU: null,
    rmuRemark: '',
    farmerSaralId: '',
  });

  const {
    remarks,
    selectedItems,
    quantities,
    status,
    serialNumber,
    selectedWarehouse,
    controllerSelected,
    withoutRMU,
    rmuRemark,
    farmerSaralId,
  } = formData;

  // useEffect(() => {
  //   const fetchAllWarehouses = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${API_URL}/service-person/all-warehouses`,
  //       );
  //       // Filter out Sirsa warehouse
  //       const filteredWarehouses = response.data.allWarehouses.filter(
  //         warehouse => warehouse.warehouseName !== "Sirsa", 
  //       );
  //       setWarehouses(filteredWarehouses);
  //     } catch (error) {
  //       console.log('Failed to fetch warehouses:', error);
  //     }
  //   };

  //   fetchAllWarehouses();
  // }, []);

  useEffect(() => {
  const fetchAllWarehouses = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/service-person/all-warehouses`,
      );
      // Filter out Sirsa, Jind, and Fatehabad warehouses
      const filteredWarehouses = response.data.allWarehouses.filter(
        warehouse => 
          warehouse.warehouseName !== "Sirsa" && 
          warehouse.warehouseName !== "Jind" &&
          warehouse.warehouseName !== "Fatehabad"
      );
      setWarehouses(filteredWarehouses);
    } catch (error) {
      console.log('Failed to fetch warehouses:', error);
    }
  };

  fetchAllWarehouses();
}, []);

  useEffect(() => {
    const selectedItemList = async () => {
      const response = await axios.get(
        `${API_URL}/service-person/warehouse-items?option=${selectedWarehouse}`,
      );
      const updateItemsData = [];
      for (let index = 0; index < response.data.itemsData.length; index++) {
        updateItemsData.push({
          _id: index + 1,
          itemName: response.data.itemsData[index],
        });
      }
      setItems(updateItemsData);
      setFilteredItems(updateItemsData);
    };
    selectedItemList();
  }, [selectedWarehouse]);

  const handleItemSelect = selected => {
    const validItems = selected.filter(item =>
      filteredItems.some(
        filteredItem =>
          filteredItem.itemName.toLowerCase() === item.toLowerCase(),
      ),
    );

    const isControllerSelected = validItems.some(item =>
      item.toLowerCase().includes('controller'),
    );

    setFormData(prevState => ({
      ...prevState,
      selectedItems: validItems,
      quantities: validItems.reduce((acc, item) => ({...acc, [item]: ''}), {}),
      controllerSelected: isControllerSelected,
      withoutRMU: isControllerSelected ? null : prevState.withoutRMU,
    }));
  };

  const handleQuantityChange = (itemName, quantity) => {
    setFormData(prevState => ({
      ...prevState,
      quantities: {...prevState.quantities, [itemName]: quantity},
    }));
  };

  const validateInput = () => {
    if (!farmerContact) {
      Alert.alert('Error', 'Please fill in all fields.');
      return false;
    }

    for (const item of selectedItems) {
      if (!quantities[item]) {
        Alert.alert('Error', `Please enter quantity for ${item}.`);
        return false;
      }
    }

    if (withoutRMU === true && !rmuRemark) {
      Alert.alert(
        'Error',
        'Please provide a reason for selecting "Without RMU".',
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    setButtonVisible(false); 

    const itemSelected = selectedItems.map(item => ({
      itemName: item,
      quantity: parseInt(quantities[item]),
    }));

    const data = {
      farmerComplaintId: id,
      name,
      farmerContact,
      items: itemSelected,
      warehouse: selectedWarehouse,
      remark: remarks,
      serialNumber,
      incoming: true,
      pickupDate: new Date(),
      withoutRMU,
      rmuRemark,
      farmerSaralId: saralId,
      farmerName, 
      farmerVillage: village,
    };

    if (!controllerSelected) {
      data.withoutRMU = null;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/service-person/incoming-items`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      resetForm();
      setFormData(prevState => ({...prevState, modalVisible: false}));
      Alert.alert('Success', 'Transaction saved successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error.response.data?.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      selectedItems: [],
      quantities: {},
      remarks: '',
      serialNumber: '',
      selectedWarehouse: 'Bhiwani',
      controllerSelected: false,
      withoutRMU: null,
      rmuRemark: '',
      farmerSaralId: '',
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
        <Text style={{color: 'black'}}>Select Items:</Text>
        <MultiSelect
          items={filteredItems}
          uniqueKey="itemName"
          onSelectedItemsChange={handleItemSelect}
          selectedItems={selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          displayKey="itemName"
          hideSubmitButton
          styleListContainer={styles.listContainer}
          textColor="#000"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.modalContainer}>
          <Text style={{color: 'black'}}>Farmer Saral Id:</Text>
          <TextInput
            value={saralId}
            onChangeText={text =>
              setFormData(prevState => ({...prevState, saralId: text}))
            }
            placeholder="Enter Saral Id"
            style={styles.input}
            placeholderTextColor={'#000'}
          />

          <Text style={styles.label}>Farmer Name:</Text>
          <TextInput
            style={[styles.input, styles.nonEditable]}
            value={name || 'N/A'}
            editable={false}
          />

          <Text style={styles.label}>Farmer Contact:</Text>
          <TextInput
            style={[styles.input, styles.nonEditable]}
            value={farmerContact?.toString() || 'N/A'}
            keyboardType="phone-pad"
            editable={false}
          />

          {selectedItems.map((item, index) => (
            <View key={index}>
              <Text style={{color: 'black'}}>
                Quantity for <Text style={styles.itemText}>{item}</Text>:
              </Text>
              <TextInput
                value={quantities[item]}
                onChangeText={value => handleQuantityChange(item, value)}
                keyboardType="numeric"
                placeholder="Enter Quantity"
                style={styles.input}
                placeholderTextColor={'#000'}
              />
            </View>
          ))}

          <Text style={{color: 'black'}}>Serial Number:</Text>
          <TextInput
            value={serialNumber}
            onChangeText={text =>
              setFormData(prevState => ({...prevState, serialNumber: text}))
            }
            placeholder="Enter Serial Number"
            style={styles.input}
            placeholderTextColor={'#000'}
          />

          <Text style={{color: 'black'}}>Warehouse:</Text>
          <Picker
            selectedValue={selectedWarehouse}
            style={styles.picker}
            onValueChange={value =>
              setFormData(prevState => ({
                ...prevState,
                selectedWarehouse: value,
              }))
            }>
            {warehouses?.map(warehouse => (
              <Picker.Item
                key={warehouse._id}
                label={warehouse.warehouseName}
                value={warehouse.warehouseName}
              />
            ))}
          </Picker>

          {controllerSelected && (
            <View>
              <Text>Select RMU or Without RMU:</Text>
              <RadioButton.Group
                onValueChange={value =>
                  setFormData(prevState => ({
                    ...prevState,
                    withoutRMU: value,
                  }))
                }
                value={withoutRMU}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginVertical: 10,
                  }}>
                  <View style={{alignItems: 'center'}}>
                    <Text>RMU</Text>
                    <RadioButton value={false} />
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text>Without RMU</Text>
                    <RadioButton value={true} />
                  </View>
                </View>
              </RadioButton.Group>

              {withoutRMU && (
                <View>
                  <Text>Reason for Without RMU:</Text>
                  <TextInput
                    value={rmuRemark}
                    onChangeText={text =>
                      setFormData(prevState => ({
                        ...prevState,
                        rmuRemark: text,
                      }))
                    }
                    placeholder="Enter Reason"
                    style={styles.input}
                    placeholderTextColor={'#000'}
                  />
                </View>
              )}
            </View>
          )}

          <Text style={{color: 'black'}}>Remarks:</Text>
          <TextInput
            value={remarks}
            onChangeText={text =>
              setFormData(prevState => ({...prevState, remarks: text}))
            }
            placeholder="Enter Remarks"
            style={styles.input}
            placeholderTextColor={'#000'}
          />

          {buttonVisible && (
            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    padding: 20,
    flex: 1,
  },
  listContainer: {
    backgroundColor: '#fbd33b',
    maxHeight: 500,
    height: 300,
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
  remark: {
    flex: 1,
    padding: 16,
  },
  multiSelect: {
    backgroundColor: '#fbd33b',
  },
  picker: {
    backgroundColor: '#fbd33b',
    color: '#070604',
  },
  button: {
    backgroundColor: '#070604',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  itemText: {
    fontWeight: 'bold',
  },
  nonEditable: {
    backgroundColor: '#e0e0e0',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default InOrder;