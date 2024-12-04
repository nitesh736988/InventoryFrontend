import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {API_URL} from '@env';

const ServicePersonDashboard = () => {
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
      setIsRefreshClicked(false); // Set it back to false once fetching is done
    }
  };

  useEffect(() => {
    fetchServicePersons(); // Initial fetch when component mounts
  }, []);

  useEffect(() => {
    if (isRefreshClicked) {
      fetchServicePersons(); // Refetch when refresh is triggered
    }
  }, [isRefreshClicked]);

  // Function to render the list of items
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
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => setIsRefreshClicked(true)}>
        <Icon name="refresh" size={30} color="black" />
      </TouchableOpacity>

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
  refreshButton: {
    position: 'absolute',
    top: 24,
    right: 40,
    zIndex: 999,
  },
});

export default ServicePersonDashboard;
