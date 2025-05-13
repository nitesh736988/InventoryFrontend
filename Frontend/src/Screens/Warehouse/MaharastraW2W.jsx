import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';
import { API_URL } from '@env';
import RNPickerSelect from 'react-native-picker-select';

const MaharastraW2W = () => {
  const [systemItems, setSystemItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [fromWarehouse, setFromWarehouse] = useState(null);
  const [toWarehouse, setToWarehouse] = useState(null);

  const [formData, setFormData] = useState({
    driverName: '',
    driverContact: '',
    remarks: '',
    selectedItems: [],
    quantities: {},
    serialNumber: '',
    outgoing: true,
    pickupDate: new Date().toISOString(),
    fromWarehouse: '',
    toWarehouse: '',
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch system items
        const itemsRes = await axios.get(`${API_URL}/warehouse-admin/show-system-items`);
        setSystemItems(itemsRes.data.data);
        
        // Fetch from warehouse
        const fromWhRes = await axios.get(`${API_URL}/warehouse-admin/get-warehouse`);
        const fromWh = {
          _id: fromWhRes.data.warehouseId,
          warehouseName: fromWhRes.data.warehouseName
        };
        setFromWarehouse(fromWh);
        
        // Fetch all warehouses for destination
        const toWhRes = await axios.get(`${API_URL}/warehouse-admin/all-warehouses`);
        setWarehouses(toWhRes.data.allWarehouses.filter(wh => wh._id !== fromWh._id));
        
        setFormData(prev => ({
          ...prev,
          fromWarehouse: fromWh._id,
          selectedItems: [],
        }));
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to fetch initial data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = searchText => {
    if (!searchText) {
      setSystemItems(systemItems);
      return;
    }
    const filtered = systemItems.filter(item =>
      item.itemName.toLowerCase().includes(searchText.toLowerCase()),
    );
    setSystemItems(filtered);
  };

  const handleItemSelect = selected => {
    const validItems = selected.filter(item =>
      systemItems.some(systemItem => systemItem.itemName === item),
    );
    setSelectedItems(validItems);

    setFormData(prevData => ({
      ...prevData,
      selectedItems: validItems,
      quantities: validItems.reduce((acc, item) => {
        acc[item] = prevData.quantities[item] || '';
        return acc;
      }, {}),
    }));
  };

  const handleQuantityChange = (itemName, quantity) => {
    setFormData(prevData => ({
      ...prevData,
      quantities: {
        ...prevData.quantities,
        [itemName]: quantity,
      },
    }));
  };

  const validateInput = () => {
    const { driverName, driverContact, selectedItems, quantities, fromWarehouse, toWarehouse } = formData;

    if (!driverName || !driverContact) {
      Alert.alert('Error', 'Please enter driver details');
      return false;
    }

    if (!fromWarehouse || !toWarehouse) {
      Alert.alert('Error', 'Please select both source and destination warehouses');
      return false;
    }

    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return false;
    }

    for (const item of selectedItems) {
      const quantity = quantities[item];
      if (!quantity || isNaN(quantity)) {
        Alert.alert('Error', `Please enter a valid quantity for ${item}`);
        return false;
      }
      if (parseInt(quantity, 10) <= 0) {
        Alert.alert('Error', `Quantity for ${item} must be greater than 0`);
        return false;
      }
    }

    if (isNaN(Number(driverContact))) {
      Alert.alert('Error', 'Driver contact must be a valid number');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;
    setLoading(true);

    const { driverName, driverContact, selectedItems, quantities, remarks, serialNumber, fromWarehouse, toWarehouse } = formData;

    const itemsList = selectedItems.map(itemName => {
      const systemItem = systemItems.find(item => item.itemName === itemName);
      return {
        systemItemId: systemItem._id,
        quantity: parseInt(quantities[itemName], 10),
      };
    });

    const data = {
      fromWarehouse,
      toWarehouse,
      itemsList,
      driverName,
      driverContact: Number(driverContact),
      remarks,
      serialNumber: serialNumber || "", // Empty string if not provided
      outgoing: true,
      pickupDate: new Date().toISOString(),
    };

    console.log("Data to be sent:", JSON.stringify(data, null, 2));

    try {
      const response = await axios.post(
        `${API_URL}/warehouse-admin/wtow-transaction`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      resetForm();
      Alert.alert('Success', 'Transfer created successfully');
      console.log("response data:", response.data);
    } catch (error) {
      console.log('Transfer error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      driverName: '',
      driverContact: '',
      remarks: '',
      selectedItems: [],
      quantities: {},
      serialNumber: '',
      outgoing: true,
      pickupDate: new Date().toISOString(),
      fromWarehouse: fromWarehouse?._id || '',
      toWarehouse: '',
    });
    setSelectedItems([]);
    setToWarehouse(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Warehouse Transfer</Text>

      <Text style={styles.label}>Select Items:</Text>
        <MultiSelect
          hideTags
          items={systemItems}
          uniqueKey="itemName"
          onSelectedItemsChange={handleItemSelect}
          selectedItems={selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          onSearch={handleSearch}
          displayKey="itemName"
          hideSubmitButton
          styleListContainer={styles.listContainer}
          textColor="#000"
        />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>From Warehouse:</Text>
        {fromWarehouse ? (
          <View style={styles.warehouseDisplay}>
            <Text style={styles.warehouseText}>{fromWarehouse.warehouseName}</Text>
          </View>
        ) : (
          <ActivityIndicator size="small" color="#000" />
        )}

        <Text style={styles.label}>To Warehouse:</Text>
        <RNPickerSelect
          onValueChange={(value) => {
            setToWarehouse(warehouses.find(wh => wh._id === value));
            setFormData(prev => ({ ...prev, toWarehouse: value }));
          }}
          items={warehouses.map(wh => ({
            label: wh.warehouseName,
            value: wh._id,
            key: wh._id,
          }))}
          value={toWarehouse?._id}
          placeholder={{ label: 'Select destination warehouse', value: null }}
          style={pickerSelectStyles}
        />

        {formData.selectedItems.map(item => (
          <View key={item} style={styles.itemContainer}>
            <Text style={styles.itemLabel}>{item}</Text>

            <Text style={styles.label}>Quantity:</Text>
            <TextInput
              value={formData.quantities[item]?.toString()}
              onChangeText={value => handleQuantityChange(item, value)}
              placeholder="Enter quantity"
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#000"
            />
          </View>
        ))}

        <Text style={styles.label}>Driver Name:</Text>
        <TextInput
          value={formData.driverName}
          onChangeText={value => setFormData(prev => ({ ...prev, driverName: value }))}
          placeholder="Enter Driver Name"
          style={styles.input}
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Driver Contact:</Text>
        <TextInput
          value={formData.driverContact}
          onChangeText={value => setFormData(prev => ({ ...prev, driverContact: value }))}
          placeholder="Enter Driver Contact"
          style={styles.input}
          keyboardType="phone-pad"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Remarks:</Text>
        <TextInput
          value={formData.remarks}
          onChangeText={value => setFormData(prev => ({ ...prev, remarks: value }))}
          placeholder="Enter Remarks"
          style={[styles.input, styles.remarksInput]}
          multiline
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Serial Number:</Text>
        <TextInput
          value={formData.serialNumber}
          onChangeText={value => setFormData(prev => ({ ...prev, serialNumber: value }))}
          placeholder="Enter Serial Number"
          style={styles.input}
          placeholderTextColor="#888"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Transfer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbd33b',
    padding: width * 0.04,
  },
  scrollContainer: {
    paddingBottom: height * 0.05,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontWeight: '600',
    marginVertical: 8,
    color: '#333',
  },
  itemLabel: {
    fontWeight: '600',
    marginTop: 15,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  remarksInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#070604',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fbd33b',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    maxHeight: 200,
  },
  itemContainer: {
    marginBottom: 10,
  },
  warehouseDisplay: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  warehouseText: {
    fontSize: 16,
    color: '#333',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  inputAndroid: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#888',
  },
});

export default MaharastraW2W;