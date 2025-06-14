import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { API_URL } from '@env';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ApprovalNewInstallation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const navigation = useNavigation();
  const [btnClickedStatus, setBtnClickedStatus] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/service-person/show-new-install-data`);
      setData(response.data.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBtn = async (installationId, farmerId, empId) => {
    try {
      const response = await axios.post(`${API_URL}/service-person/update-incoming-item-status`, {
        accepted: true,
        installationId,
        farmerId,
        empId,
      });
  
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
  
      if (response.status === 200) {
        setBtnClickedStatus(prev => ({ ...prev, [installationId]: true }));
        fetchData(); 
      }
    } catch (error) {
      console.log("Error approving installation:", error);
  
      if (error.response) {

        console.log("Error data:", error.response.data);
        console.log("Error status:", error.response.status);
        console.log("Error headers:", error.response.headers);
        Alert.alert('Error', `Failed to approve the installation. Server responded with status: ${error.response.status}`);
      } else if (error.request) {

        console.log("Error request:", error.request);
        Alert.alert('Error', 'No response received from the server. Please check your network connection.');
      } else {

        console.log("Error message:", error.message);
        Alert.alert('Error', `Failed to approve the installation. Error: ${error.message}`);
      }
    }
  };
  const toggleExpand = id => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Farmer Name: {item.farmerDetails.farmerName}</Text>
      <Text style={styles.text}>Saral ID: {item.farmerDetails.saralId}</Text>
      <Text style={styles.text}>Contact: {item.farmerDetails.contact}</Text>
      <Text style={styles.text}>State: {item.farmerDetails.state}</Text>
      <Text style={styles.text}>District: {item.farmerDetails.district}</Text>

      {expanded[item._id] && (
        <>
          <Text style={styles.text}>Block: {item.farmerDetails.block}</Text>
          <Text style={styles.text}>Village: {item.farmerDetails.village}</Text>
          <Text style={styles.text}>Warehouse Name: {item.warehouseId.warehouseName}</Text>
          <Text style={styles.text}>Sub Item Name: {item.itemsList[0]?.subItemId.subItemName}</Text>
          <Text style={styles.text}>Quantity: {item.itemsList[0]?.quantity}</Text>
          <Text style={styles.text}>Pump Number: {item.pumpNumber}</Text>
          <Text style={styles.text}>Controller Number: {item.controllerNumber}</Text>
          <Text style={styles.text}>RMU Number: {item.rmuNumber}</Text>
        </>
      )}

      <View style={styles.footer}>
        <Button title={expanded[item._id] ? 'Show Less' : 'Show More'} onPress={() => toggleExpand(item._id)} />
        {item.accepted && (
          <TouchableOpacity
            style={styles.fillFormButton}
            onPress={() => navigation.navigate('NewInstallation', { pickupItemId: item._id })}
          >
            {/* <Text style={styles.fillFormText}>Fill Form</Text> */}
          </TouchableOpacity>
        )}
        {!item.accepted && (
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApproveBtn(item._id, item.farmerDetails._id, item.empId)}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );   

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={item => item._id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    backgroundColor: '#fbd33b',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: width * 0.05,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  text: {
    fontSize: 14,
    marginBottom: 3,
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  fillFormButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  fillFormText: {
    color: 'white',
    fontWeight: 'bold',
  },
  approveButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ApprovalNewInstallation;
