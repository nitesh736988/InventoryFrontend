import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera} from 'react-native-image-picker';
import {useForm, Controller} from 'react-hook-form';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'We need access to your camera to take pictures',
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
};

const requestLocationPermission = async () => {
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
};

const InstallationForm = ({route}) => {
  const {
    installationId,
    farmerName,
    farmerContact,
    farmerSaralId,
  } = route.params;

  const {control, handleSubmit, setValue} = useForm();
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState({});
  const navigation = useNavigation();
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filesNameList = [
    'borePhoto',
    // 'challanPhoto',
    // 'landDocPhoto',
    // 'sprinklerPhoto',
    'boreFarmerPhoto',
    'finalFoundationFarmerPhoto',
    'panelFarmerPhoto',
    'controllerBoxFarmerPhoto',
    'waterDischargeFarmerPhoto',
  ];

  const fileLabels = {
    borePhoto: 'Bore Photo',
    // challanPhoto: 'Challan Photo',
    // landDocPhoto: 'Land Document Photo',
    // sprinklerPhoto: 'Sprinkler Photo',
    boreFarmerPhoto: 'Bore Farmer Photo',
    finalFoundationFarmerPhoto: 'Final Foundation Farmer Photo',
    panelFarmerPhoto: 'Panel Farmer Photo',
    controllerBoxFarmerPhoto: 'Controller Box Farmer Photo',
    waterDischargeFarmerPhoto: 'Water Discharge Farmer Photo',
  };

  useEffect(() => {
    const initialize = async () => {
      if (Platform.OS === 'android') {
        const locationGranted = await requestLocationPermission();
        if (locationGranted) {
          Geolocation.getCurrentPosition(
            position => {
              setLongitude(position.coords.longitude.toString());
              setLatitude(position.coords.latitude.toString());
              setValue('longitude', position.coords.longitude.toString());
              setValue('latitude', position.coords.latitude.toString());
            },
            error => {
              console.log('Error getting location:', error.message);
              Alert.alert('Error', 'Unable to fetch location.');
            },
          );
        }
      }

      // Initialize photos object with empty arrays for each category
      const initialPhotos = {};
      filesNameList.forEach(category => {
        initialPhotos[category] = [];
      });
      setPhotos(initialPhotos);

      setLoading(false);
    };

    initialize();
  }, []);

  const openGeneralCamera = async category => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.8,
        includeBase64: false,
      },
      async response => {
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
            const newPhoto = {
              uri: resizedImage.uri,
              type: originalPhoto.type || 'image/jpeg',
              name: `photo_${Date.now()}.jpg`,
            };

            setPhotos(prevPhotos => ({
              ...prevPhotos,
              [category]: [...prevPhotos[category], newPhoto],
            }));

          } catch (error) {
            console.log('Error processing image:', error.message);
            Alert.alert('Error', 'Failed to process the image.');
          }
        }
      },
    );
  };

  const handleImageRemove = (category, uri) => {
    setPhotos(prevPhotos => ({
      ...prevPhotos,
      [category]: prevPhotos[category].filter(photo => photo.uri !== uri),
    }));
  };

  const onSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const serviceId = await AsyncStorage.getItem('_id');
      if (!serviceId) {
        throw new Error('Service ID not found');
      }

      const formData = new FormData();
      
      // Add all required fields to formData
      formData.append('farmerSaralId', farmerSaralId);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('installationId', installationId);
      formData.append('servicePersonId', serviceId);

      // Add all photos to formData
      filesNameList.forEach(category => {
        photos[category].forEach((photo, index) => {
          formData.append(`${category}`, {
            uri: photo.uri,
            type: photo.type,
            name: photo.name || `photo_${category}_${index}.jpg`,
          });
        });
      });

      console.log('Submitting form data:', formData);

      const response = await axios.post(
        'http://88.222.214.93:5000/service-person/new-system-installation',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response data', response.data);

      if (response.status === 200) {
        Alert.alert('Success', 'Form submitted successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.log(
        'Error submitting form:',
        error.response?.data || error.message
      );
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to submit form'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Installation Details</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Farmer Name:</Text>
          <Text style={styles.value}>{farmerName || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Farmer Contact:</Text>
          <Text style={styles.value}>{farmerContact?.toString() || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Saral Id:</Text>
          <Text style={styles.value}>{farmerSaralId || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{longitude || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{latitude || 'N/A'}</Text>
        </View>
      </View>

      {filesNameList.map(category => (
        <View key={category} style={styles.fileContainer}>
          <Text style={styles.label}>{fileLabels[category]}</Text>

          <TouchableOpacity
            onPress={() => openGeneralCamera(category)}
            style={styles.imageButton}>
            <MaterialIcon name="camera-plus" size={28} color="#000" />
            <Text style={styles.title}>Camera</Text>
          </TouchableOpacity>

          <ScrollView horizontal style={styles.imagePreviewContainer}>
            {photos[category]?.map((photo, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{uri: photo.uri}} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.cutButton}
                  onPress={() => handleImageRemove(category, photo.uri)}>
                  <Text style={styles.cutButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      ))}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={styles.submitButton}
        disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fbd33b'},
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  fileContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  title: {
    marginLeft: 8,
    fontSize: 16,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  cutButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    marginVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd33b',
  },
});

export default InstallationForm;