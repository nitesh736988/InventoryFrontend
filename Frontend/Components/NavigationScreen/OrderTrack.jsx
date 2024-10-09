import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; 

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post('http://192.168.68.108:8080/admin/transactions/autoTransactions');
        if (response.status === 200) {
          setOrders(response.data.orders); 
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Unable to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text>Order ID: {item.id}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Total: ${item.total}</Text>
            <Text>Pump: {item.pump}</Text> 
            <Text>Motor: {item.motor}</Text> 
            <Text>Controller: {item.controller}</Text> 
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default TrackOrder;
