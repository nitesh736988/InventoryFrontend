import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';

const NetworkConnectivityCompaintForms = () => {
  const [complaints, setComplaints] = useState([]);

  const handleFetchLocalStorageData = async () => {
    const fetchComplaints = await AsyncStorage.getItem('pendingComplaints');
    const usableFormat = JSON.parse(fetchComplaints);
    console.log("Local Storage Data", usableFormat);
    setComplaints(usableFormat);
  };

  useEffect(() => {
    handleFetchLocalStorageData();
  }, []);

  const handleSubmit = async () => {
    const serviceId = await AsyncStorage.getItem('_id');

    if (!simNumber.trim()) {
      Alert.alert('Error', 'Please enter a SIM number.');
      return;
    }

   

    if (!selectedStage) {
      Alert.alert('Error', 'Please select a stage.');
      return;
    }

    if (showRemarks && !remarks.trim()) {
      Alert.alert('Error', 'Remarks are required.');
      return;
    }

    if (!rmuNumber.trim()) {
      Alert.alert('Error', 'RMU Number is required.');
      return;
    }

    if (!simNumber.trim()) {
      Alert.alert('Error', 'SIM Number is required.');
      return;
    }

    if (photos.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one image.');
      return;
    }

    const simPhotoBase64 = simPhoto
      .map(photo =>
        photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null,
      )
      .filter(Boolean);

    const photosBase64 = photos
      .map(photo =>
        photo.base64 ? `data:${photo.type};base64,${photo.base64}` : null,
      )
      .filter(Boolean);

    try {
      setLoading(true);
      const response = await axios.put(
        `http://88.222.214.93:8001/filedService/complaintUpdate`,
        requestData,
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Form submitted successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.log(
        'Error submitting form:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Connectivity Complaints</Text>
      {complaints.length > 0 ? (
        <FlatList
          data={complaints}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <ScrollView>
                <Text style={styles.label}>
                  Farmer Name:{' '}
                  <Text style={styles.value}>{item.farmerName}</Text>
                </Text>
                <Text style={styles.label}>
                  Contact:{' '}
                  <Text style={styles.value}>{item.farmerContact}</Text>
                </Text>
                <Text style={styles.label}>
                  Father/Husband Name:{' '}
                  <Text style={styles.value}>{item.fatherOrHusbandName}</Text>
                </Text>
                <Text style={styles.label}>
                  Pump Type: <Text style={styles.value}>{item.pumpType}</Text>
                </Text>
                <Text style={styles.label}>
                  HP: <Text style={styles.value}>{item.hp}</Text>
                </Text>
                <Text style={styles.label}>
                  AC/DC: <Text style={styles.value}>{item.acOrDc}</Text>
                </Text>
                <Text style={styles.label}>
                  Longitude: <Text style={styles.value}>{item.longitude}</Text>
                </Text>
                <Text style={styles.label}>
                  Latitude: <Text style={styles.value}>{item.latitude}</Text>
                </Text>
                <Text style={styles.label}>
                  RMU Number: <Text style={styles.value}>{item.rmuNumber}</Text>
                </Text>
                <Text style={styles.label}>
                  Controller Number:{' '}
                  <Text style={styles.value}>{item.controllerNumber}</Text>
                </Text>
                <Text style={styles.label}>
                  SIM Number: <Text style={styles.value}>{item.simNumber}</Text>
                </Text>
                <Text style={styles.label}>
                  Status: <Text style={styles.value}>{item.status}</Text>
                </Text>
                <Text style={styles.label}>
                  Remarks: <Text style={styles.value}>{item.remarks}</Text>
                </Text>

                {item.simImage ? (
                  <Image source={{uri: item.simImage}} style={styles.image} />
                ) : (
                  <Text style={styles.noImage}>No SIM Image Available</Text>
                )}

                {item.images && item.images.length > 0 ? (
                  item.images.map((img, idx) => (
                    <Image key={idx} source={{uri: img}} style={styles.image} />
                  ))
                ) : (
                  <Text style={styles.noImage}>No Images Available</Text>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleResubmit(item)}>
                  <Text style={styles.buttonText}>Submit Again</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noData}>No complaints found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  card: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontWeight: 'normal',
    color: '#555',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
    borderRadius: 5,
  },
  noImage: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 10,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },

  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NetworkConnectivityCompaintForms;
