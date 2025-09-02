// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   TextInput,
//   Dimensions,
//   RefreshControl,
// } from 'react-native';
// import axios from 'axios';
// import { API_URL } from '@env';

// const Outgoing = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const fetchOrders = async () => {
//     try {
//       console.log("Fetching orders from:", API_URL);
//       const response = await axios.get(`${API_URL}/warehouse-admin/warehouse-in-out-orders`);

//       console.log("API Response:", response.data);

//       const items = response.data.pickupItems || [];
//       setOrders(items);
//       setFilteredOrders(items);
//     } catch (error) {
//       console.log("Error fetching data:", error);
//       Alert.alert('Error', JSON.stringify(error.response.data?.message));
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
//       const servicePersonName = order?.servicePerson?.name?.toLowerCase() || '';
//       const farmerSaralId = String(order.farmerSaralId || '').toLowerCase();
//       const farmerContact = String(order.farmerContact || '').toLowerCase();
//       const farmerName = String(order.farmerName || '').toLowerCase();
//       const farmerVillage = String(order.farmerVillage || '').toLowerCase();

//       return (
//         servicePersonName.includes(lowercasedQuery) ||
//         farmerSaralId.includes(lowercasedQuery) ||
//         farmerContact.includes(lowercasedQuery) ||
//         farmerName.includes(lowercasedQuery) ||
//         farmerVillage.includes(lowercasedQuery) 
//       );
//     });

//     setFilteredOrders(filtered);
//   }, [searchQuery, orders]);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchOrders();
//   };

//   const renderOrderItem = ({ item }) => {
//     console.log("Rendering item:", item);
//     const pickupDate = item.pickupDate.split("T");

//     return (
//       <View key={item._id} style={styles.card}>
//         <Text style={[styles.statusText, styles.outgoing]}>Outgoing</Text>

//         <View style={styles.infoRow}>
//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>ServicePerson Name: </Text>
//             <Text style={styles.dataText}>{item.servicePerson?.name || 'N/A'}</Text>
//           </Text>

//           <Text
//             style={[
//               styles.approvedText,
//               { color: item.status ? 'green' : 'red' },
//             ]}>
//             {item.status ? 'Completed' : 'Pending'}
//           </Text>
//         </View>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>ServicePerson Contact: </Text>
//           <Text style={styles.dataText}>{item.servicePerson?.contact || 'N/A'}</Text>
//         </Text>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>Farmer SaralId: </Text>
//           <Text style={styles.dataText}>{item.farmerSaralId || 'N/A'}</Text>
//         </Text>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>Farmer Name: </Text>
//           <Text style={styles.dataText}>{item.farmerName || 'N/A'}</Text>
//         </Text>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>Farmer Village: </Text>
//           <Text style={styles.dataText}>{item.farmerVillage || 'N/A'}</Text>
//         </Text>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>Farmer Contact: </Text>
//           <Text style={styles.dataText}>{item.farmerContact || 'N/A'}</Text>
//         </Text>

//         <View style={styles.itemContainer}>
//           <Text style={styles.infoText}>
//             <Text style={styles.titleText}>Product: </Text>
//           </Text>
//           {item.items.map(({ _id, itemName, quantity }) => (
//             <Text key={_id} style={styles.dataText}>
//               {itemName}: {quantity + ' '}
//             </Text>
//           ))}
//         </View>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>Serial Number: </Text>
//           <Text style={styles.dataText}>{item.serialNumber || 'N/A'}</Text>
//         </Text>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>Remark: </Text>
//           <Text style={styles.dataText}>{item.remark || 'N/A'}</Text>
//         </Text>

//         <Text style={styles.infoText}>
//           <Text style={styles.titleText}>Pickup Date: </Text>
//           <Text style={styles.dataText}>{ pickupDate[0]|| 'N/A'}</Text>
//         </Text>
//       </View>
//     );
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

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Outgoing Items</Text>

//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search by servicePerson, farmerSaralId, farmer Name, Village, farmerContact"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         placeholderTextColor={'#000'}
//       />

