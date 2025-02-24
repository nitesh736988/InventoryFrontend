import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const NewFarmerInstallation = () => {
  const [newInstallation, setNewInstallation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const fetchNewInstallation = async () => {
    try {
      const warehouseId = await AsyncStorage.getItem('_id');
      console.log('Warehouse ID:', warehouseId);
      if (!warehouseId) throw new Error('Warehouse ID not found');

      const response = await axios.get(
        `http://88.222.214.93:8001/warehouse/newFarmerList?warehouseId=${warehouseId}`,
      );

      if (!response.data?.data) throw new Error('Invalid data format');

      setNewInstallation(response.data.data);
    } catch (error) {
      console.log('Error fetching new installation:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNewInstallation();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNewInstallation();
  };

  const filterNewInstallation = () => {
    return newInstallation.filter(item =>
      item?.farmerId?.farmerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  };

  const renderInstallationItem = ({item}) => {
    const farmer = item?.farmerId || {};
    return (
      <View key={item._id} style={styles.card}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Saral Id:</Text> {farmer.saralId || 'N/A'}
        </Text>
        <TouchableOpacity
          style={styles.fillFormButton}
          onPress={() =>
            navigation.navigate('NewFormInstallation', {farmerId: farmer})
          }>
          <Text style={styles.fillFormText}>Fill Form</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>
          <Text style={styles.label}>Farmer Name:</Text>{' '}
          {farmer.farmerName || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Father/Husband Name:</Text>{' '}
          {farmer.fatherOrHusbandName || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Contact:</Text> {farmer.contact || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>State:</Text> {farmer.state || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>District:</Text> {farmer.district || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Village:</Text> {farmer.village || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Block:</Text> {farmer.block || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Product:</Text> {farmer.product || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Pump Type:</Text>{' '}
          {farmer.pump_type || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Longitude:</Text>{' '}
          {farmer.longitude || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Latitude:</Text> {farmer.latitude || 'N/A'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Installation</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search by Farmer Name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={filterNewInstallation()}
          renderItem={renderInstallationItem}
          keyExtractor={item => item._id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No installations found.</Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    color: '#000',
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

  fillFormButton: {
    position: 'absolute',
    top: 10,  
    right: 10, 
    backgroundColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  fillFormText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  infoText: {
    color: '#000',
  },
  label: {
    fontWeight: 'bold',
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
});

export default NewFarmerInstallation;
