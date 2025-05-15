// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import axios from 'axios';
// import { API_URL } from '@env';
// import { useNavigation } from '@react-navigation/native';
// import Sidebar from './Sidebar';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const WarehouseDashboard = () => {
//   const [data, setData] = useState([]); 
//   const [loading, setLoading] = useState(true); 
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeCard, setActiveCard] = useState('Service');
//   const [newInstallationData, setNewInstallationData] = useState([]);
//   const navigation = useNavigation();

//   const fetchData = async () => {
//     setLoading(true); 
//     try {
//       const response = await axios.get(`${API_URL}/warehouse-admin/dashboard`);
//       console.log('Response data:', response.data);

//       if (response.data?.warehouseData?.items) {
//         setData(response.data.warehouseData.items);
//       }
           
//       const installationResponse = await axios.get(`${API_URL}/warehouse-admin/show-inventory-items`);
//       console.log("System Data:", installationResponse.data.data);
//       if (installationResponse.data?.data) {
//         setNewInstallationData(installationResponse.data.data);
//       } else {
//         setNewInstallationData([]);
//       }
//     } catch (error) {
//       console.log('Error fetching data:', error.message);
//       if (error.response) {
//         console.log('Error Response:', error.response.data);
//       } else {
//         console.log('Unknown Error:', error);
//       }
//     } finally {
//       setLoading(false); 
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       await fetchData();
//     } finally {
//       setRefreshing(false);
//     }
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const response = await axios.post(`${API_URL}/user/logout`);
//       if (response.data.success) {
//         Alert.alert('Logout', 'You have logged out successfully');
//         await AsyncStorage.clear(); 
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'LoginPage' }],
//         }); 
//       } else {
//         Alert.alert('Logout Failed', response.data.message || 'Unknown error');
//       }
//     } catch (error) {
//       console.log('Error logging out:', error.message, error.response?.data || error);
//       Alert.alert('Error', 'Failed to logout. Please try again.');
//     }
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       showsVerticalScrollIndicator={true}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }>
//       <View style={styles.cardSwitcher}>
//         <TouchableOpacity
//           style={[
//             styles.switchButton,
//             activeCard === 'Service' && styles.activeButton,
//           ]}
//           onPress={() => setActiveCard('Service')}>
//           <Text style={styles.switchButtonText}>Service</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.switchButton,
//             activeCard === 'New Installation' && styles.activeButton,
//           ]}
//           onPress={() => setActiveCard('New Installation')}>
//           <Text style={styles.switchButtonText}>System Data</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.header}>
//         <Sidebar />
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Icon name="sign-out" size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       {activeCard === 'Service' ? (
//         data.length > 0 ? (
//           data.map(({ _id, itemName,newStock, quantity, defective, repaired, rejected }) => (
//             <View key={_id} style={styles.card}>
//               <TouchableOpacity
//                 onPress={() =>
//                   navigation.navigate('AddData', { itemName })
//                 }>
//                 <Text
//                   style={{
//                     ...styles.cardTitle,
//                     color: '#000',
//                     textDecorationLine: 'underline',
//                   }}>
//                   {itemName}
//                 </Text>
//               </TouchableOpacity>

//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 New Stock: {newStock}
//               </Text>

//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 Stock: {quantity}
//               </Text>
//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 Defective: {defective}
//               </Text>
//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 Repaired: {repaired}
//               </Text>
//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 Rejected: {rejected}
//               </Text>

//               {/* <TouchableOpacity
//                 style={styles.externalLinkIcon}
//                 onPress={() =>
//                   navigation.navigate('Stockdata', {
//                     itemId: _id,
//                     itemName,
//                   })
//                 }>
//                 <Icon name="external-link" size={20} color="blue" />
//               </TouchableOpacity> */}
//             </View>
//           ))
//         ) : (
//           <Text style={styles.noDataText}>No items found.</Text>
//         )
//       ) : (
//         newInstallationData.length > 0 ? (
//           newInstallationData.map(({ systemItemId, quantity }) => (
//             <View key={systemItemId._id} style={styles.card}>
//               <TouchableOpacity
//                 onPress={() =>
//                   navigation.navigate('ItemStockUpdate', {systemItemId: systemItemId._id, itemName: systemItemId.itemName,})
//                 }>
//                 <Text
//                   style={{
//                     ...styles.cardTitle,
//                     color: '#000',
//                     textDecorationLine: 'underline',
//                   }}>
//                   {systemItemId.itemName}
//                 </Text>
//               </TouchableOpacity>
//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 Quantity: {quantity}
//               </Text>
//             </View>
//           ))
//         ) : (
//           <Text style={styles.noDataText}>No system data found.</Text>
//         )
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fbd33b',
//   },
//   header: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingBottom: 30,
//   },
//   logoutButton: {
//     backgroundColor: 'black',
//     padding: 10,
//     borderRadius: 20,
//   },
//   cardSwitcher: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   switchButton: {
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#e0e0e0',
//   },
//   activeButton: {
//     backgroundColor: '#000',
//   },
//   switchButtonText: {
//     color: '#fff',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'black',
//   },
//   cardDetails: {
//     fontSize: 14,
//     marginTop: 5,
//   },
//   noDataText: {
//     fontSize: 16,
//     color: 'gray',
//     textAlign: 'center',
//   },
//   externalLinkIcon: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
// });

// export default WarehouseDashboard;


// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import axios from 'axios';
// import { API_URL } from '@env';
// import { useNavigation } from '@react-navigation/native';
// import Sidebar from './Sidebar';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const WarehouseDashboard = () => {
//   const [data, setData] = useState([]); 
//   const [loading, setLoading] = useState(true); 
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeCard, setActiveCard] = useState('Service');
//   const [newInstallationData, setNewInstallationData] = useState([]);
//   const navigation = useNavigation();

//   const fetchData = async () => {
//     setLoading(true); 
//     try {
//       const response = await axios.get(`${API_URL}/warehouse-admin/dashboard`);
//       // console.log('Response data:', response.data);

//       if (response.data?.warehouseData?.items) {
//         setData(response.data.warehouseData.items);
//       }
           
//       const installationResponse = await axios.get(`${API_URL}/warehouse-admin/show-inventory-items`);
//       // console.log("System Data:", installationResponse.data.data);
//       if (installationResponse.data?.data) {
//         setNewInstallationData(installationResponse.data.data);
//       } else {
//         setNewInstallationData([]);
//       }
//     } catch (error) {
//       console.log('Error fetching data:', error.message);
//       if (error.response) {
//         console.log('Error Response:', error.response.data);
//       } else {
//         console.log('Unknown Error:', error);
//       }
//     } finally {
//       setLoading(false); 
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       await fetchData();
//     } finally {
//       setRefreshing(false);
//     }
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const response = await axios.post(`${API_URL}/user/logout`);
//       if (response.data.success) {
//         Alert.alert('Logout', 'You have logged out successfully');
//         await AsyncStorage.clear(); 
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'LoginPage' }],
//         }); 
//       } else {
//         Alert.alert('Logout Failed', response.data.message || 'Unknown error');
//       }
//     } catch (error) {
//       console.log('Error logging out:', error.message, error.response?.data || error);
//       Alert.alert('Error', 'Failed to logout. Please try again.');
//     }
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView 
//     contentContainerStyle={{ paddingBottom: 20 }}
//       style={styles.container}
//       showsVerticalScrollIndicator={true}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }>
//       <View style={styles.cardSwitcher}>
//         <TouchableOpacity
//           style={[
//             styles.switchButton,
//             activeCard === 'Service' && styles.activeButton,
//           ]}
//           onPress={() => setActiveCard('Service')}>
//           <Text style={styles.switchButtonText}>Service</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.switchButton,
//             activeCard === 'New Installation' && styles.activeButton,
//           ]}
//           onPress={() => setActiveCard('New Installation')}>
//           <Text style={styles.switchButtonText}>System Data</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.header}>
//         <Sidebar />
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Icon name="sign-out" size={20} color="white" />
//         </TouchableOpacity>
//       </View>

