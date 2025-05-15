// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   PermissionsAndroid,
//   Platform,
//   Alert,
// } from 'react-native';
// import { launchCamera } from 'react-native-image-picker';

// const InstallationForm = ({route}) => {
//     const {installationId,farmerSaralId } = route.params;
//   const [saralid, setSaralid] = useState('');
//   const [photos, setPhotos] = useState(Array(9).fill(null));

//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'App needs access to your camera',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const takePhoto = async (index) => {
//     const hasPermission = await requestCameraPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission denied', 'You need to grant camera permissions to take photos');
//       return;
//     }

//     const options = {
//       mediaType: 'photo',
//       quality: 1,
//       saveToPhotos: false,
//     };

//     launchCamera(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else if (response.assets && response.assets[0].uri) {
//         const newPhotos = [...photos];
//         newPhotos[index] = response.assets[0].uri;
//         setPhotos(newPhotos);
//       }
//     });
//   };

//   const handleSubmit = () => {
//     if (!saralid) {
//       Alert.alert('Error', 'Please enter Saralid');
//       return;
//     }

//     if (photos.some(photo => photo === null)) {
//       Alert.alert('Error', 'Please take all 9 photos');
//       return;
//     }

//     // Here you would typically send the data to your backend
//     console.log('Submitting:', { saralid, photos });
//     Alert.alert('Success', 'Form submitted successfully!');
    
//     // Reset form
//     setSaralid('');
//     setPhotos(Array(9).fill(null));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Installation Form</Text>
      
//       {/* Saralid Field */}
//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Saralid:</Text>
//         <TextInput
//           style={styles.input}
//           value={saralid}
//           onChangeText={setSaralid}
//           placeholder="Enter Saralid"
//         />
//       </View>
      
//       {/* Photo Grid */}
//       <Text style={styles.label}>Take 9 Photos:</Text>
//       <View style={styles.photoGrid}>
//         {photos.map((photo, index) => (
//           <TouchableOpacity 
//             key={index} 
//             style={styles.photoButton}
//             onPress={() => takePhoto(index)}
//           >
//             {photo ? (
//               <Image source={{ uri: photo }} style={styles.photo} />
//             ) : (
//               <Text style={styles.photoPlaceholder}>Photo {index + 1}</Text>
//             )}
//           </TouchableOpacity>
//         ))}
//       </View>
      
//       {/* Submit Button */}
//       <Button 
//         title="Submit Installation" 
//         onPress={handleSubmit}
//         disabled={!saralid || photos.some(photo => photo === null)}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     fontWeight: 'bold',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   photoGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   photoButton: {
//     width: '32%',
//     aspectRatio: 1,
//     backgroundColor: '#f0f0f0',
//     marginBottom: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   photoPlaceholder: {
//     color: '#666',
//   },
//   photo: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 5,
//   },
// });

// export default InstallationForm;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InstallationForm = ({route}) => {
    const {installationId, farmerSaralId } = route.params;
    const [saralid, setSaralid] = useState(farmerSaralId || '');
    const [photos, setPhotos] = useState(Array(9).fill(null));
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'App needs access to your camera',
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
        }
        return true;
    };

    const takePhoto = async (index = currentPhotoIndex) => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert('Permission denied', 'You need to grant camera permissions to take photos');
            return;
        }

        const options = {
            mediaType: 'photo',
            quality: 1,
            saveToPhotos: false,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.assets && response.assets[0].uri) {
                const newPhotos = [...photos];
                newPhotos[index] = response.assets[0].uri;
                setPhotos(newPhotos);
                
                // Move to next empty photo if available
                if (index === currentPhotoIndex) {
                    const nextEmptyIndex = newPhotos.findIndex((photo, i) => i > index && photo === null);
                    if (nextEmptyIndex !== -1) {
                        setCurrentPhotoIndex(nextEmptyIndex);
                    }
                }
            }
        });
    };

    const deletePhoto = (index) => {
        const newPhotos = [...photos];
        newPhotos[index] = null;
        setPhotos(newPhotos);
        setCurrentPhotoIndex(index); // Set focus to the deleted photo's position
    };

    const handleSubmit = () => {
        if (!saralid) {
            Alert.alert('Error', 'Please enter Saralid');
            return;
        }

        if (photos.some(photo => photo === null)) {
            Alert.alert('Error', 'Please take all 9 photos');
            return;
        }

        // Here you would typically send the data to your backend
        console.log('Submitting:', { saralid, photos, installationId });
        Alert.alert('Success', 'Form submitted successfully!');
        
        // Reset form
        setSaralid('');
        setPhotos(Array(9).fill(null));
        setCurrentPhotoIndex(0);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Installation Form</Text>
            
            {/* Saralid Field */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Saralid:</Text>
                <TextInput
                    style={styles.input}
                    value={saralid}
                    onChangeText={setSaralid}
                    placeholder="Enter Saralid"
                    editable={!farmerSaralId}
                />
            </View>
            
            {/* Current Photo Status */}
            <Text style={styles.statusText}>
                {photos[currentPhotoIndex] 
                    ? `Photo ${currentPhotoIndex + 1} taken` 
                    : `Ready for photo ${currentPhotoIndex + 1}`}
            </Text>
            
            {/* Photo Grid - 3x3 Grid */}
            <View style={styles.photoGridContainer}>
                {[0, 1, 2].map((row) => (
                    <View key={row} style={styles.photoRow}>
                        {[0, 1, 2].map((col) => {
                            const index = (row * 3) + col;
                            return (
                                <View key={index} style={styles.photoCell}>
                                    <TouchableOpacity 
                                        style={[
                                            styles.photoContainer,
                                            index === currentPhotoIndex && styles.activePhotoContainer,
                                        ]}
                                        onPress={() => setCurrentPhotoIndex(index)}
                                        activeOpacity={0.7}
                                    >
                                        {photos[index] ? (
                                            <>
                                                <Image 
                                                    source={{ uri: photos[index] }} 
                                                    style={styles.photo} 
                                                />
                                                <TouchableOpacity 
                                                    style={styles.deleteButton}
                                                    onPress={() => deletePhoto(index)}
                                                >
                                                    <Icon name="close" size={20} color="white" />
                                                </TouchableOpacity>
                                            </>
                                        ) : (
                                            <View style={styles.photoPlaceholder}>
                                                <Text style={styles.photoNumber}>{index + 1}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    <Text style={styles.photoLabel}>Photo {index + 1}</Text>
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>
            
            {/* Take Photo Button */}
            <View style={styles.actionButton}>
                <Button 
                    title={`Take Photo ${currentPhotoIndex + 1}`}
                    onPress={() => takePhoto()}
                    color="#4CAF50"
                />
            </View>
            
            {/* Submit Button */}
            <View style={styles.actionButton}>
                <Button 
                    title="Submit Installation" 
                    onPress={handleSubmit}
                    disabled={!saralid || photos.some(photo => photo === null)}
                    color="#2196F3"
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        marginBottom: 20,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
        backgroundColor: '#e3f2fd',
        padding: 10,
        borderRadius: 5,
    },
    photoGridContainer: {
        marginBottom: 20,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        elevation: 2,
    },
    photoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    photoCell: {
        alignItems: 'center',
        width: '30%',
    },
    photoContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
        position: 'relative',
    },
    activePhotoContainer: {
        borderColor: '#2196F3',
        borderWidth: 2,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e9e9e9',
    },
    photoNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#999',
    },
    photoLabel: {
        marginTop: 5,
        fontSize: 12,
        color: '#666',
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        marginVertical: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
});

export default InstallationForm;