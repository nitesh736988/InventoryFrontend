import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Distributor = () => {
  return (
    <View style={styles.container}>
      <Text>Distributor</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Distributor;
