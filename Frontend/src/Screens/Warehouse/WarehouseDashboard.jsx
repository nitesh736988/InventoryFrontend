import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import Sidebar from './Sidebar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WarehouseDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/warehouse-admin/dashboard`);
      console.log('Response data:', response.data);
      if (response.data?.warehouseData?.items) {
        setData(response.data.warehouseData.items);
      } else {
        console.log('No items found in warehouse data');
        setData([]);
      }
    } catch (error) {
      console.log('Error fetching data:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/logout`);
      if (response.data.success) {
        Alert.alert('Logout', 'You have logged out successfully');
        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{name: 'LoginPage'}],
        });
      } else {
        Alert.alert('Logout Failed', response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.log(
        'Error logging out:',
        error.message,
        error.response?.data || error,
      );
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      
      <View style={styles.header}>
      <Sidebar />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {data.length > 0 ? (
        data.map(({_id, itemName, quantity, defective, repaired, rejected}) => (
          <View key={_id} style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddData', {itemName: itemName })
              }>
              <Text
                style={{
                  ...styles.cardTitle,
                  color: '#000',
                  textDecorationLine: 'underline',
                }}>
                {itemName}
              </Text>
            </TouchableOpacity>
            <Text style={{...styles.cardDetails, color: '#000'}}>
              Stock: {quantity}
            </Text>

            <Text style={{...styles.cardDetails, color: '#000'}}>
             Defective: {defective}
            </Text>
            
            <Text style={{...styles.cardDetails, color: '#000'}}>
              Repaired: {repaired}
            </Text>
            <Text style={{...styles.cardDetails, color: '#000'}}>
              Rejected: {rejected}
            </Text>

            <TouchableOpacity
              style={styles.externalLinkIcon}
              onPress={() =>
                navigation.navigate('Stockdata', {
                  itemId: _id,
                  itemName,
                })
              }>
              <Icon name="external-link" size={20} color="blue" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No items found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  cardDetails: {
    fontSize: 14,
    marginTop: 5,
  },
  link: {
    textDecorationLine: 'underline',
  },
  defectiveHighlight: {
    color: 'red',
    fontWeight: 'bold',
  },
  externalLinkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default WarehouseDashboard;
