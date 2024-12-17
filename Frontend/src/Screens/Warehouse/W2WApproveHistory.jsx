// import React, {useState, useEffect, useCallback} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   TouchableOpacity,
// } from 'react-native';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import {API_URL} from '@env';

// const W2WApprovalHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingRefresh, setLoadingRefresh] = useState(false);

//   const fetchOrders = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${API_URL}/warehouse-admin/defective-order-history`,
//       );
//       console.log(response.data.defectiveOrderHistory);
//       setOrders(response.data.defectiveOrderHistory || []);
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Unable to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const handleRefresh = async () => {
//     setLoadingRefresh(true);
//     await fetchOrders();
//     setLoadingRefresh(false);
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   const formatDate = date => {
//     if (!date) return 'N/A';
//     const newDate = new Date(date);
//     return `${newDate.getDate().toString().padStart(2, '0')}/${(
//       newDate.getMonth() + 1
//     )
//       .toString()
//       .padStart(2, '0')}/${newDate.getFullYear()}`;
//   };

//   const renderOrder = ({item}) => (
//     <View style={styles.card}>
//       <OrderDetail label="From Warehouse" value={item.fromWarehouse} />
//       <OrderDetail label="To Warehouse" value={item.toWarehouse} />
//       {/* <View style={styles.itemContainer}> */}
//       {item.items.map(({_id, itemName, quantity}, index) => (
//         <OrderDetail
//           key={_id}
//           label={`Item${index + 1}`}
//           value={`${itemName} : ${quantity}`}
//         />
//       ))}
//       {/* </View> */}
//       <OrderDetail label="Defective" value={item.isDefective ? 'Yes' : 'No'} />
//       <OrderDetail label="Driver Name" value={item.driverName} />
//       <OrderDetail label="Driver Contact" value={item.driverContact} />
//       <OrderDetail label="Remarks" value={item.remarks} />
//       <OrderDetail label="Pickup Date" value={formatDate(item.pickupDate)} />
//       {item.approvedBy && (
//         <OrderDetail label="Approved By" value={item.approvedBy} />
//       )}
//       <OrderDetail label="Arrival Date" value={formatDate(item.arrivedDate)} />
//     </View>
//   );

//   const OrderDetail = ({label, value = 'N/A'}) => (
//     <View style={styles.detailRow}>
//       <Text style={styles.cardTitle}>{label}</Text>
//       <Text style={styles.cardValue}>{value}</Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.header}>W2W Approved</Text>
//         <TouchableOpacity onPress={handleRefresh}>
//           {loadingRefresh ? (
//             <ActivityIndicator size="small" color="black" />
//           ) : (
//             <Icon name="refresh" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>
//       {orders.length === 0 ? (
//         <Text style={styles.noOrdersText}>No orders found.</Text>
//       ) : (
//         <FlatList
//           data={orders}
//           renderItem={renderOrder}
//           keyExtractor={item => item._id || item.id || `${Math.random()}`}
//         />
//       )}
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
//   itemContainer: {
//     padding: 8,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 5,
//     marginVertical: 4,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 4,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   cardValue: {
//     fontSize: 16,
//     color: '#555',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   noOrdersText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: 'gray',
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default W2WApprovalHistory;


import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {API_URL} from '@env';

const W2WApprovalHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/defective-order-history`,
      );
      const orders = response.data?.defectiveOrderHistory || [];
      setOrders(orders);
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || error.message || 'Unable to fetch orders',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setLoadingRefresh(true);
    await fetchOrders();
    setLoadingRefresh(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Format date utility
  const formatDate = date => {
    if (!date) return 'N/A';
    const newDate = new Date(date);
    if (isNaN(newDate)) return 'Invalid Date';
    return `${newDate.getDate().toString().padStart(2, '0')}/${(
      newDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${newDate.getFullYear()}`;
  };

  // OrderDetail component
  const OrderDetail = ({label, value = 'N/A'}) => (
    <View style={styles.detailRow}>
      <Text style={styles.cardTitle}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  // Render single order card
  const renderOrder = ({item}) => (
    <View style={styles.card}>
      <OrderDetail label="From Warehouse" value={item.fromWarehouse} />
      <OrderDetail label="To Warehouse" value={item.toWarehouse} />
      {item.items?.length > 0 ? (
        item.items.map(({_id, itemName, quantity}, index) => (
          <OrderDetail
            key={_id || `item-${index}`}
            label={`Item${index + 1}`}
            value={`${itemName} : ${quantity}`}
          />
        ))
      ) : (
        <OrderDetail label="Items" value="No items available" />
      )}
      <OrderDetail label="Defective" value={item.isDefective ? 'Yes' : 'No'} />
      <OrderDetail label="Driver Name" value={item.driverName} />
      <OrderDetail label="Driver Contact" value={item.driverContact} />
      <OrderDetail label="Remarks" value={item.remarks} />
      <OrderDetail label="Pickup Date" value={formatDate(item.pickupDate)} />
      {item.approvedBy && (
        <OrderDetail label="Approved By" value={item.approvedBy} />
      )}
      <OrderDetail label="Arrival Date" value={formatDate(item.arrivedDate)} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>W2W Approved</Text>
        <TouchableOpacity onPress={handleRefresh}>
          {loadingRefresh ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Icon name="refresh" size={30} color="black" />
          )}
        </TouchableOpacity>
      </View>
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item._id || item.id || `${Math.random()}`}
          refreshing={loadingRefresh}
          onRefresh={handleRefresh}
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
    color: 'black',
    textAlign: 'center',
    textTransform: 'uppercase', // Makes text uppercase
  },
  
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fefefe',
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#fbd33b',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardValue: {
    fontSize: 16,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noOrdersText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default W2WApprovalHistory;
