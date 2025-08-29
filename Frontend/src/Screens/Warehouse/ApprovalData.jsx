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
//   const navigation = useNavigation();

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
//       console.log('Error Response:', error.response?.data);

//       Alert.alert('Error', 'Unable to fetch orders');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const handleApproveBtn = async (sendTransactionId, incoming) => {
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
//         fetchOrders();
//       }
//     } catch (error) {
//       console.log('Approval Error:', error.response?.data || error.message);
//       Alert.alert(
//         'Error',
//         error.response?.data?.message ||
//           'Something went wrong. Please try again.',
//       );
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
//       (
//         order.farmerSaralId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.servicePerson?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.farmerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.farmerVillage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.farmerContact?.toString().toLowerCase().includes(searchQuery.toLowerCase())
//       )
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
//       <View key={item._id} style={[styles.card, {width: cardWidth}]}>
//         <Text
//           style={[
//             styles.statusText,
//             item.incoming ? styles.incoming : styles.outgoing,
//           ]}>
//           {item.incoming ? 'Incoming' : 'Outgoing'}
//         </Text>
//         <View style={styles.infoRow}>
//           <Text style={styles.titleText}>
//             ServicePerson Name:{' '}
//             <Text style={styles.dataText}>
//               {item.servicePerson?.name || 'N/A'}
//             </Text>
//           </Text>
//           {item.status && !item.itemResend ? (
//             <TouchableOpacity
//               onPress={() =>
//                 navigation.navigate('AddTransaction', {
//                   farmerComplaintId: item?.farmerComplaintId,
//                   farmerContact: item?.farmerContact,
//                   farmerVillage: item?.farmerVillage,
//                   farmerName: item?.farmerName,
//                   farmerSaralId: item?.farmerSaralId,
//                 })
//               }>
//               <Text style={styles.approvedText}>Fill Form</Text>
//             </TouchableOpacity>
//           ) : (
//             item.status &&
//             item.itemResend && (
//               <Text style={[styles.approvedText, {color: 'green'}]}>Done</Text>
//             )
//           )}
//         </View>
//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>
//             ServicePerson Contact:{' '}
//             <Text style={styles.dataText}>
//               {item.servicePerson?.contact || 'N/A'}
//             </Text>
//           </Text>
//         </Text>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>
//             Farmer Name:{' '}
//             <Text style={styles.dataText}>
//               {item.farmerName ? item.farmerName : 'N/A'}
//             </Text>
//           </Text>
//         </Text>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>
//             Farmer Village:{' '}
//             <Text style={styles.dataText}>
//               {item.farmerVillage ? item.farmerVillage : 'N/A'}
//             </Text>
//           </Text>
//         </Text>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>
//             Farmer Contact:{' '}
//             <Text style={styles.dataText}>{item.farmerContact}</Text>
//           </Text>
//         </Text>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>
//             Farmer SaralId:{' '}
//             <Text style={styles.dataText}>
//               {item.farmerSaralId ? item.farmerSaralId : 'N/A'}
//             </Text>
//             {/* {item.farmerSaralId ? item.farmerSaralId : 'N/A'} */}
//           </Text>
//         </Text>
//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>
//             Selected Warehouse:{' '}
//             <Text style={styles.dataText}>{item.warehouse}</Text>
//           </Text>
//         </Text>
//         <View style={styles.itemContainer}>
//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>Product: </Text>
//           </Text>
//           {item.items.map(({_id, itemName, quantity}) => (
//             <Text key={_id} style={styles.dataText}>
//               {itemName}: {quantity + ' '}
//             </Text>
//           ))}
//         </View>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>
//             Serial Number:{' '}
//             <Text style={styles.dataText}>{item.serialNumber}</Text>
//           </Text>
//         </Text>
//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>
//             Remark: <Text style={styles.dataText}>{item.remark}</Text>
//           </Text>
//         </Text>

//         {item.incoming && (
//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>
//               RMU Present:{' '}
//               <Text style={styles.dataText}>
//                 {item?.withoutRMU === true
//                   ? 'NO'
//                   : item?.withoutRMU === false
//                   ? 'YES'
//                   : 'N/A'}
//               </Text>
//             </Text>
//           </Text>
//         )}

//         {item?.incoming && (
//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>RMU Remark: </Text>
//             <Text style={styles.dataText}>{item?.rmuRemark || 'N/A'}</Text>
//           </Text>
//         )}

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>Pickup Date: </Text>
//           <Text style={styles.dataText}>
//             {item?.pickupDate ? formatDate(item.pickupDate) : 'N/A'}
//           </Text>
//         </Text>

//         {item?.arrivedDate && (
//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>Approved Date: </Text>
//             <Text style={styles.dataText}>{formatDate(item.arrivedDate)}</Text>
//           </Text>
//         )}

