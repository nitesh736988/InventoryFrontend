// import { View, Text, StyleSheet, FlatList, Alert, TextInput } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import api from '../../auth/api';;
// import { API_URL } from '@env';

// const NewInstallationTransactionData = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await api.get(`${API_URL}/warehouse-admin/new-installation-data`);
//       setData(response.data.data);
//       setFilteredData(response.data.data); // Initialize filteredData with all data
//     } catch (error) {
//       console.log('Error fetching data:', error?.response?.data?.message);
//       Alert.alert('Error', error?.response?.data?.message || 'Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (search) {
//       setFilteredData(
//         data.filter((item) => {
//           const searchText = search.toLowerCase();
//           return (
//             (item.farmerSaralId || '').toLowerCase().includes(searchText) ||
//             (item.farmerDetails?.farmerName || '').toLowerCase().includes(searchText) ||
//             (item.farmerDetails?.contact || '').toLowerCase().includes(searchText) ||
//             (item.farmerDetails?.village || '').toLowerCase().includes(searchText) ||
//             (item.farmerDetails?.district || '').toLowerCase().includes(searchText)
//           );
//         })
//       );
//     } else {
//       setFilteredData(data);
//     }
//   }, [search, data]);

//   const formatDate = (dateString) => {
//     try {
//       if (!dateString) return 'N/A';
//       const date = new Date(dateString);
//       return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-IN');
//     } catch {
//       return 'N/A';
//     }
//   };

//   const renderStatus = (accepted, installationDone) => {
//     if (accepted) {
//       return installationDone ? (
//         <Text style={[styles.statusText, styles.statusApproved]}>Approved - Installation Complete</Text>
//       ) : (
//         <Text style={[styles.statusText, styles.statusPendingInstallation]}>Approved - Pending Installation</Text>
//       );
//     }
//     return <Text style={[styles.statusText, styles.statusPending]}>Pending Approval</Text>;
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.statusContainer}>
//         <Text style={styles.statusLabel}>Status: </Text>
//         {renderStatus(item.accepted, item.installationDone)}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Farmer Information</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Name:</Text>
//           <Text style={styles.value}>{item.farmerDetails?.farmerName || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Saral ID:</Text>
//           <Text style={styles.value}>{item.farmerSaralId || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Contact:</Text>
//           <Text style={styles.value}>{item.farmerDetails?.contact || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Village:</Text>
//           <Text style={styles.value}>{item.farmerDetails?.village || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>District:</Text>
//           <Text style={styles.value}>{item.farmerDetails?.district || 'N/A'}</Text>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Service Person</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Name:</Text>
//           <Text style={styles.value}>{item.empId?.name || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Contact:</Text>
//           <Text style={styles.value}>{item.empId?.contact || 'N/A'}</Text>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Equipment Details</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Pump Number:</Text>
//           <Text style={styles.value}>{item.pumpNumber || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Controller Number:</Text>
//           <Text style={styles.value}>{item.controllerNumber || 'N/A'}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>RMU Number:</Text>
//           <Text style={styles.value}>{item.rmuNumber || 'N/A'}</Text>
//         </View>
//         {item.motorNumber && (
//           <View style={styles.row}>
//             <Text style={styles.label}>Motor Number:</Text>
//             <Text style={styles.value}>{item.motorNumber}</Text>
//           </View>
//         )}
//       </View>

  

//       {item.panelNumbers?.length > 0 && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Panel Numbers ({item.panelNumbers.length})</Text>
//           <View style={styles.panelContainer}>
//             {item.panelNumbers.map((panel, index) => (
//               <Text key={index} style={styles.panelNumber}>{panel || 'N/A'}</Text>
//             ))}
//           </View>
//         </View>
//       )}

//       {item.extraPanelNumbers?.length > 0 && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Extra Panel Numbers ({item.extraPanelNumbers.length})</Text>
//           <View style={styles.panelContainer}>
//             {item.extraPanelNumbers.map((panel, index) => (
//               <Text key={index} style={styles.panelNumber}>{panel || 'N/A'}</Text>
//             ))}
//           </View>
//         </View>
//       )}

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Items List ({item.itemsList?.length || 0})</Text>
//         {item.itemsList?.map((listItem, index) => (
//           <View key={index} style={styles.row}>
//             <Text style={styles.label}>{listItem.systemItemId?.itemName || 'Unknown Item'}:</Text>
//             <Text style={styles.value}>{listItem.quantity || 0}</Text>
//           </View>
//         ))}
//       </View>

