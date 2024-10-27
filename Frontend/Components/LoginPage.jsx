import React, { useState } from 'react';
import { Alert, ActivityIndicator, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [ showPassword, setShowPassword ] = useState(true);


  const handleSubmit = async () => {
  if (!email || !password || !userType) {
    Alert.alert("Error", "Please fill out all fields including selecting a role");
    return;
  }

  setLoading(true); 
  console.log(email + " " + password + " " + userType);

  try {
    const response = await axios.post(`${API_URL}/user/login`, { email, password, userType }, { timeout: 2000 });
    
    if (response.status === 200) {
      console.log(userType);
      if (userType === 'ServicePerson') {
        navigation.navigate('ServicePersonNavigation');
      } else {
        navigation.navigate('Navigation');  
      }
    }
  } catch (error) {
    console.log(error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Alert.alert("Login Failed", "Incorrect credentials. Please try again.");
          break;
        case 500:
          Alert.alert("Server Error", "There is an issue with the server. Please try again later.");
          break;
        default:
          Alert.alert("Login Failed", error.response.data?.message || "An error occurred.");
      }
    } else if (error.request) {
      Alert.alert("Network Error", "Please check your internet connection.");
    } else {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/galologo.png')} style={styles.image} resizeMode="contain" />
      <Text style={styles.projectName}>Inventory System</Text>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputView}>
        <Picker
          selectedValue={userType}
          style={styles.picker}
          onValueChange={(itemValue) => setUserType(itemValue)}
        >
          <Picker.Item label="Select Role" value="" />
          {/* <Picker.Item label="Admin" value="Admin" /> */}
          <Picker.Item label="Warehouse" value="Warehouse" />
          <Picker.Item label="Service Person" value="ServicePerson" />
        </Picker>
        {userType !== "" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="EMAIL"
              value={email}
              onChangeText={setEmail}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <View style={{ width: '100%', borderRadius: 5, backgroundColor: '#fbd33b', borderColor: '#070604', borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12 }}> 
              <TextInput
                style={{ color: 'black', width: '90%'}}
                placeholder="PASSWORD"
                secureTextEntry={showPassword}
                value={password}
                onChangeText={setPassword}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ color: 'black' }}>{showPassword?'Show':'Hide'}</Text>
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
    borderColorn: 'red',
    // borderWidth: 1
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: -10,
    color: '#070604',
  },
  image: {
    height: 160,
    width: 170,
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
    borderColor: '#070604',
    borderWidth: 1,
    borderRadius: 7,
    color: 'black'
  },
  picker: {
    height: 50,
    borderColor: '#070604',
    borderWidth: 1,
    borderRadius: 7, 
    color: 'black',
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
  registrationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerBtnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  buttonclick: {
    color: '#070604',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: 'black',
  },
});

export default LoginPage;


