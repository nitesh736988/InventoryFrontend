// import React, {useState, useEffect} from 'react';
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
//   TextInput,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import axios from 'axios';
// import {useNavigation} from '@react-navigation/native';
// import {launchCamera} from 'react-native-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ImageResizer from 'react-native-image-resizer';
// import Geolocation from '@react-native-community/geolocation';
// import {Picker} from '@react-native-picker/picker';

// // Function to request camera permission
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
//         },
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       Alert.alert('Error', 'Failed to request camera permission.');
//       return false;
//     }
//   }
//   return true;
// };

// // Function to request location permission
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

// const Survey = ({route}) => {
//   const {farmerId} = route.params;

//   // State variables
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
//   const [sourceType, setSourceType] = useState('');
//   const [depth, setDepth] = useState('');
//   const [waterLevel, setWaterLevel] = useState('');
//   const [pumpHead, setPumpHead] = useState('');
//   const [category, setCategory] = useState('');
//   const [LTDistance, setLTDistance] = useState('');
//   const [remark, setRemark] = useState('');

//   const navigation = useNavigation();


//   useEffect(() => {
//     const initialize = async () => {
//       if (Platform.OS === 'android') {
//         const locationGranted = await requestLocationPermission();
//         if (locationGranted) {
//           Geolocation.getCurrentPosition(
//             position => {
//               console.log('Latitude:', position.coords.latitude);
//               console.log('Longitude:', position.coords.longitude);
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

//   const handleImageUpload = async field => {
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

//             const resizedPhoto = {
//               ...originalPhoto,
//               uri: resizedImage.uri,
//               base64: resizedImage.base64 || originalPhoto.base64,
//             };

//             setImages(prevState => ({
//               ...prevState,
//               [field]: [...prevState[field], resizedPhoto],
//             }));

//             console.log('Image added:', resizedPhoto);
//           } catch (error) {
//             console.log('Error resizing image:', error.message);
//             Alert.alert('Error', 'Failed to resize the image.');
//           }
//         }
//       },
//     );
//   };

//   const handleFormSubmit = async () => {
//     console.log('Submit button pressed');
//     try {
//       setLoading(true);
//       const serviceId = await AsyncStorage.getItem('_id');
//       console.log('Service ID:', serviceId);

//       if (!serviceId) {
//         Alert.alert('Error', 'serviceId is missing.');
//         return;
//       }

//       if (!sourceType) {
//         Alert.alert('Error', 'Please select a Source Type.');
//         return;
//       }

//       const fields = Object.keys(images);
//       const incompleteFields = fields.filter(
//         field => images[field].length === 0,
//       );
//       if (incompleteFields.length > 0) {
//         Alert.alert(
//           'Error',
//           `Please upload images for: ${incompleteFields.join(', ')}`,
//         );
//         return;
//       }

//       const imagesBase64 = {};
//       fields.forEach(field => {
//         imagesBase64[field] = images[field]
//           .map(photo =>
//             photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null,
//           )
//           .filter(Boolean);
//       });

//       console.log('Images Base64:', imagesBase64);

//       const formData = {
//         fieldEmpId: serviceId,
//         farmerId,
//         consentLetter: imagesBase64.consentLetter,
//         consentWithFarmer: imagesBase64.consentWithFarmer,
//         landDoc: imagesBase64.landDoc,
//         challan: imagesBase64.challan,
//         aadharFront: imagesBase64.aadharFront,
//         aadharBack: imagesBase64.aadharBack,
//         longitude,
//         latitude,
//         sourceType,
//         depth,
//         waterLevel,
//         pumpHead,
//         category,
//         LTDistance,
//         remark
//       };

//       console.log('Form Data:', formData);

//       const response = await axios.post(
//         'http://88.222.214.93:8001/filedService/addInstallationSurvey',
//         formData,
//       );
//       if (response.status === 200) {
//         Alert.alert('Success', 'Data submitted successfully!');
//         navigation.goBack();
//       } else {
//         console.error('API Error:', response);
//         Alert.alert('Error', 'Failed to submit data.');
//       }
//     } catch (error) {
//       console.error('Error in axios request:', error.response || error);
//       Alert.alert('Error', 'Failed to submit data.');
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
//             <Image source={{uri: photo.uri}} style={styles.imagePreview} />
//             <TouchableOpacity
//               style={styles.deleteButton}
//               onPress={() => {
//                 setImages(prevState => ({
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
//         <Text style={styles.header}>Survey Data</Text>

