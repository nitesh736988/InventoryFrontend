import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import {RadioButton} from 'react-native-paper';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [checked, setChecked] = useState('in'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://192.168.68.104:8080/admin/viewItems',
          {timeout: 2000},
        );
        const result = await response.data.data;
        setData(result);
      } catch (error) {
        Alert.alert('Error', JSON.stringify(error.response));
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const updatedStock =
        checked === 'in'
          ? parseInt(selectedItem.stock) + parseInt(updatedQuantity)
          : parseInt(selectedItem.stock) - parseInt(updatedQuantity);

      if (updatedStock < 0) {
        Alert.alert('Error', 'Stock cannot be negative');
        return;
      }

      const response = await axios.post(
        `http://192.168.68.104:8080/admin/updateItem/${selectedItem._id}`,
        {stock: updatedStock},
      );
      Alert.alert('Success', 'Item updated successfully');

      const updatedData = data.map(item =>
        item._id === selectedItem._id
          ? {...item, stock: updatedStock}
          : item,
      );
      setData(updatedData);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const confirmDelete = _id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'No',
          onPress: () => console.log('Deletion canceled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => handleDelete(_id),
        },
      ],
      {cancelable: false},
    );
  };

  const handleDelete = async _id => {
    try {
      await axios.delete(`http://192.168.68.104:8080/admin/deleteItem/${_id}`);
      Alert.alert('Success', 'Item deleted successfully');
      setData(data.filter(item => item._id !== _id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  // Function to handle increment and decrement
  const handleQuantityChange = (action) => {
    let newQuantity = parseInt(updatedQuantity);
    if (action === 'increment') {
      newQuantity += 1;
    } else if (action === 'decrement' && newQuantity > 0) {
      newQuantity -= 1;
    }
    setUpdatedQuantity(newQuantity.toString());
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {data !== null &&
          data.map(({_id, itemName, stock}) => (
            <View key={_id} style={styles.card}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem({_id, itemName, stock});
                  setUpdatedQuantity(stock.toString());
                  setModalVisible(true);
                }}
                style={styles.cardContent}>
                <Text style={styles.cardTitle}>{itemName}</Text>
                <Text style={styles.cardValue}>{stock ? stock : 0}</Text>
              </TouchableOpacity>

              {/* Delete Icon */}
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => confirmDelete(_id)}>
                <Icon name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
      </View>

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Update Item</Text>
              <Text style={styles.modalItemName}>{selectedItem.itemName}</Text>

              {/* Quantity Input with + and - buttons */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange('decrement')}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  value={updatedQuantity}
                  onChangeText={setUpdatedQuantity}
                  keyboardType="numeric"
                  placeholder="Enter new quantity"
                />

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange('increment')}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text>Select Option:</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton
                  value="in"
                  status={checked === 'in' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('in')}
                />
                <Text>In</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton
                  value="out"
                  status={checked === 'out' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('out')}
                />
                <Text>Out</Text>
              </View>
              <Button title="Submit" onPress={handleUpdate} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#888',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  deleteIcon: {
    padding: 10,
  },
  modalContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalItemName: {
    fontSize: 18,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
    flex: 1,
  },
});

export default Dashboard;
