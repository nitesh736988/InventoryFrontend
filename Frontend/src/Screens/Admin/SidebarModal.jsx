// import React, {useState, useRef, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Modal,
//   TouchableOpacity,
//   Animated,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const SidebarModal = () => {
//   const [visible, setVisible] = useState(false);
//   const slideAnim = useRef(new Animated.Value(-300)).current;
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

//   const openAddwarehouse = () => {
//     closeModal();
//     navigation.navigate('AddWarehouse');
//   };

//   const openWarehouseRegistration = () => {
//     closeModal();
//     navigation.navigate('WarehouseRegistration');
//   };

//   const openHistory = () => {
//     closeModal();
//     navigation.navigate('History');
//   };

//   const openOrderTracker = () => {
//     closeModal();
//     navigation.navigate('OrderTracker');
//   };

//   const openwarehousepersons = () => {
//     closeModal();
//     navigation.navigate('Warehousepersons');
//   };

//   const openservicepersons = () => {
//     closeModal();
//     navigation.navigate('Servicepersons');
//   };

//   const openRepairReject = () => {
//     closeModal();
//     navigation.navigate('RepairReject');
//   };

//   const openW2WApproveData = () => {
//     closeModal();
//     navigation.navigate('W2WApproveData');
//   };

//   const openW2WApproved = () => {
//     closeModal();
//     navigation.navigate('W2WApproved');
//   };

//   const openInstallationHistory = () => {
//     closeModal();
//     navigation.navigate('InstallationHistory');
//   };

//   const openServicePersonData = () => {
//     closeModal();
//     navigation.navigate('ServicePersonData');
//   };

//   const openAddItem = () => {
//     closeModal();
//     navigation.navigate('AddItem');
//   };

//   const openSurvayRegistration = () => {
//     closeModal();
//     navigation.navigate('SurvayRegistration');
//   };

//   const openAddSystem = () => {
//     closeModal();
//     navigation.navigate('AddSystem');
//   };

//   const openAddSystemData = () => {
//     closeModal();
//     navigation.navigate('AddSystemData');
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

//       <Modal
//         transparent
//         visible={visible}
//         animationType="none"
//         onRequestClose={closeModal}>
//         <TouchableOpacity
//           style={styles.overlay}
//           onPress={closeModal}
//           activeOpacity={1}
//         />

//         <Animated.View
//           style={[styles.sidebar, {transform: [{translateX: slideAnim}]}]}>
//           <Text style={styles.sidebarText}>Galo Inventory System</Text>

//           <TouchableOpacity
//             onPress={openAddwarehouse}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>Add Warehouse</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openWarehouseRegistration}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>Warehouse Registration</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openAddItem}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>Add Item</Text>
//           </TouchableOpacity>


//           <TouchableOpacity onPress={openHistory} style={styles.optionButton}>
//             <Text style={styles.optionText}>History</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openOrderTracker}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>Order Tracker</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openwarehousepersons}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>Warehouse Persons</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openservicepersons}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>Service Persons</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openRepairReject}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>Repair & Reject</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openServicePersonData}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>ServicePerson Data</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openW2WApproveData}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>W2W Approve Data</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openInstallationHistory}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>Installation History</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openSurvayRegistration}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>Survay Registration</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openAddSystem}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>AddSystem</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={openAddSystemData}
//             style={styles.optionButton}>
//             <Text style={styles.optionText}>AddSystem Data</Text>
//           </TouchableOpacity>


//         </Animated.View>
//       </Modal>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fbd33b'
//   },
//   menuIcon: {
//     position: 'absolute',
//     top: 20, 
//     left: 15,
//     zIndex: 10,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   sidebar: {
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: 300,
//     backgroundColor: '#FFF',
//     padding: 20,
//     justifyContent: 'flex-start',
//     elevation: 5,
//     backgroundColor: '#fbd33b',
//   },
//   sidebarText: {
//     fontSize: 20,
//     marginBottom: 25,
//     color: 'black',
//   },
//   optionButton: {
//     padding: 10,
//     marginBottom: 15,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//     color: 'black',
//   },
//   closeButton: {
//     padding: 10,
//     backgroundColor: '#FF5733',
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 20,
//   },
// });

