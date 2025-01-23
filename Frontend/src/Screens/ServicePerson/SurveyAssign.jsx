import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SurveyAssign = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSurveys = async () => {
    try {
      const serviceId = await AsyncStorage.getItem('_id');
      const response = await axios.get(
        `http://88.222.214.93:8001/filedService/complaintUpdate=${serviceId}`,
      );
      setSurveys(response.data.data);
    } catch (error) {
      console.log('Error fetching surveys:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSurveys();
  };

  const renderSurveyItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Saral ID:</Text> {item.saralId}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Farmer Name:</Text> {item.farmerName}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Father/Husband Name:</Text>{' '}
        {item.fatherOrHusbandName}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Contact:</Text> {item.contact}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>State:</Text> {item.state}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Survey Assign</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Farmer Name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={surveys.filter(item =>
            item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()),
          )}
          keyExtractor={item => item.saralId.toString()}
          renderItem={renderSurveyItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No surveys found.</Text>
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
});

export default SurveyAssign;
