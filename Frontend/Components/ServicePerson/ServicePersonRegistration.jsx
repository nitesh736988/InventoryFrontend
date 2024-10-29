import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';

const ServicePersonRegistration = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const[createPassword, setCreatePassword] = useState()
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!name || !contact || !email) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    setLoading(true);
    const user = {
      name,
      contact,
      email,
      password: createPassword,
    };

    console.log('Registered User:', user);

    try {
      const response = await axios.post(`${API_URL}/user/service-person-signup`, user, { timeout: 2000 });
      console.log(response.data);
      if (response.status === 200) {
        Alert.alert('Registration Successful', 'You will be redirected to the login page.');
        navigation.navigate('LoginPage');
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Registration Failed", error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center'}}>
          <Image source={require('../../assets/galologo.png')} style={styles.image} resizeMode="contain" /> 
      </View>
      <View style={{ flex: 1, justifyContent: 'center', marginTop: -64 }}>
        <Text style={styles.title}>Service Person Registration</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Contact"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
          maxLength={10}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={createPassword}
          onChangeText={setCreatePassword}
          required
        />
        <TouchableOpacity title="Register" style={{ backgroundColor: 'black', padding: 16, borderRadius: 5 }} onPress={handleSubmit} disabled={loading}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Register</Text>  
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

  image: {
    height: 160,
    width: 170,
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
});

export default ServicePersonRegistration;
