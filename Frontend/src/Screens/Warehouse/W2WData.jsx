// import React, { useState, useEffect } from 'react';
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
//   RefreshControl,
// } from 'react-native';
// import api from '../../auth/api';;
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { API_URL } from '@env';

// const W2WData = () => {
//   const [orders, setOrders] = useState([]); 
//   const [filteredOrders, setFilteredOrders] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get(
//         `${API_URL}/warehouse-admin/outgoing-defective-order`
//       );
//       setOrders(response.data.defectiveOrderData);
//       setFilteredOrders(response.data.defectiveOrderData);
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

//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = orders.filter(order => {
//       return (
//         order.driverName?.toLowerCase().includes(lowercasedQuery) ||
//         order.driverContact?.toString().includes(lowercasedQuery)
//       );
//     });
//     setFilteredOrders(filtered);
//   }, [searchQuery, orders]);

//   const dateObject = newDate => new Date(newDate);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchOrders();
//   };

//   const renderOrderItem = ({ item }) => (
//     <View key={item._id} style={styles.card}>
//       <Text
//         style={[
//           styles.statusText,
//           item.incoming ? styles.incoming : styles.outgoing,
//         ]}
//       >
//         Outgoing
//       </Text>
//       <View style={styles.infoRow}>
//         <Text style={styles.infoText}>
//           From Warehouse: {item.fromWarehouse}
//         </Text>
//         {item.status ? (
//           <Text style={styles.approvedText}>Completed</Text>
//         ) : (
//           <Text style={{ ...styles.approvedText, color: 'red' }}>Pending</Text>
//         )}
//       </View>
//       <Text style={styles.infoText}>To Warehouse: {item.toWarehouse}</Text>
//       <Text style={styles.infoText}>
//         Defective: {item.isDefective ? 'Yes' : 'No'}
//       </Text>
//       <View style={styles.itemContainer}>
//         {item.items.map(({ _id, itemName, quantity }) => (
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
//       {item?.approvedBy && item.status && (
//         <Text style={styles.infoText}>Approved By: {item.approvedBy}</Text>
//       )}
//       {item?.arrivedDate && item.status && (
//         <Text style={styles.infoText}>
//           Approved Date:{' '}
//           {dateObject(item.arrivedDate).getDate() +
//             '/' +
//             (dateObject(item.arrivedDate).getMonth() + 1) +
//             '/' +
//             dateObject(item.arrivedDate).getFullYear()}
//         </Text>
//       )}
//     </View>
//   );

//   if (loading) {
//     return (
//       <ActivityIndicator
//         size="large"
//         color="#0000ff"
//         style={styles.loadingIndicator}
//       />
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>W2W Approve Data</Text>
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search by name or contact"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         placeholderTextColor={'#000'}
//       />
//       <FlatList
//         data={filteredOrders}
//         renderItem={renderOrderItem}
//         keyExtractor={item => item._id}
//         ListEmptyComponent={
//           <Text style={styles.emptyMessage}>No orders found.</Text>
//         }
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />
//     </View>
//   );
// };

// const { width } = Dimensions.get('window');
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
//     color: 'black',
//   },
//   searchBar: {
//     height: 40,
//     borderColor: 'black',
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
//     shadowOffset: { width: 0, height: 2 },
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
//   loadingIndicator: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fbd33b',
//   },
//   refreshIcon: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     zIndex: 10,
//   },
//   emptyMessage: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#000',
//   },
// });

// export default W2WData;


import React, { useState, useEffect } from 'react';
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
import api from '../../auth/api';;
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_URL } from '@env';

const W2WData = () => {
  const [orders, setOrders] = useState([]); 
  const [filteredOrders, setFilteredOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `${API_URL}/warehouse-admin/outgoing-defective-order`
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
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = orders.filter(order => {
      return (
        order.driverName?.toLowerCase().includes(lowercasedQuery) ||
        order.driverContact?.toString().includes(lowercasedQuery)
      );
    });
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const dateObject = newDate => new Date(newDate);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrderItem = ({ item }) => (
    <View key={item._id} style={styles.card}>
      <Text
        style={[
          styles.statusText,
          item.incoming ? styles.incoming : styles.outgoing,
        ]}
      >
        Outgoing
      </Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          From Warehouse: {item.fromWarehouse}
        </Text>
        {item.status ? (
          <Text style={styles.approvedText}>Completed</Text>
        ) : (
          <Text style={{ ...styles.approvedText, color: 'red' }}>Pending</Text>
        )}
      </View>
      <Text style={styles.infoText}>To Warehouse: {item.toWarehouse}</Text>
      <Text style={styles.infoText}>
        Defective: {item.isDefective ? 'Yes' : 'No'}
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
      <Text style={styles.header}>W2W Approve Data</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name or contact"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={'#000'}
      />
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No orders found.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
    color: 'black',
  },
  searchBar: {
    height: 40,
    borderColor: 'black',
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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd33b',
  },
  refreshIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
});

export default W2WData;
