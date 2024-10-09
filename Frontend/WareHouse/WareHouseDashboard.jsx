import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const WareHouseDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await post('http://192.168.68.108/admin/viewItems');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Pump</Text>
        <Text style={styles.cardValue}>{data ? data.totalPump : 'N/A'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Motor</Text>
        <Text style={styles.cardValue}>{data ? data.totalMotor : 'N/A'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Controller</Text>
        <Text style={styles.cardValue}>{data ? data.totalController : 'N/A'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    color: '#888',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
});

export default WareHouseDashboard;
