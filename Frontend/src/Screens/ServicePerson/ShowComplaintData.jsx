// import React, {useState, useEffect} from 'react';
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
// import {useNavigation} from '@react-navigation/native';
// import axios from 'axios';
// import {Picker} from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {launchCamera} from 'react-native-image-picker';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Geolocation from '@react-native-community/geolocation';
// import {PermissionsAndroid} from 'react-native';
// import ImageResizer from 'react-native-image-resizer';
// import RNFS from 'react-native-fs';

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
//       },
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
//       },
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };

// const ShowComplaintData = ({route}) => {
//   const {
//     complaintId,
//     farmerName,
//     farmerContact,
//     saralId,
//     pump_type,
//     HP,
//     AC_DC,
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
//   const [simPhoto, setSimPhoto] = useState([]);
//   const [photos, setPhotos] = useState([]);
//   const navigation = useNavigation();
//   const [longitude, setLongitude] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [selected, setSelected] = useState(null);
//   const [ isPendingSelected, setPendingSelected ] = useState(false);

//   // useEffect(())

//   console.log(stageOptions)

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
//         }
//       }

//       const serviceId = await AsyncStorage.getItem('_id');
//       try {
//         const response = await axios.get(
//           `http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`,
//         );
//         setInstallationData(response.data.data);

//         const stageResponse = await axios.get(
//           `http://88.222.214.93:8001/filedService/showStage`,
//         );
//         setStageOptions(stageResponse.data?.stages || []);
//       } catch (error) {
//         console.log(
//           'Error fetching data:',
//           error.response?.data || error.message,
//         );
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
//       async response => {
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
//               null,
//             );

//             const fileStats = await RNFS.stat(resizedImage.uri);
//             const fileSizeInKB = (fileStats.size / 1024).toFixed(2);

//             console.log(`Resized image size: ${fileSizeInKB} KB`);

//             const resizedPhoto = {
//               ...originalPhoto,
//               uri: resizedImage.uri,
//               base64: resizedImage.base64 || originalPhoto.base64,
//             };
//             setSimPhoto([resizedPhoto]);
//           } catch (error) {
//             console.log('Error resizing image:', error.message);
//             Alert.alert('Error', 'Failed to resize the image.');
//           }
//         }
//       },
//     );
//   };

//   const openGeneralCamera = async () => {
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
//       async response => {
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
//               null,
//             );

//             const fileStats = await RNFS.stat(resizedImage.uri);
//             const fileSizeInKB = (fileStats.size / 1024).toFixed(2);

//             console.log(`Resized image size: ${fileSizeInKB} KB`);

//             const resizedPhoto = {
//               ...originalPhoto,
//               uri: resizedImage.uri,
//               base64: resizedImage.base64 || originalPhoto.base64,
//             };
//             setPhotos(prevImages => [...prevImages, resizedPhoto]);
//           } catch (error) {
//             console.log('Error resizing image:', error.message);
//             Alert.alert('Error', 'Failed to resize the image.');
//           }
//         }
//       },
//     );
//   };

//   const handleStageChange = itemValue => {
//     setSelectedStage(itemValue);
//     setShowRemarks(itemValue !== '');
//     if(itemValue === '675be30222ae6f63bf772dcf'){
//       setPendingSelected(true);
//     }
//     else{
//       setPendingSelected(false);
//     }
//   };

//   const handleSelection = option => {
//     setSelected(option);
//     if (option === 'Yes') {

//       navigation.navigate('InOrder', { id: complaintId, name: farmerName, farmerContact, saralId});
//     }
//   };

//   const handleSubmit = async () => {
//     const serviceId = await AsyncStorage.getItem('_id');

//     if (!simNumber.trim()) {
//       Alert.alert('Error', 'Please enter a SIM number.');
//       return;
//     }
//     if (!selectedStage) {
//       Alert.alert('Error', 'Please select a stage.');
//       return;
//     }

//     if (showRemarks && !remarks.trim()) {
//       Alert.alert('Error', 'Remarks are required.');
//       return;
//     }

//     if (!rmuNumber.trim()) {
//       Alert.alert('Error', 'RMU Number is required.');
//       return;
//     }

//     if (!simNumber.trim()) {
//       Alert.alert('Error', 'SIM Number is required.');
//       return;
//     }

//     if (photos.length === 0) {
//       Alert.alert('Validation Error', 'Please add at least one image.');
//       return;
//     }

//     const simPhotoBase64 = simPhoto
//       .map(photo =>
//         photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null,
//       )
//       .filter(Boolean);

//     const photosBase64 = photos
//       .map(photo =>
//         photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null,
//       )
//       .filter(Boolean);

