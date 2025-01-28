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
  const [systemId, setSystemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/warehouse-admin/show-systems`);
        console.log('System data:', data.data);
        setItems(data.data);
      } catch (error) {
        console.error('Failed to fetch items:', error);
        Alert.alert('Error', 'Unable to fetch system items. Please try again later.');
      }
    };

    fetchItems();
  }, []);

  const handleSubmit = async () => {
    if (!systemId || !itemName || !quantity) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    const newItem = { systemId, itemName, quantity };
    console.log("send data", newItem)

    try {
      console.log('Submitting:', newItem);
      const { data } = await axios.post(`${API_URL}/warehouse-admin/add-system-item`, newItem);
      console.log('Response:', data.data);

      Alert.alert('Success', 'Item data has been submitted.');
    
      setItemName('');
      setSystemId('');
      setQuantity('');
    } catch (error) {
      console.log('Error submitting data:', error);
      Alert.alert('Error', JSON.stringify(Response.error.message));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add System Form</Text>

      <View style={styles.form}>
      
        <Text style={styles.label}>System ID:</Text>
        <Picker
          selectedValue={systemId}
          onValueChange={(itemValue) => setSystemId(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select System" value="" />
          {items.map((item) => (
            <Picker.Item key={item._id} label={item.systemName} value={item._id} />
          ))}
        </Picker>
        <Text style={styles.label}>Item Name:</Text>
        <TextInput
          value={itemName}
          onChangeText={setItemName}
          style={styles.input}
          placeholder="Enter item name"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Quantity:</Text>
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          style={styles.input}
          placeholder="Enter quantity"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
        />

        {/* Submit Button */}
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
    fontSize: 24,
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
