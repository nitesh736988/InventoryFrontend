import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import api from '../../auth/api';;
import {API_URL} from '@env';

const ApprovalIncomingInstallation = () => {
  const [outgoingHistory, setOutgoingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    fetchOutgoingHistory();
  }, []);

  const fetchOutgoingHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${API_URL}/warehouse-admin/show-incoming-item`,
      );
      if (response.data.success) {
        setOutgoingHistory(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.log('Show Error', err);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transferId) => {
    try {
      setApprovingId(transferId);
      
      const requestData = {
        transactionId: transferId,
        status: true,
        arrivedDate: new Date().toISOString()
      };

      const response = await api.put(
        `${API_URL}/warehouse-admin/approve-incoming-item`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        fetchOutgoingHistory();
      } else {
        setError(response.data.message || 'Failed to approve transfer');
      }
    } catch (err) {
      console.log('Approve Error', err);
      setError('An error occurred while approving transfer');
    } finally {
      setApprovingId(null);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && outgoingHistory.length === 0) {
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
      <Text style={styles.header}>Incoming Items</Text>

      {outgoingHistory.length === 0 ? (
        <Text style={styles.noItems}>No incoming items found</Text>
      ) : (
        outgoingHistory.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Serial Number:</Text>
              <Text style={styles.value}>{item.serialNumber}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>From Warehouse:</Text>
              <Text style={styles.value}>
                {item.fromWarehouse?.warehouseName || 'N/A'}
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>To Warehouse:</Text>
              <Text style={styles.value}>
                {item.toWarehouse?.warehouseName || 'N/A'}
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Pickup Date:</Text>
              <Text style={styles.value}>{formatDate(item.pickupDate)}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Driver:</Text>
              <Text style={styles.value}>
                {item.driverName} ({item.driverContact})
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Status:</Text>
              <Text
                style={[
                  styles.value,
                  {color: item.status ? 'green' : 'orange'},
                ]}>
                {item.status ? 'Completed' : 'Pending'}
              </Text>
            </View>

            <Text style={[styles.label, {marginTop: 10}]}>Items:</Text>
            {item.itemsList.map((itemDetail, itemIndex) => (
              <View key={itemIndex} style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {itemDetail.systemItemId?.itemName}
                </Text>
                <Text style={styles.itemQuantity}>
                  Qty: {itemDetail.quantity}
                </Text>
              </View>
            ))}

            {item.remarks && (
              <View style={styles.remarksContainer}>
                <Text style={styles.label}>Remarks:</Text>
                <Text style={styles.remarksText}>{item.remarks}</Text>
              </View>
            )}

            {!item.status && (
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => handleApprove(item._id)}
                disabled={approvingId === item._id}>
                {approvingId === item._id ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.approveButtonText}>Approve</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 16,
  },
  value: {
    color: '#333',
    fontSize: 16,
    flexShrink: 1,
    textAlign: 'right',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  itemName: {
    fontSize: 15,
    color: '#444',
  },
  itemQuantity: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
  },
  remarksContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  remarksText: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  noItems: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    marginTop: 15,
    alignItems: 'center',
  },
  approveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ApprovalIncomingInstallation;