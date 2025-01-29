// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   ActivityIndicator,
//   PermissionsAndroid,
//   Platform,
//   TextInput
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import axios from 'axios';
// import { launchCamera } from 'react-native-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ImageResizer from 'react-native-image-resizer';
// import Geolocation from '@react-native-community/geolocation';

// const requestCameraPermission = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         {
//           title: 'Camera Permission',
//           message: 'This app needs access to your camera to take photos.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       Alert.alert('Error', 'Failed to request camera permission.');
//       return false;
//     }
//   }
//   return true;
// };

// const requestLocationPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//         title: 'Location Permission',
//         message: 'We need access to your location to fetch coordinates',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };

// const SurveyData = ({ route }) => {
//   const { farmerId } = route.params;

//   const [images, setImages] = useState({
//     consentLetter: [],
//     consentWithFarmer: [],
//     landDoc: [],
//     challan: [],
//     aadharFront: [],
//     aadharBack: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const [longitude, setLongitude] = useState('');
//   const [latitude, setLatitude] = useState('');

//   useEffect(() => {
//     const initialize = async () => {
//       if (Platform.OS === 'android') {
//         const locationGranted = await requestLocationPermission();
//         if (locationGranted) {
//           Geolocation.getCurrentPosition(
//             position => {
//               setLongitude(position.coords.longitude);
//               setLatitude(position.coords.latitude);
//             },
//             error => {
//               console.log('Error getting location:', error.message);
//               Alert.alert('Error', 'Unable to fetch location.');
//             },
//           );
//         } else {
//           Alert.alert('Permission Denied', 'Location permission is required.');
//         }
//       }
//     };

//     initialize();
//   }, []);
//   const handleImageUpload = async (field) => {
//     const hasPermission = await requestCameraPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission Denied', 'Camera access is required.');
//       return;
//     }

//     launchCamera(
//       {
//         mediaType: 'photo',
//         cameraType: 'back',
//         quality: 1,
//         includeBase64: true,
//       },
//       async (response) => {
//         if (response.didCancel) {
//           console.log('User cancelled camera picker');
//         } else if (response.errorCode) {
//           console.log('Camera Error:', response.errorMessage);
//         } else if (response.assets && response.assets.length > 0) {
//           try {
//             const originalPhoto = response.assets[0];
//             const resizedImage = await ImageResizer.createResizedImage(
//               originalPhoto.uri,
//               800,
//               800,
//               'JPEG',
//               80,
//               0,
//               null
//             );

//             const resizedPhoto = {
//               ...originalPhoto,
//               uri: resizedImage.uri,
//               base64: resizedImage.base64 || originalPhoto.base64,
//             };

//             setImages((prevState) => ({
//               ...prevState,
//               [field]: [...prevState[field], resizedPhoto],
//             }));
//           } catch (error) {
//             console.log('Error resizing image:', error.message);
//             Alert.alert('Error', 'Failed to resize the image.');
//           }
//         }
//       }
//     );
//   };

//   const handleFormSubmit = async () => {
//     const serviceId = await AsyncStorage.getItem('_id');
//     const fields = Object.keys(images);
//     const incompleteFields = fields.filter((field) => images[field].length === 0);

//     if (incompleteFields.length > 0) {
//       Alert.alert(
//         'Error',
//         `Please upload images for: ${incompleteFields.join(', ')}`
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       const userId = await AsyncStorage.getItem('_id');
//       if (!userId) {
//         Alert.alert('Error', 'User ID is missing.');
//         return;
//       }

//       const imagesBase64 = {};
//       fields.forEach((field) => {
//         imagesBase64[field] = images[field]
//           .map((photo) =>
//             photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null
//           )
//           .filter(Boolean);
//       });

//       const formData = {
//         fieldEmpId: serviceId,
//         farmerId,
//         // submitDate: new Date().toISOString(),
//         consentLetter: imagesBase64.consentLetter,
//         consentWithFarmer: imagesBase64.consentWithFarmer,
//         landDoc: imagesBase64.landDoc,
//         challan: imagesBase64.challan,
//         aadharFront: imagesBase64.aadharFront,
//         aadharBack: imagesBase64.aadharBack,
//         longitude,
//         latitude,
//       };

