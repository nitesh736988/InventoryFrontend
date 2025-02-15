import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, Text, Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';

const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photo, setPhoto] = useState(null);

  // Check for locally stored data
  useEffect(() => {
    const getData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData !== null) {
          const parsedData = JSON.parse(savedData);
          setName(parsedData.name);
          setEmail(parsedData.email);
          setAddress(parsedData.address);
          setPhoneNumber(parsedData.phoneNumber);
          setPhoto(parsedData.photo);
        }
      } catch (error) {
        console.log('Error fetching data from storage', error);
      }
    };
    getData();
  }, []);

  const handleImageUpload = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  const handleSave = async () => {
    const userData = {
      name,
      email,
      address,
      phoneNumber,
      photo,
    };

    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      Alert.alert('Success', 'Your data has been saved locally.');
    } catch (error) {
      console.error('Error saving data to storage', error);
    }
  };

  const dummyApiUpload = userData => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true;
        if (success) {
          resolve('Data uploaded successfully');
        } else {
          reject('Failed to upload data');
        }
      }, 2000); // 2 seconds delay to mimic network call
    });
  };

  const handleUploadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userData');
      if (!savedData) {
        Alert.alert('No Data', 'There is no data to upload.');
        return;
      }
      const userData = JSON.parse(savedData);

      const response = await dummyApiUpload(userData);
      console.log(response);
      Alert.alert('Success', response);

      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Error', error);
    }
  };

  return (
    <View>
      <Text>Name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />

      <Text>Address:</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your address"
      />

      <Text>Phone Number:</Text>
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter your phone number"
      />

      <Button title="Upload Photo" onPress={handleImageUpload} />
      {photo && (
        <Image source={{uri: photo}} style={{width: 100, height: 100}} />
      )}

      <Button title="Save Data Locally" onPress={handleSave} />
      <Button title="Upload Data" onPress={handleUploadData} />
    </View>
  );
};

export default UserForm;
