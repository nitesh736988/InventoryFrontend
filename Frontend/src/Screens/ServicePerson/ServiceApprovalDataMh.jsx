import React, {useState, useEffect} from 'react';
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
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServiceApprovalDataMh = () => {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const empId = await AsyncStorage.getItem('_id');
      const response = await axios.get(
        `http://88.222.214.93:5000/service-person/show-new-install-data`,
      );
      setServiceData(response.data.data);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch data");
      setServiceData([]); // Set to empty array instead of null
    } finally {                 
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleApprove = async (installation) => {
    try {
      const empId = await AsyncStorage.getItem('_id');
      const response = await axios.post(
        `http://88.222.214.93:5000/service-person/update-incoming-item-status`,
        {
          installationId: installation._id,
          farmerSaralId: installation.farmerSaralId,
          empId: empId,
          accepted: true
        }
      );
      if (response.data.success) {
        Alert.alert("Success", "Installation approved successfully");
        fetchData();
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to approve");
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Installation Details</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farmer Information</Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Name:</Text> {item.farmerDetails?.farmerName || 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>SARAL ID:</Text> {item.farmerSaralId || 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Contact:</Text> {item.farmerDetails?.contact || 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Address:</Text> {item.farmerDetails?.village || 'N/A'}, {item.farmerDetails?.block || 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>District:</Text> {item.farmerDetails?.district || 'N/A'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment Information</Text>
          {item.itemsList?.map((equip, i) => (
            <Text key={i} style={styles.infoText}>
              <Text style={styles.label}>{equip.systemItemId?.itemName || 'Item'}:</Text> {equip.quantity || '0'}
            </Text>
          ))}
          <Text style={styles.infoText}>
            <Text style={styles.label}>Panel Numbers:</Text> {item.panelNumbers?.join(', ') || 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Pump Number:</Text> {item.pumpNumber || 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Controller Number:</Text> {item.controllerNumber || 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>RMU Number:</Text> {item.rmuNumber || 'N/A'}
          </Text>
        </View>

        {item.accepted === false && (
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.approveButton}
              onPress={() => handleApprove(item)}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingIndicator}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Installation Approvals</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Village, Block, Farmer Name, Contact, Saral ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {serviceData && serviceData.length > 0 ? (
        <FlatList
          data={serviceData}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <Text style={styles.emptyText}>No installation data available</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  mainContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  headerContainer: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
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
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  infoText: {
    marginBottom: 5,
    color: '#333',
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
  },
  emptyContainer: {
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

export default ServiceApprovalDataMh;