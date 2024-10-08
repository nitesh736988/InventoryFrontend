import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
 
    const fetchData = async () => {
      try {

        const response = await axios.get('http://192.168.68.100:8080/admin/viewItems', {timeout: 2000});
        const result = await response.data.data;
        setData(result);
        Alert.alert("warnaning",JSON.stringify(result))

      } catch (error) {
        Alert.alert("warnaning",JSON.stringify(error.response))
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
    {
      data.map(({_id,itemName,stock}) => (
          <View key={_id} style={styles.card}>
            <Text style={styles.cardTitle}>{itemName}</Text>
            <Text style={styles.cardValue}>{stock ? stock : 0}</Text>
        </View>
      ))
    }
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

export default Dashboard;
