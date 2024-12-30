import React, {useState} from 'react';
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

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!itemName.trim()) {
      Alert.alert('Error', 'Item Name cannot be empty or just spaces.');
      return;
    }

    const itemData = { itemName: itemName.trim() };
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/admin/add-item`, {
        items: [itemData],
      });
      Alert.alert('Success', 'Item added successfully!');
      setItemName('');
    } catch (error) {
      console.error('Error adding item:', error);
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name:</Text>
      <TextInput
        style={styles.input}
        value={itemName}
        onChangeText={setItemName}
        placeholder="Enter item name"
        placeholderTextColor="#999"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Add Item</Text>
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
  label: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  input: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
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
  },
});

export default AddItem;