//       {item.extraItemsList?.length > 0 && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Extra Items List ({item.extraItemsList.length})</Text>
//           {item.extraItemsList.map((listItem, index) => (
//             <View key={index} style={styles.row}>
//               <Text style={styles.label}>{listItem.systemItemId?.itemName || 'Unknown Item'}:</Text>
//               <Text style={styles.value}>{listItem.quantity || 0}</Text>
//             </View>
//           ))}
//         </View>
//       )}

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Dates</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Sending Date:</Text>
//           <Text style={styles.value}>{formatDate(item.sendingDate)}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Created At:</Text>
//           <Text style={styles.value}>{formatDate(item.createdAt)}</Text>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Warehouse</Text>
//         <Text style={styles.value}>{item.warehouseId?.warehouseName || 'N/A'}</Text>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>New Installation Transactions</Text>
      
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by farmer name, ID, contact, village..."
//           value={search}
//           onChangeText={setSearch}
//         />
//       </View>

//       {filteredData.length === 0 ? (
//         <View style={styles.noData}>
//           <Text>No installation data found</Text>
//           {search && <Text>for search term: "{search}"</Text>}
//         </View>
//       ) : (
//         <FlatList
//           data={filteredData}
//           keyExtractor={(item) => item._id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           ListHeaderComponent={<View style={{ height: 10 }} />}
//           ListFooterComponent={<View style={{ height: 20 }} />}
//           refreshing={loading}
//           onRefresh={fetchData}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#333',
//   },
//   searchContainer: {
//     paddingHorizontal: 15,
//     marginBottom: 10,
//   },
//   searchInput: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   noData: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   listContent: {
//     paddingHorizontal: 15,
//     paddingBottom: 20,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     padding: 8,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 5,
//   },
//   statusLabel: {
//     fontWeight: 'bold',
//   },
//   statusText: {
//     fontWeight: 'bold',
//   },
//   statusPending: {
//     color: '#dc3545', // red
//   },
//   statusPendingInstallation: {
//     color: '#fd7e14', // orange
//   },
//   statusApproved: {
//     color: '#28a745', // green
//   },
//   section: {
//     marginBottom: 15,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   sectionTitle: {
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#495057',
//     fontSize: 16,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   label: {
//     color: '#6c757d',
//     flex: 1,
//     color: '#000'
//   },
//   value: {
//     flex: 1,
//     textAlign: 'right',
//     fontWeight: '500',
//     color: '#000'
//   },
//   panelContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   panelNumber: {
//     backgroundColor: '#e9ecef',
//     borderRadius: 4,
//     padding: 4,
//     marginRight: 6,
//     marginBottom: 6,
//   },
// });

// export default NewInstallationTransactionData;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   RefreshControl,
//   Modal,
//   TouchableWithoutFeedback,
//   PermissionsAndroid,
//   Platform,
//   Linking,
// } from 'react-native';
// import api from '../../auth/api';;
// import { API_URL } from '@env';
// import RNFetchBlob from 'rn-fetch-blob';

// const { width, height } = Dimensions.get('window');

// const NewInstallationTransactionData = () => {
//   const [dispatchData, setDispatchData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imageModalVisible, setImageModalVisible] = useState(false);
//   const [downloading, setDownloading] = useState(false);

//   const fetchDispatchHistory = async () => {
//     try {
//       const response = await api.get(`${API_URL}/warehouse-admin/get-dispatch-history`);
      
//       if (response.data.success) {
//         setDispatchData(response.data.data || []);
//       } else {
//         Alert.alert('Error', response.data.message || 'Failed to fetch data');
//       }
//     } catch (error) {
//       console.log('Error fetching dispatch history:', error.message);
//       Alert.alert('Error', 'Failed to fetch dispatch history');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchDispatchHistory();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchDispatchHistory();
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Check and request storage permission for Android
//   const checkAndRequestStoragePermission = async () => {
//     if (Platform.OS === 'ios') return true;

//     try {
//       // For Android 13+ (API level 33), we need READ_MEDIA_IMAGES instead of WRITE_EXTERNAL_STORAGE
//       const androidVersion = Platform.Version;
//       let permission;

//       if (androidVersion >= 33) {
//         // Android 13+ - Use new media permissions
//         permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
//       } else {
//         // Android < 13 - Use legacy storage permissions
//         permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
//       }