//       <FlatList
//         data={filteredOrders}
//         renderItem={renderOrderItem}
//         keyExtractor={item => item._id}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
//     height: 60,
//     borderColor: 'black',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingLeft: 10,
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
//   loadingIndicator: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fbd33b',
//   },
// });

// export default Outgoing;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const Outgoing = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [saralId, setSaralId] = useState('');
  const [farmerData, setFarmerData] = useState(null);
  const [fetchingFarmer, setFetchingFarmer] = useState(false);

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders from:", API_URL);
      const response = await axios.get(`${API_URL}/warehouse-admin/warehouse-in-out-orders`);

      console.log("API Response Data:", response.data);

      const items = response.data.pickupItems || [];
      setOrders(items);
      setFilteredOrders(items);
    } catch (error) {
      console.log("Error fetching data:", error);
      Alert.alert('Error', JSON.stringify(error.response?.data?.message || error.message));
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
      const servicePersonName = order?.servicePerson?.name?.toLowerCase() || '';
      const farmerSaralId = String(order.farmerSaralId || '').toLowerCase();
      const farmerContact = String(order.farmerContact || '').toLowerCase();
      const farmerName = String(order.farmerName || '').toLowerCase();
      const farmerVillage = String(order.farmerVillage || '').toLowerCase();

      return (
        servicePersonName.includes(lowercasedQuery) ||
        farmerSaralId.includes(lowercasedQuery) ||
        farmerContact.includes(lowercasedQuery) ||
        farmerName.includes(lowercasedQuery) ||
        farmerVillage.includes(lowercasedQuery) 
      );
    });

    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setSaralId(order.farmerSaralId || '');
    setFarmerData(null);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setSelectedOrder(null);
    setSaralId('');
    setFarmerData(null);
  };

  const fetchFarmerData = async () => {
    if (!saralId) {
      Alert.alert('Error', 'Please enter a Saral ID');
      return;
    }

    setFetchingFarmer(true);
    try {
      const response = await axios.get(`http://88.222.214.93:8001/inventory/showFarmerWithComplaint?saralId=${saralId}`);
      console.log("Farmer API Response:", response.data);
      
      if (response.data && response.data.success) {
        // Extract data from the nested structure
        const farmerInfo = response.data.data?.farmer || response.data.farmer;
        const complaintInfo = response.data.data?.latestComplaint || response.data.latestComplaint;
        
        const combinedData = {
          ...farmerInfo,
          complaintId: complaintInfo?._id
        };
        
        setFarmerData(combinedData);
      } else {
        Alert.alert('Error', response.data.message || 'No farmer found with this Saral ID');
        setFarmerData(null);
      }
    } catch (error) {
      console.log("Error fetching farmer data:", error?.response?.data?.message);
      Alert.alert('Error', JSON.stringify(error?.response?.data?.message || error?.message));
      setFarmerData(null);
    } finally {
      setFetchingFarmer(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!farmerData) {
      Alert.alert('Error', 'Please fetch farmer data first');
      return;
    }

    try {
      // Prepare the updated order data with correct field names
      const updatedData = {
        transactionId: selectedOrder._id,
        farmerName: farmerData.farmerName || selectedOrder.farmerName,
        farmerContact: farmerData.contact || selectedOrder.farmerContact,
        farmerVillage: farmerData.village || selectedOrder.farmerVillage,
        farmerSaralId: farmerData.saralId || saralId,
        farmerComplaintId: farmerData.complaintId || selectedOrder.farmerComplaintId,
      };

      console.log("Updating order with data:", updatedData);

      // Make API call to update the order
      const response = await axios.put(
        `http://88.222.214.93:5000/warehouse-admin/update-outgoing-item-farmer-details`,
        updatedData
      );

      if (response.data.success) {
        Alert.alert('Success', 'Order updated successfully');
        // Refresh the orders list
        fetchOrders();
        closeEditModal();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update order');
      }
    } catch (error) {
      console.log("Error updating order:", error);
      Alert.alert('Error', JSON.stringify(error.response?.data?.message || error.message));
    }
  };

  const renderOrderItem = ({ item }) => {
    const pickupDate = item.pickupDate ? item.pickupDate.split("T") : ['N/A'];

    return (
      <View key={item._id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={[styles.statusText, styles.outgoing]}>Outgoing</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => openEditModal(item)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            <Text style={styles.titleText}>ServicePerson Name: </Text>
            <Text style={styles.dataText}>{item.servicePerson?.name || 'N/A'}</Text>
          </Text>

          <Text
            style={[
              styles.approvedText,
              { color: item.status ? 'green' : 'red' },
            ]}>
            {item.status ? 'Completed' : 'Pending'}
          </Text>
        </View>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>ServicePerson Contact: </Text>
          <Text style={styles.dataText}>{item.servicePerson?.contact || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Farmer SaralId: </Text>
          <Text style={styles.dataText}>{item.farmerSaralId || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Farmer Name: </Text>
          <Text style={styles.dataText}>{item.farmerName || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Farmer Village: </Text>
          <Text style={styles.dataText}>{item.farmerVillage || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Farmer Contact: </Text>
          <Text style={styles.dataText}>{item.farmerContact || 'N/A'}</Text>
        </Text>

        <View style={styles.itemContainer}>
          <Text style={styles.infoText}>
            <Text style={styles.titleText}>Product: </Text>
          </Text>
          {item.items && item.items.map(({ _id, itemName, quantity }) => (
            <Text key={_id} style={styles.dataText}>
              {itemName}: {quantity + ' '}
            </Text>
          ))}
        </View>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Serial Number: </Text>
          <Text style={styles.dataText}>{item.serialNumber || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Remark: </Text>
          <Text style={styles.dataText}>{item.remark || 'N/A'}</Text>
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.titleText}>Pickup Date: </Text>
          <Text style={styles.dataText}>{pickupDate[0] || 'N/A'}</Text>
        </Text>
      </View>
    );
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Outgoing Items</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search by servicePerson, farmerSaralId, farmer Name, Village, farmerContact"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={'#000'}
      />

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Edit Order</Text>
            
            <ScrollView>
              <Text style={styles.label}>Saral ID</Text>
              <View style={styles.saralIdContainer}>
                <TextInput
                  style={styles.saralIdInput}
                  value={saralId}
                  onChangeText={setSaralId}
                  placeholder="Enter Saral ID"
                />
                <TouchableOpacity 
                  style={styles.fetchButton}
                  onPress={fetchFarmerData}
                  disabled={fetchingFarmer}
                >
                  {fetchingFarmer ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.fetchButtonText}>Fetch</Text>
                  )}
                </TouchableOpacity>
              </View>

              {farmerData && (
                <View>
                  <Text style={styles.label}>Farmer Details</Text>
                  <View style={styles.farmerDetails}>
                    <Text style={styles.infoText}>
                      <Text style={styles.titleText}>Name: </Text>
                      <Text style={styles.dataText}>{farmerData.farmerName || 'N/A'}</Text>
                    </Text>
                    <Text style={styles.infoText}>
                      <Text style={styles.titleText}>Saral ID: </Text>
                      <Text style={styles.dataText}>{farmerData.saralId || 'N/A'}</Text>
                    </Text>
                    <Text style={styles.infoText}>
                      <Text style={styles.titleText}>Contact: </Text>
                      <Text style={styles.dataText}>{farmerData.contact || 'N/A'}</Text>
                    </Text>
                    <Text style={styles.infoText}>
                      <Text style={styles.titleText}>Village: </Text>
                      <Text style={styles.dataText}>{farmerData.village || 'N/A'}</Text>
                    </Text>

                  </View>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeEditModal}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.updateButton]}
                  onPress={handleUpdateOrder}
                  disabled={!farmerData}
                >
                  <Text style={styles.modalButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    height: 60,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    marginVertical: 2,
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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd33b',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  saralIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  saralIdInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  fetchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  fetchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  farmerDetails: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  updateButton: {
    backgroundColor: '#34C759',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Outgoing;