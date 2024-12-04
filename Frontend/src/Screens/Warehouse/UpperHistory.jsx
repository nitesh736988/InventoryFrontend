import React, {useState, useEffect, useCallback} from 'react';
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
import {API_URL} from '@env';

const UpperHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/incoming-items-data`,
      );
      setOrders(response.data.incomingItemsData || []);
    } catch (error) {
      Alert.alert('Error', error.message || 'Unable to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = date => {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${
      newDate.getMonth() + 1
    }/${newDate.getFullYear()}`;
  };

  const OrderDetail = ({label, value}) => (
    <View style={styles.detailRow}>
      <Text style={styles.cardTitle}>{label}:</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  const renderOrder = ({item}) => (
    <View style={styles.card}>
      <View style={styles.itemContainer}>
        <OrderDetail label="Coming From" value={item.itemComingFrom} />
        <OrderDetail label="Warehouse" value={item.warehouse} />
        <OrderDetail label="Item Name" value={item.itemName} />
        <OrderDetail label="Quantity" value={item.quantity} />
        <OrderDetail label="Defective" value={item.defectiveItem} />
        <OrderDetail
          label="Arrival Date"
          value={formatDate(item.arrivedDate)}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Order History</Text>
        <TouchableOpacity onPress={fetchOrders}>
          <Icon name="refresh" size={30} color="black" />
        </TouchableOpacity>
      </View>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item._id}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>No orders found.</Text>
          }
        />
      ) : (
        <Text>No orders found.</Text>
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContainer: {
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: 16,
    color: '#555',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default UpperHistory;
