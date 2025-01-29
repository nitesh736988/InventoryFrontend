import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const SurveyAssignData = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  const fetchSurveys = async () => {
    try {
      setError(null);
      const serviceId = await AsyncStorage.getItem('_id');

      const response = await axios.get(
        `http://88.222.214.93:8001/filedService/installationSurveyList?fieldEmpID=${serviceId}`,
      );
      setSurveys(response.data.data);
    } catch (error) {
      console.log('Error fetching surveys:', error);
      setError('Failed to fetch surveys. Please try again later.');
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
    <View key={item._id} style={styles.card}>
      <View style={styles.statusBadge}>
      <Text style={styles.label}>Saral ID: {item.farmerId.saralId}</Text>
        {item?.installationSurvey === false ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SurveyData', {farmerId: item?.farmerId?._id})
            }>
            <Text style={styles.fillFormText}>Fill Form</Text>
            
          </TouchableOpacity>
        ) : (
          <Text style={styles.resolvedText}>Resolved</Text>
        )}
      </View>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Farmer Name:</Text> {item.farmerId.farmerName}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Father/Husband Name:</Text>{' '}
        {item.farmerId.fatherOrHusbandName || 'N/A'}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>Contact:</Text> {item.farmerId.contact}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.label}>State:</Text> {item.farmerId.state}
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Survey Assign</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search by Farmer Name or Saral ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={surveys.filter(
            item =>
              (item.farmerId.farmerName &&
                item.farmerId.farmerName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())) ||
              (item.farmerId.saralId &&
                item.farmerId.saralId
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())),
          )}
          keyExtractor={item => item._id}
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  approvedText: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 8,
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
    position: 'relative',
  },

  statusBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  fillFormText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  resolvedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  infoText: {
    color: '#000',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: 'black'
  },
  loadingContainer: {
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
  fillFormButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  fillFormButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default SurveyAssignData;
