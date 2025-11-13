import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '../../auth/api';;
import {API_URL} from '@env';

const OrderTracker = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async (isRefreshing = false) => {
    if (loading && !isRefreshing) return;

    try {
      if (isRefreshing) setIsRefreshing(true);
      else setLoading(true);

      const response = await api.get(`${API_URL}/admin/upper-order-details`);
      setOrders(response.data.itemDetails || []);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message);
    } finally {
      if (isRefreshing) setIsRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const renderOrder = ({item}) => (
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
          <Text style={styles.cardValue}>
            {item.arrivedDate ? formatDate(item.arrivedDate) : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upper Order Data</Text>
      {loading && orders.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item, index) => item._id || index.toString()}
          onRefresh={() => fetchOrders(true)}
          refreshing={isRefreshing}
          ListEmptyComponent={
            !loading && orders.length === 0 ? (
              <Text style={styles.noOrdersText}>No orders found.</Text>
            ) : null
          }
        />
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
    color: '#000',
    textAlign: 'center',
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
