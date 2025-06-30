// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   Image,
//   Platform,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {launchCamera} from 'react-native-image-picker';
// import {useForm, Controller} from 'react-hook-form';
// import Geolocation from '@react-native-community/geolocation';
// import {PermissionsAndroid} from 'react-native';
// import ImageResizer from 'react-native-image-resizer';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {API_URL} from '@env';

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

// const InstallationForm = ({route}) => {
//   const {
//     installationId,
//     farmerName,
//     farmerContact,
//     farmerSaralId,
//   } = route.params;

//   const {control, handleSubmit, setValue} = useForm();
//   const [loading, setLoading] = useState(true);
//   const [photos, setPhotos] = useState({});
//   const navigation = useNavigation();
//   const [longitude, setLongitude] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const filesNameList = [
//     'pitPhoto',
//     'earthingFarmerPhoto',
//     'antiTheftNutBoltPhoto',
//     'lightingArresterInstallationPhoto',
//     'finalFoundationFarmerPhoto',
//     'panelFarmerPhoto',
//     'controllerBoxFarmerPhoto',
//     'waterDischargeFarmerPhoto',
//   ];

//   const fileLabels = {
//     pitPhoto: 'Gaddhe Ki Photo',
//     earthingFarmerPhoto: 'Earthing Farmer Photo',
//     antiTheftNutBoltPhoto: 'Anti Theft Nut Bolt Photo',
//     lightingArresterInstallationPhoto: 'Lighting Arrester Installation Photo',
//     finalFoundationFarmerPhoto: 'Final Foundation Farmer Photo',
//     panelFarmerPhoto: 'Panel Farmer Photo',
//     controllerBoxFarmerPhoto: 'Controller Box Farmer Photo',
//     waterDischargeFarmerPhoto: 'Water Discharge Farmer Photo',
//   };

//   useEffect(() => {
//     const initialize = async () => {
//       if (Platform.OS === 'android') {
//         const locationGranted = await requestLocationPermission();
//         if (locationGranted) {
//           Geolocation.getCurrentPosition(
//             position => {
//               setLongitude(position.coords.longitude.toString());
//               setLatitude(position.coords.latitude.toString());
//               setValue('longitude', position.coords.longitude.toString());
//               setValue('latitude', position.coords.latitude.toString());
//             },
//             error => {
//               console.log('Error getting location:', error.message);
//               Alert.alert('Error', 'Unable to fetch location.');
//             },
//           );
//         }
//       }

//       const initialPhotos = {};
//       filesNameList.forEach(category => {
//         initialPhotos[category] = [];
//       });
//       setPhotos(initialPhotos);

//       setLoading(false);
//     };

//     initialize();
//   }, []);

//   const openGeneralCamera = async category => {
//     const hasPermission = await requestCameraPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission Denied', 'Camera access is required.');
//       return;
//     }

//     launchCamera(
//       {
//         mediaType: 'photo',
//         cameraType: 'back',
//         quality: 0.8,
//         includeBase64: false,
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
//             const newPhoto = {
//               uri: resizedImage.uri,
//               type: originalPhoto.type || 'image/jpeg',
//               name: `photo_${Date.now()}.jpg`,
//             };

//             setPhotos(prevPhotos => ({
//               ...prevPhotos,
//               [category]: [...prevPhotos[category], newPhoto],
//             }));

//           } catch (error) {
//             console.log('Error processing image:', error.message);
//             Alert.alert('Error', 'Failed to process the image.');
//           }
//         }
//       },
//     );
//   };

//   const handleImageRemove = (category, uri) => {
//     setPhotos(prevPhotos => ({
//       ...prevPhotos,
//       [category]: prevPhotos[category].filter(photo => photo.uri !== uri),
//     }));
//   };

//   const onSubmit = async () => {
//     if (isSubmitting) return;
//     setIsSubmitting(true);

//     try {
//       const serviceId = await AsyncStorage.getItem('_id');
//       if (!serviceId) {
//         throw new Error('Service ID not found');
//       }

