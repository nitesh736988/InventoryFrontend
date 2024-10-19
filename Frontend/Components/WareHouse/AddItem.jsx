import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios'; 
import { API_URL } from '@env';

const AddItem = () => {
    const [itemName, setItemName] = useState('');
    const [stock, setStock] = useState('');

    const handleSubmit = async () => {
        const itemData = {
            name: itemName,
            stock: parseInt(stock, 10), 
        };

        try {
            const response = await axios.post(`${API_URL}/warehouse-admin/newItem`, itemData);
            console.log('Response:', response.data);
            Alert.alert('Success', 'Item added successfully!');

            setItemName('');
            setStock('');
        } catch (error) {
            console.error('Error adding item:', error);
            Alert.alert('Error', 'There was an error adding the item.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Item Name:</Text>
            <TextInput
                style={styles.input}
                value={itemName}
                onChangeText={setItemName}
            />
            <Text style={styles.label}>Stock:</Text>
            <TextInput
                style={styles.input}
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
            />
            <Button title="Add Item" onPress={handleSubmit} />
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
    },
    input: {
        borderWidth: 1,
        borderColor: '#070604',  
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff', 
    },
});

export default AddItem;
