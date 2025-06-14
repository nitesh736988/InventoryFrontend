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
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

const ApproveDataMh = () => {
  const [serviceData, setServiceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/service-person/accepted-installation-data`,
      );
      setServiceData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message,
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(serviceData);
    } else {
      const filtered = serviceData.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
          (item.farmerDetails?.farmerName?.toLowerCase().includes(query)) ||
          (item.farmerSaralId?.toLowerCase().includes(query)) ||
          (item.farmerDetails?.contact?.includes(query)) ||
          (item.farmerDetails?.village?.toLowerCase().includes(query)) ||
          (item.farmerDetails?.block?.toLowerCase().includes(query)) ||
          (item.farmerDetails?.district?.toLowerCase().includes(query))
        );
      });
      setFilteredData(filtered);
    }
  }, [searchQuery, serviceData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleApprove = async installation => {
    try {
      const empId = await AsyncStorage.getItem('_id');
      const response = await axios.post(
        `${API_URL}/service-person/update-incoming-item-status`,
        {
          installationId: installation._id,
          farmerSaralId: installation.farmerSaralId,
          empId: empId,
          accepted: true,
        },
      );
      if (response.data.success) {
        Alert.alert('Success', 'Installation approved successfully');
        fetchData();
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.title}>Installation Details</Text>
      
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
            <Text style={styles.label}>{equip.systemItemId?.itemName || 'Item'}:</Text> {equip.quantity}
          </Text>
        ))}
        {item.panelNumbers?.length > 0 && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Panel Numbers:</Text> {item.panelNumbers.join(', ')}
          </Text>
        )}
        {item.pumpNumber && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Pump Number:</Text> {item.pumpNumber}
          </Text>
        )}
        {item.controllerNumber && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Controller Number:</Text> {item.controllerNumber}
          </Text>
        )}
        {item.rmuNumber && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>RMU Number:</Text> {item.rmuNumber}
          </Text>
        )}
      </View>

      <View style={styles.actionContainer}>
        {item.accepted === false ? (
          <TouchableOpacity 
            style={styles.approveButton}
            onPress={() => handleApprove(item)}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
        ) : !item.installationDone ? (
          <TouchableOpacity
            style={styles.fillFormButton}
            onPress={() =>
              navigation.navigate('InstallationForm', {
                installationId: item._id,
                farmerDetails: item.farmerDetails,
                farmerName: item.farmerDetails?.farmerName,
                farmerContact: item.farmerDetails?.contact,
                fatherOrHusbandName: item.farmerDetails?.fatherOrHusbandName,
                farmerSaralId: item.farmerSaralId,
              })
            }>
            <Text style={styles.buttonText}>Fill Form</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>Installation Completed</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading installations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Installation Approve Data</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Village, Block, Farmer Name, Contact, Saral ID"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery.trim() === ''
              ? 'No installation data available'
              : 'No results found for your search'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4CAF50']}
              tintColor="#4CAF50"
            />
          }
          contentContainerStyle={styles.listContent}
        />
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    fontSize: 16,
  },
  infoText: {
    marginBottom: 6,
    color: '#333',
    fontSize: 14,
  },
  label: {
    fontWeight: '600',
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
  actionContainer: {
    marginTop: 15,
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
    borderRadius: 8,
    elevation: 2,
  },
  fillFormButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  completedContainer: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
  },
  completedText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  searchBar: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default ApproveDataMh;