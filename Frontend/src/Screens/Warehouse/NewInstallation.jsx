import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NewInstallation = () => {
  const navigation = useNavigation();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your location to fetch coordinates',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const [formData, setFormData] = useState({
    farmerName: '',
    farmerContact: '',
    farmerVillage: '',
    farmerState: '',
    farmerBlock: '',
    pumpNumber: '',
    controllerNumber: '',
    rmuNumber: '',
    latitude: '',
    longitude: '',
    borephotos: '',
    challanphotos: '',
    landdocument: '',
    sprinklerphotos: '',
    foundationphotos: '',
    photographwithpanel: '',
    photographwithcontroller: '',
    photographwithwaterdischarge: '',
  });

  const [page, setPage] = useState(1);
  const [images, setImages] = useState({
    borephotos: [],
    challanphotos: [],
    landdocument: [],
    sprinklerphotos: [],
    foundationphotos: [],
    photographwithpanel: [],
    photographwithcontroller: [],
    photographwithwaterdischarge: [],
  });

  const handleNext = () => {
    if (page < 5) setPage(page + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const openGeneralCamera = async (field) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 1,
        includeBase64: true,
      },
      async (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera picker');
        } else if (response.errorCode) {
          console.log('Camera Error:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          try {
            const originalPhoto = response.assets[0];
            const resizedImage = await ImageResizer.createResizedImage(
              originalPhoto.uri,
              800,
              800,
              'JPEG',
              80,
              0,
              null,
            );

            const fileStats = await RNFS.stat(resizedImage.uri);
            const fileSizeInKB = (fileStats.size / 1024).toFixed(2);

            console.log(`Resized image size: ${fileSizeInKB} KB`);

            const resizedPhoto = {
              ...originalPhoto,
              uri: resizedImage.uri,
              base64: resizedImage.base64 || originalPhoto.base64,
            };

            setImages((prevState) => ({
              ...prevState,
              [field]: [...prevState[field], resizedPhoto],
            }));
          } catch (error) {
            console.error('Error resizing image:', error.message);
            Alert.alert('Error', 'Failed to resize the image.');
          }
        }
      },
    );
  };

  useEffect(() => {
    const initialize = async () => {
      const locationGranted = await requestLocationPermission();
      if (locationGranted) {
        Geolocation.getCurrentPosition(
          (position) => {
            setFormData((prevData) => ({
              ...prevData,
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
            }));
          },
          (error) => {
            console.log('Error getting location:', error.message);
            Alert.alert('Error', 'Unable to fetch location.');
          },
        );
      }
    };
    initialize();
  }, []);

  const handleSubmit = () => {
    Alert.alert('Form Submitted', 'Installation details have been saved.');
  };

  const renderPage = () => {
    switch (page) {
      case 1:
        return (
          <View style={styles.container}>
            <Text style={styles.heading}>New Installation</Text>

            <Text style={styles.sectionTitle}>Farmer Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Farmer Name"
              value={formData.farmerName}
              onChangeText={(value) => handleInputChange('farmerName', value)}
            />

            <Text style={styles.sectionTitle}>Farmer Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Farmer Contact"
              keyboardType="phone-pad"
              value={formData.farmerContact}
              onChangeText={(value) => handleInputChange('farmerContact', value)}
            />

            <Text style={styles.sectionTitle}>Farmer Village</Text>
            <TextInput
              style={styles.input}
              placeholder="Farmer Village"
              value={formData.farmerVillage}
              onChangeText={(value) => handleInputChange('farmerVillage', value)}
            />

            <Text style={styles.sectionTitle}>Farmer State</Text>
            <TextInput
              style={styles.input}
              placeholder="Farmer State"
              value={formData.farmerState}
              onChangeText={(value) => handleInputChange('farmerState', value)}
            />

            <Text style={styles.sectionTitle}>Farmer Block</Text>
            <TextInput
              style={styles.input}
              placeholder="Farmer Block"
              value={formData.farmerBlock}
              onChangeText={(value) => handleInputChange('farmerBlock', value)}
            />

            <Text style={styles.sectionTitle}>Pump Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Pump Number"
              value={formData.pumpNumber}
              onChangeText={(value) => handleInputChange('pumpNumber', value)}
            />

            <Text style={styles.sectionTitle}>Controller Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Controller Number"
              value={formData.controllerNumber}
              onChangeText={(value) => handleInputChange('controllerNumber', value)}
            />

            <Text style={styles.sectionTitle}>RMU Number</Text>
            <TextInput
              style={styles.input}
              placeholder="RMU Number"
              value={formData.rmuNumber}
              onChangeText={(value) => handleInputChange('rmuNumber', value)}
            />

            <Button title="Next" onPress={handleNext} />
          </View>
        );
      case 2:
        return (
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Latitude</Text>
            <TextInput
              style={[styles.input, styles.readOnly]}
              placeholder="Latitude"
              value={formData.latitude}
              editable={false}
            />

            <Text style={styles.sectionTitle}>Longitude</Text>
            <TextInput
              style={[styles.input, styles.readOnly]}
              placeholder="Longitude"
              value={formData.longitude}
              editable={false}
            />

            {['borephotos', 'challanphotos', 'landdocument', 'sprinklerphotos'].map((field, index) => (
              <View key={index}>
                <Text style={styles.sectionTitle}>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</Text>
                <TouchableOpacity
                  onPress={() => openGeneralCamera(field)}
                  style={styles.imageButton}>
                  <Icon name="camera-plus" size={28} color="#000" />
                </TouchableOpacity>
                <ScrollView horizontal style={styles.imagePreviewContainer}>
                  {images[field].map((photo, i) => (
                    <View key={i} style={styles.imageWrapper}>
                      <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                          setImages((prevState) => ({
                            ...prevState,
                            [field]: prevState[field].filter((_, j) => j !== i),
                          }));
                        }}>
                        <Icon name="close-circle" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ))}

            <Button title="Previous" onPress={handlePrevious} />
            <Button title="Next" onPress={handleNext} />
          </View>
        );
      case 3:
        return (
          <View style={styles.container}>
            {['foundationphotos', 'photographwithpanel', 'photographwithcontroller', 'photographwithwaterdischarge'].map(
              (field, index) => (
                <View key={index}>
                  <Text style={styles.sectionTitle}>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</Text>
                  <TouchableOpacity
                    onPress={() => openGeneralCamera(field)}
                    style={styles.imageButton}>
                    <Icon name="camera-plus" size={28} color="#000" />
                  </TouchableOpacity>
                  <ScrollView horizontal style={styles.imagePreviewContainer}>
                    {images[field].map((photo, i) => (
                      <View key={i} style={styles.imageWrapper}>
                        <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => {
                            setImages((prevState) => ({
                              ...prevState,
                              [field]: prevState[field].filter((_, j) => j !== i),
                            }));
                          }}>
                          <Icon name="close-circle" size={24} color="red" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              ),
            )}

            <Button title="Previous" onPress={handlePrevious} />
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        );
      default:
        return null;
    }
  };

  return <>{renderPage()}</>;
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fbd33b' },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 12,
    color: '#000',
  },
  readOnly: {
    backgroundColor: '#e9ecef',
    color: '#000',
  },
  imageButton: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    padding: 5,
  },
});

export default NewInstallation;
