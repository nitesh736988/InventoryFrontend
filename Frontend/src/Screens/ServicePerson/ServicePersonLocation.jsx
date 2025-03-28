// import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const ServicePersonLocation = ({status , setterFunForPunchAPI}) => {
//   console.log("status", status)

//   const [showPunchOut, setShowPunchOut] = useState(false);
//   const [empId, setEmpId] = useState(null);
//   const [timer, setTimer] = useState(0);
//   const [isActive, setIsActive] = useState(false);
//   const [punchInTime, setPunchInTime] = useState(null);
//   const [contact, setContact] = useState('');

//   useEffect(() => {
//     const fetchEmpData = async () => {
//       try {
//         const id = await AsyncStorage.getItem('_id');
//         const storedContact = await AsyncStorage.getItem('Contact');
//         const punchInTimestamp = await AsyncStorage.getItem('punchInTime');

//         console.log('Fetched from AsyncStorage:', { id, storedContact, punchInTimestamp });

//         if (id) setEmpId(id);
//         if (storedContact) setContact(JSON.parse(storedContact));

//         if (punchInTimestamp) {
//           const punchInDate = new Date(JSON.parse(punchInTimestamp));
//           setPunchInTime(punchInDate);
//           setIsActive(true);
//           setShowPunchOut(true);

//           const now = new Date();
//           const secondsElapsed = Math.floor((now - punchInDate) / 1000);
//           setTimer(secondsElapsed);
//         }
//       } catch (error) {
//         console.log('Error fetching employee data:', error);
//       }
//     };

//     fetchEmpData();
//   }, []);

//   useEffect(() => {
//     let interval = null;
//     if (isActive) {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => prevTimer + 1);
//       }, 1000);
//     } else if (!isActive && timer !== 0) {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isActive, timer]);

//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handlePunchIn = async () => {
//     if (!empId) {
//       Alert.alert('Error', 'Employee ID not found');
//       return;
//     }
//     try {
//       const now = new Date();
//       console.log('Punching In:', { empId, contact });

//       const response = await axios.post(
//         'http://88.222.214.93:8001/track/empPunchIn',
//         { empId, contact }
//       );

//       console.log('Punch In Response:', response.data);
//       setterFunForPunchAPI(response?.data?.data);
//       await AsyncStorage.setItem('punchInTime', JSON.stringify(now));
//       setPunchInTime(now);
//       setShowPunchOut(true);
//       setIsActive(true);
//       setTimer(0);

//       Alert.alert('Success', `Punch In Successful at ${now.toLocaleTimeString()}`);
//     } catch (error) {
//       console.log('Punch In Error:', error);
//       Alert.alert('Error', error.response?.data?.message || 'Punch In failed');
//     }
//   };

//   const handlePunchOut = async () => {
//     if (!empId || !punchInTime) {
//       Alert.alert('Error', 'Employee ID or punch-in time not found');
//       return;
//     }

//     try {
//       const now = new Date();
//       const timeWorkedInSeconds = Math.floor((now - punchInTime) / 1000);
//       const timeWorkedFormatted = formatTime(timeWorkedInSeconds);

//       console.log('Punching Out:', { empId, contact });

//       const response = await axios.post(
//         'http://88.222.214.93:8001/track/empPunchOut',
//         { empId, contact }
//       );

//       console.log('Punch Out Response:', response.data);

//       await AsyncStorage.removeItem('punchInTime');
//       setShowPunchOut(false);
//       setIsActive(false);
//       setTimer(0);
//       setPunchInTime(null);

//       Alert.alert('Success', `Punch Out Successful\nTime Worked: ${timeWorkedFormatted}`);
//     } catch (error) {
//       console.log('Punch Out Error:', error);
//       Alert.alert('Error', error.response?.data?.message || 'Punch Out failed');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {showPunchOut && punchInTime && (
//         <View style={styles.timerContainer}>
//           <Text style={styles.timerText}>Time Worked:</Text>
//           <Text style={styles.timer}>{formatTime(timer)}</Text>
//           <Text style={styles.punchInTime}>
//             Punch In: {punchInTime.toLocaleTimeString()}
//           </Text>
//         </View>
//       )}

//       {( status === false ) ? (
//         <TouchableOpacity style={styles.button} onPress={handlePunchIn}>
//           <Text style={styles.buttonText}>Employee Punch In</Text>
//         </TouchableOpacity>
//       ) : <Text></Text>
//       }
//       {
//         (status === true) ? (
//           <TouchableOpacity
//             style={[styles.button, styles.punchOut]}
//             onPress={handlePunchOut}>
//             <Text style={styles.buttonText}>Employee Punch Out</Text>
//           </TouchableOpacity>
//         ) : <Text> </Text>
//       }
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,

//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#28a745',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     elevation: 3,
//     marginTop: 20,
//   },
//   punchOut: {
//     backgroundColor: '#dc3545',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   timerContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   timerText: {
//     fontSize: 18,
//     color: '#333',
//   },
//   timer: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#007bff',
//     marginVertical: 5,
//   },
//   punchInTime: {
//     fontSize: 14,
//     color: '#666',
//     fontStyle: 'italic',
//   },
// });

// export default ServicePersonLocation;

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

const ServicePersonLocation = () => {
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
        console.error('Error checking punch-in status:', err);
        setError('Failed to check punch status');
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
      setError('Failed to punch in. Please try again.');
      console.error('PunchIn error:', err);
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
      setError('Failed to punch out. Please try again.');
      console.error('PunchOut error:', err);
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

export default ServicePersonLocation;