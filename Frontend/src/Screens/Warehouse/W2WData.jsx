// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   TouchableOpacity,
//   TextInput,
//   Dimensions,
// } from 'react-native';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import {API_URL} from '@env';

// const W2WData = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${API_URL}/warehouse-admin/outgoing-defective-order`,
//       );
//       console.log(response.data.pickupItems);
//       if (response.status === 200) {
//         setOrders(response.data.defectiveOrderData);
//         setFilteredOrders(response.data.defectiveOrderData);
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert('Error', 'Unable to fetch orders');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

// //   useEffect(() => {
// //     const filtered = orders.filter(order => {
// //       const lowercasedQuery = searchQuery.toLowerCase();
// //       return (
// //         order.servicePerson.name.toLowerCase().includes(lowercasedQuery) ||
// //         order.farmerName.toLowerCase().includes(lowercasedQuery) ||
// //         order.serialNumber.toLowerCase().includes(lowercasedQuery)
// //       );
// //     });
// //     setFilteredOrders(filtered);
// //   }, [searchQuery, orders]);

//   const [btnClickedStatus, setBtnClickedStatus] = useState({});

//   useEffect(() => {
//     const updateClickedStatus = {};
//     for (let index = 0; index < orders.length; index++) {
//       updateClickedStatus[orders[index]._id] = orders[index].status || false;
//     }
//     setBtnClickedStatus(updateClickedStatus);
//   }, [orders]);

//   const dateObject = newDate => {
//     return new Date(newDate);
//   };

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
//     <>

//         <View key={item._id} style={styles.card}>
//           <Text
//             style={[
//               styles.statusText,
//               item.incoming ? styles.incoming : styles.outgoing,
//             ]}>
//             Outgoing
//           </Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoText}>
//               From Warehouse: {item.fromWarehouse}
//             </Text>
//             {item.status ? (
//               <Text style={styles.approvedText}>Completed</Text>
//             ) : (
//               <Text style={{...styles.approvedText, color: 'red'}}>
//                 Pending
//               </Text>
//             )}
//           </View>
//           <Text style={styles.infoText}>To Warehouse: {item.toWarehouse}</Text>
//           <Text style={styles.infoText}>
//             Defective: {item.isDefective ? 'Yes' : 'No'}
//           </Text>
//           <View style={styles.itemContainer}>
//             {item.items.map(({_id, itemName, quantity}) => (
//               <Text key={_id} style={styles.infoText}>
//                 {itemName}: {quantity}
//               </Text>
//             ))}
//           </View>
//           <Text style={styles.infoText}>Driver Name: {item.driverName}</Text>
//           <Text style={styles.infoText}>
//             Driver Contact: {item.driverContact}
//           </Text>
//           <Text style={styles.infoText}>Remark: {item.remarks}</Text>
//           <Text style={styles.infoText}>
//             Pickup Date:{' '}
//             {dateObject(item.pickupDate).getDate() +
//               '/' +
//               (dateObject(item.pickupDate).getMonth() + 1) +
//               '/' +
//               dateObject(item.pickupDate).getFullYear()}
//           </Text>
//           {item.approvedBy && item.status && (
//             <Text style={styles.infoText}>Approved By: {item.approvedBy}</Text>
//           )}
//           {item?.arrivedDate && item.status && (
//             <Text style={styles.infoText}>
//               Approved Date:{' '}
//               {dateObject(item.arrivedDate).getDate() +
//                 '/' +
//                 (dateObject(item.arrivedDate).getMonth() + 1) +
//                 '/' +
//                 dateObject(item.arrivedDate).getFullYear()}
//             </Text>
//           )}
//         </View>
//     </>
//   );

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.refreshIcon}
//         onPress={() => setRefreshing(true)}>
//         <Icon name="refresh" size={30} color="black" />
//       </TouchableOpacity>

//       <Text style={styles.header}>Outgoing Item</Text>

//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search by name, serial number, or farmer"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />

//       <FlatList
//         data={orders}
//         renderItem={renderOrderItem}
//         keyExtractor={item => item._id}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const {width} = Dimensions.get('window');
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
//   },
//   searchBar: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingLeft: 8,
//     marginBottom: 16,
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

// export default W2WData;

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
  Dimensions,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {API_URL} from '@env';

const W2WData = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/outgoing-defective-order`,
      );
      setOrders(response.data.defectiveOrderData);
      setFilteredOrders(response.data.defectiveOrderData);
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

  useEffect(() => {
    const filtered = orders.filter(order => {
      const lowercasedQuery = searchQuery.toLowerCase();
      return (
        order.driverName?.toLowerCase().includes(lowercasedQuery) ||
        order.driverContact?.toString().toLowerCase().includes(lowercasedQuery)
      );
    });
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const dateObject = newDate => {
    return new Date(newDate);
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
    <View key={item._id} style={styles.card}>
      <Text
        style={[
          styles.statusText,
          item.incoming ? styles.incoming : styles.outgoing,
        ]}>
        Outgoing
      </Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          From Warehouse: {item.fromWarehouse}
        </Text>
        {item.status ? (
          <Text style={styles.approvedText}>Completed</Text>
        ) : (
          <Text style={{...styles.approvedText, color: 'red'}}>Pending</Text>
        )}
      </View>
      <Text style={styles.infoText}>To Warehouse: {item.toWarehouse}</Text>
      <Text style={styles.infoText}>
        Defective: {item.isDefective ? 'Yes' : 'No'}
      </Text>
      <View style={styles.itemContainer}>
        {item.items.map(({_id, itemName, quantity}) => (
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
      {item?.approvedBy && item.status && (
        <Text style={styles.infoText}>Approved By: {item.approvedBy}</Text>
      )}
      {item?.arrivedDate && item.status && (
        <Text style={styles.infoText}>
          Approved Date:{' '}
          {dateObject(item.arrivedDate).getDate() +
            '/' +
            (dateObject(item.arrivedDate).getMonth() + 1) +
            '/' +
            dateObject(item.arrivedDate).getFullYear()}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.refreshIcon}
        onPress={() => {
          setRefreshing(true);
          fetchOrders();
        }}>
        <Icon name="refresh" size={30} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Outgoing Item</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or contact"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchOrders();
            }}
          />
        }
      />
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
    paddingLeft: 8,
    marginBottom: 16,
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

export default W2WData;