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
//         // console.log('Error checking punch-in status:', err);
//         // setError('Failed to check punch status');

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
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Polyline } from 'react-native-maps';

const ServicePersonLocation = () => {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hasPunchedIn, setHasPunchedIn] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [locations, setLocations] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    const checkPunchInStatus = async () => {
      try {
        const empId = await AsyncStorage.getItem('_id');
        const response = await axios.post('http://88.222.214.93:8001/track/checkDailyPunchIn', {
          fieldEmpId: empId
        });
        
        setHasPunchedIn(response.data.data);
        if (response.data.data) {
          // If already punched in, show the map
          setShowMap(true);
          fetchLocations();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to check punch status');
        console.log('Error checking punch-in status:', err.response?.data?.message || err.message);
        Alert.alert('Error', err.response?.data?.message || 'Punch in failed. Please try again.');
      } finally {
        setCheckingStatus(false);
      }
    };
    
    checkPunchInStatus();
  }, []);

  const fetchLocations = async () => {
    try {
      const empId = await AsyncStorage.getItem('_id');
      const response = await axios.get(`http://88.222.214.93:8001/track/getLocations/${empId}`);
      setLocations(response.data.locations || []);
      
      // Calculate total distance if locations are available
      if (response.data.locations && response.data.locations.length > 1) {
        calculateDistance(response.data.locations);
      }
    } catch (err) {
      console.log('Error fetching locations:', err);
    }
  };

  const calculateDistance = (locArray) => {
    let distance = 0;
    for (let i = 1; i < locArray.length; i++) {
      const prevLoc = locArray[i - 1];
      const currLoc = locArray[i];
      distance += getDistanceFromLatLonInKm(
        prevLoc.latitude,
        prevLoc.longitude,
        currLoc.latitude,
        currLoc.longitude
      );
    }
    setTotalDistance(distance);
  };

  // Haversine formula to calculate distance between two coordinates
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
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
      setShowMap(true);
      console.log('PunchIn response:', response.data);
      
      // Start fetching locations periodically
      fetchLocations();
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
      
      setMessage(`Punched out successfully! Total distance traveled: ${totalDistance.toFixed(2)} km`);
      setHasPunchedIn(false);
      setShowMap(false);
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

      {showMap && locations.length > 0 && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: locations[0].latitude,
              longitude: locations[0].longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Polyline
              coordinates={locations.map(loc => ({
                latitude: loc.latitude,
                longitude: loc.longitude
              }))}
              strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={['#7F0000']}
              strokeWidth={6}
            />
          </MapView>
          <Text style={styles.distanceText}>
            Distance traveled: {totalDistance.toFixed(2)} km
          </Text>
        </View>
      )}
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
  mapContainer: {
    flex: 1,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  distanceText: {
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#f8f8f8',
  },
});

export default ServicePersonLocation;