import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { API_URL } from '@env';


const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('Total Items');
  const [allWarehouses, setAllWarehouses] = useState([]);        
  const [ responseData, setResponseData ] = useState([]);      

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const response = await axios.get(`${API_URL}/admin/dashboard?option=${selectedWarehouse}`);
        console.log(selectedWarehouse,response.data.data)
        setResponseData(response.data.data || []); 
      } catch (error) {
        console.log('Error fetching data:', error.response);
        Alert.alert('Error', 'There was an issue fetching data. Please try again later.');
      } finally {
        setLoading(false);
        setIsRefreshClicked(false);
      }
    };

    fetchData();
  }, [selectedWarehouse, isRefreshClicked]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/all-warehouses`);
        if (response.data.success) {
          setAllWarehouses(response.data.allWarehouses);
        } else {
          setAllWarehouses([]);
        }
      } catch (error) {
        console.log('Failed to fetch warehouse names:', error);
        setAllWarehouses([]);
      }
    };

    fetchWarehouses();
  }, []);

 

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
     
      <Picker
        selectedValue={selectedWarehouse}
        style={styles.picker}
        onValueChange={(value) => setSelectedWarehouse(value)}
      >
        <Picker.Item label="Total Items" value="Total Items" />
        {allWarehouses.map((warehouse) => (
          <Picker.Item
            key={warehouse._id}
            label={warehouse.warehouseName}
            value={warehouse.warehouseName}
          />
        ))}
      </Picker>

      <TouchableOpacity
        style={styles.refreshIcon}
        onPress={() => setIsRefreshClicked(true)}
      >
        <Icon name="refresh" size={30} color="black" />
      </TouchableOpacity>

      {responseData.length > 0 ? (
        <>
          {/* <Text style={styles.sectionTitle}>Items for {selectedWarehouse}</Text> */}
          <FlatList
            data={responseData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.itemName}</Text>
                  <Text style={styles.cardDetails}>Stock: {selectedWarehouse === "Total Items" ? item.stock : item.quantity}</Text>
                  <Text style={styles.cardDetails}>Defective: {item.defective}</Text>
                  <Text style={styles.cardDetails}>Repaired: {item.repaired}</Text>
                  <Text style={styles.cardDetails}>Rejected: {item.rejected}</Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <Text style={styles.noDataText}>No items found for the selected warehouse.</Text>
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
  refreshIcon: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#070604',
  },
  cardDetails: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginVertical: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#070604',
    marginVertical: 10,
  },
});

export default Dashboard;


