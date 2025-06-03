// import { View, Text, StyleSheet, FlatList } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const NewInstallationTransactionData = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get('http://88.222.214.93:5000/warehouse-admin/new-installation-data');
//       setData(response.data.data);
//     } catch (error) {
//       console.log('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.statusBox}>
//         <Text style={{ fontWeight: 'bold' }}>
//           Status:{' '}
//           {item.accept ? (
//             item.installationDone ? (
//               <Text style={{ color: 'green' }}>Approved - Installation Complete</Text>
//             ) : (
//               <Text style={{ color: 'orange' }}>Approved - Not Installed</Text>
//             )
//           ) : (
//             <Text style={{ color: 'red' }}>Pending Approve</Text>
//           )}
//         </Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Farmer Information</Text>
//         <Text>Name: {item.farmerDetails?.farmerName || 'N/A'}</Text>
//         <Text>Saral ID: {item.farmerSaralId}</Text>
//         <Text>Contact: {item.farmerDetails?.contact || 'N/A'}</Text>
//         <Text>Village: {item.farmerDetails?.village || 'N/A'}</Text>
//         <Text>District: {item.farmerDetails?.district || 'N/A'}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Service Person</Text>
//         <Text>Name: {item.empId?.name || 'N/A'}</Text>
//         <Text>Contact: {item.empId?.contact || 'N/A'}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Equipment Details</Text>
//         <Text>Pump Number: {item.pumpNumber || 'N/A'}</Text>
//         <Text>Controller Number: {item.controllerNumber || 'N/A'}</Text>
//         <Text>RMU Number: {item.rmuNumber || 'N/A'}</Text>
//       </View>

//       {item.panelNumbers?.length > 0 && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Panel Numbers</Text>
//           {item.panelNumbers.map((panel, index) => (
//             <Text key={index}>{panel}</Text>
//           ))}
//         </View>
//       )}

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Items List</Text>
//         {item.itemsList.map((listItem, index) => (
//           <Text key={index}>
//             {listItem.systemItemId.itemName}: {listItem.quantity}
//           </Text>
//         ))}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Sending Date</Text>
//         <Text>{new Date(item.sendingDate).toLocaleDateString()}</Text>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (data.length === 0) {
//     return (
//       <View style={styles.noData}>
//         <Text>No installation data available</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>New Installation Transactions</Text>
//       <FlatList
//         data={data}
//         keyExtractor={(item) => item._id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContent}
//         ListHeaderComponent={<View style={{ height: 10 }} />}
//         ListFooterComponent={<View style={{ height: 20 }} />}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 50,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   noData: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   listContent: {
//     paddingHorizontal: 15,
//     paddingBottom: 20,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statusBox: {
//     marginBottom: 10,
//     padding: 8,
//     backgroundColor: '#eef',
//     borderRadius: 5,
//   },
//   section: {
//     marginBottom: 15,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   sectionTitle: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#555',
//   },
// });

// export default NewInstallationTransactionData;


import { View, Text, StyleSheet, FlatList,Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {API_URL} from '@env';

const NewInstallationTransactionData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/warehouse-admin/new-installation-data`);
      console.log('Fetched data:', response.data);
      setData(response.data.data);
    } catch (error) {
      console.log('Error fetching data:', error?.response?.data?.message);
      Alert.alert('Error fetching data1:', error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(
      data.filter((item) => {
      const searchText = search.toLowerCase();
      return (
        (item.farmerSaralId || '').toLowerCase().includes(searchText) ||
        (item.farmerDetails?.farmerName || '').toLowerCase().includes(searchText) ||
        (item.farmerDetails?.contact || '').toLowerCase().includes(searchText) ||
        (item.farmerDetails?.village || '').toLowerCase().includes(searchText) ||
        (item.farmerDetails?.district || '').toLowerCase().includes(searchText)
      );
      })
    );
  }, [search, data]);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.statusBox}>
        <Text style={{ fontWeight: 'bold' }}>
          Status:{' '}
          {item.accepted ? (
            item.installationDone ? (
              <Text style={{ color: 'green' }}>Approved - Installation Complete</Text>
            ) : (
              <Text style={{ color: 'orange' }}>Approved - Not Installed</Text>
            )
          ) : (
            <Text style={{ color: 'red' }}>Pending Approval</Text>
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Farmer Information</Text>
        <Text>Name: {item.farmerDetails?.farmerName || 'N/A'}</Text>
        <Text>Saral ID: {item.farmerSaralId || 'N/A'}</Text>
        <Text>Contact: {item.farmerDetails?.contact || 'N/A'}</Text>
        <Text>Village: {item.farmerDetails?.village || 'N/A'}</Text>
        <Text>District: {item.farmerDetails?.district || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Person</Text>
        <Text>Name: {item.empId?.name || 'N/A'}</Text>
        <Text>Contact: {item.empId?.contact || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipment Details</Text>
        <Text>Pump Number: {item.pumpNumber || 'N/A'}</Text>
        <Text>Controller Number: {item.controllerNumber || 'N/A'}</Text>
        <Text>RMU Number: {item.rmuNumber || 'N/A'}</Text>
      </View>

      {item.panelNumbers?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Panel Numbers</Text>
          {item.panelNumbers.map((panel, index) => (
            <Text key={index}>{panel || 'N/A'}</Text>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items List</Text>
        {item.itemsList?.map((listItem, index) => (
          <Text key={index}>
            {listItem.systemItemId?.itemName || 'Unknown Item'}: {listItem.quantity || 0}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sending Date</Text>
        <Text>{formatDate(item.sendingDate)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.noData}>
        <Text>No installation data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Installation Transactions</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<View style={{ height: 10 }} />}
        ListFooterComponent={<View style={{ height: 20 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBox: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#eef',
    borderRadius: 5,
  },
  section: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
});

export default NewInstallationTransactionData;