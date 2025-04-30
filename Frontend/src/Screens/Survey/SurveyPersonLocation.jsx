import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SurveyPersonLocation = () => {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hasPunchedIn, setHasPunchedIn] = useState(false);


  useEffect(() => {
    const checkPunchInStatus = async () => {
      try {
        const empId = await AsyncStorage.getItem('_id');
        const response = await axios.post('http://88.222.214.93:8001/track/checkDailyPunchIn', {
          fieldEmpId: empId
        });
        
        setHasPunchedIn(response.data.data);
      } catch (err) {
        // console.log('Error checking punch-in status:', err);
        // setError('Failed to check punch status');

        setError(err.response?.data?.message || 'Failed to check punch status');
        console.log('Error checking punch-in status:', err.response?.data?.message || err.message);
        Alert.alert('Error', err.response?.data?.message || 'Punch in failed. Please try again.');
        
      } finally {
        setCheckingStatus(false);
      }
    };
    
    checkPunchInStatus();
  }, []);

  const handlePunchIn = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const empId = await AsyncStorage.getItem('_id');
      const contact = await AsyncStorage.getItem('Contact');
      
      const response = await axios.post('http://88.222.214.93:8001/track/empPunchIn', { 
        empId, 
        contact 
      });
      
      setMessage('Punched in successfully!');
      setHasPunchedIn(true);
      console.log('PunchIn response:', response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to punch in');
      console.log('PunchIn error:', err.response?.data?.message || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Punch in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const empId = await AsyncStorage.getItem('_id');
      const contact = await AsyncStorage.getItem('Contact');
      
      const response = await axios.post('http://88.222.214.93:8001/track/empPunchOut', { 
        empId, 
        contact 
      });
      
      setMessage('Punched out successfully!');
      setHasPunchedIn(false);
      console.log('PunchOut response:', response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to punch out');
      console.log('PunchIn error:', err.response?.data?.message || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Punch in failed. Please try again.');

    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" />
        <Text style={{textAlign: 'center', marginTop: 10}}>Checking your punch status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Time Tracking</Text>
      
      <View style={styles.buttonGroup}>
        {!hasPunchedIn ? (
          <TouchableOpacity 
            onPress={handlePunchIn} 
            disabled={loading}
            style={[styles.button, styles.punchInBtn]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Punch In</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={handlePunchOut} 
            disabled={loading}
            style={[styles.button, styles.punchOutBtn]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Punch Out</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {message ? <Text style={styles.successMessage}>{message}</Text> : null}
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      
      <Text style={styles.statusText}>
        Current Status: {hasPunchedIn ? 'Punched In' : 'Not Punched In'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start', 
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center', 
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  punchInBtn: {
    backgroundColor: '#4CAF50',
  },
  punchOutBtn: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successMessage: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
  },
  errorMessage: {
    color: '#f44336',
    textAlign: 'center',
    marginTop: 10,
  },
  statusText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default SurveyPersonLocation;