// import React, { useState, useEffect } from 'react';
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
//   ActivityIndicator,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import axios from 'axios';
// import { launchCamera } from 'react-native-image-picker';
// import ImageResizer from 'react-native-image-resizer';
// import AsyncStorage from '@react-native-async-storage/async-storage';
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

//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       Alert.alert('Error', 'Failed to request camera permission.');
//       return false;
//     }
//   }
//   return true;
// };

// const QuarterlyVisit = ({ route }) => {
//   const { farmerId } = route.params;
//   const [currentStatus, setCurrentStatus] = useState('');
//   const [quarterly, setQuarterly] = useState('');
//   const [image, setImage] = useState([]);
//   const [submitDate, setSubmitDate] = useState(new Date().toISOString());
//   const [companyList, setCompanyList] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await axios.get(
//           'http://88.222.214.93:8001/common/showCompany',
//         );
//         console.log('Response:', response.data);
//         setCompanyList(response.data.data);
//       } catch (error) {
//         console.log('Error fetching company list:', error);
//         Alert.alert("Error", JSON.stringify(error.response.data?.message));
//       }
//     };

//     fetchCompanies();
//   }, []);

//   const handleFormSubmit = async () => {
//     if (!currentStatus || !quarterly || !selectedCompany || image.length === 0) {
//       Alert.alert('Error', 'Please fill all fields!');
//       return;
//     }

//     setIsSubmitting(true); 

//     const imageBase64 = image
//       .map(photo =>
//         photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null,
//       )
//       .filter(Boolean);

//     try {
//       const userId = await AsyncStorage.getItem('_id');
//       const formData = {
//         image: imageBase64,
//         farmerId,
//         currentStatus,
//         quarterly,
//         submitDate,
//         fieldEmpId: userId,
//         companyName: selectedCompany,
//       };
//       console.log(formData)
//       const response = await axios.post(
//         'http://88.222.214.93:8001/filedService/addSurvey',
//         formData,
//       );

//       console.log("response data", response)
//       Alert.alert('Success', 'Data submitted successfully!', [
//         {
//           text: 'OK',
//           onPress: () => {
//             setCurrentStatus('');
//             setQuarterly('');
//             setImage([]);
//             setSelectedCompany('');
//             setSubmitDate(new Date().toISOString());
//             setIsSubmitting(false); 
//           },
//         },
//       ]);
//     } catch (error) {
//       console.log('Error submitting form:', error);
//       Alert.alert("Error", JSON.stringify(error.response.data?.message));
//       setIsSubmitting(false); 
      
//     }
//   };

//   const openGeneralCamera = async () => {
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
//                 800,
//                 800,
//                 'JPEG', 
//                 80, 
//                 0, 
//                 null, 
//               );
  
//               const fileStats = await RNFS.stat(resizedImage.uri);
//               const fileSizeInKB = (fileStats.size / 1024).toFixed(2); 
  
//               console.log(`Resized image size: ${fileSizeInKB} KB`);
  
           
//               const resizedPhoto = {
//                 ...originalPhoto,
//                 uri: resizedImage.uri,
//                 base64: resizedImage.base64 || originalPhoto.base64,
//               };
//               setImage(prevImages => [...prevImages, resizedPhoto]);
//             } catch (error) {
//               console.log('Error resizing image:', error.message);
//               Alert.alert('Error', 'Failed to resize the image.');
//             }
//           }
//         },
//       );
//     };
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Company Name:</Text>
//       <Picker
//         selectedValue={selectedCompany}
//         onValueChange={(value) => setSelectedCompany(value)}
//         style={styles.dropdown}>
//         <Picker.Item label="Select Company" value="" style = {{color:'black'}} />
//         {companyList.map(({_id, name}, index) => (
//           <Picker.Item key={_id} label={name} value={_id} />
//         ))}
//       </Picker>

//       <Text style={styles.label}>Current State:</Text>
//       <Picker
//         selectedValue={currentStatus}
//         onValueChange={(value) => setCurrentStatus(value)}
//         style={styles.dropdown}>
//         <Picker.Item label="Select Current State" value="" />
//         <Picker.Item label="Working" value="Working" />
//         <Picker.Item label="Non-Working" value="Non-Working" />
//         <Picker.Item label="Not Found" value="Not Found" />
//       </Picker>

//       <Text style={styles.label}>Quarter Visited:</Text>
//       <Picker
//         selectedValue={quarterly}
//         onValueChange={(value) => setQuarterly(value)}
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
//             <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
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

//       <TouchableOpacity
//         onPress={!isSubmitting && handleFormSubmit}
//         style={[styles.submitButton, isSubmitting && { backgroundColor: 'gray' }]}
//         disabled={isSubmitting}>
//         {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Data</Text>}
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
//     color: 'black'
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
// });

// export default QuarterlyVisit;


import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES // Android 13+
      ]);

      return (
        granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to request camera permission.');
      return false;
    }
  }
  return true;
};

