import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  ActivityIndicator, 
  Text, 
  TextInput, 
  View, 
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  Pressable 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

axios.defaults.withCredentials = true;

const LoginPage = () => {
  const navigation = useNavigation();           
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true); // Initial loading for auth check
  const [formLoading, setFormLoading] = useState(false); // Loading for form submission
  const [showPassword, setShowPassword] = useState(true);

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        const storedId = await AsyncStorage.getItem('_id');
        
        if (storedRole && storedId) {
          // Navigate directly to the appropriate screen based on role
          navigateBasedOnRole(storedRole);
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const navigateBasedOnRole = (role) => {
    switch (role) {
      case 'serviceperson':
        navigation.replace('ServicePersonNavigation');
        break;
      case 'warehouseAdmin':
        navigation.replace('WarehouseNavigation');
        break;
      case 'admin':
        navigation.replace('Navigation');
        break;
      case 'surveyperson':
        navigation.replace('SurvayNavigation');
        break;
      default:
        break;
    }
  };

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

    setFormLoading(true);

    try {
      console.log(API_URL);
      const response = await axios.post(`${API_URL}/user/login`, { 
        email, 
        password, 
        role 
      });
      
      await AsyncStorage.setItem('role', role);

      if (role === 'serviceperson') {
        const { id, block, latitude, longitude, contact } = response.data;
        await AsyncStorage.multiSet([
          ["_id", id],
          ["block", JSON.stringify(block)],
          ["latitude", JSON.stringify(latitude)],
          ["longitude", JSON.stringify(longitude)],
          ["Contact", JSON.stringify(contact)]
        ]);

        console.log('Stored serviceperson data:', { id, block,});
      } else if (role === 'warehouseAdmin') {
        const { id, warehouse } = response.data;
        await AsyncStorage.multiSet([
          ["_id", id],
          ["warehouse", JSON.stringify(warehouse)]
        ]);
      } else if (role === 'surveyperson') {
        const { id, contact } = response.data;
        await AsyncStorage.multiSet([
          ["_id", id],
          ["Contact", JSON.stringify(contact)]
        ]);
      }

      await AsyncStorage.setItem('pendingComplaints', JSON.stringify([]));
      navigateBasedOnRole(role);
      
    } catch (error) {
      handleLoginError(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleLoginError = (error) => {
    let errorMessage = 'An unexpected error occurred.';
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'Incorrect credentials. Please try again.';
          break;
        case 403:
          errorMessage = 'You are not authorized to access this role.';
          break;
        case 500:
          errorMessage = 'There is an issue with the server. Please try again later.';
          break;
        default:
          errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.request) {
      errorMessage = 'Please check your internet connection.';
    }
    
    Alert.alert('Login Failed', errorMessage);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#070604" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.projectName}>Inventory System</Text>
      <Text style={styles.title}>Login</Text>
      
      <View style={styles.inputView}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
          enabled={!formLoading}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Warehouse Admin" value="warehouseAdmin" />
          <Picker.Item label="ServicePerson" value="serviceperson" />
          <Picker.Item label="Survey" value="surveyperson" />
        </Picker>

        {role !== '' && (
          <>
            <View style={styles.inputWithIcon}>
              <Icon name="email" size={20} color="black" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="EMAIL"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCorrect={false}
                autoCapitalize="none"
                editable={!formLoading}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWithIcon}>
              <Icon name="lock" size={20} color="black" style={styles.icon} />
              <TextInput
                style={styles.passwordInput}
                placeholder="PASSWORD"
                placeholderTextColor="#666"
                secureTextEntry={showPassword}
                value={password}
                onChangeText={setPassword}
                autoCorrect={false}
                autoCapitalize="none"
                editable={!formLoading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={showPassword ? 'visibility-off' : 'visibility'} 
                  size={20} 
                  color="black" 
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <View style={styles.buttonView}>
        <Pressable 
          style={[styles.button, formLoading && styles.buttonDisabled]} 
          onPress={handleSubmit} 
          disabled={formLoading}
        >
          {formLoading ? (
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
  loadingContainer: {
    justifyContent: 'center',
    paddingTop: 0,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#070604',
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: 'white',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'black',
    height: '100%',
  },
  passwordInput: {
    flex: 1,
    color: 'black',
    height: '100%',
  },
  eyeIcon: {
    padding: 5,
  },
  picker: {
    height: 50,
    borderColor: '#070604',
    borderWidth: 1,
    borderRadius: 7,
    color: 'black',
    backgroundColor: 'white',
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginPage;

