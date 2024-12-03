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

const W2W = () => {
  const [items, setItems] = useState([]);
  const[allWarehouses, setAllWarehouse] = useState([]);
  const [formData,setFormData] = useState({
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
          setFormData((prev) => ({ ...prev, fromWarehouse: response.data.warehouseName}));
      } catch (error) {
        console.log('Failed to fetch warehouses:', error);
      }
    };

    fetchItems();
    fetchWarehouses();
  }, []);


  useEffect(()=>{

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
  },[])
  

  const handleInputChange = (name, value) => {
    console.log(name, value);
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

    // if (
    //   !driverName ||
    //   !driverContact ||
    //   !fromWarehouse ||
    //   !toWarehouse ||
    //   !isDefective
    // ) {
    //   Alert.alert('Error', 'Please fill in all required fields.');
    //   return false;
    // }

    // if (selectedItems.length === 0) {
    //   Alert.alert('Error', 'Please select at least one item.');
    //   return false;
    // }

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
    // if (!validateInput()) return;

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
      isDefective: isDefective === "Yes" ? true : false,
      items: itemSelected,
      driverName,
      driverContact,
      remarks,
      status: false,
      pickupDate: new Date()
    };
    console.log('Data sent : ', data);
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

      Alert.alert(
        'Error',
        JSON.stringify(error.response.data)
      );
    }
  };

  const resetForm = () => {
    setFormData({
      driverName: '',
      driverContact: '',
      remarks: '',
      selectedItems: [],
      quantities: {},
      items: [],
      allWarehouses: [],
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
        <Text>Select Items:</Text>
        <MultiSelect
          items={items}
          uniqueKey="itemName"
          onSelectedItemsChange={handleItemSelect}
          selectedItems={formData.selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          displayKey="itemName"
          hideSubmitButton
          textColor="#000"
        />
        {formData.selectedItems.map(item => (
          <View key={item} style={{ paddingHorizontal: 16 }}>
            <Text>Quantity for {item}:</Text>
            <TextInput
              value={formData.quantities[item]}
              onChangeText={value => handleQuantityChange(item, value)}
              placeholder={`Enter quantity for ${item}`}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        ))}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.modalContainer}>
            <Text>Driver Name:</Text>
            <TextInput
              value={formData.driverName}
              onChangeText={value => handleInputChange('driverName', value)}
              placeholder="Enter Driver Name"
              style={styles.input}
            />
            <Text>Driver Contact:</Text>
            <TextInput
              value={formData.driverContact}
              onChangeText={value => handleInputChange('driverContact', value)}
              placeholder="Enter Driver Contact"
              style={styles.input}
              keyboardType="phone-pad"
            />

            <Text>From Warehouse:</Text>
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
            <Text>To Warehouse:</Text>
            <Picker
              selectedValue={formData.toWarehouse}
              style={styles.picker}
              onValueChange={value => handleInputChange('toWarehouse', value)}>
                {allWarehouses.map((warehouse) => (
                  <Picker.Item
                    key={warehouse._id}
                    label={warehouse.warehouseName}
                    value={warehouse.warehouseName}
                  />
                ))}
            </Picker>
            <Text>Is Defective:</Text>
            <Picker
              selectedValue={formData.isDefective}
              style={styles.picker}
              onValueChange={value => handleInputChange('isDefective', value)}
            >
              {
                [{ _id: 1, name: 'Yes'}, { _id: 2, name: 'No'}].map(({_id, name}) => (
                  <Picker.Item 
                    key={_id}
                    label={name}
                    value={name}
                  />
                ))
              }
            </Picker>
            <Text>Remarks:</Text>
            <TextInput
              value={formData.remarks}
              onChangeText={value => handleInputChange('remarks', value)}
              placeholder="Enter Remarks"
              style={styles.input}
              maxLength={100}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.button} onPress={handleDataOnSubmit}>
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
    paddingHorizontal: 12
  },
  button: {
    backgroundColor: '#fbd33b',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  modalContainer: {
    padding: 20,
  },
  input: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});

export default W2W;
