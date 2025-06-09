import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import { API_URL } from '@env';

const AddItem = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [otherInput, setOtherInput] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/all-items`);
      const itemNames = response.data.data[0].items.map(item => ({
        label: item.itemName,
        value: item.itemName
      }));
      itemNames.push({ label: 'Other', value: 'other' });
      setItems(itemNames);
    } catch (error) {
      console.log('Error fetching items:', error);
      Alert.alert('Error', 'Failed to fetch existing items');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (selected) => {
    setSelectedItems(selected);
    const otherSelected = selected.includes('other');
    setShowOtherInput(otherSelected);
    if (!otherSelected) {
      setOtherInput('');
    }
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0 && !otherInput.trim()) {
      Alert.alert('Error', 'Please select at least one item or specify a new item');
      return;
    }

    if (showOtherInput && !otherInput.trim()) {
      Alert.alert('Error', 'Please specify the "Other" item name');
      return;
    }

    setSubmitting(true);
    
    try {
      const itemsToAdd = [];
      
      // Add selected existing items
      selectedItems.forEach(item => {
        if (item !== 'other') {
          itemsToAdd.push({ itemName: item });
        }
      });
      
      // Add new "other" item if specified
      if (showOtherInput && otherInput.trim()) {
        itemsToAdd.push({ itemName: otherInput.trim() });
      }

      const response = await axios.post(`${API_URL}/admin/add-item`, {
        items: itemsToAdd
      });
      
      Alert.alert('Success', 'Items added successfully!');
      setSelectedItems([]);
      setOtherInput('');
      setShowOtherInput(false);
      fetchItems(); // Refresh the list of items
    } catch (error) {
      console.error('Error adding items:', error);
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        {selectedItems.includes(item.value) && (
          <AntDesign style={styles.icon} color="black" name="check" size={20} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.label}>Select existing items or add new ones:</Text>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            search
            data={items}
            labelField="label"
            valueField="value"
            placeholder="Select items"
            searchPlaceholder="Search..."
            value={selectedItems}
            onChange={handleSelectionChange}
            renderItem={renderItem}
            renderSelectedItem={(item, unSelect) => (
              <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                <View style={styles.selectedStyle}>
                  <Text style={styles.textSelectedStyle}>{item.label}</Text>
                  <AntDesign color="black" name="close" size={17} />
                </View>
              </TouchableOpacity>
            )}
          />

          {showOtherInput && (
            <TextInput
              style={styles.otherInput}
              placeholder="Enter new item name"
              value={otherInput}
              onChangeText={setOtherInput}
              placeholderTextColor="#999"
            />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Add Items</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderColor: '#070604',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'black',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
    color: 'black',
  },
  otherInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: 'black',
  },
  button: {
    backgroundColor: '#070604',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddItem;