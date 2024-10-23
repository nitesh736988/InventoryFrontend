import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { API_URL } from '@env';
import { FlatList } from 'react-native-gesture-handler';

const RequestItem = ({ route }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [farmerContact, setFarmerContact] = useState('');
  const [farmerVillageName, setFarmerVilageName] = useState('');
  const [remarks, setRemarks] = useState(''); // State for remarks
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
  const [imageUri, setImageUri] = useState(null);
  
  const warehouses = ['Bhiwani', 'Hisar', 'Sirsa'];

  
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownOpen = () => {
    setDropdownOpen(true);
  };

  const handleItemSelect = (selected) => {
    setDropdownOpen(false);
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

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = response.assets[0].uri;
        setImageUri(source);
      }
    });
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    const data = new FormData();
    data.append('name', name);
    data.append('contact', contact);
    data.append('Farmer Name', farmerName);
    data.append('Farmer Contact Number', farmerContact);
    data.append('Farmer Village Number', farmerVillageName);
    data.append('warehouse', warehouse);
    data.append('status', status);
    data.append('remarks', remarks); 

    selectedItems.forEach(item => {
      data.append('items[]', JSON.stringify({ itemName: item, quantity: quantities[item] }));
    });

    if (imageUri) {
      const fileName = imageUri.split('/').pop();
      const imageType = `image/${fileName.split('.').pop()}`;
      data.append('image', {
        uri: imageUri,
        name: fileName,
        type: imageType,
      });
    }

    try {
      const response = await axios.post(`${API_URL}/service-person/create-pickup-items`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Transaction saved successfully');
        resetForm();
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to save transaction');
      }
    } catch (error) {
      if (error.response && error.response.data.message === "servicePerson not found") {
        Alert.alert("Service Person Doesn't exist");
      }
    }
  };

  const resetForm = () => {
    setName('');
    setContact('');
    setFarmerName('');
    setFarmerContact('');
    setFarmerVilageName('');
    setSelectedItems([]);
    setQuantities({});
    setWarehouse('');
    setStatus('');
    setRemarks(''); 
    setImageUri(null);
  };

  const renderItem = () => {
    <MultiSelect
      items={items}
      uniqueKey="itemName"
      onSelectedItemsChange={handleItemSelect}
      selectedItems={selectedItems}
      selectText="Pick Items"
      searchInputPlaceholderText="Search Items..."
      displayKey="itemName"
      hideSubmitButton={true}
      styleListContainer={{ backgroundColor: '#fbd33b', overflow: 'hidden' }}
      styleDropdownMenuSubsection={{ backgroundColor: '#fbd33b', overflow: 'hidden' }}
      // onDropdownWillShow={handleDropdownOpen}
      // onDropdownWillHide={() => setDropdownOpen(false)}
    />
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Request Item</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}  scrollEnabled={true}>
          <View style={styles.modalContainer}>
            <Text>Service Person Name:</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Enter Name" style={styles.input} />

            <Text>Service Person Contact:</Text>
            <TextInput value={contact} onChangeText={setContact} placeholder="Enter Contact" style={styles.input} maxLength={10} />

            <Text>Farmer Name:</Text>
            <TextInput value={farmerName} onChangeText={setFarmerName} placeholder="Enter Contact" style={styles.input}   />

            <Text>Farmer Contact Number:</Text>
            <TextInput value={farmerContact} onChangeText={setFarmerContact} placeholder="Enter Contact" style={styles.input} maxLength={10} />

            <Text>Farmer Village Name:</Text>
            <TextInput value={farmerVillageName} onChangeText={setFarmerVilageName} placeholder="Enter Contact" style={styles.input} />

            <Text>Select Items:</Text>
              <MultiSelect
                items={items}
                uniqueKey="itemName"
                onSelectedItemsChange={handleItemSelect}
                selectedItems={selectedItems}
                selectText="Pick Items"
                searchInputPlaceholderText="Search Items..."
                displayKey="itemName"
                hideSubmitButton={true}
                styleListContainer={{ backgroundColor: '#fbd33b' }}
                styleDropdownMenuSubsection={{ backgroundColor: '#fbd33b' }}
              />

            {selectedItems.map((item, index) => (
              <View key={index}>
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

            <Text>Upload Image:</Text>
            <TouchableOpacity style={styles.button} onPress={selectImage}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

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

            <View style={styles.remark}>
              <Text>Remarks:</Text>
              <ScrollView style={styles.scrollView}>
                <TextInput 
                  value={remarks} 
                  onChangeText={setRemarks} 
                  placeholder="Enter Remarks" 
                  style={styles.input} 
                  maxLength={100} 
                  multiline 
                  numberOfLines={4}
                />
              </ScrollView>
            </View>

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
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  scrollView: {

    borderRadius: 5,
    padding: 5,
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
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
});

export default RequestItem;
