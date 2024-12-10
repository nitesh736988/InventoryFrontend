import React, { useEffect } from 'react';
import { View, PermissionsAndroid } from 'react-native';
import AppNavigator from './src/AppNavigator';
import MapView from 'react-native-maps'; // Make sure you have this package installed

const App = () => {

//   useEffect(() => {
//     requestLocationPermission();
//   }, []);

//   const requestLocationPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message: 'This app needs access to your location ' +
//             'so you can view nearby places.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('You can use the Location');
//       } else {
//         console.log('Location permission denied');
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
      {/* <MapView
        style={{ width: '100%', height: '100%' }}
        initialRegion={{
          latitude: 28.693602091083623,
          longitude: 77.21464383448563,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onRegionChange={(x) => {
          console.log(x);
        }}
      /> */}
    </View>
  );
};

export default App;
