// import React, { useState } from 'react';
// import { Alert, ActivityIndicator, Text, TextInput, View, SafeAreaView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_URL } from '@env';

// axios.defaults.withCredentials = true;

// const LoginPage = () => {
//   const navigation = useNavigation();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(true);

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSubmit = async () => {
//     if (!email || !password || !role) {
//       Alert.alert('Error', 'Please fill out all fields, including selecting a role.');
//       return;
//     }

//     if (!validateEmail(email)) {
//       Alert.alert('Error', 'Please enter a valid email address.');
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log(API_URL);
//       console.log(email, password, role);
//       const response = await axios.post(`${API_URL}/user/login`, { email, password, role });
//       Alert.alert('Success', 'Login successful!');
//       if (role === 'serviceperson') {
//         console.log(response.data);
//         const { id } = response.data;
//         console.log("Login Person id", id);
//         await AsyncStorage.setItem("_id", id);
//         navigation.navigate('ServicePersonNavigation');
//       } else if (role === 'warehouseAdmin') {
//         navigation.navigate('WarehouseNavigation');
//       } else if (role === 'admin') {
//         navigation.navigate('Navigation');
//       }
//     } catch (error) {
//       if (error.response) {
//         switch (error.response.status) {
//           case 401:
//             Alert.alert('Login Failed', 'Incorrect credentials. Please try again.');
//             break;
//           case 500:
//             Alert.alert('Server Error', 'There is an issue with the server. Please try again later.');
//             break;
//           default:
//             Alert.alert('Login Failed', error.response.data?.message || 'An error occurred.');
//         }
//       } else if (error.request) {
//         Alert.alert('Network Error', 'Please check your internet connection.');
//       } else {
//         Alert.alert('Error', 'An unexpected error occurred.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.projectName}>Inventory System</Text>
//       <Text style={styles.title}>Login</Text>
//       <View style={styles.inputView}>
//         <Picker
//           selectedValue={role}
//           style={styles.picker}
//           onValueChange={(itemValue) => setRole(itemValue)}
//           enabled={!loading}
//         >
//           <Picker.Item label="Select Role" value="" />
//           <Picker.Item label="Admin" value="admin" />
//           <Picker.Item label="Warehouse Admin" value="warehouseAdmin" />
//           <Picker.Item label="ServicePerson" value="serviceperson" />
//         </Picker>
//         {role !== '' && (
//           <>
//             <View style={styles.inputWithIcon}>
//               <Icon name="email" size={20} color="black" style={styles.icon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="EMAIL"
//                 value={email}
//                 onChangeText={setEmail}
//                 autoCorrect={false}
//                 autoCapitalize="none"
//                 editable={!loading}
//                 placeholderTextColor={'#000'}
//               />
//             </View>
//             <View style={styles.inputWithIcon}>
//               <Icon name="lock" size={20} color="black" style={styles.icon} />
//               <TextInput
//                 style={styles.passwordInputWithIcon}
//                 placeholder="PASSWORD"
//                 secureTextEntry={showPassword}
//                 value={password}
//                 onChangeText={setPassword}
//                 autoCorrect={false}
//                 autoCapitalize="none"
//                 editable={!loading}
//                 placeholderTextColor={'#000'}
//               />
//               <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                 <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="black" />
//               </TouchableOpacity>
//             </View>
//           </>
//         )}
//       </View>
//       <View style={styles.buttonView}>
//         <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
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
//     paddingTop: 50,
//     backgroundColor: '#fbd33b',
//   },
//   projectName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: -10,
//     color: '#070604',
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
//   inputWithIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: '#000',
//     borderWidth: 1,
//     borderRadius: 7,
//     paddingHorizontal: 12,
//     height: 50,
//     backgroundColor: 'white',
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     color: 'black',
//   },
//   passwordInputWithIcon: {
//     flex: 1,
//     color: 'black',
//   },
//   picker: {
//     height: 50,
//     borderColor: '#070604',
//     borderWidth: 1,
//     borderRadius: 7,
//     color: 'black',
//   },
//   buttonView: {
//     width: '100%',
//     paddingHorizontal: 40,
//   },
//   button: {
//     backgroundColor: '#070604',
//     height: 45,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 15,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default LoginPage;


import React, { useState } from 'react';
import { 
  Alert, 
  ActivityIndicator, 
  Text, 
  TextInput, 
  View, 
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  Pressable 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

axios.defaults.withCredentials = true;

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!email || !password || !role) {
      Alert.alert('Error', 'Please fill out all fields, including selecting a role.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      console.log(API_URL);
      console.log(email, password, role);
      const response = await axios.post(`${API_URL}/user/login`, { email, password, role });
      Alert.alert('Success', 'Login successful!');
      if (role === 'serviceperson') {
        const { id, block } = response.data;
        console.log("Login Person id", id);
        console.log("Login Person block", block);
        await AsyncStorage.setItem("_id", id);
        await AsyncStorage.setItem("block", JSON.stringify(block));
        navigation.navigate('ServicePersonNavigation');
      } else if (role === 'warehouseAdmin') {
        navigation.navigate('WarehouseNavigation');
      } else if (role === 'admin') {
        navigation.navigate('Navigation');
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            Alert.alert('Login Failed', 'Incorrect credentials. Please try again.');
            break;
          case 500:
            Alert.alert('Server Error', 'There is an issue with the server. Please try again later.');
            break;
          default:
            Alert.alert('Login Failed', error.response.data?.message || 'An error occurred.');
        }
      } else if (error.request) {
        Alert.alert('Network Error', 'Please check your internet connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.projectName}>Inventory System</Text>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputView}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
          enabled={!loading}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Warehouse Admin" value="warehouseAdmin" />
          <Picker.Item label="ServicePerson" value="serviceperson" />
        </Picker>
        {role !== '' && (
          <>
            <View style={styles.inputWithIcon}>
              <Icon name="email" size={20} color="black" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="EMAIL"
                value={email}
                onChangeText={setEmail}
                autoCorrect={false}
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor={'#000'}
              />
            </View>
            <View style={styles.inputWithIcon}>
              <Icon name="lock" size={20} color="black" style={styles.icon} />
              <TextInput
                style={styles.passwordInputWithIcon}
                placeholder="PASSWORD"
                secureTextEntry={showPassword}
                value={password}
                onChangeText={setPassword}
                autoCorrect={false}
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor={'#000'}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="black" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fbd33b',
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: -10,
    color: '#070604',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingVertical: 40,
    color: '#070604',
  },
  inputView: {
    gap: 15,
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 5,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: 'white',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'black',
  },
  passwordInputWithIcon: {
    flex: 1,
    color: 'black',
  },
  picker: {
    height: 50,
    borderColor: '#070604',
    borderWidth: 1,
    borderRadius: 7,
    color: 'black',
  },
  buttonView: {
    width: '100%',
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#070604',
    height: 45,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginPage;
