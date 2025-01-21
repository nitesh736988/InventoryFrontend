// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import {useNavigation} from '@react-navigation/native';

// const QuaterData = () => {
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(20);
//   const [loading, setLoading] = useState(false);
//   const navigation = useNavigation();

//   const fetchData = async (pageNum = page) => {
//     const serviceBlock = await AsyncStorage.getItem('block');
//     const convertedData = JSON.parse(serviceBlock);
//     const dataToSend = {
//       block: convertedData,
//       page: pageNum,
//       limit,
//     };
//     // console.log(convertedData);
//     console.log('data', dataToSend);
//     try {
//       setLoading(true);

//       const response = await axios.post(
//         `http://88.222.214.93:8001/filedService/quarterlyList`,
//         dataToSend,
//       );
//       // console.log("data reponse", response.data.data);
//       setData(response.data.data);
//       setPage(pageNum);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch data');
//       console.log(JSON.stringify(error.response));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNextPage = () => {
//     fetchData(page + 1);
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) {
//       fetchData(page - 1);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const renderItem = ({item}) => (
//     <View style={styles.dataItem}>
//       <View
//         style={{
//           ...styles.dataText,
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}>
//         <Text style={styles.label}>Saral ID: {item.saralId}</Text>
//         {item?.quarterlyVisit === false ? (
//           <TouchableOpacity
//             onPress={() =>
//               navigation.navigate('QuarterlyVisit', {farmerId: item?._id})
//             }>
//             <Text style={styles.approvedText}>Fill Form</Text>
//           </TouchableOpacity>
//         ) : (
//           <Text style={[styles.approvedText, {color: 'green'}]}>Done</Text>
//         )}
//       </View>
//       <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
//         <View>
//           <Text style={styles.label}>Farmer Name:</Text>
//         </View>
//         <View style={styles.ellipse}>
//           <Text numberOfLines={1} ellipsizeMode="tail">
//             {item.farmerName}
//           </Text>
//         </View>
//       </View>
//       <Text style={styles.dataText}>
//         <Text style={styles.label}>Contact:</Text> {item.contact}
//       </Text>
//       <Text style={styles.dataText}>
//         <Text style={styles.label}>State:</Text> {item.state}
//       </Text>
//       <Text style={styles.dataText}>
//         <Text style={styles.label}>District:</Text> {item.district}
//       </Text>
//       <Text style={styles.dataText}>
//         <Text style={styles.label}>Block:</Text> {item.block}
//       </Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Quarterly Data:</Text>

//       {loading ? (
//         <Text>Loading...</Text>
//       ) : (
//         <FlatList
//           data={data}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={renderItem}
//         />
//       )}

//       <View style={styles.pagination}>
//         <TouchableOpacity
//           onPress={handlePreviousPage}
//           style={[styles.pageButton, page === 1 && styles.disabledButton]}
//           disabled={page === 1}>
//           <Text style={styles.buttonText}>Previous</Text>
//         </TouchableOpacity>
//         <Text style={styles.pageInfo}>Page: {page}</Text>
//         <TouchableOpacity onPress={handleNextPage} style={styles.pageButton}>
//           <Text style={styles.buttonText}>Next</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fbd33b',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },

//   approvedText: {
//     color: 'green',
//     fontWeight: 'bold',
//   },

//   ellipse: {
//     width: 100,
//   },

//   dataItem: {
//     padding: 15,
//     backgroundColor: '#fff',
//     marginVertical: 8,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: {width: 0, height: 2},
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   dataText: {
//     fontSize: 14,
//     marginVertical: 2,
//     color: '#444',
//   },
//   pagination: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   pageButton: {
//     padding: 10,
//     backgroundColor: '#007bff',
//     borderRadius: 5,
//   },
//   disabledButton: {
//     backgroundColor: '#ccc',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   pageInfo: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default QuaterData;


import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const QuaterData = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const fetchData = async (pageNum = page, filterText = searchText) => {
    const serviceBlock = await AsyncStorage.getItem('block');
    const convertedData = JSON.parse(serviceBlock);
    const dataToSend = {
      block: convertedData,
      page: pageNum,
      limit,
      search: filterText,
    };

    try {
      if (!refreshing) setLoading(true);

      const response = await axios.post(`http://88.222.214.93:8001/filedService/quarterlyList`,dataToSend);
      setData(response.data.data);
      setPage(pageNum);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data');
      console.log(JSON.stringify(error.response));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleNextPage = () => {
    fetchData(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      fetchData(page - 1);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(1);
  };

  const handleSearch = async (text) => {
    setSearchText(text);
    await fetchData(1, text);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.dataItem}>
      <View
        style={{
          ...styles.dataText,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.label}>Saral ID: {item.saralId}</Text>
        {item?.quarterlyVisit === false ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('QuarterlyVisit', {farmerId: item?._id})
            }>
            <Text style={styles.approvedText}>Fill Form</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.approvedText, {color: 'green'}]}>Done</Text>
        )}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
        <View>
          <Text style={styles.label}>Farmer Name:</Text>
        </View>
        <View style={styles.ellipse}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {item.farmerName}
          </Text>
        </View>
      </View>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Contact:</Text> {item.contact}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>State:</Text> {item.state}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>District:</Text> {item.district}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Block:</Text> {item.block}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>QUARTERLY DATA</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search by farmer name or Saral ID"
        value={searchText}
        onChangeText={handleSearch}
      />

      {loading && !refreshing ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}

      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          style={[styles.pageButton, page === 1 && styles.disabledButton]}
          disabled={page === 1}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>Page: {page}</Text>
        <TouchableOpacity onPress={handleNextPage} style={styles.pageButton}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign:'center'
  },
  approvedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  searchBar: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  ellipse: {
    width: 100,
  },
  dataItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  dataText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#444',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuaterData;
