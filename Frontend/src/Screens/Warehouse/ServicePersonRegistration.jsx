import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import Icon from 'react-native-vector-icons/Feather';

const ServicePersonRegistration = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    longitude: '',
    latitude: '',
    block: '',
    district: '',
    state: '',
    createdAt: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const { name, email, contact, password,longitude,latitude } = formData;
    const createdAt = new Date().toISOString();

    if (!name || !email || !contact || !password) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/warehouse-admin/service-person-signup`,
        { name, email, contact, password,longitude, latitude, createdAt }
      );
      Alert.alert('Registration Successful');
      setFormData({
        name: '',
        email: '',
        contact: '',
        password: '',
        longitude: '',
        latitude: '',
        block: '',
        district: '',
        state: '',
        createdAt: new Date(),
      });
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.card}>
          <Text style={styles.title}>Service Person Registration</Text>

          <Text style={styles.label}>
            Name
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholderTextColor={'#000'}
          />

          <Text style={styles.label}>
            Contact
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Contact"
            value={formData.contact}
            onChangeText={(value) => handleChange('contact', value)}
            keyboardType="phone-pad"
            maxLength={10}
            placeholderTextColor={'#000'}
          />

<Text style={styles.label}>
            Email
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            placeholderTextColor={'#000'}
          />

          <Text style={styles.label}>
            Password
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { paddingRight: 40 }]}
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry={!passwordVisible}
              placeholderTextColor={'#000'}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon
                name={passwordVisible ? 'eye' : 'eye-off'}
                size={24}
                color="#4B4B4B"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            Working Block
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Working Block"
            value={formData.block}
            onChangeText={(value) => handleChange('block', value)}
            keyboardType="phone-pad"
            maxLength={10}
            placeholderTextColor={'#000'}
          />

          <Text style={styles.label}>
            Working District
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Working District"
            value={formData.district}
            onChangeText={(value) => handleChange('district', value)}
            keyboardType="phone-pad"
            maxLength={10}
            placeholderTextColor={'#000'}
          />

          <Text style={styles.label}>
            State
          </Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            value={formData.state}
            onChangeText={(value) => handleChange('district', value)}
            keyboardType="phone-pad"
            maxLength={10}
            placeholderTextColor={'#000'}
          />

          <Text style={styles.label}>
          Longitude
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            value={formData.longitude}
            onChangeText={(value) => handleChange('longitude', value)}
            keyboardType="phone-pad"
            placeholderTextColor={'#000'}
          />

          <Text style={styles.label}>
          Latitude
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={formData.latitude}
            onChangeText={(value) => handleChange('latitude', value)}
            keyboardType="phone-pad"
            placeholderTextColor={'#000'}
          />

          

          <TouchableOpacity
            style={[styles.button, { backgroundColor: loading ? '#aaa' : '#070604' }]}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6C700',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: '#FFD95C',
    borderRadius: 12,
    padding: 20,
    elevation: 5, 
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderColor: '#F7A600',
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#070604',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#070604',
  },

  input: {
    height: 50,
    borderColor: '#F7A600', 
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF9E3', 
    color: '#070604', 
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  button: {
    padding: 16,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ServicePersonRegistration;

