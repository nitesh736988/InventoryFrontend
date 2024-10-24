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
  const [serialNumber, setSerialNumber ] = useState('');
  
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
    if (!name || !contact || !warehouse || !status || !farmerContact || !farmerName || !farmerVillageName ) {
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
    // const formData = new FormData();
    console.log('btn clicked');
    if (!validateInput()) return;
    console.log(selectedItems)
    let itemSelected = []
    selectedItems.forEach(item => {
      // data.append('items[]', JSON.stringify({ itemName: item, quantity: quantities[item] }));
      itemSelected.push({itemName: item, quantity: parseInt(quantities[item])});
    });
    console.log(itemSelected);

    const data = { farmerName, farmerContact, farmerVillage: farmerVillageName, items: JSON.stringify(itemSelected), warehouse, remark: remarks, serialNumber }

    // if (imageUri) {
    //   const filename = imageUri.split('/').pop();
    //   const imageType = `image/${filename.split('.').pop()}`;
    //   // data.append('image', {
    //   //   uri: imageUri,
    //   //   name: fileName,
    //   //   type: imageType,
    //   // });
    //   // data.image = {
    //   //   uri: imageUri,
    //   //   filename,
    //   //   type: imageType
    //   // }
    //   data.image = filename;
    // }

    console.log(data);

    try {
      const response = await axios.post(`${API_URL}/service-person/create-pickup-items`, data, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json'

          },
      }
    );

      console.log(response.data);
      Alert.alert(JSON.stringify(response.data));

      if (response.status === 200) {
        Alert.alert('Success', 'Transaction saved successfully');
        resetForm();
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to save transaction');
      }
    } catch (error) {
      Alert.alert(JSON.stringify(error));
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
        <View style={{ paddingHorizontal: 20, backgroundColor: '#fbd33b', paddingTop: 30}}>
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
        </View>
        <ScrollView contentContainerStyle={{...styles.scrollContainer }}>
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

            <Text>Serial Number</Text>
            <TextInput 
                  value={remarks} 
                  onChangeText={setRemarks} 
                  placeholder="Enter serial Number" 
                  style={styles.input} 
                  maxLength={100} 
                  multiline 
                  numberOfLines={4}
                />
            {/* <Text>Upload Image:</Text>
            <TouchableOpacity style={styles.button} onPress={selectImage}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity> */}
            {/* {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />} */}

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
                  value={serialNumber} 
                  onChangeText={setSerialNumber} 
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

            <TouchableOpacity style={{...styles.button }} onPress={handleSubmit}>
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
    height: 200,
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
