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
      console.log("Fetching orders from:", API_URL);
      const response = await axios.get(`${API_URL}/warehouse-admin/warehouse-in-out-orders`);

      console.log("API Response:", response.data);

      const items = response.data.pickupItems || []; // Ensure array
      setOrders(items);
      setFilteredOrders(items);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    const lowercasedQuery = searchQuery.toLowerCase();

    const filtered = orders.filter(order => {
      const servicePersonName = order?.servicePerson?.name?.toLowerCase() || '';
      const farmerSaralId = String(order.farmerSaralId || '').toLowerCase();
      const farmerContact = String(order.farmerContact || '').toLowerCase();
      const farmerName = String(order.farmerName || '').toLowerCase();
      const farmerVillage = String(order.farmerVillage || '').toLowerCase();

      return (
        servicePersonName.includes(lowercasedQuery) ||
        farmerSaralId.includes(lowercasedQuery) ||
        farmerContact.includes(lowercasedQuery) ||
        farmerName.includes(lowercasedQuery) ||
        farmerVillage.includes(lowercasedQuery) 
      );
    });

    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrderItem = ({ item }) => {
    console.log("Rendering item:", item);
    const pickupDate = item.pickupDate.split("T");

    return (
      <View key={item._id} style={styles.card}>
        <Text style={[styles.statusText, styles.outgoing]}>Outgoing</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            <Text style={styles.titleText}>ServicePerson Name: </Text>
            <Text style={styles.dataText}>{item.servicePerson?.name || 'N/A'}</Text>
          </Text>

          <Text
            style={[
              styles.approvedText,
              { color: item.status ? 'green' : 'red' },
            ]}>
            {item.status ? 'Completed' : 'Pending'}
          </Text>
        </View>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>ServicePerson Contact: </Text>
          <Text style={styles.dataText}>{item.servicePerson?.contact || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Farmer SaralId: </Text>
          <Text style={styles.dataText}>{item.farmerSaralId || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Farmer Name: </Text>
          <Text style={styles.dataText}>{item.farmerName || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Farmer Village: </Text>
          <Text style={styles.dataText}>{item.farmerVillage || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Farmer Contact: </Text>
          <Text style={styles.dataText}>{item.farmerContact || 'N/A'}</Text>
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
          <Text style={styles.titleText}>Serial Number: </Text>
          <Text style={styles.dataText}>{item.serialNumber || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Remark: </Text>
          <Text style={styles.dataText}>{item.remark || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Pickup Date: </Text>
          <Text style={styles.dataText}>{ pickupDate[0]|| 'N/A'}</Text>
        </Text>
      </View>
    );
  };

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
        placeholder="Search by servicePerson, farmerSaralId, farmer Name, Village, farmerContact"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={'#000'}
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
    color: 'black',
  },
  searchBar: {
    height: 60,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
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
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd33b',
  },
});

export default Outgoing;
