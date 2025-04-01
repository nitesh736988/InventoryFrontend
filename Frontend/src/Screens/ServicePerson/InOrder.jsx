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
//   console.log('complaint Id md', farmerName);
//   console.log('complaint Id md', village);
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
import {useForm, Controller} from 'react-hook-form';

const InOrder = ({route}) => {
  const {id, name, farmerContact, saralId, farmerName, village} = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [items, setItems] = useState([{}]);
  const [warehouses, setWarehouses] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [controllerSelected, setControllerSelected] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      remarks: '',
      selectedItems: [],
      quantities: {},
      serialNumber: '',
      selectedWarehouse: '',
      withoutRMU: null,
      rmuRemark: '',
      farmerSaralId: saralId,
    },
  });

  const selectedItems = watch('selectedItems');
  const selectedWarehouse = watch('selectedWarehouse');
  const withoutRMU = watch('withoutRMU');

  useEffect(() => {
    const fetchAllWarehouses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/service-person/all-warehouses`,
        );
        setWarehouses(response.data.allWarehouses);
      } catch (error) {
        console.log('Failed to fetch warehouses:', error);
      }
    };

    fetchAllWarehouses();
  }, []);

  useEffect(() => {
    const selectedItemList = async () => {
      if (!selectedWarehouse) return;
      
      try {
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
      } catch (error) {
        console.log('Failed to fetch items:', error);
      }
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

    setControllerSelected(isControllerSelected);
    setValue('selectedItems', validItems);
    
    // Initialize quantities for new items
    const newQuantities = {};
    validItems.forEach(item => {
      if (!watch('quantities')[item]) {
        newQuantities[item] = '';
      }
    });
    setValue('quantities', {...watch('quantities'), ...newQuantities});
    
    if (!isControllerSelected) {
      setValue('withoutRMU', null);
      setValue('rmuRemark', '');
    }
  };

  const onSubmit = async data => {
    if (!validateInput(data)) return;

    setButtonVisible(false);

    const itemSelected = data.selectedItems.map(item => ({
      itemName: item,
      quantity: parseInt(data.quantities[item]),
    }));

    const formData = {
      farmerComplaintId: id,
      name,
      farmerContact,
      items: itemSelected,
      warehouse: data.selectedWarehouse,
      remark: data.remarks,
      serialNumber: data.serialNumber,
      incoming: true,
      pickupDate: new Date(),
      withoutRMU: controllerSelected ? data.withoutRMU : null,
      rmuRemark: data.rmuRemark,
      farmerSaralId: saralId,
      farmerName,
      farmerVillage: village,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/service-person/incoming-items`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      reset();
      Alert.alert('Success', 'Transaction saved successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'An error occurred');
      setButtonVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const validateInput = data => {
    if (!farmerContact) {
      Alert.alert('Error', 'Please fill in all fields.');
      return false;
    }

    if (!data.selectedWarehouse) {
      Alert.alert('Error', 'Please select a warehouse.');
      return false;
    }

    if (data.selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item.');
      return false;
    }

    for (const item of data.selectedItems) {
      if (!data.quantities[item] || isNaN(data.quantities[item])) {
        Alert.alert('Error', `Please enter a valid quantity for ${item}.`);
        return false;
      }
    }

    if (controllerSelected && data.withoutRMU === null) {
      Alert.alert('Error', 'Please select RMU or Without RMU option.');
      return false;
    }

    if (controllerSelected && data.withoutRMU === true && !data.rmuRemark) {
      Alert.alert(
        'Error',
        'Please provide a reason for selecting "Without RMU".',
      );
      return false;
    }

    return true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Select Items:</Text>
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
          tagRemoveIconColor="#000"
          tagBorderColor="#000"
          tagTextColor="#000"
          selectedItemTextColor="#000"
          selectedItemIconColor="#000"
          itemTextColor="#000"
          searchInputStyle={{color: '#000'}}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.modalContainer}>
          <Text style={styles.label}>Farmer Saral Id:</Text>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter Saral Id"
                style={styles.input}
                placeholderTextColor={'#000'}
              />
            )}
            name="farmerSaralId"
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

          {selectedItems?.map((item, index) => (
            <View key={index}>
              <Text style={styles.label}>
                Quantity for <Text style={styles.itemText}>{item}</Text>:
              </Text>
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    value={value?.toString()}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    placeholder="Enter Quantity"
                    style={styles.input}
                    placeholderTextColor={'#000'}
                  />
                )}
                name={`quantities.${item}`}
              />
            </View>
          ))}

          <Text style={styles.label}>Serial Number:</Text>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter Serial Number"
                style={styles.input}
                placeholderTextColor={'#000'}
              />
            )}
            name="serialNumber"
          />

          <Text style={styles.label}>Warehouse:</Text>
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <Picker
                selectedValue={value}
                style={styles.picker}
                onValueChange={onChange}>
                <Picker.Item label="Select Warehouse" value="" />
                {warehouses?.map(warehouse => (
                  <Picker.Item
                    key={warehouse._id}
                    label={warehouse.warehouseName}
                    value={warehouse.warehouseName}
                  />
                ))}
              </Picker>
            )}
            name="selectedWarehouse"
          />

          {controllerSelected && (
            <View style={styles.rmuContainer}>
              <Text style={styles.label}>Select RMU or Without RMU:</Text>
              <Controller
                control={control}
                render={({field: {onChange, value}}) => (
                  <RadioButton.Group onValueChange={onChange} value={value}>
                    <View style={styles.radioGroup}>
                      <View style={styles.radioOption}>
                        <Text>RMU</Text>
                        <RadioButton value={false} />
                      </View>
                      <View style={styles.radioOption}>
                        <Text>Without RMU</Text>
                        <RadioButton value={true} />
                      </View>
                    </View>
                  </RadioButton.Group>
                )}
                name="withoutRMU"
              />

              {withoutRMU && (
                <View>
                  <Text style={styles.label}>Reason for Without RMU:</Text>
                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextInput
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="Enter Reason"
                        style={styles.input}
                        placeholderTextColor={'#000'}
                      />
                    )}
                    name="rmuRemark"
                  />
                </View>
              )}
            </View>
          )}

          <Text style={styles.label}>Remarks:</Text>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter Remarks"
                style={styles.input}
                placeholderTextColor={'#000'}
                multiline
              />
            )}
            name="remarks"
          />

          {buttonVisible && (
            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleSubmit(onSubmit)}
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
    flex: 1,
    backgroundColor: '#fbd33b',
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: '#fbd33b',
    paddingTop: 30,
  },
  headerText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
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
    backgroundColor: '#fbd33b',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: '#070604',
  },
  picker: {
    backgroundColor: '#fff',
    color: '#070604',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#070604',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    color: 'black',
    marginBottom: 5,
  },
  itemText: {
    fontWeight: 'bold',
    color: '#000',
  },
  disabledButton: {
    opacity: 0.6,
  },
  nonEditable: {
    backgroundColor: '#e0e0e0',
    color: '#000',
  },
  rmuContainer: {
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  radioOption: {
    alignItems: 'center',
  },
});

export default InOrder;