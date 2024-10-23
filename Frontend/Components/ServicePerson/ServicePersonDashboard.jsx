import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import axios from 'axios';
import { API_URL } from '@env';

const ServicePersonDashboard = () => {
  const [servicePersons, setServicePersons] = useState(null);
  const [ selectedItem, setSelectedItem ] = useState('');
  const [selectedServicePerson, setSelectedServicePerson] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const fetchServicePersons = async () => {
    try {
      const response = await axios.get(`${API_URL}/service-person/dashboard`);
      console.log('API Response:', response.data);
      console.log(response.status);

      if (response.status === 200) {
        setServicePersons(response.data.data);
        // Alert.alert("Response", JSON.stringify(response.data.data));
      } else if (response.data.servicePersons) {
        setServicePersons(response.data.servicePersons);
      } else {
        console.log('Unexpected API response structure:', response.data);
      }
    } catch (error) {
      // Alert.alert(error);
      console.log('Error fetching service persons:', error);
    }
  };

  useEffect(() => {
    fetchServicePersons();
  }, []);

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
      <Text>Service Person Transaction Detail</Text>
      {servicePersons !== null &&
        servicePersons.map(({name, value}, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity
              onPress={() => {
                setSelectedItem({_id, itemName, stock});
                // setUpdatedQuantity(stock.toString());
                // setModalVisible(true);
              }}
              style={styles.cardContent}>
              <Text style={styles.cardTitle}>{name}</Text>
              <Text style={styles.cardValue}>{value ? value : 0}</Text>
            </TouchableOpacity>

            {/* Delete Icon */}
            {/* <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => confirmDelete(_id)}>
              <Icon name="trash" size={24} color="red" />
            </TouchableOpacity> */}
          </View>
        ))
      }

      {/* {selectedServicePerson && (
        <View style={styles.transactionsSection}>
          <Text style={styles.title}>Transactions for {selectedServicePerson.name}</Text>

          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No transactions found.</Text>}
          />
        </View>
      )} */}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
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
  deleteIcon: {
    padding: 10,
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
