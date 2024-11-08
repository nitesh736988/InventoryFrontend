import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '@env';

const AddTransaction = ( { route } ) => {
  // const { isClicked } route.params;
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const items = [
    { itemName: 'Pump', quantity: 'Pump' },
    { itemName: 'Motor', quantity: 'Motor' },
    { itemName: 'Controller', quantity: 'Controller' },
  ];
  const [warehouse, setWarehouse] = useState('');
  const [status, setStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const warehouses = ['Bhiwani', 'Hisar', 'Sirsa'];

  const handleItemSelect = (selected) => {
    setSelectedItems(selected);
    const newQuantities = {};
    selected.forEach(item => {
      newQuantities[item] = '';
    });
    setQuantities(newQuantities);
  };

  const handleQuantityChange = (itemName, quantity) => {
    setQuantities({ ...quantities, [itemName]: quantity });
  };

  const validateInput = () => {
    if (!name || !contact || !warehouse || !status) {
      Alert.alert('Error', 'Please fill in all fields.');
      return false;
    }

    for (const item of selectedItems) {
      if (!quantities[item]) {
        Alert.alert('Error', `Please enter quantity for ${item}.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    const data = {
      name,
      contact,
      items: selectedItems.map(item => ({
        itemName: item,
        quantity: quantities[item],
      })),
      warehouse,
      status,
     
    };

    // console.log(data);
    try {
      const response = await axios.post(`${API_URL}/warehouse-admin/transactions/newTransaction`, data);

      if (response.status === 200) {
        Alert.alert('Success', 'Transaction saved successfully');
        // isClicked(true);
      
        resetForm();
        setModalVisible(false);
      }  
      else {
        Alert.alert('Error', 'Failed to save transaction');
      }

    } catch (error) {
      if((error.response.data.message) === "servicePerson not found"){
        Alert.alert("Service Person Doesn't exist");
    }
    }
  };

  const resetForm = () => {
    setName('');
    setContact('');
    setSelectedItems([]);
    setQuantities({});
    setWarehouse('');
    setStatus('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Add Transaction</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text>Name:</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Enter Name" style={styles.input} />

          <Text>Contact:</Text>
          <TextInput value={contact} onChangeText={setContact} placeholder="Enter Contact" style={styles.input} maxLength={10} />

          <Text>Select Items:</Text>
          <MultiSelect
            items={items}
            uniqueKey="itemName"
            onSelectedItemsChange={handleItemSelect}
            selectedItems={selectedItems}
            selectText="Pick Items"
            searchInputPlaceholderText="Search Items..."
            displayKey="itemName"
            hideSubmitButton
            styleListContainer={{ backgroundColor: '#fbd33b' }}
            styleDropdownMenuSubsection={{ backgroundColor: '#fbd33b' }}
          />

          {selectedItems.map(item => (
            <View key={item}>
              <Text>Quantity for <Text style={styles.itemText}>{item}</Text>:</Text>
              <TextInput
                value={quantities[item]}
                onChangeText={(value) => handleQuantityChange(item, value)}
                keyboardType="numeric"
                placeholder="Enter Quantity"
                style={styles.input}
              />
            </View>
          ))}

          <Text>Warehouse:</Text>
          <Picker
            selectedValue={warehouse}
            onValueChange={(itemValue) => setWarehouse(itemValue)}
            style={styles.picker}
          >
            {warehouses.map(wh => (
              <Picker.Item key={wh} label={wh} value={wh} />
            ))}
          </Picker>

          <Text>Status:</Text>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="IN" value="IN" />
            <Picker.Item label="OUT" value="OUT" />
          </Picker>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  itemText: {
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: '#fbd33b',
    color: '#070604',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#070604',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fbd33b',
    fontSize: 16,
  },
});

export default AddTransaction;
