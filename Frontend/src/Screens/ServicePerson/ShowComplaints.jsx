// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   TextInput,
//   TouchableOpacity,
//   RefreshControl,
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import OpenMap from '../../Component/OpenMap/index';
// import {useNavigation} from '@react-navigation/native';

// const ShowComplaints = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigation = useNavigation();

//   const fetchComplaints = async () => {
//     try {
//       const fieldEmpId = await AsyncStorage.getItem('_id');
//       const blockListString = await AsyncStorage.getItem('block');
//       // console.log("Retrieved block list string:", blockListString);

//       let parsedBlockList = [];
//       try {
//         parsedBlockList = blockListString ? JSON.parse(blockListString) : [];
//       } catch (e) {
//         console.log("Error parsing block list:", e);
//         parsedBlockList = [];
//       }
      
//       // console.log("Field Emp ID:", fieldEmpId);
//       // console.log("Block List:", parsedBlockList);
      
//       const response = await axios.post(
//         'https://service.galosolar.com/api/filedService/complaintList',
//         {
//           blockList: parsedBlockList,
//           fieldEmpId: fieldEmpId
//         }
//       );
      
//       if (response.data.success) {
//         const data = response.data.data || [];

//         const uniqueData = data.filter((item, index, self) => 
//           index === self.findIndex(t => t._id === item._id)
//         );
//         setComplaints(uniqueData);
//       } else {
//         Alert.alert("Error", error?.response?.data?.message);
//       }
//     } catch (error) {
//       // console.log("Error fetching complaints:", error?.response?.data || error.message);
//       Alert.alert("Error", error.response?.data?.message);
//     } finally {                 
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };


//   useEffect(() => {
//     if (complaints.length > 0) {
//       const ids = complaints.map(item => item._id);
//       const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      
//       if (duplicateIds.length > 0) {
//         // console.log('Duplicate IDs found:', duplicateIds);
//         const uniqueComplaints = complaints.filter((item, index, self) => 
//           index === self.findIndex(t => t._id === item._id)
//         );
//         setComplaints(uniqueComplaints);
//       }
//     }
//   }, [complaints]);

//   const filterComplaints = () => {
//     if (!complaints || complaints.length === 0) return [];
    
//     if (!searchQuery.trim()) return complaints;
    
//     const query = searchQuery.toLowerCase().trim();
    
//     return complaints.filter(item => {
//       return (
//         (item?.farmerData?.village?.toLowerCase() ?? '').includes(query) ||
//         (item?.farmerData?.block?.toLowerCase() ?? '').includes(query) ||
//         (item?.farmerData?.farmerName?.toLowerCase() ?? '').includes(query) ||
//         (item?.farmerData?.contact?.toLowerCase() ?? '').includes(query) ||
//         (item?.farmerData?.saralId?.toLowerCase() ?? '').includes(query) ||
//         (item?.complainantName?.toLowerCase() ?? '').includes(query) ||
//         (item?.contact?.toLowerCase() ?? '').includes(query) ||
//         (item?.trackingId?.toLowerCase() ?? '').includes(query)
//       );
//     });
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchComplaints();
//   };

//   const renderComplaintItem = ({item, index}) => (
//     <View style={styles.card}>
//       <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
//         <View style={{flex: 1}}>
//           <Text style={styles.infoText}>
//             <Text style={styles.label}>Complainant:</Text>{' '}
//             <Text numberOfLines={1} ellipsizeMode="tail" style={{color: '#000'}}>
//               {item.complainantName}
//             </Text>
//           </Text>
//         </View>

//         {item?.farmerData?.longitude && item?.farmerData?.latitude && (
//           <OpenMap
//             longitude={item.farmerData.longitude}
//             latitude={item.farmerData.latitude}
//           />
//         )}
       
//         {!(item?.StageData?.stage === "Resolved" || item?.StageData?.stage === "Rejected") && (
//           <TouchableOpacity
//             onPress={() => {
//               navigation.navigate('ShowComplaintData', {
//                 complaintId: item?._id,
//                 farmerName: item?.farmerData?.farmerName,
//                 farmerContact: item?.farmerData?.contact,
//                 village: item?.farmerData?.village,
//                 saralId: item?.farmerData?.saralId,
//                 pump_type: item?.farmerData?.pump_type,
//                 HP: item?.farmerData?.HP,
//                 AC_DC: item?.farmerData?.AC_DC, 
//                 longitude2: item?.farmerData?.longitude,
//                 latitude2: item?.farmerData?.latitude,
//                 trackingId: item?.trackingId
//               }); 
//             }}
            
//             style={styles.fillFormButton}
//           >
//             <Text style={styles.approvedText}>Fill Form</Text>
//           </TouchableOpacity>
//         )}
//       </View>
      
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
//       <Text style={styles.infoText}>
//         <Text style={styles.label}>Saral ID:</Text>{' '}
//         {item.farmerData?.saralId || 'N/A'}
//       </Text>
//         <Text style={[
//           styles.statusText,
//           item?.StageData?.stage?.includes("Pending") && styles.pendingStatus,
//           item?.StageData?.stage?.includes("Resolved") && styles.resolvedStatus,
//           item?.StageData?.stage?.includes("Rejected") && styles.rejectedStatus
//         ]}>
//           {item.StageData?.stage || "Unknown Status"}
//         </Text>
//       </View>
      