// export default SidebarModal;


// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Modal,
//   TouchableOpacity,
//   Animated,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const SidebarModal = () => {
//   const [visible, setVisible] = useState(false);
//   const slideAnim = useRef(new Animated.Value(-300)).current;
//   const navigation = useNavigation();
//   const [openSection, setOpenSection] = useState(null); // Track the open section

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
//       setOpenSection(null); // Reset open sections when closing
//     });
//   };

//   const toggleSection = (section) => {
//     setOpenSection(openSection === section ? null : section); // Close if open, otherwise open new section
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

//           {/* Warehouse Section */}
//           <TouchableOpacity onPress={() => toggleSection('warehouse')} style={styles.optionButton}>
//             <Text style={styles.optionText}>Warehouse ⬇</Text>
//           </TouchableOpacity>
//           {openSection === 'warehouse' && (
//             <View style={styles.subMenu}>
//               <TouchableOpacity onPress={() => navigation.navigate('AddWarehouse')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Add Warehouse</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigation.navigate('WarehouseRegistration')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Warehouse Registration</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigation.navigate('Warehousepersons')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Warehouse Persons</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigation.navigate('W2WApproveData')} style={styles.subOption}>
//                 <Text style={styles.optionText}>W2W Approve Data</Text>
//               </TouchableOpacity>
//             </View>
//           )}


//           <TouchableOpacity onPress={() => toggleSection('system')} style={styles.optionButton}>
//             <Text style={styles.optionText}>System ⬇</Text>
//           </TouchableOpacity>
//           {openSection === 'system' && (
//             <View style={styles.subMenu}>
//               <TouchableOpacity onPress={() => navigation.navigate('AddSystem')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Add System</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigation.navigate('AddSystemData')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Add System Data</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => navigation.navigate('AddSystemSubItem')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Add System SubItem</Text>
//               </TouchableOpacity>
              
//             </View>
//           )}

      
//           <TouchableOpacity onPress={() => toggleSection('history')} style={styles.optionButton}>
//             <Text style={styles.optionText}>History ⬇</Text>
//           </TouchableOpacity>
//           {openSection === 'history' && (
//             <View style={styles.subMenu}>
//               <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Incoming History</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigation.navigate('UpperOrderHistory')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Upper Order History</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigation.navigate('RepairReject')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Repair & Reject History</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigation.navigate('ServicePersonData')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Service Person Data</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigation.navigate('InstallationHistory')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Installation History</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => navigation.navigate('Servicepersons')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Service Person</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Form Fill Section */}
//           <TouchableOpacity onPress={() => toggleSection('formFill')} style={styles.optionButton}>
//             <Text style={styles.optionText}>Form Fill ⬇</Text>
//           </TouchableOpacity>
//           {openSection === 'formFill' && (
//             <View style={styles.subMenu}>
//               <TouchableOpacity onPress={() => navigation.navigate('AddItem')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Add Item</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigation.navigate('SurvayRegistration')} style={styles.subOption}>
//                 <Text style={styles.optionText}>Survey Registration</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </Animated.View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fbd33b',
//   },
//   menuIcon: {
//     position: 'absolute',
//     top: 20,
//     left: 15,
//     zIndex: 10,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   sidebar: {
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: 300,
//     backgroundColor: '#FFF',
//     padding: 20,
//     elevation: 5,
//     backgroundColor: '#fbd33b',
//   },
//   sidebarText: {
//     fontSize: 20,
//     marginBottom: 25,
//     color: 'black',
//   },
//   optionButton: {
//     padding: 10,
//     marginBottom: 10,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//   },
//   optionText: {
//     fontSize: 16,
//     color: 'black',
//   },
//   subMenu: {
//     marginLeft: 15,
//     marginBottom: 10,
//   },
//   subOption: {
//     padding: 8,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 5,
//     marginBottom: 5,
//   },
// });

