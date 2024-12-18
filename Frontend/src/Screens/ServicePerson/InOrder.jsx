// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Alert, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
// import MultiSelect from 'react-native-multiple-select';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// import { API_URL } from '@env';
// import { RadioButton } from 'react-native-paper';

// const InOrder = () => {
//   const [items, setItems ] = useState([{}]);
//   const [formData, setFormData] = useState({
//     farmerName: '',
//     farmerContact: '',
//     farmerVillageName: '',
//     remarks: '',
//     selectedItems: [],
//     quantities: {},
//     status: '',
//     modalVisible: false,
//     serialNumber: '',
//     selectedWarehouse: 'Bhiwani',
//     controllerSelected: false,
//     withoutRMU: null,
//     rmuRemark: '',
//   });

//   const { farmerName, farmerContact, farmerVillageName, remarks, selectedItems, quantities, status, modalVisible, serialNumber, selectedWarehouse, controllerSelected, withoutRMU, rmuRemark } = formData;

//   useEffect(() => {
//     const selectedItemList = async () => {
//       const response = await axios.get(`${API_URL}/service-person/warehouse-items?option=${selectedWarehouse}`);

//       const updateItemsData = [];
//       for (let index = 0; index < response.data.itemsData.length; index++) {
//         updateItemsData.push({ _id: index + 1, itemName: response.data.itemsData[index] });
//       }
//       setItems(updateItemsData);
//     };
//     selectedItemList();
//   }, [selectedWarehouse]);

//   useEffect(() => {
//     if (selectedItems.includes("Controller")) {
//       setFormData(prevState => ({
//         ...prevState,
//         controllerSelected: true,
//       }));
//     } else {
//       setFormData(prevState => ({
//         ...prevState,
//         controllerSelected: false,
//       }));
//     }
//   }, [selectedItems]);

//   const handleItemSelect = (selected) => {
//     const newQuantities = {};
//     selected.forEach(item => {
//       newQuantities[item] = '';
//     });

//     setFormData(prevState => ({
//       ...prevState,
//       selectedItems: selected,
//       quantities: newQuantities,
//     }));
//   };

//   const handleQuantityChange = (itemName, quantity) => {
//     setFormData(prevState => ({
//       ...prevState,
//       quantities: { ...prevState.quantities, [itemName]: quantity },
//     }));
//   };

//   const validateInput = () => {
//     if (!farmerContact || !farmerName || !farmerVillageName) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return false;
//     }

//     for (const item of selectedItems) {
//       if (!quantities[item]) {
//         Alert.alert('Error', `Please enter quantity for ${item}.`);
//         return false;
//       }
//     }

//     if (withoutRMU === 'Without RMU' && !rmuRemark) {
//       Alert.alert('Error', 'Please provide a reason for selecting "Without RMU".');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateInput()) return;

//     let itemSelected = [];
//     selectedItems.forEach(item => {
//       itemSelected.push({ itemName: item, quantity: parseInt(quantities[item]) });
//     });

//     const data = {
//       farmerName,
//       farmerContact,
//       farmerVillage: farmerVillageName,
//       items: itemSelected,
//       warehouse: selectedWarehouse,
//       remark: remarks,
//       serialNumber,
//       incoming: true,
//       pickupDate: new Date(),
//       withoutRMU,
//       rmuRemark,
//     };

//     if(!formData.controllerSelected){
//       data.withoutRMU = null;
//     }

//     console.log(data);
//     if(controllerSelected && withoutRMU){
//       if(rmuRemark === ''){
//         Alert.alert('Reason for Without RMU');
//         return;
//       }
//     }

//     try {
//       const response = await axios.post(`${API_URL}/service-person/incoming-items`, data, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       resetForm();
//       Alert.alert('Success', 'Transaction saved successfully');
//       setFormData(prevState => ({
//         ...prevState,
//         modalVisible: false,
//       }));
//     } catch (error) {
//       Alert.alert(JSON.stringify(error.response.data.message));
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       farmerName: '',
//       farmerContact: '',
//       farmerVillageName: '',
//       selectedItems: [],
//       quantities: {},
//       remarks: '',
//       serialNumber: '',
//       selectedWarehouse: 'Bhiwani',
//       controllerSelected: false,
//       withoutRMU: 'Without RMU',
//       rmuRemark: '',
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.button} onPress={() => setFormData(prevState => ({ ...prevState, modalVisible: true }))}>
//         <Text style={styles.buttonText}>Request Item</Text>
//       </TouchableOpacity>

//       <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={() => setFormData(prevState => ({ ...prevState, modalVisible: false }))}>
//         <View style={{ paddingHorizontal: 20, backgroundColor: '#fbd33b', paddingTop: 30 }}>
//           <Text>Select Items:</Text>
//           <MultiSelect
//             items={items}
//             uniqueKey="itemName"
//             onSelectedItemsChange={handleItemSelect}
//             selectedItems={selectedItems}
//             selectText="Pick Items"
//             searchInputPlaceholderText="Search Items..."
//             displayKey="itemName"
//             hideSubmitButton={true}
//             styleDropdownMenuSubsection={{ backgroundColor: '#fbd33b' }}
//             styleMainWrapper={styles.multiSelect}
//             styleListContainer={styles.listContainer}
//           />
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <View style={styles.modalContainer}>
//             <Text>Farmer Name:</Text>
//             <TextInput value={farmerName} onChangeText={(text) => setFormData(prevState => ({ ...prevState, farmerName: text }))} placeholder="Enter Name" style={styles.input} />

