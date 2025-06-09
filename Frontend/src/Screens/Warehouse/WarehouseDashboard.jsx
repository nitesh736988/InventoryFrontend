import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';
import Sidebar from './Sidebar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WarehouseDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCard, setActiveCard] = useState('Service');
  const [newInstallationData, setNewInstallationData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [filteredSystemData, setFilteredSystemData] = useState([]);
  const [systems, setSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [showSystemDropdown, setShowSystemDropdown] = useState(false);
  const navigation = useNavigation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/warehouse-admin/dashboard`);
      if (response.data?.warehouseData?.items) {
        setData(response.data.warehouseData.items);
        setFilteredData(response.data.warehouseData.items);
      }

      const systemsResponse = await axios.get(
        `${API_URL}/warehouse-admin/show-systems`,
      );
      if (systemsResponse.data?.data) {
        setSystems(systemsResponse.data.data);

        const defaultSystem = systemsResponse.data.data.find(
          system => system.systemName === '3HP DC System',
        );
        if (defaultSystem) {
          setSelectedSystem(defaultSystem);

          await fetchSystemItems(defaultSystem._id);
        }
      }
    } catch (error) {
      console.log('Error fetching data:', error?.response?.data?.message);
      if (error.response) {
        console.log(
          'Error Response:',
          error?.response?.data?.message || error.response.data,
        );
        Alert.alert(
          'Error',
          error?.response?.data?.message || 'Failed to fetch data',
        );
      } else {
        console.log('Unknown Error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemItems = async systemId => {
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/show-items-stock-status?systemId=${systemId}`,
      );
      if (response.data?.data) {
        setNewInstallationData(response.data.data);
        setFilteredSystemData(response.data.data);
      } else {
        setNewInstallationData([]);
        setFilteredSystemData([]);
      }
    } catch (error) {
      console.log(
        'Error fetching system items:',
        error?.response?.data?.message || error.message,
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    if (searchQuery.trim() === '') {
      setFilteredData(data);
      setFilteredSystemData(newInstallationData);
    } else {
      if (activeCard === 'Service') {
        const filtered = data.filter(item =>
          item.itemName.toLowerCase().includes(lowerCaseQuery),
        );
        setFilteredData(filtered);
      } else {
        const filtered = newInstallationData.filter(item =>
          item.systemItemId.itemName.toLowerCase().includes(lowerCaseQuery),
        );
        setFilteredSystemData(filtered);
      }
    }
  }, [searchQuery, data, newInstallationData, activeCard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
      setSearchQuery('');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/logout`);
      if (response.data.success) {
        Alert.alert('Logout', 'You have logged out successfully');
        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{name: 'LoginPage'}],
        });
      } else {
        Alert.alert('Logout Failed', response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.log(
        'Error logging out:',
        error.message,
        error.response?.data || error,
      );
    }
  };

  const handleSystemSelect = async system => {
    setSelectedSystem(system);
    setShowSystemDropdown(false);
    await fetchSystemItems(system._id);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 20}}
      style={styles.container}
      showsVerticalScrollIndicator={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.cardSwitcher}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            activeCard === 'Service' && styles.activeButton,
          ]}
          onPress={() => setActiveCard('Service')}>
          <Text style={styles.switchButtonText}>Service Data </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchButton,
            activeCard === 'New Installation' && styles.activeButton,
          ]}
          onPress={() => setActiveCard('New Installation')}>
          <Text style={styles.switchButtonText}>Maharastra Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Sidebar />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Icon name="search" size={16} color="#888" style={styles.searchIcon} />
      </View>

      {activeCard === 'New Installation' && (
        <View style={styles.systemSelectorContainer}>
          <TouchableOpacity
            style={styles.systemSelector}
            onPress={() => setShowSystemDropdown(true)}>
            <Text style={styles.systemSelectorText}>
              {selectedSystem ? selectedSystem.systemName : 'Select System'}
            </Text>
            <Icon name="chevron-down" size={16} color="#000" />
          </TouchableOpacity>

          <Modal
            visible={showSystemDropdown}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowSystemDropdown(false)}>
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowSystemDropdown(false)}>
              <View style={styles.dropdownContainer}>
                {systems.map(system => (
                  <Pressable
                    key={system._id}
                    style={styles.dropdownItem}
                    onPress={() => handleSystemSelect(system)}>
                    <Text style={styles.dropdownItemText}>
                      {system.systemName}
                    </Text>
                    {selectedSystem?._id === system._id && (
                      <Icon name="check" size={16} color="#000" />
                    )}
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>
        </View>
      )}

      {activeCard === 'Service' ? (
        filteredData.length > 0 ? (
          filteredData.map(
            ({
              _id,
              itemName,
              newStock,
              quantity,
              defective,
              repaired,
              rejected,
            }) => (
              <View key={_id} style={styles.card}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddData', {itemName})}>
                  <Text
                    style={{
                      ...styles.cardTitle,
                      textDecorationLine: 'underline',
                    }}>
                    {itemName}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.cardDetails}>New Stock: {newStock}</Text>
                <Text style={styles.cardDetails}>Stock: {quantity}</Text>
                <Text style={styles.cardDetails}>Defective: {defective}</Text>
                <Text style={styles.cardDetails}>Repaired: {repaired}</Text>
                <Text style={styles.cardDetails}>Rejected: {rejected}</Text>
              </View>
            ),
          )
        ) : (
          <Text style={styles.noDataText}>
            No items found{searchQuery ? ` matching "${searchQuery}"` : ''}.
          </Text>
        )
      ) : filteredSystemData.length > 0 ? (
        filteredSystemData.map(
          ({
            systemItemId,
            quantity,
            requiredQuantity,
            stockLow,
            materialShort,
          }) => (
            <View
              key={systemItemId._id}
              style={[styles.card, stockLow && styles.lowStockCard]}>
              <View style={styles.cardHeader}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ItemStockUpdate', {
                      subItemId: systemItemId._id,
                      itemName: systemItemId.itemName,
                    })
                  }>
                  <Text
                    style={{
                      ...styles.cardTitle,
                      textDecorationLine: 'underline',
                    }}>
                    {systemItemId.itemName}
                  </Text>
                </TouchableOpacity>
                {/* {stockLow && (
                  <View style={styles.lowStockIndicator}>
                    <Icon name="exclamation-triangle" size={16} color="#d9534f" />
                    <Text style={styles.lowStockText}>Low Stock</Text>
                  </View>
                )} */}
              </View>
              <Text style={styles.cardDetails}>
                Current Quantity: {quantity}
              </Text>
              <Text style={styles.cardDetails}>
                Required Quantity: {requiredQuantity}
              </Text>
              <Text style={styles.cardDetails}>
                Material Short: {materialShort}
              </Text>
              {stockLow && (
                <View style={styles.lowStockIndicator}>
                  <Icon name="exclamation-triangle" size={16} color="#d9534f" />
                  <Text style={styles.lowStockText}>Low Stock</Text>
                </View>
              )}
            </View>
          ),
        )
      ) : (
        <Text style={styles.noDataText}>
          No system data found{searchQuery ? ` matching "${searchQuery}"` : ''}.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 30,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 10,
    position: 'relative',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    paddingLeft: 35,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  logoutButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
  },
  cardSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  activeButton: {
    backgroundColor: '#000',
  },
  switchButtonText: {
    color: '#fff',
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
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  lowStockCard: {
    borderColor: '#d9534f',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  cardDetails: {
    fontSize: 14,
    marginTop: 5,
    color: '#000',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  systemSelectorContainer: {
    marginBottom: 15,
  },
  systemSelector: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  systemSelectorText: {
    fontSize: 16,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    maxHeight: '60%',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  lowStockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lowStockText: {
    color: '#d9534f',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default WarehouseDashboard;
