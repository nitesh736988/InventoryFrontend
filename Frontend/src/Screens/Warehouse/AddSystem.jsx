import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const AddSystem = () => {
  const [systemName, setSystemName] = useState('');
  const [loading, setLoading] = useState(false);
  const [systems, setSystems] = useState([]);
  const fetchSystems = async () => {
    try {
      const response = await axios.get(`${API_URL}/warehouse-admin/show-systems`);
      setSystems(response.data.data);
    } catch (error) {
      console.log('Error fetching systems:', error);
      Alert.alert('Error', 'Failed to fetch systems. Please try again.');
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []); 

  const handleSubmit = async () => {
    if (!systemName.trim()) {
      Alert.alert('Error', 'System Name cannot be empty or just spaces.');
      return;
    }

    if (systems.some((system) => system.systemName === systemName.trim())) {
      Alert.alert('Error', 'System name already exists.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/warehouse-admin/add-system`, {
        systemName,
      });

  
      await fetchSystems();

      Alert.alert('Success', 'System added successfully!');
      setSystemName('');
    } catch (error) {
      console.log('Error adding system:', error);
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderSystemCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.systemName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>System Name:</Text>
      <TextInput
        style={styles.input}
        value={systemName}
        onChangeText={setSystemName}
        placeholder="Enter System name"
        placeholderTextColor="#000"
        editable={!loading}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Add System</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.allSystemsLabel}>All Systems:</Text>
      {systems.length > 0 ? (
        <FlatList
          data={systems}
          keyExtractor={(item) => item.id?.toString() || item.systemName}
          renderItem={renderSystemCard}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noSystemsText}>No systems added yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  input: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#070604',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  allSystemsLabel: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#070604',
  },
  list: {
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#070604',
    borderWidth: 1,
  },
  cardText: {
    fontSize: 16,
    color: 'black',
  },
  noSystemsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AddSystem;