//     const requestData = {
//       fieldEmpID: serviceId,
//       complaintId,
//       stageId: selectedStage,
//       remarks,
//       rmuNumber,
//       controllerNumber,
//       simNumber,
//       simPhoto: simPhotoBase64,
//       photos: photosBase64,
//       longitude,
//       latitude,
//     };
//     try {
//       setLoading(true);
//       const response = await axios.put(
//         `http://88.222.214.93:8001/filedService/complaintUpdate`,
//         requestData,
//       );

//       if (response.status === 200) {
//         Alert.alert('Success', 'Form submitted successfully!');
//         navigation.goBack();
//       }
//     } catch (error) {
//       console.log(
//         'Error submitting form:',
//         error.response?.data || error.message,
//       );
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

//       <View style={styles.card}>
//         <View style={styles.row}>
//           <Text style={styles.label}>Farmer Name:</Text>
//           <Text style={styles.value}>{farmerName || 'N/A'}</Text>
//         </View>

//         <View style={styles.row}>
//           <Text style={styles.label}>Farmer Contact:</Text>
//           <Text style={styles.value}>{farmerContact?.toString() || 'N/A'}</Text>
//         </View>

//         <View style={styles.row}>
//           <Text style={styles.label}>Saral Id:</Text>
//           <Text style={styles.value}>{saralId || 'N/A'}</Text>
//         </View>

//         <View style={styles.row}>
//           <Text style={styles.label}>Product Type:</Text>
//           <Text style={styles.value}>
//             {`${pump_type || 'N/A'} | ${HP || 'N/A'} | ${AC_DC || 'N/A'}`}
//           </Text>
//         </View>

//         <View style={styles.row}>
//           <Text style={styles.label}>Longitude:</Text>
//           <Text style={styles.value}>{longitude?.toString() || 'N/A'}</Text>
//         </View>

//         <View style={styles.row}>
//           <Text style={styles.label}>Latitude:</Text>
//           <Text style={styles.value}>{latitude?.toString() || 'N/A'}</Text>
//         </View>
//       </View>

//       <Text style={styles.label}>RMU Number:</Text>
//       <TextInput
//         style={styles.input}
//         value={rmuNumber}
//         onChangeText={setRmuNumber}
//         placeholder="Enter RMU Number"
//         placeholderTextColor={'#000'}
//       />

//       <Text style={styles.label}>Controller Number:</Text>
//       <TextInput
//         style={styles.input}
//         value={controllerNumber}
//         onChangeText={setControllerNumber}
//         placeholder="Enter Controller Number"
//         placeholderTextColor={'#000'}
//       />

//       <Text style={styles.label}>SIM Number:</Text>
//       <TextInput
//         style={styles.input}
//         value={simNumber}
//         onChangeText={setSimNumber}
//         placeholder="Enter SIM Number"
//         placeholderTextColor={'#000'}
//       />

//       <Text style={styles.label}>Sim Photo:</Text>
//       <TouchableOpacity onPress={openCamera} style={styles.imageButton}>
//         <Icon name="camera-plus" size={28} color="#000" />
//       </TouchableOpacity>

//       <ScrollView horizontal style={styles.imagePreviewContainer}>
//         <View style={styles.imageWrapper}>
//           {simPhoto.length !== 0 && (
//             <Image
//               source={{uri: simPhoto[0]?.uri}}
//               style={styles.imagePreview}
//             />
//           )}
//         </View>
//       </ScrollView>

//       <Text style={styles.label}>Images:</Text>
//       <TouchableOpacity onPress={openGeneralCamera} style={styles.imageButton}>
//         <Icon name="camera-plus" size={28} color="#000" />
//       </TouchableOpacity>

//       <ScrollView horizontal style={styles.imagePreviewContainer}>
//         {photos.map((photo, index) => (
//           <View key={index} style={styles.imageWrapper}>
//             <Image source={{uri: photo.uri}} style={styles.imagePreview} />
//             <TouchableOpacity
//               style={styles.deleteButton}
//               onPress={() => {
//                 const updatedPhotos = photos.filter((_, i) => i !== index);
//                 setPhotos(updatedPhotos);
//               }}>
//               <Icon name="close-circle" size={24} color="red" />
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>

//       <Text style={styles.label}>Status:</Text>
//       <View style={styles.pickerContainer}>
//         <Picker selectedValue={selectedStage} onValueChange={handleStageChange}>
//           <Picker.Item label="Select a Status" value="" />
//           {stageOptions.map(({_id, stage}) => (
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
//             placeholderTextColor={'#000'}
//           />
//         </>
//       )}

