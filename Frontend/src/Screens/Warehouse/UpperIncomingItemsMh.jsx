import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';
import {Picker} from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import {useNavigation} from '@react-navigation/native';

const UpperIncomingItemsMh = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState({id: '', name: ''});
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [selectedCompany, setSelectedCompany] = useState('GEPL');
  const [formData, setFormData] = useState({
    from: '',
    arrivedDate: new Date().toISOString(),
  });

  const companyOptions = ['GEPL', 'GSPL'];

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(`${API_URL}/warehouse-admin/get-warehouse`);
      if (response.data.success) {
        let warehouses = [];
        
        // Handle both array and single object response formats
        if (Array.isArray(response.data.warehouses)) {
          warehouses = response.data.warehouses.map(wh => ({
            id: wh._id || wh.warehouseId,
            name: wh.name || wh.warehouseName
          }));
        } else if (response.data.warehouseId) {
          warehouses = [{
            id: response.data.warehouseId,
            name: response.data.warehouseName
          }];
        }
        
        setAllWarehouses(warehouses);
        if (warehouses.length > 0) {
          setSelectedWarehouse(warehouses[0]);
        }
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch warehouses',
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/warehouse-admin/show-system-items`);
      const items = response?.data?.items?.map(item => ({
        _id: item._id,
        name: item.name
      })) || [];
      setAllItems(items);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch items',
      );
    }
  };

  useEffect(() => {
    fetchWarehouses();
    fetchItems();
  }, []);

  const handleItemSelect = selectedItems => {
    setSelectedItems(selectedItems);

    const newQuantities = {...itemQuantities};
    selectedItems.forEach(itemId => {
      if (!newQuantities[itemId]) newQuantities[itemId] = '';
    });

    Object.keys(newQuantities).forEach(key => {
      if (!selectedItems.includes(key)) delete newQuantities[key];
    });

    setItemQuantities(newQuantities);
  };

  const handleSubmit = async () => {
    if (!selectedWarehouse.id) {
      Alert.alert('Error', 'Please select a warehouse');
      return;
    }
    if (!formData.from) {
      Alert.alert('Error', 'Please enter where items are coming from');
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return;
    }

    for (const itemId of selectedItems) {
      if (
        !itemQuantities[itemId] ||
        isNaN(itemQuantities[itemId]) ||
        parseInt(itemQuantities[itemId]) <= 0
      ) {
        const item = allItems.find(i => i._id === itemId);
        Alert.alert('Error', `Please enter a valid quantity for ${item?.name || 'selected item'}`);
        return;
      }
    }

    const payload = {
      from: formData.from,
      toWarehouse: selectedWarehouse.id,
      itemsList: selectedItems.map(itemId => ({
        systemItemId: itemId,
        quantity: parseInt(itemQuantities[itemId]),
      })),
      company: selectedCompany,
      arrivedDate: formData.arrivedDate,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/warehouse-admin/incoming-inventory-items`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSelectedItems([]);
        setItemQuantities({});
        setFormData({
          from: '',
          arrivedDate: new Date().toISOString(),
        });
        setSelectedCompany('GEPL');
        
        Alert.alert('Success', 'Items added successfully!');
        navigation.navigate('WarehouseNavigation');
      } else {
        throw new Error(response.data.message || 'Failed to add items');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to add items',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Incoming Stock</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>Select Company:</Text>
          <Picker
            selectedValue={selectedCompany}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedCompany(itemValue)}>
            {companyOptions.map((company, index) => (
              <Picker.Item key={index} label={company} value={company} />
            ))}
          </Picker>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Select Items:</Text>
          <MultiSelect
            items={allItems.map(item => ({
              id: item._id,
              name: item.name,
            }))}
            uniqueKey="id"
            onSelectedItemsChange={handleItemSelect}
            selectedItems={selectedItems}
            selectText="Select Items"
            searchInputPlaceholderText="Search items..."
            displayKey="name"
            hideSubmitButton
            styleTextDropdown={styles.multiSelectText}
            styleTextDropdownSelected={styles.multiSelectTextSelected}
            styleListContainer={styles.listContainer}
            textColor="#000"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Destination Warehouse:</Text>
          {allWarehouses.length > 0 ? (
            <Picker
              selectedValue={selectedWarehouse.id}
              style={styles.picker}
              onValueChange={(itemValue) => {
                const selected = allWarehouses.find(w => w.id === itemValue);
                setSelectedWarehouse(selected || {id: '', name: ''});
              }}>
              {allWarehouses.map((warehouse) => (
                <Picker.Item 
                  key={warehouse.id} 
                  label={warehouse.name} 
                  value={warehouse.id} 
                />
              ))}
            </Picker>
          ) : (
            <Text style={styles.errorText}>No warehouses available</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Source Location:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter source (e.g., Haridwar)"
            value={formData.from}
            onChangeText={text => setFormData({...formData, from: text})}
            placeholderTextColor="#999"
          />
        </View>

        {selectedItems.map(itemId => {
          const item = allItems.find(i => i._id === itemId);
          return (
            <View key={itemId} style={styles.itemSection}>
              <Text style={styles.itemLabel}>{item?.name || 'Unknown Item'}</Text>
              <View style={styles.quantityInput}>
                <Text style={styles.inputLabel}>Quantity:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={itemQuantities[itemId]}
                  onChangeText={text => {
                    setItemQuantities({...itemQuantities, [itemId]: text});
                  }}
                  placeholder="0"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Submit Stock'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fbd33b',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  itemSection: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  listContainer: {
    backgroundColor: '#fbd33b',
    maxHeight: 300,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#070604',
    marginBottom: 8,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 50,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  quantityInput: {
    width: '100%',
    marginBottom: 8,
  },
  multiSelectText: {
    color: '#333',
  },
  multiSelectTextSelected: {
    color: '#333',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
});

export default UpperIncomingItemsMh;