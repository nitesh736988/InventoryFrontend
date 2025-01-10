// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   Image,
//   Platform,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { launchCamera } from 'react-native-image-picker';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Geolocation from '@react-native-community/geolocation';
// import { PermissionsAndroid } from 'react-native';

// const requestCameraPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.CAMERA,
//       {
//         title: 'Camera Permission',
//         message: 'We need access to your camera to take pictures',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       }
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
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
//       }
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };

// const ShowComplaintData = ({ route }) => {
//   const {
//     complaintId,
//     farmerName,
//     farmerContact,
//     fatherOrHusbandName,
//     pump_type,
//     HP,
//     AC_DC,
//     longitude2,
//     latitude2
//   } = route.params;

//   const [installationData, setInstallationData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [stageOptions, setStageOptions] = useState([]);
//   const [selectedStage, setSelectedStage] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [showRemarks, setShowRemarks] = useState(false);
//   const [rmuNumber, setRmuNumber] = useState('');
//   const [controllerNumber, setControllerNumber] = useState('');
//   const [simNumber, setSimNumber] = useState('');
//   const [photos, setPhotos] = useState([]);
//   const navigation = useNavigation();
//   const [longitude, setLongitude] = useState('');
//   const [latitude, setLatitude] = useState('');

//   // function getDistance(lat1, lon1, lat2, lon2) {
//   //   const toRadians = (degrees) => degrees * (Math.PI / 180);

//   //   const R = 6371;
//   //   const dLat = toRadians(lat2 - lat1);
//   //   const dLon = toRadians(lon2 - lon1);

//   //   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//   //             Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
//   //             Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   //   const distance = R * c * 1000;
//   //   return distance;
//   // }

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
//             }
//           );
//         }
//       }

//       const serviceId = await AsyncStorage.getItem('_id');
//       try {
//         const response = await axios.get(
//           `http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`
//         );
//         setInstallationData(response.data.data);

//         const stageResponse = await axios.get(
//           `http://88.222.214.93:8001/filedService/showStage`
//         );
//         setStageOptions(stageResponse.data?.stages || []);
//       } catch (error) {
//         console.log('Error fetching data:', error.response?.data || error.message);
//         Alert.alert('Error', 'Unable to fetch data.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     initialize();
//   }, []);

//   const openCamera = async () => {
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
//       (response) => {
//         if (response.didCancel) {
//           console.log('User cancelled camera picker');
//         } else if (response.errorCode) {
//           console.error('Camera Error:', response.errorMessage);
//         } else if (response.assets && response.assets.length > 0) {
//           setPhotos((prevImages) => [...prevImages, response.assets[0]]);
//         }
//       }
//     );
//   };

//   const handleStageChange = (itemValue) => {
//     setSelectedStage(itemValue);
//     setShowRemarks(itemValue !== ''

//     );
//   };

//   const handleSubmit = async () => {
//     // const distanceBetween = (getDistance(latitude, longitude, latitude2, longitude2));
//     // console.log(distanceBetween);
//     // if(distanceBetween > 150){
//     //   Alert.alert('First Reach at your location');
//     //   return;
//     // }
//     // else{
//     //   // console.log()
//     //   Alert.alert('farmer Reached at Location');
//     // }
//     const serviceId = await AsyncStorage.getItem('_id');
//     if (!selectedStage) {
//       Alert.alert('Error', 'Please select a stage.');
//       return;
//     }

//     if (showRemarks && !remarks.trim()) {
//       Alert.alert('Error', 'Remarks are required.');
//       return;
//     }

//     if (photos.length === 0) {
//       Alert.alert('Validation Error', 'Please add at least one image.');
//       return;
//     }

//     const photosBase64 = photos.map((photo) =>
//       photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null
//     ).filter(Boolean);

//     const requestData = {
//       fieldEmpID: serviceId,
//       complaintId,
//       stageId: selectedStage,
//       remarks,
//       rmuNumber,
//       controllerNumber,
//       simNumber,
//       photos: photosBase64,
//       longitude,
//       latitude,
//     };

