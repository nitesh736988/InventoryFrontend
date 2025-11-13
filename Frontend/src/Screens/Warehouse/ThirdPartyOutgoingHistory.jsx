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
import api from '../../auth/api';;
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';

const ThirdPartyOutgoingHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
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
      <Text style={styles.cardTitle}>{label}:</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  const renderFarmer = (farmer, index) => (
    <View key={index} style={styles.farmerContainer}>
      <Text style={styles.farmerTitle}>
        Farmer Saral ID: {farmer.farmerSaralId}
      </Text>
      {farmer.items.map((item, i) => (
        <View key={i} style={styles.itemContainer}>
          <OrderDetail label="Item Name" value={item.itemName} />
          <OrderDetail label="Quantity" value={item.quantity} />
        </View>
      ))}
    </View>
  );

  const renderOrder = ({item}) => (
    <View style={styles.card}>
      <OrderDetail label="From Warehouse" value={item.fromWarehouse} />
      <OrderDetail label="To Service Center" value={item.toServiceCenter} />
      <OrderDetail label="Driver Name" value={item.driverName || 'NA'} />
      <OrderDetail label="Driver Contact" value={item.driverContact || 'NA'} />
      <OrderDetail label="Vehicle Details" value={item.vehicleNumber || 'NA'} />
      <OrderDetail label="Status" value={item.status} />
      <OrderDetail label="Sending Date" value={formatDate(item.sendingDate)} />

      {/* Status-based button or label */}
      {item.status === 'Pending' || item.status === 'Partially Received' ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('IncomingStock', {
              outgoingId: item?._id,
              receivedItems: item?.farmers,
            });
          }}
          style={styles.fillFormButton}>
          <Text style={styles.fillFormText}>Fill Form</Text>
        </TouchableOpacity>
      ) : item.status === 'Fully Received' ? (
        <Text style={styles.doneText}>Done</Text>
      ) : null}

      <Text style={styles.sectionTitle}>Farmers & Items:</Text>
      {item.farmers.map(renderFarmer)}
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
          <Icon name="refresh" size={28} color="black" />
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    color: 'black',
  },
  farmerContainer: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  farmerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 6,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    marginVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  cardValue: {
    fontSize: 15,
    color: '#555',
  },
  fillFormButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  fillFormText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  doneText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThirdPartyOutgoingHistory;
