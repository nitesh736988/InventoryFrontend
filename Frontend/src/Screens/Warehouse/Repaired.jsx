import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import api from '../../auth/api';;
import {API_URL} from '@env';
import { useNavigation } from '@react-navigation/native';

const Repaired = () => {
  const [itemName, setItemName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [repairedBy, setRepairedBy] = useState('');
  const [remark, setRemark] = useState('');
  const [items, setItems] = useState([]);
  const [repaired, setRepaired] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(''); 
  const [changeMaterial, setChangeMaterial] = useState('');

const navigation = useNavigation()
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get(
          `${API_URL}/warehouse-admin/view-items`,
        );
        const items = response.data.items.map((item, index) => ({
          _id: index + 1,
          itemName: item,
        }));
        setItems(items);
      } catch (error) {
        console.log(
          'Error fetching items:',
          error.response?.data || error.message,
        );
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to fetch items.',
        );
      }
    };

    fetchItems();
  }, []);

  const handleSubmit = async () => {
    if (!itemName || !serialNumber || !repaired || !repairedBy || (!selectedValue === "other" && remark) || !selectedValue) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    const newItem = {
      itemName,
      serialNumber,
      repaired,
      repairedBy,
      remark: selectedValue === 'other' ? remark : selectedValue,
      changeMaterial,
      createdAt: new Date(),
    };

    try {
      setLoading(true);
      const response = await api.post(
        `${API_URL}/warehouse-admin/repair-item`,
        newItem,
      );

      console.log("send data", response)

      
      Alert.alert('Success', 'Item repaired data has been submitted.');
      setItemName('');
      setSerialNumber('');
      setRepaired('');
      setRepairedBy('');
      setRemark('');
      setSelectedValue('');
      setChangeMaterial("");
      navigation.navigate('WarehouseNavigation');
    } catch (error) {
      console.log(
        'Error submitting data:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Something went wrong while submitting.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Repaired Items Form</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Item Name:</Text>
        <Picker
          selectedValue={itemName}
          onValueChange={setItemName}
          style={styles.input}>
          <Picker.Item label="Select Item" value="" />
          {items.map(item => (
            <Picker.Item
              key={item._id}
              label={item.itemName}
              value={item.itemName}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Repaired Quantity:</Text>
        <TextInput
          value={repaired}
          onChangeText={setRepaired}
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Serial Number:</Text>
        <TextInput
          value={serialNumber}
          onChangeText={setSerialNumber}
          style={styles.input}
        />

        <Text style={styles.label}>Repaired By:</Text>
        <TextInput
          value={repairedBy}
          onChangeText={setRepairedBy}
          style={styles.input}
        />


      <Text style={styles.label}>Select an Issue:</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select an issue..." value="" />
        <Picker.Item label="Controller IGBT Issue" value="Controller IGBT Issue" />
        <Picker.Item label="Controller Display Issue" value="Controller Display Issue" />
        <Picker.Item label="Winding Problem" value="Winding Problem" />
        <Picker.Item label="Bush Problem" value="Bush Problem" />
        <Picker.Item label="Stamping Damaged" value="Stamping Damaged" />
        <Picker.Item label="Thrust Plate Damage" value="Thrust Plate Damage" />
        <Picker.Item label="Shaft and Rotor Damaged" value="Shaft and Rotor Damaged" />
        <Picker.Item label="Bearing plate damaged" value="Bearing plate damaged" />
        <Picker.Item label="Oil Seal Damaged" value="Oil Seal Damaged" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      {selectedValue === 'other' && (
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter remarks..."
          placeholderTextColor="gray"
          value={remark}
          onChangeText={setRemark}
          multiline
          numberOfLines={4}
        />
      )}

        <Text style={styles.label}>Change Material:</Text>
        <TextInput
          value={changeMaterial}
          onChangeText={setChangeMaterial}
          style={[styles.inputdata, styles.textArea]}
          placeholder='write here'
          placeholderTextColor= '#000'
          multiline
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#070604',
  },

  inputdata: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#070604',
    marginBottom: 15,
  },

  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },

  form: {
    padding: 15,
    backgroundColor: '#fbd33b',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#070604',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    color: '#070604',
  },
  button: {
    backgroundColor: '#070604',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fbd33b',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Repaired;
