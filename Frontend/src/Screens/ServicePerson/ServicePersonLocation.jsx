// import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
// import React, {useState, useEffect} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const ServicePersonLocation = () => {
//   const [showPunchOut, setShowPunchOut] = useState(false);
//   const [empId, setEmpId] = useState(null);

//   useEffect(() => {
//     const fetchEmpId = async () => {
//       const id = await AsyncStorage.getItem('_id');
//       setEmpId(id);
//     };
//     fetchEmpId();
//   }, []);

//   const handlePunchIn = async () => {
//     if (!empId) {
//       Alert.alert('Error', 'Employee ID not found');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'http://88.222.214.93:8001/track/empPunchIn',
//         {
//           empId,
//         },
//       );

//       console.log('Response data', response.data);

//       Alert.alert('Success', `Punch In Successful`);
//       setShowPunchOut(true);
//     } catch (error) {
//       Alert.alert('Error', JSON.stringify(error.response.data?.message));
//     }
//   };

//   const handlePunchOut = async () => {
//     if (!empId) {
//       Alert.alert('Error', 'Employee ID not found');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'http://88.222.214.93:8001/track/empPunchOut',
//         {
//           empId,
//         },
//       );
//       Alert.alert('Success', `Punch Out Successful `);
//       console.log('Punch Out', response.data);
//       setShowPunchOut(false);
//     } catch (error) {
//       console.log('Punch Out Error:', error);
//       Alert.alert('Error', JSON.stringify(error.response?.data?.message));
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Service Person Location</Text>

//       {!showPunchOut ? (
//         <TouchableOpacity style={styles.button} onPress={handlePunchIn}>
//           <Text style={styles.buttonText}>Employee Punch In</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity
//           style={[styles.button, styles.punchOut]}
//           onPress={handlePunchOut}>
//           <Text style={styles.buttonText}>Employee Punch Out</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f4f4f4',
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
//   },
//   punchOut: {
//     backgroundColor: '#dc3545',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ServicePersonLocation;



import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ServicePersonLocation = ({status}) => {
  console.log("status", status)

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
        const punchInTimestamp = await AsyncStorage.getItem('punchInTime');

        console.log('Fetched from AsyncStorage:', { id, storedContact, punchInTimestamp });

        if (id) setEmpId(id);
        if (storedContact) setContact(JSON.parse(storedContact));

        if (punchInTimestamp) {
          const punchInDate = new Date(JSON.parse(punchInTimestamp));
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
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePunchIn = async () => {
    if (!empId) {
      Alert.alert('Error', 'Employee ID not found');
      return;
    }
    try {
      const now = new Date();
      console.log('Punching In:', { empId, contact });

      const response = await axios.post(
        'http://88.222.214.93:8001/track/empPunchIn',
        { empId, contact }
      );

      console.log('Punch In Response:', response.data);

      await AsyncStorage.setItem('punchInTime', JSON.stringify(now));
      setPunchInTime(now);
      setShowPunchOut(true);
      setIsActive(true);
      setTimer(0);

      Alert.alert('Success', `Punch In Successful at ${now.toLocaleTimeString()}`);
    } catch (error) {
      console.log('Punch In Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Punch In failed');
    }
  };

  const handlePunchOut = async () => {
    if (!empId || !punchInTime) {
      Alert.alert('Error', 'Employee ID or punch-in time not found');
      return;
    }

    try {
      const now = new Date();
      const timeWorkedInSeconds = Math.floor((now - punchInTime) / 1000);
      const timeWorkedFormatted = formatTime(timeWorkedInSeconds);

      console.log('Punching Out:', { empId, contact });

      const response = await axios.post(
        'http://88.222.214.93:8001/track/empPunchOut',
        { empId, contact }
      );

      console.log('Punch Out Response:', response.data);

      await AsyncStorage.removeItem('punchInTime');
      setShowPunchOut(false);
      setIsActive(false);
      setTimer(0);
      setPunchInTime(null);

      Alert.alert('Success', `Punch Out Successful\nTime Worked: ${timeWorkedFormatted}`);
    } catch (error) {
      console.log('Punch Out Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Punch Out failed');
    }
  };

  return (
    <View style={styles.container}>
      {showPunchOut && punchInTime && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Time Worked:</Text>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
          <Text style={styles.punchInTime}>
            Punch In: {punchInTime.toLocaleTimeString()}
          </Text>
        </View>
      )}

      {( status === false ) ? (
        <TouchableOpacity style={styles.button} onPress={handlePunchIn}>
          <Text style={styles.buttonText}>Employee Punch In</Text>
        </TouchableOpacity>
      ) : <Text></Text>
      }
      {
        (status === true) ? (
          <TouchableOpacity
            style={[styles.button, styles.punchOut]}
            onPress={handlePunchOut}>
            <Text style={styles.buttonText}>Employee Punch Out</Text>
          </TouchableOpacity>
        ) : <Text> </Text>
      }
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,

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

export default ServicePersonLocation;