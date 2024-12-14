import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Dimensions,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const Outgoing = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/warehouse-in-out-orders`,
      );
      setOrders(response.data.pickupItems);
      setFilteredOrders(response.data.pickupItems);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const lowercasedQuery = searchQuery.toLowerCase();
      return (
        (order.servicePerson &&
          (order.servicePerson.name.toLowerCase().includes(lowercasedQuery) ||
            order.farmerName.toLowerCase().includes(lowercasedQuery) ||
            order.serialNumber.toLowerCase().includes(lowercasedQuery))) ||
        order.farmerName.toLowerCase().includes(lowercasedQuery) ||
        order.serialNumber.toLowerCase().includes(lowercasedQuery)
      );
    });
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrderItem = ({ item }) => (
    <>
      {!item.incoming && (
        <View key={item._id} style={styles.card}>
          <Text
            style={[styles.statusText, item.incoming ? styles.incoming : styles.outgoing]}>
            Outgoing
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              <Text style={styles.titleText}>
                ServicePerson Name:{' '}
                <Text style={styles.dataText}>
                  {item.servicePerson ? item.servicePerson.name : 'N/A'}
                </Text>
              </Text>
            </Text>
            <Text
              style={[styles.approvedText, { color: item.status ? 'green' : 'red' }]}>
              {item.status ? 'Completed' : 'Pending'}
            </Text>
          </View>

          <Text style={styles.infoText}>
            <Text style={styles.titleText}>
              ServicePerson Contact:{' '}
              <Text style={styles.dataText}>{item.servicePerson?.contact}</Text>
            </Text>
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.titleText}>
              Farmer Name:{' '}
              <Text style={styles.dataText}>{item.farmerName}</Text>
            </Text>
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.titleText}>
              Farmer Contact:{' '}
              <Text style={styles.dataText}>{item.farmerContact}</Text>
            </Text>
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.titleText}>
              Village Name:{' '}
              <Text style={styles.dataText}>{item.farmerVillage}</Text>
            </Text>
          </Text>

          <View style={styles.itemContainer}>
            <Text style={styles.infoText}>
              <Text style={styles.titleText}>Product: </Text>
            </Text>
            {item.items.map(({ _id, itemName, quantity }) => (
              <Text key={_id} style={styles.dataText}>
                {itemName}: {quantity + ' '} 
              </Text>
            ))}
          </View>
          
          <Text style={styles.infoText}>
            <Text style={styles.titleText}>
              Serial Number:{' '}
              <Text style={styles.dataText}>{item.serialNumber}</Text>
            </Text>
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.titleText}>
              Remark: <Text style={styles.dataText}>{item.remark}</Text>
            </Text>
          </Text>
        </View>
      )}
    </>
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={styles.loadingIndicator}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Outgoing Items</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search by name, serial number, or farmer"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const { width } = Dimensions.get('window');

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
    textAlign: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
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
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  incoming: {
    color: 'purple',
  },
  outgoing: {
    color: 'orange',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    color: '#000',
  },
  titleText: {
    fontWeight: 'bold',
    color: '#000',
  },
  dataText: {
    fontWeight: 'normal',
    color: '#000',
  },
  approvedText: {
    color: 'green',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginBottom: 8,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd33b',
  },
});

export default Outgoing;

