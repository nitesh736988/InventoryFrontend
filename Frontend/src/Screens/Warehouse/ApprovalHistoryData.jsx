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
import api from '../../auth/api';;
import Icon from 'react-native-vector-icons/FontAwesome';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';

const ApprovalHistoryData = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `${API_URL}/warehouse-admin/approved-order-history`,
      );
      console.log(response.data.orderHistory);
      setOrders(response.data.orderHistory);
      setFilteredOrders(response.data.orderHistory);
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error.response.data?.message));
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

  const handleSearch = query => {
    setSearchQuery(query);
    if (query) {
      const filtered = orders.filter(
        order =>
          order.servicePerson.name
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          order.farmerName.toLowerCase().includes(query.toLowerCase()) ||
          order.serialNumber.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
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
        <Text style={styles.infoText}>
          <Text style={styles.titleText}>
            ServicePerson Name:{' '}
            <Text style={styles.dataText}>{item.servicePerson.name}</Text>
          </Text>
        </Text>

        {item.status && (
          <Text style={styles.approvedText}>Approved Success</Text>
        )}
      </View>

      <Text style={styles.infoText}>
        <Text style={styles.titleText}>
          ServicePerson Contact:{' '}
          <Text style={styles.dataText}>{item.servicePerson.contact}</Text>
        </Text>
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.titleText}>
          Farmer Name: <Text style={styles.dataText}>{item.farmerName}</Text>
        </Text>
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.titleText}>
          Farmer Contact:
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
        <Text style={styles.titleText}>Product: </Text>
        {item.items.map(({_id, itemName, quantity}) => (
          <Text key={_id} style={styles.infoText}>
            <Text style={styles.dataText}>{itemName}</Text>: {quantity}
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

      {item.incoming && (
        <Text style={styles.infoText}>
          <Text style={styles.titleText}>
            RMU Present:{' '}
            <Text style={styles.dataText}>
              {item?.withoutRMU ? (!item.withoutRMU ? 'YES' : 'NO') : 'N/A'}
            </Text>
          </Text>
        </Text>
      )}

      {item.incoming && (
        <Text style={styles.infoText}>
          <Text style={styles.titleText}>
            RMU Remark:{' '}
            <Text style={styles.dataText}>{item?.rmuRemark || 'N/A'}</Text>
          </Text>
        </Text>
      )}

      <Text style={styles.infoText}>
        <Text style={styles.titleText}>
          Pickup Date:{' '}
          <Text style={styles.dataText}>
            {item?.pickupDate ? formatDate(item.pickupDate) : 'N/A'}
          </Text>
        </Text>
      </Text>

      {item?.approvedBy && (
        <Text style={styles.infoText}>
          <Text style={styles.titleText}>
            Approved By: <Text style={styles.dataText}>{item.approvedBy}</Text>
          </Text>
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Approved Data</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, farmer, or serial number"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={'#000'}
          />

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
});

export default ApprovalHistoryData;
