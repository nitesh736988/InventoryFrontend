// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';

// const ImageUpload = () => {
//   const [imageUri, setImageUri] = useState(null);

//   const openGallery = () => {
//     launchImageLibrary(
//       {
//         mediaType: 'photo', 
//         quality: 0.5, 
//         includeBase64: false, 
//       },
//       response => {
//         if (response.didCancel) {
//           console.log('User cancelled image picker');
//         } else if (response.errorCode) {
//           console.log('ImagePicker Error: ', response.errorCode);
//         } else if (response.assets && response.assets.length > 0) {
//           const { uri } = response.assets[0];
//           setImageUri(uri);
//         }
//       }
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {imageUri ? (
//         <Image source={{ uri: imageUri }} style={styles.image} />
//       ) : (
//         <Text style={styles.noImageText}>No image selected</Text>
//       )}

//       <TouchableOpacity onPress={openGallery} style={styles.uploadButton}>
//         <Text style={styles.uploadButtonText}>Choose Image</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 20,
//     fontWeight: 'bold',
//   },
//   uploadButton: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   uploadButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   image: {
//     width: 100,
//     height: 100, 
//     borderRadius: 50, 
//     marginBottom: 20,
//   },
//   noImageText: {
//     fontSize: 16,
//     color: 'gray',
//     marginBottom: 20,
//   },
// });

// export default ImageUpload;
