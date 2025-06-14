import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';

const ShowOutgoingHistoryMh = () => {
    const [outgoingHistory, setOutgoingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOutgoingHistory = async () => {
            try {
                const response = await axios.get(`${API_URL}/warehouse-admin/show-outgoing-item`);
                if (response.data.success) {
                    setOutgoingHistory(response.data.data);
                } else {
                    setError(response.data.message || "Failed to fetch data");
                }
            } catch (err) {
                console.log("Show Error", err);
                setError("An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchOutgoingHistory();
    }, []);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Outgoing Items</Text>

            {outgoingHistory.map((item, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.cardRow}>
                        <Text style={styles.label}>Serial Number:</Text>
                        <Text style={styles.value}>{item.serialNumber}</Text>
                    </View>
                    <View style={styles.cardRow}>
                        <Text style={styles.label}>From Warehouse:</Text>
                        <Text style={styles.value}>{item.fromWarehouse?.warehouseName || "N/A"}</Text>
                    </View>
                    <View style={styles.cardRow}>
                        <Text style={styles.label}>To Warehouse:</Text>
                        <Text style={styles.value}>{item.toWarehouse?.warehouseName || "N/A"}</Text>
                    </View>
                    <View style={styles.cardRow}>
                        <Text style={styles.label}>Pickup Date:</Text>
                        <Text style={styles.value}>{formatDate(item.pickupDate)}</Text>
                    </View>
                    <View style={styles.cardRow}>
                        <Text style={styles.label}>Driver:</Text>
                        <Text style={styles.value}>{item.driverName} ({item.driverContact})</Text>
                    </View>
                    <View style={styles.cardRow}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={styles.value}>{item.status ? "Completed" : "Pending"}</Text>
                    </View>

                    <Text style={[styles.label, { marginTop: 10 }]}>Items:</Text>
                    {item.itemsList.map((itemDetail, itemIndex) => (
                        <View key={itemIndex} style={styles.itemRow}>
                            <Text style={styles.itemName}>{itemDetail.systemItemId?.itemName}</Text>
                            <Text style={styles.itemQuantity}>Qty: {itemDetail.quantity}</Text>
                        </View>
                    ))}

                    {item.remarks && (
                        <View style={styles.remarksContainer}>
                            <Text style={styles.label}>Remarks:</Text>
                            <Text style={styles.remarksText}>{item.remarks}</Text>
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    label: {
        fontWeight: "bold",
        color: "#555",
        fontSize: 16,
    },
    value: {
        color: "#333",
        fontSize: 16,
        flexShrink: 1,
        textAlign: 'right',
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    itemName: {
        fontSize: 15,
        color: "#444",
    },
    itemQuantity: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#444",
    },
    remarksContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    remarksText: {
        fontSize: 15,
        color: "#555",
        marginTop: 4,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        color: "red",
        fontSize: 16,
    },
});

export default ShowOutgoingHistoryMh;