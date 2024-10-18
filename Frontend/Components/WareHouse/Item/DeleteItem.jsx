import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text, Alert} from 'react-native';
import axios from 'axios';

const DeleteItem = () => {
  const [itemName, setItemName] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = async () => {
    const itemData = {
      name: itemName,
      stock: parseInt(stock, 10),
    };

    try {
      const response = await axios.post(
        'http://192.168.68.104:8080/warehouse-admin/deleteItem',
        itemData,
      );
      console.log('Response:', response.data);
      Alert.alert('Success', 'Item delete successfully!');

      setItemName('');
      setStock('');
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'There was an error adding the item.');
    }
  };

  return (
    <View style={styles.container}>
      {data !== null &&
        data.map(({_id, itemName, stock}) => (
          <View key={_id} style={styles.card}>
            <Text style={styles.cardTitle}>{itemName}</Text>
            <Text style={styles.cardValue}>{stock ? stock : 0}</Text>
          </View>
        ))}
      <Button title="Delete Item" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default DeleteItem;
