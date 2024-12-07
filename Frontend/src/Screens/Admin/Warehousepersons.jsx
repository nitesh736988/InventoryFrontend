import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';
import Icon from 'react-native-vector-icons/FontAwesome';

const Warehousepersons = () => {
  const [warehousePersons, setWarehousePersons] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWarehousePersons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/admin/all-warehouse-persons`,
      );
      console.log('Response:', response);
      setWarehousePersons(response.data.allWarehousePersons || []);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch warehouse persons',
      );
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const deleteWarehousePerson = async id => {
    try {
      await axios.delete(`${API_URL}/admin/remove-warehouse-person?id=${id}`);
      Alert.alert('Success', 'Warehouse person deleted successfully');
      setWarehousePersons(prev => prev.filter(person => person._id !== id));
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to delete warehouse person',
      );
      console.log('Error deleting data:', error);
    }
  };
  useEffect(() => {
    fetchWarehousePersons();
  }, []);

  const renderWarehousePerson = useCallback(
    ({item}) => (
      <View style={styles.personContainer}>
        <Text style={styles.label}>
          Name: <Text style={styles.value}>{item.name || 'N/A'}</Text>
        </Text>
        <Text style={styles.label}>
          Email: <Text style={styles.value}>{item.email || 'N/A'}</Text>
        </Text>
        <Text style={styles.label}>
          Warehouse:{' '}
          <Text style={styles.value}>
            {item.warehouse?.warehouseName || 'N/A'}
          </Text>
        </Text>
        <Text style={styles.label}>
          Contact: <Text style={styles.value}>{item.contact || 'N/A'}</Text>
        </Text>
        <TouchableOpacity
          accessibilityLabel={`Delete ${item.name}`}
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert(
              'Confirm Deletion',
              `Are you sure you want to delete ${item.name}?`,
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteWarehousePerson(item._id),
                },
              ],
            )
          }>
          <Icon name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#fbd33b" />
      ) : (
        <>
          <Text style={styles.label}>
            Total Warehouse Persons: {warehousePersons.length}
          </Text>
          <FlatList
            data={warehousePersons}
            keyExtractor={(item, index) =>
              item._id?.toString() || index.toString()
            } // Ensure the key is valid
            renderItem={renderWarehousePerson}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No warehouse persons found.</Text>
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  personContainer: {
    backgroundColor: '#fbd33b',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    borderColor: '#070604',
    borderWidth: 1,
    position: 'relative',
  },
  label: {
    fontWeight: 'bold',
    color: '#070604',
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontWeight: 'normal',
    color: '#555',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    width: 40,
    height: 40,
    backgroundColor: '#f46d62',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default Warehousepersons;