//         <Text style={styles.label}>Source Type:</Text>
//         <View style={styles.pickerContainer}>
//           <Picker
//             selectedValue={sourceType}
//             onValueChange={itemValue => {
//               console.log('Source Type selected:', itemValue);
//               setSourceType(itemValue);
//             }}
//             style={styles.picker}>
//             <Picker.Item label="Select Source Type" value="" />
//             <Picker.Item label="Shuttle" value="Shuttle" />
//             <Picker.Item label="Borewell" value="Borewell" />
//             <Picker.Item label="Well" value="Well" />
//             <Picker.Item label="Pond" value="Pond" />
//           </Picker>
//         </View>

//         <Text style={styles.label}>Pump Head:</Text>
//         <View style={styles.pickerContainer}>
//           <Picker
//             selectedValue={pumpHead}
//             onValueChange={itemValue => {
//               console.log('Pump Head selected:', itemValue);
//               setPumpHead(itemValue);
//             }}
//             style={styles.picker}>
//             <Picker.Item label="Select Pump Head" value="" />
//             <Picker.Item label="30M" value="30M" />
//             <Picker.Item label="50M" value="50M" />
//             <Picker.Item label="70M" value="70M" />
//             <Picker.Item label="100M" value="100M" />
//             <Picker.Item label="100M" value="100M" />
//             <Picker.Item label="100M Plus" value="100M Plus" />
//           </Picker>
//         </View>

//         <Text style={styles.label}>Depth:</Text>
//         <TextInput
//           style={styles.input}
//           value={depth}
//           onChangeText={text => {
//             console.log('Depth entered:', text);
//             setDepth(text);
//           }}
//         />

//         <Text style={styles.label}>Water Level:</Text>
//         <TextInput
//           style={styles.input}
//           value={waterLevel}
//           onChangeText={text => {
//             console.log('Water Level entered:', text);
//             setWaterLevel(text);
//           }}
//         />

//         <Text style={styles.label}>Category:</Text>
//         <Picker
//           selectedValue={category}
//           onValueChange={setCategory}
//           style={styles.picker}>
//           <Picker.Item label="Select Category" value="" />
//           <Picker.Item label="General" value="General" />
//           <Picker.Item label="ST" value="ST" />
//           <Picker.Item label="OBC" value="OBC" />
//           <Picker.Item label="SC" value="SC" />
//         </Picker>

//         <Text style={styles.label}>LT Distance:</Text>
//         <TextInput
//           style={styles.input}
//           value={LTDistance}
//           onChangeText={setLTDistance}
//           keyboardType="numeric"
//         />

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

//         {renderImageSection('consentLetter', 'Consent Letter')}
//         {renderImageSection('consentWithFarmer', 'Consent with Farmer')}
//         {renderImageSection('landDoc', 'Land Document')}
//         {renderImageSection('challan', 'Challan')}
//         {renderImageSection('aadharFront', 'Aadhar Front')}
//         {renderImageSection('aadharBack', 'Aadhar Back')}

//         <Text style={styles.label}>Remark:</Text>
//         <TextInput
//           style={styles.inputBox}
//           value={remark}
//           onChangeText={setRemark}
//           placeholder="Enter remark"
//           multiline={true}
//           numberOfLines={4}
//           placeholderTextColor={'#000'}
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
//   nonEditable: {
//     backgroundColor: '#f1f1f1',
//   },
// });

// export default Survey;


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
import {Picker} from '@react-native-picker/picker';
import NetInfo from '@react-native-community/netinfo';

