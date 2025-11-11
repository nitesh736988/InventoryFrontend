// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import axios from 'axios';
// import MultiSelect from 'react-native-multiple-select';
// import {API_URL} from '@env';
// import {useNavigation} from '@react-navigation/native';

// const InstallationStock = () => {
//   const [allItems, setAllItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const navigation = useNavigation();
//   const [isButtonHidden, setIsButtonHidden] = useState(true);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/service-person/show-holding-items`);
//         console.log('Stock data:', response.data);
//         const items = response.data.items.map((item) => ({
//           _id: item._id,
//           itemName: item.itemName,
//         }));
//         setAllItems(items);
//         setFilteredItems(items);
//       } catch (error) {
//         Alert.alert("Error", JSON.stringify(error.response.data?.message));
//       }
//     };

//     fetchItems();
//   }, []);

//   const handleItemSelect = (selectedItems) => {
//     setSelectedItems(selectedItems);
//     setIsButtonHidden(selectedItems.length === 0);
//   };

//   const handleQuantityChange = (item, value) => {
//     setQuantities((prevQuantities) => ({
//       ...prevQuantities,
//       [item]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     const selectedData = selectedItems.map((item) => ({
//       itemName: item,
//       quantity: Number(quantities[item]) || 0,
//     }));
  
//     console.log('Selected Data:', { items: selectedData });
  
//     try {
//       const response = await axios.put(
//         '${API_URL}/service-person/update-holding-items',
//         { items: selectedData }
//       );
//         Alert.alert('Success', 'Items updated successfully');
//         navigation.goBack();
//     } catch (error) {
//       console.log('Error submitting data:', error?.response?.data || error.message);
//       Alert.alert('Error',(error?.response?.data?.message || error.message));
//     }
//   };
  

//   return (
//     <View style={styles.itemSelectionContainer}>
//       <Text style={styles.label}>Select Items:</Text>
//       <MultiSelect
//         items={filteredItems}
//         uniqueKey="itemName"
//         onSelectedItemsChange={handleItemSelect}
//         selectedItems={selectedItems}
//         selectText="Pick Items"
//         searchInputPlaceholderText="Search Items..."
//         displayKey="itemName"
//         hideSubmitButton
//         styleListContainer={styles.listContainer}
//         textColor="#000"
//       />

//       {selectedItems.map((item, index) => (
//         <View key={index} style={styles.itemQuantityContainer}>
//           <Text style={styles.itemText}>{item}</Text>
//           <TextInput
//             value={quantities[item]?.toString() || ''}
//             onChangeText={(value) => handleQuantityChange(item, value)}
//             keyboardType="numeric"
//             placeholder="Enter Quantity"
//             style={styles.input}
//             placeholderTextColor={'#000'}
//           />
//         </View>
//       ))}

//       {!isButtonHidden && (
//         <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   itemSelectionContainer: {
//     padding: 30,
//     height: 200,
//     padding: 20,
//     flex: 1,
//     backgroundColor: '#fbd33b'
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   listContainer: {
//     backgroundColor: '#fbd33b',
//     maxHeight: 500,
//     height: 300,
//   },
//   itemQuantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginVertical: 8,
//   },
//   itemText: {
//     fontSize: 14,
//     color: '#000',
//   },
//   input: {
//     backgroundColor: '#fbd33b',
//     borderWidth: 1,
//     borderColor: '#070604',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 20,
//     color: '#070604',
//   },
//   submitButton: {
//     backgroundColor: '#070604',
//     padding: 12,
//     marginBottom: 15,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 16,
//   },
// });

// export default InstallationStock;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import MultiSelect from 'react-native-multiple-select';
import {API_URL} from '@env';
import {useNavigation} from '@react-navigation/native';

const InstallationStock = () => {
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigation = useNavigation();
  const [isButtonHidden, setIsButtonHidden] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/service-person/show-holding-items`);
        console.log('Stock data:', response.data);
        const items = response.data.items.map((item) => ({
          _id: item._id,
          itemName: item.itemName,
        }));
        setAllItems(items);
        setFilteredItems(items);
      } catch (error) {
        Alert.alert("Error", JSON.stringify(error.response?.data?.message || error.message));
      }
    };

    fetchItems();
  }, []);

  const handleItemSelect = (selectedItems) => {
    setSelectedItems(selectedItems);
    setIsButtonHidden(selectedItems.length === 0);
  };

  const handleQuantityChange = (item, value) => {
    // Validate that the input is a positive number
    if (value === '' || /^\d+$/.test(value)) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [item]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    // Validate quantities before submission
    const hasInvalidQuantities = selectedItems.some(item => {
      const quantity = quantities[item];
      return !quantity || quantity === '' || Number(quantity) <= 0;
    });

    if (hasInvalidQuantities) {
      Alert.alert('Error', 'Please enter valid quantities for all selected items');
      return;
    }

    const selectedData = selectedItems.map((item) => ({
      itemName: item,
      quantity: Number(quantities[item]) || 0,
    }));

    console.log('Selected Data:', { items: selectedData });

    try {
      // FIXED: Using backticks instead of single quotes for template literal
      const response = await axios.put(
        `${API_URL}/service-person/update-holding-items`,
        { items: selectedData }
      );
      console.log('Response data:', response.data);
      Alert.alert('Success', 'Items updated successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Error submitting data:', error?.response?.data || error.message);
      Alert.alert('Error', (error?.response?.data?.message || error.message));
    }
  };

  return (
    <View style={styles.itemSelectionContainer}>
      <Text style={styles.label}>Select Items:</Text>
      <MultiSelect
        items={filteredItems}
        uniqueKey="itemName"
        onSelectedItemsChange={handleItemSelect}
        selectedItems={selectedItems}
        selectText="Pick Items"
        searchInputPlaceholderText="Search Items..."
        displayKey="itemName"
        hideSubmitButton
        styleListContainer={styles.listContainer}
        textColor="#000"
      />

      {selectedItems.map((item, index) => (
        <View key={index} style={styles.itemQuantityContainer}>
          <Text style={styles.itemText}>{item}</Text>
          <TextInput
            value={quantities[item]?.toString() || ''}
            onChangeText={(value) => handleQuantityChange(item, value)}
            keyboardType="numeric"
            placeholder="Enter Quantity"
            style={styles.input}
            placeholderTextColor={'#000'}
          />
        </View>
      ))}

      {!isButtonHidden && (
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemSelectionContainer: {
    padding: 20, // FIXED: Removed duplicate padding property
    flex: 1,
    backgroundColor: '#fbd33b'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  listContainer: {
    backgroundColor: '#fbd33b',
    maxHeight: 500,
    height: 300,
  },
  itemQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 5,
    padding: 10,
    width: 120,
    color: '#070604',
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#070604',
    padding: 12,
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InstallationStock;