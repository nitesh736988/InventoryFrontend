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
// import {useForm, Controller} from 'react-hook-form';
// import axios from 'axios';
// import {Picker} from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import Geolocation from '@react-native-community/geolocation';
// import {PermissionsAndroid} from 'react-native';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Video } from 'react-native-compressor';
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
//     HP,
//     AC_DC,
//     village,
//   } = route.params;

//   console.log('Route params:', route.params);

//   const {
//     control,
//     handleSubmit,
//     formState: {errors},
//     watch,
//     setValue,
//   } = useForm({
//     defaultValues: {
//       rmuNumber: '',
//       controllerNumber: '',
//       simNumber: '',
//       remarks: '',
//       farmerItemRemarks: '',
//       selectedStage: '',
//     },
//   });

//   const [installationData, setInstallationData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [stageOptions, setStageOptions] = useState([]);
//   const [photos, setPhotos] = useState({});
//   const [serviceVideo, setServiceVideo] = useState(null);
//   const [videoCompressing, setVideoCompressing] = useState(false);
//   const [videoInfo, setVideoInfo] = useState({size: 0, duration: 0});
//   const navigation = useNavigation();
//   const [longitude, setLongitude] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [selected, setSelected] = useState(null);
//   const [isButtonHidden, setIsButtonHidden] = useState(false);

//   const selectedStage = watch('selectedStage');
//   const showRemarks = selectedStage !== '';
//   const isPendingSelected = selectedStage === '675be30222ae6f63bf772dcf';
//   const isResolvedSelected = selectedStage === '675be30222ae6f63bf772dd0';

//   const fileCategories = {
//     finalFoundation: 'Final Foundation Image With Farmer',
//     panelPhoto: 'Photograph With Panel + Structure',
//     photoWithWater: 'Photograph With Water Discharge',
//     photoWithController: 'Photograph with Controller',
//     simPhoto: 'SIM Photo',
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
//           error.response?.data?.message || error.message,
//         );
//         Alert.alert('Error fetching data:',
//           error.response?.data?.message || error.message,);
//       } finally {
//         setLoading(false);
//       }
//     };
//     initialize();
//   }, []);

//   const takePhoto = async category => {
//     try {
//       const hasPermission = await requestCameraPermission();
//       if (!hasPermission) {
//         Alert.alert('Permission Denied', 'Camera access is required.');
//         return;
//       }

//       launchCamera(
//         {
//           mediaType: 'photo',
//           cameraType: 'back',
//           quality: 0.8,
//           includeBase64: false,
//         },
//         response => {
//           if (response.didCancel) {
//             console.log('User cancelled camera');
//           } else if (response.errorCode) {
//             console.log('Camera Error:', response.errorMessage);
//             Alert.alert('Error', 'Failed to capture image');
//           } else if (response.assets?.[0]?.uri) {
//             const photoUri = response.assets[0].uri;
//             setPhotos(prev => ({
//               ...prev,
//               [category]: [...(prev[category] || []), photoUri],
//             }));
//           }
//         },
//       );
//     } catch (error) {
//       console.log('Camera error:', error);
//       Alert.alert('Error', 'Failed to open camera');
//     }
//   };

//   const handleVideoSelection = async () => {
//     try {
//       const options = {
//         mediaType: 'video',
//         videoQuality: 'high',
//         durationLimit: 300,
//       };

//       const response = await launchImageLibrary(options);

//       if (response.didCancel) {
//         console.log('User cancelled video selection');
//         return;
//       }

//       if (response.errorCode) {
//         console.log('Video Error:', response.errorMessage);
//         Alert.alert('Error', 'Failed to select video');
//         return;
//       }

//       if (response.assets?.[0]?.uri) {
//         setVideoCompressing(true);
//         const videoUri = response.assets[0].uri;
//         const duration = response.assets[0].duration || 0;

//         try {
//           // Get original file size
//           const stat = await RNFS.stat(videoUri);
//           const originalSizeMB = stat.size / (1024 * 1024);
//           setVideoInfo({size: originalSizeMB, duration});

//           // Show info about the selected video
//           Alert.alert(
//             'Video Selected',
//             `Original size: ${originalSizeMB.toFixed(2)}MB\nDuration: ${Math.round(duration / 60)}min ${Math.round(duration % 60)}sec\n\nCompressing to ~6MB...`
//           );

//           // Calculate compression ratio based on original size
//           let compressionRatio = 1;
//           if (originalSizeMB > 50) {
//             compressionRatio = 0.1; // 10% of original for very large files
//           } else if (originalSizeMB > 20) {
//             compressionRatio = 0.15; // 15% of original for large files
//           } else if (originalSizeMB > 10) {
//             compressionRatio = 0.2; // 20% of original for medium files
//           } else {
//             compressionRatio = 0.3; // 30% of original for smaller files
//           }