//       const hasPermission = await PermissionsAndroid.check(permission);
      
//       if (hasPermission) {
//         return true;
//       }

//       const granted = await PermissionsAndroid.request(permission, {
//         title: 'Storage Permission Required',
//         message: 'This app needs access to your storage to download images',
//         buttonPositive: 'OK',
//         buttonNegative: 'Cancel',
//       });

//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn('Permission error:', err);
//       return false;
//     }
//   };

//   // Download image function
//   const downloadImage = async (imageUrl) => {
//     try {
//       setDownloading(true);

//       // Check and request permission
//       const hasPermission = await checkAndRequestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert(
//           'Permission Required',
//           'Storage permission is required to download images. Please grant permission in app settings.',
//           [
//             { text: 'Cancel', style: 'cancel' },
//             { 
//               text: 'Open Settings', 
//               onPress: () => Linking.openSettings() 
//             }
//           ]
//         );
//         return;
//       }

//       // Get file extension from URL
//       const fileExtension = imageUrl.split('.').pop().split('?')[0];
//       const validExtension = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension.toLowerCase()) 
//         ? fileExtension 
//         : 'jpg';

//       // Create filename
//       const timestamp = new Date().getTime();
//       const filename = `bill_photo_${timestamp}.${validExtension}`;

//       // Define download path based on platform
//       let downloadPath;
//       if (Platform.OS === 'ios') {
//         downloadPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`;
//       } else {
//         // For Android, use Download directory
//         downloadPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${filename}`;
//       }

//       console.log('Downloading to:', downloadPath);

//       // Download configuration
//       const configOptions = {
//         fileCache: true,
//         path: downloadPath,
//         addAndroidDownloads: {
//           useDownloadManager: true,
//           notification: true,
//           path: downloadPath,
//           description: 'Bill Photo Download',
//           mime: `image/${validExtension}`,
//           mediaScannable: true,
//         },
//       };

//       // Perform download
//       const response = await RNFetchBlob.config(configOptions).fetch('GET', imageUrl, {
//         'Content-Type': 'application/octet-stream',
//       });

//       setDownloading(false);

//       // Show success message
//       if (Platform.OS === 'android') {
//         // Android shows notification automatically
//         Alert.alert('Success', 'Image downloaded successfully to your Downloads folder!');
//       } else {
//         // iOS
//         Alert.alert('Success', `Image downloaded successfully!\n\nLocation: Documents/${filename}`);
//       }

//     } catch (error) {
//       setDownloading(false);
//       console.log('Download error details:', error);
//       Alert.alert(
//         'Download Failed', 
//         'Failed to download image. Please check your connection and try again.'
//       );
//     }
//   };

//   const openImage = (imageUrl) => {
//     setSelectedImage(imageUrl);
//     setImageModalVisible(true);
//   };

//   const closeImageModal = () => {
//     setImageModalVisible(false);
//     setSelectedImage(null);
//   };

//   // Handle download from modal
//   const handleDownloadFromModal = () => {
//     if (selectedImage) {
//       downloadImage(selectedImage);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#007bff" />
//         <Text style={styles.loadingText}>Loading dispatch history...</Text>
//       </View>
//     );
//   }

//   if (dispatchData.length === 0) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text style={styles.noDataText}>No dispatch history found</Text>
//         <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
//           <Text style={styles.refreshButtonText}>Refresh</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView 
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         <Text style={styles.header}>Dispatch History</Text>
        
//         {dispatchData.map((dispatch, index) => (
//           <View key={index} style={styles.dispatchCard}>
//             {/* Driver Information */}
//             <View style={styles.driverSection}>
//               <Text style={styles.sectionTitle}>Driver Information</Text>
//               <View style={styles.driverInfo}>
//                 <View style={styles.infoRow}>
//                   <Text style={styles.label}>Name:</Text>
//                   <Text style={styles.value}>{dispatch.driverName}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <Text style={styles.label}>Contact:</Text>
//                   <Text style={styles.value}>{dispatch.driverContact}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <Text style={styles.label}>Vehicle:</Text>
//                   <Text style={styles.value}>{dispatch.vehicleNumber}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <Text style={styles.label}>Dispatch Date:</Text>
//                   <Text style={styles.value}>{formatDate(dispatch.dispatchDate)}</Text>
//                 </View>
//               </View>
//             </View>

