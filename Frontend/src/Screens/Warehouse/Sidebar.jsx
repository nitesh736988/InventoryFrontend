import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Sidebar = ({ userType }) => {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  console.log(userType)
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

  
  const openServicePersonRegistration = () => {
    closeModal();
    navigation.navigate("ServicePersonRegistration");
  };

  const openApprovalData = () => {
    closeModal();
    navigation.navigate("ApprovalData");
  };


  const openWarehouseDashboard = () => {
    closeModal();
    navigation.navigate("WarehouseDashboard");
  };

  const openAddTransaction = () => {
    closeModal();
    navigation.navigate("AddTransaction");
  };

  const openAddItem = () => {
    closeModal();
    navigation.navigate("AddItem");
  };

  const openRepairRejectData = () => {
    closeModal();
    navigation.navigate("RepairRejectData");
  };

  const openApprovalHistoryData = () => {
    closeModal();
    navigation.navigate("ApprovalHistoryData");
  };

  const openUpperHistory = () => {
    closeModal();
    navigation.navigate("UpperHistory");
  };

  const openW2W = () => {
    closeModal();
    navigation.navigate("W2W");
  };

  const openW2WApproveHistory = () => {
    closeModal();
    navigation.navigate("W2WApproveHistory");
  };

  const openW2Wapproval = () => {
    closeModal();
    navigation.navigate("W2Wapproval");
  };

  const openW2WData = () => {
    closeModal();
    navigation.navigate("W2WData");
  };


  useEffect(() => {
    if (!visible) {
      slideAnim.setValue(-300);
    }
  }, [visible]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.openButton}>
      <View style={styles.buttonContent}>
        <Icon name="bars" size={30} color="#fff" style={styles.icon} />

      </View>
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="none" onRequestClose={closeModal}>
        <TouchableOpacity style={styles.overlay} onPress={closeModal} activeOpacity={1} />

        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <Text style={styles.sidebarText}>Galo Inventory System</Text>

            <>
            <TouchableOpacity onPress={openWarehouseDashboard} style={styles.optionButton}>
                <Text style={styles.optionText}>Warehouse Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={openServicePersonRegistration} style={styles.optionButton}>
                <Text style={styles.optionText}>Service Person Registration</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openApprovalData} style={styles.optionButton}>
                <Text style={styles.optionText}>Approval Data</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={openAddItem} style={styles.optionButton}>
                <Text style={styles.optionText}>Add Item</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={openAddTransaction} style={styles.optionButton}>
                <Text style={styles.optionText}>Add Outgoing</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={openRepairRejectData} style={styles.optionButton}>
                <Text style={styles.optionText}>Repair Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={openApprovalHistoryData} style={styles.optionButton}>
                <Text style={styles.optionText}>Approval History Data</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={openUpperHistory} style={styles.optionButton}>
                <Text style={styles.optionText}>Upper History Data</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={openW2W} style={styles.optionButton}>
                <Text style={styles.optionText}>Warehouse To Warehouse</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={openW2WApproveHistory} style={styles.optionButton}>
                <Text style={styles.optionText}>W2W History</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={openW2Wapproval} style={styles.optionButton}>
                <Text style={styles.optionText}>W2W Approval</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={openW2WData} style={styles.optionButton}>
                <Text style={styles.optionText}>W2W Data</Text>
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
    backgroundColor: '#fbd33b'
  },
  openButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 300,
    backgroundColor: '#fbd33b',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});


export default Sidebar;