//     try {
//       setLoading(true);
//       const response = await axios.put(
//         `http://88.222.214.93:8001/filedService/complaintUpdate`,
//         requestData
//       );

//       if (response.status === 200) {
//         Alert.alert('Success', 'Form submitted successfully!');
//         navigation.goBack();
//       }
//     } catch (error) {
//       console.log('Error submitting form:', error.response?.data || error.message);
//       Alert.alert('Error', 'Failed to submit form.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (!installationData) {
//     return (
//       <View style={styles.loaderContainer}>
//         <Text style={styles.errorText}>Unable to load complaint data.</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Complaint Details</Text>

//       <Text style={styles.label}>Farmer Name:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={farmerName}
//         editable={false}
//       />

//       <Text style={styles.label}>Farmer Contact:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={farmerContact?.toString()}
//         keyboardType="phone-pad"
//         editable={false}
//       />

//       <Text style={styles.label}>Father/Husband Name:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={fatherOrHusbandName}
//         editable={false}
//       />

//       <Text style={styles.label}>Pump Type:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={pump_type}
//         editable={false}
//       />

//       <Text style={styles.label}>HP:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={HP}
//         editable={false}
//       />

//       <Text style={styles.label}>AC/DC:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={AC_DC}
//         editable={false}
//       />

//       <Text style={styles.label}>Longitude:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={longitude?.toString()}
//         editable={false}
//       />

//       <Text style={styles.label}>Latitude:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={latitude?.toString()}
//         editable={false}
//       />

//       <Text style={styles.label}>RMU Number:</Text>
//       <TextInput
//         style={styles.input}
//         value={rmuNumber}
//         onChangeText={setRmuNumber}
//         placeholder="Enter RMU Number"
//       />

//       <Text style={styles.label}>Controller Number:</Text>
//       <TextInput
//         style={styles.input}
//         value={controllerNumber}
//         onChangeText={setControllerNumber}
//         placeholder="Enter Controller Number"
//       />

//       <Text style={styles.label}>SIM Number:</Text>
//       <TextInput
//         style={styles.input}
//         value={simNumber}
//         onChangeText={setSimNumber}
//         placeholder="Enter SIM Number"
//         keyboardType="numeric"
//       />

//       <Text style={styles.label}>Images:</Text>
//       <TouchableOpacity onPress={openCamera} style={styles.imageButton}>
//         <Icon name="camera-plus" size={28} color="#000" />
//       </TouchableOpacity>

//       <ScrollView horizontal style={styles.imagePreviewContainer}>
//         {photos.map((photo, index) => (
//           <Image key={index} source={{ uri: photo.uri }} style={styles.imagePreview} />
//         ))}
//       </ScrollView>

//       <Text style={styles.label}>Status:</Text>
//       <View style={styles.pickerContainer}>
//         <Picker selectedValue={selectedStage} onValueChange={handleStageChange}>
//           <Picker.Item label="Select a Status" value="" />
//           {stageOptions.map(({ _id, stage }) => (
//             <Picker.Item key={_id} label={stage} value={_id} />
//           ))}
//         </Picker>
//       </View>

//       {showRemarks && (
//         <>
//           <Text style={styles.label}>Remarks:</Text>
//           <TextInput
//             style={styles.inputBox}
//             value={remarks}
//             onChangeText={setRemarks}
//             placeholder="Enter remarks"
//             multiline={true}
//             numberOfLines={4}
//           />
//         </>
//       )}

//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Submit</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.submitButton}
//         onPress={() => navigation.goBack()}
//       >
//         <Text style={styles.buttonText}>Close</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fbd33b' },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//     color: 'black',
//   },
//   label: { fontSize: 16, marginBottom: 4, color: 'black' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 8,
//     padding: 8,
//     fontSize: 16,
//     marginBottom: 12,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   inputBox: {
//     height: 120,
//     borderColor: '#000',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 8,
//     textAlignVertical: 'top',
//     fontSize: 16,
//   },
//   submitButton: {
//     backgroundColor: '#070604',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 10,
//   },
//   buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
//   nonEditable: { backgroundColor: '#e9ecef', color: '#6c757d' },
//   loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
//   imagePreviewContainer: { flexDirection: 'row', marginVertical: 10 },
//   imagePreview: { width: 100, height: 100, marginRight: 10, borderRadius: 8 },
//   imageButton: { marginBottom: 10 },
// });

