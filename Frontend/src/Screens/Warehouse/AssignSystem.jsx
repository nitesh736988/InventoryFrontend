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
import {API_URL} from '@env';

const AssignSystem = () => {
  const [servicePerson, setServicePerson] = useState('');
  const [servicePersons, setServicePersons] = useState([]);  
     
  useEffect(() => {
    const fetchServicePersons = async () => {
      try {
        const response = await axios.get('${API_URL}/service-team/all-service-persons');
        console.log("Service persons data", response.data.data);
        const persons = response.data.data.map((person) => ({
          _id: person._id,
          name: person.name,
        }));
        setServicePersons(persons);
      } catch (error) {
        Alert.alert('Error', JSON.stringify(error.response.data?.message));
      }
    };

    fetchServicePersons(); 
  }, []);

  const handleSubmit = async () => {
    if (!servicePerson || !serialNumber || !remark) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    const newAssignment = {
      servicePerson,
      serialNumber,
      remark,
      createdAt: new Date(),
    };
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Assign System</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Service Person:</Text>
        <Picker
          selectedValue={servicePerson}
          onValueChange={(itemValue) => setServicePerson(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Service Person" value="" />
          {servicePersons.map((person) => (
            <Picker.Item key={person._id} label={person.name} value={person.name} />
          ))}
        </Picker>


        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Assign System</Text>
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
    fontSize: 20,
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
  textArea: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    fontSize: 14,
    color: '#070604',
    marginBottom: 15,
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

export default AssignSystem;
