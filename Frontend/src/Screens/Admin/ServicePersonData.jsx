import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import api from '../../auth/api';;
import {API_URL} from '@env';

const {width, height} = Dimensions.get('window');

const ServicePersonData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const response = await api.get(`${API_URL}/admin/incoming-items-data`);
      // console.log(response.data.data);
      setOrders(response.data.data);
    } catch (error) {
      Alert.alert('Error fetching orders', error?.response?.data?.message);
      // console.log('Error fetching orders:', error?.response?.data?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrderItem = ({item}) => (
    <View key={item._id} style={styles.card}>
      <View style={styles.infoRow}>
        <Text style={styles.infoTextBold}>
          Name: {item.servicePerson?.name || 'N/A'}
        </Text>
      </View>
      <View style={styles.contactRow}>
        <Text style={styles.infoTextBold}>
          Contact: {item.servicePerson?.contact || 'N/A'}
        </Text>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.infoTextBold}>Product:</Text>
        {item.items?.map(({_id, itemName, quantity}) => (
          <View key={_id} style={styles.itemRow}>
            <Text style={styles.itemName}>{itemName}: </Text>
            <Text style={styles.itemQuantity}>{quantity} </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ServicePerson Total Data</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item._id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions found.</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04,
    backgroundColor: '#fbd33b',
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',

    textAlign: 'center',
  },
  card: {
    padding: width * 0.04,
    marginVertical: height * 0.02,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    color: '#000',
    fontSize: width * 0.04,
  },
  infoTextBold: {
    color: '#000',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    color: '#000',
    fontSize: width * 0.04,
    // fontWeight: 'bold',
  },
  itemQuantity: {
    color: '#000',
    fontSize: width * 0.04,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: '#555',
    marginTop: height * 0.02,
  },
});

export default ServicePersonData;
