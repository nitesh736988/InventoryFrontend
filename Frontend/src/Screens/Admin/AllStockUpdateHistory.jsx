import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';

const AllStockUpdateHistory = () => {
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStockHistory = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/admin/stock-update-history`,
        );

        setStockHistory(response.data.data);
      } catch (err) {
        setError("Error Stock Hiatory: " + (err.response?.data?.message || err.message));
        Alert.alert("Error", err.response?.data?.message || "An error occurred while fetching stock history.");
      } finally {
        setLoading(false);
      }
    };

    fetchStockHistory();
  }, []);

  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>All Stock Update History</Text>

      {stockHistory.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Employee:</Text>
            <Text style={styles.value}>{item.empId?.name || 'N/A'}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Warehouse:</Text>
            <Text style={styles.value}>
              {item.warehouseId?.warehouseName || 'N/A'}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Item:</Text>
            <Text style={styles.value}>{item.itemName}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>New Stock:</Text>
            <Text style={styles.value}>{item.newStock || 0}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Quantity:</Text>
            <Text style={styles.value}>{item.quantity || 0}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Defective:</Text>
            <Text style={styles.value}>{item.defective || 0}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 16,
  },
  value: {
    color: '#333',
    fontSize: 16,
    flexShrink: 1,
    marginLeft: 10,
    textAlign: 'right',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default AllStockUpdateHistory;
