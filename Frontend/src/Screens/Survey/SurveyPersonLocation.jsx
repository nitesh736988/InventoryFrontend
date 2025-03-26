import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SurveyPersonLocation = () => {
  const [showPunchOut, setShowPunchOut] = useState(false);
  const [empId, setEmpId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [contact, setContact] = useState('');

  useEffect(() => {
    const fetchEmpData = async () => {
      try {
        const id = await AsyncStorage.getItem('_id');
        const storedContact = await AsyncStorage.getItem('Contact');
  
        if (storedContact) {
          setContact(JSON.parse(storedContact)); 
        } else {
          console.log('Contact not found in AsyncStorage');
        }
  
        setEmpId(id);
  
        const punchInTimestamp = await AsyncStorage.getItem('punchInTime');
        if (punchInTimestamp) {
          const punchInDate = new Date(punchInTimestamp);
          setPunchInTime(punchInDate);
          setIsActive(true);
          setShowPunchOut(true);
  
          const now = new Date();
          const secondsElapsed = Math.floor((now - punchInDate) / 1000);
          setTimer(secondsElapsed);
        }
      } catch (error) {
        console.log('Error fetching employee data:', error);
      }
    };
  
    fetchEmpData();
  }, []);
  

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePunchIn = async () => {
    if (!empId) {
      Alert.alert('Error', 'Employee ID not found');
      return;
    }
    try {
      const now = new Date();
      console.log(empId);
      console.log(contact);
      const response = await axios.post(
        'http://88.222.214.93:8001/track/empPunchIn',
        {
          empId,
          contact
        },

      );

      console.log('Response data', response.data);

      await AsyncStorage.setItem('punchInTime', now.toString());
      setPunchInTime(now);
      
      Alert.alert('Success', `Punch In Successful at ${now.toLocaleTimeString()}`);
      setShowPunchOut(true);
      setIsActive(true);
      setTimer(0);
    } catch (error) {
      console.log('Punch In Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Punch In failed');
    }
  };

  const handlePunchOut = async () => {
    if (!empId || !punchInTime) {
      Alert.alert('Error', 'Employee ID or punch in time not found');
      return;
    }

    try {
      const now = new Date();
      const timeWorkedInSeconds = Math.floor((now - punchInTime) / 1000);
      const timeWorkedFormatted = formatTime(timeWorkedInSeconds);

      const response = await axios.post(
        'http://88.222.214.93:8001/track/empPunchOut',
        {
          empId,
          contact
        },
      );
    
      await AsyncStorage.removeItem('punchInTime');
      
      Alert.alert(
        'Success',
        `Punch Out Successful\nTime Worked: ${timeWorkedFormatted}`,
      );
      console.log('Punch Out', response.data);
      setShowPunchOut(false);
      setIsActive(false);
      setTimer(0);
      setPunchInTime(null);
    } catch (error) {
      console.error('Punch Out Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Punch Out failed');
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Service Person Location</Text> */}

      {showPunchOut && punchInTime && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Time Worked:</Text>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
          <Text style={styles.punchInTime}>
            Punch In: {punchInTime.toLocaleTimeString()}
          </Text>
        </View>
      )}

      {!showPunchOut ? (
        <TouchableOpacity style={styles.button} onPress={handlePunchIn}>
          <Text style={styles.buttonText}>Employee Punch In</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.punchOut]}
          onPress={handlePunchOut}>
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
    padding: 10,

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
    marginTop: 20,
  },
  punchOut: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 18,
    color: '#333',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginVertical: 5,
  },
  punchInTime: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default SurveyPersonLocation;