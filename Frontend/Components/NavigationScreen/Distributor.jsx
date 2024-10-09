// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
// import { Picker } from '@react-native-picker/picker'; // New import

// const Distributor = () => {
//   const [name, setName] = useState('');
//   const [contact, setContact] = useState('');
//   const [itemName, setItemName] = useState('pump');
//   const [quantity, setQuantity] = useState(1);
//   const [status, setStatus] = useState('in');

//   const increaseQuantity = () => setQuantity(quantity + 1);
//   const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Name</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter name"
//         value={name}
//         onChangeText={setName}
//       />

//       <Text style={styles.label}>Contact</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter contact"
//         value={contact}
//         onChangeText={setContact}
//       />

//       <Text style={styles.label}>Item Name</Text>
//       <Picker
//         selectedValue={itemName}
//         style={styles.picker}
//         onValueChange={(itemValue) => setItemName(itemValue)}
//       >
//         <Picker.Item label="Pump" value="pump" />
//         <Picker.Item label="Motor" value="motor" />
//         <Picker.Item label="Controller" value="controller" />
//       </Picker>

//       <Text style={styles.label}>Quantity</Text>
//       <View style={styles.quantityContainer}>
//         <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
//           <Text>-</Text>
//         </TouchableOpacity>
//         <Text style={styles.quantityText}>{quantity}</Text>
//         <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
//           <Text>+</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.label}>Video Proof</Text>
//       {/* You can integrate video uploading functionality here */}

//       <Text style={styles.label}>Status</Text>
//       <Picker
//         selectedValue={status}
//         style={styles.picker}
//         onValueChange={(itemValue) => setStatus(itemValue)}
//       >
//         <Picker.Item label="In" value="in" />
//         <Picker.Item label="Out" value="out" />
//       </Picker>

//       <View style={styles.buttonContainer}>
//         <Button title="Add" onPress={() => { /* Add logic here */ }} />
//         <Button title="Update" onPress={() => { /* Update logic here */ }} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingLeft: 10,
//     borderRadius: 4,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     marginBottom: 20,
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   quantityButton: {
//     backgroundColor: '#ccc',
//     padding: 10,
//     borderRadius: 4,
//   },
//   quantityText: {
//     marginHorizontal: 20,
//     fontSize: 16,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
// });

// export default Distributor;
