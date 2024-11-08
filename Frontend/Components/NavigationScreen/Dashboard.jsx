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
  ScrollView,
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
  const [ newQuantity, setNewQuantity ] = useState(10);
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
      console.log(result);
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
      console.log({ itemName: clickedItemName, quantity: newQuantity, defectiveItem: defectiveItems, warehouse: selectedWherehouse, itemComingFrom: placeName });
      const updatedStock =
        checked === 'in'
          ? parseInt(selectedItem.stock) + parseInt(newQuantity)
          : parseInt(selectedItem.stock) - parseInt(newQuantity);

      if (updatedStock < 0) {
        Alert.alert('Error', 'Stock cannot be negative');
        return;
      }

      const response = await axios.post(
        `http://88.222.214.93:8000/warehouse-admin/updateItem`,
        { itemName: clickedItemName, quantity: newQuantity, defectiveItem: defectiveItems, warehouse: selectedWherehouse, itemComingFrom: placeName, arrivedDate: Date.now() }
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

  const handleQuantityChange = action => {
    const quantity = parseInt(newQuantity) || 0;
    if (action === 'increment') {
      setNewQuantity((quantity + 1).toString());
    } else if (action === 'decrement' && newQuantity > 0) {
      setNewQuantity((quantity - 1).toString());
    }
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
      <ScrollView style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <TouchableOpacity style={{...styles.button, width: '90%'}} onPress={() => navigation.navigate('ServicePersonRegistration')}>
            <Text style={styles.buttonText}>Service Person Registration</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.refreshIcon}  
            onPress={() => {
              console.log("Refresh button clicked");
              setIsRefreshClicked(true);
            }}
          >
            <Icon style={{ textAlign: 'right' }} name="refresh" size={30} color="black" />
          </TouchableOpacity>
        </View>
        
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
                style={styles.cardContent}
              >
                <Text style={styles.cardTitle}>{itemName}</Text>
                <Text style={styles.cardValue}>{stock ? stock : 0}</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Update Item</Text>
              <Text style={styles.modalItemName}>{selectedItem.itemName}</Text>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange('decrement')}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  value={newQuantity}
                  onChangeText={setNewQuantity}
                  keyboardType="numeric"
                  placeholder="Enter new quantity"
                />

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange('increment')}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <Picker
                selectedValue={selectedWherehouse}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedWherehouse(itemValue)}
              >
                <Picker.Item label="Select the warehouse" value="" />
                <Picker.Item label="Bhiwani" value="Bhiwani" />
                <Picker.Item label="Sirsa" value="Sirsa" />
                <Picker.Item label="Hisar" value="Hisar" />
              </Picker>

              <View>
                <Text style={{ color: 'black' }}>From</Text>  
                <TextInput 
                  style={{ paddingHorizontal: 5, paddingVertical: 5, borderWidth: 1, marginBottom: 10, borderRadius: 5 }}
                  value={placeName}
                  onChangeText={setPlaceName}
                  placeholder="Enter the place"
                />
              </View>

              <View>
                <Text style={{ color: 'black' }}>Defective Items</Text>
                <TextInput 
                  style={{ paddingHorizontal: 5, paddingVertical: 5, borderWidth: 1, marginBottom: 10, borderRadius: 5 }}
                  value={defectiveItems.toString()}
                  onChangeText={(value) => setDefectiveItems(parseInt(value) || 0)}
                  keyboardType="numeric"
                  placeholder="Enter the defective items"
                />
              </View>

              <Button title="Submit" onPress={handleUpdate} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => {
                  setModalVisible(false);
                  setNewQuantity(0);
                }}
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
  refreshIcon: {},
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
    fontWeight: 'bold',
    color: '#070604',    
  },
  cardValue: {
    fontSize: 32,
    // fontWeight: 'bold',
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
  modalContainer: {
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
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#fff',
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
  picker: {
    backgroundColor: '#222', 
    marginBottom: 20,
  },
});

export default Dashboard;