//             {/* Farmers Information */}
//             <View style={styles.farmersSection}>
//               <Text style={styles.sectionTitle}>
//                 Farmers ({dispatch.farmers.length})
//               </Text>
              
//               {dispatch.farmers.map((farmer, farmerIndex) => (
//                 <View key={farmerIndex} style={styles.farmerCard}>
//                   <View style={styles.farmerHeader}>
//                     <Text style={styles.farmerIndex}>#{farmerIndex + 1}</Text>
//                     <Text style={styles.saralId}>{farmer.farmerSaralId}</Text>
//                   </View>
                  
//                   <View style={styles.farmerDetails}>
//                     <View style={styles.infoRow}>
//                       <Text style={styles.label}>System:</Text>
//                       <Text style={styles.value}>{farmer.systemName}</Text>
//                     </View>
                    
//                     <View style={styles.infoRow}>
//                       <Text style={styles.label}>Pump:</Text>
//                       <Text style={styles.value}>{farmer.pumpData?.name || 'N/A'}</Text>
//                     </View>
                    
//                     {farmer.billPhoto && (
//                       <View style={styles.photoSection}>
//                         <Text style={styles.photoLabel}>Bill Photo:</Text>
//                         <View style={styles.photoContainer}>
//                           <Image 
//                             source={{ uri: farmer.billPhoto }} 
//                             style={styles.billThumbnail}
//                             resizeMode="cover"
//                             onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
//                           />
//                           <View style={styles.photoButtons}>
//                             <TouchableOpacity 
//                               style={styles.viewButton}
//                               onPress={() => openImage(farmer.billPhoto)}
//                             >
//                               <Text style={styles.buttonText}>👁️ View</Text>
//                             </TouchableOpacity>
                            
//                             <TouchableOpacity 
//                               style={styles.downloadBtn}
//                               onPress={() => downloadImage(farmer.billPhoto)}
//                               disabled={downloading}
//                             >
//                               {downloading ? (
//                                 <ActivityIndicator size="small" color="#fff" />
//                               ) : (
//                                 <Text style={styles.buttonText}>📥 Download</Text>
//                               )}
//                             </TouchableOpacity>
//                           </View>
//                         </View>
//                       </View>
//                     )}
//                   </View>
//                 </View>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Image Viewer Modal */}
//       <Modal
//         visible={imageModalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={closeImageModal}
//       >
//         <View style={styles.modalContainer}>
//           <TouchableWithoutFeedback onPress={closeImageModal}>
//             <View style={styles.modalOverlay} />
//           </TouchableWithoutFeedback>
          
//           <View style={styles.modalContent}>
//             {selectedImage && (
//               <Image 
//                 source={{ uri: selectedImage }} 
//                 style={styles.fullSizeImage}
//                 resizeMode="contain"
//                 onError={(e) => {
//                   console.log('Full image loading error:', e.nativeEvent.error);
//                   Alert.alert('Error', 'Failed to load image');
//                   closeImageModal();
//                 }}
//               />
//             )}
            
