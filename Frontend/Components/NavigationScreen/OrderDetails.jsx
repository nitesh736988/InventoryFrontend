import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import Video from 'react-native-video'; // Import react-native-video for playing videos
import axios from 'axios'; 

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://192.168.68.100:8080/admin/transactions/allTransactions');
        if (response.status === 200) {
          setOrders(response.data.data); 
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
      {
      orders.map(({ _id, servicePerson, items, videoProof }) => (
          <View key={_id} style={styles.card}>
            <Text style={styles.cardTitle}>{servicePerson.name}</Text>
            <Text style={styles.cardTitle}>{servicePerson.contact}</Text>
            {
              items.map(({ _id, itemName, quantity }) => (
                <View key={_id} style={styles.card}>
                  <Text style={styles.cardTitle}>{itemName}</Text>
                  <Text style={styles.cardTitle}>{quantity}</Text>
                </View>
              ))
            }
           
            {videoProof && (
              <Video
                source={{ url: videoProof }}  
                style={styles.video}
                controls={true}  
                resizeMode="contain"
              />
            )}
          </View>
      ))
    }
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
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  video: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderDetails;