//       const formData = new FormData();

//       formData.append('farmerSaralId', farmerSaralId);
//       formData.append('latitude', latitude);
//       formData.append('longitude', longitude);
//       formData.append('installationId', installationId);
//       formData.append('servicePersonId', serviceId);

//       // Add all photos to formData
//       filesNameList.forEach(category => {
//         photos[category].forEach((photo, index) => {
//           formData.append(`${category}`, {
//             uri: photo.uri,
//             type: photo.type,
//             name: photo.name || `photo_${category}_${index}.jpg`,
//           });
//         });
//       });

//       console.log('Submitting form data:', formData);

//       const response = await axios.post(
//         `${API_URL}/service-person/new-system-installation`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       console.log('Response data', response.data);

//       if (response.status === 200) {
//         Alert.alert('Success', 'Form submitted successfully!');
//         navigation.goBack();
//       }
//     } catch (error) {
//       console.log(
//         'Error submitting form:',
//         error.response?.data || error.message
//       );
//       Alert.alert(
//         'Error',
//         error.response?.data?.message || 'Failed to submit form'
//       );
//     } finally {
//       setIsSubmitting(false);
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

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Installation Details</Text>

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
//           <Text style={styles.value}>{farmerSaralId || 'N/A'}</Text>
//         </View>

//         <View style={styles.row}>
//           <Text style={styles.label}>Longitude:</Text>
//           <Text style={styles.value}>{longitude || 'N/A'}</Text>
//         </View>

//         <View style={styles.row}>
//           <Text style={styles.label}>Latitude:</Text>
//           <Text style={styles.value}>{latitude || 'N/A'}</Text>
//         </View>
//       </View>

//       {filesNameList.map(category => (
//         <View key={category} style={styles.fileContainer}>
//           <Text style={styles.label}>{fileLabels[category]}</Text>

//           <TouchableOpacity
//             onPress={() => openGeneralCamera(category)}
//             style={styles.imageButton}>
//             <MaterialIcon name="camera-plus" size={28} color="#000" />
//             <Text style={styles.title}>Camera</Text>
//           </TouchableOpacity>

//           <ScrollView horizontal style={styles.imagePreviewContainer}>
//             {photos[category]?.map((photo, index) => (
//               <View key={index} style={styles.imageWrapper}>
//                 <Image source={{uri: photo.uri}} style={styles.imagePreview} />
//                 <TouchableOpacity
//                   style={styles.cutButton}
//                   onPress={() => handleImageRemove(category, photo.uri)}>
//                   <Text style={styles.cutButtonText}>✕</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       ))}

//       <TouchableOpacity
//         onPress={handleSubmit(onSubmit)}
//         style={styles.submitButton}
//         disabled={isSubmitting}>
//         {isSubmitting ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Submit</Text>
//         )}
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
//     fontSize: 16,
//     marginBottom: 8,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   card: {
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     elevation: 3,
//     marginBottom: 16,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 8,
//   },
//   value: {
//     fontSize: 16,
//     color: '#555',
//   },
//   fileContainer: {
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   imageButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 12,
//     alignSelf: 'flex-start',
//   },
//   title: {
//     marginLeft: 8,
//     fontSize: 16,
//   },
//   imagePreviewContainer: {
//     flexDirection: 'row',
//   },
//   imageWrapper: {
//     position: 'relative',
//     marginRight: 10,
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//   },
//   cutButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cutButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   submitButton: {
//     backgroundColor: '#000',
//     borderRadius: 8,
//     padding: 16,
//     marginVertical: 20,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fbd33b',
//   },
// });

// export default InstallationForm;


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
  ActionSheetIOS,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useForm} from 'react-hook-form';
import Geolocation from '@react-native-community/geolocation';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {API_URL} from '@env';
import ImageResizer from 'react-native-image-resizer';

const MAX_VIDEO_SIZE_MB = 25;