//       {activeCard === 'Service' ? (
//         data.length > 0 ? (
//           data.map(({ _id, itemName, newStock, quantity, defective, repaired, rejected }) => (
//             <View key={_id} style={styles.card}>
//               <TouchableOpacity
//                 onPress={() =>
//                   navigation.navigate('AddData', { itemName })
//                 }>
//                 <Text
//                   style={{
//                     ...styles.cardTitle,
//                     color: '#000',
//                     textDecorationLine: 'underline',
//                   }}>
//                   {itemName}
//                 </Text>
//               </TouchableOpacity>

//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 New Stock: {newStock}
//               </Text>

//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 Stock: {quantity}
//               </Text>
//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 Defective: {defective}
//               </Text>
//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 Repaired: {repaired}
//               </Text>
//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 Rejected: {rejected}
//               </Text>
//             </View>
//           ))
//         ) : (
//           <Text style={styles.noDataText}>No items found.</Text>
//         )
//       ) : (
//         newInstallationData.length > 0 ? (
//           newInstallationData.map(({ systemItemId, quantity }) => (
//             <View key={systemItemId._id} style={styles.card}>
//               <TouchableOpacity
//                 onPress={() =>
//                   navigation.navigate('ItemStockUpdate', {
//                     subItemId: systemItemId._id, 
//                     itemName: systemItemId.itemName,
//                   })
//                 }>
//                 <Text
//                   style={{
//                     ...styles.cardTitle,
//                     color: '#000',
//                     textDecorationLine: 'underline',
//                   }}>
//                   {systemItemId.itemName}
//                 </Text>
//               </TouchableOpacity>
//               <Text style={{ ...styles.cardDetails, color: '#000' }}>
//                 Quantity: {quantity}
//               </Text>
//             </View>
//           ))
//         ) : (
//           <Text style={styles.noDataText}>No system data found.</Text>
//         )
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     height: '100%',
//     padding: 20,
//     backgroundColor: '#fbd33b',
//   },
//   header: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingBottom: 30,

