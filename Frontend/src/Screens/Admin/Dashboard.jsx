import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { API_URL } from '@env';
import SidebarModal from './SidebarModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('Total Items');
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const navigation = useNavigation();

  const fetchDashboardData = async (retries = 3) => {
    setLoading(true);
    try {
      while (retries > 0) {
        try {
          const response = await axios.get(
            `${API_URL}/admin/dashboard?option=${selectedWarehouse}`
          );
          setResponseData(response.data.data || []);
          break;
        } catch (error) {
          console.log(
            'Error fetching dashboard data:',
            error.message,
            error.response?.data || error
          );
          retries -= 1;
          if (retries === 0) {
            throw error;
          }
        }
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'There was an issue fetching data. Please try again later.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false); 
      setIsRefreshClicked(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/all-warehouses`);
      if (response.data.success) {
        setAllWarehouses(response.data.allWarehouses);
      } else {
        setAllWarehouses([]);
      }
    } catch (error) {
      console.log(
        'Error fetching warehouse names:',
        error.message,
        error.response?.data || error
      );
      setAllWarehouses([]);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedWarehouse, isRefreshClicked]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/logout`);
      if (response.data.success) {
        Alert.alert('Logout', 'You have logged out successfully');
        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginPage' }],
        });
      } else {
        Alert.alert('Logout Failed', response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.log(
        'Error logging out:',
        error.message,
        error.response?.data || error
      );
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <SidebarModal />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Picker
        selectedValue={selectedWarehouse}
        style={styles.picker}
        onValueChange={(value) => setSelectedWarehouse(value)}
      >
        <Picker.Item label="Total Items" value="Total Items" style= {{color: '#000'}}/>
        {allWarehouses.map((warehouse) => (
          <Picker.Item
            key={warehouse._id}
            label={warehouse.warehouseName}
            value={warehouse.warehouseName}
          />
        ))}
      </Picker>
      {responseData.length > 0 ? (
        <FlatList
          data={responseData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.itemName}</Text>
                <Text style={styles.cardDetails}>
                  Stock:{' '}
                  {selectedWarehouse === 'Total Items'
                    ? item.stock
                    : item.quantity}
                </Text>
                <Text style={styles.cardDetails}>Defective: {item.defective}</Text>
                <Text style={styles.cardDetails}>Repaired: {item.repaired}</Text>
                <Text style={styles.cardDetails}>Rejected: {item.rejected}</Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh} 
        />
      ) : (
        <Text style={styles.noDataText}>
          No items found for the selected warehouse.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#fbd33b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 10,
  },
  logoutButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
  },

  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: width * 0.04,
    marginVertical: width * 0.03,
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
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#070604',
  },
  cardDetails: {
    fontSize: width * 0.04,
    color: '#333',
    marginTop: 5,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: width * 0.045,
    color: '#555',
    marginVertical: 20,
  },
});

export default Dashboard;
