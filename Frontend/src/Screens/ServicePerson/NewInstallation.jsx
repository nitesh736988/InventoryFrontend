import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';

const NewInstallation = () => {
  const [formData, setFormData] = useState({
    items: [],
    installationDate: new Date(),
    itemList: [],
  });

  useEffect(() => {
    const fetchItemList = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        console.log('Product Data:', response.data.products);
        setFormData(prevData => ({
          ...prevData,
          itemList: response.data.products.map(product => ({
            id: product.id,
            itemName: product.title,
          })),
        }));
      } catch (error) {
        console.log('Failed to fetch items:', error);
      }
    };

    fetchItemList();
  }, []);

  const handleItemSelect = selected => {
    setFormData(prevData => ({
      ...prevData,
      items: selected,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select Items:</Text>
      <MultiSelect
        items={formData.itemList}
        uniqueKey="id"
        onSelectedItemsChange={handleItemSelect}
        selectedItems={formData.items}
        selectText="Pick Items"
        searchInputPlaceholderText="Search Items..."
        displayKey="itemName"
        hideSubmitButton
        styleListContainer={styles.listContainer}
        textColor="#000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: '#fbd33b',
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 10,
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
});

export default NewInstallation;