//             <Text>Farmer Contact Number:</Text>
//             <TextInput value={farmerContact} onChangeText={(text) => setFormData(prevState => ({ ...prevState, farmerContact: text }))} placeholder="Enter Contact" style={styles.input} maxLength={10} />

//             <Text>Farmer Village Name:</Text>
//             <TextInput value={farmerVillageName} onChangeText={(text) => setFormData(prevState => ({ ...prevState, farmerVillageName: text }))} placeholder="Enter Village" style={styles.input} />

//             {selectedItems.map((item, index) => (
//               <View key={index}>
//                 <Text>Quantity for <Text style={styles.itemText}>{item}</Text>:</Text>
//                 <TextInput
//                   value={quantities[item]}
//                   onChangeText={(value) => handleQuantityChange(item, value)}
//                   keyboardType="numeric"
//                   placeholder="Enter Quantity"
//                   style={styles.input}
//                 />
//               </View>
//             ))}

//             <Text>Serial Number:</Text>
//             <TextInput value={serialNumber} onChangeText={(text) => setFormData(prevState => ({ ...prevState, serialNumber: text }))} placeholder="Enter Serial Number" style={styles.input} maxLength={100} />

//             <Text>Warehouse:</Text>
//             <Picker selectedValue={selectedWarehouse} style={styles.picker} onValueChange={(itemValue) => setFormData(prevState => ({ ...prevState, selectedWarehouse: itemValue }))}>
//               {['Sirsa', 'Hisar', 'Bhiwani'].map((warehouse, index) => (
//                 <Picker.Item key={index} label={warehouse} value={warehouse} />
//               ))}
//             </Picker>

//             {controllerSelected && (
//               <View >
//                 <Text>Select:</Text>
//                 <RadioButton.Group onValueChange={(value) => setFormData(prevState => ({ ...prevState, withoutRMU: value }))} value={withoutRMU}>
//                   <View style={{ width: '100%', flexDirection: 'row', gap: 16}}>
//                     <View style={{ flexDirection: 'row', alignItems: 'center'}}>
//                       <Text>RMU</Text>
//                       <RadioButton value={false} />
//                     </View>
//                     <View style={{ flexDirection: 'row', alignItems: 'center'}}>
//                       <Text>Without RMU</Text>
//                       <RadioButton value={true} />
//                     </View>
//                   </View>

//                 </RadioButton.Group>
//               </View>
//             )}

//             {controllerSelected && withoutRMU !== null && withoutRMU &&  (
//               <View>
//                 <Text>Reason for Without RMU:</Text>
//                 <TextInput
//                   value={rmuRemark}
//                   onChangeText={(text) => setFormData(prevState => ({ ...prevState, rmuRemark: text }))}
//                   placeholder="Enter reason"
//                   style={styles.input}
//                   multiline
//                 />
//               </View>
//             )}

//             <View style={styles.remark}>
//               <Text>Remarks:</Text>
//               <TextInput value={remarks} onChangeText={(text) => setFormData(prevState => ({ ...prevState, remarks: text }))} placeholder="Enter Remarks" style={styles.input} multiline numberOfLines={4} maxLength={100} />
//             </View>

//             <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//               <Text style={styles.buttonText}>Submit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={() => setFormData(prevState => ({ ...prevState, modalVisible: false }))}>
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
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {API_URL} from '@env';
import {RadioButton} from 'react-native-paper';

