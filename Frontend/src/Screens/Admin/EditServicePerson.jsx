import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { API_URL } from '@env';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const EditServicePerson = ({ route }) => {
  const { _id, name, email, contact,block,district,state, longitude, latitude } = route.params;

  const [formData, setFormData] = useState({
    servicePersonId: _id,
    name,
    email,
    contact,
    block: '',
    district: '',
    state: '',
    longitude,
    latitude,
    updatedAt: new Date().toISOString(),
  });

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/admin/update-service-person`, formData);

      if (response.status === 200) {
        Alert.alert('Success', 'Service person updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update service person');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'An error occurred during the update.');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Update Service Person</Text>

      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={[styles.input]}
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <Text style={styles.label}>Contact:</Text>
      <TextInput
        style={[styles.input]}
        value={formData.contact?.toString()}
        keyboardType="phone-pad"
        onChangeText={(text) => handleInputChange('contact', text)}
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={formData.email}
        editable={false}
      />


      <Text style={styles.label}>Working Block:</Text>
      <TextInput
        style={[styles.input]}
        value={formData.block}
        onChangeText={(text) => handleInputChange('block', text)}
      />

     <Text style={styles.label}>District:</Text>
      <TextInput
        style={[styles.input]}
        value={formData.district}
        onChangeText={(text) => handleInputChange('district', text)}
      />

      <Text style={styles.label}>State:</Text>
      <TextInput
        style={[styles.input]}
        value={formData.state}
        onChangeText={(text) => handleInputChange('state', text)}
      />


      <Text style={styles.label}>Longitude:</Text>
      <TextInput
        style={[styles.input]}
        value={formData.longitude?.toString()}
        keyboardType="numeric"
        
        onChangeText={(text) => handleInputChange('longitude', text)}
      />

      <Text style={styles.label}>Latitude:</Text>
      <TextInput
        style={[styles.input]}                
        value={formData.latitude?.toString()}
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange('latitude', text)}
      />

      <TouchableOpacity 
        style={[styles.submitButton, loading && { backgroundColor: '#ccc' }]}
        onPress={handleSubmit}
        disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fbd33b' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  label: { fontSize: 16, marginBottom: 4, color: 'black' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#070604',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  nonEditable: { backgroundColor: '#f0f0f0' },
});

export default EditServicePerson;
