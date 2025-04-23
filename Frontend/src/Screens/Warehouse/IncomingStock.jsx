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

const IncomingStock = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [itemDefectives, setItemDefectives] = useState({});
  const [formData, setFormData] = useState({
    itemComingFrom: '',
    arrivedDate: new Date().toISOString().split('T')[0],
  });

  // Fetch warehouses from API
  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/warehouse-admin/get-warehouse`,
      );
      if (response.data.success) {
        // Ensure we always have an array
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

    // Initialize quantities and defectives for new items
    const newQuantities = {...itemQuantities};
    const newDefectives = {...itemDefectives};

    selectedItems.forEach(item => {
      if (!newQuantities[item]) newQuantities[item] = '';
      if (!newDefectives[item]) newDefectives[item] = '';
    });

    // Remove quantities for deselected items
    Object.keys(newQuantities).forEach(key => {
      if (!selectedItems.includes(key)) delete newQuantities[key];
    });
    Object.keys(newDefectives).forEach(key => {
      if (!selectedItems.includes(key)) delete newDefectives[key];
    });

    setItemQuantities(newQuantities);
    setItemDefectives(newDefectives);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!selectedWarehouse) {
      Alert.alert('Error', 'Please select a warehouse');
      return;
    }
    if (!formData.itemComingFrom) {
      Alert.alert('Error', 'Please enter where items are coming from');
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return;
    }

    // Validate quantities and defectives
    for (const item of selectedItems) {
      if (
        !itemQuantities[item] ||
        isNaN(itemQuantities[item]) ||
        parseInt(itemQuantities[item]) <= 0
      ) {
        Alert.alert('Error', `Please enter a valid quantity for ${item}`);
        return;
      }
      if (
        !itemDefectives[item] ||
        isNaN(itemDefectives[item]) ||
        parseInt(itemDefectives[item]) < 0
      ) {
        Alert.alert('Error', `Please enter valid defective count for ${item}`);
        return;
      }
      if (parseInt(itemDefectives[item]) > parseInt(itemQuantities[item])) {
        Alert.alert(
          'Error',
          `Defective count cannot be more than quantity for ${item}`,
        );
        return;
      }
    }

    // Prepare payload
    const payload = {
      warehouse: selectedWarehouse,
      itemComingFrom: formData.itemComingFrom,
      items: selectedItems.map(item => ({
        itemName: item,
        quantity: parseInt(itemQuantities[item]),
        defective: parseInt(itemDefectives[item]),
      })),
      arrivedDate: formData.arrivedDate,
    };

    console.log('Payload:', payload); // Debugging line

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/warehouse-admin/add-incoming-item`,
        payload,
      );

      // Reset form on success
      setSelectedItems([]);
      setItemQuantities({});
      setItemDefectives({});
      setFormData({
        itemComingFrom: '',
        arrivedDate: new Date().toISOString().split('T')[0],
      });

      Alert.alert('Success', 'Items added successfully!');
      navigation.navigate('WarehouseNavigation');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to add items',
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
          // styleListContainer={styles.multiSelectList}
          styleTextDropdown={styles.multiSelectText}
          styleTextDropdownSelected={styles.multiSelectTextSelected}
          styleListContainer={styles.listContainer}
          textColor="#000"

        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>Warehouse:</Text>
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
          <Text style={styles.label}>Coming From:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter source (e.g., Haridwar)"
            value={formData.itemComingFrom}
            onChangeText={text =>
              setFormData({...formData, itemComingFrom: text})
            }
            placeholderTextColor="#999"
          />
        </View>

        {selectedItems.map(item => (
          <View key={item} style={styles.itemSection}>
            <Text style={styles.itemLabel}>{item}</Text>

            <View style={styles.row}>
              <View style={styles.quantityInput}>
                <Text style={styles.inputLabel}>Quantity:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={itemQuantities[item]}
                  onChangeText={text => {
                    setItemQuantities({...itemQuantities, [item]: text});
                  }}
                  placeholder="0"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.quantityInput}>
                <Text style={styles.inputLabel}>Defective:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={itemDefectives[item]}
                  onChangeText={text => {
                    setItemDefectives({...itemDefectives, [item]: text});
                  }}
                  placeholder="0"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>
        ))}

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
    padding: 20,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityInput: {
    width: '48%',
  },
  multiSelectList: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
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

export default IncomingStock;
