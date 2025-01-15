// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   ActivityIndicator,
//   TextInput,
//   TouchableOpacity,
//   RefreshControl,
// } from 'react-native';
// import {Picker} from '@react-native-picker/picker';

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

// const QuaterVisit = () => {
//   const [formData, setFormData] = useState({
//     saralId: '',
//     farmerName: '',
//     fatherName: '',
//     placeOfInstallation: '',
//     block: '',
//     tehsil: '',
//     district: '',
//     pumpInstalledDate: '',
//     nameOfFirm: '',
//     pumpType: '',
//     currentStatus: '',
//     periodicMaintenance: '',
//   });

//   const [dataList, setDataList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

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


//   const handleInputChange = (name, value) => {
//     setFormData({...formData, [name]: value});
//   };

//   const openCamera = async () => {
//       const hasPermission = await requestCameraPermission();
//       if (!hasPermission) {
//         Alert.alert('Permission Denied', 'Camera access is required.');
//         return;
//       }
  
//       launchCamera(
//         {
//           mediaType: 'photo',
//           cameraType: 'back',
//           quality: 1,
//           includeBase64: true,
//         },
//         async response => {
//           if (response.didCancel) {
//             console.log('User cancelled camera picker');
//           } else if (response.errorCode) {
//             console.log('Camera Error:', response.errorMessage);
//           } else if (response.assets && response.assets.length > 0) {
//             try {
//               const originalPhoto = response.assets[0];
//               const resizedImage = await ImageResizer.createResizedImage(
//                 originalPhoto.uri,
//                 800, // New width
//                 800, // New height
//                 'JPEG', // Format
//                 80, // Quality (0-100)
//                 0, // Rotation
//                 null, // Output path
//               );
  
//               // Get the file size in bytes
//               const fileStats = await RNFS.stat(resizedImage.uri);
//               const fileSizeInKB = (fileStats.size / 1024).toFixed(2); // Convert bytes to KB
  
//               console.log(`Resized image size: ${fileSizeInKB} KB`);
  
//               // Add the resized image to the state
//               const resizedPhoto = {
//                 ...originalPhoto,
//                 uri: resizedImage.uri,
//                 base64: resizedImage.base64 || originalPhoto.base64,
//               };
//               setSimPhoto([resizedPhoto]);
//             } catch (error) {
//               console.log('Error resizing image:', error.message);
//               Alert.alert('Error', 'Failed to resize the image.');
//             }
//           }
//         },
//       );
//     };

//   const handleSubmit = () => {
//     if (Object.values(formData).some(value => value.trim() === '')) {
//       Alert.alert('Validation Error', 'Please fill all fields');
//       return;
//     }
//     setDataList(prevData => [...prevData, formData]);
//     setFormData({
//       saralId: '',
//       farmerName: '',
//       fatherName: '',
//       placeOfInstallation: '',
//       block: '',
//       tehsil: '',
//       district: '',
//       pumpInstalledDate: '',
//       nameOfFirm: '',
//       pumpType: '',
//       currentStatus: '',
//       periodicMaintenance: '',
//     });
//     Alert.alert('Success', 'Data added successfully');
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 1000);
//   };

//   const renderItem = ({item}) => (
//     <View style={styles.itemContainer}>
//       <Text>Saral ID: {item.saralId}</Text>
//       <Text>Farmer Name: {item.farmerName}</Text>
//       <Text>Father Name: {item.fatherName}</Text>
//       <Text>Place of Installation: {item.placeOfInstallation}</Text>
//       <Text>Block: {item.block}</Text>
//       <Text>Tehsil: {item.tehsil}</Text>
//       <Text>District: {item.district}</Text>
//       <Text>Pump Installed Date: {item.pumpInstalledDate}</Text>
//       <Text>Name of Firm: {item.nameOfFirm}</Text>
//       <Text>Pump Type: {item.pumpType}</Text>
//       <Text>Current Status: {item.currentStatus}</Text>
//       <Text>Periodic Maintenance: {item.periodicMaintenance}</Text>
//     </View>
//   );