//           // Calculate target bitrate (aim for ~6MB file)
//           const targetSizeBytes = 6 * 1024 * 1024; // 6MB in bytes
//           const calculatedBitrate = Math.floor((targetSizeBytes * 8) / duration); // bits per second

//           // Compress the video with calculated settings
//           const compressedUri = await Video.compress(
//             videoUri,
//             {
//               compressionMethod: 'auto',
//               maxSize: 640, // Reduce resolution to 640px width
//               bitrate: calculatedBitrate > 500000 ? 500000 : calculatedBitrate, // Cap at 500kbps
//             },
//             progress => {
//               console.log('Compression progress: ', progress);
//             },
//           );

//           // Check compressed file size
//           const compressedStat = await RNFS.stat(compressedUri);
//           const compressedSizeMB = compressedStat.size / (1024 * 1024);

//           setServiceVideo(compressedUri);
//           setVideoInfo(prev => ({...prev, compressedSize: compressedSizeMB}));

//           Alert.alert(
//             'Success',
//             `Video compressed successfully!\nOriginal: ${originalSizeMB.toFixed(2)}MB\nCompressed: ${compressedSizeMB.toFixed(2)}MB`
//           );
//         } catch (compressionError) {
//           console.log('Compression error:', compressionError);
//           Alert.alert('Error', 'Failed to compress video. Please try a shorter video.');
//         } finally {
//           setVideoCompressing(false);
//         }
//       }
//     } catch (error) {
//       console.log('Video selection error:', error.message);
//       Alert.alert('Error', 'Failed to select video');
//       setVideoCompressing(false);
//     }
//   };

//   const removePhoto = (category, uri) => {
//     setPhotos(prev => ({
//       ...prev,
//       [category]: prev[category].filter(photo => photo !== uri),
//     }));
//   };

//   const removeVideo = () => {
//     setServiceVideo(null);
//     setVideoInfo({size: 0, duration: 0});
//   };

//   const handleResolvedSelection = option => {
//     setSelected(option);
//     if (option === 'Yes') {
//       navigation.navigate('InstallationStock');
//     } else {
//       setValue('farmerItemRemarks', '');
//     }
//   };

//   const handleSelection = option => {
//     setSelected(option);
//     if (option === 'Yes') {
//       navigation.navigate('InOrder', {
//         id: complaintId,
//         name: farmerName,
//         farmerContact,
//         saralId,
//         farmerName,
//         village,
//       });
//     } else {
//       setValue('farmerItemRemarks', '');
//     }
//   };

//   const onSubmit = async data => {
//     const serviceId = await AsyncStorage.getItem('_id');

//     if (!selectedStage) {
//       Alert.alert('Error', 'Please select a stage.');
//       return;
//     }

//     if (showRemarks && !data.remarks.trim()) {
//       Alert.alert('Error', 'Remarks are required.');
//       return;
//     }

//     if (!data.rmuNumber.trim()) {
//       Alert.alert('Error', 'RMU Number is required.');
//       return;
//     }

//     if (!data.simNumber.trim()) {
//       Alert.alert('Error', 'SIM Number is required.');
//       return;
//     }

//     // Check if video exists and is under 10MB (slightly higher limit for safety)
//     if (serviceVideo) {
//       try {
//         const stat = await RNFS.stat(serviceVideo);
//         const videoSizeMB = stat.size / (1024 * 1024);
//         if (videoSizeMB > 10) {
//           Alert.alert('Error', 'Video is too large after compression. Please try again with a shorter video.');
//           return;
//         }
//       } catch (error) {
//         console.log('Error checking video size:', error);
//         Alert.alert('Error', 'Failed to verify video size.');
//         return;
//       }
//     }

//     const formData = new FormData();
//     formData.append('fieldEmpID', serviceId);
//     formData.append('complaintId', complaintId);
//     formData.append('stageId', selectedStage);
//     formData.append('remarks', data.remarks);
//     formData.append('rmuNumber', data.rmuNumber);
//     formData.append('controllerNumber', data.controllerNumber);
//     formData.append('simNumber', data.simNumber);
//     formData.append('longitude', longitude);
//     formData.append('latitude', latitude);
//     formData.append('farmerItemRemarks', data.farmerItemRemarks || '');

//     Object.entries(photos).forEach(([category, uris]) => {
//       uris.forEach((uri, index) => {
//         formData.append(category, {
//           uri,
//           type: 'image/jpeg',
//           name: `${category}_${index}.jpg`,
//         });
//       });
//     });