const QuarterlyVisit = ({ route }) => {
  const { farmerId, farmerName, saralId } = route.params;
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      currentStatus: '',
      quarterly: '',
      selectedCompany: '',
    }
  });

  const [quarterlyPhoto, setQuarterlyPhoto] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitDate = new Date().toISOString();

  const currentStatus = watch('currentStatus');
  const quarterly = watch('quarterly');
  const selectedCompany = watch('selectedCompany');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          'http://88.222.214.93:8001/common/showCompany'
        );
        if (Array.isArray(response.data.data)) {
          setCompanyList(response.data.data);
        } else {
          setCompanyList([]);
        }
      } catch (error) {
        console.log('Error fetching company list:', error);
        Alert.alert("Error", error.response?.data?.message || "Failed to fetch companies");
      }
    };

    fetchCompanies();
  }, []);

  const takePhoto = async () => {
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
      async (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.log('Camera Error:', response.errorMessage);
          Alert.alert('Error', 'Failed to capture image');
        } else if (response.assets?.[0]?.uri) {
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

            const uri = Platform.OS === 'android' && !resizedImage.uri.startsWith('file://')
              ? `file://${resizedImage.uri}`
              : resizedImage.uri;

            const newImage = {
              uri,
              type: originalPhoto.type || 'image/jpeg',
              name: `photo_${Date.now()}.jpg`
            };

            setQuarterlyPhoto(prev => [...prev, newImage]);
          } catch (error) {
            console.log('Error processing image:', error);
            Alert.alert('Error', 'Failed to process image');
          }
        }
      },
    );
  };

  const removeImage = (uri) => {
    setQuarterlyPhoto(prev => prev.filter(img => img.uri !== uri));
  };

  const onSubmit = async () => {
    if (quarterlyPhoto.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = await AsyncStorage.getItem('_id');

      const formData = new FormData();
      formData.append('farmerId', farmerId);
      formData.append('currentStatus', currentStatus);
      formData.append('quarterly', quarterly);
      formData.append('submitDate', submitDate);
      formData.append('fieldEmpId', userId);
      formData.append('companyName', selectedCompany);

      quarterlyPhoto.forEach((image, index) => {
        formData.append('quarterlyPhoto', {
          uri: image.uri,
          type: image.type,
          name: image.name || `image_${index}.jpg`
        });
      });

      console.log("Form Data:", formData);

      await axios.post(
        'http://88.222.214.93:8001/filedService/quarterlySurvey',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('Success', 'Data submitted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setValue('currentStatus', '');
            setValue('quarterly', '');
            setValue('selectedCompany', '');
            setQuarterlyPhoto([]);
          },
        },
      ]);
    } catch (error) {
      console.log('Error submitting form:', error);
      Alert.alert("Error", error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Farmer Name:</Text>
          <Text style={styles.value}>{farmerName || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Saral Id:</Text>
          <Text style={styles.value}>{saralId || 'N/A'}</Text>
        </View>

        <Text style={styles.label}>Company Name:</Text>
        <Controller
          control={control}
          name="selectedCompany"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.dropdown}
            >
              <Picker.Item label="Select Company" value="" style={{ color: 'black' }} />
              {companyList.map(({ _id, name }) => (
                <Picker.Item key={_id} label={name} value={_id} />
              ))}
            </Picker>
          )}
        />
        {errors.selectedCompany && <Text style={styles.errorText}>Company is required</Text>}

        <Text style={styles.label}>Current Status:</Text>
        <Controller
          control={control}
          name="currentStatus"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.dropdown}
            >
              <Picker.Item label="Select Current Status" value="" />
              <Picker.Item label="Working" value="Working" />
              <Picker.Item label="Non-Working" value="Non-Working" />
              <Picker.Item label="Not Found" value="Not Found" />
            </Picker>
          )}
        />
        {errors.currentStatus && <Text style={styles.errorText}>Current status is required</Text>}

        <Text style={styles.label}>Quarter Visited:</Text>
        <Controller
          control={control}
          name="quarterly"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.dropdown}
            >
              <Picker.Item label="Select Quarter" value="" />
              <Picker.Item label="Q1" value="Q1" />
              <Picker.Item label="Q2" value="Q2" />
              <Picker.Item label="Q3" value="Q3" />
              <Picker.Item label="Q4" value="Q4" />
            </Picker>
          )}
        />
        {errors.quarterly && <Text style={styles.errorText}>Quarter is required</Text>}

        <Text style={styles.label}>Quarterly Form Images:</Text>
        <TouchableOpacity onPress={takePhoto} style={styles.imageButton}>
          <Icon name="camera-plus" size={28} color="#000" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <ScrollView horizontal style={styles.imagePreviewContainer}>
          {quarterlyPhoto.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeImage(image.uri)}>
                <Icon name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[styles.submitButton, isSubmitting && { backgroundColor: 'gray' }]}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Data</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: 'black',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'black'
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 15,
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
    borderWidth: 1,
    borderColor: '#ddd',
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
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default QuarterlyVisit;
