import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import {API_URL} from '@env';
import {useNavigation, useRoute} from '@react-navigation/native';

const OutgoingDataInServiceMh = () => {
  const [servicePerson, setServicePerson] = useState([]);
  const [systems, setSystems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedServicePerson, setSelectedServicePerson] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [selectedSystemName, setSelectedSystemName] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedSubItems, setSelectedSubItems] = useState({});
  const [subItemQuantities, setSubItemQuantities] = useState({});
  const [pumpNumber, setPumpNumber] = useState('');
  const [controllerNumber, setControllerNumber] = useState('');
  const [rmuNumber, setRmuNumber] = useState('');
  const [farmerSaralId, setFarmerSaralId] = useState('');
  const [isSaralIdValid, setIsSaralIdValid] = useState(false);
  const [saralIdValidationMessage, setSaralIdValidationMessage] = useState('');
  const [validatingSaralId, setValidatingSaralId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [allScannedBarcodes, setAllScannedBarcodes] = useState([]);
  const [motorNumber, setMotorNumber] = useState('');
  const [availablePumps, setAvailablePumps] = useState([]);
  const [panelNumbers, setPanelNumbers] = useState([]);
  const [extraPanelNumbers, setExtraPanelNumbers] = useState([]);
  const [pumpdata, setPumpData] = useState({});
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.scannedBarcode && route.params?.barcodeType) {
        const {scannedBarcode, barcodeType, panelIndex} = route.params;

        if (allScannedBarcodes.includes(scannedBarcode)) {
          Alert.alert('Duplicate', 'This barcode has already been scanned');
          return;
        }

        switch (barcodeType) {
          case 'pump':
            setPumpNumber(scannedBarcode);
            break;
          case 'controller':
            setControllerNumber(scannedBarcode);
            break;
          case 'rmu':
            setRmuNumber(scannedBarcode);
            break;
          case 'motor':
            setMotorNumber(scannedBarcode);
            break;
          case 'panel':
            if (panelIndex !== undefined && panelIndex !== null) {
              handlePanelNumberChange(panelIndex, scannedBarcode);
            }
            break;
          case 'extraPanel':
            if (panelIndex !== undefined && panelIndex !== null) {
              handleExtraPanelNumberChange(panelIndex, scannedBarcode);
            }
            break;
        }

        setAllScannedBarcodes(prev => [...prev, scannedBarcode]);
        navigation.setParams({
          scannedBarcode: undefined,
          barcodeType: undefined,
          panelIndex: undefined,
        });
      }
    });

    return unsubscribe;
  }, [navigation, route.params, allScannedBarcodes]);

  useEffect(() => {
    const fetchServicePersons = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/service-survey-persons?state=Maharashtra`,
        );
        setServicePerson(response?.data?.data);
      } catch (error) {
        Alert.alert('Error', JSON.stringify(error.response?.data?.message));
      }
    };

    const fetchSystems = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/warehouse-admin/show-systems`,
        );
        setSystems(response?.data?.data);
      } catch (error) {
        Alert.alert('Error', JSON.stringify(error.response?.data?.message));
      }
    };

    fetchServicePersons();
    fetchSystems();
  }, []);

  useEffect(() => {
    if (selectedSystem) {
      fetchAvailablePumps();
      fetchItemsForSystem();
      initializePanelNumbers();
    }
  }, [selectedSystem]);

  const initializePanelNumbers = () => {
    setPanelNumbers([]);
    setExtraPanelNumbers([]);

    const system = systems.find(sys => sys._id === selectedSystem);
    if (system) {
      setSelectedSystemName(system.systemName);

      if (system.systemName.includes('7.5HP')) {
        setPanelNumbers(Array(13).fill(''));
      } else if (system.systemName.includes('5HP')) {
        setPanelNumbers(Array(9).fill(''));
      } else if (system.systemName.includes('3HP')) {
        setPanelNumbers(Array(6).fill(''));
      }
    }
  };

  const fetchAvailablePumps = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/warehouse-admin/show-pump-data?systemId=${selectedSystem}`,
      );
      setAvailablePumps(response?.data?.data || []);
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsForSystem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/warehouse-admin/show-items-subItems?systemId=${selectedSystem}`,
      );
      setItems(response?.data?.data);
      setSelectedItems([]);
      setQuantities({});
      setPumpNumber('');
      setControllerNumber('');
      setRmuNumber('');
      setMotorNumber('');
      setSelectedSubItems({});
      setSubItemQuantities({});
      setExtraPanelNumbers([]);
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

  const validateSaralId = async farmerSaralId => {
    if (!farmerSaralId) {
      setIsSaralIdValid(false);
      setSaralIdValidationMessage('Please enter Farmer Saral ID');
      setFarmerDetails(null);
      return;
    }

    try {
      setValidatingSaralId(true);
      const response = await axios.get(
        `http://88.222.214.93:8001/farmer/showFarmerAccordingToSaralId?saralId=${farmerSaralId}`,
      );

      if (response.data && response.data.success) {
        setIsSaralIdValid(true);
        setSaralIdValidationMessage('Valid Farmer Saral ID');
        setFarmerDetails(response.data.data);
      } else {
        setIsSaralIdValid(false);
        setSaralIdValidationMessage('Invalid Farmer Saral ID');
        setFarmerDetails(null);
      }
    } catch (error) {
      setIsSaralIdValid(false);
      setSaralIdValidationMessage('Error validating Saral ID');
      setFarmerDetails(null);
      console.log('Error validating Saral ID:', error);
    } finally {
      setValidatingSaralId(false);
    }
  };

  const handleSaralIdChange = text => {
    setFarmerSaralId(text);
    setIsSaralIdValid(false);
    setSaralIdValidationMessage('');
  };

  const handleValidateSaralId = async () => {
    await validateSaralId(farmerSaralId);
  };

  const toggleItemSelection = itemId => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        const newQuantities = {...quantities};
        delete newQuantities[itemId];
        setQuantities(newQuantities);

        const item = items.find(i => i.systemItemId._id === itemId);
        if (item?.subItems?.length > 0) {
          const newSelectedSubItems = {...selectedSubItems};
          const newSubItemQuantities = {...subItemQuantities};
          item.subItems.forEach(subItem => {
            delete newSelectedSubItems[subItem.subItemId._id];
            delete newSubItemQuantities[subItem.subItemId._id];
          });
          setSelectedSubItems(newSelectedSubItems);
          setSubItemQuantities(newSubItemQuantities);
        }

        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const toggleSubItemSelection = subItemId => {
    setSelectedSubItems(prev => ({
      ...prev,
      [subItemId]: !prev[subItemId],
    }));
  };

  const handleQuantityChange = (itemId, value) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleSubItemQuantityChange = (subItemId, value) => {
    setSubItemQuantities(prev => ({
      ...prev,
      [subItemId]: value,
    }));
  };

  const handlePanelNumberChange = (index, value) => {
    const newPanelNumbers = [...panelNumbers];
    newPanelNumbers[index] = value;
    setPanelNumbers(newPanelNumbers);
  };

  const handleExtraPanelNumberChange = (index, value) => {
    const newExtraPanelNumbers = [...extraPanelNumbers];
    newExtraPanelNumbers[index] = value;
    setExtraPanelNumbers(newExtraPanelNumbers);
  };

  const handleScanBarcode = (type, index = null) => {
    navigation.navigate('BarcodeScanner', {
      barcodeType: type,
      existingBarcodes: allScannedBarcodes,
      returnScreen: 'OutgoingDataInServiceMh',
      panelIndex: index,
    });
  };

  const getItemName = itemId => {
    const item = items.find(i => i.systemItemId._id === itemId);
    return item?.systemItemId?.itemName || '';
  };

  const isSolarPanel = itemName => {
    return itemName.toLowerCase().includes('solar panel');
  };

  const validateInput = () => {
    if (!selectedServicePerson) {
      Alert.alert('Error', 'Please select a service person');
      return false;
    }
    if (!selectedSystem) {
      Alert.alert('Error', 'Please select a system');
      return false;
    }
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return false;
    }
    if (!farmerSaralId) {
      Alert.alert('Error', 'Please enter Farmer Saral ID');
      return false;
    }
    if (!isSaralIdValid) {
      Alert.alert('Error', 'Please validate Farmer Saral ID');
      return false;
    }

    const system = systems.find(sys => sys._id === selectedSystem);
    if (system) {
      if (system.systemName.includes('7.5HP') && panelNumbers.length !== 13) {
        Alert.alert(
          'Error',
          'Please enter all 13 panel numbers for 7.5HP system',
        );
        return false;
      } else if (
        system.systemName.includes('5HP') &&
        panelNumbers.length !== 9
      ) {
        Alert.alert('Error', 'Please enter all 9 panel numbers for 5HP system');
        return false;
      } else if (
        system.systemName.includes('3HP') &&
        panelNumbers.length !== 6
      ) {
        Alert.alert('Error', 'Please enter all 6 panel numbers for 3HP system');
        return false;
      }
    }

    for (const itemId of selectedItems) {
      if (!quantities[itemId] || isNaN(quantities[itemId])) {
        Alert.alert(
          'Error',
          `Please enter a valid quantity for ${getItemName(itemId)}`,
        );
        return false;
      }

      const item = items.find(i => i.systemItemId._id === itemId);
      if (item?.subItems) {
        for (const subItem of item.subItems) {
          if (selectedSubItems[subItem.subItemId._id]) {
            const subItemQty = subItemQuantities[subItem.subItemId._id];
            if (!subItemQty || isNaN(subItemQty)) {
              Alert.alert(
                'Error',
                `Please enter a valid quantity for sub-item ${subItem.subItemId.itemName}`,
              );
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    try {
      const mainItemsList = selectedItems.map(itemId => ({
        systemItemId: itemId,
        quantity: 1,
      }));

      const extraItemsList = selectedItems
        .filter(itemId => quantities[itemId] > 1)
        .map(itemId => ({
          systemItemId: itemId,
          quantity: parseInt(quantities[itemId], 10),
        }));

      const subItemsList = [];
      for (const itemId of selectedItems) {
        const item = items.find(i => i.systemItemId._id === itemId);
        if (item?.subItems) {
          for (const subItem of item.subItems) {
            if (selectedSubItems[subItem.subItemId._id]) {
              subItemsList.push({
                systemItemId: subItem.subItemId._id,
                quantity: parseInt(
                  subItemQuantities[subItem.subItemId._id],
                  10,
                ),
              });
            }
          }
        }
      }

      const allExtraItems = [...extraItemsList, ...subItemsList];

      const payload = {
        farmerSaralId: farmerSaralId,
        empId: selectedServicePerson,
        systemId: selectedSystem,
        itemsList: mainItemsList,
        panelNumbers: panelNumbers.filter(num => num.trim() !== ''),
        ...(pumpNumber && {pumpNumber}),
        ...(controllerNumber && {controllerNumber}),
        ...(rmuNumber && {rmuNumber}),
        ...(motorNumber && {motorNumber}),
        ...(extraPanelNumbers.length > 0 && {
          extraPanelNumbers: extraPanelNumbers.filter(num => num.trim() !== ''),
        }),
        ...(allExtraItems.length > 0 && {extraItemsList: allExtraItems}),
      };

      console.log('Payload to submit:', payload);

      setLoading(true);
      // const response = await axios.post(
      //   `${API_URL}/warehouse-admin/add-new-installation`,
      //   payload,
      //   {headers: {'Content-Type': 'application/json'}}
      // );

      // Alert.alert('Success', 'Transaction saved successfully');
      // resetForm();
      // } catch (error) {
      //   console.log('Submission error:', error.response?.data || error.message);
      //   Alert.alert(
      //     'Error',
      //     error.response?.data?.message || 'Failed to submit data'
      //   );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedServicePerson('');
    setSelectedSystem('');
    setSelectedSystemName('');
    setSelectedItems([]);
    setQuantities({});
    setPumpNumber('');
    setControllerNumber('');
    setRmuNumber('');
    setMotorNumber('');
    setFarmerSaralId('');
    setItems([]);
    setSelectedSubItems({});
    setSubItemQuantities({});
    setIsSaralIdValid(false);
    setSaralIdValidationMessage('');
    setAllScannedBarcodes([]);
    setPanelNumbers([]);
    setExtraPanelNumbers([]);
    setAvailablePumps([]);
  };

  const renderItem = ({item}) => {
    const itemId = item.systemItemId._id;
    const isSelected = selectedItems.includes(itemId);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const itemName = item.systemItemId.itemName;
    const isPanelItem = isSolarPanel(itemName);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemRow}>
          <CheckBox
            value={isSelected}
            onValueChange={() => toggleItemSelection(itemId)}
          />
          <Text style={styles.itemText}>{itemName}</Text>
        </View>

        {isSelected && (
          <View style={styles.itemDetails}>
            <Text style={styles.label}>Quantity:</Text>
            <TextInput
              style={styles.input}
              value={quantities[itemId]?.toString() || ''}
              onChangeText={text => handleQuantityChange(itemId, text)}
              keyboardType="numeric"
              placeholder="Enter quantity"
            />

            {isPanelItem && parseInt(quantities[itemId] || 0) > 0 && (
              <>
                <Text style={styles.label}>Enter Extra Panel Numbers:</Text>
                {Array.from({length: parseInt(quantities[itemId] || 0)}).map(
                  (_, index) => (
                    <View key={index} style={styles.barcodeInputContainer}>
                      <TextInput
                        style={[styles.input, styles.barcodeInput]}
                        value={extraPanelNumbers[index] || ''}
                        onChangeText={text =>
                          handleExtraPanelNumberChange(index, text)
                        }
                        placeholder={`Extra Panel ${index + 1} Number`}
                      />
                      <TouchableOpacity
                        style={styles.scanButton}
                        onPress={() => handleScanBarcode('extraPanel', index)}>
                        <Text style={styles.scanButtonText}>Scan</Text>
                      </TouchableOpacity>
                    </View>
                  ),
                )}
              </>
            )}

            {hasSubItems && (
              <>
                <Text style={styles.subItemHeader}>Sub Items:</Text>
                {item.subItems.map((subItem, subIndex) => (
                  <View key={subIndex} style={styles.subItemContainer}>
                    <View style={styles.subItemRow}>
                      <CheckBox
                        value={!!selectedSubItems[subItem.subItemId._id]}
                        onValueChange={() =>
                          toggleSubItemSelection(subItem.subItemId._id)
                        }
                      />
                      <Text style={styles.subItemText}>
                        {subItem.subItemId.itemName}
                      </Text>
                    </View>

                    {selectedSubItems[subItem.subItemId._id] && (
                      <View style={styles.subItemQuantityContainer}>
                        <Text style={styles.subItemLabel}>Quantity:</Text>
                        <TextInput
                          style={[styles.input, styles.subItemInput]}
                          value={
                            subItemQuantities[
                              subItem.subItemId._id
                            ]?.toString() || ''
                          }
                          onChangeText={text =>
                            handleSubItemQuantityChange(
                              subItem.subItemId._id,
                              text,
                            )
                          }
                          keyboardType="numeric"
                          placeholder="Enter quantity"
                        />
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderPumpSelection = () => {
    if (availablePumps.length === 0 || !selectedSystem) return null;

    return (
      <>
        <Text style={styles.label}>Select Pump:</Text>
        <Picker
          selectedValue={pumpdata}
          onValueChange={setPumpData}
          style={styles.picker}>
          <Picker.Item label="Select Pump" value="" />
          {availablePumps.map((pump, index) => (
            <Picker.Item
              key={index}
              label={pump.itemName}
              value={pump.itemName}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Enter Pump Number:</Text>
        <View style={styles.barcodeInputContainer}>
          <TextInput
            style={[styles.input, styles.barcodeInput]}
            value={pumpNumber}
            onChangeText={setPumpNumber}
            placeholder="Enter Pump Number"
          />
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => handleScanBarcode('pump')}>
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderPanelNumbers = () => {
    if (!selectedSystemName) return null;

    let panelCount = 0;
    let panelLabel = '';

    if (selectedSystemName.includes('7.5HP')) {
      panelCount = 13;
      panelLabel = '7.5HP Panel Numbers (13 required)';
    } else if (selectedSystemName.includes('5HP')) {
      panelCount = 9;
      panelLabel = '5HP Panel Numbers (9 required)';
    } else if (selectedSystemName.includes('3HP')) {
      panelCount = 6;
      panelLabel = '3HP Panel Numbers (6 required)';
    } else {
      return null;
    }

    return (
      <>
        <Text style={styles.label}>{panelLabel}</Text>
        {Array.from({length: panelCount}).map((_, index) => (
          <View key={index} style={styles.barcodeInputContainer}>
            <TextInput
              style={[styles.input, styles.barcodeInput]}
              value={panelNumbers[index] || ''}
              onChangeText={text => handlePanelNumberChange(index, text)}
              placeholder={`Panel ${index + 1} Number`}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => handleScanBarcode('panel', index)}>
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>
          Outgoing Data in Service (Maharashtra)
        </Text>
        <View style={styles.form}>
          <Text style={styles.label}>Farmer Saral ID:</Text>
          <View style={styles.saralIdContainer}>
            <TextInput
              style={[
                styles.input,
                styles.saralIdInput,
                farmerSaralId
                  ? isSaralIdValid
                    ? styles.validInput
                    : saralIdValidationMessage
                    ? styles.invalidInput
                    : null
                  : null,
              ]}
              value={farmerSaralId}
              onChangeText={handleSaralIdChange}
              placeholder="Enter Farmer Saral ID"
            />
            <TouchableOpacity
              style={styles.validateButton}
              onPress={handleValidateSaralId}
              disabled={validatingSaralId}>
              <Text style={styles.validateButtonText}>
                {validatingSaralId ? 'Validating...' : 'Validate'}
              </Text>
            </TouchableOpacity>
          </View>

          {validatingSaralId ? (
            <View style={styles.validationContainer}>
              <ActivityIndicator size="small" color="#0000ff" />
              <Text style={styles.validatingText}>Validating...</Text>
            </View>
          ) : (
            saralIdValidationMessage && (
              <Text
                style={
                  isSaralIdValid ? styles.validMessage : styles.invalidMessage
                }>
                {saralIdValidationMessage}
              </Text>
            )
          )}

          {farmerDetails && (
            <View style={styles.farmerDetailsContainer}>
              <Text style={styles.farmerDetailText}>
                <Text style={styles.farmerDetailLabel}>Name:</Text>{' '}
                {farmerDetails.farmerName}
              </Text>
              <Text style={styles.farmerDetailText}>
                <Text style={styles.farmerDetailLabel}>Contact:</Text>{' '}
                {farmerDetails.contact}
              </Text>
            </View>
          )}

          <Text style={styles.label}>Service Person:</Text>
          <Picker
            selectedValue={selectedServicePerson}
            onValueChange={setSelectedServicePerson}
            style={styles.picker}>
            <Picker.Item label="Select Service Person" value="" />
            {servicePerson.map(person => (
              <Picker.Item
                key={person._id}
                label={person.name}
                value={person._id}
              />
            ))}
          </Picker>

          <Text style={styles.label}>System:</Text>
          <Picker
            selectedValue={selectedSystem}
            onValueChange={value => {
              setSelectedSystem(value);
              const system = systems.find(sys => sys._id === value);
              if (system) {
                setSelectedSystemName(system.systemName);
              }
            }}
            style={styles.picker}>
            <Picker.Item label="Select System" value="" />
            {systems.map(system => (
              <Picker.Item
                key={system._id}
                label={system.systemName}
                value={system._id}
              />
            ))}
          </Picker>

          {renderPumpSelection()}

          {items.length > 0 && (
            <>
              <Text style={styles.label}>Extra Select Items:</Text>
              <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.systemItemId._id}
                scrollEnabled={false}
              />
            </>
          )}

          {renderPanelNumbers()}

          <Text style={styles.label}>Controller Number:</Text>
          <View style={styles.barcodeInputContainer}>
            <TextInput
              style={[styles.input, styles.barcodeInput]}
              value={controllerNumber}
              onChangeText={setControllerNumber}
              placeholder="Enter Controller Number"
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => handleScanBarcode('controller')}>
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>RMU Number:</Text>
          <View style={styles.barcodeInputContainer}>
            <TextInput
              style={[styles.input, styles.barcodeInput]}
              value={rmuNumber}
              onChangeText={setRmuNumber}
              placeholder="Enter RMU Number"
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => handleScanBarcode('rmu')}>
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>MOTOR Number:</Text>
          <View style={styles.barcodeInputContainer}>
            <TextInput
              style={[styles.input, styles.barcodeInput]}
              value={motorNumber}
              onChangeText={setMotorNumber}
              placeholder="Enter Motor Number"
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => handleScanBarcode('motor')}>
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, !isSaralIdValid && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading || validatingSaralId || !isSaralIdValid}>
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  form: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    color: '#000',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    color: '#333',
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  itemDetails: {
    marginLeft: 30,
    marginTop: 10,
  },
  subItemHeader: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#555',
  },
  subItemContainer: {
    marginBottom: 10,
    paddingLeft: 10,
  },
  subItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    color: '#000',
  },
  subItemText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#555',
  },
  subItemQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginTop: 5,
    marginBottom: 10,
  },
  subItemLabel: {
    fontSize: 14,
    marginRight: 10,
    color: '#555',
  },
  subItemInput: {
    flex: 1,
    marginBottom: 0,
    padding: 10,
  },
  barcodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  barcodeInput: {
    flex: 1,
    marginRight: 10,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  validInput: {
    borderColor: 'green',
  },
  invalidInput: {
    borderColor: 'red',
  },
  validMessage: {
    color: 'green',
    marginBottom: 15,
  },
  invalidMessage: {
    color: 'red',
    marginBottom: 15,
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  validatingText: {
    marginLeft: 8,
    color: '#555',
  },
  saralIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  saralIdInput: {
    flex: 1,
    marginRight: 10,
  },
  validateButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  farmerDetailsContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#d3d3d3',
  },
  farmerDetailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  farmerDetailLabel: {
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default OutgoingDataInServiceMh;
