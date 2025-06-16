import { View, Text, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid, Platform, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

const TravelsData = () => {
  const [punchInLocation, setPunchInLocation] = useState(null);
  const [punchOutLocation, setPunchOutLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  // Check if location services are enabled
  const checkLocationEnabled = async () => {
    try {
      const enabled = await new Promise((resolve) => {
        Geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });
      setLocationEnabled(enabled);
      return enabled;
    } catch (error) {
      console.error('Error checking location:', error);
      return false;
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (status !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
      }
      return true;
    }
  };

  const getCurrentLocation = async () => {
    const isEnabled = await checkLocationEnabled();
    if (!isEnabled) {
      throw new Error('Location services are disabled');
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toLocaleTimeString(),
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
  };

  const openLocationSettings = () => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
    } else {
      Linking.openURL('app-settings:');
    }
  };

  const handlePunchIn = async () => {
    try {
      const location = await getCurrentLocation();
      setPunchInLocation(location);
      setIsPunchedIn(true);
      Alert.alert('Punched In', `Location recorded at ${location.timestamp}`);
    } catch (error) {
      Alert.alert(
        'Location Error',
        error.message,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openLocationSettings }
        ]
      );
    }
  };

  const handlePunchOut = async () => {
    if (!isPunchedIn) {
      Alert.alert('Error', 'You need to Punch In first');
      return;
    }

    try {
      const location = await getCurrentLocation();
      setPunchOutLocation(location);
      setIsPunchedIn(false);
      
      const dist = calculateDistance(
        punchInLocation.latitude,
        punchInLocation.longitude,
        location.latitude,
        location.longitude
      );
      setDistance(dist);
      
      Alert.alert('Punched Out', `Distance: ${dist} km`);
    } catch (error) {
      Alert.alert(
        'Location Error',
        error.message,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openLocationSettings }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Punch In: {punchInLocation ? 
            `${punchInLocation.latitude.toFixed(4)}, ${punchInLocation.longitude.toFixed(4)} at ${punchInLocation.timestamp}` 
            : 'Not recorded'}
        </Text>
        <Text style={styles.infoText}>
          Punch Out: {punchOutLocation ? 
            `${punchOutLocation.latitude.toFixed(4)}, ${punchOutLocation.longitude.toFixed(4)} at ${punchOutLocation.timestamp}` 
            : 'Not recorded'}
        </Text>
        {distance && (
          <Text style={styles.distanceText}>
            Distance Traveled: {distance} km
          </Text>
        )}
      </View>

      {!isPunchedIn ? (
        <TouchableOpacity 
          style={[styles.button, styles.punchInButton]} 
          onPress={handlePunchIn}
        >
          <Text style={styles.buttonText}>Punch In</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[styles.button, styles.punchOutButton]} 
          onPress={handlePunchOut}
        >
          <Text style={styles.buttonText}>Punch Out</Text>
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
  },
  infoContainer: {
    marginBottom: 30,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  distanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2c3e50',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  punchInButton: {
    backgroundColor: '#4CAF50',
  },
  punchOutButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TravelsData;