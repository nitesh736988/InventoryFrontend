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

const InstallationPart = ({ route }) => {
  const { serviceId } = route.params;
  const [installationData, setInstallationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await axios.get(
          `http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`
        );
        setInstallationData(response.data.data);
      } catch (error) {
        console.log(
          'Error fetching installation data:',
          error.response?.data || error.message
        );
        Alert.alert('Error', 'Unable to fetch Complain data.');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [serviceId]);

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
        <Text style={styles.errorText}>Unable to load Complain data.</Text>
      </View>
    );
  }

  const {
    farmerName,
    farmerContact,
    fatherOrHusbandName,
    pump_type,
    HP,
    AC_DC,
    installationDate,
  } = installationData;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Complain Details</Text>

      <Text style={styles.label}>Farmer Name:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={item?.Farmer[0]?.farmerName}
        editable={false}
      />

      <Text style={styles.label}>Farmer Contact:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={item?.Farmer[0]?.farmerContact}
        editable={false}
      />

      <Text style={styles.label}>Father/Husband Name:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={item?.Farmer[0]?.fatherOrHusbandName}
        editable={false}
      />

      <Text style={styles.label}>Pump Type:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={item?.Farmer[0]?.pump_type}
        editable={false}
      />

      <Text style={styles.label}>HP:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={item?.Farmer[0]?.HP}
        editable={false}
      />

      <Text style={styles.label}>AC/DC:</Text>
      <TextInput
        style={[styles.input, styles.nonEditable]}
        value={item?.Farmer[0]?.AC_DC}
        editable={false}
      />

      {installationDate && (
        <Text style={styles.infoText}>
          Installation Date: {new Date(installationDate).toLocaleDateString()}
        </Text>
      )}

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
});

export default InstallationPart;
