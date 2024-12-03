import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import axios from 'axios'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { API_URL } from '@env';

const OutStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(''); // state for search query
  const [filteredOrders, setFilteredOrders] = useState([]); // state for filtered orders

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/service-person/pickedup-items`);
      console.log(response.data.pickupItemsDetail);
      setOrders(response.data.pickupItemsDetail); 
    } catch (error) {        
      console.log(error);
      Alert.alert("Error", "Unable to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshing]);

  const [btnClickedStatus, setBtnClickedStatus] = useState();

  const handleApproveBtn = async(sendTransactionId, incoming) => {
    try {
      const sendRequest = await axios.put(`${API_URL}/service-person/update-outgoing-status`,{ 
        status: true, 
        pickupItemId: sendTransactionId, 
        incoming, 
        arrivedDate: Date.now(), 
      });
      console.log(sendRequest.data);
      if(sendRequest.status === 200) {
        setBtnClickedStatus(prevData => ({ ...prevData, [sendTransactionId]: true }));
        setRefreshing(true);
      }
    } catch (error) {
      Alert.alert(JSON.stringify(error));
    }
  };

  useEffect(() => {
    const updateClickedStatus = {};
    for (let index = 0; index < orders.length; index++) {
      if (orders[index].status !== true) updateClickedStatus[orders[index]._id] = false;
      else updateClickedStatus[orders[index]._id] = true;
    }
    setBtnClickedStatus(updateClickedStatus);
    console.log(updateClickedStatus);
  }, [orders]);

  useEffect(() => {
    if (searchQuery) {
      const filteredData = orders.filter(order => 
        order.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filteredData);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchQuery, orders]);

  const dateObject = (newDate) => {
    return new Date(newDate);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  const renderOrderItem = ({ item }) => (
    <>
      { !(item.incoming) && !(item.status) && 
        <View key={item._id} style={styles.card}>
          <Text style={[styles.statusText, item.incoming ? styles.incoming : styles.outgoing]}>
            Outgoing
          </Text>
          <View style={styles.infoRow}>
          <Text style={styles.infoText}>Service Name: {item?.servicePersonName || item?.servicePerson.name}</Text>  
            {item.status && <Text style={styles.approvedText}>Approved Success</Text>}
          </View>
          <Text style={styles.infoText}>Service Contact: {item?.servicePerContact || item?.servicePerson.contact}</Text>
          <Text style={styles.infoText}>Farmer Name: {item.farmerName}</Text>
          <Text style={styles.infoText}>Farmer Contact: {item.farmerContact}</Text>
          <Text style={styles.infoText}>Village Name: {item.farmerVillage}</Text>
          <View style={styles.itemContainer}>
            {item.items.map(({ _id, itemName, quantity }) => (
              <Text key={_id} style={styles.infoText}>{itemName}: {quantity}</Text>
            ))}
          </View>
          <Text style={styles.infoText}>Serial Number: {item.serialNumber}</Text>
          <Text style={styles.infoText}>Remark: {item.remark}</Text>
          <Text style={styles.infoText}>
            Pickup Date: {dateObject(item.pickupDate).getDate() + '/' + (dateObject(item.pickupDate).getMonth() + 1) + '/' + dateObject(item.pickupDate).getFullYear()}
          </Text>
          {item?.arrivedDate && 
            <Text style={styles.infoText}>Approved Date: {dateObject(item.arrivedDate).getDate() + '/' + (dateObject(item.arrivedDate).getMonth() + 1) + '/' + dateObject(item.arrivedDate).getFullYear()}</Text>
          }
          <View style={styles.actionContainer}>
            { !(item.status) && 
              <>
                <TouchableOpacity style={styles.declineButton}>
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.approveButton}
                  onPress={() => handleApproveBtn(item._id, item.incoming ? true : false)}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity> 
              </>
            }
          </View>
        </View>
      }
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Outgoing Status</Text>
      {/* Search Bar */}
      <TextInput 
        style={styles.searchBar} 
        placeholder="Search by Farmer Name or Serial Number"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity 
        style={styles.refreshIcon} 
        onPress={() => setRefreshing(true)} 
      >
        <Icon name='refresh' size={30} color='black' />
      </TouchableOpacity>
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
    marginBottom: 16,
    paddingHorizontal: 8,
    fontSize: 16,
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

export default OutStatus;
