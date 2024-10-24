import React, { useEffect, useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation(); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [checked, setChecked] = useState('in');
  const [ isRefreshClicked, setIsRefreshClicked ] = useState(false);
  const [ selectedWherehouse, setSelectedWherehouse ] = useState('');
  const [ placeName, setPlaceName ] = useState('');
  const [ defectiveItems, setDefectiveItems ] = useState(0);
  const [ clickedItemName, setClickedItemName ] = useState('');

  const fetchData = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(
        'http://88.222.214.93:8000/admin/viewItems',
        { timeout: 2000 }
      );
      const result = response.data.data;
      setData(result);
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error.response));
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
      setIsRefreshClicked(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isRefreshClicked) {
      fetchData();
    }
  }, [isRefreshClicked]);

  const handleUpdate = async () => {
    try {
      console.log({ itemName: clickedItemName, quantity: updatedQuantity, defectiveItem: defectiveItems, warehouse: selectedWherehouse, itemComingFrom: placeName })
      const updatedStock =
        checked === 'in'
          ? parseInt(selectedItem.stock) + parseInt(updatedQuantity)
          : parseInt(selectedItem.stock) - parseInt(updatedQuantity);

      if (updatedStock < 0) {
        Alert.alert('Error', 'Stock cannot be negative');
        return;
      }

      const response = await axios.post(
        `http://88.222.214.93:8000/warehouse-admin/updateItem`,
        { itemName: clickedItemName, quantity: updatedQuantity, defectiveItem: defectiveItems, warehouse: selectedWherehouse, itemComingFrom: placeName }
      );
      if(response.status === 200){
        Alert.alert('Success', 'Item updated successfully');
      }

      const updatedData = data.map(item =>
        item._id === selectedItem._id
          ? { ...item, stock: updatedStock }
          : item
      );
      setData(updatedData);
      setModalVisible(false);
    } catch (error) {
      console.log(error);
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
      { cancelable: false }
    );
  };

  const handleDelete = async _id => {
    try {
      await axios.delete(`${API_URL}/warehouse-admin/deleteItem/${_id}`);
      Alert.alert('Success', 'Item deleted successfully');
      setData(data.filter(item => item._id !== _id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const handleQuantityChange = action => {
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
          data.map(({ _id, itemName, stock }) => (
            <View key={_id} style={styles.card}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem({ _id, itemName, stock });
                  setClickedItemName(itemName);
                  setUpdatedQuantity(stock.toString());
                  setModalVisible(true);
                }}
                style={styles.cardContent}>
                <Text style={styles.cardTitle}>{itemName}</Text>
                <Text style={styles.cardValue}>{stock ? stock : 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => confirmDelete(_id)}>
                <Icon name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 40, right: 40 }}
          onPress={() => {
            setIsRefreshClicked(true);
          }}>
          <Icon name="refresh" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ServicePersonRegistration')}>
          <Text style={styles.buttonText}>Service Person Registration</Text>
        </TouchableOpacity>
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
                <Picker
                  selectedValue={selectedWherehouse}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedWherehouse(itemValue)}
                >
                  <Picker.Item label="Select the wherehouse" value="" />
                  <Picker.Item label="Bhiwani" value="Bhiwani" />
                  <Picker.Item label="Sirsa" value="Sirsa" />
                  <Picker.Item label="Hisar" value="Hisar" />
                </Picker>
                <View>
                  <Text>From</Text>
                  <TextInput 
                      style={{ paddingHorizontal: 5, paddingVertical: 5, borderWidth: 1, marginBottom: 10, borderRadius: 5}}
                      value={placeName}
                      onChangeText={setPlaceName}
                      keyboardType="text"
                      placeholder="Enter the place"
                  />
                </View>
                <View>
                  <Text>Defective Items</Text>
                  <TextInput 
                      style={{ paddingHorizontal: 5, paddingVertical: 5, borderWidth: 1, marginBottom: 10, borderRadius: 5}}
                      value={defectiveItems}
                      onChangeText={setDefectiveItems}
                      keyboardType="numeric"
                      placeholder="Enter the defective items"
                  />
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
    backgroundColor: '#fbd33b',
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
  button: {
    backgroundColor: '#070604',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fbd33b',
    fontSize: 16,
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