//   return (
//     <ScrollView
//       style={styles.container}
//       showsVerticalScrollIndicator={false}
//       nestedScrollEnabled={true}>
//       <Text style={styles.header}>Quater Visited</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Saral ID No"
//         value={formData.saralId}
//         onChangeText={value => handleInputChange('saralId', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Farmer Name"
//         value={formData.farmerName}
//         onChangeText={value => handleInputChange('farmerName', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Father Name"
//         value={formData.fatherName}
//         onChangeText={value => handleInputChange('fatherName', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Place of Installation"
//         value={formData.placeOfInstallation}
//         onChangeText={value => handleInputChange('placeOfInstallation', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Block"
//         value={formData.block}
//         onChangeText={value => handleInputChange('block', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Tehsil"
//         value={formData.tehsil}
//         onChangeText={value => handleInputChange('tehsil', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="District"
//         value={formData.district}
//         onChangeText={value => handleInputChange('district', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Pump Installed Date"
//         value={formData.pumpInstalledDate}
//         onChangeText={value => handleInputChange('pumpInstalledDate', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Name of Firm"
//         value={formData.nameOfFirm}
//         onChangeText={value => handleInputChange('nameOfFirm', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Pump Type & Capacity"
//         value={formData.pumpType}
//         onChangeText={value => handleInputChange('pumpType', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Current Status of the Pump"
//         value={formData.currentStatus}
//         onChangeText={value => handleInputChange('currentStatus', value)}
//       />
//       <Picker
//         selectedValue={formData.periodicMaintenance}
//         style={styles.input}
//         onValueChange={value =>
//           handleInputChange('periodicMaintenance', value)
//         }>
//         <Picker.Item label="Select Maintenance" value="" />
//         <Picker.Item label="Quarter 1" value="Quarter 1" />
//         <Picker.Item label="Quarter 2" value="Quarter 2" />
//         <Picker.Item label="Quarter 3" value="Quarter 3" />
//         <Picker.Item label="Quarter 4" value="Quarter 4" />
//       </Picker>

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

//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Submit</Text>
//       </TouchableOpacity>

//       <FlatList
//         data={dataList}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => index.toString()}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//         }
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fbd33b',
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//     color: 'black',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 8,
//     fontSize: 16,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   itemContainer: {
//     padding: 15,
//     marginVertical: 5,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     borderColor: '#ddd',
//     borderWidth: 1,
//   },
// });

// export default QuaterVisit;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'We need access to your camera to take pictures.',
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

const QuaterVisit = () => {
  const [formData, setFormData] = useState({
    saralId: '',
    farmerName: '',
    fatherName: '',
    placeOfInstallation: '',
    block: '',
    tehsil: '',
    district: '',
    pumpInstalledDate: '',
    nameOfFirm: '',
    pumpType: '',
    currentStatus: '',
    periodicMaintenance: '',
  });

  const [dataList, setDataList] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (Platform.OS === 'android') {
        const locationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (locationGranted) {
          Geolocation.getCurrentPosition(
            position => {
              console.log('Location fetched', position.coords);
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
        console.log('Installation data:', response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

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

            const resizedPhoto = {
              ...originalPhoto,
              uri: resizedImage.uri,
              base64: resizedImage.base64 || originalPhoto.base64,
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

  const handleSubmit = () => {
    if (Object.values(formData).some(value => value.trim() === '')) {
      Alert.alert('Validation Error', 'Please fill all fields.');
      return;
    }

    setDataList(prevData => [...prevData, formData]);
    setFormData({
      saralId: '',
      farmerName: '',
      fatherName: '',
      placeOfInstallation: '',
      block: '',
      tehsil: '',
      district: '',
      pumpInstalledDate: '',
      nameOfFirm: '',
      pumpType: '',
      currentStatus: '',
      periodicMaintenance: '',
    });
    Alert.alert('Success', 'Data added successfully.');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>Saral ID: {item.saralId}</Text>
      <Text>Farmer Name: {item.farmerName}</Text>
      <Text>Father Name: {item.fatherName}</Text>
      <Text>Place of Installation: {item.placeOfInstallation}</Text>
      <Text>Block: {item.block}</Text>
      <Text>Tehsil: {item.tehsil}</Text>
      <Text>District: {item.district}</Text>
      <Text>Pump Installed Date: {item.pumpInstalledDate}</Text>
      <Text>Name of Firm: {item.nameOfFirm}</Text>
      <Text>Pump Type: {item.pumpType}</Text>
      <Text>Current Status: {item.currentStatus}</Text>
      <Text>Periodic Maintenance: {item.periodicMaintenance}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh}  nestedScrollEnabled={true}/>
      }
    >
      <Text style={styles.header}>Quarter Visited</Text>

      {/* Input Fields */}
      {Object.keys(formData).map(key => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key.replace(/([A-Z])/g, ' $1')}
          value={formData[key]}
          onChangeText={value => handleInputChange(key, value)}
        />
      ))}

      {/* Maintenance Picker */}
      <Picker
        selectedValue={formData.periodicMaintenance}
        style={styles.input}
        onValueChange={value => handleInputChange('periodicMaintenance', value)}
      >
        <Picker.Item label="Select Maintenance" value="" />
        <Picker.Item label="Quarter 1" value="Quarter 1" />
        <Picker.Item label="Quarter 2" value="Quarter 2" />
        <Picker.Item label="Quarter 3" value="Quarter 3" />
        <Picker.Item label="Quarter 4" value="Quarter 4" />
      </Picker>

      {/* Camera */}
      <Text style={styles.label}>Images:</Text>
      <TouchableOpacity onPress={openCamera} style={styles.imageButton}>
        <Icon name="camera-plus" size={28} color="#000" />
      </TouchableOpacity>
      <ScrollView horizontal style={styles.imagePreviewContainer}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
          </View>
        ))}
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* Data List */}
      <FlatList
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  imageButton: {
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  imageWrapper: {
    marginRight: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});

export default QuaterVisit;

