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
import api from '../../auth/api';;
import { API_URL } from '@env';

const AddSystemSubItem = () => {
  const [systemId, setSystemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [systems, setSystems] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const[subItemName, setSubItemName] = useState('');

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const { data } = await api.get(`${API_URL}/warehouse-admin/show-systems`);
        // console.log('Fetched Systems:', data.data);
    
        setSystems(data.data);

      } catch (error) {
        console.log('Error fetching systems:', error || error?.response?.data?.message || error?.message);
        Alert.alert('Error', error || error?.response?.data?.message || error?.message);
      }
    };

    fetchSystems();
  }, []);

  useEffect(() => {
    if (!systemId) return; 

    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        const { data } = await api.get(`${API_URL}/admin/show-system-item?systemId=${systemId}`);
        console.log('Fetched System Items:', data.data);
        setItems(data.data);
      } catch (error) {
        console.log('Error fetching systems:', error || error?.response?.data?.message || error?.message);
        Alert.alert('Error', error || error?.response?.data?.message || error?.message);
      }
      setLoadingItems(false);
    };

    fetchItems();
  }, [systemId]);

  const handleSubmit = async () => {
    if (!systemId || !itemName || !subItemName || !quantity) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
  
    const selectedItem = items.find((item) => item.itemName === itemName);
    if (!selectedItem) {
      Alert.alert('Error', 'Invalid item selection.');
      return;
    }
  
    const newItem = { systemId, itemId: selectedItem._id, subItemName, quantity: Number(quantity) };
    console.log('Submitting:', newItem);
  
    try {
      const { data } = await api.post(`${API_URL}/admin/add-subItem`, newItem);
      console.log('Response:', data);
  
      Alert.alert('Success', 'Item added successfully.');
  
      // Reset form only after successful submission
      setSystemId('');
      setItemName('');
      setSubItemName('');
      setQuantity('');
    } catch (error) {
      console.log('Error submitting data:', error);
      Alert.alert('Error', error.response?.data?.message || 'An error occurred.');
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add System Data</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Select System</Text>
        <Picker
          selectedValue={systemId}
          onValueChange={(value) => setSystemId(value)}
          style={styles.input}
        >
          <Picker.Item label="Select System" value="" />
          {systems.map((system) => (
            <Picker.Item key={system._id} label={system.systemName} value={system._id} />
          ))}
        </Picker>


        <Text style={styles.label}>Select Item</Text>
        {loadingItems ? (
          <Text style={styles.noItemText}>Loading items...</Text>
        ) : items.length > 0 ? (
          <Picker
            selectedValue={itemName}
            onValueChange={(value) => setItemName(value)}
            style={styles.input}
            enabled={items.length > 0}
          >
            <Picker.Item label="Select Item" value="" />
            {items.map((item) => (
              <Picker.Item key={item._id} label={item.itemName} value={item.itemName} />
            ))}
          </Picker>
        ) : (
          <Text style={styles.noItemText}>No items available</Text>
        )}

        <Text style={styles.label}>SubItem Name</Text>
        <TextInput
          value={subItemName}
          onChangeText={setSubItemName}
          style={styles.input}
          placeholder="Enter Sub Item Name"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Quantity</Text>
        <TextInput
          value={quantity}
        //   onChangeText={setQuantity}
        onChangeText={(text) => setQuantity(text.replace(/[^0-9]/g, ''))} 
          style={styles.input}
          placeholder="Enter quantity"
          placeholderTextColor="#aaa"
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
  noItemText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
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

export default AddSystemSubItem;
