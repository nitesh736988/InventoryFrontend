import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import axios from 'axios';
import { API_URL } from '@env';

const ServicePersonDashboard = () => {
  const [servicePersons, setServicePersons] = useState([]);
  const [servicePersonOutgoing, setServicePersonOutging] = useState([]);
  const [ selectedItem, setSelectedItem ] = useState('');
  const [selectedServicePerson, setSelectedServicePerson] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [ isRefreshClicked, setIsRefreshClicked ] = useState(false);

  const fetchServicePersons = async () => {
    try {
      const response = await axios.get(`${API_URL}/service-person/dashboard`);
      
      // console.log(response.status);

      if(response.status === 200){
        console.log("Collective Data", response.data.mergedData);
        console.log("Type Value", response.data.mergedData[0]?.type);
        // const incommingData = response.data.mergedData[0]?.items;
        if(response.data.mergedData[0]?.type === 'incoming'){
          setServicePersons(response.data.mergedData[0].items);
          console.log("Incoming Data", response.data.mergedData[0].items);
        }
        if(response.data.mergedData[0]?.type === 'outgoing'){
          console.log("Hello Outgoing");
          setServicePersonOutging(response.data.mergedData[0].items);
          console.log("Outgoing Data", response.data.mergedData[0].items);
        }

        if(response.data?.mergedData[1]?.type === 'incoming'){
          setServicePersons(response.data.mergedData[1].items);
          console.log("Incoming Data", response.data.mergedData[1].items);
        }
        if(response.data?.mergedData[1]?.type === 'outgoing'){
          setServicePersonOutging(response.data.mergedData[1]?.items);
          console.log("Incoming Data", response.data.mergedData[1].items);
        }

        // console.log("Incoming Data", servicePersons);
        // console.log("Outcoming Data", servicePersonOutgoing);
        // const outgoingData = response.data.mergedData[1]?.items;
        // console.log("Icoming Data", incommingData);
        // console.log('outgoingData', outgoingData);
        // setServicePersons(incommingData);
        // setServicePersonOutging(outgoingData);
      }
      // if (response.status === 200) {
      //   // setServicePersons(response.data.data.items);
      //   // Alert.alert("Response", JSON.stringify(response.data.mergedData.data));
      // } else if (response.data.servicePersons) {
      //   setServicePersons(response.data.data.items);
      // } else {
      //   console.log('Unexpected API response structure:', response.data);
      // }
    } catch (error) {
      Alert.alert(error);
      console.log('Error fetching service persons:', error);
    } finally{
      setIsRefreshClicked(false);
    }
  };

  useEffect(() => {
    fetchServicePersons();
  }, []);

  useEffect(() => {
    fetchServicePersons();
  }, [isRefreshClicked])

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
          onPress={() => {
            setIsRefreshClicked(true);
          }}>
          <Icon name="refresh" size={30} color="black" />
      </TouchableOpacity>
      {/* <Text style={{ color: 'black', fontSize: 22 }}>Service Person Transaction Detail</Text> */}
      <Text style={{ color: '#fbd33b', fontSize: 28 }}>Incoming Items</Text>
      {servicePersons ? renderItems(servicePersons) : <Text>No Data of Incoming</Text>}
      <Text style={{ color: '#fbd33b', fontSize: 28 }}>Outgoing Items</Text>
      {servicePersonOutgoing ? renderItems(servicePersonOutgoing) : <Text>No Data of Outgoing</Text>}


      {/* {selectedServicePerson && (
        <View style={styles.transactionsSection}>
          <Text style={styles.title}>Transactions for {selectedServicePerson.name}</Text>

          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No transactions found.</Text>}
          />
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  personButton: {
    backgroundColor: '#070604',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
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
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#888',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  deleteIcon: {
    padding: 10,
  },
  personText: {
    color: '#fbd33b',
    fontSize: 16,
  },
  transactionsSection: {
    marginTop: 20,
  },
  transactionContainer: {
    padding: 10,
    backgroundColor: '#fbd33b',
    borderRadius: 5,
    marginVertical: 5,
  },
  transactionText: {
    fontSize: 14,
    color: '#070604',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusButton: {
    backgroundColor: '#070604',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#fbd33b',
    fontSize: 16,
  },
});

export default ServicePersonDashboard;


// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
// import axios from 'axios';
// import { API_URL } from '@env';

// const ServicePersonDashboard = () => {
//   const [servicePersons, setServicePersons] = useState(null);
//   const [servicePersonOutgoing, setServicePersonOutgoing] = useState(null);
//   const [viewIncoming, setViewIncoming] = useState(true);

//   const fetchServicePersons = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/service-person/dashboard`);
//       if(response.status === 200){
//         const incommingData = response.data.mergedData[0].items;
//         const outgoingData = response.data.mergedData[1].items;
//         setServicePersons(incommingData);
//         setServicePersonOutgoing(outgoingData);
//       }
//     } catch (error) {
//       console.log('Error fetching service persons:', error);
//     }
//   };

//   useEffect(() => {
//     fetchServicePersons();
//   }, []);

//   const renderItems = (items) => (
//     items.map(({ itemName, quantity }, index) => (
//       <View key={index} style={styles.card}>
//         <Text style={styles.cardTitle}>{itemName}</Text>
//         <Text style={styles.cardValue}>{quantity ? quantity : 0}</Text>
//       </View>
//     ))
//   );

//   return (
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Service Person Transaction Detail</Text>

//         <View style={styles.toggleContainer}>
//           <TouchableOpacity
//             style={[styles.toggleButton, viewIncoming ? styles.activeButton : styles.inactiveButton]}
//             onPress={() => setViewIncoming(true)}
//           >
//             <Text style={viewIncoming ? styles.activeButtonText : styles.inactiveButtonText}>Incoming</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.toggleButton, !viewIncoming ? styles.activeButton : styles.inactiveButton]}
//             onPress={() => setViewIncoming(false)}
//           >
//             <Text style={!viewIncoming ? styles.activeButtonText : styles.inactiveButtonText}>Outgoing</Text>
//           </TouchableOpacity>
//         </View>

//         {viewIncoming ? (
//           servicePersons && renderItems(servicePersons)
//         ) : (
//           servicePersonOutgoing && renderItems(servicePersonOutgoing)
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// const { width } = Dimensions.get('window');
// const isSmallScreen = width < 375;

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: isSmallScreen ? 18 : 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//     textAlign: 'center',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   toggleButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginHorizontal: 10,
//   },
//   activeButton: {
//     backgroundColor: '#fbd33b', 
//   },
//   inactiveButton: {
//     backgroundColor: '#ccc',
//   },
//   activeButtonText: {
//     color: '#070604', // Dark color for contrast
//     fontWeight: 'bold',
//   },
//   inactiveButtonText: {
//     color: '#333',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: isSmallScreen ? 15 : 20,
//     marginVertical: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: isSmallScreen ? 14 : 16,
//     color: '#555',
//   },
//   cardValue: {
//     fontSize: isSmallScreen ? 24 : 32,
//     fontWeight: 'bold',
//     color: '#333',
//   },
// });

// export default ServicePersonDashboard;


// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
// import axios from 'axios';
// import { API_URL } from '@env';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const ServicePersonDashboard = () => {
//   const [servicePersons, setServicePersons] = useState(undefined);
//   const [servicePersonOutgoing, setServicePersonOutgoing] = useState(undefined);
//   const [viewIncoming, setViewIncoming] = useState(true);
//   const [isRefreshClicked, setIsRefreshClicked] = useState(false);

//   const fetchServicePersons = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/service-person/dashboard`);
//       if (response.status === 200) {
//         console.log(response.data.mergedData);
//         const incomingData = response.data.mergedData[0]?.items;
//         const outgoingData = response.data.mergedData[1]?.items;
//         console.log("InComing Data", incomingData);
//         console.log("Outgoing Data", outgoingData);
//         setServicePersons(incomingData);
//         outgoingData && setServicePersonOutgoing(outgoingData);
//       }
//     } catch (error) {
//       console.log('Error fetching service persons:', error);
//     } finally {
//       setIsRefreshClicked(false); // Reset refresh state after fetch
//     }
//   };

//   useEffect(() => {
//     fetchServicePersons();
//   }, []);

//   useEffect(() => {
//     if (isRefreshClicked) {
//       fetchServicePersons();
//     }
//   }, [isRefreshClicked]);

//   const renderItems = (items) => (
//     items !== undefined && items.map(({ itemName, quantity }, index) => (
//       <View key={index} style={styles.card}>
//         <Text style={styles.cardTitle}>{itemName}</Text>
//         <Text style={styles.cardValue}>{quantity ? quantity : 0}</Text>
//       </View>
//     ))
//   );

//   return (
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Service Person Transaction Detail</Text>

//         <View style={styles.toggleContainer}>
//           <TouchableOpacity
//             style={[styles.toggleButton, viewIncoming ? styles.activeButton : styles.inactiveButton]}
//             onPress={() => setViewIncoming(true)}
//           >
//             <Text style={viewIncoming ? styles.activeButtonText : styles.inactiveButtonText}>Incoming</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.toggleButton, !viewIncoming ? styles.activeButton : styles.inactiveButton]}
//             onPress={() => setViewIncoming(false)}
//           >
//             <Text style={!viewIncoming ? styles.activeButtonText : styles.inactiveButtonText}>Outgoing</Text>
//           </TouchableOpacity>
//         </View>

//         {viewIncoming && servicePersons !== undefined && renderItems(servicePersons) }
//         { !viewIncoming && servicePersonOutgoing !== undefined && renderItems(servicePersonOutgoing) }
//       </View>

//       <TouchableOpacity
//         style={{ position: 'absolute', bottom: -320, right: 40 }}
//         onPress={() => {
//           setIsRefreshClicked(true);
//         }}
//       >
//         <Icon name="refresh" size={30} color="black" />
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const { width } = Dimensions.get('window');
// const isSmallScreen = width < 375;

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: isSmallScreen ? 18 : 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//     textAlign: 'center',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   toggleButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginHorizontal: 10,
//   },
//   activeButton: {
//     backgroundColor: '#fbd33b', 
//   },
//   inactiveButton: {
//     backgroundColor: '#ccc',
//   },
//   activeButtonText: {
//     color: '#070604', // Dark color for contrast
//     fontWeight: 'bold',
//   },
//   inactiveButtonText: {
//     color: '#333',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: isSmallScreen ? 15 : 20,
//     marginVertical: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: isSmallScreen ? 14 : 16,
//     color: '#555',
//   },
//   cardValue: {
//     fontSize: isSmallScreen ? 24 : 32,
//     fontWeight: 'bold',
//     color: '#333',
//   },
// });

// export default ServicePersonDashboard;
