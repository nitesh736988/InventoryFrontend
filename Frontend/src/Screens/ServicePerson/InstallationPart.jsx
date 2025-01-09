// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// import {launchCamera} from 'react-native-image-picker';
// import {API_URL} from '@env';
// import axios from 'axios';
// import {useNavigation} from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

// const InstallationPart = ({route}) => {
//   const {pickupItemId} = route.params;
//   const [installationData, setInstallationData] = useState('');
//   const [images, setImages] = useState([]);
//   const [longitude, setLongitude] = useState(null);
//   const [latitude, setLatitude] = useState(null);
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initialize = async () => {
//       if (Platform.OS === 'android') {
//         await requestCameraPermission();
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

//       const fetchInstallationData = async () => {
//         try {
//           const response = await axios.get(
//             `${API_URL}/service-person/get-pickupItem-data?pickupItemId=${pickupItemId}`,
//           );
//           setInstallationData(response.data.data);
//         } catch (error) {
//           console.log(
//             'Error fetching installation data:',
//             error.response?.data || error.message,
//           );
//           Alert.alert('Error', error.response.data.message);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchInstallationData();
//     };

//     initialize();
//   }, [pickupItemId]);

//   const openCamera = () => {
//     launchCamera(
//       {
//         mediaType: 'photo',
//         cameraType: 'back',
//         quality: 1,
//         includeBase64: true
//       },
//       response => {
//         if (response.didCancel) {
//           console.log('User cancelled camera picker');
//         } else if (response.errorCode) {
//           console.log('Camera Error:', response.errorMessage);
//         } else if (response.assets && response.assets.length > 0) {
//           setImages(prevImages => [ ...prevImages, response.assets[0]]);
//         }
//       },
//     );
//   };

//   const handleSubmit = async () => {
//     if (images.length === 0) {
//       Alert.alert('Validation Error', 'Please add at least one image.');
//       return;
//     }

//     if (longitude === null || latitude === null) {
//       Alert.alert('Validation Error', 'Unable to fetch location coordinates.');
//       return;
//     }

//     const {
//       farmerName,
//       farmerContact,
//       farmerVillage,
//       items,
//       serialNumber,
//     } = installationData;

//     const formData = new FormData();
//     formData.append('farmerName', farmerName);
//     formData.append('farmerContact', farmerContact);
//     formData.append('farmerVillage', farmerVillage);
//     formData.append('items', items);
//     formData.append('serialNumber', serialNumber)
//     formData.append('installationDone', true );
//     formData.append('pickupItemId', pickupItemId);
//     formData.append('longitude', longitude);
//     formData.append('latitude', latitude);

//     // console.log(JSON.stringifyformData);

//     // images.forEach((imageUri, index) => {
//     //   const fileName = imageUri.split('/').pop();
//     //   formData.append('photos', {
//     //     uri: imageUri,
//     //     type: 'image/jpeg',
//     //     name: fileName || `image_${index}.jpg`,
//     //   });
//     // });

//     // console.log(JSON.stringify(formData));

//     const photos = []; // Array to hold base64 images

//     console.log(images);

//     for (let index = 0; index < images.length; index++) {
//       const photo = images[index];

//       if (!photo.base64) {
//         console.error('Base64 not found in photo object. Ensure includeBase64 is enabled.');
//         continue; // Skip this photo if base64 is not available
//       }
    
//       const photoBase64 = `data:${photo.type};base64,${photo.base64}`;
//       console.log('Photo in Base64:', photoBase64);
//       photos.push(photoBase64); // Add to the photos array
//     }

//     const dataToSend = { 
//       photos,
//       pickupItemId, farmerName, farmerContact, farmerVillage,
//       items, serialNumber, latitude, longitude, installationDone: true,
//       installationDate: new Date()
//     }
    
//     console.log(dataToSend);

//     try {
//       const response = await axios.post(
//         `${API_URL}/service-person/new-installation-data`,
//         dataToSend,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (response.data.success) {
//         console.log("Installation Successfully")
//       } else {
//         Alert.alert('Error', 'Failed to submit installation data.');
//       }
//     } catch (error) {
//       console.log(
//         'Error submitting installation data:',
//         error.response?.data || error.message,
//       );
//       Alert.alert('Error', error.response?.data.message);
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
//         <Text style={styles.errorText}>Unable to load installation data.</Text>
//       </View>
//     );
//   }

//   const {
//     farmerName,
//     farmerContact,
//     farmerVillage,
//     items,
//     serialNumber,
//     installationDate,
//   } = installationData;

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <Text style={styles.header}>Service Pending</Text>

//       <Text style={styles.label}>Farmer Name:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={farmerName}
//         editable={false}
//       />

//       <Text style={styles.label}>Farmer Contact:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={farmerContact.toString()}
//         editable={false}
//       />

      

//       <Text style={styles.label}>Farmer Village:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={farmerVillage}
//         editable={false}
//       />

//       <Text style={styles.subHeader}>Items:</Text>
//       <View style={styles.itemContainer}>
//         {items.length > 0 ? (
//           items.map(({_id, itemName, quantity}) => (
//             <Text key={_id} style={styles.infoText}>
//               {itemName}: {quantity}
//             </Text>
//           ))
//         ) : (
//           <Text style={styles.infoText}>No items available</Text>
//         )}
//       </View>

//       <Text style={styles.label}>Serial Number:</Text>
//       <TextInput
//         style={[styles.input, styles.nonEditable]}
//         value={serialNumber}
//         editable={false}
//       />

//       {installationDate && (
//         <Text style={styles.infoText}>
//           Installation Date: {new Date(installationDate).toLocaleDateString()}
//         </Text>
//       )}

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

//       <Text style={styles.label}>Installation Images:</Text>
//       <TouchableOpacity onPress={openCamera} style={styles.imageButton}>
//         <Icon name="camera-plus" size={28} color="#000" />
//       </TouchableOpacity>

//       <ScrollView horizontal style={styles.imagePreviewContainer}>
//         {images.map(({ uri }, index) => (
//           <Image
//             key={index}
//             source={{uri}}
//             style={styles.imagePreview}
//           />
//         ))}
//       </ScrollView>

//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Submit</Text>
        
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.submitButton}
//         onPress={() => navigation.goBack()}>
//         <Text style={styles.buttonText}>Close</Text>
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
//   label: {fontSize: 16, marginBottom: 4, color: 'black'},
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 8,
//     fontSize: 16,
//     marginBottom: 12,
//     backgroundColor: '#fff',
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
//   buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'},
//   nonEditable: {backgroundColor: '#e9ecef', color: '#6c757d'},
//   subHeader: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginTop: 16,
//     marginBottom: 8,
//     color: 'black',
//   },
//   itemContainer: {marginBottom: 16},
//   infoText: {fontSize: 16, color: '#333', marginBottom: 4},
//   imageButton: {
//     padding: 10,
//     marginBottom: 12,
//     borderRadius: 8,
//     alignItems: 'start',
//   },
//   imagePreviewContainer: {marginTop: 16},
//   imagePreview: {
//     width: 100,
//     height: 100,
//     marginRight: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   errorText: {fontSize: 16, color: 'red', textAlign: 'center'},
// });