//       console.log("form data", formData)

//       const serviceId = await AsyncStorage.getItem('_id');

//       const response = await axios.post(
//         'http://88.222.214.93:8001/filedService/addInstallationSurvey',
//         formData
//       );
//       Alert.alert('Success', 'Data submitted successfully!');
//     } catch (error) {
//       console.log('Error submitting form:', JSON.stringify(error.response));
//       Alert.alert('Error', 'Failed to submit data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderImageSection = (field, label) => (
//     <View>
//       <Text style={styles.label}>{label}:</Text>
//       <TouchableOpacity
//         onPress={() => handleImageUpload(field)}
//         style={styles.imageButton}>
//         <Icon name="camera-plus" size={28} color="#000" />
//       </TouchableOpacity>
//       <ScrollView horizontal style={styles.imagePreviewContainer}>
//         {images[field].map((photo, index) => (
//           <View key={index} style={styles.imageWrapper}>
//             <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
//             <TouchableOpacity
//               style={styles.deleteButton}
//               onPress={() => {
//                 setImages((prevState) => ({
//                   ...prevState,
//                   [field]: prevState[field].filter((_, i) => i !== index),
//                 }));
//               }}>
//               <Icon name="close-circle" size={24} color="red" />
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Text style={styles.header}>Survey</Text>

//         {renderImageSection('consentLetter', 'Consent Letter')}
//         {renderImageSection('consentWithFarmer', 'Consent with Farmer')}
//         {renderImageSection('landDoc', 'Land Document')}
//         {renderImageSection('challan', 'Challan')}
//         {renderImageSection('aadharFront', 'Aadhar Front')}
//         {renderImageSection('aadharBack', 'Aadhar Back')}

//         <Text style={styles.label}>Longitude:</Text>
//         <TextInput
//           style={[styles.input, styles.nonEditable]}
//           value={longitude?.toString() || 'N/A'}
//           editable={false}
//         />

//         <Text style={styles.label}>Latitude:</Text>
//         <TextInput
//           style={[styles.input, styles.nonEditable]}
//           value={latitude?.toString() || 'N/A'}
//           editable={false}
//         />

//         <TouchableOpacity
//           onPress={handleFormSubmit}
//           style={styles.submitButton}
//           disabled={loading}>
//           {loading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Submit Data</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     paddingVertical: 20,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fbd33b',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     marginTop: 20,
//     color: 'black',
//   },
//   imageButton: {
//     marginBottom: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'grey',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//     elevation: 5,
//   },
//   imagePreviewContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   imageWrapper: {
//     marginRight: 10,
//     position: 'relative',
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     borderRadius: 5,
//   },
//   deleteButton: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     backgroundColor: 'white',
//     borderRadius: 15,
//   },
//   submitButton: {
//     backgroundColor: '#000',
//     paddingVertical: 15,
//     paddingHorizontal: 25,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 5,
//     opacity: 1,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//     color: '#000',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 8,
//     padding: 8,
//     fontSize: 16,
//     marginBottom: 12,
//     color: '#000',
//   },
//   nonEditable: {
//     backgroundColor: '#f1f1f1',
//   },
// });

// export default SurveyData;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from 'react-native-image-resizer';
import Geolocation from '@react-native-community/geolocation';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      Alert.alert('Error', 'Failed to request camera permission.');
      return false;
    }
  }
  return true;
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

