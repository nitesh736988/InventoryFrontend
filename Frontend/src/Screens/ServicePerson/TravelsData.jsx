// import React, {useState, useEffect, useRef} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   Platform,
//   Linking,
//   FlatList,
// } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

// const TravelsData = () => {
//   const [loading, setLoading] = useState(false);
//   const [punchInData, setPunchInData] = useState(null);
//   const [punchOutData, setPunchOutData] = useState(null);
//   const [distance, setDistance] = useState(null);
//   const [isPunchedIn, setIsPunchedIn] = useState(false);
//   const [locationStatus, setLocationStatus] = useState('Ready');
//   const [locationUpdates, setLocationUpdates] = useState([]);
//   const locationIntervalRef = useRef(null);


//   useEffect(() => {
//     return () => {
//       if (locationIntervalRef.current) {
//         clearInterval(locationIntervalRef.current);
//       }
//     };
//   }, []);

//   const handleLocationPermission = async () => {
//     try {
//       let permission;
//       if (Platform.OS === 'android') {
//         permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
//       } else {
//         permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
//       }

//       const status = await check(permission);

//       if (status === RESULTS.DENIED) {
//         const requestStatus = await request(permission);
//         if (requestStatus === RESULTS.BLOCKED) {
//           Alert.alert(
//             'Permission Required',
//             'Location permission is required. Please enable it in app settings.',
//             [
//               {text: 'Cancel', style: 'cancel'},
//               {text: 'Open Settings', onPress: () => Linking.openSettings()},
//             ],
//           );
//           return false;
//         }
//         return requestStatus === RESULTS.GRANTED;
//       }

//       if (status === RESULTS.BLOCKED) {
//         Alert.alert(
//           'Permission Required',
//           'Location permission is required. Please enable it in app settings.',
//           [
//             {text: 'Cancel', style: 'cancel'},
//             {text: 'Open Settings', onPress: () => Linking.openSettings()},
//           ],
//         );
//         return false;
//       }

//       return status === RESULTS.GRANTED;
//     } catch (error) {
//       console.log('Permission error:', error);
//       Alert.alert('Error', 'Failed to check location permissions');
//       return false;
//     }
//   };

//   // Check if location services are enabled
//   const checkLocationServices = async () => {
//     return new Promise(resolve => {
//       Geolocation.getCurrentPosition(
//         () => resolve(true),
//         error => {
//           // If we get permission denied or position unavailable, services are likely disabled
//           if (
//             error.code === error.PERMISSION_DENIED ||
//             error.code === error.POSITION_UNAVAILABLE
//           ) {
//             resolve(false);
//           } else {
//             // For other errors, assume services are enabled
//             resolve(true);
//           }
//         },
//         {enableHighAccuracy: false, timeout: 5000},
//       );
//     });
//   };

//   // Format position data
//   const formatPosition = position => {
//     return {
//       longitude: position.coords.longitude.toString(),
//       latitude: position.coords.latitude.toString(),
//       time: new Date().toLocaleTimeString(),
//       accuracy: position.coords.accuracy,
//       timestamp: new Date().toISOString(),
//     };
//   };

//   // Get current location with improved reliability
//   const getCurrentLocation = async () => {
//     try {
//       const hasPermission = await handleLocationPermission();
//       if (!hasPermission) {
//         throw new Error('Location permission not granted');
//       }

//       const servicesEnabled = await checkLocationServices();
//       if (!servicesEnabled) {
//         throw new Error('Location services disabled. Please enable GPS.');
//       }

//       try {
//         const highAccuracyPosition = await new Promise((resolve, reject) => {
//           Geolocation.getCurrentPosition(
//             pos => {
//               if (pos.coords.accuracy < 50) {
//                 resolve(pos);
//               } else {
//                 reject(new Error('High accuracy location not available'));
//               }
//             },
//             error => reject(error),
//             {
//               enableHighAccuracy: true,
//               timeout: 5000,
//               maximumAge: 0,
//             },
//           );
//         });

//         return formatPosition(highAccuracyPosition);
//       } catch (highAccuracyError) {
//         console.log('High accuracy failed, trying standard accuracy');

