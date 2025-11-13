import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import api from '../../auth/api';;
import MultiSelect from 'react-native-multiple-select';
import {API_URL} from '@env';
import {Picker} from '@react-native-picker/picker';

// Get screen dimensions
const {width, height} = Dimensions.get('window');

// Function to determine the scale of the design based on the device width
const scale = width / 375; // Standard width for scaling

const NewFormInstallation = ({route}) => {
  const {farmerId} = route.params;

  const [servicePersons, setServicePersons] = useState([]);
  const [systems, setSystems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedServicePerson, setSelectedServicePerson] = useState('');
  const [systemId, setSystemId] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [panelNumbers, setPanelNumbers] = useState([]);
  const [pumpNumber, setPumpNumber] = useState('');
  const [controllerNumber, setControllerNumber] = useState('');
  const [rmuNumber, setRmuNumber] = useState('');
  const [itemQuantities, setItemQuantities] = useState({});
  const [itemInputs, setItemInputs] = useState({}); // To store the inputs for each item

  useEffect(() => {
    const fetchServicePersons = async () => {
      try {
        const response = await api.get(`${API_URL}/service-team/all-service-persons`);
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
        const {data} = await api.get(`${API_URL}/warehouse-admin/show-systems`);
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
        const {data} = await api.get(`${API_URL}/warehouse-admin/show-subItems?systemId=${systemId}`);
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

  const handlePanelChange = (index, value) => {
    const updatedPanels = [...panelNumbers];
    updatedPanels[index] = value;
    setPanelNumbers(updatedPanels);
  };

  const handleQuantityChange = (itemId, quantity) => {
    // Store quantity for each item
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: quantity,
    }));

    // Generate input fields based on the entered quantity
    if (quantity > 0) {
      const inputs = Array.from({length: quantity}, (_, index) => `Input ${index + 1}`);
      setItemInputs(prev => ({
        ...prev,
        [itemId]: inputs,
      }));
    } else {
      setItemInputs(prev => ({
        ...prev,
        [itemId]: [],
      }));
    }
  };

  const handleInputChange = (itemId, index, value) => {
    // Update value for each dynamically generated input
    setItemInputs(prev => {
      const updatedInputs = [...(prev[itemId] || [])];
      updatedInputs[index] = value;
      return {
        ...prev,
        [itemId]: updatedInputs,
      };
    });
  };

  const handleSubmit = async () => {
    if (!selectedServicePerson || !systemId || selectedItems.length === 0) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const formattedItemsList = selectedItems.map(itemId => ({
      subItemId: itemId,
      quantity: parseInt(itemQuantities[itemId] || 1, 10),
      inputs: itemInputs[itemId] || [],
    }));

    const newInstallation = {
      farmerId,
      empId: selectedServicePerson,
      systemId,
      itemsList: formattedItemsList,
      panelNumbers: panelNumbers.filter(num => num.trim() !== ''),
      pumpNumber: pumpNumber.trim(),
      controllerNumber: controllerNumber.trim(),
      rmuNumber: rmuNumber.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await api.post(`${API_URL}/warehouse-admin/add-new-installation`, newInstallation);
      console.log('New Installation Response:', response.data);
      Alert.alert('Success', 'Installation data has been submitted.');

      setSelectedServicePerson('');
      setSystemId('');
      setSelectedItems([]);
      setPanelNumbers([]);
      setPumpNumber('');
      setControllerNumber('');
      setRmuNumber('');
      setItemQuantities({});
      setItemInputs({});
    } catch (error) {
      console.log('Error submitting data:', error?.response?.data || error.message);
      Alert.alert('Error', 'Something went wrong while submitting.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Installation Form</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Select System</Text>
        <Picker
          selectedValue={systemId}
          onValueChange={value => setSystemId(value)}
          style={styles.input}
        >
          <Picker.Item label="Select System" value="" />
          {systems.map(system => (
            <Picker.Item key={system._id} label={system.systemName} value={system._id} />
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
            displayKey="subItemName"
          />
        ) : (
          <Text style={styles.noItemText}>No items available</Text>
        )}

        {selectedItems.map(itemId => (
          <View key={itemId} style={styles.quantityContainer}>
            <Text>Enter Quantity for {items.find(item => item._id === itemId)?.subItemName}:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={itemQuantities[itemId]?.toString() || ''}
              onChangeText={text => handleQuantityChange(itemId, text)}
            />
          </View>
        ))}

        <ScrollView style={{maxHeight: height * 0.4}}>
          {selectedItems.map(
            itemId =>
              itemInputs[itemId] &&
              itemInputs[itemId].map((inputName, index) => (
                <View key={`${itemId}-${index}`} style={styles.inputContainer}>
                  <Text>{`Enter Serial Number`}</Text>
                  <TextInput
                    style={styles.input}
                    value={itemInputs[itemId][index]}
                    onChangeText={text => handleInputChange(itemId, index, text)}
                  />
                </View>
              ))
          )}
       

        
          <Text style={styles.label}>Service Person:</Text>
          <Picker
            selectedValue={selectedServicePerson}
            onValueChange={itemValue => setSelectedServicePerson(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select Service Person" value="" />
            {servicePersons.map(person => (
              <Picker.Item key={person._id} label={person.name} value={person._id} />
            ))}
          </Picker>

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

          <Text style={styles.label}>RMU Number</Text>
          <TextInput
            value={rmuNumber}
            onChangeText={setRmuNumber}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 22 * scale, // Adjust font size relative to screen size
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  form: {
    padding: 15,
    backgroundColor: '#fbd33b',
    borderRadius: 8,
    minHeight: height * 0.6, // Make form responsive to screen height
  },
  label: {
    fontSize: 16 * scale, // Adjust font size relative to screen size
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16 * scale, // Make input text responsive
  },
  inputContainer: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#070604',
    padding: 12 * scale, // Adjust button padding based on scale
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fbd33b',
    fontSize: 16 * scale, // Adjust button text size
    fontWeight: '600',
  },
  noItemText: {
    textAlign: 'center',
    color: 'red',
  },
  quantityContainer: {
    marginBottom: 15,
  },
  scrollView: {
    maxHeight: height * 0.4, // Adjust height of scrollable area
  },
  multiSelectContainer: {
    paddingVertical: 10,
  },
  picker: {
    fontSize: 16 * scale, // Adjust picker text size
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  pickerItem: {
    fontSize: 16 * scale, // Adjust picker item text size
  },
});

export default NewFormInstallation;
