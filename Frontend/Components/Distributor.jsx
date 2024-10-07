import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Picker } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; // For video upload

const Distributor = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    item: 'pump', // default item selection
    quantity: '',
    status: 'in', // default status
    video: null,
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Handle input change
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle video upload
  const handleVideoUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
      });
      if (result.type === 'success') {
        setFormData({
          ...formData,
          video: result.uri,
        });
        Alert.alert('Video Selected', result.name);
      }
    } catch (error) {
      console.log('Error picking video: ', error);
    }
  };

  // Handle form submission for Add/Edit
  const handleSubmit = () => {
    if (isEditMode) {
      Alert.alert('Edit Distributor', JSON.stringify(formData));
      // Handle edit logic here
    } else {
      Alert.alert('Add Distributor', JSON.stringify(formData));
      // Handle add logic here
    }
    // Clear form
    setFormData({
      name: '',
      contact: '',
      item: 'pump',
      quantity: '',
      status: 'in',
      video: null
    });
    setIsEditMode(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditMode ? 'Edit Distributor' : 'Add Distributor'}</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(value) => handleChange('name', value)}
      />

      {/* Contact Input */}
      <TextInput
        style={styles.input}
        placeholder="Contact"
        value={formData.contact}
        onChangeText={(value) => handleChange('contact', value)}
        keyboardType="phone-pad"
      />

      {/* Item Dropdown */}
      <Text style={styles.label}>Select Item:</Text>
      <Picker
        selectedValue={formData.item}
        onValueChange={(itemValue) => handleChange('item', itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Pump" value="pump" />
        <Picker.Item label="Motor" value="motor" />
        <Picker.Item label="Controller" value="controller" />
      </Picker>

      {/* Quantity Input */}
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={formData.quantity}
        onChangeText={(value) => handleChange('quantity', value)}
        keyboardType="numeric"
      />

      {/* Video Upload Button */}
      <Button title="Upload Video" onPress={handleVideoUpload} />
      {formData.video && <Text style={styles.uploadedText}>Video Uploaded</Text>}

      {/* Status Dropdown */}
      <Text style={styles.label}>Status:</Text>
      <Picker
        selectedValue={formData.status}
        onValueChange={(itemValue) => handleChange('status', itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="In" value="in" />
        <Picker.Item label="Out" value="out" />
      </Picker>

      {/* Add/Edit Buttons */}
      <View style={styles.buttonContainer}>
        <Button title={isEditMode ? 'Save Changes' : 'Add Distributor'} onPress={handleSubmit} />
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  uploadedText: {
    color: 'green',
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  editButton: {
    marginTop: 10,
  },
});

export default Distributor;