//       <Text style={styles.infoText}>
//         <Text style={styles.label}>Contact:</Text> {item?.farmerData?.contact}
//       </Text>      
      
//       <Text style={styles.infoText}>
//         <Text style={styles.label}>Complaint Details:</Text>{' '}
//         {item.complaintDetails}
//       </Text>
           
//       <Text style={styles.infoText}>
//         <Text style={styles.label}>Farmer:</Text>{' '}
//         {item.farmerData?.farmerName || 'N/A'}
//       </Text>

//       <Text style={styles.infoText}>
//         <Text style={styles.label}>Village:</Text>{' '}
//         {item.farmerData?.village || 'N/A'}
//       </Text>

//       <Text style={styles.infoText}>
//         <Text style={styles.label}>Block:</Text>{' '}
//         {item.farmerData?.block || 'N/A'}
//       </Text>
      

      
//       {/* <Text style={styles.infoText}>
//         <Text style={styles.label}>Created At:</Text>{' '}
//         {item.create_At ? new Date(item.create_At).toLocaleDateString() : 'N/A'}
//       </Text> */}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text style={{marginTop: 10}}>Loading complaints...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>All Complaints</Text>
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search by Village, Block, Farmer Name, Contact, Saral ID"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         placeholderTextColor='#000'
//       />
      
