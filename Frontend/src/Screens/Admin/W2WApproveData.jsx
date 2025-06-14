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

const W2WApproveData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/admin/warehouse-to-warehouse-data`);
      // console.log(response.data.defectiveOrderData);

      setOrders(response.data.defectiveOrderData || []);
    } catch (error) {
      Alert.alert('Error', error?.responae?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setLoadingRefresh(true);
    await fetchOrders();
    setLoadingRefresh(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = date => {
    if (!date) return 'N/A';
    const newDate = new Date(date);
    return `${newDate.getDate().toString().padStart(2, '0')}/${(
      newDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${newDate.getFullYear()}`;
  };

  const renderOrder = ({item}) => (
    <View style={styles.card}>
      <OrderDetail label="From Warehouse" value={item.fromWarehouse} />
      <OrderDetail label="To Warehouse" value={item.toWarehouse} />
      {item.items.map(({_id, itemName, quantity}, index) => (
        <OrderDetail
          key={_id}
          label={`Item${index + 1}`}
          value={`${itemName} : ${quantity}`}
        />
      ))}

      <OrderDetail label="Defective" value={item.isDefective ? 'Yes' : 'No'} />
      <OrderDetail label="Driver Name" value={item.driverName} />
      <OrderDetail label="Driver Contact" value={item.driverContact} />
      <OrderDetail label="Remarks" value={item.remarks} />
      <OrderDetail label="Pickup Date" value={formatDate(item.pickupDate)} />
      {item.approvedBy && (
        <OrderDetail label="Approved By" value={item.approvedBy} />
      )}
      <OrderDetail label="Arrival Date" value={formatDate(item.arrivedDate)} />
    </View>
  );

  const OrderDetail = ({label, value = 'N/A'}) => (
    <View style={styles.detailRow}>
      <Text style={styles.cardTitle}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
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
        <Text style={styles.header}>W2W Approved</Text>
        <TouchableOpacity onPress={handleRefresh}>
          {loadingRefresh ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Icon name="refresh" size={30} color="black" />
          )}
        </TouchableOpacity>
      </View>
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item._id || item.id || `${Math.random()}`}
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
    color: 'black'
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
    marginVertical: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardValue: {
    fontSize: 16,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noOrdersText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default W2WApproveData;
