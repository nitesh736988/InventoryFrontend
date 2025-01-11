import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const ResolvedComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchComplaints = async () => {
    try {
      const serviceId = await AsyncStorage.getItem('_id');
      console.log(serviceId);
      const response = await axios.get(
        `http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`,
      );
      setComplaints(response.data.data);
    } catch (error) {
      console.log('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterComplaints = () => {
    return complaints.filter(
      complaint =>
        complaint.complainantName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        complaint.trackingId.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  useEffect(() => {
    fetchComplaints();    
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const renderComplaintItem = ({ item }) => (
    <View key={item._id} style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>saralId:</Text> {item.saralId}     
        </Text>

        {item?.Stage[0]?._id === '675aaf9c44c74418017c1dae' ? null :
        item?.Stage[0]._id === '675aaf9c44c74418017c1daf' ? (
          <EntypoIcon name="squared-cross" color="red" size={25} />
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Tracking ID:</Text> {item.trackingId}
        </Text>
        {item?.Stage[0]?._id === "675be30222ae6f63bf772dcf" && (
          <Text style={{ color: 'red' }}>Pending</Text>
        )}
        {item?.Stage[0]?._id === "675be30222ae6f63bf772dd1" && (
          <Text style={{ color: 'red' }}>Rejected</Text>
        )}
        {item?.Stage[0]?._id === "675be30222ae6f63bf772dd0" && (
          <Text style={{ color: 'rgb(0, 200, 0)' }}>Resolved</Text>
        )}
      </View>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Contact:</Text> {item.contact}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Company:</Text> {item.company}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>ComplaintDetails:</Text> {item.complaintDetails}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Created At:</Text> {new Date(item.created_At).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Complaints</Text>
      <FlatList
        data={filterComplaints()}
        renderItem={renderComplaintItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No complaints found.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
});

export default ResolvedComplaint;
