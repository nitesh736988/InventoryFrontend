import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '@env';

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/service-person/view-pickup-items`);
      if (response.status === 200) {
        console.log(response.data.pickupItemsDetail);
        setOrders(response.data.pickupItemsDetail); 
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const dateObject = (newDate) => {
    return new Date(newDate);
  }

  useEffect(() => {
    fetchOrders();
  }, []);
  
  useEffect(() => {
    fetchOrders();
  }, [isRefreshClicked])

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  // if (orders.length === 0) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.header}>Order History</Text>
  //       <Text>No orders found.</Text>
  //     </View>
  //   );
  // }

  const renderOrder = ({ item }) => (
    <View key={item._id} style={styles.card}>
      {/* <Text style={{ color: 'black' }}>{JSON.stringify(item)}</Text> */}
      <View style={{ flexDirection: 'column', borderWidth: 1, borderColor: 'white', borderRadius: 5, marginBottom: 10, backgroundColor: 'white', paddingHorizontal: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{ color: '#000'}}>Farmer Name: {item.farmerName}</Text>
          <Text style={{ color: item.status ? 'green' : 'red' }}>{item.status ? 'Completed' : 'Pending'}</Text>
        </View>
        <Text style={{ color: '#000'}}>Farmer Contact: {item.farmerContact}</Text>
        <Text style={{ color: '#000'}}>Village Name: {item.farmerVillage}</Text>
        <View style={{ flexDirection: 'row'}}>
          {
            (item.items).map(({_id, itemName, quantity }, index) => {
              return <Text key={_id} style={{ color: '#000'}}>{itemName}: {quantity}, </Text>
            })  
          }
        </View>
        <Text style={{ color: '#000'}}>Serial Number: {item.serialNumber}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order History</Text>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item._id} // Use unique ID as key
      />

        <TouchableOpacity style={{ position: 'absolute', top: 16, right: 32 }} 
          onPress={ () => {
            console.log("btn Clicked");
            setIsRefreshClicked(true);
          }} 
        >
          <Icon name='refresh' size={30} color='black' />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fbd33b',
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
  itemContainer: {
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 4,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd33b',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderDetails;