import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const ItemStockUpdate = ({ route }) => {
  const { itemName } = route.params; // Extract the itemName passed via route
  const [updatedQuantity, setUpdatedQuantity] = useState(''); // State to hold the updated quantity
  const [loading, setLoading] = useState(false); // Loading state for the button

  // Function to handle stock update submission
  const handleSubmit = async () => {
    // Validation: Ensure the updatedQuantity field is not empty
    if (!updatedQuantity) {
      Alert.alert('Error', 'Please fill in the stock field.');
      return;
    }

    // Convert updatedQuantity to an integer and validate it
    const quantityValue = parseInt(updatedQuantity);
    if (isNaN(quantityValue) || quantityValue < 0) {
      Alert.alert('Error', 'Stock must be a positive integer.');
      return;
    }

    // Construct the payload for the API
    const payload = {
      itemName,
      updatedQuantity: quantityValue,
    };

    setLoading(true); // Show loading indicator while the request is in progress
    console.log(payload);

    try {
      // Make an API call to update the item stock
      const response = await axios.put(
        `${API_URL}/warehouse-admin/update-item-quantity`,
        payload
      );

      // Log and show success message on successful update
      console.log('Response:', response.data);
      Alert.alert('Success', 'Stock updated successfully!');
      setUpdatedQuantity(''); // Clear the input field
    } catch (error) {
      // Log and display error message
      console.log('Error updating stock:', error);
      if (error.response && error.response.data) {
        Alert.alert(
          'Error',
          error.response.data.message || 'An error occurred.'
        );
      } else {
        Alert.alert(
          'Error',
          'An unexpected error occurred. Please try again.'
        );
      }
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Stock for {itemName}</Text>

      <Text style={styles.label}>Updated Quantity:</Text>
      <TextInput
        style={styles.input}
        value={updatedQuantity}
        onChangeText={setUpdatedQuantity}
        keyboardType="numeric"
        placeholder="Enter updated quantity"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Update Stock</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: 'black',
  },
  button: {
    backgroundColor: '#070604',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ItemStockUpdate;
