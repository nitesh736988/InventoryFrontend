// import React, {useState} from 'react';
// import {
//   View,
//   TextInput,
//   StyleSheet,
//   Text,
//   Alert,
//   ActivityIndicator,
//   TouchableOpacity,
// } from 'react-native';
// import axios from 'axios';
// import {API_URL} from '@env';

// const AddData = ({ route }) => {
//   const { itemName } = route.params;
//   const [stock, setStock] = useState('');
//   const [defective, setDefective] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!stock || !defective) {
//       Alert.alert('Error', 'Please fill all fields.');
//       return;
//     }

//     const stockValue = parseInt(stock);
//     if (isNaN(stockValue) || stockValue < 0) {
//       Alert.alert('Error', 'Stock must be a positive integer.');
//       return;
//     }

//     const defectiveValue = parseInt(defective);
//     if (isNaN(defectiveValue) || defectiveValue < 0) {
//       Alert.alert('Error', 'Defective quantity must be a positive integer.');
//       return;
//     }

//     const itemData = {
//       itemName,
//       quantity: stock
//     };

//     setLoading(true);
//     console.log({
//       items: [itemData],
//       defective: defective,
//     });
//     try {
      
//       const response = await axios.post(`${API_URL}/warehouse-admin/add-item-stock`, {
//         items: [itemData],
//         defective: defective,
//       });
//       console.log('Response:', response.data);
//       Alert.alert('Success', 'Item added successfully!');

//       setStock('');
//       setDefective('');
//     } catch (error) {
//       // console.log('Error adding item:', error);
//       Alert.alert('Error adding item', JSON.stringify(error.response.data?.message));
//       if (error.response && error.response.data) {
//         Alert.alert(
//           'Error',
//           error.response.data.message || 'An error occurred.',
//         );
//       } else {
//         Alert.alert('Error', 'An unexpected error occurred. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Stock:</Text>
//       <TextInput
//         style={styles.input}
//         value={stock}
//         onChangeText={setStock}
//         keyboardType="numeric"
//       />

//       <Text style={styles.label}>Defective Quantity:</Text>
//       <TextInput
//         style={styles.input}
//         value={defective}
//         onChangeText={setDefective}
//         keyboardType="numeric"
//       />

//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         {loading ? (
//           <ActivityIndicator color="#ffffff" />
//         ) : (
//           <Text style={styles.buttonText}>Add Item</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fbd33b',
//   },
//   label: {
//     marginVertical: 10,
//     fontSize: 16,
//     fontWeight: '600',
//     color: 'black',
//   },
//   input: {
//     color: 'black',
//     borderWidth: 1,
//     borderColor: '#070604',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//   },
//   button: {
//     backgroundColor: '#070604',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//   },
// });

// export default AddData;


import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';

const AddData = ({ route }) => {
  const { itemName } = route.params;
  const [stock, setStock] = useState('');
  const [newStock, setNewStock] = useState('');
  const [defective, setDefective] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!stock || !newStock || !defective) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const stockValue = parseInt(stock);
    if (isNaN(stockValue) || stockValue < 0) {
      Alert.alert('Error', 'Stock must be a positive integer.');
      return;
    }

    const newStockValue = parseInt(newStock);
    if (isNaN(newStockValue) || newStockValue < 0) {
      Alert.alert('Error', 'New Stock must be a positive integer.');
      return;
    }

    const defectiveValue = parseInt(defective);
    if (isNaN(defectiveValue) || defectiveValue < 0) {
      Alert.alert('Error', 'Defective quantity must be a positive integer.');
      return;
    }

    const itemData = {
      itemName,
      quantity: stock,
      newStock
    };

    setLoading(true);
    console.log({
      items: [itemData],
      defective: defective,
    });
    try {
      
      const response = await axios.post(`${API_URL}/warehouse-admin/add-item-stock`, {
        items: [itemData],
        defective: defective,
      });
      console.log('Response:', response.data);
      Alert.alert('Success', 'Item added successfully!');

      setStock('');
      setNewStock('');
      setDefective('');
    } catch (error) {
      // console.log('Error adding item:', error);
      Alert.alert('Error adding item', JSON.stringify(error.response.data?.message));
      if (error.response && error.response.data) {
        Alert.alert(
          'Error',
          error.response.data.message || 'An error occurred.',
        );
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name: {itemName}</Text>
  
      <Text style={styles.label}>Stock:</Text>
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      <Text style={styles.label}>New Stock:</Text>
      <TextInput
        style={styles.input}
        value={newStock}
        onChangeText={setNewStock}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Defective Quantity:</Text>
      <TextInput
        style={styles.input}
        value={defective}
        onChangeText={setDefective}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Add Item</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fbd33b',
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  input: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#070604',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#070604',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default AddData;