import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShowFarmerComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const serviceId = await AsyncStorage.getItem('_id');
      console.log('Service ID:', serviceId);

      const response = await axios.get(
        `http://88.222.214.93:8001/farmer/showComplaint?assignEmployee=${serviceId}`
      );
      console.log('Fetched Complaints:', response.data.data);
      setComplaints(response.data.data || []);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch complaints.');
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const filterComplaints = () => {
    return complaints.filter(
      (complaint) =>
        complaint.Farmer[0]?.farmerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        complaint.Farmer[0]?.contact
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  };

  const renderComplaintItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Farmer Name: </Text>
        {item.Farmer[0]?.farmerName || 'N/A'}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Address: </Text>
        {item.Farmer[0]?.address || 'N/A'}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Contact: </Text>
        {item.Farmer[0]?.contact || 'N/A'}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>HP: </Text>
        {item.Farmer[0]?.HP || 'N/A'}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Pump Type: </Text>
        {item.Farmer[0]?.pump_type || 'N/A'}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Complaint Details: </Text>
        {item.complaintDetails || 'N/A'}
      </Text>

      <Text style={styles.infoText}>
        <Text style={styles.label}>Stage: </Text>
        {item.stage || 'N/A'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Complaints</Text>
      <TextInput
        placeholder="Search by Name or Contact"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filterComplaints()}
          renderItem={renderComplaintItem}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No complaints found.</Text>
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
  },
  infoText: {
    color: '#000',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
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

export default ShowFarmerComplaint;
