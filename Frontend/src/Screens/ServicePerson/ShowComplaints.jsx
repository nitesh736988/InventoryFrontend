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
// import EntypoIcon from 'react-native-vector-icons/Entypo';
// import {useNavigation} from '@react-navigation/native';

// const ShowComplaints = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigation = useNavigation();

//   const fetchComplaints = async () => {
//     try {
//       const serviceId = await AsyncStorage.getItem('_id');
//       console.log(serviceId);
//       const response = await axios.get(
//         `http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`,
//       );
//       setComplaints(response.data.data);
//     } catch (error) {
//       console.log('Error fetching complaints:', error);
//     } finally {                 
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const filterComplaints = () => {
//     return complaints.filter(
//       complaint =>
//         complaint.complainantName
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase()) ||
//         complaint.trackingId.toLowerCase().includes(searchQuery.toLowerCase()),
//     );
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, [loading]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchComplaints();
//   };

//   // const handleApproveBtn = async (sendTransactionId, status) => {
//   //   setLoading(true);
//   //   try {
//   //     const fieldEmpId = await AsyncStorage.getItem('_id');

//   //     const sendRequest = await axios.post(
//   //       `http://88.222.214.93:8001/filedService/complaintAccept`,
//   //       {
//   //         stageId: status,
//   //         complaintId: sendTransactionId,
//   //         empId: fieldEmpId,
//   //       },
//   //     );
//   //     console.log(sendRequest.data);
//   //   } catch (error) {
//   //     Alert.alert(JSON.stringify(error));
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const renderComplaintItem = ({item}) => (
//     <View key={item._id} style={styles.card}>
//       <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//         <Text style={styles.infoText}>
//           <Text style={styles.label}>Complainant Name:</Text>{' '}
//           <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: 130 }}>
//             <Text
//               numberOfLines={1}
//               ellipse="tail"
//             >{item.complainantName}</Text>
//           </View>
//         </Text>

//         {item?.Stage[0]?._id === '675aaf9c44c74418017c1dae' ? (
//           <OpenMap
//             longitude={item?.Farmer[0]?.longitude}
//             latitude={item?.Farmer[0]?.latitude}
//           />
//         ) : item?.Stage[0]._id === '675aaf9c44c74418017c1daf' ? (
//           <EntypoIcon name="squared-cross" color="red" size={25} />
//         ) : null}
//         {!(item?.Stage[0]._id == "675be30222ae6f63bf772dd1" || item?.Stage[0]._id == "675be30222ae6f63bf772dd0" || item?.Stage[0]?._id == "675aaf9c44c74418017c1daf") && <TouchableOpacity
//           onPress={() =>
//             {navigation.navigate('ShowComplaintData', {
//               complaintId: item?._id,
//               farmerName: item?.Farmer[0]?.farmerName,
//               farmerContact: item?.Farmer[0]?.contact,
//               fatherOrHusbandName: item?.Farmer[0]?.fatherOrHusbandName,
//               pump_type: item?.Farmer[0]?.pump_type,
//               HP: item?.Farmer[0]?.HP,
//               AC_DC: item?.Farmer[0]?.AC_DC, 
//               longitude2: item?.Farmer[0]?.longitude,
//               latitude2: item?.Farmer[0]?.latitude
//             }); setLoading(true)
//           }
//           }>
//           <Text style={styles.approvedText}>Fill Form</Text>
//         </TouchableOpacity>}
//       </View>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
//         <Text style={styles.infoText}>
//           <Text style={styles.label}>Tracking ID:</Text> {item.trackingId}
//         </Text>
//         {item?.Stage[0]?._id === "675be30222ae6f63bf772dcf" && <Text style={{ color: 'red' }}>Pending</Text>}
//         {item?.Stage[0]?._id === "675be30222ae6f63bf772dd1" && <Text style={{ color: 'red'}}>Rejected</Text>}
//         {item?.Stage[0]?._id === "675be30222ae6f63bf772dd0" && <Text style={{ color: 'rgb(0, 200, 0)'}}>Resolved</Text>}
//       </View>
//       <Text style={styles.infoText}>
//         <Text style={styles.label}>Contact:</Text> {item.contact}
//       </Text>      
//       <Text style={styles.infoText}>
//         <Text style={styles.label}>Company:</Text> {item.company}
//       </Text>     
//       <Text style={styles.infoText}>
//         <Text style={styles.label}>ComplaintDetails:</Text>{' '}
//         {item.complaintDetails}
//       </Text>
           
//       <Text style={styles.infoText}>
//         <Text style={styles.label}>Village:</Text>{' '}
//         {item.Farmer[0].village}
//       </Text>

//       <Text style={styles.infoText}>
//         <Text style={styles.label}>Block:</Text>{' '}
//         {item.Farmer[0].block}
//       </Text>
//       <Text style={styles.infoText}>
//         <Text style={styles.label}>Created At:</Text>{' '}
//         {new Date(item.created_At).toLocaleDateString()}
//       </Text>

//       <View style={styles.actionContainer}>
//         {item?.Stage[0]?.stage === 'Assigned' && (
//           <>
//             <TouchableOpacity
//               onPress={() =>
//                 handleApproveBtn(item._id, '675aaf9c44c74418017c1daf')
//               }
//               style={styles.declineButton}>
//               <Text style={styles.buttonText}>Decline</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.approveButton}
//               onPress={() =>
//                 handleApproveBtn(item._id, '675aaf9c44c74418017c1dae')
//               }>
//               <Text style={styles.buttonText}>Approve</Text>
//             </TouchableOpacity>
//           </>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Complaints</Text>
//       <FlatList
//         data={filterComplaints()}
//         renderItem={renderComplaintItem}
//         keyExtractor={item => item._id}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No complaints found.</Text>
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
//   },

//     approvedText: {
//     color: 'green',
//     fontWeight: 'bold',
//   },
//   label: {
//     fontWeight: 'bold',
//   },
//   loadingIndicator: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   actionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     // marginVertical: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
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

//   emptyText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#555',
//     marginTop: 20,
//   },
//   searchBar: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     // marginBottom: 16,
//     paddingHorizontal: 10,
//     fontSize: 16,
//     backgroundColor: '#fff',
//   },
// });

// export default ShowComplaints;


import React, {useState, useEffect} from 'react';
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
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';

const ShowComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const fetchComplaints = async () => {
    try {
      const serviceId = await AsyncStorage.getItem('_id');
      console.log(serviceId);
      const response = await axios.get(
        `http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`,
      );
      console.log("fetch data", response.data)
      setComplaints(response.data.data);
    } catch (error) {
      console.log('Error fetching complaints:', error);
    } finally {                 
      setLoading(false);
      setRefreshing(false);
    }
  };


  const filterComplaints = () => {
    return complaints?.filter(item =>
      item?.Farmer[0]?.village?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.Farmer[0]?.block?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.Farmer[0]?.farmerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.Farmer[0]?.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.Farmer[0]?.saralId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    fetchComplaints();
  }, [loading]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

 
  const renderComplaintItem = ({item}) => (
    <View key={item._id} style={styles.card}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Complainant Name:</Text>{' '}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: 130 }}>
            <Text
              numberOfLines={1}
              ellipse="tail"
            >{item.complainantName}</Text>
          </View>
        </Text>

        {/* { ( */}
          <OpenMap
            longitude={item?.Farmer[0]?.longitude}
            latitude={item?.Farmer[0]?.latitude}
          />
       
        {!(item?.Stage[0]._id == "675be30222ae6f63bf772dd1" || item?.Stage[0]._id == "675be30222ae6f63bf772dd0" || item?.Stage[0]?._id == "675aaf9c44c74418017c1daf") && <TouchableOpacity
          onPress={() =>
            {console.log('complaint id from showComplaint page', item?._id)
              navigation.navigate('ShowComplaintData', {
              complaintId: item?._id,
              farmerName: item?.Farmer[0]?.farmerName,
              farmerContact: item?.Farmer[0]?.contact,
              village: item?.Farmer[0]?.village,
              saralId: item?.Farmer[0]?.saralId,
              pump_type: item?.Farmer[0]?.pump_type,
              HP: item?.Farmer[0]?.HP,
              AC_DC: item?.Farmer[0]?.AC_DC, 
              longitude2: item?.Farmer[0]?.longitude,
              latitude2: item?.Farmer[0]?.latitude
            }); setLoading(true)
          }
          }>
          <Text style={styles.approvedText}>Fill Form</Text>
        </TouchableOpacity>}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Tracking ID:</Text> {item.trackingId}
        </Text>
        {item?.Stage[0]?._id === "675be30222ae6f63bf772dcf" && <Text style={{ color: 'red' }}>Pending</Text>}
        {item?.Stage[0]?._id === "675be30222ae6f63bf772dd1" && <Text style={{ color: 'red'}}>Rejected</Text>}
        {item?.Stage[0]?._id === "675be30222ae6f63bf772dd0" && <Text style={{ color: 'rgb(0, 200, 0)'}}>Resolved</Text>}
      </View>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Contact:</Text> {item.contact}
      </Text>      
      <Text style={styles.infoText}>
        <Text style={styles.label}>Company:</Text> {item.company}
      </Text>     
      <Text style={styles.infoText}>
        <Text style={styles.label}>ComplaintDetails:</Text>{' '}
        {item.complaintDetails}
      </Text>
           
      <Text style={styles.infoText}>
        <Text style={styles.label}>Village:</Text>{' '}
        {item.Farmer[0].village}
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.label}>Block:</Text>{' '}
        {item.Farmer[0].block}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Created At:</Text>{' '}
        {new Date(item.created_At).toLocaleDateString()}
      </Text>

    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Complaints</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Village, Block, Farmer Name, Contact, Saral ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filterComplaints()}
        renderItem={renderComplaintItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No complaints found.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  },

    approvedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
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

  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default ShowComplaints;