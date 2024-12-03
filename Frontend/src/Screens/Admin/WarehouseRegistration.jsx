import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '@env';

const WarehouseRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    warehouse: '',
    contact: '',
    password: '',
    createdAt: new Date(),
  });
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/all-warehouses`);
        console.log('API Response:', response.data);

        if (response.data.success) {
          setWarehouseOptions(response.data.allWarehouses);
        } else {
          console.log('No warehouse data found:', response.data);
          setWarehouseOptions([]);
        }
      } catch (error) {
        console.log('Failed to fetch warehouse names:', error.response);
        setWarehouseOptions([]);
      }
    };

    fetchWarehouses();
  }, []);


  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const { name, email, contact, password, warehouse } = formData;
    const createdAt = new Date();

    if (!name || !email || !contact || !password || !warehouse) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/admin/warehouse-person-signup`,
        { name, email, contact, password, warehouse, createdAt });

      if (response.status === 200) {
        Alert.alert('Registration Successful');

        setFormData({
          name: '',
          email: '',
          warehouse: '',
          contact: '',
          password: '',
          createdAt: new Date(),
        });
        const warehouseResponse = await axios.get(`${API_URL}/admin/all-warehouses`);
        if (warehouseResponse.data.success) {
          setWarehouseOptions(warehouseResponse.data.allWarehouses);
        }
      }
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', marginTop: -64 }}>
        <Text style={styles.title}>Warehouse Person Registration</Text>

        <Text style={styles.label}>
          Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
        />

        <Text style={styles.label}>
          Contact <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Contact"
          value={formData.contact}
          onChangeText={(value) => handleChange('contact', value)}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <Text style={styles.label}>
          Warehouse <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={formData.warehouse}
          onValueChange={(value) => handleChange('warehouse', value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Warehouse" value="" />
          {warehouseOptions.length > 0 ? (
            warehouseOptions.map((warehouse, index) => (
              <Picker.Item
                key={index}
                label={warehouse.warehouseName}
                value={warehouse.warehouseName}
              />
            ))
          ) : (
            <Picker.Item label="No warehouses available" value="" />
          )}
        </Picker>

        <Text style={styles.label}>
          Email <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
        />

        <Text style={styles.label}>
          Password <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: loading ? '#aaa' : 'black' },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fbd33b',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#070604',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#070604',
  },
  required: {
    color: 'red',
    fontSize: 18,
  },
  picker: {
    height: 50,
    borderColor: '#070604',
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  input: {
    height: 50,
    borderColor: '#070604',
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button: {
    padding: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default WarehouseRegistration;