//     if (serviceVideo) {
//       formData.append('serviceVideo', {
//         uri: serviceVideo,
//         type: 'video/mp4',
//         name: 'service_video.mp4',
//       });
//     }

//     try {
//       setSubmitting(true);
//       const response = await axios.put(
//         `https://service.galosolar.com/api/filedService/complaintUpdateWithMulter`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           timeout: 60000,
//         },
//       );

//       if (response.status === 200) {
//         Alert.alert(response?.data?.message);
//         navigation.goBack();
//       }
//     } catch (error) {
//       // console.log('Error submitting form:',error.response?.data?.message || error.message);
//       Alert.alert('Error',error?.response?.data?.message || error.message)
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // if (!installationData) {
//   //   return (
//   //     <View style={styles.loaderContainer}>
//   //       <Text style={styles.errorText}>Unable to load complaint data.</Text>
//   //     </View>
//   //   );
//   // }

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   // if (!installationData) {
//   //   return (
//   //     <View style={styles.loaderContainer}>
//   //       <Text style={styles.errorText}>Unable to load complaint data.</Text>
//   //     </View>
//   //   );
//   // }

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

//         {/* <View style={styles.row}>
//           <Text style={styles.label}>Product Type:</Text>
//           <Text style={styles.value}>
//             {`${pump_type || 'N/A'} | ${HP || 'N/A'} | ${AC_DC || 'N/A'}`}
//           </Text>
//         </View> */}

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
//       <Controller
//         control={control}
//         rules={{required: true}}
//         render={({field: {onChange, onBlur, value}}) => (
//           <TextInput
//             style={styles.input}
//             onBlur={onBlur}
//             onChangeText={onChange}
//             value={value}
//             placeholder="Enter RMU Number"
//             placeholderTextColor={'#000'}
//           />
//         )}
//         name="rmuNumber"
//       />
//       {errors.rmuNumber && (
//         <Text style={styles.errorText}>This field is required</Text>
//       )}

//       <Text style={styles.label}>Controller Number:</Text>
//       <Controller
//         control={control}
//         render={({field: {onChange, onBlur, value}}) => (
//           <TextInput
//             style={styles.input}
//             onBlur={onBlur}
//             onChangeText={onChange}
//             value={value}
//             placeholder="Enter Controller Number"
//             placeholderTextColor={'#000'}
//           />
//         )}
//         name="controllerNumber"
//       />

//       <Text style={styles.label}>SIM Number:</Text>
//       <Controller
//         control={control}
//         rules={{required: true}}
//         render={({field: {onChange, onBlur, value}}) => (
//           <TextInput
//             style={styles.input}
//             onBlur={onBlur}
//             onChangeText={onChange}
//             value={value}
//             placeholder="Enter SIM Number"
//             placeholderTextColor={'#000'}
//           />
//         )}
//         name="simNumber"
//       />
//       {errors.simNumber && (
//         <Text style={styles.errorText}>This field is required</Text>
//       )}

//       {/* Service Video Section */}
//       <View style={styles.fileContainer}>
//         <Text style={styles.label}>Service Video (will be compressed to ~6MB):</Text>
//         <View style={styles.videoButtonsContainer}>
//           <TouchableOpacity
//             onPress={handleVideoSelection}
//             style={styles.videoButton}>
//             <MaterialIcon name="folder-multiple-image" size={28} color="#000" />
//             <Text style={styles.title}>Select Video from Gallery</Text>
//           </TouchableOpacity>
//         </View>

//         {serviceVideo && (
//           <View style={styles.videoPreviewContainer}>
//             {videoCompressing && (
//               <View style={styles.compressionOverlay}>
//                 <ActivityIndicator size="large" color="#0000ff" />
//                 <Text style={styles.compressionText}>Compressing video...</Text>
//               </View>
//             )}
//             <View style={styles.videoPlaceholder}>
//               <MaterialIcon name="video" size={48} color="#000" />
//               <Text style={styles.videoText}>Video Selected</Text>
//               <Text style={styles.videoSubText}>
//                 {videoInfo.size > 0 && `Original: ${videoInfo.size.toFixed(2)}MB`}
//                 {videoInfo.compressedSize && ` → ${videoInfo.compressedSize.toFixed(2)}MB`}
//               </Text>
//               <Text style={styles.videoSubText}>Tap to remove</Text>
//             </View>
//             <TouchableOpacity style={styles.cutButton} onPress={removeVideo}>
//               <Text style={styles.cutButtonText}>✕</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {Object.entries(fileCategories).map(([category, label]) => (
//         <View key={category} style={styles.fileContainer}>
//           <Text style={styles.label}>{label}</Text>

