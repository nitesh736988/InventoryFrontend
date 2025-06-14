// import React, {useState, useEffect, useMemo} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   Dimensions,
//   RefreshControl,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import {API_URL} from '@env';
// import Sidebarmodal from './Sidebarmodal';

// const {width} = Dimensions.get('window');

// const ServicePersonDashboard = ({navigation}) => {
//   const [servicePersons, setServicePersons] = useState([]);
//   const [servicePersonOutgoing, setServicePersonOutgoing] = useState([]);
//   const [maharashtraData, setMaharashtraData] = useState(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [activeTab, setActiveTab] = useState('service');
//   const [loading, setLoading] = useState(false);

//   const fetchServicePersons = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/service-person/dashboard`);
//       console.log('API Response:', response.data);

//       const incoming =
//         response.data.mergedData?.filter(item => item.type === 'incoming') || [];
//       const outgoing =
//         response.data.mergedData?.filter(item => item.type === 'outgoing') || [];

//       setServicePersons(incoming.flatMap(item => item.items || []));
//       setServicePersonOutgoing(outgoing.flatMap(item => item.items || []));
//     } catch (error) {
//       console.log('Error fetching service persons:', error);
//       Alert.alert('Error', JSON.stringify(error.response.data?.message));
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   const fetchMaharashtraData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/service-person/show-emp-dashboard`);
//       console.log('Maharashtra API Response:', response.data);
//       setMaharashtraData(response.data.data);
//     } catch (error) {
//       console.log(
//         'Error:',
//         error?.response?.data?.message,
//       );
//       Alert.alert('Error', error?.response?.data?.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     if (activeTab === 'service') {
//       fetchServicePersons();
//     } else {
//       fetchMaharashtraData();
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await axios.post(`${API_URL}/user/logout`);
//       if (response.data.success) {
//         Alert.alert('Logout', 'You have logged out successfully');
//         await AsyncStorage.clear();
//         navigation.reset({
//           index: 0,
//           routes: [{name: 'LoginPage'}],
//         });
//       } else {
//         Alert.alert('Logout Failed', response.data.message || 'Unknown error');
//       }
//     } catch (error) {
//       console.log(
//         'Error logging out:',
//         error.message,
//         error.response?.data || error,
//       );
//       Alert.alert('Error', JSON.stringify(error.response.data?.message));
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'service') {
//       fetchServicePersons();
//     } else {
//       fetchMaharashtraData();
//     }
//   }, [activeTab]);

//   const renderItems = useMemo(
//     () => items =>
//       items.length > 0 ? (
//         items.map(({itemName, quantity}, index) => (
//           <View key={index} style={styles.card}>
//             <Text style={styles.cardTitle}>{itemName}</Text>
//             <Text style={styles.cardValue}>{quantity || 0}</Text>
//           </View>
//         ))
//       ) : (
//         <Text style={{color: 'black'}}>No Data Available</Text>
//       ),
//     [],
//   );

//   const renderMaharashtraData = () => {
//     if (loading) {
//       return <ActivityIndicator size="large" color="#000" />;
//     }

//     if (!maharashtraData) {
//       return <Text style={{color: 'black'}}>No Data Available</Text>;
//     }

//     return (
//       <View>
//         <View style={styles.infoCard}>
//           <Text style={styles.infoLabel}>Employee Name:</Text>
//           <Text style={styles.infoValue}>{maharashtraData.empId.name}</Text>
//         </View>
        
//         <Text style={styles.sectionTitle}>Items List</Text>
//         {maharashtraData.itemsList.length > 0 ? (
//           maharashtraData.itemsList.map((item, index) => (
//             <View key={index} style={styles.card}>
//               <Text style={styles.cardTitle}>{item.systemItemId.itemName}</Text>
//               <Text style={styles.cardValue}>{item.quantity || 0}</Text>
//             </View>
//           ))
//         ) : (
//           <Text style={{color: 'black'}}>No Items Available</Text>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <View style={styles.header}>
//           <Sidebarmodal />
//         </View>
//         <View style={styles.headerCenter}></View>

//         <View style={styles.headersignOut}>
//           <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//             <Icon name="sign-out" size={20} color="white" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Tab Navigation */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             activeTab === 'service' && styles.activeTab,
//           ]}
//           onPress={() => setActiveTab('service')}>
//           <Text style={styles.tabText}>Service</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             activeTab === 'maharashtra' && styles.activeTab,
//           ]}
//           onPress={() => setActiveTab('maharashtra')}>
//           <Text style={styles.tabText}>Maharashtra Service</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.scrollViewContent}
//         refreshControl={
//           <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
//         }>
//         {activeTab === 'service' ? (
//           <>
//             <Text style={styles.sectionTitle}>Incoming Items</Text>
//             {renderItems(servicePersons)}

//             <Text style={styles.sectionTitle}>Outgoing Items</Text>
//             {renderItems(servicePersonOutgoing)}
//           </>
//         ) : (
//           renderMaharashtraData()
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fbd33b',
//     justifyContent: 'flex-start',
//   },
//   headerContainer: {
//     width: width - 35,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 10,
//   },
//   logoutButton: {
//     backgroundColor: 'black',
//     padding: 10,
//     borderRadius: 20,
//   },
//   scrollViewContent: {
//     paddingBottom: 20,
//   },
//   sectionTitle: {
//     color: '#070604',
//     fontSize: 28,
//     marginVertical: 10,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     marginVertical: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: 16,
//     color: '#888',
//   },
//   cardValue: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 5,
//   },
//   tabButton: {
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     alignItems: 'center',
//   },
//   activeTab: {
//     backgroundColor: '#fbd33b',
//   },
//   tabText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   infoCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     marginVertical: 10,
//     elevation: 3,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#888',
//   },
//   infoValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//     marginTop: 5,
//   },
// });

// export default ServicePersonDashboard;


import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import Sidebarmodal from './Sidebarmodal';

const {width} = Dimensions.get('window');

const ServicePersonDashboard = ({navigation}) => {
  const [servicePersons, setServicePersons] = useState([]);
  const [servicePersonOutgoing, setServicePersonOutgoing] = useState([]);
  const [maharashtraData, setMaharashtraData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('service');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchServicePersons = async () => {
    try {
      const response = await axios.get(`${API_URL}/service-person/dashboard`);
      console.log('API Response:', response.data);

      const incoming =
        response.data.mergedData?.filter(item => item.type === 'incoming') || [];
      const outgoing =
        response.data.mergedData?.filter(item => item.type === 'outgoing') || [];

      setServicePersons(incoming.flatMap(item => item.items || []));
      setServicePersonOutgoing(outgoing.flatMap(item => item.items || []));
    } catch (error) {
      console.log('Error fetching service persons:', error);
      Alert.alert('Error', JSON.stringify(error.response.data?.message));
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchMaharashtraData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/service-person/show-emp-dashboard`);
      console.log('Maharashtra API Response:', response.data);
      setMaharashtraData(response.data.data);
    } catch (error) {
      console.log(
        'Error:',
        error?.response?.data?.message,
      );
      Alert.alert('Error', error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (activeTab === 'service') {
      fetchServicePersons();
    } else {
      fetchMaharashtraData();
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/logout`);
      if (response.data.success) {
        Alert.alert('Logout', 'You have logged out successfully');
        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{name: 'LoginPage'}],
        });
      } else {
        Alert.alert('Logout Failed', response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.log(
        'Error logging out:',
        error.message,
        error.response?.data || error,
      );
      Alert.alert('Error', JSON.stringify(error.response.data?.message));
    }
  };

  useEffect(() => {
    if (activeTab === 'service') {
      fetchServicePersons();
    } else {
      fetchMaharashtraData();
    }
  }, [activeTab]);

  const filteredServicePersons = useMemo(() => {
    if (!searchQuery) return servicePersons;
    return servicePersons.filter(item => 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [servicePersons, searchQuery]);

  const filteredServicePersonOutgoing = useMemo(() => {
    if (!searchQuery) return servicePersonOutgoing;
    return servicePersonOutgoing.filter(item => 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [servicePersonOutgoing, searchQuery]);

  const filteredMaharashtraItems = useMemo(() => {
    if (!maharashtraData || !searchQuery) return maharashtraData?.itemsList || [];
    return maharashtraData.itemsList.filter(item => 
      item.systemItemId.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [maharashtraData, searchQuery]);

  const renderItems = useMemo(
    () => items =>
      items.length > 0 ? (
        items.map(({itemName, quantity}, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{itemName}</Text>
            <Text style={styles.cardValue}>{quantity || 0}</Text>
          </View>
        ))
      ) : (
        <Text style={{color: 'black'}}>No Data Available</Text>
      ),
    [],
  );

  const renderMaharashtraData = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#000" />;
    }

    if (!maharashtraData) {
      return <Text style={{color: 'black'}}>No Data Available</Text>;
    }

    return (
      <View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Employee Name:</Text>
          <Text style={styles.infoValue}>{maharashtraData.empId.name}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Items List</Text>
        {filteredMaharashtraItems.length > 0 ? (
          filteredMaharashtraItems.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.systemItemId.itemName}</Text>
              <Text style={styles.cardValue}>{item.quantity || 0}</Text>
            </View>
          ))
        ) : (
          <Text style={{color: 'black'}}>
            {searchQuery ? 'No matching items found' : 'No Items Available'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Sidebarmodal />
        </View>
        <View style={styles.headerCenter}></View>

        <View style={styles.headersignOut}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="sign-out" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'service' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('service')}>
          <Text style={styles.tabText}>Service</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'maharashtra' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('maharashtra')}>
          <Text style={styles.tabText}>Maharashtra Service</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }>
        {activeTab === 'service' ? (
          <>
            <Text style={styles.sectionTitle}>Incoming Items</Text>
            {renderItems(filteredServicePersons)}

            <Text style={styles.sectionTitle}>Outgoing Items</Text>
            {renderItems(filteredServicePersonOutgoing)}
          </>
        ) : (
          renderMaharashtraData()
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
    justifyContent: 'flex-start',
  },
  headerContainer: {
    width: width - 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  logoutButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    color: '#070604',
    fontSize: 28,
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: '#888',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fbd33b',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
});

export default ServicePersonDashboard;