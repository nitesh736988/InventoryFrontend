import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios'; 
import { API_URL } from '@env';

const AddItem = () => {
    const [itemName, setItemName] = useState('');
    const [stock, setStock] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!itemName || !stock) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }

        const stockValue = parseInt(stock, 10);
        if (isNaN(stockValue) || stockValue < 0) {
            Alert.alert('Error', 'Stock must be a positive integer.');
            return;
        }

        const itemData = {
            itemName,
            stock: stockValue, 
        };

        setLoading(true);

        try {
            console.log(itemData)
            const response = await axios.post(`${API_URL}/warehouse-admin/newItem`, itemData);
            console.log(response);
            console.log('Response:', response.data);
            Alert.alert('Success', 'Item added successfully!');

            setItemName('');
            setStock('');
        } catch (error) {
            console.log('Error adding item:', error);
            Alert.alert('Error', 'Failed to add item. Please try again.');
        } finally {
            setLoading(false);
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
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                {loading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.buttonText}>Add Item</Text>
                )}
            </TouchableOpacity>
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
    button: {
        backgroundColor: '#070604', 
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff', 
        fontSize: 16,
    },
});

export default AddItem;
