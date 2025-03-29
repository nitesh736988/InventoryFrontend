// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   TouchableOpacity,
//   Dimensions,
//   TextInput,
// } from 'react-native';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import {API_URL} from '@env';

// const W2Wapproval = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [btnClickedStatus, setBtnClickedStatus] = useState({});

//   const {width} = Dimensions.get('window');
//   const cardWidth = width * 0.9;

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${API_URL}/warehouse-admin/view-defective-orders`,
//       );
//       console.log(response.data);
//       setOrders(response.data.incomingDefectiveData);
//     } catch (error) {
//       console.log(error);
//       Alert.alert('Error', 'Unable to fetch orders');
//     } finally {
//       setRefreshing(false);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [refreshing]);

//   const handleApproveBtn = async sendTransactionId => {
//     try {
//       const sendRequest = await axios.put(
//         `${API_URL}/warehouse-admin/update-defective-order-status`,
//         {
//           status: true,
//           defectiveOrderId: sendTransactionId,
//           arrivedDate: Date.now(),
//         },
//       );
//       console.log(sendRequest);
//       setBtnClickedStatus(prev => ({...prev, [sendTransactionId]: true}));
//       setRefreshing(true);
//     } catch (error) {
//       Alert.alert('Error', 'Unable to update status');
//     }
//   };

//   useEffect(() => {
//     const updateClickedStatus = {};
//     orders.forEach(order => {
//       updateClickedStatus[order._id] = order.status || false;
//     });
//     setBtnClickedStatus(updateClickedStatus);
//   }, [orders]);

//   const dateObject = newDate => new Date(newDate);

//   if (loading) {
//     return (
//       <ActivityIndicator
//         size="large"
//         color="#0000ff"
//         style={styles.loadingIndicator}
//       />
//     );
//   }

//   const renderOrderItem = ({item}) => (
//     <View key={item._id} style={[styles.card, {width: cardWidth}]}>
//       <Text
//         style={[
//           styles.statusText,
//           item.incoming ? styles.incoming : styles.outgoing,
//         ]}>
//         {item.incoming ? 'Incoming' : 'Outgoing'}
//       </Text>
//       <View style={styles.infoRow}>
//         <Text style={styles.infoText}>
//           From Warehouse: {item.fromWarehouse}
//         </Text>
//         {item.status && (
//           <Text style={styles.approvedText}>Approved Success</Text>
//         )}
//       </View>
//       <Text style={styles.infoText}>To Warehouse: {item.toWarehouse}</Text>
//       <Text style={styles.infoText}>
//         Is Defective: {item.isDefective ? 'YES' : 'NO'}
//       </Text>
//       <View style={styles.itemContainer}>
//         {item.items.map(({_id, itemName, quantity}) => (
//           <Text key={_id} style={styles.infoText}>
//             {itemName}: {quantity}
//           </Text>
//         ))}
//       </View>
//       <Text style={styles.infoText}>Driver Name: {item.driverName}</Text>
//       <Text style={styles.infoText}>Driver Contact: {item.driverContact}</Text>
//       <Text style={styles.infoText}>Remark: {item.remarks}</Text>
//       <Text style={styles.infoText}>
//         Pickup Date:{' '}
//         {dateObject(item.pickupDate).getDate() +
//           '/' +
//           (dateObject(item.pickupDate).getMonth() + 1) +
//           '/' +
//           dateObject(item.pickupDate).getFullYear()}
//       </Text>
//       <View style={styles.actionContainer}>
//         {!item.status && (
//           <>
//             <TouchableOpacity style={styles.declineButton}>
//               <Text style={styles.buttonText}>Decline</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.approveButton}
//               onPress={() => handleApproveBtn(item._id, item.incoming)}>
//               <Text style={styles.buttonText}>Approve</Text>
//             </TouchableOpacity>
//           </>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>W2W Approval Status</Text>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search by Farmer or Serviceperson Name"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />
//       <FlatList
//         data={orders}
//         renderItem={renderOrderItem}
//         keyExtractor={item => item._id}
//         showsVerticalScrollIndicator={false}
//       />
//       <TouchableOpacity
//         style={styles.refreshIcon}
//         onPress={() => setRefreshing(true)}>
//         <Icon name="refresh" size={30} color="black" />
//       </TouchableOpacity>
//       {orders.length > 0 ? (
//               <FlatList
//                 data={orders}
//                 renderItem={renderOrder}
//                 keyExtractor={item => item._id}
//                 ListEmptyComponent={
//                   <Text style={styles.emptyMessage}>No orders found.</Text>
//                 }
//               />
//             ) : (
//               <Text>No orders found.</Text>
//             )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fbd33b',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//     color: 'black'
//   },
//   searchInput: {
//     height: 40,
//     borderColor: 'black',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 16,
//     paddingHorizontal: 10,
//   },
//   card: {
//     padding: 16,
//     marginVertical: 8,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     alignSelf: 'center',
//   },
//   statusText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   incoming: {
//     color: 'purple',
//   },
//   outgoing: {
//     color: 'orange',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   infoText: {
//     color: '#000',
//   },
//   approvedText: {
//     color: 'green',
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 8,
//   },
//   actionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 5,
//   },
//   declineButton: {
//     width: '49%',
//     borderRadius: 5,
//     backgroundColor: 'red',
//     padding: 8,
//   },
//   approveButton: {
//     width: '49%',
//     borderRadius: 5,
//     backgroundColor: 'green',
//     padding: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//   },
//   loadingIndicator: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fbd33b',
//   },
//   refreshIcon: {
//     position: 'absolute',
//     top: 16,
//     right: 32,
//   },
// });

// export default W2Wapproval;



import React, { useState, useEffect } from 'react';
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
import { API_URL } from '@env';

const W2Wapproval = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [btnClickedStatus, setBtnClickedStatus] = useState({});

  const { width } = Dimensions.get('window');
  const cardWidth = width * 0.9;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/view-defective-orders`
      );
      console.log(response.data);
      setOrders(response.data.incomingDefectiveData);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', JSON.stringify(error.response.data?.message));
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshing]);

  const handleApproveBtn = async (sendTransactionId) => {
    try {
      const sendRequest = await axios.put(
        `${API_URL}/warehouse-admin/update-defective-order-status`,
        {
          status: true,
          defectiveOrderId: sendTransactionId,
          arrivedDate: Date.now(),
        }
      );
      console.log(sendRequest);
      setBtnClickedStatus((prev) => ({ ...prev, [sendTransactionId]: true }));
      setRefreshing(true);
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error.response.data?.message));
    }
  };

  useEffect(() => {
    const updateClickedStatus = {};
    orders.forEach((order) => {
      updateClickedStatus[order._id] = order.status || false;
    });
    setBtnClickedStatus(updateClickedStatus);
  }, [orders]);

  const dateObject = (newDate) => new Date(newDate);

  const filteredOrders = orders.filter(
    (order) =>
      order.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.fromWarehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.toWarehouse.toLowerCase().includes(searchQuery.toLowerCase())
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

  const renderOrderItem = ({ item }) => (
    <View key={item._id} style={[styles.card, { width: cardWidth }]}>
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
          From Warehouse: {item.fromWarehouse}
        </Text>
        {item.status && (
          <Text style={styles.approvedText}>Approved Success</Text>
        )}
      </View>
      <Text style={styles.infoText}>To Warehouse: {item.toWarehouse}</Text>
      <Text style={styles.infoText}>
        Is Defective: {item.isDefective ? 'YES' : 'NO'}
      </Text>
      <View style={styles.itemContainer}>
        {item.items.map(({ _id, itemName, quantity }) => (
          <Text key={_id} style={styles.infoText}>
            {itemName}: {quantity}
          </Text>
        ))}
      </View>
      <Text style={styles.infoText}>Driver Name: {item.driverName}</Text>
      <Text style={styles.infoText}>Driver Contact: {item.driverContact}</Text>
      <Text style={styles.infoText}>Remark: {item.remarks}</Text>
      <Text style={styles.infoText}>
        Pickup Date:{' '}
        {dateObject(item.pickupDate).getDate() +
          '/' +
          (dateObject(item.pickupDate).getMonth() + 1) +
          '/' +
          dateObject(item.pickupDate).getFullYear()}
      </Text>
      <View style={styles.actionContainer}>
        {!item.status && (
          <>
            <TouchableOpacity style={styles.declineButton}>
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleApproveBtn(item._id)}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>W2W Approval Status</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Driver Name or Warehouse"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={'#000'}
      />
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No Data found.</Text>
        }
      />
      <TouchableOpacity
        style={styles.refreshIcon}
        onPress={() => setRefreshing(true)}
      >
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
    color: 'black',
  },
  searchInput: {
    height: 40,
    borderColor: 'black',
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
    shadowOffset: { width: 0, height: 2 },
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
  emptyMessage: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    marginTop: 20,
  },
});

export default W2Wapproval;
