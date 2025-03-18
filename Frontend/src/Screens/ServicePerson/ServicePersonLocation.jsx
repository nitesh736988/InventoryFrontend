import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ServicePersonLocation = () => {
  const [showPunchOut, setShowPunchOut] = useState(false);
  const [empId, setEmpId] = useState(null);

  useEffect(() => {
    const fetchEmpId = async () => {
      const id = await AsyncStorage.getItem('_id');
      setEmpId(id);
    };
    fetchEmpId();
  }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
    const punchDate = now.toISOString().replace('T', ' ').split('.')[0]; 
    return { punchDate };
  };

  const handlePunchIn = async () => {
    if (!empId) {
      Alert.alert("Error", "Employee ID not found");
      return;
    }

    const { punchDate } = getCurrentDateTime();

    console.log("Punch In Data:", { empId, punchDate });

    try {
      const response = await axios.post('http://88.222.214.93:8001/track/empPunchIn', {
        empId,
        // punchDate
      });

      if (response.status === 200) {
        Alert.alert("Success", `Punch In Successful on ${punchDate}`);
        setShowPunchOut(true);
      } else {
        Alert.alert("Error", response.data.message || "Punch In Failed");
      }
    } catch (error) {
      console.log("Punch In Error:", error);
      Alert.alert("Error", JSON.stringify(error.response.data?.message));
    }
  };

  const handlePunchOut = async () => {
    if (!empId) {
      Alert.alert("Error", "Employee ID not found");
      return;
    }

    const { punchDate } = getCurrentDateTime();

    console.log("Punch Out Data:", { empId, punchDate });

    try {
      const response = await axios.post('http://88.222.214.93:8001/track/empPunchOut', {
        empId,
        // punchDate
      });

      if (response.status === 200) {
        Alert.alert("Success", `Punch Out Successful on ${punchDate}`);
        setShowPunchOut(false);
      } else {
        Alert.alert("Error", response.data.message || "Punch Out Failed");
      }
    } catch (error) {
      console.log("Punch Out Error:", error);
      Alert.alert("Error", JSON.stringify(error.response.data?.message));

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Person Location</Text>

      {!showPunchOut ? (
        <TouchableOpacity style={styles.button} onPress={handlePunchIn}>
          <Text style={styles.buttonText}>Employee Punch In</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.punchOut]} onPress={handlePunchOut}>
          <Text style={styles.buttonText}>Employee Punch Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
  },
  punchOut: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServicePersonLocation;
