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
// import {useNavigation} from '@react-navigation/native';

// const ApprovalData = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [btnClickedStatus, setBtnClickedStatus] = useState({});
//     const navigation = useNavigation();

//   const {width} = Dimensions.get('window');
//   const cardWidth = width * 0.9;

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${API_URL}/warehouse-admin/warehouse-in-out-orders`,
//       );

//       setOrders(response.data.pickupItems);
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

//   const handleApproveBtn = async (sendTransactionId, incoming, complaintId, farmerContact, saralId) => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/warehouse-admin/update-incoming-status`,
//         {
//           status: true,
//           pickupItemId: sendTransactionId,
//           incoming,
//           receivedDate: Date.now(),
//         },
//       );
//       if (response.status === 200) {
//         setBtnClickedStatus(prev => ({...prev, [sendTransactionId]: true}));
//         fetchOrders().then(() => {
//           console.log('On Navigation Data', complaintId, farmerContact, saralId)
//           navigation.navigate('AddTransaction', {
//             complaintId: complaintId,
//             farmerContact: farmerContact,
//             saralId: saralId,
//           });
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert('Error', 'Somethings is missing Please Check Product Name');
//     }
//   };

//   useEffect(() => {
//     const updatedStatus = {};
//     orders.forEach(order => {
//       updatedStatus[order._id] = order.status || false;
//     });
//     setBtnClickedStatus(updatedStatus);
//   }, [orders]);

//   const filteredOrders = orders.filter(
//     order =>
//       order.incoming === true &&
//       (order.farmerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         '' ||
//         order.servicePerson?.name
//           ?.toLowerCase()
//           .includes(searchQuery.toLowerCase()) ||
//         ''),
//   );

//   const formatDate = dateString => {
//     const date = new Date(dateString);
//     return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
//       {!item.status && (
//         <View key={item._id} style={[styles.card, {width: cardWidth}]}>
//           <Text
//             style={[
//               styles.statusText,
//               item.incoming ? styles.incoming : styles.outgoing,
//             ]}>
//             {item.incoming ? 'Incoming' : 'Outgoing'}
//           </Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.titleText}>
//               ServicePerson Name:{' '}
//               <Text style={styles.dataText}>{item.servicePerson.name}</Text>
//             </Text>
//             {item.status && (
//               <Text style={styles.approvedText}>Approved Success</Text>
//             )}
//           </View>
//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>
//               ServicePerson Contact:{' '}
//               <Text style={styles.dataText}>{item.servicePerson.contact}</Text>
//             </Text>
//           </Text>

//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>
//               Farmer Contact:{' '}
//               <Text style={styles.dataText}>{item.farmerContact}</Text>
//             </Text>
//           </Text>

//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>
//               Farmer SaralId:{' '}
//               <Text style={styles.dataText}>{item.farmerSaralId}</Text>
//             </Text>
//           </Text>
//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>
//               Selected Warehouse:{' '}
//               <Text style={styles.dataText}>{item.warehouse}</Text>
//             </Text>
//           </Text>
//           <View style={styles.itemContainer}>
//             <Text style={styles.infoText}>
//               <Text style={styles.titleText}>Product: </Text>
//             </Text>
//             {item.items.map(({_id, itemName, quantity}) => (
//               <Text key={_id} style={styles.dataText}>
//                 {itemName}: {quantity + ' '}
//               </Text>
//             ))}
//           </View>

//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>
//               Serial Number:{' '}
//               <Text style={styles.dataText}>{item.serialNumber}</Text>
//             </Text>
//           </Text>
//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>
//               Remark: <Text style={styles.dataText}>{item.remark}</Text>
//             </Text>
//           </Text>

//           {item.incoming && (
//             <Text style={styles.infoText}>
//               <Text style={styles.titleText}>
//                 RMU Present:{' '}
//                 <Text style={styles.dataText}>
//                   {item?.withoutRMU === true
//                     ? 'NO'
//                     : item?.withoutRMU === false
//                     ? 'YES'
//                     : 'N/A'}
//                 </Text>
//               </Text>
//             </Text>
//           )}

//           {item?.incoming && (
//             <Text style={styles.infoText}>
//               <Text style={styles.titleText}>RMU Remark: </Text>
//               <Text style={styles.dataText}>{item?.rmuRemark || 'N/A'}</Text>
//             </Text>
//           )}

//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>Pickup Date: </Text>
//             <Text style={styles.dataText}>
//               {item?.pickupDate ? formatDate(item.pickupDate) : 'N/A'}
//             </Text>
//           </Text>

//           {item?.arrivedDate && (
//             <Text style={styles.infoText}>
//               <Text style={styles.titleText}>Approved Date: </Text>
//               <Text style={styles.dataText}>
//                 {formatDate(item.arrivedDate)}
//               </Text>
//             </Text>
//           )}

