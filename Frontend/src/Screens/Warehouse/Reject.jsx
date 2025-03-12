// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import {Picker} from '@react-native-picker/picker';
// import axios from 'axios';
// import {API_URL} from '@env';

// const Repaired = () => {
//   const [itemName, setItemName] = useState('');
//   const [serialNumber, setSerialNumber] = useState('');
//   const [remark, setRemark] = useState('');
//   const [items, setItems] = useState([]);
//   const [rejected, setRejected] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/warehouse-admin/view-items`,
//         );
//         const items = response.data.items.map((item, index) => ({
//           _id: index + 1,
//           itemName: item,
//         }));
//         setItems(items);
//       } catch (error) {
//         console.log('Failed to fetch items:', error);
//       }
//     };

//     fetchItems();
//   }, []);

//   const handleSubmit = async () => {
//     if (!itemName || !serialNumber || !rejected || !remark) {
//       Alert.alert('Error', 'Please fill all the fields.');
//       return;
//     }

//     const newItem = {
//       itemName,
//       serialNumber,
//       rejected,
//       remark,
//       createdAt: new Date(),
//     };

//     try {
//       // console.log(newItem)
//       setLoading(true);
//       const response = await axios.post(
//         `${API_URL}/warehouse-admin/reject-item`,
//         newItem,
//       );
//       console.log(response.data.data);

//       Alert.alert('Success', 'Item repaired data has been submitted.');
//       setItemName('');
//       setSerialNumber('');
//       setRejected('');
//       setRemark('');
//     } catch (error) {
//       console.log('Error submitting data:', error);
//       Alert.alert('Error', 'Something went wrong while submitting.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.heading}>Reject Items</Text>

//       <View style={styles.form}>
//         <Text style={styles.label}>Item Name:</Text>
//         <Picker
//           selectedValue={itemName}
//           onValueChange={itemValue => setItemName(itemValue)}
//           style={styles.input}>
//           <Picker.Item label="Select Item" value="" />
//           {items.map(item => (
//             <Picker.Item
//               key={item._id}
//               label={item.itemName}
//               value={item.itemName}
//             />
//           ))}
//         </Picker>

//         <Text style={styles.label}>Serial Number:</Text>
//         <TextInput
//           value={serialNumber}
//           onChangeText={setSerialNumber}
//           style={styles.input}
//         />

//         <Text style={styles.label}>Rejected:</Text>
//         <TextInput
//           value={rejected}
//           onChangeText={setRejected}
//           style={styles.input}
//         />

//         <Text style={styles.label}>Remark:</Text>
//         <TextInput
//           value={remark}
//           onChangeText={setRemark}
//           style={styles.textArea}
//           multiline
//         />

//         {/* <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity> */}

//         <TouchableOpacity
//           style={styles.button}
//           onPress={handleSubmit}
//           disabled={loading}>
//           <Text style={styles.buttonText}>
//             {loading ? 'Submitting...' : 'Submit'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#ffffff',
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 20,
//     color: '#070604',
//   },
//   form: {
//     padding: 15,
//     backgroundColor: '#fbd33b',
//     borderRadius: 8,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: '#070604',
//   },
//   input: {
//     backgroundColor: '#f9f9f9',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 15,
//     fontSize: 14,
//     color: '#070604',
//   },
//   textArea: {
//     backgroundColor: '#f9f9f9',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     minHeight: 80,
//     fontSize: 14,
//     color: '#070604',
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: '#070604',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fbd33b',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default Repaired;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '@env';

const Reject = () => {
  const [itemName, setItemName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [remark, setRemark] = useState('');
  const [items, setItems] = useState([]);
  const [rejected, setRejected] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/warehouse-admin/view-items`);
        const items = response.data.items.map((item, index) => ({
          _id: index + 1,
          itemName: item,
        }));
        setItems(items);
      } catch (error) {
        console.log('Failed to fetch items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleSubmit = async () => {
    if (!itemName || !serialNumber || !rejected || (!selectedValue === "other" && !remark) || !selectedValue) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    const newItem = {
      itemName,
      serialNumber,
      rejected,
      remark: selectedValue === 'other' ? remark : selectedValue,
      createdAt: new Date(),
    };

    console.log("new Item", newItem);

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/warehouse-admin/reject-item`, newItem);
      console.log("my response data for reject element",response.data.data);

      Alert.alert('Success', 'Item repaired data has been submitted.');
      setItemName('');
      setSerialNumber('');
      setRejected('');
      setRemark('');
      setSelectedValue('');
      navigation.navigate('WarehouseNavigation');
    } catch (error) {
      console.log('Error submitting data:', error?.response?.data || error?.message);
       Alert.alert('Error',error.response?.data?.message || 'Something went wrong while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Reject Items</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Item Name:</Text>
        <Picker
          selectedValue={itemName}
          onValueChange={itemValue => setItemName(itemValue)}
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

        <Text style={styles.label}>Rejected Quantity:</Text>
        <TextInput
          value={rejected}
          onChangeText={setRejected}
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Serial Number:</Text>
        <TextInput
          value={serialNumber}
          onChangeText={setSerialNumber}
          style={styles.input}
        />

        <Text style={styles.label}>Select an Issue:</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={setSelectedValue}
          style={styles.input}>
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
            value={remark}
            onChangeText={setRemark}
            multiline
          />
        )}

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
  form: {
    padding: 15,
    backgroundColor: '#fbd33b',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  textArea: {
    minHeight: 80,
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

export default Reject;