//         const standardPosition = await new Promise((resolve, reject) => {
//           Geolocation.getCurrentPosition(
//             pos => resolve(pos),
//             error => reject(error),
//             {
//               enableHighAccuracy: false,
//               timeout: 15000,
//               maximumAge: 30000,
//             },
//           );
//         });

//         if (standardPosition.coords.accuracy > 200) {
//           throw new Error(
//             'Location accuracy too low. Please move to an open area.',
//           );
//         }

//         return formatPosition(standardPosition);
//       }
//     } catch (error) {
//       console.log('Location error:', error);
//       let errorMsg = 'Failed to get location';

//       if (error.code === error.TIMEOUT) {
//         errorMsg =
//           'Location request timed out. Please ensure GPS is enabled and try again.';
//       } else if (error.code === error.POSITION_UNAVAILABLE) {
//         errorMsg = 'Location unavailable. Please check your GPS signal.';
//       } else if (error.message.includes('accuracy')) {
//         errorMsg = 'Weak GPS signal. Please move to an open area.';
//       } else if (error.message.includes('disabled')) {
//         errorMsg = 'Location services disabled. Please enable GPS.';
//       }

//       throw new Error(errorMsg);
//     }
//   };

//   // Start location tracking
//   const startLocationTracking = async () => {
//     try {
//       const location = await getCurrentLocation();
//       setPunchInData(location);
//       setIsPunchedIn(true);
//       setLocationUpdates([location]);
//       setLocationStatus('Punched in successfully - tracking started');

//       // Start interval for updates
//       locationIntervalRef.current = setInterval(async () => {
//         try {
//           const loc = await getCurrentLocation();
//           setLocationUpdates(prev => [...prev, loc]);
//         } catch (err) {
//           console.log('Background update failed:', err);
//         }
//       }, 60000); // 1 minute interval
//     } catch (error) {
//       setLocationStatus('Punch in failed');
//       throw error;
//     }
//   };

//   // Stop location tracking
//   const stopLocationTracking = () => {
//     if (locationIntervalRef.current) {
//       clearInterval(locationIntervalRef.current);
//       locationIntervalRef.current = null;
//     }
//   };

//   const handlePunchIn = async () => {
//     try {
//       setLoading(true);
//       setLocationStatus('Checking location services...');

//       await startLocationTracking();
//     } catch (error) {
//       let errorMessage = error.message;

//       Alert.alert('Location Required', errorMessage, [
//         {text: 'Cancel', style: 'cancel'},
//         {text: 'Retry', onPress: handlePunchIn},
//         {text: 'Open Settings', onPress: () => Linking.openSettings()},
//       ]);
//       setLocationStatus('Punch in failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePunchOut = async () => {
//     try {
//       setLoading(true);
//       setLocationStatus('Getting final location...');

//       const location = await getCurrentLocation();
//       setPunchOutData(location);
//       setIsPunchedIn(false);
//       setLocationStatus('Punched out successfully - tracking stopped');

//       stopLocationTracking();

//       if (punchInData && punchInData.latitude && punchInData.longitude) {
//         const dist = calculateDistance(
//           parseFloat(punchInData.latitude),
//           parseFloat(punchInData.longitude),
//           parseFloat(location.latitude),
//           parseFloat(location.longitude),
//         );
//         setDistance(dist);
//       }
//     } catch (error) {
//       let errorMessage = error.message;

//       if (error.message.includes('timed out')) {
//         errorMessage = 'Could not get location quickly enough.';
//       } else if (error.message.includes('disabled')) {
//         errorMessage = 'Location services are disabled.';
//       }

//       Alert.alert('Error', errorMessage, [
//         {text: 'Cancel', style: 'cancel'},
//         {text: 'Retry', onPress: handlePunchOut},
//       ]);
//       setLocationStatus('Punch out failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Haversine formula for distance calculation
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; // Earth radius in meters
//     const φ1 = (lat1 * Math.PI) / 180;
//     const φ2 = (lat2 * Math.PI) / 180;
//     const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//     const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c;
//   };

