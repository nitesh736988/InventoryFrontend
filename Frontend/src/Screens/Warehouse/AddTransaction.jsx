import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';

const AddTransaction = ({route}) => {
  const {farmerComplaintId, farmerContact, farmerSaralId} = route.params || {};

  console.log("farmerComplaintId", farmerComplaintId)
  console.log("farmerContact", farmerContact)
  console.log("farmerSaralId", farmerSaralId)

  const [servicePerson, setServicePerson] = useState([]);
  const [selectedServicePerson, setSelectedServicePerson] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [status, setStatus] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchServicePersons = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/service-team/all-service-persons`,
        );
        console.log(response?.data.data);
        setServicePerson(response?.data?.data);
      } catch (error) {
        console.log('Failed to fetch service persons:', error);
      }
    };

    fetchServicePersons();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/view-items`,
        );
        const items = response?.data?.items?.map((item, index) => ({
          _id: index + 1,
          itemName: item,
        }));
        setAllItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.log('Failed to fetch items:', error);
      }
    };

    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/get-warehouse`,
        );
        setAllWarehouses(response?.data?.warehouseName);
      } catch (error) {
        console.log('Failed to fetch warehouse names:', error);
        setAllWarehouses([]);
      }
    };

    fetchItems();
    fetchWarehouses();
  }, []);

  const handleSearch = query => {
    setSearchQuery(query);
    const filtered = allItems.filter(item =>
      item.itemName.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredItems(filtered);

    if (query && filtered.length === 0) {
      Alert.alert('Error', 'No items match your search query.');
    }
  };

  const handleItemSelect = selected => {
    const validItems = selected.filter(item =>
      filteredItems.some(filteredItem => filteredItem.itemName === item),
    );
    setSelectedItems(validItems);

    const newQuantities = {};
    validItems.forEach(item => {
      newQuantities[item] = '';
    });
    setQuantities(newQuantities);
  };

  const handleQuantityChange = (item, value) => {
    setQuantities(prev => ({...prev, [item]: value}));
  };

  const validateInput = () => {
    if (!servicePerson || !farmerContact) {
      Alert.alert('Error', 'Please fill in all fields.');
      return false;
    }

    if (selectedItems.length === 0) {
      Alert.alert('Error', 'No valid items selected.');
      return false;
    }

    for (const item of selectedItems) {
      if (!quantities[item]) {
        Alert.alert('Error', `Please enter quantity for ${item}.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    const itemsData = selectedItems.map(item => ({
      itemName: item,
      quantity: parseInt(quantities[item], 10),
    }));

    const data = {
      farmerComplaintId,
      servicePerson: selectedServicePerson,
      farmerContact,
      items: itemsData,
      warehouse: selectedWarehouse,
      remark: remarks,
      serialNumber,
      incoming: false,
      pickupDate: new Date(),
      farmerSaralId,
    };
    console.log('data sent', data);
    try {
      const response = await axios.post(
        `${API_URL}/warehouse-admin/outgoing-items`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Transaction saved successfully');
        resetForm();
      } else {
        Alert.alert('Error', 'Failed to save transaction');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while saving the transaction');
    }
  };

  const resetForm = () => {
    setServicePerson('');
    setSelectedItems([]);
    setQuantities({});
    setRemarks('');
    setSerialNumber('');
    setSelectedWarehouse('');
  };

  return (
    <View style={styles.container}>
      
        <View style={styles.modalHeader}>
          <Text style={styles.label}>Select Items:</Text>
          <MultiSelect
            items={filteredItems}
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
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.form}>
            <Text style={styles.label}>Service Person:</Text>
            {
              console.log("all service person" , servicePerson)
            }
            <Picker
              selectedValue={selectedServicePerson}
              onValueChange={itemValue => setSelectedServicePerson(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Select Service Person" value="" />
              {(Array.isArray(servicePerson) ? servicePerson : []).map((person) => (
                <Picker.Item key={person._id} label={person.name} value={person._id} />
              ))}
            </Picker>


            <Text style={styles.label}>Farmer Contact:</Text>
            <TextInput
              style={[styles.input, styles.nonEditable]}
              value={farmerContact?.toString() || 'N/A'}
              keyboardType="phone-pad"
              editable={false}
            /> 

            <Text style={styles.label}>Farmer Saral Id</Text>
            <TextInput
              style={[styles.input, styles.nonEditable]}
              value={farmerSaralId || 'N/A'}
              editable={false}
            />

            {selectedItems.map(item => (
              <View key={item}>
                <Text style={styles.label}>Quantity for {item}:</Text>
                <TextInput
                  value={quantities[item]}
                  onChangeText={value => handleQuantityChange(item, value)}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
            ))}
            <Text style={styles.label}>Serial Number:</Text>
            <TextInput
              value={serialNumber}
              onChangeText={setSerialNumber}
              style={styles.input}
            />
            <Text style={{color: '#000'}}>Warehouse:</Text>
            <Picker
              selectedValue={selectedWarehouse}
              style={styles.picker}
              onValueChange={itemValue => setSelectedWarehouse(itemValue)}>
              <Picker.Item
                key={allWarehouses}
                label={allWarehouses}
                value={allWarehouses}
                placeholderTextColor={'#000'}
              />
            </Picker>

            <Text style={styles.label}>Remarks:</Text>
            <TextInput
              value={remarks}
              onChangeText={setRemarks}
              style={styles.textArea}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    backgroundColor: '#fbd33b',
    maxHeight: 300,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  modalHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fbd33b',
    borderBottomWidth: 1,
    borderBottomColor: '#070604',
  },
  form: {
    padding: 20,
    backgroundColor: '#fbd33b',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#070604',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    color: '#070604',
  },
  textArea: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    fontSize: 14,
    color: '#070604',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#070604',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fbd33b',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#070604',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#070604',
    flex: 1,
  },
  quantityInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    borderRadius: 5,
    padding: 5,
  },
});

export default AddTransaction;
