// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
// import { launchCamera } from 'react-native-image-picker';
// import {API_URL} from '@env';
// import axios from 'axios';
// import ApprovedData from './ApprovedData';
// import {useNavigation} from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const InstallationPart = ( { route } ) => {
//   const { pickupItemId } = route.params;
//   console.log(pickupItemId);
//   const [installationData, setInstallationData] = useState(null);
//   const [images, setImages] = useState([]);
//   const [longitude, setLongitude] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchInstallationData = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/service-person/get-pickupItem-data?pickupItemId=${pickupItemId}`);
//         console.log(response.data.data);
//         setInstallationData(response.data.data);

//       } catch (error) {
//         console.log('Error fetching installation data:', error.response.data);
//       }
//     };

//     fetchInstallationData();
//   }, []);

//   const openCamera = () => {
//     launchCamera(
//       {
//         mediaType: 'photo',
//         cameraType: 'back',
//         quality: 1,
//       },
//       response => {
//         if (response.didCancel) {
//           console.log('User cancelled camera picker');
//         } else if (response.errorCode) {
//           console.log('Camera Error: ', response.errorMessage);
//         } else {
//           setImages(prevImages => [...prevImages, response.assets[0].uri]);
//         }
//       }
//     );
//   };

//   const handleSubmit = async () => {
//     if (!latitude || !longitude || images.length === 0) {
//       alert('Please fill in latitude, longitude, and add at least one image.');
//     }
//     }

//   if (!installationData) {
//     return <Text>Loading...</Text>;
//   }

//   const {
//     farmerName,
//     farmerContact,
//     farmerVillage,
//     items,
//     serialNumber,
//   } = installationData;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Installation Pending</Text>

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
//         keyboardType="phone-pad"
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
//           items.map(({ _id, itemName, quantity }) => (
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
//       <Text style={styles.label}>Longitude:</Text>
//       <TextInput
//         style={styles.input}
//         value={longitude}
//         onChangeText={setLongitude}
//         placeholder="Enter Longitude"
//       />

//       <Text style={styles.label}>Latitude:</Text>
//       <TextInput
//         style={styles.input}
//         value={latitude}
//         onChangeText={setLatitude}
//         placeholder="Enter Latitude"
//       />

//       <Text style={styles.label}>Installation Images:</Text>
//       <TouchableOpacity onPress={openCamera} style={styles.imageButton}>
//       <Icon name="camera-plus" size={28} color="#000" />
//       </TouchableOpacity>

//       <ScrollView horizontal style={styles.imagePreviewContainer}>
//         {images.map((imageUri, index) => (
//           <Image key={index} source={{ uri: imageUri }} style={styles.imagePreview} />
//         ))}
//       </ScrollView>

//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Submit</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.submitButton} onPress={() => navigation.goBack(ApprovedData)}>
//         <Text style={styles.buttonText}>Close</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fbd33b' },
//   header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
//   label: { fontSize: 16, marginBottom: 4, color: '#555' },

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
//   disabledButton: {
//     backgroundColor: '#A9A9A9',
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   nonEditable: { backgroundColor: '#e9ecef', color: '#6c757d' },
//   subHeader: { fontSize: 20, fontWeight: '600', marginTop: 16, marginBottom: 8 },
//   itemContainer: { marginBottom: 16 },
//   infoText: { fontSize: 16, color: '#333', marginBottom: 4 },
//   imageButton: {
//     padding: 10,
//     marginBottom: 12,
//     borderRadius: 8,
//     alignItems: 'start',
//   },
//   buttonText: { color: '#fff', fontSize: 16 },
//   imagePreviewContainer: { marginTop: 16 },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     marginRight: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
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
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {API_URL} from '@env';
import axios from 'axios';
import ApprovedData from './ApprovedData';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const InstallationPart = ({route}) => {
  const {pickupItemId} = route.params;
  const [installationData, setInstallationData] = useState(null);
  const [images, setImages] = useState([]);
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchInstallationData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/service-person/get-pickupItem-data?pickupItemId=${pickupItemId}`
        );
        setInstallationData(response.data.data);
      } catch (error) {
        console.log('Error fetching installation data:', error.response?.data || error.message);
      }
    };

    fetchInstallationData();
  }, []); // Dependency array ensures this runs only once

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled camera picker');
        } else if (response.assets && response.assets.length > 0) {
          setImages(prevImages => [...prevImages, response.assets[0].uri]);
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (!latitude || !longitude || images.length === 0) {
      alert('Please fill in latitude, longitude, and add at least one image.');
      return;
    }

    const data = {
      latitude,
      longitude,
      images,
      pickupItemId,
    };

    try {
      const response = await axios.post(
        `${API_URL}/service-person/new-installation-data`,
        data,
        {
          headers: {'Content-Type': 'application/json'},
        }
      );

      if (response.data.success) {
        alert('Installation data submitted successfully.');
        navigation.goBack();
      } else {
        alert('Failed to submit installation data.');
      }
    } catch (error) {
      console.log(
        'Error submitting installation data:',
        error.response?.data || error.message
      );
      alert('An error occurred while submitting the data.');
    }
  };

  if (!installationData) {
    return <Text>Loading...</Text>;
  }

  const {farmerName, farmerContact, farmerVillage, items, serialNumber, installedBy, installationDate} = installationData;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Installation Pending</Text>

      <Text style={styles.label}>Farmer Name:</Text>
      <TextInput style={[styles.input, styles.nonEditable]} value={farmerName} editable={false} />

      <Text style={styles.label}>Farmer Contact:</Text>
      <TextInput style={[styles.input, styles.nonEditable]} value={farmerContact.toString()} editable={false} />

      <Text style={styles.label}>Farmer Village:</Text>
      <TextInput style={[styles.input, styles.nonEditable]} value={farmerVillage} editable={false} />

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
      <TextInput style={[styles.input, styles.nonEditable]} value={serialNumber} editable={false} />

      {installedBy && <Text style={styles.infoText}>Installed By: {installedBy}</Text>}
      {installationDate && <Text style={styles.infoText}>Installation Date: {new Date(installationDate).toLocaleDateString()}</Text>}

      <Text style={styles.label}>Longitude:</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        placeholder="Enter Longitude"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Latitude:</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        placeholder="Enter Latitude"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Installation Images:</Text>
      <TouchableOpacity onPress={openCamera} style={styles.imageButton}>
        <Icon name="camera-plus" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView horizontal style={styles.imagePreviewContainer}>
        {images.map((imageUri, index) => (
          <Image key={index} source={{uri: imageUri}} style={styles.imagePreview} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={() => navigation.goBack(ApprovedData)}>
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
  },
  label: {fontSize: 16, marginBottom: 4, color: '#555'},

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  submitButton: {
    backgroundColor: '#070604',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  nonEditable: {backgroundColor: '#e9ecef', color: '#6c757d'},
  subHeader: {fontSize: 20, fontWeight: '600', marginTop: 16, marginBottom: 8},
  itemContainer: {marginBottom: 16},
  infoText: {fontSize: 16, color: '#333', marginBottom: 4},
  imageButton: {
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'start',
  },
  buttonText: {color: '#fff', fontSize: 16},
  imagePreviewContainer: {marginTop: 16},
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default InstallationPart;
