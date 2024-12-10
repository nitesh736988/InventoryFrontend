import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';


const ApprovedData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/service-person/approved-order-history`);
      console.log(response.data.orderHistory);
      setOrders(response.data.orderHistory || []);
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
  const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };
  const filterOrders = () => {
    return orders.filter(
      order =>
        order.servicePersonName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };
  const renderOrderItem = ({item}) => (
    <View key={item._id} style={styles.card}>
      <Text
        style={[
          styles.statusText,
          item.incoming ? styles.incoming : styles.outgoing,
        ]}>
        {item.incoming ? 'Incoming' : 'Outgoing'}
      </Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>Name: {item.servicePersonName}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('InstallationPart', { pickupItemId: item._id })}>
          <Text style={styles.approvedText}>Fill Form</Text>
        </TouchableOpacity>

      </View>
      <Text style={styles.infoText}>Contact: {item.servicePerContact}</Text>
      <Text style={styles.infoText}>Farmer Name: {item.farmerName}</Text>
      <Text style={styles.infoText}>Farmer Contact: {item.farmerContact}</Text>
      <Text style={styles.infoText}>Village Name: {item.farmerVillage}</Text>
      <View style={styles.itemContainer}>
        {item.items.map(({_id, itemName, quantity}) => (
          <Text key={_id} style={styles.infoText}>
            {itemName}: {quantity}
          </Text>
        ))}
      </View>
      <Text style={styles.infoText}>Serial Number: {item.serialNumber}</Text>
      <Text style={styles.infoText}>Remark: {item.remark}</Text>
      <Text style={styles.infoText}>
        Pickup Date: {formatDate(item.pickupDate)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Approved Data</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Name, Serial Number, or Farmer Name"
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
          keyExtractor={item => item._id}
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
    padding: 16,
    backgroundColor: '#fbd33b',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
  refreshIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 16,
    elevation: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default ApprovedData;

