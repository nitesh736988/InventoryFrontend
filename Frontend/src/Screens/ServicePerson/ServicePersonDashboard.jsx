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
//   TextInput,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../../auth/api';;
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
//   const [searchQuery, setSearchQuery] = useState('');

//   const fetchServicePersons = async () => {
//     try {
//       const response = await api.get(`${API_URL}/service-person/dashboard`);
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
//       const response = await api.get(`${API_URL}/service-person/show-emp-dashboard`);
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
//       const response = await api.post(`${API_URL}/user/logout`);
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

//   const filteredServicePersons = useMemo(() => {
//     if (!searchQuery) return servicePersons;
//     return servicePersons.filter(item => 
//       item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [servicePersons, searchQuery]);

//   const filteredServicePersonOutgoing = useMemo(() => {
//     if (!searchQuery) return servicePersonOutgoing;
//     return servicePersonOutgoing.filter(item => 
//       item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [servicePersonOutgoing, searchQuery]);

//   const filteredMaharashtraItems = useMemo(() => {
//     if (!maharashtraData || !searchQuery) return maharashtraData?.itemsList || [];
//     return maharashtraData.itemsList.filter(item => 
//       item.systemItemId.itemName.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [maharashtraData, searchQuery]);

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
//           <Text style={styles.infoValue}>{maharashtraData?.empId?.name}</Text>
//         </View>
        
//         <Text style={styles.sectionTitle}>Items List</Text>
//         {filteredMaharashtraItems.length > 0 ? (
//           filteredMaharashtraItems.map((item, index) => (
//             <View key={index} style={styles.card}>
//               <Text style={styles.cardTitle}>{item.systemItemId.itemName}</Text>
//               <Text style={styles.cardValue}>{item.quantity || 0}</Text>
//             </View>
//           ))
//         ) : (
//           <Text style={{color: 'black'}}>
//             {searchQuery ? 'No matching items found' : 'No Items Available'}
//           </Text>
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
//           <Text style={styles.tabText}>Installation</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search items..."
//           placeholderTextColor="#888"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//         <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.scrollViewContent}
//         refreshControl={
//           <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
//         }>
//         {activeTab === 'service' ? (
//           <>
//             <Text style={styles.sectionTitle}>Incoming Items</Text>
//             {renderItems(filteredServicePersons)}

