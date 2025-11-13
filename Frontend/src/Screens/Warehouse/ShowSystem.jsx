import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import api from '../../auth/api';;
import { API_URL } from '@env';

const ShowSystem = () => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSystems = async () => {
    try {
      const response = await api.get(`${API_URL}/warehouse-admin/show-systems`);
      if (response.data.success) {
        setSystems(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching systems:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSystems();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Available Systems</Text>
      </View>

      {systems.length === 0 ? (
        <Text style={styles.noDataText}>No systems found</Text>
      ) : (
        <View style={styles.cardContainer}>
          {systems.map((system) => (
            <View key={system._id} style={styles.systemCard}>
              <Text style={styles.systemName}>{system.systemName}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  systemCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: '48%', // Two cards per row with small gap
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  systemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  systemId: {
    fontSize: 12,
    color: '#666',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ShowSystem;