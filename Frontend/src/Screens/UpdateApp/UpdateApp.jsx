import React from 'react';
import { View, Text, Linking, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';

const UpdateApp = () => {
  const route = useRoute();
  const { appLink } = route.params;
  console.log('UpdateApp received appLink:', appLink);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Update Required</Text>
      <Text style={{ marginVertical: 10 }}>New version available!</Text>
      <Button 
        title="Update Now"
        onPress={() => Linking.openURL(appLink)}
      />
    </View>
  );
};

export default UpdateApp;
