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
import { API_URL } from '@env';

const ShowComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/farmer/showComplaint?assignEmployee?assignEmployee=`);
      console.log(response.data.data);
      setComplaints(response.data.data || []);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch complaints');
      console.log('Error fetching complaints:', error);
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
        complaint.complainantName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        complaint.trackingId
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  };

  const renderComplaintItem = ({ item }) => (
    <View key={item._id} style={styles.card}>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Complainant Name:</Text> {item.complainantName}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Tracking ID:</Text> {item.trackingId}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Created At:</Text> {new Date(item.created_At).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Complaints</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Name or Tracking ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
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

export default ShowComplaints;