import React, {useEffect, useState} from 'react';
import {testApi} from '../../utils/testAPI';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';

const WarehouseDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/dashboard`,
        );

        console.log('Response data:', response.data);
        if (response.data?.warehouseData?.items) {
          setData(response.data.warehouseData.items);
        } else {
          console.log('No items found in warehouse data');
          setData([]);
        }
      } catch (error) {
        console.log('Error fetching data:', error.response.data);
      } finally {
        setLoading(false);
        setIsRefreshClicked(false);
      }
    };

    fetchData();
  }, [isRefreshClicked]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      <TouchableOpacity
        style={styles.refreshIcon}
        onPress={() => setIsRefreshClicked(true)}>
        <Icon name="refresh" size={30} color="black" />
      </TouchableOpacity>

      {data.length > 0 ? (
        data.map(({_id, itemName, quantity, defective, repaired, rejected}) => (
          <View key={_id} style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Stockdata', {
                  itemId: _id,
                  itemName,
                })
              }>
              <Text style={styles.cardTitle}>{itemName}</Text>
            </TouchableOpacity>
            <Text style={styles.cardDetails}>Stock: {quantity}</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DefectiveItem', {
                  itemId: _id,
                  itemName,
                })
              }>
              <Text
                style={[
                  styles.cardDetails,
                  styles.link,
                  styles.defectiveHighlight,
                ]}>
                Defective: {defective}
              </Text>
            </TouchableOpacity>
            <Text style={styles.cardDetails}>Repaired: {repaired}</Text>
            <Text style={styles.cardDetails}>Rejected: {rejected}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No items found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  refreshIcon: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  cardDetails: {
    fontSize: 14,
    marginTop: 5,
  },
  link: {
    textDecorationLine: 'underline',
  },
  defectiveHighlight: {
    color: 'red',
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default WarehouseDashboard;