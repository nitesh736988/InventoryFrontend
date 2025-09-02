import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const QuaterData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchData = async () => {
    const serviceBlock = await AsyncStorage.getItem('block');
    const convertedData = JSON.parse(serviceBlock);
    const dataToSend = {
      block: convertedData,
    };
    try {
      if (!refreshing) setLoading(true);

      const response = await axios.post(
        `http://88.222.214.93:8001/filedService/quarterlyList`,
        dataToSend,
      );
      setData(response.data.data);
      setFilteredData(response.data.data); 

    } catch (error) {
       Alert.alert("Error", JSON.stringify(error.response.data?.message));
      // console.log(JSON.stringify(error.response));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(); 
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.farmerName.toLowerCase().includes(text.toLowerCase()) ||
        item.saralId?.toString().includes(text) ||
        item.contact?.toString().includes(text)||
         item.state.toLowerCase().includes(text.toLowerCase())||
         item.district.toLowerCase().includes(text.toLowerCase())||
         item.village.toLowerCase().includes(text.toLowerCase())||
         item.block.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
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
        {/* {item?.quarterlyVisit === false ? ( */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('QuarterlyVisit', {farmerId: item?._id, farmerName: item?.farmerName,saralId: item?.saralId})
            }>
            <Text style={styles.approvedText}>Fill Form</Text>
          </TouchableOpacity>
        {/* ) : ( */}
          {/* <Text style={[styles.approvedText, {color: 'green'}]}>Done</Text> */}
        {/* )} */}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 4,}}>
        <View>
          <Text style={styles.label}>Farmer Name:</Text>
        </View>
        <View style={styles.ellipse}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={{color: '#000'}}>
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
        <Text style={styles.label}>Village:</Text> {item.village}
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
        placeholder="Search by Farmer Name, Saral Id, Contact,State,District,Village,Block"
        value={searchText}
        onChangeText={handleSearch}
        placeholderTextColor='#000'
      />

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="blue" />
      ) : filteredData.length === 0 ? (
        <Text style={styles.noDataText}>No Data Available</Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}
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
    color: '#000',
    textAlign: 'center',
  },
  searchBar: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    borderColor: '#000',
    borderWidth: 1,

  },
  approvedText: {
    color: 'green',
    fontWeight: 'bold',
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
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});

export default QuaterData;