//       {isPendingSelected && <View style={styles.optionsContainer}>
//         <Text style={styles.label}>Collected Defective Material:</Text>
//         <TouchableOpacity
//           onPress={() => handleSelection('Yes')}
//           style={styles.option}>
//           <View
//             style={[styles.checkbox, selected === 'Yes' && styles.checkedBox]}
//           />
//           <Text style={styles.optionText}>Yes</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => handleSelection('No')}
//           style={styles.option}>
//           <View
//             style={[styles.checkbox, selected === 'No' && styles.checkedBox]}
//           />
//           <Text style={styles.optionText}>No</Text>
//         </TouchableOpacity>
//       </View>}

//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Submit</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 16, backgroundColor: '#fbd33b'},
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//     color: 'black',
//   },
//   label: {
//     fontSize: 18,
//     marginRight: 10,
//     fontWeight: 'bold',
// },
//   input: {
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 8,
//     padding: 8,
//     fontSize: 16,
//     marginBottom: 12,
//     color: '#000',
//   },

//   optionsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
// },
// option: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
// },
// checkbox: {
//     width: 20,
//     height: 20,
//     borderRadius: 5,
//     borderWidth: 2,
//     borderColor: '#007BFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 5,
// },
// checkedBox: {
//     backgroundColor: '#007BFF',
// },

// optionText: {
//   fontSize: 16,
// },

//   card: {
//     padding: 10,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     elevation: 3,
//     marginVertical: 5,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 4,
//   },
//   label: {
//     fontWeight: 'bold',
//     fontSize: 14,
//     color: '#333',
//   },
//   value: {
//     fontSize: 14,
//     color: '#555',
//   },

//   imageWrapper: {
//     position: 'relative',
//     marginRight: 8,
//   },
//   deleteButton: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     backgroundColor: '#fff',
//     borderRadius: 50,
//     padding: 2,
//     elevation: 3,
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
//     textAlignVertical: 'top',
//     padding: 8,
//     fontSize: 16,
//     marginBottom: 12,
//   },
//   imageButton: {
//     alignSelf: 'flex-start',
//     marginBottom: 12,
//     backgroundColor: '#f0f0f0',
//     padding: 8,
//     borderRadius: 50,
//   },
//   imagePreviewContainer: {flexDirection: 'row', marginBottom: 16},
//   imagePreview: {width: 100, height: 100, marginRight: 8, borderRadius: 8},
//   submitButton: {
//     backgroundColor: '#000',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 40,
//     alignItems: 'center',
//     marginTop: 30
//   },
//   buttonText: {color: '#fff', fontSize: 16},
//   loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   errorText: {fontSize: 16, color: 'red'},

//   nonEditable: {backgroundColor: '#e9ecef', color: '#000'},
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

