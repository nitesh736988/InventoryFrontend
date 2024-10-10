// import React, { useState } from 'react';
// import { Alert, ActivityIndicator, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';

          
// const WareHouseLogin = () => {
//   const navigation = useNavigation();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handlesubmit = async () => {

//     if (!email || !password) {
//       Alert.alert("Error", "Please fill out both fields");
//       return;
//     }
//     setLoading(true); 
//     console.log(email + " " + password);
//     try {
//       const response = await axios.post('http://192.168.68.108:8080/user/login', { email, password },{timeout: 2000});
//       if (response.status === 200) {
       
//         navigation.navigate('Navigation')
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Login Failed", JSON.stringify(error.request));
//     } finally {
//       setLoading(false); 
//     }
//   };
    
//   return (
//     <SafeAreaView style={styles.container}>
//       <Image source={require('../assets/galologo.png')} style={styles.image} resizeMode="contain" />
//       <Text style={styles.title}>Login</Text>
//       <View style={styles.inputView}>
//         <TextInput
//           style={styles.input}
//           placeholder="EMAIL"
//           value={email}
//           onChangeText={setEmail}
//           autoCorrect={false}
//           autoCapitalize="none"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="PASSWORD"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//           autoCorrect={false}
//           autoCapitalize="none"
//         />
//       </View>
//       <View style={styles.buttonView}>
//         <Pressable style={styles.button} onPress={handlesubmit} disabled={loading}>
//           {loading ? (
//             <ActivityIndicator size="small" color="white" />
//           ) : (
//             <Text style={styles.buttonText}>LOGIN</Text>
//           )}
//         </Pressable>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     paddingTop: 70,
//     backgroundColor: '#fbd33b',
//   },
//   image: {
//     height: 160,
//     width: 170,
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     textTransform: 'uppercase',
//     textAlign: 'center',
//     paddingVertical: 40,
//     color: '#070604',
//   },
//   inputView: {
//     gap: 15,
//     width: '100%',
//     paddingHorizontal: 40,
//     marginBottom: 5,
//   },
//   input: {
//     height: 50,
//     paddingHorizontal: 20,
//     borderColor: '#070604',
//     borderWidth: 1,
//     borderRadius: 7,
//   },
//   buttonView: {
//     width: '100%',
//     paddingHorizontal: 50,
//   },
//   button: {
//     backgroundColor: '#070604',
//     height: 45,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default WareHouseLogin;