// Permission Requests
const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'We need access to your camera to take pictures',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const requestStoragePermission = async () => {
  try {
    if (Platform.Version >= 33) { // Android 13+
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        {
          title: 'Media Permission',
          message: 'We need access to your media to select videos',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'We need access to your storage to select media',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
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
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const InstallationForm = ({route}) => {
  const {installationId, farmerName, farmerContact, farmerSaralId} = route.params;
  const {control, handleSubmit, setValue} = useForm();
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState({});
  const [installationVideo, setInstallationVideo] = useState(null);
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filesNameList = [
    'pitPhoto',
    'earthingFarmerPhoto',
    'antiTheftNutBoltPhoto',
    'lightingArresterInstallationPhoto',
    'finalFoundationFarmerPhoto',
    'panelFarmerPhoto',
    'controllerBoxFarmerPhoto',
    'waterDischargeFarmerPhoto',
  ];

  const fileLabels = {
    pitPhoto: 'Gaddhe Ki Photo',
    earthingFarmerPhoto: 'Earthing Farmer Photo',
    antiTheftNutBoltPhoto: 'Anti Theft Nut Bolt Photo',
    lightingArresterInstallationPhoto: 'Lighting Arrester Installation Photo',
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
            }
          );
        }
      }

      const initialPhotos = {};
      filesNameList.forEach(category => {
        initialPhotos[category] = [];
      });
      setPhotos(initialPhotos);
      setLoading(false);
    };

    initialize();
  }, []);

  const openCamera = async (category) => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const options = {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      };

      const response = await launchCamera(options);
      handleImageResponse(response, category);
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const handleImageResponse = async (response, category) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage);
      return;
    }

    if (response.assets && response.assets.length > 0) {
      try {
        const originalPhoto = response.assets[0];
        const resizedImage = await ImageResizer.createResizedImage(
          originalPhoto.uri,
          800,
          800,
          'JPEG',
          80
        );

        const newPhoto = {
          uri: resizedImage.uri,
          type: originalPhoto.type || 'image/jpeg',
          name: `photo_${Date.now()}.jpg`,
        };

        setPhotos(prev => ({
          ...prev,
          [category]: [...prev[category], newPhoto],
        }));
      } catch (error) {
        console.log('Image processing error:', error);
        Alert.alert('Error', 'Failed to process image');
      }
    }
  };

  const handleVideoSelection = async () => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Please allow storage access to select videos',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Open Settings', onPress: () => Linking.openSettings()},
            ]
          );
          return;
        }
      }

      const options = {
        mediaType: 'video',
        videoQuality: 'high',
        durationLimit: 300,
        selectionLimit: 1,
        includeBase64: false,
        presentationStyle: 'pageSheet',
      };

      const result = await launchImageLibrary(options);
      
      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const video = result.assets[0];
        const videoSizeMB = video.fileSize / (1024 * 1024);
        
        if (videoSizeMB > MAX_VIDEO_SIZE_MB) {
          Alert.alert('File Too Large', `Maximum video size is ${MAX_VIDEO_SIZE_MB}MB`);
          return;
        }

        setInstallationVideo({
          uri: video.uri,
          type: video.type || 'video/mp4',
          name: video.fileName || `video_${Date.now()}.mp4`,
          size: video.fileSize,
        });
      }
    } catch (error) {
      console.log('Video selection error:', error);
      Alert.alert('Error', 'Failed to select video');
    }
  };

  const handleGallerySelection = async (category) => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Please allow storage access to select photos',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Open Settings', onPress: () => Linking.openSettings()},
            ]
          );
          return;
        }
      }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 10,
      });

      if (result.assets && result.assets.length > 0) {
        const newPhotos = await Promise.all(
          result.assets.map(async (asset) => {
            const resizedImage = await ImageResizer.createResizedImage(
              asset.uri,
              800,
              800,
              'JPEG',
              80
            );
            return {
              uri: resizedImage.uri,
              type: asset.type || 'image/jpeg',
              name: `photo_${Date.now()}.jpg`,
            };
          })
        );

        setPhotos(prev => ({
          ...prev,
          [category]: [...prev[category], ...newPhotos],
        }));
      }
    } catch (error) {
      console.log('Gallery error:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const showActionSheet = (category) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openCamera(category);
          if (buttonIndex === 2) handleGallerySelection(category);
        }
      );
    } else {
      Alert.alert(
        'Select Option',
        '',
        [
          {text: 'Take Photo', onPress: () => openCamera(category)},
          {text: 'Choose from Gallery', onPress: () => handleGallerySelection(category)},
          {text: 'Cancel', style: 'cancel'},
        ],
        {cancelable: true}
      );
    }
  };

  const removeVideo = () => {
    setInstallationVideo(null);
  };

  const handleImageRemove = (category, uri) => {
    setPhotos(prev => ({
      ...prev,
      [category]: prev[category].filter(photo => photo.uri !== uri),
    }));
  };

  const onSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const serviceId = await AsyncStorage.getItem('_id');
      if (!serviceId) throw new Error('Service ID not found');

      const formData = new FormData();
      formData.append('farmerSaralId', farmerSaralId);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('installationId', installationId);
      formData.append('servicePersonId', serviceId);

      filesNameList.forEach(category => {
        photos[category].forEach((photo, index) => {
          formData.append(`${category}`, {
            uri: photo.uri,
            type: photo.type,
            name: photo.name || `photo_${category}_${index}.jpg`,
          });
        });
      });

      if (installationVideo) {
        formData.append('installationVideo', {
          uri: installationVideo.uri,
          type: installationVideo.type,
          name: installationVideo.name,
        });
      }

      console.log('Submitting form data:', formData);

      // const response = await axios.post(
      //   `${API_URL}/service-person/new-system-installation`,
      //   formData,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   }
      // );

      // if (response.status === 200) {
      //   Alert.alert('Success', 'Form submitted successfully!');
      //   navigation.goBack();
      // }
    } catch (error) {
      console.log('Submission error:', error.response?.data || error.message);
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

      {/* Video Upload Section */}
      <View style={styles.fileContainer}>
        <Text style={styles.label}>Complete Installation Video (Max {MAX_VIDEO_SIZE_MB}MB)</Text>
        {installationVideo ? (
          <View style={styles.videoContainer}>
            <MaterialIcon name="video" size={24} color="#000" />
            <View style={styles.videoInfo}>
              <Text style={styles.videoName} numberOfLines={1}>
                {installationVideo.name}
              </Text>
              <Text style={styles.videoSize}>
                {(installationVideo.size / (1024 * 1024)).toFixed(2)} MB
              </Text>
            </View>
            <TouchableOpacity onPress={removeVideo} style={styles.cutButton}>
              <Text style={styles.cutButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleVideoSelection}
            style={[styles.imageButton, styles.videoButton]}
          >
            <MaterialIcon name="video-plus" size={28} color="#000" />
            <Text style={styles.title}>Select Video</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.videoNote}>
          Please upload a video showing the complete installed system
        </Text>
      </View>

      {filesNameList.map(category => (
        <View key={category} style={styles.fileContainer}>
          <Text style={styles.label}>{fileLabels[category]}</Text>
          <TouchableOpacity
            onPress={() => showActionSheet(category)}
            style={styles.imageButton}
          >
            <MaterialIcon name="camera-plus" size={28} color="#000" />
            <Text style={styles.title}>Add Photo</Text>
          </TouchableOpacity>
          <ScrollView horizontal style={styles.imagePreviewContainer}>
            {photos[category]?.map((photo, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{uri: photo.uri}} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.cutButton}
                  onPress={() => handleImageRemove(category, photo.uri)}
                >
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
        disabled={isSubmitting}
      >
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
  videoButton: {
    backgroundColor: '#e3f2fd',
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
  videoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  videoInfo: {
    flex: 1,
    marginLeft: 10,
  },
  videoName: {
    fontSize: 14,
    color: '#333',
  },
  videoSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  videoNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
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