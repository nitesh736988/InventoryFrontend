import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, Button} from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { Picker } from '@react-native-picker/picker';


const Stockdata = ({ route }) => {
  const { itemId, itemName } = route.params;
  const [loading, setLoading] = useState(true);
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [formData, setFormData] = useState({
    itemComingFrom: '',
    quantity: '',
    defectiveItem: '',
    arrivedDate: new Date(),
  });
  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(`${API_URL}/warehouse-admin/get-warehouse`);
      if (response.data.success) {
        setAllWarehouses(response.data.warehouseName);
      } else {
        setAllWarehouses([]);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setAllWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.itemComingFrom) return 'Item coming from is required.';
    if (!formData.quantity || isNaN(formData.quantity)) return 'Quantity must be a valid number.';
    if (!formData.defectiveItem || isNaN(formData.defectiveItem)) return 'Defective item count must be a valid number.';
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/warehouse-admin/add-incoming-item`, 
        {itemName, ...formData,warehouse: allWarehouses});
      setFormData({
        itemComingFrom: '',
        quantity: '',
        defectiveItem: '',
        arrivedDate: new Date(),
      });
      Alert.alert('Success', 'Item added successfully!');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add item.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Item: {itemName}</Text>
      <Text>Warehouse:</Text>
      <Picker
        selectedValue={selectedWarehouse}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedWarehouse(itemValue)}
      >
          <Picker.Item  label={allWarehouses} value={allWarehouses} />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Item Coming From"
        value={formData.itemComingFrom}
        onChangeText={value => handleChange('itemComingFrom', value)}
        keyboardType="text"
      />

      <TextInput
        style={styles.input}
        placeholder="Defective Items"
        value={formData.defectiveItem}
        onChangeText={value => handleChange('defectiveItem', value)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={formData.quantity}
        onChangeText={value => handleChange('quantity', value)}
        keyboardType="numeric"
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default Stockdata;