//   const formatDistance = meters => {
//     if (meters >= 1000) {
//       return `${(meters / 1000).toFixed(2)} km`;
//     }
//     return `${meters.toFixed(2)} meters`;
//   };

//   const renderLocationUpdate = ({item, index}) => (
//     <View style={styles.updateItem}>
//       <Text style={styles.updateIndex}>Update #{index + 1}</Text>
//       <View style={styles.row}>
//         <Text style={styles.label}>Time:</Text>
//         <Text style={styles.value}>{item.time}</Text>
//       </View>
//       <View style={styles.row}>
//         <Text style={styles.label}>Latitude:</Text>
//         <Text style={styles.value}>{item.latitude}</Text>
//       </View>
//       <View style={styles.row}>
//         <Text style={styles.label}>Longitude:</Text>
//         <Text style={styles.value}>{item.longitude}</Text>
//       </View>
//       <View style={styles.row}>
//         <Text style={styles.label}>Accuracy:</Text>
//         <Text style={styles.value}>{item.accuracy.toFixed(2)} meters</Text>
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Travel Tracker</Text>

//       <View style={styles.statusContainer}>
//         <Text
//           style={[
//             styles.statusText,
//             locationStatus.includes('successfully')
//               ? styles.successText
//               : locationStatus.includes('failed')
//               ? styles.errorText
//               : styles.defaultStatusText,
//           ]}>
//           {locationStatus}
//         </Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.sectionHeader}>Punch In Details</Text>
//         {punchInData ? (
//           <>
//             <View style={styles.row}>
//               <Text style={styles.label}>Time:</Text>
//               <Text style={styles.value}>{punchInData.time}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Latitude:</Text>
//               <Text style={styles.value}>{punchInData.latitude}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Longitude:</Text>
//               <Text style={styles.value}>{punchInData.longitude}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Accuracy:</Text>
//               <Text style={styles.value}>
//                 {punchInData.accuracy.toFixed(2)} meters
//               </Text>
//             </View>
//           </>
//         ) : (
//           <Text style={styles.noDataText}>No punch-in data available</Text>
//         )}

//         <Text style={styles.sectionHeader}>Punch Out Details</Text>
//         {punchOutData ? (
//           <>
//             <View style={styles.row}>
//               <Text style={styles.label}>Time:</Text>
//               <Text style={styles.value}>{punchOutData.time}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Latitude:</Text>
//               <Text style={styles.value}>{punchOutData.latitude}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Longitude:</Text>
//               <Text style={styles.value}>{punchOutData.longitude}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.label}>Accuracy:</Text>
//               <Text style={styles.value}>
//                 {punchOutData.accuracy.toFixed(2)} meters
//               </Text>
//             </View>
//           </>
//         ) : (
//           <Text style={styles.noDataText}>No punch-out data available</Text>
//         )}

//         {distance !== null && (
//           <>
//             <Text style={styles.sectionHeader}>Total Distance Traveled</Text>
//             <View style={styles.row}>
//               <Text style={styles.label}>Distance:</Text>
//               <Text style={[styles.value, styles.distanceValue]}>
//                 {formatDistance(distance)}
//               </Text>
//             </View>
//           </>
//         )}

//         <View style={styles.buttonContainer}>
//           {!isPunchedIn ? (
//             <TouchableOpacity
//               style={[styles.button, styles.punchInButton]}
//               onPress={handlePunchIn}
//               disabled={loading}>
//               {loading ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.buttonText}>Punch In</Text>
//               )}
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={[styles.button, styles.punchOutButton]}
//               onPress={handlePunchOut}
//               disabled={loading}>
//               {loading ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.buttonText}>Punch Out</Text>
//               )}
//             </TouchableOpacity>
//           )}
//         </View>

//         {locationUpdates.length > 0 && (
//           <>
//             <Text style={styles.sectionHeader}>
//               Location Updates ({locationUpdates.length})
//             </Text>
//             <FlatList
//               data={locationUpdates}
//               renderItem={renderLocationUpdate}
//               keyExtractor={(item, index) => index.toString()}
//               scrollEnabled={false}
//             />
//           </>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#333',
//   },
//   statusContainer: {
//     marginBottom: 15,
//   },
//   statusText: {
//     textAlign: 'center',
//     padding: 8,
//     borderRadius: 5,
//   },
//   defaultStatusText: {
//     color: '#666',
//     backgroundColor: '#f0f0f0',
//   },
//   successText: {
//     color: '#27ae60',
//     backgroundColor: '#e8f5e9',
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: '#e74c3c',
//     backgroundColor: '#fdecea',
//     fontWeight: 'bold',
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 15,
//     marginBottom: 10,
//     color: '#444',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     paddingBottom: 5,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 8,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#555',
//     width: '40%',
//   },
//   value: {
//     fontSize: 16,
//     color: '#333',
//     flex: 1,
//     textAlign: 'right',
//   },
//   noDataText: {
//     fontStyle: 'italic',
//     color: '#999',
//     textAlign: 'center',
//     marginVertical: 10,
//   },
//   distanceValue: {
//     fontWeight: 'bold',
//     color: '#2c3e50',
//   },
//   buttonContainer: {
//     marginTop: 25,
//     marginBottom: 10,
//   },
//   button: {
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 2,
//   },
//   punchInButton: {
//     backgroundColor: '#27ae60',
//   },
//   punchOutButton: {
//     backgroundColor: '#e74c3c',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   updateItem: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     padding: 12,
//     marginVertical: 6,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   updateIndex: {
//     fontWeight: 'bold',
//     color: '#3498db',
//     marginBottom: 5,
//   },
// });

