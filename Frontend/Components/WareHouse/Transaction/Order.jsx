import React from 'react';
import { View } from 'react-native';
import Transaction from './Transaction'


const Order = ({ route }) => {
  // const { isClicked } = route.params;
  return (
    <View style={{ flex: 1, backgroundColor: '#fbd33b', justifyContent: 'flex-start' }}>
      <Transaction  />
    </View>
  );
};

export default Order;
