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

const ThirdPartyOutgoingHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/outgoing-items-data`,
      );
      setOrders(response.data.data || []);
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
      <Text style={{...styles.cardTitle, color: '#000'}}>{label}:</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  const renderItem = (item) => (
    <View style={styles.itemContainer}>
      <OrderDetail label="Item Name" value={item.itemName} />
      <OrderDetail label="Quantity" value={item.quantity} />
    </View>
  );

  const renderOrder = ({item}) => (
    <View style={styles.card}>
      <OrderDetail label="From Warehouse" value={item.fromWarehouse} />
      <OrderDetail label="To Service Center" value={item.toServiceCenter} />
      <OrderDetail 
        label="Sending Date" 
        value={formatDate(item.sendingDate)}     
      />
      <Text style={{...styles.cardTitle, marginTop: 10}}>Items:</Text>
      {item.items.map((item, index) => (
        <View key={index}>
          {renderItem(item)}
        </View>
      ))}
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
        <Text style={styles.header}>Third Party Outgoing History</Text>
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
        <Text style={styles.emptyMessage}>No orders found.</Text>
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
    color: 'black',
    textAlign: 'center',
  },
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
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

export default ThirdPartyOutgoingHistory;