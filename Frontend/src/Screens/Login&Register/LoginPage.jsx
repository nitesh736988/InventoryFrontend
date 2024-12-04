import React, { useState } from 'react';
import { Alert, ActivityIndicator, Text, TextInput, View, SafeAreaView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

axios.defaults.withCredentials = true;

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!email || !password || !role) {
      Alert.alert('Error', 'Please fill out all fields, including selecting a role.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      console.log(API_URL);
      console.log(email,password,role)
      const response = await axios.post(`${API_URL}/user/login`,{ email, password, role});
        Alert.alert('Success', 'Login successful!');
        if (role === 'serviceperson') {
          navigation.navigate('ServicePersonNavigation');
        } else if (role === 'warehouseAdmin') {
          navigation.navigate('WarehouseNavigation');
        } else if (role === 'admin') {
          navigation.navigate('Navigation');
        }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            Alert.alert('Login Failed', 'Incorrect credentials. Please try again.');
            break;
          case 500:
            Alert.alert('Server Error', 'There is an issue with the server. Please try again later.');
            break;
          default:
            Alert.alert('Login Failed', error.response.data?.message || 'An error occurred.');
        }
      } else if (error.request) {
        Alert.alert('Network Error', 'Please check your internet connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.projectName}>Inventory System</Text>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputView}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
          enabled={!loading}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Warehouse Admin" value="warehouseAdmin" />
          <Picker.Item label="ServicePerson" value="serviceperson" />
        </Picker>
        {role !== '' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="EMAIL"
              value={email}
              onChangeText={setEmail}
              autoCorrect={false}
              autoCapitalize="none"
              editable={!loading}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="PASSWORD"
                secureTextEntry={showPassword}
                value={password}
                onChangeText={setPassword}
                autoCorrect={false}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="black" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fbd33b',
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: -10,
    color: '#070604',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingVertical: 40,
    color: '#070604',
  },
  inputView: {
    gap: 15,
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 5,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 7,
    color: 'black',
  },
  picker: {
    height: 50,
    borderColor: '#070604',
    borderWidth: 1,
    borderRadius: 7,
    color: 'black',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbd33b',
    borderColor: '#070604',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
  },
  passwordInput: {
    color: 'black',
    width: '90%',
  },
  buttonView: {
    width: '100%',
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#070604',
    height: 45,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginPage;




