import React, {useState, useEffect} from 'react';
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
import axios from 'axios';
import {API_URL} from '@env';

const RejectedHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/reject-items-history`,
      );
      console.log(response.data.allRejectItemData);
      setOrders(response.data.allRejectItemData);
      
      setFilteredOrders(response.data.allRejectItemData);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch orders');
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

  const renderOrderItem = ({item}) => (
    <View key={item._id} style={styles.card}>
      
      <Text style={styles.infoText}>
        <Text style={styles.titleText}>
          Warehouse Person: <Text style={styles.dataText}>{item.warehousePerson}</Text>
        </Text>
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.titleText}>
          Warehouse Name: <Text style={styles.dataText}>{item.warehouseName}</Text>
        </Text>
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.titleText}>
          Product: <Text style={styles.dataText}>{item.itemName}</Text>
        </Text>
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.titleText}>
          Serial Number: <Text style={styles.dataText}>{item.serialNumber}</Text>
        </Text>
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.titleText}>
          Rejected: <Text style={styles.dataText}>{item.rejected}</Text>
        </Text>
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.titleText}>
          Remark: <Text style={styles.dataText}>{item.remark || 'N/A'}</Text>
        </Text>
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.titleText}>
          Created At: <Text style={styles.dataText}>{formatDate(item.createdAt)}</Text>
        </Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Repaired History</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <>
          
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={item => item._id}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No transactions found.</Text>
            }
          />
        </>
      )}
    </View>
  );
};

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fbd33b',
  },
  searchInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
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
  dataText: {
    fontWeight: 'normal',
    color: '#000',
  },
  titleText: {
    fontWeight: 'bold',
    color: '#000',
  },
  approvedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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

export default RejectedHistory;
