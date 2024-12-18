import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';

const DefectiveItem = ({route}) => {
  const {itemId, itemName} = route.params;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    repaired: '',
    rejected: '',
    createdAt: new Date(),
  });

  const handleSubmit = async () => {
    try {
      console.log({itemName,...formData})
      const response = await axios.post(
        `${API_URL}/warehouse-admin/repair-reject-item`,{itemName,...formData}
      );
      setData(response.data.newRepairRejectData);
      setFormData({
        repaired: response.data.repaired || '',
        rejected: response.data.rejected || '',
      });
    } catch (error) {
      Alert.alert(JSON.stringify(error.response.data.message));
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateForm = () => {
    const repaired = parseInt(formData.repaired, 10);
    const rejected = parseInt(formData.rejected, 10);
    if (isNaN(repaired) || isNaN(rejected)) {
      Alert.alert('Validation Error', 'Repaired and Rejected must be numbers.');
      return false;
    }
    return true;
  };


  return (
    <View style={styles.container}>
      <Text style={{...styles.title, color:'#000'}}>Item: {itemName}</Text>

      <TextInput
        style={styles.input}
        placeholder="Repaired"
        value={formData.repaired}
        onChangeText={value => handleChange('repaired', value)}
        keyboardType="numeric"
        placeholderTextColor={'#000'}
      />

      <TextInput
        style={styles.input}
        placeholder="Rejected"
        value={formData.rejected}
        onChangeText={value => handleChange('rejected', value)}
        keyboardType="numeric"
        placeholderTextColor={'#000'}
      />

      <View style={{marginTop: 20}}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default DefectiveItem;