// export default ShowComplaintData;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

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

const ShowComplaintData = ({route}) => {
  const {
    complaintId,
    farmerName,
    farmerContact,
    fatherOrHusbandName,
    pump_type,
    HP,
    AC_DC,
  } = route.params;

  const [installationData, setInstallationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stageOptions, setStageOptions] = useState([]);
  const [selectedStage, setSelectedStage] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showRemarks, setShowRemarks] = useState(false);
  const [rmuNumber, setRmuNumber] = useState('');
  const [controllerNumber, setControllerNumber] = useState('');
  const [simNumber, setSimNumber] = useState('');
  const [simPhotos, setSimPhotos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

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
        }
      }

      const serviceId = await AsyncStorage.getItem('_id');
      try {
        const response = await axios.get(
          `http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`,
        );
        setInstallationData(response.data.data);

        const stageResponse = await axios.get(
          `http://88.222.214.93:8001/filedService/showStage`,
        );
        setStageOptions(stageResponse.data?.stages || []);
      } catch (error) {
        console.log(
          'Error fetching data:',
          error.response?.data || error.message,
        );
        Alert.alert('Error', 'Unable to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const openCamera = async () => {
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
              800, // New width
              800, // New height
              'JPEG', // Format
              80, // Quality (0-100)
              0, // Rotation
              null, // Output path
            );

            // Get the file size in bytes
            const fileStats = await RNFS.stat(resizedImage.uri);
            const fileSizeInKB = (fileStats.size / 1024).toFixed(2); // Convert bytes to KB

            console.log(`Resized image size: ${fileSizeInKB} KB`);

            // Add the resized image to the state
            const resizedPhoto = {
              ...originalPhoto,
              uri: resizedImage.uri,
              base64: resizedImage.base64 || originalPhoto.base64,
            };
            setSimPhotos([resizedPhoto]);
          } catch (error) {
            console.log('Error resizing image:', error.message);
            Alert.alert('Error', 'Failed to resize the image.');
          }
        }
      },
    );
  };

  const openGeneralCamera = async () => {
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
              800, // New width
              800, // New height
              'JPEG', // Format
              80, // Quality (0-100)
              0, // Rotation
              null, // Output path
            );

            // Get the file size in bytes
            const fileStats = await RNFS.stat(resizedImage.uri);
            const fileSizeInKB = (fileStats.size / 1024).toFixed(2); // Convert bytes to KB

            console.log(`Resized image size: ${fileSizeInKB} KB`);

            // Add the resized image to the photos state
            const resizedPhoto = {
              ...originalPhoto,
              uri: resizedImage.uri,
              base64: resizedImage.base64 || originalPhoto.base64,
            };
            setPhotos(prevImages => [...prevImages, resizedPhoto]);
          } catch (error) {
            console.log('Error resizing image:', error.message);
            Alert.alert('Error', 'Failed to resize the image.');
          }
        }
      },
    );
  };

  const handleStageChange = itemValue => {
    setSelectedStage(itemValue);
    setShowRemarks(itemValue !== '');
  };

  const handleSubmit = async () => {
    const serviceId = await AsyncStorage.getItem('_id');

    if (!selectedStage) {
      Alert.alert('Error', 'Please select a stage.');
      return;
    }

    if (showRemarks && !remarks.trim()) {
      Alert.alert('Error', 'Remarks are required.');
      return;
    }

    if (!rmuNumber.trim()) {
      Alert.alert('Error', 'RMU Number is required.');
      return;
    }

    if (!simNumber.trim()) {
      Alert.alert('Error', 'SIM Number is required.');
      return;
    }

    if (photos.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one image.');
      return;
    }

    const simPhotosBase64 = simPhotos
      .map(photo =>
        photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null,
      )
      .filter(Boolean);

    const photosBase64 = photos
      .map(photo =>
        photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null,
      )
      .filter(Boolean);
    const requestData = {
      fieldEmpID: serviceId,
      complaintId,
      stageId: selectedStage,
      remarks,
      rmuNumber,
      controllerNumber,
      simNumber,
      simPhotos: simPhotosBase64,
      photos: photosBase64,
      longitude,
      latitude,
    };

    console.log(requestData);

    try {
      setLoading(true);

      const response = await axios.put(
        `http://88.222.214.93:8001/filedService/complaintUpdate`,
        requestData,
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Form submitted successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.log(
        'Error submitting form:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Failed to submit form.');
    } finally {
      setLoading(false);
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

  if (!installationData) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Unable to load complaint data.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Complaint Details</Text>

      <Text style={styles.label}>Farmer Name:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={farmerName}
        editable={false}
      />

      <Text style={styles.label}>Farmer Contact:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={farmerContact?.toString()}
        keyboardType="phone-pad"
        editable={false}
      />

      <Text style={styles.label}>Father/Husband Name:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={fatherOrHusbandName}
        editable={false}
      />

      <Text style={styles.label}>Pump Type:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={pump_type}
        editable={false}
      />

      <Text style={styles.label}>HP:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={HP}
        editable={false}
      />

      <Text style={styles.label}>AC/DC:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={AC_DC}
        editable={false}
      />

      <Text style={styles.label}>Longitude:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={longitude?.toString()}
        editable={false}
      />

      <Text style={styles.label}>Latitude:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={latitude?.toString()}
        editable={false}
      />

      <Text style={styles.label}>RMU Number:</Text>
      <TextInput
        style={styles.input}
        value={rmuNumber}
        onChangeText={setRmuNumber}
        placeholder="Enter RMU Number"
      />

      <Text style={styles.label}>Controller Number:</Text>
      <TextInput
        style={styles.input}
        value={controllerNumber}
        onChangeText={setControllerNumber}
        placeholder="Enter Controller Number"
      />

      <Text style={styles.label}>SIM Number:</Text>
      <TextInput
        style={styles.input}
        value={simNumber}
        onChangeText={setSimNumber}
        placeholder="Enter SIM Number"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Sim Photo:</Text>
      <TouchableOpacity onPress={openCamera} style={styles.imageButton}>
        <Icon name="camera-plus" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView horizontal style={styles.imagePreviewContainer}>
          <View style={styles.imageWrapper}>
            { simPhotos.length !== 0 && <Image source={{uri: simPhotos[0]?.uri}} style={styles.imagePreview} />}
          </View>
      </ScrollView>

      <Text style={styles.label}>Images:</Text>
      <TouchableOpacity onPress={openGeneralCamera} style={styles.imageButton}>
        <Icon name="camera-plus" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView horizontal style={styles.imagePreviewContainer}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{uri: photo.uri}} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                const updatedPhotos = photos.filter((_, i) => i !== index);
                setPhotos(updatedPhotos);
              }}>
              <Icon name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.label}>Status:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedStage} onValueChange={handleStageChange}>
          <Picker.Item label="Select a Status" value="" />
          {stageOptions.map(({_id, stage}) => (
            <Picker.Item key={_id} label={stage} value={_id} />
          ))}
        </Picker>
      </View>

      {showRemarks && (
        <>
          <Text style={styles.label}>Remarks:</Text>
          <TextInput
            style={styles.inputBox}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter remarks"
            multiline={true}
            numberOfLines={4}
            placeholderTextColor={'#000'}
          />
        </>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Close</Text>
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
  label: {fontSize: 16, marginBottom: 4, color: 'black'},
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 12,
  },

  imageWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 2,
    elevation: 3,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    marginBottom: 12,
  },
  inputBox: {
    height: 120,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    textAlignVertical: 'top',
    padding: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  imageButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 50,
  },
  imagePreviewContainer: {flexDirection: 'row', marginBottom: 16},
  imagePreview: {width: 100, height: 100, marginRight: 8, borderRadius: 8},
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 16},
  loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  errorText: {fontSize: 16, color: 'red'},

  nonEditable: {backgroundColor: '#e9ecef', color: '#000'},
});

export default ShowComplaintData;