//           <View style={styles.actionContainer}>
//             {!item.status && (
//               <>
//                 <TouchableOpacity style={styles.declineButton}>
//                   <Text style={styles.buttonText}>Decline</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.approveButton}
//                   onPress={() => {
//                     console.log(item.farmerComplaintId, item.farmerContact, item.farmerSaralId);
//                     handleApproveBtn(item._id, item.incoming, item.farmerComplaintId,  item.farmerContact, item.farmerSaralId);

//                   }}>
//                   <Text style={styles.buttonText}>Approve</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       )}
//     </>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Incoming Item</Text>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search by Farmer or Serviceperson Name"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         placeholderTextColor={'#000'}
//       />
//       <FlatList
//         data={filteredOrders}
//         renderItem={renderOrderItem}
//         keyExtractor={item => item._id}
//         showsVerticalScrollIndicator={false}
//       />
//       <TouchableOpacity style={styles.refreshIcon} onPress={fetchOrders}>
//         <Icon name="refresh" size={30} color="black" />
//       </TouchableOpacity>
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
//     color: 'black',
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
//   titleText: {
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   dataText: {
//     fontWeight: 'normal',
//     color: '#000',
//   },
//   approvedText: {
//     color: 'green',
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
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

// export default ApprovalData;

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
import {useNavigation} from '@react-navigation/native';

const ApprovalData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [btnClickedStatus, setBtnClickedStatus] = useState({});
  const navigation = useNavigation();

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
      Alert.alert('Error', 'Somethings is missing Please Check Product Name');
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
      (order.farmerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        '' ||
        order.servicePerson?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        ''),
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
      {/* {!item.status && ( */}
        <View key={item._id} style={[styles.card, {width: cardWidth}]}>
          <Text
            style={[
              styles.statusText,
              item.incoming ? styles.incoming : styles.outgoing,
            ]}>
            {item.incoming ? 'Incoming' : 'Outgoing'}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.titleText}>
              ServicePerson Name:{' '}
              <Text style={styles.dataText}>{item.servicePerson.name}</Text>
            </Text>
            {item.status && (
              <>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AddTransaction', {
                      farmerComplaintId: item?.pickupItems?.farmerComplaintId,
                      farmerContact: item?.pickupItems?.farmerContact,
                      farmerSaralId: item?.pickupItems?.farmerSaralId,
                    })
                  }>
                  <Text style={styles.approvedText}>Fill Form</Text>
                </TouchableOpacity>
              {/* 
                <Text style={styles.approvedText}>Approved Success</Text> */}
              </>
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
              Farmer Contact:{' '}
              <Text style={styles.dataText}>{item.farmerContact}</Text>
            </Text>
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.titleText}>
              Farmer SaralId:{' '}
              <Text style={styles.dataText}>{item.farmerSaralId}</Text>
            </Text>
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.titleText}>
              Selected Warehouse:{' '}
              <Text style={styles.dataText}>{item.warehouse}</Text>
            </Text>
          </Text>
          <View style={styles.itemContainer}>
            <Text style={styles.infoText}>
              <Text style={styles.titleText}>Product: </Text>
            </Text>
            {item.items.map(({_id, itemName, quantity}) => (
              <Text key={_id} style={styles.dataText}>
                {itemName}: {quantity + ' '}
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
                  {item?.withoutRMU === true
                    ? 'NO'
                    : item?.withoutRMU === false
                    ? 'YES'
                    : 'N/A'}
                </Text>
              </Text>
            </Text>
          )}

          {item?.incoming && (
            <Text style={styles.infoText}>
              <Text style={styles.titleText}>RMU Remark: </Text>
              <Text style={styles.dataText}>{item?.rmuRemark || 'N/A'}</Text>
            </Text>
          )}

          <Text style={styles.infoText}>
            <Text style={styles.titleText}>Pickup Date: </Text>
            <Text style={styles.dataText}>
              {item?.pickupDate ? formatDate(item.pickupDate) : 'N/A'}
            </Text>
          </Text>

          {item?.arrivedDate && (
            <Text style={styles.infoText}>
              <Text style={styles.titleText}>Approved Date: </Text>
              <Text style={styles.dataText}>
                {formatDate(item.arrivedDate)}
              </Text>
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
                  onPress={() => {
                    handleApproveBtn(item._id, item.incoming);
                  }}>
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      {/* )} */}
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
        placeholderTextColor={'#000'}
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
  titleText: {
    fontWeight: 'bold',
    color: '#000',
  },
  dataText: {
    fontWeight: 'normal',
    color: '#000',
  },
  approvedText: {
    color: 'green',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
