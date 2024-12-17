// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const Sidebar = ({ userType }) => {
//   const [visible, setVisible] = useState(false);
//   const slideAnim = useRef(new Animated.Value(-300)).current;
//   console.log(userType)
//   const navigation = useNavigation();

//   const openModal = () => {
//     setVisible(true);
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeModal = () => {
//     Animated.timing(slideAnim, {
//       toValue: -300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setVisible(false);
//     });
//   };

  
//   const openServicePersonRegistration = () => {
//     closeModal();
//     navigation.navigate("ServicePersonRegistration");
//   };

//   const openApprovalData = () => {
//     closeModal();
//     navigation.navigate("ApprovalData");
//   };


//   const openWarehouseDashboard = () => {
//     closeModal();
//     navigation.navigate("WarehouseDashboard");
//   };

//   const openAddTransaction = () => {
//     closeModal();
//     navigation.navigate("AddTransaction");
//   };

//   const openAddItem = () => {
//     closeModal();
//     navigation.navigate("AddItem");
//   };

//   const openRepairRejectData = () => {
//     closeModal();
//     navigation.navigate("RepairRejectData");
//   };

//   const openApprovalHistoryData = () => {
//     closeModal();
//     navigation.navigate("ApprovalHistoryData");
//   };

//   const openUpperHistory = () => {
//     closeModal();
//     navigation.navigate("UpperHistory");
//   };

//   const openW2W = () => {
//     closeModal();
//     navigation.navigate("W2W");
//   };

//   const openW2WApproveHistory = () => {
//     closeModal();
//     navigation.navigate("W2WApproveHistory");
//   };

//   const openW2Wapproval = () => {
//     closeModal();
//     navigation.navigate("W2Wapproval");
//   };

//   const openW2WData = () => {
//     closeModal();
//     navigation.navigate("W2WData");
//   };


//   useEffect(() => {
//     if (!visible) {
//       slideAnim.setValue(-300);
//     }
//   }, [visible]);

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={openModal} style={styles.menuIcon}>
//         <Icon name="bars" size={28} color="#000" />
//       </TouchableOpacity>

//       <Modal transparent visible={visible} animationType="none" onRequestClose={closeModal}>
//         <TouchableOpacity style={styles.overlay} onPress={closeModal} activeOpacity={1} />

//         <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
//           <Text style={styles.sidebarText}>Galo Inventory System</Text>

//             <>
//             <TouchableOpacity onPress={openWarehouseDashboard} style={styles.optionButton}>
//                 <Text style={styles.optionText}>Warehouse Dashboard</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={openServicePersonRegistration} style={styles.optionButton}>
//                 <Text style={styles.optionText}>Service Person Registration</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={openApprovalData} style={styles.optionButton}>
//                 <Text style={styles.optionText}>Approval Data</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={openAddItem} style={styles.optionButton}>
//                 <Text style={styles.optionText}>Add Item</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={openAddTransaction} style={styles.optionButton}>
//                 <Text style={styles.optionText}>Add Outgoing</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={openRepairRejectData} style={styles.optionButton}>
//                 <Text style={styles.optionText}>Repair Reject</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={openApprovalHistoryData} style={styles.optionButton}>
//                 <Text style={styles.optionText}>Approval History Data</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={openUpperHistory} style={styles.optionButton}>
//                 <Text style={styles.optionText}>Upper History Data</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={openW2W} style={styles.optionButton}>
//                 <Text style={styles.optionText}>Warehouse To Warehouse</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={openW2WApproveHistory} style={styles.optionButton}>
//                 <Text style={styles.optionText}>W2W History</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={openW2Wapproval} style={styles.optionButton}>
//                 <Text style={styles.optionText}>W2W Approval</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={openW2WData} style={styles.optionButton}>
//                 <Text style={styles.optionText}>W2W Data</Text>
//               </TouchableOpacity>
            
//             </>
    
//         </Animated.View>
//       </Modal>
//     </View>
//   );
// }; 

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fbd33b'
//   },
//   menuIcon: {
//     position: 'absolute',
//     top: 20, 
//     left: 15,
//     zIndex: 10,
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   sidebar: {
//     width: 300,
//     backgroundColor: '#fbd33b',
//     padding: 20,
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   sidebarText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   optionButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });


// export default Sidebar;


import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Sidebar = ({userType}) => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const navigation = useNavigation();

  const openModal = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  const navigateAndHighlight = screenName => {
    setActiveSection(screenName);
    closeModal();
    navigation.navigate(screenName);
  };

  useEffect(() => {
    if (!visible) {
      slideAnim.setValue(-300);
    }
  }, [visible]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.menuIcon}>
        <Icon name="bars" size={28} color="#000" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={closeModal}>
        <TouchableOpacity
          style={styles.overlay}
          onPress={closeModal}
          activeOpacity={1}
        />

        <Animated.View
          style={[styles.sidebar, {transform: [{translateX: slideAnim}]}]}>
          <Text style={styles.sidebarText}>Galo Inventory System</Text>

          <>
            <TouchableOpacity
              onPress={() => navigateAndHighlight('WarehouseDashboard')}
              style={[
                styles.optionButton,
                activeSection === 'WarehouseDashboard' &&
                  styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'WarehouseDashboard' &&
                    styles.activeOptionText,
                ]}>
                Warehouse Dashboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateAndHighlight('ServicePersonRegistration')}
              style={[
                styles.optionButton,
                activeSection === 'ServicePersonRegistration' &&
                  styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'ServicePersonRegistration' &&
                    styles.activeOptionText,
                ]}>
                Service Person Registration
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateAndHighlight('ApprovalData')}
              style={[
                styles.optionButton,
                activeSection === 'ApprovalData' && styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'ApprovalData' && styles.activeOptionText,
                ]}>
                Approval Data
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateAndHighlight('AddItem')}
              style={[
                styles.optionButton,
                activeSection === 'AddItem' &&
                  styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'AddItem' &&
                    styles.activeOptionText,
                ]}>
                Add Item
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => navigateAndHighlight('AddTransaction')}
              style={[
                styles.optionButton,
                activeSection === 'AddTransaction' &&
                  styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'AddTransaction' &&
                    styles.activeOptionText,
                ]}>
                AddTransaction
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateAndHighlight('RepairRejectData')}
              style={[
                styles.optionButton,
                activeSection === 'RepairRejectData' &&
                  styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'RepairRejectData' &&
                    styles.activeOptionText,
                ]}>
                Repair-Reject Data
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateAndHighlight('ApprovalHistoryData')}
              style={[
                styles.optionButton,
                activeSection === 'ApprovalHistoryData' &&
                  styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'ApprovalHistoryData' &&
                    styles.activeOptionText,
                ]}>
                Approved Data
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateAndHighlight('UpperHistory')}
              style={[
                styles.optionButton,
                activeSection === 'UpperHistory' &&
                  styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'UpperHistory' &&
                    styles.activeOptionText,
                ]}>
                Upper History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateAndHighlight('W2W')}
              style={[
                styles.optionButton,
                activeSection === 'W2W' &&
                  styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'W2W' &&
                    styles.activeOptionText,
                ]}>
                W2W
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateAndHighlight('W2WApproveHistory')}
              style={[
                styles.optionButton,
                activeSection === 'W2WApproveHistory' &&
                  styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'W2WApproveHistory' &&
                    styles.activeOptionText,
                ]}>
                W2WApproved History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateAndHighlight('W2Wapproval')}
              style={[
                styles.optionButton,
                activeSection === 'W2Wapproval' &&
                  styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'W2Wapproval' &&
                    styles.activeOptionText,
                ]}>
                W2W Approval
              </Text>
            </TouchableOpacity>

        
            <TouchableOpacity
              onPress={() => navigateAndHighlight('W2WData')}
              style={[
                styles.optionButton,
                activeSection === 'W2WData' &&
                  styles.activeOptionButton,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  activeSection === 'W2WData' &&
                    styles.activeOptionText,
                ]}>
                W2W Data
              </Text>
            </TouchableOpacity>
          </>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbd33b',
  },
  menuIcon: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  sidebarText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center'
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  activeOptionButton: {
    backgroundColor: '#ffd700',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  activeOptionText: {
    color: '#000',
    fontWeight: 'bold',              
  },
});

export default Sidebar;                            