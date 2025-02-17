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
import {API_URL} from '@env';

const ItemStockUpdate = ({route}) => {
  const {subItemId, itemName} = route.params;
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!updatedQuantity) {
      Alert.alert('Error', 'Please fill in the stock field.');
      return;
    }

    const quantityValue = parseInt(updatedQuantity);
    if (isNaN(quantityValue) || quantityValue < 0) {
      Alert.alert('Error', 'Stock must be a positive integer.');
      return;
    }

    const payload = {
      subItemId,
      updatedQuantity: quantityValue,
    };

    setLoading(true);
    console.log("SubItem Id", updatedQuantity);

    try {
      const response = await axios.put(
        `${API_URL}/warehouse-admin/update-subItem-quantity`,
        payload,
      );

      console.log('Response:', response.data);
      Alert.alert('Success', 'Stock updated successfully!');
      setUpdatedQuantity('');
    } catch (error) {
      console.log('Error updating stock:' , JSON.stringify(response.error));

      if (error.response && error.response.data) {
        Alert.alert(
          'Error',
          error.response.data.message || 'An error occurred.',
        );
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Update Stock</Text>
        )}
      </TouchableOpacity>
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