//           <TouchableOpacity
//             onPress={() => takePhoto(category)}
//             style={styles.imageButton}>
//             <MaterialIcon name="camera-plus" size={28} color="#000" />
//             <Text style={styles.title}>Camera</Text>
//           </TouchableOpacity>

//           <ScrollView horizontal style={styles.imagePreviewContainer}>
//             {(photos[category] || []).map((uri, index) => (
//               <View key={index} style={styles.imageWrapper}>
//                 <Image source={{uri}} style={styles.imagePreview} />
//                 <TouchableOpacity
//                   style={styles.cutButton}
//                   onPress={() => removePhoto(category, uri)}>
//                   <Text style={styles.cutButtonText}>✕</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       ))}

//       <Text style={styles.label}>Status:</Text>
//       <View style={styles.pickerContainer}>
//         <Controller
//           control={control}
//           name="selectedStage"
//           render={({field: {onChange, value}}) => (
//             <Picker selectedValue={value} onValueChange={onChange}>
//               <Picker.Item label="Select a Status" value="" />
//               {stageOptions.map(({_id, stage}) => (
//                 <Picker.Item key={_id} label={stage} value={_id} />
//               ))}
//             </Picker>
//           )}
//         />
//       </View>

//       {showRemarks && (
//         <>
//           <Text style={styles.label}>Remarks:</Text>
//           <Controller
//             control={control}
//             rules={{required: true}}
//             render={({field: {onChange, onBlur, value}}) => (
//               <TextInput
//                 style={styles.inputBox}
//                 onBlur={onBlur}
//                 onChangeText={onChange}
//                 value={value}
//                 placeholder="Enter remarks"
//                 multiline={true}
//                 numberOfLines={4}
//                 placeholderTextColor={'#000'}
//               />
//             )}
//             name="remarks"
//           />
//           {errors.remarks && (
//             <Text style={styles.errorText}>This field is required</Text>
//           )}
//         </>
//       )}

//       {isPendingSelected && (
//         <>
//           <View style={styles.optionsContainer}>
//             <Text style={styles.label}>Collected Defective Material:</Text>

//             <TouchableOpacity
//               onPress={() => handleSelection('Yes')}
//               style={styles.option}>
//               <View
//                 style={[
//                   styles.checkbox,
//                   selected === 'Yes' && styles.checkedBox,
//                 ]}>
//                 {selected === 'Yes' && <Text style={styles.checkmark}>✔</Text>}
//               </View>
//               <Text style={styles.optionText}>Yes</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => handleSelection('No')}
//               style={styles.option}>
//               <View
//                 style={[
//                   styles.checkbox,
//                   selected === 'No' && styles.checkedBox,
//                 ]}>
//                 {selected === 'No' && <Text style={styles.checkmark}>✔</Text>}
//               </View>
//               <Text style={styles.optionText}>No</Text>
//             </TouchableOpacity>
//           </View>
//           <View>
//             {selected === 'No' && (
//               <Controller
//                 control={control}
//                 render={({field: {onChange, onBlur, value}}) => (
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter Service Remarks"
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     value={value}
//                     multiline={true}
//                     numberOfLines={4}
//                     placeholderTextColor={'#000'}
//                   />
//                 )}
//                 name="farmerItemRemarks"
//               />
//             )}
//           </View>
//         </>
//       )}

//       {isResolvedSelected && (
//         <>
//           <View style={styles.optionsContainer}>
//             <Text style={styles.label}>Okay Item Given:</Text>

//             <TouchableOpacity
//               onPress={() => handleResolvedSelection('Yes')}
//               style={styles.option}>
//               <View
//                 style={[
//                   styles.checkbox,
//                   selected === 'Yes' && styles.checkedBox,
//                 ]}>
//                 {selected === 'Yes' && <Text style={styles.checkmark}>✔</Text>}
//               </View>
//               <Text style={styles.optionText}>Yes</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => handleResolvedSelection('No')}
//               style={styles.option}>
//               <View
//                 style={[
//                   styles.checkbox,
//                   selected === 'No' && styles.checkedBox,
//                 ]}>
//                 {selected === 'No' && <Text style={styles.checkmark}>✔</Text>}
//               </View>
//               <Text style={styles.optionText}>No</Text>
//             </TouchableOpacity>
//           </View>
//           <View>
//             {selected === 'No' && (
//               <Controller
//                 control={control}
//                 render={({field: {onChange, onBlur, value}}) => (
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter Service Remarks"
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     value={value}
//                     multiline={true}
//                     numberOfLines={4}
//                     placeholderTextColor={'#000'}
//                   />
//                 )}
//                 name="farmerItemRemarks"
//               />
//             )}
//           </View>
//         </>
//       )}

