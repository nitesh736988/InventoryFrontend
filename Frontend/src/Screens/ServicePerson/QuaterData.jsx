// import React, {useState} from 'react';
// import {View, Text, StyleSheet, TextInput, Button, Alert,TouchableOpacity,ScrollView} from 'react-native';
// import {Picker} from '@react-native-picker/picker';
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

// const QuarterVisit = () => {
//   const [currentState, setCurrentState] = useState('');
//   const [quarterVisited, setQuarterVisited] = useState('');
//   const [photos, setPhotos] = useState([]);

//   const handleFormSubmit = () => {
//     if (!currentState || !quarterVisited || !formSubmitDate) {
//       Alert.alert('Error', 'Please fill all fields before submitting!');
//       return;
//     }
//     Alert.alert(
//       'Form Submitted',
//       `Current State: ${currentState}\nQuarter Visited: ${quarterVisited}\nForm Submit Date: ${formSubmitDate}`,
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
//             console.error('Error resizing image:', error.message);
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
//         selectedValue={currentState}
//         onValueChange={value => setCurrentState(value)}
//         style={styles.dropdown}>
//         <Picker.Item label="Select Current State" value="" />
//         <Picker.Item label="Working" value="Working" />
//         <Picker.Item label="Non-Working" value="Non-Working" />
//         <Picker.Item label="Not Found" value="Not Found" />
//       </Picker>

//       <Text style={styles.label}>Quarter Visited:</Text>
//       <Picker
//         selectedValue={quarterVisited}
//         onValueChange={value => setQuarterVisited(value)}
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

//       <TouchableOpacity style={styles.submitButton}>
//         <Text style={styles.buttonText}>Submit</Text>
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
//   },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     backgroundColor: '#fff',
//   },
// });

// export default QuarterVisit;


import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const QuaterData = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchData = async (pageNum = page) => {
    const serviceBlock = await AsyncStorage.getItem('block'); 
    const convertedData = JSON.parse(serviceBlock);
    const dataToSend = {
      block: convertedData,
      page: pageNum,
      limit
    }
    // console.log(convertedData);
    console.log("data", dataToSend )
    try {
      setLoading(true);
      
      const response = await axios.post(
        `http://88.222.214.93:8001/filedService/quarterlyList`, dataToSend
      );
      // console.log("data reponse", response.data.data);
      setData(response.data.data);
      setPage(pageNum);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data'); 
      console.log(JSON.stringify(error.response));
    } finally {
      setLoading(false);
    }
  };
  
  const handleNextPage = () => {
    fetchData(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      fetchData(page - 1);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  const renderItem = ({ item }) => (
    <View style={styles.dataItem}>
      <View style={{...styles.dataText, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.label}>Saral ID: {item.saralId}</Text> 
        <TouchableOpacity
            onPress={() => navigation.navigate('QuarterlyVisit', {farmerId: item?._id,})}
          >
            <Text style={styles.approvedText}>Fill Form</Text>
          </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <View>
          <Text style={styles.label}>Farmer Name:</Text> 
        </View>
        <View style={styles.ellipse}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.farmerName}
          </Text>
        </View>
      </View>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Contact:</Text> {item.contact}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>State:</Text> {item.state}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>District:</Text> {item.district}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Block:</Text> {item.block}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Quarterly Data:</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}

      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          style={[styles.pageButton, page === 1 && styles.disabledButton]}
          disabled={page === 1}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>Page: {page}</Text>
        <TouchableOpacity onPress={handleNextPage} style={styles.pageButton}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
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
    color: '#333',
  },

  approvedText: {
    color: 'green',
    fontWeight: 'bold',
  },

  ellipse: {
    width: 100, 
  },
  
  dataItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  dataText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#444',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuaterData;

