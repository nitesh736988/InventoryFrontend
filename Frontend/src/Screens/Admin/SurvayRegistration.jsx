import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import api from '../../auth/api';;
import {API_URL} from '@env';

const SurveyRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    role: 'surveyperson',
    createdAt: new Date(),
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const {name, email, contact, password, role} = formData;
    const createdAt = new Date();

    if (!name || !email || !contact || !password || !role) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `${API_URL}/admin/survey-person-signup`,
        {name, email, contact, password, role, createdAt},
      );

      if (response.status === 200) {
        Alert.alert('Registration Successful');
        setFormData({
          name: '',
          email: '',
          contact: '',
          password: '',
          role: '',
          createdAt: new Date(),
        });
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error.response.data?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center', marginTop: -64}}>
        <Text style={styles.title}>Survey Person Registration</Text>

        <Text style={styles.label}>
          Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={value => handleChange('name', value)}
        />

        <Text style={styles.label}>
          Contact <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Contact"
          value={formData.contact}
          onChangeText={value => handleChange('contact', value)}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <Text style={styles.label}>
          Email <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={value => handleChange('email', value)}
          keyboardType="email-address"
        />

        <Text style={styles.label}>
          Password <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={value => handleChange('password', value)}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.button, {backgroundColor: loading ? '#aaa' : 'black'}]}
          onPress={handleSubmit}
          disabled={loading}>
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

export default SurveyRegistration;