//             <Text style={styles.sectionTitle}>Outgoing Items</Text>
//             {renderItems(filteredServicePersonOutgoing)}
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
//   searchContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginVertical: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 3,
//   },
//   searchInput: {
//     flex: 1,
//     color: '#000',
//     fontSize: 16,
//   },
//   searchIcon: {
//     marginLeft: 10,
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
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../auth/api';;
import {API_URL} from '@env';
import Sidebarmodal from './Sidebarmodal';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const ServicePersonDashboard = () => {
  const navigation = useNavigation();
  const [complaintData, setComplaintData] = useState(null);
  const [farmerData, setFarmerData] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [servicePersons, setServicePersons] = useState([]);
  const [servicePersonOutgoing, setServicePersonOutgoing] = useState([]);
  const [maharashtraData, setMaharashtraData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'complaints', 'farmers', 'service', 'maharashtra'
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabHistory, setTabHistory] = useState(['overview']); // Track tab navigation history

  // Handle tab changes and maintain history
  const handleTabChange = (tab) => {
    setTabHistory([...tabHistory, tab]);
    setActiveTab(tab);
    setSearchQuery(''); // Reset search when changing tabs
  };

  // Handle back navigation
  const handleBack = () => {
    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop(); // Remove current tab
      const previousTab = newHistory[newHistory.length - 1];
      setTabHistory(newHistory);
      setActiveTab(previousTab);
    } else {
      // If we're at the root, just go to overview
      setActiveTab('overview');
      setTabHistory(['overview']);
    }
  };

  // Fetch dashboard data (complaints and farmers)
  const fetchDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      // Get block list from storage
      let storedBlocks = await AsyncStorage.getItem('blockList');
      if (!storedBlocks) {
        storedBlocks = await AsyncStorage.getItem('block');
      }
      
      const parsedBlocks = storedBlocks ? JSON.parse(storedBlocks) : [];

      const response = await api.post(`https://service.galosolar.com/api/filedService/dashboard`, 
        { blockList: parsedBlocks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        setComplaintData(response.data.complaint);
        setFarmerData(response.data.Farmer);
        setPercentage(response.data.Percentage);
      }
    } catch (error) {
      console.log('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch service persons data
  const fetchServicePersons = async () => {
    try {
      console.log("before api call");
      const response = await api.get(`${API_URL}/service-person/dashboard`);
      console.log('API Response:', response?.data);

      const incoming =
        response?.data?.mergedData?.filter(item => item.type === 'incoming') || [];
      const outgoing =
        response?.data?.mergedData?.filter(item => item.type === 'outgoing') || [];

      setServicePersons(incoming.flatMap(item => item.items || []));
      setServicePersonOutgoing(outgoing.flatMap(item => item.items || []));
    } catch (error) {
      console.log('Error fetching service persons:', error);
      Alert.alert('Error', JSON.stringify(error?.response?.data?.message));
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch maharashtra data
  const fetchMaharashtraData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_URL}/service-person/show-emp-dashboard`);
      console.log('Maharashtra API Response:', response.data);
      setMaharashtraData(response.data.data);
    } catch (error) {
      console.log('Error:', error?.response?.data?.message);
      Alert.alert('Error', error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (activeTab === 'service' || activeTab === 'maharashtra') {
      if (activeTab === 'service') {
        fetchServicePersons();
      } else {
        fetchMaharashtraData();
      }
    } else {
      fetchDashboardData();
    }
  };

  const handleLogout = async () => {
    try {
      const response = await api.post(`${API_URL}/user/logout`);
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
      console.log('Error logging out:', error.message, error.response?.data || error);
      Alert.alert('Error', JSON.stringify(error.response.data?.message));
    }
  };

  useEffect(() => {
    if (activeTab === 'service' || activeTab === 'maharashtra') {
      if (activeTab === 'service') {
        fetchServicePersons();
      } else {
        fetchMaharashtraData();
      }
    } else {
      fetchDashboardData();
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

  // Improved card rendering function
  const renderItems = useMemo(
    () => (items, type = 'default') =>
      items.length > 0 ? (
        <View style={styles.itemsGrid}>
          {items.map(({itemName, quantity}, index) => (
            <View key={index} style={[
              styles.itemCard,
              type === 'incoming' && styles.incomingCard,
              type === 'outgoing' && styles.outgoingCard
            ]}>
              <Text style={styles.itemCardTitle} numberOfLines={2}>{itemName}</Text>
              <View style={styles.quantityContainer}>
                <Text style={styles.itemCardValue}>{quantity || 0}</Text>
                {type !== 'default' && (
                  <Icon 
                    name={type === 'incoming' ? 'arrow-down' : 'arrow-up'} 
                    size={16} 
                    color={type === 'incoming' ? '#4CAF50' : '#F44336'} 
                    style={styles.quantityIcon}
                  />
                )}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Icon name="exclamation-circle" size={40} color="#ccc" />
          <Text style={styles.noDataText}>No Data Available</Text>
        </View>
      ),
    [],
  );

  const StatsCard = ({ title, value, icon, backgroundColor, onPress }) => (
    <TouchableOpacity 
      style={styles.statCard}
      onPress={onPress}
    >
      <View style={[styles.statIcon, { backgroundColor }]}>
        <Icon name={icon} size={24} color="white" />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        {!loading ? (
          <Text style={styles.statValue}>{value}</Text>
        ) : (
          <ActivityIndicator size="small" color="#000" />
        )}
      </View>
    </TouchableOpacity>
  );

  const BlockCard = ({ block, count }) => (
    <View style={styles.blockCard}>
      <Text style={styles.blockTitle}>{block || 'Unknown Block'}</Text>
      <Text style={styles.blockValue}>{count || 0}</Text>
    </View>
  );

  const renderOverview = () => (
    <View>
      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <StatsCard
          title="Total Complaints"
          value={complaintData?.Total || 0}
          icon="exclamation-triangle"
          backgroundColor="#FF9800"
          onPress={() => handleTabChange('complaints')}
        />
        
        <StatsCard
          title="Total Farmers"
          value={farmerData?.Total || 0}
          icon="user"
          backgroundColor="#4CAF50"
          onPress={() => handleTabChange('farmers')}
        />
        
        <StatsCard
          title="Complaint Rate"
          value={`${percentage.toFixed(2)}%`}
          icon="bar-chart"
          backgroundColor="#2196F3"
          onPress={() => {}}
        />
      </View>

      {/* Service and Installation Cards */}
      <View style={styles.featureCardsContainer}>
        <TouchableOpacity 
          style={[styles.featureCard, styles.serviceCard]}
          onPress={() => handleTabChange('service')}
        >
          <View style={styles.featureCardIcon}>
            <Icon name="cogs" size={30} color="#2196F3" />
          </View>
          <View style={styles.featureCardContent}>
            <Text style={styles.featureCardTitle}>Service Items</Text>
            <Text style={styles.featureCardDescription}>
              View incoming and outgoing service items and requests
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.featureCard, styles.installationCard]}
          onPress={() => handleTabChange('maharashtra')}
        >
          <View style={styles.featureCardIcon}>
            <Icon name="wrench" size={30} color="#9C27B0" />
          </View>
          <View style={styles.featureCardContent}>
            <Text style={styles.featureCardTitle}>Installation Items</Text>
            <Text style={styles.featureCardDescription}>
              View installation items and employee dashboard
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderComplaintsDetail = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#000" style={styles.loader} />;
    }

    if (!complaintData || !complaintData.complaintCount || complaintData.complaintCount.length === 0) {
      return <Text style={styles.noDataText}>No Complaint Data Available</Text>;
    }

    return (
      <View>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Icon name="arrow-left" size={16} color="#333" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Total Complaints Summary */}
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>Total Complaints: {complaintData?.Total || 0}</Text>
        </View>

        {/* Complaints by Block */}
        <Text style={styles.sectionTitle}>Complaints by Block</Text>
        <View style={styles.blockContainer}>
          {complaintData.complaintCount.map((item, index) => (
            <BlockCard key={index} block={item.block} count={item.total} />
          ))}
        </View>
      </View>
    );
  };

  const renderFarmersDetail = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#000" style={styles.loader} />;
    }

    if (!farmerData || !farmerData.FarmerCount || farmerData.FarmerCount.length === 0) {
      return <Text style={styles.noDataText}>No Farmer Data Available</Text>;
    }

    return (
      <View>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Icon name="arrow-left" size={16} color="#333" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Total Farmers Summary */}
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>Total Farmers: {farmerData?.Total || 0}</Text>
        </View>

        {/* Farmers by Block */}
        <Text style={styles.sectionTitle}>Farmers by Block</Text>
        <View style={styles.blockContainer}>
          {farmerData.FarmerCount.map((item, index) => (
            <BlockCard key={index} block={item.block} count={item.total} />
          ))}
        </View>
      </View>
    );
  };

  const renderServiceData = () => (
    <View>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBack}
      >
        <Icon name="arrow-left" size={16} color="#333" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Incoming Items</Text>
      {renderItems(filteredServicePersons, 'incoming')}

      <Text style={styles.sectionTitle}>Outgoing Items</Text>
      {renderItems(filteredServicePersonOutgoing, 'outgoing')}
    </View>
  );

  const renderMaharashtraData = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#000" />;
    }

    if (!maharashtraData) {
      return (
        <View style={styles.noDataContainer}>
          <Icon name="exclamation-circle" size={40} color="#ccc" />
          <Text style={styles.noDataText}>No Data Available</Text>
        </View>
      );
    }

    return (
      <View>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Icon name="arrow-left" size={16} color="#333" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Employee Name:</Text>
          <Text style={styles.infoValue}>{maharashtraData?.empId?.name}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Items List</Text>
        {filteredMaharashtraItems.length > 0 ? (
          <View style={styles.itemsGrid}>
            {filteredMaharashtraItems.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <Text style={styles.itemCardTitle} numberOfLines={2}>
                  {item.systemItemId.itemName}
                </Text>
                <Text style={styles.itemCardValue}>{item.quantity || 0}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Icon name="exclamation-circle" size={40} color="#ccc" />
            <Text style={styles.noDataText}>
              {searchQuery ? 'No matching items found' : 'No Items Available'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'complaints':
        return renderComplaintsDetail();
      case 'farmers':
        return renderFarmersDetail();
      case 'service':
        return renderServiceData();
      case 'maharashtra':
        return renderMaharashtraData();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Sidebarmodal />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {activeTab === 'overview' ? 'Service Dashboard' : 
             activeTab === 'complaints' ? 'Complaints Details' : 
             activeTab === 'farmers' ? 'Farmers Details' :
             activeTab === 'service' ? 'Service Items' : 'Installation Items'}
          </Text>
        </View>

        <View style={styles.headersignOut}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="sign-out" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar - Only show for service/maharashtra tabs */}
      {(activeTab === 'service' || activeTab === 'maharashtra') && (
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
      )}

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbd33b',
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 20,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
  // Stats and cards styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  statCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statContent: {
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  featureCardsContainer: {
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  installationCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  featureCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginRight: 16,
  },
  featureCardContent: {
    flex: 1,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  featureCardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  backButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  detailHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  blockContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  blockCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blockTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  blockValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incomingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  outgoingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  itemCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    minHeight: 40,
  },
  itemCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityIcon: {
    marginLeft: 5,
  },
  loader: {
    marginVertical: 20,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
});

export default ServicePersonDashboard;