// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import axios from 'axios';
// import { API_URL } from '@env';
// import Icon from 'react-native-vector-icons/Feather'; 

// const ServicePersonRegistration = ({ navigation }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '', 
//     contact: '',
//     password: '',
//     createdAt: new Date(),
//   });
//   const [loading, setLoading] = useState(false);
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const handleChange = (key, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [key]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     const { name, email, contact, password } = formData;
//     const createdAt = new Date().toISOString();

//     if (!name || !email || !contact || !password) {
//       Alert.alert('Error', 'Please fill out all required fields.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${API_URL}/warehouse-admin/service-person-signup`,{ name, email, contact, password, createdAt });
//         Alert.alert('Registration Successful');
//         setFormData({
//           name: '',
//           email: '',
//           contact: '',
//           password: '',
//           createdAt: new Date(),
//         });
  
//     } catch (error) {
//       Alert.alert(
//         'Registration Failed',
//         error.response?.data?.message || 'An error occurred. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={{ flex: 1, justifyContent: 'center', marginTop: -64 }}>
//         <Text style={styles.title}>Service Person Registration</Text>

//         <Text style={styles.label}>
//           Name <Text style={styles.required}>*</Text>
//         </Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={formData.name}
//           onChangeText={(value) => handleChange('name', value)}
//         />

//         <Text style={styles.label}>
//           Contact <Text style={styles.required}>*</Text>
//         </Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Contact"
//           value={formData.contact}
//           onChangeText={(value) => handleChange('contact', value)}
//           keyboardType="phone-pad"
//           maxLength={10}
//         />

//         <Text style={styles.label}>
//           Email <Text style={styles.required}>*</Text>
//         </Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={formData.email}
//           onChangeText={(value) => handleChange('email', value)}
//           keyboardType="email-address"
//         />

//         <Text style={styles.label}>
//           Password <Text style={styles.required}>*</Text>
//         </Text>
//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={[styles.input, { paddingRight: 40 }]} // Adding padding for the icon
//             placeholder="Password"
//             value={formData.password}
//             onChangeText={(value) => handleChange('password', value)}
//             secureTextEntry={!passwordVisible}
//           />
//           <TouchableOpacity
//             style={styles.eyeIcon}
//             onPress={() => setPasswordVisible(!passwordVisible)}
//           >
//             <Icon
//               name={passwordVisible ? 'eye' : 'eye-off'}
//               size={24}
//               color="#070604"
//             />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={[{ backgroundColor: loading ? '#aaa' : 'black', padding: 16, borderRadius: 5 }]}
//           onPress={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
//               Register
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fbd33b',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#070604',
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//     color: '#070604',
//   },
//   required: {
//     color: 'red',
//     fontSize: 18,
//   },
//   input: {
//     height: 50,
//     borderColor: '#070604',
//     borderRadius: 5,
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   passwordContainer: {
//     position: 'relative', 
//     marginBottom: 15,
//   },
//   eyeIcon: {
//     position: 'absolute',
//     right: 16, 
//     top: '50%',
//     transform: [{ translateY: -12 }],
//   },
// });

// export default ServicePersonRegistration;


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import Icon from 'react-native-vector-icons/Feather';

const ServicePersonRegistration = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    createdAt: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const { name, email, contact, password } = formData;
    const createdAt = new Date().toISOString();

    if (!name || !email || !contact || !password) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/warehouse-admin/service-person-signup`,
        { name, email, contact, password, createdAt }
      );
      Alert.alert('Registration Successful');
      setFormData({
        name: '',
        email: '',
        contact: '',
        password: '',
        createdAt: new Date(),
      });
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.card}>
          <Text style={styles.title}>Service Person Registration</Text>

          <Text style={styles.label}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
          />

          <Text style={styles.label}>
            Contact <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Contact"
            value={formData.contact}
            onChangeText={(value) => handleChange('contact', value)}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
          />

          <Text style={styles.label}>
            Password <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { paddingRight: 40 }]}
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon
                name={passwordVisible ? 'eye' : 'eye-off'}
                size={24}
                color="#4B4B4B"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: loading ? '#aaa' : '#070604' }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6C700',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: '#FFD95C',
    borderRadius: 12,
    padding: 20,
    elevation: 5, 
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderColor: '#F7A600',
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#070604',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#070604',
  },
  required: {
    color: '#D82100',
    fontSize: 18,
  },
  input: {
    height: 50,
    borderColor: '#F7A600', 
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF9E3', 
    color: '#070604', 
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  button: {
    padding: 16,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ServicePersonRegistration;

