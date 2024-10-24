import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { API_URL } from '@env';

const ReturnItem = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 
  const [ approvedSuccessfully, setApprovedSuccessfully ] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/warehouse-admin/all-pickup-items`);
      console.log(response.data.pickupItems);
      if (response.status === 200) {
        setOrders(response.data.pickupItems); 
      }
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
  }, []);
  
  const handleApproveBtn = async( sendTransactionId ) => {
    try{
      const sendRequest = await axios.put(`${API_URL}/warehouse-admin/update-status`, { status: true, pickupItemId: sendTransactionId });
      console.log(sendRequest.data);
      if(sendRequest.status === 200){
        setApprovedSuccessfully(true);
      } 
    } catch(error){
      Alert.alert(JSON.stringify(error));
    }
  }

  useEffect(() => {
    // console.log(refreshing);
    if(refreshing){
      console.log("Refreshed");
      fetchOrders();
    }
  }, [refreshing]);

  const dateObject = (newDate) => {
    return new Date(newDate)
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  const renderOrderItem = ({ item }) => (
    <View key={item._id} >
      {/* <Text>{JSON.stringify(item)}</Text>   */}
      <View style={{ flexDirection: 'column', borderWidth: 1, borderColor: 'white', borderRadius: 5, marginBottom: 10, backgroundColor: 'white', paddingHorizontal: 8 }}>
        <View style= {{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{ color: '#000'}}>Name: {item.servicePerson.name}</Text>  
          { (item.status || approvedSuccessfully) && <Text style={{ color: 'green' }}>Approved Success</Text> }
        </View>
        <Text style={{ color: '#000'}}>Contact: {item.servicePerson.contact}</Text>
        <Text style={{ color: '#000'}}>Farmer Name: {item.farmerName}</Text>
        <Text style={{ color: '#000'}}>Farmer Contact: {item.farmerContact}</Text>
        <Text style={{ color: '#000'}}>Village Name: {item.farmerVillage}</Text>
        <View style={{ flexDirection: 'row'}}>
          {
            (item.items).map(({_id, itemName, quantity }, index) => {
              return <Text key={_id} style={{ color: '#000'}}>{itemName}: {quantity}, </Text>
            })  
          }
        </View>
        <Text style={{ color: '#000'}}>Serial Number: {item.serialNumber}</Text>
        <Text style={{ color: '#000'}}>Remark: {item.remark}</Text>
        <Text style={{ color: '#000'}}>Date: {dateObject(item.pickupDate).getDate()}/{dateObject(item.pickupDate).getMonth()}/{dateObject(item.pickupDate).getFullYear()}</Text>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5}}>
          { !(item.status) && !approvedSuccessfully &&  
                <>
                  <TouchableOpacity style={{ width: '49%', borderRadius: 5, backgroundColor: 'red', padding: 8 }}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: '49%', borderRadius: 5, backgroundColor: 'green',  padding: 8}} 
                      onPress={ () => {
                          const sendTransactionId = item._id;
                          handleApproveBtn(sendTransactionId);
                        }
                      }
                  >
                  <Text style={{ color: '#fff', textAlign: 'center'}}>Approve</Text>
                  </TouchableOpacity> 
                </>
          }
      </View>
      </View>
    </View>
    

  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Return Item</Text>
      {/* {orders.length === 0 ? (
        <View>
          <Text>No orders found.</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Text style={styles.refreshButton}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : ( */}
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item._id}
        />
      {/* )} */}
      <TouchableOpacity 
        style={{ position: 'absolute', top: 16, right: 32 }} 
        onPress={() => { 
            setRefreshing(true);
          }
        } 
      >
        <Icon name='refresh' size={30} color='black' />
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
  itemContainer: {
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 4,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd33b',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    color: '#007BFF',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

export default ReturnItem;
