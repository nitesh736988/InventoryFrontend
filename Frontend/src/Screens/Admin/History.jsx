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
} from 'react-native';
import api from '../../auth/api';;
import { API_URL } from '@env';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const response = await api.get(
        `${API_URL}/admin/all-transactions-data`
      );
      setOrders(response.data.pickupItems);
      setFilteredOrders(response.data.pickupItems);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message);
      // console.log('Error fetching orders:', error?.response?.data?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = orders.filter(
        (order) =>
          order.servicePerson?.name.toLowerCase().includes(lowerCaseQuery) ||
          order.farmerName.toLowerCase().includes(lowerCaseQuery) ||
          order.serialNumber.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredOrders(filtered);
    }
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
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          Service Name: {item?.servicePerson?.name || 'N/A'}
        </Text>
        {item.status && (
          <Text style={styles.approvedText}>Approved Success</Text>
        )}
      </View>
      <Text style={styles.infoText}>
        Service Contact: {item?.servicePerson?.contact || 'N/A'}
      </Text>
      <Text style={styles.infoText}>Farmer Name: {item.farmerName || 'N/A'}</Text>
      <Text style={styles.infoText}>
        Farmer Contact: {item.farmerContact || 'N/A'}
      </Text>
      <Text style={styles.infoText}>Village Name: {item.farmerVillage || 'N/A'}</Text>
      <View style={styles.itemContainer}>
        {item.items.map(({ _id, itemName, quantity }) => (
          <Text key={_id} style={styles.infoText}>
            {itemName}: {quantity}
          </Text>
        ))}
      </View>
      <Text style={styles.infoText}>
        Serial Number: {item.serialNumber || 'N/A'}
      </Text>
      <Text style={styles.infoText}>Remark: {item.remark || 'N/A'}</Text>
      {item.incoming && (
        <Text style={styles.infoText}>
          RMU Present: {item?.withoutRMU ? (!item.withoutRMU ? 'YES' : 'NO') : 'N/A'}
        </Text>
      )}
      {item.incoming && (
        <Text style={styles.infoText}>
          RMU Remark: {item?.rmuRemark || 'N/A'}
        </Text>
      )}
      <Text style={styles.infoText}>
        Pickup Date: {item?.pickupDate ? formatDate(item.pickupDate) : 'N/A'}
      </Text>
      {item?.approvedBy && (
        <Text style={styles.infoText}>Approved By: {item.approvedBy}</Text>
      )}
      {item?.arrivedDate && (
        <Text style={styles.infoText}>
          Arrived Date: {formatDate(item.arrivedDate)}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Return Item</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name, serial number, or farmer"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={filteredOrders}
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
    color: '#000'
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
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
    marginBottom: 8,
  },
  infoText: {
    color: '#000',
    marginBottom: 4,
  },
  approvedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
});

export default History;
