import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenMap from '../../Component/OpenMap/index';

const ShowComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchComplaints = async () => {
    try {
      const serviceId = await AsyncStorage.getItem('_id');
      console.log(serviceId);
      const response = await axios.get(
        `http://88.222.214.93:8001/farmer/showComplaintForApp?assignEmployee=${serviceId}`);
      console.log(response.data.data);
      setComplaints(response.data.data || []);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch complaints');
      console.log('Error fetching complaints:', error);
    } finally {
      setLoading(false);
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
  }, [loading]);

  const handleApproveBtn = async (sendTransactionId,status) => {
    setLoading(true);
    try {
      const fieldEmpId = await AsyncStorage.getItem('_id');
      console.log({
        complaintAccept: status,
        complaintId: sendTransactionId,
        fieldEmpId: fieldEmpId
      })
      const sendRequest = await axios.post(
        `http://88.222.214.93:8001/filedService/complaintAccept`,
        {
          complaintAccept: true,
          complaintId: sendTransactionId,
          fieldEmpId: fieldEmpId
        },
      );
      console.log(sendRequest.data); 
        setBtnClickedStatus(prevData => ({
          ...prevData,
          [sendTransactionId]: true,
        }));  
    } catch (error) {
      // Alert.alert(JSON.stringify(error));
    }
  };


 const renderComplaintItem = ({item}) => (
  <View key={item._id} style={styles.card}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Complainant Name:</Text>{' '}
        {item.complainantName}
      </Text>
      <OpenMap 
        longitude={item?.farmerId?.longitude}
        latitude={item?.farmerId?.latitude}
      />
    </View>

    <Text style={styles.infoText}>
      <Text style={styles.label}>Tracking ID:</Text> {item.trackingId}
    </Text>
    <Text style={styles.infoText}>
      <Text style={styles.label}>Contact:</Text> {item.contact}
    </Text>
    <Text style={styles.infoText}>
      <Text style={styles.label}>Company:</Text> {item.company}
    </Text>
    <Text style={styles.infoText}>
      <Text style={styles.label}>ComplaintDetails:</Text>{' '}
      {item.complaintDetails}
    </Text>
    <Text style={styles.infoText}>
      <Text style={styles.label}>Created At:</Text>{' '}
      {new Date(item.created_At).toLocaleDateString()}
    </Text>

    <View style={styles.actionContainer}>
      {item?.ComplaintAccept?.length === 0 &&  (
        <>
          <TouchableOpacity
            onPress={() => handleApproveBtn(item._id, false)}
            style={styles.declineButton}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApproveBtn(item._id, true)}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
);


  return (     
    <View style={styles.container}>
      <Text style={styles.header}>Complaints</Text>
        <FlatList
          data={complaints}
          renderItem={renderComplaintItem}
          keyExtractor={item => item._id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No complaints found.</Text>
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
    shadowOffset: {width: 0, height: 2},
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
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },

  declineButton: {
    width: '49%',
    borderRadius: 5,
    backgroundColor: 'red',
    padding: 8,
  },
  approveButton: {
    width: '49%',
    borderRadius: 5,
    backgroundColor: 'green',
    padding: 8,
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
