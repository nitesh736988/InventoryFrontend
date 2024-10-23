import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const LogoutPage = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.replace('LoginPage'); 
      Alert.alert('Success', 'You have been logged out.');
    } catch (error) {
      console.log('Error during logout:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd33b',
  },
  button: {
    backgroundColor: '#070604',
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fbd33b',
    fontSize: 16,
  },
});

export default LogoutPage;