const InOrder = () => {
  const [items, setItems] = useState([{}]);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    farmerName: '',
    farmerContact: '',
    farmerVillageName: '',
    remarks: '',
    selectedItems: [],
    quantities: {},
    status: '',
    modalVisible: false,
    serialNumber: '',
    selectedWarehouse: 'Bhiwani',
    controllerSelected: false,
    withoutRMU: null,
    rmuRemark: '',
  });

  const {
    farmerName,
    farmerContact,
    farmerVillageName,
    remarks,
    selectedItems,
    quantities,
    status,
    modalVisible,
    serialNumber,
    selectedWarehouse,
    controllerSelected,
    withoutRMU,
    rmuRemark,
  } = formData;

  useEffect(() => {
   
    const fetchAllWarehouses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/service-person/all-warehouses`,
        );
        setWarehouses(response.data.allWarehouses); // Set the fetched data to warehouses
      } catch (error) {
        console.log('Failed to fetch warehouses:', error);
      }
    };

    fetchAllWarehouses();
  }, []);

  useEffect(() => {
    // Fetch items based on the selected warehouse
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
    };
    selectedItemList();
  }, [selectedWarehouse]);

  const handleItemSelect = selected => {
    const isControllerSelected = selected.some(item =>
      item.toLowerCase().includes('controller'),
    );

    const newQuantities = {};
    selected.forEach(item => {
      newQuantities[item] = quantities[item] || '';
    });

    setFormData(prevState => ({
      ...prevState,
      selectedItems: selected,
      quantities: newQuantities,
      controllerSelected: isControllerSelected,
      withoutRMU: isControllerSelected ? prevState.withoutRMU : null,
      rmuRemark: isControllerSelected ? prevState.rmuRemark : '',
    }));
  };

  const handleQuantityChange = (itemName, quantity) => {
    setFormData(prevState => ({
      ...prevState,
      quantities: {...prevState.quantities, [itemName]: quantity},
    }));
  };

  const validateInput = () => {
    if (!farmerContact || !farmerName || !farmerVillageName) {
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

    let itemSelected = [];
    selectedItems.forEach(item => {
      itemSelected.push({itemName: item, quantity: parseInt(quantities[item])});
    });

    const data = {
      farmerName,
      farmerContact,
      farmerVillage: farmerVillageName,
      items: itemSelected,
      warehouse: selectedWarehouse,
      remark: remarks,
      serialNumber,
      incoming: true,
      pickupDate: new Date(),
      withoutRMU,
      rmuRemark,
    };

    if (!controllerSelected) {
      data.withoutRMU = null;
    }

    try {
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
      Alert.alert('Success', 'Transaction saved successfully');
      setFormData(prevState => ({
        ...prevState,
        modalVisible: false,
      }));
    } catch (error) {
      Alert.alert(JSON.stringify(error.response.data.message));
    }
  };

  const resetForm = () => {
    setFormData({
      farmerName: '',
      farmerContact: '',
      farmerVillageName: '',
      selectedItems: [],
      quantities: {},
      remarks: '',
      serialNumber: '',
      selectedWarehouse: 'Bhiwani',
      controllerSelected: false,
      withoutRMU: null,
      rmuRemark: '',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          setFormData(prevState => ({...prevState, modalVisible: true}))
        }>
        <Text style={styles.buttonText}>Request Item</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() =>
          setFormData(prevState => ({...prevState, modalVisible: false}))
        }>
        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: '#fbd33b',
            paddingTop: 30,
          }}>
          <Text style= {{color: 'black'}}>Select Items:</Text>
          <MultiSelect
            items={items}
            uniqueKey="itemName"
            onSelectedItemsChange={handleItemSelect}
            selectedItems={selectedItems}
            selectText="Pick Items"
            searchInputPlaceholderText="Search Items..."
            displayKey="itemName"
            hideSubmitButton={true}
            styleDropdownMenuSubsection={{backgroundColor: '#fbd33b'}}
            styleMainWrapper={styles.multiSelect}
            styleListContainer={styles.listContainer}
            placeholderTextColor={'#000'}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.modalContainer}>
            <Text style= {{color: 'black'}}>Farmer Name:</Text>
            <TextInput
              value={farmerName}
              onChangeText={text =>
                setFormData(prevState => ({...prevState, farmerName: text}))
              }
              placeholder="Enter Name"
              style={styles.input}
              placeholderTextColor={'#000'}
            />

            <Text style= {{color: 'black'}}>Farmer Contact Number:</Text>
            <TextInput
              value={farmerContact}
              onChangeText={text =>
                setFormData(prevState => ({...prevState, farmerContact: text}))
              }
              placeholder="Enter Contact"
              style={styles.input}
              maxLength={10}
              placeholderTextColor={'#000'}
            />

            <Text style= {{color: 'black'}}>Farmer Village Name:</Text>
            <TextInput
              value={farmerVillageName}
              onChangeText={text =>
                setFormData(prevState => ({
                  ...prevState,
                  farmerVillageName: text,
                }))
              }
              placeholder="Enter Village"
              style={styles.input}
              placeholderTextColor={'#000'}
            />

            {selectedItems.map((item, index) => (
              <View key={index}>
                <Text style= {{color: 'black'}}>
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

            <Text style= {{color: 'black'}}>Serial Number:</Text>
            <TextInput
              value={serialNumber}
              onChangeText={text =>
                setFormData(prevState => ({...prevState, serialNumber: text}))
              }
              placeholder="Enter Serial Number"
              style={styles.input}
              placeholderTextColor={'#000'}
            />

            <Text style= {{color: 'black'}}>Warehouse:</Text>
            <Picker
              selectedValue={selectedWarehouse}
              style={styles.picker}
              onValueChange={value =>
                setFormData(prevState => ({
                  ...prevState,
                  selectedWarehouse: value,
                }))
              }>
              {warehouses.map(warehouse => (
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

            <Text style= {{color: 'black'}}>Remarks:</Text>
            <TextInput
              value={remarks}
              onChangeText={text =>
                setFormData(prevState => ({...prevState, remarks: text}))
              }
              placeholder="Enter Remarks"
              style={styles.input}
              placeholderTextColor={'#000'}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                setFormData(prevState => ({...prevState, modalVisible: false}))
              }>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    padding: 20,
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
});

export default InOrder;
