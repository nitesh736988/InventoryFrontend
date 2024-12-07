import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';

const {width} = Dimensions.get('window');

const ServicePersonDashboard = ({navigation}) => {
  const [servicePersons, setServicePersons] = useState([]);
  const [servicePersonOutgoing, setServicePersonOutgoing] = useState([]);
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);

  const fetchServicePersons = async () => {
    try {
      const response = await axios.get(`${API_URL}/service-person/dashboard`);
      if (response.status === 200 && response.data.mergedData) {
        const incoming = response.data.mergedData.filter(
          item => item.type === 'incoming',
        );
        const outgoing = response.data.mergedData.filter(
          item => item.type === 'outgoing',
        );
        setServicePersons(incoming[0]?.items || []);
        setServicePersonOutgoing(outgoing[0]?.items || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Error fetching service persons');
      console.log('Error fetching service persons:', error);
    } finally {
      setIsRefreshClicked(false);
    }
  };

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

  useEffect(() => {
    fetchServicePersons();
  }, []);

  useEffect(() => {
    if (isRefreshClicked) {
      fetchServicePersons();
    }
  }, [isRefreshClicked]);

  const renderItems = useMemo(
    () => items =>
      items.length > 0 ? (
        items.map(({itemName, quantity}, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{itemName}</Text>
            <Text style={styles.cardValue}>{quantity || 0}</Text>
          </View>
        ))
      ) : (
        <Text>No Data Available</Text>
      ),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>Incoming Items</Text>
        {renderItems(servicePersons)}

        <Text style={styles.sectionTitle}>Outgoing Items</Text>
        {renderItems(servicePersonOutgoing)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.02,
    marginLeft: 'auto', 
  },
  logoutText: {
    marginLeft: 8,
    color: 'white',
    fontSize: 16,
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
    shadowOffset: {width: 0, height: 2},
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
