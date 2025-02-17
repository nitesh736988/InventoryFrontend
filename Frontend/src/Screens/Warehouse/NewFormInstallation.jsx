import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import axios from 'axios';
import MultiSelect from 'react-native-multiple-select';
import {API_URL} from '@env';
import {Picker} from '@react-native-picker/picker';

const NewFormInstallation = () => {
  const [servicePersons, setServicePersons] = useState([]);
  const [systems, setSystems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedServicePerson, setSelectedServicePerson] = useState('');
  const [systemId, setSystemId] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [panelNumbers, setPanelNumbers] = useState([]);
  const [pumpNumber, setPumpNumber] = useState();
  const [controllerNumber, setControllerNumber] = useState();
  const [rmuNumber, setRmuNumber] = useState();

  useEffect(() => {
    const fetchServicePersons = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/service-team/all-service-persons`,
        );
        setServicePersons(response.data.data);
      } catch (error) {
        console.log('Failed to fetch service persons:', error);
      }
    };

    fetchServicePersons();
  }, []);

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const {data} = await axios.get(
          `${API_URL}/warehouse-admin/show-systems`,
        );
        setSystems(data.data);
      } catch (error) {
        console.log('Error fetching systems:', error);
        Alert.alert('Error', 'Unable to fetch systems.');
      }
    };

    fetchSystems();
  }, []);

  useEffect(() => {
    if (!systemId) return;

    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        const {data} = await axios.get(
          `${API_URL}/warehouse-admin/show-subItems?systemId=${systemId}`,
        );
        setItems(data.data);
      } catch (error) {
        console.log('Error fetching system items:', error);
        Alert.alert('Error', 'Unable to fetch system items.');
      }
      setLoadingItems(false);
    };

    fetchItems();
  }, [systemId]);

  const addPanel = () => {
    if (panelNumbers.length < 17) {
      setPanelNumbers([...panelNumbers, '']);
    }
  };

  const handlePanelUserChange = (index, value) => {
    const updatedUsers = [...panelNumbers];
    updatedUsers[index] = value;
    setPanelNumbers(updatedUsers);
  };

  const handleSubmit = async () => {
    if (!selectedServicePerson || !systemId || selectedItems.length === 0) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }


    const newItems = {
      farmerId,
      empId: selectedServicePerson,
      systemId,
      itemsList: selectedItems,
      panelNumbers,
      pumpNumber,
      controllerNumber,
      rmuNumber,
      createdAt: new Date()
    };

    try {
      await axios.post(`${API_URL}/warehouse-admin/add-new-installation`, newItems);
      Alert.alert('Success', 'Item repair data has been submitted.');
      setSelectedServicePerson('');
      setSystemId('');
      setSelectedItems([]);
      setPanelNumbers([]);
    } catch (error) {
      console.log('Error submitting data:', error);
      Alert.alert('Error', 'Something went wrong while submitting.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Installation Form </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Service Person:</Text>
        <Picker
          selectedValue={selectedServicePerson}
          onValueChange={itemValue => setSelectedServicePerson(itemValue)}
          style={styles.input}>
          <Picker.Item label="Select Service Person" value="" />
          {servicePersons.map(person => (
            <Picker.Item
              key={person._id}
              label={person.name}
              value={person._id}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Select System</Text>
        <Picker
          selectedValue={systemId}
          onValueChange={value => setSystemId(value)}
          style={styles.input}>
          <Picker.Item label="Select System" value="" />
          {systems.map(system => (
            <Picker.Item
              key={system._id}
              label={system.systemName}
              value={system._id}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Select Items</Text>
        {loadingItems ? (
          <Text style={styles.noItemText}>Loading items...</Text>
        ) : items.length > 0 ? (
          <MultiSelect
            hideTags
            items={items}
            uniqueKey="_id"
            onSelectedItemsChange={setSelectedItems}
            selectedItems={selectedItems}
            selectText="Pick Items"
            searchInputPlaceholderText="Search Items..."
            tagRemoveIconColor="#070604"
            tagBorderColor="#070604"
            tagTextColor="#070604"
            selectedItemTextColor="#070604"
            selectedItemIconColor="#070604"
            itemTextColor="#070604"
            displayKey="subItemName"
            searchInputStyle={{color: '#070604'}}
            styleDropdownMenu={{backgroundColor: '#f9f9f9', borderRadius: 8}}
          />
        ) : (
          <Text style={styles.noItemText}>No items available</Text>
        )}

        {/* <Text style={styles.sectionTitle}>Panel</Text>
        {panelNumbers.map((panel, index) => (
          <TextInput
            key={index}
            style={styles.panelInput}
            placeholder={`Panel Serial Number ${index + 1}`}
            value={panel}
            onChangeText={(value) => handlePanelUserChange(index, value)}
          />
        ))}

        {panelNumbers.length < 17 && (
          <TouchableOpacity style={styles.addButton} onPress={addPanel}>
            <Text style={styles.addButtonText}>+ Add Panel</Text>
          </TouchableOpacity>
        )} */}

        <ScrollView style={{maxHeight: 300}}>
          <Text style={styles.sectionTitle}>Panel</Text>

          {panelNumbers.map((panel, index) => (
            <TextInput
              key={index}
              style={styles.panelInput}
              placeholder={`Panel Serial Number ${index + 1}`}
              value={panel}
              onChangeText={value => handlePanelUserChange(index, value)}
            />
          ))}

          {panelNumbers.length < 17 && (
            <TouchableOpacity style={styles.addButton} onPress={addPanel}>
              <Text style={styles.addButtonText}>+ Add Panel</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <Text style={styles.label}>Pump Number</Text>
        <TextInput
          value={pumpNumber}
          onChangeText={setPumpNumber}
          style={styles.input}
        />

        <Text style={styles.label}>Controller Number</Text>
        <TextInput
          value={controllerNumber}
          onChangeText={setControllerNumber}
          style={styles.input}
        />

        <Text style={styles.label}>Rmu Number</Text>
        <TextInput
          value={rmuNumber}
          onChangeText={setRmuNumber}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#ffffff'},
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#070604',
  },
  form: {
    padding: 15,
    backgroundColor: '#fbd33b',
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#070604'},
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  panelInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#000',
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  button: {
    backgroundColor: '#070604',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {color: '#fbd33b', fontSize: 16, fontWeight: '600'},
});

export default NewFormInstallation;
