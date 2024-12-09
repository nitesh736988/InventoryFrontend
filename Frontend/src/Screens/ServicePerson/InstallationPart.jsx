import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';
import { API_URL } from '@env';

const InstallationPart = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/service-person/approved-order-history`);
      setOrders(response.data.orderHistory || []);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch orders');
      console.log('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.log('Error getting location:', error);
        Alert.alert('Error', 'Unable to retrieve location. Please check permissions.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    fetchOrders();
    fetchLocation();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
    fetchLocation();
  };

  const filterOrders = () => {
    return orders.filter(
      (order) =>
        order.servicePersonName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderOrderItem = ({ item }) => (
    <View key={item._id} style={styles.card}>
      <Text
        style={[
          styles.statusText,
          item.incoming ? styles.incoming : styles.outgoing,
        ]}
      >
        {item.incoming ? 'Incoming' : 'Outgoing'}
      </Text>
      <Text style={styles.infoText}>Farmer Name: {item.farmerName}</Text>
      <Text style={styles.infoText}>Farmer Contact: {item.farmerContact}</Text>
      <Text style={styles.infoText}>Village Name: {item.farmerVillage}</Text>
      <View style={styles.itemContainer}>
        {item.items.map(({ _id, itemName, quantity }) => (
          <Text key={_id} style={styles.infoText}>
            {itemName}: {quantity}
          </Text>
        ))}
      </View>
      <Text style={styles.infoText}>Serial Number: {item.serialNumber}</Text>
      <Text style={styles.infoText}>
        Pickup Date: {formatDate(item.pickupDate)}
      </Text>
      {item.approvedBy && (
        <Text style={styles.infoText}>Approved By: {item.approvedBy}</Text>
      )}
      {item.arrivedDate && (
        <Text style={styles.infoText}>
          Approved Date: {formatDate(item.arrivedDate)}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Installation Part</Text>

      <Text style={styles.infoText}>
        Current Location: {location.latitude}, {location.longitude}
      </Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Farmer Name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={filterOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions found.</Text>
          }
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fbd33b',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
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
    marginBottom: 6,
  },
  infoText: {
    color: '#000',
    marginBottom: 3,
  },
  approvedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 16,
    elevation: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginTop: 20,
  },
  searchBar: {
    height: 36,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
});

export default InstallationPart;