//   },
//   logoutButton: {
//     backgroundColor: 'black',
//     padding: 10,
//     borderRadius: 20,
//   },
//   cardSwitcher: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   switchButton: {
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#e0e0e0',
//   },
//   activeButton: {
//     backgroundColor: '#000',
//   },
//   switchButtonText: {
//     color: '#fff',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//     borderWidth: 1,

//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'black',
//   },
//   cardDetails: {
//     fontSize: 14,
//     marginTop: 5,
//   },
//   noDataText: {
//     fontSize: 16,
//     color: 'gray',
//     textAlign: 'center',
//   },
//   externalLinkIcon: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//   },
// });

// export default WarehouseDashboard;

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import Sidebar from './Sidebar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WarehouseDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCard, setActiveCard] = useState('Service');
  const [newInstallationData, setNewInstallationData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [filteredSystemData, setFilteredSystemData] = useState([]);
  const navigation = useNavigation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/warehouse-admin/dashboard`);
      if (response.data?.warehouseData?.items) {
        setData(response.data.warehouseData.items);
        setFilteredData(response.data.warehouseData.items);
      }

      const installationResponse = await axios.get(`${API_URL}/warehouse-admin/show-inventory-items`);
      if (installationResponse.data?.data) {
        setNewInstallationData(installationResponse.data.data);
        setFilteredSystemData(installationResponse.data.data);
      } else {
        setNewInstallationData([]);
        setFilteredSystemData([]);
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
      if (error.response) {
        console.log('Error Response:', error.response.data);
      } else {
        console.log('Unknown Error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    if (searchQuery.trim() === '') {
      setFilteredData(data);
      setFilteredSystemData(newInstallationData);
    } else {
      if (activeCard === 'Service') {
        const filtered = data.filter(item =>
          item.itemName.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredData(filtered);
      } else {
        const filtered = newInstallationData.filter(item =>
          item.systemItemId.itemName.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredSystemData(filtered);
      }
    }
  }, [searchQuery, data, newInstallationData, activeCard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
      setSearchQuery('');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/logout`);
      if (response.data.success) {
        Alert.alert('Logout', 'You have logged out successfully');
        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginPage' }],
        });
      } else {
        Alert.alert('Logout Failed', response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.log('Error logging out:', error.message, error.response?.data || error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      style={styles.container}
      showsVerticalScrollIndicator={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.cardSwitcher}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            activeCard === 'Service' && styles.activeButton,
          ]}
          onPress={() => setActiveCard('Service')}>
          <Text style={styles.switchButtonText}>Service Data </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchButton,
            activeCard === 'New Installation' && styles.activeButton,
          ]}
          onPress={() => setActiveCard('New Installation')}>
          <Text style={styles.switchButtonText}>Maharastra Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Sidebar />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="white" />
        </TouchableOpacity>
        
      </View>

      <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Icon name="search" size={16} color="#888" style={styles.searchIcon} />
        </View>
        
      {activeCard === 'Service' ? (
        filteredData.length > 0 ? (
          filteredData.map(({ _id, itemName, newStock, quantity, defective, repaired, rejected }) => (
            <View key={_id} style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AddData', { itemName })
                }>
                <Text style={{ ...styles.cardTitle, textDecorationLine: 'underline' }}>
                  {itemName}
                </Text>
              </TouchableOpacity>

              <Text style={styles.cardDetails}>New Stock: {newStock}</Text>
              <Text style={styles.cardDetails}>Stock: {quantity}</Text>
              <Text style={styles.cardDetails}>Defective: {defective}</Text>
              <Text style={styles.cardDetails}>Repaired: {repaired}</Text>
              <Text style={styles.cardDetails}>Rejected: {rejected}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No items found{searchQuery ? ` matching "${searchQuery}"` : ''}.</Text>
        )
      ) : (
        filteredSystemData.length > 0 ? (
          filteredSystemData.map(({ systemItemId, quantity }) => (
            <View key={systemItemId._id} style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ItemStockUpdate', {
                    subItemId: systemItemId._id,
                    itemName: systemItemId.itemName,
                  })
                }>
                <Text style={{ ...styles.cardTitle, textDecorationLine: 'underline' }}>
                  {systemItemId.itemName}
                </Text>
              </TouchableOpacity>
              <Text style={styles.cardDetails}>Quantity: {quantity}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No system data found{searchQuery ? ` matching "${searchQuery}"` : ''}.</Text>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 30,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 10,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    paddingLeft: 35,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  logoutButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
  },
  cardSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  activeButton: {
    backgroundColor: '#000',
  },
  switchButtonText: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  cardDetails: {
    fontSize: 14,
    marginTop: 5,
    color: '#000',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WarehouseDashboard;