//       {!isButtonHidden && (
//         <TouchableOpacity
//           onPress={handleSubmit(onSubmit)}
//           style={styles.submitButton}
//           disabled={submitting}>
//           {submitting ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Submit</Text>
//           )}
//         </TouchableOpacity>
//       )}
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
//     color: '#000',
//     marginBottom: 8,
//   },
//   value: {
//     fontSize: 16,
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
//   errorText: {
//     color: 'red',
//     marginBottom: 12,
//   },
//   optionsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   option: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderRadius: 5,
//     borderWidth: 2,
//     borderColor: '#007BFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 5,
//   },
//   checkedBox: {
//     backgroundColor: '#007BFF',
//   },
//   optionText: {
//     fontSize: 16,
//   },
//   card: {
//     padding: 10,
//     backgroundColor: '#fbd33b',
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
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   videoButtonsContainer: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   videoButton: {
//     backgroundColor: '#f0f0f0',
//     padding: 8,
//     borderRadius: 50,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   videoPreviewContainer: {
//     position: 'relative',
//     width: '100%',
//     height: 150,
//     marginBottom: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0e0e0',
//     borderRadius: 10,
//   },
//   videoPlaceholder: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   videoText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 8,
//   },
//   videoSubText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   imagePreviewContainer: {flexDirection: 'row', marginBottom: 16},
//   imagePreview: {width: 100, height: 100, borderRadius: 10},
//   submitButton: {
//     backgroundColor: '#000',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 40,
//     alignItems: 'center',
//     marginTop: 30,
//   },
//   cutButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 5,
//     borderRadius: 15,
//   },
//   cutButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   buttonText: {color: '#fff', fontSize: 16},
//   loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   fileContainer: {
//     marginBottom: 16,
//   },
//   imageWrapper: {
//     position: 'relative',
//     marginRight: 10,
//   },
//   title: {
//     fontSize: 14,
//     color: '#000',
//     marginLeft: 5,
//   },
//   compressionOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//     borderRadius: 10,
//   },
//   compressionText: {
//     color: 'white',
//     marginTop: 10,
//   },
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
import {useForm, Controller} from 'react-hook-form';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Video} from 'react-native-compressor';
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

const REJECTION_REASONS = [
  {label: 'Select reason', value: ''},
  {label: 'ShiftInd (शिफ्टिंड)', value: 'shiftind'},
  {label: 'Use Monoblock (मोनोब्लॉक का उपयोग)', value: 'usemonoblock'},
  {label: 'Electricity (बिजली का उपयोग)', value: 'electricity'},
  {label: 'Use Home (घर में उपयोग)', value: 'usehome'},
  {label: 'Others (अन्य)', value: 'others'},
];

