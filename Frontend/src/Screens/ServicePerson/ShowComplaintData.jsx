import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const InstallationPart = ({ route }) => {
  const {complaintId, farmerName, farmerContact, fatherOrHusbandName, pump_type,HP,AC_DC } = route.params;
  console.log("farmer details" , { farmerName, farmerContact, fatherOrHusbandName, pump_type,HP,AC_DC }, typeof(farmerContact))
  const [installationData, setInstallationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stageOptions, setStageOptions] = useState([]);
  const [selectedStage, setSelectedStage] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showRemarks, setShowRemarks] = useState(false); 
  const navigation = useNavigation();

  useEffect(() => {
    const initialize = async () => {
      const serviceId = await AsyncStorage.getItem('_id');
      try {
        const response = await axios.get(
          `http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`);
          console.log(response.data.data)
        setInstallationData(response.data.data);

        const stageResponse = await axios.get(
          `http://88.222.214.93:8001/filedService/showStage`);
        setStageOptions(stageResponse.data?.stages || []);
        console.log("All Stages",stageResponse.data?.stages);
      } catch (error) {
        console.log(
          'Error fetching data:',
          error.response?.data || error.message
        );
        Alert.alert('Error', 'Unable to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleStageChange = (itemValue) => {
    setSelectedStage(itemValue);
    setShowRemarks(itemValue !== '');
  };

  const handleSubmit = async (complaintId) => {
    const serviceId = await AsyncStorage.getItem('_id');
    if (!selectedStage) {
      Alert.alert('Error', 'Please select a stage.');
      return;
    }

    if (showRemarks && !remarks.trim()) {
      Alert.alert('Error', 'Remarks are required.');
      return;
    }

    const requestData = {
      fieldEmpID: serviceId,
      complaintId,
      stageId: selectedStage,
      remarks,
    };

    try {
      setLoading(true);
      // console.log("Requested Data",requestData);
      const response = await axios.put(`http://88.222.214.93:8001/filedService/complaintUpdate`,
        requestData
      );
      if (response.status === 200) {
        Alert.alert('Success', 'Form submitted successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error submitting form:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to submit form.');
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

      <Text style={styles.label}>Farmer Name:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={farmerName}
        editable={false}
      />

      <Text style={styles.label}>Farmer Contact:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={farmerContact?.toString()}
        keyboardType='phone-pad'
        editable={false}
      />

      <Text style={styles.label}>Father/Husband Name:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={fatherOrHusbandName}
        editable={false}
      />

      <Text style={styles.label}>Pump Type:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={pump_type}
        editable={false}
      />

      <Text style={styles.label}>HP:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={HP}
        editable={false}
      />

      <Text style={styles.label}>AC/DC:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={AC_DC}
        editable={false}
      />

      {installationData?.installationDate && (
        <Text style={styles.infoText}>
          Installation Date: {new Date(installationData.installationDate).toLocaleDateString()}
        </Text>
      )}

      <Text style={styles.label}>Stage:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedStage}
          onValueChange={handleStageChange}
        >
          <Picker.Item label="Select a stage" value="" />
          {stageOptions.map(({ _id, stage }) => (
            <Picker.Item key={_id} label={stage} value={_id} >{stage}</Picker.Item>
          ))}
        </Picker>
      </View>

      {showRemarks && (
        <>
          <Text style={styles.label}>Remarks:</Text>
          <TextInput
            style={[styles.input, showRemarks && !remarks ? styles.errorInput : null]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter remarks"
          />
        </>
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => handleSubmit(complaintId)}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fbd33b' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  label: { fontSize: 16, marginBottom: 4, color: 'black' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
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
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  nonEditable: { backgroundColor: '#e9ecef', color: '#6c757d' },
  infoText: { fontSize: 16, color: '#333', marginBottom: 4 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  errorInput: { borderColor: 'red' },
});

export default InstallationPart;
