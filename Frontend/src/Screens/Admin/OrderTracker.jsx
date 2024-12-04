import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_URL } from '@env';

const OrderTracker = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/upper-order-details`);
      console.log('API Response:', response.data);
        setOrders(response.data.itemDetails || []); 
    } catch (error) {
      console.log('API Error:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Unable to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>Coming From:</Text>
          <Text style={styles.cardValue}>{item.itemComingFrom || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>Warehouse:</Text>
          <Text style={styles.cardValue}>{item.warehouse || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>Item:</Text>
          <Text style={styles.cardValue}>{item.itemName || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>Quantity:</Text>
          <Text style={styles.cardValue}>{item.quantity || 0}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>Defective:</Text>
          <Text style={styles.cardValue}>{item.defectiveItem || 0}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>Arrival Date:</Text>
          <Text style={styles.cardValue}>{item.arrivedDate ? formatDate(item.arrivedDate) : 'N/A'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Upper Order History</Text>
        <TouchableOpacity onPress={fetchOrders}>
          <Icon name="refresh" size={30} color="black" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item, index) => item._id || index.toString()}
        />
      ) : (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fbd33b',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
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
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrdersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default OrderTracker;