// export default TravelsData;

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  FlatList,
  RefreshControl,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const TravelsData = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [punchInData, setPunchInData] = useState(null);
  const [punchOutData, setPunchOutData] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Ready');
  const [locationUpdates, setLocationUpdates] = useState([]);
  const locationIntervalRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const [
          storedPunchIn,
          storedPunchOut,
          storedUpdates,
          storedIsPunchedIn,
        ] = await Promise.all([
          AsyncStorage.getItem('punchInData'),
          AsyncStorage.getItem('punchOutData'),
          AsyncStorage.getItem('locationUpdates'),
          AsyncStorage.getItem('isPunchedIn'),
        ]);

        if (storedPunchIn) setPunchInData(JSON.parse(storedPunchIn));
        if (storedPunchOut) setPunchOutData(JSON.parse(storedPunchOut));
        if (storedUpdates) setLocationUpdates(JSON.parse(storedUpdates));
        if (storedIsPunchedIn) setIsPunchedIn(JSON.parse(storedIsPunchedIn));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadSavedData();

    return () => {
      // Clean up intervals on unmount
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Set up auto-refresh when isPunchedIn changes
  useEffect(() => {
    if (isPunchedIn) {
      refreshIntervalRef.current = setInterval(() => {
        setRefreshing(true);
        updateLocation().finally(() => setRefreshing(false));
      }, 60000); // 1 minute interval
    } else if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isPunchedIn]);

  // Save data whenever it changes
  const saveToStorage = async () => {
    try {
      await AsyncStorage.multiSet([
        ['punchInData', JSON.stringify(punchInData)],
        ['punchOutData', JSON.stringify(punchOutData)],
        ['locationUpdates', JSON.stringify(locationUpdates)],
        ['isPunchedIn', JSON.stringify(isPunchedIn)],
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    saveToStorage();
  }, [punchInData, punchOutData, locationUpdates, isPunchedIn]);

  const handleLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      const status = await check(permission);
      if (status === RESULTS.DENIED) {
        const requestStatus = await request(permission);
        if (requestStatus === RESULTS.BLOCKED) {
          Alert.alert('Permission Required', 'Enable location in settings', [
            {text: 'Cancel'},
            {text: 'Open Settings', onPress: () => Linking.openSettings()},
          ]);
          return false;
        }
        return requestStatus === RESULTS.GRANTED;
      }

      if (status === RESULTS.BLOCKED) {
        Alert.alert('Permission Required', 'Enable location in settings', [
          {text: 'Cancel'},
          {text: 'Open Settings', onPress: () => Linking.openSettings()},
        ]);
        return false;
      }

      return status === RESULTS.GRANTED;
    } catch (error) {
      Alert.alert('Permission Error', 'Could not check location permission');
      return false;
    }
  };

  const checkLocationServices = () => {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        () => resolve(true),
        error => resolve(!(error.code === 1 || error.code === 2)),
        {enableHighAccuracy: false, timeout: 5000},
      );
    });
  };

  const formatPosition = position => ({
    longitude: position.coords.longitude.toString(),
    latitude: position.coords.latitude.toString(),
    time: new Date().toLocaleTimeString(),
    timestamp: new Date().toISOString(),
    accuracy: position.coords.accuracy,
    speed: position.coords.speed,
  });

  const getCurrentLocation = async () => {
    const hasPermission = await handleLocationPermission();
    if (!hasPermission) throw new Error('Location permission not granted');

    const servicesEnabled = await checkLocationServices();
    if (!servicesEnabled) throw new Error('Location services are disabled');

    try {
      const highAccuracyPos = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 1000,
        });
      });
      return formatPosition(highAccuracyPos);
    } catch (errHigh) {
      try {
        const fallbackPos = await new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 30000,
          });
        });
        return formatPosition(fallbackPos);
      } catch (errLow) {
        const code = errLow?.code || errHigh?.code;
        if (code === 1) {
          throw new Error('Location permission denied. Please allow GPS access.');
        } else if (code === 2) {
          throw new Error('Location unavailable. Please enable GPS.');
        } else if (code === 3) {
          throw new Error('Location timed out. Try moving to open area.');
        } else {
          throw new Error('Failed to get location. Try again later.');
        }
      }
    }
  };

  const updateLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      setLocationUpdates(prev => [...prev, loc]);
      return loc;
    } catch (err) {
      console.log('Location update error:', err.message);
      throw err;
    }
  };

  const startLocationTracking = async () => {
    try {
      const location = await getCurrentLocation();
      setPunchInData(location);
      setIsPunchedIn(true);
      setLocationUpdates([location]);
      setLocationStatus('Punched in - tracking started');

      // Start tracking every minute
      locationIntervalRef.current = setInterval(async () => {
        try {
          await updateLocation();
        } catch (err) {
          console.log('Background update error:', err.message);
        }
      }, 60000);
    } catch (error) {
      throw error;
    }
  };

  const stopLocationTracking = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  };

  const handlePunchIn = async () => {
    if (isPunchedIn) return; // Prevent multiple punch-ins
    
    setLoading(true);
    try {
      setLocationStatus('Punching in...');
      await startLocationTracking();
    } catch (e) {
      Alert.alert('Location Error', e.message);
      setLocationStatus('Punch in failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    if (!isPunchedIn) return; // Prevent punch-out when not punched in
    
    setLoading(true);
    try {
      setLocationStatus('Punching out...');
      const location = await getCurrentLocation();
      setPunchOutData(location);
      setIsPunchedIn(false);
      stopLocationTracking();
      setLocationStatus('Punched out - tracking stopped');

      if (punchInData) {
        const dist = calculateDistance(
          parseFloat(punchInData.latitude),
          parseFloat(punchInData.longitude),
          parseFloat(location.latitude),
          parseFloat(location.longitude),
        );
        setDistance(dist);
      }
    } catch (e) {
      Alert.alert('Punch Out Error', e.message);
      setLocationStatus('Punch out failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = meters =>
    meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${meters.toFixed(2)} meters`;

  const renderLocationUpdate = ({item, index}) => (
    <View style={styles.updateItem}>
      <Text style={styles.updateIndex}>Update #{locationUpdates.length - index} - {item.time}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Latitude:</Text>
        <Text style={styles.value}>{item.latitude}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Longitude:</Text>
        <Text style={styles.value}>{item.longitude}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Accuracy:</Text>
        <Text style={styles.value}>{item.accuracy ? `${item.accuracy.toFixed(2)} meters` : 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Speed:</Text>
        <Text style={styles.value}>{item.speed ? `${(item.speed * 3.6).toFixed(2)} km/h` : 'N/A'}</Text>
      </View>
    </View>
  );

  const onRefresh = async () => {
    if (!isPunchedIn) return;
    
    setRefreshing(true);
    try {
      await updateLocation();
      setLocationStatus('Location refreshed');
    } catch (e) {
      setLocationStatus('Refresh failed');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          enabled={isPunchedIn}
        />
      }
    >
      <Text style={styles.header}>Travel Tracker</Text>
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            locationStatus.includes('successfully') || locationStatus.includes('tracking started') ? styles.successText :
            locationStatus.includes('failed') ? styles.errorText : styles.defaultStatusText,
          ]}>
          {locationStatus}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Current Status</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Tracking:</Text>
          <Text style={[styles.value, isPunchedIn ? styles.activeText : styles.inactiveText]}>
            {isPunchedIn ? 'ACTIVE' : 'INACTIVE'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Last Update:</Text>
          <Text style={styles.value}>
            {locationUpdates.length > 0 
              ? locationUpdates[locationUpdates.length - 1].time 
              : 'N/A'}
          </Text>
        </View>

        <Text style={styles.sectionHeader}>Punch In Details</Text>
        {punchInData ? (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Time:</Text>
              <Text style={styles.value}>{punchInData.time}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Latitude:</Text>
              <Text style={styles.value}>{punchInData.latitude}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Longitude:</Text>
              <Text style={styles.value}>{punchInData.longitude}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>No punch-in data available</Text>
        )}

        <Text style={styles.sectionHeader}>Punch Out Details</Text>
        {punchOutData ? (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Time:</Text>
              <Text style={styles.value}>{punchOutData.time}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Latitude:</Text>
              <Text style={styles.value}>{punchOutData.latitude}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Longitude:</Text>
              <Text style={styles.value}>{punchOutData.longitude}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>No punch-out data available</Text>
        )}

        {distance !== null && (
          <>
            <Text style={styles.sectionHeader}>Total Distance Traveled</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Distance:</Text>
              <Text style={[styles.value, styles.distanceValue]}>
                {formatDistance(distance)}
              </Text>
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          {!isPunchedIn ? (
            <TouchableOpacity
              style={[styles.button, styles.punchInButton, loading && styles.disabledButton]}
              onPress={handlePunchIn}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Punch In</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.punchOutButton, loading && styles.disabledButton]}
              onPress={handlePunchOut}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Punch Out</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {locationUpdates.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>
              Location History ({locationUpdates.length} updates)
            </Text>
            <FlatList
              data={[...locationUpdates].reverse()}
              renderItem={renderLocationUpdate}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f5f5f5'},
  header: {fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#333'},
  statusContainer: {marginBottom: 15},
  statusText: {textAlign: 'center', padding: 8, borderRadius: 5},
  defaultStatusText: {color: '#666', backgroundColor: '#f0f0f0'},
  successText: {color: '#27ae60', backgroundColor: '#e8f5e9', fontWeight: 'bold'},
  errorText: {color: '#e74c3c', backgroundColor: '#fdecea', fontWeight: 'bold'},
  card: {backgroundColor: 'white', borderRadius: 10, padding: 20, elevation: 3},
  sectionHeader: {fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 10, color: '#444', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8},
  label: {fontSize: 16, fontWeight: '600', color: '#555', width: '40%'},
  value: {fontSize: 16, color: '#333', flex: 1, textAlign: 'right'},
  noDataText: {fontStyle: 'italic', color: '#999', textAlign: 'center', marginVertical: 10},
  distanceValue: {fontWeight: 'bold', color: '#2c3e50'},
  buttonContainer: {marginTop: 25, marginBottom: 10},
  button: {paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', elevation: 2},
  punchInButton: {backgroundColor: '#27ae60'},
  punchOutButton: {backgroundColor: '#e74c3c'},
  disabledButton: {opacity: 0.6},
  buttonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  updateItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  updateIndex: {
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
    fontSize: 16,
  },
  activeText: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});
     
export default TravelsData;
     