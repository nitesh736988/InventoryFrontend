// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';
// import {Picker} from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import axios from 'axios';
// import {launchCamera} from 'react-native-image-picker';
// import ImageResizer from 'react-native-image-resizer';
// import RNFS from 'react-native-fs';

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

//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         return true;
//       } else {
//         Alert.alert('Permission Denied', 'Camera access is required.');
//         return false;
//       }
//     } catch (err) {
//       return false;
//     }
//   }
//   return true;
// };

// const QuarterlyVisit = ({route}) => {
//   const {farmerId} = route.params;

//   const [currentStatus, setCurrentStatus] = useState('');
//   const [quarterly, setQuarterly] = useState('');
//   const [image, setImage] = useState([]);
//   const [submitDate, setSubmitDate] = useState(
//     new Date().toISOString(),
//   );

//   const handleFormSubmit = async () => {
//     if (!currentStatus || !quarterly) {
//       Alert.alert(
//         'Error',
//         'Please fill all fields and add at least one photo!',
//       );
//       return;
//     }

//     try {
//       const formData = {
//         image: image.map(photo => image.base64),
//         farmerId,
//         currentStatus,
//         quarterly,
//         submitDate,
//       };
      
//       console.log("form Data", formData)

//       const response = await axios.post(
//         'http://88.222.214.93:8001/filedService/addSurvey',
//         formData,
//       );
//       console.log("data" , response.data)
//       Alert.alert('Success', 'Data submitted successfully!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to submit data. Please try again.');
//       console.log(JSON.stringify(error.request))
//     }
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
//           return;
//         } else if (response.errorCode) {
//           return;
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

//             const resizedPhoto = {
//               ...originalPhoto,
//               uri: resizedImage.uri,
//               base64: resizedImage.base64 || originalPhoto.base64,
//             };
//             setImage(prevImages => [...prevImages, resizedPhoto]);
//           } catch (error) {
//             Alert.alert('Error', 'Failed to resize the image.');
//           }
//         }
//       },
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Current State:</Text>
//       <Picker
//         selectedValue={currentStatus}
//         onValueChange={value => setCurrentStatus(value)}
//         style={styles.dropdown}>
//         <Picker.Item label="Select Current State" value="" />
//         <Picker.Item label="Working" value="Working" />
//         <Picker.Item label="Non-Working" value="Non-Working" />
//         <Picker.Item label="Not Found" value="Not Found" />
//       </Picker>

//       <Text style={styles.label}>Quarter Visited:</Text>
//       <Picker
//         selectedValue={quarterly}
//         onValueChange={value => setQuarterly(value)}
//         style={styles.dropdown}>
//         <Picker.Item label="Select Quarter" value="" />
//         <Picker.Item label="Q1" value="Q1" />
//         <Picker.Item label="Q2" value="Q2" />
//         <Picker.Item label="Q3" value="Q3" />
//         <Picker.Item label="Q4" value="Q4" />
//       </Picker>

//       <Text style={styles.label}>Images:</Text>
//       <TouchableOpacity onPress={openGeneralCamera} style={styles.imageButton}>
//         <Icon name="camera-plus" size={28} color="#000" />
//       </TouchableOpacity>

//       <ScrollView horizontal style={styles.imagePreviewContainer}>
//         {image.map((photo, index) => (
//           <View key={index} style={styles.imageWrapper}>
//             <Image source={{uri: photo.uri}} style={styles.imagePreview} />
//             <TouchableOpacity
//               style={styles.deleteButton}
//               onPress={() => {
//                 const updatedPhotos = image.filter((_, i) => i !== index);
//                 setImage(updatedPhotos);
//               }}>
//               <Icon name="close-circle" size={24} color="red" />
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>

//       <TouchableOpacity onPress={handleFormSubmit} style={styles.submitButton}>
//         <Text style={styles.buttonText}>Submit Data</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
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
//   dropdown: {
//     height: 50,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 20,
//     borderRadius: 5,
//     paddingHorizontal: 10,
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
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
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
//     alignItems: 'center',`
//     justifyContent: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default QuarterlyVisit;


import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert('Permission Denied', 'Camera access is required.');
        return false;
      }
    } catch (err) {
      return false;
    }
  }
  return true;
};