//             <View style={styles.modalActions}>
//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.downloadModalBtn]}
//                 onPress={handleDownloadFromModal}
//                 disabled={downloading}
//               >
//                 {downloading ? (
//                   <ActivityIndicator size="small" color="#fff" />
//                 ) : (
//                   <Text style={styles.modalButtonText}>📥 Download Image</Text>
//                 )}
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.closeModalBtn]}
//                 onPress={closeImageModal}
//               >
//                 <Text style={styles.modalButtonText}>✕ Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollView: {
//     flex: 1,
//     padding: 15,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#333',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   noDataText: {
//     fontSize: 18,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   refreshButton: {
//     backgroundColor: '#007bff',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   refreshButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   dispatchCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   driverSection: {
//     marginBottom: 20,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   farmersSection: {
//     marginTop: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#333',
//   },
//   driverInfo: {
//     backgroundColor: '#f8f9fa',
//     padding: 12,
//     borderRadius: 8,
//   },
//   farmerCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#28a745',
//   },
//   farmerHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#dee2e6',
//   },
//   farmerIndex: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#007bff',
//     backgroundColor: '#e7f3ff',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   saralId: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#495057',
//     fontFamily: 'monospace',
//   },
//   farmerDetails: {
//     paddingLeft: 4,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#495057',
//     flex: 1,
//   },
//   value: {
//     fontSize: 14,
//     color: '#212529',
//     fontWeight: '500',
//     flex: 2,
//     textAlign: 'right',
//   },
//   photoSection: {
//     marginTop: 10,
//   },
//   photoLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#495057',
//     marginBottom: 8,
//   },
//   photoContainer: {
//     backgroundColor: '#e7f3ff',
//     borderRadius: 8,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#b8daff',
//   },
//   billThumbnail: {
//     width: '100%',
//     height: 180,
//     borderRadius: 6,
//     marginBottom: 12,
//   },
//   photoButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 10,
//   },
//   viewButton: {
//     backgroundColor: '#17a2b8',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 6,
//     flex: 1,
//     alignItems: 'center',
//   },
//   downloadBtn: {
//     backgroundColor: '#28a745',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 6,
//     flex: 1,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   // Modal Styles
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//   },
//   modalOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   modalContent: {
//     width: width - 40,
//     height: height - 120,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fullSizeImage: {
//     width: '100%',
//     height: '80%',
//     borderRadius: 8,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 20,
//     gap: 10,
//   },
//   modalButton: {
//     paddingVertical: 12,
//     borderRadius: 8,
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   downloadModalBtn: {
//     backgroundColor: '#28a745',
//   },
//   closeModalBtn: {
//     backgroundColor: '#dc3545',
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default NewInstallationTransactionData;



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import api from '../../auth/api';;
import { API_URL } from '@env';
import RNFetchBlob from 'rn-fetch-blob';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const NewInstallationTransactionData = () => {
  const [dispatchData, setDispatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fileLoading, setFileLoading] = useState(true);
  const [fileError, setFileError] = useState(false);
  const [fileType, setFileType] = useState(null);

  const fetchDispatchHistory = async () => {
    try {
      const response = await api.get(`${API_URL}/warehouse-admin/get-dispatch-history`);
      
      if (response.data.success) {
        setDispatchData(response.data.data || []);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.log('Error fetching dispatch history:', error.message);
      Alert.alert('Error', 'Failed to fetch dispatch history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDispatchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDispatchHistory();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check file type from URL
  const getFileType = (url) => {
    if (!url) return 'unknown';
    
    const extension = url.split('.').pop().split('?')[0].toLowerCase();
    
    if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
      return 'image';
    } else {
      return 'unknown';
    }
  };

  // Check and request storage permission for Android
  const checkAndRequestStoragePermission = async () => {
    if (Platform.OS === 'ios') return true;

    try {
      const androidVersion = Platform.Version;
      let permission;

      if (androidVersion >= 33) {
        permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      } else {
        permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      }

      const hasPermission = await PermissionsAndroid.check(permission);
      
      if (hasPermission) {
        return true;
      }

      const granted = await PermissionsAndroid.request(permission, {
        title: 'Storage Permission Required',
        message: 'This app needs access to your storage to download files',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      });

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  // Open file in viewer
  const openFile = (fileUrl) => {
    const type = getFileType(fileUrl);
    setSelectedFile(fileUrl);
    setFileType(type);
    setFileModalVisible(true);
    setFileLoading(true);
    setFileError(false);
  };

  const closeFileModal = () => {
    setFileModalVisible(false);
    setSelectedFile(null);
    setFileType(null);
    setFileLoading(false);
    setFileError(false);
  };

  // Download file function
  const downloadFile = async (fileUrl) => {
    try {
      setDownloading(true);

      const hasPermission = await checkAndRequestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Storage permission is required to download files.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
        return;
      }

      const fileType = getFileType(fileUrl);
      const fileExtension = fileUrl.split('.').pop().split('?')[0];
      
      let validExtension, mimeType, description;
      
      if (fileType === 'pdf') {
        validExtension = 'pdf';
        mimeType = 'application/pdf';
        description = 'PDF Document';
      } else {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        validExtension = imageExtensions.includes(fileExtension.toLowerCase()) 
          ? fileExtension 
          : 'jpg';
        mimeType = `image/${validExtension === 'jpg' ? 'jpeg' : validExtension}`;
        description = 'Bill Photo';
      }

      const timestamp = new Date().getTime();
      const filename = `bill_document_${timestamp}.${validExtension}`;

      let downloadPath;
      if (Platform.OS === 'ios') {
        downloadPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`;
      } else {
        downloadPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${filename}`;
      }

      console.log('Downloading to:', downloadPath);

      const configOptions = Platform.OS === 'ios' ? {
        fileCache: true,
        path: downloadPath,
      } : {
        fileCache: true,
        path: downloadPath,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: downloadPath,
          description: description,
          mime: mimeType,
          mediaScannable: fileType === 'image',
        },
      };

      const response = await RNFetchBlob.config(configOptions).fetch('GET', fileUrl);

      setDownloading(false);
      Alert.alert('Success', `File downloaded successfully!`);

    } catch (error) {
      setDownloading(false);
      console.log('Download error:', error);
      Alert.alert('Download Failed', 'Failed to download file. Please try again.');
    }
  };

  // Handle WebView load complete
  const onFileLoadComplete = () => {
    setFileLoading(false);
    console.log('File loaded successfully');
  };

  // Handle WebView error
  const onFileError = () => {
    setFileLoading(false);
    setFileError(true);
    console.log('File loading error');
  };

  // PDF Viewer Component
  const renderPdfViewer = (fileUrl) => {
    return (
      <WebView
        source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}` }}
        style={styles.webView}
        onLoadEnd={onFileLoadComplete}
        onError={onFileError}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Loading PDF Document...</Text>
          </View>
        )}
        allowsFullscreenVideo={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        mixedContentMode="always"
      />
    );
  };

  // Image Viewer Component
  const renderImageViewer = (fileUrl) => {
    const imageHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes">
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #000;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              touch-action: manipulation;
            }
            .image-container {
              max-width: 100%;
              max-height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <div class="image-container">
            <img src="${fileUrl}" alt="Bill Document" onerror="window.ReactNativeWebView.postMessage('IMAGE_ERROR')" />
          </div>
          <script>
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function (event) {
              const now = (new Date()).getTime();
              if (now - lastTouchEnd <= 300) {
                event.preventDefault();
              }
              lastTouchEnd = now;
            }, false);
          </script>
        </body>
      </html>
    `;

    return (
      <WebView
        source={{ html: imageHtml }}
        style={styles.webView}
        onLoadEnd={onFileLoadComplete}
        onError={onFileError}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'IMAGE_ERROR') {
            onFileError();
          }
        }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Loading Image...</Text>
          </View>
        )}
        scalesPageToFit={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        automaticallyAdjustContentInsets={false}
        scrollEnabled={true}
        bounces={true}
      />
    );
  };

  // Render file content based on type
  const renderFileContent = () => {
    if (fileType === 'pdf') {
      return renderPdfViewer(selectedFile);
    } else if (fileType === 'image') {
      return renderImageViewer(selectedFile);
    }
    return null;
  };

  // Render file thumbnail based on type
  const renderFileThumbnail = (fileUrl) => {
    const type = getFileType(fileUrl);
    
    if (type === 'pdf') {
      return (
        <View style={styles.pdfThumbnail}>
          <Text style={styles.pdfIcon}>📄</Text>
          <Text style={styles.pdfText}>PDF Document</Text>
          <Text style={styles.pdfSubText}>Tap to view with zoom</Text>
        </View>
      );
    } else {
      return (
        <Image 
          source={{ uri: fileUrl }} 
          style={styles.billThumbnail}
          resizeMode="cover"
          onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
      );
    }
  };

  // Get appropriate button text based on file type
  const getViewButtonText = (fileUrl) => {
    const type = getFileType(fileUrl);
    return type === 'pdf' ? '📄 View PDF' : '👁️ View Image';
  };

  // Get modal title based on file type
  const getModalTitle = () => {
    return fileType === 'pdf' ? 'PDF Viewer' : 'Image Viewer';
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading dispatch history...</Text>
      </View>
    );
  }

  if (dispatchData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noDataText}>No dispatch history found</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.header}>Dispatch History</Text>
        
        {dispatchData.map((dispatch, index) => (
          <View key={index} style={styles.dispatchCard}>
            {/* Driver Information */}
            <View style={styles.driverSection}>
              <Text style={styles.sectionTitle}>Driver Information</Text>
              <View style={styles.driverInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{dispatch.driverName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Contact:</Text>
                  <Text style={styles.value}>{dispatch.driverContact}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Vehicle:</Text>
                  <Text style={styles.value}>{dispatch.vehicleNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Dispatch Date:</Text>
                  <Text style={styles.value}>{formatDate(dispatch.dispatchDate)}</Text>
                </View>
              </View>
            </View>

            {/* Farmers Information */}
            <View style={styles.farmersSection}>
              <Text style={styles.sectionTitle}>
                Farmers ({dispatch.farmers.length})
              </Text>
              
              {dispatch.farmers.map((farmer, farmerIndex) => (
                <View key={farmerIndex} style={styles.farmerCard}>
                  <View style={styles.farmerHeader}>
                    <Text style={styles.farmerIndex}>#{farmerIndex + 1}</Text>
                    <Text style={styles.saralId}>{farmer.farmerSaralId}</Text>
                  </View>
                  
                  <View style={styles.farmerDetails}>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>System:</Text>
                      <Text style={styles.value}>{farmer.systemName}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Pump:</Text>
                      <Text style={styles.value}>{farmer.pumpData?.name || 'N/A'}</Text>
                    </View>
                    
                    {farmer.billPhoto && (
                      <View style={styles.photoSection}>
                        <Text style={styles.photoLabel}>
                          Bill Document ({getFileType(farmer.billPhoto).toUpperCase()}):
                        </Text>
                        <View style={styles.photoContainer}>
                          {renderFileThumbnail(farmer.billPhoto)}
                          <View style={styles.photoButtons}>
                            <TouchableOpacity 
                              style={styles.viewButton}
                              onPress={() => openFile(farmer.billPhoto)}
                            >
                              <Text style={styles.buttonText}>
                                {getViewButtonText(farmer.billPhoto)}
                              </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                              style={styles.downloadBtn}
                              onPress={() => downloadFile(farmer.billPhoto)}
                              disabled={downloading}
                            >
                              {downloading ? (
                                <ActivityIndicator size="small" color="#fff" />
                              ) : (
                                <Text style={styles.buttonText}>📥 Download</Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Universal File Viewer Modal */}
      <Modal
        visible={fileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeFileModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.fileModalContent}>
            <View style={styles.fileModalHeader}>
              <Text style={styles.fileModalTitle}>{getModalTitle()}</Text>
              <TouchableOpacity onPress={closeFileModal} style={styles.closeFileButton}>
                <Text style={styles.closeFileButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.fileContainer}>
              {fileLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007bff" />
                  <Text style={styles.loadingText}>
                    {fileType === 'pdf' ? 'Loading PDF Document...' : 'Loading Image...'}
                  </Text>
                </View>
              )}
              
              {fileError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorIcon}>❌</Text>
                  <Text style={styles.errorText}>Failed to load {fileType}</Text>
                  <Text style={styles.errorSubText}>
                    The {fileType} couldn't be loaded. You can:
                  </Text>
                  <View style={styles.errorButtons}>
                    <TouchableOpacity 
                      style={[styles.errorButton, styles.downloadButton]}
                      onPress={() => downloadFile(selectedFile)}
                    >
                      <Text style={styles.errorButtonText}>Download {fileType?.toUpperCase()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.errorButton, styles.openButton]}
                      onPress={() => Linking.openURL(selectedFile)}
                    >
                      <Text style={styles.errorButtonText}>Open in Browser</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              {selectedFile && !fileError && renderFileContent()}
            </View>
            
            <View style={styles.fileModalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.downloadModalBtn]}
                onPress={() => downloadFile(selectedFile)}
                disabled={downloading}
              >
                {downloading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>
                    📥 Download {fileType?.toUpperCase()}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dispatchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  driverSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  farmersSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  driverInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  farmerCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  farmerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  farmerIndex: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saralId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    fontFamily: 'monospace',
  },
  farmerDetails: {
    paddingLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  photoSection: {
    marginTop: 10,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  photoContainer: {
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#b8daff',
  },
  billThumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    marginBottom: 12,
  },
  pdfThumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#ffebee',
    borderWidth: 2,
    borderColor: '#f44336',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  pdfIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  pdfText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
  },
  pdfSubText: {
    fontSize: 12,
    color: '#f44336',
    textAlign: 'center',
    marginTop: 4,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  viewButton: {
    backgroundColor: '#17a2b8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  downloadBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  fileModalContent: {
    width: width - 20,
    height: height - 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  fileModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  fileModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeFileButton: {
    padding: 5,
  },
  closeFileButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  fileContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10,
    padding: 20,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  errorButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#007bff',
  },
  openButton: {
    backgroundColor: '#28a745',
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fileModalActions: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadModalBtn: {
    backgroundColor: '#28a745',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NewInstallationTransactionData;