import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet, Alert} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';

const RepairRejectData = () => {
  const [repairRejectData, setRepairRejectData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRepairRejectData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/repair-reject-itemData`);
      console.log(response.data.allRepairRejectData);
      setRepairRejectData(response.data.allRepairRejectData);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
      // console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairRejectData();
  }, []);

  const formatDateTime = useCallback(dateTime => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateTime).toLocaleDateString('en-US', options);
  }, []);

  const renderRepairRejectItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.label}>
        Warehouse Person:{' '}
        <Text style={styles.value}>{item.warehousePerson}</Text>
      </Text>
      <Text style={styles.label}>
        Warehouse Name: <Text style={styles.value}>{item.warehouseName}</Text>
      </Text>
      <Text style={styles.label}>
        Item Name: <Text style={styles.value}>{item.itemName}</Text>
      </Text>
      <Text style={styles.label}>
        Repaired: <Text style={styles.value}>{item.repaired}</Text>
      </Text>
      <Text style={styles.label}>
        Rejected: <Text style={styles.value}>{item.rejected}</Text>
      </Text>
      <Text style={styles.label}>
        Created At:{' '}
        <Text style={styles.value}>{formatDateTime(item.createdAt)}</Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Repair & Reject Data</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={repairRejectData}
          keyExtractor={item => item._id}
          renderItem={renderRepairRejectItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Repair & Reject Data.</Text>
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={21}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fbd33b',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  value: {
    fontWeight: 'normal',
    fontSize: 16,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
});

export default RepairRejectData;
