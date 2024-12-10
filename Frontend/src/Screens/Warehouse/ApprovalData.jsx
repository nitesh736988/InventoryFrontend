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
import Icon from 'react-native-vector-icons/FontAwesome';
import {API_URL} from '@env';

const ApprovalData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [btnClickedStatus, setBtnClickedStatus] = useState({});

  const {width} = Dimensions.get('window');
  const cardWidth = width * 0.9;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/warehouse-in-out-orders`,
      );

      setOrders(response.data.pickupItems);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApproveBtn = async (sendTransactionId, incoming) => {
    try {
      const response = await axios.put(
        `${API_URL}/warehouse-admin/update-incoming-status`,
        {
          status: true,
          pickupItemId: sendTransactionId,
          incoming,
          receivedDate: Date.now(),
        },
      );
      if (response.status === 200) {
        setBtnClickedStatus(prev => ({...prev, [sendTransactionId]: true}));
        fetchOrders();
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to update status');
    }
  };

  useEffect(() => {
    const updatedStatus = {};
    orders.forEach(order => {
      updatedStatus[order._id] = order.status || false;
    });
    setBtnClickedStatus(updatedStatus);
  }, [orders]);

  const filteredOrders = orders.filter(
    order =>
      order.incoming === true &&
      (order.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.servicePerson.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())),
  );

  const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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

  const renderOrderItem = ({item}) => (
    <>
      {!item.status && (
        <View key={item._id} style={[styles.card, {width: cardWidth}]}>
          <Text
            style={[
              styles.statusText,
              item.incoming ? styles.incoming : styles.outgoing,
            ]}>
            {item.incoming ? 'Incoming' : 'Outgoing'}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Name: {item.servicePerson.name}</Text>
            {item.status && (
              <Text style={styles.approvedText}>Approved Success</Text>
            )}
          </View>
          <Text style={styles.infoText}>
            Contact: {item.servicePerson.contact}
          </Text>
          <Text style={styles.infoText}>Farmer Name: {item.farmerName}</Text>
          <Text style={styles.infoText}>
            Farmer Contact: {item.farmerContact}
          </Text>
          <Text style={styles.infoText}>
            Village Name: {item.farmerVillage}
          </Text>
          <View style={styles.itemContainer}>
            {item.items.map(({_id, itemName, quantity}) => (
              <Text key={_id} style={styles.infoText}>
                {itemName}: {quantity}
              </Text>
            ))}
          </View>
          <Text style={styles.infoText}>
            Serial Number: {item.serialNumber}
          </Text>
          <Text style={styles.infoText}>Remark: {item.remark}</Text>
          {item.incoming && (
            <Text style={styles.infoText}>
              RMU Present:{' '}
              {item?.withoutRMU ? (!item.withoutRMU ? 'YES' : 'NO') : 'N/A'}
            </Text>
          )}
          {item.incoming && (
            <Text style={styles.infoText}>
              RMU Remark: {item?.rmuRemark || 'N/A'}
            </Text>
          )}
          <Text style={styles.infoText}>
            Pickup Date:{' '}
            {item?.pickupDate ? formatDate(item.pickupDate) : 'N/A'}
          </Text>
          {item?.arrivedDate && (
            <Text style={styles.infoText}>
              Approved Date: {formatDate(item.arrivedDate)}
            </Text>
          )}
          <View style={styles.actionContainer}>
            {!item.status && (
              <>
                <TouchableOpacity style={styles.declineButton}>
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => handleApproveBtn(item._id, item.incoming)}>
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Incoming Item</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Farmer or Serviceperson Name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.refreshIcon} onPress={fetchOrders}>
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
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
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
    alignSelf: 'center',
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
  approvedText: {
    color: 'green',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  declineButton: {
    width: '49%',
    borderRadius: 5,
    backgroundColor: 'red',
    padding: 8,
  },
  approveButton: {
    width: '49%',
    borderRadius: 5,
    backgroundColor: 'green',
    padding: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd33b',
  },
  refreshIcon: {
    position: 'absolute',
    top: 16,
    right: 32,
  },
});

export default ApprovalData;