// export default InstallationPart;



import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {launchCamera} from 'react-native-image-picker';
import {API_URL} from '@env';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

const InstallationPart = ({route}) => {
  const {pickupItemId} = route.params;
  const [installationData, setInstallationData] = useState('');
  const [images, setImages] = useState([]);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      if (Platform.OS === 'android') {
        await requestCameraPermission();
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

      const fetchInstallationData = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/service-person/get-pickupItem-data?pickupItemId=${pickupItemId}`,
          );
          setInstallationData(response.data.data);
        } catch (error) {
          console.log(
            'Error fetching installation data:',
            error.response?.data || error.message,
          );
          Alert.alert('Error', error.response.data.message);
        } finally {
          setLoading(false);
        }
      };

      fetchInstallationData();
    };

    initialize();
  }, [pickupItemId]);

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
            setImages(prevImages => [...prevImages, resizedPhoto]);
          } catch (error) {
            console.log('Error resizing image:', error.message);
            Alert.alert('Error', 'Failed to resize the image.');
          }
        }
      },
    );
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one image.');
      return;
    }

    if (longitude === null || latitude === null) {
      Alert.alert('Validation Error', 'Unable to fetch location coordinates.');
      return;
    }

    const {farmerName, farmerContact, farmerVillage, items, serialNumber} =
      installationData;

    const photos = images.map(image => {
      if (!image.base64) {
        console.error('Base64 not found in image. Ensure includeBase64 is enabled.');
        return null;
      }
      return `data:${image.type};base64,${image.base64}`;
    }).filter(Boolean);

    const dataToSend = {
      photos,
      pickupItemId,
      farmerName,
      farmerContact,
      farmerVillage,
      items,
      serialNumber,
      latitude,
      longitude,
      installationDone: true,
      installationDate: new Date(),
    };

    try {
      const response = await axios.post(
        `${API_URL}/service-person/new-installation-data`,
        dataToSend,
        {
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (response.data.success) {
        console.log('Installation submitted successfully');
        Alert.alert('Success', 'Installation submitted successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to submit installation data.');
      }
    } catch (error) {
      console.log(
        'Error submitting installation data:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', error.response?.data.message);
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
        <Text style={styles.errorText}>Unable to load installation data.</Text>
      </View>
    );
  }

  const {farmerName, farmerContact, farmerVillage, items, serialNumber, installationDate} = installationData;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Service Pending</Text>

      <Text style={styles.label}>Farmer Name:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={farmerName}
        editable={false}
      />

      <Text style={styles.label}>Farmer Contact:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={farmerContact.toString()}
        editable={false}
      />

      <Text style={styles.label}>Farmer Village:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={farmerVillage}
        editable={false}
      />

      <Text style={styles.subHeader}>Items:</Text>
      <View style={styles.itemContainer}>
        {items.length > 0 ? (
          items.map(({_id, itemName, quantity}) => (
            <Text key={_id} style={styles.infoText}>
              {itemName}: {quantity}
            </Text>
          ))
        ) : (
          <Text style={styles.infoText}>No items available</Text>
        )}
      </View>

      <Text style={styles.label}>Serial Number:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={serialNumber}
        editable={false}
      />

      {installationDate && (
        <Text style={styles.infoText}>
          Installation Date: {new Date(installationDate).toLocaleDateString()}
        </Text>
      )}

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

      <Text style={styles.label}>Images:</Text>
      <TouchableOpacity onPress={openCamera} style={styles.imageButton}>
        <Icon name="camera-plus" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView horizontal style={styles.imagePreviewContainer}>
        {images.map((photo, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{uri: photo.uri}} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                const updatedImages = images.filter((_, i) => i !== index);
                setImages(updatedImages);
              }}>
              <Icon name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

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
  header: {fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: 'black'},
  label: {fontSize: 16, marginBottom: 4, color: 'black'},
  input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, fontSize: 16, marginBottom: 12, backgroundColor: '#fff'},
  submitButton: {backgroundColor: '#070604', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginVertical: 10},
  buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'},
  nonEditable: {backgroundColor: '#e9ecef', color: '#6c757d'},
  subHeader: {fontSize: 20, fontWeight: '600', marginTop: 16, marginBottom: 8, color: 'black'},
  itemContainer: {marginBottom: 16, paddingHorizontal: 8},
  infoText: {fontSize: 16, color: '#333', marginVertical: 4},
  imageButton: {alignItems: 'center', justifyContent: 'center', backgroundColor: '#ccc', padding: 12, borderRadius: 8, marginVertical: 12},
  imagePreviewContainer: {flexDirection: 'row', marginBottom: 16},
  imageWrapper: {position: 'relative', marginRight: 8},
  imagePreview: {width: 100, height: 100, borderRadius: 8, resizeMode: 'cover'},
  deleteButton: {position: 'absolute', top: -6, right: -6, backgroundColor: 'white', borderRadius: 16, padding: 4},
  loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa'},
  errorText: {color: 'red', fontSize: 16, fontWeight: 'bold', textAlign: 'center'},
});

export default InstallationPart;