//         <View style={styles.actionContainer}>
//           {!item.status && (
//             <>
//               <TouchableOpacity style={styles.declineButton}>
//                 <Text style={styles.buttonText}>Decline</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.approveButton}
//                 onPress={() => {
//                   handleApproveBtn(item._id, item.incoming);
//                 }}>
//                 <Text style={styles.buttonText}>Approve</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>
//       {/* )} */}
//     </>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Incoming Item</Text>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search by SaralId,Serviceperson,serialNumber,Village,FarmerContact"
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
//     height: 60,
//     borderColor: 'black',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 16,
//     paddingLeft: 10,
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
  Modal,
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
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [declineRemark, setDeclineRemark] = useState('');
  const [declineLoading, setDeclineLoading] = useState(false);
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
      console.log('Error Response:', error.response?.data);
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
      console.log('Approval Error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    }
  };

  const handleDeclineBtn = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setDeclineModalVisible(true);
  };

  const submitDecline = async () => {
    if (!declineRemark.trim()) {
      Alert.alert('Error', 'Please enter a remark for declining');
      return;
    }

    setDeclineLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/warehouse-admin/decline-incoming-items`,
        {
          transactionId: selectedTransactionId,
          remark: declineRemark.trim(),
        },
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Item declined successfully');
        setDeclineModalVisible(false);
        setDeclineRemark('');
        setSelectedTransactionId(null);
        fetchOrders(); // Refresh the list
      }
    } catch (error) {
      console.log('Decline Error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setDeclineLoading(false);
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
      (
        order.farmerSaralId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.servicePerson?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.farmerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.farmerVillage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.farmerContact?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
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
      <View key={item._id} style={[styles.card, {width: cardWidth}]}>
        <Text
          style={[
            styles.statusText,
            item.incoming ? styles.incoming : styles.outgoing,
          ]}>
          {item.incoming ? 'Incoming' : 'Outgoing'}
        </Text>
        
        {/* Show declined status if status is false */}
        {item.status === false && (
          <View style={styles.declinedContainer}>
            <Icon name="times-circle" size={20} color="red" />
            <Text style={styles.declinedText}>Declined</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.titleText}>
            ServicePerson Name:{' '}
            <Text style={styles.dataText}>
              {item.servicePerson?.name || 'N/A'}
            </Text>
          </Text>
          {item.status && !item.itemResend ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddTransaction', {
                  farmerComplaintId: item?.farmerComplaintId,
                  farmerContact: item?.farmerContact,
                  farmerVillage: item?.farmerVillage,
                  farmerName: item?.farmerName,
                  farmerSaralId: item?.farmerSaralId,
                })
              }>
              <Text style={styles.approvedText}>Fill Form</Text>
            </TouchableOpacity>
          ) : (
            item.status &&
            item.itemResend && (
              <Text style={[styles.approvedText, {color: 'green  '}]}>Done</Text>
            )
          )}
        </View>
        <Text style={styles.infoText}>
          <Text style={styles.titleText}>
            ServicePerson Contact:{' '}
            <Text style={styles.dataText}>
              {item.servicePerson?.contact || 'N/A'}
            </Text>
          </Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>
            Farmer Name:{' '}
            <Text style={styles.dataText}>
              {item.farmerName ? item.farmerName : 'N/A'}
            </Text>
          </Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>
            Farmer Village:{' '}
            <Text style={styles.dataText}>
              {item.farmerVillage ? item.farmerVillage : 'N/A'}
            </Text>
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
            <Text style={styles.dataText}>
              {item.farmerSaralId ? item.farmerSaralId : 'N/A'}
            </Text>
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
            <Text style={styles.dataText}>{formatDate(item.arrivedDate)}</Text>
          </Text>
        )}

        {/* Show decline reason if item is declined */}
        {item.status === false && item.declineRemark && (
          <Text style={styles.infoText}>
            <Text style={[styles.titleText, {color: 'red'}]}>Decline Reason: </Text>
            <Text style={[styles.dataText, {color: 'red'}]}>{item.declineRemark}</Text>
          </Text>
        )}

        <View style={styles.actionContainer}>
          {/* Show action buttons only if status is not set (pending approval) */}
          {item.status === undefined || item.status === null ? (
            <>
              <TouchableOpacity 
                style={styles.declineButton}
                onPress={() => handleDeclineBtn(item._id)}
              >
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
          ) : item.status === false ? (
            // Show only declined status message, no buttons
            <Text style={[styles.declinedText, {textAlign: 'center', marginVertical: 10}]}>
              This item has been declined
            </Text>
          ) : item.status === true && (
            // Show approved status
            <Text style={[styles.approvedText, {textAlign: 'center', marginVertical: 10}]}>
              Approved
            </Text>
          )}
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Incoming Item</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by SaralId,Serviceperson,serialNumber,Village,FarmerContact"
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

      {/* Decline Modal */}
      <Modal
        visible={declineModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeclineModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Decline Item</Text>
            <Text style={styles.modalSubtitle}>
              Please provide a reason for declining this item
            </Text>
            <TextInput
              style={styles.remarkInput}
              placeholder="Enter remark..."
              value={declineRemark}
              onChangeText={setDeclineRemark}
              multiline={true}
              numberOfLines={4}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setDeclineModalVisible(false);
                  setDeclineRemark('');
                }}
                disabled={declineLoading}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitDecline}
                disabled={declineLoading}
              >
                {declineLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    height: 60,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 10,
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
  declinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  declinedText: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 5,
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
    fontWeight: 'bold',
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ApprovalData;