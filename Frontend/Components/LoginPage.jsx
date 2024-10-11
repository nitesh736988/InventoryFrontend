import React, { useState } from 'react';
import { Alert, ActivityIndicator, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [ showSideMenu, setShowSideMenu ] = useState(true);

  const handleSubmit = async () => {
    if (!email || !password || !userType) {
      Alert.alert("Error", "Please fill out all fields including selecting a role");
      return;
    }
    
    setLoading(true); 
    console.log(email + " " + password + " " + userType);
    
    try {
      const response = await axios.post('http://192.168.68.114:8080/user/login', { email, password, userType }, {timeout: 2000});
      if (response.status === 200) {
       if(userType !== 'Admin'){
          setShowSideMenu(true);
       }
        navigation.navigate('Navigation', { showSideMenu });
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Login Failed", JSON.stringify(error.request));
    } finally {
      setLoading(false); 
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Project Name Header */}
  
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
          <Picker.Item label="Admin" value="Admin" />
          <Picker.Item label="Warehouse" value="Warehouse" />
          <Picker.Item label="Service Person" value="ServicePerson" />
        </Picker>

        {/* Conditionally render the input fields based on userType */}
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
            <TextInput
              style={styles.input}
              placeholder="PASSWORD"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCorrect={false}
              autoCapitalize="none"
            />
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
    paddingTop: 70,
    backgroundColor: '#fbd33b',
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  },
  picker: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: '#070604',
    borderWidth: 1,
    borderRadius: 7, 
  },
  buttonView: {
    width: '100%',
    paddingHorizontal: 50,
    
  },
  button: {
    backgroundColor: '#070604',
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
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
