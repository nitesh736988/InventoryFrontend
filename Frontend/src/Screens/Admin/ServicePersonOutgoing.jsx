import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import api from '../../auth/api';;
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');

const ServicePersonOutgoing = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const response = await api.get(`${API_URL}/admin/outgoing-items-data`);
      console.log(response.data.data);
      setOrders(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch orders');
      console.log('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrderItem = ({ item }) => (
    <View key={item._id} style={styles.card}>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          Name: {item.servicePerson?.name || 'N/A'}
        </Text>
      </View>
      <View style={styles.contactRow}>
        <Text style={styles.infoText}>
          Contact: {item.servicePerson?.contact || 'N/A'}
        </Text>
      </View>
      <View style={styles.itemContainer}>
        {item.items?.map(({ _id, itemName, quantity }) => (
          <Text key={_id} style={styles.itemText}>
            {itemName}: {quantity}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Outgoing Items</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions found.</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04,
    backgroundColor: '#fbd33b',
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: width * 0.05,
    textAlign: 'center',
  },
  card: {
    padding: width * 0.04,
    marginVertical: height * 0.02, 
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  infoText: {
    color: '#000',
    fontSize: width * 0.04,
    marginBottom: height * 0.005, 
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: height * 0.01,
  },
  itemText: {
    color: '#000',
    fontSize: width * 0.04,
    marginRight: width * 0.04, 
    marginBottom: height * 0.005, 
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: '#555',
    marginTop: height * 0.02, 
  },
});

export default ServicePersonOutgoing;
