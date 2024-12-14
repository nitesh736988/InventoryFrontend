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
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {API_URL} from '@env';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const InstallationPart = ({route}) => {
  const {pickupItemId} = route.params;
  const [installationData, setInstallationData] = useState(null);
  const [images, setImages] = useState([]);
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        Alert.alert('Error', 'Unable to fetch installation data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstallationData();
  }, [pickupItemId]);

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
      },
    );
  };

  const validateCoordinates = (lat, long) => {
    const coordRegex = /^-?\d+(\.\d+)?$/;
    return coordRegex.test(lat) && coordRegex.test(long);
  };

  const handleSubmit = async () => {
    if (!validateCoordinates(latitude, longitude)) {
      Alert.alert(
        'Validation Error',
        'Please enter valid latitude and longitude.',
      );
      return;
    }
    if (images.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('status', false);
    formData.append('pickupItemId', pickupItemId);

    images.forEach((imageUri, index) => {
      const fileName = imageUri.split('/').pop();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: fileName || `image_${index}.jpg`,
      });
    });

    try {
      const response = await axios.post(
        `${API_URL}/service-person/new-installation-data`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        Alert.alert('Success', 'Installation data submitted successfully.');
      } else {
        Alert.alert('Error', 'Failed to submit installation data.');
      }
    } catch (error) {
      console.log(
        'Error submitting installation data:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'An error occurred while submitting the data.');
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

  const {
    farmerName,
    farmerContact,
    farmerVillage,
    items,
    serialNumber,
    installedBy,
    installationDate,
  } = installationData;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Installation Pending</Text>

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

      {installedBy && (
        <Text style={styles.infoText}>Installed By: {installedBy}</Text>
      )}
      {installationDate && (
        <Text style={styles.infoText}>
          Installation Date: {new Date(installationDate).toLocaleDateString()}
        </Text>
      )}

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
          <Image
            key={index}
            source={{uri: imageUri}}
            style={styles.imagePreview}
          />
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
  buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'},
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
  imagePreviewContainer: {marginTop: 16},
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  errorText: {fontSize: 16, color: 'red', textAlign: 'center'},
});

export default InstallationPart;
