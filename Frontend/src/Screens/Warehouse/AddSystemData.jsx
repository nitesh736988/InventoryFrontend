import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '@env';

const AddSystemData = () => {
  const [itemName, setItemName] = useState('');
  const [systemId,  setSystemId ] = useState('');
  const [quantity, setQuantity] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/warehouse-admin/show-systems`);
        console.log('System data:', response.data.data);
        setItems(response.data.data);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleSubmit = async () => {
    if (!itemName || !quantity) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    const newItem = {
      itemName,
      quantity,
      systemId

    };
    console.log(systemId);

    try {
      console.log('Submitting:', newItem);
      const response = await axios.post(`${API_URL}/warehouse-admin/add-system-item`, newItem);
      console.log('Response:', response.data.data);

      Alert.alert('Success', 'Item data has been submitted.');
      setItemName('');
      setQuantity('');
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Something went wrong while submitting.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add System Form</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Item Name:</Text>
        <Picker
          selectedValue={`${itemName}%${systemId}`} 
          onValueChange={(itemValue) => {
            console.log(itemValue);
                const data = itemValue.split('%');
                setItemName(data[0]);
                setSystemId(data[1])
            }}
          style={styles.input}
        >
          <Picker.Item label="Select Item" value="" />
          {items.map((item) => (
            <Picker.Item key={item._id} label={item?.systemName} value={item?.systemName+'%'+item?._id} />
          ))}
        </Picker>

        <Text style={styles.label}>Quantity:</Text>
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          style={styles.input}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#070604',
  },
  form: {
    padding: 15,
    backgroundColor: '#fbd33b',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#070604',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    color: '#070604',
  },
  button: {
    backgroundColor: '#070604',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fbd33b',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddSystemData;
