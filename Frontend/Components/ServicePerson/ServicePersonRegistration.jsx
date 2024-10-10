// import React, { useState } from 'react';
// import { View, TextInput, Button, Text } from 'react-native';

// const ServicePersonRegistration = () => {
//   const [name, setName] = useState('');
//   const [mobileNo, setMobileNo] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // By default, set password to mobile number
//   const handleMobileChange = (value) => {
//     setMobileNo(value);
//     setPassword(value); // Default password is mobile number
//   };

//   const handleRegister = () => {
//     // Registration logic
//     console.log("User Registered", { name, mobileNo, email, password });
//   };

//   const handleResetPassword = () => {
//     // Logic for resetting password
//     console.log("Password Reset");
//   };

//   return (
//     <View>
//       <TextInput
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         placeholder="Mobile No"
//         value={mobileNo}
//         onChangeText={handleMobileChange}
//         keyboardType="numeric"
//       />
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Register" onPress={handleRegister} />
      
//       {/* Option to reset password */}
//       <Text>Forgot your password?</Text>
//       <Button title="Reset Password" onPress={handleResetPassword} />
//     </View>
//   );
// };

// export default ServicePersonRegistration;
