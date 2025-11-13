import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import api from '../../auth/api';;
  import { Dropdown } from 'react-native-element-dropdown';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import {API_URL} from '@env';
  
  const BomData = () => {
    const [systems, setSystems] = useState([]);
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [systemItems, setSystemItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [systemLoading, setSystemLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchSystems = async () => {
        try {
          const response = await api.get(
            `${API_URL}/warehouse-admin/show-systems`
          );
          if (response.data.success) {
            setSystems(response.data.data);
          } else {
            setError('Failed to fetch systems');
          }
        } catch (err) {
          setError(err.message);
          Alert.alert("error: ", err?.response?.data?.message)
        } finally {
          setLoading(false);
        }
      };
  
      fetchSystems();
    }, []);
  
    useEffect(() => {
      if (selectedSystem) {
        const fetchSystemItems = async () => {
          setSystemLoading(true);
          try {
            const response = await api.get(
              `${API_URL}/warehouse-admin/show-system-item-map?systemId=${selectedSystem}`
            );
            if (response.data.success) {
              setSystemItems(response.data.data);
            } else {
              setError('Failed to fetch system items');
            }
          } catch (err) {
            setError(err.message);
            Alert.alert("error: ", err?.response?.data?.message)
          } finally {
            setSystemLoading(false);
          }
        };
  
        fetchSystemItems();
      }
    }, [selectedSystem]);
  
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.error}>Error: {error}</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bill of Materials (BOM)</Text>
  
        {/* System Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select System:</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={systems.map((system) => ({
              label: system.systemName,
              value: system._id,
            }))}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select system"
            searchPlaceholder="Search..."
            value={selectedSystem}
            onChange={(item) => {
              setSelectedSystem(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
          />
        </View>
  
        {/* System Items List */}
        {systemLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <ScrollView style={styles.itemsContainer}>
            {selectedSystem ? (
              systemItems.length > 0 ? (
                systemItems.map((item, index) => (
                  <View key={index} style={styles.itemCard}>
                    <Text style={styles.itemName}>
                      {item.systemItemId?.itemName ?? 'Unnamed Item'}
                    </Text>
                    <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
                    {item.description && (
                      <Text style={styles.itemDetail}>
                        Description: {item.description}
                      </Text>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.noItems}>
                  No items found for this system
                </Text>
              )
            ) : (
              <Text style={styles.selectPrompt}>
                Please select a system to view items
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f9fa',
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
      textAlign: 'center',
    },
    dropdownContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: '#555',
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      backgroundColor: 'white',
    },
    placeholderStyle: {
      fontSize: 16,
      color: '#999',
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    icon: {
      marginRight: 5,
    },
    itemsContainer: {
      flex: 1,
    },
    itemCard: {
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 5,
      color: '#222',
    },
    itemDetail: {
      fontSize: 14,
      color: '#555',
      marginBottom: 3,
    },
    noItems: {
      textAlign: 'center',
      marginTop: 20,
      color: '#666',
      fontSize: 16,
    },
    selectPrompt: {
      textAlign: 'center',
      marginTop: 20,
      color: '#666',
      fontSize: 16,
    },
    error: {
      color: 'red',
      fontSize: 16,
    },
  });
  
  export default BomData;
  