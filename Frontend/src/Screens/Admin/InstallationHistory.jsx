import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';

const InstallationHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/all-installations-data`);
      setOrders(response.data.data || []);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch orders');
      console.log('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const filterOrders = () => {
    return orders.filter(
      order =>
        order.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderOrderItem = ({item}) => (
    <View key={item._id} style={styles.card}>
      <Text style={styles.infoText}>Farmer Name: {item.farmerName}</Text>
      <Text style={styles.infoText}>Farmer Contact: {item.farmerContact}</Text>
      <Text style={styles.infoText}>Village Name: {item.farmerVillage}</Text>

      <View style={styles.itemContainer}>
      <Text style={styles.infoText}>
        Product: {' '}</Text>
        {item.items.map(({_id, itemName, quantity}) => (
          <Text key={_id} style={styles.infoText}>
            {itemName}: {quantity}
          </Text>
          
        ))}
      </View>
      <Text style={styles.infoText}>Serial Number: {item.serialNumber}</Text>
      <Text style={styles.infoText}>Longitude: {item.longitude}</Text>
      <Text style={styles.infoText}>Latitude: {item.latitude}</Text>
        <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
            <Image source={{ uri: item?.photos[0]}} style={{ width:  100, height: 100 }}/>
            {item?.photos[1] && <Image source={{ uri: item?.photos[1]}} style={{ width:  100, height: 100 }}/>}
            {item?.photos[2] && <Image source={{ uri: item?.photos[2]}} style={{ width:  100, height: 100 }}/>}
            {item?.photos[3] && <Image source={{ uri: item?.photos[3]}} style={{ width:  100, height: 100 }}/>}
        </View>
      <Text style={styles.infoText}>Installation Date: {formatDate(item.installationDate)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Installation Data</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Farmer Name or Serial Number"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={'#000'}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={filterOrders()}
          renderItem={renderOrderItem}
          keyExtractor={item => item._id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions found.</Text>
          }
        />
      )}
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
    color: 'black'
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
  },
  infoText: {
    color: '#000',
    marginBottom: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default InstallationHistory;