// export default SidebarModal;



import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SidebarModal = () => {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const navigation = useNavigation();
  const [openSection, setOpenSection] = useState(null); // Track the open section

  // Reset modal state when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Reset state whenever the component is focused
      setVisible(false);
      setOpenSection(null);
    }, [])
  );

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
      setOpenSection(null); // Reset open sections when closing
    });
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section); // Close if open, otherwise open new section
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

      <Modal transparent visible={visible} animationType="none" onRequestClose={closeModal}>
        <TouchableOpacity style={styles.overlay} onPress={closeModal} activeOpacity={1} />

        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <Text style={styles.sidebarText}>Galo Inventory System</Text>

          {/* Warehouse Section */}
          <TouchableOpacity onPress={() => toggleSection('warehouse')} style={styles.optionButton}>
            <Text style={styles.optionText}>Warehouse ⬇</Text>
          </TouchableOpacity>
          {openSection === 'warehouse' && (
            <View style={styles.subMenu}>
              <TouchableOpacity onPress={() => navigation.navigate('AddWarehouse')} style={styles.subOption}>
                <Text style={styles.optionText}>Add Warehouse</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('WarehouseRegistration')} style={styles.subOption}>
                <Text style={styles.optionText}>Warehouse Registration</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Warehousepersons')} style={styles.subOption}>
                <Text style={styles.optionText}>Warehouse Persons</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('W2WApproveData')} style={styles.subOption}>
                <Text style={styles.optionText}>W2W Approve Data</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* System Section */}
          <TouchableOpacity onPress={() => toggleSection('system')} style={styles.optionButton}>
            <Text style={styles.optionText}>System ⬇</Text>
          </TouchableOpacity>
          {openSection === 'system' && (
            <View style={styles.subMenu}>
              <TouchableOpacity onPress={() => navigation.navigate('AddSystem')} style={styles.subOption}>
                <Text style={styles.optionText}>Add System</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('AddSystemData')} style={styles.subOption}>
                <Text style={styles.optionText}>Add System Data</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('AddSystemSubItem')} style={styles.subOption}>
                <Text style={styles.optionText}>Add System SubItem</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* History Section */}
          <TouchableOpacity onPress={() => toggleSection('history')} style={styles.optionButton}>
            <Text style={styles.optionText}>History ⬇</Text>
          </TouchableOpacity>
          {openSection === 'history' && (
            <View style={styles.subMenu}>
              <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.subOption}>
                <Text style={styles.optionText}>Incoming History</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('UpperOrderHistory')} style={styles.subOption}>
                <Text style={styles.optionText}>Upper Order History</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('RepairReject')} style={styles.subOption}>
                <Text style={styles.optionText}>Repair & Reject History</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ServicePersonData')} style={styles.subOption}>
                <Text style={styles.optionText}>Service Person Data</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('InstallationHistory')} style={styles.subOption}>
                <Text style={styles.optionText}>Installation History</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Servicepersons')} style={styles.subOption}>
                <Text style={styles.optionText}>Service Person</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Form Fill Section */}
          <TouchableOpacity onPress={() => toggleSection('formFill')} style={styles.optionButton}>
            <Text style={styles.optionText}>Form Fill ⬇</Text>
          </TouchableOpacity>
          {openSection === 'formFill' && (
            <View style={styles.subMenu}>
              <TouchableOpacity onPress={() => navigation.navigate('AddItem')} style={styles.subOption}>
                <Text style={styles.optionText}>Add Item</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('SurvayRegistration')} style={styles.subOption}>
                <Text style={styles.optionText}>Survey Registration</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#FFF',
    padding: 20,
    elevation: 5,
    backgroundColor: '#fbd33b',
  },
  sidebarText: {
    fontSize: 20,
    marginBottom: 25,
    color: 'black',
  },
  optionButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
  subMenu: {
    marginLeft: 15,
    marginBottom: 10,
  },
  subOption: {
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default SidebarModal;