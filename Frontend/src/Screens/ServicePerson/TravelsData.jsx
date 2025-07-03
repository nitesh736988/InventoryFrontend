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
  AppState,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import BackgroundTimer from 'react-native-background-timer';

// For Android foreground service
const {LocationForegroundService} = NativeModules;
const serviceEventEmitter = Platform.OS === 'android' ? new NativeEventEmitter(LocationForegroundService) : null;

const TravelsData = () => {
  const [loading, setLoading] = useState(false);
  const [punchInData, setPunchInData] = useState(null);
  const [punchOutData, setPunchOutData] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Ready');
  const [locationUpdates, setLocationUpdates] = useState([]);
  const [appState, setAppState] = useState(AppState.currentState);
  const locationIntervalRef = useRef(null);
  const watchIdRef = useRef(null);
  const serviceEventSubscription = useRef(null);

  useEffect(() => {
    // Handle app state changes (foreground/background)
    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      console.log(`App state changed from ${appState} to ${nextAppState}`);
      setAppState(nextAppState);
      
      // Optimize tracking based on app state
      if (nextAppState === 'background' && isPunchedIn) {
        adjustBackgroundTracking();
      } else if (nextAppState === 'active' && isPunchedIn) {
        adjustForegroundTracking();
      }
    });

    // Set up Android foreground service event listener
    if (Platform.OS === 'android' && serviceEventEmitter) {
      serviceEventSubscription.current = serviceEventEmitter.addListener(
        'locationUpdate',
        (location) => {
          const newLocation = formatPosition({
            coords: {
              latitude: location.latitude,
              longitude: location.longitude,
              accuracy: location.accuracy,
            },
            timestamp: Date.now(),
          });
          setLocationUpdates(prev => [...prev, newLocation]);
        }
      );
    }

    return () => {
      appStateSubscription.remove();
      if (serviceEventSubscription.current) {
        serviceEventSubscription.current.remove();
      }
      stopLocationTracking();
    };
  }, [isPunchedIn]);

  const adjustBackgroundTracking = () => {
    if (watchIdRef.current) {
      Geolocation.clearWatch(watchIdRef.current);
    }
    
    // Use less frequent updates in background to save battery
    watchIdRef.current = Geolocation.watchPosition(
      position => {
        const newLocation = formatPosition(position);
        setLocationUpdates(prev => [...prev, newLocation]);
      },
      error => {
        console.log('Background location error:', error);
      },
      {
        enableHighAccuracy: false,
        distanceFilter: 100, // Only update when moved 100 meters
        interval: 300000, // 5 minutes
        fastestInterval: 60000, // 1 minute
      },
    );
  };

  const adjustForegroundTracking = () => {
    if (watchIdRef.current) {
      Geolocation.clearWatch(watchIdRef.current);
    }
    
    // More frequent updates in foreground
    watchIdRef.current = Geolocation.watchPosition(
      position => {
        const newLocation = formatPosition(position);
        setLocationUpdates(prev => [...prev, newLocation]);
      },
      error => {
        console.log('Foreground location error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: 10000, // 10 seconds
        fastestInterval: 5000, // 5 seconds
      },
    );
  };

  const handleLocationPermission = async () => {
    try {
      let foregroundPermission, backgroundPermission;
      
      if (Platform.OS === 'android') {
        foregroundPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        backgroundPermission = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
      } else {
        foregroundPermission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        backgroundPermission = PERMISSIONS.IOS.LOCATION_ALWAYS;
      }

      // First check foreground permission
      const foregroundStatus = await check(foregroundPermission);
      if (foregroundStatus !== RESULTS.GRANTED) {
        const requestStatus = await request(foregroundPermission);
        if (requestStatus !== RESULTS.GRANTED) {
          return false;
        }
      }

      // Then check background permission
      const backgroundStatus = await check(backgroundPermission);
      if (backgroundStatus === RESULTS.GRANTED) {
        return true;
      }

      if (backgroundStatus === RESULTS.DENIED || backgroundStatus === RESULTS.LIMITED) {
        const requestStatus = await request(backgroundPermission);
        return requestStatus === RESULTS.GRANTED;
      }

      if (backgroundStatus === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Required',
          'Background location permission is required for tracking. Please enable it in app settings.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: () => Linking.openSettings()},
          ],
        );
        return false;
      }

      return false;
    } catch (error) {
      console.log('Permission error:', error);
      Alert.alert('Error', 'Failed to check location permissions');
      return false;
    }
  };

  const checkLocationServices = async () => {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        () => resolve(true),
        error => {
          if (error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE) {
            resolve(false);
          } else {
            resolve(true);
          }
        },
        {enableHighAccuracy: false, timeout: 5000},
      );
    });
  };

  const formatPosition = position => {
    return {
      longitude: position.coords.longitude.toString(),
      latitude: position.coords.latitude.toString(),
      time: new Date(position.timestamp || Date.now()).toLocaleTimeString(),
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp || Date.now()).toISOString(),
    };
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await handleLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      const servicesEnabled = await checkLocationServices();
      if (!servicesEnabled) {
        throw new Error('Location services disabled. Please enable GPS.');
      }

      try {
        const highAccuracyPosition = await new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            pos => {
              if (pos.coords.accuracy < 50) {
                resolve(pos);
              } else {
                reject(new Error('High accuracy location not available'));
              }
            },
            error => reject(error),
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            },
          );
        });

        return formatPosition(highAccuracyPosition);
      } catch (highAccuracyError) {
        console.log('High accuracy failed, trying standard accuracy');

        const standardPosition = await new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            pos => resolve(pos),
            error => reject(error),
            {
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 30000,
            },
          );
        });

        if (standardPosition.coords.accuracy > 200) {
          throw new Error('Location accuracy too low. Please move to an open area.');
        }

        return formatPosition(standardPosition);
      }
    } catch (error) {
      console.log('Location error:', error);
      let errorMsg = 'Failed to get location';

      if (error.code === error.TIMEOUT) {
        errorMsg = 'Location request timed out. Please ensure GPS is enabled and try again.';
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMsg = 'Location unavailable. Please check your GPS signal.';
      } else if (error.message.includes('accuracy')) {
        errorMsg = 'Weak GPS signal. Please move to an open area.';
      } else if (error.message.includes('disabled')) {
        errorMsg = 'Location services disabled. Please enable GPS.';
      }

      throw new Error(errorMsg);
    }
  };

  const startBackgroundTracking = async () => {
    // For Android, start foreground service
    if (Platform.OS === 'android' && LocationForegroundService) {
      try {
        await LocationForegroundService.startService(
          'Travel Tracker Active',
          'Tracking your travel distance',
          'Travel Tracker is running in the background to track your location',
        );
      } catch (e) {
        console.log('Foreground service error:', e);
      }
    }

    // Start watching position
    adjustForegroundTracking();

    // Fallback interval for when watchPosition might fail
    locationIntervalRef.current = BackgroundTimer.setInterval(async () => {
      try {
        const loc = await getCurrentLocation();
        setLocationUpdates(prev => [...prev, loc]);
      } catch (err) {
        console.log('Background update failed:', err);
      }
    }, 300000); // 5 minutes as fallback
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (locationIntervalRef.current) {
      BackgroundTimer.clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }

    if (Platform.OS === 'android' && LocationForegroundService) {
      LocationForegroundService.stopService();
    }
  };

  const handlePunchIn = async () => {
    try {
      setLoading(true);
      setLocationStatus('Checking location services...');

      const hasPermission = await handleLocationPermission();
      if (!hasPermission) {
        throw new Error('Background location permission not granted');
      }

      const servicesEnabled = await checkLocationServices();
      if (!servicesEnabled) {
        throw new Error('Location services disabled. Please enable GPS.');
      }

      const location = await getCurrentLocation();
      setPunchInData(location);
      setIsPunchedIn(true);
      setLocationUpdates([location]);
      setLocationStatus('Punched in successfully - tracking started');

      await startBackgroundTracking();
    } catch (error) {
      let errorMessage = error.message;

      Alert.alert('Location Required', errorMessage, [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Retry', onPress: handlePunchIn},
        {text: 'Open Settings', onPress: () => Linking.openSettings()},
      ]);
      setLocationStatus('Punch in failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    try {
      setLoading(true);
      setLocationStatus('Getting final location...');

      const location = await getCurrentLocation();
      setPunchOutData(location);
      setIsPunchedIn(false);
      setLocationStatus('Punched out successfully - tracking stopped');

      stopLocationTracking();

      if (punchInData && punchInData.latitude && punchInData.longitude) {
        const dist = calculateDistance(
          parseFloat(punchInData.latitude),
          parseFloat(punchInData.longitude),
          parseFloat(location.latitude),
          parseFloat(location.longitude),
        );
        setDistance(dist);
      }
    } catch (error) {
      let errorMessage = error.message;

      if (error.message.includes('timed out')) {
        errorMessage = 'Could not get location quickly enough.';
      } else if (error.message.includes('disabled')) {
        errorMessage = 'Location services are disabled.';
      }

      Alert.alert('Error', errorMessage, [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Retry', onPress: handlePunchOut},
      ]);
      setLocationStatus('Punch out failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const formatDistance = meters => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(2)} meters`;
  };

  const renderLocationUpdate = ({item, index}) => (
    <View style={styles.updateItem}>
      <Text style={styles.updateIndex}>Update #{index + 1}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>{item.time}</Text>
      </View>
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
        <Text style={styles.value}>{item.accuracy.toFixed(2)} meters</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Travel Tracker</Text>

      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            locationStatus.includes('successfully')
              ? styles.successText
              : locationStatus.includes('failed')
              ? styles.errorText
              : styles.defaultStatusText,
          ]}>
          {locationStatus}
        </Text>
      </View>

      <View style={styles.card}>
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
            <View style={styles.row}>
              <Text style={styles.label}>Accuracy:</Text>
              <Text style={styles.value}>
                {punchInData.accuracy.toFixed(2)} meters
              </Text>
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
            <View style={styles.row}>
              <Text style={styles.label}>Accuracy:</Text>
              <Text style={styles.value}>
                {punchOutData.accuracy.toFixed(2)} meters
              </Text>
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
              style={[styles.button, styles.punchInButton]}
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
              style={[styles.button, styles.punchOutButton]}
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
              Location Updates ({locationUpdates.length})
            </Text>
            <FlatList
              data={locationUpdates}
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  statusContainer: {
    marginBottom: 15,
  },
  statusText: {
    textAlign: 'center',
    padding: 8,
    borderRadius: 5,
  },
  defaultStatusText: {
    color: '#666',
    backgroundColor: '#f0f0f0',
  },
  successText: {
    color: '#27ae60',
    backgroundColor: '#e8f5e9',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e74c3c',
    backgroundColor: '#fdecea',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    width: '40%',
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  noDataText: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginVertical: 10,
  },
  distanceValue: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  buttonContainer: {
    marginTop: 25,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  punchInButton: {
    backgroundColor: '#27ae60',
  },
  punchOutButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  },
});

export default TravelsData;