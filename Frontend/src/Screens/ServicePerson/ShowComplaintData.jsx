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
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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

const ShowComplaintData = ({route}) => {
  const {
    complaintId,
    farmerName,
    farmerContact,
    saralId,
    pump_type,
    HP,
    AC_DC,
    village,
  } = route.params;

  const [installationData, setInstallationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stageOptions, setStageOptions] = useState([]);
  const [selectedStage, setSelectedStage] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showRemarks, setShowRemarks] = useState(false);
  const [rmuNumber, setRmuNumber] = useState('');
  const [controllerNumber, setControllerNumber] = useState('');
  const [simNumber, setSimNumber] = useState('');
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [selected, setSelected] = useState(null);
  const [isPendingSelected, setPendingSelected] = useState(false);
  const [isResolvedSelected, setResolvedSelected] = useState(false);
  const [farmerItemRemarks, setFarmerItemRemarks] = useState('');
  const [isButtonHidden, setIsButtonHidden] = useState(false);

  const filesNameList = [
    'finalFoundation',
    'panelPhoto',
    'photoWithWater',
    'photoWithController',
    'simPhoto',
  ];

  const fileLabels = {
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

      const serviceId = await AsyncStorage.getItem('_id');
      try {
        const response = await axios.get(
          `http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`,
        );
        setInstallationData(response.data.data);
        console.log('Installation Data:', response.data.data);

        const stageResponse = await axios.get(
          `http://88.222.214.93:8001/filedService/showStage`,
        );
        setStageOptions(stageResponse.data?.stages || []);
        console.log('Stage Options:', stageResponse.data?.stages);
      } catch (error) {
        console.log(
          'Error fetching data:',
          error.response?.data || error.message,
        );
        Alert.alert('Error', 'Unable to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const openGeneralCamera = async category => {
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
              uri: resizedImage.uri,
              base64: resizedImage.base64 || originalPhoto.base64,
              type: originalPhoto.type,
              category,
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

  const handleImageCut = (uri) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.uri !== uri));
    console.log("Image removed:", uri);
  };

  const handleStageChange = itemValue => {
    setSelectedStage(itemValue);
    setShowRemarks(itemValue !== '');
    if (itemValue === '675be30222ae6f63bf772dcf') {
      setPendingSelected(true);
      setResolvedSelected(false);
    } else if (itemValue === '675be30222ae6f63bf772dd0') {
      setResolvedSelected(true);
      setPendingSelected(false);
    } else {
      setPendingSelected(false);
      setResolvedSelected(false);
    }
  };

  const handleResolvedSelection = option => {
    setSelected(option);

    if (option === 'Yes') {
      navigation.navigate('InstallationStock');
    } else {
      setFarmerItemRemarks(true);
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
      setFarmerItemRemarks(true);
    }
  };

  const handleSubmit = async () => {
    const serviceId = await AsyncStorage.getItem('_id');

    if (!selectedStage) {
      Alert.alert('Error', 'Please select a stage.');
      setIsButtonHidden(false);
      return;
    }

    if (showRemarks && !remarks.trim()) {
      Alert.alert('Error', 'Remarks are required.');
      setIsButtonHidden(false);
      return;
    }

    if (!rmuNumber.trim()) {
      Alert.alert('Error', 'RMU Number is required.');
      setIsButtonHidden(false);
      return;
    }

    if (!simNumber.trim()) {
      Alert.alert('Error', 'SIM Number is required.');
      setIsButtonHidden(false);
      return;
    }

    const groupedPhotos = photos.reduce((acc, photo) => {
      if (!acc[photo.category]) {
        acc[photo.category] = [];
      }
      acc[photo.category].push(`data:${photo.type};base64,${photo.base64}`);
      return acc;
    }, {});

    const requestData = {
      fieldEmpID: serviceId,
      complaintId,
      stageId: selectedStage,
      remarks,
      rmuNumber,
      controllerNumber,
      simNumber,
      simPhoto: groupedPhotos.simPhoto || [],
      finalFoundation: groupedPhotos.finalFoundation || [],
      panelPhoto: groupedPhotos.panelPhoto || [],
      photoWithWater: groupedPhotos.photoWithWater || [],
      photoWithController: groupedPhotos.photoWithController || [],
      longitude,
      latitude,
      farmerItemRemarks,
    };

    console.log('Request Data:', requestData);

    try {
      setLoading(true);
      const response = await axios.put(
        `http://88.222.214.93:8001/filedService/complaintUpdate`,
        requestData,
      );

      console.log("Response data", response.data)

      if (response.status === 200) {
        Alert.alert('Success', 'Form submitted successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.log(
        'Error submitting form:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', JSON.stringify(error.response.data?.message));

      setIsButtonHidden(false);
    } finally {
      setLoading(false);
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
        <Text style={styles.errorText}>Unable to load complaint data.</Text>
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
          <Text style={styles.label}>Product Type:</Text>
          <Text style={styles.value}>
            {`${pump_type || 'N/A'} | ${HP || 'N/A'} | ${AC_DC || 'N/A'}`}
          </Text>
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
      <TextInput
        style={styles.input}
        value={rmuNumber}
        onChangeText={setRmuNumber}
        placeholder="Enter RMU Number"
        placeholderTextColor={'#000'}
      />

      <Text style={styles.label}>Controller Number:</Text>
      <TextInput
        style={styles.input}
        value={controllerNumber}
        onChangeText={setControllerNumber}
        placeholder="Enter Controller Number"
        placeholderTextColor={'#000'}
      />

      <Text style={styles.label}>SIM Number:</Text>
      <TextInput
        style={styles.input}
        value={simNumber}
        onChangeText={setSimNumber}
        placeholder="Enter SIM Number"
        placeholderTextColor={'#000'}
      />

      {filesNameList.map((category, index) => (
        <View key={category} style={styles.fileContainer}>
          <Text style={styles.label}>{fileLabels[category]}</Text>

          <TouchableOpacity
            onPress={() => openGeneralCamera(category)}
            style={styles.imageButton}>
            <MaterialIcon name="camera-plus" size={28} color="#000" />
            <Text style={styles.title}>Camera</Text>
          </TouchableOpacity>

          <ScrollView horizontal style={styles.imagePreviewContainer}>
            {photos
              .filter(photo => photo.category === category)
              .map((photo, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{uri: photo.uri}}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.cutButton}
                    onPress={() => handleImageCut(photo.uri)}>
                    <Text style={styles.cutButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
      ))}

      <Text style={styles.label}>Status:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedStage} onValueChange={handleStageChange}>
          <Picker.Item label="Select a Status" value="" />
          {stageOptions.map(({_id, stage}) => (
            <Picker.Item key={_id} label={stage} value={_id} />
          ))}
        </Picker>
      </View>

      {showRemarks && (
        <>
          <Text style={styles.label}>Remarks:</Text>
          <TextInput
            style={styles.inputBox}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter remarks"
            multiline={true}
            numberOfLines={4}
            placeholderTextColor={'#000'}
          />
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
              <TextInput
                style={styles.input}
                placeholder="Enter Service Remarks"
                value={farmerItemRemarks}
                onChangeText={setFarmerItemRemarks}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={'#000'}
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
              <TextInput
                style={styles.input}
                placeholder="Enter Service Remarks"
                value={farmerItemRemarks}
                onChangeText={setFarmerItemRemarks}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={'#000'}
              />
            )}
          </View>
        </>
      )}

      {!isButtonHidden && (
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>Submit</Text>
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

  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
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
    backgroundColor: '#fff',
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
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#555',
  },

  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 2,
    elevation: 3,
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
  errorText: {fontSize: 16, color: 'red'},

  nonEditable: {backgroundColor: '#e9ecef', color: '#000'},
});

export default ShowComplaintData;

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
// import {useNavigation, useRoute} from '@react-navigation/native';
// import {useForm, Controller} from 'react-hook-form';
// import axios from 'axios';
// import {Picker} from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {launchCamera} from 'react-native-image-picker';
// import Geolocation from '@react-native-community/geolocation';
// import {PermissionsAndroid} from 'react-native';
// import ImageResizer from 'react-native-image-resizer';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// const ShowComplaintData = () => {
//   const {params} = useRoute();
//   const {
//     complaintId,
//     farmerName,
//     farmerContact,
//     saralId,
//     pump_type,
//     HP,
//     AC_DC,
//     village,
//   } = params;

//   const navigation = useNavigation();
//   const {control, handleSubmit, watch, setValue} = useForm({
//     defaultValues: {
//       rmuNumber: '',
//       controllerNumber: '',
//       simNumber: '',
//       stageId: '',
//       remarks: '',
//       farmerItemRemarks: '',
//       selectedOption: null,
//     },
//   });

//   const [loading, setLoading] = useState(true);
//   const [installationData, setInstallationData] = useState(null);
//   const [stageOptions, setStageOptions] = useState([]);
//   const [photos, setPhotos] = useState([]);
//   const [location, setLocation] = useState({longitude: '', latitude: ''});
//   const [isButtonHidden, setIsButtonHidden] = useState(false);

//   const selectedStage = watch('stageId');
//   const selectedOption = watch('selectedOption');

//   const filesConfig = [
//     {key: 'finalFoundation', label: 'Final Foundation Image With Farmer'},
//     {key: 'panelPhoto', label: 'Photograph With Panel + Structure'},
//     {key: 'photoWithWater', label: 'Photograph With Water Discharge'},
//     {key: 'photoWithController', label: 'Photograph with Controller'},
//     {key: 'simPhoto', label: 'SIM Photo'},
//   ];

//   useEffect(() => {
//     const initialize = async () => {
//       await requestPermissions();
//       await fetchLocation();
//       await fetchData();
//     };
//     initialize();
//   }, []);

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       await Promise.all([
//         PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA),
//         PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION),
//       ]);
//     }
//   };

//   const fetchLocation = () => {
//     Geolocation.getCurrentPosition(
//       position => {
//         setLocation({
//           longitude: position.coords.longitude,
//           latitude: position.coords.latitude,
//         });
//       },
//       error => console.log('Location error:', error)
//     );
//   };

//   const fetchData = async () => {
//     try {
//       const serviceId = await AsyncStorage.getItem('_id');
//       const [complaintRes, stagesRes] = await Promise.all([
//         axios.get(`http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`),
//         axios.get(`http://88.222.214.93:8001/filedService/showStage`),
//       ]);

//       setInstallationData(complaintRes.data.data);
//       setStageOptions(stagesRes.data?.stages || []);
//     } catch (error) {
//       console.error('Fetch error:', error);
//       Alert.alert('Error', 'Unable to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const takePhoto = async (category) => {
//     try {
//       const result = await launchCamera({
//         mediaType: 'photo',
//         quality: 0.8,
//       });

//       if (result.assets?.[0]) {
//         const resized = await ImageResizer.createResizedImage(
//           result.assets[0].uri,
//           800,
//           800,
//           'JPEG',
//           80
//         );

//         setPhotos(prev => [...prev, {
//           uri: resized.uri,
//           base64: resized.base64,
//           type: 'image/jpeg',
//           category,
//         }]);
//       }
//     } catch (error) {
//       console.error('Camera error:', error);
//     }
//   };

//   const removePhoto = (uri) => {
//     setPhotos(prev => prev.filter(photo => photo.uri !== uri));
//   };

//   const onSubmit = async (data) => {
//     if (!data.stageId) {
//       Alert.alert('Error', 'Please select a status');
//       return;
//     }

//     if (!data.rmuNumber || !data.simNumber) {
//       Alert.alert('Error', 'RMU and SIM numbers are required');
//       return;
//     }

//     try {
//       setIsButtonHidden(true);
//       setLoading(true);

//       const groupedPhotos = photos.reduce((acc, photo) => {
//         if (!acc[photo.category]) acc[photo.category] = [];
//         acc[photo.category].push(`data:${photo.type};base64,${photo.base64}`);
//         return acc;
//       }, {});

//       const payload = {
//         ...data,
//         fieldEmpID: await AsyncStorage.getItem('_id'),
//         complaintId,
//         ...groupedPhotos,
//         ...location,
//       };

//       const response = await axios.put(
//         'http://88.222.214.93:8001/filedService/complaintUpdate',
//         payload
//       );

//       if (response.status === 200) {
//         Alert.alert('Success', 'Form submitted successfully!');
//         navigation.goBack();
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       Alert.alert('Error', error.response?.data?.message || 'Submission failed');
//     } finally {
//       setLoading(false);
//       setIsButtonHidden(false);
//     }
//   };

//   if (loading) return <LoadingIndicator />;
//   if (!installationData) return <ErrorText text="Unable to load complaint data" />;

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Complaint Details</Text>

//       <FarmerInfoCard
//         farmerName={farmerName}
//         farmerContact={farmerContact}
//         saralId={saralId}
//         pumpInfo={`${pump_type || 'N/A'} | ${HP || 'N/A'} | ${AC_DC || 'N/A'}`}
//         location={location}
//       />

//       <Controller
//         control={control}
//         name="rmuNumber"
//         render={({field: {onChange, value}}) => (
//           <FormInput
//             label="RMU Number"
//             value={value}
//             onChangeText={onChange}
//             placeholder="Enter RMU Number"
//           />
//         )}
//       />

//       <Controller
//         control={control}
//         name="controllerNumber"
//         render={({field: {onChange, value}}) => (
//           <FormInput
//             label="Controller Number"
//             value={value}
//             onChangeText={onChange}
//             placeholder="Enter Controller Number"
//           />
//         )}
//       />

//       <Controller
//         control={control}
//         name="simNumber"
//         render={({field: {onChange, value}}) => (
//           <FormInput
//             label="SIM Number"
//             value={value}
//             onChangeText={onChange}
//             placeholder="Enter SIM Number"
//           />
//         )}
//       />

//       {filesConfig.map(({key, label}) => (
//         <PhotoUploadSection
//           key={key}
//           label={label}
//           photos={photos.filter(p => p.category === key)}
//           onTakePhoto={() => takePhoto(key)}
//           onRemovePhoto={removePhoto}
//         />
//       ))}

//       <Controller
//         control={control}
//         name="stageId"
//         render={({field: {onChange, value}}) => (
//           <View style={styles.section}>
//             <Text style={styles.label}>Status:</Text>
//             <View style={styles.pickerContainer}>
//               <Picker selectedValue={value} onValueChange={onChange}>
//                 <Picker.Item label="Select a Status" value="" />
//                 {stageOptions.map(({_id, stage}) => (
//                   <Picker.Item key={_id} label={stage} value={_id} />
//                 ))}
//               </Picker>
//             </View>
//           </View>
//         )}
//       />

//       {selectedStage && (
//         <Controller
//           control={control}
//           name="remarks"
//           render={({field: {onChange, value}}) => (
//             <FormInput
//               label="Remarks"
//               value={value}
//               onChangeText={onChange}
//               placeholder="Enter remarks"
//               multiline
//               numberOfLines={4}
//             />
//           )}
//         />
//       )}

//       {selectedStage === '675be30222ae6f63bf772dcf' && (
//         <OptionSelector
//           label="Collected Defective Material:"
//           control={control}
//           name="selectedOption"
//           onYes={() => navigation.navigate('InOrder', {
//             id: complaintId,
//             name: farmerName,
//             farmerContact,
//             saralId,
//             farmerName,
//             village,
//           })}
//         />
//       )}

//       {selectedStage === '675be30222ae6f63bf772dd0' && (
//         <OptionSelector
//           label="Okay Item Given:"
//           control={control}
//           name="selectedOption"
//           onYes={() => navigation.navigate('InstallationStock')}
//         />
//       )}

//       {selectedOption === 'No' && (
//         <Controller
//           control={control}
//           name="farmerItemRemarks"
//           render={({field: {onChange, value}}) => (
//             <FormInput
//               placeholder="Enter Service Remarks"
//               value={value}
//               onChangeText={onChange}
//               multiline
//               numberOfLines={4}
//             />
//           )}
//         />
//       )}

//       {!isButtonHidden && (
//         <TouchableOpacity
//           onPress={handleSubmit(onSubmit)}
//           style={styles.submitButton}
//         >
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//       )}
//     </ScrollView>
//   );
// };

// // Reusable Components
// const LoadingIndicator = () => (
//   <View style={styles.loaderContainer}>
//     <ActivityIndicator size="large" color="#0000ff" />
//     <Text>Loading...</Text>
//   </View>
// );

// const ErrorText = ({text}) => (
//   <View style={styles.loaderContainer}>
//     <Text style={styles.errorText}>{text}</Text>
//   </View>
// );

// const FarmerInfoCard = ({farmerName, farmerContact, saralId, pumpInfo, location}) => (
//   <View style={styles.card}>
//     <InfoRow label="Farmer Name:" value={farmerName || 'N/A'} />
//     <InfoRow label="Farmer Contact:" value={farmerContact?.toString() || 'N/A'} />
//     <InfoRow label="Saral Id:" value={saralId || 'N/A'} />
//     <InfoRow label="Product Type:" value={pumpInfo} />
//     <InfoRow label="Longitude:" value={location.longitude?.toString() || 'N/A'} />
//     <InfoRow label="Latitude:" value={location.latitude?.toString() || 'N/A'} />
//   </View>
// );

// const InfoRow = ({label, value}) => (
//   <View style={styles.row}>
//     <Text style={styles.label}>{label}</Text>
//     <Text style={styles.value}>{value}</Text>
//   </View>
// );

// const FormInput = ({label, ...props}) => (
//   <View style={styles.section}>
//     {label && <Text style={styles.label}>{label}</Text>}
//     <TextInput
//       style={styles.input}
//       placeholderTextColor="#000"
//       {...props}
//     />
//   </View>
// );

// const PhotoUploadSection = ({label, photos, onTakePhoto, onRemovePhoto}) => (
//   <View style={styles.section}>
//     <Text style={styles.label}>{label}</Text>
//     <TouchableOpacity onPress={onTakePhoto} style={styles.imageButton}>
//       <MaterialIcon name="camera-plus" size={28} color="#000" />
//       <Text style={styles.title}>Camera</Text>
//     </TouchableOpacity>
//     <ScrollView horizontal style={styles.imagePreviewContainer}>
//       {photos.map((photo, index) => (
//         <View key={index} style={styles.imageWrapper}>
//           <Image source={{uri: photo.uri}} style={styles.imagePreview} />
//           <TouchableOpacity
//             style={styles.cutButton}
//             onPress={() => onRemovePhoto(photo.uri)}
//           >
//             <Text style={styles.cutButtonText}>✕</Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//     </ScrollView>
//   </View>
// );

// const OptionSelector = ({label, control, name, onYes}) => (
//   <View style={styles.section}>
//     <Text style={styles.label}>{label}</Text>
//     <View style={styles.optionsContainer}>
//       <Controller
//         control={control}
//         name={name}
//         render={({field: {onChange, value}}) => (
//           <>
//             <OptionButton
//               label="Yes"
//               selected={value === 'Yes'}
//               onPress={() => {
//                 onChange('Yes');
//                 onYes();
//               }}
//             />
//             <OptionButton
//               label="No"
//               selected={value === 'No'}
//               onPress={() => onChange('No')}
//             />
//           </>
//         )}
//       />
//     </View>
//   </View>
// );

// const OptionButton = ({label, selected, onPress}) => (
//   <TouchableOpacity onPress={onPress} style={styles.option}>
//     <View style={[styles.checkbox, selected && styles.checkedBox]}>
//       {selected && <Text style={styles.checkmark}>✔</Text>}
//     </View>
//     <Text style={styles.optionText}>{label}</Text>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 16, backgroundColor: '#fbd33b'},
//   header: {fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: 'black'},
//   section: {marginBottom: 12},
//   card: {padding: 10, backgroundColor: '#fff', borderRadius: 8, elevation: 3, marginVertical: 5},
//   row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4},
//   label: {fontWeight: 'bold', fontSize: 14, color: '#333', marginBottom: 4},
//   value: {fontSize: 14, color: '#555'},
//   input: {borderWidth: 1, borderColor: '#000', borderRadius: 8, padding: 8, fontSize: 16, color: '#000'},
//   pickerContainer: {borderWidth: 1, borderColor: '#000', borderRadius: 8},
//   optionsContainer: {flexDirection: 'row', alignItems: 'center'},
//   option: {flexDirection: 'row', alignItems: 'center', marginRight: 20},
//   checkbox: {width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: '#007BFF', alignItems: 'center', justifyContent: 'center', marginRight: 5},
//   checkedBox: {backgroundColor: '#007BFF'},
//   checkmark: {color: 'white', fontSize: 12},
//   optionText: {fontSize: 16},
//   imageButton: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 8, borderRadius: 50, alignSelf: 'flex-start'},
//   title: {marginLeft: 5},
//   imagePreviewContainer: {flexDirection: 'row'},
//   imageWrapper: {position: 'relative', marginRight: 10},
//   imagePreview: {width: 100, height: 100, borderRadius: 10},
//   cutButton: {position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.6)', padding: 5, borderRadius: 15},
//   cutButtonText: {color: 'white', fontSize: 16},
//   submitButton: {backgroundColor: '#000', borderRadius: 8, padding: 12, marginBottom: 40, alignItems: 'center', marginTop: 30},
//   buttonText: {color: '#fff', fontSize: 16},
//   loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   errorText: {fontSize: 16, color: 'red'},
// });

// export default ShowComplaintData;

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
// import {useNavigation, useRoute} from '@react-navigation/native';
// import {useForm, Controller} from 'react-hook-form';
// import axios from 'axios';
// import {Picker} from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {launchCamera} from 'react-native-image-picker';
// import Geolocation from '@react-native-community/geolocation';
// import {PermissionsAndroid} from 'react-native';
// import ImageResizer from 'react-native-image-resizer';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// const ShowComplaintData = () => {
//   const {params} = useRoute();
//   const {
//     complaintId,
//     farmerName,
//     farmerContact,
//     saralId,
//     pump_type,
//     HP,
//     AC_DC,
//     village,
//   } = params;

//   const navigation = useNavigation();
//   const {control, handleSubmit, watch, setValue} = useForm({
//     defaultValues: {
//       rmuNumber: '',
//       controllerNumber: '',
//       simNumber: '',
//       stageId: '',
//       remark: '',
//       farmerItemRemarks: '',
//       selectedOption: null,
//     },
//   });

//   const [loading, setLoading] = useState(true);
//   const [installationData, setInstallationData] = useState(null);
//   const [stageOptions, setStageOptions] = useState([]);
//   const [photos, setPhotos] = useState([]);
//   const [location, setLocation] = useState({longitude: '', latitude: ''});
//   const [isButtonHidden, setIsButtonHidden] = useState(false);

//   const selectedStage = watch('stageId');
//   const selectedOption = watch('selectedOption');

//   const filesConfig = [
//     {key: 'finalFoundation', label: 'Final Foundation Image With Farmer'},
//     {key: 'panelPhoto', label: 'Photograph With Panel + Structure'},
//     {key: 'photoWithWater', label: 'Photograph With Water Discharge'},
//     {key: 'photoWithController', label: 'Photograph with Controller'},
//     {key: 'simPhoto', label: 'SIM Photo'},
//   ];

//   useEffect(() => {
//     const initialize = async () => {
//       await requestPermissions();
//       await fetchLocation();
//       await fetchData();
//     };
//     initialize();
//   }, []);

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       await Promise.all([
//         PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA),
//         PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         ),
//       ]);
//     }
//   };

//   const fetchLocation = () => {
//     Geolocation.getCurrentPosition(
//       position => {
//         setLocation({
//           longitude: position.coords.longitude.toString(),
//           latitude: position.coords.latitude.toString(),
//         });
//       },
//       error => console.log('Location error:', error),
//     );
//   };

//   const fetchData = async () => {
//     try {
//       const serviceId = await AsyncStorage.getItem('_id');
//       const [complaintRes, stagesRes] = await Promise.all([
//         axios.get(
//           `http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`,
//         ),
//         axios.get(`http://88.222.214.93:8001/filedService/showStage`),
//       ]);

//       setInstallationData(complaintRes.data.data);
//       setStageOptions(stagesRes.data?.stages || []);
//     } catch (error) {
//       console.log('Fetch error:', error);
//       Alert.alert('Error', 'Unable to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const takePhoto = async category => {
//     try {
//       const result = await launchCamera({
//         mediaType: 'photo',
//         quality: 0.8,
//       });

//       if (result.assets?.[0]) {
//         const resized = await ImageResizer.createResizedImage(
//           result.assets[0].uri,
//           800,
//           800,
//           'JPEG',
//           80,
//         );

//         setPhotos(prev => [
//           ...prev,
//           {
//             uri: resized.uri,
//             base64: resized.base64,
//             type: 'image/jpeg',
//             category,
//           },
//         ]);
//       }
//     } catch (error) {
//       console.log('Camera error:', error);
//     }
//   };

//   const removePhoto = uri => {
//     setPhotos(prev => prev.filter(photo => photo.uri !== uri));
//   };

//   const onSubmit = async data => {
//     if (!data.stageId) {
//       Alert.alert('Error', 'Please select a status');
//       return;
//     }

//     if (!data.rmuNumber || !data.simNumber) {
//       Alert.alert('Error', 'RMU and SIM numbers are required');
//       return;
//     }

//     try {
//       setIsButtonHidden(true);
//       setLoading(true);

//       // Group photos by category
//       const groupedPhotos = {};
//       photos.forEach(photo => {
//         if (!groupedPhotos[photo.category]) {
//           groupedPhotos[photo.category] = [];
//         }
//         groupedPhotos[photo.category].push(
//           `data:${photo.type};base64,${photo.base64}`,
//         );
//       });

//       // Prepare payload with compulsory fields
//       const payload = {
//         // Compulsory fields
//         stageId: data.stageId,
//         fieldEmpID: await AsyncStorage.getItem('_id'),
//         complaintId: complaintId,
//         longitude: location.longitude,
//         latitude: location.latitude,
//         rmuNumber: data.rmuNumber,
//         simNumber: data.simNumber,

//         // Optional fields
//         ...(data.controllerNumber && {controllerNumber: data.controllerNumber}),
//         ...(data.remark && {remark: data.remark}),
//         ...(groupedPhotos.simPhoto && {simPhoto: groupedPhotos.simPhoto[0]}),
//         ...(groupedPhotos.finalFoundation && {
//           finalFoundation: groupedPhotos.finalFoundation[0],
//         }),
//         ...(groupedPhotos.panelPhoto && {
//           panelPhoto: groupedPhotos.panelPhoto[0],
//         }),
//         ...(groupedPhotos.photoWithWater && {
//           photoWithWater: groupedPhotos.photoWithWater[0],
//         }),
//         ...(groupedPhotos.photoWithController && {
//           photoWithController: groupedPhotos.photoWithController[0],
//         }),
//         created_At: new Date().toISOString(),
//       };

//       console.log("PlayLoad Data", payload)

//       const response = await axios.put(
//         'http://88.222.214.93:8001/filedService/complaintUpdate',
//         payload,
//       );

//         Alert.alert('Success', 'Form submitted successfully!');
//         navigation.goBack();

//     } catch (error) {
//       console.log('Submit error:', error?.response?.data || error?.message || error);

//       Alert.alert(
//         'Error',
//         error.response?.data?.message || 'Submission failed',
//       );
//     } finally {
//       setLoading(false);
//       setIsButtonHidden(false);
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
//         <Text style={styles.errorText}>Unable to load complaint data</Text>
//       </View>
//     );
//   }

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
//         <View style={styles.row}>
//           <Text style={styles.label}>Product Type:</Text>
//           <Text style={styles.value}>{`${pump_type || 'N/A'} | ${
//             HP || 'N/A'
//           } | ${AC_DC || 'N/A'}`}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Longitude:</Text>
//           <Text style={styles.value}>{location.longitude || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Latitude:</Text>
//           <Text style={styles.value}>{location.latitude || 'N/A'}</Text>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>RMU Number:</Text>
//         <Controller
//           control={control}
//           name="rmuNumber"
//           render={({field: {onChange, value}}) => (
//             <TextInput
//               style={styles.input}
//               placeholder="Enter RMU Number"
//               placeholderTextColor="#000"
//               value={value}
//               onChangeText={onChange}
//             />
//           )}
//         />
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>Controller Number:</Text>
//         <Controller
//           control={control}
//           name="controllerNumber"
//           render={({field: {onChange, value}}) => (
//             <TextInput
//               style={styles.input}
//               placeholder="Enter Controller Number"
//               placeholderTextColor="#000"
//               value={value}
//               onChangeText={onChange}
//             />
//           )}
//         />
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.label}>SIM Number:</Text>
//         <Controller
//           control={control}
//           name="simNumber"
//           render={({field: {onChange, value}}) => (
//             <TextInput
//               style={styles.input}
//               placeholder="Enter SIM Number"
//               placeholderTextColor="#000"
//               value={value}
//               onChangeText={onChange}
//             />
//           )}
//         />
//       </View>

//       {filesConfig.map(({key, label}) => (
//         <View key={key} style={styles.section}>
//           <Text style={styles.label}>{label}</Text>
//           <TouchableOpacity
//             onPress={() => takePhoto(key)}
//             style={styles.imageButton}>
//             <MaterialIcon name="camera-plus" size={28} color="#000" />
//             <Text style={styles.title}>Camera</Text>
//           </TouchableOpacity>
//           <ScrollView horizontal style={styles.imagePreviewContainer}>
//             {photos
//               .filter(p => p.category === key)
//               .map((photo, index) => (
//                 <View key={index} style={styles.imageWrapper}>
//                   <Image
//                     source={{uri: photo.uri}}
//                     style={styles.imagePreview}
//                   />
//                   <TouchableOpacity
//                     style={styles.cutButton}
//                     onPress={() => removePhoto(photo.uri)}>
//                     <Text style={styles.cutButtonText}>✕</Text>
//                   </TouchableOpacity>
//                 </View>
//               ))}
//           </ScrollView>
//         </View>
//       ))}

//       <View style={styles.section}>
//         <Text style={styles.label}>Status:</Text>
//         <View style={styles.pickerContainer}>
//           <Controller
//             control={control}
//             name="stageId"
//             render={({field: {onChange, value}}) => (
//               <Picker selectedValue={value} onValueChange={onChange}>
//                 <Picker.Item label="Select a Status" value="" />
//                 {stageOptions.map(({_id, stage}) => (
//                   <Picker.Item key={_id} label={stage} value={_id} />
//                 ))}
//               </Picker>
//             )}
//           />
//         </View>
//       </View>

//       {selectedStage && (
//         <View style={styles.section}>
//           <Text style={styles.label}>Remark:</Text>
//           <Controller
//             control={control}
//             name="remark"
//             render={({field: {onChange, value}}) => (
//               <TextInput
//                 style={[styles.input, styles.multilineInput]}
//                 placeholder="Enter remark"
//                 placeholderTextColor="#000"
//                 value={value}
//                 onChangeText={onChange}
//                 multiline
//                 numberOfLines={4}
//               />
//             )}
//           />
//         </View>
//       )}

//       {selectedStage === '675be30222ae6f63bf772dcf' && (
//         <View style={styles.section}>
//           <Text style={styles.label}>Collected Defective Material:</Text>
//           <View style={styles.optionsContainer}>
//             <Controller
//               control={control}
//               name="selectedOption"
//               render={({field: {onChange, value}}) => (
//                 <>
//                   <TouchableOpacity
//                     onPress={() => {
//                       onChange('Yes');
//                       navigation.navigate('InOrder', {
//                         id: complaintId,
//                         name: farmerName,
//                         farmerContact,
//                         saralId,
//                         farmerName,
//                         village,
//                       });
//                     }}
//                     style={styles.option}>
//                     <View
//                       style={[
//                         styles.checkbox,
//                         value === 'Yes' && styles.checkedBox,
//                       ]}>
//                       {value === 'Yes' && (
//                         <Text style={styles.checkmark}>✔</Text>
//                       )}
//                     </View>
//                     <Text style={styles.optionText}>Yes</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => onChange('No')}
//                     style={styles.option}>
//                     <View
//                       style={[
//                         styles.checkbox,
//                         value === 'No' && styles.checkedBox,
//                       ]}>
//                       {value === 'No' && (
//                         <Text style={styles.checkmark}>✔</Text>
//                       )}
//                     </View>
//                     <Text style={styles.optionText}>No</Text>
//                   </TouchableOpacity>
//                 </>
//               )}
//             />
//           </View>
//         </View>
//       )}

//       {selectedStage === '675be30222ae6f63bf772dd0' && (
//         <View style={styles.section}>
//           <Text style={styles.label}>Okay Item Given:</Text>
//           <View style={styles.optionsContainer}>
//             <Controller
//               control={control}
//               name="selectedOption"
//               render={({field: {onChange, value}}) => (
//                 <>
//                   <TouchableOpacity
//                     onPress={() => {
//                       onChange('Yes');
//                       navigation.navigate('InstallationStock');
//                     }}
//                     style={styles.option}>
//                     <View
//                       style={[
//                         styles.checkbox,
//                         value === 'Yes' && styles.checkedBox,
//                       ]}>
//                       {value === 'Yes' && (
//                         <Text style={styles.checkmark}>✔</Text>
//                       )}
//                     </View>
//                     <Text style={styles.optionText}>Yes</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => onChange('No')}
//                     style={styles.option}>
//                     <View
//                       style={[
//                         styles.checkbox,
//                         value === 'No' && styles.checkedBox,
//                       ]}>
//                       {value === 'No' && (
//                         <Text style={styles.checkmark}>✔</Text>
//                       )}
//                     </View>
//                     <Text style={styles.optionText}>No</Text>
//                   </TouchableOpacity>
//                 </>
//               )}
//             />
//           </View>
//         </View>
//       )}

//       {selectedOption === 'No' && (
//         <View style={styles.section}>
//           <Controller
//             control={control}
//             name="farmerItemRemarks"
//             render={({field: {onChange, value}}) => (
//               <TextInput
//                 style={[styles.input, styles.multilineInput]}
//                 placeholder="Enter Service Remarks"
//                 placeholderTextColor="#000"
//                 value={value}
//                 onChangeText={onChange}
//                 multiline
//                 numberOfLines={4}
//               />
//             )}
//           />
//         </View>
//       )}

//       {!isButtonHidden && (
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             onPress={handleSubmit(onSubmit)}
//             style={styles.submitButton}>
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>Submit</Text>
//             )}
//           </TouchableOpacity>
//         </View>
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
//   section: {marginBottom: 12},
//   card: {
//     padding: 10,
//     backgroundColor: '#fff',
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
//   label: {fontWeight: 'bold', fontSize: 18, color: '#333'},
//   value: {fontSize: 14, color: '#555'},
//   input: {
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 8,
//     padding: 8,
//     fontSize: 16,
//     color: '#000',
//   },
//   pickerContainer: {borderWidth: 1, borderColor: '#000', borderRadius: 8},
//   optionsContainer: {flexDirection: 'row', alignItems: 'center'},
//   option: {flexDirection: 'row', alignItems: 'center', marginRight: 20},
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
//   checkedBox: {backgroundColor: '#007BFF'},
//   checkmark: {color: 'white', fontSize: 12},
//   optionText: {fontSize: 16},
//   imageButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     padding: 8,
//     borderRadius: 50,
//     alignSelf: 'flex-start',
//   },
//   title: {marginLeft: 5},
//   imagePreviewContainer: {flexDirection: 'row'},
//   imageWrapper: {position: 'relative', marginRight: 10},
//   imagePreview: {width: 100, height: 100, borderRadius: 10},
//   cutButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 5,
//     borderRadius: 15,
//   },
//   cutButtonText: {color: 'white', fontSize: 16},

//   buttonText: {color: '#fff', fontSize: 16},
//   loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   errorText: {fontSize: 16, color: 'red'},

//   buttonContainer: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//     paddingTop: 10,
//   },
//   submitButton: {
//     backgroundColor: '#000',
//     borderRadius: 8,
//     padding: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 50,
//   },
// });

// export default ShowComplaintData;