const Survey = ({route}) => {
  const {farmerId} = route.params;

  const [images, setImages] = useState({
    consentLetter: [],
    consentWithFarmer: [],
    landDoc: [],
    challan: [],
    aadharFront: [],
    aadharBack: [],
  });

  const [loading, setLoading] = useState(false);
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const initialize = async () => {
      if (Platform.OS === 'android') {
        const locationGranted = await requestLocationPermission();
        if (locationGranted) {
          Geolocation.getCurrentPosition(
            position => {
              setLongitude(position.coords.longitude);
              setLatitude(position.coords.latitude);
            },
            error => {
              console.log('Error getting location:', error.message);
              Alert.alert('Error', 'Unable to fetch location.');
            },
          );
        } else {
          Alert.alert('Permission Denied', 'Location permission is required.');
        }
      }
    };

    initialize();
  }, []);

  const handleImageUpload = async field => {
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

            const resizedPhoto = {
              ...originalPhoto,
              uri: resizedImage.uri,
              base64: resizedImage.base64 || originalPhoto.base64,
            };

            setImages(prevState => ({
              ...prevState,
              [field]: [...prevState[field], resizedPhoto],
            }));
          } catch (error) {
            console.log('Error resizing image:', error.message);
            Alert.alert('Error', 'Failed to resize the image.');
          }
        }
      },
    );
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const serviceId = await AsyncStorage.getItem('_id');

      if (!serviceId) {
        Alert.alert('Error', 'serviceId is missing.');
        return;
      }

      const fields = Object.keys(images);
      const incompleteFields = fields.filter(
        field => images[field].length === 0,
      );
      if (incompleteFields.length > 0) {
        Alert.alert(
          'Error',
          `Please upload images for: ${incompleteFields.join(', ')}`,
        );
        return;
      }

      // Prepare base64 images data
      const imagesBase64 = {};
      fields.forEach(field => {
        imagesBase64[field] = images[field]
          .map(photo =>
            photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null,
          )
          .filter(Boolean);
      });

      console.log('id', serviceId);
      const formData = {
        fieldEmpId: serviceId,
        farmerId,
        consentLetter: imagesBase64.consentLetter,
        consentWithFarmer: imagesBase64.consentWithFarmer,
        landDoc: imagesBase64.landDoc,
        challan: imagesBase64.challan,
        aadharFront: imagesBase64.aadharFront,
        aadharBack: imagesBase64.aadharBack,
        longitude,
        latitude,
      };
      const response = await axios.post(
        'http://88.222.214.93:8001/filedService/addInstallationSurvey',
        formData,
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Data submitted successfully!');
        navigation.goBack();
        setImages({
          consentLetter: [],
          consentWithFarmer: [],
          landDoc: [],
          challan: [],
          aadharFront: [],
          aadharBack: [],
        });
        setLongitude('');
        setLatitude('');
      } else {
        Alert.alert('Error', 'Failed to submit data.');
      }
    } catch (error) {
      console.log('Error submitting form:', error);
      Alert.alert('Error', 'Failed to submit data.');
    } finally {
      setLoading(false);
    }
  };

  const renderImageSection = (field, label) => (
    <View>
      <Text style={styles.label}>{label}:</Text>
      <TouchableOpacity
        onPress={() => handleImageUpload(field)}
        style={styles.imageButton}>
        <Icon name="camera-plus" size={28} color="#000" />
      </TouchableOpacity>
      <ScrollView horizontal style={styles.imagePreviewContainer}>
        {images[field].map((photo, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{uri: photo.uri}} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                setImages(prevState => ({
                  ...prevState,
                  [field]: prevState[field].filter((_, i) => i !== index),
                }));
              }}>
              <Icon name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Survey Data</Text>

        {renderImageSection('consentLetter', 'Consent Letter')}
        {renderImageSection('consentWithFarmer', 'Consent with Farmer')}
        {renderImageSection('landDoc', 'Land Document')}
        {renderImageSection('challan', 'Challan')}
        {renderImageSection('aadharFront', 'Aadhar Front')}
        {renderImageSection('aadharBack', 'Aadhar Back')}

        <Text style={styles.label}>Longitude:</Text>
        <TextInput
          style={[styles.input, styles.nonEditable]}
          value={longitude?.toString() || 'N/A'}
          editable={false}
        />

        <Text style={styles.label}>Latitude:</Text>
        <TextInput
          style={[styles.input, styles.nonEditable]}
          value={latitude?.toString() || 'N/A'}
          editable={false}
        />

        <TouchableOpacity
          onPress={handleFormSubmit}
          style={styles.submitButton}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Data</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: 'black',
  },
  imageButton: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  imageWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000',
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
  nonEditable: {
    backgroundColor: '#f1f1f1',
  },
});

export default Survey;
