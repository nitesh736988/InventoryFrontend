import React from 'react';
import { View, Button, Linking, Alert, TouchableOpacity } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const OpenGoogleMaps = ({ longitude, latitude }) => {
  console.log(longitude, latitude);
  const openMap = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to open Google Maps");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
      <TouchableOpacity onPress={openMap}>
        <MaterialCommunityIcon name='google-maps' size={28} color='#000' />
      </TouchableOpacity>
  );
};

export default OpenGoogleMaps;