//       <FlatList
//         data={filterComplaints()}
//         renderItem={renderComplaintItem}
//         keyExtractor={(item, index) => {
//           // Use _id if available and unique, otherwise fall back to index
//           return item._id ? `${item._id}-${index}` : `complaint-${index}`;
//         }}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>
//             {complaints.length === 0 ? "No complaints available" : "No matching complaints found"}
//           </Text>
//         }
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fbd33b',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//     color: '#000',
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
//     elevation: 2,
//   },
//   infoText: {
//     color: '#000',
//     marginBottom: 4,
//   },
//   approvedText: {
//     color: 'green',
//     fontWeight: 'bold',
//   },
//   label: {
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   statusText: {
//     fontWeight: 'bold',
//   },
//   pendingStatus: {
//     color: 'red',
//   },
//   resolvedStatus: {
//     color: 'rgb(0, 200, 0)',
//   },
//   rejectedStatus: {
//     color: 'red',
//   },
//   fillFormButton: {
//     padding: 5,
//     backgroundColor: '#e8f5e8',
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   emptyText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#555',
//     marginTop: 20,
//   },
//   searchBar: {
//     height: 40,
//     borderColor: '#000',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 16,
//     paddingHorizontal: 10,
//     fontSize: 16,
//     backgroundColor: '#fff',
//   },
// });

// export default ShowComplaints;

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenMap from '../../Component/OpenMap/index';
import {useNavigation} from '@react-navigation/native';

const ShowComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const navigation = useNavigation();

  // Memoized fetch function to prevent unnecessary recreations
  const fetchComplaints = useCallback(async () => {
    // Prevent too frequent API calls (min 10 seconds between calls)
    const now = Date.now();
    if (now - lastFetchTime < 10000 && !refreshing) {
      setRefreshing(false);
      return;
    }

    try {
      const fieldEmpId = await AsyncStorage.getItem('_id');
      const blockListString = await AsyncStorage.getItem('block');
      
      let parsedBlockList = [];
      try {
        parsedBlockList = blockListString ? JSON.parse(blockListString) : [];
      } catch (e) {
        console.log("Error parsing block list:", e);
        parsedBlockList = [];
      }
      
      const response = await axios.post(
        'https://service.galosolar.com/api/filedService/complaintList',
        {
          blockList: parsedBlockList,
          fieldEmpId: fieldEmpId,
          // Request only necessary fields from the server
          fields: 'farmerData.village,farmerData.block,farmerData.farmerName,farmerData.contact,farmerData.saralId,farmerData.longitude,farmerData.latitude,complainantName,contact,complaintDetails,trackingId,StageData.stage,create_At'
        }
      );
      
      if (response.data.success) {
        const data = response.data.data || [];
        
        // Remove duplicates using a more efficient approach
        const uniqueMap = new Map();
        data.forEach(item => {
          if (item._id && !uniqueMap.has(item._id)) {
            // Only keep necessary fields to reduce memory usage
            uniqueMap.set(item._id, {
              _id: item._id,
              farmerData: {
                village: item.farmerData?.village,
                block: item.farmerData?.block,
                farmerName: item.farmerData?.farmerName,
                contact: item.farmerData?.contact,
                saralId: item.farmerData?.saralId,
                longitude: item.farmerData?.longitude,
                latitude: item.farmerData?.latitude
              },
              complainantName: item.complainantName,
              contact: item.contact,
              complaintDetails: item.complaintDetails,
              trackingId: item.trackingId,
              StageData: {
                stage: item.StageData?.stage
              },
              create_At: item.create_At
            });
          }
        });
        
        setComplaints(Array.from(uniqueMap.values()));
        setLastFetchTime(now);
      } else {
        Alert.alert("Error", response.data.message || "Failed to fetch complaints");
      }
    } catch (error) {
      console.log("Error fetching complaints:", error);
      Alert.alert("Error", error.response?.data?.message || "Network error");
    } finally {                 
      setLoading(false);
      setRefreshing(false);
    }
  }, [lastFetchTime, refreshing]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  // Debounced search to prevent frequent filtering
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!complaints || complaints.length === 0) {
        setFilteredComplaints([]);
        return;
      }
      
      if (!searchQuery.trim()) {
        setFilteredComplaints(complaints);
        return;
      }
      
      const query = searchQuery.toLowerCase().trim();
      
      const filtered = complaints.filter(item => {
        return (
          (item?.farmerData?.village?.toLowerCase() ?? '').includes(query) ||
          (item?.farmerData?.block?.toLowerCase() ?? '').includes(query) ||
          (item?.farmerData?.farmerName?.toLowerCase() ?? '').includes(query) ||
          (item?.farmerData?.contact?.toLowerCase() ?? '').includes(query) ||
          (item?.farmerData?.saralId?.toLowerCase() ?? '').includes(query) ||
          (item?.complainantName?.toLowerCase() ?? '').includes(query) ||
          (item?.contact?.toLowerCase() ?? '').includes(query) ||
          (item?.trackingId?.toLowerCase() ?? '').includes(query)
        );
      });
      
      setFilteredComplaints(filtered);
    }, 300); // 300ms debounce delay
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, complaints]);

  const renderComplaintItem = ({item, index}) => (
    <View style={styles.card}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Complainant:</Text>{' '}
            <Text numberOfLines={1} ellipsizeMode="tail" style={{color: '#000'}}>
              {item.complainantName}
            </Text>
          </Text>
        </View>

        {item?.farmerData?.longitude && item?.farmerData?.latitude && (
          <OpenMap
            longitude={item.farmerData.longitude}
            latitude={item.farmerData.latitude}
          />
        )}
       
        {!(item?.StageData?.stage === "Resolved" || item?.StageData?.stage === "Rejected") && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ShowComplaintData', {
                complaintId: item?._id,
                farmerName: item?.farmerData?.farmerName,
                farmerContact: item?.farmerData?.contact,
                village: item?.farmerData?.village,
                saralId: item?.farmerData?.saralId,
                pump_type: item?.farmerData?.pump_type,
                HP: item?.farmerData?.HP,
                AC_DC: item?.farmerData?.AC_DC, 
                longitude2: item?.farmerData?.longitude,
                latitude2: item?.farmerData?.latitude,
                trackingId: item?.trackingId
              }); 
            }}
            
            style={styles.fillFormButton}
          >
            <Text style={styles.approvedText}>Fill Form</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Saral ID:</Text>{' '}
        {item.farmerData?.saralId || 'N/A'}
      </Text>
        <Text style={[
          styles.statusText,
          item?.StageData?.stage?.includes("Pending") && styles.pendingStatus,
          item?.StageData?.stage?.includes("Resolved") && styles.resolvedStatus,
          item?.StageData?.stage?.includes("Rejected") && styles.rejectedStatus
        ]}>
          {item.StageData?.stage || "Unknown Status"}
        </Text>
      </View>
      
      <Text style={styles.infoText}>
        <Text style={styles.label}>Contact:</Text> {item?.farmerData?.contact}
      </Text>      
      
      <Text style={styles.infoText}>
        <Text style={styles.label}>Complaint Details:</Text>{' '}
        {item.complaintDetails}
      </Text>
           
      <Text style={styles.infoText}>
        <Text style={styles.label}>Farmer:</Text>{' '}
        {item.farmerData?.farmerName || 'N/A'}
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.label}>Village:</Text>{' '}
        {item.farmerData?.village || 'N/A'}
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.label}>Block:</Text>{' '}
        {item.farmerData?.block || 'N/A'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{marginTop: 10}}>Loading complaints...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Complaints</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Village, Block, Farmer Name, Contact, Saral ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor='#000'
      />
      
      <FlatList
        data={filteredComplaints}
        renderItem={renderComplaintItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {complaints.length === 0 ? "No complaints available" : "No matching complaints found"}
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fbd33b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000',
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
    elevation: 2,
  },
  infoText: {
    color: '#000',
    marginBottom: 4,
  },
  approvedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  statusText: {
    fontWeight: 'bold',
  },
  pendingStatus: {
    color: 'red',
  },
  resolvedStatus: {
    color: 'rgb(0, 200, 0)',
  },
  rejectedStatus: {
    color: 'red',
  },
  fillFormButton: {
    padding: 5,
    backgroundColor: '#e8f5e8',
    borderRadius: 5,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default ShowComplaints;