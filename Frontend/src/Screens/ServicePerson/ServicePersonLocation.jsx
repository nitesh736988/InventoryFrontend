// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   StyleSheet,
//   ActivityIndicator,
//   Alert
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ServicePersonLocation = () => {
//   const [loading, setLoading] = useState(false);
//   const [checkingStatus, setCheckingStatus] = useState(true);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [hasPunchedIn, setHasPunchedIn] = useState(false);


//   useEffect(() => {
//     const checkPunchInStatus = async () => {
//       try {
//         const empId = await AsyncStorage.getItem('_id');
//         const response = await axios.post('http://88.222.214.93:8001/track/checkDailyPunchIn', {
//           fieldEmpId: empId
//         });
        
//         setHasPunchedIn(response.data.data);
//       } catch (err) {
//         console.log('Error checking punch-in status:', err);
//         setError('Failed to check punch status');

//         setError(err.response?.data?.message || 'Failed to check punch status');
//         console.log('Error checking punch-in status:', err.response?.data?.message || err.message);
//         Alert.alert('Error', err.response?.data?.message || 'Punch in failed. Please try again.');
        
//       } finally {
//         setCheckingStatus(false);
//       }
//     };
    
//     checkPunchInStatus();
//   }, []);

//   const handlePunchIn = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       setMessage('');
      
//       const empId = await AsyncStorage.getItem('_id');
//       const contact = await AsyncStorage.getItem('Contact');
      
//       const response = await axios.post('http://88.222.214.93:8001/track/empPunchIn', { 
//         empId, 
//         contact 
//       });
      
//       setMessage('Punched in successfully!');
//       setHasPunchedIn(true);
//       console.log('PunchIn response:', response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to punch in');
//       console.log('PunchIn error:', err.response?.data?.message || err.message);
//       Alert.alert('Error', err.response?.data?.message || 'Punch in failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePunchOut = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       setMessage('');

//       const empId = await AsyncStorage.getItem('_id');
//       const contact = await AsyncStorage.getItem('Contact');
      
//       const response = await axios.post('http://88.222.214.93:8001/track/empPunchOut', { 
//         empId, 
//         contact 
//       });
      
//       setMessage('Punched out successfully!');
//       setHasPunchedIn(false);
//       console.log('PunchOut response:', response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to punch out');
//       console.log('PunchIn error:', err.response?.data?.message || err.message);
//       Alert.alert('Error', err.response?.data?.message || 'Punch in failed. Please try again.');

//     } finally {
//       setLoading(false);
//     }
//   };

//   if (checkingStatus) {
//     return (
//       <View style={[styles.container, {justifyContent: 'center'}]}>
//         <ActivityIndicator size="large" />
//         <Text style={{textAlign: 'center', marginTop: 10}}>Checking your punch status...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Employee Time Tracking</Text>
      
//       <View style={styles.buttonGroup}>
//         {!hasPunchedIn ? (
//           <TouchableOpacity 
//             onPress={handlePunchIn} 
//             disabled={loading}
//             style={[styles.button, styles.punchInBtn]}
//           >
//             {loading ? (
//               <ActivityIndicator color="white" />
//             ) : (
//               <Text style={styles.buttonText}>Punch In</Text>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity 
//             onPress={handlePunchOut} 
//             disabled={loading}
//             style={[styles.button, styles.punchOutBtn]}
//           >
//             {loading ? (
//               <ActivityIndicator color="white" />
//             ) : (
//               <Text style={styles.buttonText}>Punch Out</Text>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>
      
//       {message ? <Text style={styles.successMessage}>{message}</Text> : null}
//       {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      
//       <Text style={styles.statusText}>
//         Current Status: {hasPunchedIn ? 'Punched In' : 'Not Punched In'}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'flex-start', 
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   buttonGroup: {
//     flexDirection: 'row',
//     justifyContent: 'center', 
//     marginBottom: 20,
//   },
//   button: {
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80%',
//   },
//   punchInBtn: {
//     backgroundColor: '#4CAF50',
//   },
//   punchOutBtn: {
//     backgroundColor: '#f44336',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   successMessage: {
//     color: '#4CAF50',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   errorMessage: {
//     color: '#f44336',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   statusText: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//     color: '#555',
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
  Alert,
  ScrollView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServicePersonLocation = () => {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hasPunchedIn, setHasPunchedIn] = useState(false);
  const [travelHistory, setTravelHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const checkPunchInStatus = async () => {
      try {
        const empId = await AsyncStorage.getItem('_id');
        const response = await axios.post('http://88.222.214.93:8001/track/checkDailyPunchIn', {
          fieldEmpId: empId
        });
        
        setHasPunchedIn(response.data.data);
      } catch (err) {
        console.log('Error checking punch-in status:', err);
        setError(err.response?.data?.message || 'Failed to check punch status');
        Alert.alert('Error', err.response?.data?.message || 'Punch in failed. Please try again.');
      } finally {
        setCheckingStatus(false);
      }
    };
    
    checkPunchInStatus();
    fetchTravelHistory();
  }, []);

  const fetchTravelHistory = async () => {
    try {
      setHistoryLoading(true);
      const empId = await AsyncStorage.getItem('_id');
      const response = await axios.post('http://88.222.214.93:8001/track/empTravelHistoryForApp', {
        fieldEmpId: empId

      });
      
      setTravelHistory(response.data.data);
    } catch (err) {
      console.log('Error fetching travel history:', err);
      Alert.alert('Error', 'Failed to fetch travel history');
    } finally {
      setHistoryLoading(false);
    }
  };

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
      fetchTravelHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to punch in');
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
      fetchTravelHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to punch out');
      Alert.alert('Error', err.response?.data?.message || 'Punch in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDistance = (item) => {
    if (!item.punchOut || item.punchOut.length === 0) return null;
    return (item.finalDistance - item.initialDistance)
  };

  const renderHistoryItem = (item, index) => {
    const distance = calculateDistance(item);
    const hasPunchedOut = item.punchOut && item.punchOut.length > 0;
    
    return (
      <View key={index} style={styles.historyItem}>
        <Text style={styles.historyDate}>{formatDate(item.punchDate)}</Text>
        <View style={styles.historyDetails}>
          {hasPunchedOut ? (
            <>
              <Text style={styles.historyStatus}>Status: Completed</Text>
              <Text style={styles.historyDistance}>
                Distance: {distance.toFixed(4)} km
              </Text>
            </>
          ) : (
            <Text style={styles.historyWarning}>Not Punched Out</Text>
          )}
        </View>
      </View>
    );
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

      <Text style={styles.sectionTitle}>Travel History</Text>
      
      {historyLoading ? (
        <ActivityIndicator size="small" style={{marginTop: 20}} />
      ) : (
        <ScrollView style={styles.historyContainer}>
          {travelHistory.length > 0 ? (
            travelHistory.map(renderHistoryItem)
          ) : (
            <Text style={styles.noHistoryText}>No travel history available</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  historyContainer: {
    flex: 1,
    marginTop: 10,
  },
  historyItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    fontWeight: 'bold',
    color: '#333',
  },
  historyDetails: {
    alignItems: 'flex-end',
  },
  historyStatus: {
    color: '#555',
    fontSize: 14,
  },
  historyDistance: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
  },
  historyWarning: {
    color: '#f44336',
    fontSize: 14,
    marginTop: 5,
  },
  noHistoryText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default ServicePersonLocation;