// Function to request camera permission
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

  // State variables
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
  const [sourceType, setSourceType] = useState('');
  const [depth, setDepth] = useState('');
  const [waterLevel, setWaterLevel] = useState('');
  const [pumpHead, setPumpHead] = useState('');
  const [category, setCategory] = useState('');
  const [LTDistance, setLTDistance] = useState('');
  const [remark, setRemark] = useState('');

  const navigation = useNavigation();

  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const initialize = async () => {
      if (Platform.OS === 'android') {
        const locationGranted = await requestLocationPermission();
        if (locationGranted) {
          Geolocation.getCurrentPosition(
            position => {
              console.log('Latitude:', position.coords.latitude);
              console.log('Longitude:', position.coords.longitude);
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

            console.log('Image added:', resizedPhoto);
          } catch (error) {
            console.log('Error resizing image:', error.message);
            Alert.alert('Error', 'Failed to resize the image.');
          }
        }
      },
    );
  };

  const handleFormSubmit = async () => {
    console.log('Submit button pressed');
    try {
      setLoading(true);
      const serviceId = await AsyncStorage.getItem('_id');
      console.log('Service ID:', serviceId);

      if (!serviceId) {
        Alert.alert('Error', 'serviceId is missing.');
        return;
      }

      if (!sourceType) {
        Alert.alert('Error', 'Please select a Source Type.');
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

      const imagesBase64 = {};
      fields.forEach(field => {
        imagesBase64[field] = images[field]
          .map(photo =>
            photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null,
          )
          .filter(Boolean);
      });

      console.log('Images Base64:', imagesBase64);

      const networkData = { ...formData, imagesBase64 };

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
        sourceType,
        depth,
        waterLevel,
        pumpHead,
        category,
        LTDistance,
        remark
      };

      console.log('Form Data:', formData);
     

      if (isConnected) {
      const response = await axios.post(
        'http://88.222.214.93:8001/filedService/addInstallationSurvey',
        formData,
      );
      if (response.status === 200) {
        Alert.alert('Success', 'Data submitted successfully!');
        navigation.goBack();
      }else {
          Alert.alert('Error', 'Failed to submit data.');
        }
      }
      else {
        // console.error('API Error:', response);
        await AsyncStorage.setItem('formData', JSON.stringify(networkData));
        Alert.alert('Data Saved', 'You are offline. Your data will be submitted when the network is available.');
      }
    } catch (error) {
      console.log('Error in axios request:', error.response || error);
      Alert.alert('Error', 'Failed to submit data.');
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const submitOfflineData = async () => {
      if (isConnected) {
        const offlineData = await AsyncStorage.getItem('formData');
        if (offlineData) {
          const data = JSON.parse(offlineData);
          try {
            const response = await axios.post('http://88.222.214.93:8001/filedService/addInstallationSurvey', data);
            if (response.status === 200) {
              Alert.alert('Success', 'Offline data submitted successfully!');
              await AsyncStorage.removeItem('formData');
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to submit offline data.');
          }
        }
      }
    };

    submitOfflineData();
  }, [isConnected]);

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

        <Text style={styles.label}>Source Type:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sourceType}
            onValueChange={itemValue => {
              console.log('Source Type selected:', itemValue);
              setSourceType(itemValue);
            }}
            style={styles.picker}>
            <Picker.Item label="Select Source Type" value="" />
            <Picker.Item label="Shuttle" value="Shuttle" />
            <Picker.Item label="Borewell" value="Borewell" />
            <Picker.Item label="Well" value="Well" />
            <Picker.Item label="Pond" value="Pond" />
          </Picker>
        </View>

        <Text style={styles.label}>Pump Head:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pumpHead}
            onValueChange={itemValue => {
              console.log('Pump Head selected:', itemValue);
              setPumpHead(itemValue);
            }}
            style={styles.picker}>
            <Picker.Item label="Select Pump Head" value="" />
            <Picker.Item label="30M" value="30M" />
            <Picker.Item label="50M" value="50M" />
            <Picker.Item label="70M" value="70M" />
            <Picker.Item label="100M" value="100M" />
            <Picker.Item label="100M" value="100M" />
            <Picker.Item label="100M Plus" value="100M Plus" />
          </Picker>
        </View>

        <Text style={styles.label}>Depth:</Text>
        <TextInput
          style={styles.input}
          value={depth}
          onChangeText={text => {
            console.log('Depth entered:', text);
            setDepth(text);
          }}
        />

        <Text style={styles.label}>Water Level:</Text>
        <TextInput
          style={styles.input}
          value={waterLevel}
          onChangeText={text => {
            console.log('Water Level entered:', text);
            setWaterLevel(text);
          }}
        />

        <Text style={styles.label}>Category:</Text>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={styles.picker}>
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="General" value="General" />
          <Picker.Item label="ST" value="ST" />
          <Picker.Item label="OBC" value="OBC" />
          <Picker.Item label="SC" value="SC" />
        </Picker>

        <Text style={styles.label}>LT Distance:</Text>
        <TextInput
          style={styles.input}
          value={LTDistance}
          onChangeText={setLTDistance}
          keyboardType="numeric"
        />

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

        {renderImageSection('consentLetter', 'Consent Letter')}
        {renderImageSection('consentWithFarmer', 'Consent with Farmer')}
        {renderImageSection('landDoc', 'Land Document')}
        {renderImageSection('challan', 'Challan')}
        {renderImageSection('aadharFront', 'Aadhar Front')}
        {renderImageSection('aadharBack', 'Aadhar Back')}

        <Text style={styles.label}>Remark:</Text>
        <TextInput
          style={styles.inputBox}
          value={remark}
          onChangeText={setRemark}
          placeholder="Enter remark"
          multiline={true}
          numberOfLines={4}
          placeholderTextColor={'#000'}
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
  nonEditable: {
    backgroundColor: '#f1f1f1',
  },
});

export default Survey;
