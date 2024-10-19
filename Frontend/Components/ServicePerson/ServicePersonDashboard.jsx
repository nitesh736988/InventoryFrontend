import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const ServicePersonDashboard = () => {
  const [servicePersons, setServicePersons] = useState([]); 
  const [selectedServicePerson, setSelectedServicePerson] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const fetchServicePersons = async () => {
    try {
      const response = await axios.get(`${API_URL}/service-person/dashboard`);
      console.log('API Response:', response.data); 

      if (Array.isArray(response.data)) {
        setServicePersons(response.data);
      } else if (response.data.servicePersons) {
        setServicePersons(response.data.servicePersons);
      } else {
        console.error('Unexpected API response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching service persons:', error);
    }
  };

  useEffect(() => {
    fetchServicePersons(); 
  }, []);

  const handleServicePersonSelect = (person) => {
    setSelectedServicePerson(person);
   
  };

  const updateTransactionStatus = async (transactionId, status) => {
  
    try {
      const response = await axios.patch(`${API_URL}/transactions/${transactionId}`, { status });
      console.log('Transaction updated:', response.data);
    
    } catch (error) {
      console.error('Error updating transaction status:', error);
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionContainer}>
      <Text style={styles.transactionText}>Item: {item.itemName}</Text>
      <Text style={styles.transactionText}>Quantity: {item.quantity}</Text>
      <Text style={styles.transactionText}>Status: {item.status}</Text>
      
      <View style={styles.statusButtonsContainer}>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => updateTransactionStatus(item.id, 'in')}
        >
          <Text style={styles.statusButtonText}>Mark as In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Persons Transaction</Text>

      {servicePersons.map((person) => (
        <TouchableOpacity
          key={person.email}
          style={styles.personButton}
          onPress={() => handleServicePersonSelect(person)}
        >
          <Text style={styles.personText}>{person.name} ({person.email})</Text>
        </TouchableOpacity>
      ))}

      {selectedServicePerson && (
        <View style={styles.transactionsSection}>
          <Text style={styles.title}>Transactions for {selectedServicePerson.name}</Text>

          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  personButton: {
    backgroundColor: '#070604',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  personText: {
    color: '#fbd33b',
    fontSize: 16,
  },
  transactionsSection: {
    marginTop: 20,
  },
  transactionContainer: {
    padding: 10,
    backgroundColor: '#fbd33b',
    borderRadius: 5,
    marginVertical: 5,
  },
  transactionText: {
    fontSize: 14,
    color: '#070604',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusButton: {
    backgroundColor: '#070604',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#fbd33b',
    fontSize: 16,
  },
});

export default ServicePersonDashboard;