const ShowComplaintData = ({route}) => {
  const {
    complaintId,
    farmerName,
    farmerContact,
    saralId,
    pump_type,
    HP,
    AC_DC,
    village,
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
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [selected, setSelected] = useState(null);
  const [isPendingSelected, setPendingSelected] = useState(false);
  const [farmerItemRemarks, setFarmerItemRemarks] = useState('');
  const [isButtonHidden, setIsButtonHidden] = useState(false);

  const filesNameList = [
    'finalFoundation',
    'panelPhoto',
    'photoWithWater',
    'photoWithController',
    'simPhoto', // Add SIM photo category
  ];

  const fileLabels = {
    finalFoundation: 'Final Foundation Image With Farmer',
    panelPhoto: 'Photograph With Panel + Structure',
    photoWithWater: 'Photograph With Water Discharge',
    photoWithController: 'Photograph with Controller',
    simPhoto: 'SIM Photo',
  };

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
        console.log('Installation Data:', response.data.data);

        const stageResponse = await axios.get(
          `http://88.222.214.93:8001/filedService/showStage`,
        );
        setStageOptions(stageResponse.data?.stages || []);
        console.log('Stage Options:', stageResponse.data?.stages);
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
              uri: resizedImage.uri,
              base64: resizedImage.base64 || originalPhoto.base64,
              type: originalPhoto.type,
              category, // Add the category to identify the photo type
            };

            setPhotos(prevPhotos => [...prevPhotos, resizedPhoto]);
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
    if (itemValue === '675be30222ae6f63bf772dcf') {
      setPendingSelected(true);
    } else {
      setPendingSelected(false);
    }
  };

  const handleSelection = option => {
    setSelected(option);

    if (option === 'Yes') {
      navigation.navigate('InOrder', {
        id: complaintId,
        name: farmerName,
        farmerContact,
        saralId,
        farmerName,
        village
      });
    } else {
      setFarmerItemRemarks(true);
    }
  };

  const handleSubmit = async () => {
    const serviceId = await AsyncStorage.getItem('_id');

    if (!selectedStage) {
      Alert.alert('Error', 'Please select a stage.');
      setIsButtonHidden(false);
      return;
    }

    if (showRemarks && !remarks.trim()) {
      Alert.alert('Error', 'Remarks are required.');
      setIsButtonHidden(false);
      return;
    }

    if (!rmuNumber.trim()) {
      Alert.alert('Error', 'RMU Number is required.');
      setIsButtonHidden(false);
      return;
    }

    if (!simNumber.trim()) {
      Alert.alert('Error', 'SIM Number is required.');
      setIsButtonHidden(false);
      return;
    }

    // Group photos by category and convert to base64
    const groupedPhotos = photos.reduce((acc, photo) => {
      if (!acc[photo.category]) {
        acc[photo.category] = [];
      }
      acc[photo.category].push(`data:${photo.type};base64,${photo.base64}`);
      return acc;
    }, {});

    const requestData = {
      fieldEmpID: serviceId,
      complaintId,
      stageId: selectedStage,
      remarks,
      rmuNumber,
      controllerNumber,
      simNumber,
      simPhoto: groupedPhotos.simPhoto || [],
      finalFoundation: groupedPhotos.finalFoundation || [],
      panelPhoto: groupedPhotos.panelPhoto || [],
      photoWithWater: groupedPhotos.photoWithWater || [],
      photoWithController: groupedPhotos.photoWithController || [],
      longitude,
      latitude,
      farmerItemRemarks,
    };

    console.log('Request Data:', requestData);

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
      Alert.alert("Error", JSON.stringify(error.response.data?.message));
      
      setIsButtonHidden(false);
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
          <Text style={styles.value}>{saralId || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Product Type:</Text>
          <Text style={styles.value}>
            {`${pump_type || 'N/A'} | ${HP || 'N/A'} | ${AC_DC || 'N/A'}`}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{longitude?.toString() || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{latitude?.toString() || 'N/A'}</Text>
        </View>
      </View>

      <Text style={styles.label}>RMU Number:</Text>
      <TextInput
        style={styles.input}
        value={rmuNumber}
        onChangeText={setRmuNumber}
        placeholder="Enter RMU Number"
        placeholderTextColor={'#000'}
      />

      <Text style={styles.label}>Controller Number:</Text>
      <TextInput
        style={styles.input}
        value={controllerNumber}
        onChangeText={setControllerNumber}
        placeholder="Enter Controller Number"
        placeholderTextColor={'#000'}
      />

      <Text style={styles.label}>SIM Number:</Text>
      <TextInput
        style={styles.input}
        value={simNumber}
        onChangeText={setSimNumber}
        placeholder="Enter SIM Number"
        placeholderTextColor={'#000'}
      />

      {filesNameList.map((category, index) => (
        <View key={category} style={styles.fileContainer}>
          <Text style={styles.label}>{fileLabels[category]}</Text>

          <TouchableOpacity
            onPress={() => openGeneralCamera(category)}
            style={styles.imageButton}>
            <MaterialIcon name="camera-plus" size={28} color="#000" />
            <Text style={styles.title}>Camera</Text>
          </TouchableOpacity>

          <ScrollView horizontal style={styles.imagePreviewContainer}>
            {photos
              .filter(photo => photo.category === category)
              .map((photo, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{uri: photo.uri}}
                    style={styles.imagePreview}
                  />
                </View>
              ))}
          </ScrollView>
        </View>
      ))}

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

      {isPendingSelected && (
        <>
          <View style={styles.optionsContainer}>
            <Text style={styles.label}>Collected Defective Material:</Text>

            <TouchableOpacity
              onPress={() => handleSelection('Yes')}
              style={styles.option}>
              <View
                style={[
                  styles.checkbox,
                  selected === 'Yes' && styles.checkedBox,
                ]}>
                {selected === 'Yes' && <Text style={styles.checkmark}>✔️</Text>}
              </View>
              <Text style={styles.optionText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelection('No')}
              style={styles.option}>
              <View
                style={[
                  styles.checkbox,
                  selected === 'No' && styles.checkedBox,
                ]}>
                {selected === 'No' && <Text style={styles.checkmark}>✔️</Text>}
              </View>
              <Text style={styles.optionText}>No</Text>
            </TouchableOpacity>
          </View>
          <View>
            {selected === 'No' && (
              <TextInput
                style={styles.input}
                placeholder="Enter Service Remarks"
                multiline={true}
                numberOfLines={4}
              />
            )}
          </View>
        </>
      )}

      {/* <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity> */}

      {!isButtonHidden && (
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      )}
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
    fontSize: 18,
    marginRight: 10,
    fontWeight: 'bold',
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

  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  checkedBox: {
    backgroundColor: '#007BFF',
  },

  optionText: {
    fontSize: 16,
  },

  card: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#555',
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
    marginBottom: 40,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {color: '#fff', fontSize: 16},
  loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  errorText: {fontSize: 16, color: 'red'},

  nonEditable: {backgroundColor: '#e9ecef', color: '#000'},
});

export default ShowComplaintData;
