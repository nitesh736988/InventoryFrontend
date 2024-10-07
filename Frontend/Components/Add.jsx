import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const Add = () => {
  const [formData, setFormData] = useState({ name: '', quantity: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  // Handle input change
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission for Add/Edit
  const handleSubmit = () => {
    if (isEditMode) {
      Alert.alert('Edit Item', `Name: ${formData.name}, Quantity: ${formData.quantity}`);
      // Handle edit logic here
    } else {
      Alert.alert('Add Item', `Name: ${formData.name}, Quantity: ${formData.quantity}`);
      // Handle add logic here
    }
    // Clear form
    setFormData({ name: '', quantity: '' });
    setIsEditMode(false);
  };

  // Toggle to Edit Mode (can be triggered by external events)
  const handleEdit = () => {
    setIsEditMode(true);
    setFormData({ name: 'Example Item', quantity: '10' }); // Example values, replace with real data to edit
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditMode ? 'Edit Item' : 'Add Item'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(value) => handleChange('name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={formData.quantity}
        onChangeText={(value) => handleChange('quantity', value)}
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        <Button title={isEditMode ? 'Save Changes' : 'Add Item'} onPress={handleSubmit} />
        {isEditMode && (
          <View style={styles.editButton}>
            <Button title="Cancel Edit" onPress={() => setIsEditMode(false)} color="red" />
          </View>
        )}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },
  editButton: {
    marginTop: 10,
  },
});

export default Add;
