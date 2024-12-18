import React, {useState, useEffect} from 'react';
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
import {API_URL} from '@env';

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/service-person/pickedup-items`,
      );
      setOrders(response.data.pickupItemsDetail);
      setFilteredOrders(response.data.pickupItemsDetail); 
      setError(''); 
    } catch (error) {
      console.error(error);
      setError('Unable to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = newDate => {
    const date = new Date(newDate);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchOrders();
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query) {
      const filtered = orders.filter(
        order =>
          order.farmerName.toLowerCase().includes(query.toLowerCase()) ||
          order.serialNumber.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  // Render order details
  const renderOrder = ({item}) =>
    item.incoming && (
      <View key={item._id} style={styles.card}>
        <Text
          style={[
            styles.statusText,
            item.incoming ? styles.incoming : styles.outgoing,
          ]}>
          {item.incoming ? 'Incoming' : 'Outgoing'}
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>
              Farmer Name: {item.farmerName}
            </Text>
            <Text style={{color: item.status ? 'green' : 'red'}}>
              {item.status ? 'Completed' : 'Pending'}
            </Text>
          </View>
          <Text style={styles.detailText}>
            Farmer Contact: {item.farmerContact}
          </Text>
          <Text style={styles.detailText}>
            Village Name: {item.farmerVillage}
          </Text>
          <View style={styles.itemList}>
            {item.items.map(({_id, itemName, quantity}) => (
              <Text key={_id} style={styles.detailText}>
                {itemName}: {quantity},{' '}
              </Text>
            ))}
          </View>
          <Text style={styles.detailText}>
            Serial Number: {item.serialNumber}
          </Text>
          <Text style={styles.detailText}>
            RMU Present:{' '}
            {item.withoutRMU === null ? 'N/A' : !item.withoutRMU ? 'YES' : 'NO'}
          </Text>
          <Text style={styles.detailText}>
            RMU Remark: {item.rmuRemark === '' ? 'N/A' : item.rmuRemark}
          </Text>
          {item.arrivedDate && (
            <Text style={styles.detailText}>
              Approved Date: {formatDate(item.arrivedDate)}
            </Text>
          )}
        </View>
      </View>
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
      <Text style={styles.header}>Order History</Text>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Farmer Name or Serial Number"
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor={'#000'}
      />
      {/* Error Alert */}
      {error ? <Alert>{error}</Alert> : null}

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={item => item._id}
      />

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Icon name="refresh" size={30} color="black" />
      </TouchableOpacity>

      
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
  detailsContainer: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    paddingHorizontal: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    color: '#000',
  },
  itemList: {
    flexDirection: 'row',
  },
  statusText: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  incoming: {
    color: 'blue',
  },
  outgoing: {
    color: 'orange',
  },
  refreshButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 8,
    elevation: 5,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd33b',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 16,
  },
});

export default OrderDetails;