const QuarterlyVisit = ({route}) => {
  const {farmerId} = route.params;

  const [currentStatus, setCurrentStatus] = useState('');
  const [quarterly, setQuarterly] = useState('');
  const [image, setImage] = useState([]);
  const [submitDate, setSubmitDate] = useState(new Date().toISOString());

  // const handleFormSubmit = async () => {
  //   if (!currentStatus || !quarterly) {
  //     Alert.alert(
  //       'Error',
  //       'Please fill all fields and add at least one photo!',
  //     );
  //     return;
  //   }

  //   try {
  //     const id = await AsyncStorage.getItem('_id');
      
  //     const formData = {
  //       image: image.map(photo => photo.base64),
  //       farmerId,
  //       currentStatus,
  //       quarterly,
  //       submitDate,
  //       fieldEmpId: id
  //     };

  //     console.log('Form Data:', {
  //       farmerId,
  //       currentStatus,
  //       quarterly,
  //       submitDate,
  //       fieldEmpId: id
  //     });

  //     const response = await axios.post(
  //       'http://88.222.214.93:8001/filedService/addSurvey',
  //       formData,
  //     );

  //     console.log('Response Data:', response.data);
  //     Alert.alert(
  //       'Success',
  //       'Data submitted successfully!',
  //       [
  //         {
  //           text: 'OK',
  //           onPress: () => {
  //             // Reset the form after successful submission
  //             setCurrentStatus('');
  //             setQuarterly('');
  //             setImage([]);
  //             setSubmitDate(new Date().toISOString());
  //           },
  //         },
  //       ],
  //     );
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to submit data. Please try again.');
  //     console.log('Error:', JSON.stringify(error.response));
  //   }
  // };


  const handleFormSubmit = async() => {

    if (!currentStatus || !quarterly) {
      Alert.alert(
        'Error',
        'Please fill all fields and add at least one photo!',
      );
      return;
    }
    
    const id = await AsyncStorage.getItem('_id');
      
    const formData = {
      image: image.map(photo => photo.base64),
      farmerId,
      currentStatus,
      quarterly,
      submitDate,
      fieldEmpId: id
    };

    try {
      const response = await axios.post(
        'http://88.222.214.93:8001/filedService/addSurvey',
        formData,
      );
      console.log('Response Data:', response.data);
      Alert.alert(
        'Success',
        'Data submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset the form after successful submission
              setCurrentStatus('');
              setQuarterly('');
              setImage([]);
              setSubmitDate(new Date().toISOString());
            },
          },
        ],
      );
    } catch (error) {
      console.log('Error', JSON.stringify(error));
      Alert.alert('Error', JSON.stringify(error));
    }
  }

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
          return;
        } else if (response.errorCode) {
          return;
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

            const resizedPhoto = {
              ...originalPhoto,
              uri: resizedImage.uri,
              base64: resizedImage.base64 || originalPhoto.base64,
            };
            setImage(prevImages => [...prevImages, resizedPhoto]);
          } catch (error) {
            Alert.alert('Error', 'Failed to resize the image.');
          }
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current State:</Text>
      <Picker
        selectedValue={currentStatus}
        onValueChange={value => setCurrentStatus(value)}
        style={styles.dropdown}>
        <Picker.Item label="Select Current State" value="" />
        <Picker.Item label="Working" value="Working" />
        <Picker.Item label="Non-Working" value="Non-Working" />
        <Picker.Item label="Not Found" value="Not Found" />
      </Picker>

      <Text style={styles.label}>Quarter Visited:</Text>
      <Picker
        selectedValue={quarterly}
        onValueChange={value => setQuarterly(value)}
        style={styles.dropdown}>
        <Picker.Item label="Select Quarter" value="" />
        <Picker.Item label="Q1" value="Q1" />
        <Picker.Item label="Q2" value="Q2" />
        <Picker.Item label="Q3" value="Q3" />
        <Picker.Item label="Q4" value="Q4" />
      </Picker>

      <Text style={styles.label}>Images:</Text>
      <TouchableOpacity onPress={openGeneralCamera} style={styles.imageButton}>
        <Icon name="camera-plus" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView horizontal style={styles.imagePreviewContainer}>
        {image.map((photo, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{uri: photo.uri}} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                const updatedPhotos = image.filter((_, i) => i !== index);
                setImage(updatedPhotos);
              }}>
              <Icon name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={handleFormSubmit} style={styles.submitButton}>
        <Text style={styles.buttonText}>Submit Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  dropdown: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    borderRadius: 5,
    paddingHorizontal: 10,
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuarterlyVisit;            