const ShowComplaintData = ({route}) => {
  const {complaintId, farmerName, farmerContact, saralId, HP, AC_DC, village} =
    route.params;

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      rmuNumber: '',
      controllerNumber: '',
      simNumber: '',
      remarks: '',
      farmerItemRemarks: '',
      selectedStage: '',
      otherRejectionReason: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stageOptions, setStageOptions] = useState([]);
  const [photos, setPhotos] = useState({});
  const [serviceVideo, setServiceVideo] = useState(null);
  const [videoCompressing, setVideoCompressing] = useState(false);
  const [videoInfo, setVideoInfo] = useState({size: 0, duration: 0});
  const navigation = useNavigation();
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [selected, setSelected] = useState(null);
  const [isButtonHidden, setIsButtonHidden] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const selectedStage = watch('selectedStage');
  const showRemarks = selectedStage !== '';
  const isPendingSelected = selectedStage === '675be30222ae6f63bf772dcf';
  const isResolvedSelected = selectedStage === '675be30222ae6f63bf772dd0';
  const isRejectSelected = selectedStage === '675be30222ae6f63bf772dd1';
  const isOtherReasonSelected = selectedReason === 'others';

  const fileCategories = {
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
              setLongitude(position.coords.longitude.toString());
              setLatitude(position.coords.latitude.toString());
            },
            error => {
              console.log('Error getting location:', error.message);
              Alert.alert('Error', 'Unable to fetch location.');
            },
          );
        }
      }

      try {
        const stageResponse = await axios.get(
          `http://88.222.214.93:8001/filedService/showStage`,
        );
        setStageOptions(stageResponse.data?.stages || []);
      } catch (error) {
        Alert.alert(
          'Error fetching stage data:',
          error.response?.data?.message || error.message,
        );
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const takePhoto = async category => {
    try {
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
        response => {
          if (response.didCancel) {
            console.log('User cancelled camera');
          } else if (response.errorCode) {
            console.log('Camera Error:', response.errorMessage);
            Alert.alert('Error', 'Failed to capture image');
          } else if (response.assets?.[0]?.uri) {
            const photoUri = response.assets[0].uri;
            setPhotos(prev => ({
              ...prev,
              [category]: [...(prev[category] || []), photoUri],
            }));
          }
        },
      );
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const handleVideoSelection = async () => {
    try {
      const options = {
        mediaType: 'video',
        videoQuality: 'high',
        durationLimit: 300,
      };

      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        console.log('User cancelled video selection');
        return;
      }

      if (response.errorCode) {
        console.log('Video Error:', response.errorMessage);
        Alert.alert('Error', 'Failed to select video');
        return;
      }

      if (response.assets?.[0]?.uri) {
        setVideoCompressing(true);
        const videoUri = response.assets[0].uri;
        const duration = response.assets[0].duration || 0;

        try {
          // Get original file size
          const stat = await RNFS.stat(videoUri);
          const originalSizeMB = stat.size / (1024 * 1024);
          setVideoInfo({size: originalSizeMB, duration});

          // Show info about the selected video
          Alert.alert(
            'Video Selected',
            `Original size: ${originalSizeMB.toFixed(
              2,
            )}MB\nDuration: ${Math.round(duration / 60)}min ${Math.round(
              duration % 60,
            )}sec\n\nCompressing to ~6MB...`,
          );

          // Calculate compression ratio based on original size
          let compressionRatio = 1;
          if (originalSizeMB > 50) {
            compressionRatio = 0.1; // 10% of original for very large files
          } else if (originalSizeMB > 20) {
            compressionRatio = 0.15; // 15% of original for large files
          } else if (originalSizeMB > 10) {
            compressionRatio = 0.2; // 20% of original for medium files
          } else {
            compressionRatio = 0.3; // 30% of original for smaller files
          }

          // Calculate target bitrate (aim for ~6MB file)
          const targetSizeBytes = 6 * 1024 * 1024; // 6MB in bytes
          const calculatedBitrate = Math.floor(
            (targetSizeBytes * 8) / duration,
          ); // bits per second

          // Compress the video with calculated settings
          const compressedUri = await Video.compress(
            videoUri,
            {
              compressionMethod: 'auto',
              maxSize: 640, // Reduce resolution to 640px width
              bitrate: calculatedBitrate > 500000 ? 500000 : calculatedBitrate, // Cap at 500kbps
            },
            progress => {
              console.log('Compression progress: ', progress);
            },
          );

          // Check compressed file size
          const compressedStat = await RNFS.stat(compressedUri);
          const compressedSizeMB = compressedStat.size / (1024 * 1024);

          setServiceVideo(compressedUri);
          setVideoInfo(prev => ({...prev, compressedSize: compressedSizeMB}));

          Alert.alert(
            'Success',
            `Video compressed successfully!\nOriginal: ${originalSizeMB.toFixed(
              2,
            )}MB\nCompressed: ${compressedSizeMB.toFixed(2)}MB`,
          );
        } catch (compressionError) {
          console.log('Compression error:', compressionError);
          Alert.alert(
            'Error',
            'Failed to compress video. Please try a shorter video.',
          );
        } finally {
          setVideoCompressing(false);
        }
      }
    } catch (error) {
      console.log('Video selection error:', error.message);
      Alert.alert('Error', 'Failed to select video');
      setVideoCompressing(false);
    }
  };

  const removePhoto = (category, uri) => {
    setPhotos(prev => ({
      ...prev,
      [category]: prev[category].filter(photo => photo !== uri),
    }));
  };

  const removeVideo = () => {
    setServiceVideo(null);
    setVideoInfo({size: 0, duration: 0});
  };

  const handleResolvedSelection = option => {
    setSelected(option);
    if (option === 'Yes') {
      navigation.navigate('InstallationStock');
    } else {
      setValue('farmerItemRemarks', '');
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
        village,
      });
    } else {
      setValue('farmerItemRemarks', '');
    }
  };

  const onSubmit = async data => {
    const serviceId = await AsyncStorage.getItem('_id');

    if (!selectedStage) {
      Alert.alert('Error', 'Please select a stage.');
      return;
    }

    if (showRemarks && !data.remarks.trim() && !isRejectSelected) {
      Alert.alert('Error', 'Remarks are required.');
      return;
    }

    if (isRejectSelected && !selectedReason) {
      Alert.alert('Error', 'Please select a rejection reason.');
      return;
    }

    if (
      isRejectSelected &&
      selectedReason === 'others' &&
      !data.otherRejectionReason.trim()
    ) {
      Alert.alert('Error', 'Please specify the rejection reason.');
      return;
    }

    if (!data.rmuNumber.trim()) {
      Alert.alert('Error', 'RMU Number is required.');
      return;
    }

    if (!data.simNumber.trim()) {
      Alert.alert('Error', 'SIM Number is required.');
      return;
    }

    // Check if video exists and is under 10MB (slightly higher limit for safety)
    if (serviceVideo) {
      try {
        const stat = await RNFS.stat(serviceVideo);
        const videoSizeMB = stat.size / (1024 * 1024);
        if (videoSizeMB > 10) {
          Alert.alert(
            'Error',
            'Video is too large after compression. Please try again with a shorter video.',
          );
          return;
        }
      } catch (error) {
        console.log('Error checking video size:', error);
        Alert.alert('Error', 'Failed to verify video size.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('fieldEmpID', serviceId);
    formData.append('complaintId', complaintId);
    formData.append('stageId', selectedStage);

    // For reject cases, use other rejection reason if selected, otherwise use the selected reason
    if (isRejectSelected) {
      const finalRemarks =
        selectedReason === 'others'
          ? data.otherRejectionReason
          : `${selectedReason}: ${data.remarks || ''}`;
      formData.append('remarks', finalRemarks);
      formData.append('rejectionReason', selectedReason);
    } else {
      formData.append('remarks', data.remarks);
    }

    formData.append('rmuNumber', data.rmuNumber);
    formData.append('controllerNumber', data.controllerNumber);
    formData.append('simNumber', data.simNumber);
    formData.append('longitude', longitude);
    formData.append('latitude', latitude);
    formData.append('farmerItemRemarks', data.farmerItemRemarks || '');

    Object.entries(photos).forEach(([category, uris]) => {
      uris.forEach((uri, index) => {
        formData.append(category, {
          uri,
          type: 'image/jpeg',
          name: `${category}_${index}.jpg`,
        });
      });
    });

    if (serviceVideo) {
      formData.append('serviceVideo', {
        uri: serviceVideo,
        type: 'video/mp4',
        name: 'service_video.mp4',
      });
    }

    try {
      setSubmitting(true);
      const response = await axios.put(
        `https://service.galosolar.com/api/filedService/complaintUpdateWithMulter`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        },
      );

      if (response.status === 200) {
        Alert.alert(response?.data?.message);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
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
          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{longitude?.toString() || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{latitude?.toString() || 'N/A'}</Text>
        </View>
      </View>

      <Text style={styles.label}>RMU Number:</Text>
      <Controller
        control={control}
        rules={{required: true}}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter RMU Number"
            placeholderTextColor={'#000'}
          />
        )}
        name="rmuNumber"
      />
      {errors.rmuNumber && (
        <Text style={styles.errorText}>This field is required</Text>
      )}

      <Text style={styles.label}>Controller Number:</Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter Controller Number"
            placeholderTextColor={'#000'}
          />
        )}
        name="controllerNumber"
      />

      <Text style={styles.label}>SIM Number:</Text>
      <Controller
        control={control}
        rules={{required: true}}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter SIM Number"
            placeholderTextColor={'#000'}
          />
        )}
        name="simNumber"
      />
      {errors.simNumber && (
        <Text style={styles.errorText}>This field is required</Text>
      )}

      {/* Service Video Section */}
      <View style={styles.fileContainer}>
        <Text style={styles.label}>
          Service Video (will be compressed to ~6MB):
        </Text>
        <View style={styles.videoButtonsContainer}>
          <TouchableOpacity
            onPress={handleVideoSelection}
            style={styles.videoButton}>
            <MaterialIcon name="folder-multiple-image" size={28} color="#000" />
            <Text style={styles.title}>Select Video from Gallery</Text>
          </TouchableOpacity>
        </View>

        {serviceVideo && (
          <View style={styles.videoPreviewContainer}>
            {videoCompressing && (
              <View style={styles.compressionOverlay}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.compressionText}>Compressing video...</Text>
              </View>
            )}
            <View style={styles.videoPlaceholder}>
              <MaterialIcon name="video" size={48} color="#000" />
              <Text style={styles.videoText}>Video Selected</Text>
              <Text style={styles.videoSubText}>
                {videoInfo.size > 0 &&
                  `Original: ${videoInfo.size.toFixed(2)}MB`}
                {videoInfo.compressedSize &&
                  ` → ${videoInfo.compressedSize.toFixed(2)}MB`}
              </Text>
              <Text style={styles.videoSubText}>Tap to remove</Text>
            </View>
            <TouchableOpacity style={styles.cutButton} onPress={removeVideo}>
              <Text style={styles.cutButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {Object.entries(fileCategories).map(([category, label]) => (
        <View key={category} style={styles.fileContainer}>
          <Text style={styles.label}>{label}</Text>

          <TouchableOpacity
            onPress={() => takePhoto(category)}
            style={styles.imageButton}>
            <MaterialIcon name="camera-plus" size={28} color="#000" />
            <Text style={styles.title}>Camera</Text>
          </TouchableOpacity>

          <ScrollView horizontal style={styles.imagePreviewContainer}>
            {(photos[category] || []).map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{uri}} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.cutButton}
                  onPress={() => removePhoto(category, uri)}>
                  <Text style={styles.cutButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      ))}

      <Text style={styles.label}>Status:</Text>
      <View style={styles.pickerContainer}>
        <Controller
          control={control}
          name="selectedStage"
          render={({field: {onChange, value}}) => (
            <Picker selectedValue={value} onValueChange={onChange}>
              <Picker.Item label="Select a Status" value="" />
              {stageOptions.map(({_id, stage}) => (
                <Picker.Item key={_id} label={stage} value={_id} />
              ))}
            </Picker>
          )}
        />
      </View>

      {/* General remarks for all statuses except reject */}
      {showRemarks && !isRejectSelected && (
        <>
          <Text style={styles.label}>Remarks:</Text>
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.inputBox}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter remarks"
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={'#000'}
              />
            )}
            name="remarks"
          />
          {errors.remarks && (
            <Text style={styles.errorText}>This field is required</Text>
          )}
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
                {selected === 'Yes' && <Text style={styles.checkmark}>✔</Text>}
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
                {selected === 'No' && <Text style={styles.checkmark}>✔</Text>}
              </View>
              <Text style={styles.optionText}>No</Text>
            </TouchableOpacity>
          </View>
          <View>
            {selected === 'No' && (
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Service Remarks"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline={true}
                    numberOfLines={4}
                    placeholderTextColor={'#000'}
                  />
                )}
                name="farmerItemRemarks"
              />
            )}
          </View>
        </>
      )}

      {isResolvedSelected && (
        <>
          <View style={styles.optionsContainer}>
            <Text style={styles.label}>Okay Item Given:</Text>

            <TouchableOpacity
              onPress={() => handleResolvedSelection('Yes')}
              style={styles.option}>
              <View
                style={[
                  styles.checkbox,
                  selected === 'Yes' && styles.checkedBox,
                ]}>
                {selected === 'Yes' && <Text style={styles.checkmark}>✔</Text>}
              </View>
              <Text style={styles.optionText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleResolvedSelection('No')}
              style={styles.option}>
              <View
                style={[
                  styles.checkbox,
                  selected === 'No' && styles.checkedBox,
                ]}>
                {selected === 'No' && <Text style={styles.checkmark}>✔</Text>}
              </View>
              <Text style={styles.optionText}>No</Text>
            </TouchableOpacity>
          </View>
          <View>
            {selected === 'No' && (
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Service Remarks"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline={true}
                    numberOfLines={4}
                    placeholderTextColor={'#000'}
                  />
                )}
                name="farmerItemRemarks"
              />
            )}
          </View>
        </>
      )}

      {isRejectSelected && (
        <>
          <View style={styles.optionsContainer}>
            <Text style={styles.label}>Rejection Reason:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedReason}
                onValueChange={setSelectedReason}>
                {REJECTION_REASONS.map(reason => (
                  <Picker.Item
                    key={reason.value}
                    label={reason.label}
                    value={reason.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Show additional remarks field only when "Others" is selected */}
          {isOtherReasonSelected && (
            <>
              <Text style={styles.label}>Specify Reason:</Text>
              <Controller
                control={control}
                rules={{required: isOtherReasonSelected}}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.inputBox}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Please specify the rejection reason"
                    multiline={true}
                    numberOfLines={4}
                    placeholderTextColor={'#000'}
                  />
                )}
                name="otherRejectionReason"
              />
              {errors.otherRejectionReason && (
                <Text style={styles.errorText}>This field is required</Text>
              )}
            </>
          )}
        </>
      )}

      {!isButtonHidden && (
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
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
    color: '#000',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
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
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
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
    backgroundColor: '#fbd33b',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  videoButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoPreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  videoSubText: {
    fontSize: 12,
    color: '#666',
  },
  imagePreviewContainer: {flexDirection: 'row', marginBottom: 16},
  imagePreview: {width: 100, height: 100, borderRadius: 10},
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 40,
    alignItems: 'center',
    marginTop: 30,
  },
  cutButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 15,
  },
  cutButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonText: {color: '#fff', fontSize: 16},
  loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  fileContainer: {
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    color: '#000',
    marginLeft: 5,
  },
  compressionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 10,
  },
  compressionText: {
    color: 'white',
    marginTop: 10,
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ShowComplaintData;
