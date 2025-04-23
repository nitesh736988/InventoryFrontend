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

const ThirdPartyOutgoingStock = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [toServiceCenter, setToServiceCenter] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemDefectives, setItemDefectives] = useState({});

  // Fetch warehouses from API
  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/get-warehouse`,
      );
      if (response.data.success) {
        const warehouses = Array.isArray(response.data.warehouseName)
          ? response.data.warehouseName
          : [response.data.warehouseName];
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

  // Fetch items from API
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/warehouse-admin/view-items`);
      const items =
        response?.data?.items?.map(item => ({
          id: item,
          name: item,
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

  // Handle item selection
  const handleItemSelect = selectedItems => {
    setSelectedItems(selectedItems);

    // Initialize defectives for new items
    const newDefectives = {...itemDefectives};

    selectedItems.forEach(item => {
      if (!newDefectives[item]) newDefectives[item] = '';
    });

    // Remove defectives for deselected items
    Object.keys(newDefectives).forEach(key => {
      if (!selectedItems.includes(key)) delete newDefectives[key];
    });

    setItemDefectives(newDefectives);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!selectedWarehouse) {
      Alert.alert('Error', 'Please select a warehouse');
      return;
    }
    if (!toServiceCenter) {
      Alert.alert('Error', 'Please enter service center name');
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return;
    }

    // Validate defectives
    for (const item of selectedItems) {
      if (
        !itemDefectives[item] ||
        isNaN(itemDefectives[item]) ||
        parseInt(itemDefectives[item]) < 0
      ) {
        Alert.alert('Error', `Please enter valid defective count for ${item}`);
        return;
      }
    }

    // Prepare payload
    const payload = {
      fromWarehouse: selectedWarehouse,
      toServiceCenter: toServiceCenter,
      items: selectedItems.map(item => ({
      itemName: item,
      quantity: parseInt(itemDefectives[item]),
      })),
    };

    console.log('Payload:', payload);

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/warehouse-admin/add-outgoing-item`,
        payload,
      );
      console.log('Response:', response.data);

      // Reset form on success
      setSelectedItems([]);
      setItemDefectives({});
      setToServiceCenter('');

      Alert.alert('Success', 'Items transferred successfully!');
      navigation.navigate('WarehouseNavigation');
    } catch (error) {
      console.log('Error:', error.response?.data);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to transfer items',
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
      <Text style={styles.title}>Transfer to Service Center</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Select Items:</Text>
        <MultiSelect
          items={allItems}
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>From Warehouse:</Text>
          {allWarehouses.length > 0 ? (
            <Picker
              selectedValue={selectedWarehouse}
              style={styles.picker}
              onValueChange={setSelectedWarehouse}>
              {allWarehouses.map((warehouse, index) => (
                <Picker.Item key={index} label={warehouse} value={warehouse} />
              ))}
            </Picker>
          ) : (
            <Text style={styles.errorText}>No warehouses available</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>To Service Center:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter service center name"
            value={toServiceCenter}
            onChangeText={setToServiceCenter}
            placeholderTextColor="#999"
          />
        </View>

        {selectedItems.map(item => (
          <View key={item} style={styles.itemSection}>
            <Text style={styles.itemLabel}>{item}</Text>

            <View style={styles.quantityInput}>
              <Text style={styles.inputLabel}>Defective Count:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={itemDefectives[item]}
                onChangeText={text => {
                  setItemDefectives({...itemDefectives, [item]: text});
                }}
                placeholder="Enter defective count"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Transfer Items'}
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

export default ThirdPartyOutgoingStock;