// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome'; 
// import axios from 'axios';
// import { API_URL } from '@env';

// const ServicePersonDashboard = () => {
//   const [servicePersons, setServicePersons] = useState([]);
//   const [servicePersonOutgoing, setServicePersonOutging] = useState([]);
//   const [ selectedItem, setSelectedItem ] = useState('');
//   const [selectedServicePerson, setSelectedServicePerson] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [ isRefreshClicked, setIsRefreshClicked ] = useState(false);

//   const fetchServicePersons = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/service-person/dashboard`);
      
//       // console.log(response.status);

//       if(response.status === 200){
//         console.log("Collective Data", response.data.mergedData);
//         console.log("Type Value", response.data.mergedData[0]?.type);
//         // const incommingData = response.data.mergedData[0]?.items;
//         if(response.data.mergedData[0]?.type === 'incoming'){
//           setServicePersons(response.data.mergedData[0].items);
//           console.log("Incoming Data", response.data.mergedData[0].items);
//         }
//         if(response.data.mergedData[0]?.type === 'outgoing'){
//           console.log("Hello Outgoing");
//           setServicePersonOutging(response.data.mergedData[0].items);
//           console.log("Outgoing Data", response.data.mergedData[0].items);
//         }

//         if(response.data?.mergedData[1]?.type === 'incoming'){
//           setServicePersons(response.data.mergedData[1].items);
//           console.log("Incoming Data", response.data.mergedData[1].items);
//         }
//         if(response.data?.mergedData[1]?.type === 'outgoing'){
//           setServicePersonOutging(response.data.mergedData[1]?.items);
//           console.log("Incoming Data", response.data.mergedData[1].items);
//         }

//         // console.log("Incoming Data", servicePersons);
//         // console.log("Outcoming Data", servicePersonOutgoing);
//         // const outgoingData = response.data.mergedData[1]?.items;
//         // console.log("Icoming Data", incommingData);
//         // console.log('outgoingData', outgoingData);
//         // setServicePersons(incommingData);
//         // setServicePersonOutging(outgoingData);
//       }
//       // if (response.status === 200) {
//       //   // setServicePersons(response.data.data.items);
//       //   // Alert.alert("Response", JSON.stringify(response.data.mergedData.data));
//       // } else if (response.data.servicePersons) {
//       //   setServicePersons(response.data.data.items);
//       // } else {
//       //   console.log('Unexpected API response structure:', response.data);
//       // }
//     } catch (error) {
//       Alert.alert(error);
//       console.log('Error fetching service persons:', error);
//     } finally{
//       setIsRefreshClicked(false);
//     }
//   };

//   useEffect(() => {
//     fetchServicePersons();
//   }, []);

//   useEffect(() => {
//     fetchServicePersons();
//   }, [isRefreshClicked])

//   const renderItems = (items) => (
//     items.map(({ itemName, quantity }, index) => (
//       <View key={index} style={styles.card}>
//         <Text style={styles.cardTitle}>{itemName}</Text>
//         <Text style={styles.cardValue}>{quantity ? quantity : 0}</Text>
//       </View>
//     ))
//   );

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//           style={{ position: 'absolute', top: 24, right: 40, zIndex: 999 }}
//           onPress={() => {
//             setIsRefreshClicked(true);
//           }}>
//           <Icon name="refresh" size={30} color="black" />
//       </TouchableOpacity>
//       {/* <Text style={{ color: 'black', fontSize: 22 }}>Service Person Transaction Detail</Text> */}
//       <Text style={{ color: '#fbd33b', fontSize: 28 }}>Incoming Items</Text>
//       {servicePersons ? renderItems(servicePersons) : <Text>No Data of Incoming</Text>}
//       <Text style={{ color: '#fbd33b', fontSize: 28 }}>Outgoing Items</Text>
//       {servicePersonOutgoing ? renderItems(servicePersonOutgoing) : <Text>No Data of Outgoing</Text>}


//       {/* {selectedServicePerson && (
//         <View style={styles.transactionsSection}>
//           <Text style={styles.title}>Transactions for {selectedServicePerson.name}</Text>

//           <FlatList
//             data={transactions}
//             renderItem={renderTransaction}
//             keyExtractor={(item) => item.id.toString()}
//             ListEmptyComponent={<Text>No transactions found.</Text>}
//           />
//         </View>
//       )} */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   personButton: {
//     backgroundColor: '#070604',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 5,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     marginVertical: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     position: 'relative',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   cardContent: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 16,
//     color: '#888',
//   },
//   cardValue: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#000',
//     marginTop: 5,
//   },
//   deleteIcon: {
//     padding: 10,
//   },
//   personText: {
//     color: '#fbd33b',
//     fontSize: 16,
//   },
//   transactionsSection: {
//     marginTop: 20,
//   },
//   transactionContainer: {
//     padding: 10,
//     backgroundColor: '#fbd33b',
//     borderRadius: 5,
//     marginVertical: 5,
//   },
//   transactionText: {
//     fontSize: 14,
//     color: '#070604',
//   },
//   statusButtonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   statusButton: {
//     backgroundColor: '#070604',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   statusButtonText: {
//     color: '#fbd33b',
//     fontSize: 16,
//   },
// });

// export default ServicePersonDashboard;



import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import axios from 'axios';
import { API_URL } from '@env';

const ServicePersonDashboard = () => {
  const [servicePersons, setServicePersons] = useState([]);
  const [servicePersonOutgoing, setServicePersonOutging] = useState([]);
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);

  const fetchServicePersons = async () => {
    try {
      const response = await axios.get(`${API_URL}/service-person/dashboard`);
      if(response.status === 200){
        if(response.data.mergedData[0]?.type === 'incoming'){
          setServicePersons(response.data.mergedData[0].items);
        }
        if(response.data.mergedData[0]?.type === 'outgoing'){
          setServicePersonOutging(response.data.mergedData[0].items);
        }
        if(response.data.mergedData[1]?.type === 'incoming'){
          setServicePersons(response.data.mergedData[1].items);
        }
        if(response.data.mergedData[1]?.type === 'outgoing'){
          setServicePersonOutging(response.data.mergedData[1]?.items);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Error fetching service persons');
      console.log('Error fetching service persons:', error);
    } finally {
      setIsRefreshClicked(false);
    }
  };

  useEffect(() => {
    fetchServicePersons();
  }, []);

  useEffect(() => {
    if (isRefreshClicked) {
      fetchServicePersons();
    }
  }, [isRefreshClicked]);

  const renderItems = (items) => (
    items.map(({ itemName, quantity }, index) => (
      <View key={index} style={styles.card}>
        <Text style={styles.cardTitle}>{itemName}</Text>
        <Text style={styles.cardValue}>{quantity ? quantity : 0}</Text>
      </View>
    ))
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 24, right: 40, zIndex: 999 }}
        onPress={() => setIsRefreshClicked(true)}>
        <Icon name="refresh" size={30} color="black" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>Incoming Items</Text>
        {servicePersons.length > 0 ? renderItems(servicePersons) : <Text>No Data of Incoming</Text>}
        
        <Text style={styles.sectionTitle}>Outgoing Items</Text>
        {servicePersonOutgoing.length > 0 ? renderItems(servicePersonOutgoing) : <Text>No Data of Outgoing</Text>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    color: '#fbd33b',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
});

export default ServicePersonDashboard;
